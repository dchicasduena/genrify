/**
* @author Nhu Nguyen & David Chicas
* @year 2022 
*/

$(document).ready(function () {
    const playlistUrl = new URLSearchParams(window.location.search).get('spotify_playlist_url');
    if (playlistUrl) {
        const parsedUrl = URL.canParse(playlistUrl) ? new URL(playlistUrl) : null;
        if (parsedUrl && parsedUrl.protocol === 'https:' &&
            parsedUrl.hostname === 'open.spotify.com' &&
            parsedUrl.pathname.startsWith('/playlist/')) {
            $('#spotify_playlist_link').attr('href', parsedUrl.href);
            $('#spotify_success').show();
            $('#main_menu, #selection_menu').hide();
            $('#auth_menu').show();
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            console.error('The OAuth callback contained an invalid Spotify playlist URL.');
        }
    }

    $('#playlist_show').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/random/playlist',
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                $('#playlist_show').hide();
                for (let i = 0; i < response.length; i++) {
                    const entry = $('<p>').addClass('dispPlaylist');
                    entry.append($('<b>').text(response[i].track_name));
                    entry.append(document.createTextNode(' - ' + response[i].track_artist));
                    $('#playlist').append(entry);
                }
            },
            // If there's an error, we can use the alert box to make sure we understand the problem
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    });

});
  