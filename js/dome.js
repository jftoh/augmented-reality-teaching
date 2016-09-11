// dome.js author: Toh Jian Feng

/*-----------*/
/* Constants */
/*-----------*/

// Original fisheye image dimensions according to Kodak PixPro SP360.
const fisheye_image_width = 1024;
const fisheye_image_height = 1024;

// Panorama Image dimensions.
const equi_image_width = 2048;
const equi_image_height = 512;

// conversion constant from degrees to radians
const DEG2RAD = Math.PI / 180.0;

/*----------------------*/
/* Buffers and Canvases */
/*----------------------*/

var dome_canvas = null;
var equi_canvas = null;
var fisheye_canvas = null;

var fisheye_pixels = null;
var equi_pixels = null;

/*--------------------*/
/* Mouse Event States */
/*--------------------*/

var mouseIsDown = false;
var mouseDownPosLastX = 0;
var mouseDownPosLastY = 0;

/*---------------*/
/* Camera States */
/*---------------*/

var cam_heading = 90.0;
var cam_pitch = 45.0;
var cam_fov = 90;

/*---------------------*/
/* Pre-Computed States */
/*---------------------*/

var fisheye_data_arr;
var equi_data_arr;

/*----------------------*/
/* Image Initialization */
/*----------------------*/

const img_src = "image.jpg";

var original_img = new Image();
original_img.onload = onImgLoad;
original_img.src = img_src;

var x = 0;

setInterval(function() {
    original_img.src = img_src + '?t=' + x;
    x = (x + 1) % 50000;
}, 100);


function onImgLoad() {
    getFisheyeImgData();

    // dewarp original image
    dewarp();

    // draw equirectangular panorama onto pano canvas
    render();
}

function getFisheyeImgData() {
    if (fisheye_canvas != null) {
        var fisheye_ctx = fisheye_canvas.getContext("2d");

        fisheye_ctx.drawImage(original_img, 0, 0);

        fisheye_pixels = fisheye_ctx.getImageData(0, 0, fisheye_canvas.width, fisheye_canvas.height).data;
    }
}

function dewarp() {
    if (fisheye_canvas != null) {
        var equi_ctx = equi_canvas.getContext("2d");
        equi_pixels = equi_ctx.getImageData(0, 0, equi_canvas.width, equi_canvas.height).data;

        var src_offset, dest_offset;

        for (var i = 0; i < equi_image_height; i++) {

            for (var j = 0; j < equi_image_width; j++) {

                src_offset = fisheye_data_arr[i][j];
                dest_offset = equi_data_arr[i][j];
                equi_pixels[dest_offset] = fisheye_pixels[src_offset];
                equi_pixels[dest_offset + 1] = fisheye_pixels[src_offset + 1];
                equi_pixels[dest_offset + 2] = fisheye_pixels[src_offset + 2];
                equi_pixels[dest_offset + 3] = fisheye_pixels[src_offset + 3];
            }
        }
    }
}

/*----------------*/
/* Dome Rendering */
/*----------------*/

function renderPanorama(canvas) {
    if (canvas != null) {
        var ctx = canvas.getContext("2d");
        var imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var dome_pixels = imgdata.data;

        var src_width = equi_canvas.width;
        var src_height = equi_canvas.height;
        var dest_width = canvas.width;
        var dest_height = canvas.height;

        //calculate camera plane
        var theta_fac = src_height / Math.PI;
        var phi_fac = src_width * 0.5 / Math.PI
        var ratioUp = 2.0 * Math.tan(cam_fov * DEG2RAD / 2.0);
        var ratioRight = ratioUp * 1.33;
        var camDirX = Math.sin(cam_pitch * DEG2RAD) * Math.sin(cam_heading * DEG2RAD);
        var camDirY = Math.cos(cam_pitch * DEG2RAD);
        var camDirZ = Math.sin(cam_pitch * DEG2RAD) * Math.cos(cam_heading * DEG2RAD);
        var camUpX = ratioUp * Math.sin((cam_pitch - 90.0) * DEG2RAD) * Math.sin(cam_heading * DEG2RAD);
        var camUpY = ratioUp * Math.cos((cam_pitch - 90.0) * DEG2RAD);
        var camUpZ = ratioUp * Math.sin((cam_pitch - 90.0) * DEG2RAD) * Math.cos(cam_heading * DEG2RAD);
        var camRightX = ratioRight * Math.sin((cam_heading - 90.0) * DEG2RAD);
        var camRightY = 0.0;
        var camRightZ = ratioRight * Math.cos((cam_heading - 90.0) * DEG2RAD);
        var camPlaneOriginX = camDirX + 0.5 * camUpX - 0.5 * camRightX;
        var camPlaneOriginY = camDirY + 0.5 * camUpY - 0.5 * camRightY;
        var camPlaneOriginZ = camDirZ + 0.5 * camUpZ - 0.5 * camRightZ;

        //render image
        var i, j;
        for (i = 0; i < dest_height; i++) {
            for (j = 0; j < dest_width; j++) {
                var fx = j / dest_width;
                var fy = i / dest_height;

                var rayX = camPlaneOriginX + fx * camRightX - fy * camUpX;
                var rayY = camPlaneOriginY + fx * camRightY - fy * camUpY;
                var rayZ = camPlaneOriginZ + fx * camRightZ - fy * camUpZ;
                var rayNorm = 1.0 / Math.sqrt(rayX * rayX + rayY * rayY + rayZ * rayZ);

                var theta = Math.acos(rayY * rayNorm);
                var phi = Math.atan2(rayZ, rayX) + Math.PI;
                var theta_i = Math.floor(theta_fac * theta);
                var phi_i = Math.floor(phi_fac * phi);

                var dest_offset = 4 * (i * dest_width + j);
                var src_offset = 4 * (theta_i * src_width + phi_i);

                dome_pixels[dest_offset] = equi_pixels[src_offset];
                dome_pixels[dest_offset + 1] = equi_pixels[src_offset + 1];
                dome_pixels[dest_offset + 2] = equi_pixels[src_offset + 2];
                dome_pixels[dest_offset + 3] = equi_pixels[src_offset + 3];

            }
        }

        //upload image data
        ctx.putImageData(imgdata, 0, 0);
    }
}

function render() {
    if (dome_canvas != null && dome_canvas.getContext != null) {

        var ctx = dome_canvas.getContext("2d");

        //clear canvas
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(0, 0, dome_canvas.width, dome_canvas.height);

        renderPanorama(dome_canvas);
    }
}

/*----------------*/
/* Initialization */
/*----------------*/

function init_env() {

    // init fisheye buffer canvas
    fisheye_canvas = document.createElement('canvas');
    fisheye_canvas.width = original_img.width;
    fisheye_canvas.height = original_img.height;

    // init equirectangular buffer canvas
    equi_canvas = document.createElement('canvas');
    equi_canvas.width = equi_image_width;
    equi_canvas.height = equi_image_height * 2;

    // initializes arrays for pre-computation
    // init1d();
    init2d();

    //get canvas and set up call backs
    dome_canvas = document.getElementById('dome');
    dome_canvas.onmousedown = mouseDown;

    window.onmousemove = mouseMove;
    window.onmouseup = mouseUp;
    window.onmousewheel = mouseScroll;
}

/**
 * Initializes pre-compute states in a 1-dimensional array.
 */
function init1d() {
    fisheye_data_arr = createArray(fisheye_image_height * fisheye_image_width);
    equi_data_arr = createArray(equi_image_height * equi_image_width);
    precompute1d();
}

/**
 * Initializes pre-compute states in a 2-dimensional array.
 */
function init2d() {
    fisheye_data_arr = createArray(fisheye_image_height, fisheye_image_width);
    equi_data_arr = createArray(equi_image_height, equi_image_width);
    precompute2d();
}

function precompute2d() {
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

            dest_offset = 4 * ((equi_image_height - 1 - i) * equi_image_width + (equi_image_width - 1 - j));
            src_offset = 4 * (x * fisheye_image_width + y);

            equi_data_arr[i][j] = dest_offset;
            fisheye_data_arr[i][j] = src_offset;
        }
    }
}

function precompute1d() {
    var radius, theta, para_true_x, para_true_y, x, y;
    var dest_offset, src_offset;

    var max_array_size = equi_image_height * equi_image_width;

    for (var i = 0; i < max_array_size; i++) {
        radius = (equi_image_height - i) % equi_image_width;

        theta = 2 * Math.PI * (-i % equi_image_width) / (4 * equi_image_height);

        // find true (x, y) coordinates based on parametric
        // equation of circle.
        para_true_x = radius * Math.cos(theta);
        para_true_y = radius * Math.sin(theta);

        // scale true coordinates to integer-based coordinates
        // (1 pixel is of size 1 * 1)
        x = Math.round(para_true_x) + equi_image_height;
        y = equi_image_height - Math.round(para_true_y);

        dest_offset = 4 * ((equi_image_height - 1 - i) * equi_image_width + (equi_image_width - 1 - j));
        src_offset = 4 * (x * fisheye_image_width + y);

        equi_data_arr[i][j] = dest_offset;
        fisheye_data_arr[i][j] = src_offset;
    }
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

//--------------//
// Mouse Events //
//--------------//

function mouseDown(e) {
    mouseIsDown = true;
    mouseDownPosLastX = e.clientX;
    mouseDownPosLastY = e.clientY;
}

function mouseMove(e) {
    if (mouseIsDown == true) {
        cam_heading -= (e.clientX - mouseDownPosLastX);
        cam_pitch += 0.5 * (e.clientY - mouseDownPosLastY);
        cam_pitch = Math.min(180, Math.max(0, cam_pitch));
        mouseDownPosLastX = e.clientX;
        mouseDownPosLastY = e.clientY;
        render();
    }
}

function mouseUp(e) {
    mouseIsDown = false;
    render();
}

function mouseScroll(e) {
    cam_fov += e.wheelDelta / 120;
    cam_fov = Math.min(90, Math.max(30, cam_fov));
    render();
}