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

// Panorama Image dimensions.
const equi_image_width = fisheye_image_width * 2;
const equi_image_height = fisheye_image_width / 2;

// conversion constant from degrees to radians
const DEG2RAD = Math.PI / 180.0;

// maximum 1D array size for pixel data of length 1944 * 1944 * 4 
const MAX_1D_ARRAY_SIZE = fisheye_image_width * fisheye_image_height * 4;

/*----------------------*/
/* Buffers and Canvases */
/*----------------------*/

var equi_canvas = null;
var fisheye_canvas = null;

var fisheye_pixels = null;
var equi_pixels = null;

var fisheye_ctx = null;
var equi_ctx = null;

/*------------*/
/* Video Feed */
/*------------*/

var video_feed = null;

/*---------------------*/
/* Pre-Computed States */
/*---------------------*/

var fisheye_data_1d_arr = new Array(fisheye_image_width * fisheye_image_height);

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

        // var start = performance.now();
        
        // var end = performance.now();

        // console.log("getImageData(): " + (end - start) + "ms");
        
        window.setTimeout(getFisheyeImgData, 150); 
        
    }
}

function dewarp1d() {
    var perf_start = performance.now();
    if (fisheye_canvas != null) {

        // Step 1: Get Fisheye image
        fisheye_pixels = fisheye_ctx.getImageData(0, 0, fisheye_image_width, fisheye_image_height).data;
        var imgdata = equi_ctx.getImageData(0, 0, equi_canvas.width, equi_canvas.height);
        equi_pixels = imgdata.data;

        var x, src, dest_offset;

        for (var i = 0; i < equi_image_height; i++) {

            for (var j = 0; j < equi_image_width; j++) {

                x = equi_image_width * i + j;

                src = fisheye_data_1d_arr[x];
                dest_offset = 4 * ((equi_image_height - 1 - i) * equi_image_width + (equi_image_width - 1 - j));;

                equi_pixels[dest_offset] = fisheye_pixels[src];
                equi_pixels[dest_offset + 1] = fisheye_pixels[src + 1];
                equi_pixels[dest_offset + 2] = fisheye_pixels[src + 2];
                equi_pixels[dest_offset + 3] = fisheye_pixels[src + 3];
            }
        }
    
        //var perf_start_putimgdata = performance.now();
        equi_ctx.putImageData(imgdata, 0, 0);
        //var perf_end_putimgdata = performance.now();

        //console.log("putImageData(): " + (perf_end_putimgdata - perf_start_putimgdata) + "ms");
    }
    var perf_end = performance.now();

    console.log("dewarp1d(): " + (perf_end - perf_start) + "ms");

    window.setTimeout(dewarp1d, 0); 
}

/*----------------*/
/* Initialization */
/*----------------*/

function init_env() {
    //console.log("FUNCTION CALL: init_env()");

    // init fisheye buffer canvas of dimensions equal to video feed.
    fisheye_canvas = document.createElement('canvas');
    fisheye_canvas.width = fisheye_canvas_width;
    fisheye_canvas.height = fisheye_canvas_height;

    // var start = performance.now();
    fisheye_ctx = fisheye_canvas.getContext('2d');
    // var end = performance.now();

    // init equirectangular buffer canvas of 3888 * 1944 pixels
    equi_canvas = document.getElementById('equi');
    equi_canvas.width = equi_image_width;
    equi_canvas.height = equi_image_height * 2;

    equi_ctx = equi_canvas.getContext("2d");

    // initializes arrays for pre-computation
    init1d();

    getFisheyeImgData();
    dewarp1d();
}

/**
 * Initializes pre-compute states in a 1-dimensional array.
 * init2d() is called to fill in the 2d arrays, then flattens them into
 * 1d arrays
 */
function init1d() {
    //console.log("FUNCTION CALL: init_1d");
   
    var perf_start = performance.now();
    precompute1d();
    var perf_end = performance.now();

    console.log("precompute1d(): " + (perf_end - perf_start) + " ms");
}

/**
 * Fills the pre-compute state arrays with fixed values
 * used for the dewarp algorithm.
 */
function precompute1d() {
    var radius, theta, para_true_x, para_true_y, x, y;
    var dest_offset, src_offset;

    for (var i = 0; i < equi_image_height; i++) {

        radius = (equi_image_height - i);

        for (var j = 0; j < equi_image_width; j++) {

            theta = 2 * Math.PI * -j / (4 * equi_image_height);

            // find true (x, y) coordinates based on parametric
            // equation of circle.
            para_true_x = radius * Math.cos(theta);
            para_true_y = radius * Math.sin(theta);

            // scale true coordinates to integer-based coordinates
            // (1 pixel is of size 1 * 1)
            x = Math.round(para_true_x) + equi_image_height;
            y = equi_image_height - Math.round(para_true_y);

            src_offset = 4 * (x * fisheye_image_width + y);

            // Checks if the offset is greater than MAX_1D_ARRAY_VALUE.
            // This prevents the array from dynamically increasing in size to accomodate the value,
            // resulting in an increase in array lookup time.
            if (src_offset > MAX_1D_ARRAY_SIZE) {
                console.log("size exceeded");
                src_offset = MAX_1D_ARRAY_SIZE - 8;
            }

            fisheye_data_1d_arr[i * equi_image_width + j] = src_offset;
        }
    }
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
