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


const axios = require('axios')
var myurl = 'http://localhost:5500';

// Let's configure the base url
const instance = axios.create({
    baseURL: myurl,
    headers: { 'content-type': 'application/json' }
});

async function _get_playlist_collection() {
    await client.connectToDB();
    let db = await client.getDb();
    return await db.collection('user_playlist');
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
    let genre = req.params.genre;
    let genreList = genre.split(',');
    let songs = await instance.get('/song');
    console.log(genreList);
    let list = [];
    for (let i = 0; i < genreList.length; i++) {
        // console.log('genre: ' + genreList[i]);
        let subGenre = getSubGenre(genreList[i], songs.data);
        console.log(subGenre);
        for (let j = 0; j < subGenre.length; j++) {
            list.push(subGenre[j]);
        }
    }
    res.send(list);
}

// get favorite genre of user
async function getUserGenre() {
    const readline = require("readline");

    function askQuestion(query) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        return new Promise(resolve => rl.question(query, ans => {
            rl.close();
            resolve(ans);
        }))
    }

    // print all genres 
    console.log('List of all genres:')
    for (let i = 0; i < genreList.length; i++) {
        console.log(genreList[i])
    }

    // get favorite genres
    while (userGenre.length < 3) {
        let ans = await askQuestion("What is your favorite genre? (" + (3 - userGenre.length) + " left) ")
        if (userGenre.includes(ans)) { // if user has already selected the genre, skip it
            console.log("You have already selected this genre")
            continue
        }
        if (!genreList.includes(ans)) { // if user has selected an invalid genre, skip it
            console.log("Invalid genre")
            continue
        }
        userGenre.push(ans)
    }

    // print all relevant subgenres
    console.log('List of relevant subgenres:')
    for (let i = 0; i < userGenre.length; i++) {
        console.log(userGenre[i])
        let subGenre = getSubGenre(userGenre[i]);
        for (let j = 0; j < subGenre.length; j++) {
            console.log(" - " + subGenre[j])
        }
    }

    // get possible subgenres
    let possibleSubGenre = [];
    for (let i = 0; i < userGenre.length; i++) {
        let subGenre = getSubGenre(userGenre[i]);
        for (let j = 0; j < subGenre.length; j++) {
            possibleSubGenre.push(subGenre[j])
        }
    }

    // get favorite subgenres
    console.log('Enter -1 to stop entering subgenres.')
    while (userSubgenre.length < 6) {
        let ans = await askQuestion("What is your favorite subgenre? (" + (6 - userSubgenre.length) + " left).")
        if (ans == -1) { // if user wants to stop entering subgenres, break
            if (userSubgenre.length < 3) {
                console.log("You must select at least 3 subgenres.")
                continue
            }
            break
        }
        if (!possibleSubGenre.includes(ans)) { // if user has selected an invalid subgenre, skip it
            console.log("Invalid subgenre")
            continue
        }
        if (userSubgenre.includes(ans)) { // if user has already selected the genre, skip it
            console.log("You have already selected this subgenre")
            continue
        }
        userSubgenre.push(ans) // add subgenre to userSubgenre
    }

    // this part needs to be inside this function for it to work, am trying to think of another way
    this.userGenre = userGenre;
    this.userSubgenre = userSubgenre;

    // get number of recommended songs
    let ans = 0;
    while (ans < 10 || ans > 50) {
        ans = await askQuestion("How many songs would you like to have in your playlist? (10-50) ")
        if (ans < 10 || ans > 50) {
            console.log("Invalid number, please try again")
        } else {
            break
        }
    }

    createPlaylist(ans);
}

// create recommended playlist for user
async function createPlaylist(num) {
    let playlist = [];

    console.log('user playlist created:')
    for (let i = 0; i < num; i++) {
        let rand = Math.floor(Math.random() * userSubgenre.length);
        let song = await recommendSong(userSubgenre[rand]); //this needs to be fixed
        playlist.push(song)
    }
    console.log(playlist)
    let collection = await _get_playlist_collection();
    for (let i = 0; i < playlist.length; i++) {
        await collection.insertOne({
            track_id: playlist[i].track_id,
            playlist_genre: playlist[i].playlist_genre,
            playlist_subgenre: playlist[i].playlist_subgenre
        });
    }
    console.log(await client.closeDBConnection());
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

// get songs by genre
async function getSongsByGenre(genre) {
    let songs = await instance.get('/song/genre/' + genre);
    return songs;
}

// recommend song by subgenre
async function recommendSong(subgenre) {
    let songs = await instance.get('/song/subgenre/' + subgenre);
    let rand = Math.floor(Math.random() * songs.data.length);
    return songs.data[rand]; // changed to return from print
}
