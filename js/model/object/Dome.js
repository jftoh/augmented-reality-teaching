function Dome ( name, properties ) {
    EnvObject.call( this, name, properties );
    this.className = 'Dome';
    this.objects = new Map();
}

Dome.prototype = Object.create( EnvObject.prototype );
Dome.constructor = Dome;

Dome.prototype.addObject = function ( object ) {
	object.parent = this;
	this.objects.set( object.name, object );
	this.notify( 'ObjectAdded', { "object": object } );
};