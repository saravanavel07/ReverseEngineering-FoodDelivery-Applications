# Component Inventory & Frontend Architecture

## 1. UI Components Directory
- **`OrangeLogo.tsx`**: Original geometric logo consisting of an abstract food cloche dome, dynamic route/bite notch, and steam swirl. Available in compact, full, and badge variations.
- **`ParticleBackground.tsx`**: High-performance canvas particle system featuring floating citrus slices, amber stars, soft orange glow orbs, with automatic pause on tab blur and respect for `prefers-reduced-motion`.
- **`Header.tsx`**: Sticky responsive navigation featuring location selection dropdown, instant search trigger, Django Lab modal launcher, Admin operations toggle, cart counter badge, and user authentication menu.
- **`RestaurantCard.tsx`**: Interactive card with discount badge, Pure Veg indicator, delivery time, distance in km, rating pill, cuisines, and cost for two.
- **`MenuItemCard.tsx`**: Food item card with green/red veg indicator, bestseller tag, pricing, description, customizable label, and interactive quantity steppers (+/-).
- **`CustomizationModal.tsx`**: Modal for choosing portion sizes, crusts, spice levels, and accompaniments with live price increment tallying.
- **`CartDrawer.tsx`**: Sliding cart drawer with single-restaurant enforcement, item summary, coupon application with instant discount calculation, and complete bill breakdown.
- **`CheckoutModal.tsx`**: Delivery address picker, custom delivery instructions, and demo payment simulation (UPI, Cards, Netbanking, COD).
- **`TrackingView.tsx`**: 6-stage order timeline with dynamic animated route track, simulated delivery partner contact card, and step advance/cancel controls.
- **`AdminDashboard.tsx`**: Operations hub with GMV reporting, order status changer, and menu stock availability toggles.
- **`DjangoLabView.tsx`**: Integrated reverse-engineering laboratory with Django ER diagrams, interactive DRF REST API explorer, and automated test suite runner.
- **`SearchModal.tsx`**: Instant keyword search matching restaurants and dishes across all menus with veg-only filters.
- **`ReviewModal.tsx`**: 5-star rating submission modal with feedback tags and customer comments.
