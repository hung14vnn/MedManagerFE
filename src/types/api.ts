// Drug types
export interface ReferenceDto {
  id: number;
  title: string;
  authors?: string | null;
  source?: string | null;
  url?: string | null;
  publicationDate?: string | null; // ISO date
  doi?: string | null;
}

export interface DrugSearchDto {
  id: number;
  activeIngredient: string;
  brandName: string;
  pharmacologicalGroup?: string | null;
}

export interface DrugDetailDto extends DrugSearchDto {
  indications?: string | null;
  contraindications?: string | null;
  dosageAdults?: string | null;
  dosageChildren?: string | null;
  dosageHepaticImpairment?: string | null;
  dosageRenalImpairment?: string | null;
  adverseEffects?: string | null;
  pregnancyPrecautions?: string | null;
  breastfeedingPrecautions?: string | null;
  otherPrecautions?: string | null;
  references: ReferenceDto[];
}

export interface CreateDrugDto {
  activeIngredient: string;
  brandName: string;
  pharmacologicalGroup?: string | null;
  indications?: string | null;
  contraindications?: string | null;
  dosageAdults?: string | null;
  dosageChildren?: string | null;
  dosageHepaticImpairment?: string | null;
  dosageRenalImpairment?: string | null;
  adverseEffects?: string | null;
  pregnancyPrecautions?: string | null;
  breastfeedingPrecautions?: string | null;
  otherPrecautions?: string | null;
}

// Interaction types
export interface InteractionDetailDto {
  id: number;
  drug1: DrugSearchDto;
  drug2: DrugSearchDto;
  severity: 'Mild' | 'Moderate' | 'Severe' | string;
  mechanism: string;
  clinicalEffects: string;
  managementRecommendations: string;
  references: ReferenceDto[];
}

export interface InteractionCheckRequest {
  drugIds: number[];
}

export interface InteractionCheckResponse {
  interactions: InteractionDetailDto[];
  overallSeverity: 'None' | 'Mild' | 'Moderate' | 'Severe' | string;
}

export interface CreateInteractionDto {
  drug1Id: number;
  drug2Id: number;
  severity: 'Mild' | 'Moderate' | 'Severe' | string;
  mechanism: string;
  clinicalEffects: string;
  managementRecommendations: string;
}

// Disease types
export interface DiseaseDto {
  id: number;
  name: string;
  icdCode?: string | null;
  description?: string | null;
}

export interface DiseaseProtocolDto {
  id: number;
  disease: DiseaseDto;
  drug: DrugSearchDto;
  isPreferred: boolean;
  preferenceOrder: number;
  dosageRecommendation?: string | null;
  specialConditions?: string | null;
  notes?: string | null;
}

export interface DiseaseTreatmentDto {
  disease: DiseaseDto;
  preferredDrugs: { 
    drug: DrugSearchDto; 
    dosageRecommendation?: string | null; 
    specialConditions?: string | null; 
    notes?: string | null 
  }[];
  alternativeDrugs: { 
    drug: DrugSearchDto; 
    dosageRecommendation?: string | null; 
    specialConditions?: string | null; 
    notes?: string | null 
  }[];
}

// Dose calculation types
export interface DoseCalculationRequest {
  drugId: number;
  bodyWeight?: number | null;
  creatinineClearance?: number | null;
  eGFR?: number | null;
}

export interface DoseCalculationResponse {
  drug: DrugSearchDto;
  calculatedDose: number;
  unit: string;
  calculationType: string;
  instructions: string;
  warnings: string[];
}

export interface CreateReferenceDto {
  title: string;
  authors?: string | null;
  source?: string | null;
  url?: string | null;
  publicationDate?: string | null;
  doi?: string | null;
}

export interface CreateDiseaseDto {
  name: string;
  icdCode?: string | null;
  description?: string | null;
}

export interface CreateDiseaseProtocolDto {
  diseaseId: number;
  drugId: number;
  isPreferred: boolean;
  preferenceOrder: number;
  dosageRecommendation?: string | null;
  specialConditions?: string | null;
  notes?: string | null;
}
