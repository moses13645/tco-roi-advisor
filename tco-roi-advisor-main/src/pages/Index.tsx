import { SimulationProvider, useSimulation } from '@/contexts/SimulationContext';
import { SimulationHeader } from '@/components/SimulationHeader';
import { ProfileTab } from '@/components/tabs/ProfileTab';
import { TcoOnPremiseTab } from '@/components/tabs/TcoOnPremiseTab';
import { TcoSaasTab } from '@/components/tabs/TcoSaasTab';
import { ResultsTab } from '@/components/tabs/ResultsTab';
import { DecisionNoteTab } from '@/components/tabs/DecisionNoteTab';

function SimulatorContent() {
  const { state } = useSimulation();
  const tabs = [ProfileTab, TcoOnPremiseTab, TcoSaasTab, ResultsTab, DecisionNoteTab];
  const ActiveTab = tabs[state.activeTab] || ProfileTab;

  return (
    <div className="min-h-screen bg-background">
      <SimulationHeader />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <ActiveTab />
      </main>
    </div>
  );
}

export default function Index() {
  return (
    <SimulationProvider>
      <SimulatorContent />
    </SimulationProvider>
  );
}
