 /**
 * @author David Chicas
 * @student_id 201919354
 * @course COMP 3100 - Web Programming
 * @year 2022 
 */

let fs = require('fs');

let randSong = convertDataToSong("spotify_songs.csv");

function convertDataToSong(filename){
    const song_array = []; 
    const genre_array = [];
    const data = fs.readFileSync(filename, {encoding:'utf8', flag:'r'}); // open and read file
    const songs = data.split('\n'); // split into each song 

    for (let i = 1; i < songs.length; i++){ // go through the songs
        const song = songs[i].split(/,/); // split each song into its attributes

        if (song.length != 23){ 
            continue;
        }

        songObj = { // assign each attribute 
            track_id: i,
            track_name: song[1],
            track_artist: song[2],
            track_album_name: song[5], 
            playlist_name: song[7], 
            genre: {playlist_genre: song[9], 
                playlist_subgenre: song[10]}, 
            duration: parseInt(song[22])
        }
    
    // change duration to minutes
    const minutes = Math.floor(songObj.duration / 60000);
    const seconds = ((songObj.duration % 60000) / 1000).toFixed(0);
    songObj.duration = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;

    genre_array.push(songObj.genre)
    song_array.push(songObj)
    }

    let unique_genre = [
        ...new Map(genre_array.map((item) => [item["playlist_subgenre"], item])).values(),
    ];
     
    console.log(song_array[19000])
    console.log(unique_genre)
    return song_array;
}