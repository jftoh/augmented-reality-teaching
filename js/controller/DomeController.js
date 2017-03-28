/**
 * Constructor.
 * @param {Dome} dome reference to Dome object.
 */
function DomeController ( dome ) {
	this.dome = dome;
	this.domeView = new DomeView( dome, this );
	this.domeView.init();
	this.renderingCtx = this.domeView.renderingContext;
}

DomeController.prototype = ( function () {
	/*
	var setCurrObjDisplayText = function ( objectName ) {
		this.domeView.hud.currObjectDisplayText.innerHTML = 'Object on Focus: ' + objectName;
	};

	var setTransformModeDisplayText = function ( mode ) {
		this.domeView.hud.transformationModeDisplayText.innerHTML = 'Transformation Mode: ' + mode;
	};
	*/

	return {
		constructor: DomeController,

		cycleObjects: function () {
			if ( this.dome.children.length > 0 ) {
				let currObject = this.dome.presentNextObject();
				this.renderingCtx.transformControls.attach( currObject );
				this.updateCameraFocus( currObject );
			} else {
				this.returnToNavigationMode();
			}

			// this.domeView.hud.domContainer.style.visibility = 'visible';
			// setCurrObjDisplayText.call( this, currObject.name );
			// setTransformModeDisplayText.call( this, 'translate' );
		},

		removeObject: function () {
			let currObject = this.renderingCtx.transformControls.object;
			this.dome.remove( currObject );
			this.cycleObjects();
		},

		returnToNavigationMode: function () {
			this.renderingCtx.orbitControls.reset();
			this.renderingCtx.transformControls.detach();
			// this.domeView.hud.domContainer.style.visibility = 'hidden';
			// setCurrObjDisplayText.call( this, 'none' );
		},

		updateCameraFocus: function ( object ) {
			this.renderingCtx.orbitControls.target.copy( object.position );
			this.renderingCtx.orbitControls.update();
		},

		toggleTransformMode: function ( mode ) {
			let displayText;

			switch ( mode ) {
				case 'r':
					displayText = 'rotate';
					break;
				case 's':
					displayText = 'scale';
					break;
				case 't':
					displayText = 'translate';
					break;
				default:
					return;
			}

			this.renderingCtx.transformControls.setMode( displayText );
			// setTransformModeDisplayText.call( this, displayText );
		},

		toggleEffect: function () {
			let currObject = this.renderingCtx.transformControls.object;
			currObject.traverse( function ( object ) {
				if ( object.name.includes( 'radiate' ) ) {
					object.visible = !object.visible;
				}
			} );
		}
	};
} )();