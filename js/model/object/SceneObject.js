function SceneObject ( name, properties ) {
	EnvObject.call( this, name, properties );
	this.effects = new Map();
}

SceneObject.prototype = Object.create( EnvObject.prototype );
SceneObject.constructor = SceneObject;

SceneObject.prototype.addEffect = function ( effect ) {
	effect.parent = this;
	this.effects.set( effect.name, effect );
	this.notify( 'EffectAdded', { "effect": effect } );
};

SceneObject.prototype.removeEffect = function ( effectName ) {
	effect.parent = this;
	this.effects.delete( effect.name );
	this.notify( 'EffectRemoved', { "object": this, "effect": effectName } );
};