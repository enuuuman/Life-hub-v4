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
          /* key={activeTab} を指定することで、タブが変わるたびにアニメーションが発動します */
          <div key={activeTab} className="tab-content-fade">
            {activeTab === 'home' && <HomeView />}
            {activeTab === 'input' && <InputView />}
            {activeTab === 'plan' && <PlanView />}
            {activeTab === 'simulation' && <SimulationView />}

            {/* スムースな切り替えを実現するアニメーション定義 */}
            <style>{`
              @keyframes tabFadeIn {
                from {
                  opacity: 0;
                  transform: translateY(6px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .tab-content-fade {
                animation: tabFadeIn 0.25s ease-out forwards;
              }
            `}</style>
          </div>
        )}
      </AppLayout>
    </AppProvider>
  );
};

export default App;
