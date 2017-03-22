/**
 * Constructor.
 * @param {Dome} dome reference to Dome object.
 */
function DomeController ( dome ) {
	this.dome = dome;
	this.domeView = new DomeView( this, dome );
	this.domeView.init();

	this.orbitControls = new THREE.OrbitControls( this.domeView.renderingContext.camera );
	this.transformControls = new THREE.TransformControls( this.domeView.renderingContext.camera,
														  this.domeView.renderingContext.renderer.domElement );
	this.domeView.renderingContext.scene.add( this.transformControls );
}

DomeController.prototype = ( function () {
	var setCurrObjDisplayText = function ( objectName ) {
		this.domeView.hud.currObjectDisplayText.innerHTML = 'Object on Focus: ' + objectName;
	};

	var setTransformModeDisplayText = function ( mode ) {
		this.domeView.hud.transformationModeDisplayText.innerHTML = 'Transformation Mode: ' + mode;
	};

	return {
		constructor: DomeController,

		cycleObjects: function () {
			let currObject = this.domeView.domeViewMediator.focusOnNextObject();
			this.transformControls.attach( currObject );
			this.domeView.hud.domContainer.style.visibility = 'visible';
			setCurrObjDisplayText.call( this, currObject.name );
			setTransformModeDisplayText.call( this, 'translate' );
		},

		returnToNavigationMode: function () {
			this.transformControls.detach();
			this.orbitControls.reset();
			this.domeView.hud.domContainer.style.visibility = 'hidden';
			setCurrObjDisplayText.call( this, 'none' );
		},

		updateCameraFocus: function ( object ) {
			this.orbitControls.target.copy( object.position );
			this.orbitControls.update();
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

			this.transformControls.setMode( displayText );
			setTransformModeDisplayText.call( this, displayText );
		},

		toggleEffect: function () {
			let currObject = this.transformControls.object;
			currObject.traverse( function ( object ) {
				if ( object.name.includes( 'radiate' ) ) {
					object.visible = !object.visible;
				}
			} );
		}
	};
} )();