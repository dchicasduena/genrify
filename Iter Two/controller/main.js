const client = require('../utils/db.js');
const Song = require('../model/song.js').Song;

/**
 * A function that adds a song to the database.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
module.exports.add = async (req, res) => {
    let track_id = req.body.track_id;
    let new_song = new Song(track_id);
    let msg = await new_song.save();
    res.send(msg);
};

/**
 * A function that lists all songs with all information that is
 * in the file. 
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
module.exports.list_all = async (req, res) => {
    let objs = await Song.getAll();
    console.log(objs.length + ' item(s) sent.');
    res.send(objs);
};

/**
 * A function that gets a song by name and returns all
 * data of the requested song.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
module.exports.get_song = async (req, res) => {
    let track_id = req.params.track_id;
    let obj = await Song.get(track_id);
    if (obj.length > 0) {
        console.log(obj.length + ' item(s) sent.');
        res.send(obj[0]);
    } else {
        res.send('No item was found');
    }
};

/**
 * A function that deletes the information about a given song.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
module.exports.delete_song = async (req, res) => {
    let track_id_to_delete = req.params.track_id;
    let msg = await Song.delete(track_id_to_delete);
    res.send(msg);
};
