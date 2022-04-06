
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
    });
});