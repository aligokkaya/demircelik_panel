from django.db import models
from django.contrib.auth.models import User

class Announcement(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class Meal(models.Model):
    MEAL_TYPES = (
        ('breakfast', 'Kahvaltı'),
        ('lunch', 'Öğle Yemeği'),
        ('dinner', 'Akşam Yemeği'),
    )
    
    date = models.DateField()
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPES)
    menu = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.get_meal_type_display()} - {self.date}"

    class Meta:
        ordering = ['-date', 'meal_type']
        unique_together = ['date', 'meal_type']

class Post(models.Model):
    POST_CATEGORIES = (
        ('isg', 'İSG'),
        ('environment', 'Çevre'),
        ('quality', 'Kalite'),
        ('general', 'Genel'),
    )
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=20, choices=POST_CATEGORIES)
    image = models.ImageField(upload_to='posts/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} - {self.get_category_display()}"

    class Meta:
        ordering = ['-created_at']

class WeatherCache(models.Model):
    temperature = models.FloatField()
    condition = models.CharField(max_length=100)
    icon = models.CharField(max_length=100)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Hava Durumu - {self.last_updated}"

    class Meta:
        verbose_name = "Hava Durumu Önbelleği"
        verbose_name_plural = "Hava Durumu Önbelleği" 