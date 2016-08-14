// dewarp.js
// Dewarps a 360-degree fisheye image to a paranomic view using forward mapping.
//
// Algorithm is referenced from 
// http://polymathprogrammer.com/2009/10/15/convert-360-degree-fisheye-image-to-landscape-mode/
//
// Author: Toh Jian Feng

// Original image dimensions according to Kodak PixPro SP360.
const original_image_width = 1024;
const original_image_height = 1024;

// Panorama Image dimensions.
var pano_image_height = original_image_width / 2;
var pano_image_width = pano_image_height * 4;

// buffer array of original image pixels
var img_buffer = null;

var img = new Image();
img.onload = imageLoaded;
img.src = 'image.jpg';

var pano_canvas = null;

function init_pano(canvasid) {
    pano_canvas = document.getElementById('dewarped');
    draw();
}


function imageLoaded() {
    var buffer_canvas = document.createElement('canvas');
    var buffer_ctx = buffer_canvas.getContext('2d');

    // set buffer canvas to match original image dimensions
    buffer_canvas.width = original_image_width;
    buffer_canvas.height = original_image_height;

    buffer_ctx.drawImage(img, 0, 0);

    //get pixels
    var buffer_imgdata = buffer_ctx.getImageData(0, 0, buffer_canvas.width, buffer_canvas.height);
    var buffer_pixels = buffer_imgdata.data;

    //convert imgdata to float image buffer
    img_buffer = new Array(img.width * img.height * 3);
    for (var i = 0, j = 0; i < buffer_pixels.length; i += 4, j += 3) {
        img_buffer[j] = buffer_pixels[i];
        img_buffer[j + 1] = buffer_pixels[i + 1];
        img_buffer[j + 2] = buffer_pixels[i + 2];
    }
}

function draw() {
    if (pano_canvas != null && pano_canvas.getContext != null) {
        var ctx = pano_canvas.getContext("2d");

        //clear canvas
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(0, 0, pano_canvas.width, pano_canvas.height);

        dewarp(pano_canvas);
    }
}

function dewarp(canvas) {
    if (canvas != null && img_buffer != null) {
        var ctx = canvas.getContext("2d");
        
        var imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imgdata.data;

        var radius, theta, para_true_x, para_true_y, x, y;

        var dest_offset, src_offset;

        for (var i = 0; i < pano_image_height; i++) {
            for (var j = 0; j < pano_image_width; j++) {
                radius = (pano_image_height - i);

                theta = 2 * Math.PI * -j / (4 * pano_image_height);

                // find true (x, y) coordinates based on parametric
                // equation of circle.
                para_true_x = radius * Math.cos(theta);
                para_true_y = radius * Math.sin(theta);

                // scale true coordinates to integer-based coordinates
                // (1 pixel is of size 1 * 1)
                x = Math.round(para_true_x) + pano_image_height;
                y = pano_image_height - Math.round(para_true_y);

                dest_offset = 4 * ((pano_image_height - 1 - i) * pano_image_width + (pano_image_width - 1 - j));
                src_offset = 3 * (x * original_image_width + y);

                // check bounds to filter "incorrect" coordinates
                if (x >= 0 && x < (2 * pano_image_height) && y >= 0 && y < (2 * pano_image_height)) {

	                pixels[dest_offset] = img_buffer[src_offset];
	                pixels[dest_offset + 1] = img_buffer[src_offset + 1];
	                pixels[dest_offset + 2] = img_buffer[src_offset + 2];

                }
            }
        }

        ctx.putImageData(imgdata, 0, 0);
    }
}
