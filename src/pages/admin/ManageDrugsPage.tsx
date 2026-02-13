import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { drugApi, dosageFormApi, routeApi, ingredientApi } from '@/lib/api';
import type { CreateDrugDto, DrugDetailDto, DrugStatus } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { debounce } from '@/lib/helpers';
import { toast } from 'sonner';

export function ManageDrugsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDrug, setEditingDrug] = useState<DrugDetailDto | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const queryClient = useQueryClient();

  // Use getAll for listing all drugs with pagination
  const { data: allDrugsData, isLoading: isLoadingAll } = useQuery({
    queryKey: ['drugs', 'all', page, pageSize],
    queryFn: () => drugApi.getAll(page, pageSize),
    enabled: !debouncedTerm, // Only fetch all when not searching
  });

  // Use search when user types
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['drugs', 'search', debouncedTerm],
    queryFn: () => drugApi.search(debouncedTerm),
    enabled: !!debouncedTerm, // Only search when there's a term
  });

  const drugs = debouncedTerm ? searchResults : allDrugsData?.data;
  const isLoading = debouncedTerm ? isSearching : isLoadingAll;
  const totalDrugs = allDrugsData?.total || 0;
  const totalPages = Math.ceil(totalDrugs / pageSize);

  const createMutation = useMutation({
    mutationFn: drugApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
      setIsCreateOpen(false);
      toast.success('Thêm thuốc thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Thêm thuốc thất bại');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateDrugDto }) => drugApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
      setEditingDrug(null);
      toast.success('Cập nhật thuốc thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Cập nhật thuốc thất bại');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: drugApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drugs'] });
      toast.success('Xóa thuốc thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Xóa thuốc thất bại');
    }
  });

  const handleSearch = useMemo(
    () => debounce((value: string) => {
      setDebouncedTerm(value);
      setPage(1); // Reset to page 1 when searching
    }, 300),
    []
  );

  useEffect(() => {
    return () => handleSearch.cancel?.();
  }, [handleSearch]);

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa thuốc này?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadgeVariant = (status: DrugStatus) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Inactive':
        return 'secondary';
      case 'Deprecated':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const translateStatus = (status: DrugStatus) => {
    switch (status) {
      case 'Active': return 'Hoạt động';
      case 'Inactive': return 'Ngừng hoạt động';
      case 'Deprecated': return 'Lỗi thời';
      default: return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Quản lý Thuốc</h1>
          <p className="text-muted-foreground">Thêm, sửa và quản lý thông tin thuốc trong cơ sở dữ liệu</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Thêm thuốc mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>Thêm thuốc mới</DialogTitle>
            </DialogHeader>
            <DrugForm
              onSubmit={(data) => createMutation.mutate(data)}
              isSubmitting={createMutation.isPending}
              submitLabel="Tạo thuốc"
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Tìm kiếm và lọc thuốc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo mã thuốc hoặc tên thuốc..."
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
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
          <Table hideOverflow>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[60px]">STT</TableHead>
                <TableHead className="w-[150px]">Mã thuốc</TableHead>
                <TableHead>Tên thuốc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Dạng bào chế</TableHead>
                <TableHead>Đường dùng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {drugs.map((drug, index) => (
                  <motion.tr
                    key={drug.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="text-center font-medium text-muted-foreground">
                      {debouncedTerm ? index + 1 : (page - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium">{drug.code}</TableCell>
                    <TableCell className="font-medium">{drug.name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(drug.status)}>
                        {translateStatus(drug.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{drug.dosageForm || '-'}</TableCell>
                    <TableCell>{drug.route || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={async () => {
                                const detail = await drugApi.getById(drug.id);
                                setEditingDrug(detail);
                              }}
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto bg-white">
                            <DialogHeader>
                              <DialogTitle>Chỉnh sửa thông tin thuốc</DialogTitle>
                            </DialogHeader>
                            {editingDrug && (
                              <DrugForm
                                initialData={editingDrug}
                                onSubmit={(data) =>
                                  updateMutation.mutate({ id: editingDrug.id, data })
                                }
                                isSubmitting={updateMutation.isPending}
                                submitLabel="Cập nhật thuốc"
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(drug.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {!debouncedTerm && totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t bg-muted/20">
              <div className="text-sm text-muted-foreground">
                Trang {page} / {totalPages} ({totalDrugs} thuốc)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Sau
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
            <Search className="h-10 w-10 opacity-20" />
            {searchTerm ? (
              <p>Không tìm thấy thuốc nào khớp với từ khóa "{searchTerm}"</p>
            ) : (
              <p>Chưa có thuốc nào trong hệ thống</p>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

interface DrugFormProps {
  initialData?: DrugDetailDto;
  onSubmit: (data: CreateDrugDto) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

interface IngredientFormData {
  ingredientId: number;
  strength: string;
  unit: string;
}

function DrugForm({ initialData, onSubmit, isSubmitting, submitLabel }: DrugFormProps) {
  const [code, setCode] = useState(initialData?.code || '');
  const [name, setName] = useState(initialData?.name || '');
  const [status, setStatus] = useState<DrugStatus>(initialData?.status || 'Active');
  const [dosageFormId, setDosageFormId] = useState<number | undefined>(initialData?.dosageFormId || initialData?.dosageForm?.id || undefined);
  const [routeId, setRouteId] = useState<number | undefined>(initialData?.routeId || initialData?.route?.id || undefined);
  const [ingredients, setIngredients] = useState<IngredientFormData[]>(
    initialData?.ingredients?.map(di => ({
      ingredientId: di.ingredient.id,
      strength: di.strength || '',
      unit: di.unit || '',
    })) || [{ ingredientId: 0, strength: '', unit: '' }]
  );

  // Load reference data
  const { data: dosageForms } = useQuery({
    queryKey: ['dosageForms'],
    queryFn: dosageFormApi.getAll,
  });

  const { data: routes } = useQuery({
    queryKey: ['routes'],
    queryFn: routeApi.getAll,
  });

  const { data: ingredientsData } = useQuery({
    queryKey: ['ingredients'],
    queryFn: () => ingredientApi.getAll(1, 1000),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty ingredients
    const validIngredients = ingredients.filter(ing => ing.ingredientId > 0);

    if (validIngredients.length === 0) {
      toast.error('Vui lòng thêm ít nhất một hoạt chất');
      return;
    }

    const data: CreateDrugDto = {
      code,
      name,
      status,
      dosageFormId: dosageFormId || null,
      routeId: routeId || null,
      ingredients: validIngredients.map(ing => ({
        ingredientId: ing.ingredientId,
        strength: ing.strength || null,
        unit: ing.unit || null,
      })),
    };

    onSubmit(data);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { ingredientId: 0, strength: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof IngredientFormData, value: string | number) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <div className="h-6 w-1 bg-primary rounded-full" />
          Thông tin cơ bản
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="code">Mã thuốc *</Label>
            <Input
              id="code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="VD: PARA500TAB"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái *</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as DrugStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Hoạt động</SelectItem>
                <SelectItem value="Inactive">Ngừng hoạt động</SelectItem>
                <SelectItem value="Deprecated">Lỗi thời</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Tên thuốc *</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Paracetamol 500mg Tablet"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dosageForm">Dạng bào chế</Label>
            <Select
              value={dosageFormId?.toString() || 'unselected'}
              onValueChange={(value) => setDosageFormId(value === 'unselected' ? undefined : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn dạng bào chế" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unselected">Không chọn</SelectItem>
                {dosageForms?.map((form) => (
                  <SelectItem key={form.id} value={form.id.toString()}>
                    {form.name} ({form.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="route">Đường dùng</Label>
            <Select
              value={routeId?.toString() || 'unselected'}
              onValueChange={(value) => setRouteId(value === 'unselected' ? undefined : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn đường dùng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unselected">Không chọn</SelectItem>
                {routes?.map((route) => (
                  <SelectItem key={route.id} value={route.id.toString()}>
                    {route.name} ({route.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <div className="h-6 w-1 bg-primary rounded-full" />
            Thành phần hoạt chất *
          </h3>
          <Button type="button" variant="outline" size="sm" onClick={addIngredient} className="text-primary hover:text-primary hover:bg-primary/10">
            <Plus className="h-4 w-4 mr-1" />
            Thêm hoạt chất
          </Button>
        </div>

        <div className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2 items-end p-3 rounded-lg border bg-muted/30">
              <div className="flex-1 space-y-2">
                <Label>Hoạt chất</Label>
                <Select
                  value={ingredient.ingredientId.toString()}
                  onValueChange={(value) => updateIngredient(index, 'ingredientId', parseInt(value))}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Chọn hoạt chất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Chọn hoạt chất</SelectItem>
                    {ingredientsData?.data.map((ing) => (
                      <SelectItem key={ing.id} value={ing.id.toString()}>
                        {ing.name} ({ing.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-32 space-y-2">
                <Label>Hàm lượng</Label>
                <Input
                  value={ingredient.strength}
                  onChange={(e) => updateIngredient(index, 'strength', e.target.value)}
                  placeholder="500"
                  className="bg-white"
                />
              </div>

              <div className="w-24 space-y-2">
                <Label>Đơn vị</Label>
                <Input
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  placeholder="mg"
                  className="bg-white"
                />
              </div>

              {ingredients.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                  className="text-red-500 hover:text-white hover:bg-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full h-11 text-lg">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
