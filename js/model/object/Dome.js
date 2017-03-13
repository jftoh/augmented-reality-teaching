/**
 * Constructor.
 * @param { String } name       [description]
 * @param { JSON } properties [description]
 */
function Dome ( name, properties ) {
    EnvObject.call( this, name, properties );
    this.className = 'Dome';

    this.objectOnFocus = undefined;

    this.objectFocusQueue = [];
}

Dome.prototype = Object.create( EnvObject.prototype );

Dome.prototype.constructor = Dome;

Dome.prototype.addObject = function ( envObject ) {
	envObject.parent = this;
	this.children.set( envObject.name, envObject );
	this.objectFocusQueue.push( envObject );
	this.notify( 'ObjectAdded', { "object": envObject } );
};

Dome.prototype.focusOnNextObject = function () {
	let currObject = this.objectFocusQueue.shift();
	this.objectOnFocus = currObject;
	this.objectFocusQueue.push( currObject );

	this.notify( 'ObjectOnFocus', { "object": currObject } );
};

Dome.prototype.focusOnPreviousObject = function () {
	let currObject = this.objectFocusQueue.pop();
	this.objectOnFocus = currObject;
	this.objectFocusQueue.unshift( currObject );

	this.notify( 'ObjectOnFocus', { "object": currObject } );
};
