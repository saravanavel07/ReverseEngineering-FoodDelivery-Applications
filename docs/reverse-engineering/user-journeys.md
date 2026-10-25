# User Journeys & Workflow Specifications

## 1. Journey 1: Discovery to Order Placement
1. **Location Selection**: User chooses delivery neighborhood (e.g. Koramangala 5th Block, Bengaluru).
2. **Cuisine & Dietary Filtering**: User clicks "Biryani" or selects "Pure Veg" toggle.
3. **Restaurant Inspection**: User selects "Meghana Foods Delight" to view full menu.
4. **Customization**: User selects "Special Chicken Biryani", chooses portion "Regular" and spice level "Medium".
5. **Cart Review & Coupon**: User opens Cart, applies `ORANGE50`, checks 50% discount and 5% GST calculation.
6. **Checkout**: User selects saved Home address, chooses UPI demo payment, places order.
7. **Live Tracking**: Order is placed -> Restaurant accepts -> Chef prepares -> Out for delivery -> Delivered.

## 2. Journey 2: Kitchen Operator & Admin Workflow
1. **Access Hub**: Admin enters Operations Hub from navigation bar.
2. **Review Metrics**: Inspects live Gross Sales (GMV), Active Orders, and Outlet SLAs.
3. **Process Order**: Moves incoming order from `PLACED` to `ACCEPTED` and `PREPARING`.
4. **Inventory Management**: Disables dish ("Out of Stock") when daily kitchen ingredients deplete.
