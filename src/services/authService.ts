// @/services/authService.ts
import { supabase } from '@/config/supabase';
import { AuthError, Session, User } from '@supabase/supabase-js';

// OAuth 제공자 타입 정의
export type OAuthProvider = 'kakao';

export const authService = {
    /**
     * Kakao OAuth를 통한 로그인
     * 공식 문서: https://supabase.com/docs/guides/auth/social-login/auth-kakao
     */
    async signInWithKakao() {
        return await supabase.auth.signInWithOAuth({
            provider: 'kakao',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            }
        });
    },

    /**
     * 현재 세션에서 로그아웃
     */
    async signOut() {
        return await supabase.auth.signOut();
    },

    /**
     * 현재 인증된 사용자 정보 가져오기
     * @returns 사용자 정보
     */
    async getUser(): Promise<{ data: { user: User | null }, error: AuthError | null }> {
        return await supabase.auth.getUser();
    },

    /**
     * 현재 세션 정보 가져오기
     * @returns 세션 정보
     */
    async getSession(): Promise<{ data: { session: Session | null }, error: AuthError | null }> {
        return await supabase.auth.getSession();
    },

    /**
     * 인증 상태 변경 이벤트에 대한 리스너 설정
     * @param callback 상태 변경 시 실행될 콜백 함수
     */
    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }
};

export default authService;
