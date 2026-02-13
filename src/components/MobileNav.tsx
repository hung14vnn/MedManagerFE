import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Activity, FileText, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { UserAvatar } from './UserAvatar';
import { useAuth } from '@/lib/AuthContext';
import { useState, useEffect, useRef } from 'react';

export function MobileNav() {
    const location = useLocation();
    const { hasRole } = useAuth();
    const isAdmin = location.pathname.startsWith('/admin');
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    // Handle scroll to show/hide navbar
    useEffect(() => {
        // Find the main scrollable container
        const scrollContainer = document.querySelector('main');
        if (!scrollContainer) return;

        const handleScroll = () => {
            const currentScrollY = scrollContainer.scrollTop;

            // Always show navbar if drawer is open
            if (open) {
                setVisible(true);
                return;
            }

            // Show navbar when scrolling up or at the top
            if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
                setVisible(true);
            }
            // Hide navbar when scrolling down and past threshold
            else if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
                setVisible(false);
            }

            lastScrollY.current = currentScrollY;
        };

        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, [open]);

    const mainLinks = [
        { href: '/', label: 'Trang chủ', icon: Home },
        { href: '/drug-search', label: 'Tra thuốc', icon: Search },
        { href: '/interaction-checker', label: 'Tương tác', icon: Activity },
        { href: '/disease-treatment', label: 'Bệnh lý', icon: FileText },
    ];

    const secondaryLinks = [
        { href: '/active-ingredient-search', label: 'Hoạt chất', icon: Search },
        { href: '/clinical-pharmacy-calculator', label: 'Máy tính', icon: FileText },
        { href: '/treatment-protocols', label: 'Phác đồ', icon: FileText },
        { href: '/compounding-guide', label: 'Pha chế', icon: FileText },
        { href: '/pharmacy-laws', label: 'Văn bản', icon: FileText },
    ];

    const adminLinks = [
        { href: '/admin', label: 'Dashboard', icon: Home },
        { href: '/admin/drugs', label: 'Quản lý thuốc', icon: Search },
        { href: '/admin/interactions', label: 'Tương tác', icon: Activity },
        { href: '/admin/diseases', label: 'Bệnh lý', icon: FileText },
    ];

    if (isAdmin) {
        return (
            <div className={cn(
                "fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-lg md:hidden transition-transform duration-300 ease-in-out",
                visible ? "translate-y-0" : "translate-y-full"
            )}>
                <nav className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
                    {adminLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 min-w-[64px]',
                                    isActive
                                        ? 'text-primary bg-primary/15 shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                )}
                            >
                                <Icon className={cn(
                                    'h-5 w-5 transition-transform duration-200',
                                    isActive && 'scale-110'
                                )} />
                                <span className="truncate max-w-full">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        );
    }

    return (
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-lg md:hidden transition-transform duration-300 ease-in-out",
            visible ? "translate-y-0" : "translate-y-full"
        )}>
            <nav className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
                {mainLinks.slice(0, 4).map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 min-w-[64px]',
                                isActive
                                    ? 'text-primary bg-primary/15 shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            )}
                        >
                            <Icon className={cn(
                                'h-5 w-5 transition-transform duration-200',
                                isActive && 'scale-110'
                            )} />
                            <span className="truncate max-w-full">{link.label}</span>
                        </Link>
                    );
                })}

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpen(true)}
                    className="flex flex-col items-center justify-center gap-1 px-3 py-2 h-auto text-xs font-medium text-muted-foreground min-w-[64px]"
                >
                    <Menu className="h-5 w-5" />
                    <span>Thêm</span>
                </Button>

                <AnimatePresence>
                    {open && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setOpen(false)}
                                className="fixed inset-0 bg-black/50 z-40"
                            />

                            {/* Drawer */}
                            <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{
                                    type: 'spring',
                                    damping: 30,
                                    stiffness: 300
                                }}
                                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b">
                                    <div>
                                        <h2 className="text-lg font-semibold">Chức năng khác</h2>
                                        <p className="text-sm text-muted-foreground">
                                            Truy cập các tính năng bổ sung của ứng dụng
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setOpen(false)}
                                        className="rounded-full"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="mb-4 pb-4 border-b"
                                    >
                                        <UserAvatar />
                                    </motion.div>

                                    {secondaryLinks.map((link, index) => {
                                        const Icon = link.icon;
                                        const isActive = location.pathname === link.href;
                                        return (
                                            <motion.div
                                                key={link.href}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 + index * 0.05 }}
                                            >
                                                <Link
                                                    to={link.href}
                                                    onClick={() => setOpen(false)}
                                                    className={cn(
                                                        'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                                                        isActive
                                                            ? 'text-foreground bg-[hsl(145,33%,85%)]'
                                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                    )}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                    <span>{link.label}</span>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}

                                    {(hasRole('Admin') || hasRole('SuperAdmin')) && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + secondaryLinks.length * 0.05 }}
                                        >
                                            <Link
                                                to="/admin"
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 hover:translate-x-1 hover:shadow-sm"
                                            >
                                                <User className="h-5 w-5" />
                                                <span>Quản trị</span>
                                            </Link>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </nav>
        </div>
    );
}
