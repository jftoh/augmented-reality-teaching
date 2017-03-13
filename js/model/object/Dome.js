/**
 * Constructor.
 * @param { String } name       [description]
 * @param { JSON } properties [description]
 */
function Dome ( name, properties ) {
    EnvObject.call( this, name, properties );
    this.className = 'Dome';

    this.objectFocus = false;
}

Dome.prototype = Object.create( EnvObject.prototype );
Dome.prototype.constructor = Dome;