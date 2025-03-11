// pages/auth/AuthCallback.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/config/supabase'; // 직접 supabase 인스턴스 사용
import useAuthStore from '@/stores/useAuthStore';

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                console.log('인증 콜백 처리 시작...');
                console.log('현재 URL:', window.location.href);

                // 1. 세션 처리를 Supabase에게 맡김
                // Supabase는 URL의 해시 파라미터를 자동으로 처리
                const { data, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('세션 가져오기 오류:', sessionError);
                    setError(sessionError.message);
                    setIsProcessing(false);
                    return;
                }

                console.log('세션 데이터:', data);

                if (!data.session) {
                    console.error('세션이 설정되지 않았습니다');
                    setError('로그인 세션을 설정할 수 없습니다');
                    setIsProcessing(false);
                    return;
                }

                // 2. 상태 업데이트
                console.log('세션 확인됨, 상태 업데이트 중...');
                await checkAuth();

                // 3. 리다이렉트
                const params = new URLSearchParams(location.search);
                navigate(params.get('next') ?? '/');
            } catch (error) {
                console.error('인증 콜백 처리 중 오류 발생:', error);
                setError(error instanceof Error ? error.message : '인증 처리 중 오류가 발생했습니다');
                setIsProcessing(false);
            }
        };

        handleAuthCallback();
    }, [location, navigate, checkAuth]);

};

export default AuthCallback;
