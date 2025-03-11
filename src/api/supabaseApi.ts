import { createClient } from '@supabase/supabase-js';// Supabase 클라이언트 설정
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface Profile {
    id: string;
    name: string;
    features: string;
    bio: string;
    image_url: string | null;
    created_at: string;
    updated_at: string;
    comments: number;
}

export interface Comment {
    id: string;
    profile_id: string;
    author_name: string;
    content: string;
    parent_id: string | null;
    created_at: string;
    updated_at: string;
}

// 프로필 관련 API 함수
export const profileApi = {
    // 프로필 생성
    async createProfile(profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'comments'>): Promise<{ data: Profile | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .insert([profileData])
                .select('*')
                .single();

            return { data, error };
        } catch (error) {
            console.error('프로필 생성 에러:', error);
            return { data: null, error };
        }
    },

    // 프로필 목록 조회
    async getProfiles(): Promise<{ data: Profile[] | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            return { data, error };
        } catch (error) {
            console.error('프로필 목록 조회 에러:', error);
            return { data: null, error };
        }
    },

    // 특정 프로필 조회
    async getProfileById(id: string): Promise<{ data: Profile | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            return { data, error };
        } catch (error) {
            console.error('프로필 조회 에러:', error);
            return { data: null, error };
        }
    },

    // 프로필 수정
    async updateProfile(id: string, updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>): Promise<{ data: Profile | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', id)
                .select('*')
                .single();

            return { data, error };
        } catch (error) {
            console.error('프로필 수정 에러:', error);
            return { data: null, error };
        }
    },

    // 프로필 삭제
    async deleteProfile(id: string): Promise<{ error: any }> {
        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', id);

            return { error };
        } catch (error) {
            console.error('프로필 삭제 에러:', error);
            return { error };
        }
    },

    // 프로필 이미지 업로드
    async uploadProfileImage(file: File): Promise<{ url: string | null; error: any }> {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `profile-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('profiles')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('profiles')
                .getPublicUrl(filePath);

            return { url: data.publicUrl, error: null };
        } catch (error) {
            console.error('이미지 업로드 에러:', error);
            return { url: null, error };
        }
    }
};

// 댓글 관련 API 함수
export const commentApi = {
    // 프로필의 댓글 목록 조회
    async getCommentsByProfileId(profileId: string): Promise<{ data: Comment[] | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('profile_id', profileId)
                .order('created_at', { ascending: true });

            return { data, error };
        } catch (error) {
            console.error('댓글 목록 조회 에러:', error);
            return { data: null, error };
        }
    },
    async createComment(commentData: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Comment | null; error: any }> {
        try {
            // 1. 새 댓글 추가
            const { data: newComment, error: commentError } = await supabase
                .from('comments')
                .insert([commentData])
                .select('*')
                .single();

            if (commentError) throw commentError;

            // 2. 프로필의 댓글 수 증가 (수동으로 증가)
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    comments: supabase.rpc('increment_counter', { row_id: commentData.profile_id }),
                    updated_at: new Date().toISOString()
                })
                .eq('id', commentData.profile_id);

            if (profileError) throw profileError;

            return { data: newComment, error: null };
        } catch (error) {
            console.error('댓글 작성 에러:', error);
            return { data: null, error };
        }
    },

    // 댓글 수정
    async updateComment(id: string, content: string): Promise<{ data: Comment | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('comments')
                .update({ content })
                .eq('id', id)
                .select('*')
                .single();

            return { data, error };
        } catch (error) {
            console.error('댓글 수정 에러:', error);
            return { data: null, error };
        }
    },

    async deleteComment(id: string, profileId: string): Promise<{ error: any }> {
        try {
            // 1. 댓글 삭제
            const { error: commentError } = await supabase
                .from('comments')
                .delete()
                .eq('id', id);

            if (commentError) throw commentError;

            // 2. 프로필의 댓글 수 감소
            const { error: profileError } = await supabase.rpc('decrement_comment_count', {
                profile_id: profileId
            });

            if (profileError) throw profileError;

            return { error: null };
        } catch (error) {
            console.error('댓글 삭제 에러:', error);
            return { error };
        }
    }
};
