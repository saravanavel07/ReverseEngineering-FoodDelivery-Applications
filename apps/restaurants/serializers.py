from rest_framework import serializers
from .models import Restaurant, Cuisine, RestaurantHours
from apps.menu.serializers import MenuCategorySerializer

class CuisineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuisine
        fields = ('id', 'name', 'slug', 'icon')

class RestaurantSerializer(serializers.ModelSerializer):
    cuisines = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name')

    class Meta:
        model = Restaurant
        fields = (
            'id', 'name', 'slug', 'rating', 'rating_count', 'delivery_time_mins',
            'distance_km', 'cost_for_two', 'cuisines', 'area', 'city',
            'image_url', 'is_veg_only', 'is_open', 'discount_badge'
        )

class RestaurantDetailSerializer(RestaurantSerializer):
    categories = MenuCategorySerializer(many=True, read_only=True)

    class Meta(RestaurantSerializer.Meta):
        fields = RestaurantSerializer.Meta.fields + ('categories',)
