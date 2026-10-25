from rest_framework import status, views, viewsets, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .models import Address, CustomerProfile
from .serializers import AddressSerializer, CustomerProfileSerializer, UserSerializer

class AuthMeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('phone') or request.data.get('username')
        password = request.data.get('password', 'orangebite_demo_pass')
        phone = request.data.get('phone', '9876543210')
        first_name = request.data.get('name', 'Foodie')

        if not username:
            return Response({'error': 'Phone number is required.'}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(username=username, defaults={'first_name': first_name})
        if created:
            user.set_password(password)
            user.save()
            CustomerProfile.objects.create(user=user, phone=phone)

        login(request, user)
        return Response({'status': 'registered', 'user_id': user.id, 'name': user.first_name})

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username') or request.data.get('phone')
        password = request.data.get('password', 'orangebite_demo_pass')
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return Response({'status': 'authenticated', 'user_id': user.id})
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(views.APIView):
    def post(self, request):
        logout(request)
        return Response({'status': 'logged_out'})

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
