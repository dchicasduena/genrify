/**
* @author Nhu Nguyen, David Chicas
* @student_id 201916426, 201919354
* @course COMP 3100 - Web Programming
* @year 2022 
*/
const client = require('./utils/db.js');

var songs = [] // array of all songs
var genreList = []; // list of all genres
var subGenreList = []; // list of all subgenres
var userGenre = []; // list of user genres
var userSubgenre = []; // list of user subgenres

async function _get_playlist_collection() {
    await client.connectToDB();
    let db = await client.getDb();
    return await db.collection('user_playlist');
};

async function getData(data) {
    const songs = data; // get all songs from server
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
}

$(document).jQuery(function () {
    /**
     * This function binds an event to the start button.
     */

    $("#btn-add").on(function (event) { // shows form
        event.preventDefault();
        // Here we query the server-side
        $.ajax({
            url: '/song',
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                getData(response);
                // add genres to checkbox
                for (let i = 0; i < genreList.length; i++) {
                    addCheckbox(genreList[i]);
                }
            },
            // If there's an error, we can use the alert box to make sure we understand the problem
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    });
});

// Add checkbox     
function addCheckbox(name) {
    var container = $('#cblist');
    var inputs = container.find('input');
    var id = inputs.length+1;
 
    $('<input />', { type: 'checkbox', id: 'cb'+id, value: name }).appendTo(container);
    $('<label />', { 'for': 'cb'+id, text: name }).appendTo(container);
 }