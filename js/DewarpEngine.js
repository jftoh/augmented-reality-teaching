var gpu = new GPU();

var DewarpEngine = function ( fisheyeSrcArr ) {
	this.fisheyeSrcArr = fisheyeSrcArr;
	this.dewarpWithGPU = gpu.createKernel( function ( fisheyePixels32Bit, fisheyeSrcArr ) {
		var srcArrPos;
		for ( var j = 0; j < 3888; j++ ) {
			srcArrPos = fisheyeSrcArr[ this.thread.x * 3888 + j ];

			return fisheyePixels32Bit[ srcArrPos ];
		}
	} ).dimensions( 3888 * 972 * 2 );
};

DewarpEngine.createInstance = function ( fisheyeSrcArr ) {
	return new DewarpEngine( fisheyeSrcArr );
};

DewarpEngine.prototype.dewarp = function ( fisheyePixels ) {
	var perf_start = performance.now();
	var x, srcArrPos, destArrPos;

	var panoPixelArr = new Uint8Array( 4 * 3888 * 972 * 2 );

	for ( var i = 0; i < 972; i++ ) {
		for ( var j = 0; j < 3888; j++ ) {
			x = i * 3888 + j;
			srcArrPos = this.fisheyeSrcArr[ x ];
			destArrPos = 4 * Math.abs( ( 972 - 1 - i ) * 3888 - j );

			panoPixelArr[ destArrPos ] = fisheyePixels[ srcArrPos ];
            panoPixelArr[ destArrPos + 1 ] = fisheyePixels[ srcArrPos + 1 ];
            panoPixelArr[ destArrPos + 2 ] = fisheyePixels[ srcArrPos + 2 ];
            panoPixelArr[ destArrPos + 3 ] = fisheyePixels[ srcArrPos + 3 ];
		}
	}

	var perf_end = performance.now();

	// console.log( 'dewarp(): ' + ( perf_end - perf_start ) + 'ms' );

	return panoPixelArr;
};

DewarpEngine.prototype.dewarp32Bit = function ( fisheyePixels32Bit ) {
	var perf_start = performance.now();
	var x, srcArrPos, destArrPos;

	var panoPixelArr = new Uint32Array( 3888 * 972 * 2 );

	for ( var i = 0; i < 972; i++ ) {
		for ( var j = 0; j < 3888; j++ ) {
			x = i * 3888 + j;
			srcArrPos = this.fisheyeSrcArr[ x ];
			destArrPos = Math.abs( ( 972 - 1 - i ) * 3888 - j );

			panoPixelArr[ destArrPos ] = fisheyePixels32Bit[ srcArrPos ];
		}
	}

	var perf_end = performance.now();

	// console.log( 'dewarp32Bit(): ' + ( perf_end - perf_start ) + 'ms' );

	return panoPixelArr;
};