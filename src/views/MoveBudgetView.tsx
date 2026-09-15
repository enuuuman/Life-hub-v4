import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Plus, Share2, Trash2, WalletCards } from 'lucide-react';

type BudgetCategory = 'must' | 'compromise' | 'move' | 'reserve';
type Payer = 'joint' | 'mine' | 'partner';

interface BudgetItem {
  id: string;
  name: string;
  budget: number;
  actual: number;
  category: BudgetCategory;
  payer: Payer;
  done: boolean;
}

const STORAGE_KEY = 'lifeHub_moveBudget_v1';

const INITIAL_ITEMS: BudgetItem[] = [
  { id: 'fridge', name: '冷蔵庫', budget: 100000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'washer', name: '洗濯機', budget: 150000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'dishwasher', name: '食洗機', budget: 70000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'dining-table', name: 'ダイニングテーブル', budget: 50000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'dining-chair', name: 'ダイニングチェア', budget: 20000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'futon', name: '布団一式', budget: 40000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'microwave', name: '電子レンジ', budget: 30000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'rice-cooker', name: '炊飯器', budget: 20000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'curtain', name: 'カーテン', budget: 30000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'lighting', name: '照明', budget: 20000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'kettle', name: '電気ケトル', budget: 5000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'knife-board', name: '包丁・まな板等', budget: 10000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'pots', name: '鍋類', budget: 10000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'kitchen-tools', name: '菜箸・おたま等', budget: 10000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'trash', name: 'ゴミ箱', budget: 10000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'laundry', name: '洗濯用品', budget: 10000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'bath-toilet', name: '風呂・トイレ用品', budget: 15000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'towels', name: 'タオル類', budget: 10000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'vacuum', name: '掃除機', budget: 30000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'power', name: '電源タップ等', budget: 10000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'wifi', name: 'Wi-Fiルーター', budget: 10000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'hanger', name: 'ハンガー・最低限の収納', budget: 10000, actual: 0, category: 'must', payer: 'joint', done: false },
  { id: 'dresser', name: 'ドレッサー', budget: 30000, actual: 0, category: 'compromise', payer: 'joint', done: false },
  { id: 'bed', name: 'ベッド', budget: 100000, actual: 0, category: 'compromise', payer: 'joint', done: false },
  { id: 'sofa', name: 'ソファ', budget: 100000, actual: 0, category: 'compromise', payer: 'joint', done: false },
  { id: 'frying-pan', name: 'フライパン', budget: 10000, actual: 0, category: 'compromise', payer: 'joint', done: false },
  { id: 'tableware', name: '食器', budget: 30000, actual: 0, category: 'compromise', payer: 'joint', done: false },
  { id: 'pc-desk', name: 'PCデスク', budget: 40000, actual: 0, category: 'compromise', payer: 'mine', done: false },
  { id: 'rental-contract', name: '賃貸契約初期費用', budget: 700000, actual: 0, category: 'move', payer: 'joint', done: false },
  { id: 'moving-company', name: '引越し業者', budget: 110000, actual: 0, category: 'move', payer: 'joint', done: false },
  { id: 'reserve', name: '配送・設置・買い忘れ予備費', budget: 100000, actual: 0, category: 'reserve', payer: 'joint', done: false },
];

const CATEGORY_LABELS: Record<BudgetCategory, string> = {
  must: 'Must',
  compromise: 'Compromise',
  move: '契約・引越',
  reserve: '予備費',
};

const CATEGORY_STYLES: Record<BudgetCategory, string> = {
  must: 'bg-rose-50 text-rose-600 border-rose-100',
  compromise: 'bg-amber-50 text-amber-700 border-amber-100',
  move: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  reserve: 'bg-slate-100 text-slate-600 border-slate-200',
};

const yen = (value: number) => `¥${Math.max(0, Math.round(value || 0)).toLocaleString('ja-JP')}`;
const clampMoney = (value: number) => Math.min(10000000, Math.max(0, Number.isFinite(value) ? value : 0));

const readInitialItems = (): BudgetItem[] => {
  if (typeof window === 'undefined') return INITIAL_ITEMS;
  try {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const shared = params.get('move');
    if (shared) {
      const parsed = JSON.parse(decodeURIComponent(shared));
      if (Array.isArray(parsed) && parsed.length > 0) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        window.history.replaceState({}, '', window.location.pathname + window.location.search);
        return parsed;
      }
    }
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.warn('Failed to restore move budget data', error);
  }
  return INITIAL_ITEMS;
};

export const MoveBudgetView: React.FC = () => {
  const [items, setItems] = useState<BudgetItem[]>(readInitialItems);
  const [filter, setFilter] = useState<'all' | BudgetCategory>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [notice, setNotice] = useState('');
  const [newItem, setNewItem] = useState({ name: '', budget: 0, category: 'must' as BudgetCategory });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totals = useMemo(() => {
    const budget = items.reduce((sum, item) => sum + item.budget, 0);
    const spent = items.reduce((sum, item) => sum + (item.done ? item.actual : 0), 0);
    let mine = 0;
    let partner = 0;
    items.forEach((item) => {
      if (!item.done) return;
      if (item.payer === 'mine') mine += item.actual;
      if (item.payer === 'partner') partner += item.actual;
      if (item.payer === 'joint') {
        mine += item.actual / 2;
        partner += item.actual / 2;
      }
    });
    return { budget, spent, remaining: budget - spent, mine, partner };
  }, [items]);

  const updateItem = (id: string, patch: Partial<BudgetItem>) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  };

  const toggleDone = (item: BudgetItem) => {
    const done = !item.done;
    updateItem(item.id, { done, actual: done && item.actual === 0 ? item.budget : item.actual });
  };

  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.hash = `move=${encodeURIComponent(JSON.stringify(items))}`;
    const text = `新居予算を共有します。現在の予算は ${yen(totals.budget)} です。`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Life hub 新居予算', text, url: url.toString() });
        setNotice('共有メニューを開きました');
        return;
      }
      await navigator.clipboard.writeText(url.toString());
      setNotice('共有リンクをコピーしました');
    } catch (error) {
      setNotice('共有リンクを作成しました。ブラウザのURL共有から送れます。');
      window.location.hash = url.hash;
    }
  };

  const addItem = (event: React.FormEvent) => {
    event.preventDefault();
    const name = newItem.name.trim();
    const budget = clampMoney(newItem.budget);
    if (!name) return;
    setItems((current) => [...current, {
      id: `custom-${Date.now()}`,
      name,
      budget,
      actual: 0,
      category: newItem.category,
      payer: 'joint',
      done: false,
    }]);
    setNewItem({ name: '', budget: 0, category: 'must' });
    setShowAdd(false);
  };

  const visibleItems = items.filter((item) => filter === 'all' || item.category === filter);
  const displayedBudget = visibleItems.reduce((sum, item) => sum + item.budget, 0);
  const displayedSpent = visibleItems.reduce((sum, item) => sum + (item.done ? item.actual : 0), 0);
  const displayedRemaining = displayedBudget - displayedSpent;
  const displayedProgress = displayedBudget > 0 ? Math.min(100, (displayedSpent / displayedBudget) * 100) : 0;
  const displayedTitle = filter === 'all' ? '新居スタート総予算' : `${CATEGORY_LABELS[filter]} 合計`;

  return (
    <div className="p-5 pb-28 space-y-5 text-slate-800 dark:text-slate-100">
      <section className="space-y-1">
        <p className="text-xs font-semibold tracking-[0.16em] text-indigo-500 uppercase">Move planner</p>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">新居予算</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">契約・引越し・家具家電をまとめて管理</p>
          </div>
          <button type="button" onClick={handleShare} className="min-h-11 shrink-0 rounded-xl bg-indigo-600 px-3 text-white flex items-center gap-2 text-sm font-semibold active:scale-[0.98]">
            <Share2 size={17} /> 共有
          </button>
        </div>
        {notice && <p className="pt-1 text-xs text-emerald-600">{notice}</p>}
      </section>

      <section className="rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 p-5 text-white shadow-lg shadow-indigo-950/10">
        <p className="text-xs text-white/60">{displayedTitle}</p>
        <p className="mt-1 text-3xl font-bold tracking-tight">{yen(displayedBudget)}</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${displayedProgress}%` }} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-white/55">支払済み</p>
            <p className="font-semibold">{yen(displayedSpent)}</p>
          </div>
          <div>
            <p className="text-white/55">残り</p>
            <p className="font-semibold">{yen(displayedRemaining)}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs text-slate-500">あなた負担</p>
          <p className="mt-1 text-lg font-bold">{yen(totals.mine)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs text-slate-500">彼女負担</p>
          <p className="mt-1 text-lg font-bold">{yen(totals.partner)}</p>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-bold">購入・支払リスト</h3>
            <p className="text-xs text-slate-500">{visibleItems.filter((item) => item.done).length} / {visibleItems.length} 完了</p>
          </div>
          <button type="button" onClick={() => setShowAdd((value) => !value)} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold flex items-center gap-1.5 dark:border-slate-700 dark:bg-slate-800">
            <Plus size={17} /> 追加
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {(['all', 'must', 'compromise', 'move', 'reserve'] as const).map((category) => (
            <button type="button" key={category} onClick={() => setFilter(category)} className={`min-h-10 shrink-0 rounded-full border px-3 text-xs font-semibold transition-colors ${filter === category ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
              {category === 'all' ? 'すべて' : CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>

        {showAdd && (
          <form onSubmit={addItem} className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 space-y-3 dark:border-indigo-900 dark:bg-indigo-950/30">
            <input value={newItem.name} onChange={(event) => setNewItem((current) => ({ ...current, name: event.target.value }))} placeholder="品名 例：テレビ" className="w-full min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-base outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900" />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" min="0" max="10000000" step="1000" value={newItem.budget || ''} onChange={(event) => setNewItem((current) => ({ ...current, budget: clampMoney(Number(event.target.value)) }))} placeholder="予算" className="min-h-11 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-base outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900" />
              <select value={newItem.category} onChange={(event) => setNewItem((current) => ({ ...current, category: event.target.value as BudgetCategory }))} className="min-h-11 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-base outline-none dark:border-slate-700 dark:bg-slate-900">
                <option value="must">Must</option>
                <option value="compromise">Compromise</option>
                <option value="move">契約・引越</option>
                <option value="reserve">予備費</option>
              </select>
            </div>
            <button type="submit" className="w-full min-h-11 rounded-xl bg-indigo-600 font-semibold text-white">追加する</button>
          </form>
        )}

        <div className="space-y-2">
          {visibleItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-3 p-3.5">
                  <button type="button" onClick={() => toggleDone(item)} aria-label={`${item.name}を${item.done ? '未購入' : '購入済み'}にする`} className={`h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center ${item.done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 text-slate-300 dark:border-slate-600'}`}>
                    <Check size={20} />
                  </button>
                  <button type="button" onClick={() => setOpenId(isOpen ? null : item.id)} className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className={`truncate font-semibold ${item.done ? 'line-through text-slate-400' : ''}`}>{item.name}</p>
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_STYLES[item.category]}`}>{CATEGORY_LABELS[item.category]}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span>予算 {yen(item.budget)}</span>
                      {item.done && <span>実額 {yen(item.actual)}</span>}
                    </div>
                  </button>
                  <button type="button" onClick={() => setOpenId(isOpen ? null : item.id)} className="h-10 w-10 shrink-0 flex items-center justify-center text-slate-400" aria-label="詳細を開く">
                    {isOpen ? <ChevronUp size={19} /> : <ChevronDown size={19} />}
                  </button>
                </div>

                {isOpen && (
                  <div className="border-t border-slate-100 p-4 space-y-3 dark:border-slate-700">
                    <div className="grid grid-cols-2 gap-2">
                      <label className="text-xs text-slate-500">予算
                        <input type="number" min="0" max="10000000" step="1000" value={item.budget} onChange={(event) => updateItem(item.id, { budget: clampMoney(Number(event.target.value)) })} className="mt-1 w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-base text-slate-800 outline-none focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                      </label>
                      <label className="text-xs text-slate-500">実際の金額
                        <input type="number" min="0" max="10000000" step="1000" value={item.actual} onChange={(event) => { const actual = clampMoney(Number(event.target.value)); updateItem(item.id, { actual, done: actual > 0 ? true : item.done }); }} className="mt-1 w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-base text-slate-800 outline-none focus:border-indigo-400 dark:border-slate-600 dark:bg-slate-900 dark:text-white" />
                      </label>
                    </div>
                    <label className="block text-xs text-slate-500">支払者
                      <select value={item.payer} onChange={(event) => updateItem(item.id, { payer: event.target.value as Payer })} className="mt-1 w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-base text-slate-800 outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white">
                        <option value="joint">共同（50:50）</option>
                        <option value="mine">あなた</option>
                        <option value="partner">彼女</option>
                      </select>
                    </label>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <WalletCards size={15} />
                        {item.done ? `予算差 ${yen(item.budget - item.actual)}` : '購入後に実額を入力'}
                      </div>
                      {item.id.startsWith('custom-') && (
                        <button type="button" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} className="min-h-10 rounded-lg px-2 text-rose-500 flex items-center gap-1 text-xs font-semibold">
                          <Trash2 size={15} /> 削除
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl bg-slate-100 p-4 text-xs leading-relaxed text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <p className="font-semibold text-slate-700 dark:text-slate-200">共有について</p>
        <p className="mt-1">現在の「共有」は予算データをリンクに含めて彼女の端末へ取り込む方式です。リアルタイム共同編集は、クラウドDB接続後にこの画面のまま切り替えられます。</p>
      </section>
    </div>
  );
};
