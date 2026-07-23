import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccountMode, INITIAL_USER_DATA, UserData } from '../types';

interface AppContextType {
  mode: AccountMode;
  setMode: (mode: AccountMode) => void;
  data: UserData;
  updateData: (newData: Partial<UserData>) => void;
  loadDemoData: () => void;
  exportBackup: () => void;
  importBackup: (file: File) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AccountMode>('personal');
  const [data, setData] = useState<UserData>(INITIAL_USER_DATA);

  useEffect(() => {
    const key = `lifeHub_v3_${mode}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        setData(INITIAL_USER_DATA);
      }
    } else {
      setData(INITIAL_USER_DATA);
    }
  }, [mode]);

  const updateData = (newData: Partial<UserData>) => {
    setData(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem(`lifeHub_v3_${mode}`, JSON.stringify(updated));
      return updated;
    });
  };

  const loadDemoData = () => {
    setData(INITIAL_USER_DATA);
    localStorage.setItem(`lifeHub_v3_${mode}`, JSON.stringify(INITIAL_USER_DATA));
  };

  const exportBackup = () => {
    const allData = {
      personal: JSON.parse(localStorage.getItem('lifeHub_v3_personal') || '{}'),
      partner: JSON.parse(localStorage.getItem('lifeHub_v3_partner') || '{}'),
      joint: JSON.parse(localStorage.getItem('lifeHub_v3_joint') || '{}'),
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LifeHub_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (parsed.personal) localStorage.setItem('lifeHub_v3_personal', JSON.stringify(parsed.personal));
    if (parsed.partner) localStorage.setItem('lifeHub_v3_partner', JSON.stringify(parsed.partner));
    if (parsed.joint) localStorage.setItem('lifeHub_v3_joint', JSON.stringify(parsed.joint));
    window.location.reload();
  };

  return (
    <AppContext.Provider value={{ mode, setMode, data, updateData, loadDemoData, exportBackup, importBackup }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
};
