const dome = new Dome( 'Dome', {} );
const domeController = new DomeController( dome );

const objFactory = ObjectFactory.getInstance( dome );

objFactory.addObject( 'cube01', 'Cube', { "coordinates": [ 35, 115, 50 ], "length": 3 } );
objFactory.addObject( 'cube02', 'Cube', { "coordinates": [ 50, 50, 23 ], "length": 3 } );
objFactory.addObject( 'cube03', 'Cube', { "coordinates": [ 125, 125, 10 ], "length": 3 } );
objFactory.addEffect( 'radiate01', 'cube02', 'Radiate', { "color": 0x00ff00, "rateOfGrowth": 0.05 } );
objFactory.addObject( 'arrowhead', 'CustomModel', { "coordinates": [ 75, 25, 10 ], "filepath": "../config/arrowhead.js" } );