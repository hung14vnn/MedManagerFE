import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { searchAnalyticsApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, History, Search, CheckCircle2, XCircle } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function SearchAnalyticsPage() {
    const { data: popularSearches, isLoading: isLoadingPopular } = useQuery({
        queryKey: ['analytics', 'popular'],
        queryFn: () => searchAnalyticsApi.getPopular(),
    });

    const { data: recentSearches, isLoading: isLoadingRecent } = useQuery({
        queryKey: ['analytics', 'recent'],
        queryFn: () => searchAnalyticsApi.getRecent(10),
    });

    const { data: searchStats, isLoading: isLoadingStats } = useQuery({
        queryKey: ['analytics', 'stats'],
        queryFn: () => searchAnalyticsApi.getStats(),
    });

    const isLoading = isLoadingPopular || isLoadingRecent || isLoadingStats;

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const chartData = searchStats?.byEntityType.map(stat => ({
        name: stat.entityType,
        count: stat.count
    })) || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 py-8"
        >
            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold">Phân tích Tìm kiếm</h1>
                <p className="text-muted-foreground">Theo dõi xu hướng tìm kiếm của người dùng trên hệ thống</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Stats Summary Cards */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Tổng số lượt tìm kiếm</CardTitle>
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{searchStats?.totalSearches.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">Tất cả các danh mục</p>
                    </CardContent>
                </Card>

                {/* Popular Searches Chart */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Từ khóa phổ biến
                        </CardTitle>
                        <CardDescription>Các thuật ngữ được tìm kiếm nhiều nhất trên nền tảng</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={popularSearches?.searches || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="query" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                                    {popularSearches?.searches?.map((_, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Entity Type Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Phân bổ tìm kiếm</CardTitle>
                        <CardDescription>Chi tiết theo loại danh mục</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${percent ? (percent * 100).toFixed(0) + '%' : ''}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {chartData.map((_, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Searches Table */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5" />
                            Tìm kiếm gần đây
                        </CardTitle>
                        <CardDescription>Các truy vấn mới nhất của người dùng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table hideOverflow>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Từ khóa</TableHead>
                                    <TableHead>Người dùng</TableHead>
                                    <TableHead>Loại</TableHead>
                                    <TableHead>Kết quả</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>IP</TableHead>
                                    <TableHead>Thời gian</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentSearches?.searches?.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium">{log.searchQuery}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {log.userName || log.userId || 'Khách'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{log.entityType || 'Chung'}</Badge>
                                        </TableCell>
                                        <TableCell>{log.resultCount}</TableCell>
                                        <TableCell>
                                            {log.foundResults ? (
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <span className="text-sm">Tìm thấy</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-red-600">
                                                    <XCircle className="h-4 w-4" />
                                                    <span className="text-sm">Không tìm thấy</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {log.ipAddress || 'N/A'}
                                        </TableCell>
                                        <TableCell>{new Date(log.searchedAt).toLocaleString('vi-VN')}</TableCell>
                                    </TableRow>
                                ))}
                                {(!recentSearches?.searches || recentSearches.searches.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-4">
                                            Không có tìm kiếm gần đây
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
