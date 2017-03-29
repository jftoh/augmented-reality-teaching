function HeadsUpDisplay () {
	this.domContainer = document.getElementById( 'hud' );
	this.currObjectDisplayText = document.getElementById( 'currObject' );
	this.transformationModeDisplayText = document.getElementById( 'transformMode' );
}

HeadsUpDisplay.prototype = ( function () {
	return {
		constructor: HeadsUpDisplay,
	};
} )();