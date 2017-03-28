/**
 * EnvObject.js
 *
 * Model to represent objects in a scene.
 */

/**
 * Constructor.
 * @param { String } name       [description]
 * @param { JSON } properties [description]
 */
function EnvObject ( name, properties ) {
	Observable.call( this );
    this.name = name;
    this.properties = properties;

    this.children = new Map();
}

EnvObject.prototype = Object.create( Observable.prototype );
EnvObject.prototype.constructor = EnvObject;

EnvObject.prototype.addObject = function ( envObject ) {
	envObject.parent = this;
	this.children.set( envObject.name, envObject );
	this.notify( 'ObjectAdded', { "object": envObject } );
};

EnvObject.prototype.removeObject = function ( envObject ) {
	this.children.delete( envObject.name );
	this.notify( 'ObjectDeleted', { "object": envObject } );
};

EnvObject.prototype.getChildByName = function ( objectName ) {
	return this.children.get( objectName );
};