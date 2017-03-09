function DomeViewMediator ( dome, mediatorFactory ) {
	ViewMediator.call( this, dome, mediatorFactory );

	this.dataTextureArr = new Uint8Array( 4 * 3888 * 972 * 2 );
	this.dataTexture = this.initDataTexture( this.dataTextureArr );
    const domeObj = this.createDomeObj( window.innerHeight, 64, this.dataTexture );

    this.view.add( domeObj );
}

DomeViewMediator.prototype = Object.create( ViewMediator.prototype );
DomeViewMediator.constructor = DomeViewMediator;

DomeViewMediator.prototype.createDomeObj = function ( radius, segments, dataTexture ) {
    return new THREE.Mesh (
        new THREE.SphereGeometry( radius, segments, segments ),
        new THREE.MeshBasicMaterial( {
            map: dataTexture,
            side: THREE.BackSide
        } )
    );
};

DomeViewMediator.prototype.initDataTexture = function ( dataTextureArr ) {
	var dataTexture = new THREE.DataTexture( dataTextureArr, 3888, 1944, THREE.RGBAFormat );
	dataTexture.minFilter = THREE.LinearFilter;
    dataTexture.magFilter = THREE.NearestFilter;
    dataTexture.generateMipmaps = false;
    dataTexture.flipY = true;
    dataTexture.flipX = true;

    return dataTexture;
};

DomeViewMediator.prototype.updateDataTexture = function ( pixelArr ) {
	// console.log( 'function call: updateDataTexture()' );
	this.dataTextureArr.set( pixelArr );
	this.dataTexture.needsUpdate = true;
};