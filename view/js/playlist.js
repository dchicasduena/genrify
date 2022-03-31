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
                for (i = 0; i < response.length; i++){
                    let song = response[i].track_name + ' - ' + response[i].track_artist;
                    // console.log(song);
                    $('#playlist').append(
                        $(document.createElement('p5')).prop({
                            type: 'p5',
                            innerHTML: song + '<br>'
                        }));
                };
            },
            // If there's an error, we can use the alert box to make sure we understand the problem
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    });
});
  