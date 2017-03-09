/**
 * DomeViewMediator.js
 *
 * Mediator class for the dome environment.
 */

/**
 * Constructor.
 * @param { Dome } dome            instance of dome object
 * @param { ViewMediatorFactory } mediatorFactory instance of ViewMediatorFactory object
 */
function DomeViewMediator ( dome, mediatorFactory ) {
	ViewMediator.call( this, dome, mediatorFactory );

	this.dataTextureArr = new Uint8Array( 4 * 3888 * 972 * 2 );
	this.dataTexture = initDataTexture( this.dataTextureArr );

    const domeObj = createDomeView( window.innerHeight, 64, this.dataTexture );

    this.view.add( domeObj );

    /**
     * instantiates a THREE.js 3D object representing the dome environment.
     * @param  {[type]} radius      [description]
     * @param  {[type]} segments    [description]
     * @param  {[type]} dataTexture [description]
     * @return {[type]}             [description]
     */
    function createDomeView ( radius, segments, dataTexture ) {
        return new THREE.Mesh (
            new THREE.SphereGeometry( radius, segments, segments ),
            new THREE.MeshBasicMaterial( {
                map: dataTexture,
                side: THREE.BackSide
            } )
        );
    }

    /**
     * [initDataTexture description]
     * @param  {[type]} dataTextureArr [description]
     * @return {[type]}                [description]
     */
    function initDataTexture ( dataTextureArr ) {
        var dataTexture = new THREE.DataTexture( dataTextureArr, 3888, 1944, THREE.RGBAFormat );
        dataTexture.minFilter = THREE.LinearFilter;
        dataTexture.magFilter = THREE.NearestFilter;
        dataTexture.generateMipmaps = false;
        dataTexture.flipY = true;
        dataTexture.flipX = true;

        return dataTexture;
    }
}

DomeViewMediator.prototype = Object.create( ViewMediator.prototype );
DomeViewMediator.constructor = DomeViewMediator;

/**
 * updates the data texture with new image data (in the form of an array)
 * of the next frame from the video feed.
 * @param  Uint8Array pixelArr image data of the next frame processed by the Dewarp Engine.
 */
DomeViewMediator.prototype.updateDataTexture = function ( pixelArr ) {
	this.dataTextureArr.set( pixelArr );
	this.dataTexture.needsUpdate = true;
};