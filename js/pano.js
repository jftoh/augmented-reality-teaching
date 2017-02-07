// pano.js
// author: Toh Jian Feng

var precomputeWorker;

/*----------------------*/
/* Buffers and Canvases */
/*----------------------*/

var fisheyeCanvas, fisheyeCtx, fisheyePixels;

// Original fisheye image dimensions according to USB webcam.
var fisheyeVidWidth, fisheyeVidHeight;
var fisheyeVidXOrigin;
var panoVidWidth, panoVidHeight;

// three.js scene components
var scene, camera, renderer;

// three

/*------------*/
/* Video Feed */
/*------------*/

var videoFeed;

/*---------------------*/
/* Pre-Computed States */
/*---------------------*/

var fisheyeSrcArr, panoPixelArr, dataTextureArr;

/*---------------*/
/* Data Textures */
/*---------------*/

var dataTexture;

/*----------------------*/
/* Capturing Video Feed */
/*----------------------*/

function readFisheyeImg() {
    fisheyeCtx.drawImage(videoFeed,
        fisheyeVidXOrigin, 0,
        fisheyeVidHeight, fisheyeVidHeight,
        0, 0,
        fisheyeVidHeight, fisheyeVidHeight);

    fisheyePixels = fisheyeCtx.getImageData(0, 0, fisheyeVidHeight, fisheyeVidHeight).data;
}

function displayFeed() {
    var screenGeometry = new THREE.PlaneGeometry(panoVidWidth, panoVidHeight);
    dataTextureArr = new Uint8Array(panoPixelArr);

    dataTexture = new THREE.DataTexture(dataTextureArr, panoVidWidth, panoVidHeight * 2, THREE.RGBAFormat);

    dataTexture.minFilter = THREE.LinearFilter;
    dataTexture.magFilter = THREE.NearestFilter;

    var screenMaterial = new THREE.MeshBasicMaterial({
        map: dataTexture
    });

    var screen = new THREE.Mesh(screenGeometry, screenMaterial);
    scene.add(screen);
}

function buildScene() {
    scene.add(camera);

    displayFeed();
    animate();
}

/*-------------------*/
/* Fisheye Dewarping */
/*-------------------*/

function dewarp() {
    var x, srcArrPos, destArrPos;

    var perf_start = performance.now();
    for (var i = 0; i < panoVidHeight; i++) {

        for (var j = 0; j < panoVidWidth; j++) {

            x = panoVidWidth * i + j;

            srcArrPos = fisheyeSrcArr[x];

            destArrPos = 4 * (i * panoVidWidth + j);

            panoPixelArr[destArrPos] = fisheyePixels[srcArrPos];
            panoPixelArr[destArrPos + 1] = fisheyePixels[srcArrPos + 1];
            panoPixelArr[destArrPos + 2] = fisheyePixels[srcArrPos + 2];
            panoPixelArr[destArrPos + 3] = fisheyePixels[srcArrPos + 3];
        }
    }

    dataTextureArr.set(panoPixelArr);
    dataTexture.needsUpdate = true;
    var perf_end = performance.now();
    console.log('dewarp: ' + (perf_end - perf_start) + 'ms');
}

/*----------------*/
/* Initialization */
/*----------------*/

function initEnv(vidWidth, vidHeight) {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, vidWidth / vidHeight,
        0.1, 3888);
    camera.position.z = 1000;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(vidWidth, vidHeight);
    document.body.appendChild(renderer.domElement);
}

function initOffScrnCanvas() {
    fisheyeCanvas = document.createElement('canvas');
    fisheyeCanvas.width = fisheyeVidHeight;
    fisheyeCanvas.height = fisheyeVidHeight;

    fisheyeCtx = fisheyeCanvas.getContext('2d');
}

function recordFisheyeDimensions(videoFeed) {
    fisheyeVidWidth = videoFeed.videoWidth;
    fisheyeVidHeight = videoFeed.videoHeight;
    fisheyeVidXOrigin = (fisheyeVidWidth - fisheyeVidHeight) / 2;
}

function setPanoDimensions() {
    panoVidWidth = fisheyeVidHeight * 2;
    panoVidHeight = fisheyeVidHeight / 2;
}


function initPanoPixelArr() {
    var arrPos;

    panoPixelArr = new Uint8ClampedArray(4 * panoVidWidth * panoVidHeight * 2);

    for (var i = 0; i < fisheyeVidHeight; i++) {
        for (var j = 0; j < panoVidWidth; j++) {
            arrPos = 4 * (i * panoVidWidth + j);
            panoPixelArr[arrPos] = 0;
            panoPixelArr[arrPos + 1] = 0;
            panoPixelArr[arrPos + 2] = 0;
            panoPixelArr[arrPos + 3] = 0;
        }
    }
}

/*-----------*/
/* Rendering */
/*-----------*/

function render() {
    readFisheyeImg();
    dewarp();

    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

//-------------//
// Main Script //
//-------------//

// grab video feed
videoFeed = document.querySelector('video');

// only obtain video feed dimensions after feed has fully loaded.
videoFeed.addEventListener('loadedmetadata', function() {
    recordFisheyeDimensions(videoFeed);
    setPanoDimensions();
    precomputeWorker = new Worker( 'js/workers/precompute.js' );
    precomputeWorker.postMessage( fisheyeVidHeight );
    precomputeWorker.onmessage = function ( e ) {
        fisheyeSrcArr = e.data;
        initPanoPixelArr();
        initEnv(panoVidWidth, panoVidHeight);
        initOffScrnCanvas();
        buildScene();
    };

}, false);
