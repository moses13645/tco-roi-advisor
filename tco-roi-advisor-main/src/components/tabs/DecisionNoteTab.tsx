import { useSimulation } from '@/contexts/SimulationContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Printer } from 'lucide-react';
import { formatCurrencyShort } from '@/lib/formatters';
import { useMemo } from 'react';

function generateSections(state: ReturnType<typeof useSimulation>['state']) {
  const r = state.results;
  const p = state.profile;
  const h = state.hypotheses;
  if (!r) return {};

  const nom = p.designation || 'la collectivité';
  const duree = h.dureeAnalyse;

  return {
    synthese: `La présente note analyse l'opportunité de migration vers un modèle SaaS pour ${nom} sur un horizon de ${duree} ans.\n\nRecommandation : ${r.recommandation}.\n\nChiffres clés :\n• TCO On Premise cumulé : ${formatCurrencyShort(r.tcoOnPremiseCumule)}\n• TCO SaaS cumulé : ${formatCurrencyShort(r.tcoSaasCumule)}\n• Écart : ${formatCurrencyShort(r.ecartTco)} ${r.ecartTco > 0 ? '(avantage SaaS)' : '(avantage On Premise)'}\n• ROI migration : ${Math.round(r.roiPourcent)} %\n• Point d'équilibre : ${r.pointEquilibre ? `année ${r.pointEquilibre}` : 'non atteint sur l\'horizon'}\n• Maturité cyber : ${r.cyberMaturite}${r.expositionCyber > 0 ? ` — exposition estimée : ${formatCurrencyShort(r.expositionCyber)}` : ''}\n\nHypothèses : hausse salaires ${h.hausseSalaires}%/an, hausse licences ${h.hausseLicences}%/an, indexation SaaS ${h.indexationSaas}%/an.\nIndice de complétude : ${r.indiceCompletude}%.${r.postsNonRenseignes.length > 0 ? `\nPostes non valorisés : ${r.postsNonRenseignes.join(', ')}.` : ''}`,

    daf: `Analyse financière pour la Direction des Affaires Financières.\n\nLe modèle SaaS transforme des investissements CAPEX en charges OPEX prévisibles. Sur ${duree} ans :\n• CAPEX on premise cumulé : ${formatCurrencyShort(r.repartitionCapexOpex.capex)}\n• OPEX on premise cumulé : ${formatCurrencyShort(r.repartitionCapexOpex.opex)}\n\nLe SaaS offre une visibilité budgétaire accrue avec un abonnement annuel indexé à ${h.indexationSaas}% par an, contre une hausse des coûts d'infrastructure de ${h.hausseLicences}% par an en on premise.\n\nPoint d'équilibre : ${r.pointEquilibre ? `atteint dès l'année ${r.pointEquilibre}` : 'non atteint dans l\'horizon analysé'}.\n\n⚠️ Sensibilité : les résultats sont sensibles aux hypothèses d'indexation et de hausse des coûts. Une variation de ±1% modifie significativement le point d'équilibre.\n\nVue ajustée au risque : ${formatCurrencyShort(r.tcoOnPremiseAjusteRisque)} (TCO on premise intégrant l'exposition cyber).`,

    drh: `Analyse pour la Direction des Ressources Humaines.\n\n${state.tcoOnPremise.people.dependanceCompetence ? '⚠️ Un risque de dépendance aux compétences internes a été identifié. Le départ d\'un collaborateur clé pourrait mettre en péril la continuité de service.' : 'Aucun risque critique de dépendance aux compétences n\'a été identifié.'}\n\nLe modèle SaaS permet de :\n• Réduire la pression sur les équipes techniques internes\n• Recentrer les missions DSI sur des projets à valeur ajoutée\n• Diminuer la charge de maintenance et d'exploitation quotidienne\n\nCharge people identifiée en on premise : ${formatCurrencyShort(state.tcoOnPremise.people.chargeInfra + state.tcoOnPremise.people.coutApplicatif)} /an.`,

    dsi: `Analyse pour la Direction des Systèmes d'Information.\n\nCybersécurité : niveau de maturité évalué à « ${r.cyberMaturite} ».\n${r.diagnosticAlerts.filter(a => a.type === 'critical').map(a => `⚠️ ${a.title}`).join('\n')}\n\nContinuité de service : risque d'indisponibilité évalué à « ${r.risqueIndisponibilite} ».\n\nLe modèle SaaS intègre nativement :\n• Hébergement sécurisé HDS\n• PRA/PCA intégré\n• Mises à jour réglementaires automatiques (DSN, M57)\n• Surveillance et détection des menaces\n• Support technique inclus\n\nLa charge d'exploitation est significativement réduite, permettant à la DSI de se concentrer sur la transformation numérique de la collectivité.`,

    conclusion: `${r.recommandation}.\n\nConditions de succès :\n• Implication des utilisateurs clés dans la phase d'onboarding\n• Accompagnement au changement adapté\n• Validation de la couverture fonctionnelle du SaaS\n• Cadrage contractuel (SLA, réversibilité, protection des données)\n\nLimites de cette simulation :\n• Les coûts indirects (perte de productivité, risque juridique) ne sont pas valorisés\n• L'analyse repose sur les hypothèses de hausse déclarées\n• ${r.postsNonRenseignes.length} postes de coûts n'ont pas été renseignés\n• La différence entre vue nominale et vue ajustée au risque (${formatCurrencyShort(r.expositionCyber)}) traduit une hypothèse d'exposition cyber\n\nProchaines étapes recommandées :\n1. Validation des chiffres avec les directions métiers\n2. Demande de devis formelle auprès de l'éditeur SaaS\n3. Présentation en comité de direction / commission finances`,
  };
}

const COMPARISON_TABLE = [
  { critere: 'Modèle de coût', op: 'CAPEX + OPEX, investissements récurrents', saas: 'OPEX uniquement, abonnement prévisible' },
  { critere: 'Prévisibilité budgétaire', op: 'Faible — dépendante des pannes, obsolescence', saas: 'Forte — coût contractuel indexé' },
  { critere: 'CAPEX', op: 'Investissements lourds réguliers', saas: 'Aucun' },
  { critere: 'OPEX', op: 'Variable et croissant', saas: 'Stable et prévisible' },
  { critere: 'Mises à jour réglementaires', op: 'À la charge de la collectivité', saas: 'Incluses et automatiques' },
  { critere: 'Cybersécurité', op: 'À construire et maintenir en interne', saas: 'Intégrée, équipes dédiées' },
  { critere: 'Continuité d\'activité', op: 'PCA/PRA à mettre en place', saas: 'PRA/PCA intégré nativement' },
  { critere: 'Dépendance compétences', op: 'Forte — expertise interne requise', saas: 'Faible — expertise éditeur' },
  { critere: 'Support', op: 'Interne ou prestataire externe', saas: 'Inclus dans l\'abonnement' },
  { critere: 'Évolutivité', op: 'Lente, dépendante du budget', saas: 'Continue, incluse' },
  { critere: 'Préparation à l\'IA', op: 'Investissement supplémentaire requis', saas: 'Socle d\'intégration prévu' },
];

function EditableSection({ title, sectionKey, generated }: { title: string; sectionKey: string; generated: string }) {
  const { state, updateDecisionNote } = useSimulation();
  const content = state.decisionNoteEdits[sectionKey] ?? generated;
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">{title}</h3>
      <textarea
        value={content}
        onChange={e => updateDecisionNote(sectionKey, e.target.value)}
        className="w-full min-h-[150px] p-3 rounded-md border bg-card text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-ring"
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </div>
  );
}

export function DecisionNoteTab() {
  const { state, setActiveTab } = useSimulation();
  const r = state.results;
  const sections = useMemo(() => generateSections(state), [state]);

  if (!r) return (
    <div className="text-center py-20 space-y-4">
      <p className="text-muted-foreground">Lancez le calcul depuis l'onglet « TCO SaaS & ROI » pour générer la note de décision.</p>
      <Button onClick={() => setActiveTab(2)}>Aller à l'étape 3</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Note d'aide à la décision</h2>
          <p className="text-sm text-muted-foreground">Document auto-généré et éditable. Modifiez le contenu avant impression.</p>
        </div>
        <Button variant="outline" onClick={() => window.print()} className="gap-2 no-print">
          <Printer className="h-4 w-4" /> Imprimer / PDF
        </Button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Écart TCO', value: formatCurrencyShort(r.ecartTco) },
          { label: 'ROI', value: `${Math.round(r.roiPourcent)} %` },
          { label: 'Retour invest.', value: r.retourInvestissementAnnees ? `${r.retourInvestissementAnnees} an(s)` : '—' },
          { label: 'Point d\'équilibre', value: r.pointEquilibre ? `Année ${r.pointEquilibre}` : '—' },
        ].map(kpi => (
          <div key={kpi.label} className="kpi-card text-center">
            <p className="text-[10px] text-muted-foreground uppercase">{kpi.label}</p>
            <p className="text-lg font-bold text-primary">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Editable Sections */}
      <div className="section-card p-6 space-y-6">
        <EditableSection title="Synthèse exécutive" sectionKey="synthese" generated={sections.synthese || ''} />
        <hr />
        <EditableSection title="Analyse DAF" sectionKey="daf" generated={sections.daf || ''} />
        <hr />
        <EditableSection title="Analyse DRH" sectionKey="drh" generated={sections.drh || ''} />
        <hr />
        <EditableSection title="Analyse DSI" sectionKey="dsi" generated={sections.dsi || ''} />
        <hr />
        <EditableSection title="Conclusion stratégique" sectionKey="conclusion" generated={sections.conclusion || ''} />
      </div>

      {/* Comparison Table */}
      <div className="section-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Tableau comparatif On Premise vs SaaS</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2">
                <th className="text-left py-2 pr-4 font-semibold">Critère</th>
                <th className="text-left py-2 px-4 font-semibold text-primary">On Premise</th>
                <th className="text-left py-2 pl-4 font-semibold text-accent">SaaS</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_TABLE.map(row => (
                <tr key={row.critere} className="border-b">
                  <td className="py-2.5 pr-4 font-medium">{row.critere}</td>
                  <td className="py-2.5 px-4 text-muted-foreground">{row.op}</td>
                  <td className="py-2.5 pl-4 text-muted-foreground">{row.saas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between no-print">
        <Button variant="outline" onClick={() => setActiveTab(3)} className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Résultats
        </Button>
        <Button onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" /> Imprimer / Exporter en PDF
        </Button>
      </div>

      {/* Print-only cover page */}
      <div className="hidden print-only print-cover">
        <h1 className="text-2xl font-bold mb-4">Note d'aide à la décision</h1>
        <h2 className="text-xl mb-2">Migration On Premise → SaaS</h2>
        <p className="text-lg mb-6">{state.profile.designation || 'Collectivité'}</p>
        <p>Durée d'analyse : {state.hypotheses.dureeAnalyse} ans</p>
        <p>Date : {new Date().toLocaleDateString('fr-FR')}</p>
      </div>
    </div>
  );
}
