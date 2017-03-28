function CustomModelFactory () {}

CustomModelFactory.prototype = ( function () {
	return {
		getModel: function ( modelProperties ) {
			switch ( modelProperties.assetFileType ) {
				case 'js':
					return new CustomJSModel( modelProperties );
				case 'json':
					return new CustomJSONModel( modelProperties );
				case 'obj':
					return new CustomOBJModel( modelProperties );
				case 'objmtl':
					return new CustomOBJMTLModel( modelProperties );
				default:
					return undefined;
			}
		}
	};
} )();