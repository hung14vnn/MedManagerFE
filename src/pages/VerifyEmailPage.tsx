import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { verifyEmail } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function VerifyEmailPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    const email = searchParams.get('email') || '';
    const token = searchParams.get('token') || '';

    useEffect(() => {
        const verify = async () => {
            if (!email || !token) {
                setStatus('error');
                setMessage('Invalid verification link. Please check your email and try again.');
                return;
            }

            try {
                const response = await verifyEmail(email, token);
                setStatus('success');
                setMessage(response.message || 'Your email has been verified successfully!');
            } catch (err: any) {
                setStatus('error');
                const errorMessage = err.response?.data?.message ||
                    err.response?.data?.title ||
                    'Email verification failed. The link may have expired.';
                setMessage(errorMessage);
            }
        };

        verify();
    }, [email, token]);

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
                        {status === 'loading' && (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"
                                >
                                    <Loader2 className="w-8 h-8 text-blue-600" />
                                </motion.div>
                                <CardTitle className="text-3xl font-bold">
                                    Đang xác minh Email
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Vui lòng chờ trong khi chúng tôi xác minh địa chỉ email của bạn...
                                </CardDescription>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1, rotate: 360 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                                >
                                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                                </motion.div>
                                <CardTitle className="text-3xl font-bold">
                                    Xác minh thành công!
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Email của bạn đã được xác minh thành công
                                </CardDescription>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
                                >
                                    <XCircle className="w-8 h-8 text-red-600" />
                                </motion.div>
                                <CardTitle className="text-3xl font-bold">
                                    Xác minh thất bại
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Không thể xác minh địa chỉ email của bạn
                                </CardDescription>
                            </>
                        )}
                    </CardHeader>

                    <CardContent>
                        <Alert variant={status === 'error' ? 'destructive' : 'default'}
                            className={status === 'success' ? 'border-green-200 bg-green-50' : ''}>
                            <p className="text-sm">{message}</p>
                        </Alert>

                        {email && status !== 'loading' && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-md border">
                                <p className="text-sm text-gray-700">
                                    Email: <strong className="text-green-700">{email}</strong>
                                </p>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-2">
                        {status === 'success' && (
                            <Button
                                className="w-full bg-green-800 hover:bg-green-900 text-white shadow-md hover:shadow-lg transition-shadow"
                                onClick={() => navigate('/login')}
                            >
                                Đăng nhập ngay
                            </Button>
                        )}

                        {status === 'error' && (
                            <>
                                <Link to="/register" className="w-full">
                                    <Button className="w-full bg-green-800 hover:bg-green-900 text-white shadow-md hover:shadow-lg transition-shadow">
                                        Đăng ký lại
                                    </Button>
                                </Link>
                                <Link to="/login" className="w-full">
                                    <Button variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50">
                                        Đăng nhập
                                    </Button>
                                </Link>
                            </>
                        )}
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
