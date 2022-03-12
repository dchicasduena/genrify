# spotify playlist generator
a random playlist generator based on answers, questions and songs

> this is still a WIP so fuctionality can still be changed / improved

## features

## installation
first clone the repository like you normally would, then go to folder [Iter Two](https://github.com/dchicasduena/playlist-generator/tree/main/Iter%20Two`)

```bash
git clone https://github.com/dchicasduena/playlist-generator.git
```

once inside the folder uou will need to create a .env file containing you client id and secret, more informaiton [here](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/)

for `macOS and linux machines`

```bash
#inside the iteration two folder
touch .env
nano .env
```

for `windows`

```bash
#inside the iteration two folder
idk i have to check
```
then fill the .env file with the **CLIENT_ID** and **CLIENT_SECRET**, it should look like this:

```js
CLIENT_ID='' #add your app id here
CLIENT_SECRET='' #and your secret here
```

now you can run the command `npm install`to download all the dependancies you need for the project. 

to import the list of songs in the .csv file you need to run the command `node import.js `, this command only needs to be run **once** during setup.

## usage

as of `version 0.0.1`

to connect the application to the db we created run the command `node app.js`, then open a new terminal window (inside the same folder) and run the command `node random.js`.

this will show some questions in the terminal, make sure to answer them correctly.

now go to the folder [authorization_code](https://github.com/dchicasduena/playlist-generator/tree/main/Iter%20Two/authorization_code) and run the command `node app.js`, this will open a new browser window that will ask you to login to your spotify account.

now check your account on the spotify app or web player to see your new playlist


## troubleshooting

## resources

API's we want to use: 
- [apple music api](https://developer.apple.com/documentation/applemusicapi/)
- [spotify api](https://developer.spotify.com/documentation/web-api/)

might find useful:
- visualize spotify data / [article](https://towardsdatascience.com/visualizing-spotify-songs-with-python-an-exploratory-data-analysis-fc3fae3c2c09)
- spotify songs data set / [repo](https://github.com/rfordatascience/tidytuesday/blob/master/data/2020/2020-01-21/readme.md)
- analysis of spotify data / [article](https://rstudio-pubs-static.s3.amazonaws.com/594440_b5a14885d559413ab6e57087eddd68e6.html)
- spotify playlist data set / [site](https://www.aicrowd.com/challenges/spotify-million-playlist-dataset-challenge#dataset)
