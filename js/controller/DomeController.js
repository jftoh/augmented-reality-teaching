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
	return {
		constructor: DomeController,

		cycleObjects: function () {
			let currObject = this.domeView.domeViewMediator.focusOnNextObject();
			this.transformControls.attach( currObject );
		},

		returnToNavigationMode: function () {
			this.transformControls.detach();
			this.orbitControls.reset();
		},

		updateCameraFocus: function ( object ) {
			this.orbitControls.target.copy( object.position );
			this.orbitControls.update();
		},

		toggleTransformMode: function ( mode ) {
			switch ( mode ) {
				case 'r':
					this.transformControls.setMode( 'rotate' );
					return;

				case 's':
					this.transformControls.setMode( 'scale' );
					return;

				case 't':
					this.transformControls.setMode( 'translate' );
					return;
				default:
					return;
			}
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