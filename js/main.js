const dome = new Dome();
const domeController = new DomeController( dome );

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

		/*
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
		*/

		{
			'name': 'pc',
			'coordinates': [ 10, 20, 10 ],
			'classType': 'CustomModel',
			'assetFileType': 'objmtl',
			'assetDirectory': 'assets/pc/'
		},
	]
};

const modelFactory = new ModelFactory ( config.objects, dome );
modelFactory.loadObjects();