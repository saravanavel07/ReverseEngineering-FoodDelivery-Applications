from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Order
from .serializers import OrderSerializer, OrderStatusHistorySerializer
from .services import OrderService
from apps.cart.models import Cart

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Strict tenant isolation
        if self.request.user.is_staff:
            return Order.objects.all().prefetch_related('items', 'status_history')
        return Order.objects.filter(user=self.request.user).prefetch_related('items', 'status_history')

    def create(self, request, *args, **kwargs):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        address_text = request.data.get('address', 'Koramangala 5th Block, Bengaluru')
        payment_method = request.data.get('payment_method', 'UPI')
        coupon_code = request.data.get('coupon_code', None)

        try:
            order = OrderService.create_order_atomic(
                user=request.user,
                cart=cart,
                address_text=address_text,
                payment_method=payment_method,
                coupon_code=coupon_code,
            )
            serializer = self.get_serializer(order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def tracking(self, request, pk=None):
        order = self.get_object()
        history = order.status_history.all()
        return Response({
            'order_number': order.order_number,
            'current_status': order.order_status,
            'status_history': OrderStatusHistorySerializer(history, many=True).data,
            'delivery_partner': {
                'name': 'Vikram Singh',
                'phone': '+91 98452 87654',
                'rating': 4.8,
                'vehicle': 'KA-05-MH-2034',
            },
        })

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        try:
            OrderService.transition_order_status(order, 'CANCELLED', 'Cancelled by customer.')
            return Response({'status': 'Order cancelled and refund credited.'})
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
