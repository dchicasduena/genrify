/**
* @author David Chicas, Nhu Nguyen
* @student_id 201919354, 201916426
* @course COMP 3100 - Web Programming
* @year 2022 
*/

let fs = require('fs');

var songs = [] // array of all songs
var genreList = []; // list of all genres
var subGenreList = []; // list of all subgenres
var userGenre = []; // list of user genres
var userSubgenre = []; // list of user subgenres

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

    // map genre to subgenre
    this.list = [
        ...new Map(genre_array.map((item) => [item["playlist_subgenre"], item])).values(),
    ];

    // get unique subgenres
    let temp = [];
    for (let i = 0; i < this.list.length; i++) {
        temp.push(this.list[i].playlist_subgenre);
    }
    this.subGenreList = temp;

    // get unique genres
    let genreList = [];
    for (let i = 0; i < this.list.length; i++) {
        if (!genreList.includes(this.list[i].playlist_genre)) {
            genreList.push(this.list[i].playlist_genre)
        }
    }

    this.genreList = genreList;
    this.songs = song_array;
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
    for (let i = 0; i < this.genreList.length; i++) {
        console.log(this.genreList[i])
    }

    // get favorite genres
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

function createPlaylist() {
    let playlist = [];

    console.log('user playlist created:')
    for (let i = 0; i < 10; i++) {
        let rand = Math.floor(Math.random() * this.userGenre.length);
        let song = recommendSong(this.userGenre[rand], this.userSubgenre[rand]); //this needs to be fixed
        playlist.push(song)
    }
    console.log(playlist)
}

// get all subgenres of a genre
function getSubGenre(genre) {
    let subGenre = [];
    for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].playlist_genre == genre) {
            subGenre.push(this.list[i].playlist_subgenre)
        }
    }
    return subGenre;
}

// get the genre of a given subgenre
function getGenre(subgenre) {
    for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].playlist_subgenre == subgenre) {
            return this.list[i].playlist_genre
        }
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

// recommend song by genre and subgenre
function recommendSong(genre, subgenre) {
    let songs = getSongsByGenre(genre);
    let subgenreSongs = [];
    for (let i = 0; i < songs.length; i++) {
        if (songs[i].genre.playlist_subgenre == subgenre) {
            subgenreSongs.push(songs[i])
        }
    }
    let rand = Math.floor(Math.random() * subgenreSongs.length);
    //console.log(subgenreSongs[rand])
    //console.log("\n")
    return subgenreSongs[rand]; // changed to return from print
}

