var username;
var folder_name_input;
var html_textarea;
var js_textarea;
var css_textarea;
var username_link;
var css_url;
var app_name_text_input;
var label_js_path;
var inserted_string;
var output_div;
var app_code;
var html_filename_label;
var js_filename_label;
var css_filename_label;
    var js_path;
    var css_path;
    var js_source;
    var css_source;
    var js_css_source;
    var update_app_button;
    var csrftoken;
    var html_path_span;
    var select_delete_file;
    var time_string_span;


function getElements() {
    html_textarea = document.getElementById("HTML_CODE_TEXTAREA");
    js_textarea = document.getElementById("JS_CODE_TEXTAREA");
    css_textarea = document.getElementById("CSS_CODE_TEXTAREA");
    app_name_text_input = document.getElementById("app_name");
    label_js_path = document.getElementById("JS_PATH")
    output_div = document.getElementById("OUTPUT_DIV");
    the_username = document.getElementById("THE_USERNAME");
    html_path_span = document.getElementById("HTML_PATH_SPAN");
    select_delete_file = document.getElementById("DELETE_FILE");
    time_string_span = document.getElementById("TIME_STRING_SPAN");
    folder_name_input = document.getElementById("FOLDER_NAME");
}

function addEventListeners(){
    html_textarea.addEventListener('keyup', htmlTextAreaKeydown, true);
    js_textarea.addEventListener('keyup', jsTextAreaKeydown, true);
    css_textarea.addEventListener('keyup', cssTextAreaKeydown, true);
    app_name_text_input.addEventListener('input', appNameTextInputKeydown);
}

function initializeValues(){
    username = the_username.innerHTML;
    app_code = username + "_" + folder_name_input.value;
    js_path = "https://ovalence.pythonanywhere.com" + "/media/" + username + "/" + folder_name_input.value + "/" + app_name_text_input.value + ".js";
    css_path = "https://ovalence.pythonanywhere.com" + "/media/" + username + "/" + folder_name_input.value + "/" + app_name_text_input.value + ".css";
    js_source = "<script type='text/javascript' src='" + js_path + "'></script>";
    css_source = "<link rel='stylesheet' type='text/css' href='" + css_path + "'>";
    js_css_source = js_source + "\n" + css_source + "\n";
    inserted_string = js_css_source;
    csrftoken = getCookie('csrftoken');
}


window.onload = function(){
    getElements();
    addEventListeners();
    getUser();
    initializeValues();
}



function getJsLibrary() {
    var stringToInsert = "<script type='text/javascript' src='" + js_select_object.value + "'></script>" + "\n";
    if (html_textarea.value.includes(stringToInsert)) {
        html_textarea.value = html_textarea.value.replace(stringToInsert, "");
    }
    else {
    html_textarea.value = stringToInsert + html_textarea.value;
    }
}

function getCssLibrary() {
    var stringToInsert = "<link rel='stylesheet' type='text/css' href='" + css_select_object.value + "'>" + "\n";
    if (html_textarea.value.includes(stringToInsert)) {
        html_textarea.value = html_textarea.value.replace(stringToInsert, "");
    }
    else {
    html_textarea.value = stringToInsert + html_textarea.value;
    }
}



function htmlTextAreaKeydown(e) {
    viewOutput();
}

function jsTextAreaKeydown(e) {
    viewOutput();
}

function cssTextAreaKeydown(e) {
    viewOutput();
}


function viewOutput() {
    var jsStringToFind = js_source;
    var cssStringToFind = css_source;
    if (html_textarea.value.includes(jsStringToFind)) {
        output_div.innerHTML= html_textarea.value.replace(jsStringToFind, "<script>"+ js_textarea.value + "</script>");
    }
    if (html_textarea.value.includes(cssStringToFind)) {
        output_div.innerHTML= html_textarea.value.replace(cssStringToFind, "<style>"+ css_textarea.value + "</style>");
    }
    else {
        output_div.innerHTML= html_textarea.value
    }

}

/*
function saveCodes() {
    if (app_name_text_input.value != ""){
        $.ajax({
            type: "POST",
            url: "/appsworld/write_codes_to_file/",
            data: {
            'html_code': html_textarea.value,
            'js_code': js_textarea.value,
            'css_code': css_textarea.value,
            'username': username,
            'app_name': app_name_text_input.value,
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
}
*/


function deleteFile(filePath) {
        $.ajax({
            url: "/ajax/file/delete/",
            data: {
            'file_path': filePath,
            },
            dataType: 'json',
            success: function (data) {
                //update_app_button.value = data.dvalue;
            }
        });
}

$('#DELETE_FILE').change(function(){
    var value = $(this).val();
});


function getUser() {
    $.ajax({
        type: "GET",
        url: "/ajax/get_user/",
        data: {
        },
        dataType: 'json',
        success: function (data) {
            username = data.username;
        }
    });
}

/*
function getCodes() {
    $.ajax({
        type: "GET",
        url: "/ajax/place_codes_to_textarea/",
        data: {
        'app_name': app_name_text_input.value,
        'username': username
        },
        dataType: 'json',
        success: function (data) {
            html_textarea.value = data.html_code;
            js_textarea.value = data.js_code;
            css_textarea.value = data.css_code;
        }
    });
}
*/

function appNameTextInputKeydown() {
    includeJsAndCss();
}

function includeJsAndCss() {
    folder_name_input.value = app_name_text_input.value.split(" ").join("_") + "_" + time_string_span.textContent;
    app_code = username + "_" + folder_name_input.value;
    var textarea_ = html_textarea.value.replace(inserted_string, "");
    js_path = "https://ovalence.pythonanywhere.com" + "/media/" + username + "/" + folder_name_input.value + "/" + app_name_text_input.value + ".js";
    css_path = "https://ovalence.pythonanywhere.com" + "/media/" + username + "/" + folder_name_input.value + "/" + app_name_text_input.value + ".css";
    js_source = "<script type='text/javascript' src='" + js_path + "'></script>";
    css_source = "<link rel='stylesheet' type='text/css' href='" + css_path + "'>";
    js_css_source = js_source + "\n" + css_source + "\n";
    html_textarea.value = js_css_source + textarea_;
    inserted_string = js_css_source;
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






