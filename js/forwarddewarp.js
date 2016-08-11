// forwarddewarp.js
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
var pano_image_height = original_image_width;
var pano_image_width = 2 * Math.PI * pano_image_height;

window.onload = init();

function init() {
	var image = new Image();

	// only draw canvas when image is loaded.
	image.onload = function() {
		var offscreenCanvas = document.createElement('canvas');
		offscreenCanvas.width = original_image_width;
		offscreenCanvas.height = original_image_height;

		var offscreenContext = offscreenCanvas.getContext('2d');
		
		// Shifts origin to centre of canvas (Note: HTML Canvas uses top-left origin)
		//offscreenContext.translate(511, 511);

		// draw the image with origin at centre of canvas
		offscreenContext.drawImage(image, 0, 0, original_image_width, original_image_height);
		
		drawDewarpedImage(offscreenContext);
	}
	image.src = '../image.jpg';
}

function drawDewarpedImage(offscreenContext) {
	var dewarped_img_canvas = document.getElementById('dewarped');

	// set canvas dimensions to match panorama image.
	dewarped_img_canvas.width = pano_image_width;
	dewarped_img_canvas.height = pano_image_height;

	dewarp(offscreenContext);
}

// Unfolds the 360-degree fisheye image into a panorama.
// Algorithm referenced from
// http://polymathprogrammer.com/2009/10/15/convert-360-degree-fisheye-image-to-landscape-mode/
function dewarp(offscreenContext) {
	var dewarped_ctx = document.getElementById('dewarped').getContext('2d');
	var image_data;
	var radius, theta, para_true_x, para_true_y, x, y;

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

			image_data = offscreenContext.getImageData(x, y, 1, 1);

			// check bounds to filter "incorrect" coordinates
			if (x >= 0 && x < (2 * pano_image_height) 
				&& y >= 0 && y < (2 * pano_image_height)) {

				// y-coordinates are offset to flip image horizontally
				dewarped_ctx.putImageData(image_data, j, pano_image_height - i);
			}
		}
	}
}