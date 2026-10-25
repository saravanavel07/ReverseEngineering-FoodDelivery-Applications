import React, { useState } from 'react';
import { Address, CartItem, Coupon, Order } from '../data/orangebiteData';
import { calculateCartAuthoritativePrice } from '../utils/pricingEngine';
import {
  X,
  MapPin,
  Plus,
  CreditCard,
  QrCode,
  Banknote,
  Building,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  restaurantId: string;
  restaurantName: string;
  restaurantArea: string;
  appliedCoupon: Coupon | null;
  savedAddresses: Address[];
  onAddNewAddress: (address: Address) => void;
  onOrderPlaced: (newOrder: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  restaurantId,
  restaurantName,
  restaurantArea,
  appliedCoupon,
  savedAddresses,
  onAddNewAddress,
  onOrderPlaced,
}) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    savedAddresses[0]?.id || ''
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddrType, setNewAddrType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newAddrTitle, setNewAddrTitle] = useState('');
  const [newAddrLine, setNewAddrLine] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('+91 98765 43210');

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD' | 'Netbanking'>('UPI');
  const [upiId, setUpiId] = useState('customer@oksbi');
  const [deliveryInstruction, setDeliveryInstruction] = useState('Ring bell once');

  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const pricing = calculateCartAuthoritativePrice(items, appliedCoupon);
  const currentAddress =
    savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLine || !newAddrTitle) return;
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      type: newAddrType,
      title: newAddrTitle,
      addressLine: newAddrLine,
      contactNumber: newAddrPhone,
    };
    onAddNewAddress(newAddr);
    setSelectedAddressId(newAddr.id);
    setShowNewAddressForm(false);
    setNewAddrTitle('');
    setNewAddrLine('');
  };

  const handleProcessOrder = () => {
    setIsProcessing(true);

    // Simulate safe server-side payment processing and atomic transaction
    setTimeout(() => {
      const orderNum = `OB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        restaurantId,
        restaurantName,
        restaurantArea,
        items: [...items],
        subtotal: pricing.subtotal,
        deliveryFee: pricing.deliveryFee,
        packagingFee: pricing.packagingFee,
        platformFee: pricing.platformFee,
        taxes: pricing.taxes,
        discount: pricing.discount,
        totalAmount: pricing.finalTotal,
        couponCode: appliedCoupon?.code,
        address: currentAddress,
        paymentMethod,
        paymentStatus: 'COMPLETED',
        orderStatus: 'PLACED',
        createdAt: new Date().toISOString(),
        estimatedDeliveryTime: '28-35 mins',
        deliveryPartner: {
          name: 'Vikram Singh',
          phone: '+91 98452 87654',
          rating: 4.8,
          vehicleNumber: 'KA-05-MH-2034',
        },
      };

      setIsProcessing(false);
      onOrderPlaced(newOrder);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-gradient-to-r from-orange-50/60 to-white">
          <div>
            <span className="text-[10px] font-black text-[#FC8019] uppercase tracking-wider">
              Safe & Secure Checkout
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900">
              Confirm Your Food Order
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Step 1: Delivery Address */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FC8019]" />
                <span>1. Select Delivery Address</span>
              </h3>
              {!showNewAddressForm && (
                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className="text-xs font-bold text-[#FC8019] hover:text-[#E86F00] flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              )}
            </div>

            {showNewAddressForm ? (
              <form onSubmit={handleSaveAddress} className="p-4 rounded-2xl bg-orange-50/40 border border-orange-200 space-y-3">
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewAddrType(type)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        newAddrType === type
                          ? 'bg-[#FC8019] text-white shadow-xs'
                          : 'bg-white text-zinc-700 border border-zinc-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Address Title (e.g. Flat 301, Sunshine Heights)"
                  value={newAddrTitle}
                  onChange={(e) => setNewAddrTitle(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:border-[#FC8019]"
                  required
                />
                <textarea
                  placeholder="Full Street Address & Landmark"
                  value={newAddrLine}
                  onChange={(e) => setNewAddrLine(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:border-[#FC8019]"
                  rows={2}
                  required
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#FC8019] hover:bg-[#E86F00] text-white text-xs font-bold shadow-xs"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#FC8019] bg-orange-50/50 shadow-xs ring-1 ring-[#FC8019]'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black uppercase text-zinc-800 flex items-center gap-1.5">
                          <span>{addr.type === 'Home' ? '🏠' : addr.type === 'Work' ? '🏢' : '📍'}</span>
                          <span>{addr.type}</span>
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FC8019]" />}
                      </div>
                      <p className="text-xs font-bold text-zinc-900 line-clamp-1">{addr.title}</p>
                      <p className="text-[11px] text-zinc-500 line-clamp-2 mt-0.5">{addr.addressLine}</p>
                      <p className="text-[10px] text-zinc-400 mt-1 font-medium">{addr.contactNumber}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Delivery Instructions */}
          <div>
            <label className="text-xs font-bold text-zinc-800 block mb-1.5">
              Delivery Instructions (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Ring bell once',
                'Leave at security gate',
                'Do not ring bell (Pet inside)',
                'Leave with neighbor',
              ].map((inst) => (
                <button
                  key={inst}
                  type="button"
                  onClick={() => setDeliveryInstruction(inst)}
                  className={`text-[11px] px-3 py-1.5 rounded-xl border transition-all ${
                    deliveryInstruction === inst
                      ? 'border-[#FC8019] bg-orange-50 text-[#FC8019] font-bold'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 bg-white'
                  }`}
                >
                  {inst}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-[#FC8019]" />
              <span>2. Choose Payment Mode (Demo Simulator)</span>
            </h3>

            <div className="space-y-2">
              {/* UPI */}
              <label
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-[#FC8019] bg-orange-50/50 ring-1 ring-[#FC8019]'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-[#FC8019]">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                      <span>UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-black">
                        Instant
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Simulated 1-click test UPI gateway
                    </div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="accent-[#FC8019]"
                />
              </label>

              {/* Card */}
              <label
                onClick={() => setPaymentMethod('Card')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'Card'
                    ? 'border-[#FC8019] bg-orange-50/50 ring-1 ring-[#FC8019]'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900">
                      Credit / Debit Card (Visa, MasterCard, RuPay)
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Safe simulated sandbox tokenization
                    </div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Card'}
                  onChange={() => setPaymentMethod('Card')}
                  className="accent-[#FC8019]"
                />
              </label>

              {/* Netbanking */}
              <label
                onClick={() => setPaymentMethod('Netbanking')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'Netbanking'
                    ? 'border-[#FC8019] bg-orange-50/50 ring-1 ring-[#FC8019]'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900">Net Banking</div>
                    <div className="text-[11px] text-zinc-500">HDFC, ICICI, SBI, Axis, Kotak</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Netbanking'}
                  onChange={() => setPaymentMethod('Netbanking')}
                  className="accent-[#FC8019]"
                />
              </label>

              {/* Cash On Delivery */}
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-[#FC8019] bg-orange-50/50 ring-1 ring-[#FC8019]'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900">
                      Cash on Delivery (Pay on Arrival)
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Pay via Cash or QR scan at doorstep
                    </div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="accent-[#FC8019]"
                />
              </label>
            </div>
          </div>

          {/* Order Summary & Authoritative Bill */}
          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 space-y-2 text-xs">
            <div className="font-bold text-zinc-900 pb-1 border-b border-zinc-200">
              Receipt Snapshot ({pricing.itemCount} items from {restaurantName})
            </div>
            <div className="space-y-1">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-zinc-600">
                  <span className="truncate pr-2">
                    {i.quantity}x {i.name}
                  </span>
                  <span className="font-semibold text-zinc-900 shrink-0">₹{i.totalItemPrice}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-200 space-y-1">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span>₹{pricing.subtotal}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Delivery & Packaging</span>
                <span>₹{pricing.deliveryFee + pricing.packagingFee + pricing.platformFee}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Taxes (5% GST)</span>
                <span>₹{pricing.taxes}</span>
              </div>
              {pricing.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{pricing.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-zinc-900 pt-1 border-t border-zinc-300">
                <span>Total Amount to Pay</span>
                <span className="text-[#FC8019] text-base">₹{pricing.finalTotal}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Place Order Button */}
        <div className="p-4 bg-white border-t border-zinc-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">100% Secure Encrypted Transaction</span>
          </div>

          <button
            onClick={handleProcessOrder}
            disabled={isProcessing}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#FC8019] hover:bg-[#E86F00] text-white font-extrabold text-sm shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-70"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Order & Payment...</span>
              </>
            ) : (
              <>
                <span>Pay ₹{pricing.finalTotal} & Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
