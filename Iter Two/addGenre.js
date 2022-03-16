/**
* @author Nhu Nguyen, David Chicas
* @student_id 201916426, 201919354
* @course COMP 3100 - Web Programming
* @year 2022 
*/

// Import required module csvtojson and mongodb packages
const fs = require('fs');
const csvtojson = require('csvtojson');
const request = require('request'); // "Request" library
const mongodb = require('mongodb');
var url = 'mongodb://localhost:27017/Playlist';
var dbConn;

const dotenv = require('dotenv');
const { apps } = require('open');
const e = require('express');

dotenv.config({ path: './.env' });

var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

var ALL_GENRES = [];

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
  var collectionName = 'spotify';
  var collection = dbConn.collection(collectionName);
  dbConn.listCollections({ name: collectionName })
    .next(async function (err, collinfo) {
      if (!collinfo) { // If the collection does not exist, create it
        // Read the files
        let filename = 'spotify';
        for (let i = 1; i < 2; i++) {
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

  
    // Insert into the table
    var collectionName = 'all_songs';
    var collection = dbConn.collection(collectionName);
    dbConn.listCollections({ name: collectionName })
      .next(async function (err, collinfo) {
        if (!collinfo) { // If the collection does not exist, create it
          // Arrange the data
          await arrangeData();
        }
      });
}

async function arrangeData() {
  let csvString = "";
  var arrayToInsert = [];
  var collection = dbConn.collection('spotify');
  let objs = await collection.find({}).toArray();
  for (let playlist in objs) {
    for (let num in objs[playlist].tracks) {
      let artist = objs[playlist].tracks[num].artist_uri;
      let genre = await getArtistGenre(artist.substring(15));

      let song = {
        track_id: objs[playlist].tracks[num].track_uri,
        track_name: objs[playlist].tracks[num].track_name,
        track_artist: objs[playlist].tracks[num].artist_name,
        playlist_name: objs[playlist].name,
        playlist_genre: fixGenre(genre, 'mainGenre'),
        playlist_subgenre: fixGenre(genre, 'subGenre'),
        track_album_id: objs[playlist].tracks[num].album_uri,
        track_album_name: objs[playlist].tracks[num].album_name,
        duration_ms: objs[playlist].tracks[num].duration_ms,
      }
      csvString+=
      `{"track_id":"${song.track_id}"
      ,"track_name":"${song.track_name}"
      ,"track_artist":"${song.track_artist}"
      ,"playlist_name":"${song.playlist_name}"
      ,"playlist_genre":"${song.playlist_genre}"
      ,"playlist_subgenre":"${song.playlist_subgenre}"
      ,"track_album_id":"${song.track_album_id}"
      ,"track_album_name":"${song.track_album_name}"
      ,"duration_ms":"${song.duration_ms}"
      },`
      
      writeData('test.json', csvString)
      arrayToInsert.push(song);
    }
  }

}

// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

function getAllGenres() {
  return new Promise(function (resolve, reject) {
    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        // use the access token to access the Spotify Web API
        var token = body.access_token;
        var options = {
          url: 'https://api.spotify.com/v1/recommendations/available-genre-seeds',
          headers: {
            'Authorization': 'Bearer ' + token
          },
          json: true
        };

        request.get(options, function (error, response, body) {
          resolve(body.genres)
        });
      }
    })
  })
}

function getArtistGenre(artist_id) {
  return new Promise(function (resolve, reject) {
    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        // use the access token to access the Spotify Web API
        var token = body.access_token;
        var options = {
          url: 'https://api.spotify.com/v1/artists/' + artist_id,
          headers: {
            'Authorization': 'Bearer ' + token
          },
          json: true
        };

        request.get(options, function (error, response, body) {
          let genres = []
          let artistGenres = body.genres
          resolve(artistGenres)
        });
      }
    })
  })
}

function fixGenre(artistGenres, type) {
  let mainList = [];
  if (type == 'mainGenre') {
    for (let i = 0; i < artistGenres.length; i++) {
      if (ALL_GENRES.includes(artistGenres[i].replace(/\s+/g, '-'))) {
        mainList.push(artistGenres[i])
      }
    }
  } else {
    for (let i = 0; i < artistGenres.length; i++) {
      if (!ALL_GENRES.includes(artistGenres[i].replace(/\s+/g, '-'))) {
        mainList.push(artistGenres[i])
      }
    }
  }

  return mainList;
}

function writeData(filename,contents){
    //Saves CSV contents
    var writeFile = fs.createWriteStream(filename, {flag: 'a'}) // create file and append
    writeFile.write('[') // write header
    writeFile.write(contents) // append report
    writeFile.end(']') // stop appending

    var writeFile = fs.createWriteStream(filename, {flag: 'w'}) // if program is ran again, delete and create new file

}

async function main() {
  ALL_GENRES = await getAllGenres();
  importData();
}

main()