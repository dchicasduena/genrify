/**
* @author Nhu Nguyen, David Chicas
* @student_id 201916426, 201919354
* @course COMP 3100 - Web Programming
* @year 2022 
*/

// Import required modules
const fs = require('fs');
const request = require('request'); // "Request" library
var url = process.env.DB_URL;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url, { useUnifiedTopology: true });
var dbConn;

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret

var ALL_GENRES = []; // all available genres

async function importData() {
  // Connect to the database
  await client.connect().then((client) => {
    console.log('DB Connected!');
    dbConn = client.db('Playlist');
  }).catch(err => {
    console.log('DB Connection Error: ${err.message}');
  });
  // Arrange the data
  await arrangeData();
}

async function arrangeData() {
  let string = "";
  count = 0;
  var collection = dbConn.collection('all');
  let objs = await collection.find({}).toArray();
  for (let i = 74000; i < objs.length; i++) {
    let artist = objs[i].track_artist_id;
    let genre = await getArtistGenre(artist.substring(15));
    // if song has genre
    if (genre != null) {
      let song = {
        track_id: objs[i].track_id,
        track_name: objs[i].track_name,
        track_artist: objs[i].track_artist,
        playlist_name: objs[i].playlist_name,
        playlist_genre: fixGenre(genre, 'mainGenre'),
        playlist_subgenre: fixGenre(genre, 'subGenre'),
        track_album_id: objs[i].track_album_id,
        track_album_name: objs[i].track_album_name,
        duration_ms: objs[i].duration_ms,
      }
      // Insert 2000 songs in each json file
      if (count != Math.floor(i / 2000)) {
        count = Math.floor(i / 2000);
        string = '';
      }
      string += JSON.stringify(song) + ',\n';
      writeData('data/test' + count + '.json', string);
    } else {
      console.log(objs[i])
      console.log(i + ': ' + objs[i].track_name + ' has no genre');
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

// get all available genres
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

// get artist genre
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
          let artistGenres = body.genres
          resolve(artistGenres)
        });
      }
    })
  })
}

// arrange the genres into 2 categories
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

function writeData(filename, contents) {
  //Saves CSV contents
  var writeFile = fs.createWriteStream(filename, { flag: 'a' }) // create file and append
  writeFile.write('[') // write header
  writeFile.write(contents) // append report
  writeFile.end(']') // stop appending

  var writeFile = fs.createWriteStream(filename, { flag: 'w' }) // if program is ran again, delete and create new file

}

async function main() {
  ALL_GENRES = await getAllGenres();
  importData();
}

main()