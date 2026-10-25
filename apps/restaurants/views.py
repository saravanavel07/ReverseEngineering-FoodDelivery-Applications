from rest_framework import viewsets, permissions, filters
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Restaurant, Cuisine
from .serializers import RestaurantSerializer, RestaurantDetailSerializer, CuisineSerializer
from apps.menu.serializers import MenuCategorySerializer

class RestaurantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Restaurant.objects.filter(is_open=True).prefetch_related('cuisines', 'categories__items__option_groups__options')
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'area', 'cuisines__name']
    ordering_fields = ['rating', 'delivery_time_mins', 'cost_for_two']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return RestaurantDetailSerializer
        return RestaurantSerializer

    @action(detail=True, methods=['get'])
    def menu(self, request, pk=None):
        restaurant = self.get_object()
        categories = restaurant.categories.all()
        serializer = MenuCategorySerializer(categories, many=True)
        return Response({
            'restaurant_id': restaurant.id,
            'restaurant_name': restaurant.name,
            'categories': serializer.data
        })

class CuisineViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Cuisine.objects.all()
    serializer_class = CuisineSerializer
    permission_classes = [permissions.AllowAny]
