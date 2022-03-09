/**
* @author Nhu Nguyen, David Chicas
* @student_id 201916426, 201919354
* @course COMP 3100 - Web Programming
* @year 2022 
*/

var SpotifyWebApi = require('spotify-web-api-node');
var user = '31myzbvynnxx7srbidkjxtp4fmqe' // change for username

//get client id and secret from env file
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID, // change to client
    clientSecret: process.env.CLIENT_SECRET, // change to secret
    redirectUri: 'http://localhost:8888/callback',
});

spotifyApi.clientCredentialsGrant().then(function (data) {

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);

}, function (err) {
    console.log('Something went wrong when retrieving an access token', err.message);
});


async function getUserInfo() {
    let tok = await spotifyApi.clientCredentialsGrant()

    // Get a user
    spotifyApi.getUser(user)
        .then(function (data) {
            console.log('user information:')
            userObj = {
                'display-name': data.body.display_name,
                url: data.body.external_urls,
                followers: data.body.followers.total,
                username: data.body.id,
                uri: data.body.uri
            }
            console.log(userObj)
            console.log("\n")
        }, function (err) {
            console.log('Something went wrong!', err);
        });
}

async function getUserPlaylists() {
    let tok = await spotifyApi.clientCredentialsGrant()

    // Get names of user playlists
    spotifyApi.getUserPlaylists(user)
        .then(function (data) {
            console.log('user playlists:');
            for (let i = 1; i < data.body.items.length; i++) {
                console.log(data.body.items[i].name); // print name
            }
            console.log("\n")

        }, function (err) {
            console.log('Something went wrong!', err);
        });
}

async function getTrack(trackId) {
    let tok = await spotifyApi.clientCredentialsGrant()

    // Get a track
    spotifyApi.getTrack(trackId)
        .then(function (data) {
            //console.log('track information:')
            let trackObj = {
                'name': data.body.name,
                'artists': data.body.artists[0].name,
                'album': data.body.album.name,
                'duration_ms': data.body.duration_ms,
                'uri': data.body.uri
            }
            console.log(trackObj)
        }, function (err) {
            console.log('Something went wrong!', err);
        });
}


async function main() {
    // main functions
    await getUserInfo()
    await getUserPlaylists()
    await getTrack('474HmRcCZuGFV7i0jMNfEL')
}
 main()

//module.exports.Spotify = Spotify;
