import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, Clock, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAlertDialogStore } from "@/stores/useAlertDialogStore";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { commentApi } from "@/api/supabaseApi";
import { Profile, Comment } from "@/types/models.ts";
import { Input } from "@/components/ui/input";

interface ProfileCardProps {
    profile: Profile;
    isExpanded: boolean;
    onToggle: () => void;
    onEditProfile: () => void;
    formatDate: (dateString: string) => string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
                                                     profile,
                                                     isExpanded,
                                                     onToggle,
                                                     onEditProfile,
                                                     formatDate,
                                                 }) => {
    const { toast } = useToast();
    const openDialog = useAlertDialogStore(state => state.open);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [authorName, setAuthorName] = useState(""); // 작성자 이름 상태 추가
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 댓글 불러오기
    useEffect(() => {
        const fetchComments = async () => {
            if (isExpanded && profile.id) {
                setIsLoading(true);
                try {
                    const { data, error } = await commentApi.getCommentsByProfileId(profile.id);

                    if (error) {
                        toast({
                            title: "댓글 불러오기 실패",
                            description: error.message,
                            variant: "destructive",
                        });
                        return;
                    }

                    if (data) {
                        setComments(data);
                    }
                } catch (err) {
                    console.error("댓글 로딩 중 오류 발생:", err);
                    toast({
                        title: "댓글 불러오기 실패",
                        description: "댓글을 불러오는 중 오류가 발생했습니다.",
                        variant: "destructive",
                    });
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchComments();
    }, [isExpanded, profile.id, toast]);

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !authorName.trim()) {
            toast({
                title: "입력 오류",
                description: "댓글 내용과 작성자 이름을 모두 입력해주세요.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const { data, error } = await commentApi.createComment({
                profile_id: profile.id,
                author_name: authorName,
                content: newComment,
                parent_id: null
            });

            if (error) {
                toast({
                    title: "댓글 작성 실패",
                    description: error.message,
                    variant: "destructive",
                });
                return;
            }

            if (data) {
                setComments(prev => [...prev, data]);
                setNewComment("");
                // 작성자 이름은 유지 (다음 댓글 작성 시 편의성)
                toast({
                    title: "댓글이 작성되었습니다",
                    variant: "default",
                    className: "bg-green-500 text-white font-bold shadow-lg",
                    duration: 2000,
                });
            }
        } catch (err) {
            console.error("댓글 작성 중 오류 발생:", err);
            toast({
                title: "댓글 작성 실패",
                description: "댓글을 저장하는 중 오류가 발생했습니다.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = (commentId: string) => {
        openDialog({
            title: "댓글 삭제",
            description: "이 댓글을 정말 삭제하시겠습니까?",
            onConfirm: async () => {
                try {
                    const { error } = await commentApi.deleteComment(commentId, profile.id);

                    if (error) {
                        toast({
                            title: "댓글 삭제 실패",
                            description: error.message,
                            variant: "destructive",
                            className: "bg-green-500 text-white font-bold shadow-lg",
                            duration: 2000, // 2초 후 자동으로 사라짐
                        });
                        return;
                    }

                    setComments(prev => prev.filter(comment => comment.id !== commentId));
                    toast({
                        title: "댓글이 삭제되었습니다",
                        variant: "default",
                        className: "bg-green-500 text-white font-bold shadow-lg",
                        duration: 2000, // 2초 후 자동으로 사라짐
                    });
                } catch (err) {
                    console.error("댓글 삭제 중 오류 발생:", err);
                    toast({
                        title: "댓글 삭제 실패",
                        description: "댓글을 삭제하는 중 오류가 발생했습니다.",
                        variant: "destructive",
                        className: "bg-green-500 text-white font-bold shadow-lg",
                        duration: 2000, // 2초 후 자동으로 사라짐
                    });
                }
            },
            confirmText: "삭제",
            cancelText: "취소"
        });
    };

    // comments 값이 undefined 또는 null일 경우 0으로 표시
    const commentsCount = profile.comments !== undefined && profile.comments !== null
        ? profile.comments
        : 0;

    return (
        <Card className={`overflow-hidden transition-shadow ${isExpanded ? 'shadow-md' : 'hover:shadow-sm'}`}>
            <Accordion
                type="single"
                collapsible
                value={isExpanded ? `profile-${profile.id}` : undefined}
                onValueChange={(value) => {
                    if (value === `profile-${profile.id}` && !isExpanded) {
                        onToggle();
                    } else if (value === undefined && isExpanded) {
                        onToggle();
                    }
                }}
                className="w-full"
            >
                <AccordionItem value={`profile-${profile.id}`} className="border-0">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex w-full items-start gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={profile.image_url || undefined} alt={profile.name} />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    {profile.name.substring(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="font-medium text-lg">{profile.name}</h3>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {profile.features.split(', ').map((feature, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center text-gray-500 text-sm">
                                <MessageSquare size={14} className="mr-1" />
                                <span>댓글 {commentsCount}개</span>
                            </div>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent>
                        <Separator className="mb-4" />

                        {/* 상세 정보 섹션 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                            {/* 자기소개 섹션 */}
                            <div className="md:col-span-2">
                                <h4 className="font-medium text-lg mb-2">자기소개</h4>
                                <p className="text-gray-700 whitespace-pre-line mb-6">{profile.bio}</p>

                                {/* 버튼 섹션 */}
                                <div className="flex gap-2 mb-6">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onEditProfile}
                                    >
                                        <Edit size={14} className="mr-1" /> 프로필 수정
                                    </Button>
                                </div>
                            </div>

                            {/* 활동 정보 섹션 */}
                            <div>
                                <h4 className="font-medium text-lg mb-2">활동 정보</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        <span>작성일: {formatDate(profile.created_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageSquare size={14} />
                                        <span>댓글 수: {commentsCount}개</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ThumbsUp size={14} />
                                        <span>최근 활동: {formatDate(profile.updated_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 댓글 섹션 */}
                        <div className="p-4 pt-0">
                            <Separator className="mb-4" />
                            <h4 className="font-medium text-lg mb-4">댓글</h4>

                            {/* 댓글 목록 */}
                            <div className="space-y-4 mb-6">
                                {isLoading ? (
                                    <p className="text-center py-4">댓글을 불러오는 중...</p>
                                ) : comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="border-b pb-4 last:border-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center">
                                                    <span className="font-medium">{comment.author_name}</span>
                                                    <span className="text-gray-500 text-sm ml-2">
                            {formatDate(comment.created_at)}
                          </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="sm" className="h-6 px-2">
                                                        <ThumbsUp size={14} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 px-2 text-red-500"
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="text-gray-700">{comment.content}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
                                )}
                            </div>

                            {/* 댓글 입력 폼 */}
                            <div className="flex flex-col gap-2">
                                {/* 작성자 이름 입력 필드 추가 */}
                                <div className="mb-2">
                                    <label htmlFor="author-name" className="block text-sm font-medium text-gray-700 mb-1">
                                        작성자 이름
                                    </label>
                                    <Input
                                        id="author-name"
                                        placeholder="작성자 이름을 입력하세요"
                                        value={authorName}
                                        onChange={(e) => setAuthorName(e.target.value)}
                                        className="w-full"
                                    />
                                </div>

                                <Textarea
                                    placeholder="댓글을 남겨보세요..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="min-h-24"
                                />
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleCommentSubmit}
                                        disabled={!newComment.trim() || !authorName.trim() || isSubmitting}
                                    >
                                        {isSubmitting ? "작성 중..." : "댓글 작성"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {!isExpanded && (
                <div className="p-4 pt-0 flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggle}
                    >
                        자세히 보기
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default ProfileCard;
