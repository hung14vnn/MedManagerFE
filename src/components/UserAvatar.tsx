import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function UserAvatar() {
    const { user, logout, isLoading } = useAuth();
    const navigate = useNavigate();

    // Controlled open state so we can play an exit animation
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const closeTimeoutRef = useRef<number | null>(null);

    const handleOpenChange = (nextOpen: boolean) => {
        if (nextOpen) {
            // If reopening while closing, cancel the pending close
            if (closeTimeoutRef.current) {
                window.clearTimeout(closeTimeoutRef.current);
                closeTimeoutRef.current = null;
                setIsClosing(false);
            }
            setIsOpen(true);
        } else {
            // Play closing animation then actually close
            setIsClosing(true);
            closeTimeoutRef.current = window.setTimeout(() => {
                setIsClosing(false);
                setIsOpen(false);
                closeTimeoutRef.current = null;
            }, 200); // duration should match motion transition
        }
    };

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                window.clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    if (isLoading) {
        return null;
    }

    if (!user) {
        return (
            <Button onClick={() => navigate('/login')}>
                Đăng nhập
            </Button>
        );
    }

    const handleLogout = () => {
        logout();
        toast.success('Đăng xuất thành công');
        navigate('/login');
    };

    // Get initials from user name
    const getInitials = () => {
        const firstInitial = user.firstName?.charAt(0)?.toUpperCase() || '';
        const lastInitial = user.lastName?.charAt(0)?.toUpperCase() || '';
        return `${firstInitial}${lastInitial}`;
    };

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange} >
            <PopoverTrigger asChild>
                <div className={`relative flex items-center justify-center gap-1 rounded-md hover:bg-gray-100 text-gray-800 cursor-pointer p-4 text-sm font-medium ${isOpen ? 'bg-gray-100' : ''}`}>
                    {user.firstName + " " + user.lastName}
                    <ChevronDown size={16} /></div>

            </PopoverTrigger>
            <PopoverContent className="w-80 bg-white" align="end" asChild>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={isClosing ? { opacity: 0, scale: 0.95, y: -10 } : { opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                >
                    <div className="space-y-4">
                        {/* User Info Header */}
                        <div className="flex items-start gap-3 pb-3 border-b">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback className={"border border-gray-300"}>
                                    {getInitials()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-base truncate flex align-items-center gap-2">
                                    {user.firstName} {user.lastName}  {user.roles && user.roles.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.map((role) => (
                                                <span
                                                    key={role}
                                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                                                >
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground truncate">
                                    {user.email}
                                </div>

                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-1">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-left hover:bg-gray-100 text-gray-800 cursor-pointer"
                                onClick={() => {
                                    toast.info('Tính năng đang phát triển');
                                }}
                            >
                                <User className="h-4 w-4 mr-2" />
                                Hồ sơ của tôi
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-left hover:bg-gray-100 text-gray-800 cursor-pointer"
                                onClick={() => {
                                    toast.info('Tính năng đang phát triển');
                                }}
                            >
                                <Settings className="h-4 w-4 mr-2" />
                                Cài đặt
                            </Button>
                        </div>

                        {/* Logout Button */}
                        <div className="pt-3 border-t">
                            <Button
                                variant="destructive"
                                className="w-full justify-start bg-red-800 hover:bg-red-700 text-white cursor-pointer"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Đăng xuất
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </PopoverContent>
        </Popover >
    );
}
