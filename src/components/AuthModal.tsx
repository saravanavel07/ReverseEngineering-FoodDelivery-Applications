import React, { useState } from 'react';
import { X, Phone, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { OrangeLogo } from './OrangeLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { name: string; phone: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('Saravana Kumar');
  const [phone, setPhone] = useState('9876543210');
  const [email, setEmail] = useState('saravana@orangebite.dev');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('4892');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
      return;
    }
    // Verified
    onSuccess({
      name: name || 'OrangeBite Foodie',
      phone: `+91 ${phone}`,
      email,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-orange-50 to-white border-b border-orange-100 flex items-center justify-between">
          <OrangeLogo size="md" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="mb-5">
            <h3 className="text-xl font-black text-zinc-900">
              {mode === 'signin' ? 'Welcome Back!' : 'Create an Account'}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {mode === 'signin'
                ? 'Sign in to access your saved addresses & order history'
                : 'Join OrangeBite for lightning-fast deliveries and exclusive coupons'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-hidden focus:border-[#FC8019]"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">
                Phone Number (Indian 10-Digit Mobile)
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-zinc-200 bg-zinc-100 text-zinc-600 text-xs font-bold">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-r-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:border-[#FC8019]"
                  required
                />
              </div>
            </div>

            {otpSent && (
              <div className="animate-in fade-in duration-200">
                <label className="text-xs font-bold text-zinc-700 block mb-1 flex items-center justify-between">
                  <span>Enter 4-Digit OTP</span>
                  <span className="text-[10px] text-emerald-600 font-normal">
                    Demo OTP: <strong className="font-mono">4892</strong>
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="4892"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-center text-sm font-mono tracking-widest font-black focus:outline-hidden focus:border-[#FC8019]"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#FC8019] hover:bg-[#E86F00] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <span>{otpSent ? 'Verify OTP & Continue' : 'Send One-Time Password'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 text-center">
            {mode === 'signin' ? (
              <p className="text-xs text-zinc-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setOtpSent(false);
                  }}
                  className="text-[#FC8019] font-bold hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p className="text-xs text-zinc-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setOtpSent(false);
                  }}
                  className="text-[#FC8019] font-bold hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Authentication & Session Handling</span>
          </div>
        </div>
      </div>
    </div>
  );
};
