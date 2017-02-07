// dome.js
// author: Toh Jian Feng

/*-------------------------------*/
/* Fisheye Video Feed Attributes */
/*-------------------------------*/

var fisheyeCanvas = null;
var fisheyeCtx = null;
var fisheyePixels = null;

// Original fisheye image dimensions according to USB webcam.
var fisheyeVidWidth, fisheyeVidHeight = null;
var fisheyeVidXOrigin = null;
var panoVidWidth, panoVidHeight = null;
var scene, camera, renderer = null;
var controls = null;
var sphereGeometry, sphereMaterial, sphere;

var objManager, fileLoader;

/*------------*/
/* Video Feed */
/*------------*/

var videoFeed = null;

/*---------------------*/
/* Pre-Computed States */
/*---------------------*/

var MAX_1D_ARRAY_SIZE = null;
var fisheyeSrcArr = null;
var panoPixelArr = null;
var dataTextureArr = null;

/*---------------*/
/* Data Textures */
/*---------------*/

var dataTexture = null;

/*----------------------*/
/* Capturing Video Feed */
/*----------------------*/

function readFisheyeImg () {
    fisheyeCtx.drawImage( videoFeed,
                          fisheyeVidXOrigin, 0,
                          fisheyeVidHeight, fisheyeVidHeight,
                          0, 0,
                          fisheyeVidHeight, fisheyeVidHeight );

    fisheyePixels = fisheyeCtx.getImageData(0, 0, fisheyeVidHeight, fisheyeVidHeight ).data;
}

function displayFeed () {
    sphereGeometry = new THREE.SphereGeometry( window.innerHeight, 64, 64 );
    dataTextureArr = new Uint8Array( panoPixelArr );

    dataTexture = new THREE.DataTexture( dataTextureArr, panoVidWidth, panoVidHeight * 2, THREE.RGBAFormat );

    dataTexture.minFilter = THREE.LinearFilter;
    dataTexture.magFilter = THREE.NearestFilter;
    dataTexture.generateMipmaps = false;
    dataTexture.flipY = true;
    dataTexture.flipX = true;

    sphereMaterial = new THREE.MeshBasicMaterial( {
        map: dataTexture,
        side: THREE.BackSide
    } );

    sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );

    scene.add( sphere );
}

function buildScene () {
    scene.add( camera );

    displayFeed();
    animate();
}

/*-------------------*/
/* Fisheye Dewarping */
/*-------------------*/

function dewarp () {
    var x, srcArrPos, destArrPos;

    // var perf_start = performance.now();
    for (var i = 0; i < panoVidHeight; i++) {

        for (var j = 0; j < panoVidWidth; j++) {

            x = i * panoVidWidth + j;

            srcArrPos = fisheyeSrcArr[ x ];

            destArrPos = 4 * Math.abs( ( panoVidHeight - 1 - i ) * panoVidWidth - j );

            panoPixelArr[ destArrPos ] = fisheyePixels[ srcArrPos ];
            panoPixelArr[ destArrPos + 1 ] = fisheyePixels[ srcArrPos + 1 ];
            panoPixelArr[ destArrPos + 2 ] = fisheyePixels[ srcArrPos + 2 ];
            panoPixelArr[ destArrPos + 3 ] = fisheyePixels[ srcArrPos + 3 ];
        }
    }

    dataTextureArr.set( panoPixelArr );
    dataTexture.needsUpdate = true;
    // var perf_end = performance.now();
    // console.log('dewarp: ' + (perf_end - perf_start) + 'ms');
}

/**
 * Fills the pre-compute state arrays with fixed values
 * used for the dewarp algorithm.
 */
function precomputeSrcCoords () {
    var radius, theta;
    var paraTrueX, paraTrueY;
    var x, y;
    var srcArrPos;

    // var perf_start = performance.now();
    for ( var i = 0; i < panoVidHeight; i++ ) {

        radius = ( panoVidHeight - i );

        for ( var j = 0; j < panoVidWidth; j++ ) {

            theta = 2 * Math.PI * -j / ( 4 * panoVidHeight );

            // find true (x, y) coordinates based on parametric
            // equation of circle.
            paraTrueX = radius * Math.cos( theta );
            paraTrueY = radius * Math.sin( theta );

            // scale true coordinates to integer-based coordinates
            // (1 pixel is of size 1 * 1)
            x = Math.round( paraTrueX ) + panoVidHeight;
            y = panoVidHeight - Math.round( paraTrueY );

            srcArrPos = 4 * ( x * fisheyeVidHeight + y );

            // Checks if the offset is greater than MAX_1D_ARRAY_VALUE.
            // This prevents the array from dynamically increasing in size to accomodate the value,
            // resulting in an increase in array lookup time.
            if ( srcArrPos > MAX_1D_ARRAY_SIZE ) {
                srcArrPos = MAX_1D_ARRAY_SIZE - 8;
            }

            fisheyeSrcArr[ i * panoVidWidth + j ] = srcArrPos;
        }
    }
    // var perf_end = performance.now();

    // console.log('precompute(): ' + (perf_end - perf_start) + 'ms');
}


/*----------------*/
/* Initialization */
/*----------------*/

function initEnv ( vidWidth, vidHeight ) {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, vidWidth / vidHeight,
        0.1, 1000 );
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( vidWidth, vidHeight );
    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
}

function initOffScrnCanvas () {
    fisheyeCanvas = document.createElement( 'canvas' );
    fisheyeCanvas.width = fisheyeVidHeight;
    fisheyeCanvas.height = fisheyeVidHeight;

    fisheyeCtx = fisheyeCanvas.getContext( '2d' );
}

function recordFisheyeDimensions ( videoFeed ) {
    fisheyeVidWidth = videoFeed.videoWidth;
    fisheyeVidHeight = videoFeed.videoHeight;
    fisheyeVidXOrigin = ( fisheyeVidWidth - fisheyeVidHeight ) / 2;
    MAX_1D_ARRAY_SIZE = 4 * fisheyeVidHeight * fisheyeVidHeight;
    fisheyeSrcArr = new Array( fisheyeVidHeight * fisheyeVidHeight );
}

function setPanoDimensions () {
    panoVidWidth = fisheyeVidHeight * 2;
    panoVidHeight = fisheyeVidHeight / 2;
}

function initPanoPixelArr () {
    var arrPos;

    panoPixelArr = new Uint8ClampedArray( 4 * panoVidWidth * panoVidHeight * 2 );

    for ( var i = 0; i < fisheyeVidHeight; i++ ) {
        for ( var j = 0; j < panoVidWidth; j++ ) {
            arrPos = 4 * ( i * panoVidWidth + j );
            panoPixelArr[ arrPos ] = 0;
            panoPixelArr[ arrPos + 1 ] = 0;
            panoPixelArr[ arrPos + 2 ] = 0;
            panoPixelArr[ arrPos + 3] = 0;
        }
    }
}

function initControls () {
    controls = new THREE.OrbitControls( camera );
    controls.enableKeys = true;
    controls.disablePan = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;
}

/*--------------*/
/* File Loading */
/*--------------*/

function loadFile() {
    fileLoader = new Worker( 'js/workers/fileloader.js' );
    fileLoader.postMessage( '../../config/testconfig.json' );

    fileLoader.onmessage = function ( e ) {
        var jsonObj = e.data;

        objManager = new ObjectManager();
        objManager.init( scene, jsonObj );
        objManager.loadObjects();
    };
}



/*-----------*/
/* Rendering */
/*-----------*/

function render () {
    readFisheyeImg();
    dewarp();

    renderer.render( scene, camera );
}

function animate () {
    requestAnimationFrame( animate );
    controls.update();
    render();
}

function onWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

//-------------//
// Main Script //
//-------------//

// grab video feed
videoFeed = document.querySelector( 'video' );

// only obtain video feed dimensions after feed has fully loaded.
videoFeed.addEventListener( 'loadedmetadata', function () {
    recordFisheyeDimensions( videoFeed );
    setPanoDimensions();
    initPanoPixelArr();
    precomputeSrcCoords();
    initEnv( window.innerWidth, window.innerHeight );
    initOffScrnCanvas();
    loadFile();
    initControls();
    buildScene();

}, false );