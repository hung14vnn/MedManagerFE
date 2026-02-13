// Reference types
export interface ReferenceDto {
	id: number;
	title: string;
	authors?: string | null;
	source?: string | null;
	url?: string | null;
	publicationDate?: string | null; // ISO date
	doi?: string | null;
}

// Ingredient types
export interface IngredientDto {
	id: number;
	code: string;
	name: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface DrugIngredientDto {
	id: number;
	ingredient: IngredientDto;
	strength?: string | null;
	unit?: string | null;
}

export interface CreateIngredientDto {
	code: string;
	name: string;
}

// Dosage Form types
export interface DosageFormDto {
	id: number;
	code: string;
	name: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateDosageFormDto {
	code: string;
	name: string;
}

// Route types
export interface RouteInformationDto {
	id: number;
	code: string;
	name: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateRouteDto {
	code: string;
	name: string;
}

// Mechanism types
export interface MechanismDto {
	id: number;
	code: string;
	name: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateMechanismDto {
	code: string;
	name: string;
}

export interface InteractionMechanismDto {
	mechanism: MechanismDto;
	mechanismType: "pharmacodynamic" | "pharmacokinetic";
	interactionText: string;
}

// Drug types (NEW STRUCTURE)
export type DrugStatus = "Active" | "Inactive" | "Deprecated";

export interface DrugSearchDto {
	id: number;
	code: string;
	name: string;
	status: DrugStatus;
	dosageForm?: string | null;
	route?: string | null;
}

export interface DrugDetailDto {
	id: number;
	code: string;
	name: string;
	status: DrugStatus;
	dosageFormId?: number | null;
	dosageForm?: DosageFormDto | null;
	routeId?: number | null;
	route?: RouteInformationDto | null;
	ingredients: DrugIngredientDto[];
	references: ReferenceDto[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateDrugDto {
	code: string;
	name: string;
	status: DrugStatus;
	dosageFormId?: number | null;
	routeId?: number | null;
	ingredients: {
		ingredientId: number;
		strength?: string | null;
		unit?: string | null;
	}[];
}

export interface UpdateDrugDto extends CreateDrugDto {}

// Interaction types
export interface InteractionDetailDto {
	id: number;
	drug1: DrugSearchDto;
	drug2: DrugSearchDto;
	severity: "Mild" | "Moderate" | "Severe" | string;
	mechanism: string;
	clinicalEffects: string;
	managementRecommendations: string;
	interactionMechanisms?: InteractionMechanismDto[];
	references: ReferenceDto[];
}

export interface InteractionCheckRequest {
	drugIds: number[];
}

export interface InteractionCheckResponse {
	interactions: InteractionDetailDto[];
	overallSeverity: "None" | "Mild" | "Moderate" | "Severe" | string;
}

export interface CreateInteractionDto {
	drug1Id: number;
	drug2Id: number;
	severity: "Mild" | "Moderate" | "Severe" | string;
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
		notes?: string | null;
	}[];
	alternativeDrugs: {
		drug: DrugSearchDto;
		dosageRecommendation?: string | null;
		specialConditions?: string | null;
		notes?: string | null;
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

// Search Analytics types
export interface SearchLogDto {
	id: number;
	userId?: string | null;
	userName?: string | null;
	searchQuery: string;
	entityType: "Drug" | "Ingredient" | "Disease" | "Interaction";
	resultCount: number;
	foundResults: boolean;
	ipAddress?: string | null;
	userAgent?: string | null;
	searchedAt: string;
}

export interface RecentSearchesResponse {
	total: number;
	searches: SearchLogDto[];
}

export interface PopularSearchDto {
	query: string;
	count: number;
}

export interface PopularSearchesResponse {
	period: string;
	entityType: string;
	top: number;
	searches: PopularSearchDto[];
}

export interface SearchStatsByEntityType {
	entityType: string;
	count: number;
	percentage: number;
}

export interface SearchStatsResponse {
	period: string;
	totalSearches: number;
	byEntityType: SearchStatsByEntityType[];
}
