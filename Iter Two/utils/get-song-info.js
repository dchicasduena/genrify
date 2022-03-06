
var SpotifyWebApi = require('spotify-web-api-node');
var user = '31lmjmqtzgmennebs7vslcfxm5d4' // change for username

const spotifyApi = new SpotifyWebApi({
    clientId: '6dcf3051ee9842b78f2d130f8464d9dd', // change to client
    clientSecret: '059c3e2748f546aa923a0ed54b1b5e47', // change to secret
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