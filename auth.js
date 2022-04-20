/**
* @author Nhu Nguyen & David Chicas
* @year 2022 
*/

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
// use .env file to load id and secret
const dotenv = require('dotenv');
const { apps } = require('open');
dotenv.config({ path: './.env' });

var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_uri = process.env.REDIRECT_URI; // Your redirect uri

const client = require('./utils/db.js');
const { response } = require('express');

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
module.exports.login = async (req, res) => {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization to Spotify
  var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
};

async function test(req, res, callback) {

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
          create_playlist(access_token, body.id, function get(res, err) {
            callback(err, res);
          }); // create playlist

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
}

// callback that manages the authentication, provided by Spotify API
module.exports.callback = async (request, response) => {
  test(request, response, function (err, res) {
    if (err) {
      console.log(err);
    } else {
      //console.log('url: ' + res);
      // response.send(res);
    }
  });
};

module.exports.refresh_token = async (req, res) => {

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
};

// creates a playlist with the information the usr gave
// in random.js
async function create_playlist(access_token, user_id, callback) {
  let time = new Date().toDateString();
  var options = {
    url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists', // create playlist for user
    body: JSON.stringify({ name: "Random Playlist", description: "playlist made through the internet // made " + time, public: true }),
    dataType: 'json',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    }
  }

  // post request to spotify
  request.post(options, (error, response, body) => {
    console.log('playlist information: ')
    var info = JSON.parse(body)
    console.log('Playlist created')
    callback(info.external_urls.spotify) // return the url of the playlist

    // after creating playlist add the songs to the playlist
    add_track(access_token, info.id, info.external_urls.spotify)
  })
}

async function add_track(access_token, playlist_id, url) {
  let collection = await _get_playlist_collection(); // get playlist from mongo 
  await collection.insertOne({url: url, playlist_id: playlist_id}); // insert the url into mongo
  let songObjs = await collection.find({ track_id: { $exists: true } }).toArray(); // turn it to an array
  let tracks = []

  // add tracks to array
  for (let i = 0; i < songObjs.length; i++) {
    tracks.push(songObjs[i].track_id)
    console.log(songObjs[i].track_id)
  }
  var options = {
    url: 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks',
    body: JSON.stringify({ uris: tracks }),
    dataType: 'json',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    }
  };

  // post request of array of songs to spotify
  request.post(options, (error, response, body) => {
    // console.log(body);
    console.log('Playlist added successfully.') // if successful
  })
}

async function _get_playlist_collection() {
  await client.connectToDB();
  let db = await client.getDb();
  return await db.collection('user_playlist'); // return the collection
};