var editor_textarea = document.getElementById("APPSWORLD_EDITOR_TEXTAREA");
var save_changes_button = document.getElementById("APPSWORLD_SAVE_CHANGES_BUTTON");

function ajaxSearch(text_to_find) {
        $.ajax({
            url: "/appsworld/ajax_file_save_changes",
            data: {
            'filename' : filename,
            'file_id' : file_id,
            'file_path': file_path,
            'string_data': editor_textarea.value,
            },
            dataType: 'json',
            success: function (data) {
                save_changes_button.value = "Saved";
            }
        });
}
