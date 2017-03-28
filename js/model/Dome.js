function Dome () {
	this.dataTextureArr = new Uint8Array ( 4 * 3888 * 972 * 2 );
	this.dataTexture = initDataTexture( this.dataTextureArr );

	this.geometry = new THREE.SphereGeometry( window.innerheight, 128, 128 );
	this.material = new THREE.MeshBasicMaterial( {
		map: this.dataTexture,
		side: THREE.BackSide
	} );

	THREE.Mesh.call( this, this.geometry, this.material );

	function initDataTexture ( dataTextureArr ) {
		let dataTexture = new THREE.DataTexture( dataTextureArr, 3888, 1944, THREE.RGBAFormat );
        dataTexture.minFilter = THREE.LinearFilter;
        dataTexture.magFilter = THREE.NearestFilter;
        dataTexture.generateMipmaps = false;
        dataTexture.flipY = true;
        dataTexture.flipX = true;

        return dataTexture;
	}

	this.name = 'dome';
	this.classType = 'Dome';
}

Dome.prototype = Object.create( THREE.Mesh.prototype );
Dome.prototype.constructor = Dome;

Dome.prototype.updateDataTexture = function ( pixelArr ) {
	this.dataTextureArr.set( pixelArr );
	this.dataTexture.needsUpdate = true;
};

Dome.prototype.presentNextObject = function () {
	let currObject = this.children.shift();
	this.children.push( currObject );
	return currObject;
};