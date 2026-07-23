import React, { useState } from 'react';
import { Card } from '../components/ui/core';
import { useAppStore } from '../hooks/useAppStore';
import { calcNetWorth, calcMonthlySurplus, calcTotalAssets, calcTotalLiabilities, getAssetLevel } from '../utils/calculate';
import { formatCurrency } from '../utils/format';
import { Wallet, TrendingUp, ShieldCheck, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { data } = useAppStore();
  const [showPwaGuide, setShowPwaGuide] = useState(false);
  
  const netWorth = calcNetWorth(data);
  const totalAssets = calcTotalAssets(data);
  const totalLiabilities = calcTotalLiabilities(data);
  const surplus = calcMonthlySurplus(data);
  const level = getAssetLevel(data);

  return (
    <div className="p-5 space-y-6">
      <section className="text-center space-y-1 mt-2">
        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">純資産総額（資産 - 負債）</p>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {formatCurrency(netWorth)}
        </h2>
      </section>

      <Card className="border-l-4 border-l-indigo-500">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-xs text-slate-400 font-medium">形成力・家計力評価</p>
            <p className={`font-bold text-base ${level.color}`}>{level.title}</p>
          </div>
          <span className="text-xs bg-indigo-50 dark:bg-slate-700 px-2 py-1 rounded text-indigo-600 dark:text-indigo-300 font-bold">{level.progress}%</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{level.desc}</p>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${level.progress}%` }} />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="py-4">
          <p className="text-[11px] text-slate-400 mb-1">毎月余剰資金</p>
          <p className={`font-bold text-base ${surplus >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {formatCurrency(surplus)}/月
          </p>
        </Card>
        <Card className="py-4">
          <p className="text-[11px] text-slate-400 mb-1">総資産 / 負債</p>
          <p className="font-bold text-xs text-slate-700 dark:text-slate-200">
            {formatCurrency(totalAssets)}<br />
            <span className="text-red-500 font-normal">(-{formatCurrency(totalLiabilities)})</span>
          </p>
        </Card>
      </div>

      <Card>
        <div className="flex items-start gap-3">
          <ShieldCheck className="text-indigo-500 shrink-0 mt-0.5" size={22} />
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">AI 診断アドバイス</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {surplus > 0 
                ? `毎月${formatCurrency(surplus)}の黒字が出ています。住宅ローンなどの負債があっても、この余剰資金をNISA等で運用に回すことで長期的な資産拡大が十分に期待できます。`
                : '現在は収支がマイナスまたはフラットです。まずは固定費を見直し、毎月の余剰資金を生み出す体質へ改善しましょう。'}
            </p>
          </div>
        </div>
      </Card>

      {/* PWAインストールガイド（折りたたみ式） */}
      <Card className="bg-slate-900 text-white">
        <button 
          onClick={() => setShowPwaGuide(!showPwaGuide)} 
          className="w-full flex justify-between items-center text-left font-bold text-sm"
        >
          <span className="flex items-center gap-2"><HelpCircle size={18} className="text-indigo-400" /> スマホにアプリとして追加する方法</span>
          {showPwaGuide ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {showPwaGuide && (
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-2 text-slate-300 leading-relaxed">
            <p>📱 <strong>iPhone (Safari):</strong> 画面下部の「共有ボタン（四角から矢印）」を押し、「ホーム画面に追加」を選択してください。</p>
            <p>🤖 <strong>Android (Chrome):</strong> 右上の「メニュー（縦の三点リーダー）」を押し、「ホーム画面に追加」または「アプリをインストール」を選択してください。</p>
          </div>
        )}
      </Card>
    </div>
  );
};
