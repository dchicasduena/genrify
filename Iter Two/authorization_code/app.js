var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
const open = require('open');

const dotenv = require('dotenv');
const { apps } = require('open');
dotenv.config({ path: './../.env' });

var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

const client = require('../utils/db.js');
const db = require('../utils/db.js');

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';
var app = express();

app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser());

app.get('/login', function (req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-modify';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function (req, res) {

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, async function (error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          console.log('user information: ')
          console.log(body);
          create_playlist(access_token, body.id); // create playlist

          // we can also pass the token to the browser to make requests from there
          res.redirect('/#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }));
        });
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function (req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});


// moved create playlist inside the callback so no need for this function
function getUserID(userID) {
  return new Promise(function (resolve, reject) {
    var id = userID;
    console.log('hello from inside getuserid function')
    resolve(id);
  }, (error) => { reject(error) }
  )
}

async function create_playlist(access_token, user_id) {
  let time = new Date().toLocaleString();
  var options = {
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
    body: JSON.stringify({ name: "Random Playlist", description: "playlist made through 3100 Project // made at " + time, public: true }),
    dataType: 'json',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    }
  };

  request.post(options, (error, response, body) => {
    console.log('playlist information: ')
    var info = JSON.parse(body)
    console.log(info);
    console.log('playlist created')

    add_track(access_token, info.id)
  })
}

async function add_track(access_token, playlist_id) {
  let collection = await _get_playlist_collection();
  let songObjs = await collection.find({}).toArray();
  let tracks = []

  for (let i = 0; i < songObjs.length; i++){
    tracks.push(songObjs[i].track_id)
    console.log(songObjs[i].track_id)
  }

  console.log('added songs to playlist');
  var options = {
    url: 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks',
    body:JSON.stringify({ uris: tracks}),
    dataType: 'json',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    }
  };

  request.post(options, (error, response, body) => {
    console.log(body);
    console.log('songs added')
    _remove_playlist_collection();
  })
}

async function _get_playlist_collection() {
  await client.connectToDB();
  let db = await client.getDb();
  return await db.collection('user_playlist');
};

async function _remove_playlist_collection() {
  await client.connectToDB();
  let db = await client.getDb();
  await db.collection('user_playlist').deleteMany({});
};

console.log('Listening on 8888');
app.listen(8888);
open('http://localhost:8888');
