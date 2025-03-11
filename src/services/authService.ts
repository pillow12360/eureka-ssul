// services/authService.ts
import { supabase } from '@/config/supabase';

// OAuth 제공자 타입 정의 (Kakao 추가)
export type OAuthProvider =  'kakao';

export const authService = {
    /**
     * OAuth 제공자를 통한 로그인
     * @param provider OAuth 제공자 ('google', 'github', 'kakao')
     * @param customRedirectTo 선택적 커스텀 리다이렉트 URL
     */
    async loginWithOAuth(provider: OAuthProvider, customRedirectTo?: string) {
        const redirectTo = customRedirectTo || `${window.location.origin}/auth/callback`;


        // Kakao는 scopes 옵션이 필요할 수 있음
        const options = {
            redirectTo,
            ...(provider === 'kakao' && {
                scopes: 'profile,account_email'
            })
        };

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options
        });

        if (error) throw error;
        return data;
    },

    /**
     * 현재 세션에서 로그아웃
     */
    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /**
     * 현재 인증된 사용자 정보 가져오기
     */
    getCurrentUser() {
        return supabase.auth.getUser();
    },

    /**
     * 현재 세션 정보 가져오기
     */
    getSession() {
        return supabase.auth.getSession();
    },

    /**
     * 인증 상태 변경 이벤트에 대한 리스너 설정
     * @param callback 상태 변경 시 실행될 콜백 함수
     */
    onAuthStateChange(callback: (event: any, session: any) => void) {
        return supabase.auth.onAuthStateChange(callback);
    }
};
