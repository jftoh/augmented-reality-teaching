function CustomJSONModel( properties ) {
	CustomModel.call( this, properties );
	this.classType = 'CustomJSModel';
	this.loadModel();
}

CustomJSONModel.prototype = Object.create( CustomModel.prototype );
CustomJSONModel.prototype.constructor = CustomJSONModel;

CustomJSONModel.prototype.loadModel = function () {
	var fileLoader = new THREE.ObjectLoader();
	var that = this;

	fileLoader.load(
		this.assetDirectory,
		function ( obj ) {
			that.add( obj );
		}
	);
};