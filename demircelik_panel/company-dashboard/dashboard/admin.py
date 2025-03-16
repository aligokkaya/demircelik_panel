from django.contrib import admin
from .models import Announcement, Meal, Post, WeatherCache

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'created_by', 'is_active')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title', 'content')
    date_hierarchy = 'created_at'

@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ('date', 'meal_type', 'created_by')
    list_filter = ('meal_type', 'date')
    search_fields = ('menu',)
    date_hierarchy = 'date'

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_at', 'created_by', 'is_active')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('title', 'content')
    date_hierarchy = 'created_at'

@admin.register(WeatherCache)
class WeatherCacheAdmin(admin.ModelAdmin):
    list_display = ('temperature', 'condition', 'last_updated')
    readonly_fields = ('last_updated',) 