import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, Clock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Profile } from "@/types/profile";

interface Comment {
    id: number;
    author: string;
    content: string;
    createdAt: string;
    likes: number;
}

interface ProfileCardProps {
    profile: Profile;
    isExpanded: boolean;
    comments: Comment[];
    newComment: string;
    onToggle: () => void;
    onEditProfile: (profileId: number) => void;
    onCommentChange: (value: string) => void;
    onCommentSubmit: () => void;
    formatDate: (dateString: string) => string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
                                                     profile,
                                                     isExpanded,
                                                     comments,
                                                     newComment,
                                                     onToggle,
                                                     onEditProfile,
                                                     onCommentChange,
                                                     onCommentSubmit,
                                                     formatDate,
                                                 }) => {
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
                                <AvatarImage src={profile.avatar || undefined} alt={profile.name} />
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
                                <span>댓글 {profile.comments}개</span>
                            </div>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent>
                        <Separator className="mb-4" />

                        {/* 상세 정보 세션 */}
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
                                        onClick={() => onEditProfile(profile.id)}
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
                                        <span>최근 활동: 3일 전</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageSquare size={14} />
                                        <span>댓글 작성: {profile.comments}개</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ThumbsUp size={14} />
                                        <span>받은 좋아요: {comments?.reduce((sum, comment) => sum + comment.likes, 0) || 0}개</span>
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
                                {comments && comments.length > 0 ? (
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
                                    <p className="text-gray-500">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
                                )}
                            </div>

                            {/* 댓글 입력 폼 */}
                            <div className="flex flex-col gap-2">
                                <Textarea
                                    placeholder="댓글을 남겨보세요..."
                                    value={newComment || ''}
                                    onChange={(e) => onCommentChange(e.target.value)}
                                    className="min-h-24"
                                />
                                <div className="flex justify-end">
                                    <Button
                                        onClick={onCommentSubmit}
                                        disabled={!newComment || newComment.trim() === ''}
                                    >
                                        댓글 작성
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
