/**
 * @author Toh Jian Feng
 *
 * The ObjectManager class renders the corresponding 3D models
 * onto the scene using the response object obtained from an instance of FileLoader.
 */

var ART = ART || {};

ART.ObjectManager = function () {};

ART.ObjectManager.prototype = {
    init: function ( scene, jsonObj ) {
        this._scene = scene;
        this._jsonObj = jsonObj;
    },

    loadObjects: function () {
        console.log( 'function call: loadObjects()' );
        var objects = this._jsonObj.objects;
        var numObjects = Object.keys( objects ).length;

        var currObject, objectType;

        for ( var i = 0; i < numObjects; i++ ) {
            currObject = objects[ i ];
            objectType = currObject.type;

            switch ( objectType ) {
                case 'cube':
                    renderCube( currObject, this._scene );
                    break;
                case 'sphere':
                    break;
                case 'custom':
                    break;
            }
        }
    },

    constructor: ART.ObjectManager
};

function renderCube ( cubeObject, scene ) {
    console.log( 'function call: renderCube' );
    var dimensions = cubeObject.dimensions;
    var position = cubeObject.position;

    var cubeGeometry = new THREE.CubeGeometry( dimensions.length,
                                               dimensions.width,
                                               dimensions.height );
    var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    var cubeMesh = new THREE.Mesh( cubeGeometry, cubeMaterial );
    cubeMesh.position.set( position[ 0 ], position[ 1 ], position[ 2 ] );
    scene.add( cubeMesh );
}