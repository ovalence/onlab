"""django_appsworld URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from appsworld import views
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', views.index, name='index'),
    url(r'^(?P<page>[0-9]+)/(?P<posts_per_page>[0-9]+)$', views.index_pages, name='index_pages'),

    url(r'^login$', views.LoginView.as_view(), name='login'),
    url(r'^signup$', views.SignupView.as_view(), name='signup'),
    url(r'^logout$', views.logout_view, name='logout'),
    url(r'^preferences$', views.view_preferences, name='view_preferences'),
    url(r'^create_blog_entry$', views.view_create_blog_entry, name='view_create_blog_entry'),
    url(r'^edit_blog_entry/(?P<blog_entry_id>[0-9]+)/$', views.view_edit_blog_entry, name='view_edit_blog_entry'),
    url(r'^search_result/', views.search_result, name='search_result'),
    url(r'^new_text_file/', views.new_text_file, name='new_text_file'),
    url(r'^create_function$', views.Function.as_view(), name='view_create_function'),
    url(r'^api/functions$', views.FunctionList.as_view(), name='view_api'),
    url(r'^api/media$', views.MediaList.as_view(), name='view_api_media'),
    url(r'^api/media_comments/(?P<pk>[0-9]+)/$', views.MediaCommentList.as_view(), name='view_api_media_comments'),
    url(r'^OnLab/', views.OnLab.as_view(), name='view_onlab'),
    url(r'^api/apps$', views.HtmlAppList.as_view(), name='view_html_app_list'),
    url(r'^api/apps/(?P<pk>[0-9]+)/$', views.HtmlAppDetails.as_view(), name='view_html_app_details'),
    url(r'^api/functions/(?P<pk>[0-9]+)/$', views.FunctionDetails.as_view(), name='view_function_details'),
    url(r'^api/media/(?P<pk>[0-9]+)/$', views.MediaDetails.as_view(), name='view_media_details'),
    url(r'^api/media_comments/(?P<pk>[0-9]+)/$', views.MediaCommentDetails.as_view(), name='view_media_comment_details'),
    url(r'^api/media_comments/post_comment$', views.ajax_post_comment, name='ajax_post_comment'),
    url(r'^(?P<profile_username>[\w{}.-]+)/$', views.user_profile, name='user_profile'),
    url(r'^(?P<profile_username>[\w{}.-]+)/calendar_year/(?P<year>[0-9]+)$', views.view_calendar_year, name='view_calendar_year'),
    url(r'^(?P<profile_username>[\w{}.-]+)/calendar_month/(?P<year>[0-9]+)/(?P<month>[0-9]+)$', views.view_calendar_month, name='view_calendar_month'),
    url(r'^(?P<username>[\w{}.-]+)/user_files$', views.view_user_files, name='view_user_files'),
    url(r'^(?P<file_id>[0-9]+)/edit_file$', views.edit_file, name='edit_file'),
    url(r'^(?P<file_id>[0-9]+)/edit_file_run$', views.edit_file_run, name='edit_file_run'),
    url(r'^(?P<file_id>[0-9]+)/delete_file$', views.delete_file, name='delete_file'),

    url(r'^media/(?P<post_object_id>[0-9]+)/$', views.ViewPost.as_view(), name='view_media'),
    url(r'^(?P<app_id>[0-9]+)/delete_app$', views.delete_app, name='delete_app'),
    url(r'^(?P<app_id>[0-9]+)/view_app_full$', views.view_app_full, name='view_app_full'),
    url(r'^app/(?P<app_id>[0-9]+)/$', views.view_app, name='view_app'),

    url(r'^(?P<username>[\w{}.-]+)/profile/update$', views.update_profile, name='update_profile'),
    url(r'^tags/(?P<tag>[\w{}.-]+)$', views.tag_result, name='tag_result'),
    url(r'^ajax/validate_username$', views.validate_username, name='validate_username'),
    url(r'^appsworld/ajax_file_save_changes$', views.file_save_changes, name='file_save_changes'),
    url(r'^appsworld/ajax_get_pictures$', views.ajax_get_pictures, name='ajax_get_pictures'),
    url(r'^appsworld/ajax_get_videos$', views.ajax_get_videos, name='ajax_get_videos'),
    url(r'^delete_folder/(?P<folder>[\w+\s\w.-]+)$', views.action_delete_folder, name='action_delete_folder'),
]


urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += format_suffix_patterns(urlpatterns)


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
