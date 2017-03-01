function ObjectSelector ( mediator, renderingContext ) {
	Observable.call( this );
	this.mediator = mediator;
	this.renderingContext = renderingContext;

	this.raycaster = new THREE.Raycaster();
	this.gpuPicker = new THREE.GPUPicker( { renderer: this.renderingContext.renderer, debug: false } );
}

ObjectSelector.prototype = Object.create( Observable.prototype );
ObjectSelector.constructor = ObjectSelector;

ObjectSelector.prototype.init = function () {
	this.gpuPicker.setScene( this.renderingContext.scene );
	this.gpuPicker.setCamera( this.renderingContext.camera );

	this.renderingContext.renderer.domElement.addEventListener( 'mousemove', ( e ) => this.onMouseMove( e ) );
};

ObjectSelector.prototype.onMouseMove = function ( e ) {
	const selectedObject = this.getRayIntersection( e );
};

ObjectSelector.prototype.onWindowResize = function () {
	this.gpuPicker.needUpdate = true;
	this.gpuPicker.resizeTexture( window.innerWidth, window.innerHeight );
};

ObjectSelector.prototype.getRayIntersection = function ( e ) {
	this.gpuPicker.setScene( this.renderingContext.scene );

	const mousePos = new THREE.Vector2();

	mousePos.x = e.clientX;
	mousePos.y = e.clientY;

	const rayIntersectPos = new THREE.Vector2();

	rayIntersectPos.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	rayIntersectPos.y = ( e.clientX / window.innerWidth ) * 2 + 1;

	const intersection = this.gpuPicker.pick( mousePos, this.raycaster );
};