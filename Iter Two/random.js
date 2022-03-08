/**
* @author David Chicas, Nhu Nguyen
* @student_id 201919354, 201916426
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
var myurl = 'http://localhost:3000';

// Let's configure the base url
const instance = axios.create({
    baseURL: myurl,
    headers: {'content-type': 'application/json'}
});

convertDataToSong();


async function convertDataToSong() {
    const genreList = [];
    const subGenreList = [];
    const songs = await instance.get('/song'); // split into each song 
    this.songs = songs.data;

    for (let i = 1; i < this.songs.length; i++) { // go through the songs
        const song = this.songs[i]; // split each song into its attributes

        // change duration to minutes
        const minutes = Math.floor(song.duration_ms / 60000);
        const seconds = ((song.duration_ms % 60000) / 1000).toFixed(0);
        song.duration_ms = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;

        // add genre to genreList
        if (!genreList.includes(song.playlist_genre)) {
            genreList.push(song.playlist_genre)
        }
        // add subgenre to subGenreList
        if (!subGenreList.includes(song.playlist_subgenre)) {
            subGenreList.push(song.playlist_subgenre)
        }

    }

    this.genreList = genreList;
    this.subGenreList = subGenreList;
    getUserGenre();
}

// get favorite genre of user
async function getUserGenre() {
    let userGenre = [];
    let userSubgenre = [];
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

    //get favorite subgenres
    let possibleSubGenre = [];
    for (let i = 0; i < userGenre.length; i++) {
        let subGenre = getSubGenre(userGenre[i]);
        for (let j = 0; j < subGenre.length; j++) {
            possibleSubGenre.push(subGenre[j])
        }
    }

    // print all relevant subgenres
    console.log('List of relevant subgenres:')
    for (let i = 0; i < userGenre.length; i++) {
        console.log(userGenre[i])
        for (let j = 0; j < getSubGenre(userGenre[i]).length; j++) {
            console.log(" - " + getSubGenre(userGenre[i])[j])
        }
    }

    while (userSubgenre.length < 3) {
        let currentGenre = userGenre[userSubgenre.length] // get current genre
        let ans = await askQuestion("What is your favorite subgenre of " + currentGenre + "? (" + (3 - userSubgenre.length) + " left) ")
        if (!possibleSubGenre.includes(ans)) { // if user has selected an invalid subgenre, skip it
            console.log("Invalid subgenre")
            continue
        }
        if (!getSubGenre(currentGenre).includes(ans)) { // if subgenre doesn't belong to current genre, skip it
            console.log("Subgenre doesn't belong to " + currentGenre)
            continue
        }
        if (userSubgenre.includes(ans)) { // if user has already selected the genre, skip it
            console.log("You have already selected this subgenre")
            continue
        }
        userSubgenre.push(ans)
    }

    // this part needs to be inside this function for it to work, am trying to think of another way
    this.userGenre = userGenre;
    this.userSubgenre = userSubgenre;

    createPlaylist();
}

async function createPlaylist() {
    let playlist = [];

    console.log('user playlist created:')
    for (let i = 0; i < 10; i++) {
        let rand = Math.floor(Math.random() * userSubgenre.length);
        let song = await recommendSong(userSubgenre[rand]); //this needs to be fixed
        playlist.push(song)
    }
    console.log(playlist)
}

// get all subgenres of a genre
function getSubGenre(genre) {
    let subGenre = [];
    for (let i = 0; i < songs.length; i++) {
        if ((songs[i].playlist_genre == genre) && (!subGenre.includes(this.songs[i].playlist_subgenre))) {
            subGenre.push(songs[i].playlist_subgenre)
        }
    }
    return subGenre;
}

// get the genre of a given subgenre
function getGenre(subgenre) {
    for (let i = 0; i < this.songs.length; i++) {
        if (this.songs[i].playlist_subgenre == subgenre) {
            return this.songs[i].playlist_genre
        }
    }
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

