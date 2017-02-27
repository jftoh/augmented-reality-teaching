/**
 * ViewMediatorFactory.js
 *
 * Factory class to generate the corresponding ViewMediator for an EnvObject.
 */

/**
 * Default Constructor.
 */
var ViewMediatorFactory = function () {};

/**
 * Obtains the corresponding ViewMediator for the EnvObject.
 * @param  {[EnvObject]} object []
 * @return {[ViewMediator]}        [ ViewMediator associated with the EnvObject ]
 */
ViewMediatorFactory.prototype.getMediator = function ( object ) {
	switch ( object.className ) {
		// EnvObject Views
		case 'Dome':
			return new DomeViewMediator( object, this );
		case 'Cube':
			return new CubeViewMediator( object, this );
		case 'Custom':
			break;

		// Effect Views
		case 'RadiateEffect':
			return new RadiateViewMediator( object, this );
	}
};