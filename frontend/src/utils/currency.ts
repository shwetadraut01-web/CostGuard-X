export type CurrencyCode = 'USD' | 'JPY' | 'EUR' | 'INR';

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  rateToUSD: number; // Conversion multiplier relative to USD
}

export const CURRENCIES: Record<CurrencyCode, CurrencyRate> = {
  USD: { code: 'USD', symbol: '$', rateToUSD: 1.0 },
  JPY: { code: 'JPY', symbol: '¥', rateToUSD: 155.0 }, // 1 USD = ~155 JPY
  EUR: { code: 'EUR', symbol: '€', rateToUSD: 0.92 },  // 1 USD = ~0.92 EUR
  INR: { code: 'INR', symbol: '₹', rateToUSD: 85.5 },  // 1 USD = ~85.5 INR
};

export function formatCurrency(
  amountInUSD: number | undefined | null,
  currencyCode: CurrencyCode = 'USD',
  compactJapanese: boolean = false
): string {
  if (amountInUSD === undefined || amountInUSD === null || isNaN(amountInUSD)) {
    return '—';
  }

  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = amountInUSD * currency.rateToUSD;

  if (currencyCode === 'JPY') {
    const val = Math.round(converted);
    if (compactJapanese && val >= 10000) {
      if (val >= 100000000) {
        return `¥${(val / 100000000).toFixed(2)}億`;
      }
      return `¥${(val / 10000).toFixed(0)}万`;
    }
    return `¥${val.toLocaleString()}`;
  }

  if (currencyCode === 'INR') {
    return `₹${Math.round(converted).toLocaleString('en-IN')}`;
  }

  if (currencyCode === 'EUR') {
    return `€${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return `$${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
