class RadiatingObject extends CustomObject {
    constructor ( mesh, maxRadius, color ) {
    	super( mesh );
    	this.maxRadius = maxRadius;

    	var radiation = new THREE.SphereGeometry( 0, 32, 32 );
    	var radiationMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: 0.3 } );
    	this.radiationMesh = new THREE.Mesh( radiation, radiationMaterial );
    }

    update () {

    }
}