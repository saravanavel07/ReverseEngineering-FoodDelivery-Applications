from django.http import JsonResponse
from django.shortcuts import render

def health_check(request):
    return JsonResponse({
        'status': 'healthy',
        'platform': 'OrangeBite Python/Django Platform',
        'version': '1.0.0',
        'service': 'core',
    })

def home_view(request):
    return render(request, 'base.html', {
        'app_name': 'OrangeBite',
        'tagline': 'Swift & Fresh Delivered',
    })
