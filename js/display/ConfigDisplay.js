function ConfigDisplay () {
	this.overlay = document.getElementById( 'black-overlay' );
	this.displayContent = document.getElementById( 'config-content' );
}

ConfigDisplay.prototype = ( function () {
	return {
		turnOnDisplay: function () {
			this.overlay.style.display = 'block';
			this.displayContent.style.display = 'block';
		},

		turnOffDisplay: function () {
			this.overlay.style.display = 'none';
			this.displayContent.style.display = 'none';
		},

		setDisplayText: function ( text ) {
			this.displayContent.innerHTML = text;
		}
	};
} )();