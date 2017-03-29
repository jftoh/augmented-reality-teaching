function ConfigHandler ( dome ) {
	this.dome = dome;
	this.fileDialog = document.getElementById( 'config-file' );
	this.init();
	this.parser = new Parser();
	this.objectFactory = ObjectFactory.getInstance( this.dome );
}

ConfigHandler.prototype = ( function () {
	return {
		constructor: ConfigHandler,

		init: function() {
			this.fileDialog.addEventListener( 'change', ( e ) => this.handleFileSelect( e ), false );
		},

		handleFileSelect: function ( e ) {
			let configFile = e.target.files[ 0 ];
			let reader = new FileReader();

			var obj = null;

			reader.addEventListener( 'load', ( e ) => {
				let loadedObject = e.target.result;
				let objectArray = this.parser.parseFromJSON( loadedObject ).objects;

				this.objectFactory.addObjectsToDome( objectArray );
			} );

			reader.readAsText( configFile );
		},

		toggleFileDialog: function () {
			this.fileDialog.click();
		},

		convertToJSON: function ( dome ) {
			return this.parser.parseToJSON( dome );
		}


	};
} )();