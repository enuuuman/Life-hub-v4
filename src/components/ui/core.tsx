import React from 'react';
import { formatNumber, parseNumber } from '../../utils/format';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 ${className}`}>
    {children}
  </div>
);

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  icon?: React.ReactNode;
}

export const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange, icon }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-500 mb-1">{label}</label>
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">{icon}</div>}
      <input
        type="text"
        inputMode="numeric"
        value={formatNumber(value)}
        onChange={(e) => onChange(parseNumber(e.target.value))}
        className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 ${icon ? 'pl-10' : ''}`}
        placeholder="0"
      />
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">万円</div>
    </div>
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' | 'outline' }> = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = "w-full py-3 px-4 rounded-xl font-medium transition-colors active:scale-[0.98] flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline: "border-2 border-slate-200 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};
