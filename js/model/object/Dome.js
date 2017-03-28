/**
 * Constructor.
 * @param { String } name       [description]
 * @param { JSON } properties [description]
 */
function Dome ( name, properties ) {
    EnvObject.call( this, name, properties );
    this.className = 'Dome';

    this.childQueue = [];
}

Dome.prototype = Object.create( EnvObject.prototype );

Dome.prototype.constructor = Dome;

Dome.prototype.addObject = function ( envObject ) {
	envObject.parent = this;
	this.children.set( envObject.name, envObject );
	this.childQueue.push( envObject );
	this.notify( 'ObjectAdded', { "object": envObject } );
};

Dome.prototype.removeObject = function ( envObject ) {
	this.children.delete( envObject.name );
	this.childQueue.unshift();
	this.notify( 'ObjectRemoved', { "object": envObject } );
};

Dome.prototype.focusOnNextChild = function () {
	let currObjModel = this.childQueue.shift();
	this.childQueue.push( currObjModel );
	return currObjModel;
};

Dome.prototype.hasNoChildren = function () {
	return this.children.size === 0;
};
