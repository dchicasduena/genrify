/**
* @author Nhu Nguyen, David Chicas
* @student_id 201916426, 201919354
* @course COMP 3100 - Web Programming
* @year 2022 
*/

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // incoming objects are strings or arrays

const song = require('./controller/main'); // Here we import our code with the contacts operations
//const spotify = require('./model/get-song-info');
const mongo = require('./utils/db.js');

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret

var server;

async function createServer() {
  try {
    // we will only start our server if our database
    // starts correctly. Therefore, let's wait for
    // mongo to connect
    await mongo.connectToDB();
    // contacts resource paths
    app.get('/song', song.list_all);
    app.get('/song/:track_id', song.get_song);
    app.get('/song/genre/:playlist_genre', song.get_song_by_genre);
    app.get('/song/subgenre/:playlist_subgenre', song.get_song_by_subgenre);
    //app.get('/spotify/:track_id', spotify.getSongInfo);
    app.post('/song', song.add);
    app.delete('/song/:track_id', song.delete_song);
    // start the server
    server = app.listen(port, () => {
      console.log('Example app listening at http://localhost:%d', port);
    });
  } catch (err) {
    console.err(err)
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