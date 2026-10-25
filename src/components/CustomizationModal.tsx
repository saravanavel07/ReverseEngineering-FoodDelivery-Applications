import React, { useState } from 'react';
import { MenuItem, MenuItemOptionGroup, CartItemOptionSelected } from '../data/orangebiteData';
import { X, Check } from 'lucide-react';

interface CustomizationModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (selectedOptions: CartItemOptionSelected[], totalItemPrice: number) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({ item, onClose, onAddToCart }) => {
  const [selections, setSelections] = useState<{ [groupId: string]: string[] }>(() => {
    const initial: { [groupId: string]: string[] } = {};
    item.optionGroups?.forEach((group) => {
      if (group.required && group.options.length > 0) {
        initial[group.id] = [group.options[0].id];
      } else {
        initial[group.id] = [];
      }
    });
    return initial;
  });

  const handleSelect = (group: MenuItemOptionGroup, optionId: string) => {
    setSelections((prev) => {
      const current = prev[group.id] || [];
      if (group.required) {
        // Radio style (single select)
        return { ...prev, [group.id]: [optionId] };
      } else {
        // Multi select
        const exists = current.includes(optionId);
        const updated = exists ? current.filter((id) => id !== optionId) : [...current, optionId];
        return { ...prev, [group.id]: updated };
      }
    });
  };

  // Calculate total item price
  let additionalCost = 0;
  const flatSelectedOptions: CartItemOptionSelected[] = [];

  item.optionGroups?.forEach((group) => {
    const selectedIds = selections[group.id] || [];
    group.options.forEach((opt) => {
      if (selectedIds.includes(opt.id)) {
        additionalCost += opt.price;
        flatSelectedOptions.push({
          groupId: group.id,
          groupTitle: group.title,
          optionId: opt.id,
          optionName: opt.name,
          price: opt.price,
        });
      }
    });
  });

  const finalPrice = item.price + additionalCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-start justify-between bg-gradient-to-r from-orange-50/50 to-white">
          <div className="pr-6">
            <div className="flex items-center gap-2">
              <span
                className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                  item.isVeg ? 'border-green-600' : 'border-red-600'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.isVeg ? 'bg-green-600' : 'bg-red-600'
                  }`}
                />
              </span>
              <h3 className="text-lg font-bold text-zinc-900 leading-snug">{item.name}</h3>
            </div>
            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{item.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 divide-y divide-zinc-100">
          {item.optionGroups?.map((group) => {
            const selectedIds = selections[group.id] || [];

            return (
              <div key={group.id} className="pt-4 first:pt-0">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-zinc-800 tracking-tight">
                    {group.title}
                  </h4>
                  {group.required ? (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Required
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-400">Optional</span>
                  )}
                </div>

                <div className="space-y-2">
                  {group.options.map((opt) => {
                    const isSelected = selectedIds.includes(opt.id);

                    return (
                      <label
                        key={opt.id}
                        onClick={() => handleSelect(group, opt.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#FC8019] bg-orange-50/60 shadow-xs'
                            : 'border-zinc-200 hover:border-zinc-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-${
                              group.required ? 'full' : 'md'
                            } border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-[#FC8019] bg-[#FC8019] text-white'
                                : 'border-zinc-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-zinc-800">
                            {opt.name}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-zinc-700">
                          {opt.price === 0 ? 'Free' : `+₹${opt.price}`}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-zinc-500 block">Total Item Price</span>
            <span className="text-xl font-black text-zinc-900">₹{finalPrice}</span>
          </div>
          <button
            onClick={() => {
              onAddToCart(flatSelectedOptions, finalPrice);
              onClose();
            }}
            className="flex-1 max-w-xs py-3 px-6 rounded-2xl bg-[#FC8019] hover:bg-[#E86F00] text-white font-bold text-sm shadow-md shadow-orange-500/30 transition-transform active:scale-98"
          >
            Add to Cart (₹{finalPrice})
          </button>
        </div>
      </div>
    </div>
  );
};
