from django.shortcuts import render, redirect
from .forms import *
import datetime
from django.utils import timezone
from django.contrib import auth
from django.views.generic import View
from django.contrib.auth.models import User
from .models import *
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.http import HttpResponse
from django.http import HttpRequest
from django.db.models import Q
from django.conf import settings
from django.core import serializers
from django import template
from django.core.files import File
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import FunctionSerializer
from .serializers import MediaSerializer
from .serializers import MediaCommentSerializer
from .serializers import ActivitySerializer
from .serializers import HtmlAppSerializer
from django.http import Http404
from django.views.generic.edit import FormView
register = template.Library()
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.http import HttpResponseRedirect
from rest_framework import status
#import pygeoip


import shutil
import os
import time
import calendar
import json


class HtmlAppList(APIView):
    def get(self, request):
        html_apps = HtmlApp.objects.all()
        serializer = HtmlAppSerializer(html_apps, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = HtmlAppSerializer(data=request.data)
        if serializer.is_valid():
            time_now = timezone.now()
            user = User.objects.get(username = request.user)
            user_info = UserInformation.objects.get(username = user)
            serializer.username = user_info
            serializer.save()
            addActivity('htmlapp', serializer.data['id'])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HtmlAppDetails(APIView):
    def get_object(self, pk):
        try:
            return HtmlApp.objects.get(pk=pk)
        except HtmlApp.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        snippet = self.get_object(pk)
        serializer = HtmlAppSerializer(snippet)
        return Response(serializer.data)

    def put(self, request, pk):
        snippet = self.get_object(pk)
        serializer = HtmlAppSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class MediaCommentList(APIView):
    def get(self, request, pk):
        media_comment = MediaComment.objects.filter(media = pk)
        serializer = MediaCommentSerializer(media_comment, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MediaCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MediaCommentDetails(APIView):
    def get_object(self, pk):
        try:
            return MediaComment.objects.get(pk=pk)
        except MediaComment.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        snippet = self.get_object(pk)
        serializer = MediaCommentSerializer(snippet)
        return Response(serializer.data)

    def put(self, request, pk):
        snippet = self.get_object(pk)
        serializer = MediaCommentSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MediaList(APIView):
    def get(self, request):
        media = FileUpload.objects.all()
        serializer = MediaSerializer(media, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MediaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MediaDetails(APIView):
    def get_object(self, pk):
        try:
            return FileUpload.objects.get(pk=pk)
        except FileUpload.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        snippet = self.get_object(pk)
        serializer = MediaSerializer(snippet)
        text_file = ""
        text_string = ""
        if snippet.file_type == "html" or snippet.file_type == "javascript" or snippet.file_type == "css" or snippet.file_type == "text":
            text_file = open(snippet.file_path, 'r')
            text_string = text_file.read()
        data = {
            'media' : serializer.data,
            'text_string' : text_string
        }
        #return Response(serializer.data)
        return Response(data)

    def put(self, request, pk):
        snippet = self.get_object(pk)
        serializer = MediaSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def view_control_panel(request):
    template = "appsworld/view_control_panel.html"
    context = {}
    return render(request, template, context)


def view_edit_blog_entry(request, blog_entry_id):

    if request.user.is_authenticated:
        logged_user_info = UserInformation.objects.get(username=request.user)
        func = Functions.objects.all()
        functions_JSON = serializers.serialize("json", func)
        media = FileUpload.objects.filter(username = logged_user_info)
        #media = FileUpload.objects.raw('SELECT * FROM appsworld_FileUpload')
        media_json = serializers.serialize("json", media)
        app = HtmlApp.objects.filter(id=blog_entry_id)
        app_json = serializers.serialize("json", app)
        sources = "";
        for source in func:
            sources += "<script src='" + source.url + "'></script>";

        create_object_str = ""
        #for f in func:
            #create_object_str += "import " + f.name + " from " + "'" + f.url +"';\n"

        create_object_str += "function createObject(id){\n"
        create_object_str += "\t var obj;\n"

        i=0
        for f in func:
            create_object_str += "if (id ==" + str(f.id) + "){\n"
            create_object_str += "\t obj = new " + f.name + "();\n"
            create_object_str += "\t return obj;\n"
            create_object_str += "\t}\n"
            i = i+1
        create_object_str += "}\n"
        template= 'appsworld/temp_create_blog_entry.html'
        context = {
                'functions' : func,
                'functions_JSON': functions_JSON,
                'sources': sources,
                'createObjectString' : create_object_str,
                'media_json' : media_json,
                'app_json' : app_json,
                'websiteName' : settings.WEBSITE_NAME,
                'user_id' : request.user.id,
                'edit' : True,
                'html_app_id' : blog_entry_id 
            }
        del functions_JSON
        return render(request, template, context)

    else:
        return HttpResponse("You are not logged-in.")


def view_create_blog_entry(request):

    if request.user.is_authenticated:
        logged_user_info = UserInformation.objects.get(username=request.user)
        func = Functions.objects.all()
        functions_JSON = serializers.serialize("json", func)
        media = FileUpload.objects.filter(username = logged_user_info)
        #media = FileUpload.objects.raw('SELECT * FROM appsworld_FileUpload')
        media_json = serializers.serialize("json", media)
        app = HtmlApp.objects.filter(id=17)
        app_json = serializers.serialize("json", app)
        sources = "";
        for source in func:
            sources += "<script src='" + source.url + "'></script>";

        create_object_str = ""
        #for f in func:
            #create_object_str += "import " + f.name + " from " + "'" + f.url +"';\n"

        create_object_str += "function createObject(id){\n"
        create_object_str += "\t var obj;\n"

        i=0
        for f in func:
            create_object_str += "if (id ==" + str(f.id) + "){\n"
            create_object_str += "\t obj = new " + f.name + "();\n"
            create_object_str += "\t return obj;\n"
            create_object_str += "\t}\n"
            i = i+1
        create_object_str += "}\n"
        template= 'appsworld/temp_create_blog_entry.html'
        context = {
            'websiteName' : settings.WEBSITE_NAME,
            'logged_user_info' : logged_user_info,
            'functions' : func,
            'functions_JSON': functions_JSON,
            'sources': sources,
            'createObjectString' : create_object_str,
            'media_json' : media_json,
            'user_id' : request.user.id,
            'app_json' : app_json,
            'edit' : False,
            'html_app_id' : 0 
        }
        del functions_JSON
        if request.method == "POST":
            blog_form = CreateBlogForm(request.POST)

        else:
            return render(request, template, context)

    else:
        return HttpResponse("You are not logged-in.")

def view_user_functions(request, profile_username):
    template = 'appsworld/view_user_functions.html'
    user_functions = Functions.objects.filter(username=request.user)
    context = {
        'user_functions': user_functions,
        'se': settings.BASE_DIR,
        }
    return render(request, template, context)


class OnLab(View):
    template_name = 'appsworld/view_onlab.html'
    func = Functions.objects.all()
    functions_JSON = serializers.serialize("json", func)
    sources = "";
    for source in func:
        sources += "<script src='" + source.url + "'></script>";
    create_object_str = ""
    #for f in func:
        #create_object_str += "import " + f.name + " from " + "'" + f.url +"';\n"
    create_object_str += "function createObject(id){\n"
    create_object_str += "\t var obj;\n"

    i=0
    for f in func:
        create_object_str += "if (id ==" + str(f.id) + "){\n"
        create_object_str += "\t obj = new " + f.name + "();\n"
        create_object_str += "\t return obj;\n"
        create_object_str += "\t}\n"
        i = i+1
    create_object_str += "}\n"
    logged_user_info = []

    context = {
        'websiteName' : settings.WEBSITE_NAME,
        'logged_user_info' : logged_user_info,
        'functions' : func,
        'functions_JSON' : functions_JSON,
        'sources' : sources,
        'createObjectString' : create_object_str
    }

    def get(self, request):
        if request.user.is_authenticated:
            self.logged_user_info = UserInformation.objects.get(username=request.user)
        context2 = {'logged_user_info' : self.logged_user_info }
        self.context = dict(self.context, **context2)
        return render(request, self.template_name, self.context)

class FunctionDetails(APIView):
    def get_object(self, pk):
        try:
            return Functions.objects.get(pk=pk)
        except Functions.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        snippet = self.get_object(pk)
        serializer = FunctionSerializer(snippet)
        return Response(serializer.data)

    def put(self, request, pk):
        snippet = self.get_object(pk)
        serializer = FunctionSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def view_app(request, app_id):
    template = 'appsworld/permalink_app.html'
    app = HtmlApp.objects.get(id=app_id)
    context = {
        'app' : app,
    }
    return render(request, template, context)

def addActivity(activity_type, media_id):
    if activity_type == 'upload':
        html_app = HtmlApp.objects.get(id=17)
        media = FileUpload.objects.get(id=media_id)
        function = Functions.objects.get(id=30)
        activity = Activity()
        activity.activity = 'upload'
        time_now = timezone.now()
        activity.user_info = media.user_info
        activity.datetime = time_now
        activity.date = time_now
        activity.time = time_now
        activity.media = media
        activity.function = function
        activity.html_app = html_app
        activity.save()
    if activity_type == 'htmlapp':
        html_app = HtmlApp.objects.get(id=media_id)
        media = FileUpload.objects.get(id=273)
        function = Functions.objects.get(id=30)
        activity = Activity()
        activity.activity = 'htmlapp'
        time_now = timezone.now()
        activity.username = html_app.username
        activity.datetime = time_now
        activity.date = time_now
        activity.time = time_now
        activity.media = media
        activity.function = function
        activity.html_app = html_app
        activity.save()

def addUpload(request, media):
    time_now = timezone.now()
    logged_user = User.objects.get(username=request.user)
    logged_user_info = UserInformation.objects.get(user_account=logged_user)
    media.user_info = logged_user_info
    if media.file:
        file = request.FILES['file']
        media.title = file.name.split(".")[0]
        media.filename = file.name
        media.file_type = file.content_type.split("/")[1]
        media.folder = file.content_type.split("/")[0]
        media.file_url = "http://" + request.META['HTTP_HOST'] + "/" + media_file(username=logged_user.username, folder=media.folder ,filename=media.filename)
        media.file_path = media_file(username=logged_user.username, folder=media.folder ,filename=media.filename)
    else:
        media.title = ""
        media.file_type = ""
    media.date_updated = time_now
    media.date_uploaded = time_now
    media.hits = 1
    media.save();

class FunctionList(APIView):
    def get(self, request):
        functions = Functions.objects.all()
        serializer = FunctionSerializer(functions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FunctionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            activity = App()
            time_now = timezone.now()
            activity.username = request.user
            activity.app_name = "function"
            activity.description = "function"
            activity.datetime_uploaded = time_now
            activity.date_uploaded = time_now
            activity.time_uploaded = time_now
            activity.datetime_updated = timezone.now()
            activity.date_updated = timezone.now()
            activity.month_updated = datetime.datetime.strftime(timezone.now(),'%B')
            activity.time_updated = timezone.now()
            activity.keywords = "function"
            activity.thumbnail = "function"
            activity.visibility = "PU"
            activity.likes = 0
            activity.shares = 0
            activity.views = 0
            activity.create_html_file = False
            activity.shared_app = 0
            activity.post_type = "function"
            activity.file = 7
            activity.html_code = "function"
            activity.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Function(View):
    form_class = FunctionForm
    initial = {'username': 'first_user', 'inputs' : "a b", 'outputs': "c"}
    template_name = 'appsworld/view_create_function.html'

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            logged_user = User.objects.get(username=request.user)
            logged_user_info = UserInformation.objects.get(username=logged_user)
            form = self.form_class(initial=self.initial)
            return render(request, self.template_name, {'form': form, 'websiteName' : settings.WEBSITE_NAME, 'logged_user_info' : logged_user_info })
        else:
            return HttpResponse("You are not logged in.")


    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            function = form.save(commit = False)
            function.username = request.user

            constructorStr = "\tconstructor(){"
            nameStr = "\t\tthis.name = '" + function.name + "';\n"

            ports = function.ports.split(" ")
            varStr = ""
            i = 0
            for inp in ports:
                varStr += "\t\tthis." + inp + " = 1;\n"
                i = i+1

            varNameStr = "\t\tthis.portsName = ["
            i = 0
            for inp in ports:
                if i <len(ports)-1:
                    varNameStr += "'" + inp + "',"
                else:
                    varNameStr += "'" + inp + "'"
                i = i+1
            varNameStr += "];"

            directions = function.direction.split(" ")
            varDirStr = "\t\tthis.direction = ["
            i = 0
            for dir in directions:
                if i <len(directions)-1:
                    varDirStr += "'" + dir + "',"
                else:
                    varDirStr += "'" + dir + "'"
                i = i+1
            varDirStr += "];\n"

            data_types = function.dataType.split(" ")
            dataTypeStr = "\t\tthis.dataType = ["
            i = 0
            for dt in data_types:
                if i <len(data_types)-1:
                    dataTypeStr += "'" + dt + "',"
                else:
                    dataTypeStr += "'" + dt + "'"
                i = i+1
            dataTypeStr += "];\n"

            callStr = "\t\tthis.execute();\n"
            callStr += "\t\tthis.assignPorts();\n"
            onchangeStr = "\t\tthis.onchange = true;\n"

            assignStr = "\tassignPorts(){\n" + "\t\tthis.ports = ["

            i = 0
            for inp in ports:
                if i < len(ports)-1:
                    assignStr += "this." + inp + ","
                else:
                    assignStr += "this." + inp
                i = i+1
            assignStr += "];\n\t}"

            setParameterStr = "\tsetParameter(name, value){\n"
            i = 0
            for inp in ports:
                if i < len(ports)-1:
                    setParameterStr += "\t\tif(name == '" + inp + "'){\n"
                    setParameterStr += "\t\t\tthis." + inp + " = value;\n"
                    setParameterStr += "\t\t}\n"
                i = i+1

            setParameterStr += "\t}"

            executeStr = function.code

            codeStr = "class " + function.name + " {\n" + constructorStr + "\n" + nameStr + "\n" + varStr + "\n" + varNameStr + "\n" + varDirStr + dataTypeStr + callStr + onchangeStr + "\t}" + "\n" + assignStr + "\n" + setParameterStr + "\n" + "\t" + executeStr + "\n" + "}\n"
            #codeStr += "export default " + function.name + ";"

            function.url = media_dir_less(request=request, username=str(request.user), folder="functions") + "/" + function.name + ".js"
            file_dir = media_directory(username=str(request.user), folder="functions")
            write_file(directory=file_dir, filename=function.name + ".js", text=codeStr)
            function.save()

            return redirect('/' + str(request.user) + "/functions")

        return render(request, self.template_name, {'form': form, 'websiteName' : settings.WEBSITE_NAME })


def view_preferences(request):
    template= 'appsworld/view_preferences.html'

    if request.user.is_authenticated:
        logged_user_info = UserInformation.objects.get(username=request.user)
        if request.method == "POST":
            form_text_editor_pref = TextEditorPreferencesForm(request.POST)
            if form_text_editor_pref.is_valid():
                preference = form_text_editor_pref.save(commit=False)
                logged_user_info.username = request.user
                logged_user_info.date_signed_up = timezone.now()
                logged_user_info.last_index_page = 0
                logged_user_info.text_editor_red =  preference.text_editor_red
                logged_user_info.text_editor_green =  preference.text_editor_green
                logged_user_info.text_editor_blue =  preference.text_editor_blue
                logged_user_info.text_editor_color =  preference.text_editor_color
                logged_user_info.save()
                return redirect('view_preferences')
            else:
                return HttpResponse("Form invalid. Please recheck entry.")

        else:
            form_pref_text_ed_init = {

            }
            form_text_editor_pref = TextEditorPreferencesForm(instance=logged_user_info)
            context = {
                'logged_user_info' : logged_user_info,
                'form_text_editor_pref' : form_text_editor_pref,
            }
            return render(request, template, context)

    else:
        return HttpResponse("You are not logged in.")

def action_remove_file_from_directory(request, folder, filename):
    file_path = "media/" + str(request.user) + "/" + folder + "/" + filename
    os.remove(file_path)
    return redirect('view_user_files', str(request.user))


def action_delete_folder(request, folder):
    folder_path = "media/" + str(request.user) + "/" + folder
    shutil.rmtree(folder_path)
    file_uploads = FileUpload.objects.filter(username=request.user, folder=folder)
    for file in file_uploads:
        file.delete()
    return redirect('view_user_files', str(request.user))


def user_directory(request, username):
    dir_tree = ""
    if User.objects.filter(username=str(request.user)).count() > 0:
        logged_user = User.objects.get(username=str(request.user))
        directory_owner = User.objects.get(username=username)
        directory_owner_info = UserInformation.objects.get(username=directory_owner)
        files_list = FileUpload.objects.filter(Q(username=directory_owner_info) | Q(visibility__contains="Public") | Q(visibility__contains=str(request.user)))
        folders = []
        for file_item in files_list:
            print(file_item)
            folders.append([file_item.folder])
        dir_tree = no_duplicate_list(list_to_be_reduced=folders)

        for folder in dir_tree:
            files_in_folder = FileUpload.objects.filter(username=directory_owner_info, folder=folder[0])
            for file_in_folder in files_in_folder:
                print(folder)
                folder.append([file_in_folder])

    return dir_tree


@register.filter
def addstr(arg1, arg2):
    """concatenate arg1 & arg2"""
    return str(arg1) + str(arg2)


def ajax_get_data(request):
    table_name = request.GET.get('table_name', None)
    field_name = request.GET.get('field_name', None)
    key_id = int(request.GET.get('key_id', None))
    user = User.objects.get(pk=key_id)
    picture = ""
    if table_name == "UserInformation":
        user_info = UserInformation.objects.get(username=user.id)
        if field_name == "picture":
            picture = user_info.picture
    response_data = {
        'picture': picture
    }

    return JsonResponse(response_data)


def media_directory(username, folder):
    if not settings.OFFLINE:
        return "media/" + username + "/" + folder
    else:
        return "funcbook/media/" + username + "/" + folder



def media_dir_less(request, username, folder):
    return "http://" + request.META['HTTP_HOST'] + "/media/" + username + "/" + folder


def media_file(username, folder ,filename):
    if not settings.OFFLINE:
        return "media/" + username + "/" + folder + "/" + filename.replace(" ", "_").replace("(", "").replace(")", "")
    else:
        return "funcbook/media/" + username + "/" + folder + "/" + filename.replace(" ", "_").replace("[", "").replace("]", "")


def validate_username(request):
    username = request.GET.get('username', None)
    data = {
        'is_taken': User.objects.filter(username__iexact=username).exists()
    }
    return JsonResponse(data)


def delete_file(request, file_id):
    if FileUpload.objects.filter(id=file_id).count() > 0:
        file = FileUpload.objects.get(id=file_id)
        file.delete()
        os.remove(file.file_path)
        return redirect('view_user_files', str(request.user))
    else:
        return HttpResponse('The file does not exist.')


def index_context(request):
    post_archive = ""
    logged_user_info = ""
    upload_form = ""
    new_file_form = ""
    blog_form = ""
    following_list = ""
    followers_list = ""
    dir_tree = ""
    new_post_form = ""
    visible_users = ""
    ipadd = get_client_ip(request)

    if request.user.is_authenticated:
        visible_users = UserInformation.objects.all()[:10]
        post_archive = archive(request=request, username=str(request.user))
        logged_user_info = UserInformation.objects.get(username=request.user)
        lll = UserInformation.objects.get(username = request.user)
        lll.absolute_url = lll.get_absolute_url()
        lll.save()
        upload_form = FileUploadForm(initial={'folder' : logged_user_info.last_folder_typed })
    else:
        post_archive = archive(request=request, username="first_user")
    userr = UserInformation.objects.all()

    context = {
        'websiteName' : settings.WEBSITE_NAME,
        'ipadd' : ipadd,
        'h' : "http://",
        'upload_form' : upload_form,
        'logged_user_info' : logged_user_info,
        'visible_users' : visible_users,
        'year_today' : datetime.datetime.now().year,
        'month_today' : datetime.datetime.now().month -1,
        'app_archive' : post_archive,
        'userr' : userr
    }

    return context


def index(request):
    template= 'appsworld/index.html'
    activities = Activity.objects.all().order_by('-date', '-time')
    all_users = UserInformation.objects.all()
    activities_json = json.dumps(ActivitySerializer(activities, many=True).data)

    context = {
        'websiteName' : settings.WEBSITE_NAME,
        'activities' : activities,
        'all_users' : all_users,
        'activities_json' : activities_json
    }

    if request.user.is_authenticated:
        logged_user_info = UserInformation.objects.get(user_account = request.user)
        context_authenticated = {}
        if request.method == "GET":
            upload_form = FileUploadForm(initial={'folder' : logged_user_info.last_folder_typed })
            context_authenticated = {
                'upload_form' : upload_form,
                'logged_user_info' : logged_user_info,
            }
        if request.method == "POST":
            upload_form = FileUploadForm(request.POST, request.FILES)

            if upload_form.is_valid():
                file_upload = upload_form.save(commit=False)
                addUpload(request=request, media=file_upload)
                addActivity(activity_type = 'upload', media_id=file_upload.id)

                return redirect('index')

            else:
                return HttpResponse("Form invalid. Please recheck entry.")

        context = dict(context, **context_authenticated)
        return render(request, template, context)

    else:
        return render(request, template, context)


def index_pages(request, page, posts_per_page):
    page = int(page)
    posts_per_page = int(posts_per_page)
    template= 'appsworld/index.html'
    context_index = index_context(request=request)
    context_index_pages = index_pages_context(request=request, page=page, posts_per_page=posts_per_page)
    context = dict(context_index, **context_index_pages)

    return render(request, template, context)


def user_profile(request, profile_username):
    template= 'appsworld/user_profile.html'
    logged_user_info = ""
    if request.user.is_authenticated:
        logged_user_info = UserInformation.objects.get(user_account=request.user)
    profile = User.objects.get(username = profile_username)
    profile_info = UserInformation.objects.get(user_account = profile)
    media = FileUpload.objects.filter(user_info = profile_info).order_by('-date_uploaded')
    side_photos = FileUpload.objects.filter(user_info = profile_info).filter(file_type='image')[:8]
    side_html = FileUpload.objects.filter(user_info = profile_info).filter(file_type='text')[:8]
    context = {
        'websiteName' : settings.WEBSITE_NAME,
        'logged_user_info' : logged_user_info,
        'profile_info' : profile_info,
        'media' : media,
        'side_photos' : side_photos,
        'side_html' : side_html,
        'previous_page' : 0,
        'next_page' : 1
    }

    return render(request, template, context)


def search_result(request):
    text_to_find = request.GET['term']
    if len(text_to_find) > 3:
        search_result = FileUpload.objects.filter(Q(description__icontains=text_to_find) | Q(keywords__icontains=text_to_find))
        search_result_info = apps_info(search_result)
        recent_keywords = collect_keywords(search_result_info)
        visible_users = UserInformation.objects.all()
        following_list = ""
        followers_list = ""

        if request.user.is_authenticated:
            following_list = user_following_list(username=request.user)
            followers_list = user_followers_list(username=request.user)

        context = {
            'text_to_find' : text_to_find,
            'keywords' : recent_keywords,
            'page_posts' : search_result_info,
            'previous_page' : -1,
            'next_page' : 1,
            'year_today' : datetime.datetime.now().year,
            'month_today' : datetime.datetime.now().month -1,
            'following_list' : following_list,
            'followers_list' : followers_list,
            'visible_user' : visible_users,
        }
        template= 'appsworld/search_result.html'

        return render(request, template, context)

    else:
        return redirect('index')


class ViewPost(View):

    def get(self, request, post_object_id):
        if FileUpload.objects.filter(id=post_object_id).count() > 0:
            logged_user_info = ""
            if request.user.is_authenticated:
                logged_user_info = UserInformation.objects.get(user_account = request.user)
            file = FileUpload.objects.get(id = post_object_id)
            text_file = ""
            text_string = ""
            if file.file_type == "html" or file.file_type == "javascript" or file.file_type == "css" or file.file_type == "text":
                #text_file = open(file.file.url, "r")
                text_file = open(file.file_path, 'r')
                text_string = text_file.read()
                #text_file.close()
            comments = MediaComment.objects.filter(media=file)
            comments_json = json.dumps(MediaCommentSerializer(comments, many=True).data)

            context = {
                'file' : file,
                'logged_user_info' : logged_user_info,
                'text_string' : text_string,
                'websiteName' : settings.WEBSITE_NAME,
                'comments_json' : comments_json,
                'media_id' : file.id,
            }
            template = 'appsworld/page_post_permalink.html'
            return render(request, template, context)


def ajax_get_pictures(request):
    if FileUpload.objects.all().count() > 0:
        files = FileUpload.objects.filter(file_type = "picture")

        response_data = {
            'picturesFromServer' :  serializers.serialize("json", files, cls=serializers.json.DjangoJSONEncoder),
        }
    else:
        return HttpResponse("HTML file not found.")

    return JsonResponse(response_data, safe=True)


def ajax_get_videos(request):
    if FileUpload.objects.all().count() > 0:
        files = FileUpload.objects.filter(file_type = "video")

        response_data = {
            'videosFromServer' :  serializers.serialize("json", files, cls=serializers.json.DjangoJSONEncoder),
        }
    else:
        return HttpResponse("HTML file not found.")

    return JsonResponse(response_data, safe=True)


import operator
def collect_keywords(apps_list):
    keywords_list = []
    for apps in apps_list:
        for keyword in apps[2]:
            keywords_list.append([keyword[0], keyword[1]])

    sorted_keywords_list = sorted(keywords_list, key=operator.itemgetter(0))
    reduced_list = []
    prev = ""
    for sorted_item in sorted_keywords_list:
        if sorted_item!=prev and sorted_item!=" ":
            reduced_list.append(sorted_item)
        prev = sorted_item

    return reduced_list


import operator
def no_duplicate_list(list_to_be_reduced):
    sorted_list = sorted(list_to_be_reduced)
    reduced_list = []
    prev = ""
    for sorted_item in sorted_list:
        if sorted_item != prev:
            reduced_list.append(sorted_item)
        prev = sorted_item

    return reduced_list


import operator
def archive(request, username):

    archive_array = []

    for x in range(12):
        #month_apps = query_user_apps_by_month(request=request, username=username, month_str= calendar.month_name[x+1])
        #archive_array.append([month_apps])
        pass

    return archive_array


def update_post(request, object_to_update, filled_form):
    time_now = timezone.now()
    object_to_update.username = request.user
    object_to_update.app_name = filled_form.app_name
    object_to_update.description = filled_form.description
    object_to_update.datetime_uploaded = time_now
    object_to_update.date_uploaded = time_now
    object_to_update.time_uploaded = time_now
    object_to_update.datetime_updated = timezone.now()
    object_to_update.date_updated = timezone.now()
    object_to_update.month_updated = datetime.datetime.strftime(timezone.now(),'%B')
    object_to_update.time_updated = timezone.now()
    object_to_update.keywords = filled_form.keywords
    object_to_update.thumbnail = filled_form.thumbnail
    object_to_update.likes = 0
    object_to_update.shares = 0
    object_to_update.views = 0
    object_to_update.create_html_file = filled_form.create_html_file
    object_to_update.shared_app = 0
    if filled_form.file == None:
        object_to_update.file = 0
    else:
        object_to_update.file = filled_form.file
        if FileUpload.objects.filter(id=object_to_update.file).count() > 0:
            file_upload = FileUpload.objects.get(id=object_to_update.file)
            object_to_update.html_code = file_upload.file.read()
        else:
            object_to_update.html_code = "HTML File Deleted."
    object_to_update.save()


def view_app_full(request, app_id):
    if FileUpload.objects.filter(id=app_id).count()>0:
        file = FileUpload.objects.get(id=app_id)
        text_string = file.file.read()
        template = 'appsworld/view_app_full.html'
        context = {
            'html_code' : text_string,
        }

        return render(request, template, context)

    else:
        return HttpResponse("html file not found")


class SignupView(View):
    form_class = SignUpForm
    template_signup = 'appsworld/login_signup.html'
    template_success = 'appsworld/index.html'
    def get(self, request):
        form = self.form_class(None)
        context = {
            'websiteName' : settings.WEBSITE_NAME,
            'login_signup' : 'signup',
            'form': form,
            'year_today' : datetime.datetime.now().year,
            'month_today' : datetime.datetime.now().month -1,
        }

        return render(request, self.template_signup, context)

    def post(self, request):
        form = self.form_class(request.POST)
        context = {
            'websiteName' : settings.WEBSITE_NAME,
            'login_signup' : 'signup',
            'form': form,
            'page_number': 0,
            'next_page': 1,
            'year_today' : datetime.datetime.now().year,
            'month_today' : datetime.datetime.now().month -1,
        }

        if form.is_valid() and form.cleaned_data['password'] == form.cleaned_data['repeat_password']:
            user = form.save(commit=False)
            if User.objects.filter(username=user.username).count() == 0:
                password = form.cleaned_data['password']
                user.set_password(password)
                user.save()
                auth.login(request, user)
                new_user = User.objects.get(username=user.username)
                new_user_information = UserInformation()
                new_user_information.username = new_user
                new_user_information.user_name = user.username
                new_user_information.first_name = new_user.first_name
                new_user_information.last_name = new_user.last_name
                new_user_information.email = new_user.email
                new_user_information.date_signed_up = timezone.now()
                new_user_information.panel_transparency = 1
                new_user_information.save()
                return render(request, self.template_success, context)
            else:
            #return render(request, self.template_signup, context)
                return HttpResponse("Username taken.")

        else:
            #return render(request, self.template_signup, context)
            return HttpResponse("Password not match or form entry is invalid.")


class LoginView(View):
    form_class = LoginForm
    template_login = 'appsworld/login_signup.html'
    template_success = 'appsworld/index.html'

    def get(self, request):
        form = self.form_class(None)
        context = {
            'websiteName' : settings.WEBSITE_NAME,
            'login_signup' : 'login',
            'form': form,
            'year_today' : datetime.datetime.now().year,
            'month_today' :datetime.datetime.now().month -1,
        }
        return render(request, self.template_login, context)

    def post(self, request):
        form = self.form_class(request.POST)

        context = {
            'websiteName' : settings.WEBSITE_NAME,
            'login_signup' : 'login',
            'form': form,
            'year_today' : datetime.datetime.now().year,
            'month_today' : datetime.datetime.now().month -1,
        }

        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = auth.authenticate(username=username, password=password)

            if user is not None:
                auth.login(request, user)
                return redirect("/")
            else:
                return render(request, self.template_login, context)

        else:
            return render(request, self.template_login, context)


def logout_view(request):
    auth.logout(request)
    return redirect("/")


def delete_app(request, app_id):
    app = FileUpload.objects.filter(id=app_id)
    if app[0].username.username == request.user:
        app[0].delete()
        template = 'appsworld/index.html'
        context = {
            "next_page" : 1,
            "previous_page" : -1,
        }

        return redirect('index')
    else:
        return HttpResponse("You do not have permission to delete. App is not yours!")


def update_profile(request, username):
    the_user = User.objects.get(username=username)
    profile = UserInformation.objects.get(username = the_user.id)
    if profile.username == request.user:
        if request.method == "POST":
            form = ProfileForm(request.POST, request.FILES)
            if form.is_valid():
                profile_form = form.save(commit=False)
                profile.picture = profile_form.picture
                profile.location = profile_form.location
                profile.about_me = profile_form.about_me
                profile.cover_photo1 = profile_form.cover_photo1
                profile.cover_photo2 = profile_form.cover_photo2
                profile.cover_photo3 = profile_form.cover_photo3
                profile.save()

                return redirect('user_profile', request.user)

        form = ProfileForm(request.POST or None, instance=profile)
        template_apps = query_template_apps()
        template = 'appsworld/update_profile_info.html'
        context = {
            'form': form,
            'template_apps': template_apps,
            'year_today' : datetime.datetime.now().year,
            'month_today' : datetime.datetime.now().month -1,
        }

        return render(request, template, context)
    else:
        return HttpResponse("Profile is not yours!")


def follow_user(request):
    username = request.GET.get('username', None)
    follow_username = request.GET.get('follow_username', None)
    follower = User.objects.get(username=username)
    new_friend = Friend()
    new_friend.username = username
    new_friend.friend = follow_username
    new_friend.status = "initial_cl"
    new_friend.save()
    data = {
        'buttonValue': "Unfollow"
    }
    return JsonResponse(data)


def unfollow_user(request):
    username = request.GET.get('username', None)
    follow_username = request.GET.get('follow_username', None)
    follower = User.objects.get(username=username)
    followed_friend = Friend.objects.get(username=username, friend=follow_username)
    followed_friend.delete()
    data = {
        'buttonValue': "Follow"
    }
    return JsonResponse(data)


def tag_result(request, tag):
    tag = tag.replace("_", " ")
    #apps_with_tag = AppKeyword.objects.filter(keywords__contains=tag)
    apps_with_tag = FileUpload.objects.filter(appkeyword__keyword__contains=tag)
    #apps_with_info = apps_info(apps_with_tag)
    #recent_keywords = collect_keywords(apps_with_info)

    template = 'appsworld/tag_result.html'
    context = {
        #'keywords' : recent_keywords,
        'page_posts': apps_with_tag,
        #'page_number' : 0,
        #'next_page' : 1,
        #'apps_with_tag' : apps_with_tag,
        #'year_today' : datetime.datetime.now().year,
        #'month_today' : datetime.datetime.now().month -1,
    }

    context_index = index_context(request)

    return render(request, template, context)


def edit_file(request, file_id):
    if request.user.is_authenticated:
        if FileUpload.objects.filter(id= file_id).count() > 0:
            file = FileUpload.objects.get(id= file_id)
            if file.associated_html == "":
                file.associated_html = 0
                file.save()
            logged_user_info = UserInformation.objects.get(username=request.user)
            if request.user == file.username:
                if request.method == "POST":
                    file_form = FileUpdateForm(request.POST, request.FILES)
                    if file_form.is_valid():
                        filled_form = file_form.save(commit=False)
                        file.associated_html = filled_form.associated_html
                        file.save()

                        return redirect('edit_file_run', file_id)

                    new_file_form = NewFileForm(request.POST, request.FILES)
                    if new_file_form.is_valid():
                        new_file = new_file_form.save(commit=False)
                        if FileUpload.objects.filter(file_path=media_file(username=str(request.user), folder=new_file.folder, filename=new_file.filename)).count() < 1:
                            file_dir = media_directory(username=str(request.user), folder=new_file.folder)
                            write_file(directory=file_dir, filename=new_file.filename, text="")
                            new_file.username = request.user
                            new_file.filename = new_file.filename
                            new_file.file_type = new_file.filename.split(".")[-1]
                            new_file.file_url = media_dir_less(request=request, username=str(request.user), folder=new_file.folder) + "/" + new_file.filename
                            new_file.file_path = media_file(username=str(request.user), folder=new_file.folder, filename=new_file.filename)
                            new_file.date_uploaded = timezone.now()
                            new_file.date_updated = timezone.now()
                            new_file.hits = 0
                            new_file.file.name = str(request.user) + "/" + new_file.folder + "/" + new_file.filename
                            new_file.associated_html = 0
                            new_file.save()
                            logged_user_info.last_folder_typed = new_file.folder
                            logged_user_info.save()

                            return redirect('edit_file', new_file.id)

                        return HttpResponse("Please change filename.")

                    upload_form = FileUploadForm(request.POST, request.FILES)
                    if upload_form.is_valid():
                        file_upload = upload_form.save(commit=False)
                        update_file_upload(request=request, object_to_update=file_upload, filled_form=file_upload)

                        return redirect('edit_file', file_id)

                    else:
                        return HttpResponse("Form invalid. Please recheck entry.")



                else:
                    textarea_text = ""
                    file_form = FileUpdateForm(request.POST or None, instance=file)
                    new_file_form = NewFileForm(initial={'folder': logged_user_info.last_folder_typed})
                    upload_form = FileUploadForm(initial={'folder' : logged_user_info.last_folder_typed })
                    related_files = FileUpload.objects.filter(folder=file.folder, username=file.username)
                    html_code = []
                    html_code_json = ""
                    if FileUpload.objects.filter(id = file.associated_html).count() == 1:
                        assoc_file = FileUpload.objects.get(id = file.associated_html)
                        if os.path.isfile(assoc_file.file_path):
                            html_file = open(assoc_file.file_path, "r")
                            html_code = html_file.read()
                            html_code_json = json.dumps(html_code)
                            html_file.close()

                    for related_file in related_files:
                        related_file.file_url = "http://" + request.META['HTTP_HOST'] + related_file.file.url
                        related_file.save()

                    if os.path.isfile(file.file_path):
                        text_file = open(file.file_path, "r")
                        textarea_text = text_file.read()
                        text_file.close()
                    else:
                        return HttpResponse("[File not found.]")

                    template = 'appsworld/edit_file.html'
                    local_context = {
                        'html_code' : html_code_json,
                        'new_file_form' : new_file_form,
                        'upload_form' : upload_form,
                        'logged_user_info' : logged_user_info,
                        'related_files' : related_files,
                        'file' : file,
                        'form' : file_form,
                        'text_file_path' : file.file_path,
                        'textarea_text' :  textarea_text,
                        'file_absolute_path' : file.file_path,
                        'year_today' : datetime.datetime.now().year,
                        'month_today' : datetime.datetime.now().month -1,
                    }

                    context = dict(local_context)

                    return render(request, template, context)
            else:
                return HttpResponse("You are not authorized to edit the file.")
        else:
            return HttpResponse("[File not found.]")
    else:
        return HttpResponse("You are not logged-in.")


def edit_file_run(request, file_id):
    if FileUpload.objects.filter(id= file_id).count() > 0:
        file = FileUpload.objects.get(id= file_id)
        if file.associated_html == "":
            file.associated_html = 0
            file.save()
        logged_user_info = UserInformation.objects.get(username=request.user)
        if request.user == file.username:
            if request.method == "POST":
                file_form = FileUpdateForm(request.POST, request.FILES)
                if file_form.is_valid():
                    filled_form = file_form.save(commit=False)
                    file.associated_html = filled_form.associated_html
                    file.save()

                    return redirect('edit_file_run', file_id)

                new_file_form = NewFileForm(request.POST, request.FILES)
                if new_file_form.is_valid():
                    new_file = new_file_form.save(commit=False)
                    if FileUpload.objects.filter(file_path=media_file(username=str(request.user), folder=new_file.folder, filename=new_file.filename)).count() < 1:
                        file_dir = media_directory(username=str(request.user), folder=new_file.folder)
                        write_file(directory=file_dir, filename=new_file.filename, text="")
                        new_file.username = request.user
                        new_file.filename = new_file.filename
                        new_file.file_type = new_file.filename.split(".")[-1]
                        new_file.file_url = media_dir_less(request=request, username=str(request.user), folder=new_file.folder) + "/" + new_file.filename
                        new_file.file_path = media_file(username=str(request.user), folder=new_file.folder, filename=new_file.filename)
                        new_file.date_uploaded = timezone.now()
                        new_file.date_updated = timezone.now()
                        new_file.hits = 0
                        new_file.file.name = str(request.user) + "/" + new_file.folder + "/" + new_file.filename
                        new_file.associated_html = 0
                        new_file.save()
                        logged_user_info.last_folder_typed = new_file.folder
                        logged_user_info.save()

                        return redirect('edit_file', new_file.id)

                    return HttpResponse("Please change filename.")
                else:
                    return HttpResponse("Form invalid. Please recheck entry.")

            else:
                textarea_text = ""
                file_form = FileUpdateForm(request.POST or None, instance=file)
                new_file_form = NewFileForm(initial={'folder': logged_user_info.last_folder_typed})
                related_files = FileUpload.objects.filter(folder=file.folder, username=file.username)
                html_code = []
                html_code_json = ""
                if FileUpload.objects.filter(id = file.associated_html).count() == 1:
                    assoc_file = FileUpload.objects.get(id = file.associated_html)
                    if os.path.isfile(assoc_file.file_path):
                        html_file = open(assoc_file.file_path, "r")
                        html_code = html_file.read()
                        html_code_json = json.dumps(html_code)
                        html_file.close()

                for related_file in related_files:
                    related_file.file_url = "http://" + request.META['HTTP_HOST'] + related_file.file.url
                    related_file.save()

                if os.path.isfile(file.file_path):
                    text_file = open(file.file_path, "r")
                    textarea_text = text_file.read()
                    text_file.close()
                else:
                    return HttpResponse("[File not found.]")

                template = 'appsworld/edit_file_run.html'
                local_context = {
                    'html_code' : html_code,
                    'new_file_form' : new_file_form,
                    'logged_user_info' : logged_user_info,
                    'related_files' : related_files,
                    'file' : file,
                    'form' : file_form,
                    'text_file_path' : file.file_path,
                    'textarea_text' :  textarea_text,
                    'file_absolute_path' : file.file_path,
                    'year_today' : datetime.datetime.now().year,
                    'month_today' : datetime.datetime.now().month -1,
                }

                context = dict(local_context)

                return render(request, template, context)
        else:
            return HttpResponse("You are not authorized to edit the file.")
    else:
        return HttpResponse("[File not found.]")


def file_save_changes(request):
    filename = request.POST.get('filename', None)
    file_id = request.POST.get('file_id', None)
    file_path = request.POST.get('file_path', None)
    string_data = request.POST.get('string_data', None)
    if os.path.isfile(file_path):
        file = open(file_path, "w")
        file.write(string_data)
        file.close()
    else:
        if filename != "":
            os.makedirs("testing/testing.html", exist_ok=True)
            file = open("testing/testing.html", "w")
            file.write(string_data)
            file.close()

    data = {
        'is_saved' : "yes"
    }

    return JsonResponse(data)


def ajax_post_comment(request):
    comment = request.POST.get('comment', None)
    user = User.objects.get(username=request.user)
    user_info = UserInformation.objects.get(user_account=user)
    media_id = request.POST.get('media', None)
    media = FileUpload.objects.get(id=media_id)

    new_comment = MediaComment()
    new_comment.comment = comment
    new_comment.user_info = user_info
    new_comment.media = media
    new_comment.response_to = 1
    new_comment.datetime_commented = timezone.now()
    new_comment.save()

    comments = MediaComment.objects.filter(media = media)
    comments_json = serializers.serialize("json", comments, cls=serializers.json.DjangoJSONEncoder)

    data = {
        'comments_json' : comments_json
    }

    return JsonResponse(data, safe=True)


def write_file(directory, filename, text):
    if os.path.exists(directory + "/" + filename):
        os.remove(directory + "/" + filename)
    os.makedirs(directory, exist_ok=True)
    text_file = open(directory + "/" + filename, "w")
    text_file.write(text)
    text_file.close()


def new_text_file(request):
    user_info = UserInformation.objects.get(username=request.user)
    form = NewFileForm(initial={'folder': user_info.last_folder_typed})
    files_list = FileUpload.objects.filter(username=request.user).order_by('-date_updated')[0:10]

    template = 'appsworld/new_text_file.html'
    local_context = {
        'form': form,
        'files_list' : files_list,
        'year_today' : datetime.datetime.now().year,
        'month_today' : datetime.datetime.now().month -1,
    }

    context = dict(local_context)

    if request.method == "POST":
        if request.user.is_authenticated:
            form = NewFileForm(request.POST)
            if form.is_valid():
                file_upload = form.save(commit=False)
                file_dir = media_directory(username=str(request.user), folder=file_upload.folder)
                write_file(directory=file_dir, filename=file_upload.filename, text="")
                update_file_upload(request=request, object_to_update=file_upload, filled_form=file_upload)
                user_info.last_folder_typed = file_upload.folder
                user_info.save()

                return redirect('edit_file', file_upload.id)
            else:
                return HttpResponse("Form invalid.")

        else:
            return HttpResponse("You are not logged in.")

    return render(request, template, context)


def view_user_files(request, username):
    if request.user.is_authenticated:
        user_info = UserInformation.objects.get(username=request.user)
        profile_owner = User.objects.get(username=username)
        profile_owner_info = UserInformation.objects.get(username=profile_owner)
        upload_form = FileUploadForm(initial={'folder': user_info.last_folder_typed})
        files_list = ""
        html_apps = ""
        if str(request.user) == username:
            files_list = FileUpload.objects.filter(username=profile_owner_info).order_by('-date_updated')
            html_apps = HtmlApp.objects.filter(username=profile_owner_info)
        else:
            files_list = FileUpload.objects.filter(username=profile_owner_info, visibility='PU').order_by('-date_updated')[0:100]
            html_apps = HtmlApp.objects.filter(username=profile_owner_info, visibility='PU')

        html_apps_json = serializers.serialize("json", html_apps, cls=serializers.json.DjangoJSONEncoder)
        files_json = serializers.serialize("json", files_list, cls=serializers.json.DjangoJSONEncoder)
        folders = []
        for file_item in files_list:
            folders.append([file_item.folder])
        dir_tree = no_duplicate_list(list_to_be_reduced=folders)
        i=0
        for folder in dir_tree:
            print(folder)
            directory_owner = User.objects.get(username=username)
            files_in_folder = FileUpload.objects.filter(username=profile_owner_info, folder=folder[0])
            for file_in_folder in files_in_folder:
                folder.append([file_in_folder])
                print(file_in_folder.filename)
            i = i+1

        template = 'appsworld/user_files.html'
        local_context = {
            'websiteName' : settings.WEBSITE_NAME,
            'logged_user_info' : user_info,
            'profile_info' : profile_owner_info,
            'h' : "http://",
            'upload_form': upload_form,
            'dir_tree' : dir_tree,
            'files_list' : files_list,
            'files_json' : files_json,
            'html_apps_json' : html_apps_json,
            'year_today' : datetime.datetime.now().year,
            'month_today' : datetime.datetime.now().month -1,
        }

        context = dict(local_context)

        if request.method == "POST":
            if request.user.is_authenticated:
                form = FileUploadForm(request.POST, request.FILES)
                if form.is_valid():
                    file_upload = form.save(commit=False)
                    if file_upload.file:
                        addUpload(request=request, media=file_upload)
                    return redirect('view_user_files', username)
                else:
                    return HttpResponse("Form invalid.")

            else:
                return HttpResponse("You are not logged in.")
        return render(request, template, context)
    else:
        return HttpResponse("You are not logged in.")

def view_calendar_year(request, profile_username, year):
    template = 'appsworld/calendar.html'
    app = Activity.objects.all();
    holidays = Holidays.objects.all();
    context = {
        'websiteName' : settings.WEBSITE_NAME,
        'calendar' : "year",
        'app': app,
        'year' : int(year),
        'year_today' : datetime.datetime.now().year,
        'month_today' : datetime.datetime.now().month,
        'holidays_JSON' : serializers.serialize("json", holidays, cls=serializers.json.DjangoJSONEncoder)
    }
    if request.user.is_authenticated:
        logged_user_info = UserInformation.objects.get(username=request.user)
        context_user = {
            'logged_user_info' : logged_user_info,
        }
        context = dict(context, **context_user)

    return render(request, template, context)



def view_calendar_month(request, profile_username, year, month):
    if request.user.is_authenticated:
        logged_user_info = query_the_user_info(request.user)
        app = Activity.objects.all();
        events = Event.objects.all().order_by('-start_date')
        list_of_events = []
        for event in events:
            list_of_events.append(event)

        if request.method == "POST":
            event_form = EventForm(request.POST)
            if event_form.is_valid():
                event_in_form = event_form.save(commit=False)
                if event_in_form.event_id == "":
                    event_in_form.username = request.user
                    event_in_form.start_date = datetime.datetime.combine(datetime.date(event_in_form.start_date.year, event_in_form.start_date.month, event_in_form.start_date.day), datetime.time(event_in_form.start_hour, event_in_form.start_minute))
                    event_in_form.start_hour = event_in_form.start_hour
                    event_in_form.start_minute = event_in_form.start_minute
                    event_in_form.end_date = datetime.datetime.combine(datetime.date(event_in_form.end_date.year, event_in_form.end_date.month, event_in_form.end_date.day), datetime.time(event_in_form.end_hour, event_in_form.end_minute))
                    event_in_form.end_hour = event_in_form.end_hour
                    event_in_form.end_minute = event_in_form.end_minute
                    event_in_form.save()
                    return redirect('calendar_month', username, year, month)
                else:
                    existing_event = Event.objects.get(id=int(event_in_form.event_id))
                    existing_event.speaker = event_in_form.speaker
                    existing_event.attendees = event_in_form.attendees
                    existing_event.start_date = datetime.datetime.combine(datetime.date(existing_event.start_date.year, existing_event.start_date.month, existing_event.start_date.day), datetime.time(existing_event.start_hour, existing_event.start_minute))
                    existing_event.start_hour = existing_event.start_hour
                    existing_event.start_minute = existing_event.start_minute
                    existing_event.end_date = datetime.datetime.combine(datetime.date(existing_event.end_date.year, existing_event.end_date.month, existing_event.end_date.day), datetime.time(existing_event.end_hour, existing_event.end_minute))
                    existing_event.end_hour = existing_event.end_hour
                    existing_event.end_minute = existing_event.end_minute
                    existing_event.save()
                    return redirect('calendar_month', username, year, month)

            else:
                return HttpResponse("Form invalid.")
        else:
            event_form = EventForm()
            context = {
                'websiteName' : settings.WEBSITE_NAME,
                'list_of_events' : serializers.serialize("json", events, cls=serializers.json.DjangoJSONEncoder),
                #'list_of_events' : json.dumps(list(events)),
                'eventForm' : event_form,
                'calendar' : "month",
                'app': app,
                'year' : int(year),
                'month' : int(month) - 1,
                'year_today' : datetime.datetime.now().year,
                'month_today' : datetime.datetime.now().month,
                'logged_user_info' : logged_user_info,
            }
            template = 'appsworld/calendar.html'
            return render(request, template, context)
    else:
        return HttpResponse("Sorry.")


def calendar_day(request, username, year, month, day):
    template = 'appsworld/calendar.html'
    app = Activity.objects.all();
    context = {
        'calendar' : "day",
        'app': app,
        'year' : int(year),
        'month' : int(month) +1,
        'day' : int(day),
        'year_today' : datetime.datetime.now().year,
        'month_today' : datetime.datetime.now().month -1,
    }
    return render(request, template, context)


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
