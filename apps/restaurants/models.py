from django.db import models

class Cuisine(models.Model):
    name = models.CharField(max_length=60, unique=True)
    slug = models.SlugField(max_length=60, unique=True)
    icon = models.CharField(max_length=10, default='🍲')

    def __str__(self):
        return self.name

class Restaurant(models.Model):
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=160, unique=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.5)
    rating_count = models.IntegerField(default=1000)
    delivery_time_mins = models.IntegerField(default=30)
    distance_km = models.DecimalField(max_digits=4, decimal_places=1, default=2.5)
    cost_for_two = models.IntegerField(default=500)
    cuisines = models.ManyToManyField(Cuisine, related_name='restaurants')
    area = models.CharField(max_length=120)
    city = models.CharField(max_length=80, default='Bengaluru')
    image_url = models.URLField(max_length=500)
    is_veg_only = models.BooleanField(default=False)
    is_open = models.BooleanField(default=True)
    discount_badge = models.CharField(max_length=80, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.area})"

class RestaurantHours(models.Model):
    DAYS = (
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    )
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='hours')
    day_of_week = models.IntegerField(choices=DAYS)
    open_time = models.TimeField()
    close_time = models.TimeField()

    class Meta:
        unique_together = ('restaurant', 'day_of_week')
