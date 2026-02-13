import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPassword } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, KeyRound } from 'lucide-react';

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const email = searchParams.get('email') || '';
    const token = searchParams.get('token') || '';

    useEffect(() => {
        if (!email || !token) {
            setError('Invalid reset link. Please request a new password reset.');
        }
    }, [email, token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        if (!formData.newPassword || !formData.confirmPassword) {
            setError('All fields are required');
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        if (formData.newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        if (!email || !token) {
            setError('Invalid reset link');
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword({
                email,
                token,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            });

            setSuccess(true);
            toast.success('Password reset successful!');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.title ||
                err.response?.data?.errors?.Password?.[0] ||
                'Failed to reset password. The link may have expired.';
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
                                animate={{ scale: 1, rotate: 360 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                            >
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </motion.div>
                            <CardTitle className="text-3xl font-bold">
                                Đặt lại mật khẩu thành công
                            </CardTitle>
                            <CardDescription className="text-base">
                                Mật khẩu của bạn đã được đặt lại thành công
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Alert className="border-green-200 bg-green-50">
                                <p className="text-sm text-green-800">
                                    Bạn có thể đăng nhập bằng mật khẩu mới.
                                </p>
                            </Alert>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full bg-green-800 hover:bg-green-900 text-white shadow-md hover:shadow-lg transition-shadow"
                                onClick={() => navigate('/login')}
                            >
                                Đăng nhập ngay
                            </Button>
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
                            Đặt lại mật khẩu
                        </CardTitle>
                        <CardDescription className="text-base">
                            Nhập mật khẩu mới của bạn bên dưới
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <p className="text-sm">{error}</p>
                                </Alert>
                            )}

                            {email && (
                                <div className="p-3 bg-green-50 rounded-md border border-green-200">
                                    <p className="text-sm text-gray-700">
                                        Đặt lại mật khẩu cho: <strong className="text-green-700">{email}</strong>
                                    </p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-sm font-semibold">Mật khẩu mới</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        placeholder="Tối thiểu 8 ký tự"
                                        className="pl-10"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading || !email || !token}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-semibold">Xác nhận mật khẩu</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Nhập lại mật khẩu"
                                        className="pl-10"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading || !email || !token}
                                    />
                                </div>
                            </div>

                            <p className="text-xs text-gray-500">
                                Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường,
                                số và ký tự đặc biệt.
                            </p>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-2">
                            <Button
                                type="submit"
                                className="w-full bg-green-800 hover:bg-green-900 text-white shadow-md hover:shadow-lg transition-shadow"
                                disabled={isLoading || !email || !token}
                            >
                                {isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                            </Button>

                            <Link to="/login" className="w-full">
                                <Button variant="ghost" className="w-full text-gray-600 hover:text-green-700">
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
