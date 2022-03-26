/**
* @author Nhu Nguyen, David Chicas
* @student_id 201916426, 201919354
* @course COMP 3100 - Web Programming
* @year 2022 
*/

$(document).ready(function(){
    /**
     * This function binds an event to the start button.
     */

    $("#btn-add").click(function(event) { // shows form
        event.preventDefault();
        // Here we query the server-side
        $.ajax({
            url: '/random',
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                console.log(JSON.stringify(response));
                // add genres to checkbox
            },
            // If there's an error, we can use the alert box to make sure we understand the problem
            error: function (xhr, status, error) {
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    });
});

// Add checkbox     
function addCheckbox(name) {
    var container = $('#cblist');
    var inputs = container.find('input');
    var id = inputs.length+1;
 
    $('<input />', { type: 'checkbox', id: 'cb'+id, value: name }).appendTo(container);
    $('<label />', { 'for': 'cb'+id, text: name }).appendTo(container);
}