function ConfigDisplay () {
	this.overlay = document.getElementById( 'black-overlay' );
	this.displayContent = document.getElementById( 'config-content' );
	this.displayOverlay = document.getElementById( 'config-overlay' );
	this.serverButton = document.getElementById( 'save-server' );
	this.localButton = document.getElementById( 'save-local' );

	this.savelink = document.createElement( 'a' );

	this.serverButton.onclick = () => this.sendFileToServer( this.displayContent.innerHTML );
	this.localButton.onclick = () => this.saveToLocalFile( this.displayContent.innerHTML  );
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
		},

		saveToLocalFile: function ( json ) {
			let timestamp = Math.floor( Date.now() );
			let uriContent = 'data:text/plain;charset=utf-8,' + encodeURIComponent( json );
			this.savelink.setAttribute( 'href', uriContent );
			this.savelink.setAttribute( 'download', 'config_' + timestamp + '.json');
			this.savelink.click();
		}
	};
} )();