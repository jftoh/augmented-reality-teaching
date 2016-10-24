var video = document.querySelector("#videoElement");

// check for getUserMedia support
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

var hdConstraints = {
    video: {
        mandatory: {
            minWidth: 2592,
            minHeight: 1944
        }
    }
};

if (navigator.getUserMedia) {
    // get webcam feed if available
    navigator.getUserMedia(hdConstraints, handleVideo, videoError);
}

function handleVideo(stream) {
    // if found attach feed to video element
    video.src = window.URL.createObjectURL(stream);
}

function videoError(e) {
    console.log("Error: Video element not found");
}
