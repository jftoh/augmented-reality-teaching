function Dome ( geometry, material, dataTextureArr ) {
	THREE.Mesh.call( this, geometry, material );

	this.name = 'dome';
	this.classType = 'Dome';

	this.childOnFocus = 0;

	this.dataTextureArr = dataTextureArr;
}

Dome.prototype = Object.create( THREE.Mesh.prototype );
Dome.prototype.constructor = Dome;

Dome.prototype.addChild = function ( child ) {
	child.parent = this;
	this.add( child );
};

Dome.prototype.removeChild = function ( child ) {
	this.remove( child );
};

Dome.prototype.updateDataTexture = function ( pixelArr ) {
	this.dataTextureArr.set( pixelArr );
	this.material.map.needsUpdate = true;
};