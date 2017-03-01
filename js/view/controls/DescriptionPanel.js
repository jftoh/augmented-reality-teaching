var DescriptionPanel = function ()  {
	this.domContainer = document.createElement( 'div' );
	this.domContainer.id = 'panel';

	document.body.appendChild( this.domContainer );
};

DescriptionPanel.prototype = {
	set text ( text ) {
		this.domContainer.innerHTML = text;
	},

	get text () {
		return this.domContainer.innerHTML;
	}
};