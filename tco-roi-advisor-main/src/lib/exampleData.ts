import type { SimulationState } from '@/types/simulation';

export const defaultHypotheses = {
  dureeAnalyse: 3,
  hausseSalaires: 3,
  hausseLicences: 5,
  indexationSaas: 2,
  amortissementMateriel: 5,
  amortissementLogiciels: 3,
  impactCyberMin: 300_000,
  impactCyberMax: 500_000,
};

export const defaultProfile = {
  designation: '',
  type: '',
  habitants: null as number | null,
  typeProjet: '',
  agents: null as number | null,
  volumeMandats: null as number | null,
  dsiInterne: false,
  competenceCyber: false,
};

export const defaultTcoOnPremise = {
  it: {
    sallesInfo: { capex: 0, opex: 0 },
    materiel: { capex: 0, opex: 0 },
    licencesInfra: { capex: 0, opex: 0 },
    obsolescence: { capex: 0, opex: 0 },
    cyber: {
      pcaPra: false, mfa: false, pentest: false,
      auditCyber: false, gestionIdentites: false, surveillance: false,
      coutSecurite: { capex: 0, opex: 0 },
    },
  },
  people: {
    chargeInfra: 0, coutApplicatif: 0, dependanceCompetence: false,
    chargeInfraEtp: 0, chargeInfraCoutMoyen: 0, coutApplicatifEtp: 0, coutApplicatifCoutMoyen: 0,
  },
  licence: { licencesApplicatives: { capex: 0, opex: 0 } },
  prestations: { prestationsDiverses: { capex: 0, opex: 0 }, auditsConformite: { capex: 0, opex: 0 } },
};

export const defaultTcoSaas = { abonnement: 0, onboarding: 0, formation: 0, indexation: 2 };

export function getDefaultState(): SimulationState {
  return {
    profile: { ...defaultProfile },
    tcoOnPremise: JSON.parse(JSON.stringify(defaultTcoOnPremise)),
    tcoSaas: { ...defaultTcoSaas },
    hypotheses: { ...defaultHypotheses },
    activeTab: 0,
    results: null,
    decisionNoteEdits: {},
  };
}

export function getExampleData(): SimulationState {
  return {
    profile: {
      designation: 'Communauté d\'agglomération du Val d\'Exemple',
      type: 'communaute_agglo',
      habitants: 82000,
      typeProjet: 'Mixte',
      agents: 780,
      volumeMandats: 24000,
      dsiInterne: true,
      competenceCyber: false,
    },
    tcoOnPremise: {
      it: {
        sallesInfo: { capex: 15000, opex: 38000 },
        materiel: { capex: 48000, opex: 12000 },
        licencesInfra: { capex: 22000, opex: 58000 },
        obsolescence: { capex: 28000, opex: 0 },
        cyber: {
          pcaPra: true, mfa: false, pentest: false,
          auditCyber: false, gestionIdentites: false, surveillance: false,
          coutSecurite: { capex: 8000, opex: 15000 },
        },
      },
      people: {
        chargeInfra: 88000, coutApplicatif: 62000, dependanceCompetence: true,
        chargeInfraEtp: 1.5, chargeInfraCoutMoyen: 58000,
        coutApplicatifEtp: 1, coutApplicatifCoutMoyen: 62000,
      },
      licence: { licencesApplicatives: { capex: 32000, opex: 125000 } },
      prestations: { prestationsDiverses: { capex: 0, opex: 42000 }, auditsConformite: { capex: 0, opex: 0 } },
    },
    tcoSaas: { abonnement: 198000, onboarding: 85000, formation: 22000, indexation: 2 },
    hypotheses: { ...defaultHypotheses },
    activeTab: 0,
    results: null,
    decisionNoteEdits: {},
  };
}
