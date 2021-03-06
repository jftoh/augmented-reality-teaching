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

    this.object.addObserver( 'UpdateModels', ( e ) => this.updateAllChildModels() );
    this.object.addObserver( 'AllObjectsRemoved', ( e ) => this.removeAllChildViews( e ) );

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
DomeViewMediator.prototype.constructor = DomeViewMediator;

/**
 * updates the data texture with new image data (in the form of an array)
 * of the next frame from the video feed.
 * @param  Uint8Array pixelArr image data of the next frame processed by the Dewarp Engine.
 */
DomeViewMediator.prototype.updateDataTexture = function ( pixelArr ) {
	this.dataTextureArr.set( pixelArr );
	this.dataTexture.needsUpdate = true;
};

DomeViewMediator.prototype.getChildMediatorView = function ( child ) {
    return this.childMediators.get( child ).view;
};

DomeViewMediator.prototype.updateAllChildModels = function () {
    var childModels = this.object.children;

    for ( let [ childName, child ] of childModels.entries() ) {
        let view = this.getChildMediatorView( child );

        child.properties.coordinates = [ view.position.x, view.position.y, view.position.z ];
        child.properties.scaleRatio = [ view.scale.x, view.scale.y, view.scale.z ];
        child.properties.rotation = [ view.rotation.x, view.rotation.y, view.rotation.z ];
        childModels.set( childName, child );
    }
};

DomeViewMediator.prototype.removeAllChildViews = function ( e ) {
    for ( let object of e.objects ) {
        this.removeChild( object );
    }
};