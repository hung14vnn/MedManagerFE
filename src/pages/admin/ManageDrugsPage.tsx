import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { drugApi } from '@/lib/api';
import type { CreateDrugDto, DrugDetailDto } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Plus, Edit, Trash2, Loader2, CheckCircle } from 'lucide-react';
import { debounce } from '@/lib/helpers';

export function ManageDrugsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDrug, setEditingDrug] = useState<DrugDetailDto | null>(null);
  const queryClient = useQueryClient();

  const { data: drugs, isLoading } = useQuery({
    queryKey: ['drugs', 'search', debouncedTerm],
    queryFn: () => drugApi.search(debouncedTerm),
    enabled: debouncedTerm.length >= 2,
  });

  const createMutation = useMutation({
    mutationFn: drugApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
      setIsCreateOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateDrugDto }) => drugApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
      setEditingDrug(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: drugApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
    },
  });

  const handleSearch = useMemo(
    () => debounce((value: string) => {
      setDebouncedTerm(value);
    }, 300),
    []
  );

  useEffect(() => {
    return () => handleSearch.cancel?.();
  }, [handleSearch]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this drug?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Manage Drugs</h1>
          <p className="text-muted-foreground">Add, edit, and manage drug information</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Drug
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>Add New Drug</DialogTitle>
            </DialogHeader>
            <DrugForm
              onSubmit={(data) => createMutation.mutate(data)}
              isSubmitting={createMutation.isPending}
              submitLabel="Create Drug"
            />
            {createMutation.isSuccess && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>Drug created successfully!</AlertDescription>
              </Alert>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Search Drugs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, ingredient, or group..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : drugs && drugs.length > 0 ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Active Ingredient</TableHead>
                <TableHead>Brand Name</TableHead>
                <TableHead>Pharmacological Group</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drugs.map((drug) => (
                <TableRow key={drug.id}>
                  <TableCell className="font-medium">{drug.activeIngredient}</TableCell>
                  <TableCell>{drug.brandName}</TableCell>
                  <TableCell>{drug.pharmacologicalGroup || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              const detail = await drugApi.getById(drug.id);
                              setEditingDrug(detail);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto bg-white">
                          <DialogHeader>
                            <DialogTitle>Edit Drug</DialogTitle>
                          </DialogHeader>
                          {editingDrug && (
                            <>
                              <DrugForm
                                initialData={editingDrug}
                                onSubmit={(data) =>
                                  updateMutation.mutate({ id: editingDrug.id, data })
                                }
                                isSubmitting={updateMutation.isPending}
                                submitLabel="Update Drug"
                              />
                              {updateMutation.isSuccess && (
                                <Alert>
                                  <CheckCircle className="h-4 w-4" />
                                  <AlertDescription>Drug updated successfully!</AlertDescription>
                                </Alert>
                              )}
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(drug.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : searchTerm.length >= 2 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No drugs found matching "{searchTerm}"</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Enter at least 2 characters to search</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface DrugFormProps {
  initialData?: Partial<CreateDrugDto>;
  onSubmit: (data: CreateDrugDto) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

function DrugForm({ initialData, onSubmit, isSubmitting, submitLabel }: DrugFormProps) {
  const [formData, setFormData] = useState<CreateDrugDto>({
    activeIngredient: initialData?.activeIngredient || '',
    brandName: initialData?.brandName || '',
    pharmacologicalGroup: initialData?.pharmacologicalGroup || '',
    indications: initialData?.indications || '',
    contraindications: initialData?.contraindications || '',
    dosageAdults: initialData?.dosageAdults || '',
    dosageChildren: initialData?.dosageChildren || '',
    dosageHepaticImpairment: initialData?.dosageHepaticImpairment || '',
    dosageRenalImpairment: initialData?.dosageRenalImpairment || '',
    adverseEffects: initialData?.adverseEffects || '',
    pregnancyPrecautions: initialData?.pregnancyPrecautions || '',
    breastfeedingPrecautions: initialData?.breastfeedingPrecautions || '',
    otherPrecautions: initialData?.otherPrecautions || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="activeIngredient">Active Ingredient *</Label>
          <Input
            id="activeIngredient"
            required
            value={formData.activeIngredient}
            onChange={(e) => setFormData({ ...formData, activeIngredient: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="brandName">Brand Name *</Label>
          <Input
            id="brandName"
            required
            value={formData.brandName}
            onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="pharmacologicalGroup">Pharmacological Group</Label>
        <Input
          id="pharmacologicalGroup"
          value={formData.pharmacologicalGroup || ''}
          onChange={(e) => setFormData({ ...formData, pharmacologicalGroup: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="indications">Indications</Label>
        <Textarea
          id="indications"
          value={formData.indications || ''}
          onChange={(e) => setFormData({ ...formData, indications: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="contraindications">Contraindications</Label>
        <Textarea
          id="contraindications"
          value={formData.contraindications || ''}
          onChange={(e) => setFormData({ ...formData, contraindications: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="dosageAdults">Dosage (Adults)</Label>
          <Textarea
            id="dosageAdults"
            value={formData.dosageAdults || ''}
            onChange={(e) => setFormData({ ...formData, dosageAdults: e.target.value })}
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor="dosageChildren">Dosage (Children)</Label>
          <Textarea
            id="dosageChildren"
            value={formData.dosageChildren || ''}
            onChange={(e) => setFormData({ ...formData, dosageChildren: e.target.value })}
            rows={2}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="dosageHepaticImpairment">Dosage (Hepatic Impairment)</Label>
          <Textarea
            id="dosageHepaticImpairment"
            value={formData.dosageHepaticImpairment || ''}
            onChange={(e) => setFormData({ ...formData, dosageHepaticImpairment: e.target.value })}
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor="dosageRenalImpairment">Dosage (Renal Impairment)</Label>
          <Textarea
            id="dosageRenalImpairment"
            value={formData.dosageRenalImpairment || ''}
            onChange={(e) => setFormData({ ...formData, dosageRenalImpairment: e.target.value })}
            rows={2}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="adverseEffects">Adverse Effects</Label>
        <Textarea
          id="adverseEffects"
          value={formData.adverseEffects || ''}
          onChange={(e) => setFormData({ ...formData, adverseEffects: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pregnancyPrecautions">Pregnancy Precautions</Label>
          <Textarea
            id="pregnancyPrecautions"
            value={formData.pregnancyPrecautions || ''}
            onChange={(e) => setFormData({ ...formData, pregnancyPrecautions: e.target.value })}
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor="breastfeedingPrecautions">Breastfeeding Precautions</Label>
          <Textarea
            id="breastfeedingPrecautions"
            value={formData.breastfeedingPrecautions || ''}
            onChange={(e) =>
              setFormData({ ...formData, breastfeedingPrecautions: e.target.value })
            }
            rows={2}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="otherPrecautions">Other Precautions</Label>
        <Textarea
          id="otherPrecautions"
          value={formData.otherPrecautions || ''}
          onChange={(e) => setFormData({ ...formData, otherPrecautions: e.target.value })}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
