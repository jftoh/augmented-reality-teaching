function ObjectFactory ( dome ) {
	this.dome = dome;
}

ObjectFactory.prototype = ( function ()  {

	var objectExists = function ( objectName ) {
		return this.dome.children.has( objectName );
	};

	var isStandaloneEffect = function ( properties ) {
		return this.dome.children.get( properties.parentobj ) === undefined;
	};

	var getObject = function ( objectName, objectType, properties ) {
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

	var attachEffectToObject = function ( effectName, effectType, properties ) {
		if ( !objectExists.call( this, properties.parentobj ) ) {
			console.error( 'Parent object is not defined.' );
		} else {
			if ( objectExists.call( this, effectName ) ) {
				console.error( 'Effect already exists. Please try a different name' );
			} else {
				let parentobj = this.dome.children.get( properties.parentobj );
				let effect = getObject.call( this, effectName, effectType, properties );
				parentobj.addObject( effect );
			}
		}
	};

	return {
		constructor: ObjectFactory,

		addObject: function ( objectName, objectType, properties ) {
			if ( objectExists.call( this, objectName ) ) {
				console.error( 'Object already exists. Please try a different name' );
			} else {
				let objToBeAdded = getObject.call( this, objectName, objectType, properties );
				this.dome.addObject( objToBeAdded );
			}

		},

		addEffect: function ( effectName, effectType, properties ) {
			if ( isStandaloneEffect.call( this, properties ) ) {
				this.addObject( effectName, effectType, properties );
			} else {
				attachEffectToObject.call( this, effectName, effectType, properties );
			}
		}
	};
} )();

ObjectFactory.getInstance = function ( dome ) {
	return new ObjectFactory ( dome );
};