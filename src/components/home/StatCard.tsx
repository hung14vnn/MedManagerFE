import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    icon: ReactNode;
    title: string;
    value: string;
    label: string;
    description: string;
    color: 'blue' | 'orange' | 'green';
}

export function StatCard({ icon, title, value, label, description, color }: StatCardProps) {
    const colorStyles = {
        blue: {
            bg: 'bg-blue-100',
            text: 'text-blue-600',
        },
        orange: {
            bg: 'bg-orange-100',
            text: 'text-orange-600',
        },
        green: {
            bg: 'bg-green-100',
            text: 'text-green-600',
        },
    };

    const styles = colorStyles[color];

    return (
        <Card className="transition-shadow hover:shadow-lg p-6 h-full flex flex-col">
            <CardHeader className="p-0 flex-1">
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={cn(
                        "mb-4 flex h-12 w-12 items-center justify-center rounded-lg",
                        styles.bg,
                        styles.text
                    )}
                >
                    {icon}
                </motion.div>
                <CardTitle className="mb-2 mt-4">{title}</CardTitle>
                <div className="mb-4">
                    <span className={cn("text-3xl font-bold block", styles.text)}>
                        {value}
                    </span>
                    <span className="text-sm text-muted-foreground">{label}</span>
                </div>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
