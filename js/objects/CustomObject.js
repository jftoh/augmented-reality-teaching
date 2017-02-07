class CustomObject {
    constructor ( mesh ) {
        this.mesh = mesh;
        this.position = mesh.position;
    }

    get mesh() { return this.mesh; }
    set mesh( mesh ) { this.mesh = mesh; }
}