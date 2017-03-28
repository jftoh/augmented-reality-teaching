const domeView = new DomeView();
domeView.init();

const domeController = new DomeController( domeView );
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