var vidConstraints = {
    audio: false,
    video: {
        width: { exact: 2592 },
        height: { exact: 1944 }
    }
};

navigator.mediaDevices.getUserMedia( vidConstraints ).then( handleMedia ).catch( mediaError );

function mediaError ( err ) {
    console.log( err.name + ': ' + err.message );
}

function handleMedia ( mediaStream ) {
    var video = document.querySelector( 'video' );
    video.srcObject = mediaStream;
    video.onloadedmetadata = function () {
        video.play();
    };
}