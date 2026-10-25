from django.urls import path
from .views import health_check, home_view

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('', home_view, name='home'),
]
