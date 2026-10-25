import React, { useState } from 'react';
import { CartItem, Coupon, AVAILABLE_COUPONS } from '../data/orangebiteData';
import { calculateCartAuthoritativePrice } from '../utils/pricingEngine';
import { X, Plus, Minus, Tag, Trash2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  restaurantName: string;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  restaurantName,
  onUpdateQuantity,
  onClearCart,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isOpen) return null;

  const pricing = calculateCartAuthoritativePrice(items, appliedCoupon);

  const handleApplyCustomCoupon = () => {
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find((c) => c.code === code);
    if (!found) {
      setCouponError('Invalid coupon code. Try ORANGE50 or BITE150.');
      return;
    }
    if (pricing.subtotal < found.minOrderValue) {
      setCouponError(`Min order value for ${found.code} is ₹${found.minOrderValue}`);
      return;
    }
    onApplyCoupon(found);
    setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-gradient-to-r from-orange-50/40 to-white">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <span>My Cart</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-[#FC8019] font-black">
                  {pricing.itemCount} items
                </span>
              </h2>
              {restaurantName && items.length > 0 && (
                <p className="text-xs text-zinc-500 font-medium truncate max-w-[260px] mt-0.5">
                  From <span className="font-bold text-zinc-800">{restaurantName}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Clear entire cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Content */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center mb-4 text-4xl shadow-inner">
                🥡
              </div>
              <h3 className="text-base font-bold text-zinc-900">Your cart is empty</h3>
              <p className="text-xs text-zinc-500 max-w-xs mt-1">
                Explore delicious dishes from top rated restaurants and add your favorites!
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-full bg-[#FC8019] hover:bg-[#E86F00] text-white font-bold text-xs shadow-md shadow-orange-500/20"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
              {/* Item List */}
              <div className="space-y-3.5 divide-y divide-zinc-100">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <span
                        className={`mt-1 w-3.5 h-3.5 rounded-xs border flex items-center justify-center shrink-0 ${
                          item.isVeg ? 'border-green-600' : 'border-red-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.isVeg ? 'bg-green-600' : 'bg-red-600'
                          }`}
                        />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
                          {item.name}
                        </div>
                        <div className="text-xs font-semibold text-zinc-600">
                          ₹{item.price}
                        </div>
                        {item.selectedOptions && item.selectedOptions.length > 0 && (
                          <div className="text-[11px] text-zinc-500 mt-0.5 space-x-1">
                            {item.selectedOptions.map((opt) => (
                              <span
                                key={opt.optionId}
                                className="inline-block bg-zinc-100 px-1.5 py-0.5 rounded-md text-[10px] text-zinc-600"
                              >
                                {opt.optionName} {opt.price > 0 && `(+₹${opt.price})`}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-white shadow-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-zinc-500 hover:bg-orange-50 hover:text-[#FC8019] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 py-1 text-xs font-black text-zinc-900 select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-zinc-500 hover:bg-orange-50 hover:text-[#FC8019] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="text-xs sm:text-sm font-bold text-zinc-900 text-right w-14">
                      ₹{item.totalItemPrice}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupons Section */}
              <div className="bg-orange-50/50 rounded-2xl p-3.5 border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-[#FC8019]" />
                  <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                    Coupons & Offers
                  </span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{appliedCoupon.code}</span>
                      </div>
                      <div className="text-[11px] text-emerald-700">
                        Saved ₹{pricing.discount} with this coupon!
                      </div>
                    </div>
                    <button
                      onClick={() => onApplyCoupon(null)}
                      className="text-xs font-bold text-emerald-800 hover:underline uppercase"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-xs uppercase font-bold focus:outline-hidden focus:border-[#FC8019]"
                      />
                      <button
                        onClick={handleApplyCustomCoupon}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FC8019] hover:bg-[#E86F00] text-white text-xs font-bold transition-colors"
                      >
                        Apply
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-[11px] text-red-600 font-medium mt-1.5">
                        {couponError}
                      </p>
                    )}

                    {/* Quick Available Coupons Chips */}
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {AVAILABLE_COUPONS.map((cp) => (
                        <button
                          key={cp.code}
                          onClick={() => {
                            setCouponError(null);
                            if (pricing.subtotal < cp.minOrderValue) {
                              setCouponError(`Min order ₹${cp.minOrderValue} for ${cp.code}`);
                              return;
                            }
                            onApplyCoupon(cp);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white border border-orange-200 hover:border-[#FC8019] text-[11px] font-bold text-[#FC8019] transition-all hover:scale-102"
                        >
                          {cp.code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bill Details */}
              <div className="bg-zinc-50/80 rounded-2xl p-4 border border-zinc-100 space-y-2 text-xs">
                <div className="font-bold text-zinc-900 pb-1 border-b border-zinc-200/80 uppercase tracking-wider text-[11px]">
                  Bill Breakdown
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Item Total</span>
                  <span className="font-semibold text-zinc-900">₹{pricing.subtotal}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Delivery Partner Fee</span>
                  <span className="font-semibold text-zinc-900">
                    {pricing.deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${pricing.deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Restaurant Packaging</span>
                  <span className="font-semibold text-zinc-900">₹{pricing.packagingFee}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Platform Fee</span>
                  <span className="font-semibold text-zinc-900">₹{pricing.platformFee}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>GST & Restaurant Taxes (5%)</span>
                  <span className="font-semibold text-zinc-900">₹{pricing.taxes}</span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-emerald-100">
                    <span>Coupon Discount</span>
                    <span>-₹{pricing.discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-black text-zinc-900 pt-2 border-t border-zinc-200">
                  <span>TO PAY</span>
                  <span className="text-base text-[#FC8019]">₹{pricing.finalTotal}</span>
                </div>
              </div>

              {/* Guaranteed Freshness Notice */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-orange-50/40 text-[11px] text-zinc-600">
                <ShieldCheck className="w-4 h-4 text-[#FC8019] shrink-0" />
                <span>
                  100% Contactless Delivery & Tamper-Proof Packaging Guaranteed.
                </span>
              </div>
            </div>
          )}

          {/* Checkout Bar */}
          {items.length > 0 && (
            <div className="p-4 bg-white border-t border-zinc-100 shadow-lg">
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#FC8019] hover:bg-[#E86F00] text-white font-bold text-sm shadow-md shadow-orange-500/25 flex items-center justify-between transition-transform active:scale-98"
              >
                <div className="text-left">
                  <span className="text-[10px] text-orange-100 uppercase tracking-wider block">
                    Total Payable
                  </span>
                  <span className="text-base font-black">₹{pricing.finalTotal}</span>
                </div>
                <div className="flex items-center gap-1.5 font-extrabold text-sm">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
