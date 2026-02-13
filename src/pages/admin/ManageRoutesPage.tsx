import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { routeApi } from '@/lib/api';
import type { RouteInformationDto, CreateRouteDto } from '@/types/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ManageRoutesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<RouteInformationDto | null>(null);

    // Form state
    const [code, setCode] = useState('');
    const [name, setName] = useState('');

    const queryClient = useQueryClient();

    const { data: items, isLoading } = useQuery({
        queryKey: ['routes'],
        queryFn: () => routeApi.getAll(),
    });

    const filteredItems = useMemo(() => {
        const data = items || [];
        if (!searchTerm) return data;
        return data.filter(i =>
            i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [items, searchTerm]);

    const createMutation = useMutation({
        mutationFn: routeApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['routes'] });
            setIsDialogOpen(false);
            resetForm();
            toast.success('Thêm đường dùng thành công');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Thêm đường dùng thất bại');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: CreateRouteDto }) => routeApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['routes'] });
            setIsDialogOpen(false);
            resetForm();
            toast.success('Cập nhật đường dùng thành công');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Cập nhật đường dùng thất bại');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: routeApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['routes'] });
            toast.success('Xóa đường dùng thành công');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Xóa đường dùng thất bại');
        }
    });

    const resetForm = () => {
        setCode('');
        setName('');
        setEditingItem(null);
    };

    const handleEdit = (item: RouteInformationDto) => {
        setEditingItem(item);
        setCode(item.code);
        setName(item.name);
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: CreateRouteDto = { code, name };

        if (editingItem) {
            updateMutation.mutate({ id: editingItem.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Bạn có chắc muốn xóa đường dùng này?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 py-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Quản lý Đường dùng thuốc</h1>
                    <p className="text-muted-foreground">Thêm và chỉnh sửa các đường dùng (Đường uống, Tiêm tĩnh mạch, v.v.)</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="w-full md:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm Đường dùng
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                        <DialogHeader>
                            <DialogTitle>{editingItem ? 'Chỉnh sửa Đường dùng' : 'Thêm Đường dùng mới'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">Mã đường dùng *</Label>
                                <Input
                                    id="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="VD: PO, IV"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Tên đường dùng *</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="VD: Đường uống, Tiêm tĩnh mạch"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingItem ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm theo tên hoặc mã..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table hideOverflow>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[60px]">STT</TableHead>
                                    <TableHead>Mã</TableHead>
                                    <TableHead>Tên đường dùng</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="popLayout">
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8">
                                                <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredItems.length > 0 ? (
                                        filteredItems.map((item, index) => (
                                            <motion.tr
                                                key={item.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-b transition-colors hover:bg-muted/50"
                                            >
                                                <TableCell className="text-center font-medium text-muted-foreground">{index + 1}</TableCell>
                                                <TableCell className="font-mono font-medium">{item.code}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                                            <Edit className="h-4 w-4 text-blue-600" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                Không tìm thấy dữ liệu nào
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
