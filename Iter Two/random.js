/**
* @author David Chicas, Nhu Nguyen
* @student_id 201919354, 201916426
* @course COMP 3100 - Web Programming
* @year 2022 
*/

let fs = require('fs');

var songs = [] // array of all songs
var genreList = []; // list of all genres
var subGenreList = []; // list of all sub genres
var userGenre = []; // list of user genres
convertDataToSong('spotify_songs.csv');
getUserGenre(); // get favorite user genre


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

    // get all sub genres
    this.subGenreList = [
        ...new Map(genre_array.map((item) => [item["playlist_subgenre"], item])).values(),
    ];

    // get unique genres
    let genreList = [];
    for (let i = 0; i < this.subGenreList.length; i++) {
        if (!genreList.includes(this.subGenreList[i].playlist_genre)) {
            genreList.push(this.subGenreList[i].playlist_genre)
        }
    }
    this.genreList = genreList;

    // print all genres 
    console.log('List of all genres:')
    for (let i = 0; i < this.genreList.length; i++) {
        console.log(this.genreList[i])
    }

    this.songs = song_array;
}

// get favorite genre of user
async function getUserGenre() {
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
    while (userGenre.length < 3) {
        let ans = await askQuestion("What is your favorite genre? (" + (3 - userGenre.length) + " left) ")
        if (userGenre.includes(ans)) { // if user has already selected the genre, skip it
            console.log("You have already selected this genre")
            continue
        }
        if (!this.genreList.includes(ans)) { // if user has selected an invalid genre, skip it
            console.log("Invalid genre")
            continue
        }
        userGenre.push(ans)
    }

    // this part needs to be inside this function for it to work, am trying to think of another way
    this.userGenre = userGenre;
    for (let i = 0; i < userGenre.length; i++) {
        recommendSong(userGenre[i])
    }
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

// recommend song by genre
function recommendSong(genre) {
    let songs = getSongsByGenre(genre);
    let rand = Math.floor(Math.random() * songs.length);
    console.log(songs[rand])
}