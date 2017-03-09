/*======================*/
/* Add All Objects Here */
/*======================*/

objFactory.addObject( 'cube01',
	                  'Cube',
					  {
					  	"coordinates": [ 35, 115, 50 ],
						"length": 3
					  } );

objFactory.addObject( 'cube02',
                      'Cube',
					  {
						"coordinates": [ 50, 50, 23 ],
						"length": 3
					  } );

objFactory.addObject( 'multimaterialtest',
	                  'CustomModel',
	                  {
	                  	"coordinates": [ 0, 5, 10 ],
	                  	"filepath": "../assets/multimaterial.js"
	                  } );

objFactory.addObject( 'arrowhead',
				      'CustomModel',
				      {
				      	"coordinates": [ 0, 25, 10 ],
				      	"filepath": "../assets/arrowhead.js"
				      } );

/*======================*/
/* Add All Effects Here */
/*======================*/


objFactory.addEffect( 'radiate01',
					  'Radiate',
					  {
					  	"parentobj": "cube02",
					  	"color": 0x00ff00,
					  	"rateOfGrowth": 0.05
					  } );

objFactory.addEffect( 'standalone_radiate',
					  'Radiate',
					  {
					  	"coordinates": [ 50, 100, 10 ],
					  	"color": 0x0000ff,
					  	"rateOfGrowth": 0.1
					  } );


objFactory.addEffect( 'arrowhead_radiate',
	                  'Radiate',
	                  {
	                  	"parentobj": "arrowhead",
	                  	"color": 0x0000ff,
	                  	"rateOfGrowth": 0.05
	                  } );