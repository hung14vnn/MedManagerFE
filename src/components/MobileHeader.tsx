import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserAvatar } from './UserAvatar';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';

export function MobileHeader() {
    const location = useLocation();
    const { hasRole } = useAuth();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const isAdmin = location.pathname.startsWith('/admin');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const adminLinks = [
        { href: '/admin', label: 'Thống kê tổng quan' },
        { href: '/admin/analytics', label: 'Phân tích tìm kiếm' },
        { href: '/admin/ingredients', label: 'Quản lý hoạt chất' },
        { href: '/admin/dosage-forms', label: 'Quản lý dạng dùng' },
        { href: '/admin/routes', label: 'Quản lý đường dùng' },
        { href: '/admin/drugs', label: 'Quản lý thuốc' },
        { href: '/admin/interactions', label: 'Quản lý tương tác' },
        { href: '/admin/diseases', label: 'Quản lý bệnh' },
    ];

    const superAdminLinks = [
        ...adminLinks,
        { href: '/admin/users', label: 'Quản lý người dùng' },
    ];

    const links = hasRole('SuperAdmin') ? superAdminLinks : adminLinks;

    if (!isAdmin) {
        return (
            <header className={cn(
                "sticky top-0 z-40 border-b bg-white/95 backdrop-blur-sm md:hidden transition-shadow duration-200",
                scrolled && "shadow-md"
            )}>
                <div className="flex h-14 items-center justify-between px-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <img src="/square_logo_2-01.png" alt="Logo" className="h-6 w-6" />
                        </div>
                        <span className="text-lg font-bold">TCDLS</span>
                    </Link>
                    <UserAvatar />
                </div>
            </header>
        );
    }

    return (
        <header className={cn(
            "sticky top-0 z-40 border-b bg-white/95 backdrop-blur-sm md:hidden transition-shadow duration-200",
            scrolled && "shadow-md"
        )}>
            <div className="flex h-14 items-center justify-between px-4">
                <Link to="/admin" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <img src="/square_logo_2-01.png" alt="Logo" className="h-6 w-6" />
                    </div>
                    <span className="text-lg font-bold">
                        TCDLS <span className="text-xs text-muted-foreground">Admin</span>
                    </span>
                </Link>
                <div className="flex items-center gap-2">
                    <UserAvatar />
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="sm">
                                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[280px] p-0">
                            <div className="flex flex-col h-full">
                                <div className="p-4 border-b">
                                    <Link to="/admin" className="flex items-center gap-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                            <img src="/square_logo_2-01.png" alt="Logo" className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold">TCDLS</div>
                                            <div className="text-xs text-muted-foreground">Quản trị</div>
                                        </div>
                                    </Link>
                                </div>
                                <nav className="flex-1 overflow-y-auto p-4">
                                    <div className="space-y-1">
                                        {links.map((link) => {
                                            const isActive = location.pathname === link.href;
                                            return (
                                                <Link
                                                    key={link.href}
                                                    to={link.href}
                                                    onClick={() => setOpen(false)}
                                                    className={cn(
                                                        'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                                        isActive
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'text-foreground hover:bg-muted'
                                                    )}
                                                >
                                                    {link.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
