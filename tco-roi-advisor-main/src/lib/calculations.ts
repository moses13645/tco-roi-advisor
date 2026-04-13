import type { SimulationState, CalculationResults, CyberMaturite, RisqueIndisponibilite, Recommandation, DiagnosticAlert, YearlyProjection } from '@/types/simulation';

export function calculateCyberScore(state: SimulationState): { score: number; maturite: CyberMaturite; exposition: number } {
  const { cyber } = state.tcoOnPremise.it;
  const budgetSec = cyber.coutSecurite.capex + cyber.coutSecurite.opex;
  const criteria = [
    cyber.pcaPra, cyber.mfa, cyber.pentest, cyber.auditCyber,
    cyber.gestionIdentites, cyber.surveillance, budgetSec > 0, state.profile.competenceCyber,
  ];
  const score = criteria.filter(Boolean).length;
  let maturite: CyberMaturite;
  let exposition: number;
  if (score >= 7) { maturite = 'Robuste'; exposition = 0; }
  else if (score >= 5) { maturite = 'À renforcer'; exposition = 300_000; }
  else if (score >= 3) { maturite = 'Insuffisant'; exposition = 400_000; }
  else { maturite = 'Critique'; exposition = 500_000; }
  return { score, maturite, exposition };
}

export function calculateRisqueIndisponibilite(state: SimulationState): RisqueIndisponibilite {
  const signals = [
    !state.tcoOnPremise.it.cyber.pcaPra,
    !state.tcoOnPremise.it.cyber.surveillance,
    !state.profile.dsiInterne,
    state.tcoOnPremise.people.dependanceCompetence,
  ].filter(Boolean).length;
  if (signals >= 3) return 'Élevé';
  if (signals >= 2) return 'Moyen';
  return 'Faible';
}

function getOnPremiseYearlyCosts(state: SimulationState, year: number) {
  const { it, people, licence, prestations } = state.tcoOnPremise;
  const h = state.hypotheses;
  const licFactor = Math.pow(1 + h.hausseLicences / 100, year - 1);
  const salFactor = Math.pow(1 + h.hausseSalaires / 100, year - 1);

  // Stable costs
  const stableCapex = it.sallesInfo.capex + prestations.prestationsDiverses.capex + prestations.auditsConformite.capex;
  const stableOpex = it.sallesInfo.opex + prestations.prestationsDiverses.opex + prestations.auditsConformite.opex;

  // Material & license costs (+hausseLicences/year)
  const matLicCapex = (it.materiel.capex + it.licencesInfra.capex + it.obsolescence.capex + it.cyber.coutSecurite.capex + licence.licencesApplicatives.capex) * licFactor;
  const matLicOpex = (it.materiel.opex + it.licencesInfra.opex + it.obsolescence.opex + it.cyber.coutSecurite.opex + licence.licencesApplicatives.opex) * licFactor;

  // People costs (+hausseSalaires/year)
  const peopleOpex = (people.chargeInfra + people.coutApplicatif) * salFactor;

  const totalCapex = stableCapex + matLicCapex;
  const totalOpex = stableOpex + matLicOpex + peopleOpex;

  return { totalCapex, totalOpex, total: totalCapex + totalOpex };
}

function getAmortizedCapex(state: SimulationState, targetYear: number, maxYears: number): number {
  const { it, licence, prestations } = state.tcoOnPremise;
  const h = state.hypotheses;
  let total = 0;

  for (let y = 1; y <= maxYears; y++) {
    const licFactor = Math.pow(1 + h.hausseLicences / 100, y - 1);
    // Material capex (5yr amortization)
    const matCapex = (it.sallesInfo.capex + it.materiel.capex + it.obsolescence.capex + it.cyber.coutSecurite.capex + prestations.prestationsDiverses.capex + prestations.auditsConformite.capex * (y === 1 ? 1 : 0)) * (y === 1 || it.sallesInfo.capex > 0 ? 1 : 0);
    // Simplified: stable capex stays, material capex grows
    const stableCapexY = it.sallesInfo.capex + prestations.prestationsDiverses.capex + prestations.auditsConformite.capex;
    const matCapexY = (it.materiel.capex + it.obsolescence.capex + it.cyber.coutSecurite.capex) * licFactor;
    const softCapexY = (it.licencesInfra.capex + licence.licencesApplicatives.capex) * licFactor;

    // Check if this year's capex contributes to targetYear via amortization
    if (targetYear >= y && targetYear < y + h.amortissementMateriel) {
      total += (stableCapexY + matCapexY) / h.amortissementMateriel;
    }
    if (targetYear >= y && targetYear < y + h.amortissementLogiciels) {
      total += softCapexY / h.amortissementLogiciels;
    }
  }
  return total;
}

function getSaaSYearlyCost(state: SimulationState, year: number): number {
  const { tcoSaas, hypotheses } = state;
  const indexFactor = Math.pow(1 + hypotheses.indexationSaas / 100, year - 1);
  let cost = tcoSaas.abonnement * indexFactor;
  if (year === 1) {
    cost += tcoSaas.onboarding + tcoSaas.formation;
  }
  return cost;
}

export function calculateCompletude(state: SimulationState): number {
  const fields: number[] = [];
  const { it, people, licence, prestations } = state.tcoOnPremise;
  const checkCO = (co: { capex: number; opex: number }) => { fields.push(co.capex > 0 ? 1 : 0); fields.push(co.opex > 0 ? 1 : 0); };
  checkCO(it.sallesInfo); checkCO(it.materiel); checkCO(it.licencesInfra); checkCO(it.obsolescence); checkCO(it.cyber.coutSecurite);
  fields.push(people.chargeInfra > 0 ? 1 : 0); fields.push(people.coutApplicatif > 0 ? 1 : 0);
  checkCO(licence.licencesApplicatives); checkCO(prestations.prestationsDiverses); checkCO(prestations.auditsConformite);
  fields.push(state.tcoSaas.abonnement > 0 ? 1 : 0); fields.push(state.tcoSaas.onboarding > 0 ? 1 : 0);
  fields.push(state.profile.designation ? 1 : 0); fields.push(state.profile.type ? 1 : 0);
  fields.push(state.profile.habitants ? 1 : 0);
  const total = fields.length;
  const filled = fields.reduce((a, b) => a + b, 0);
  return Math.round((filled / total) * 100);
}

function getPostsNonRenseignes(state: SimulationState): string[] {
  const posts: string[] = [];
  const { it, people, licence, prestations } = state.tcoOnPremise;
  const check = (co: { capex: number; opex: number }, name: string) => {
    if (co.capex === 0 && co.opex === 0) posts.push(name);
  };
  check(it.sallesInfo, 'Coût des salles informatiques');
  check(it.materiel, 'Coût global du matériel');
  check(it.licencesInfra, 'Licences infrastructure et support');
  check(it.obsolescence, 'Coût obsolescence');
  check(it.cyber.coutSecurite, 'Licences et outils sécurité');
  if (people.chargeInfra === 0) posts.push('Charge équipe infrastructure');
  if (people.coutApplicatif === 0) posts.push('Coût équipe applicative');
  check(licence.licencesApplicatives, 'Licences applicatives');
  check(prestations.prestationsDiverses, 'Prestations diverses');
  check(prestations.auditsConformite, 'Audits de conformité');
  if (state.tcoSaas.formation === 0) posts.push('Formation des équipes (SaaS)');
  return posts;
}

function getDiagnosticAlerts(state: SimulationState): DiagnosticAlert[] {
  const alerts: DiagnosticAlert[] = [];
  const { cyber } = state.tcoOnPremise.it;
  if (cyber.coutSecurite.capex + cyber.coutSecurite.opex === 0)
    alerts.push({ type: 'warning', title: 'Budget sécurité non renseigné', message: 'Aucun budget dédié à la cybersécurité n\'est identifié. Ce poste est essentiel pour évaluer la posture de sécurité de la collectivité.' });
  if (state.tcoOnPremise.prestations.auditsConformite.capex + state.tcoOnPremise.prestations.auditsConformite.opex === 0)
    alerts.push({ type: 'warning', title: 'Audits de conformité non renseignés', message: 'Aucun budget d\'audit n\'est déclaré. La conformité réglementaire (NIS2, RGPD) nécessite des audits réguliers.' });
  if (!cyber.pcaPra)
    alerts.push({ type: 'critical', title: 'Absence de PCA/PRA', message: 'Aucun plan de continuité ou de reprise d\'activité n\'est en place. En cas d\'incident majeur, la continuité de service n\'est pas garantie.' });
  if (!cyber.mfa)
    alerts.push({ type: 'warning', title: 'Authentification multi-facteurs absente', message: 'L\'absence de MFA expose la collectivité à un risque accru d\'usurpation d\'identité et d\'accès non autorisé.' });
  if (!cyber.pentest)
    alerts.push({ type: 'warning', title: 'Pas de test d\'intrusion', message: 'Sans test d\'intrusion régulier, les vulnérabilités du système d\'information ne sont pas identifiées proactivement.' });
  if (!cyber.auditCyber)
    alerts.push({ type: 'warning', title: 'Audit cyber non réalisé', message: 'L\'absence d\'audit cyber empêche d\'évaluer objectivement le niveau de protection du SI.' });
  if (!cyber.gestionIdentites)
    alerts.push({ type: 'warning', title: 'Gestion des identités et accès insuffisante', message: 'Sans gestion centralisée des identités, le contrôle des droits d\'accès est fragilisé.' });
  if (!cyber.surveillance)
    alerts.push({ type: 'critical', title: 'Pas de surveillance des menaces', message: 'L\'absence de dispositif de détection rend la collectivité vulnérable aux attaques non détectées.' });
  if (state.tcoOnPremise.people.dependanceCompetence)
    alerts.push({ type: 'warning', title: 'Dépendance aux compétences internes', message: 'La collectivité est exposée au risque de perte de savoir-faire en cas de départ de collaborateurs clés.' });
  return alerts;
}

export function calculateResults(state: SimulationState): CalculationResults {
  const N = state.hypotheses.dureeAnalyse;
  const projections: YearlyProjection[] = [];
  let cumulBudgetOP = 0, cumulComptOP = 0, cumulBudgetSaaS = 0, cumulComptSaaS = 0;
  const economiesAnnuelles: number[] = [];

  // Base year capex/opex for ratio
  const baseYear = getOnPremiseYearlyCosts(state, 1);
  let totalCapexAll = 0, totalOpexAll = 0;

  for (let y = 1; y <= N; y++) {
    const opCosts = getOnPremiseYearlyCosts(state, y);
    const opBudget = opCosts.total;
    const opComptable = getAmortizedCapex(state, y, N) + (opCosts.totalOpex);
    const saasCost = getSaaSYearlyCost(state, y);

    cumulBudgetOP += opBudget;
    cumulComptOP += opComptable;
    cumulBudgetSaaS += saasCost;
    cumulComptSaaS += saasCost;

    totalCapexAll += opCosts.totalCapex;
    totalOpexAll += opCosts.totalOpex;

    economiesAnnuelles.push(opBudget - saasCost);

    projections.push({
      year: y,
      onPremiseBudget: opBudget,
      onPremiseComptable: opComptable,
      saasBudget: saasCost,
      saasComptable: saasCost,
      onPremiseCumulBudget: cumulBudgetOP,
      onPremiseCumulComptable: cumulComptOP,
      saasCumulBudget: cumulBudgetSaaS,
      saasCumulComptable: cumulComptSaaS,
    });
  }

  const { maturite, exposition } = calculateCyberScore(state);
  const risqueIndisponibilite = calculateRisqueIndisponibilite(state);
  const tcoAjuste = cumulBudgetOP + exposition;

  const coutsTransition = state.tcoSaas.onboarding + state.tcoSaas.formation;
  const ecartTco = cumulBudgetOP - cumulBudgetSaaS;
  const roiPourcent = coutsTransition > 0 ? (ecartTco / coutsTransition) * 100 : 0;

  // Point d'équilibre
  let pointEquilibre: number | null = null;
  for (let i = 0; i < projections.length; i++) {
    if (projections[i].saasCumulBudget <= projections[i].onPremiseCumulBudget) {
      pointEquilibre = i + 1;
      break;
    }
  }

  // Retour sur investissement en années
  let retourInvestissement: number | null = null;
  if (economiesAnnuelles.length > 0) {
    let cumGains = -coutsTransition;
    for (let i = 0; i < economiesAnnuelles.length; i++) {
      cumGains += economiesAnnuelles[i];
      if (cumGains >= 0 && retourInvestissement === null) {
        retourInvestissement = i + 1;
      }
    }
  }

  // Recommandation
  let recommandation: Recommandation;
  const raisonsRecommandation: string[] = [];
  const saasLessCostly = ecartTco > 0;
  const pointInHorizon = pointEquilibre !== null && pointEquilibre <= N;
  const highRisk = maturite === 'Critique' || maturite === 'Insuffisant' || risqueIndisponibilite === 'Élevé';

  if (saasLessCostly || pointInHorizon || highRisk) {
    recommandation = 'Migration SaaS recommandée';
    if (saasLessCostly) raisonsRecommandation.push(`Économie de ${Math.round(ecartTco).toLocaleString('fr-FR')} € sur ${N} ans`);
    if (highRisk) raisonsRecommandation.push('Niveau de risque cyber et/ou d\'indisponibilité élevé en on premise');
    if (pointInHorizon) raisonsRecommandation.push(`Point d'équilibre atteint dès l'année ${pointEquilibre}`);
  } else if (ecartTco < 0 && (maturite === 'Robuste' || maturite === 'À renforcer') && risqueIndisponibilite === 'Faible') {
    recommandation = 'Maintien on premise à court terme';
    raisonsRecommandation.push('Le modèle on premise reste moins coûteux sur l\'horizon d\'analyse');
    raisonsRecommandation.push('Les risques cyber sont maîtrisés');
  } else {
    recommandation = 'Migration à instruire';
    raisonsRecommandation.push('L\'écart financier est modéré mais des risques subsistent');
    if (maturite === 'À renforcer') raisonsRecommandation.push('La maturité cybersécurité nécessite un renforcement');
  }

  if (raisonsRecommandation.length > 3) raisonsRecommandation.length = 3;

  return {
    projections,
    tcoOnPremiseCumule: cumulBudgetOP,
    tcoOnPremiseAjusteRisque: tcoAjuste,
    tcoSaasCumule: cumulBudgetSaaS,
    ecartTco,
    economiesAnnuelles,
    economiesCumulees: ecartTco,
    roiPourcent,
    retourInvestissementAnnees: retourInvestissement,
    pointEquilibre,
    repartitionCapexOpex: { capex: totalCapexAll, opex: totalOpexAll },
    cyberMaturite: maturite,
    expositionCyber: exposition,
    risqueIndisponibilite,
    indiceCompletude: calculateCompletude(state),
    recommandation,
    raisonsRecommandation,
    diagnosticAlerts: getDiagnosticAlerts(state),
    postsNonRenseignes: getPostsNonRenseignes(state),
    totalCapexAnnuel: baseYear.totalCapex,
    totalOpexAnnuel: baseYear.totalOpex,
  };
}
