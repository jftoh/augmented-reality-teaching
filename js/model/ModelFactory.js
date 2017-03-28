function ModelFactory ( objects, dome ) {
	this.dome = dome;
	this.objects = objects;
	this.customModelFactory = new CustomModelFactory();
}

ModelFactory.prototype = ( function () {
	return {
		loadObjects: function () {
			var model;
			for ( let i = 0; i < this.objects.length; i++ ) {
				switch ( this.objects[i].classType ) {
					case 'CustomModel':
						model = this.customModelFactory.getModel( this.objects[i] );
						break;
					default:
						break;
				}
				this.dome.add( model );
			}
		}
	};
} )();