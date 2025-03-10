// src/api/adminApi.ts
import { supabase } from '../lib/supabase';

// 관리자 로그인
export const adminSignIn = async (email: string, password: string): Promise<{
    success: boolean;
    error: Error | null;
    session: any | null;
}> => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        // 로그인한 사용자가 관리자인지 확인
        const { data: adminData, error: adminError } = await supabase
            .from('admins')
            .select('id')
            .eq('email', email)
            .single();

        if (adminError) throw adminError;

        if (!adminData) {
            // 관리자가 아니면 로그아웃 처리
            await supabase.auth.signOut();
            return {
                success: false,
                error: new Error('관리자 권한이 없습니다.'),
                session: null
            };
        }

        return {
            success: true,
            error: null,
            session: data.session
        };
    } catch (error) {
        console.error('관리자 로그인 오류:', error);
        return {
            success: false,
            error: error as Error,
            session: null
        };
    }
};

// 현재 사용자가 관리자인지 확인
export const checkIsAdmin = async (): Promise<{ isAdmin: boolean; error: Error | null }> => {
    try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!sessionData.session) {
            return { isAdmin: false, error: null };
        }

        const email = sessionData.session.user.email;

        if (!email) {
            return { isAdmin: false, error: null };
        }

        const { data: adminData, error: adminError } = await supabase
            .from('admins')
            .select('id')
            .eq('email', email)
            .single();

        if (adminError && adminError.code !== 'PGRST116') {
            throw adminError;
        }

        return { isAdmin: !!adminData, error: null };
    } catch (error) {
        console.error('관리자 확인 오류:', error);
        return { isAdmin: false, error: error as Error };
    }
};
