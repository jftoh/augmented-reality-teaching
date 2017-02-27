/**
 * Observable.js
 * Interface to provide objects with the ability to be informed of changes.
 */

/**
 * Default Constructor.
 */
var Observable = function () {
	this.observers = new Map(); // Map of observable events
};

/**
 * Adds an observable event to the Map.
 * @param  { [String] } label [ name of event ]
 * @param {Function} callback [ callback function ]
 */
Observable.prototype.addObserver = function ( label, callback ) {
	this.observers.has( label ) || this.observers.set( label, [] );
	this.observers.get( label ).push( callback );
};

/**
 * [Broadcasts a notification of an event that has occured.]
 * @param  { [String] } label [ name of event ]
 * @param  { [Object] } e     [ callback event ]
 */
Observable.prototype.notify = function ( label, e ) {
	const observers = this.observers.get( label );

	if ( observers && observers.length ) {
		observers.forEach( ( callback ) => { callback( e ) } );
	}
};