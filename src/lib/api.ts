import { apiClient } from '@/lib/api-client';
import type {
  DrugSearchDto,
  DrugDetailDto,
  CreateDrugDto,
  CreateReferenceDto,
  InteractionCheckRequest,
  InteractionCheckResponse,
  InteractionDetailDto,
  CreateInteractionDto,
  DiseaseDto,
  DiseaseTreatmentDto,
  CreateDiseaseDto,
  CreateDiseaseProtocolDto,
} from '@/types/api';

// Drug API
export const drugApi = {
  search: async (term: string): Promise<DrugSearchDto[]> => {
    const response = await apiClient.get(`/api/drugs`, {
      params: { search: term },
    });
    return response.data;
  },

  getById: async (id: number): Promise<DrugDetailDto> => {
    const response = await apiClient.get(`/api/drugs/${id}`);
    return response.data;
  },

  create: async (drug: CreateDrugDto): Promise<DrugDetailDto> => {
    const response = await apiClient.post('/api/drugs', drug);
    return response.data;
  },

  update: async (id: number, drug: CreateDrugDto): Promise<DrugDetailDto> => {
    const response = await apiClient.put(`/api/drugs/${id}`, drug);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/drugs/${id}`);
  },

  addReference: async (drugId: number, reference: CreateReferenceDto): Promise<void> => {
    await apiClient.post(`/api/drugs/${drugId}/references`, reference);
  },
};

// Interaction API
export const interactionApi = {
  check: async (request: InteractionCheckRequest): Promise<InteractionCheckResponse> => {
    const response = await apiClient.post('/api/interactions/check', request);
    return response.data;
  },

  getById: async (id: number): Promise<InteractionDetailDto> => {
    const response = await apiClient.get(`/api/interactions/${id}`);
    return response.data;
  },

  create: async (interaction: CreateInteractionDto): Promise<InteractionDetailDto> => {
    const response = await apiClient.post('/api/interactions', interaction);
    return response.data;
  },

  addReference: async (interactionId: number, reference: CreateReferenceDto): Promise<void> => {
    await apiClient.post(`/api/interactions/${interactionId}/references`, reference);
  },
};

// Disease API
export const diseaseApi = {
  getAll: async (): Promise<DiseaseDto[]> => {
    const response = await apiClient.get('/api/diseases');
    return response.data;
  },

  getTreatment: async (id: number): Promise<DiseaseTreatmentDto> => {
    const response = await apiClient.get(`/api/diseases/${id}/treatment`);
    return response.data;
  },

  create: async (disease: CreateDiseaseDto): Promise<DiseaseDto> => {
    const response = await apiClient.post('/api/diseases', disease);
    return response.data;
  },

  addProtocol: async (protocol: CreateDiseaseProtocolDto): Promise<void> => {
    await apiClient.post('/api/diseases/protocols', protocol);
  },
};
