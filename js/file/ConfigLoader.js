function ConfigLoader () {
	this.fileDialog = document.getElementById( 'config-file' );
}

ConfigLoader.prototype = ( function () {
	return {
		constructor: ConfigLoader,

		toggleFileDialog: function () {
			this.fileDialog.click();
		}
	};
} )();