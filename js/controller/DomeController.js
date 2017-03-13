function DomeController ( dome ) {
	this.dome = dome;
	this.view = new DomeView( this, dome );
	this.view.init();
}

DomeController.prototype = ( function () {
	return {
		constructor: DomeController,

		onKeyDown: function ( e ) {
			switch ( e.keyCode ) {
				case 79: // 'o' key
					break;
			}
		}
	};
} )();