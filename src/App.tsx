import React, { useState } from 'react';
import {
  INITIAL_RESTAURANTS,
  INITIAL_ADDRESSES,
  INITIAL_ORDERS,
  AVAILABLE_COUPONS,
  CUISINE_CATEGORIES,
  Restaurant,
  MenuItem,
  CartItem,
  CartItemOptionSelected,
  Coupon,
  Address,
  Order,
} from './data/orangebiteData';
import { Header } from './components/Header';
import { ParticleBackground } from './components/ParticleBackground';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantDetailView } from './components/RestaurantDetailView';
import { CartDrawer } from './components/CartDrawer';
import { CustomizationModal } from './components/CustomizationModal';
import { CheckoutModal } from './components/CheckoutModal';
import { TrackingView } from './components/TrackingView';
import { OrdersHistoryView } from './components/OrdersHistoryView';
import { AdminDashboard } from './components/AdminDashboard';
import { DjangoLabView } from './components/DjangoLabView';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { ReviewModal } from './components/ReviewModal';
import { OrangeLogo } from './components/OrangeLogo';
import {
  Sparkles,
  Percent,
  SlidersHorizontal,
  Flame,
  Award,
  ShieldCheck,
  Heart,
  ChevronRight,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  // Navigation & View state
  const [activeView, setActiveView] = useState<
    'home' | 'restaurant' | 'tracking' | 'admin' | 'docs' | 'orders'
  >('home');

  // Location
  const [currentLocation, setCurrentLocation] = useState('Koramangala, 5th Block, Bengaluru');

  // Particle background toggle
  const [particlesEnabled, setParticlesEnabled] = useState(true);

  // Authentication State
  const [user, setUser] = useState<{ name: string; phone: string; email: string } | null>({
    name: 'Saravana Kumar',
    phone: '+91 98765 43210',
    email: 'saravana@orangebite.dev',
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Data state
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(INITIAL_ORDERS[0]);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartRestaurantId, setCartRestaurantId] = useState<string | null>(null);
  const [cartRestaurantName, setCartRestaurantName] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(AVAILABLE_COUPONS[0]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);

  // Filters & Sorting on Home
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [vegOnlyFilter, setVegOnlyFilter] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(false);
  const [fastDeliveryFilter, setFastDeliveryFilter] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'time' | 'cost_asc'>('relevance');

  // Cart Management Functions
  const handleAddToCart = (dish: MenuItem, selectedOptions: CartItemOptionSelected[] = [], customPrice?: number) => {
    if (!selectedRestaurant) return;

    // Check restaurant consistency: if user adds from another restaurant, confirm reset
    if (cartRestaurantId && cartRestaurantId !== selectedRestaurant.id && cartItems.length > 0) {
      const confirmSwitch = window.confirm(
        `Your cart has items from ${cartRestaurantName}. Would you like to clear your cart and add items from ${selectedRestaurant.name}?`
      );
      if (!confirmSwitch) return;
      setCartItems([]);
    }

    setCartRestaurantId(selectedRestaurant.id);
    setCartRestaurantName(selectedRestaurant.name);

    const unitPrice = customPrice !== undefined ? customPrice : dish.price;
    const lineId = `${dish.id}-${selectedOptions.map((o) => o.optionId).join('-')}`;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === lineId);
      if (existing) {
        return prev.map((i) =>
          i.id === lineId
            ? {
                ...i,
                quantity: i.quantity + 1,
                totalItemPrice: (i.quantity + 1) * (i.totalItemPrice / i.quantity),
              }
            : i
        );
      } else {
        const newItem: CartItem = {
          id: lineId,
          menuItemId: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: 1,
          isVeg: dish.isVeg,
          selectedOptions,
          totalItemPrice: unitPrice,
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      const updated = cartItems.filter((i) => i.id !== cartItemId);
      setCartItems(updated);
      if (updated.length === 0) {
        setCartRestaurantId(null);
        setCartRestaurantName('');
      }
    } else {
      setCartItems((prev) =>
        prev.map((i) => {
          if (i.id === cartItemId) {
            const singleUnitPrice = i.totalItemPrice / i.quantity;
            return {
              ...i,
              quantity: newQty,
              totalItemPrice: singleUnitPrice * newQty,
            };
          }
          return i;
        })
      );
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
    setCartRestaurantId(null);
    setCartRestaurantName('');
  };

  // Order Placement
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingOrder(newOrder);
    setCartItems([]);
    setCartRestaurantId(null);
    setCartRestaurantName('');
    setActiveView('tracking');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['orderStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    if (activeTrackingOrder?.id === orderId) {
      setActiveTrackingOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
    }
  };

  const handleToggleItemStock = (restaurantId: string, menuItemId: string) => {
    setRestaurants((prev) =>
      prev.map((rest) => {
        if (rest.id === restaurantId) {
          return {
            ...rest,
            menu: rest.menu.map((dish) =>
              dish.id === menuItemId ? { ...dish, inStock: !dish.inStock } : dish
            ),
          };
        }
        return rest;
      })
    );
  };

  const handleSelectRestaurant = (rest: Restaurant) => {
    setSelectedRestaurant(rest);
    setActiveView('restaurant');
  };

  const handleSelectDishFromSearch = (rest: Restaurant, dish: MenuItem) => {
    setSelectedRestaurant(rest);
    setActiveView('restaurant');
    if (dish.customizable) {
      setCustomizingItem(dish);
    } else {
      handleAddToCart(dish);
    }
  };

  const handleReorder = (items: CartItem[], restName: string) => {
    const foundRest = restaurants.find((r) => r.name === restName) || restaurants[0];
    setSelectedRestaurant(foundRest);
    setCartRestaurantId(foundRest.id);
    setCartRestaurantName(foundRest.name);
    setCartItems(items);
    setIsCartOpen(true);
  };

  const handleAddNewAddress = (newAddr: Address) => {
    setSavedAddresses((prev) => [newAddr, ...prev]);
  };

  const handleSubmitReview = (orderId: string, rating: number, comment: string) => {
    // Save review
  };

  // Filtered & Sorted Restaurants
  const filteredRestaurants = restaurants.filter((r) => {
    if (vegOnlyFilter && !r.isVegOnly) return false;
    if (ratingFilter && r.rating < 4.5) return false;
    if (fastDeliveryFilter && r.deliveryTimeMins > 28) return false;
    if (selectedCuisine !== 'all') {
      const match = r.cuisines.some((c) =>
        c.toLowerCase().includes(selectedCuisine.toLowerCase())
      );
      if (!match) return false;
    }
    return true;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'time') return a.deliveryTimeMins - b.deliveryTimeMins;
    if (sortBy === 'cost_asc') return a.costForTwo - b.costForTwo;
    return 0; // relevance
  });

  const totalCartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-orange-500 selection:text-white">
      {/* Live Motion Orange Particles Background */}
      <ParticleBackground enabled={particlesEnabled} />

      {/* Main Header */}
      <Header
        currentLocation={currentLocation}
        onSelectLocation={setCurrentLocation}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={() => setActiveView('admin')}
        onOpenDocs={() => setActiveView('docs')}
        onOpenAuth={() => setIsAuthOpen(true)}
        user={user}
        onLogout={() => setUser(null)}
        particlesEnabled={particlesEnabled}
        onToggleParticles={() => setParticlesEnabled(!particlesEnabled)}
        activeView={activeView}
        onNavigateHome={() => setActiveView('home')}
        onOpenOrders={() => setActiveView('orders')}
      />

      {/* Main Application Body based on Active View */}
      <main className="flex-1 pb-16">
        {/* VIEW 1: HOME DISCOVERY */}
        {activeView === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
            {/* Hero Offer Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FC8019] via-[#E86F00] to-amber-600 text-white p-6 sm:p-10 shadow-xl shadow-orange-500/15">
              <div className="relative z-10 max-w-xl space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Grand Launch Promo</span>
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
                  Hungry? Order From Top Kitchens Near You.
                </h1>
                <p className="text-xs sm:text-sm text-orange-100 font-medium">
                  Use code <span className="font-mono font-black text-white bg-white/20 px-2 py-0.5 rounded">ORANGE50</span> for 50% OFF up to ₹100 on your feast!
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      const rest = restaurants[0];
                      setSelectedRestaurant(rest);
                      setActiveView('restaurant');
                    }}
                    className="px-6 py-3 rounded-2xl bg-white text-[#FC8019] hover:bg-orange-50 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
                  >
                    Order Meghana Biryani →
                  </button>
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="px-4 py-3 rounded-2xl bg-black/20 hover:bg-black/30 backdrop-blur-md text-white font-bold text-xs transition-colors"
                  >
                    Explore 100+ Dishes
                  </button>
                </div>
              </div>

              {/* Decorative graphic cloche */}
              <div className="absolute -right-8 -bottom-8 w-64 h-64 opacity-15 pointer-events-none hidden md:block">
                <svg viewBox="0 0 100 100" fill="white">
                  <circle cx="50" cy="50" r="45" />
                </svg>
              </div>
            </div>

            {/* Food Cuisine Inspiration Carousel */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight">
                  What's on your mind?
                </h2>
                {selectedCuisine !== 'all' && (
                  <button
                    onClick={() => setSelectedCuisine('all')}
                    className="text-xs font-bold text-[#FC8019] hover:underline"
                  >
                    Reset Cuisines
                  </button>
                )}
              </div>

              <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
                {CUISINE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCuisine === cat.name;
                  return (
                    <button
                      key={cat.id}
                      onClick={() =>
                        setSelectedCuisine(isSelected ? 'all' : cat.name)
                      }
                      className={`flex flex-col items-center p-3.5 rounded-2xl border transition-all shrink-0 w-24 sm:w-28 text-center group cursor-pointer ${
                        isSelected
                          ? 'border-[#FC8019] bg-orange-50/80 shadow-xs ring-2 ring-[#FC8019]'
                          : 'border-zinc-200/80 bg-white hover:border-orange-200 hover:shadow-xs'
                      }`}
                    >
                      <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-200">
                        {cat.icon}
                      </span>
                      <span className="text-xs font-bold text-zinc-800 mt-2 truncate w-full">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium">
                        {cat.count} places
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filters & Sorting Bar */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 border border-zinc-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters:</span>
                </span>

                {/* Veg Only Switch */}
                <button
                  onClick={() => setVegOnlyFilter(!vegOnlyFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    vegOnlyFilter
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Pure Veg</span>
                </button>

                {/* Rating 4.5+ */}
                <button
                  onClick={() => setRatingFilter(!ratingFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    ratingFilter
                      ? 'bg-orange-50 border-[#FC8019] text-[#FC8019]'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  ★ Ratings 4.5+
                </button>

                {/* Fast Delivery SLA */}
                <button
                  onClick={() => setFastDeliveryFilter(!fastDeliveryFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    fastDeliveryFilter
                      ? 'bg-orange-50 border-[#FC8019] text-[#FC8019]'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  ⚡ Fast Delivery (&lt;28m)
                </button>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400 font-semibold">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-zinc-50 border border-zinc-200 font-bold text-zinc-800 rounded-xl px-2.5 py-1.5 focus:outline-hidden cursor-pointer"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating: High to Low</option>
                  <option value="time">Delivery Time</option>
                  <option value="cost_asc">Cost: Low to High</option>
                </select>
              </div>
            </div>

            {/* Restaurant Cards Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight">
                  Top Restaurants Delivering to {currentLocation.split(',')[0]}
                </h2>
                <span className="text-xs text-zinc-400 font-bold">
                  {sortedRestaurants.length} restaurants open now
                </span>
              </div>

              {sortedRestaurants.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200">
                  <div className="text-4xl mb-2">🔍</div>
                  <h3 className="text-base font-bold text-zinc-800">No restaurants match your filters</h3>
                  <p className="text-xs text-zinc-500 mt-1">Try clearing some filters to explore more food options.</p>
                  <button
                    onClick={() => {
                      setVegOnlyFilter(false);
                      setRatingFilter(false);
                      setFastDeliveryFilter(false);
                      setSelectedCuisine('all');
                    }}
                    className="mt-4 px-5 py-2 rounded-xl bg-[#FC8019] text-white font-bold text-xs"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {sortedRestaurants.map((rest) => (
                    <RestaurantCard
                      key={rest.id}
                      restaurant={rest}
                      onClick={() => handleSelectRestaurant(rest)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: RESTAURANT DETAIL & MENU */}
        {activeView === 'restaurant' && selectedRestaurant && (
          <RestaurantDetailView
            restaurant={selectedRestaurant}
            cartItems={cartItems}
            onBack={() => setActiveView('home')}
            onAddToCart={(dish) => handleAddToCart(dish)}
            onUpdateCartItemQty={(menuItemId, newQty) => {
              const line = cartItems.find((i) => i.menuItemId === menuItemId);
              if (line) handleUpdateCartQuantity(line.id, newQty);
            }}
            onOpenCustomization={(dish) => setCustomizingItem(dish)}
          />
        )}

        {/* VIEW 3: LIVE ORDER TRACKING */}
        {activeView === 'tracking' && activeTrackingOrder && (
          <TrackingView
            order={activeTrackingOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onBackToHome={() => setActiveView('home')}
            onOpenReview={(ord) => setReviewOrder(ord)}
          />
        )}

        {/* VIEW 4: ADMIN DASHBOARD */}
        {activeView === 'admin' && (
          <AdminDashboard
            restaurants={restaurants}
            orders={orders}
            onToggleItemStock={handleToggleItemStock}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onClose={() => setActiveView('home')}
          />
        )}

        {/* VIEW 5: DJANGO LAB & REVERSE ENGINEERING */}
        {activeView === 'docs' && (
          <DjangoLabView onClose={() => setActiveView('home')} />
        )}

        {/* VIEW 6: PAST ORDERS */}
        {activeView === 'orders' && (
          <OrdersHistoryView
            orders={orders}
            onTrackOrder={(ord) => {
              setActiveTrackingOrder(ord);
              setActiveView('tracking');
            }}
            onReorder={handleReorder}
            onOpenReview={(ord) => setReviewOrder(ord)}
            onBackToHome={() => setActiveView('home')}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        restaurantName={cartRestaurantName}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
      />

      {/* Customization Modal */}
      {customizingItem && (
        <CustomizationModal
          item={customizingItem}
          onClose={() => setCustomizingItem(null)}
          onAddToCart={(selectedOptions, totalItemPrice) => {
            handleAddToCart(customizingItem, selectedOptions, totalItemPrice);
          }}
        />
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          items={cartItems}
          restaurantId={cartRestaurantId || 'rest-1'}
          restaurantName={cartRestaurantName || 'OrangeBite Restaurant'}
          restaurantArea={selectedRestaurant?.area || 'Central District'}
          appliedCoupon={appliedCoupon}
          savedAddresses={savedAddresses}
          onAddNewAddress={handleAddNewAddress}
          onOrderPlaced={handleOrderPlaced}
        />
      )}

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        restaurants={restaurants}
        onSelectRestaurant={handleSelectRestaurant}
        onSelectDish={handleSelectDishFromSearch}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(u) => setUser(u)}
      />

      {/* Review Modal */}
      <ReviewModal
        order={reviewOrder}
        onClose={() => setReviewOrder(null)}
        onSubmitReview={handleSubmitReview}
      />

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 text-xs border-t border-zinc-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <OrangeLogo size="md" variant="white" />
              <p className="text-zinc-400 text-xs leading-relaxed">
                OrangeBite is an Indian food delivery platform engineered with server-authoritative pricing, instant dish discovery, and full Python Django architecture.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-wider mb-3">Explore</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><button onClick={() => setActiveView('home')} className="hover:text-white">Top Restaurants</button></li>
                <li><button onClick={() => setIsSearchOpen(true)} className="hover:text-white">Food Search</button></li>
                <li><button onClick={() => setActiveView('orders')} className="hover:text-white">My Orders</button></li>
                <li><button onClick={() => setIsCartOpen(true)} className="hover:text-white">Current Cart</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-wider mb-3">Company</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><button onClick={() => setActiveView('home')} className="hover:text-white cursor-pointer">About OrangeBite</button></li>
                <li><button onClick={() => setIsSearchOpen(true)} className="hover:text-white cursor-pointer">Cuisines Guide</button></li>
                <li><button onClick={() => setActiveView('home')} className="hover:text-white cursor-pointer">Partner With Us</button></li>
                <li><button onClick={() => setActiveView('orders')} className="hover:text-white cursor-pointer">Help & Support</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-wider mb-3">Platform Guarantee</h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed mb-3">
                100% Contactless Delivery • FSSAI Certified Hygiene Rating • Tamper-Evident Packaging.
              </p>
              <div className="flex items-center gap-2 text-orange-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Safe Sandbox Mode Active</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400">
            <div>
              © 2026 OrangeBite Platform Inc. All rights reserved.
            </div>
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>FSSAI Lic. #11223344556677</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
