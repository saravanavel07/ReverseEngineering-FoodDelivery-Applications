from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.accounts.views import RegisterView, LoginView, LogoutView, AuthMeView, AddressViewSet
from apps.restaurants.views import RestaurantViewSet, CuisineViewSet
from apps.promotions.views import ValidateCouponView
from apps.orders.views import OrderViewSet

router = DefaultRouter()
router.register(r'restaurants', RestaurantViewSet, basename='restaurant')
router.register(r'categories', CuisineViewSet, basename='cuisine')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'addresses', AddressViewSet, basename='address')

urlpatterns = [
    # Authentication Endpoints
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/me/', AuthMeView.as_view(), name='auth-me'),

    # Promotion Endpoints
    path('coupons/validate/', ValidateCouponView.as_view(), name='coupon-validate'),

    # Router registered endpoints
    path('', include(router.urls)),
]
