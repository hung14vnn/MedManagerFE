import { motion } from 'framer-motion';
import { Search, Activity, FileText } from 'lucide-react';
import { StatCard } from '@/components/home/StatCard';
import { ImportantInfo } from '@/components/home/ImportantInfo';

export function HomePage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="container mx-auto px-4 py-4 md:py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 md:mb-8 text-center"
            >
                <h1 className="mb-2 text-2xl md:text-4xl font-bold text-green-900">TracuuDuoclamsang.vn</h1>
                <p className="text-sm md:text-lg text-muted-foreground px-2">
                    Nền tảng cung cấp thông tin dược lâm sàng phục vụ thực hành điều trị và hỗ trợ quyết định sử dụng thuốc an toàn, hiệu quả
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
                <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
                    <StatCard
                        icon={<Search className="h-5 w-5 md:h-6 md:w-6" />}
                        title="Thời gian hoạt động"
                        value="123"
                        label="Ngày từ khi ra mắt"
                        description=""
                        color="blue"
                    />
                </motion.div>

                <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
                    <StatCard
                        icon={<Activity className="h-5 w-5 md:h-6 md:w-6" />}
                        title="Số lượt tìm kiếm"
                        value="10,000 +"
                        label="Lượt tra cứu từ khi ra mắt"
                        description=""
                        color="orange"
                    />
                </motion.div>

                <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
                    <StatCard
                        icon={<FileText className="h-5 w-5 md:h-6 md:w-6" />}
                        title="Hoạt động gần đây"
                        value="1,000 +"
                        label="Lượt tra cứu trong 3 ngày gần nhất"
                        description=""
                        color="green"
                    />
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <ImportantInfo />
            </motion.div>
        </div>
    );
}
