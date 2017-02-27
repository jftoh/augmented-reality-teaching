function ObjectViewMediator ( object, mediatorFactory ) {
	ViewMediator.call( this, object, mediatorFactory );
}

ObjectViewMediator.prototype = Object.create( ViewMediator.prototype );
ObjectViewMediator.constructor = ObjectViewMediator;

ObjectViewMediator.prototype.onEffectAdded = function ( e ) {
	this.addChild( e.effect );
};
