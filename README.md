# SPOTIFY PLAYLIST GENERATOR
A random playlist generator based on answers, questions and songs

![Spotify](https://img.shields.io/badge/Spotify-1ED760?style=for-the-badge&logo=spotify&logoColor=white)  ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)  ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

> This is still a WIP so fuctionality can still be changed / improved

## Features

- We use the [Spotify API](https://developer.spotify.com/documentation/web-api/) to create the playlist and add the songs.
- The songs come from two data sets: the [Million Playlist Dataset](https://github.com/rfordatascience/tidytuesday/blob/master/data/2020/2020-01-21/readme.md) and the [Spotify Song Dataset](https://github.com/rfordatascience/tidytuesday/blob/master/data/2020/2020-01-21/readme.md).
- We use [Chart.JS](https://www.chartjs.org) to visualize the data of each playlist,

## Installation
First clone the repository like you normally would, then go to project folder.

```bash
git clone https://github.com/dchicasduena/playlist-generator.git
```

Once inside the folder you will need to create a .env file containing you client id and secret, more informaiton [here](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/)

For `macOS and Linux machines`

```bash
# inside the iteration two folder
touch .env
nano .env
```

For `Windows`

```bash
# inside the iteration two folder
# save a new file with the contents on a text editor, 
# then click save type as all files, and save with .env extension
```
Then fill the .env file with the **CLIENT_ID** and **CLIENT_SECRET**, it should look like this:

```js
CLIENT_ID='' #add your app id here
CLIENT_SECRET='' #and your secret here
```

Now you can run the command `npm install`to download all the dependancies you need for the project. 

To import the list of songs in the .csv file you need to run the command `node import.js `, this command only needs to be run **once** during setup.

## Usage

As of `version 0.0.2`

Run the command `node app.js`

This will tell you where the app is running in the terminal. Go to the specified address and then follow the steps the application says. Now check your account on the spotify app or web player to see your new playlist


## Troubleshooting

## Future relases

API's we want to implement: 
- [Apple Music API](https://developer.apple.com/documentation/applemusicapi/)
