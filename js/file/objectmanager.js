/**
 * @author Toh Jian Feng
 *
 * The ObjectManager class renders the corresponding 3D models
 * onto the scene using the response object obtained from an instance of FileLoader.
 */
ObjectManager = function () {};

ObjectManager.prototype = {
    init: function ( scene, jsonObj ) {
        this._scene = scene;
        this._objects = jsonObj.objects;
        this._numObjects = Object.keys(this._objects).length;
        this._objArr = [];
    },

    loadObjects: function () {
        var currObject, objectType;

        for ( var i = 0; i < this._numObjects; i++ ) {
            currObject = this._objects[ i ];
            objectType = currObject.type;

            switch ( objectType ) {
                case 'cube':
                    renderCube( currObject, this._scene, this._objArr );
                    break;
                case 'sphere':
                    break;
                case 'custom':
                    break;
            }
        }
    },

    constructor: ObjectManager
};

function renderCube ( cubeObject, scene, objArr ) {
    var objectParent = new THREE.Object3D();
    // console.log( 'function call: renderCube' );
    var dimensions = cubeObject.dimensions;
    var position = cubeObject.position;

    var cubeGeometry = new THREE.CubeGeometry( dimensions.length,
                                               dimensions.width,
                                               dimensions.height );
    var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    var cubeMesh = new THREE.Mesh( cubeGeometry, cubeMaterial );

    var sphereGeometry = new THREE.SphereGeometry( 15, 32, 32 );
    var sphereMaterial = new THREE.MeshPhongMaterial( { color: 0x00ff00, opacity: 0.3, transparent: true } );
    var sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
    objectParent.add( cubeMesh );
    objectParent.add( sphereMesh );
    objectParent.position.set( cubeObject.position[0], cubeObject.position[1], cubeObject.position[2] );
    scene.add( objectParent );
    objArr.push( objectParent );
}