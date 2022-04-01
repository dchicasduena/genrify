/**
* @author Nhu Nguyen, David Chicas
* @student_id 201916426, 201919354
* @course COMP 3100 - Web Programming
* @year 2022 
*/

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
var myurl = 'http://localhost:5500';

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
    const songs = await instance.get('/song'); // get all songs from server
    this.songs = songs.data;

    for (let i = 1; i < this.songs.length; i++) { // go through the songs
        const song = this.songs[i]; // get the song

        // change duration to minutes
        const minutes = Math.floor(song.duration_ms / 60000);
        const seconds = ((song.duration_ms % 60000) / 1000).toFixed(0);
        song.duration_ms = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;

        // add genre to genreList
        for (let i in song.playlist_genre) {
            if (!genreList.includes(song.playlist_genre[i]) && (song.playlist_genre[i].length > 2)) {
                genreList.push(song.playlist_genre[i])
            }
        }

        // add subgenre to subGenreList
        for (let i in song.playlist_subgenre) {
            if (!subGenreList.includes(song.playlist_subgenre[i])) {
                subGenreList.push(song.playlist_subgenre[i])
            }
        }
    }
    res.send(genreList);
}

// Return subgenres of user genres
module.exports.getSubGenre = async (req, res) => {
    let genre = req.params.genre.split(',');
    console.log(genre.length);
    let list = [];
    let sublist = [];
    for (let i = 0; i < genre.length; i++) {
        console.log('genre: ' + genre[i]);
        let subGenre = getSubGenre(genre[i], this.songs);
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
    console.log(length);
    for (let i = 0; i < playlistLength; i++) {
        await collection.find({
            track_id: userPlaylist[i].track_id,
            playlist_genre: userPlaylist[i].playlist_genre,
            playlist_subgenre: userPlaylist[i].playlist_subgenre
        });
    }
    console.log('reaching');
    res.send(userPlaylist);
}


// get all subgenres of a genre
function getSubGenre(genre, songs) {
    let subGenre = [];
    for (let i = 0; i < songs.length; i++) {
        let song = songs[i];
        for (let a in song.playlist_genre) {
            for (let b in song.playlist_subgenre) {
                if (song.playlist_genre[a] == genre && (!subGenre.includes(song.playlist_subgenre[b]))) {
                    subGenre.push(song.playlist_subgenre[b])
                }
            }
        }
    }
    return subGenre;
}

// recommend song by subgenre
async function recommendSong(subgenre) {
    let rand = Math.floor(Math.random() * subgenre.length);
    return subgenre[rand]; // changed to return from print
}
