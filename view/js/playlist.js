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
            success: function (response) {
                $('#playlist_show').hide();
                for (i = 0; i < response.length; i++){
                    let song = '<b>' + response[i].track_name + '</b> - ' + response[i].track_artist;
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

        $.ajax({
            url: '/random/playlist',
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                for (i = 0; i < response.length; i++){
                    let genre = response[i].playlist_subgenre[i];
                    p_genres.push(genre);
                };
                console.log(p_genres);
                p_genres.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
                for (var property in counts) {
                    if ( ! counts.hasOwnProperty(property)) {
                       continue;}      
                un_genres.push(property);
                un_count.push(counts[property]);
                 }
            },
            // If there's an error, we can use the alert box to make sure we understand the problem
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });

        new Chart(document.getElementById("pie-chart"), {
          type: 'pie',
          data: {
            labels: p_genres,
            datasets: [{
              backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
              data: [2478,5267,734,784,433]
            }]
          },
          options: {
            title: {
              display: true,
              text: 'Subgenres in Playlist'
            }
          }
      });
    });   
     
});
  