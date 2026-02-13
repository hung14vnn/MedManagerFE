import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function WorkInProgressPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
                <Card className="text-center p-6">
                    <CardHeader>
                        <div className="flex items-center justify-center mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                        </div>
                        <CardTitle className="text-lg">Đang phát triển</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">Tính năng này đang được xây dựng. Vui lòng quay lại sau.</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <div className="flex justify-center">
                            <Link to="/">
                                <Button variant="outline">Quay về trang chủ</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
