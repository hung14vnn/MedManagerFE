import { apiClient } from "@/lib/api-client";
import type {
	DrugSearchDto,
	DrugDetailDto,
	CreateDrugDto,
	UpdateDrugDto,
	CreateReferenceDto,
	InteractionCheckRequest,
	InteractionCheckResponse,
	InteractionDetailDto,
	CreateInteractionDto,
	DiseaseDto,
	DiseaseTreatmentDto,
	CreateDiseaseDto,
	CreateDiseaseProtocolDto,
	IngredientDto,
	CreateIngredientDto,
	DosageFormDto,
	CreateDosageFormDto,
	RouteInformationDto,
	CreateRouteDto,
	MechanismDto,
	CreateMechanismDto,
	SearchLogDto,
	RecentSearchesResponse,
	PopularSearchesResponse,
	SearchStatsResponse,
} from "@/types/api";

// Drug API
export const drugApi = {
	getAll: async (
		page = 1,
		pageSize = 50
	): Promise<{ data: DrugSearchDto[]; total: number }> => {
		const response = await apiClient.get("/drugs/all", {
			params: { page, pageSize },
		});
		return response.data;
	},

	search: async (term: string): Promise<DrugSearchDto[]> => {
		const response = await apiClient.get(`/drugs`, {
			params: { search: term },
		});
		return response.data;
	},

	getById: async (id: number): Promise<DrugDetailDto> => {
		const response = await apiClient.get(`/drugs/${id}`);
		return response.data;
	},

	create: async (drug: CreateDrugDto): Promise<DrugDetailDto> => {
		const response = await apiClient.post("/drugs", drug);
		return response.data;
	},

	update: async (id: number, drug: UpdateDrugDto): Promise<DrugDetailDto> => {
		const response = await apiClient.put(`/drugs/${id}`, drug);
		return response.data;
	},

	delete: async (id: number): Promise<void> => {
		await apiClient.delete(`/drugs/${id}`);
	},

	addReference: async (
		drugId: number,
		reference: CreateReferenceDto
	): Promise<void> => {
		await apiClient.post(`/drugs/${drugId}/references`, reference);
	},
};

// Ingredient API
export const ingredientApi = {
	getAll: async (
		page = 1,
		pageSize = 50
	): Promise<{ data: IngredientDto[]; total: number }> => {
		const response = await apiClient.get("/ingredients", {
			params: { page, pageSize },
		});
		return response.data;
	},

	search: async (query: string): Promise<IngredientDto[]> => {
		const response = await apiClient.get("/ingredients/search", {
			params: { q: query },
		});
		return response.data;
	},

	getById: async (id: number): Promise<IngredientDto> => {
		const response = await apiClient.get(`/ingredients/${id}`);
		return response.data;
	},

	create: async (ingredient: CreateIngredientDto): Promise<IngredientDto> => {
		const response = await apiClient.post("/ingredients", ingredient);
		return response.data;
	},

	update: async (
		id: number,
		ingredient: CreateIngredientDto
	): Promise<IngredientDto> => {
		const response = await apiClient.put(`/ingredients/${id}`, ingredient);
		return response.data;
	},

	delete: async (id: number): Promise<void> => {
		await apiClient.delete(`/ingredients/${id}`);
	},
};

// Dosage Form API
export const dosageFormApi = {
	getAll: async (): Promise<DosageFormDto[]> => {
		const response = await apiClient.get("/dosageforms");
		return response.data;
	},

	getById: async (id: number): Promise<DosageFormDto> => {
		const response = await apiClient.get(`/dosageforms/${id}`);
		return response.data;
	},

	create: async (form: CreateDosageFormDto): Promise<DosageFormDto> => {
		const response = await apiClient.post("/dosageforms", form);
		return response.data;
	},

	update: async (
		id: number,
		form: CreateDosageFormDto
	): Promise<DosageFormDto> => {
		const response = await apiClient.put(`/dosageforms/${id}`, form);
		return response.data;
	},

	delete: async (id: number): Promise<void> => {
		await apiClient.delete(`/dosageforms/${id}`);
	},
};

// Route API
export const routeApi = {
	getAll: async (): Promise<RouteInformationDto[]> => {
		const response = await apiClient.get("/routes");
		return response.data;
	},

	getById: async (id: number): Promise<RouteInformationDto> => {
		const response = await apiClient.get(`/routes/${id}`);
		return response.data;
	},

	create: async (route: CreateRouteDto): Promise<RouteInformationDto> => {
		const response = await apiClient.post("/routes", route);
		return response.data;
	},

	update: async (
		id: number,
		route: CreateRouteDto
	): Promise<RouteInformationDto> => {
		const response = await apiClient.put(`/routes/${id}`, route);
		return response.data;
	},

	delete: async (id: number): Promise<void> => {
		await apiClient.delete(`/routes/${id}`);
	},
};

// Mechanism API
export const mechanismApi = {
	getAll: async (): Promise<MechanismDto[]> => {
		const response = await apiClient.get("/mechanisms");
		return response.data;
	},

	getById: async (id: number): Promise<MechanismDto> => {
		const response = await apiClient.get(`/mechanisms/${id}`);
		return response.data;
	},

	create: async (mechanism: CreateMechanismDto): Promise<MechanismDto> => {
		const response = await apiClient.post("/mechanisms", mechanism);
		return response.data;
	},

	update: async (
		id: number,
		mechanism: CreateMechanismDto
	): Promise<MechanismDto> => {
		const response = await apiClient.put(`/mechanisms/${id}`, mechanism);
		return response.data;
	},

	delete: async (id: number): Promise<void> => {
		await apiClient.delete(`/mechanisms/${id}`);
	},
};

// Search Analytics API (Admin/SuperAdmin only)
export const searchAnalyticsApi = {
	getRecent: async (count = 50): Promise<RecentSearchesResponse> => {
		const response = await apiClient.get("/searchanalytics/recent", {
			params: { count },
		});
		return response.data;
	},

	getPopular: async (
		entityType?: string,
		days = 7,
		top = 10
	): Promise<PopularSearchesResponse> => {
		const response = await apiClient.get("/searchanalytics/popular", {
			params: { entityType, days, top },
		});
		return response.data;
	},

	getStats: async (days = 30): Promise<SearchStatsResponse> => {
		const response = await apiClient.get("/searchanalytics/stats", {
			params: { days },
		});
		return response.data;
	},

	getUserSearches: async (
		userId: string,
		count = 50
	): Promise<SearchLogDto[]> => {
		const response = await apiClient.get(`/searchanalytics/user/${userId}`, {
			params: { count },
		});
		return response.data;
	},
};

// Interaction API
export const interactionApi = {
	check: async (
		request: InteractionCheckRequest
	): Promise<InteractionCheckResponse> => {
		const response = await apiClient.post("/interactions/check", request);
		return response.data;
	},

	getById: async (id: number): Promise<InteractionDetailDto> => {
		const response = await apiClient.get(`/interactions/${id}`);
		return response.data;
	},

	create: async (
		interaction: CreateInteractionDto
	): Promise<InteractionDetailDto> => {
		const response = await apiClient.post("/interactions", interaction);
		return response.data;
	},

	addReference: async (
		interactionId: number,
		reference: CreateReferenceDto
	): Promise<void> => {
		await apiClient.post(
			`/interactions/${interactionId}/references`,
			reference
		);
	},
};

// Disease API
export const diseaseApi = {
	getAll: async (): Promise<DiseaseDto[]> => {
		const response = await apiClient.get("/diseases");
		return response.data;
	},

	getTreatment: async (id: number): Promise<DiseaseTreatmentDto> => {
		const response = await apiClient.get(`/diseases/${id}/treatment`);
		return response.data;
	},

	create: async (disease: CreateDiseaseDto): Promise<DiseaseDto> => {
		const response = await apiClient.post("/diseases", disease);
		return response.data;
	},

	addProtocol: async (protocol: CreateDiseaseProtocolDto): Promise<void> => {
		await apiClient.post("/diseases/protocols", protocol);
	},
};
