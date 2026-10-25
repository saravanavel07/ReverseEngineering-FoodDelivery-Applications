from rest_framework import serializers
from .models import Order, OrderItem, OrderStatusHistory

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('id', 'item_name_snapshot', 'unit_price_snapshot', 'quantity', 'total_price_snapshot', 'options_summary')

class OrderStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusHistory
        fields = ('status', 'note', 'created_at')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'order_number', 'restaurant', 'restaurant_name_snapshot',
            'subtotal', 'delivery_fee', 'packaging_fee', 'platform_fee',
            'taxes', 'discount', 'total_amount', 'coupon_code',
            'delivery_address_snapshot', 'payment_method', 'payment_status',
            'order_status', 'created_at', 'items', 'status_history'
        )
        read_only_fields = ('order_number', 'subtotal', 'taxes', 'total_amount', 'order_status')
