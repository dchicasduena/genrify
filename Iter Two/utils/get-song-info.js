// not working
module.exports.getSongInfo = (track_id) => {
    return new Promise((res, rej) => {
        let songInfo = spotifyApi.getTrackInfo(track_id)
            .then(res => {
                return res;
            }).catch(err => {
                console.log(err);
                return null;
            });
    });
};