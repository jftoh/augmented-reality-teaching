function ConfigLoader () {
	this.fileDialog = document.getElementById( 'config-file' );
	this.init();
}

ConfigLoader.prototype = ( function () {
	return {
		constructor: ConfigLoader,

		init: function() {
			this.fileDialog.addEventListener( 'change', ( e ) => this.handleFileSelect( e ), false );
		},

		handleFileSelect: function ( e ) {
			let configFile = e.target.files[ 0 ];

			let reader = new FileReader();

			var obj = null;

			reader.onload = function ( event ) {
				obj = event.target.result;
				console.log( JSON.parse( obj ) );
			};

			reader.readAsText( configFile );
		},

		toggleFileDialog: function () {
			this.fileDialog.click();
		}
	};
} )();