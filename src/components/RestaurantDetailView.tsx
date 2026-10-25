import React, { useState } from 'react';
import { Restaurant, MenuItem, CartItem } from '../data/orangebiteData';
import { MenuItemCard } from './MenuItemCard';
import { Star, Clock, MapPin, Search, ArrowLeft, Tag, ShieldCheck } from 'lucide-react';

interface RestaurantDetailViewProps {
  restaurant: Restaurant;
  cartItems: CartItem[];
  onBack: () => void;
  onAddToCart: (dish: MenuItem) => void;
  onUpdateCartItemQty: (menuItemId: string, newQty: number) => void;
  onOpenCustomization: (dish: MenuItem) => void;
}

export const RestaurantDetailView: React.FC<RestaurantDetailViewProps> = ({
  restaurant,
  cartItems,
  onBack,
  onAddToCart,
  onUpdateCartItemQty,
  onOpenCustomization,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [vegOnly, setVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories
  const categories = Array.from(new Set(restaurant.menu.map((m) => m.category)));

  // Filter dishes
  const filteredDishes = restaurant.menu.filter((dish) => {
    if (vegOnly && !dish.isVeg) return false;
    if (activeCategory !== 'all' && dish.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!dish.name.toLowerCase().includes(q) && !dish.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-[#FC8019] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Restaurants</span>
      </button>

      {/* Restaurant Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-md">
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 leading-tight">
                {restaurant.name}
              </h1>
              {restaurant.isVegOnly && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg shadow-xs">
                  Pure Veg
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-1">
              {restaurant.cuisines.join(', ')}
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              {restaurant.area}, {restaurant.city}
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-bold text-zinc-700">
              <div className="flex items-center gap-1.5 bg-emerald-700 text-white px-2.5 py-1 rounded-xl shadow-xs">
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>{restaurant.rating}</span>
                <span className="text-[10px] text-emerald-200 font-normal">
                  ({(restaurant.ratingCount / 1000).toFixed(1)}k+ ratings)
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-zinc-100 px-3 py-1 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-[#FC8019]" />
                <span>{restaurant.deliveryTimeMins} mins Delivery</span>
              </div>

              <div className="flex items-center gap-1.5 bg-zinc-100 px-3 py-1 rounded-xl">
                <MapPin className="w-3.5 h-3.5 text-[#FC8019]" />
                <span>{restaurant.distanceKm} km away</span>
              </div>

              <div className="bg-zinc-100 px-3 py-1 rounded-xl">
                <span>₹{restaurant.costForTwo} for two</span>
              </div>
            </div>
          </div>

          {/* Restaurant Banner Image */}
          <div className="w-full md:w-56 h-36 rounded-2xl overflow-hidden bg-zinc-100 shadow-sm shrink-0">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Available Offers Strip */}
        {restaurant.discountBadge && (
          <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-bold text-[#FC8019]">
            <Tag className="w-4 h-4 shrink-0" />
            <span>Use coupon ORANGE50 to get {restaurant.discountBadge} on this restaurant!</span>
          </div>
        )}
      </div>

      {/* Menu Controls: Search, Veg Toggle, Category Tabs */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-zinc-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Dish Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={`Search in ${restaurant.name} menu...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100 border-none rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-[#FC8019]"
            />
          </div>

          {/* Veg Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="accent-green-600 rounded"
            />
            <span className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-600" />
              <span>Veg Only</span>
            </span>
          </label>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
              activeCategory === 'all'
                ? 'bg-[#FC8019] text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            All Dishes ({restaurant.menu.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                activeCategory === cat
                  ? 'bg-[#FC8019] text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Dishes List */}
      <div className="space-y-4">
        {filteredDishes.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200 text-zinc-400 text-xs">
            No dishes found matching your current filter.
          </div>
        ) : (
          filteredDishes.map((dish) => {
            const cartItem = cartItems.find((i) => i.menuItemId === dish.id);
            const qty = cartItem ? cartItem.quantity : 0;

            return (
              <MenuItemCard
                key={dish.id}
                item={dish}
                cartQuantity={qty}
                onAdd={() => {
                  if (dish.customizable) {
                    onOpenCustomization(dish);
                  } else {
                    onAddToCart(dish);
                  }
                }}
                onIncrement={() => {
                  if (dish.customizable) {
                    onOpenCustomization(dish);
                  } else {
                    onUpdateCartItemQty(dish.id, qty + 1);
                  }
                }}
                onDecrement={() => onUpdateCartItemQty(dish.id, qty - 1)}
              />
            );
          })
        )}
      </div>

      {/* FSSAI License Footer */}
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-400 text-[11px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-zinc-500" />
          <span>FSSAI License No. 11223344556677</span>
        </div>
        <span>{restaurant.name} • {restaurant.area}</span>
      </div>
    </div>
  );
};
