// src/pages/TestApi.tsx
import React, {  useState } from 'react';
import { createProfile, getAllProfiles, getProfileById } from '../api/profileApi';
import { createComment, getCommentsByProfileId } from '../api/commentApi';
import { checkIsAdmin } from '../api/adminApi';
import { featuresStringToArray } from '../lib/supabase';

const TestApi: React.FC = () => {
    const [testResults, setTestResults] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const addResult = (message: string) => {
        setTestResults(prev => [...prev, message]);
    };

    const testProfileAPI = async () => {
        setLoading(true);
        addResult('===== 프로필 API 테스트 시작 =====');

        try {
            // 프로필 생성 테스트
            addResult('프로필 생성 테스트...');
            const createResult = await createProfile(
                '테스트 사용자',
                ['개발자', '디자인 좋아함', '맛집 탐방'],
                '안녕하세요! 저는 테스트 사용자입니다. 잘 부탁드립니다.'
            );

            if (createResult.error) {
                addResult(`프로필 생성 실패: ${createResult.error.message}`);
            } else {
                const profileId = createResult.data?.id;
                addResult(`프로필 생성 성공! ID: ${profileId}`);

                // 프로필 조회 테스트
                if (profileId) {
                    addResult('프로필 조회 테스트...');
                    const getResult = await getProfileById(profileId);

                    if (getResult.error) {
                        addResult(`프로필 조회 실패: ${getResult.error.message}`);
                    } else {
                        addResult(`프로필 조회 성공! 이름: ${getResult.data?.name}`);
                        addResult(`특징: ${featuresStringToArray(getResult.data?.features || '').join(', ')}`);
                    }
                }
            }

            // 모든 프로필 조회 테스트
            addResult('모든 프로필 조회 테스트...');
            const getAllResult = await getAllProfiles();

            if (getAllResult.error) {
                addResult(`모든 프로필 조회 실패: ${getAllResult.error.message}`);
            } else {
                addResult(`모든 프로필 조회 성공! 프로필 수: ${getAllResult.data?.length}`);
            }
        } catch (error) {
            addResult(`테스트 중 오류 발생: ${(error as Error).message}`);
        }

        addResult('===== 프로필 API 테스트 종료 =====');
        setLoading(false);
    };

    const testCommentAPI = async () => {
        setLoading(true);
        addResult('===== 댓글 API 테스트 시작 =====');

        try {
            // 모든 프로필 가져오기
            const { data: profiles } = await getAllProfiles();

            if (!profiles || profiles.length === 0) {
                addResult('테스트할 프로필이 없습니다. 먼저 프로필을 생성해주세요.');
                return;
            }

            const profileId = profiles[0].id;
            addResult(`테스트에 사용할 프로필 ID: ${profileId}`);

            // 댓글 생성 테스트
            addResult('댓글 생성 테스트...');
            const commentResult = await createComment(
                profileId,
                '익명 댓글러',
                '안녕하세요! 테스트 댓글입니다.'
            );

            if (commentResult.error) {
                addResult(`댓글 생성 실패: ${commentResult.error.message}`);
            } else {
                const commentId = commentResult.data?.id;
                addResult(`댓글 생성 성공! ID: ${commentId}`);

                // 대댓글 생성 테스트
                if (commentId) {
                    addResult('대댓글 생성 테스트...');
                    const replyResult = await createComment(
                        profileId,
                        '대댓글 작성자',
                        '대댓글 테스트입니다.',
                        commentId
                    );

                    if (replyResult.error) {
                        addResult(`대댓글 생성 실패: ${replyResult.error.message}`);
                    } else {
                        addResult(`대댓글 생성 성공! ID: ${replyResult.data?.id}`);
                    }
                }

                // 댓글 조회 테스트
                addResult('댓글 조회 테스트...');
                const getCommentsResult = await getCommentsByProfileId(profileId);

                if (getCommentsResult.error) {
                    addResult(`댓글 조회 실패: ${getCommentsResult.error.message}`);
                } else {
                    const comments = getCommentsResult.data || [];
                    addResult(`댓글 조회 성공! 댓글 수: ${comments.length}`);

                    // 댓글 구조 확인
                    for (const comment of comments) {
                        addResult(`댓글: ${comment.content} (작성자: ${comment.author_name})`);
                        if (comment.replies && comment.replies.length > 0) {
                            comment.replies.forEach(reply => {
                                addResult(`  └ 대댓글: ${reply.content} (작성자: ${reply.author_name})`);
                            });
                        }
                    }
                }
            }
        } catch (error) {
            addResult(`테스트 중 오류 발생: ${(error as Error).message}`);
        }

        addResult('===== 댓글 API 테스트 종료 =====');
        setLoading(false);
    };

    const testAdminAPI = async () => {
        setLoading(true);
        addResult('===== 관리자 API 테스트 시작 =====');

        try {
            // 현재 사용자가 관리자인지 확인
            const { isAdmin, error } = await checkIsAdmin();

            if (error) {
                addResult(`관리자 확인 실패: ${error.message}`);
            } else {
                addResult(`현재 사용자는 관리자${isAdmin ? '입니다' : '가 아닙니다'}.`);
            }
        } catch (error) {
            addResult(`테스트 중 오류 발생: ${(error as Error).message}`);
        }

        addResult('===== 관리자 API 테스트 종료 =====');
        setLoading(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">API 테스트</h1>

            <div className="flex gap-2 mb-6">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={testProfileAPI}
                    disabled={loading}
                >
                    프로필 API 테스트
                </button>

                <button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={testCommentAPI}
                    disabled={loading}
                >
                    댓글 API 테스트
                </button>

                <button
                    className="px-4 py-2 bg-purple-500 text-white rounded"
                    onClick={testAdminAPI}
                    disabled={loading}
                >
                    관리자 API 테스트
                </button>
            </div>

            <div className="border p-4 h-96 overflow-y-auto bg-gray-100">
                <h2 className="text-lg font-semibold mb-2">테스트 결과:</h2>
                {testResults.length === 0 ? (
                    <p className="text-gray-500">버튼을 클릭하여 테스트를 실행하세요.</p>
                ) : (
                    <pre className="whitespace-pre-wrap">
            {testResults.map((result, index) => (
                <div key={index} className="mb-1">
                    {result}
                </div>
            ))}
          </pre>
                )}
            </div>
        </div>
    );
};

export default TestApi;
