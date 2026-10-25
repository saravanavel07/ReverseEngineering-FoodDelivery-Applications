from decimal import Decimal
import uuid
from django.db import transaction
from django.utils import timezone
from .models import Order, OrderItem, OrderStatusHistory
from apps.cart.services import CartPricingService
from apps.promotions.models import CouponRedemption, Coupon

class OrderService:
    @staticmethod
    def create_order_atomic(user, cart, address_text: str, payment_method: str = 'UPI', coupon_code: str = None):
        """
        Executes atomic order creation inside database transaction:
        1. Authoritatively calculates prices from database.
        2. Freezes item names, options, and prices into OrderItem snapshots.
        3. Records coupon redemption if applicable.
        4. Initializes order status history.
        5. Clears user cart.
        """
        if not cart.items.exists():
            raise ValueError("Cannot create order from an empty cart.")

        pricing = CartPricingService.calculate_totals(cart, coupon_code)

        with transaction.atomic():
            order_number = f"OB-{timezone.now().year}-{str(uuid.uuid4())[:8].upper()}"

            order = Order.objects.create(
                user=user,
                order_number=order_number,
                restaurant=cart.restaurant,
                restaurant_name_snapshot=cart.restaurant.name if cart.restaurant else 'OrangeBite Kitchen',
                subtotal=Decimal(pricing['subtotal']),
                delivery_fee=Decimal(pricing['delivery_fee']),
                packaging_fee=Decimal(pricing['packaging_fee']),
                platform_fee=Decimal(pricing['platform_fee']),
                taxes=Decimal(pricing['taxes_gst_5pct']),
                discount=Decimal(pricing['discount']),
                total_amount=Decimal(pricing['final_total']),
                coupon_code=coupon_code if pricing.get('coupon_info') else None,
                delivery_address_snapshot=address_text,
                payment_method=payment_method,
                payment_status='COMPLETED',
                order_status='PLACED',
            )

            # Create immutable OrderItems
            for item in cart.items.select_related('menu_item').all():
                options_str = ", ".join([opt.name for opt in item.selected_options.all()])
                options_cost = sum([opt.price for opt in item.selected_options.all()], Decimal('0.00'))
                unit_price = item.menu_item.price + options_cost
                total_line_price = unit_price * item.quantity

                OrderItem.objects.create(
                    order=order,
                    item_name_snapshot=item.menu_item.name,
                    unit_price_snapshot=unit_price,
                    quantity=item.quantity,
                    total_price_snapshot=total_line_price,
                    options_summary=options_str,
                )

            # Record coupon redemption
            if pricing.get('coupon_info'):
                try:
                    cp = Coupon.objects.get(code__iexact=coupon_code.strip())
                    CouponRedemption.objects.create(
                        coupon=cp,
                        user=user,
                        order_id=order.order_number,
                        discount_amount=Decimal(pricing['discount']),
                    )
                except Coupon.DoesNotExist:
                    pass

            # Initial status record
            OrderStatusHistory.objects.create(
                order=order,
                status='PLACED',
                note='Order successfully placed and verified in database.'
            )

            # Clear cart items
            cart.items.all().delete()

            return order

    @staticmethod
    def transition_order_status(order: Order, new_status: str, note: str = ''):
        """
        Transition order status with business validation:
        Cancellation only permitted in PLACED or ACCEPTED stage.
        """
        if new_status == 'CANCELLED':
            if order.order_status not in ['PLACED', 'ACCEPTED']:
                raise ValueError("Order cannot be cancelled once preparation has started.")
            order.payment_status = 'REFUNDED'

        order.order_status = new_status
        order.save()

        OrderStatusHistory.objects.create(
            order=order,
            status=new_status,
            note=note or f"Order transitioned to {new_status}"
        )
        return order
