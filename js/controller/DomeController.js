var DomeController = function ( dome ) {
	this.dome = dome;
	this.view = new MainView( this, dome );
	this.view.init();
};

DomeController.prototype.onMouseMove = function ( selectedObject ) {
	this.setPanelText( selectedObject, 'On Hover' );
};

DomeController.prototype.setPanelText = function ( selectedObject, eventLabel ) {
	if ( selectedObject ) {
		this.view.descriptionPanel.text = `${ eventLabel }: ${ selectedObject.name }`;
	} else {
		this.view.descriptionPanel.text = `${ eventLabel }: ${ this.dome.name }`;
	}
};