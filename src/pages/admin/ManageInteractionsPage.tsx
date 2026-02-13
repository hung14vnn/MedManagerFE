import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { interactionApi } from '@/lib/api';
import type { CreateInteractionDto, DrugSearchDto } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DrugSearchInput } from '@/components/DrugSearchInput';
import { SeverityBadge } from '@/components/SeverityBadge';
import { Plus, Loader2, X, Search } from 'lucide-react';
import { toast } from 'sonner';

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
      toast.success('Tạo tương tác thuốc thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tạo tương tác thuốc thất bại');
    }
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Quản lý Tương tác thuốc</h1>
        <p className="text-muted-foreground">Tạo và quản lý dữ liệu tương tác giữa các loại thuốc</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Thêm tương tác mới
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-base">Thuốc thứ nhất *</Label>
                    {drug1 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-2 flex items-center justify-between rounded-lg border-2 border-primary/20 bg-primary/5 p-4 shadow-sm"
                      >
                        <div>
                          <p className="font-bold text-primary">{drug1.name}</p>
                          <p className="text-sm text-muted-foreground font-mono">Mã: {drug1.code}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setDrug1(null)}
                          className="hover:bg-red-100 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ) : (
                      <div className="mt-2">
                        <DrugSearchInput
                          onSelect={setDrug1}
                          placeholder="Tìm kiếm thuốc thứ nhất..."
                          excludeIds={drug2 ? [drug2.id] : []}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base">Thuốc thứ hai *</Label>
                    {drug2 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-2 flex items-center justify-between rounded-lg border-2 border-primary/20 bg-primary/5 p-4 shadow-sm"
                      >
                        <div>
                          <p className="font-bold text-primary">{drug2.name}</p>
                          <p className="text-sm text-muted-foreground font-mono">Mã: {drug2.code}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setDrug2(null)}
                          className="hover:bg-red-100 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ) : (
                      <div className="mt-2">
                        <DrugSearchInput
                          onSelect={setDrug2}
                          placeholder="Tìm kiếm thuốc thứ hai..."
                          excludeIds={drug1 ? [drug1.id] : []}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity" className="text-base">Mức độ nghiêm trọng *</Label>
                  <Select value={severity} onValueChange={(value: string) => setSeverity(value as 'Mild' | 'Moderate' | 'Severe')}>
                    <SelectTrigger id="severity" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mild">Nhẹ (Mild)</SelectItem>
                      <SelectItem value="Moderate">Trung bình (Moderate)</SelectItem>
                      <SelectItem value="Severe">Nghiêm trọng (Severe)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mechanism" className="text-base">Cơ chế tương tác *</Label>
                  <Textarea
                    id="mechanism"
                    required
                    value={mechanism}
                    onChange={(e) => setMechanism(e.target.value)}
                    placeholder="Mô tả cơ chế của tương tác thuốc..."
                    rows={3}
                    className="resize-none focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinicalEffects" className="text-base">Hậu quả lâm sàng *</Label>
                  <Textarea
                    id="clinicalEffects"
                    required
                    value={clinicalEffects}
                    onChange={(e) => setClinicalEffects(e.target.value)}
                    placeholder="Mô tả các biểu hiện hoặc hậu quả lâm sàng..."
                    rows={3}
                    className="resize-none focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="managementRecommendations" className="text-base">Khuyến cáo quản lý *</Label>
                  <Textarea
                    id="managementRecommendations"
                    required
                    value={managementRecommendations}
                    onChange={(e) => setManagementRecommendations(e.target.value)}
                    placeholder="Đưa ra các hướng dẫn xử trí, quản lý..."
                    rows={3}
                    className="resize-none focus:ring-primary"
                  />
                </div>

                <Button type="submit" disabled={!canSubmit || createMutation.isPending} className="w-full h-12 text-lg">
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Tạo tương tác
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Xem trước</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {drug1 && drug2 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <p className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tương tác giữa:</p>
                    <div className="space-y-3 rounded-xl border bg-muted/30 p-4 text-center">
                      <p className="font-bold text-lg">{drug1.name}</p>
                      <div className="flex items-center justify-center">
                        <div className="h-px flex-1 bg-border" />
                        <span className="px-3 text-2xl text-primary font-bold">↔</span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <p className="font-bold text-lg">{drug2.name}</p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Mức độ:</p>
                    <SeverityBadge severity={severity} />
                  </div>

                  {mechanism && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                      <p className="mb-1 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Cơ chế:</p>
                      <p className="text-sm leading-relaxed">{mechanism}</p>
                    </motion.div>
                  )}

                  {clinicalEffects && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                      <p className="mb-1 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Hậu quả:</p>
                      <p className="text-sm leading-relaxed">{clinicalEffects}</p>
                    </motion.div>
                  )}

                  {managementRecommendations && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <p className="mb-1 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quản lý:</p>
                      <p className="text-sm leading-relaxed">{managementRecommendations}</p>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-8 w-8 opacity-20" />
                  </div>
                  <p className="text-sm">Chọn hai loại thuốc để xem trước thông tin tương tác</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hướng dẫn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p>Chọn hai tên thuốc (biệt dược hoặc hoạt chất) khác nhau.</p>
              </div>
              <div className="flex gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p>Chọn mức độ nghiêm trọng phù hợp dựa trên tài liệu tham khảo.</p>
              </div>
              <div className="flex gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p>Mô tả chi tiết cơ chế dược học nếu có.</p>
              </div>
              <div className="flex gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p>Nêu rõ các triệu chứng lâm sàng cần theo dõi.</p>
              </div>
              <div className="flex gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p>Cung cấp các chiến lược xử trí (thay thế, điều chỉnh liều, giãn cách thời gian).</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
