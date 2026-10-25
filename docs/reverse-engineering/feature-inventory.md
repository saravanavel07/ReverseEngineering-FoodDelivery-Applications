# Phase B: Functional Decomposition & Feature Inventory

## 1. Module Inventory Matrix
OrangeBite decomposes food delivery into 18 independent domain modules:

1. **Authentication (`apps.accounts`)**: Phone-number based OTP login, session cookie authentication, and user profile management.
2. **Address Book (`apps.accounts.Address`)**: Multiple tagged delivery destinations (Home, Work, Other) with contact phone numbers and landmarks.
3. **Restaurant Catalog (`apps.restaurants`)**: Outlets, operating hours, FSSAI compliance licenses, average delivery SLAs, and ratings.
4. **Cuisines (`apps.restaurants.Cuisine`)**: Multilingual cuisine categorization (Biryani, North Indian, South Indian, Pizza, Burgers, Chinese).
5. **Menu Categories (`apps.menu.MenuCategory`)**: Hierarchical sectioning within restaurants (Specials, Starters, Breads, Beverages).
6. **Menu Items (`apps.menu.MenuItem`)**: Dishes with Veg/Non-Veg indicators, bestseller flags, prices, descriptions, and stock toggles.
7. **Customization Engine (`apps.menu.MenuItemOptionGroup`)**: Portion sizes (Regular, Jumbo), spice preferences, and add-ons (extra cheese, raita).
8. **Discovery & Search (`apps.discovery`)**: Instant fuzzy search across dishes and restaurants with multi-attribute filtering (pure veg, ratings 4.5+, SLA <28 mins).
9. **Cart Service (`apps.cart`)**: Single-restaurant validation, item quantities, and real-time total recalculation.
10. **Pricing Authority (`apps.cart.services.CartPricingService`)**: Authoritative calculation of food subtotal, packaging fees, delivery partner fees, platform fees, and 5% GST taxes.
11. **Coupon Engine (`apps.promotions`)**: Minimum order verification, maximum discount capping, percentage and flat discounts.
12. **Order Management (`apps.orders`)**: Database-level atomic order placement with immutable receipt snapshots (`OrderItem`).
13. **Order Tracking (`apps.orders.OrderStatusHistory`)**: Real-time lifecycle state machine (`PLACED` -> `ACCEPTED` -> `PREPARING` -> `READY` -> `OUT_FOR_DELIVERY` -> `DELIVERED`).
14. **Payment Records (`apps.payments`)**: Simulated sandbox payment processing supporting UPI, Credit/Debit cards, Netbanking, and Cash on Delivery.
15. **Customer Reviews (`apps.reviews`)**: Rating stars, food tags, and customer experience testimonials.
16. **Admin Dashboard (`apps.dashboard`)**: Gross Merchandise Value (GMV) telemetry, live order state controller, and menu stock toggles.
17. **Recommendation Service (`apps.discovery.services.RecommendationService`)**: Transparent rule-based scoring combining ratings, delivery SLAs, and dietary preferences.
18. **Live Motion Particle UI**: Lightweight HTML5 Canvas particle system rendering floating citrus slices, amber sparks, and ambient warmth.
