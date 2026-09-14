import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const badgeEnum = {
  niveau: z.enum(['debutant', 'intermediaire', 'avance', 'expert']),
  risque: z.enum(['faible', 'moyen', 'eleve']),
  outil: z.enum(['scanner', 'multimetre', 'oscilloscope', 'programmateur', 'alimentation_labo', 'pince_amperemetrique', 'aucun', 'kit_retour_injecteur', 'machine_a_fumee', 'fer_a_souder', 'outil_diag_constructeur']),
  systeme: z.enum(['moteur', 'abs', 'bcm', 'ecu', 'immo', 'can', 'transmission', 'chauffage_climatisation', 'bsi']),
};

const articleSchema = z.object({
  title: z.string(),
  description: z.string().max(160),
  pillar: z.enum(['diagnostic', 'programmation']),
  category: z.string(),
  subcategory: z.string().optional(),
  brand: z.array(z.string()).optional(),
  model: z.array(z.string()).optional(),
  engine: z.array(z.string()).optional(),
  system: badgeEnum.systeme,
  symptom: z.array(z.string()).optional(),
  dtc: z.array(z.string()).optional(),
  sensor: z.array(z.string()).optional(),
  actuator: z.array(z.string()).optional(),
  tool: z.array(z.string()).optional(),
  difficulty: badgeEnum.niveau,
  risk: badgeEnum.risque,
  requiredTools: z.array(badgeEnum.outil),
  diagnostic_method: z.string().optional(),
  related_articles: z.array(z.string()).optional(),
  published_date: z.date().optional(), // Made optional just in case
  updated_date: z.date().optional(),
  author: z.string().optional(),
  technical_review: z.object({
    reviewer: z.string(),
    date: z.date(),
  }).optional(),
  pillarPage: z.boolean().default(false),
  disclaimerValeurs: z.boolean().default(true),
});

const toolSchema = z.object({
  name: z.string(),
  brand: z.string(),
  role: z.enum(['diagnostic', 'programmation_ecu', 'eeprom_flash', 'immo_cles', 'electrique', 'alimentation']),
  description: z.string(),
  niveauUtilisateur: z.enum(['debutant', 'intermediaire', 'avance', 'expert']),
  ceQuilPermet: z.array(z.string()),
  ceQuilNePermetPas: z.array(z.string()),
  vehiculesConcernes: z.array(z.string()),
  fonctionsPrincipales: z.array(z.string()),
  accessoiresNecessaires: z.array(z.string()).optional(),
  avantages: z.array(z.string()),
  limites: z.array(z.string()),
  alternatives: z.array(z.string()),
  ratings: z.object({
    diagnostic: z.number().min(0).max(5),
    programmation: z.number().min(0).max(5),
    eeprom: z.number().min(0).max(5),
    codage: z.number().min(0).max(5),
    qualitePrix: z.number().min(0).max(5),
  }),
  verdict: z.string(),
  articlesAssocies: z.array(z.string()).optional(),
  affiliateUrl: z.string().url().optional(),
});

const comparisonSchema = z.object({
  title: z.string(),
  toolA: z.string(),
  toolB: z.string(),
  criteria: z.array(z.object({
    label: z.string(),
    valueA: z.string(),
    valueB: z.string(),
  })),
  verdict: z.string(),
  recommendedUseCase: z.object({ toolA: z.string(), toolB: z.string() }),
});

export const collections = {
  diagnostic: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/diagnostic" }), schema: articleSchema }),
  programmation: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/programmation" }), schema: articleSchema }),
  capteurs: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/capteurs" }), schema: articleSchema }),
  actionneurs: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/actionneurs" }), schema: articleSchema }),
  electricite: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/electricite" }), schema: articleSchema }),
  can: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/can" }), schema: articleSchema }),
  ecu: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/ecu" }), schema: articleSchema }),
  eeprom: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/eeprom" }), schema: articleSchema }),
  immo: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/immo" }), schema: articleSchema }),
  dtc: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/dtc" }), schema: articleSchema }),
  livedata: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/livedata" }), schema: articleSchema }),
  oscilloscope: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/oscilloscope" }), schema: articleSchema }),
  marques: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/marques" }), schema: articleSchema }),
  casreels: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/casreels" }), schema: articleSchema }),
  symptomes: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/symptomes" }), schema: articleSchema }),
  outils: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/outils" }), schema: toolSchema }),
  comparatifs: defineCollection({ loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/comparatifs" }), schema: comparisonSchema }),
};
