// pages/Login.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';
import authService from '@/services/authService';

const Login = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, error, clearError } = useAuthStore();

    // 이미 인증된 사용자 리다이렉트
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            navigate('/');
        }
    }, [isAuthenticated, isLoading, navigate]);

    // 에러 자동 정리
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                clearError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    // 카카오 로그인 (공식 문서 기준)
    const handleKakaoLogin = async () => {
        try {
            // 공식 문서의 signInWithKakao 함수 사용
            const { data, error } = await authService.signInWithKakao();

            if (error) {
                console.error('카카오 로그인 오류:', error);
                return;
            }

            console.log('카카오 로그인 요청 성공:', data);
            // 리다이렉트는 자동으로 발생
        } catch (err) {
            console.error('카카오 로그인 예외:', err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        계정 로그인
                    </h2>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">로그인 오류</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={handleKakaoLogin}
                        disabled={isLoading}
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-yellow-400 py-2 px-4 text-sm font-medium text-black hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                처리 중...
              </span>
                        ) : (
                            <span className="flex items-center">
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.486 0 0 4.486 0 10c0 5.515 4.486 10 10 10s10-4.486 10-10c0-5.515-4.486-10-10-10zm0 18.75c-4.832 0-8.75-3.918-8.75-8.75 0-4.832 3.918-8.75 8.75-8.75 4.832 0 8.75 3.918 8.75 8.75 0 4.832-3.918 8.75-8.75 8.75z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M10 4.375c-3.103 0-5.625 2.522-5.625 5.625 0 3.103 2.522 5.625 5.625 5.625 3.103 0 5.625-2.522 5.625-5.625 0-3.103-2.522-5.625-5.625-5.625z" clipRule="evenodd" />
                </svg>
                카카오로 로그인
              </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
