/**
* @author Nhu Nguyen, David Chicas
* @student_id 201916426, 201919354
* @course COMP 3100 - Web Programming
* @year 2022 
*/

var SpotifyWebApi = require('spotify-web-api-node');
var user = '31lmjmqtzgmennebs7vslcfxm5d4' // change for username

const dotenv = require('dotenv');
dotenv.config({ path: './../.env' });

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID, // change to client
    clientSecret: process.env.CLIENT_SECRET, // change to secret
    redirectUri: 'http://localhost:8888/callback',
});

module.exports.getSongInfo = (track_id) => {
    return new Promise((resolve, reject) => {
        let songInfo = spotifyApi.getTrackInfo(track_id)
            .then(res => {
                return songInfo;
            }).catch(err => {
                console.log(err);
                return null;
            });
        if (songInfo != null) {
            resolve(songInfo);
        } else {
            reject(null);
        }
    });
};