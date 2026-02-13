import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Search, Activity, FileText, PlusCircle, BarChart3, Beaker, Box, GitMerge } from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminDashboard() {
  const stats = [
    { title: 'Quản lý Thuốc', description: 'Thêm, sửa và xóa thông tin thuốc', icon: Search, link: '/admin/drugs', color: 'blue' },
    { title: 'Quản lý Tương tác', description: 'Tạo và cập nhật dữ liệu tương tác thuốc', icon: Activity, link: '/admin/interactions', color: 'orange' },
    { title: 'Quản lý Bệnh', description: 'Cấu hình phác đồ điều trị cho các mặt bệnh', icon: FileText, link: '/admin/diseases', color: 'green' },
    { title: 'Quản lý Hoạt chất', description: 'Duy trì cơ sở dữ liệu hoạt chất', icon: Beaker, link: '/admin/ingredients', color: 'indigo' },
    { title: 'Quản lý Dạng dùng', description: 'Cấu hình các dạng bào chế thuốc', icon: Box, link: '/admin/dosage-forms', color: 'cyan' },
    { title: 'Quản lý Đường dùng', description: 'Định nghĩa các đường dùng thuốc', icon: GitMerge, link: '/admin/routes', color: 'rose' },
    { title: 'Phân tích Tìm kiếm', description: 'Theo dõi xu hướng và từ khóa phổ biến', icon: BarChart3, link: '/admin/analytics', color: 'purple' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Bảng điều khiển Admin</h1>
        <p className="text-muted-foreground">
          Quản lý thuốc, tương tác và phác đồ điều trị bệnh
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const bgColor = stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
            stat.color === 'orange' ? 'bg-orange-100 text-orange-600' :
              stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                stat.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                  stat.color === 'cyan' ? 'bg-cyan-100 text-cyan-600' :
                    stat.color === 'rose' ? 'bg-rose-100 text-rose-600' :
                      'bg-green-100 text-green-600';

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={stat.link}>
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-lg ${bgColor}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{stat.title}</CardTitle>
                    <CardDescription>{stat.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-primary font-medium">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Truy cập {stat.title}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                to="/admin/drugs"
                className="rounded-lg border p-4 transition-colors hover:bg-muted"
              >
                <p className="font-medium text-blue-600">Thêm Thuốc mới</p>
                <p className="text-sm text-muted-foreground">Tạo một bản ghi thuốc mới</p>
              </Link>
              <Link
                to="/admin/interactions"
                className="rounded-lg border p-4 transition-colors hover:bg-muted"
              >
                <p className="font-medium text-orange-600">Thêm Tương tác</p>
                <p className="text-sm text-muted-foreground">Ghi lại tương tác thuốc - thuốc</p>
              </Link>
              <Link
                to="/admin/diseases"
                className="rounded-lg border p-4 transition-colors hover:bg-muted"
              >
                <p className="font-medium text-green-600">Thêm Phác đồ điều trị</p>
                <p className="text-sm text-muted-foreground">Tạo phác đồ điều trị mới</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
