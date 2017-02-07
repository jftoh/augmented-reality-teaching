self.onmessage = function ( e ) {
    var fisheyeDimensions = e.data;
    self.postMessage( precomputeSrcCoords( fisheyeDimensions ) );
    self.close();
};

function precomputeSrcCoords( fisheyeDimensions ) {
    var radius, theta;
    var paraTrueX, paraTrueY;
    var x, y;
    var srcArrPos;

    var fisheyeLength = fisheyeDimensions;
    var panoWidth = fisheyeLength * 2;
    var panoHeight = fisheyeLength / 2;

    var fisheyeSrcArr = new Array( Math.pow( fisheyeLength, 2 ) );
    var MAX_ARR_SIZE = 4 * Math.pow( fisheyeLength, 2 );

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

            srcArrPos = 4 * ( x * fisheyeLength + y );

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