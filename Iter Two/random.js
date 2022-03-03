/**
* @author David Chicas, Nhu Nguyen
* @student_id 201919354, 201916426
* @course COMP 3100 - Web Programming
* @year 2022 
*/

let fs = require('fs');

var songs = [] // array of all songs
convertDataToSong('spotify_songs.csv');
var genreList = []; // list of all genres
var userGenre = getUserGenre(); // get favorite user genre
var songsByGenre = getSongsByGenre(userGenre); // get songs using given genre
let rand = Math.floor(Math.random() * songsByGenre.length); // get random song
console.log(songsByGenre[rand])


function convertDataToSong(filename) {
    const song_array = [];
    const genre_array = [];
    const data = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }); // open and read file
    const songs = data.split('\n'); // split into each song 

    for (let i = 1; i < songs.length; i++) { // go through the songs
        const song = songs[i].split(/,/); // split each song into its attributes

        if (song.length != 23) { // if the song is not valid, skip it
            continue;
        }

        songObj = { // assign each attribute 
            track_id: i,
            track_name: song[1],
            track_artist: song[2],
            track_album_name: song[5],
            playlist_name: song[7],
            genre: {
                playlist_genre: song[9],
                playlist_subgenre: song[10]
            },
            duration: parseInt(song[22])
        }

        // change duration to minutes
        const minutes = Math.floor(songObj.duration / 60000);
        const seconds = ((songObj.duration % 60000) / 1000).toFixed(0);
        songObj.duration = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;

        genre_array.push(songObj.genre)
        song_array.push(songObj)
    }

    this.genreList = [
        ...new Map(genre_array.map((item) => [item["playlist_subgenre"], item])).values(),
    ];

    console.log(this.genreList)
    this.songs = song_array;
}

// get favorite genre of user
function getUserGenre() {
    let userGenre = [];
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
    const ans = /* await */ askQuestion("What is your favourite genre? "); // currently not working
    let test = 'pop'; // for testing, change to ans
    for (let i = 0; i < this.genreList.length; i++) {
        if (test == this.genreList[i].playlist_genre && !(userGenre.includes(test))) { // if the genre is valid and not in the list, add it
            userGenre.push(test)
            console.log(userGenre)
        }
    }
    return userGenre;
}

// get songs by genre
function getSongsByGenre(genre) {
    let songs = [];
    for (let i = 0; i < this.songs.length; i++) {
        if (this.songs[i].genre.playlist_genre == genre) {
            songs.push(this.songs[i])
        }
    }
    return songs;
}