# Database Design & Entity Relationship Specifications

## 1. Relational Entity Schema

### User & Customer Profile
- **User** (Django standard: id, username, email, password_hash, is_staff, created_at)
- **CustomerProfile** (user_id FK 1:1, phone [unique], created_at, updated_at)
- **Address** (user_id FK, type ['Home', 'Work', 'Other'], title, address_line, landmark, contact_number, is_default)

### Restaurants & Menus
- **Restaurant** (id, name, slug [unique], rating [Decimal(3,2)], rating_count, delivery_time_mins, distance_km, cost_for_two, area, city, is_veg_only, is_open, discount_badge, image_url)
- **Cuisine** (id, name [unique], slug, icon)
- **MenuCategory** (id, restaurant_id FK, name, order)
- **MenuItem** (id, restaurant_id FK, category_id FK, name, description, price [Decimal(8,2)], is_veg, is_bestseller, rating, in_stock, customizable, image_url)
- **MenuItemOptionGroup** (id, menu_item_id FK, title, required, min_select, max_select)
- **MenuItemOption** (id, group_id FK, name, price [Decimal(8,2)])

### Carts & Pricing
- **Cart** (id, user_id FK nullable, session_key, restaurant_id FK nullable, updated_at)
- **CartItem** (id, cart_id FK, menu_item_id FK, quantity, selected_options M2M)

### Promotions & Orders
- **Coupon** (code [unique], discount_type ['percentage', 'flat'], discount_value, min_order_value, max_discount, is_active)
- **CouponRedemption** (coupon_id FK, user_id FK, order_id, discount_amount, redeemed_at)
- **Order** (id, user_id FK, order_number [unique], restaurant_id FK, restaurant_name_snapshot, subtotal, delivery_fee, packaging_fee, platform_fee, taxes, discount, total_amount, coupon_code, delivery_address_snapshot, payment_method, payment_status, order_status, created_at)
- **OrderItem** (id, order_id FK, item_name_snapshot, unit_price_snapshot, quantity, total_price_snapshot, options_summary)
- **OrderStatusHistory** (id, order_id FK, status, note, created_at)
