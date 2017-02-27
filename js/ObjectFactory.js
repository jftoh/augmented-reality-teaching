var ObjectFactory = function ( dome ) {
	this.dome = dome;
};

ObjectFactory.getInstance = function ( dome ) {
	return new ObjectFactory ( dome );
};

ObjectFactory.prototype.addObject = function ( objectName, objectType, properties ) {
	if ( this.dome.objects.has( objectName ) ) {
		console.error( 'Object already exists. Please try a different name' );
	} else {
		switch ( objectType ) {
			case 'Cube':
				this.dome.addObject( new Cube( objectName, properties ) );
				break;
			case 'CustomModel':
				this.dome.addObject( new CustomModel( objectName, properties ) );
				break;
		}
	}
};

ObjectFactory.prototype.addEffect = function( effectName, targetObjectName, effectType, properties ) {
	let object = this.dome.objects.get( targetObjectName );

	if ( object === undefined ) {
		console.error( 'Object does not exist in scene.' );
	} else {
		switch ( effectType ) {
			case 'Radiate':
				object.addEffect( new RadiateEffect( effectName, properties ) );
				break;
		}
	}
};