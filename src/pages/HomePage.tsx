import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Activity, FileText, Info } from 'lucide-react';

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
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
            >
                <h1 className="mb-2 text-4xl font-bold">Chào mừng đến với Hệ thống Quản lý Y tế</h1>
                <p className="text-lg text-muted-foreground">
                    Hệ thống tra cứu thông tin thuốc và kiểm tra tương tác toàn diện
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600"
                            >
                                <Search className="h-6 w-6" />
                            </motion.div>
                            <CardTitle>Tra cứu thuốc</CardTitle>
                            <CardDescription>
                                Tìm kiếm thông tin chi tiết về thuốc theo hoạt chất, tên thương mại hoặc nhóm dược lý
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/drug-search">
                                <Button className="w-full cursor-pointer">Tra cứu ngay</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600"
                            >
                                <Activity className="h-6 w-6" />
                            </motion.div>
                            <CardTitle>Kiểm tra tương tác</CardTitle>
                            <CardDescription>
                                Kiểm tra tương tác giữa các loại thuốc và nhận thông tin chi tiết về mức độ nghiêm trọng
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/interaction-checker">
                                <Button className="w-full cursor-pointer">Kiểm tra tương tác</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600"
                            >
                                <FileText className="h-6 w-6" />
                            </motion.div>
                            <CardTitle>Phác đồ điều trị</CardTitle>
                            <CardDescription>
                                Xem phác đồ điều trị dựa trên bằng chứng khoa học cho các bệnh lý khác nhau
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/disease-treatment">
                                <Button className="w-full cursor-pointer">Xem phác đồ</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Card className="mt-8 border-blue-200 bg-blue-50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-blue-900">Thông tin quan trọng</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="text-sm text-blue-800">
                        <ul className="list-disc space-y-1 pl-5">
                            <li>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </li>
                            <li>
                                Sed molestie libero sit amet orci rhoncus, sed vulputate sapien vulputate
                            </li>
                            <li>Curabitur vulputate risus non bibendum eleifend</li>
                            <li>
                                Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
