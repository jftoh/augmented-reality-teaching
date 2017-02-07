// fisheye.js
// author: Toh Jian Feng

// Original fisheye image dimensions according to USB webcam.
var fisheyeVidWidth, fisheyeVidHeight = null;

var scene, camera, renderer = null;

/*------------*/
/* Video Feed */
/*------------*/

var videoFeed = null;

/*----------------------*/
/* Capturing Video Feed */
/*----------------------*/

function displayFeed() {
    var screenGeometry = new THREE.PlaneGeometry(fisheyeVidWidth, fisheyeVidHeight);
    var videoTexture = new THREE.VideoTexture(videoFeed);
    videoTexture.minFilter = THREE.LinearFilter;
    var screenMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture
    });

    var screen = new THREE.Mesh(screenGeometry, screenMaterial);
    scene.add(screen);
}

function buildScene() {
    scene.add(camera);

    displayFeed();
    animate();
}

/*-----------*/
/* Rendering */
/*-----------*/

function render() {
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

/*----------------*/
/* Initialization */
/*----------------*/

function initEnv(fisheyeVidWidth, fisheyeVidHeight) {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, fisheyeVidWidth / fisheyeVidHeight,
        0.1, 4000);
    camera.position.z = 972;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(fisheyeVidWidth, fisheyeVidHeight);
    document.body.appendChild(renderer.domElement);
}

function recordFisheyeDimensions(videoFeed) {
    fisheyeVidWidth = videoFeed.videoWidth;
    fisheyeVidHeight = videoFeed.videoHeight;
}

//-------------//
// Main Script //
//-------------//

// grab video feed
videoFeed = document.querySelector('video');

// only obtain video feed dimensions after feed has fully loaded.
videoFeed.addEventListener('loadedmetadata', function() {
    recordFisheyeDimensions(videoFeed);
    initEnv(fisheyeVidWidth, fisheyeVidHeight);
    buildScene();
}, false);
