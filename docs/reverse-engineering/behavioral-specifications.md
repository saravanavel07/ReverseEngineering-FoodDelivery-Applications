# Behavioral Specifications

## 1. Specification: Adding a Dish to Cart
1. **Validation**: Check that `restaurant_id` and `menu_item_id` exist and are marked `is_open=True` and `in_stock=True`.
2. **Customization Validation**: If item has required option groups, verify that exactly one valid option was chosen per required group.
3. **Single-Restaurant Check**: If cart already contains items from Restaurant A and incoming item is from Restaurant B, return a conflict warning requiring user confirmation before resetting cart.
4. **Authoritative Subtotal**: Compute `line_item_total = (base_price + options_cost) * quantity`.
5. **Persistence**: Store in database cart model or user session.

## 2. Specification: Coupon Application
1. **Lookup**: Retrieve coupon matching code case-insensitively. Verify `is_active=True`.
2. **Threshold**: Assert `subtotal >= coupon.min_order_value`. If false, fail with prompt indicating shortfall amount.
3. **Discount Computation**:
   - Percentage: `min(subtotal * (discount_value / 100), max_discount)`.
   - Flat: `discount_value`.
4. **Idempotency**: Prevent repeated redemption on the same order.

## 3. Specification: Order Lifecycle & Cancellation
1. **Placed**: Order record created, payment simulated and verified.
2. **Accepted**: Kitchen confirms order. Cancellation permitted by user.
3. **Preparing**: Chef begins food preparation. Cancellation prohibited.
4. **Ready**: Packaging sealed.
5. **Out for Delivery**: Assigned delivery partner en route.
6. **Delivered**: Terminal success state. Rating prompt unlocked.
