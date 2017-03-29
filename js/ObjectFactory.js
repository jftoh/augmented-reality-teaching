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
			case 'RadiateEffect':
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

		addObjectsToDome: function ( objects ) {
			for ( let i = 0; i < objects.length; i++ ) {
				let object = objects[ i ];
				this.addObject( object );
			}
		},

		addEffectsToDome: function ( effects ) {
			for ( let i = 0; i < effects.length; i++ ) {
				let effect = effects[ i ];
				this.addEffect( effect );
			}
		},

		addObject: function ( object ) {
			let objectName = object.name;
			let objectType = object.className;
			let objectProps = object.properties;

			if ( objectExists.call( this, objectName ) ) {
				console.error( objectName + ' already exists. Please try a different name' );
			} else {
				let objToBeAdded = getObject.call( this, objectName, objectType, objectProps );
				this.dome.addObject( objToBeAdded );
			}
		},

		addEffect: function ( effect ) {
			let effectName = effect.name;
			let effectType = effect.className;
			let effectProps = effect.properties;
			if ( isStandaloneEffect.call( this, effectProps ) ) {
				this.addObject( effectName, effectType, effectProps );
			} else {
				attachEffectToObject.call( this, effectName, effectType, effectProps );
			}
		}
	};
} )();

ObjectFactory.getInstance = function ( dome ) {
	return new ObjectFactory ( dome );
};