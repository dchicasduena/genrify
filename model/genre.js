/**
* @author Nhu Nguyen & David Chicas
* @year 2022 
*/

const client = require('../utils/db.js');


async function _get_songs_collection() {
    let db = await client.getDb();
    return await db.collection('genre');
};

/**
 * The class song, with a main constructor and seven methods 
 * to add/delete/update/get songs in the database
 */

class GenreData {
    constructor() {
        this.genre = '';
        this.subgenre = '';
    }

    /**
     * This static method for the class genre will retrieve
     * all the genre data.
     * @returns {Array[GenreData]} - An array with all songs retrieved
     */
    static async getAll() {
        let collection = await _get_songs_collection();
        let objs = await collection.find({}).toArray();
        return objs;
    }
    

    /**
     * This method will retrieve all subgenres with the genre passed
     * as a parameter
     * @param {String} genre - the genre of the song to be retrieved
     * @returns {GenreData} - An object Song with all song's data
     */
     static async getSubgenre(genre) {
        let collection = await _get_songs_collection();
        // console.log(genre)
        let obj = await collection.find({ "genre": genre }).toArray();
        return obj;
    }
}

module.exports.GenreData = GenreData;