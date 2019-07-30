var csvjson = require('csvjson');
var fs = require('fs');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017/hackathon";

const locais = [
	"R. Dr. Amadeu Sachi, 400 - Vila Formosa, Jundiaí - SP, 13214-280",
	"Av. Doroty Nano Martinasso, s/n - Vila Hortolandia, Jundiaí - SP, 13214-010",
	"R. Ítalo Primo Belini, 235 - Jardim Florestal, Jundiaí - SP, 13215-660",
	"Av. Paulo Benassi, 215 - Torres de São José, Jundiaí - SP, 13214-175",
	"Av. Armando Giassetti, 300 - Engordadouro, Jundiaí - SP, 13214-470"
];

fs.readFile('data/2019.csv', 'utf8', function (err, contents) {
    // console.log(err);
    // console.log(contents);

    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
    	if (err) {
    		console.log(err);
    		return;
		}
    	db = client.db('hackathon');

		var obj = csvjson.toObject(contents, {delimiter: ',', quote: '\"'});
		obj.forEach((item) => {
			var versions = item.body_styles.split(', ');
			versions.forEach((version) => {
				var veiculo = {
					marca: item.make,
					modelo: item.model + " " + version,
					ano: item.year,
					valor: randomValue(999) * 100,
					local: locais[randomValue(5) - 1],
					placa: randomPlate()
				}
				db.collection('veiculos').insertOne(veiculo);
				console.log("Vehicle saved: "+ JSON.stringify(veiculo));
			});
		});
    });
});

function randomValue(max) {
	return Math.floor(Math.random() * max) + 1;  
}

function randomPlate() {
	var plate = "";

	for(var i = 0; i < 3; i++) {
		var charCode = randomValue(26) + 64;
		var letter = String.fromCharCode(charCode);
		plate = plate + letter; 
	}

	for(var i = 0; i < 4; i++) {
		plate = plate + (randomValue(9)-1);
	}

	return plate;
}
