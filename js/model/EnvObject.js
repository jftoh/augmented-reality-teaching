/**
 * EnvObject.js
 *
 * Model to represent objects in a scene.
 */

/**
 * Constructor.
 * @param {[type]} name       [description]
 * @param {[type]} properties [description]
 */
function EnvObject ( name, properties ) {
	Observable.call( this );
    this.name = name;
    this.properties = properties;
}

EnvObject.prototype = Object.create( Observable.prototype );
EnvObject.constructor = EnvObject;