import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { User, MessageSquare } from "lucide-react";
import {Profile} from "@/types/profile.ts";
import {useAlertDialogStore} from "@/store/useAlertDialogStore.ts";

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

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState<Profile[]>([]);

    const openProfileForm = useAlertDialogStore(state => state.open);


    useEffect(() => {
        // 예: fetchProfiles().then(data => setProfiles(data));
        setProfiles(sampleProfiles);
    }, []);

    const handleProfileClick = (): void => {
        openProfileForm({
            title: '프로필 꾸미러 가기',
            description: '사람들에게 자신만의 소개글을 공유해주세요!',
            onConfirm: () => {
                navigate('/profile/create')
            },
            confirmText: '확인'
        });
    };

    const handleViewProfile = (id: number): void => {
        navigate(`/profile/${id}`);
    };

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
                        onClick={handleProfileClick}
                        className="flex items-center gap-2"
                        variant="link"
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
                    <Button onClick={handleProfileClick} variant="outline">
                        시작하기
                    </Button>
                </div>
            </section>

            {/* 프로필 그리드 */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">프로필 목록</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profiles.map((profile) => (
                        <Card key={profile.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="p-4 pb-2 flex flex-row items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={profile.avatar || undefined} alt={profile.name} />
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {profile.name.substring(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-medium text-lg">{profile.name}</h3>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {profile.features.split(', ').map((feature, i) => (
                                            <Badge key={i} variant="secondary" className="text-xs">
                                                {feature}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <p className="text-gray-600 line-clamp-3">{profile.bio}</p>
                            </CardContent>
                            <CardFooter className="p-4 pt-2 flex justify-between items-center">
                                <div className="flex items-center text-gray-500 text-sm">
                                    <MessageSquare size={14} className="mr-1" />
                                    <span>댓글 {profile.comments}개</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewProfile(profile.id)}
                                >
                                    자세히 보기
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>


        </div>
    );
};

export default HomePage;
