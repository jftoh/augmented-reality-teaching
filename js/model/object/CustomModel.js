function CustomModel ( name, properties ) {
	SceneObject.call( this, name, properties );
	this.className = 'CustomModel';
}

CustomModel.prototype = Object.create( Observable.prototype );
CustomModel.constructor = EnvObject;