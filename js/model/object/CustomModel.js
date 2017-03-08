function CustomModel ( name, properties ) {
	SceneObject.call( this, name, properties );
	this.className = 'CustomModel';
}

CustomModel.prototype = Object.create( SceneObject.prototype );
CustomModel.constructor = CustomModel;