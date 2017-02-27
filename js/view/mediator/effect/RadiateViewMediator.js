function RadiateViewMediator ( effect, viewMediatorFactory ) {
	ViewMediator.call( this, effect, viewMediatorFactory );
}

RadiateViewMediator.prototype = Object.create( ViewMediator.prototype );
RadiateViewMediator.constructor = RadiateViewMediator;

RadiateViewMediator.prototype.createView = function () {
	const effectColor = this.object.properties.color;
	return new THREE.Mesh (
		new THREE.SphereGeometry( 10, 32, 32 ),
		new THREE.MeshLambertMaterial( { color: effectColor, opacity: 0.3, transparent: true } )
	);
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