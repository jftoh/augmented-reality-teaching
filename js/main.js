const dome = new Dome();
const domeView = new DomeView( dome );
domeView.init();

const domeController = new DomeController( dome, domeView );
const customModelFactory = new CustomModelFactory();

var config = {
	'location': 'office',
	'objects': [
		{
			'name': 'router',
			'coordinates': [ 10, 0, 10 ],
			'classType': 'CustomModel',
			'assetFileType': 'json',
			'assetDirectory': 'assets/router_2.json'
		},

		{
			'name': 'scale',
			'coordinates': [ -5, 20, 5 ],
			'classType': 'CustomModel',
			'assetFileType': 'js',
			'assetDirectory': 'assets/multimaterial.js'
		},

		{
			'name': 'arrowhead',
			'coordinates': [ 0, 30, 10 ],
			'classType': 'CustomModel',
			'assetFileType': 'js',
			'assetDirectory': 'assets/arrowhead.js'
		},

		{
			'name': 'pc',
			'coordinates': [ 10, 20, 10 ],
			'classType': 'CustomModel',
			'assetFileType': 'objmtl',
			'assetDirectory': 'assets/pc/'
		},
	]
};

var objects = config.objects;

for ( let i = 0; i < objects.length; i++ ) {
	let model = customModelFactory.getModel( objects[ i ] );
	domeView.dome.add( model );
}

console.log( domeView.dome );