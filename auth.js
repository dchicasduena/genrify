const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const stateKey = 'spotify_auth_state';
const stateCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/callback',
  maxAge: 10 * 60 * 1000
};
const stateCookieClearOptions = {
  httpOnly: stateCookieOptions.httpOnly,
  secure: stateCookieOptions.secure,
  sameSite: stateCookieOptions.sameSite,
  path: stateCookieOptions.path
};

async function requestSpotify(url, options) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(15000)
    });
  } catch (error) {
    throw new Error('Spotify request could not be completed.');
  }
  if (!response.ok) {
    throw new Error(`Spotify request failed with status ${response.status}.`);
  }
  return response.json();
}

function getClientAuthorization() {
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Spotify OAuth is not configured.');
  }
  return 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
}

module.exports.login = (req, res) => {
  try {
    getClientAuthorization();
  } catch (error) {
    return res.status(503).send('Spotify login is not configured.');
  }

  const state = crypto.randomBytes(32).toString('hex');
  res.cookie(stateKey, state, stateCookieOptions);
  const scope = 'playlist-modify-public playlist-modify-private';
  const authorizationUrl = new URL('https://accounts.spotify.com/authorize');
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('client_id', clientId);
  authorizationUrl.searchParams.set('scope', scope);
  authorizationUrl.searchParams.set('redirect_uri', redirectUri);
  authorizationUrl.searchParams.set('state', state);
  res.redirect(authorizationUrl.toString());
};

module.exports.callback = async (req, res) => {
  const state = req.query.state;
  const storedState = req.cookies ? req.cookies[stateKey] : null;
  res.clearCookie(stateKey, stateCookieClearOptions);

  if (!state || !storedState || state !== storedState) {
    return res.status(400).send('Spotify authorization could not be verified.');
  }
  if (!req.query.code) {
    return res.status(400).send('Spotify did not return an authorization code.');
  }

  try {
    const tokenBody = await requestSpotify('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: getClientAuthorization(),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code: req.query.code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenBody || !tokenBody.access_token) {
      throw new Error('Spotify did not return an access token.');
    }

    const playlist = await createPlaylist(tokenBody.access_token);
    res.redirect('/?spotify_playlist_url=' + encodeURIComponent(playlist.url));
  } catch (error) {
    console.error(error.message);
    res.status(502).send('Unable to create a Spotify playlist. Please try again.');
  }
};

module.exports.refresh_token = async (req, res) => {
  const refreshToken = req.body && req.body.refresh_token;
  if (typeof refreshToken !== 'string' || refreshToken.length === 0) {
    return res.status(400).json({ error: 'A refresh_token is required.' });
  }

  try {
    const tokenBody = await requestSpotify('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: getClientAuthorization(),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });
    if (!tokenBody || !tokenBody.access_token) {
      throw new Error('Spotify did not return an access token.');
    }
    res.json({ access_token: tokenBody.access_token });
  } catch (error) {
    console.error(error.message);
    res.status(502).json({ error: 'Unable to refresh the Spotify token.' });
  }
};

async function createPlaylist(accessToken) {
  const playlist = await requestSpotify('https://api.spotify.com/v1/me/playlists', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Random Playlist',
      description: `Playlist made through Genrify on ${new Date().toDateString()}`,
      public: true
    }),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
  });

  const playlistUrl = playlist && playlist.external_urls && playlist.external_urls.spotify;
  const parsedPlaylistUrl = playlistUrl ? new URL(playlistUrl) : null;
  if (!playlist || !playlist.id || !parsedPlaylistUrl ||
    parsedPlaylistUrl.protocol !== 'https:' || parsedPlaylistUrl.hostname !== 'open.spotify.com') {
    throw new Error('Spotify returned an invalid playlist response.');
  }

  const collection = await getPlaylistCollection();
  await collection.insertOne({ url: playlistUrl, playlist_id: playlist.id });
  const songObjects = await collection.find({ track_id: { $exists: true } }).toArray();
  const trackUris = songObjects
    .map((song) => song.track_id)
    .filter((uri) => typeof uri === 'string' && /^spotify:track:[A-Za-z0-9]+$/.test(uri));

  for (let offset = 0; offset < trackUris.length; offset += 100) {
    await requestSpotify(`https://api.spotify.com/v1/playlists/${encodeURIComponent(playlist.id)}/items`, {
      method: 'POST',
      body: JSON.stringify({ uris: trackUris.slice(offset, offset + 100) }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  return { url: playlistUrl };
}

async function getPlaylistCollection() {
  const client = require('./utils/db.js');
  const db = await client.getDb();
  return db.collection('user_playlist');
}
