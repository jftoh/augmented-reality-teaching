/*
Copyright (c) 2010, Martin Wengenmayer ( www.cheetah3d.com )
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are 
permitted provided that the following conditions are met:

-Redistributions of source code must retain the above copyright notice, this list of 
conditions and the following disclaimer. 

-Redistributions in binary form must reproduce the above copyright notice, this list 
of conditions and the following disclaimer in the documentation and/or other materials 
provided with the distribution. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS 
OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY 
AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER 
OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON 
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
POSSIBILITY OF SUCH DAMAGE.
*/

// Original image dimensions according to Kodak PixPro SP360.
const original_image_width = 1024;
const original_image_height = 1024;

// Panorama Image dimensions.
var pano_image_height = original_image_width / 2;
var pano_image_width = pano_image_height * 4;

const FPS = 30;
const DEG2RAD = Math.PI / 180.0;

//Canvas to which to draw the panorama
var dome_canvas = null;

//Event state
var mouseIsDown = false;
var mouseDownPosLastX = 0;
var mouseDownPosLastY = 0;
var displayInfo = false;
var highquality = true;

//Camera state
var cam_heading = 90.0;
var cam_pitch = 90.0;
var cam_fov = 90;

//Load image 
var img_buffer = null;
var pano_buffer = null;
var img = new Image();
img.onload = imageLoaded;
img.src = "image.jpg";


function init_pano(canvasid) {
    //get canvas and set up call backs
    dome_canvas = document.getElementById('dome');
    dome_canvas.onmousedown = mouseDown;
    window.onmousemove = mouseMove;
    window.onmouseup = mouseUp;
    window.onmousewheel = mouseScroll;
    window.onkeydown = keyDown;
    draw();
    //setInterval(draw, 1000/FPS);
}

function imageLoaded() {
    //original
    var original = document.getElementById("original");
    var original_ctx = original.getContext("2d");
    original_ctx.drawImage(img, 0, 0);


    var buffer = document.createElement("canvas");
    var buffer_ctx = buffer.getContext("2d");

    //set buffer size
    buffer.width = img.width;
    buffer.height = img.height;

    //draw image
    buffer_ctx.drawImage(img, 0, 0);

    //get pixels
    var buffer_imgdata = buffer_ctx.getImageData(0, 0, buffer.width, buffer.height);
    var buffer_pixels = buffer_imgdata.data;

    //convert imgdata to float image buffer
    img_buffer = new Array(img.width * img.height * 3);
    for (var i = 0, j = 0; i < buffer_pixels.length; i += 4, j += 3) {
        img_buffer[j] = buffer_pixels[i];
        img_buffer[j + 1] = buffer_pixels[i + 1];
        img_buffer[j + 2] = buffer_pixels[i + 2];
    }

    draw_dewarped();
    draw();
    //renderPanorama(dome_canvas);
}


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
        draw();
    }
}

function mouseUp(e) {
    mouseIsDown = false;
    draw();
}

function mouseScroll(e) {
    cam_fov += e.wheelDelta / 120;
    cam_fov = Math.min(90, Math.max(30, cam_fov));
    draw();
}

function keyDown(e) {
    if (e.keyCode == 73) { //i==73 Info
        displayInfo = !displayInfo;
        draw();
    }
}

function renderPanorama(canvas) {
    if (canvas != null) {
        var ctx = canvas.getContext("2d");
        var imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var dome_buffer = imgdata.data;

        var dewarped = document.getElementById("dewarped");
        var dewarped_ctx = dewarped.getContext("2d");
        var dewarped_imgdata = dewarped_ctx.getImageData(0, 0, dewarped.width, dewarped.height);
        var dewarped_buffer = dewarped_imgdata.data;

        //convert imgdata to float image buffer
        var buffer = new Array(2048 * 1024 * 3);
        for (var i = 0, j = 0; i < dewarped_buffer.length; i += 4, j += 3) {
            buffer[j] = dewarped_buffer[i];
            buffer[j + 1] = dewarped_buffer[i + 1];
            buffer[j + 2] = dewarped_buffer[i + 2];
        }

        var src_width = dewarped.width;
        var src_height = dewarped.height;
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

                dome_buffer[dest_offset] = buffer[src_offset];
                dome_buffer[dest_offset + 1] = buffer[src_offset + 1];
                dome_buffer[dest_offset + 2] = buffer[src_offset + 2];
                //pixels[dest_offset+3] = img_buffer[src_offset+3];
            }
        }

        //upload image data
        ctx.putImageData(imgdata, 0, 0);
    }
}

function draw() {
    if (dome_canvas != null && dome_canvas.getContext != null) {

        var ctx = dome_canvas.getContext("2d");

        //clear canvas
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(0, 0, dome_canvas.width, dome_canvas.height);

        renderPanorama(dome_canvas);
    }
}

function draw_dewarped() {
    var dewarped = document.getElementById("dewarped");
    if (dewarped != null && dewarped.getContext != null) {
        var dewarped_ctx = dewarped.getContext("2d");
        dewarped_ctx.fillStyle = "rgba(0, 0, 0, 1)";
        dewarped_ctx.fillRect(0, 0, dewarped.width, dewarped.height);

        dewarp(dewarped);
    }
}

function dewarp(canvas) {
    if (img_buffer != null && canvas != null) {
        var ctx = canvas.getContext("2d");
        var imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);

        var buffer = imgdata.data;

        //pano_buffer = new Array(2048 * 1024 * 3);

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

                    buffer[dest_offset] = img_buffer[src_offset];
                    buffer[dest_offset + 1] = img_buffer[src_offset + 1];
                    buffer[dest_offset + 2] = img_buffer[src_offset + 2];
                    //pano_buffer[dest_offset + 3] = img_buffer[src_offset + 3];

                }
            }
        }

        ctx.putImageData(imgdata, 0, 0);

    }
}
