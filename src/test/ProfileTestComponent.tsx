import React, { useState, useEffect } from 'react';
import { useProfiles } from '../hooks/useProfiles';
import { useComments } from '../hooks/useComments';
import { useProfileLikes } from '../hooks/useProfileLikes';
import useAuthStore from '../stores/useAuthStore';
import { NewProfile, NewComment, ProfileUpdate } from '../types/models';

const ProfileTestComponent: React.FC = () => {
    const { user, isAuthenticated } = useAuthStore();
    const {
        profiles,
        userProfile,
        loading: profileLoading,
        error: profileError,
        createProfile,
        updateProfile,
        deleteProfile,
        uploadProfileImage
    } = useProfiles();

    const [selectedProfileId, setSelectedProfileId] = useState<string>('');
    const [profileFormData, setProfileFormData] = useState<Partial<NewProfile>>({
        name: '',
        features: '',
        bio: '',
        image_url: null
    });
    const [updateFormData, setUpdateFormData] = useState<Partial<ProfileUpdate>>({});
    const [image, setImage] = useState<File | null>(null);

    // 댓글 관련 상태와 훅
    const {
        comments,
        loading: commentLoading,
        error: commentError,
        fetchComments,
        createComment,
        updateComment,
        deleteComment
    } = useComments(selectedProfileId);

    const [commentText, setCommentText] = useState('');

    // 좋아요 관련 상태와 훅
    const {
        likeCount,
        userLiked,
        loading: likeLoading,
        error: likeError,
        fetchLikeStatus,
        toggleLike
    } = useProfileLikes(selectedProfileId);

    // 프로필 선택 시 댓글과 좋아요 상태 로드
    useEffect(() => {
        if (selectedProfileId) {
            fetchComments(selectedProfileId);
            fetchLikeStatus(selectedProfileId);
        }
    }, [selectedProfileId, fetchComments, fetchLikeStatus]);

    // 프로필 생성 폼 제출 처리
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id) {
            alert('로그인이 필요합니다.');
            return;
        }

        // 이미지가 있으면 업로드
        let imageUrl = null;
        if (image) {
            const url = await uploadProfileImage(image);
            if (url) {
                imageUrl = url;
            }
        }

        // 프로필 생성
        const newProfileData: NewProfile = {
            name: profileFormData.name || '',
            features: profileFormData.features || '',
            bio: profileFormData.bio || '',
            image_url: imageUrl,
            user_id: user.id
        };

        const createdProfile = await createProfile(newProfileData);
        if (createdProfile) {
            // 폼 초기화
            setProfileFormData({
                name: '',
                features: '',
                bio: '',
                image_url: null
            });
            setImage(null);
            alert('프로필이 생성되었습니다!');
        }
    };

    // 이미지 파일 선택 처리
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    // 프로필 수정 폼 제출 처리
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedProfileId) {
            alert('수정할 프로필을 선택해주세요.');
            return;
        }

        const updates: ProfileUpdate = {};

        if (updateFormData.name) updates.name = updateFormData.name;
        if (updateFormData.features) updates.features = updateFormData.features;
        if (updateFormData.bio) updates.bio = updateFormData.bio;

        // 이미지가 있으면 업로드
        if (image) {
            const url = await uploadProfileImage(image);
            if (url) {
                updates.image_url = url;
            }
        }

        // 업데이트할 내용이 있는지 확인
        if (Object.keys(updates).length === 0) {
            alert('변경할 내용을 입력해주세요.');
            return;
        }

        const updatedProfile = await updateProfile(selectedProfileId, updates);
        if (updatedProfile) {
            // 폼 초기화
            setUpdateFormData({});
            setImage(null);
            alert('프로필이 수정되었습니다!');
        }
    };

    // 프로필 삭제 처리
    const handleProfileDelete = async () => {
        if (!selectedProfileId) {
            alert('삭제할 프로필을 선택해주세요.');
            return;
        }

        if (window.confirm('정말로 이 프로필을 삭제하시겠습니까?')) {
            const success = await deleteProfile(selectedProfileId);
            if (success) {
                setSelectedProfileId('');
                alert('프로필이 삭제되었습니다.');
            }
        }
    };

    // 댓글 생성 처리
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !selectedProfileId || !commentText.trim()) {
            alert('로그인 후 댓글 내용을 입력해주세요.');
            return;
        }

        const newComment: NewComment = {
            profile_id: selectedProfileId,
            author_name: user.email || '익명',
            content: commentText,
            parent_id: null
        };

        const createdComment = await createComment(newComment);
        if (createdComment) {
            setCommentText('');
        }
    };

    // 좋아요 토글 처리
    const handleLikeToggle = async () => {
        if (!isAuthenticated) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (selectedProfileId) {
            await toggleLike(selectedProfileId);
        }
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-4">프로필 테스트 컴포넌트</h1>
                {profileError && <div className="p-2 mb-4 bg-red-100 text-red-800 rounded">{String(profileError)}</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 좌측: 프로필 생성 및 목록 */}
                <div>
                    <div className="bg-white p-4 rounded shadow mb-6">
                        <h2 className="text-xl font-semibold mb-4">프로필 생성</h2>
                        {!isAuthenticated ? (
                            <div className="p-2 bg-yellow-100 text-yellow-800 rounded">로그인이 필요합니다.</div>
                        ) : (
                            <form onSubmit={handleProfileSubmit}>
                                <div className="mb-4">
                                    <label className="block mb-2">이름</label>
                                    <input
                                        type="text"
                                        value={profileFormData.name || ''}
                                        onChange={(e) => setProfileFormData({...profileFormData, name: e.target.value})}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">특징 (쉼표로 구분)</label>
                                    <input
                                        type="text"
                                        value={profileFormData.features || ''}
                                        onChange={(e) => setProfileFormData({...profileFormData, features: e.target.value})}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">자기소개</label>
                                    <textarea
                                        value={profileFormData.bio || ''}
                                        onChange={(e) => setProfileFormData({...profileFormData, bio: e.target.value})}
                                        className="w-full p-2 border rounded"
                                        rows={3}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2">프로필 이미지</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    disabled={profileLoading}
                                >
                                    {profileLoading ? '처리 중...' : '프로필 생성'}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold mb-4">프로필 목록</h2>
                        {profileLoading ? (
                            <div>로딩 중...</div>
                        ) : profiles.length === 0 ? (
                            <div>등록된 프로필이 없습니다.</div>
                        ) : (
                            <div className="space-y-4">
                                {profiles.map(profile => (
                                    <div
                                        key={profile.id}
                                        className={`p-3 border rounded cursor-pointer ${selectedProfileId === profile.id ? 'border-blue-500 bg-blue-50' : ''}`}
                                        onClick={() => setSelectedProfileId(profile.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {profile.image_url && (
                                                <img
                                                    src={profile.image_url}
                                                    alt={profile.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            )}
                                            <div>
                                                <h3 className="font-semibold">{profile.name}</h3>
                                                <p className="text-sm text-gray-600">{profile.features}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center mt-2 text-sm text-gray-600">
                                            <span className="mr-3">💬 {profile.comments}</span>
                                            <span>❤️ {profile.like_count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 우측: 선택된 프로필 상세 및 수정/삭제 */}
                <div>
                    {selectedProfileId ? (
                        <>
                            <div className="bg-white p-4 rounded shadow mb-6">
                                <h2 className="text-xl font-semibold mb-4">프로필 수정</h2>
                                <form onSubmit={handleProfileUpdate}>
                                    <div className="mb-4">
                                        <label className="block mb-2">이름</label>
                                        <input
                                            type="text"
                                            value={updateFormData.name || ''}
                                            onChange={(e) => setUpdateFormData({...updateFormData, name: e.target.value})}
                                            className="w-full p-2 border rounded"
                                            placeholder="변경할 이름"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">특징 (쉼표로 구분)</label>
                                        <input
                                            type="text"
                                            value={updateFormData.features || ''}
                                            onChange={(e) => setUpdateFormData({...updateFormData, features: e.target.value})}
                                            className="w-full p-2 border rounded"
                                            placeholder="변경할 특징"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">자기소개</label>
                                        <textarea
                                            value={updateFormData.bio || ''}
                                            onChange={(e) => setUpdateFormData({...updateFormData, bio: e.target.value})}
                                            className="w-full p-2 border rounded"
                                            rows={3}
                                            placeholder="변경할 자기소개"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-2">프로필 이미지</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                            disabled={profileLoading}
                                        >
                                            {profileLoading ? '처리 중...' : '프로필 수정'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleProfileDelete}
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                            disabled={profileLoading}
                                        >
                                            {profileLoading ? '처리 중...' : '프로필 삭제'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* 좋아요 섹션 */}
                            <div className="bg-white p-4 rounded shadow mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">좋아요</h2>
                                    <button
                                        onClick={handleLikeToggle}
                                        className={`px-4 py-2 rounded ${
                                            userLiked
                                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                        disabled={likeLoading || !isAuthenticated}
                                    >
                                        {likeLoading
                                            ? '처리 중...'
                                            : userLiked
                                                ? '❤️ 좋아요 취소'
                                                : '🤍 좋아요'}
                                    </button>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded">
                                    <span className="text-2xl font-bold text-red-500">{likeCount}</span>
                                    <span className="ml-2 text-gray-600">명이 이 프로필을 좋아합니다</span>
                                </div>
                                {likeError && (
                                    <div className="mt-3 p-2 bg-red-100 text-red-800 rounded text-sm">
                                        {String(likeError)}
                                    </div>
                                )}
                                {!isAuthenticated && (
                                    <div className="mt-3 p-2 bg-yellow-100 text-yellow-800 rounded text-sm">
                                        좋아요 기능을 사용하려면 로그인이 필요합니다.
                                    </div>
                                )}
                            </div>

                            {/* 댓글 섹션 */}
                            <div className="bg-white p-4 rounded shadow">
                                <h2 className="text-xl font-semibold mb-4">댓글</h2>

                                {/* 댓글 작성 폼 */}
                                {isAuthenticated ? (
                                    <form onSubmit={handleCommentSubmit} className="mb-6">
                                        <div className="mb-3">
                      <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="w-full p-2 border rounded"
                          rows={3}
                          placeholder="댓글을 입력하세요..."
                          required
                      />
                                        </div>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            disabled={commentLoading}
                                        >
                                            {commentLoading ? '처리 중...' : '댓글 작성'}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="p-3 mb-4 bg-yellow-100 text-yellow-800 rounded">
                                        댓글을 작성하려면 로그인이 필요합니다.
                                    </div>
                                )}

                                {/* 댓글 목록 */}
                                {commentLoading ? (
                                    <div>댓글 로딩 중...</div>
                                ) : commentError ? (
                                    <div className="p-3 bg-red-100 text-red-800 rounded">{String(commentError)}</div>
                                ) : comments.length === 0 ? (
                                    <div className="text-gray-500">아직 댓글이 없습니다.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {comments.map((comment) => (
                                            <div key={comment.id} className="p-3 border rounded">
                                                <div className="flex justify-between">
                                                    <span className="font-semibold">{comment.author_name}</span>
                                                    <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                                                </div>
                                                <p className="mt-2">{comment.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="bg-gray-100 p-6 rounded shadow text-center">
                            <p className="text-gray-600">프로필을 선택하면 상세 정보가 표시됩니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileTestComponent;
