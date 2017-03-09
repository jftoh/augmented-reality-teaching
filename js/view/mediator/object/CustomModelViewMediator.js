function CustomModelViewMediator ( customModel, viewMediatorFactory ) {
	ViewMediator.call( this, customModel, viewMediatorFactory );
}

CustomModelViewMediator.prototype = Object.create( ViewMediator.prototype );
CustomModelViewMediator.constructor = CustomModelViewMediator;

CustomModelViewMediator.prototype.addChild = function ( child ) {
	const mediator = this.mediatorFactory.getMediator( child );

    this.childMediators.set( child, mediator );
    this.view.add( mediator.view );

    for ( let childOfChild in child.objects ) {
        mediator.addChild( childofChild );
    }
};

CustomModelViewMediator.prototype.createView = function () {
	const container = new THREE.Object3D();
	const configFilePath = this.object.properties.filepath;
	const coords = this.object.properties.coordinates;

	let fileLoader = new THREE.JSONLoader();

	fileLoader.load(
		configFilePath,
		function ( geometry, materials ) {
			let material = new THREE.MultiMaterial( materials );
			let mesh = new THREE.Mesh( geometry, material );
			container.add( mesh );
		}
	);

	container.position.set( coords[ 0 ], coords[ 1 ], coords[ 2 ] );
	return container;
};

