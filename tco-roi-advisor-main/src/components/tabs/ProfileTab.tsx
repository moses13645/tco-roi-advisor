import { useSimulation } from '@/contexts/SimulationContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

function Field({ label, help, required, children }: { label: string; help?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  );
}

export function ProfileTab() {
  const { state, updateProfile, setActiveTab } = useSimulation();
  const p = state.profile;
  const showAgents = p.typeProjet === 'RH' || p.typeProjet === 'Mixte';
  const showMandats = p.typeProjet === 'GF' || p.typeProjet === 'Mixte';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Paramétrez votre structure pour une analyse personnalisée</h2>
        <p className="text-sm text-muted-foreground">Renseignez les informations clés de votre collectivité pour obtenir une simulation adaptée.</p>
      </div>

      <div className="section-card p-6 space-y-5">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Identité</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Désignation de la collectivité" help="Nom complet de votre structure">
            <Input value={p.designation} onChange={e => updateProfile({ designation: e.target.value })} placeholder="Ex : Communauté d'agglomération..." />
          </Field>
          <Field label="Type de collectivité" required help="Permet d'adapter l'analyse à votre contexte">
            <Select value={p.type} onValueChange={v => updateProfile({ type: v })}>
              <SelectTrigger><SelectValue placeholder="Sélectionnez..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mairie">Mairie</SelectItem>
                <SelectItem value="communaute_communes">Communautés de communes</SelectItem>
                <SelectItem value="communaute_agglo">Communautés d'agglomération</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Nombre d'habitants" required help="Population desservie par la collectivité">
            <Input type="number" min={0} value={p.habitants ?? ''} onChange={e => updateProfile({ habitants: e.target.value ? Number(e.target.value) : null })} placeholder="Ex : 50 000" />
          </Field>
          <Field label="Type de projet" required help="GF = Gestion Financière, RH = Ressources Humaines">
            <Select value={p.typeProjet} onValueChange={v => updateProfile({ typeProjet: v })}>
              <SelectTrigger><SelectValue placeholder="Sélectionnez..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="GF">GF</SelectItem>
                <SelectItem value="RH">RH</SelectItem>
                <SelectItem value="Mixte">Mixte (GF + RH)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {showAgents && (
            <Field label="Nombre d'agents de la collectivité" required help="Effectif total géré en paie">
              <Input type="number" min={0} value={p.agents ?? ''} onChange={e => updateProfile({ agents: e.target.value ? Number(e.target.value) : null })} placeholder="Ex : 500" />
            </Field>
          )}
          {showMandats && (
            <Field label="Volume de mandats annuel" required help="Nombre de mandats de paiement émis par an">
              <Input type="number" min={0} value={p.volumeMandats ?? ''} onChange={e => updateProfile({ volumeMandats: e.target.value ? Number(e.target.value) : null })} placeholder="Ex : 20 000" />
            </Field>
          )}
        </div>
      </div>

      <div className="section-card p-6 space-y-5">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Organisation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
            <div>
              <Label className="text-sm font-medium">DSI interne</Label>
              <p className="text-xs text-muted-foreground">Disposez-vous d'une direction des systèmes d'information ?</p>
            </div>
            <Switch checked={p.dsiInterne} onCheckedChange={v => updateProfile({ dsiInterne: v })} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
            <div>
              <Label className="text-sm font-medium">Compétence interne cybersécurité</Label>
              <p className="text-xs text-muted-foreground">Profil dédié à la sécurité informatique</p>
            </div>
            <Switch checked={p.competenceCyber} onCheckedChange={v => updateProfile({ competenceCyber: v })} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setActiveTab(1)} className="gap-2">
          Suivant <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
