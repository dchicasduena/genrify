/**
* @author Nhu Nguyen, David Chicas
* @student_id 201916426, 201919354
* @course COMP 3100 - Web Programming
* @year 2022 
*/

const client = require('../utils/db.js');

async function _get_songs_collection() {
    await client.connectToDB();
    let db = await client.getDb();
    return await db.collection('all_songs');
};

/**
 * The class song, with a main constructor and two methods
 * to add more fields retrieved with the third-party APIs
 */

class Song {
    constructor() {
        this.track_id = 0;
        this.track_name = '';
        this.track_artist = '';
        this.track_album_name = '';
        this.playlist_name = '';
        this.playlist_genre = '';
        this.playlist_subgenre = '';
        this.duration_ms = 0;
    }

    /**
     * This method saves the current object song in the Database
     * @returns {String} - A message if song was saved in the db or not
     */
    async save() {
        try {
            let collection = await _get_songs_collection();
            let mongoObj = await collection.insertOne(this);
            console.log('1 song was inserted in the database with id -> ' + mongoObj.insertedId);
            return {success: 'Song correctly inserted in the Database.'};
        } catch (err) {
            throw err
        }
    }

    /**
     * This static method for the class song will retrieve
     * all the songs inside the database
     * @returns {Array[Song]} - An array with all songs retrieved
     */
    static async getAll() {
        let collection = await _get_songs_collection();
        let objs = await collection.find({}).toArray();
        return objs;
    }

    /**
     * This method will retrieve a song with the name passed
     * as a parameter
     * @param {String} track_id - the id of the song to be retrieved
     * @returns {Song} - An object Song with all song's data
     */
    static async get(track_id) {
        let collection = await _get_songs_collection();
        console.log(track_id)
        let obj = await collection.find({ "track_id": track_id }).toArray();
        return obj;
    }

    /**
     * This method will retrieve all songs with the genre passed
     * as a parameter
     * @param {String} genre - the genre of the song to be retrieved
     * @returns {Song} - An object Song with all song's data
     */
    static async getSongByGenre(genre) {
        let collection = await _get_songs_collection();
        console.log(genre)
        let obj = await collection.find({ "playlist_genre": genre }).toArray();
        return obj;
    }

    /**
     * This method will retrieve all songs with the subgenre passed
     * as a parameter
     * @param {String} subgenre - the subgenre of the song to be retrieved
     * @returns {Song} - An object Song with all song's data
     */
    static async getSongBySubgenre(subgenre) {
        let collection = await _get_songs_collection();
        console.log(subgenre)
        let obj = await collection.find({ "playlist_subgenre": subgenre }).toArray();
        return obj;
    }

    /**
     * This method will update the song's data
     * @param {String} track_id - The name to be updated
     * @param {Song} new_song - An object of class song
     * @returns {String} A message if the song was updated or not
     */
    static async update(track_id, new_song) {
        let collection = await _get_songs_collection();
        let new_vals = { $set: { 'track_id': new_song.track_id } };
        let obj = await collection.updateOne({ 'track_id': track_id }, new_vals)
        if (obj.modifiedCount > 0) {
            return 'Song correctly updated.';
        } else {
            return 'Song was not updated.'
        }
    }

    /**
     * This method will detele the song with the specified
     * name.
     * @param {String} track_id_to_delete - A name to be deleted
     * @returns {String} A message if the song was deleted or not
     */
    static async delete(track_id_to_delete) {
        let collection = await _get_songs_collection();
        let obj = await collection.deleteOne({ 'track_id': track_id_to_delete })
        if (obj.deletedCount > 0) {
            return { success: 'Song correctly deleted.' };
        } else {
            return 'Song was not found.'
        }
    }
}

module.exports.Song = Song;