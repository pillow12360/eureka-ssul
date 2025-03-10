import { create } from 'zustand';

type AlertDialogState = {
    isOpen: boolean;
    title: string;
    description: string;
    cancelText: string;
    confirmText: string;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
};

type AlertDialogActions = {
    open: (options: {
        title: string;
        description: string;
        cancelText?: string;
        confirmText?: string;
        onConfirm?: () => void;
        onCancel?: () => void;
    }) => void;
    close: () => void;
    confirm: () => void;
    cancel: () => void;
};

// 초기 상태 정의
const initialState: AlertDialogState = {
    isOpen: false,
    title: '',
    description: '',
    cancelText: '취소',
    confirmText: '확인',
    onConfirm: null,
    onCancel: null,
};

// Zustand 스토어 생성
export const useAlertDialogStore = create<AlertDialogState & AlertDialogActions>((set, get) => ({
    ...initialState,

    // 다이얼로그 열기
    open: (options) => {
        set({
            isOpen: true,
            title: options.title,
            description: options.description,
            cancelText: options.cancelText || '취소',
            confirmText: options.confirmText || '확인',
            onConfirm: options.onConfirm || null,
            onCancel: options.onCancel || null,
        });
    },

    // 다이얼로그 닫기
    close: () => {
        set({ isOpen: false });
    },

    // 확인 버튼 클릭
    confirm: () => {
        const { onConfirm } = get();
        if (onConfirm) {
            onConfirm();
        }
        set({ isOpen: false });
    },

    // 취소 버튼 클릭
    cancel: () => {
        const { onCancel } = get();
        if (onCancel) {
            onCancel();
        }
        set({ isOpen: false });
    },
}));

// 편의를 위한 Promise 기반 확인 함수
export const confirmDialog = (options: {
    title: string;
    description: string;
    cancelText?: string;
    confirmText?: string;
}): Promise<boolean> => {
    return new Promise((resolve) => {
        useAlertDialogStore.getState().open({
            ...options,
            onConfirm: () => resolve(true),
            onCancel: () => resolve(false),
        });
    });
};
