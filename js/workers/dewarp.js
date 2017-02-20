self.onmessage = function ( e ) {
	self.postMessage(dewarp( e.data[ 0 ], e.data[ 1 ] ));
};

function dewarp ( fisheyePixels, fisheyeSrcArr ) {
	var perf_start = performance.now();
	var x, srcArrPos, destArrPos;

	var panoPixelArr = new Uint8Array( 4 * 3888 * 972 * 2 );

	for ( var i = 0; i < 972; i++ ) {
		for ( var j = 0; j < 3888; j++ ) {
			x = i * 3888 + j;
			srcArrPos = fisheyeSrcArr[ x ];
			destArrPos = 4 * Math.abs( ( 972 - 1 - i ) * 3888 - j );

			panoPixelArr[ destArrPos ] = fisheyePixels[ srcArrPos ];
            panoPixelArr[ destArrPos + 1 ] = fisheyePixels[ srcArrPos + 1 ];
            panoPixelArr[ destArrPos + 2 ] = fisheyePixels[ srcArrPos + 2 ];
            panoPixelArr[ destArrPos + 3 ] = fisheyePixels[ srcArrPos + 3 ];
		}
	}

	var perf_end = performance.now();

	console.log( 'dewarp(): ' + ( perf_end - perf_start ) + 'ms' );

	return panoPixelArr;
}