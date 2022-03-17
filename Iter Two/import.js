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

  // CSV file import
  const csv = 'data/spotify_songs.csv';
  var arrayToInsert = [];
  await csvtojson().fromFile(csv).then(source => {
    // Insert into the table
    var collectionName = 'test';
    var collection = dbConn.collection(collectionName);
    dbConn.listCollections({ name: collectionName })
      .next(async function (err, collinfo) {
        if (!collinfo) { // If the collection does not exist, create it
          // Fetching the all data from each row
          for (var i = 0; i < source.length; i++) {
            var oneRow = {
              track_id: 'spotify:track:' + source[i].track_id,
              track_name: source[i].track_name,
              track_artist: source[i].track_artist,
              track_popularity: source[i].track_popularity,
              track_album_id: 'spotify:album:' + source[i].track_album_id,
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
          
          // import json file
          await addJson();
        }
      });
  });
}

async function addJson() {
  // Get the collection
  var collectionName = 'test';
  var collection = dbConn.collection(collectionName);
  // Read the files
  let filename = 'test';
  for (let i = 0; i < 19; i++) {
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

async function main() {
  ALL_GENRES = await getAllGenres();
  importData();
}

main()