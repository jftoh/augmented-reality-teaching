function RadiateViewMediator ( effect, viewMediatorFactory ) {
	ViewMediator.call( this, effect, viewMediatorFactory );
}

RadiateViewMediator.prototype = Object.create( ViewMediator.prototype );
RadiateViewMediator.constructor = RadiateViewMediator;

RadiateViewMediator.prototype.createView = function () {
	const effectColor = this.object.properties.color;
	const coords = this.hasCoordinates() ? this.object.properties.coordinates : undefined;
	const mesh = new THREE.Mesh (
		new THREE.SphereGeometry( 10, 32, 32 ),
		new THREE.MeshLambertMaterial( { color: effectColor, opacity: 0.3, transparent: true } )
	);

	if ( coords !== undefined ) {
		mesh.position.set( coords[0], coords[1], coords[2] );
	}

	return mesh;
};

RadiateViewMediator.prototype.onFrameRendered = function () {
	let rateOfGrowth = this.object.properties.rateOfGrowth;
	this.view.scale.x += rateOfGrowth;
	this.view.scale.y += rateOfGrowth;
	this.view.scale.z += rateOfGrowth;

	if ( this.view.scale.x >= 2.0 ) {
		this.view.scale.set( 1.0, 1.0, 1.0 );
	}
};

RadiateViewMediator.prototype.hasCoordinates = function () {
	return this.object.properties.coordinates !== undefined;
};