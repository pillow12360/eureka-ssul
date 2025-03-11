// stores/useAuthStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import authService from '@/services/authService';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;

    // 액션
    loginWithKakao: () => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

// 초기 상태
const initialState = {
    user: null,
    session: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
};

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                // ✅ 카카오 로그인 (redirect 후 상태 갱신 필요)
                loginWithKakao: async () => {
                    set({ isLoading: true, error: null });
                    try {
                        console.log('🔵 Kakao 로그인 시도');
                        const { error } = await authService.signInWithKakao();

                        if (error) {
                            console.error('🔴 Kakao 로그인 오류:', error);
                            set({
                                error: error.message,
                                isLoading: false
                            });
                            return;
                        }

                        // ✅ Supabase가 OAuth 처리 후 상태 업데이트 필요
                        console.log('✅ Kakao 로그인 성공, 상태 업데이트 대기');
                        set({ isLoading: false });

                    } catch (error) {
                        console.error('🔴 Kakao 로그인 예외:', error);
                        set({
                            error: error instanceof Error ? error.message : '로그인 중 오류 발생',
                            isLoading: false
                        });
                    }
                },

                // ✅ 로그아웃 (상태 초기화)
                logout: async () => {
                    set({ isLoading: true, error: null });
                    try {
                        await authService.signOut();
                        console.log('✅ 로그아웃 성공');
                        set({ ...initialState });
                    } catch (error) {
                        console.error('🔴 로그아웃 오류:', error);
                        set({
                            error: error instanceof Error ? error.message : '로그아웃 중 오류 발생',
                            isLoading: false
                        });
                    }
                },

                // ✅ 현재 인증 상태 확인
                checkAuth: async () => {
                    set({ isLoading: true, error: null });
                    try {
                        const { data: userData, error: userError } = await authService.getUser();
                        if (userError) throw userError;

                        const { data: sessionData, error: sessionError } = await authService.getSession();
                        if (sessionError) throw sessionError;

                        set({
                            user: userData.user,
                            session: sessionData.session,
                            isAuthenticated: !!userData.user,
                            isLoading: false,
                            error: null
                        });

                        console.log('✅ 인증 상태 확인 완료');
                    } catch (error) {
                        console.error('🔴 인증 상태 확인 오류:', error);
                        set({
                            ...initialState,
                            error: error instanceof Error ? error.message : '인증 확인 중 오류 발생',
                            isLoading: false
                        });
                    }
                },

                // ✅ 에러 초기화
                clearError: () => set({ error: null }),

                // ✅ 스토어 초기화
                reset: () => set(initialState),
            }),
            {
                name: 'auth-storage',
                partialize: (state) => ({
                    isAuthenticated: state.isAuthenticated
                }),
            }
        )
    )
);

const unsubscribeAuthListener = authService.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log('🔵 인증 상태 변경 감지:', event);
        useAuthStore.getState().checkAuth();
    } else if (event === 'SIGNED_OUT') {
        console.log('🔴 로그아웃 감지:', event);
        useAuthStore.getState().reset();
    }
});

// ✅ 애플리케이션이 언마운트될 때 이벤트 리스너 정리
window.addEventListener('beforeunload', () => {
    unsubscribeAuthListener();
    console.log('🔴 인증 상태 변경 리스너 해제');
});

export default useAuthStore;
