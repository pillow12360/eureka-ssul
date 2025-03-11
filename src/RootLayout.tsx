// RootLayout.tsx
import React from 'react';
import AlertDialogComponent from '@/stores/AlertDialogComponent';
import { Toaster } from "@/components/ui/toaster"

interface RootLayoutProps {
    children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    return (
        <>
            {children}
            <AlertDialogComponent />
            <Toaster />
        </>
    );
};

export default RootLayout;
