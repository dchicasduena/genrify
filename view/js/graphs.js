colors = ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"]
let p_genres = [];
let counts = {};
let un_genres = [];
let un_count = [];

$(document).ready(function () {
    $(function () {
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
            labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
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