// src/pages/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/config/supabase';

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        // 해시 파라미터 처리 및 세션 설정
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
                navigate('/'); // 로그인 성공 후 리다이렉트할 페이지
            } else {
                navigate('/login'); // 실패 시 리다이렉트
            }
        });
    }, [navigate]);

    return <div>인증 처리 중...</div>;
}
