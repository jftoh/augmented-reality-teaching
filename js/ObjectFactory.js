var ObjectFactory = function ( dome ) {
	this.dome = dome;
};

ObjectFactory.getInstance = function ( dome ) {
	return new ObjectFactory ( dome );
};

ObjectFactory.prototype.addObject = function ( objectName, objectType, properties ) {
	if ( this.objectExists( objectName ) ) {
		console.error( 'Object already exists. Please try a different name' );
	} else {
		let objToBeAdded = this.getObject( objectName, objectType, properties );
		this.dome.addObject( objToBeAdded );
	}

};

ObjectFactory.prototype.getObject = function ( objectName, objectType, properties ) {
	switch ( objectType ) {
		/* Scene Objects */
		case 'Cube':
			return new Cube( objectName, properties );
		case 'CustomModel':
			return new CustomModel( objectName, properties );

		/* Scene Effects */
		case 'Radiate':
			return new RadiateEffect( objectName, properties );

		/* Default Case */
		default:
			console.error( objectType + ': Incorrect Object Type.' );
			break;
	}
};

ObjectFactory.prototype.addEffect = function ( effectName, effectType, properties ) {
	if ( this.isStandaloneEffect( properties ) ) {
		this.addObject( effectName, effectType, properties );
	} else {
		this.attachEffectToObject( effectName, effectType, properties );
	}
};

ObjectFactory.prototype.attachEffectToObject = function ( effectName, effectType, properties ) {
	if ( !this.objectExists( properties.parentobj ) ) {
		console.error( 'Parent object is not defined.' );
	} else {
		if ( this.objectExists( effectName ) ) {
			console.error( 'Effect already exists. Please try a different name' );
		} else {
			let parentobj = this.dome.children.get( properties.parentobj );
			let effect = this.getObject( effectName, effectType, properties );
			parentobj.addObject( effect );
		}
	}
};


ObjectFactory.prototype.objectExists = function ( objectName ) {
	return this.dome.children.has( objectName );
};

ObjectFactory.prototype.isStandaloneEffect = function ( properties ) {
	return this.dome.children.get( properties.parentobj ) === undefined;
};