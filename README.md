#JavaScript-Defaultdict
======================

This project tries to emulate the python dictionary class defaultdict.

======================

##Simple usage

	var addressMap = defaultdict('Unknown');

	addressMap['bob'] = 'CA';

	console.log(addressMap.bob); //CA
	console.log(addressMap('bob')); //CA

	console.log(addressMap('jil')); //Unknown

	//the default value will be assigned to the key

	console.log(addressMap.jil); //Unknown    
								 

	addressMap = addressMap.toObject(); // {bob:'CA',jil:'Unknown'}

======================

##Function as a defaultvalue

	var presents = ['shoes','phone','tv','xbox'];

	var presentsMap = defaultdict(function(){return presents.pop();});

	presentsMap['bob'] = 'computer';

	console.log(presentsMap('bob')); // computer

	console.log(presentsMap('jil')); // xbox

	console.log(presentsMap('alice')); // tv


======================


##Advanced usage with nested defaultdicts

Suppose we have a records stored somewhere that are in this format

STATE				CITY						MAKE
CA				San Francisco					Ford
CA				San Francisco					Ford
CA				San Francisco					BWM
CA				San Jose						Lexus
FL				Miami							Honda
......

And we wanted to to get make an object that has the counts of each make
organized by state, and city. That would look something like

	var carsInEachCity = {
		'CA':{
			'San Francisco':{
				'Ford':2000,
				'Nissan': 400,
				'Honda': 5
			},
			'San Jose':{
				'BMW': 7575,
				'Lexus': 56
			}
		},
		'FL':{
			'Miami':{
				'Ford':2000,
				'Nissan': 400,
				'Honda': 5
			},
			
			'Orlando':{
				'Ford':23,
				'Nissan': 897,
				'Honda': 52,
				'GM': 3456
			}   
		}
	}

Usually one would loop through the records and do something like

	var carsInEachCity = {};

	var records = [
					{state:'CA',city:'San Jose',make:'BMW'},
					{state:'CA',city:'San Jose',make:'BMW'},
					{state:'CA',city:'San Jose',make:'Honda'},
					{state:'FL',city:'Miami',make:'Honda'},
					{state:'FL',city:'Miami',make:'Lexus'},
					{state:'CA',city:'San Jose',make:'BMW'},
					{state:'CA',city:'San Jose',make:'BMW'},
				  ];

	records.forEach(function(o){

		if(!carsInEachCity[o.state])
			carsInEachCity[o.state] = {};
		
		if(!carsInEachCity[o.state][o.city])
			carsInEachCity[o.state][o.city] = {};
		
		if(!carsInEachCity[o.state][o.city][o.make])
			carsInEachCity[o.state][o.city][o.make] = 0;
		
		carsInEachCity[o.state][o.city][o.make]++;
		
	});

	console.log(carsInEachCity);
	console.log(carsInEachCity['CA']['San Jose']['BMW']) //4
	console.log(carsInEachCity['CA']['San Jose']['Jeep']) //undefined

You can imagine the code getting pretty ugly the more nested things get


To do the same thing with default dict 

	var carsInEachCity = defaultdict(function () {
		return defaultdict(function () {
			return defaultdict(0);
		});
	});

	var records = [
					{state:'CA',city:'San Jose',make:'BMW'},
					{state:'CA',city:'San Jose',make:'BMW'},
					{state:'CA',city:'San Jose',make:'Honda'},
					{state:'FL',city:'Miami',make:'Honda'},
					{state:'FL',city:'Miami',make:'Lexus'},
					{state:'CA',city:'San Jose',make:'BMW'},
					{state:'CA',city:'San Jose',make:'BMW'},
				];
				

	records.forEach(function(o){
		carsInEachCity(o.state)(o.city)(o.make);
		carsInEachCity[o.state][o.city][o.make]++;	
	});


	console.log(carsInEachCity['CA']['San Jose']['BMW']) //4
	console.log(carsInEachCity['CA']['San Jose']['Jeep']) //undefined
	console.log(carsInEachCity('CA')('San Jose')('Jeep')) //0
	console.log(carsInEachCity['CA']['San Jose']['Jeep']) //0

	carsInEachCity = carsInEachCity.toObject();

	console.log(carsInEachCity);
	console.log(carsInEachCity['CA']['San Jose']['BMW']) //4
	console.log(carsInEachCity['CA']['San Jose']['Jeep']) //0

As you can see using defaultdict makes initializing nested objects a breeze.
Also it has the advantages of