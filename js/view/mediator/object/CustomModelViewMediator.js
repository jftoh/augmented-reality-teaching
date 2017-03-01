function CustomModelViewMediator ( customModel, viewMediatorFactory ) {
	ViewMediator.call( this, customModel, viewMediatorFactory );
	this.object.addObserver( 'EffectAdded', ( e ) => this.onEffectAdded( e ) );
}

CustomModelViewMediator.prototype = Object.create( ViewMediator.prototype );
CustomModelViewMediator.constructor = CustomModelViewMediator;

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
		},

		function ( progress ) {
			console.log( progress );
		},

		function ( error ) {
			console.log( error );
		}
	);

	container.position.set( coords[ 0 ], coords[ 1 ], coords[ 2 ] );

	return container;
};

