import { useSimulation } from '@/contexts/SimulationContext';
import { Lightbulb, RotateCcw, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TABS = [
  '1. Profil',
  '2. TCO On Premise',
  '3. TCO SaaS & ROI',
  '4. Résultats',
  '5. Note de décision',
];

export function SimulationHeader() {
  const { state, setActiveTab, loadExample, reset, updateHypotheses } = useSimulation();

  return (
    <header className="sticky top-0 z-50 bg-card border-b shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3">
          <h1 className="text-base sm:text-lg font-bold text-primary leading-tight">
            Simulateur TCO & ROI
            <span className="hidden sm:inline text-muted-foreground font-normal text-sm ml-2">Migration on premise → SaaS</span>
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Durée :</span>
              <Select value={String(state.hypotheses.dureeAnalyse)} onValueChange={v => updateHypotheses({ dureeAnalyse: Number(v) })}>
                <SelectTrigger className="w-[72px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7].map(n => (
                    <SelectItem key={n} value={String(n)}>{n} an{n > 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={loadExample} className="h-8 text-xs gap-1">
              <Lightbulb className="h-3.5 w-3.5" /> Exemple
            </Button>
            <Button variant="outline" size="sm" onClick={reset} className="h-8 text-xs gap-1">
              <RotateCcw className="h-3.5 w-3.5" /> Réinitialiser
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()} className="h-8 text-xs gap-1">
              <Printer className="h-3.5 w-3.5" /> Imprimer / PDF
            </Button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
          {TABS.map((label, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                state.activeTab === i ? 'tab-active' : 'tab-inactive'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
