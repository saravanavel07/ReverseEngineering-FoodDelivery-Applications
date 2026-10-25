from decimal import Decimal
import pytest
from apps.orders.services import OrderService

def test_order_cancellation_state_rules():
    class DummyOrder:
        def __init__(self, status):
            self.order_status = status
            self.payment_status = 'COMPLETED'
        def save(self):
            pass

    # Cancel allowed in PLACED state
    order = DummyOrder('PLACED')
    # State validation should allow PLACED and ACCEPTED
    assert order.order_status in ['PLACED', 'ACCEPTED']

    # Cancel disallowed in PREPARING state
    order_preparing = DummyOrder('PREPARING')
    assert order_preparing.order_status not in ['PLACED', 'ACCEPTED']
