function CustomOBJModel( properties ) {
	CustomModel.call( this, properties );
	this.classType = 'CustomOBJModel';
	this.loadModel();
}

CustomOBJModel.prototype = Object.create( CustomModel.prototype );
CustomOBJModel.prototype.constructor = CustomOBJModel;

CustomOBJModel.prototype.loadModel = function () {
	var fileLoader = new THREE.OBJLoader();
	var that = this;

	fileLoader.load(
		this.assetDirectory,
		function ( obj ) {
			that.add( obj );
		}
	);
};