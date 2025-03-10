// RootLayout.tsx
import React from 'react';
import AlertDialogComponent from './store/AlertDialogComponent';

interface RootLayoutProps {
    children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    return (
        <>
            {children}
            <AlertDialogComponent />
        </>
    );
};

export default RootLayout;
