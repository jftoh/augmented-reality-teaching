// dewarp.js
// Dewarps a 360-degree fisheye image to a panoramic view.
//
// Algorithm is extracted from 
// "Generation of Panoramic View from 360 ° Fisheye Images Based on Angular Fisheye Projection"
// Written by Xiao, S. and Wang, F. 2011.
// DOI 10.1109/DCABES.2011.49 
//
// Author: Toh Jian Feng

// offset values to convert coordinates which are relative to a center origin
// into coordinates which are relative to a top-left origin.
// html uses top-left origin.
const x_coord_offset = 512;
const y_coord_offset = 512;

// original image dimensions
var image_width;
var image_height;

// obtain target plane dimensions
// image_radius: dewarped image height
// image_circumference: dewarped image width
var image_radius;
var image_circumference;

window.onload = initialize();

function initialize() {
	var image = new Image();

	// only draw canvas when image is loaded.
	image.onload = function() {
		var offscreenCanvas = document.createElement('canvas');
		offscreenCanvas.width = image.width;
		offscreenCanvas.height = image.height;

		image_width = image.width;
		image_height = image.height;

		image_radius = image_width / 2;
		image_circumference = 2 * Math.PI * image_radius;

		var offscreenContext = offscreenCanvas.getContext('2d');
		offscreenContext.drawImage(image, 0, 0);
		drawDewarpedImage(offscreenContext);
	}
	image.src = '../image.jpg';
}

function drawDewarpedImage(offscreenContext) {
	var dewarped_img_canvas = document.getElementById('dewarped');

	// set canvas dimensions to match panorama image.
	dewarped_img_canvas.width = image_circumference;
	dewarped_img_canvas.height = image_radius;

	dewarp(offscreenContext);
}

// Dewarps the current image and draws the 
// resultant panoramic image onto the canvas.
function dewarp(offscreenContext) {
	var dewarped_ctx = document.getElementById('dewarped').getContext('2d');
	var image_data, fisheye_coord, fisheye_coord_x, fisheye_coord_y;

	// nested for loops to iterate through the entire 
	// panoramic canvas.
	for (var i = 0; i < image_circumference; i++) {
		for (var j = 0; j < image_radius; j++) {
			fisheye_coord = findFishEyeCoord(i, j);
			fisheye_coord_x = fisheye_coord[0];
			fisheye_coord_y = fisheye_coord[1];

			// obtain corresponding pixel on fisheye image and put onto target plane
			image_data = offscreenContext.getImageData(fisheye_coord_x, fisheye_coord_y, 1, 1);
			dewarped_ctx.putImageData(image_data, i, j);
		}
	}
}

// Uses a backword mapping algorithm to obtain the 
// corresponding x, y-coordinates found on the fisheye image, 
// given a point on the target plane (i, j).
function findFishEyeCoord(i, j) {
	// Step 1: Obtain normalized coordinates of target plane (u, v)
	// coordinates are within range of [-1, 1]
	var u = 2 * i / image_width - 1;
	var v = 2 * j / image_height - 1; 

	// Step 2: Obtaining latitude and longditude angle values
	// latitude and longditude value must be in the range [0, PI]
	var longditude = 1 - u * (Math.PI / 2);
	var latitude = 1 - v * (Math.PI / 2);

	// Step 3: calculating corresponding cooordinates (x, y, z) in sphere
	// This is when the coordinates are located within a sphere of radius 1.
	var sphere_x = Math.sin(latitude) * Math.cos(longditude);
	var sphere_y = Math.cos(latitude);
	var sphere_z = Math.sin(latitude) * Math.sin(longditude);

	// Step 4: Calculate distance of line on the projection plane 
	// corresponding to the view of the fisheye image.
	var hypo_length = Math.sqrt(Math.pow(sphere_x, 2) + Math.pow(sphere_y, 2));
	var fisheye_radius = (image_width / Math.PI) * Math.acos(sphere_z);

	// Step 5: find corresponding x, y-coordinates on fisheye image.
	var fisheye_x = fisheye_radius * sphere_x / hypo_length;
	var fisheye_y = fisheye_radius * sphere_y / hypo_length;
	return [fisheye_x, fisheye_y];
}