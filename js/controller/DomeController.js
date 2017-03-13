var DomeController = function ( dome ) {
	this.dome = dome;
	this.view = new DomeView( this, dome );
	this.view.init();

	this.toggleFocusMode = function () {
		this.dome.objectFocus = !this.dome.objectFocus;
		console.log( 'focus mode: ' + this.dome.objectFocus );
	};
};

DomeController.prototype.onKeyDown = function ( e ) {
	console.log( 'function call: onKeyDown' );
	switch ( e.keyCode ) {
		case 79: // 'o' key
			this.toggleFocusMode();
			break;
	}
};