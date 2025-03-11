import { supabase } from '@/config/supabase';
import { ProfileLike, NewProfileLike } from '@/types/models';

export interface IProfileLikeRepository {
    create(likeData: NewProfileLike): Promise<{ data: ProfileLike | null; error: any }>;
    delete(profileId: string, userId: string): Promise<{ error: any }>;
    getByProfileId(profileId: string): Promise<{ data: ProfileLike[] | null; error: any }>;
    getByProfileAndUser(profileId: string, userId: string): Promise<{ data: ProfileLike | null; error: any }>;
    getLikeCount(profileId: string): Promise<{ count: number; error: any }>;
}

export class SupabaseProfileLikeRepository implements IProfileLikeRepository {
    async create(likeData: NewProfileLike): Promise<{ data: ProfileLike | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('new_profile_likes')
                .insert([likeData])
                .select('*')
                .single();

            return { data, error };
        } catch (error) {
            console.error('좋아요 추가 에러:', error);
            return { data: null, error };
        }
    }

    async delete(profileId: string, userId: string): Promise<{ error: any }> {
        try {
            const { error } = await supabase
                .from('new_profile_likes')
                .delete()
                .match({ profile_id: profileId, user_id: userId });

            return { error };
        } catch (error) {
            console.error('좋아요 삭제 에러:', error);
            return { error };
        }
    }

    async getByProfileId(profileId: string): Promise<{ data: ProfileLike[] | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('new_profile_likes')
                .select('*')
                .eq('profile_id', profileId);

            return { data, error };
        } catch (error) {
            console.error('프로필 좋아요 목록 조회 에러:', error);
            return { data: null, error };
        }
    }

    async getByProfileAndUser(profileId: string, userId: string): Promise<{ data: ProfileLike | null; error: any }> {
        try {
            const { data, error } = await supabase
                .from('new_profile_likes')
                .select('*')
                .match({ profile_id: profileId, user_id: userId })
                .maybeSingle();

            return { data, error };
        } catch (error) {
            console.error('좋아요 상태 조회 에러:', error);
            return { data: null, error };
        }
    }

    async getLikeCount(profileId: string): Promise<{ count: number; error: any }> {
        try {
            const { count, error } = await supabase
                .from('new_profile_likes')
                .select('*', { count: 'exact', head: true })
                .eq('profile_id', profileId);

            return { count: count || 0, error };
        } catch (error) {
            console.error('좋아요 수 조회 에러:', error);
            return { count: 0, error };
        }
    }
}
