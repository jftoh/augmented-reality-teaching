var DomeController = function ( dome ) {
	this.dome = dome;
	this.view = new MainView( this, dome );
	this.view.init();
};