function CustomJSModel( properties ) {
	CustomModel.call( this, properties );
	this.classType = 'CustomJSModel';
	this.loadModel();
}

CustomJSModel.prototype = Object.create( CustomModel.prototype );
CustomJSModel.prototype.constructor = CustomJSModel;

CustomJSModel.prototype.loadModel = function () {
	var fileLoader = new THREE.JSONLoader();
	var that = this;

	fileLoader.load(
		this.assetDirectory,
		function ( geometry, materials ) {
			let material = new THREE.MultiMaterial( materials );
			let mesh = new THREE.Mesh( geometry, material );
			that.add( mesh );
		}
	);
};