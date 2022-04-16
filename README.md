# GENRIFY
App: https://genrify-app.herokuapp.com

Github: https://github.com/dchicasduena/genrify

Spotify playlist generator based on genres and sub-genres

![Spotify](https://img.shields.io/badge/Spotify-1ED760?style=for-the-badge&logo=spotify&logoColor=white)  ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)  ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

> This is still a WIP so fuctionality can still be changed / improved. Because the app is still in development, Spotify will not let you add the playlist to your account unless you are verified in the app dashboard. 

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
# inside the project folder
# save a new file with the contents on a text editor, 
# then click save type as all files, and save with .env extension
```
Then fill the .env file with the **CLIENT_ID** and **CLIENT_SECRET**, it should look like this:

```js
CLIENT_ID='vgiwny1af6b60sjvswxfesb6nbpza7h2' # add your app id here
CLIENT_SECRET='evch3hr5g5zbrwocnv5lxq0n9loyr6m7' # add your app secret here
```

Now you can run the command `npm install`to download all the dependancies you need for the project. 

To import the list of songs in the .csv file you need to run the command `node import.js `, this command only needs to be run **once** during setup.

## Usage

As of `version 0.0.2`

Run the command `node app.js`

This will tell you where the app is running in the terminal. Go to the specified address and then follow the steps the application says. Now check your account on the Spotify app or web player to see your new playlist

## Credits
Our project uses [Chart.JS](https://www.chartjs.org), [Bootstrap](https://getbootstrap.com/), and it uses the Bootstrap [Cover](https://getbootstrap.com/docs/5.1/examples/cover/) Template. The CSS for the background is from [CodePen](https://codepen.io/LA_water/pen/rNaYZBb)

