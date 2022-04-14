/**
* @author Nhu Nguyen & David Chicas
* @year 2022 
*/

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
let fs = require('fs');
const client = require('./utils/db.js');

var songs = [] // array of all songs
var genreList = []; // list of all genres
var subGenreList = []; // list of all subgenres
var userGenre = []; // list of user genres
var userSubgenre = []; // list of user subgenres
var userPlaylist = [];
var playlistLength = '';

const axios = require('axios');
const { json } = require('express');
var myurl = 'http://localhost:' + process.env.PORT;

// Let's configure the base url
const instance = axios.create({
    baseURL: myurl,
    headers: { 'content-type': 'application/json' }
});

async function _get_playlist_collection() {
    await client.connectToDB();
    let db = await client.getDb();
    return await db.collection('user_playlist'); // return the collection
};

module.exports.getData = async (req, res) => {
    const genres = await instance.get('/genre'); // get all genre data from server
    for (let i in genres.data) {
        genreList.push(genres.data[i].genre);
    }
    // console.log(genreList);
    res.send(genreList);
}

// Return subgenres of user genres
module.exports.getSubGenre = async (req, res) => {
    let genre = req.params.genre.split(',');
    // console.log(genre.length);
    let list = [];
    let sublist = [];
    for (let i = 0; i < genre.length; i++) {
        // console.log('genre: ' + genre[i]);
        const data = await instance.get('subgenre/' + genre[i]);
        let subGenre = data.data[0].subgenre;
        // console.log(subGenre);
        for (let j = 0; j < subGenre.length; j++) {
            sublist.push(subGenre[j]);
        }
        list.push(sublist);
        sublist = [];
    }
    res.send(list);
}

// create recommended playlist for user
module.exports.createPlaylist = async (req, res) => {
    let num = req.params.num;
    let userSubgenre = req.params.subgenre.split(',');
    let playlist = [];
    let count = 0; // avoid infinite loop
    let subGenreSongs = new Array(userSubgenre.length);

    // get all songs of user subgenres
    for (let i in userSubgenre) {
        let subgenre = await instance.get('/song/subgenre/' + userSubgenre[i]);
        subGenreSongs[i] = subgenre.data;
    }

    console.log('user playlist created:')
    while (playlist.length < num && count < 100) {
        let rand = Math.floor(Math.random() * userSubgenre.length);
        let song = await recommendSong(subGenreSongs[rand]); // get a random song from user subgenre
        let flag = false;
        for (let i in playlist) {
            if (playlist[i].track_id == song.track_id) { // if the song is already in the playlist
                console.log('Song is already in playlist.');
                count++;
                flag = true;
                break;
            }
        }
        if (!flag) { // add song to playlist
            playlist.push(song)
        }
    }
    userPlaylist = playlist;
    console.log(playlist)

    // add playlist to mongo
    let collection = await _get_playlist_collection();
    await collection.deleteMany({}); // reset the collection before adding new playlist
    playlistLength = playlist.length;
    for (let i = 0; i < playlist.length; i++) {
        await collection.insertOne({
            track_id: playlist[i].track_id,
            playlist_genre: playlist[i].playlist_genre,
            playlist_subgenre: playlist[i].playlist_subgenre
        });
    }
    res.send(playlist); // return playlist to client
}

module.exports.getPlaylistUrl = async (req, res) => {
    let collection = await _get_playlist_collection(); // return the collection
    let url = await collection.find({ url: { $exists: true } }).toArray();
    console.log(url);
    res.send(url);
}

module.exports.getPlaylist = async (req, res) => {
    let collection = await _get_playlist_collection(); // return the collection
    let length = collection.count();
    // console.log(length);
    for (let i = 0; i < playlistLength; i++) {
        await collection.find({
            track_id: userPlaylist[i].track_id,
            playlist_genre: userPlaylist[i].playlist_genre,
            playlist_subgenre: userPlaylist[i].playlist_subgenre
        });
    }
    // console.log('reaching');
    res.send(userPlaylist);
}

// recommend song by subgenre
async function recommendSong(subgenre) {
    let rand = Math.floor(Math.random() * subgenre.length);
    return subgenre[rand]; // changed to return from print
}
