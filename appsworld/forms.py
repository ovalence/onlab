from django import forms
from django.contrib.auth.models import User
from .models import *


class FunctionForm(forms.ModelForm):
    name = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'FUNCTION_NAME', 'placeholder':'Name'}))
    ports = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'FUNCTION_PORTS', 'placeholder':'Ports'}))
    direction = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'FUNCTION_DIR', 'placeholder':'Direction'}))
    dataType = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'FUNCTION_TYPE', 'placeholder':'Data Type'}))
    code = forms.CharField(required=True, widget=forms.Textarea(attrs={'id': 'FUNCTION_CODE', 'placeholder': 'Code'}))
    group = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'FUNCTION_GROUP', 'placeholder': 'Group'}))
    class Meta:
        model = Functions
        fields = ['name', 'ports', 'direction', 'dataType', 'code', 'group']


class SearchForm(forms.Form):
    text_to_find = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'SEARCH_INPUT', 'class': 'form-control', 'placeholder':'Search', 'name': 'searchbox_input'}))


class SignUpForm(forms.ModelForm):

    username = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'SIGN_UP_USERNAME', 'class': 'form-control', 'placeholder':'Username'}))
    email = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'SIGN_UP_EMAIL', 'class': 'form-control', 'type' : 'email', 'placeholder':'Email'}))
    first_name = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'SIGN_UP_FIRST_NAME', 'class': 'form-control', 'placeholder': 'First Name'}))
    last_name = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'SIGN_UP_LAST_NAME', 'class': 'form-control', 'placeholder': 'Last Name'}))
    password = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'SIGN_UP_PASSWORD', 'class': 'form-control', 'placeholder': 'Password', 'type': 'password'}))
    repeat_password = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'REPEAT_PASSWORD', 'class': 'form-control', 'placeholder': 'Repeat Password', 'type': 'password'}))
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']


class PreferencesForm(forms.ModelForm):
    about_me = forms.CharField(required=False, widget=forms.Textarea(attrs={'id': 'PROFILE_FORM_ABOUTME', 'class': 'form-control', 'placeholder':'Describe yourself.'}))
    location = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'PROFILE_FORM_LOCATION', 'class': 'form-control', 'placeholder':'Location'}))
    picture = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'PROFILE_FORM_PICTURE', 'class': 'form-control', 'placeholder':'Profile Picture URL'}))
    wallpaper = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'PROFILE_FORM_WALLPAPER', 'class': 'form-control', 'placeholder':'Wallpaper URL'}))
    panel_transparency = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'PROFILE_FORM_PANELTRANSPARENCY', 'class': 'form-control', 'placeholder':'Enter between 0-1, inclusive.'}))
    cover_photo1 = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'PROFILE_FORM_COVERPHOTO1', 'class': 'form-control', 'placeholder':'Cover Photo 1 URL'}))
    cover_photo2 = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'PROFILE_FORM_COVERPHOTO2', 'class': 'form-control', 'placeholder':'Cover Photo 2 URL'}))
    cover_photo3 = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'PROFILE_FORM_COVERPHOTO3', 'class': 'form-control', 'placeholder':'Cover Photo 3 URL'}))
    link1 = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'PROFILE_FORM_LINK1', 'class': 'form-control', 'placeholder':'URL of your other account, such as Facebook, Twitter, Youtube.'}))
    link1 = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'PROFILE_FORM_LINK1', 'class': 'form-control', 'placeholder':'Link2'}))
    link_icon1 = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'PROFILE_FORM_LINK1', 'class': 'form-control', 'placeholder':'Link1 icon'}))
    link_icon2 = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'PROFILE_FORM_LINK2', 'class': 'form-control', 'placeholder':'Link2 icon'}))
    text_editor_red = forms.IntegerField(required=False, widget=forms.TextInput(attrs={'type': 'range', 'id': 'FORM_PREFERENCES_RED', 'value' : '0'}))
    text_editor_green = forms.IntegerField(required=False, widget=forms.TextInput(attrs={'type': 'range', 'id': 'FORM_PREFERENCES_GREEN', 'value' : '0'}))
    text_editor_blue = forms.IntegerField(required=False, widget=forms.TextInput(attrs={'type': 'range', 'id': 'FORM_PREFERENCES_BLUE', 'value' : '0'}))
    text_editor_color = forms.ChoiceField(choices=UserInformation.COLOR_CHOICES, required=False, widget=forms.Select(attrs={'id': 'FORM_PREFERENCES_COLOR', 'class': 'form-control'}))
    class Meta:
        model = UserInformation
        fields = ['about_me', 'location']


class TextEditorPreferencesForm(forms.ModelForm):
    text_editor_red = forms.IntegerField(required=False, widget=forms.TextInput(attrs={'type': 'range', 'id': 'FORM_PREFERENCES_RED', 'value' : '0', 'max' : '255',}))
    text_editor_green = forms.IntegerField(required=False, widget=forms.TextInput(attrs={'type': 'range', 'id': 'FORM_PREFERENCES_GREEN', 'value' : '0' , 'max' : '255',}))
    text_editor_blue = forms.IntegerField(required=False, widget=forms.TextInput(attrs={'type': 'range', 'id': 'FORM_PREFERENCES_BLUE', 'value' : '0',  'max' : '255',}))
    text_editor_color = forms.ChoiceField(choices=UserInformation.COLOR_CHOICES, required=False, widget=forms.Select(attrs={'id': 'FORM_PREFERENCES_COLOR', 'class': 'form-control'}))
    class Meta:
        model = UserInformation
        fields = ['text_editor_red', 'text_editor_green', 'text_editor_blue', 'text_editor_color']

class TextEditorForm(forms.ModelForm):
    text_editor = forms.CharField(required=False, widget=forms.Textarea(attrs={'id': 'TEXT_EDITOR', 'class':'numbered-text-editor'}))
    class Meta:
        model = UserInformation
        fields = ['text_editor']


class LoginForm(forms.Form):

    username = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'USERNAME', 'class': 'form-control', 'placeholder':'Username'}))
    password = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'PASSWORD', 'class': 'form-control', 'placeholder':'Password', 'type': 'password'}))

    class Meta:
        model = User
        fields = ['username', 'password']


class FileUploadForm(forms.ModelForm):
    file = forms.FileField(required=False, widget=forms.ClearableFileInput(attrs={'id': 'FILE_UPLOAD_FILE', 'multiple': True, 'class': 'btn btn-sm btn-default'}))
    filename = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'FILE_UPLOAD_FILENAME', 'placeholder': 'filename.file_type'}))
    folder = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'FILE_UPLOAD_FOLDER', 'placeholder': 'Folder name', 'class': 'form-control'}))
    description = forms.CharField(required=False, widget=forms.Textarea(attrs={'id': 'FILE_UPLOAD_DESCRIPTION', 'placeholder': 'Description'}))
    visibility = forms.ChoiceField(choices=FileUpload.VISIBILITY_CHOICES, required=False, widget=forms.Select(attrs={'id': 'FILE_UPLOAD_VISIBILITY', "name": "select_0" }))
    associated_html = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'FILE_UPLOAD_ASSOC_HTML', 'class' : 'form-control' , 'placeholder': 'HTML ID to View'}))
    keywords = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'FILE_UPLOAD_KEYWORDS', 'placeholder':'Keywords separate by # sign.'}))
    class Meta:
        model = FileUpload
        fields = ['file', 'filename', 'folder', 'description', 'visibility', 'associated_html', 'keywords']


class FileUpdateForm(forms.ModelForm):
    associated_html = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'FILE_UPLOAD_ASSOC_HTML', 'class' : 'form-control' , 'placeholder': 'HTML ID to View'}))
    class Meta:
        model = FileUpload
        fields = ['associated_html']


class NewFileForm(forms.ModelForm):
    filename = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'NEW_FILE_FILENAME', 'placeholder': 'filename.file_type', 'class': 'form-control'}))
    folder = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'NEW_FILE_FOLDER', 'value': 'Default', 'class': 'form-control' }))
    class Meta:
        model = FileUpload
        fields = ['filename', 'folder']


class EventForm(forms.ModelForm):
    event_id = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'EVENT_ID', 'class' : 'form-control', 'readonly':'readonly'}))
    event = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'EVENT_EVENT', 'class' : 'form-control'}))
    speaker = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'EVENT_SPEAKER', 'class' : 'form-control'}))
    attendees = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'EVENT_ATTENDEES', 'class' : 'form-control'}))
    start_date = forms.DateField(required=True, widget=forms.DateInput(attrs={'id': 'EVENT_START_DATE', 'class' : 'form-control'}))
    start_hour = forms.ChoiceField(choices=Event.HOUR_CHOICES, required=True, widget=forms.Select(attrs={'id': 'EVENT_START_HOUR', "name": "select_0" }))
    start_minute = forms.ChoiceField(choices=Event.MINUTE_CHOICES, required=True, widget=forms.Select(attrs={'id': 'EVENT_START_MINUTE', "name": "select_0" }))
    end_date = forms.DateField(required=True, widget=forms.DateInput(attrs={'id': 'EVENT_END_DATE', 'class' : 'form-control'}))
    end_hour = forms.ChoiceField(choices=Event.HOUR_CHOICES, required=True, widget=forms.Select(attrs={'id': 'EVENT_END_HOUR', "name": "select_0" }))
    end_minute = forms.ChoiceField(choices=Event.MINUTE_CHOICES, required=True, widget=forms.Select(attrs={'id': 'EVENT_END_MINUTE', "name": "select_0" }))
    class Meta:
        model = Event
        fields = ['event', 'speaker', 'attendees', 'start_date', 'start_hour', 'start_minute', 'end_date', 'end_hour', 'end_minute', 'event_id']


class LeaveForm(forms.ModelForm):

    EVENT_CHOICES = (
            ("SL", 'War'),
            ("VL", 'Vacation Leave'),
            ("EL", 'Emergency Leave'),
        )
    STATUS_CHOICES = (
            ("NEW", "NEW"),
            ("RECEIVED", "RECEIVED"),
            ("APPROVED", "APPROVED"),
            ("CANCELLED", "CANCELLED"),
        )
    START_HOUR_CHOICES = (
            (8, "08"),
            (13, "13"),
        )
    START_MINUTE_CHOICES = (
            (0, "00"),
        )
    END_HOUR_CHOICES = (
            (12, "12"),
            (17, "17"),
        )
    END_MINUTE_CHOICES = (
            (0, "00"),
        )
    event = forms.ChoiceField(choices=EVENT_CHOICES, required=True, widget=forms.Select(attrs={'id': 'EVENT_EVENT', "name": "select_0" }))
    approver_name = forms.ChoiceField(required=False, widget=forms.Select(attrs={'id': 'EVENT_APPROVER_NAME'}))
    attendees = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'EVENT_ATTENDEES'}))
    details =  forms.CharField(required=True, widget=forms.Textarea(attrs={'id': 'EVENT_DETAILS'}))
    status =  forms.ChoiceField(choices=STATUS_CHOICES, required=True, widget=forms.Select(attrs={'id': 'EVENT_STATUS', "name": "select_0" }))
    start_date = forms.CharField(required=True, widget=forms.TextInput(attrs={'type': 'date', 'id': 'EVENT_START_DATE'}))
    start_hour = forms.ChoiceField(choices=START_HOUR_CHOICES, required=True, widget=forms.Select(attrs={'id': 'EVENT_START_HOUR', "name": "select_0" }))
    start_minute = forms.ChoiceField(choices=START_MINUTE_CHOICES, required=True, widget=forms.Select(attrs={'id': 'EVENT_START_MINUTE', "name": "select_0" }))
    end_date = forms.DateField(required=True, widget=forms.TextInput(attrs={'type' : 'date', 'id': 'EVENT_END_DATE'}))
    end_hour = forms.ChoiceField(choices=END_HOUR_CHOICES, required=True, widget=forms.Select(attrs={'id': 'EVENT_END_HOUR', "name": "select_0" }))
    end_minute = forms.ChoiceField(choices=END_MINUTE_CHOICES, required=True, widget=forms.Select(attrs={'id': 'EVENT_END_MINUTE', "name": "select_0" }))
    work_days = forms.FloatField(required=False, widget=forms.TextInput(attrs={'id': 'EVENT_WORK_DAYS', 'readonly' : 'readonly'}))
    visible_to = forms.CharField(required=True, widget=forms.Textarea(attrs={'id': 'EVENT_VISIBLE_TO'}))
    date_filed = forms.DateTimeField(required=False,  widget=forms.TextInput(attrs={'id': 'EVENT_DATE_FILED', 'readonly':'readonly'}))
    event_id = forms.CharField(required=False, widget=forms.TextInput(attrs={'id': 'EVENT_ID', 'readonly':'readonly'}))

    class Meta:
        model = Event
        fields = ['event', 'approver', 'attendees', 'details', 'status', 'start_date', 'start_hour', 'start_minute', 'end_date', 'end_hour', 'end_minute', 'work_days', 'visible_to', 'date_filed', 'event_id']


class HolidayForm(forms.ModelForm):
    name = forms.CharField(required=True, widget=forms.TextInput(attrs={'id': 'HOLIDAY_NAME'}))
    date = forms.DateField(required=True, widget=forms.TextInput(attrs={'type': 'date', 'id': 'HOLIDAY_DATE'}))
    year_first_day = forms.DateField(required=True, widget=forms.TextInput(attrs={'type': 'date', 'id': 'HOLIDAY_START'}))
    year_last_day = forms.DateField(required=True, widget=forms.Select(attrs={'id': 'HOLIDAY_END', "name": "select_0" }))

    class Meta:
        model = Holidays
        fields = ['name', 'date', 'username', 'year_first_day', 'year_last_day']
