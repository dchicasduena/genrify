/**
* @author Nhu Nguyen & David Chicas
* @year 2022 
*/

colors = []
let p_genres = [];
let counts = {};
let un_genres = [];
let un_count = [];

$(document).ready(function () {
    /**
     * This function binds an event to the start button.
     */

    var songs = [] // array of all songs
    var genreList = []; // list of all genres
    var subGenreList = []; // list of all subgenres
    var userGenre = []; // list of user genres
    var userSubgenre = []; // list of user subgenres

    $(function () {
        // $('#selection_menu').hide();
        // $('#auth_menu').hide();
        $('#btn_start').on('click', function (e) {
            e.preventDefault();
            $('main').removeClass('center');
            $('.mb-auto').hide();
            $('#main_menu').hide();
            $('#auth_menu').hide();
            //$('#blob').hide();
            $('#selection_menu').show();

            $.ajax({
                url: '/random',
                type: 'GET',
                contentType: 'application/json',
                success: function (response) {
                    $("#cblist").empty();

                    // Display genres
                    for (let i = 0; i < response.length; i++) {
                        $('#cblist').append(
                            $(document.createElement('button')).prop({
                                type: 'button',
                                innerHTML: response[i],
                                class: 'btnGenre btn btn-secondary fw-bold border-white bg-white'
                            })
                        );
                    };
                    // Add submit button
                    $('#submitGenre').show();
                },
                // If there's an error, we can use the alert box to make sure we understand the problem
                error: function (xhr, status, error) {
                    var errorMessage = xhr.status + ': ' + xhr.statusText
                    alert('Error - ' + errorMessage);
                }
            });
        });
    });

    // Toggle button for selection
    $('#cblist').on('click', function (e) {
        e.preventDefault();
        var btn = $(e.target);
        if (btn.is(":button")) { // if the clicked element is a button
            btn.toggleClass('btn-selected');
            btn.toggleClass('bg-white');
        }
    });

    $('.btn-Done').on('click', function (e) {
        e.preventDefault();
        if (this.id == 'submitGenre') { // if submit button is clicked for choosing genre
            // Clear user list and add selected genres
            userGenre = [];
            $('#cblist').find('.btn-selected').each(function () {
                userGenre.push($(this).text()); // add selected genres to userGenre
            });
            // Alert user if too few genres are selected
            if (userGenre.length < 1) {
                alert('Please select a genres.');
            } else if (userGenre.length > 5) {
                alert('Please select no more than 5 genres.');
            } else {
                $.ajax({
                    url: '/random/genre/' + userGenre,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (response) {
                        $("#cblist").empty();
                        $('#instruction').text('Choose the subgenres for your playlist!');
                        $('#submitGenre').attr('id', 'submitSubgenre');
                        // Display subgenres
                        for (let i = 0; i < response.length; i++) {
                            let curSubgenre = response[i]
                            let e = $(document.createElement('div')).prop({ id: 'cblist' + i, });
                            $('#cblist').append(e);
                            e.append($("<br>"));
                            e.append($("<h3>").text(userGenre[i] + " subgenres"));
                            for (let j = 0; j < curSubgenre.length; j++) {
                                e.append(
                                    $(document.createElement('button')).prop({
                                        type: 'button',
                                        innerHTML: curSubgenre[j],
                                        class: 'btnGenre btn btn-secondary fw-bold border-white bg-white'
                                    })
                                );
                            }
                        };
                    },
                    // If there's an error, we can use the alert box to make sure we understand the problem
                    error: function (xhr, status, error) {
                        var errorMessage = xhr.status + ': ' + xhr.statusText
                        alert('Error - ' + errorMessage);
                    }
                });
            }
        } else if (this.id == 'submitSubgenre') { // if submit button is clicked for choosing subgenre
            // Clear user list and add selected subgenres
            userSubgenre = [];
            $('#cblist').find('.btn-selected').each(function () {
                userSubgenre.push($(this).text()); // add selected genres to userGenre
            });
            // Alert user if too few genres are selected
            if (userSubgenre.length < 1) {
                alert('Please select a subgenres.');
            } else if (userSubgenre.length > 10) {
                alert('Please select no more than 10 subgenres.');
            } else {
                this.id = "createPlaylist";
                $("#cblist").empty();
                $('#cblist').append(
                    $(document.createElement('div')).prop({
                        class: 'form-outline',
                        id: 'number_input'
                    })
                );
                $('#instruction').text('Choose the size of your playlist!');
                $('#number_input').append(
                    $(document.createElement('input')).prop({
                        class: 'form-control',
                        id: 'numSongs',
                        type: 'number',
                        min: '10',
                        max: '50',
                        value: '20'

                    })
                );
                $('#number_input').append(
                    $(document.createElement('label')).prop({
                        class: 'form-label',
                        for: 'numSongs',
                        text: 'Number of Songs'
                    })
                );
                //$('#instruction').text('Choose the number of songs you want in your playlist:');
                // $('#num').text($('#numSongs').val());
            }
        } else if (this.id == 'createPlaylist') { // if submit button is clicked for creating playlist
            // Alert user if too few genres are selected
            let num = $('#numSongs').val();
            if (num < 10 || num > 50) {
                alert('Please select a number of songs between 10 and 50.');
            } else {
                $('#instruction').text('Creating your playlist...');
                $('#number_input').hide();
                $('.submit').empty();
                $('.submit').append(
                    $(document.createElement('i')).prop({
                        class: 'fa fa-spinner fa-spin fa-3x fa-fw'
                    })
                );
                $.ajax({
                    url: '/random/playlist/' + num + '/' + userSubgenre,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (response) {
                        $('#main_menu').hide();
                        $('#selection_menu').hide();
                        $('#auth_menu').show();
                        // console.log(response);
                        $.ajax({
                            url: '/random/playlist',
                            type: 'GET',
                            contentType: 'application/json',
                            success: function (response) {
                                for (i = 0; i < response.length; i++) {
                                    let song_subgenre = response[i].playlist_subgenre;
                                    for (j = 0; j < song_subgenre.length; j++) {
                                        if (userSubgenre.includes(song_subgenre[j])) {
                                            p_genres.push(song_subgenre[j]);
                                        }
                                    }
                                };

                                for (i = 0; i < (response.length * 2); i++) {
                                    color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
                                    if (color.length !== 6) {
                                        colors.push(color);
                                    }
                                };

                                p_genres.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });

                                for (var property in counts) {
                                    if (!counts.hasOwnProperty(property)) {
                                        continue;
                                    }
                                    un_genres.push(property);
                                    un_count.push(counts[property]);
                                }

                                Chart.defaults.global.defaultFontColor = '#fff';
                                Chart.defaults.global.defaultFontSize = 20;
                                Chart.defaults.global.defaultFontStyle = 'bold';

                            var ChartGenres = new Chart(document.getElementById("doughnut-chart"), {
                                type: 'pie',
                                data: {
                                    labels: un_genres,
                                    datasets: [
                                        {
                                            backgroundColor: colors,
                                            data: un_count
                                        }
                                    ]
                                },
                                options: {
                                    animation: {
                                      onComplete: function() {
                                        var a = document.getElementById('download');
                                        a.href = ChartGenres.toBase64Image();
                                        a.download = 'SubgenreChart.png';
                                      }
                                    }
                                  }
                            });
                        },
                        // If there's an error, we can use the alert box to make sure we understand the problem
                        error: function (xhr, status, error) {
                            var errorMessage = xhr.status + ': ' + xhr.statusText
                            alert('Error - ' + errorMessage);
                        }
                    });

                    },
                    // If there's an error, we can use the alert box to make sure we understand the problem
                    error: function (xhr, status, error) {
                        var errorMessage = xhr.status + ': ' + xhr.statusText
                        alert('Error - ' + errorMessage);
                    }
                });
            }
        }
    });
});