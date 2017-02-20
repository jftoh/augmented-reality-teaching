var OffScreenCtx = function ( fisheyecanvas, fisheyeCtx, fisheyeSrcArr ) {
	this.fisheyecanvas = fisheyecanvas;
	this.fisheyeCtx = fisheyeCtx;
	this.fisheyeSrcArr = fisheyeSrcArr;
};

OffScreenCtx.getDefaultCtx = function ( fisheyeWidth ) {
	const fisheyecanvas = document.createElement( 'canvas' );
    fisheyecanvas.id = 'fisheye';
	fisheyecanvas.width = fisheyeWidth;
	fisheyecanvas.height = fisheyeWidth;
	const fisheyeCtx = fisheyecanvas.getContext( '2d' );

	const fisheyeSrcArr = precomputeSrcCoords( fisheyeWidth );
	// const fisheyeSrcArr = precomputeSrcCoords32( fisheyeWidth );

	return new OffScreenCtx( fisheyecanvas, fisheyeCtx, fisheyeSrcArr );
};

OffScreenCtx.prototype.getVidFramePixels = function ( videofeed ) {

    this.fisheyeCtx.drawImage( videofeed,
                          324, 0,
                          1944, 1944,
                          0, 0,
                          1944, 1944 );

    return this.fisheyeCtx.getImageData( 0, 0, 1944, 1944 ).data;
};

function precomputeSrcCoords32 ( fisheyeWidth ) {
	// console.log ( 'function call: precomputeSrcCoords32()' );
    var radius, theta;
    var paraTrueX, paraTrueY;
    var x, y;
    var srcArrPos;

    var panoWidth = fisheyeWidth * 2;
    var panoHeight = fisheyeWidth / 2;

    var fisheyeSrcArr = new Array( Math.pow( fisheyeWidth, 2 ) );
    var MAX_ARR_SIZE = Math.pow( fisheyeWidth, 2 );

    for ( var i = 0; i < panoHeight; i++ ) {

        radius = ( panoHeight - i );

        for ( var j = 0; j < panoWidth; j++ ) {

            theta = 2 * Math.PI * -j / ( 4 * panoHeight );

            // find true (x, y) coordinates based on parametric
            // equation of circle.
            paraTrueX = radius * Math.cos( theta );
            paraTrueY = radius * Math.sin( theta );

            // scale true coordinates to integer-based coordinates
            // (1 pixel is of size 1 * 1)
            x = Math.round( paraTrueX ) + panoHeight;
            y = panoHeight - Math.round( paraTrueY );

            srcArrPos = ( x * fisheyeWidth + y );

            // Checks if the offset is greater than MAX_1D_ARRAY_VALUE.
            // This prevents the array from dynamically increasing in size to accomodate the value,
            // resulting in an increase in array lookup time.
            if ( srcArrPos > MAX_ARR_SIZE ) {
                srcArrPos = MAX_ARR_SIZE - 8;
            }

            fisheyeSrcArr[ i * panoWidth + j ] = srcArrPos;
        }
    }
    return fisheyeSrcArr;
}

function precomputeSrcCoords ( fisheyeWidth ) {
	console.log ( 'function call: precomputeSrcCoords()' );
    var radius, theta;
    var paraTrueX, paraTrueY;
    var x, y;
    var srcArrPos;

    var panoWidth = fisheyeWidth * 2;
    var panoHeight = fisheyeWidth / 2;

    var fisheyeSrcArr = new Array( Math.pow( fisheyeWidth, 2 ) );
    var MAX_ARR_SIZE = 4 * Math.pow( fisheyeWidth, 2 );

    for ( var i = 0; i < panoHeight; i++ ) {

        radius = ( panoHeight - i );

        for ( var j = 0; j < panoWidth; j++ ) {

            theta = 2 * Math.PI * -j / ( 4 * panoHeight );

            // find true (x, y) coordinates based on parametric
            // equation of circle.
            paraTrueX = radius * Math.cos( theta );
            paraTrueY = radius * Math.sin( theta );

            // scale true coordinates to integer-based coordinates
            // (1 pixel is of size 1 * 1)
            x = Math.round( paraTrueX ) + panoHeight;
            y = panoHeight - Math.round( paraTrueY );

            srcArrPos = 4 * ( x * fisheyeWidth + y );

            // Checks if the offset is greater than MAX_1D_ARRAY_VALUE.
            // This prevents the array from dynamically increasing in size to accomodate the value,
            // resulting in an increase in array lookup time.
            if ( srcArrPos > MAX_ARR_SIZE ) {
                srcArrPos = MAX_ARR_SIZE - 8;
            }

            fisheyeSrcArr[ i * panoWidth + j ] = srcArrPos;
        }
    }
    return fisheyeSrcArr;
}