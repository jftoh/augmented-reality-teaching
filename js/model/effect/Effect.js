function Effect ( name, properties ) {
	EnvObject.call( this, name, properties );
}

Effect.prototype = Object.create( EnvObject.prototype );
Effect.constructor = Effect;