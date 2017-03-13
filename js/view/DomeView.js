/**
 * Constructor
 * @param { DomeController } controller reference to dome controller
 * @param { Dome } dome       reference to dome model
 */
function DomeView ( controller, dome ) {
	const FISHEYE_LENGTH = 1944;
	const DATA_TEXTURE_ARR_SIZE = 3888 * 1944 * 4;

	// references to controller and model
	this.controller = controller;
	this.dome = dome;

	this.domeViewMediator = new DomeViewMediator( dome, new ViewMediatorFactory() );

	// reference to fisheye video feed
	this.videoContext = VideoContext.getDefaultCtx();

	// Three.js scene, camera, renderer
	this.renderingContext = ( function () {
		const domContainer = document.createElement( 'div' );

		document.body.appendChild( domContainer );

		return RenderingContext.getDefaultCtx();
	} )();

	// off-screen canvas to capture a single frame of the video feed
	this.offScreenCtx  = OffScreenCtx.getDefaultCtx( FISHEYE_LENGTH );

	// conversion of fisheye image into a panorama
	this.dewarpEngine = DewarpEngine.createInstance( this.offScreenCtx.fisheyeSrcArr );
	this.dataTextureArr = new Uint8Array( DATA_TEXTURE_ARR_SIZE );
}

DomeView.prototype = ( function () {

	/**
	 * Converts a single frame of the fisheye video feed into a panorama image.
	 * Updates the data texture with image data from the resultant panorama.
	 */
	var dewarpFrame = function () {
		this.dataTextureArr = this.dewarpEngine.dewarp( this.offScreenCtx.getVidFramePixels( this.videoContext.videofeed ) );
		this.domeViewMediator.updateDataTexture( this.dataTextureArr );
	};

	/**
	 * Scales the view to the current window size.
	 */
	var onWindowResize = function () {
	    this.renderingContext.camera.aspect = window.innerWidth / window.innerHeight;
	    this.renderingContext.camera.updateProjectionMatrix();

	    this.renderingContext.renderer.setSize( window.innerWidth, window.innerHeight );
	};

	return {
		constructor: DomeView,

		/**
		 * Initializes the view.
		 */
		init: function () {
			const scene = this.renderingContext.scene;
			const threeJsView = this.domeViewMediator.view;

			scene.add( threeJsView );

			window.addEventListener( 'resize', ( e ) => onWindowResize.call( this ), false );

			this.videoContext.videofeed.onloadedmetadata = () => this.render();
		},

		/**
		 * Main render method for the environment.
		 */
		render: function () {
			requestAnimationFrame( () => this.render() );
			this.renderingContext.controls.update();
			dewarpFrame.call( this );
			this.domeViewMediator.onFrameRendered();
			this.renderingContext.renderer.render( this.renderingContext.scene, this.renderingContext.camera );
		}
	};
} )();