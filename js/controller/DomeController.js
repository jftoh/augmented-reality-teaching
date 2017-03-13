function DomeController ( dome ) {
	this.dome = dome;
	this.view = new DomeView( this, dome );
	this.view.init();
}

DomeController.prototype = ( function () {
	var focusOnNextObject = function () {
		this.dome.focusOnNextObject();
	};

	var focusOnPreviousObject = function () {
		this.dome.focusOnPreviousObject();
	};

	return {
		constructor: DomeController,

		onKeyDown: function ( e ) {
			switch ( e.keyCode ) {
				case 38: // up key
					focusOnPreviousObject.call( this );
					break;
				case 40: // down key
					focusOnNextObject.call( this );
					break;
				default:
					break;
			}
		}
	};
} )();