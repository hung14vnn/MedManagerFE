import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { diseaseApi } from '@/lib/api';
import type { CreateDiseaseDto, CreateDiseaseProtocolDto, DrugSearchDto, DiseaseDto } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DrugSearchInput } from '@/components/DrugSearchInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Loader2, CheckCircle, FileText } from 'lucide-react';

export function ManageDiseasesPage() {
  const [isCreateDiseaseOpen, setIsCreateDiseaseOpen] = useState(false);
  const [isCreateProtocolOpen, setIsCreateProtocolOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: diseases, isLoading } = useQuery({
    queryKey: ['diseases'],
    queryFn: diseaseApi.getAll,
  });

  const createDiseaseMutation = useMutation({
    mutationFn: diseaseApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diseases'] });
      setIsCreateDiseaseOpen(false);
    },
  });

  const createProtocolMutation = useMutation({
    mutationFn: diseaseApi.addProtocol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diseases'] });
      setIsCreateProtocolOpen(false);
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Manage Diseases & Protocols</h1>
          <p className="text-muted-foreground">
            Add diseases and configure treatment protocols
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDiseaseOpen} onOpenChange={setIsCreateDiseaseOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Disease
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Disease</DialogTitle>
              </DialogHeader>
              <DiseaseForm
                onSubmit={(data) => createDiseaseMutation.mutate(data)}
                isSubmitting={createDiseaseMutation.isPending}
              />
              {createDiseaseMutation.isSuccess && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Disease created successfully!</AlertDescription>
                </Alert>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateProtocolOpen} onOpenChange={setIsCreateProtocolOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Protocol
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Treatment Protocol</DialogTitle>
              </DialogHeader>
              <ProtocolForm
                diseases={diseases || []}
                onSubmit={(data) => createProtocolMutation.mutate(data)}
                isSubmitting={createProtocolMutation.isPending}
              />
              {createProtocolMutation.isSuccess && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Protocol created successfully!</AlertDescription>
                </Alert>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="diseases">
        <TabsList>
          <TabsTrigger value="diseases">Diseases</TabsTrigger>
          <TabsTrigger value="protocols">Treatment Protocols</TabsTrigger>
        </TabsList>

        <TabsContent value="diseases" className="mt-6">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : diseases && diseases.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {diseases.map((disease) => (
                <Card key={disease.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {disease.name}
                    </CardTitle>
                    {disease.icdCode && (
                      <p className="text-sm text-muted-foreground">ICD: {disease.icdCode}</p>
                    )}
                  </CardHeader>
                  {disease.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{disease.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No diseases added yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="protocols" className="mt-6">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                View treatment protocols by selecting a disease from the user interface
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface DiseaseFormProps {
  onSubmit: (data: CreateDiseaseDto) => void;
  isSubmitting: boolean;
}

function DiseaseForm({ onSubmit, isSubmitting }: DiseaseFormProps) {
  const [formData, setFormData] = useState<CreateDiseaseDto>({
    name: '',
    icdCode: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Disease Name *</Label>
        <Input
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Hypertension"
        />
      </div>

      <div>
        <Label htmlFor="icdCode">ICD Code</Label>
        <Input
          id="icdCode"
          value={formData.icdCode || ''}
          onChange={(e) => setFormData({ ...formData, icdCode: e.target.value })}
          placeholder="e.g., I10"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the condition..."
          rows={3}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          'Create Disease'
        )}
      </Button>
    </form>
  );
}

interface ProtocolFormProps {
  diseases: DiseaseDto[];
  onSubmit: (data: CreateDiseaseProtocolDto) => void;
  isSubmitting: boolean;
}

function ProtocolForm({ diseases, onSubmit, isSubmitting }: ProtocolFormProps) {
  const [diseaseId, setDiseaseId] = useState<number | null>(null);
  const [drug, setDrug] = useState<DrugSearchDto | null>(null);
  const [isPreferred, setIsPreferred] = useState<boolean>(true);
  const [preferenceOrder, setPreferenceOrder] = useState<number>(1);
  const [dosageRecommendation, setDosageRecommendation] = useState('');
  const [specialConditions, setSpecialConditions] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diseaseId || !drug) return;

    const data: CreateDiseaseProtocolDto = {
      diseaseId,
      drugId: drug.id,
      isPreferred,
      preferenceOrder,
      dosageRecommendation: dosageRecommendation || null,
      specialConditions: specialConditions || null,
      notes: notes || null,
    };

    onSubmit(data);
  };

  const canSubmit = diseaseId && drug;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="disease">Disease *</Label>
        <Select value={diseaseId?.toString() || ''} onValueChange={(value) => setDiseaseId(Number(value))}>
          <SelectTrigger id="disease">
            <SelectValue placeholder="Select disease" />
          </SelectTrigger>
          <SelectContent>
            {diseases.map((disease) => (
              <SelectItem key={disease.id} value={disease.id.toString()}>
                {disease.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Drug *</Label>
        {drug ? (
          <div className="mt-2 rounded-lg border p-3">
            <p className="font-medium">{drug.activeIngredient}</p>
            <p className="text-sm text-muted-foreground">{drug.brandName}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDrug(null)}
              className="mt-2"
            >
              Change Drug
            </Button>
          </div>
        ) : (
          <div className="mt-2">
            <DrugSearchInput onSelect={setDrug} placeholder="Search and select drug..." />
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="isPreferred">Treatment Type *</Label>
          <Select
            value={isPreferred ? 'preferred' : 'alternative'}
            onValueChange={(value) => setIsPreferred(value === 'preferred')}
          >
            <SelectTrigger id="isPreferred">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="preferred">Preferred</SelectItem>
              <SelectItem value="alternative">Alternative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="preferenceOrder">Preference Order *</Label>
          <Input
            id="preferenceOrder"
            type="number"
            min="1"
            value={preferenceOrder}
            onChange={(e) => setPreferenceOrder(Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="dosageRecommendation">Dosage Recommendation</Label>
        <Textarea
          id="dosageRecommendation"
          value={dosageRecommendation}
          onChange={(e) => setDosageRecommendation(e.target.value)}
          placeholder="Recommended dosage for this condition..."
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="specialConditions">Special Conditions</Label>
        <Textarea
          id="specialConditions"
          value={specialConditions}
          onChange={(e) => setSpecialConditions(e.target.value)}
          placeholder="Any special conditions or considerations..."
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes or guidelines..."
          rows={2}
        />
      </div>

      <Button type="submit" disabled={!canSubmit || isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Create Protocol
          </>
        )}
      </Button>
    </form>
  );
}
