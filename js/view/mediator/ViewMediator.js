var ViewMediator = function ( objectType, mediatorFactory ) {
    this.objectType = objectType;
    this.mediatorFactory = mediatorFactory;
    this.object3D = this.makeObject3D();
    this.object3D.name = objectType.name;
    this.childMediators = new Map();
    this.object3D.traverse( ( object3D ) => {
        object3D.mediator = this;
    } );
};

ViewMediator.prototype.makeObject3D = function () {
    const container = new THREE.Object3D();

    container.add( new THREE.Object3D() );

    return container;
};

ViewMediator.prototype.addChild = function ( child ) {
    const mediator = this.mediatorFactory.getMediator( child );

    this.childMediators.set( child, mediator );
    this.object3D.children[ 0 ].add( mediator.object3D );

    for ( const childOfChild of child ) {
        mediator.addChild( childOfChild );
    }
};

ViewMediator.prototype.removeChild = function ( child ) {
    const mediator = this.childMediators.get( child );

    if (mediator) {
        this.object3D.children[ 0 ].remove( mediator.object3D );
        this.childMediators.delete( child );
    }
};

ViewMediator.prototype.onFrameRenderered = function () {
    for ( const childMediator of this.childMediators.values() ) {
        childMediator.onFrameRenderered();
    }
};