import React from 'react';
import { Card, NumberInput } from '../components/ui/core';
import { useAppStore } from '../hooks/useAppStore';

export const InputView: React.FC = () => {
  const { data, updateData } = useAppStore();

  const updateAsset = (key: keyof typeof data.assets, val: number) => {
    updateData({ assets: { ...data.assets, [key]: val } });
  };
  const updateLiability = (key: keyof typeof data.liabilities, val: number) => {
    updateData({ liabilities: { ...data.liabilities, [key]: val } });
  };
  const updateCashflow = (key: keyof typeof data.cashflow, val: number) => {
    updateData({ cashflow: { ...data.cashflow, [key]: val } });
  };

  return (
    <div className="p-5 space-y-6">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">資産・収支入力</h2>
        <div className="w-24">
          <label className="text-[10px] text-slate-400 block mb-1">現在の年齢</label>
          <input 
            type="number" 
            value={data.age || ''}
            onChange={(e) => updateData({ age: parseInt(e.target.value) || 0 })}
            className="w-full bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-center font-bold text-sm text-slate-800 dark:text-white outline-none"
          />
        </div>
      </div>

      <Card>
        <h3 className="font-bold text-xs text-indigo-600 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">毎月の収支（単位: 万円）</h3>
        <NumberInput label="手取り月収" value={data.cashflow.monthlyIncome} onChange={(v) => updateCashflow('monthlyIncome', v)} />
        <NumberInput label="毎月の総支出" value={data.cashflow.monthlyExpense} onChange={(v) => updateCashflow('monthlyExpense', v)} />
      </Card>

      <Card>
        <h3 className="font-bold text-xs text-emerald-600 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">プラスの資産（単位: 万円）</h3>
        <NumberInput label="現金・預金" value={data.assets.cash} onChange={(v) => updateAsset('cash', v)} />
        <NumberInput label="株式・投資信託" value={data.assets.stocks} onChange={(v) => updateAsset('stocks', v)} />
        <NumberInput label="NISA・iDeCo" value={data.assets.nisa} onChange={(v) => updateAsset('nisa', v)} />
        <NumberInput label="その他資産" value={data.assets.other} onChange={(v) => updateAsset('other', v)} />
      </Card>

      <Card>
        <h3 className="font-bold text-xs text-red-500 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">負債（単位: 万円）</h3>
        <NumberInput label="住宅ローン残高" value={data.liabilities.mortgage} onChange={(v) => updateLiability('mortgage', v)} />
        <NumberInput label="奨学金・その他借入" value={data.liabilities.other} onChange={(v) => updateLiability('other', v)} />
      </Card>
    </div>
  );
};
