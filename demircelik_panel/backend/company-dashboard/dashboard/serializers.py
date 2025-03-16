from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Announcement, Meal, Post, WeatherCache

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class AnnouncementSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Announcement
        fields = '__all__'

class MealSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    meal_type_display = serializers.CharField(source='get_meal_type_display', read_only=True)

    class Meta:
        model = Meal
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Post
        fields = '__all__'

class WeatherSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherCache
        fields = '__all__' 