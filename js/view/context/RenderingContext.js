var RenderingContext = function ( scene, camera, renderer, orbitControls, transformControls ) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.orbitControls = orbitControls;
    this.transformControls = transformControls;
};

RenderingContext.getDefaultCtx = function ( container ) {
    const fieldOfView = 75;
    const nearClippingPlane = 0.1;
    const farClippingPlane = 1000;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( fieldOfView, width / height, nearClippingPlane, farClippingPlane );
    const renderer = new THREE.WebGLRenderer();
    const light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.85 );

    const orbitControls = new THREE.OrbitControls( camera );
    const transformControls = new THREE.TransformControls( camera );

    camera.position.x = -2.4;
    camera.position.y = -4.2;
    camera.position.z = 5;

    renderer.setSize( width, height );

    scene.add( camera );
    scene.add( light );

    scene.add( transformControls );

    container.appendChild( renderer.domElement );

    return new RenderingContext( scene, camera, renderer, orbitControls, transformControls );
};