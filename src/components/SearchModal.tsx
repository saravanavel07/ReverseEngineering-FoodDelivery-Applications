import React, { useState } from 'react';
import { Restaurant, MenuItem } from '../data/orangebiteData';
import { Search, X, Star, Clock } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onSelectDish: (restaurant: Restaurant, dish: MenuItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  restaurants,
  onSelectRestaurant,
  onSelectDish,
}) => {
  const [query, setQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Find matching restaurants
  const matchedRestaurants = trimmed
    ? restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(trimmed) ||
          r.cuisines.some((c) => c.toLowerCase().includes(trimmed)) ||
          r.area.toLowerCase().includes(trimmed)
      )
    : [];

  // Find matching dishes across all restaurants
  const matchedDishes: { restaurant: Restaurant; dish: MenuItem }[] = [];
  if (trimmed) {
    restaurants.forEach((rest) => {
      rest.menu.forEach((dish) => {
        if (vegOnly && !dish.isVeg) return;
        if (
          dish.name.toLowerCase().includes(trimmed) ||
          dish.description.toLowerCase().includes(trimmed) ||
          dish.category.toLowerCase().includes(trimmed)
        ) {
          matchedDishes.push({ restaurant: rest, dish });
        }
      });
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 sm:pt-20 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#FC8019] shrink-0" />
          <input
            type="text"
            placeholder="Search for biryani, pizza, burgers, or restaurants..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 text-sm sm:text-base font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-zinc-400 hover:bg-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100"
          >
            Cancel
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-5 py-2.5 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="accent-green-600 rounded"
            />
            <span className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-600" />
              <span>Veg Only Filter</span>
            </span>
          </label>

          <span className="text-[11px] text-zinc-400">
            {trimmed ? `${matchedDishes.length} dishes, ${matchedRestaurants.length} restaurants found` : 'Popular: Biryani, Pizza, Dosa'}
          </span>
        </div>

        {/* Search Results */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {!trimmed ? (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-3">
                Trending Cuisines
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Biryani', 'Pizzas & Italian', 'South Indian', 'Burgers & Fries', 'Chinese & Wok', 'North Indian'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FC8019] text-xs font-bold transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Restaurants Matching */}
              {matchedRestaurants.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-3">
                    Restaurants ({matchedRestaurants.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {matchedRestaurants.map((rest) => (
                      <div
                        key={rest.id}
                        onClick={() => {
                          onSelectRestaurant(rest);
                          onClose();
                        }}
                        className="p-3 rounded-2xl border border-zinc-200 hover:border-orange-300 flex items-center gap-3 cursor-pointer transition-all hover:bg-orange-50/30"
                      >
                        <img
                          src={rest.image}
                          alt={rest.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold text-zinc-900 truncate">{rest.name}</h5>
                          <p className="text-[11px] text-zinc-500 truncate">{rest.cuisines.join(', ')}</p>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-semibold mt-0.5">
                            <span className="text-emerald-700 font-bold">★ {rest.rating}</span>
                            <span>•</span>
                            <span>{rest.deliveryTimeMins} mins</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dishes Matching */}
              {matchedDishes.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-3">
                    Dishes ({matchedDishes.length})
                  </h4>
                  <div className="space-y-2">
                    {matchedDishes.map(({ restaurant, dish }) => (
                      <div
                        key={`${restaurant.id}-${dish.id}`}
                        onClick={() => {
                          onSelectDish(restaurant, dish);
                          onClose();
                        }}
                        className="p-3 rounded-2xl border border-zinc-200 hover:border-orange-300 flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-orange-50/20"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center shrink-0 ${
                              dish.isVeg ? 'border-green-600' : 'border-red-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                dish.isVeg ? 'bg-green-600' : 'bg-red-600'
                              }`}
                            />
                          </span>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-zinc-900 truncate">{dish.name}</h5>
                            <p className="text-[10px] text-zinc-400 truncate">
                              at <span className="font-semibold text-zinc-600">{restaurant.name}</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-zinc-900 block">₹{dish.price}</span>
                          <span className="text-[10px] font-bold text-[#FC8019]">View Dish →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedRestaurants.length === 0 && matchedDishes.length === 0 && (
                <div className="py-12 text-center text-zinc-400 text-xs">
                  No food or restaurants found for "{query}". Try checking your spelling or search another dish.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
