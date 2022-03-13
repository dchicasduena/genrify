const fs = require('fs');
const mongodb = require('mongodb');
var url = 'mongodb://localhost:27017/Playlist';
var dbConn;


async function importData(filename) {
    // Connect to the database
    await mongodb.MongoClient.connect(url, {
        useUnifiedTopology: true,
    }).then((client) => {
        console.log('DB Connected!');
        dbConn = client.db();
    }).catch(err => {
        console.log('DB Connection Error: ${err.message}');
    });
    // Get the collection
    var collectionName = 'Spotify';
    var collection = dbConn.collection(collectionName);

    // Read the files
    for (let i = 1; i < 11; i++) {
        let spotifyData = fs.readFileSync('data/' + filename + i + '.json');
        let data = await JSON.parse(spotifyData);

        // Insert into the table 
        await collection.insertMany(data, (err, result) => {
            if (err) console.log(err);
            if (result) {
                console.log('Import file ' + filename + i + ' into database successfully.');
            }
        });
    }
}

importData('spotify');