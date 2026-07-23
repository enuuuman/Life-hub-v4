import React, { useState } from 'react';
import { Home, Edit3, Map, TrendingUp, Settings, Download, Upload, Sparkles } from 'lucide-react';
import { TabType } from '../../types';
import { useAppStore } from '../../hooks/useAppStore';

interface Props {
  children: (activeTab: TabType) => React.ReactNode;
}

export const AppLayout: React.FC<Props> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showSettings, setShowSettings] = useState(false);
  const { mode, setMode, loadDemoData, exportBackup, importBackup } = useAppStore();

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      importBackup(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-slate-50 dark:bg-slate-900 sm:rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col sm:border-[8px] border-slate-800">
        
        <header className="pt-safe-top bg-white dark:bg-slate-800 shadow-sm z-10">
          <div className="px-5 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">Life hub</h1>
            <div className="flex items-center gap-2">
              <select 
                value={mode} 
                onChange={(e) => setMode(e.target.value as any)}
                className="bg-slate-100 dark:bg-slate-700 text-xs rounded-full px-2.5 py-1.5 font-medium outline-none text-slate-700 dark:text-slate-200"
              >
                <option value="personal">自分用 👤</option>
                <option value="partner">相手用 👤</option>
                <option value="joint">共同用 👥</option>
              </select>
              <button onClick={() => setShowSettings(!showSettings)} className="text-slate-400 p-2">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24 scroll-smooth">
          {showSettings ? (
            <div className="p-5 space-y-4 animate-in fade-in">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">設定・データ管理</h2>
              <button 
                onClick={() => { loadDemoData(); setShowSettings(false); }} 
                className="w-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 p-4 rounded-xl font-medium flex items-center justify-center gap-2 border border-indigo-200 dark:border-indigo-800"
              >
                <Sparkles size={20} /> デモデータを一括読み込み
              </button>
              <button onClick={exportBackup} className="w-full bg-slate-800 text-white p-4 rounded-xl flex items-center justify-center gap-2">
                <Download size={20} /> バックアップを保存 (JSON)
              </button>
              <label className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 p-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer">
                <Upload size={20} /> データを復元 (JSON)
                <input type="file" accept=".json" className="hidden" onChange={handleImport} />
              </label>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              {children(activeTab)}
            </div>
          )}
        </main>

        <nav className="absolute bottom-0 w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 pb-safe-bottom z-20">
          <div className="flex justify-around items-center h-16">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'input', icon: Edit3, label: 'Input' },
              { id: 'plan', icon: Map, label: 'Plan' },
              { id: 'simulation', icon: TrendingUp, label: 'Sim' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as TabType); setShowSettings(false); }}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === tab.id && !showSettings ? 'text-indigo-600' : 'text-slate-400'}`}
              >
                <tab.icon size={22} strokeWidth={activeTab === tab.id && !showSettings ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};
