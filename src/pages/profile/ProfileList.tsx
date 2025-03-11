// src/pages/ProfileList.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAlertDialogStore } from "@/stores/useAlertDialogStore";
import { profileApi, Profile } from "@/api/supabaseApi";
import ProfileCard from "./ProfileCard";

const ProfileList = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedProfileId, setExpandedProfileId] = useState<string | null>(null);

    const openProfileForm = useAlertDialogStore(state => state.open);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const { data, error } = await profileApi.getProfiles();

            if (error) {
                toast({
                    title: "프로필 불러오기 실패",
                    description: error.message,
                    variant: "destructive",
                });
                return;
            }

            if (data) {
                setProfiles(data);
            }
        } catch (err) {
            console.error("프로필 로딩 중 오류 발생:", err);
            toast({
                title: "프로필 불러오기 실패",
                description: "프로필을 불러오는 중 오류가 발생했습니다.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // 초기 로딩
    useEffect(() => {
        fetchProfiles();
    }, []);

    const handleProfileToggle = (profileId: string) => {
        setExpandedProfileId(expandedProfileId === profileId ? null : profileId);
    };

    const handleCreateProfileClick = (): void => {
        openProfileForm({
            title: '프로필 꾸미러 가기',
            description: '사람들에게 자신만의 소개글을 공유해주세요!',
            onConfirm: () => {
                navigate('/profile/create');
            },
            confirmText: '확인'
        });
    };

    const handleEditProfile = (profileId: string) => {
        navigate(`/profile/edit/${profileId}`);
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

    // 프로필 목록 새로고침
    const handleRefreshProfiles = () => {
        fetchProfiles();
    };

    if (loading) {
        return (
            <div className="container mx-auto py-6 px-4 text-center">
                <p>프로필을 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 px-4 max-w-[935px] w-full">
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
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">프로필 목록</h2>
                    <Button
                        onClick={handleRefreshProfiles}
                        variant="outline"
                        size="sm"
                    >
                        새로고침
                    </Button>
                </div>

                {profiles.length > 0 ? (
                    <div className="space-y-6">
                        {profiles.map((profile) => (
                            <div key={profile.id} className="mb-6">
                                <ProfileCard
                                    profile={profile}
                                    isExpanded={expandedProfileId === profile.id}
                                    onToggle={() => handleProfileToggle(profile.id)}
                                    onEditProfile={() => handleEditProfile(profile.id)}
                                    formatDate={formatDate}
                                    onCommentAdded={handleRefreshProfiles}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 mb-4">아직 등록된 프로필이 없습니다.</p>
                        <Button onClick={handleCreateProfileClick} variant="default">
                            첫 프로필 만들기
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ProfileList;
