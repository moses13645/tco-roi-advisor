export interface CapexOpex {
  capex: number;
  opex: number;
}

export interface CyberToggles {
  pcaPra: boolean;
  mfa: boolean;
  pentest: boolean;
  auditCyber: boolean;
  gestionIdentites: boolean;
  surveillance: boolean;
}

export interface TcoItSection {
  sallesInfo: CapexOpex;
  materiel: CapexOpex;
  licencesInfra: CapexOpex;
  obsolescence: CapexOpex;
  cyber: CyberToggles & { coutSecurite: CapexOpex };
}

export interface TcoPeopleSection {
  chargeInfra: number;
  coutApplicatif: number;
  dependanceCompetence: boolean;
  chargeInfraEtp: number;
  chargeInfraCoutMoyen: number;
  coutApplicatifEtp: number;
  coutApplicatifCoutMoyen: number;
}

export interface TcoOnPremise {
  it: TcoItSection;
  people: TcoPeopleSection;
  licence: { licencesApplicatives: CapexOpex };
  prestations: { prestationsDiverses: CapexOpex; auditsConformite: CapexOpex };
}

export interface TcoSaas {
  abonnement: number;
  onboarding: number;
  formation: number;
  indexation: number;
}

export interface Profile {
  designation: string;
  type: string;
  habitants: number | null;
  typeProjet: string;
  agents: number | null;
  volumeMandats: number | null;
  dsiInterne: boolean;
  competenceCyber: boolean;
}

export interface Hypotheses {
  dureeAnalyse: number;
  hausseSalaires: number;
  hausseLicences: number;
  indexationSaas: number;
  amortissementMateriel: number;
  amortissementLogiciels: number;
  impactCyberMin: number;
  impactCyberMax: number;
}

export type CyberMaturite = 'Robuste' | 'À renforcer' | 'Insuffisant' | 'Critique';
export type RisqueIndisponibilite = 'Faible' | 'Moyen' | 'Élevé';
export type Recommandation = 'Migration SaaS recommandée' | 'Migration à instruire' | 'Maintien on premise à court terme';

export interface YearlyProjection {
  year: number;
  onPremiseBudget: number;
  onPremiseComptable: number;
  saasBudget: number;
  saasComptable: number;
  onPremiseCumulBudget: number;
  onPremiseCumulComptable: number;
  saasCumulBudget: number;
  saasCumulComptable: number;
}

export interface DiagnosticAlert {
  type: 'critical' | 'warning';
  title: string;
  message: string;
}

export interface CalculationResults {
  projections: YearlyProjection[];
  tcoOnPremiseCumule: number;
  tcoOnPremiseAjusteRisque: number;
  tcoSaasCumule: number;
  ecartTco: number;
  economiesAnnuelles: number[];
  economiesCumulees: number;
  roiPourcent: number;
  retourInvestissementAnnees: number | null;
  pointEquilibre: number | null;
  repartitionCapexOpex: { capex: number; opex: number };
  cyberMaturite: CyberMaturite;
  expositionCyber: number;
  risqueIndisponibilite: RisqueIndisponibilite;
  indiceCompletude: number;
  recommandation: Recommandation;
  raisonsRecommandation: string[];
  diagnosticAlerts: DiagnosticAlert[];
  postsNonRenseignes: string[];
  totalCapexAnnuel: number;
  totalOpexAnnuel: number;
}

export interface SimulationState {
  profile: Profile;
  tcoOnPremise: TcoOnPremise;
  tcoSaas: TcoSaas;
  hypotheses: Hypotheses;
  activeTab: number;
  results: CalculationResults | null;
  decisionNoteEdits: Record<string, string>;
}
