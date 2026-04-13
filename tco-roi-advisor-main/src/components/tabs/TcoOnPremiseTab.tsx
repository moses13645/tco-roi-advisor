import { useSimulation } from '@/contexts/SimulationContext';
import { CurrencyInput } from '@/components/shared/CurrencyInput';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, HelpCircle, Calculator } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { CapexOpex, TcoOnPremise } from '@/types/simulation';
import { useState } from 'react';

function CapexOpexRow({ label, help, value, onChange }: {
  label: string; help?: string; value: CapexOpex;
  onChange: (v: CapexOpex) => void;
}) {
  return (
    <tr className="border-b last:border-0">
      <td className="py-3 pr-3">
        <div className="flex items-start gap-1.5">
          <span className="text-sm font-medium">{label}</span>
          {help && (
            <Tooltip>
              <TooltipTrigger asChild><HelpCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 cursor-help" /></TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">{help}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </td>
      <td className="py-3 px-2 w-36"><CurrencyInput value={value.capex} onChange={v => onChange({ ...value, capex: v })} /></td>
      <td className="py-3 pl-2 w-36"><CurrencyInput value={value.opex} onChange={v => onChange({ ...value, opex: v })} /></td>
    </tr>
  );
}

function OpexOnlyRow({ label, help, value, onChange, etpValue, etpCoutMoyen, onEtpChange, onCoutMoyenChange }: {
  label: string; help?: string; value: number; onChange: (v: number) => void;
  etpValue?: number; etpCoutMoyen?: number;
  onEtpChange?: (v: number) => void; onCoutMoyenChange?: (v: number) => void;
}) {
  const [showHelper, setShowHelper] = useState(false);
  return (
    <>
      <tr className="border-b last:border-0">
        <td className="py-3 pr-3">
          <div className="flex items-start gap-1.5">
            <span className="text-sm font-medium">{label}</span>
            {help && (
              <Tooltip>
                <TooltipTrigger asChild><HelpCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 cursor-help" /></TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">{help}</TooltipContent>
              </Tooltip>
            )}
          </div>
          {onEtpChange && (
            <button onClick={() => setShowHelper(!showHelper)} className="text-xs text-info flex items-center gap-1 mt-1 hover:underline">
              <Calculator className="h-3 w-3" /> Calculer depuis un ETP
            </button>
          )}
        </td>
        <td className="py-3 pl-2 w-36"><CurrencyInput value={value} onChange={onChange} /></td>
      </tr>
      {showHelper && onEtpChange && onCoutMoyenChange && (
        <tr className="bg-muted/30">
          <td colSpan={2} className="py-2 px-4">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <Label className="text-xs">ETP</Label>
                <Input type="number" min={0} step={0.5} className="w-20 h-7 text-xs" value={etpValue || ''} onChange={e => {
                  const v = parseFloat(e.target.value) || 0;
                  onEtpChange(v);
                  if (v > 0 && (etpCoutMoyen || 0) > 0) onChange(Math.round(v * (etpCoutMoyen || 0)));
                }} />
              </div>
              <span className="text-muted-foreground">×</span>
              <div className="flex items-center gap-1.5">
                <Label className="text-xs">Coût chargé</Label>
                <CurrencyInput value={etpCoutMoyen || 0} onChange={v => {
                  onCoutMoyenChange(v);
                  if ((etpValue || 0) > 0 && v > 0) onChange(Math.round((etpValue || 0) * v));
                }} />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <h3 className="text-sm font-semibold text-primary uppercase tracking-wider px-1">{title}</h3>;
}

function TableHeader({ showCapex = true }: { showCapex?: boolean }) {
  return (
    <thead>
      <tr className="border-b">
        <th className="text-left text-xs font-semibold text-muted-foreground py-2 pr-3">Poste</th>
        {showCapex && <th className="text-right text-xs font-semibold text-muted-foreground py-2 px-2 w-36">CAPEX</th>}
        <th className="text-right text-xs font-semibold text-muted-foreground py-2 pl-2 w-36">OPEX</th>
      </tr>
    </thead>
  );
}

export function TcoOnPremiseTab() {
  const { state, updateTcoOnPremise, setActiveTab } = useSimulation();
  const op = state.tcoOnPremise;

  const update = (updater: (prev: TcoOnPremise) => TcoOnPremise) => updateTcoOnPremise(updater);
  const updateIt = (field: string, value: CapexOpex) => {
    update(p => ({ ...p, it: { ...p.it, [field]: value } }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">TCO On Premise</h2>
        <p className="text-sm text-muted-foreground">Renseignez les coûts actuels de votre infrastructure. Les champs non renseignés seront traités comme 0 dans le calcul.</p>
      </div>

      {/* IT */}
      <div className="section-card p-5 space-y-4">
        <SectionHeader title="IT" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader />
            <tbody>
              <CapexOpexRow label="Coût des salles informatiques" help="Datacenter, électricité, froid, sécurité physique pour le site nominal et de secours" value={op.it.sallesInfo} onChange={v => updateIt('sallesInfo', v)} />
              <CapexOpexRow label="Coût global du matériel" help="Serveur, stockage, sécurité, firewall, réseau" value={op.it.materiel} onChange={v => updateIt('materiel', v)} />
              <CapexOpexRow label="Coût de l'ensemble des licences infrastructure et support" help="Sauvegarde, supervision, Microsoft, base de données Oracle, etc." value={op.it.licencesInfra} onChange={v => updateIt('licencesInfra', v)} />
              <CapexOpexRow label="Coût obsolescence" value={op.it.obsolescence} onChange={v => updateIt('obsolescence', v)} />
            </tbody>
          </table>
        </div>

        {/* Cyber sub-section */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Cybersécurité & mise en conformité NIS2</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {([
              ['pcaPra', 'Existence d\'un site de secours (PCA/PRA)'],
              ['mfa', 'Authentification multi-facteurs'],
              ['pentest', 'Test d\'intrusion / pentest'],
              ['auditCyber', 'Audit Cyber'],
              ['gestionIdentites', 'Gestion des identités et des accès'],
              ['surveillance', 'Surveillance & détection des menaces'],
            ] as const).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between gap-2 bg-card rounded-md p-2.5 border">
                <span className="text-xs font-medium">{label}</span>
                <Switch
                  checked={op.it.cyber[key]}
                  onCheckedChange={v => update(p => ({ ...p, it: { ...p.it, cyber: { ...p.it.cyber, [key]: v } } }))}
                />
              </div>
            ))}
          </div>
          <table className="w-full mt-2">
            <tbody>
              <CapexOpexRow
                label="Coût des licences et outils en lien avec la sécurité"
                value={op.it.cyber.coutSecurite}
                onChange={v => update(p => ({ ...p, it: { ...p.it, cyber: { ...p.it.cyber, coutSecurite: v } } }))}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* PEOPLE */}
      <div className="section-card p-5 space-y-4">
        <SectionHeader title="PEOPLE — OPEX uniquement" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left text-xs font-semibold text-muted-foreground py-2 pr-3">Poste</th>
                <th className="text-right text-xs font-semibold text-muted-foreground py-2 pl-2 w-36">OPEX</th>
              </tr>
            </thead>
            <tbody>
              <OpexOnlyRow
                label="Charge annuelle pour l'équipe infrastructure & technique"
                value={op.people.chargeInfra}
                onChange={v => update(p => ({ ...p, people: { ...p.people, chargeInfra: v } }))}
                etpValue={op.people.chargeInfraEtp}
                etpCoutMoyen={op.people.chargeInfraCoutMoyen}
                onEtpChange={v => update(p => ({ ...p, people: { ...p.people, chargeInfraEtp: v } }))}
                onCoutMoyenChange={v => update(p => ({ ...p, people: { ...p.people, chargeInfraCoutMoyen: v } }))}
              />
              <OpexOnlyRow
                label="Coût annuel pour l'équipe applicative et fonctionnelle"
                value={op.people.coutApplicatif}
                onChange={v => update(p => ({ ...p, people: { ...p.people, coutApplicatif: v } }))}
                etpValue={op.people.coutApplicatifEtp}
                etpCoutMoyen={op.people.coutApplicatifCoutMoyen}
                onEtpChange={v => update(p => ({ ...p, people: { ...p.people, coutApplicatifEtp: v } }))}
                onCoutMoyenChange={v => update(p => ({ ...p, people: { ...p.people, coutApplicatifCoutMoyen: v } }))}
              />
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between gap-2 bg-muted/30 rounded-md p-3">
          <div>
            <span className="text-sm font-medium">Risque de dépendance compétence interne</span>
            <p className="text-xs text-muted-foreground">La collectivité dépend-elle de compétences rares difficiles à remplacer ?</p>
          </div>
          <Switch
            checked={op.people.dependanceCompetence}
            onCheckedChange={v => update(p => ({ ...p, people: { ...p.people, dependanceCompetence: v } }))}
          />
        </div>
      </div>

      {/* LICENCE */}
      <div className="section-card p-5 space-y-4">
        <SectionHeader title="LICENCE" />
        <table className="w-full">
          <TableHeader />
          <tbody>
            <CapexOpexRow
              label="Coût de l'ensemble des licences applicatives + support"
              value={op.licence.licencesApplicatives}
              onChange={v => update(p => ({ ...p, licence: { ...p.licence, licencesApplicatives: v } }))}
            />
          </tbody>
        </table>
      </div>

      {/* PRESTATIONS EXTERNES */}
      <div className="section-card p-5 space-y-4">
        <SectionHeader title="PRESTATIONS EXTERNES" />
        <table className="w-full">
          <TableHeader />
          <tbody>
            <CapexOpexRow
              label="Prestations diverses"
              help="Infogérance, expertise, mise à jour"
              value={op.prestations.prestationsDiverses}
              onChange={v => update(p => ({ ...p, prestations: { ...p.prestations, prestationsDiverses: v } }))}
            />
            <CapexOpexRow
              label="Audits de conformité"
              help="ISO 27001, sécurité, pentest, etc."
              value={op.prestations.auditsConformite}
              onChange={v => update(p => ({ ...p, prestations: { ...p.prestations, auditsConformite: v } }))}
            />
          </tbody>
        </table>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveTab(0)} className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Précédent
        </Button>
        <Button onClick={() => setActiveTab(2)} className="gap-2">
          Suivant <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
