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

	this.editMode = false;
	this.configDisplayMode = false;

	this.parser = new Parser();
	this.configDisplay = new ConfigDisplay();
	this.configLoader = new ConfigLoader();
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
			this.editMode = true;

			let currObjModel = this.dome.focusOnNextChild();
			let currObjView = this.domeView.domeViewMediator.getChildMediatorView( currObjModel );

			this.transformControls.attach( currObjView );
			this.domeView.hud.domContainer.style.visibility = 'visible';
			setCurrObjDisplayText.call( this, currObjView.name );
			setTransformModeDisplayText.call( this, 'translate' );

			this.updateCameraFocus( currObjView );
		},

		returnToNavigationMode: function () {
			if ( this.editMode ) {
				this.transformControls.detach();
				this.orbitControls.reset();
				this.domeView.hud.domContainer.style.visibility = 'hidden';
				setCurrObjDisplayText.call( this, 'none' );
				this.editMode = false;
			}
		},

		updateCameraFocus: function ( object ) {
			this.orbitControls.target.copy( object.position );
			this.orbitControls.update();
		},

		removeObjectFromScene: function () {
			if ( this.editMode ) {
				let currObjectView = this.transformControls.object;
				let currObjectModel = this.dome.getChildByName( currObjectView.name );

				this.dome.removeObject( currObjectModel );

				if ( this.dome.hasNoChildren() ) {
					this.returnToNavigationMode();
				} else {
					this.cycleObjects();
				}
			}

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
		},

		saveToJSON: function () {
			alert( this.parser.parse( this.dome ) );
		},

		displayJSON: function () {
			if ( this.configDisplayMode ) {
				this.configDisplay.turnOffDisplay();
				this.configDisplayMode = false;
				this.orbitControls.enabled = true;
			} else {
				this.orbitControls.enabled = false;
				let displayJson = this.parser.parse( this.dome );
				this.configDisplay.setDisplayText( displayJson );
				this.configDisplay.turnOnDisplay();
				this.configDisplayMode = true;
			}
		},

		displayFileDialog: function () {
			this.configLoader.toggleFileDialog();
		}
	};
} )();