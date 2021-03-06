/**
* @author Nhu Nguyen & David Chicas
* @year 2022 
*/

const client = require('../utils/db.js');
const Song = require('../model/song.js').Song;
const GenreData = require('../model/genre.js').GenreData;

/**
 * A function that adds a song to the database.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
module.exports.add = async (req, res) => {
    let new_song = new Song();
    new_song.track_id = req.body.track_id;
    new_song.track_name = req.body.track_name;
    new_song.track_artist = req.body.track_artist;
    new_song.track_album_name = req.body.track_album_name;
    new_song.playlist_name = req.body.playlist_name;
    new_song.playlist_genre = req.body.playlist_genre;
    new_song.playlist_subgenre = req.body.playlist_subgenre;
    new_song.duration = req.body.duration;
    let msg = await new_song.save();
    res.send(msg);
};

/**
 * A function that lists all songs with all infomation.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
module.exports.list_all = async (req, res) => {
    let objs = await Song.getAll();
    console.log(objs.length + ' item(s) sent.');
    res.send(objs);
};

/**
 * A function that gets a song by id and returns all
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
 * A function that returns all genre data.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
module.exports.get_all_genre = async (req, res) => {
    let obj = await GenreData.getAll();
    if (obj.length > 0) {
        console.log(obj.length + ' item(s) sent.');
        res.send(obj);
    } else {
        res.send('No item was found');
    }
};

/**
 * A function that gets subgenres by genre and returns all
 * data of the requested genre.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
module.exports.get_subgenres_by_genre = async (req, res) => {
    let genre = req.params.genre;
    let obj = await GenreData.getSubgenre(genre);
    if (obj.length > 0) {
        console.log(obj.length + ' item(s) sent.');
        res.send(obj);
    } else {
        res.send('No item was found');
    }
};

/**
 * A function that gets songs by genre and returns all
 * data of the requested genre.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
module.exports.get_song_by_genre = async (req, res) => {
    let playlist_genre = req.params.playlist_genre;
    let obj = await Song.getSongByGenre(playlist_genre);
    if (obj.length > 0) {
        console.log(obj.length + ' item(s) sent.');
        res.send(obj);
    } else {
        res.send('No item was found');
    }
};

/**
 * A function that gets songs by subgenre and returns all
 * data of the requested subgenre.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */
module.exports.get_song_by_subgenre = async (req, res) => {
    let playlist_subgenre = req.params.playlist_subgenre;
    let obj = await Song.getSongBySubgenre(playlist_subgenre);
    if (obj.length > 0) {
        console.log(obj.length + ' item(s) sent.');
        res.send(obj);
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
