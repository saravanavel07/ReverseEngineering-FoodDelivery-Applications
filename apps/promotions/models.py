from django.db import models
from django.contrib.auth.models import User

class Coupon(models.Model):
    DISCOUNT_TYPES = (
        ('percentage', 'Percentage'),
        ('flat', 'Flat Amount'),
    )
    code = models.CharField(max_length=30, unique=True)
    description = models.CharField(max_length=200)
    discount_type = models.CharField(max_length=15, choices=DISCOUNT_TYPES, default='percentage')
    discount_value = models.DecimalField(max_digits=8, decimal_places=2)
    min_order_value = models.DecimalField(max_digits=8, decimal_places=2, default=199.00)
    max_discount = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} - {self.description}"

class CouponRedemption(models.Model):
    coupon = models.ForeignKey(Coupon, on_delete=models.CASCADE, related_name='redemptions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='coupon_redemptions')
    order_id = models.CharField(max_length=50)
    discount_amount = models.DecimalField(max_digits=8, decimal_places=2)
    redeemed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} redeemed {self.coupon.code} for order {self.order_id}"
