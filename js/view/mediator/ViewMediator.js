/**
 * ViewMediator.js
 *
 * Generic Mediator class between the EnvObject and its corresponding View.
 */

/**
 * Constructor.
 * @param {[EnvObject]} object          [model associated with this view]
 * @param {[ViewMediatorFactory]} mediatorFactory [reference to the ViewMediatorFactory instance]
 */
var ViewMediator = function ( object, mediatorFactory ) {
    this.object = object;
    this.mediatorFactory = mediatorFactory;

    this.object.addObserver( 'ObjectAdded', ( e ) => this.onObjectAdded( e ) );
    this.object.addObserver( 'ObjectRemoved', ( e ) => this.onObjectRemoved( e ) );

    // Three.js View
    this.view = this.createView();
    this.view.name = object.name;
    this.view.className = object.className;

    this.childMediators = new Map();

    this.view.traverse( ( view ) => {
        view.mediator = this;
    } );
};

/**
 * creates a view for the associated model.
 * @return {[THREE.Object3D]} [view of the model]
 */
ViewMediator.prototype.createView = function () {
    const container = new THREE.Object3D();

    container.add( new THREE.Object3D() );

    return container;
};

/**
 * Adds a view and its corresponding mediator to this view instance as a child.
 * @param  {[THREE.Object3D]} child [ child view to be attached ]
 */
ViewMediator.prototype.addChild = function ( child ) {
    const mediator = this.mediatorFactory.getMediator( child );

    this.childMediators.set( child, mediator );
    this.view.children[ 0 ].add( mediator.view );

    for ( let childOfChild in child.objects ) {
        mediator.addChild( childofChild );
    }
};

/**
 * Removes an existing child view from the parent view.
 * @param  {[THREE.Object3D]} child [ child view attached to this view ]
 */
ViewMediator.prototype.removeChild = function ( child ) {
    const mediator = this.childMediators.get( child );

    if ( mediator ) {
        this.view.children[ 0 ].remove( mediator.view );
        this.childMediators.delete( child );
    }
};

/**
 * Render method for this view instance.
 * Renders the view and all child views attached to it.
 */
ViewMediator.prototype.onFrameRendered = function () {
    for ( const childMediator of this.childMediators.values() ) {
        childMediator.onFrameRendered();
    }
};

ViewMediator.prototype.onObjectAdded = function ( e ) {
    this.addChild( e.object );
};

ViewMediator.prototype.onObjectRemoved = function ( e ) {
    this.removeChild( e.object );
};