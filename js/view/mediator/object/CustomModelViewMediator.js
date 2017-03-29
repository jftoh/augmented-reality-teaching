function CustomModelViewMediator ( customModel, viewMediatorFactory ) {
	ViewMediator.call( this, customModel, viewMediatorFactory );
}

CustomModelViewMediator.prototype = Object.create( ViewMediator.prototype );
CustomModelViewMediator.prototype.constructor = CustomModelViewMediator;

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
	const name = this.object.name;

	var fileLoader;

	switch ( this.object.properties.filetype ) {
		case 'js':
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

		case 'json':
			fileLoader = new THREE.ObjectLoader();

			fileLoader.load(
				configFilePath,
				function ( obj ) {
					container.add( obj );
				}
			);
			break;

		case 'obj':
			fileLoader = new THREE.OBJLoader();

			fileLoader.load(
				configFilePath,
				function ( obj ) {
					container.add( obj );
				}
			);
			break;

		case 'objmtl':
			fileLoader = new THREE.MTLLoader();
			fileLoader.setPath( configFilePath );

			fileLoader.load(
				( name + '.mtl' ),
				function ( materials ) {
					materials.preload();

					var objLoader = new THREE.OBJLoader();
					objLoader.setMaterials( materials );
					objLoader.setPath( configFilePath );
					objLoader.load( ( name + '.obj' ),
					                function ( obj ) {
										container.add( obj );
								    } );
				}
			);
			break;

	}

	container.position.set( coords[ 0 ], coords[ 1 ], coords[ 2 ] );
	return container;
};

