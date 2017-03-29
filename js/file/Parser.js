function Parser () {}

Parser.prototype = ( function () {
	return {
		constructor: Parser,

		parseToJSON: function ( dome ) {
			var objArr = [];

			for ( let child of dome.children.values() ) {
				let childJson = {};
				childJson.name = child.name;
				childJson.className = child.className;
				childJson.properties = child.properties;
				objArr.push( childJson );
			}

			var compiledObject = { 'objects': objArr };

			return JSON.stringify( compiledObject, null, '\t' );
		},

		parseFromJSON: function ( loadedObject ) {
			return JSON.parse( loadedObject );
		}
	};
} )();