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

    $(function () {
        $.ajax({
            url: '/random',
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                $("#cblist").empty();
                console.log(JSON.stringify(response));
                for (let i = 0; i < response.length; i++) {
                    $('#cblist').append(
                        $(document.createElement('button')).prop({
                            type: 'button',
                            innerHTML: response[i],
                            class: 'btnGenre btn btn-secondary fw-bold border-white bg-white'
                        })
                    );
                };

                $('#done').append(
                    $(document.createElement('button')).prop({
                        type: 'button',
                        innerHTML: 'Done',
                        class: "btn btn-lg btn-secondary fw-bold btn-Done"
                    })
                );
            },
            // If there's an error, we can use the alert box to make sure we understand the problem
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    });

    $('#cblist').on('click', function (e) {
        e.preventDefault();
        var btn = $(e.target);
        btn.toggleClass('btn-selected');
        btn.toggleClass('bg-white');
    });

    $('#done').on('click', function (e) {
        e.preventDefault();
        var selected = [];
        $('#cblist').find('.btn-selected').each(function () {
            selected.push($(this).text());
        });
        console.log(selected);
        $.ajax({
            url: '/random/' + selected,
            type: 'GET',
            //data: { genre: selected },
            //dataType: "json",
            contentType: 'application/json',
            success: function (response) {
                console.log(JSON.stringify(response));
                $("#cblist").empty();
                $('#instruction').text('Choose the subgenres for your playlist!');
                for (let i = 0; i < response.length; i++) {
                    $('#cblist').append(
                        $(document.createElement('button')).prop({
                            type: 'button',
                            innerHTML: response[i],
                            class: 'btnGenre btn btn-secondary fw-bold border-white bg-white'
                        })
                    );
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