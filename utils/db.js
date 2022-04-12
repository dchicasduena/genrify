/**
* @author Nhu Nguyen, David Chicas
* @student_id 201916426, 201919354
* @course COMP 3100 - Web Programming
* @year 2022 
*/
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const MongoClient = require("mongodb").MongoClient
const uri = process.env.DB_URL;
const client = new MongoClient(uri, { useUnifiedTopology: true });
var db;

/**
 * A function to stablish a connection with a MongoDB instance.
 */
async function connectToDB() {
    try {
        // Connect the client to the server
        await client.connect();
        // Our db name is going to be Playlist
        db = await client.db('Playlist');
        console.log("Connected successfully to mongoDB");
    } catch (err) {
        throw err;
    }
}

/**
 * This method just returns the database instance
 * @returns A Database instance
 */
async function getDb() {
    return db;
}

async function closeDBConnection() {
    await client.close();
    return 'Connection closed';
};

module.exports = { connectToDB, getDb, closeDBConnection }