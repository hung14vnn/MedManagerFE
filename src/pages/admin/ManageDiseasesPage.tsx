import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { diseaseApi } from '@/lib/api';
import type { CreateDiseaseDto, CreateDiseaseProtocolDto, DrugSearchDto, DiseaseDto } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DrugSearchInput } from '@/components/DrugSearchInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Loader2, FileText, Search, Info } from 'lucide-react';
import { toast } from 'sonner';

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
      toast.success('Thêm mặt bệnh thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Thêm mặt bệnh thất bại');
    }
  });

  const createProtocolMutation = useMutation({
    mutationFn: diseaseApi.addProtocol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diseases'] });
      setIsCreateProtocolOpen(false);
      toast.success('Thêm phác đồ thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Thêm phác đồ thất bại');
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Quản lý Bệnh & Phác đồ</h1>
          <p className="text-muted-foreground">
            Thêm mặt bệnh và cấu hình các phác đồ điều trị tương ứng
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDiseaseOpen} onOpenChange={setIsCreateDiseaseOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                <Plus className="mr-2 h-4 w-4" />
                Thêm Mặt bệnh
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Thêm Mặt bệnh mới</DialogTitle>
              </DialogHeader>
              <DiseaseForm
                onSubmit={(data) => createDiseaseMutation.mutate(data)}
                isSubmitting={createDiseaseMutation.isPending}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateProtocolOpen} onOpenChange={setIsCreateProtocolOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm Phác đồ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white">
              <DialogHeader>
                <DialogTitle>Thêm Phác đồ điều trị</DialogTitle>
              </DialogHeader>
              <ProtocolForm
                diseases={diseases || []}
                onSubmit={(data) => createProtocolMutation.mutate(data)}
                isSubmitting={createProtocolMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="diseases" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="diseases">Mặt bệnh</TabsTrigger>
          <TabsTrigger value="protocols">Phác đồ điều trị</TabsTrigger>
        </TabsList>

        <TabsContent value="diseases" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : diseases && diseases.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {diseases.map((disease, index) => (
                  <motion.div
                    key={disease.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <FileText className="h-5 w-5 text-primary" />
                          {disease.name}
                        </CardTitle>
                        {disease.icdCode && (
                          <div className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold">
                            ICD: {disease.icdCode}
                          </div>
                        )}
                      </CardHeader>
                      {disease.description && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {disease.description}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
                <Info className="h-10 w-10 opacity-20" />
                <p>Chưa có mặt bệnh nào được thêm vào hệ thống</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="protocols" className="mt-6">
          <Card className="border-dashed bg-muted/50">
            <CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <Search className="h-10 w-10 opacity-20" />
              <p>
                Để xem danh sách phác đồ, vui lòng truy cập trang tra cứu thuốc theo nhóm bệnh ở giao diện người dùng
              </p>
              <Button variant="link" asChild>
                <a href="/disease-treatment">Đến trang tra cứu</a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
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
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tên mặt bệnh *</Label>
        <Input
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="VD: Cao huyết áp, Đái tháo đường..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icdCode">Mã ICD</Label>
        <Input
          id="icdCode"
          value={formData.icdCode || ''}
          onChange={(e) => setFormData({ ...formData, icdCode: e.target.value })}
          placeholder="VD: I10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Mô tả ngắn gọn về tình trạng bệnh lý..."
          rows={3}
          className="resize-none"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full h-11">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang tạo...
          </>
        ) : (
          'Tạo Mặt bệnh'
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
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <div className="space-y-2">
        <Label htmlFor="disease">Mặt bệnh *</Label>
        <Select value={diseaseId?.toString() || ''} onValueChange={(value) => setDiseaseId(Number(value))}>
          <SelectTrigger id="disease" className="h-11">
            <SelectValue placeholder="Chọn mặt bệnh" />
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

      <div className="space-y-2">
        <Label className="text-base">Thuốc lựa chọn *</Label>
        {drug ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 rounded-lg border-2 border-primary/20 bg-primary/5 p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-primary">{drug.name}</p>
              <p className="text-sm text-muted-foreground font-mono">Mã: {drug.code}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDrug(null)}
              className="text-xs"
            >
              Thay đổi
            </Button>
          </motion.div>
        ) : (
          <div className="mt-2 text-sm">
            <DrugSearchInput onSelect={setDrug} placeholder="Tìm kiếm và chọn thuốc..." />
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="isPreferred">Loại điều trị *</Label>
          <Select
            value={isPreferred ? 'preferred' : 'alternative'}
            onValueChange={(value) => setIsPreferred(value === 'preferred')}
          >
            <SelectTrigger id="isPreferred" className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="preferred">Ưu tiên (First-line)</SelectItem>
              <SelectItem value="alternative">Thay thế (Alternative)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferenceOrder">Thứ tự ưu tiên *</Label>
          <Input
            id="preferenceOrder"
            type="number"
            min="1"
            value={preferenceOrder}
            onChange={(e) => setPreferenceOrder(Number(e.target.value))}
            className="h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dosageRecommendation">Khuyến cáo liều dùng</Label>
        <Textarea
          id="dosageRecommendation"
          value={dosageRecommendation}
          onChange={(e) => setDosageRecommendation(e.target.value)}
          placeholder="Liều dùng khuyến cáo cho mặt bệnh này..."
          rows={2}
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialConditions">Điều kiện đặc biệt</Label>
        <Textarea
          id="specialConditions"
          value={specialConditions}
          onChange={(e) => setSpecialConditions(e.target.value)}
          placeholder="Các điều kiện hoặc lưu ý đặc biệt..."
          rows={2}
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Ghi chú thêm</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ghi chú hoặc hướng dẫn bổ sung..."
          rows={2}
          className="resize-none"
        />
      </div>

      <Button type="submit" disabled={!canSubmit || isSubmitting} className="w-full h-12 text-lg">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Đang tạo...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-5 w-5" />
            Tạo Phác đồ
          </>
        )}
      </Button>
    </form>
  );
}
