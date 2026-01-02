import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { diseaseApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Loader2, CheckCircle2, Circle } from 'lucide-react';

export function DiseaseTreatmentPage() {
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<number | null>(null);

  const { data: diseases, isLoading: isLoadingDiseases } = useQuery({
    queryKey: ['diseases'],
    queryFn: diseaseApi.getAll,
  });

  const { data: treatment, isLoading: isLoadingTreatment } = useQuery({
    queryKey: ['diseases', selectedDiseaseId, 'treatment'],
    queryFn: () => diseaseApi.getTreatment(selectedDiseaseId!),
    enabled: !!selectedDiseaseId,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="mb-2 text-3xl font-bold">Quy trình điều trị bệnh</h1>
        <p className="text-muted-foreground">
          Xem quy trình điều trị dựa trên bằng chứng và khuyến nghị sử dụng thuốc
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Chọn bệnh</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingDiseases ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Select
                value={selectedDiseaseId?.toString() || ''}
                onValueChange={(value: string) => setSelectedDiseaseId(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn bệnh hoặc tình trạng" />
                </SelectTrigger>
                <SelectContent>
                  {diseases?.map((disease) => (
                    <SelectItem key={disease.id} value={disease.id.toString()}>
                      {disease.name}
                      {disease.icdCode && (
                        <span className="ml-2 text-muted-foreground">({disease.icdCode})</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {isLoadingTreatment ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : treatment ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {treatment.disease.name}
              </CardTitle>
              {treatment.disease.icdCode && (
                <Badge variant="outline">{treatment.disease.icdCode}</Badge>
              )}
            </CardHeader>
            {treatment.disease.description && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{treatment.disease.description}</p>
              </CardContent>
            )}
          </Card>

          {treatment.preferredDrugs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-5 w-5" />
                    Lựa chọn điều trị ưu tiên
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {treatment.preferredDrugs.map((item, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-lg border border-green-200 bg-green-50 p-4"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-green-900">
                              {item.drug.activeIngredient}
                            </h3>
                            <p className="text-sm text-green-700">{item.drug.brandName}</p>
                            {item.drug.pharmacologicalGroup && (
                              <Badge variant="outline" className="mt-1 border-green-300">
                                {item.drug.pharmacologicalGroup}
                              </Badge>
                            )}
                          </div>
                          <Badge className="bg-green-600">Ưu tiên</Badge>
                        </div>

                        {item.dosageRecommendation && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-green-900">
                              Khuyến nghị liều lượng:
                            </p>
                            <p className="text-sm text-green-700">{item.dosageRecommendation}</p>
                          </div>
                        )}

                        {item.specialConditions && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-green-900">Tình trạng đặc biệt:</p>
                            <p className="text-sm text-green-700">{item.specialConditions}</p>
                          </div>
                        )}

                        {item.notes && (
                          <Alert className="mt-3 border-green-300 bg-green-100">
                            <AlertDescription className="text-sm text-green-800">
                              {item.notes}
                            </AlertDescription>
                          </Alert>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {treatment.alternativeDrugs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Circle className="h-5 w-5" />
                    Lựa chọn điều trị thay thế
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {treatment.alternativeDrugs.map((item, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-lg border border-blue-200 bg-blue-50 p-4"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-blue-900">
                              {item.drug.activeIngredient}
                            </h3>
                            <p className="text-sm text-blue-700">{item.drug.brandName}</p>
                            {item.drug.pharmacologicalGroup && (
                              <Badge variant="outline" className="mt-1 border-blue-300">
                                {item.drug.pharmacologicalGroup}
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline" className="border-blue-600 text-blue-700">
                            Thay thế
                          </Badge>
                        </div>

                        {item.dosageRecommendation && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-blue-900">
                              Khuyến nghị liều lượng:
                            </p>
                            <p className="text-sm text-blue-700">{item.dosageRecommendation}</p>
                          </div>
                        )}

                        {item.specialConditions && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-blue-900">Tình trạng đặc biệt:</p>
                            <p className="text-sm text-blue-700">{item.specialConditions}</p>
                          </div>
                        )}

                        {item.notes && (
                          <Alert className="mt-3 border-blue-300 bg-blue-100">
                            <AlertDescription className="text-sm text-blue-800">
                              {item.notes}
                            </AlertDescription>
                          </Alert>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {treatment.preferredDrugs.length === 0 && treatment.alternativeDrugs.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Chưa có quy trình điều trị cho tình trạng này.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              Chọn bệnh từ danh sách để xem quy trình điều trị
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
