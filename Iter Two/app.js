const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());// support json encoded bodies
app.use(express.urlencoded({ extended: true }));//incoming objects are strings or arrays

const mongo = require('./utils/db.js');

var server;

async function createServer() {
    try {
        // we will only start our server if our database
        // starts correctly. Therefore, let's wait for
        // mongo to connect
        await mongo.connectToDB();

        // start the server
        server = app.listen(port, () => {
            console.log('Example app listening at http://localhost:%d', port);
        });
    } catch (err) {
        console.err(err)
    }
}
createServer();

// I created this callback function to capture
// when for when we kill the server. 
// This will avoid us to create many mongo connections
// and use all our computer resources
process.on('SIGINT', () => {
  console.info('SIGINT signal received.');
  console.log('Closing Mongo Client.');
  server.close(async function(){
    let msg = await mongo.closeDBConnection()   ;
    console.log(msg);
  });
});