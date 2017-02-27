function RadiateEffect ( name, properties ) {
	Effect.call( this, name, properties );
	this.className = 'RadiateEffect';
}

RadiateEffect.prototype = Object.create( Effect.prototype );
RadiateEffect.constructor = RadiateEffect;