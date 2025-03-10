import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Profile } from "@/types/profile";
import { useNavigate } from "react-router-dom";
import { useAlertDialogStore } from "@/store/useAlertDialogStore";
import ProfileCard from "./ProfileCard"; // 개선된 컴포넌트 임포트

// 샘플 데이터 - 실제로는 API나 데이터베이스에서 가져올 것입니다
const sampleProfiles: Profile[] = [
    {
        id: 1,
        name: "김유레카",
        features: "알고리즘, React, 백엔드",
        bio: "안녕하세요! 풀스택 개발자를 꿈꾸는 김유레카입니다. 부트캠프에서 열심히 공부하고 있어요. 함께 성장해요!",
        avatar: null,
        comments: 5
    },
    {
        id: 2,
        name: "이코딩",
        features: "디자인, UI/UX, Figma",
        bio: "UI/UX 디자이너로 활동하고 있습니다. 사용자 중심 디자인과 인터랙션에 관심이 많아요. 부트캠프에서 개발 지식도 함께 쌓고 있습니다.",
        avatar: null,
        comments: 3
    },
    {
        id: 3,
        name: "박개발",
        features: "Node.js, TypeScript, AWS",
        bio: "백엔드 개발자 박개발입니다. 서버 아키텍처 설계와 클라우드 인프라에 관심이 많습니다. 취미는 알고리즘 문제 풀기와 오픈소스 기여입니다.",
        avatar: null,
        comments: 8
    },
    {
        id: 4,
        name: "최테크",
        features: "머신러닝, Python, 데이터 분석",
        bio: "데이터 사이언티스트를 꿈꾸고 있습니다. 통계와 머신러닝 알고리즘에 관심이 많고, 현재는 자연어 처리 프로젝트를 진행 중입니다.",
        avatar: null,
        comments: 2
    }
];

// 샘플 댓글 데이터
const sampleCommentsByProfileId = {
    1: [
        {
            id: 1,
            author: "박개발",
            content: "정말 성실하게 활동하시는 것 같아요! 알고리즘 스터디에 관심 있으시면 함께해요.",
            createdAt: "2024-03-08T12:30:00Z",
            likes: 3
        },
        {
            id: 2,
            author: "이코딩",
            content: "React 프로젝트 같이 해보면 좋을 것 같아요. 연락주세요!",
            createdAt: "2024-03-09T15:45:00Z",
            likes: 2
        },
    ],
    2: [
        {
            id: 3,
            author: "김유레카",
            content: "디자인 감각이 정말 좋으신 것 같아요! UI/UX 관련 조언 부탁드립니다.",
            createdAt: "2024-03-10T09:15:00Z",
            likes: 1
        },
    ],
    3: [
        {
            id: 4,
            author: "최테크",
            content: "서버 구축 관련해서 질문이 있는데 시간 되실 때 도움 받을 수 있을까요?",
            createdAt: "2024-03-07T14:20:00Z",
            likes: 4
        },
    ],
    4: [
        {
            id: 5,
            author: "박개발",
            content: "데이터 분석 관련 프로젝트를 진행 중인데 조언 부탁드려요!",
            createdAt: "2024-03-06T10:45:00Z",
            likes: 2
        },
    ]
};

interface Comment {
    id: number;
    author: string;
    content: string;
    createdAt: string;
    likes: number;
}

const ProfileList: React.FC = () => {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [expandedProfileId, setExpandedProfileId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [comments, setComments] = useState<Record<number, Comment[]>>({});
    const [newComments, setNewComments] = useState<Record<number, string>>({});

    const openProfileForm = useAlertDialogStore(state => state.open);

    useEffect(() => {
        // 예: fetchProfiles().then(data => setProfiles(data));
        setProfiles(sampleProfiles);
        setComments(sampleCommentsByProfileId);
        setLoading(false);
    }, []);

    const handleProfileToggle = (profileId: number) => {
        setExpandedProfileId(expandedProfileId === profileId ? null : profileId);

        // 실제 구현 시에는 여기서 API 호출로 상세 정보를 가져올 수 있음
        // if (expandedProfileId !== profileId) {
        //   fetchProfileDetails(profileId).then(data => { ... });
        // }
    };

    const handleCreateProfileClick = (): void => {
        openProfileForm({
            title: '프로필 꾸미러 가기',
            description: '사람들에게 자신만의 소개글을 공유해주세요!',
            onConfirm: () => {
                navigate('/profile/create')
            },
            confirmText: '확인'
        });
    };

    const handleEditProfile = (profileId: number) => {
        navigate(`/profile/edit/${profileId}`);
    };

    const handleCommentChange = (profileId: number, value: string) => {
        setNewComments({
            ...newComments,
            [profileId]: value
        });
    };

    const handleCommentSubmit = (profileId: number) => {
        if (!newComments[profileId] || newComments[profileId].trim() === '') return;

        const newComment = {
            id: Math.floor(Math.random() * 1000) + 100, // 임시 ID 생성
            author: "현재 사용자", // 실제로는 로그인한 사용자 정보를 사용
            content: newComments[profileId],
            createdAt: new Date().toISOString(),
            likes: 0
        };

        // 해당 프로필의 댓글 목록 업데이트
        const updatedComments = {
            ...comments,
            [profileId]: comments[profileId] ? [...comments[profileId], newComment] : [newComment]
        };
        setComments(updatedComments);

        // 프로필의 댓글 수 업데이트
        const updatedProfiles = profiles.map(profile =>
            profile.id === profileId
                ? { ...profile, comments: (profile.comments || 0) + 1 }
                : profile
        );
        setProfiles(updatedProfiles);

        // 입력 필드 초기화
        setNewComments({ ...newComments, [profileId]: '' });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto py-6 px-4 text-center">
                <p>프로필을 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 px-4">
            {/* 헤더 섹션 */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-center md:text-left">
                    유레카 썰
                    <span className="text-sm font-normal ml-2 text-gray-500">
            프론트엔드 동료들의 이야기
          </span>
                </h1>
                <div className="mt-4 md:mt-0 flex gap-2">
                    <Button
                        onClick={handleCreateProfileClick}
                        className="flex items-center gap-2"
                        variant="default"
                    >
                        <User size={16} />
                        프로필 만들기
                    </Button>
                </div>
            </header>

            {/* 소개 섹션 */}
            <section className="mb-8">
                <div className="bg-slate-50 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold mb-2">나를 소개하고 피드백을 받아보세요!</h2>
                    <p className="text-gray-600 mb-4">
                        자신의 프로필을 등록하고 다른 부트캠프 참가자들의 의견을 들어보세요.
                        서로에게 도움이 되는 댓글을 남겨 함께 성장해 나가요.
                    </p>
                    <Button onClick={handleCreateProfileClick} variant="outline">
                        시작하기
                    </Button>
                </div>
            </section>

            {/* 프로필 그리드 */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">프로필 목록</h2>
                <div className="space-y-6">
                    {profiles.map((profile) => (
                        <div key={profile.id} className="mb-6">
                            <ProfileCard
                                profile={profile}
                                isExpanded={expandedProfileId === profile.id}
                                comments={comments[profile.id] || []}
                                newComment={newComments[profile.id] || ''}
                                onToggle={() => handleProfileToggle(profile.id)}
                                onEditProfile={handleEditProfile}
                                onCommentChange={(value) => handleCommentChange(profile.id, value)}
                                onCommentSubmit={() => handleCommentSubmit(profile.id)}
                                formatDate={formatDate}
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ProfileList;
