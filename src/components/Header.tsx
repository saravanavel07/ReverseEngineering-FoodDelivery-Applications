import React, { useState } from 'react';
import {
  MapPin,
  Search,
  ShoppingBag,
  User,
  Sparkles,
  ChevronDown,
  Clock,
  LogOut,
} from 'lucide-react';
import { POPULAR_LOCATIONS } from '../data/orangebiteData';

interface HeaderProps {
  currentLocation: string;
  onSelectLocation: (loc: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAdmin?: () => void;
  onOpenDocs?: () => void;
  onOpenAuth: () => void;
  user: { name: string; phone: string } | null;
  onLogout: () => void;
  particlesEnabled: boolean;
  onToggleParticles: () => void;
  activeView: 'home' | 'restaurant' | 'checkout' | 'tracking' | 'admin' | 'docs' | 'orders';
  onNavigateHome: () => void;
  onOpenOrders: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenAdmin,
  onOpenDocs,
  onOpenAuth,
  user,
  onLogout,
  particlesEnabled,
  onToggleParticles,
  activeView,
  onNavigateHome,
  onOpenOrders,
}) => {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3">
          {/* Logo & Location */}
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <button
              onClick={onNavigateHome}
              className="text-left focus:outline-hidden group flex items-center cursor-pointer"
              title="OrangeBite Home"
            >
              <div className="flex items-center text-2xl sm:text-3xl font-extrabold tracking-tight select-none">
                <span className="text-[#FC8019]">Orange</span>
                <span className="text-zinc-900">Bite</span>
              </div>
            </button>

            {/* Location Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-orange-50 border border-zinc-200/80 hover:border-orange-300 transition-all text-xs sm:text-sm font-medium text-zinc-700"
              >
                <MapPin className="w-4 h-4 text-[#FC8019] shrink-0" />
                <span className="truncate max-w-[170px] font-semibold text-zinc-900">
                  {currentLocation}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {showLocationDropdown && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-zinc-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
                    Select Delivery Location
                  </div>
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {POPULAR_LOCATIONS.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => {
                          onSelectLocation(`${loc.name}, ${loc.city}`);
                          setShowLocationDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-between transition-colors ${
                          currentLocation.includes(loc.name)
                            ? 'bg-orange-50 text-[#FC8019] font-bold'
                            : 'hover:bg-zinc-50 text-zinc-700'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{loc.name}</div>
                          <div className="text-[11px] text-zinc-400">{loc.city}</div>
                        </div>
                        {currentLocation.includes(loc.name) && (
                          <span className="w-2 h-2 rounded-full bg-[#FC8019]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-zinc-100/80 hover:bg-orange-50 border border-transparent hover:border-orange-200 text-zinc-600 hover:text-[#FC8019] transition-all text-xs sm:text-sm font-medium"
              title="Search dishes & restaurants"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>

            {/* Particle Canvas Animation Toggle */}
            <button
              onClick={onToggleParticles}
              className={`p-2 rounded-full border transition-all ${
                particlesEnabled
                  ? 'bg-orange-50 border-orange-200 text-[#FC8019]'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-400'
              }`}
              title={particlesEnabled ? 'Pause Orange Live Particles' : 'Enable Orange Live Particles'}
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* User Account / Orders */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs sm:text-sm font-medium"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#FC8019] text-white flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline font-semibold">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-zinc-100 p-2 z-50">
                      <div className="px-3 py-2 border-b border-zinc-100">
                        <p className="text-xs font-bold text-zinc-900">{user.name}</p>
                        <p className="text-[11px] text-zinc-500">{user.phone}</p>
                      </div>
                      <button
                        onClick={() => {
                          onOpenOrders();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm text-zinc-700 hover:bg-orange-50 flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4 text-[#FC8019]" />
                        <span>My Orders</span>
                      </button>
                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1 px-3 py-2 rounded-full text-xs sm:text-sm font-semibold text-zinc-700 hover:text-[#FC8019] hover:bg-orange-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#FC8019] hover:bg-[#E86F00] text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#FC8019] text-xs font-black shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Location bar */}
        <div className="md:hidden pb-2.5">
          <button
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-orange-50/60 text-xs text-zinc-700"
          >
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#FC8019] shrink-0" />
              <span className="font-semibold truncate">{currentLocation}</span>
            </div>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
