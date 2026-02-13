import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    UserPlus,
    Edit,
    Trash2,
    UserCheck,
    UserX,
    Shield,
    ShieldOff,
} from "lucide-react";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
    assignRole,
    removeRole,
} from "@/lib/superadmin";
import type { User, CreateUserRequest, UpdateUserRequest } from "@/types/superadmin";

export function UserManagementPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    // Dialog states
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Form states
    const [createForm, setCreateForm] = useState<CreateUserRequest>({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "User",
    });
    const [editForm, setEditForm] = useState<UpdateUserRequest>({
        firstName: "",
        lastName: "",
        isActive: true,
    });
    const [selectedRole, setSelectedRole] = useState<"SuperAdmin" | "Admin" | "User">("User");
    const [roleAction, setRoleAction] = useState<"assign" | "remove">("assign");

    // Queries
    const { data: usersData, isLoading } = useQuery({
        queryKey: ["users", page, pageSize],
        queryFn: () => getUsers(page, pageSize),
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setCreateDialogOpen(false);
            setCreateForm({
                email: "",
                password: "",
                firstName: "",
                lastName: "",
                role: "User",
            });
            toast.success("Tạo người dùng thành công");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Tạo người dùng thất bại");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
            updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setEditDialogOpen(false);
            setSelectedUser(null);
            toast.success("Cập nhật người dùng thành công");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Cập nhật người dùng thất bại");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setDeleteDialogOpen(false);
            setSelectedUser(null);
            toast.success("Xóa người dùng thành công");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Xóa người dùng thất bại");
        },
    });

    const activateMutation = useMutation({
        mutationFn: activateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Kích hoạt người dùng thành công");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Kích hoạt người dùng thất bại");
        },
    });

    const deactivateMutation = useMutation({
        mutationFn: deactivateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Vô hiệu hóa người dùng thành công");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Vô hiệu hóa người dùng thất bại");
        },
    });

    const roleMutation = useMutation({
        mutationFn: ({ id, email, role, action }: { id: string; email: string; role: string; action: "assign" | "remove" }) =>
            action === "assign" ? assignRole(id, { email, role }) : removeRole(id, { email, role }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setRoleDialogOpen(false);
            setSelectedUser(null);
            toast.success(roleAction === "assign" ? "Gán vai trò thành công" : "Xóa vai trò thành công");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Thao tác vai trò thất bại");
        },
    });

    // Handlers
    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(createForm);
    };

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setEditForm({
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
        });
        setEditDialogOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            updateMutation.mutate({ id: selectedUser.id, data: editForm });
        }
    };

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedUser) {
            deleteMutation.mutate(selectedUser.id);
        }
    };

    const handleToggleActive = (user: User) => {
        if (user.isActive) {
            deactivateMutation.mutate(user.id);
        } else {
            activateMutation.mutate(user.id);
        }
    };

    const handleRoleClick = (user: User, action: "assign" | "remove") => {
        setSelectedUser(user);
        setRoleAction(action);
        setRoleDialogOpen(true);
    };

    const handleRoleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            roleMutation.mutate({
                id: selectedUser.id,
                email: selectedUser.email,
                role: selectedRole,
                action: roleAction,
            });
        }
    };

    // Filter users by search query
    const filteredUsers = usersData?.users.filter(
        (user) =>
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto py-8 px-4"
        >
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-green-900 mb-2">Quản lý người dùng</h1>
                <p className="text-gray-600">
                    Quản lý tất cả tài khoản người dùng trong hệ thống
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <Input
                        placeholder="Tìm kiếm theo email, họ, tên..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-md"
                    />
                </div>
                <Button
                    onClick={() => setCreateDialogOpen(true)}
                    className="bg-green-800 hover:bg-green-900 text-white"
                >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Tạo người dùng mới
                </Button>
            </div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow"
            >
                <Table hideOverflow>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px]">STT</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Họ tên</TableHead>
                            <TableHead>Vai trò</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Email xác nhận</TableHead>
                            <TableHead>Đăng nhập lần cuối</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">
                                        Đang tải...
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers && filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b transition-colors hover:bg-muted/50"
                                    >
                                        <TableCell className="text-center font-medium text-muted-foreground">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{user.email}</TableCell>
                                        <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map((role) => (
                                                    <Badge
                                                        key={role}
                                                        variant={
                                                            role === "SuperAdmin"
                                                                ? "destructive"
                                                                : role === "Admin"
                                                                    ? "default"
                                                                    : "secondary"
                                                        }
                                                    >
                                                        {role}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.isActive ? "default" : "outline"}>
                                                {user.isActive ? "Hoạt động" : "Vô hiệu"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.emailConfirmed ? "default" : "outline"}>
                                                {user.emailConfirmed ? "Đã xác nhận" : "Chưa xác nhận"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {user.lastLoginAt
                                                ? new Date(user.lastLoginAt).toLocaleDateString("vi-VN")
                                                : "Chưa đăng nhập"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditClick(user)}
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleToggleActive(user)}
                                                    title={user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                                                >
                                                    {user.isActive ? (
                                                        <UserX className="h-4 w-4 text-orange-600" />
                                                    ) : (
                                                        <UserCheck className="h-4 w-4 text-green-600" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRoleClick(user, "assign")}
                                                    title="Gán vai trò"
                                                >
                                                    <Shield className="h-4 w-4 text-blue-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRoleClick(user, "remove")}
                                                    title="Xóa vai trò"
                                                >
                                                    <ShieldOff className="h-4 w-4 text-gray-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(user)}
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">
                                        Không tìm thấy người dùng
                                    </TableCell>
                                </TableRow>
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>

                {/* Pagination */}
                {usersData && usersData.pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-4 border-t">
                        <div className="text-sm text-gray-600">
                            Trang {usersData.pagination.currentPage} / {usersData.pagination.totalPages} (
                            {usersData.pagination.totalUsers} người dùng)
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                Trước
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page + 1)}
                                disabled={page === usersData.pagination.totalPages}
                            >
                                Sau
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Create Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <DialogHeader>
                            <DialogTitle>Tạo người dùng mới</DialogTitle>
                            <DialogDescription>
                                Tạo tài khoản người dùng mới trong hệ thống
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={createForm.email}
                                        onChange={(e) =>
                                            setCreateForm({ ...createForm, email: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Mật khẩu</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={createForm.password}
                                        onChange={(e) =>
                                            setCreateForm({ ...createForm, password: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="firstName">Họ</Label>
                                        <Input
                                            id="firstName"
                                            value={createForm.firstName}
                                            onChange={(e) =>
                                                setCreateForm({ ...createForm, firstName: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="lastName">Tên</Label>
                                        <Input
                                            id="lastName"
                                            value={createForm.lastName}
                                            onChange={(e) =>
                                                setCreateForm({ ...createForm, lastName: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="role">Vai trò</Label>
                                    <Select
                                        value={createForm.role}
                                        onValueChange={(value: any) =>
                                            setCreateForm({ ...createForm, role: value })
                                        }
                                    >
                                        <SelectTrigger id="role">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="User">User</SelectItem>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCreateDialogOpen(false)}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-green-800 hover:bg-green-900 text-white"
                                    disabled={createMutation.isPending}
                                >
                                    {createMutation.isPending ? "Đang tạo..." : "Tạo"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </motion.div>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <DialogHeader>
                            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                            <DialogDescription>
                                Cập nhật thông tin người dùng {selectedUser?.email}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-firstName">Họ</Label>
                                        <Input
                                            id="edit-firstName"
                                            value={editForm.firstName}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, firstName: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-lastName">Tên</Label>
                                        <Input
                                            id="edit-lastName"
                                            value={editForm.lastName}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, lastName: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-isActive">Trạng thái</Label>
                                    <Select
                                        value={editForm.isActive ? "active" : "inactive"}
                                        onValueChange={(value) =>
                                            setEditForm({ ...editForm, isActive: value === "active" })
                                        }
                                    >
                                        <SelectTrigger id="edit-isActive">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Hoạt động</SelectItem>
                                            <SelectItem value="inactive">Vô hiệu</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditDialogOpen(false)}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-green-800 hover:bg-green-900 text-white"
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </motion.div>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <DialogHeader>
                            <DialogTitle>Xác nhận xóa</DialogTitle>
                            <DialogDescription>
                                Bạn có chắc chắn muốn xóa người dùng {selectedUser?.email}? Hành động này
                                không thể hoàn tác.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDeleteDialogOpen(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDeleteConfirm}
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
                            </Button>
                        </DialogFooter>
                    </motion.div>
                </DialogContent>
            </Dialog>

            {/* Role Dialog */}
            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                <DialogContent>
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <DialogHeader>
                            <DialogTitle>
                                {roleAction === "assign" ? "Gán vai trò" : "Xóa vai trò"}
                            </DialogTitle>
                            <DialogDescription>
                                {roleAction === "assign"
                                    ? `Gán vai trò cho ${selectedUser?.email}`
                                    : `Xóa vai trò từ ${selectedUser?.email}`}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleRoleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="role-select">Vai trò</Label>
                                    <Select
                                        value={selectedRole}
                                        onValueChange={(value: any) => setSelectedRole(value)}
                                    >
                                        <SelectTrigger id="role-select">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent >
                                            <SelectItem value="User">User</SelectItem>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setRoleDialogOpen(false)}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-green-800 hover:bg-green-900 text-white"
                                    disabled={roleMutation.isPending}
                                >
                                    {roleMutation.isPending
                                        ? "Đang xử lý..."
                                        : roleAction === "assign"
                                            ? "Gán"
                                            : "Xóa"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </motion.div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
