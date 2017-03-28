function CustomModel( properties ) {
	THREE.Group.call( this );

	this.classType = 'CustomModel';

	this.name = properties.name;
	this.assetDirectory = properties.assetDirectory;
	this.assetFileType = properties.assetFileType;
	this.position.set( properties.coordinates[ 0 ],  properties.coordinates[ 1 ],  properties.coordinates[ 2 ] );
}

CustomModel.prototype = Object.create( THREE.Group.prototype );
CustomModel.prototype.constructor = CustomModel;