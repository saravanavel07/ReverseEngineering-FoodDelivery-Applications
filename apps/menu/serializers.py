from rest_framework import serializers
from .models import MenuCategory, MenuItem, MenuItemOptionGroup, MenuItemOption

class MenuItemOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItemOption
        fields = ('id', 'name', 'price')

class MenuItemOptionGroupSerializer(serializers.ModelSerializer):
    options = MenuItemOptionSerializer(many=True, read_only=True)

    class Meta:
        model = MenuItemOptionGroup
        fields = ('id', 'title', 'required', 'min_select', 'max_select', 'options')

class MenuItemSerializer(serializers.ModelSerializer):
    option_groups = MenuItemOptionGroupSerializer(many=True, read_only=True)

    class Meta:
        model = MenuItem
        fields = (
            'id', 'restaurant', 'category', 'name', 'description', 'price',
            'is_veg', 'is_bestseller', 'rating', 'rating_count', 'image_url',
            'in_stock', 'customizable', 'option_groups'
        )

class MenuCategorySerializer(serializers.ModelSerializer):
    items = MenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = MenuCategory
        fields = ('id', 'name', 'order', 'items')
