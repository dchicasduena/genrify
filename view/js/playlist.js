/**
* @author Nhu Nguyen, David Chicas
* @student_id 201916426, 201919354
* @course COMP 3100 - Web Programming
* @year 2022 
*/

$(document).ready(function () {

    $('#playlist_show').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/random/playlist',
            type: 'GET',
            contentType: 'application/json',
            success: function (response) { // not returning a response rn, but playlist is imported to mongo
                // console.log(response);
                $('#playlist').empty();
                for (i = 0; i < response.length; i++){
                    let song = '<b>' + response[i].track_name + '</b> - ' + response[i].track_artist;
                    // console.log(song);
                    $('#playlist').append('<p5 class="dispPlaylist"> ' + (song) + ' </p5><br>');
                };
            },
            // If there's an error, we can use the alert box to make sure we understand the problem
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    });

    $('#loggedin').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/random/url',
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                console.log('url: ' + response[0].url);
                window.location.href = response[0].url;
            },
            // If there's an error, we can use the alert box to make sure we understand the problem
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    });
    
});
  