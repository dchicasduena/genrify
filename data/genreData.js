/**
* @author Nhu Nguyen & David Chicas
* @year 2022 
*/
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
let fs = require('fs');
const client = require('../utils/db.js');

var songs = [] // array of all songs
var genreList = []; // list of all genres
var subGenreList = []; // list of all subgenres

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

async function get_data() {
    const songs = await instance.get('/song'); // get all songs from server
    this.songs = songs.data;

    for (let i = 1; i < this.songs.length; i++) { // go through the songs
        const song = this.songs[i]; // get the song

        // add genre to genreList
        for (let i in song.playlist_genre) {
            if (!genreList.includes(song.playlist_genre[i]) && (song.playlist_genre[i].length > 2)) {
                genreList.push(song.playlist_genre[i])
            }
        }
    }
    let string = "";
    for (let i in genreList) {
        let subGenre = getSubGenre(genreList[i]);
        subGenreList.push(subGenre);
        let song = {
            genre: genreList[i],
            subgenre: subGenre,
        }

        string += JSON.stringify(song) + ',\n';
        writeData('genre.json', string);
    }
    // console.log(genreList);
}


// get all subgenres of a genre
function getSubGenre(genre) {
    let subGenre = [];
    let count = 0;
    for (let i = 0; i < this.songs.length; i++) {
        let song = this.songs[i];
        for (let a in song.playlist_genre) {
            for (let b in song.playlist_subgenre) {
                if (count > 1000) {
                    return subGenre;
                }
                if (song.playlist_genre[a] == genre && (!subGenre.includes(song.playlist_subgenre[b]))) {
                    subGenre.push(song.playlist_subgenre[b])
                    count++;
                }
            }
        }
    }
    return subGenre;
}

function writeData(filename, contents) {
    //Saves CSV contents
    var writeFile = fs.createWriteStream(filename, { flag: 'a' }) // create file and append
    writeFile.write('[') // write header
    writeFile.write(contents) // append report
    writeFile.end(']') // stop appending

    var writeFile = fs.createWriteStream(filename, { flag: 'w' }) // if program is ran again, delete and create new file

}

get_data();