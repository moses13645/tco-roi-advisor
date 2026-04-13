import { useSimulation } from '@/contexts/SimulationContext';
import { CurrencyInput } from '@/components/shared/CurrencyInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calculator, CheckCircle, ShieldCheck, Cloud, RefreshCw, Headphones, Zap, Brain, TrendingDown, Shield, Clock, Users } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const SERVICES_INCLUS = [
  { icon: ShieldCheck, label: 'Hébergement sécurisé HDS' },
  { icon: RefreshCw, label: 'MAJ réglementaires automatiques (DSN, M57)' },
  { icon: Shield, label: 'Sécurisation des données métiers sensibles' },
  { icon: Cloud, label: 'PRA/PCA intégré' },
  { icon: Headphones, label: 'Support inclus' },
  { icon: Zap, label: 'Évolutivité fonctionnelle continue' },
  { icon: Brain, label: 'Socle d\'intégration pour IA' },
];

const GAINS = [
  { icon: TrendingDown, label: 'Réduction des incidents techniques', level: 'Fort', desc: 'Infrastructure managée avec monitoring 24/7 et SLA contractuels' },
  { icon: Shield, label: 'Réduction du risque cybersécurité', level: 'Fort', desc: 'Sécurité gérée par des équipes spécialisées, mises à jour continues' },
  { icon: Users, label: 'Réduction de la mobilisation DSI', level: 'Moyen', desc: 'Recentrage des équipes sur les projets métiers à valeur ajoutée' },
  { icon: Clock, label: 'Gain de temps & disponibilité du service', level: 'Fort', desc: 'Haute disponibilité garantie contractuellement, accès multi-sites' },
];

export function TcoSaasTab() {
  const { state, updateTcoSaas, setActiveTab, runCalculation } = useSimulation();
  const s = state.tcoSaas;
  const [hypoOpen, setHypoOpen] = useState(false);

  const levelColor = (l: string) => l === 'Fort' ? 'badge-success' : l === 'Moyen' ? 'badge-warning' : 'bg-muted text-muted-foreground';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">TCO SaaS & ROI</h2>
        <p className="text-sm text-muted-foreground">Renseignez les coûts du modèle SaaS cible. Seuls les coûts OPEX s'appliquent.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 section-card p-5 space-y-5">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Coûts SaaS — OPEX</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Abonnement annuel <span className="text-destructive">*</span></Label>
              <CurrencyInput value={s.abonnement} onChange={v => updateTcoSaas({ abonnement: v })} />
              <p className="text-xs text-muted-foreground">Coût récurrent indexé chaque année</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Onboarding migration <span className="text-destructive">*</span></Label>
              <CurrencyInput value={s.onboarding} onChange={v => updateTcoSaas({ onboarding: v })} />
              <p className="text-xs text-muted-foreground">Coût one-shot année 1</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Formation des équipes</Label>
              <CurrencyInput value={s.formation} onChange={v => updateTcoSaas({ formation: v })} />
              <p className="text-xs text-muted-foreground">Coût one-shot année 1</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Indexation contractuelle</Label>
              <div className="relative">
                <Input type="number" min={0} max={10} step={0.1} value={s.indexation} onChange={e => updateTcoSaas({ indexation: parseFloat(e.target.value) || 0 })} className="pr-8 text-right" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
              </div>
              <p className="text-xs text-muted-foreground">2 % par an par défaut</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Collapsible open={hypoOpen} onOpenChange={setHypoOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline w-full justify-between section-card p-3">
              Hypothèses de calcul <ChevronDown className={`h-4 w-4 transition-transform ${hypoOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="section-card p-4 mt-2 space-y-3 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between"><span>Hausse salaires/an</span><span className="font-mono">{state.hypotheses.hausseSalaires} %</span></div>
                <div className="flex justify-between"><span>Hausse licences & matériel/an</span><span className="font-mono">{state.hypotheses.hausseLicences} %</span></div>
                <div className="flex justify-between"><span>Indexation SaaS/an</span><span className="font-mono">{state.hypotheses.indexationSaas} %</span></div>
                <div className="flex justify-between"><span>Amort. matériel</span><span className="font-mono">{state.hypotheses.amortissementMateriel} ans</span></div>
                <div className="flex justify-between"><span>Amort. logiciels</span><span className="font-mono">{state.hypotheses.amortissementLogiciels} ans</span></div>
                <div className="flex justify-between"><span>Impact cyber (fourchette)</span><span className="font-mono">300k – 500k €</span></div>
              </div>
              <p className="text-muted-foreground italic">Ces hypothèses sont modifiables dans les paramètres avancés.</p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Services inclus */}
      <div className="section-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Niveau de service inclus</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {SERVICES_INCLUS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 p-3 rounded-md bg-[hsl(var(--success)/0.08)] border border-[hsl(var(--success)/0.2)]">
              <CheckCircle className="h-4 w-4 text-success shrink-0" />
              <span className="text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gains organisationnels */}
      <div className="section-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Gains organisationnels estimés</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GAINS.map(({ icon: Icon, label, level, desc }) => (
            <div key={label} className="p-4 rounded-lg border bg-card space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${levelColor(level)}`}>{level}</span>
              </div>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => setActiveTab(1)} className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Précédent
        </Button>
        <Button onClick={() => runCalculation()} size="lg" className="gap-2 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent)/0.9)] text-accent-foreground">
          <Calculator className="h-4 w-4" /> Lancer le calcul
        </Button>
      </div>
    </div>
  );
}
