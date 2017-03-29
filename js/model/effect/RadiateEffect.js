function RadiateEffect ( name, properties ) {
	EnvObject.call( this, name, properties );
	this.className = 'RadiateEffect';
}

RadiateEffect.prototype = Object.create( EnvObject.prototype );
RadiateEffect.prototype.constructor = RadiateEffect;