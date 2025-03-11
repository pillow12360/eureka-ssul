// stores/useAuthStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authService, OAuthProvider } from '@/services/authService';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;

    // 액션
    login: (provider: OAuthProvider, redirectTo?: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

// 초기 상태
const initialState = {
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
};

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                ...initialState,

                // OAuth 로그인
                login: async (provider: OAuthProvider, redirectTo?: string) => {
                    set({ isLoading: true, error: null });
                    try {
                        await authService.loginWithOAuth(provider, redirectTo);
                        // 리다이렉트되므로 상태 업데이트는 실제로 콜백에서 이루어짐
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다',
                            isLoading: false
                        });
                    }
                },

                // 로그아웃
                logout: async () => {
                    set({ isLoading: true, error: null });
                    try {
                        await authService.logout();
                        set({ ...initialState, isLoading: false });
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : '로그아웃 중 오류가 발생했습니다',
                            isLoading: false
                        });
                    }
                },

                // 현재 인증 상태 확인
                checkAuth: async () => {
                    set({ isLoading: true, error: null });
                    try {
                        const { data: { user } } = await authService.getCurrentUser();
                        const { data: { session } } = await authService.getSession();

                        set({
                            user,
                            session,
                            isAuthenticated: !!user,
                            isLoading: false,
                            error: null
                        });
                    } catch (error) {
                        set({
                            ...initialState,
                            error: error instanceof Error ? error.message : '인증 확인 중 오류가 발생했습니다',
                            isLoading: false
                        });
                    }
                },

                // 에러 초기화
                clearError: () => set({ error: null }),

                // 스토어 초기화
                reset: () => set(initialState),
            }),
            {
                name: 'auth-storage',
                // 민감한 정보는 제외하고 저장
                partialize: (state) => ({
                    isAuthenticated: state.isAuthenticated
                }),
            }
        )
    )
);

// 인증 상태 변경 리스너 설정
authService.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        useAuthStore.getState().checkAuth();
    } else if (event === 'SIGNED_OUT') {
        useAuthStore.getState().reset();
    }
});

export default useAuthStore;
