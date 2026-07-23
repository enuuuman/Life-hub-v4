export const formatCurrency = (amountInManYen: number): string => {
  const yen = amountInManYen * 10000;
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0
  }).format(yen);
};

export const formatNumber = (num: number): string => {
  if (num === 0) return '';
  return new Intl.NumberFormat('ja-JP').format(num);
};

export const parseNumber = (value: string): number => {
  const parsed = parseInt(value.replace(/[^0-9]/g, ''), 10);
  return isNaN(parsed) ? 0 : parsed;
};
