var ViewMediatorFactory = function () {};

ViewMediatorFactory.prototype.getMediator = function ( objectType ) {
	switch ( objectType.className ) {
		case 'Dome':
			return new DomeViewMediator( objectType, this );
	}
};