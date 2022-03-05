// this -> https://github.com/thelinmichael/spotify-web-api-node

/**
* @author David Chicas, Nhu Nguyen
* @student_id 201919354, 201916426
* @course COMP 3100 - Web Programming
* @year 2022 
*/

var SpotifyWebApi = require('spotify-web-api-node');
var user = '31lmjmqtzgmennebs7vslcfxm5d4' // change for username

const spotifyApi = new SpotifyWebApi({
    clientId: '6dcf3051ee9842b78f2d130f8464d9dd', // change to client
    clientSecret: '059c3e2748f546aa923a0ed54b1b5e47', // change to secret
    redirectUri: 'http://localhost:8888/callback',
  });
  
getUserInfo();
getUserPlaylists();

spotifyApi.clientCredentialsGrant()
.then(function(data) {
    //console.log('The access token expires in ' + data.body['expires_in']);
    //console.log('The access token is ' + data.body['access_token']);
  
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);

}, function(err) {
    console.log('Something went wrong when retrieving an access token', err.message);
});
  
async function getUserInfo(){
    let tok = await spotifyApi.clientCredentialsGrant() 

    // Get a user
    spotifyApi.getUser(user)
    .then(function(data) {
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
    }, function(err) {
        console.log('Something went wrong!', err);
    });
}

async function getUserPlaylists(){
    let tok = await spotifyApi.clientCredentialsGrant() 

    // Get names of user playlists
    spotifyApi.getUserPlaylists(user)
    .then(function(data) {
      console.log('user playlists:');
      for (let i = 1; i < data.body.items.length; i++){
          console.log(data.body.items[i].name); // print name
      }
      console.log("\n")

    },function(err) {
      console.log('Something went wrong!', err);
    });
    
}