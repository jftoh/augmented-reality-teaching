function SceneObject ( name, properties ) {
	EnvObject.call( this, name, properties );
	this.children = new Map();
}

SceneObject.prototype = Object.create( EnvObject.prototype );
SceneObject.constructor = SceneObject;

SceneObject.prototype.addObject = function ( object ) {
	object.parent = this;
	this.children.set( object.name, object );
	this.notify( 'ObjectAdded', { "object": object } );
};