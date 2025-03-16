from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
from django.http import JsonResponse
from .models import Announcement, Meal, Post, WeatherCache
from .serializers import AnnouncementSerializer, MealSerializer, PostSerializer, WeatherSerializer

# Create your views here.

def index(request):
    return JsonResponse({"message": "Welcome to Company Dashboard API"})

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False)
    def active(self, request):
        active_announcements = Announcement.objects.filter(is_active=True)
        serializer = self.get_serializer(active_announcements, many=True)
        return Response(serializer.data)

class MealViewSet(viewsets.ModelViewSet):
    queryset = Meal.objects.all()
    serializer_class = MealSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False)
    def today(self, request):
        today = timezone.now().date()
        today_meals = Meal.objects.filter(date=today)
        serializer = self.get_serializer(today_meals, many=True)
        return Response(serializer.data)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        queryset = Post.objects.all()
        category = self.request.query_params.get('category', None)
        if category is not None:
            queryset = queryset.filter(category=category)
        return queryset

    @action(detail=False)
    def active(self, request):
        active_posts = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(active_posts, many=True)
        return Response(serializer.data)

class WeatherViewSet(viewsets.ModelViewSet):
    queryset = WeatherCache.objects.all()
    serializer_class = WeatherSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False)
    def current(self, request):
        try:
            latest_weather = WeatherCache.objects.latest('last_updated')
            serializer = self.get_serializer(latest_weather)
            return Response(serializer.data)
        except WeatherCache.DoesNotExist:
            return Response({'error': 'No weather data available'}, status=404)
