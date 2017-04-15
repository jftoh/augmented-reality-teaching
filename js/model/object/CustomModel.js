function CustomModel ( name, properties ) {
	EnvObject.call( this, name, properties );
	this.className = 'CustomModel';
}

CustomModel.prototype = Object.create( EnvObject.prototype );
CustomModel.prototype.constructor = CustomModel;