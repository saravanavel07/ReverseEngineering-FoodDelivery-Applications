from rest_framework import serializers
from django.contrib.auth.models import User
from .models import CustomerProfile, Address

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ('user',)

class CustomerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    addresses = AddressSerializer(many=True, read_only=True, source='user.addresses')

    class Meta:
        model = CustomerProfile
        fields = ('id', 'user', 'phone', 'addresses', 'created_at')
