function Cube ( name, properties ) {
	EnvObject.call( this, name, properties );
	this.className = 'Cube';
}

Cube.prototype = Object.create( EnvObject.prototype );
Cube.prototype.constructor = Cube;