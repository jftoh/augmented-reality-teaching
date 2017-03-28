function CustomOBJMTLModel( properties ) {
	CustomModel.call( this, properties );
	this.classType = 'CustomOBJMTLModel';
	this.loadModel();
}

CustomOBJMTLModel.prototype = Object.create( CustomModel.prototype );
CustomOBJMTLModel.prototype.constructor = CustomOBJMTLModel;

CustomOBJMTLModel.prototype.loadModel = function () {
	var fileLoader = new THREE.MTLLoader();
	var that = this;
	fileLoader.setPath( this.assetDirectory );

	fileLoader.load(
		( this.name + '.mtl' ),
		function ( materials ) {
			materials.preload();

			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials( materials );
			objLoader.setPath( that.assetDirectory );
			objLoader.load( ( that.name + '.obj' ),
					          function ( obj ) {
							  		that.add( obj );
						      } );
		}
	);
};