var VideoContext = function ( videofeed ) {
	this.videofeed = videofeed;
};

VideoContext.getDefaultCtx = function () {
	const vidConstraints = {
	    audio: false,
	    video: {
	        width: { exact: 2592 },
	        height: { exact: 1944 }
	    }
	};

	const videoElement = document.querySelector( 'video' );

	navigator.mediaDevices.getUserMedia( vidConstraints ).then( ( mediaStream ) => {
		videoElement.srcObject = mediaStream;
		videoElement.play();
	}).catch( ( err ) => {
		console.log( err.name + ': ' + err.message );
	} );

	return new VideoContext( videoElement );
};