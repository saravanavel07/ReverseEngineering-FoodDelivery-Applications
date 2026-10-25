from decimal import Decimal
import pytest
from apps.promotions.services import CouponService

def test_authoritative_coupon_calculation_percentage():
    subtotal = Decimal('300.00')
    # 50% of 300 is 150, but max cap is 100
    res = CouponService.validate_and_calculate_discount('ORANGE50', subtotal)
    assert res['valid'] is True
    assert Decimal(res['calculated_discount']) == Decimal('100.00')

def test_coupon_min_order_value_enforcement():
    subtotal = Decimal('100.00')
    res = CouponService.validate_and_calculate_discount('ORANGE50', subtotal)
    assert res['valid'] is False
    assert "Add items worth" in res['error']

def test_flat_discount_calculation():
    subtotal = Decimal('600.00')
    res = CouponService.validate_and_calculate_discount('BITE150', subtotal)
    assert res['valid'] is True
    assert Decimal(res['calculated_discount']) == Decimal('150.00')
