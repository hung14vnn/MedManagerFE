import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, KeyRound } from 'lucide-react';

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await forgotPassword({ email });
            setSuccess(true);
            toast.success('Password reset email sent! Please check your inbox.');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.title ||
                'Failed to send reset email. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Card className="transition-shadow hover:shadow-lg border-green-200">
                        <CardHeader className="space-y-1 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                            >
                                <Mail className="w-8 h-8 text-green-600" />
                            </motion.div>
                            <CardTitle className="text-3xl font-bold">
                                Kiểm tra Email
                            </CardTitle>
                            <CardDescription className="text-base">
                                Chúng tôi đã gửi link đặt lại mật khẩu đến <strong className="text-green-700">{email}</strong>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert className="border-green-200 bg-green-50">
                                <p className="text-sm text-green-800">
                                    Nhấp vào liên kết trong email để đặt lại mật khẩu của bạn.
                                    Liên kết sẽ hết hạn sau 24 giờ.
                                </p>
                            </Alert>

                            <p className="text-sm text-gray-600 text-center">
                                Không nhận được email? Kiểm tra thư mục spam hoặc thử lại.
                            </p>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-2">
                            <Button
                                variant="outline"
                                className="w-full border-green-600 text-green-700 hover:bg-green-50"
                                onClick={() => setSuccess(false)}
                            >
                                Thử Email khác
                            </Button>
                            <Link to="/login" className="w-full">
                                <Button variant="ghost" className="w-full text-gray-600 hover:text-green-700">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Quay lại đăng nhập
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="transition-shadow hover:shadow-lg border-green-200">
                    <CardHeader className="space-y-1 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600"
                        >
                            <KeyRound className="h-8 w-8" />
                        </motion.div>
                        <CardTitle className="text-3xl font-bold">
                            Quên mật khẩu?
                        </CardTitle>
                        <CardDescription className="text-base">
                            Nhập địa chỉ email và chúng tôi sẽ gửi link đặt lại mật khẩu
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <p className="text-sm">{error}</p>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-2">
                            <Button
                                type="submit"
                                className="w-full bg-green-800 hover:bg-green-900 text-white shadow-md hover:shadow-lg transition-shadow"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang gửi...' : 'Gửi link đặt lại'}
                            </Button>

                            <Link to="/login" className="w-full">
                                <Button variant="ghost" className="w-full text-gray-600 hover:text-green-700">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Quay lại đăng nhập
                                </Button>
                            </Link>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
