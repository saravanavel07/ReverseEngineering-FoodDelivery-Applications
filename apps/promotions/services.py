from decimal import Decimal
from .models import Coupon

class CouponService:
    @staticmethod
    def validate_and_calculate_discount(coupon_code: str, subtotal: Decimal, user=None):
        try:
            coupon = Coupon.objects.get(code__iexact=coupon_code.strip(), is_active=True)
        except CouponDoesNotExist:
            return {'valid': False, 'error': f"Coupon '{coupon_code}' does not exist or is inactive."}

        if subtotal < coupon.min_order_value:
            needed = coupon.min_order_value - subtotal
            return {
                'valid': False,
                'error': f"Add items worth ₹{needed:.2f} more to apply {coupon.code}.",
                'min_order_value': str(coupon.min_order_value),
            }

        # Calculate discount
        if coupon.discount_type == 'percentage':
            calculated = (subtotal * coupon.discount_value) / Decimal('100.00')
            discount = min(calculated, coupon.max_discount) if coupon.max_discount else calculated
        else:
            discount = coupon.discount_value

        return {
            'valid': True,
            'coupon_code': coupon.code,
            'discount_type': coupon.discount_type,
            'discount_value': str(coupon.discount_value),
            'calculated_discount': str(discount),
            'max_discount': str(coupon.max_discount) if coupon.max_discount else None,
            'message': f"Awesome! {coupon.code} applied. Saved ₹{discount:.2f}!",
        }

CouponDoesNotExist = Coupon.DoesNotExist
