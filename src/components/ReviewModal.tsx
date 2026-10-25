import React, { useState } from 'react';
import { Order } from '../data/orangebiteData';
import { X, Star, CheckCircle2 } from 'lucide-react';

interface ReviewModalProps {
  order: Order | null;
  onClose: () => void;
  onSubmitReview: (orderId: string, rating: number, comment: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ order, onClose, onSubmitReview }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('Delicious meal, arrived hot and on time! Excellent packing.');
  const [tags, setTags] = useState<string[]>(['Hot & Fresh', 'Great Packaging']);
  const [submitted, setSubmitted] = useState(false);

  if (!order) return null;

  const availableTags = [
    'Hot & Fresh',
    'Great Packaging',
    'Prompt Delivery',
    'Generous Portions',
    'Value for Money',
  ];

  const toggleTag = (t: string) => {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview(order.id, rating, comment);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-white">
          <div>
            <span className="text-[10px] font-black uppercase text-[#FC8019] tracking-wider">
              Customer Feedback
            </span>
            <h3 className="text-base font-black text-zinc-900">
              Rate {order.restaurantName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-zinc-900">Thank You For Your Review!</h4>
            <p className="text-xs text-zinc-500">
              Your feedback helps {order.restaurantName} and the OrangeBite foodie community.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="text-center">
              <span className="text-xs font-bold text-zinc-600 block mb-2">How was your meal?</span>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-hidden transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-200 fill-zinc-100'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick tags */}
            <div>
              <span className="text-xs font-bold text-zinc-700 block mb-1.5">What did you like?</span>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const selected = tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-xl border transition-all ${
                        selected
                          ? 'border-[#FC8019] bg-orange-50 text-[#FC8019] font-bold'
                          : 'border-zinc-200 text-zinc-600 bg-white hover:border-zinc-300'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">
                Your Review
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this order..."
                rows={3}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-medium focus:outline-hidden focus:border-[#FC8019]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#FC8019] hover:bg-[#E86F00] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-500/20"
            >
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
