function RadiateEffect ( properties ) {

	THREE.Mesh.call( this );

	this.name = properties.name;
	this.rateOfGrowth = properties.rateOfGrowth;
}

RadiateEffect.prototype = Object.create( THREE.Mesh.prototype );