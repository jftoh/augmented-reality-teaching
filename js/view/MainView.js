var MainView = function ( controller, dome ) {
    // console.log( 'instantiating new Instance of MainView' );
    this.controller = controller;
    this.dome = dome;
    this.videoCtx = VideoContext.getDefaultCtx();
    this.videofeed = document.querySelector( 'video' );
    this.renderingCtx = this.createRenderingContext();
    this.offScrnCtx = OffScreenCtx.getDefaultCtx( 1944 );
    this.domeViewMediator = new DomeViewMediator( dome, new ViewMediatorFactory() );
    this.dewarpEngine = DewarpEngine.createInstance( this.offScrnCtx.fisheyeSrcArr );
    this.dataTextureArray32 = new Uint32Array( 3888 * 972 * 2 );
    this.dataTextureArray = new Uint8Array( 4 * 3888 * 1944 );
};

MainView.prototype.createRenderingContext = function () {
    // console.log( 'function call: createRenderingContext() ' );
    const domContainer = document.createElement( 'div' );

    document.body.appendChild( domContainer );

    return RenderingContext.getDefaultCtx( );
};

MainView.prototype.init = function () {
    // console.log( 'function call: init() ' );

    const scene = this.renderingCtx.scene;
    const domeObj = this.domeViewMediator.domeObj;

    scene.add( domeObj );
    window.addEventListener( 'resize', ( e ) => this.onWindowResize(), false );
    this.videofeed.onloadedmetadata = () => this.render();
};

MainView.prototype.dewarpFrame = function () {
    // this.dewarpEngine.dewarpWithGPU( Array.from( this.offScrnCtx.getVidFramePixels( this.videoCtx.videofeed ) ), this.offScrnCtx.fisheyeSrcArr );
    // this.dataTextureArray32 = this.dewarpEngine.dewarp32Bit( new Uint32Array( this.offScrnCtx.getVidFramePixels( this.videofeed ).buffer ) );
    this.dataTextureArray = this.dewarpEngine.dewarp( this.offScrnCtx.getVidFramePixels( this.videoCtx.videofeed ) );
    this.domeViewMediator.updateDataTexture( this.dataTextureArray );
   // this.dewarpWorker.postMessage( [ this.offScrnCtx.getVidFramePixels( this.videoCtx.videofeed ), this.offScrnCtx.fisheyeSrcArr ] );
};

MainView.prototype.render = function () {
    requestAnimationFrame( () => this.render() );
    this.renderingCtx.controls.update();
    this.dewarpFrame();
    this.renderingCtx.renderer.render( this.renderingCtx.scene, this.renderingCtx.camera );
};

MainView.prototype.onWindowResize = function () {
    console.log( 'function call: onWindowResize() ' );
    this.renderingCtx.camera.aspect = window.innerWidth / window.innerHeight;
    this.renderingCtx.camera.updateProjectionMatrix();

    this.renderingCtx.renderer.setSize( window.innerWidth, window.innerHeight );
};