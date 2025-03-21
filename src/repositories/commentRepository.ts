import { supabase } from '@/config/supabase';
import { Comment, NewComment } from '@/types/models';

export interface ICommentRepository {
    getByProfileId(profileId: string): Promise<{ data: Comment[] | null; error: any }>;
    create(commentData: NewComment): Promise<{ data: Comment | null; error: any }>;
    update(id: string, content: string): Promise<{ data: Comment | null; error: any }>;
    delete(id: string, profileId: string): Promise<{ error: any }>;
}

export class SupabaseCommentRepository implements ICommentRepository {
    async getByProfileId(profileId: string): Promise<{ data: Comment[] | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('new_comments')
                .select('*')
                .eq('profile_id', profileId)
                .order('created_at', { ascending: true });

            return { data, error };
        } catch (error) {
            console.error('댓글 목록 조회 에러:', error);
            return { data: null, error };
        }
    }

    async create(commentData: NewComment): Promise<{ data: Comment | null; error: any }> {
        try {
            // 1. 새 댓글 추가
            const { data: newComment, error: commentError } = await supabase
                .from('new_comments')
                .insert([commentData])
                .select('*')
                .single();

            if (commentError) throw commentError;

            // 2. 프로필의 댓글 수 증가 (새로운 함수 사용)
            const { error: profileError } = await supabase.rpc('increment_counter', {
                row_id: commentData.profile_id,
                table_name: 'new_profiles',
                column_name: 'comments'
            });

            if (profileError) throw profileError;

            return { data: newComment, error: null };
        } catch (error) {
            console.error('댓글 작성 에러:', error);
            return { data: null, error };
        }
    }

    async update(id: string, content: string): Promise<{ data: Comment | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('new_comments')
                .update({ content })
                .eq('id', id)
                .select('*')
                .single();

            return { data, error };
        } catch (error) {
            console.error('댓글 수정 에러:', error);
            return { data: null, error };
        }
    }

    async delete(id: string, profileId: string): Promise<{ error: any }> {
        try {
            // 1. 댓글 삭제
            const { error: commentError } = await supabase
                .from('new_comments')
                .delete()
                .eq('id', id);

            if (commentError) throw commentError;

            // 2. 프로필의 댓글 수 감소 (새로운 함수 사용)
            const { error: profileError } = await supabase.rpc('decrement_counter', {
                row_id: profileId,
                table_name: 'new_profiles',
                column_name: 'comments'
            });

            if (profileError) throw profileError;

            return { error: null };
        } catch (error) {
            console.error('댓글 삭제 에러:', error);
            return { error };
        }
    }
}
