// pano.js 
// author: Toh Jian Feng

/*-----------*/
/* Constants */
/*-----------*/

// Original fisheye image dimensions according to USB webcam.
const fisheye_image_width = 1944;
const fisheye_image_height = 1944;

const fisheye_canvas_width = 1944;
const fisheye_canvas_height = 1944;

const fisheye_image_x_origin = (2592 - 1944) / 2;


/*----------------------*/
/* Buffers and Canvases */
/*----------------------*/

var fisheye_canvas = null;

var fisheye_pixels = null;

var fisheye_ctx = null;

/*------------*/
/* Video Feed */
/*------------*/

var video_feed = null;

/*----------------------*/
/* Capturing Video Feed */
/*----------------------*/

function getFisheyeImgData() {
    if (fisheye_canvas != null && video_feed != null) {
        // Original video feed dimensions are at 2592 X 1944 pixels.
        // We only require the fisheye image of dimensions 1944 X 1944 pixels
         
        // var start = performance.now();
        fisheye_ctx.drawImage(video_feed, fisheye_image_x_origin, 0, fisheye_image_width, fisheye_image_height, 0, 0, fisheye_image_width, fisheye_image_height);
        // var end = performance.now();

        // console.log("drawImage(): " + (end - start) + "ms");
        window.requestAnimationFrame(getFisheyeImgData); 
    }
}

/*----------------*/
/* Initialization */
/*----------------*/

function init_env() {
    //console.log("FUNCTION CALL: init_env()");

    // init fisheye buffer canvas of dimensions equal to video feed.
    fisheye_canvas = document.getElementById('fisheye');
    fisheye_canvas.width = fisheye_canvas_width;
    fisheye_canvas.height = fisheye_canvas_height;

    fisheye_ctx = fisheye_canvas.getContext("2d");

    window.requestAnimationFrame(getFisheyeImgData); 
}

//-------------//
// Main Script //
//-------------//

// grab video feed
video_feed = document.getElementById("videoElement");

// only obtain video feed dimensions after feed has fully loaded.
video_feed.addEventListener( "loadedmetadata", function (e) {
    init_env();
}, false );