from django.db import models
from django.contrib.auth.models import User
import os
import datetime


def user_directory_path(instance, filename):
    return '{0}/{1}/{2}'.format(instance.user_info.user_account.username, instance.folder, filename)

class Functions(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=True)
    ports = models.CharField(max_length=500, blank=True)
    direction = models.CharField(max_length=500, blank=True)
    dataType = models.CharField(max_length=500, blank=True)
    code = models.TextField(max_length=10000, blank=True)
    group = models.CharField(max_length=100, blank=True)
    url = models.CharField(max_length=1000, blank=True)
    json = models.TextField(max_length=10000, blank=True)
    def __str__(self):
        return self.name

class AppKeyword(models.Model):
    keyword = models.CharField(max_length=100)
    def __str__(self):
        return self.keyword

class UserInformation(models.Model):
    COLOR_CHOICES = (
        ("black", 'black'),
        ("brown", 'brown'),
        ("red", 'red'),
        ("orange", 'orange'),
        ("yellow", 'yellow'),
        ("green", 'green'),
        ("lightgreen", 'lightgreen'),
        ("blue", 'blue'),
        ("lightblue", 'lightblue'),
        ("violet", 'violet'),
        ("pink", 'pink'),
        ("white", 'white'),
    )
    #username = models.ForeignKey(User, on_delete=models.CASCADE)
    user_account = models.OneToOneField(User, on_delete=models.CASCADE)
    user_name = models.CharField(max_length=100, blank=True)
    email = models.CharField(max_length=100, blank=True)
    first_name = models.CharField(max_length=100, blank=True)
    middle_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=100, blank=True)
    date_signed_up = models.DateTimeField(blank=True)
    picture = models.CharField(max_length=1000, blank=True)
    logged_in = models.CharField(max_length=10, blank=True)
    ip_add = models.CharField(max_length=20, blank=True)
    about_me = models.CharField(max_length=100, blank=True)
    wallpaper = models.CharField(max_length=1000, blank=True)
    absolute_url = models.CharField(max_length=100, blank=True)
    cover_photo1 = models.CharField(max_length=1000, blank=True)
    cover_photo2 = models.CharField(max_length=1000, blank=True)
    cover_photo3 = models.CharField(max_length=1000, blank=True)
    link1 = models.CharField(max_length=100, blank=True)
    link2 = models.CharField(max_length=100, blank=True)
    link_icon1 = models.CharField(max_length=1000, blank=True)
    link_icon2 = models.CharField(max_length=1000, blank=True)
    text_editor = models.TextField(max_length=100000, blank=True)
    text_editor_red = models.IntegerField()
    text_editor_green = models.IntegerField()
    text_editor_blue = models.IntegerField()
    text_editor_color = models.CharField(max_length=20, choices=COLOR_CHOICES)
    last_folder_typed = models.CharField(max_length=100, blank=True)
    last_index_page = models.IntegerField()

    def __str__(self):
        return self.first_name + ' - ' + self.last_name

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('user_profile', args=[str(self.username)])


class FileUpload(models.Model):
    VISIBILITY_CHOICES = (
            ('PU', 'Public'),
            ('FR', 'Friend'),
            ('PR', 'Private'),
            ('CU', 'Custom')
        )
    title = models.CharField(max_length=100, blank=True)
    file = models.FileField(upload_to=user_directory_path, blank=True)
    filename = models.CharField(max_length=50, blank=True)
    file_type = models.CharField(max_length=10, blank=True)
    file_url = models.CharField(max_length=500, blank=True)
    file_path = models.CharField(max_length=500, blank=True)
    folder = models.CharField(max_length=50, blank=True)
    description = models.TextField(max_length=10000, blank=True)
    user_info = models.ForeignKey(UserInformation, on_delete=models.CASCADE)
    date_uploaded = models.DateTimeField(blank=True)
    date_updated = models.DateTimeField(blank=True)
    visibility = models.CharField(max_length=2, choices=VISIBILITY_CHOICES, blank=True)
    hits = models.IntegerField(blank=True)
    associated_html = models.CharField(max_length=10, blank=True)
    keywords = models.ManyToManyField(AppKeyword, related_name='tags', blank=True)
    status = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return str(self.id) + ' - ' + self.filename + ' - ' + self.file_path

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('edit_file', args=[str(self.id)])


class HtmlApp(models.Model):
    files = models.TextField(blank=False, max_length=1000)
    name =  models.CharField(blank=False, max_length=100)
    username = models.ForeignKey(UserInformation, on_delete=models.CASCADE)
    description = models.TextField(max_length=10000, blank=True)

    def __str__(self):
        return str(self.username) + ' - ' + str(self.name)


class Activity(models.Model):
    activity = models.CharField(blank=False, max_length=20)
    media =  models.ForeignKey(FileUpload, on_delete=models.CASCADE)
    user_info = models.ForeignKey(UserInformation, on_delete=models.CASCADE)
    datetime = models.DateTimeField(blank=True)
    date = models.DateField(blank=True)
    time = models.TimeField(blank=True)
    def __str__(self):
        return str(self.user_info) + ' - ' + self.activity + ' - ' + str(self.media)


def user_file_folder(instance, filename):
    upload_dir = str(instance.uploader) + "/" + instance.folder
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    return upload_dir  + "/" + filename


def content_file_name(instance, filename):
    upload_dir = os.path.join(str(instance.username), 'html')
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    return os.path.join(upload_dir, filename)


class Friend(models.Model):
    username = models.CharField(max_length=50)
    friend = models.CharField(max_length=50)
    status = models.CharField(max_length=10)

    def __str__(self):
        return str(self.username) + ' - ' + self.friend + ' - ' + self.status

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('view_app', args=[str(self.id)])


class MediaComment(models.Model):
    comment = models.CharField(max_length=1000)
    user_info = models.ForeignKey(UserInformation, related_name='comments', on_delete=models.CASCADE)
    datetime_commented = models.DateTimeField(blank=True)
    media = models.ForeignKey(FileUpload, related_name='comments', on_delete=models.CASCADE)
    response_to = models.IntegerField(default=0)
    status = models.CharField(max_length=20)

    def __str__(self):
        return str(self.user_info) + ' - ' + str(self.media) + ' - ' + (self.comment)

class ChatMessages(models.Model):
    sender =  models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=10000)
    datetime_sent = models.DateTimeField(blank=True)
    receiver = models.CharField(max_length=50)
    datetime_received = models.DateTimeField(blank=True)
    visible =  models.CharField(max_length=10)

    def __str__(self):
        return self.sender.username + ' - ' + self.message


class Event(models.Model):

    event = models.CharField(max_length=100, blank=True)
    HOUR_CHOICES = (
        (0, '0'),
        (1, '1'),
        (2, '2'),
        (3, '3'),
        (4, '4'),
        (5, '5'),
        (6, '6'),
        (7, '7'),
        (8, '8'),
        (9, '9'),
        (10, '10'),
        (11, '11'),
        (12, '12'),
        (13, '13'),
        (14, '14'),
        (15, '15'),
        (16, '16'),
        (17, '17'),
        (18, '18'),
        (19, '19'),
        (20, '20'),
        (21, '21'),
        (22, '22'),
        (23, '23'),
    )
    MINUTE_CHOICES = (
        (0, '00'),
        (15, '15'),
        (30, '30'),
        (45, '45'),
    )
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    speaker = models.CharField(max_length=100, blank=True)
    attendees = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=100, blank=True)
    location2 = models.CharField(max_length=100, blank=True)
    start_date = models.DateTimeField(blank=True)
    start_hour = models.IntegerField(blank=True,choices=HOUR_CHOICES)
    start_minute = models.IntegerField(blank=True, choices=MINUTE_CHOICES)
    end_date = models.DateTimeField(blank=True)
    end_hour = models.IntegerField(blank=True, choices=HOUR_CHOICES)
    end_minute = models.IntegerField(blank=True, choices=MINUTE_CHOICES)
    work_days = models.IntegerField(default=0)
    status = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=100, blank=True)
    details = models.TextField(max_length=1000, blank=True)
    picture = models.CharField(max_length=1000, blank=True)
    event_id = models.CharField(max_length=100, blank=True)
    approver = models.CharField(max_length=50, blank=True)
    visible_to = models.CharField(max_length=1000, blank=True)
    date_filed = models.DateTimeField(blank=True)

    def __str__(self):
        return self.event + ' - ' + str(self.username)


class Holidays(models.Model):
    name = models.CharField(max_length=50)
    date = models.DateField()
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    year_first_day = models.DateTimeField(default=datetime.datetime.strptime('2020-01-01', '%Y-%m-%d'))
    year_last_day = models.DateTimeField(default=datetime.datetime.strptime('2020-01-01', '%Y-%m-%d'))

    def __str__(self):
        return self.name + ' - ' + str(self.date)


class EmployeeLeaves(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    user_name = models.CharField(max_length=100, blank=True)
    first_name = models.CharField(max_length=100, blank=True)
    middle_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    schedule = models.CharField(max_length=50)
    max_sl = models.IntegerField(default=0)
    max_vl = models.IntegerField(default=0)
    max_el = models.IntegerField(default=0)
    used_sl = models.IntegerField(default=0)
    used_vl = models.IntegerField(default=0)
    used_el = models.IntegerField(default=0)

    def __str__(self):
        return self.first_name + ' - ' + self.last_name