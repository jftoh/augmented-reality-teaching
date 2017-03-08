function CustomModelViewMediator ( customModel, viewMediatorFactory ) {
	ViewMediator.call( this, customModel, viewMediatorFactory );
}

CustomModelViewMediator.prototype = Object.create( ViewMediator.prototype );
CustomModelViewMediator.constructor = CustomModelViewMediator;

CustomModelViewMediator.prototype.createView = function () {
	const container = new THREE.Object3D();
	const configFilePath = this.object.properties.filepath;
	const coords = this.object.properties.coordinates;
	const meshType = this.object.properties.mesh;

	var fileLoader;

	switch ( meshType ) {
		case 'withGeometry':
			fileLoader = new THREE.JSONLoader();
			fileLoader.load(
				configFilePath,
				function ( geometry, materials ) {
					let material = new THREE.MultiMaterial( materials );
					let mesh = new THREE.Mesh( geometry, material );
					container.add( mesh );
				}
			);
			break;
		case 'withoutGeometry':
		 	fileLoader = new THREE.ObjectLoader();
			fileLoader.load(
				configFilePath,
				function ( object ) {
					container.add( object );
				}
			);
			break;
		default:
			console.error( 'Invalid JSON File.' );
			break;

	}

	container.position.set( coords[ 0 ], coords[ 1 ], coords[ 2 ] );

	return container;
};

