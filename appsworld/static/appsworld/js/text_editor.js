window.CSRF_TOKEN = "{{ csrf_token }}"

var editor_textarea;
var save_changes_button;
var output_div;
var file_path_display;

function ajaxFileSaveChanges(filename, file_id, file_path) {
        $.ajax({
            type: "POST",
            url: "/appsworld/ajax_file_save_changes",
            data: {
            'filename' : filename,
            'file_id' : file_id,
            'file_path': file_path,
            'string_data': editor_textarea.value,
            },
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'))
            },
            success: function (data) {
                save_changes_button.value = "Saved";
                save_changes_button.style.backgroundColor = "Green";
            }
        });
}

function getElements() {
    output_div = document.getElementById("OUTPUT_DIV");
    editor_textarea = document.getElementById("APPSWORLD_EDITOR_TEXTAREA");
    save_changes_button = document.getElementById("APPSWORLD_SAVE_CHANGES_BUTTON");
    file_path_display = document.getElementById("APPSWORLD_FILENAME")
}

function addEventListeners(){
    editor_textarea.addEventListener('keyup', htmlTextAreaKeydown, true);
}

function htmlTextAreaKeydown(e) {
    viewOutput();
    save_changes_button.value = "Save"
    save_changes_button.style.backgroundColor = "Green";
}

function viewOutput() {
    output_div.innerHTML= editor_textarea.value
}


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$(document).delegate('#APPSWORLD_EDITOR_TEXTAREA', 'keydown', function(e) {
  var keyCode = e.keyCode || e.which;

  if (keyCode == 9) {
    e.preventDefault();
    var start = $(this).get(0).selectionStart;
    var end = $(this).get(0).selectionEnd;

    // set textarea value to: text before caret + tab + text after caret
    $(this).val($(this).val().substring(0, start)
                + "\t"
                + $(this).val().substring(end));

    // put caret at right position again
    $(this).get(0).selectionStart =
    $(this).get(0).selectionEnd = start + 1;
  }
});

window.onload = function(){
    getElements();
    addEventListeners();
}
