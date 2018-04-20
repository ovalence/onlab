from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
import json

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name')


class HtmlAppSerializer(serializers.ModelSerializer):

	class Meta:
		model = HtmlApp
		fields = ('id', 'username', 'name', 'files')


class UserInfoSerializer(serializers.ModelSerializer):
	user_account = UserSerializer(read_only=True)
	class Meta:
		model = UserInformation
		fields = ('user_account', 'first_name', 'last_name', 'picture')


class MediaCommentSerializer(serializers.ModelSerializer):
	user_info = UserInfoSerializer(read_only=True)
	class Meta:
		model = MediaComment
		fields = ('comment', 'user_info', 'datetime_commented')


class MediaSerializer(serializers.ModelSerializer):
	comments = MediaCommentSerializer(many = True, read_only=True)
	class Meta:
		model = FileUpload
		fields = ('id', 'title', 'file_path', 'filename', 'file_type', 'comments', 'visibility')


class FunctionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Functions
        fields = '__all__'


class ActivitySerializer(serializers.ModelSerializer):
	user_info = UserInfoSerializer(read_only=True)
	media = MediaSerializer(read_only=True)
	function = FunctionSerializer(read_only = True)
	class Meta:
		model = Activity
		fields = ('activity', 'media', 'function', 'user_info', 'datetime', 'date', 'time')



