function Cube ( name, properties ) {
	SceneObject.call( this, name, properties );
	this.className = 'Cube';
}

Cube.prototype = Object.create( SceneObject.prototype );
Cube.constructor = Cube;