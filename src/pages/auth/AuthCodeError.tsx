import { Link } from 'react-router-dom';

const AuthCodeError = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center mb-6">
                    <div className="rounded-full bg-red-100 p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-xl font-bold text-center mb-4">인증 오류</h1>

                <p className="text-gray-600 mb-6 text-center">
                    로그인 과정에서 오류가 발생했습니다. 다음과 같은 이유로 문제가 발생했을 수 있습니다:
                </p>

                <ul className="list-disc pl-5 mb-6 text-gray-600">
                    <li className="mb-2">인증 코드가 유효하지 않거나 만료되었습니다.</li>
                    <li className="mb-2">인증 요청이 취소되었습니다.</li>
                    <li className="mb-2">브라우저 쿠키 또는 로컬 스토리지에 문제가 있습니다.</li>
                    <li className="mb-2">네트워크 연결에 문제가 있습니다.</li>
                </ul>

                <div className="flex flex-col space-y-3">
                    <Link
                        to="/login"
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-center transition duration-200"
                    >
                        로그인 페이지로 돌아가기
                    </Link>

                    <Link
                        to="/"
                        className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-center transition duration-200"
                    >
                        홈으로 이동
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AuthCodeError;
