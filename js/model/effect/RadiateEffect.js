function RadiateEffect ( properties ) {
	this.name = properties.name;
	this.rateOfGrowth = properties.rateOfGrowth;
	this.geometry = new THREE.SphereGeometry( 5, 1, 1 );
	this.material = new THREE.MeshLambertMaterial( {
		color: properties.color
	} );

	THREE.Mesh.call( this, this.geometry, this.material );
}

RadiateEffect.prototype = Object.create( THREE.Mesh.prototype );
RadiateEffect.prototype.constructor = RadiateEffect;

RadiateEffect.prototype.update = function () {
	this.scale.x += this.rateOfGrowth;
	this.scale.y += this.rateOfGrowth;
	this.scale.z += this.rateOfGrowth;

	if ( this.scale.x > 2.0 ) {
		this.scale.set( new THREE.Vector3( 1.0, 1.0, 1.0 ) );
	}
};