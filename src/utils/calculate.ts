import { UserData } from '../types';

export const calcTotalAssets = (data: UserData): number => {
  return Object.values(data.assets).reduce((a, b) => a + b, 0);
};

export const calcTotalLiabilities = (data: UserData): number => {
  return Object.values(data.liabilities).reduce((a, b) => a + b, 0);
};

export const calcNetWorth = (data: UserData): number => {
  return calcTotalAssets(data) - calcTotalLiabilities(data);
};

export const calcMonthlySurplus = (data: UserData): number => {
  return data.cashflow.monthlyIncome - data.cashflow.monthlyExpense;
};

// 負債に依存しない、多角的なレベル・評価システム
export const getAssetLevel = (data: UserData) => {
  const netWorth = calcNetWorth(data);
  const surplus = calcMonthlySurplus(data);
  const totalAssets = calcTotalAssets(data);

  // フロー力（毎月の貯蓄・黒字余力）に基づくレベル判定
  if (surplus >= 15) {
    return { title: 'ハイパースセーバー 🚀', desc: '毎月の余剰資金が非常に多く、資産急拡大のポテンシャルがあります', color: 'text-emerald-500', progress: 85 };
  } else if (surplus > 0) {
    return { title: '堅実な蓄財家 💰', desc: '収支が黒字化されており、着実に資産を積み上げられる状態です', color: 'text-indigo-500', progress: 60 };
  } else if (totalAssets > 500) {
    return { title: 'ストックホルダー 🛡️', desc: '手元にまとまった資産があり、有事への耐性が高い状態です', color: 'text-blue-500', progress: 45 };
  } else {
    return { title: 'チャレンジャー 🌱', desc: 'ここから家計を最適化し、資産形成の基盤を作っていくフェーズです', color: 'text-slate-500', progress: 25 };
  }
};

export const generateSimulationData = (data: UserData, years: number = 40) => {
  const result = [];
  let currentAssets = calcNetWorth(data);
  const yearlySurplus = calcMonthlySurplus(data) * 12;
  const inflationRate = 1.02;

  const totalRatio = data.portfolio.reduce((sum, item) => sum + item.ratio, 0);
  const weightedReturn = totalRatio === 100 
    ? data.portfolio.reduce((sum, item) => sum + (item.ratio / 100) * (item.returnRate / 100), 0)
    : 0.03;

  let currentYearExpense = data.cashflow.monthlyExpense * 12;

  for (let i = 0; i <= years; i++) {
    const age = data.age + i;
    const yearEvents = data.events.filter(e => e.age === age);
    const eventCosts = yearEvents.reduce((sum, e) => sum + e.cost, 0);
    
    currentAssets -= eventCosts;
    currentAssets += yearlySurplus - currentYearExpense;
    currentAssets *= (1 + weightedReturn);

    result.push({
      age,
      amount: Math.round(currentAssets),
      event: yearEvents.length > 0 ? yearEvents[0].name : undefined
    });

    currentYearExpense *= inflationRate;
  }
  return result;
};
