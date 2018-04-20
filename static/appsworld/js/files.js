var fileToUpload;

// Add events
$('input[type=file]').on('change', prepareUpload);

// Grab the files and set them to our variable
function prepareUpload(event)
{
  fileToUpload = event.target.files;
}

function uploadAFile(event) {
    event.stopPropagation(); // Stop stuff happening
    event.preventDefault(); // Totally stop stuff happening
    var filePath;
        $.ajax({
            type: "POST",
            url: "/ajax/file/upload/",
            data: {
            'file_path': filePath,
            'file_to_upload': fileToUpload,
            },
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken)
            },
            success: function (data) {
                //update_app_button.value = data.dvalue;
            }

        });
}