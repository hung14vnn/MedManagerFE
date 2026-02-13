import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { resendVerificationEmail } from '@/lib/auth';

export function VerifyEmailWaitingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email as string;

    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate('/register');
            return;
        }
    }, [email, navigate]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleResendEmail = async () => {
        if (!canResend || isResending) return;

        setIsResending(true);
        try {
            await resendVerificationEmail(email);
            toast.success('Email xác nhận đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.');
            setCountdown(60);
            setCanResend(false);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Không thể gửi lại email. Vui lòng thử lại sau.';
            toast.error(errorMessage);
        } finally {
            setIsResending(false);
        }
    };

    if (!email) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-green-200 shadow-xl ">
                    <CardHeader className="text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
                        >
                            <Mail className="h-10 w-10 text-green-800" />
                        </motion.div>
                        <div>
                            <CardTitle className="text-2xl text-green-900">
                                Kiểm tra email của bạn
                            </CardTitle>
                            <CardDescription className="mt-2">
                                Chúng tôi đã gửi email xác nhận đến
                            </CardDescription>
                            <p className="text-sm font-medium text-green-800 mt-1">
                                {email}
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                            <p className="text-sm text-gray-700">
                                Vui lòng kiểm tra hộp thư đến của bạn và nhấp vào liên kết xác nhận.
                            </p>
                            <p className="text-sm text-gray-700">
                                Nếu không thấy email, hãy kiểm tra thư mục spam hoặc rác.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={handleResendEmail}
                                disabled={!canResend || isResending}
                                className="w-full bg-green-800 hover:bg-green-900 text-white shadow-md hover:shadow-lg transition-shadow"
                                variant={canResend ? "default" : "outline"}
                            >
                                {isResending ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Đang gửi...
                                    </>
                                ) : canResend ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Gửi lại email xác nhận
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Gửi lại sau {countdown}s
                                    </>
                                )}
                            </Button>

                            <Link to="/login" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full border-green-800 text-green-800 hover:bg-green-50"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Về trang đăng nhập
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
