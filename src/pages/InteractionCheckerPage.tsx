import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { interactionApi } from '@/lib/api';
import type { DrugSearchDto, InteractionCheckResponse } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DrugSearchInput } from '@/components/DrugSearchInput';
import { SeverityBadge } from '@/components/SeverityBadge';
import { Badge } from '@/components/ui/badge';
import { X, Plus, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

export function InteractionCheckerPage() {
  const [selectedDrugs, setSelectedDrugs] = useState<DrugSearchDto[]>([]);
  const [checkResult, setCheckResult] = useState<InteractionCheckResponse | null>(null);

  const checkMutation = useMutation({
    mutationFn: (drugIds: number[]) => interactionApi.check({ drugIds }),
    onSuccess: (data) => {
      setCheckResult(data);
    },
  });

  const handleAddDrug = (drug: DrugSearchDto) => {
    if (!selectedDrugs.find((d) => d.id === drug.id)) {
      setSelectedDrugs([...selectedDrugs, drug]);
      setCheckResult(null);
    }
  };

  const handleRemoveDrug = (drugId: number) => {
    setSelectedDrugs(selectedDrugs.filter((d) => d.id !== drugId));
    setCheckResult(null);
  };

  const handleCheckInteractions = () => {
    if (selectedDrugs.length >= 2) {
      checkMutation.mutate(selectedDrugs.map((d) => d.id));
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 md:mb-8"
      >
        <h1 className="mb-2 text-2xl md:text-3xl font-bold text-green-900">Kiểm tra tương tác thuốc</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Thêm nhiều loại thuốc để kiểm tra tương tác tiềm ẩn
        </p>
      </motion.div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Plus className="h-4 w-4 md:h-5 md:w-5" />
                Thêm thuốc
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DrugSearchInput
                onSelect={handleAddDrug}
                placeholder="Tìm kiếm và thêm thuốc..."
                excludeIds={selectedDrugs.map((d) => d.id)}
              />

              <div className="space-y-2">
                <p className="text-xs md:text-sm font-medium">
                  Thuốc đã chọn ({selectedDrugs.length})
                </p>
                {selectedDrugs.length > 0 ? (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {selectedDrugs.map((drug, index) => (
                        <motion.div
                          key={drug.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between rounded-lg border p-2 md:p-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm font-medium truncate">{drug.name}</p>
                            <p className="text-xs text-muted-foreground">Mã: {drug.code}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDrug(drug.id)}
                            className="shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <p className="text-xs md:text-sm text-muted-foreground">Chưa chọn thuốc nào</p>
                )}
              </div>

              <Button
                onClick={handleCheckInteractions}
                disabled={selectedDrugs.length < 2 || checkMutation.isPending}
                className="w-full h-11"
              >
                {checkMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang kiểm tra...
                  </>
                ) : (
                  'Kiểm tra tương tác'
                )}
              </Button>

              {selectedDrugs.length < 2 && (
                <p className="text-xs text-muted-foreground text-center">
                  Thêm ít nhất 2 loại thuốc để kiểm tra tương tác
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          {checkResult ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <Alert
                variant={
                  checkResult.overallSeverity === 'Severe'
                    ? 'destructive'
                    : checkResult.overallSeverity === 'None'
                      ? 'default'
                      : 'default'
                }
                className={
                  checkResult.overallSeverity === 'Moderate'
                    ? 'border-orange-300 bg-orange-50'
                    : ''
                }
              >
                {checkResult.overallSeverity === 'None' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
                <AlertTitle className="flex items-center gap-2">
                  Mức độ nghiêm trọng:{' '}
                  <SeverityBadge severity={checkResult.overallSeverity} />
                </AlertTitle>
                <AlertDescription>
                  {checkResult.interactions.length === 0
                    ? 'Không tìm thấy tương tác giữa các loại thuốc đã chọn.'
                    : `Tìm thấy ${checkResult.interactions.length} tương tác có thể xảy ra.`}
                </AlertDescription>
              </Alert>

              <AnimatePresence>
                {checkResult.interactions.map((interaction, index) => (
                  <motion.div
                    key={interaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                          <CardTitle className="text-base md:text-lg">
                            {interaction.drug1.name} ↔{' '}
                            {interaction.drug2.name}
                          </CardTitle>
                          <SeverityBadge severity={interaction.severity} className="self-start" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 md:space-y-4">
                        <div>
                          <h4 className="mb-1 text-sm md:text-base font-semibold">Cơ chế</h4>
                          <p className="text-xs md:text-sm text-muted-foreground">{interaction.mechanism}</p>
                        </div>

                        <div>
                          <h4 className="mb-1 text-sm md:text-base font-semibold">Hiệu quả lâm sàng</h4>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {interaction.clinicalEffects}
                          </p>
                        </div>

                        <div>
                          <h4 className="mb-1 text-sm md:text-base font-semibold">Khuyến nghị xử lý</h4>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {interaction.managementRecommendations}
                          </p>
                        </div>

                        {interaction.interactionMechanisms && interaction.interactionMechanisms.length > 0 && (
                          <div>
                            <h4 className="mb-2 text-sm font-semibold">Cơ chế chi tiết</h4>
                            <div className="space-y-2">
                              {interaction.interactionMechanisms.map((im, i) => (
                                <div key={i} className="rounded-md border bg-muted/30 p-2">
                                  <div className="mb-1 flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
                                      {im.mechanismType}
                                    </span>
                                    <Badge variant="outline" className="text-[10px] h-4 shrink-0">
                                      {im.mechanism.code}
                                    </Badge>
                                  </div>
                                  <p className="text-xs font-medium">{im.mechanism.name}</p>
                                  <p className="mt-1 text-xs text-muted-foreground">{im.interactionText}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {interaction.references.length > 0 && (
                          <div>
                            <h4 className="mb-2 text-sm md:text-base font-semibold">Tham khảo</h4>
                            <div className="space-y-2">
                              {interaction.references.map((ref) => (
                                <div key={ref.id} className="rounded border p-2 text-xs md:text-sm">
                                  <p className="font-medium">{ref.title}</p>
                                  {ref.authors && (
                                    <p className="text-xs text-muted-foreground">{ref.authors}</p>
                                  )}
                                  {ref.url && (
                                    <a
                                      href={ref.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-primary hover:underline"
                                    >
                                      Xem nguồn
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
                <AlertTriangle className="mb-4 h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
                <p className="text-sm md:text-base text-muted-foreground px-4">
                  Thêm thuốc và nhấp "Kiểm tra tương tác" để xem tương tác thuốc có thể xảy ra
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
