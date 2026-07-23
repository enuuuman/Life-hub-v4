import React, { useState } from 'react';
import { Card, Button, NumberInput } from '../components/ui/core';
import { useAppStore } from '../hooks/useAppStore';
import { formatCurrency } from '../utils/format';
import { Trash2, Plus, Sparkles } from 'lucide-react';
import { LifeEvent } from '../types';

export const PlanView: React.FC = () => {
  const { data, updateData } = useAppStore();
  const [step, setStep] = useState<number>(0); // 0:一覧, 1~3:ウィザード
  
  // ウィザード用一時ステート
  const [childCount, setChildCount] = useState(1);
  const [firstBornAge, setFirstBornAge] = useState(0);
  const [schoolRoute, setSchoolRoute] = useState<'all_public' | 'high_private' | 'mid_private' | 'all_private'>('all_public');
  
  const [hasHouse, setHasHouse] = useState(true);
  const [houseAge, setHouseAge] = useState(data.age + 5);
  const [houseCost, setHouseCost] = useState(400);

  const [newEvent, setNewEvent] = useState({ name: '', age: data.age + 1, cost: 100 });

  // 3ステップウィザードによる教育費＆ライフプラン自動生成
  const generateWizardEvents = () => {
    const generated: LifeEvent[] = [];
    
    // 教育費の簡易自動生成ロジック
    for (let c = 0; c < childCount; c++) {
      const birthYearAge = data.age + firstBornAge + (c * 3); // 3歳差想定
      const multiplier = schoolRoute === 'all_private' ? 2.5 : schoolRoute !== 'all_public' ? 1.6 : 1.0;
      
      generated.push({
        id: `${Date.now()}-ed1-${c}`,
        name: `第${c+1}子 高校進学費`,
        age: birthYearAge + 15,
        cost: Math.round(150 * multiplier),
        category: 'education'
      });
      generated.push({
        id: `${Date.now()}-ed2-${c}`,
        name: `第${c+1}子 大学進学・在学費`,
        age: birthYearAge + 18,
        cost: Math.round(400 * multiplier),
        category: 'education'
      });
    }

    if (hasHouse) {
      generated.push({
        id: `${Date.now()}-house`,
        name: '住宅購入頭金・諸費用',
        age: houseAge,
        cost: houseCost,
        category: 'housing'
      });
    }

    const merged = [...data.events, ...generated].sort((a, b) => a.age - b.age);
    updateData({ events: merged });
    setStep(0);
  };

  const addManualEvent = () => {
    if (!newEvent.name) return;
    const event: LifeEvent = { ...newEvent, id: Date.now().toString(), category: 'other' };
    updateData({ events: [...data.events, event].sort((a, b) => a.age - b.age) });
    setNewEvent({ name: '', age: data.age + 1, cost: 100 });
  };

  const removeEvent = (id: string) => {
    updateData({ events: data.events.filter(e => e.id !== id) });
  };

  return (
    <div className="p-5 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">ライフプラン管理</h2>
        {step === 0 && (
          <button onClick={() => setStep(1)} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full flex items-center gap-1 font-medium">
            <Sparkles size={14} /> 3ステップ診断
          </button>
        )}
      </div>

      {/* 3ステップウィザード画面 */}
      {step > 0 && (
        <Card className="border-2 border-indigo-500 animate-in fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-indigo-600">Step {step} / 3 ライフプラン診断</h3>
            <button onClick={() => setStep(0)} className="text-xs text-slate-400">中断する</button>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">お子様の教育プランを選択してください。</p>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">子供の人数</label>
                <input type="number" value={childCount} onChange={e => setChildCount(parseInt(e.target.value) || 0)} className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">第1子誕生時のあなたの年齢（または現在の子の年齢）</label>
                <input type="number" value={firstBornAge} onChange={e => setFirstBornAge(parseInt(e.target.value) || 0)} className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">進学ルート</label>
                <select value={schoolRoute} onChange={e => setSchoolRoute(e.target.value as any)} className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border text-sm">
                  <option value="all_public">すべて公立</option>
                  <option value="high_private">高校から私立</option>
                  <option value="mid_private">中学から私立</option>
                  <option value="all_private">すべて私立</option>
                </select>
              </div>
              <Button onClick={() => setStep(2)}>次へ進む</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">住宅購入の予定について教えてください。</p>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={hasHouse} onChange={e => setHasHouse(e.target.checked)} id="hh" className="w-4 h-4" />
                <label htmlFor="hh" className="text-sm font-medium">住宅購入予定あり</label>
              </div>
              {hasHouse && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">購入予定年齢</label>
                    <input type="number" value={houseAge} onChange={e => setHouseAge(parseInt(e.target.value) || 0)} className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border text-sm" />
                  </div>
                  <NumberInput label="頭金・諸費用予算" value={houseCost} onChange={setHouseCost} />
                </>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>戻る</Button>
                <Button onClick={generateWizardEvents}>イベントを自動生成</Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* 一覧画面 */}
      {step === 0 && (
        <>
          <div className="space-y-3">
            {data.events.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">ライフイベントが登録されていません</div>
            ) : (
              data.events.map(event => (
                <Card key={event.id} className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold text-xs w-11 h-11 rounded-full flex items-center justify-center shrink-0">
                      {event.age}歳
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-100">{event.name}</p>
                      <p className="text-xs text-red-500 font-medium">-{formatCurrency(event.cost)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeEvent(event.id)} className="text-slate-300 hover:text-red-500 p-2">
                    <Trash2 size={18} />
                  </button>
                </Card>
              ))
            )}
          </div>

          <Card className="border border-dashed border-slate-300 dark:border-slate-700">
            <h3 className="font-bold text-xs text-slate-700 dark:text-slate-200 mb-3">個別イベント追加</h3>
            <div className="space-y-3">
              <input 
                value={newEvent.name} 
                onChange={e => setNewEvent({...newEvent, name: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-lg py-2.5 px-3 text-sm outline-none"
                placeholder="イベント名（例: 車の買い替え）"
              />
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="number" 
                  value={newEvent.age} 
                  onChange={e => setNewEvent({...newEvent, age: parseInt(e.target.value) || data.age})}
                  className="bg-slate-50 dark:bg-slate-900 border rounded-lg py-2.5 px-3 text-sm outline-none"
                  placeholder="年齢"
                />
                <input 
                  type="number" 
                  value={newEvent.cost || ''} 
                  onChange={e => setNewEvent({...newEvent, cost: parseInt(e.target.value) || 0})}
                  className="bg-slate-50 dark:bg-slate-900 border rounded-lg py-2.5 px-3 text-sm outline-none"
                  placeholder="費用(万円)"
                />
              </div>
              <Button onClick={addManualEvent} variant="outline" className="py-2 text-xs">
                <Plus size={16} /> 追加する
              </Button>
            </div>
          </Card>

          {data.events.length > 0 && (
            <button onClick={() => updateData({ events: [] })} className="text-red-500 text-xs font-medium w-full text-center py-2">
              すべてのイベントをリセット
            </button>
          )}
        </>
      )}
    </div>
  );
};
