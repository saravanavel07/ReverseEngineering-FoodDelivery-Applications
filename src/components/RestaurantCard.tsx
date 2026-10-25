import React from 'react';
import { Restaurant } from '../data/orangebiteData';
import { Star, Clock, MapPin } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-3xl border border-zinc-200/80 hover:border-orange-300 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Image & Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-100">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Discount badge */}
        {restaurant.discountBadge && (
          <div className="absolute top-3 left-3 bg-[#FC8019] text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl shadow-md">
            {restaurant.discountBadge}
          </div>
        )}

        {/* Veg Only Badge if applicable */}
        {restaurant.isVegOnly && (
          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>Pure Veg</span>
          </div>
        )}

        {/* Delivery Time & Distance on Bottom of Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold drop-shadow-sm">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            <span>{restaurant.deliveryTimeMins} mins</span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>{restaurant.distanceKm} km</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-base sm:text-lg text-zinc-900 group-hover:text-[#FC8019] transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            {/* Rating Pill */}
            <div className="flex items-center gap-1 bg-emerald-700 text-white px-2 py-0.5 rounded-lg text-xs font-bold shrink-0">
              <Star className="w-3 h-3 fill-white" />
              <span>{restaurant.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Cuisines */}
          <p className="text-xs text-zinc-500 font-medium truncate mt-1">
            {restaurant.cuisines.join(', ')}
          </p>
        </div>

        {/* Area & Cost for Two */}
        <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600 font-medium">
          <span className="truncate max-w-[140px] text-zinc-500">{restaurant.area}</span>
          <span className="font-bold text-zinc-800">₹{restaurant.costForTwo} for two</span>
        </div>
      </div>
    </div>
  );
};
