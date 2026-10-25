import React, { useState } from 'react';
import { Restaurant, Order, AVAILABLE_COUPONS } from '../data/orangebiteData';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Store,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  ToggleLeft,
  ToggleRight,
  ArrowUpRight,
  ChefHat,
  Bike,
} from 'lucide-react';

interface AdminDashboardProps {
  restaurants: Restaurant[];
  orders: Order[];
  onToggleItemStock: (restaurantId: string, menuItemId: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['orderStatus']) => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  restaurants,
  orders,
  onToggleItemStock,
  onUpdateOrderStatus,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'coupons'>('overview');
  const [selectedRestFilter, setSelectedRestFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Authoritative admin metrics derived from seeded & runtime orders
  const totalGMV = orders.reduce((sum, o) => sum + (o.paymentStatus === 'COMPLETED' ? o.totalAmount : 0), 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalGMV / totalOrdersCount) : 0;
  const activeRestCount = restaurants.filter((r) => r.isOpen).length;

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (selectedRestFilter !== 'all' && o.restaurantId !== selectedRestFilter) return false;
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase text-[#FC8019] tracking-wider">
              OrangeBite Operations Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">
            Administrator & Restaurant Console
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Authorized management dashboard for order processing, inventory controls, and platform revenue telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
          >
            ← Back to Storefront
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-200 gap-2 sm:gap-6 overflow-x-auto text-xs sm:text-sm font-bold">
        {[
          { id: 'overview', label: 'Analytics & KPIs', icon: TrendingUp },
          { id: 'orders', label: `Live Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'inventory', label: 'Menu & Stock Controls', icon: Store },
          { id: 'coupons', label: 'Coupons & Promos', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
                isActive
                  ? 'border-[#FC8019] text-[#FC8019]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview Analytics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-bold uppercase tracking-wider">Gross Sales (GMV)</span>
                <span className="p-2 rounded-xl bg-orange-50 text-[#FC8019]">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-900 mt-2">
                ₹{totalGMV.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>+18.4% vs last week</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <ShoppingBag className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-900 mt-2">
                {totalOrdersCount}
              </div>
              <div className="text-[11px] text-zinc-400 font-medium mt-1">
                Across all active outlets
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value</span>
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-900 mt-2">
                ₹{avgOrderValue}
              </div>
              <div className="text-[11px] text-zinc-400 font-medium mt-1">
                Per successful customer order
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-zinc-200/80 shadow-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-bold uppercase tracking-wider">Active Outlets</span>
                <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Store className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-zinc-900 mt-2">
                {activeRestCount} / {restaurants.length}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">
                100% kitchen SLA compliance
              </div>
            </div>
          </div>

          {/* Quick Restaurant Performance Grid */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs">
            <h2 className="text-base font-black text-zinc-900 mb-4">
              Restaurant Kitchen Performance & Volume
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-400 uppercase tracking-wider">
                    <th className="pb-3 font-bold">Restaurant Outlet</th>
                    <th className="pb-3 font-bold">Location</th>
                    <th className="pb-3 font-bold">Avg Rating</th>
                    <th className="pb-3 font-bold">Delivery SLA</th>
                    <th className="pb-3 font-bold">Menu Count</th>
                    <th className="pb-3 font-bold">Kitchen Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {restaurants.map((rest) => (
                    <tr key={rest.id} className="hover:bg-zinc-50">
                      <td className="py-3 font-bold text-zinc-900 flex items-center gap-2">
                        <img
                          src={rest.image}
                          alt={rest.name}
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <span>{rest.name}</span>
                      </td>
                      <td className="py-3 text-zinc-600">{rest.area}</td>
                      <td className="py-3 font-bold text-emerald-700">★ {rest.rating}</td>
                      <td className="py-3 text-zinc-600">{rest.deliveryTimeMins} mins</td>
                      <td className="py-3 text-zinc-600">{rest.menu.length} items</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase">
                          Online & Accepting
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Orders Manager */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-black text-zinc-900">
              Live Order Pipeline & State Machine
            </h2>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-zinc-50 border border-zinc-200 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="PLACED">Placed</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="PREPARING">Preparing</option>
                <option value="READY">Ready</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-xs">
                No orders matching filter.
              </div>
            ) : (
              filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 sm:p-5 rounded-2xl border border-zinc-200/80 hover:border-orange-200 bg-white transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-zinc-900 text-sm">
                          {ord.orderNumber}
                        </span>
                        <span className="text-xs text-zinc-500">• {ord.restaurantName}</span>
                      </div>
                      <span className="text-[11px] text-zinc-400">
                        {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Deliver to {ord.address.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#FC8019]">₹{ord.totalAmount}</span>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                        {ord.paymentMethod} • {ord.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-zinc-600 space-x-2">
                    {ord.items.map((i) => (
                      <span key={i.id} className="inline-block bg-zinc-50 border border-zinc-100 px-2 py-1 rounded-md">
                        {i.quantity}x {i.name}
                      </span>
                    ))}
                  </div>

                  {/* Status update controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-zinc-400 font-semibold">Current State:</span>
                      <span className="font-black text-[#FC8019] bg-orange-50 px-2.5 py-0.5 rounded-lg text-[11px]">
                        {ord.orderStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-zinc-400 mr-1">Move to:</span>
                      {(['ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => onUpdateOrderStatus(ord.id, st)}
                          disabled={ord.orderStatus === st}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                            ord.orderStatus === st
                              ? 'bg-zinc-200 text-zinc-400 border-transparent cursor-not-allowed'
                              : 'bg-white border-zinc-200 hover:border-[#FC8019] text-zinc-700 hover:text-[#FC8019]'
                          }`}
                        >
                          {st.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Inventory Controls */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-zinc-900">
                Menu Items & Stock Availability
              </h2>
              <p className="text-xs text-zinc-500">
                Real-time stock toggling for instant customer menu reflection.
              </p>
            </div>

            <select
              value={selectedRestFilter}
              onChange={(e) => setSelectedRestFilter(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-hidden"
            >
              <option value="all">All Restaurants</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-6">
            {restaurants
              .filter((r) => selectedRestFilter === 'all' || r.id === selectedRestFilter)
              .map((rest) => (
                <div key={rest.id} className="border border-zinc-200 rounded-2xl p-4 sm:p-5">
                  <h3 className="font-extrabold text-sm text-zinc-900 mb-3 flex items-center justify-between">
                    <span>{rest.name}</span>
                    <span className="text-xs font-normal text-zinc-500">{rest.menu.length} dishes</span>
                  </h3>

                  <div className="divide-y divide-zinc-100">
                    {rest.menu.map((dish) => (
                      <div
                        key={dish.id}
                        className="py-2.5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
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
                          <div>
                            <span className="font-bold text-zinc-800">{dish.name}</span>
                            <span className="text-zinc-400 text-[11px] ml-2">₹{dish.price}</span>
                          </div>
                        </div>

                        {/* In stock toggle */}
                        <button
                          onClick={() => onToggleItemStock(rest.id, dish.id)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-xs transition-colors ${
                            dish.inStock
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
                          }`}
                        >
                          {dish.inStock ? (
                            <>
                              <ToggleRight className="w-4 h-4 text-emerald-600" />
                              <span>In Stock</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-4 h-4" />
                              <span>Sold Out</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 4: Coupons & Promos */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-black text-zinc-900">
            Promotional Engine & Discount Rules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AVAILABLE_COUPONS.map((cp) => (
              <div
                key={cp.code}
                className="p-5 rounded-2xl border border-orange-200 bg-orange-50/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-base text-[#FC8019] bg-white px-2.5 py-1 rounded-lg border border-orange-200">
                    {cp.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-xs text-zinc-700 font-medium">{cp.description}</p>
                <div className="pt-2 border-t border-orange-100 flex justify-between text-[11px] text-zinc-500">
                  <span>Min Order: ₹{cp.minOrderValue}</span>
                  {cp.maxDiscount && <span>Max Cap: ₹{cp.maxDiscount}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
