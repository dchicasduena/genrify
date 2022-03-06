var SpotifyWebApi = require('spotify-web-api-node');
var user = '31lmjmqtzgmennebs7vslcfxm5d4' // change for username

const spotifyApi = new SpotifyWebApi({
    clientId: 'clientId', // change to client
    clientSecret: 'clientSecret', // change to secret
    redirectUri: 'http://localhost:8888/callback',
});
console.log(process.env.CLIENT_ID)


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