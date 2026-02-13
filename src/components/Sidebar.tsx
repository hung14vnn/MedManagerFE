import { Link, useLocation } from 'react-router-dom';
import { Home, Search, FileText, Shield, Activity, Calculator, Lock, Pill, Users, FlaskConical, Link as LinkIcon, BarChart3, Box, Beaker, GitMerge } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/lib/AuthContext';

export function Sidebar() {
    const location = useLocation();
    const { hasRole } = useAuth();
    const isAdmin = location.pathname.startsWith('/admin');
    const isSuperAdmin = hasRole('SuperAdmin');

    const [collapsed, setCollapsed] = useState<boolean>(() => {
        try {
            return localStorage.getItem('sidebarCollapsed') === '1';
        } catch (e) {
            void e;
            return false;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('sidebarCollapsed', collapsed ? '1' : '0');
        } catch (e) {
            void e;
        }
    }, [collapsed]);

    // Temporary keyboard shortcut for toggling collapsed state (Ctrl+M)
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.ctrlKey && e.key.toLowerCase() === 'm') {
                setCollapsed((s) => !s);
            }
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    type NavLink = { href: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>>; isBeta?: boolean };

    const userLinks: NavLink[] = [
        { href: '/', label: 'Trang chủ', icon: Home },
        { href: '/active-ingredient-search', label: 'Tra cứu Hoạt chất', icon: Search },
        { href: '/drug-search', label: 'Tra cứu Thông tin thuốc', icon: Pill },
        { href: '/interaction-checker', label: 'Tra cứu Tương tác thuốc', icon: Activity },
        { href: '/disease-treatment', label: 'Tra cứu thuốc theo nhóm bệnh', icon: FileText, isBeta: true },
        { href: '/clinical-pharmacy-calculator', label: 'Máy tính dược lâm sàng', icon: Calculator, isBeta: true },
        { href: '/treatment-protocols', label: 'Tra cứu Phác đồ điều trị', icon: FileText, isBeta: true },
        { href: '/compounding-guide', label: 'Hướng dẫn pha chế', icon: FlaskConical, isBeta: true },
        { href: '/pharmacy-laws', label: 'Tra cứu Văn bản quản lý dược', icon: FileText, isBeta: true },
        { href: '/api', label: 'API', icon: LinkIcon, isBeta: true },
    ];

    const adminLinks: NavLink[] = [
        { href: '/admin', label: 'Thống kê tổng quan', icon: Shield },
        { href: '/admin/analytics', label: 'Phân tích tìm kiếm', icon: BarChart3 },
        { href: '/admin/ingredients', label: 'Quản lý hoạt chất', icon: Beaker },
        { href: '/admin/dosage-forms', label: 'Quản lý dạng dùng', icon: Box },
        { href: '/admin/routes', label: 'Quản lý đường dùng', icon: GitMerge },
        { href: '/admin/drugs', label: 'Quản lý thuốc', icon: Search },
        { href: '/admin/interactions', label: 'Quản lý tương tác', icon: Activity },
        { href: '/admin/diseases', label: 'Quản lý bệnh', icon: FileText },
    ];

    const superAdminLinks: NavLink[] = [
        ...adminLinks,
        { href: '/admin/users', label: 'Quản lý người dùng', icon: Users },
    ];

    const links: NavLink[] = isAdmin
        ? (isSuperAdmin ? superAdminLinks : adminLinks)
        : userLinks;

    return (
        <aside
            className={cn(
                'hidden md:block shrink-0 border-r border-gray-200 bg-white text-[14px] font-semibold shadow-sm transition-all duration-200 ease-in-out',
                collapsed ? 'w-16' : 'w-84'
            )}
            aria-expanded={!collapsed}
        >
            <div className="sticky top-0 h-screen overflow-y-auto">
                <div className={cn('px-4 py-6 flex flex-col h-full', collapsed ? 'items-center' : '')}>
                    <div className={cn('mb-6 w-full', collapsed ? 'flex items-center flex-col' : 'flex items-center justify-between')}>
                        <div className={cn('flex items-center', collapsed ? 'justify-center' : '')}>
                            <div className={cn('h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center')}>
                                <img src="/square_logo_2-01.png" alt="Logo" className="h-10 w-10" />
                            </div>

                            <div
                                className={cn(
                                    'ml-2 transition-all duration-200 overflow-hidden whitespace-nowrap',
                                    collapsed ? 'max-w-0 opacity-0' : 'max-w-[240px] opacity-100'
                                )}
                                style={{ transitionProperty: 'opacity, max-width' }}
                            >
                                <div className="text-xl font-semibold">TracuuDuoclamsang.vn</div>
                                <div className="text-xs text-muted-foreground font-medium">Phiên bản Beta</div>
                            </div>
                        </div>

                        {/* keep empty space on right for desktop when expanded */}
                        {!collapsed && <div className="w-6" />}
                    </div>

                    <motion.div
                        key={isAdmin ? 'admin' : 'user'}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-6 w-full"
                    >
                        <div>
                            {/* keep an accessible label for screen readers */}
                            <h4 className="sr-only">Navigation</h4>
                            <hr className={cn('mb-2', collapsed ? 'sr-only' : 'border-t border-muted')} />
                            <ul className="space-y-1 mt-4">
                                {links.map((link) => {
                                    const Icon = link.icon;
                                    const isActive =
                                        location.pathname === link.href ||
                                        (link.href !== '/' && location.pathname.startsWith(link.href) && link.href !== '/admin');
                                    const isBeta = link.isBeta === true;

                                    const handleClick = (e: React.MouseEvent) => {
                                        if (isBeta) {
                                            e.preventDefault();
                                            toast.info('Tính năng này đang được phát triển và sẽ sớm ra mắt. Cảm ơn bạn đã quan tâm!', {
                                                duration: 3000,
                                            });
                                        }
                                    };

                                    return (
                                        <li key={link.href}>
                                            <Link
                                                to={link.href}
                                                title={isBeta ? `${link.label} (Đang phát triển)` : link.label}
                                                aria-current={isActive ? 'page' : undefined}
                                                aria-disabled={isBeta ? 'true' : undefined}
                                                data-active={isActive ? 'true' : 'false'}
                                                onClick={handleClick}
                                                style={isActive && !isBeta ? { backgroundColor: 'hsl(var(--primary-grey))' } : undefined}
                                                className={cn(
                                                    'relative block w-full flex items-center gap-3 rounded-md px-4 py-3 transition-all duration-200 border-0',
                                                    isBeta
                                                        ? 'cursor-not-allowed opacity-60 hover:opacity-70'
                                                        : isActive
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                                    collapsed ? 'justify-center px-2' : ''
                                                )}
                                            >


                                                <span className={cn('flex-shrink-0', collapsed && isActive && !isBeta ? 'bg-primary text-primary-foreground p-2 rounded-full' : '')}>
                                                    <Icon className="h-4 w-4 text-current" />
                                                </span>
                                                <span
                                                    className={cn(
                                                        'ml-1 text-[15px] font-medium transition-all duration-200 ease-in-out overflow-hidden whitespace-nowrap flex items-center gap-2',
                                                        collapsed ? 'max-w-0 opacity-0' : 'max-w-[280px] opacity-100'
                                                    )}
                                                    style={{ transitionProperty: 'opacity, max-width' }}
                                                >
                                                    <span className="flex-1">{link.label}</span>
                                                    {isBeta && !collapsed && (
                                                        <Lock className="h-3.5 w-3.5 text-muted-foreground/60" />
                                                    )}
                                                </span>


                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                    </motion.div>

                    {/* Add a spacer so the bottom items stay at top when collapsed */}
                    <div className="flex-1" />

                    <div
                        className={cn(
                            'mt-4 pt-4 border-t w-full px-2',
                            collapsed ? 'flex flex-col items-center gap-3' : 'flex flex-col gap-3'
                        )}
                    >                            {!collapsed && (
                        <div className="text-[14px] font-medium text-muted-foreground mr-3">Bạn cần giúp đỡ?</div>
                    )}
                        <div className={cn('w-full flex items-center', collapsed ? 'justify-center' : 'justify-start')}>


                            <div className="flex items-center gap-4">
                                <a
                                    href="https://www.facebook.com/c4ndy.61"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="h-10 w-34 rounded-lg bg-muted/10 hover:bg-muted/20 flex items-center justify-center border border-muted/20 transition-transform duration-150 transform hover:scale-105 shadow-sm"
                                >
                                    <img src="/icons8-facebook.svg" alt="Facebook" className="h-6 w-6" width={20} height={20} />
                                    <div className="text-[14px] font-medium ml-2">Facebook</div>

                                </a>

                                <a
                                    href="https://zalo.me/0989808280"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Zalo"
                                    className="h-10 w-30 rounded-lg bg-muted/10 hover:bg-muted/20 flex items-center justify-center border border-muted/20 transition-transform duration-150 transform hover:scale-105 shadow-sm"
                                >
                                    <img src="/icons8-zalo.svg" alt="Zalo" className="h-6 w-6" width={20} height={20} />
                                    <div className="text-[14px] font-medium ml-2">Zalo</div>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </aside >
    );
}
