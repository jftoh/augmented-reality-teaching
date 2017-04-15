function ConfigDisplay () {
	this.overlay = document.getElementById( 'black-overlay' );
	this.displayContent = document.getElementById( 'config-content' );
	this.displayOverlay = document.getElementById( 'config-overlay' );
	this.serverButton = document.getElementById( 'save-server' );

	this.serverButton.onclick = () => this.sendFileToServer( this.displayContent.innerHTML );
}

ConfigDisplay.prototype = ( function () {
	return {
		turnOnDisplay: function () {
			this.overlay.style.display = 'block';
			this.displayOverlay.style.display = 'block';
		},

		turnOffDisplay: function () {
			this.overlay.style.display = 'none';
			this.displayOverlay.style.display = 'none';
		},

		setDisplayText: function ( text ) {
			this.displayContent.innerHTML = text;
		},

		sendFileToServer: function ( text ) {
			var xmlreq = new XMLHttpRequest();

			
			xmlreq.onreadystatechange = function () {
				if ( xmlreq.readyState === 4 && xmlreq.status === 200 ) {
					console.log( xmlreq.responseText );
				}
			};
			

			xmlreq.open( "POST", "filehandler.php", true );
			xmlreq.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
			xmlreq.send( "config=" + JSON.stringify(text) );
		}
	};
} )();