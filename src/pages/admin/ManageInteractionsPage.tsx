import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { interactionApi } from '@/lib/api';
import type { CreateInteractionDto, DrugSearchDto } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DrugSearchInput } from '@/components/DrugSearchInput';
import { SeverityBadge } from '@/components/SeverityBadge';
import { Plus, Loader2, CheckCircle, X } from 'lucide-react';

export function ManageInteractionsPage() {
  const [drug1, setDrug1] = useState<DrugSearchDto | null>(null);
  const [drug2, setDrug2] = useState<DrugSearchDto | null>(null);
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [mechanism, setMechanism] = useState('');
  const [clinicalEffects, setClinicalEffects] = useState('');
  const [managementRecommendations, setManagementRecommendations] = useState('');

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: interactionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions'] });
      // Reset form
      setDrug1(null);
      setDrug2(null);
      setSeverity('Moderate');
      setMechanism('');
      setClinicalEffects('');
      setManagementRecommendations('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drug1 || !drug2) return;

    const data: CreateInteractionDto = {
      drug1Id: drug1.id,
      drug2Id: drug2.id,
      severity,
      mechanism,
      clinicalEffects,
      managementRecommendations,
    };

    createMutation.mutate(data);
  };

  const canSubmit = drug1 && drug2 && mechanism && clinicalEffects && managementRecommendations;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Manage Drug Interactions</h1>
        <p className="text-muted-foreground">Create and manage drug-drug interaction data</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Interaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Drug 1 *</Label>
                    {drug1 ? (
                      <div className="mt-2 flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="font-medium">{drug1.activeIngredient}</p>
                          <p className="text-sm text-muted-foreground">{drug1.brandName}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setDrug1(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <DrugSearchInput
                          onSelect={setDrug1}
                          placeholder="Search for first drug..."
                          excludeIds={drug2 ? [drug2.id] : []}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Drug 2 *</Label>
                    {drug2 ? (
                      <div className="mt-2 flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="font-medium">{drug2.activeIngredient}</p>
                          <p className="text-sm text-muted-foreground">{drug2.brandName}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setDrug2(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <DrugSearchInput
                          onSelect={setDrug2}
                          placeholder="Search for second drug..."
                          excludeIds={drug1 ? [drug1.id] : []}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="severity">Severity *</Label>
                  <Select value={severity} onValueChange={(value: string) => setSeverity(value as 'Mild' | 'Moderate' | 'Severe')}>
                    <SelectTrigger id="severity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mild">Mild</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mechanism">Mechanism *</Label>
                  <Textarea
                    id="mechanism"
                    required
                    value={mechanism}
                    onChange={(e) => setMechanism(e.target.value)}
                    placeholder="Describe the mechanism of the interaction..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="clinicalEffects">Clinical Effects *</Label>
                  <Textarea
                    id="clinicalEffects"
                    required
                    value={clinicalEffects}
                    onChange={(e) => setClinicalEffects(e.target.value)}
                    placeholder="Describe the clinical effects of the interaction..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="managementRecommendations">Management Recommendations *</Label>
                  <Textarea
                    id="managementRecommendations"
                    required
                    value={managementRecommendations}
                    onChange={(e) => setManagementRecommendations(e.target.value)}
                    placeholder="Provide management recommendations..."
                    rows={3}
                  />
                </div>

                <Button type="submit" disabled={!canSubmit || createMutation.isPending} className="w-full">
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Interaction
                    </>
                  )}
                </Button>

                {createMutation.isSuccess && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Interaction created successfully!</AlertDescription>
                  </Alert>
                )}

                {createMutation.isError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Failed to create interaction. Please try again.
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {drug1 && drug2 ? (
                <>
                  <div>
                    <p className="mb-2 text-sm font-medium">Interaction Between:</p>
                    <div className="space-y-2 rounded-lg border p-3">
                      <p className="font-medium">{drug1.activeIngredient}</p>
                      <p className="text-center text-muted-foreground">↔</p>
                      <p className="font-medium">{drug2.activeIngredient}</p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium">Severity:</p>
                    <SeverityBadge severity={severity} />
                  </div>

                  {mechanism && (
                    <div>
                      <p className="mb-1 text-sm font-medium">Mechanism:</p>
                      <p className="text-sm text-muted-foreground">{mechanism}</p>
                    </div>
                  )}

                  {clinicalEffects && (
                    <div>
                      <p className="mb-1 text-sm font-medium">Clinical Effects:</p>
                      <p className="text-sm text-muted-foreground">{clinicalEffects}</p>
                    </div>
                  )}

                  {managementRecommendations && (
                    <div>
                      <p className="mb-1 text-sm font-medium">Management:</p>
                      <p className="text-sm text-muted-foreground">
                        {managementRecommendations}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select two drugs to see preview
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Select two different drugs</p>
              <p>• Choose appropriate severity level</p>
              <p>• Provide detailed mechanism</p>
              <p>• Describe clinical manifestations</p>
              <p>• Include management strategies</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
