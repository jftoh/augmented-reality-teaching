function Dome ( name, properties ) {
    EnvObject.call( this, name, properties );
    this.className = 'Dome';
}

Dome.prototype = Object.create( EnvObject );
Dome.constructor = Dome;