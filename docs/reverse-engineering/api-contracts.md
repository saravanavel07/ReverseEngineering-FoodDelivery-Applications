# DRF REST API Contracts

## 1. Authentication Endpoints
- `POST /api/auth/register/` -> `{ phone, name, password }` => `200 OK { user_id, status: 'registered' }`
- `POST /api/auth/login/` -> `{ username, password }` => `200 OK { user_id, status: 'authenticated' }`
- `POST /api/auth/logout/` => `200 OK { status: 'logged_out' }`
- `GET /api/auth/me/` => `200 OK { id, username, first_name, email }`

## 2. Discovery & Restaurants
- `GET /api/restaurants/` (Supports `?search=`, `?ordering=rating,delivery_time_mins`)
- `GET /api/restaurants/{id}/` (Includes full menu categories & options)
- `GET /api/restaurants/{id}/menu/` (Category-grouped item list)
- `GET /api/categories/` (List of supported cuisine categories)

## 3. Promotions
- `POST /api/coupons/validate/` -> `{ coupon_code: "ORANGE50", subtotal: "450.00" }`
  - Response:
  ```json
  {
    "valid": true,
    "coupon_code": "ORANGE50",
    "discount_type": "percentage",
    "calculated_discount": "100.00",
    "max_discount": "100.00",
    "message": "Awesome! ORANGE50 applied. Saved ₹100.00!"
  }
  ```

## 4. Orders & Tracking
- `POST /api/orders/` -> `{ address: "...", payment_method: "UPI", coupon_code: "ORANGE50" }`
- `GET /api/orders/` -> List of orders for authenticated user
- `GET /api/orders/{id}/tracking/` -> Live status history and assigned delivery partner info
- `POST /api/orders/{id}/cancel/` -> Cancel permitted if in PLACED or ACCEPTED stage
