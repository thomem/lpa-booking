export interface PricingBreakdown {
  nights: number;
  basePrice: number;
  nightlyTotal: number;
  cleaningFee: number;
  taxes: number;
  discount: number;
  discountLabel: string;
  total: number;
}

export interface PricingConfig {
  basePrice: number;
  cleaningFee: number;
  taxRate: number;
  weeklyDiscount: number;
  monthlyDiscount: number;
}

export function calculatePricing(
  nights: number,
  config: PricingConfig,
  promoDiscount = 0
): PricingBreakdown {
  const nightlyTotal = nights * config.basePrice;

  let discountRate = 0;
  let discountLabel = "";

  if (nights >= 28) {
    discountRate = config.monthlyDiscount;
    discountLabel = `Réduction mensuelle (${Math.round(discountRate * 100)}%)`;
  } else if (nights >= 7) {
    discountRate = config.weeklyDiscount;
    discountLabel = `Réduction hebdomadaire (${Math.round(discountRate * 100)}%)`;
  }

  const baseDiscount = nightlyTotal * discountRate;
  const promoDiscountAmount = (nightlyTotal - baseDiscount) * promoDiscount;
  const discount = baseDiscount + promoDiscountAmount;

  const subtotal = nightlyTotal - discount + config.cleaningFee;
  const taxes = subtotal * config.taxRate;
  const total = subtotal + taxes;

  return {
    nights,
    basePrice: config.basePrice,
    nightlyTotal,
    cleaningFee: config.cleaningFee,
    taxes: Math.round(taxes * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    discountLabel,
    total: Math.round(total * 100) / 100,
  };
}
