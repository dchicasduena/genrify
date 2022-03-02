 /**
 * @author David Chicas
 * @student_id 201919354
 * @course COMP 3100 - Web Programming
 * @year 2022 
 */

let fs = require('fs');

let randSong = convertDataToSong("spotify_songs.csv");

function convertDataToSong(filename){
    const song_array = []; // 
    const data = fs.readFileSync(filename, {encoding:'utf8', flag:'r'}); // open and read file
    const songs = data.split('\n'); // split into each song 

    for (let i = 1; i < songs.length; i++){ // go through the songs
        const song = songs[i].split(','); // split each song into its attributes
        songObj = { // assign each attribute 
            track_name: song[1],
            track_artist: song[2],
            track_album_name: song[5], 
            playlist_name: song[7], 
            playlist_genre: song[9], 
            playlist_subgenre: song[10],  
            duration_ms: song[22]
        }
    
    song_array.push(songObj)
    }
  
    console.log(songs.length)
    return song_array;
}