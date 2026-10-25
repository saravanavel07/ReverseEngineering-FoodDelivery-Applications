import React from 'react';
import { Order, CartItem } from '../data/orangebiteData';
import { Clock, Repeat, Star, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface OrdersHistoryViewProps {
  orders: Order[];
  onTrackOrder: (order: Order) => void;
  onReorder: (items: CartItem[], restaurantName: string) => void;
  onOpenReview: (order: Order) => void;
  onBackToHome: () => void;
}

export const OrdersHistoryView: React.FC<OrdersHistoryViewProps> = ({
  orders,
  onTrackOrder,
  onReorder,
  onOpenReview,
  onBackToHome,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-black text-zinc-900">Past Orders</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            View all your previous deliveries, track active orders, or quickly reorder favorites.
          </p>
        </div>
        <button
          onClick={onBackToHome}
          className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
        >
          Explore Restaurants
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200">
          <div className="text-4xl mb-3">🍽️</div>
          <h3 className="text-base font-bold text-zinc-800">No Orders Yet</h3>
          <p className="text-xs text-zinc-500 mt-1">
            When you order your favorite dishes, they will show up here.
          </p>
          <button
            onClick={onBackToHome}
            className="mt-4 px-6 py-2.5 rounded-full bg-[#FC8019] text-white font-bold text-xs shadow-md"
          >
            Order Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => {
            const isDelivered = ord.orderStatus === 'DELIVERED';
            const isCancelled = ord.orderStatus === 'CANCELLED';
            const isActive = !isDelivered && !isCancelled;

            return (
              <div
                key={ord.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/80 shadow-xs hover:border-orange-200 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-zinc-900">{ord.restaurantName}</h3>
                    <p className="text-xs text-zinc-500">{ord.restaurantArea}</p>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      Order #{ord.orderNumber} • {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black uppercase px-2.5 py-1 rounded-xl flex items-center gap-1 ${
                        isDelivered
                          ? 'bg-emerald-50 text-emerald-700'
                          : isCancelled
                          ? 'bg-red-50 text-red-600'
                          : 'bg-orange-50 text-[#FC8019] animate-pulse'
                      }`}
                    >
                      {isDelivered && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isCancelled && <XCircle className="w-3.5 h-3.5" />}
                      {isActive && <Clock className="w-3.5 h-3.5" />}
                      <span>{ord.orderStatus.replace(/_/g, ' ')}</span>
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="text-xs text-zinc-700 space-y-1">
                  {ord.items.map((i) => (
                    <div key={i.id} className="flex justify-between">
                      <span>
                        {i.quantity} x {i.name}
                      </span>
                      <span className="font-semibold text-zinc-900">₹{i.totalItemPrice}</span>
                    </div>
                  ))}
                </div>

                {/* Bill total & Actions */}
                <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">Total Paid:</span>
                    <span className="font-black text-sm text-[#FC8019]">₹{ord.totalAmount}</span>
                    <span className="text-[10px] text-zinc-400">({ord.paymentMethod})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <button
                        onClick={() => onTrackOrder(ord)}
                        className="px-4 py-2 rounded-xl bg-[#FC8019] hover:bg-[#E86F00] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20"
                      >
                        <span>Live Tracking</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => onReorder(ord.items, ord.restaurantName)}
                          className="px-4 py-2 rounded-xl border border-zinc-200 hover:border-[#FC8019] text-zinc-800 hover:text-[#FC8019] font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Repeat className="w-3.5 h-3.5" />
                          <span>Reorder</span>
                        </button>
                        {isDelivered && (
                          <button
                            onClick={() => onOpenReview(ord)}
                            className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FC8019] font-bold text-xs flex items-center gap-1.5"
                          >
                            <Star className="w-3.5 h-3.5 fill-[#FC8019]" />
                            <span>Rate Food</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
