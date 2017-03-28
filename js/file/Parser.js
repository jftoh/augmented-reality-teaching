function Parser () {}

Parser.prototype = ( function () {
	return {
		constructor: Parser,

		parse: function ( dome ) {
			var objArr = [];

			for ( let child of dome.children.values() ) {
				objArr.push( child.properties );
			}

			var compiledObject = { 'objects': objArr };

			return JSON.stringify( compiledObject, null, '\t' );
		}
	};
} )();