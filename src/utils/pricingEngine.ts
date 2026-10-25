import { CartItem, Coupon } from '../data/orangebiteData';

export interface PriceBreakdown {
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  packagingFee: number;
  platformFee: number;
  taxes: number; // 5% GST
  discount: number;
  finalTotal: number;
  couponApplied?: Coupon | null;
  couponMessage?: string;
  isCouponValid?: boolean;
}

export function calculateCartAuthoritativePrice(
  items: CartItem[],
  appliedCoupon?: Coupon | null
): PriceBreakdown {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Authoritative item subtotal calculated line by line
  const subtotal = items.reduce((sum, item) => {
    return sum + item.totalItemPrice;
  }, 0);

  if (items.length === 0) {
    return {
      itemCount: 0,
      subtotal: 0,
      deliveryFee: 0,
      packagingFee: 0,
      platformFee: 0,
      taxes: 0,
      discount: 0,
      finalTotal: 0,
      couponApplied: null,
      couponMessage: undefined,
      isCouponValid: false,
    };
  }

  // Delivery partner fee rules (₹35 base, free over ₹500 or with FREESHIP)
  let deliveryFee = subtotal > 500 ? 0 : 35;
  const packagingFee = 25; // Standard eco-friendly packaging
  const platformFee = 6;   // Platform convenience fee

  // Coupon evaluation
  let discount = 0;
  let couponMessage: string | undefined = undefined;
  let isCouponValid = false;
  let activeCoupon = appliedCoupon;

  if (activeCoupon) {
    if (subtotal < activeCoupon.minOrderValue) {
      couponMessage = `Add items worth ₹${activeCoupon.minOrderValue - subtotal} more to apply ${activeCoupon.code}`;
      isCouponValid = false;
      activeCoupon = null;
    } else {
      isCouponValid = true;
      if (activeCoupon.discountType === 'percentage') {
        const calculated = Math.round((subtotal * activeCoupon.discountValue) / 100);
        discount = activeCoupon.maxDiscount ? Math.min(calculated, activeCoupon.maxDiscount) : calculated;
      } else {
        discount = activeCoupon.discountValue;
      }
      couponMessage = `Awesome! ${activeCoupon.code} applied. Saved ₹${discount}!`;
    }
  }

  // Handle special FREESHIP coupon
  if (appliedCoupon?.code === 'FREESHIP' && isCouponValid) {
    deliveryFee = 0;
  }

  // 5% Goods and Services Tax (GST) on post-discount food subtotal
  const taxableAmount = Math.max(0, subtotal - discount);
  const taxes = Math.round(taxableAmount * 0.05);

  const finalTotal = Math.max(0, subtotal - discount + deliveryFee + packagingFee + platformFee + taxes);

  return {
    itemCount,
    subtotal,
    deliveryFee,
    packagingFee,
    platformFee,
    taxes,
    discount,
    finalTotal,
    couponApplied: activeCoupon,
    couponMessage,
    isCouponValid,
  };
}
