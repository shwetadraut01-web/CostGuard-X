export type CurrencyCode = 'USD' | 'INR' | 'JPY' | 'EUR' | 'GBP' | 'AUD' | 'SGD' | 'CAD';

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rateToUSD: number; // Conversion multiplier relative to USD
}

export const CURRENCIES: Record<CurrencyCode, CurrencyRate> = {
  USD: { code: 'USD', symbol: '$', label: 'USD ($ US Dollar)', rateToUSD: 1.0 },
  INR: { code: 'INR', symbol: '₹', label: 'INR (₹ Indian Rupee)', rateToUSD: 85.5 },
  JPY: { code: 'JPY', symbol: '¥', label: 'JPY (¥ Japanese Yen)', rateToUSD: 155.0 },
  EUR: { code: 'EUR', symbol: '€', label: 'EUR (€ Euro)', rateToUSD: 0.92 },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP (£ British Pound)', rateToUSD: 0.79 },
  AUD: { code: 'AUD', symbol: 'A$', label: 'AUD (A$ Australian Dollar)', rateToUSD: 1.52 },
  SGD: { code: 'SGD', symbol: 'S$', label: 'SGD (S$ Singapore Dollar)', rateToUSD: 1.35 },
  CAD: { code: 'CAD', symbol: 'C$', label: 'CAD (C$ Canadian Dollar)', rateToUSD: 1.37 },
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

  if (currencyCode === 'INR') {
    return `₹${Math.round(converted).toLocaleString('en-IN')}`;
  }

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

  if (currencyCode === 'GBP') {
    return `£${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  if (currencyCode === 'AUD') {
    return `A$${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  if (currencyCode === 'SGD') {
    return `S$${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  if (currencyCode === 'CAD') {
    return `C$${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  if (currencyCode === 'EUR') {
    return `€${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return `$${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
