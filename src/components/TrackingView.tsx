import React, { useState, useEffect } from 'react';
import { Order } from '../data/orangebiteData';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Bike,
  ChefHat,
  PackageCheck,
  Building,
  Home,
  AlertCircle,
  Play,
  RotateCcw,
  Star,
  Receipt,
  XCircle,
} from 'lucide-react';

interface TrackingViewProps {
  order: Order;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['orderStatus']) => void;
  onBackToHome: () => void;
  onOpenReview: (order: Order) => void;
}

const STAGES: {
  status: Order['orderStatus'];
  title: string;
  subtitle: string;
  icon: any;
  color: string;
}[] = [
  {
    status: 'PLACED',
    title: 'Order Placed',
    subtitle: 'We have received your order snapshot and verified payment.',
    icon: Receipt,
    color: '#FC8019',
  },
  {
    status: 'ACCEPTED',
    title: 'Restaurant Accepted',
    subtitle: 'Kitchen has accepted your order and begun planning preparation.',
    icon: Building,
    color: '#FC8019',
  },
  {
    status: 'PREPARING',
    title: 'Preparing Fresh Food',
    subtitle: 'Master chefs are handcrafting your dishes with fresh ingredients.',
    icon: ChefHat,
    color: '#E86F00',
  },
  {
    status: 'READY',
    title: 'Order Packed & Ready',
    subtitle: 'Tamper-evident heat sealed packaging completed.',
    icon: PackageCheck,
    color: '#FC8019',
  },
  {
    status: 'OUT_FOR_DELIVERY',
    title: 'Out for Delivery',
    subtitle: 'Delivery partner is on the way to your doorstep on two-wheeler.',
    icon: Bike,
    color: '#16803C',
  },
  {
    status: 'DELIVERED',
    title: 'Delivered Fresh & Hot',
    subtitle: 'Order successfully delivered. Enjoy your OrangeBite meal!',
    icon: CheckCircle2,
    color: '#16803C',
  },
];

export const TrackingView: React.FC<TrackingViewProps> = ({
  order,
  onUpdateOrderStatus,
  onBackToHome,
  onOpenReview,
}) => {
  const [autoSimulate, setAutoSimulate] = useState(false);
  const currentStageIndex = STAGES.findIndex((s) => s.status === order.orderStatus);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoSimulate && order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'CANCELLED') {
      timer = setTimeout(() => {
        const nextIndex = currentStageIndex + 1;
        if (nextIndex < STAGES.length) {
          onUpdateOrderStatus(order.id, STAGES[nextIndex].status);
        } else {
          setAutoSimulate(false);
        }
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [autoSimulate, currentStageIndex, order.orderStatus, order.id, onUpdateOrderStatus]);

  const handleAdvanceStep = () => {
    if (currentStageIndex < STAGES.length - 1) {
      onUpdateOrderStatus(order.id, STAGES[currentStageIndex + 1].status);
    }
  };

  const handleCancelOrder = () => {
    if (currentStageIndex <= 1) {
      // Allowed before food starts cooking
      onUpdateOrderStatus(order.id, 'CANCELLED');
    }
  };

  const canCancel = currentStageIndex <= 1 && order.orderStatus !== 'CANCELLED';

  // Calculate route bike position percentage
  const bikeProgress =
    order.orderStatus === 'CANCELLED'
      ? 0
      : Math.min(100, Math.round(((currentStageIndex + 1) / STAGES.length) * 100));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-[#FC8019] tracking-wider">
                Live Order Tracking
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">
              {order.orderStatus === 'DELIVERED'
                ? 'Order Delivered!'
                : order.orderStatus === 'CANCELLED'
                ? 'Order Cancelled'
                : 'Arriving in 25-30 mins'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Order ID: <span className="font-mono font-bold text-zinc-800">{order.orderNumber}</span> • {order.restaurantName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToHome}
              className="px-4 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-bold text-zinc-700 transition-colors"
            >
              Back to Home
            </button>
            {order.orderStatus === 'DELIVERED' && (
              <button
                onClick={() => onOpenReview(order)}
                className="px-4 py-2 rounded-xl bg-[#FC8019] hover:bg-[#E86F00] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20"
              >
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>Rate Food</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Route Map Simulation */}
        <div className="mt-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-orange-50/70 via-amber-50/50 to-orange-50/70 border border-orange-200/80">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 mb-2">
            <div className="flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#FC8019]" />
              <span>{order.restaurantName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Home className="w-4 h-4 text-emerald-600" />
              <span>{order.address.title}</span>
            </div>
          </div>

          {/* Progress Route Bar */}
          <div className="relative w-full h-3 bg-zinc-200/80 rounded-full overflow-visible my-5">
            <div
              className="h-full bg-gradient-to-r from-[#FC8019] to-[#E86F00] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${bikeProgress}%` }}
            />
            {/* Delivery Bike Icon moving along track */}
            <div
              className="absolute -top-3.5 w-10 h-10 rounded-full bg-white shadow-lg border-2 border-[#FC8019] flex items-center justify-center transition-all duration-700 ease-out transform -translate-x-1/2"
              style={{ left: `${bikeProgress}%` }}
            >
              <Bike className="w-5 h-5 text-[#FC8019]" />
            </div>
          </div>

          {/* Delivery Partner Details Card */}
          {order.deliveryPartner && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-orange-200/60 mt-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FC8019] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {order.deliveryPartner.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-zinc-900 flex items-center gap-2">
                    <span>{order.deliveryPartner.name}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-black flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-emerald-800" />
                      <span>{order.deliveryPartner.rating}</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono">
                    {order.deliveryPartner.vehicleNumber} (Electric Scooter)
                  </div>
                </div>
              </div>

              <a
                href={`tel:${order.deliveryPartner.phone}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-zinc-200 hover:border-[#FC8019] text-zinc-800 font-bold text-xs shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-[#FC8019]" />
                <span>Call Delivery Partner</span>
              </a>
            </div>
          )}
        </div>

        {/* Development Demo Mode Controls */}
        <div className="mt-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-bold text-zinc-700">
              Demo Simulation Controller:
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'CANCELLED' && (
              <>
                <button
                  onClick={handleAdvanceStep}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
                >
                  Advance Step →
                </button>
                <button
                  onClick={() => setAutoSimulate(!autoSimulate)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
                    autoSimulate
                      ? 'bg-orange-100 border-[#FC8019] text-[#FC8019]'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  <span>{autoSimulate ? 'Pause Auto Sim' : 'Auto Simulate'}</span>
                </button>
              </>
            )}

            {canCancel && (
              <button
                onClick={handleCancelOrder}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold border border-red-200 transition-colors"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stage-by-Stage Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-md">
        <h2 className="text-lg font-black text-zinc-900 mb-6">Order Timeline & History</h2>

        <div className="space-y-6 relative before:absolute before:top-3 before:bottom-3 before:left-5 before:w-0.5 before:bg-zinc-200">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx <= currentStageIndex && order.orderStatus !== 'CANCELLED';
            const isCurrent = idx === currentStageIndex && order.orderStatus !== 'CANCELLED';
            const Icon = stage.icon;

            return (
              <div key={stage.status} className="relative flex items-start gap-4 pl-12">
                {/* Status Dot / Icon */}
                <div
                  className={`absolute left-2.5 w-6 h-6 rounded-full -translate-x-1/2 flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-[#FC8019] text-white ring-4 ring-orange-100 ring-offset-1'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-100 border border-zinc-300 text-zinc-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm font-bold ${
                        isCurrent
                          ? 'text-[#FC8019] font-black'
                          : isCompleted
                          ? 'text-zinc-900'
                          : 'text-zinc-400'
                      }`}
                    >
                      {stage.title}
                    </h3>
                    {isCurrent && (
                      <span className="text-[10px] bg-orange-100 text-[#FC8019] px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{stage.subtitle}</p>
                </div>
              </div>
            );
          })}

          {order.orderStatus === 'CANCELLED' && (
            <div className="relative flex items-start gap-4 pl-12">
              <div className="absolute left-2.5 w-6 h-6 rounded-full -translate-x-1/2 bg-red-600 text-white flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-red-600">Order Cancelled</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Order was cancelled. 100% refund has been credited back to your original payment method.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Items in this Order */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-md">
        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4">
          Order Items ({order.items.length})
        </h3>
        <div className="divide-y divide-zinc-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-xs border flex items-center justify-center ${
                    item.isVeg ? 'border-green-600' : 'border-red-600'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.isVeg ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  />
                </span>
                <span className="font-bold text-zinc-800">
                  {item.quantity} x {item.name}
                </span>
              </div>
              <span className="font-semibold text-zinc-900">₹{item.totalItemPrice}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-sm font-black text-zinc-900">
          <span>Total Paid (via {order.paymentMethod})</span>
          <span className="text-base text-[#FC8019]">₹{order.totalAmount}</span>
        </div>
      </div>
    </div>
  );
};
