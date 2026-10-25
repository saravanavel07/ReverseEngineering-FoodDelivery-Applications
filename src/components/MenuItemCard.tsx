import React from 'react';
import { MenuItem } from '../data/orangebiteData';
import { Star, Plus, Minus } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  cartQuantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  cartQuantity,
  onAdd,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className="flex items-start justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 hover:border-orange-200 transition-all shadow-2xs hover:shadow-md">
      {/* Left side details */}
      <div className="flex-1 min-w-0 pr-2">
        {/* Indicators */}
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {/* Veg / Non-Veg Icon */}
          <span
            className={`w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 ${
              item.isVeg ? 'border-green-600' : 'border-red-600'
            }`}
            title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                item.isVeg ? 'bg-green-600' : 'bg-red-600'
              }`}
            />
          </span>

          {item.isBestseller && (
            <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-md uppercase tracking-wider">
              ⭐ Bestseller
            </span>
          )}

          {item.rating > 0 && (
            <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              <Star className="w-3 h-3 fill-emerald-700 text-emerald-700" />
              <span>{item.rating.toFixed(1)}</span>
              <span className="text-zinc-400 font-normal">({item.ratingCount})</span>
            </span>
          )}
        </div>

        {/* Dish Name */}
        <h4 className="font-extrabold text-sm sm:text-base text-zinc-900 leading-snug">
          {item.name}
        </h4>

        {/* Price */}
        <div className="text-sm font-black text-zinc-900 mt-1">
          ₹{item.price}
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {item.customizable && (
          <span className="inline-block text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mt-2">
            Customisable
          </span>
        )}
      </div>

      {/* Right side image & Add button */}
      <div className="relative shrink-0 flex flex-col items-center">
        <div className="w-28 sm:w-32 h-24 sm:h-28 rounded-2xl overflow-hidden bg-zinc-100 shadow-inner">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Add Button pinned over bottom */}
        <div className="-mt-4 shadow-lg rounded-xl z-10">
          {!item.inStock ? (
            <div className="px-3 py-1.5 bg-zinc-100 border border-zinc-200 text-zinc-400 text-xs font-bold rounded-xl select-none">
              Sold Out
            </div>
          ) : cartQuantity > 0 ? (
            <div className="flex items-center bg-white border border-[#FC8019] rounded-xl overflow-hidden text-[#FC8019] font-black text-xs shadow-md">
              <button
                onClick={onDecrement}
                className="px-2.5 py-1.5 hover:bg-orange-50 transition-colors"
                title="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 py-1 select-none text-zinc-900">{cartQuantity}</span>
              <button
                onClick={onIncrement}
                className="px-2.5 py-1.5 hover:bg-orange-50 transition-colors"
                title="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="px-6 py-1.5 bg-white hover:bg-orange-50 border border-zinc-300 hover:border-[#FC8019] text-[#FC8019] font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs active:scale-95"
            >
              Add
              {item.customizable && <span className="text-[9px] block text-zinc-400 font-normal lowercase">+customise</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
