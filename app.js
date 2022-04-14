/**
* @author Nhu Nguyen & David Chicas
* @year 2022 
*/

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');

app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // incoming objects are strings or arrays

const song = require('./controller/main');
const random = require('./random');
const mongo = require('./utils/db.js');
const auth = require('./auth');

var server;

async function createServer() {
  try {
    // we will only start our server if our database
    // starts correctly. Therefore, let's wait for
    // mongo to connect
    await mongo.connectToDB();

    app.use(express.static(__dirname + '/view'))
      .use(cors())
      .use(cookieParser());

    // contacts resource paths
    // song modules
    app.get('/song', song.list_all);
    app.get('/song/:track_id', song.get_song);
    app.get('/song/genre/:playlist_genre', song.get_song_by_genre);
    app.get('/song/subgenre/:playlist_subgenre', song.get_song_by_subgenre);
    app.post('/song', song.add);
    app.delete('/song/:track_id', song.delete_song);
    // genre modules
    app.get('/genre', song.get_all_genre);
    app.get('/subgenre/:genre', song.get_subgenres_by_genre);
    // random modules
    app.get('/random', random.getData);
    app.get('/random/genre/:genre', random.getSubGenre);
    app.get('/random/playlist/:num/:subgenre', random.createPlaylist);
    app.get('/random/playlist', random.getPlaylist);
    app.get('/random/url', random.getPlaylistUrl);

    // auth modules
    app.get('/login', auth.login);
    app.get('/callback', auth.callback);
    app.get('refresh_token', auth.refresh_token);

    // start the server
    server = app.listen(port, () => {
      console.log('Example app listening at http://localhost:%d', port);
    });
  } catch (err) {
    console.log(err)
  }
}
createServer();

// I created this callback function to capture
// when for when we kill the server. 
// This will avoid us to create many mongo connections
// and use all our computer resources
process.on('SIGINT', () => {
  console.info('SIGINT signal received.');
  console.log('Closing Mongo Client.');
  server.close(async function () {
    let msg = await mongo.closeDBConnection();
    console.log(msg);
  });
});

module.exports = { app };
