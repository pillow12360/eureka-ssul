import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Profile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageSquare, ThumbsUp, User, Tag, Clock, Edit } from "lucide-react";

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
    // 나머지 프로필은 생략
];

// 샘플 댓글 데이터
const sampleComments = [
    {
        id: 1,
        profileId: 1,
        author: "박개발",
        content: "정말 성실하게 활동하시는 것 같아요! 알고리즘 스터디에 관심 있으시면 함께해요.",
        createdAt: "2024-03-08T12:30:00Z",
        likes: 3
    },
    {
        id: 2,
        profileId: 1,
        author: "이코딩",
        content: "React 프로젝트 같이 해보면 좋을 것 같아요. 연락주세요!",
        createdAt: "2024-03-09T15:45:00Z",
        likes: 2
    },
    {
        id: 3,
        profileId: 1,
        author: "최테크",
        content: "백엔드에 관심이 많으시군요! 제가 추천하는 학습 자료 공유해 드릴게요.",
        createdAt: "2024-03-10T09:15:00Z",
        likes: 1
    }
];

interface Comment {
    id: number;
    profileId: number;
    author: string;
    content: string;
    createdAt: string;
    likes: number;
}

const ProfileDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // 실제 구현에서는 API 호출
        const fetchProfile = async () => {
            setLoading(true);
            try {
                // const response = await fetch(`/api/profiles/${id}`);
                // const data = await response.json();
                // setProfile(data);

                // 샘플 데이터 사용
                const profileData = sampleProfiles.find(p => p.id === Number(id));
                setProfile(profileData || null);

                // 댓글 데이터 설정
                const profileComments = sampleComments.filter(c => c.profileId === Number(id));
                setComments(profileComments);
            } catch (error) {
                console.error("프로필을 불러오는 중 오류 발생:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProfile();
        }
    }, [id]);

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleEditProfile = () => {
        navigate(`/profile/edit/${id}`);
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
            <div className="container mx-auto py-10 px-4 text-center">
                <p>프로필을 불러오는 중...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container mx-auto py-10 px-4 text-center">
                <p>프로필을 찾을 수 없습니다.</p>
                <Button onClick={handleBackClick} className="mt-4">돌아가기</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <Button variant="ghost" onClick={handleBackClick} className="mb-6">
                ← 돌아가기
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 프로필 정보 카드 */}
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader className="text-center">
                            <Avatar className="w-24 h-24 mx-auto mb-4">
                                <AvatarImage src={profile.avatar || undefined} alt={profile.name} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                    {profile.name.substring(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-2xl">{profile.name}</CardTitle>
                            <div className="flex flex-wrap justify-center gap-1 mt-2">
                                {profile.features.split(', ').map((feature, i) => (
                                    <Badge key={i} variant="secondary">
                                        {feature}
                                    </Badge>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="outline"
                                className="w-full mt-2"
                                onClick={handleEditProfile}
                            >
                                <Edit size={16} className="mr-2" /> 프로필 수정
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* 상세 정보 아코디언 섹션 */}
                <div className="md:col-span-2">
                    <Card>
                        <CardContent className="p-6">
                            <Accordion type="single" collapsible className="w-full" defaultValue="about">
                                <AccordionItem value="about">
                                    <AccordionTrigger className="text-lg font-medium">
                                        <User size={18} className="mr-2" /> 자기소개
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 pb-2 px-2">
                                        <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="skills">
                                    <AccordionTrigger className="text-lg font-medium">
                                        <Tag size={18} className="mr-2" /> 보유 기술 및 특징
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 pb-2 px-2">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium mb-2">주요 특징</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {profile.features.split(', ').map((feature, i) => (
                                                        <Badge key={i} variant="outline" className="px-3 py-1">
                                                            {feature}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* 추가 정보가 있다면 여기에 표시 */}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="activity">
                                    <AccordionTrigger className="text-lg font-medium">
                                        <Clock size={18} className="mr-2" /> 활동 내역
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 pb-2 px-2">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium mb-2">최근 활동</h4>
                                                <p className="text-gray-500">아직 등록된 활동 내역이 없습니다.</p>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="comments">
                                    <AccordionTrigger className="text-lg font-medium">
                                        <MessageSquare size={18} className="mr-2" /> 댓글 ({comments.length})
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 pb-2 px-2">
                                        <div className="space-y-6">
                                            {comments.length > 0 ? (
                                                comments.map((comment) => (
                                                    <div key={comment.id} className="border-b pb-4 last:border-0">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center">
                                                                <span className="font-medium">{comment.author}</span>
                                                                <span className="text-gray-500 text-sm ml-2">
                                  {formatDate(comment.createdAt)}
                                </span>
                                                            </div>
                                                            <Button variant="ghost" size="sm" className="h-6 px-2">
                                                                <ThumbsUp size={14} className="mr-1" /> {comment.likes}
                                                            </Button>
                                                        </div>
                                                        <p className="text-gray-700">{comment.content}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">아직 댓글이 없습니다.</p>
                                            )}

                                            {/* 댓글 입력 폼 */}
                                            <div className="pt-4">
                        <textarea
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="댓글을 남겨보세요..."
                            rows={3}
                        />
                                                <div className="flex justify-end mt-2">
                                                    <Button>댓글 작성</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfileDetail;
