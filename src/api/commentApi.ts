// src/api/commentApi.ts
import { supabase, Comment } from '../lib/supabase';

// 댓글 생성 함수
export const createComment = async (
    profileId: string,
    authorName: string,
    content: string,
    parentId?: string
): Promise<{ data: Comment | null; error: Error | null }> => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .insert({
                profile_id: profileId,
                author_name: authorName,
                content,
                parent_id: parentId || null,
            })
            .select()
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error('댓글 생성 오류:', error);
        return { data: null, error: error as Error };
    }
};

// 프로필에 대한 댓글 가져오기 (중첩 구조로)
export const getCommentsByProfileId = async (profileId: string): Promise<{ data: Comment[] | null; error: Error | null }> => {
    try {
        // 모든 댓글 가져오기
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('profile_id', profileId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        if (!data) return { data: null, error: null };

        // 계층적 구조로 정리 (최상위 댓글과 대댓글)
        const commentMap: Record<string, Comment> = {};
        const rootComments: Comment[] = [];

        // 모든 댓글에 대한 맵 생성
        data.forEach(comment => {
            comment.replies = [];
            commentMap[comment.id] = comment;
        });

        // 댓글을 계층적 구조로 정리
        data.forEach(comment => {
            if (comment.parent_id === null) {
                // 최상위 댓글
                rootComments.push(comment);
            } else {
                // 대댓글
                const parentComment = commentMap[comment.parent_id];
                if (parentComment) {
                    parentComment.replies = parentComment.replies || [];
                    parentComment.replies.push(comment);
                }
            }
        });

        return { data: rootComments, error: null };
    } catch (error) {
        console.error('댓글 조회 오류:', error);
        return { data: null, error: error as Error };
    }
};
