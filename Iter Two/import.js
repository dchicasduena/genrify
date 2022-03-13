/**
* @author Nhu Nguyen, David Chicas
* @student_id 201916426, 201919354
* @course COMP 3100 - Web Programming
* @year 2022 
*/

// Import required module csvtojson and mongodb packages
const fs = require('fs');
const csvtojson = require('csvtojson');
const mongodb = require('mongodb');
var url = 'mongodb://localhost:27017/Playlist';
var dbConn;

async function importData() {
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
    dbConn.listCollections({ name: collectionName })
        .next(async function (err, collinfo) {
            if (!collinfo) { // If the collection does not exist, create it
                // Read the files
                let filename = 'spotify';
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
        });

    // CSV file import
    const csv = 'data/spotify_songs.csv';
    var arrayToInsert = [];
    await csvtojson().fromFile(csv).then(source => {
        // Insert into the table
        var collectionName = 'Test';
        var collection = dbConn.collection(collectionName);
        dbConn.listCollections({ name: collectionName })
            .next(async function (err, collinfo) {
                if (!collinfo) { // If the collection does not exist, create it
                    // Fetching the all data from each row
                    for (var i = 0; i < source.length; i++) {
                        var oneRow = {
                            track_id: source[i].track_id,
                            track_name: source[i].track_name,
                            track_artist: source[i].track_artist,
                            track_popularity: source[i].track_popularity,
                            track_album_id: source[i].track_album_id,
                            track_album_name: source[i].track_album_name,
                            track_album_release_date: source[i].track_album_release_date,
                            playlist_name: source[i].playlist_name,
                            playlist_id: source[i].playlist_id,
                            playlist_genre: source[i].playlist_genre,
                            playlist_subgenre: source[i].playlist_subgenre,
                            danceability: source[i].danceability,
                            energy: source[i].energy,
                            key: source[i].key,
                            loudness: source[i].loudness,
                            mode: source[i].mode,
                            speechiness: source[i].speechiness,
                            acousticness: source[i].acousticness,
                            instrumentalness: source[i].instrumentalness,
                            liveness: source[i].liveness,
                            valence: source[i].valence,
                            tempo: source[i].tempo,
                            duration_ms: source[i].duration_ms,
                        };
                        arrayToInsert.push(oneRow);
                    }
                    await collection.insertMany(arrayToInsert, (err, result) => {
                        if (err) console.log(err);
                        if (result) {
                            console.log('Import CSV into database successfully.');
                        }
                    });
                }
            });
    });
}

importData();