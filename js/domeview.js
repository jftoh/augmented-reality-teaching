// domeview.js
// Converts a 360-degree camera video feed to a
// first-person perspective.
// author: Toh Jian Feng

/*-----------*/
/* Constants */
/*-----------*/

// Original image dimensions according to Kodak PixPro SP360.
const original_image_width = 1024;
const original_image_height = 1024;

// Panorama Image dimensions.
const equi_image_height = original_image_width / 2;
const equi_image_width = equi_image_height * 4;

// conversion constant from degrees to radians
const DEG2RAD = Math.PI / 180.0;

/*----------------------*/
/* Buffers and Canvases */
/*----------------------*/

var fisheye_canvas = null;
var dome_canvas = null;
var equi_canvas = null;

var fisheye_img_buffer = null;
var equi_buffer = null;

/*---------------*/
/* Camera States */
/*---------------*/

var cam_heading = 90.0;
var cam_pitch = 90.0;
var cam_fov = 90;

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

/**
 * onload function for the image element.
 */
function onImgLoad() {
	convertImgToBuffer();
	dewarp();
	render();
}

/*------------------*/
/* Image Conversion */
/*------------------*/

function convertImgToBuffer() {
	var fisheye_ctx = fisheye_canvas.getContext("2d");

	fisheye_canvas.width = original_img.width;
	fisheye_canvas.height = original_img.height;

	fisheye_ctx.drawImage(original_img, 0, 0);

	var fisheye_imgdata = fisheye_ctx.getImageData(0, 0, fisheye_canvas.height, fisheye_canvas.height);
	var fisheye_pixels = fisheye_imgdata.data;

    fisheye_img_buffer = new Array(original_img.width * original_img.height * 3);
    for (var i = 0, j = 0; i < fisheye_pixels.length; i += 4, j += 3) {
        fisheye_img_buffer[j] = fisheye_pixels[i];
        fisheye_img_buffer[j + 1] = fisheye_pixels[i + 1];
        fisheye_img_buffer[j + 2] = fisheye_pixels[i + 2];
    }
}

function dewarp() {
	if (fisheye_img_buffer != null) {
		
		var equi_ctx = equi_canvas.getContext("2d");
		var equi_imgdata = equi_ctx.getImageData(0, 0, equi_image_width, equi_image_height * 2);
		var equi_pixels = equi_imgdata.data;

		var radius, theta, para_true_x, para_true_y, x, y;
        var dest_offset, src_offset;

        for (var i = 0; i < equi_image_height; i++) {
            for (var j = 0; j < equi_image_width; j++) {
                radius = (equi_image_height - i);

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
                src_offset = 3 * (x * original_image_width + y);

				equi_pixels[dest_offset] = fisheye_img_buffer[src_offset];
				equi_pixels[dest_offset + 1] = fisheye_img_buffer[src_offset + 1];
				equi_pixels[dest_offset + 2] = fisheye_img_buffer[src_offset + 2];

            }
        }

        equi_buffer = new Array(equi_image_width * equi_image_height * 2 * 3);
        for (var i = 0, j = 0; i < equi_pixels.length; i += 4, j += 3) {
        	equi_buffer[j] = equi_pixels[i];
        	equi_buffer[j + 1] = equi_pixels[i + 1];
        	equi_buffer[j + 2] = equi_pixels[i + 2];
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
        var dome_buffer = imgdata.data;

        var src_width = equi_image_width;
        var src_height = equi_image_height * 2;
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
                var src_offset = 3 * (theta_i * src_width + phi_i);

                dome_buffer[dest_offset] = equi_buffer[src_offset];
                dome_buffer[dest_offset + 1] = equi_buffer[src_offset + 1];
                dome_buffer[dest_offset + 2] = equi_buffer[src_offset + 2];
                // dome_buffer[dest_offset + 3] = equi_buffer[src_offset + 3];
            }
        }

        //upload image data
        ctx.putImageData(imgdata, 0, 0);
    }
}

function render() {
	if (dome_canvas != null && dome_canvas.getContext != null) {
		renderPanorama(dome_canvas);
	}
}

/*---------------------*/
/* Body Initialization */
/*---------------------*/

/**
 * Initializes the canvas.
 * Called upon loading of the webpage body.
 */
function init_dome() {
	dome_canvas = document.getElementById('dome');
	fisheye_canvas = document.createElement('canvas');
	equi_canvas = document.createElement('canvas');
	clear_canvas();

	/*
	dome_canvas.onmousedown = mouseDown;
    window.onmousemove = mouseMove;
    window.onmouseup = mouseUp;
    window.onmousewheel = mouseScroll;
    */
}

/**
 * Rewrites the canvas with a black screen.
 */
function clear_canvas() {
	if (dome_canvas != null) {
		var ctx = dome_canvas.getContext("2d");

		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.fillRect(0, 0, dome_canvas.width, dome_canvas.height);
	}
}