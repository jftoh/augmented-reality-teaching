function CubeViewMediator ( cube, viewMediatorFactory ) {
	ViewMediator.call( this, cube, viewMediatorFactory );

	this.object.addObserver( 'EffectAdded', ( e ) => this.onEffectAdded( e ) );
}

CubeViewMediator.prototype = Object.create( ViewMediator.prototype );
CubeViewMediator.constructor = CubeViewMediator;

CubeViewMediator.prototype.createView = function () {
	const length = this.object.properties.length;
	const objCoords = this.object.properties.coordinates;

	const container = new THREE.Object3D();
	const mesh = new THREE.Mesh (
		new THREE.BoxGeometry( length, length, length ),
		new THREE.MeshBasicMaterial( { color: 0x000000 } )
	);

	mesh.position.set( objCoords[ 0 ], objCoords[ 1 ], objCoords[ 2 ] );
	container.position.set( objCoords[ 0 ], objCoords[ 1 ], objCoords[ 2 ] );

	container.add( mesh );
	return container;
};
