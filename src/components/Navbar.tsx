import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Home, Search, FileText, Shield, Activity } from 'lucide-react';
import { UserAvatar } from './UserAvatar';

interface NavbarProps {
  isAdmin?: boolean;
}

export function Navbar({ isAdmin = false }: NavbarProps) {
  const location = useLocation();

  const userLinks = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/drug-search', label: 'Tra cứu thuốc', icon: Search },
    { href: '/interaction-checker', label: 'Tương tác', icon: Activity },
    { href: '/disease-treatment', label: 'Điều trị', icon: FileText },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Bảng điều khiển', icon: Shield },
    { href: '/admin/drugs', label: 'Quản lý thuốc', icon: Search },
    { href: '/admin/interactions', label: 'Quản lý tương tác', icon: Activity },
    { href: '/admin/diseases', label: 'Quản lý bệnh', icon: FileText },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="border-b bg-white shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to={isAdmin ? '/admin' : '/'} className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"
            >
              <Activity className="h-6 w-6" />
            </motion.div>
            <span className="text-xl font-bold">
              TCDLS {isAdmin && <span className="text-sm text-muted-foreground">Admin</span>}
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {links.map((link, index) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.href}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <UserAvatar />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
