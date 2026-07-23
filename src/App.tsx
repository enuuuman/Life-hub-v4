import React from 'react';
import { AppProvider } from './hooks/useAppStore';
import { AppLayout } from './components/layout/AppLayout';
import { HomeView } from './views/HomeView';
import { InputView } from './views/InputView';
import { PlanView } from './views/PlanView';
import { SimulationView } from './views/SimulationView';

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppLayout>
        {(activeTab) => (
          <>
            {activeTab === 'home' && <HomeView />}
            {activeTab === 'input' && <InputView />}
            {activeTab === 'plan' && <PlanView />}
            {activeTab === 'simulation' && <SimulationView />}
          </>
        )}
      </AppLayout>
    </AppProvider>
  );
};

export default App;
