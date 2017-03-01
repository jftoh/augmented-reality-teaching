var RenderingContext = function ( scene, camera, renderer, controls ) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;
};

RenderingContext.getDefaultCtx = function ( ) {
    const fieldOfView = 75;
    const nearClippingPlane = 0.1;
    const farClippingPlane = 1000;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( fieldOfView, width / height, nearClippingPlane, farClippingPlane );
    const renderer = new THREE.WebGLRenderer();
    const controls = new THREE.OrbitControls( camera );
    const light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.85 );

    camera.position.z = 5;

    renderer.setSize( width, height );

    scene.add( camera );
    scene.add( light );

    document.body.appendChild( renderer.domElement );

    return new RenderingContext( scene, camera, renderer, controls );
};