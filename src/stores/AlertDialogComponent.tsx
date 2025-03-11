import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { useAlertDialogStore } from './useAlertDialogStore';

const AlertDialogComponent: React.FC = () => {
    const {
        isOpen,
        title,
        description,
        cancelText,
        confirmText,
        confirm,
        cancel
    } = useAlertDialogStore();

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && cancel()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={cancel}>{cancelText || '취소'}</AlertDialogCancel>
                    <AlertDialogAction onClick={confirm} className="bg-blue-600 text-white">
                        {confirmText || '확인'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AlertDialogComponent;
