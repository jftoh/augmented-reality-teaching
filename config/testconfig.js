/*======================*/
/* Add All Objects Here */
/*======================*/

/*
objFactory.addObject( 'cube02',
                      'Cube',
					  {
						"coordinates": [ 50, 50, 23 ],
						"length": 3
					  } );

objFactory.addObject( 'arrowhead',
				      'CustomModel',
				      {
				      	"filetype": "single",
				      	"coordinates": [ 0, 25, 10 ],
				      	"filepath": "../assets/arrowhead.js"
				      } );
				      */

objFactory.addObject( 'router',
					  'CustomModel',
					  {
					  	"filetype": "json",
					  	"coordinates": [ 5, 10, -45 ],
					  	"filepath": "../assets/router_2.json"
					  } );

objFactory.addObject( 'pc',
					  'CustomModel',
					  {
					  	"filetype": "objmtl",
					  	"coordinates": [ 40, 10, -30 ],
					  	"filepath": "assets/pc/",
					  } );


/*
objFactory.addObject( 'iphone',
					  'CustomModel',
					  {
					  	"filetype": "js",
					  	"coordinates": [ 25, 10, -45 ],
					  	"filepath": "../assets/json/iphone.js"
					  } );
*/

/*======================*/
/* Add All Effects Here */
/*======================*/


objFactory.addEffect( 'radiate01',
					  'Radiate',
					  {
					  	"parentobj": "router",
					  	"color": 0x00ff00,
					  	"rateOfGrowth": 0.05
					  } );

// objFactory.addEffect( 'standalone_radiate',
// 					  'Radiate',
// 					  {
// 					  	"coordinates": [ 50, 100, 10 ],
// 					  	"color": 0x0000ff,
// 					  	"rateOfGrowth": 0.1
// 					  } );