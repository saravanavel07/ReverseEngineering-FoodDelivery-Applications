from django.db import models
from django.contrib.auth.models import User
from apps.restaurants.models import Restaurant

class Order(models.Model):
    STATUS_CHOICES = (
        ('PLACED', 'Order Placed'),
        ('ACCEPTED', 'Restaurant Accepted'),
        ('PREPARING', 'Preparing'),
        ('READY', 'Ready for Pickup'),
        ('OUT_FOR_DELIVERY', 'Out for Delivery'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    )
    PAYMENT_STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('REFUNDED', 'Refunded'),
    )
    PAYMENT_METHOD_CHOICES = (
        ('UPI', 'UPI'),
        ('Card', 'Credit/Debit Card'),
        ('Netbanking', 'Netbanking'),
        ('COD', 'Cash on Delivery'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_number = models.CharField(max_length=30, unique=True, db_index=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.PROTECT, related_name='orders')
    restaurant_name_snapshot = models.CharField(max_length=150)

    # Immutability snapshots for financial receipt accuracy
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2)
    packaging_fee = models.DecimalField(max_digits=10, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2)
    taxes = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    coupon_code = models.CharField(max_length=30, blank=True, null=True)
    delivery_address_snapshot = models.TextField()

    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='UPI')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='COMPLETED')
    order_status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='PLACED', db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.order_number} - {self.restaurant_name_snapshot} (₹{self.total_amount})"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    item_name_snapshot = models.CharField(max_length=150)
    unit_price_snapshot = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    total_price_snapshot = models.DecimalField(max_digits=10, decimal_places=2)
    options_summary = models.CharField(max_length=300, blank=True)

    def __str__(self):
        return f"{self.quantity}x {self.item_name_snapshot}"

class OrderStatusHistory(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=25, choices=Order.STATUS_CHOICES)
    note = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order.order_number} -> {self.status}"
