// useAlertDialog.tsx
import { useState, useCallback } from 'react';

type AlertDialogOptions = {
    title: string;
    description: string;
    cancelText?: string;
    confirmText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
};

const useAlertDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<AlertDialogOptions>({
        title: '',
        description: '',
        cancelText: 'Cancel',
        confirmText: 'Continue',
    });

    const open = useCallback((dialogOptions: AlertDialogOptions) => {
        setOptions({
            ...options,
            ...dialogOptions,
        });
        setIsOpen(true);
    }, [options]);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    const onConfirm = useCallback(() => {
        if (options.onConfirm) {
            options.onConfirm();
        }
        close();
    }, [options, close]);

    const onCancel = useCallback(() => {
        if (options.onCancel) {
            options.onCancel();
        }
        close();
    }, [options, close]);

    return {
        isOpen,
        title: options.title,
        description: options.description,
        cancelText: options.cancelText,
        confirmText: options.confirmText,
        open,
        close,
        onConfirm,
        onCancel,
    };
};

export default useAlertDialog;
