from decimal import Decimal
from apps.promotions.services import CouponService

class CartPricingService:
    @staticmethod
    def calculate_totals(cart, coupon_code: str = None):
        """
        Server authoritative calculation of cart lines, packaging, delivery partner fee,
        platform fee, GST taxes, and coupon discount. Never trusts browser totals.
        """
        subtotal = Decimal('0.00')
        line_items_data = []

        for item in cart.items.select_related('menu_item').prefetch_related('selected_options').all():
            base_price = item.menu_item.price
            options_cost = sum([opt.price for opt in item.selected_options.all()], Decimal('0.00'))
            unit_price = base_price + options_cost
            line_total = unit_price * item.quantity
            subtotal += line_total

            line_items_data.append({
                'item_id': item.id,
                'name': item.menu_item.name,
                'is_veg': item.menu_item.is_veg,
                'quantity': item.quantity,
                'unit_price': str(unit_price),
                'line_total': str(line_total),
            })

        # Base pricing rules
        packaging_fee = Decimal('25.00') if subtotal > 0 else Decimal('0.00')
        platform_fee = Decimal('6.00') if subtotal > 0 else Decimal('0.00')
        delivery_fee = Decimal('0.00') if subtotal > Decimal('500.00') or subtotal == 0 else Decimal('35.00')

        # Coupon validation
        discount = Decimal('0.00')
        coupon_info = None

        if coupon_code and subtotal > 0:
            coupon_res = CouponService.validate_and_calculate_discount(coupon_code, subtotal, cart.user)
            if coupon_res.get('valid'):
                discount = Decimal(coupon_res['calculated_discount'])
                coupon_info = coupon_res

        # GST: 5% on post-discount food subtotal
        taxable_amount = max(Decimal('0.00'), subtotal - discount)
        taxes = (taxable_amount * Decimal('0.05')).quantize(Decimal('1.00'))

        final_total = max(Decimal('0.00'), subtotal - discount + delivery_fee + packaging_fee + platform_fee + taxes)

        return {
            'item_count': sum(i['quantity'] for i in line_items_data),
            'items': line_items_data,
            'subtotal': str(subtotal),
            'delivery_fee': str(delivery_fee),
            'packaging_fee': str(packaging_fee),
            'platform_fee': str(platform_fee),
            'taxes_gst_5pct': str(taxes),
            'discount': str(discount),
            'final_total': str(final_total),
            'coupon_info': coupon_info,
        }
