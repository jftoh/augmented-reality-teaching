/**
 * Constructor
 * @param { DomeController } controller reference to dome controller
 * @param { Dome } dome       reference to dome model
 */
function DomeView ( dome ) {
	const FISHEYE_LENGTH = 1944;
	const DATA_TEXTURE_ARR_SIZE = 3888 * 1944 * 4;

	// reference to fisheye video feed
	this.videoContext = VideoContext.getDefaultCtx();

	// Three.js scene, camera, renderer
	this.renderingContext = createRenderingContext();

	// off-screen canvas to capture a single frame of the video feed
	this.offScreenCtx  = OffScreenCtx.getDefaultCtx( FISHEYE_LENGTH );

	// conversion of fisheye image into a panorama
	this.dewarpEngine = DewarpEngine.createInstance( this.offScreenCtx.fisheyeSrcArr );

	this.dome = dome;

	function createRenderingContext () {
		const domContainer = document.createElement( 'div' );

		document.body.appendChild( domContainer );

		return RenderingContext.getDefaultCtx( domContainer );
	}
}

DomeView.prototype = ( function () {

	/**
	 * Converts a single frame of the fisheye video feed into a panorama image.
	 * Updates the data texture with image data from the resultant panorama.
	 */
	var dewarpFrame = function () {
		let dataTextureArr = this.dewarpEngine.dewarp( this.offScreenCtx.getVidFramePixels( this.videoContext.videofeed ) );
		this.dome.updateDataTexture( dataTextureArr );
	};

	/**
	 * Scales the view to the current window size.
	 */
	var onWindowResize = function () {
	    this.renderingContext.camera.aspect = window.innerWidth / window.innerHeight;
	    this.renderingContext.camera.updateProjectionMatrix();

	    this.renderingContext.renderer.setSize( window.innerWidth, window.innerHeight );
	};

	/**
	 * [handleKeyDown description]
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	var handleKeyDown = function ( e ) {
		switch ( e.key ) {
			case 'Tab':
				this.controller.cycleObjects();
				e.preventDefault();
				break;
			case 'Escape':
				this.controller.returnToNavigationMode();
				e.preventDefault();
				break;
			case 'Backspace':
				this.controller.removeObject();
				e.preventDefault();
				break;
			case 't':
			case 's':
			case 'r':
				this.controller.toggleTransformMode( e.key );
				e.preventDefault();
				break;
			case 'e':
				this.controller.toggleEffect();
				e.preventDefault();
				break;
			default:
				return;
		}
	};

	return {
		constructor: DomeView,

		/**
		 * Initializes the view.
		 */
		init: function () {
			this.renderingContext.scene.add( this.dome );

			window.addEventListener( 'resize', ( e ) => onWindowResize.call( this ), false );
			window.addEventListener( 'keydown', ( e ) => handleKeyDown.call( this, e ) );

			this.videoContext.videofeed.onloadedmetadata = () => this.render();
		},

		/**
		 * Main render method for the environment.
		 */
		render: function () {
			requestAnimationFrame( () => this.render() );
			dewarpFrame.call( this );
			this.renderingContext.renderer.render( this.renderingContext.scene, this.renderingContext.camera );
		}
	};
} )();