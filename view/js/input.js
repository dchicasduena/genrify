/**
* @author Nhu Nguyen, David Chicas
* @student_id 201916426, 201919354
* @course COMP 3100 - Web Programming
* @year 2022 
*/

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
        $('#selection_menu').hide();
        $('#auth_menu').hide();
        $('#btn_start').on('click', function (e) {
            e.preventDefault();
            $('.mb-auto').hide();
            $('#main_menu').hide();
            $('#auth_menu').hide();
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

    $('.submit').on('click', function (e) {
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
            } else {
                this.id = "submitSubgenre";
                $.ajax({
                    url: '/random/genre/' + userGenre,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (response) {
                        $("#cblist").empty();
                        $('#instruction').text('Choose the subgenres for your playlist!');
                        // Display subgenres
                        for (let i = 0; i < response.length; i++) {
                            let curSubgenre = response[i]
                            // console.log(curSubgenre)
                            let e = $(document.createElement('div')).prop({id: 'cblist' + i,});
                            $('#cblist').append(e);
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
            } else {
                this.id = "createPlaylist";
                $("#cblist").empty();
                $('#cblist').append(
                    $(document.createElement('input')).prop({
                        type: 'range',
                        id: 'numSongs',
                        class: 'form-range',
                        min: '10',
                        max: '50',
                        value: '20',
                        step: '1'
                    })
                );
                $('#instruction').text('Choose the number of songs you want in your playlist:');
                $('#num').text($('#numSongs').val());
            }
        } else if (this.id == 'createPlaylist') { // if submit button is clicked for creating playlist
            let num = $('#numSongs').val();
            console.log(num);
            $.ajax({
                url: '/random/playlist/' + num + '/' + userSubgenre,
                type: 'GET',
                contentType: 'application/json',
                success: function (response) {
                    $('#main_menu').hide();
                    $('#selection_menu').hide();
                    $('#auth_menu').show();
                    console.log(response);
                },
                // If there's an error, we can use the alert box to make sure we understand the problem
                error: function (xhr, status, error) {
                    var errorMessage = xhr.status + ': ' + xhr.statusText
                    alert('Error - ' + errorMessage);
                }
            });
        }
    });

    //$('#numSongs').slider({ // not working rn
    //slide: function (event, ui) {
    //$('#num').text(ui.value);
    //}
    //});
});