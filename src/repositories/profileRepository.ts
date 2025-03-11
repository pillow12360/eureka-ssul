import { supabase } from '@/config/supabase';
import { Profile, NewProfile, ProfileUpdate } from '@/types/models';

export interface IProfileRepository {
    create(profileData: NewProfile): Promise<{ data: Profile | null; error: any }>;
    getAll(): Promise<{ data: Profile[] | null; error: any }>;
    getById(id: string): Promise<{ data: Profile | null; error: any }>;
    update(id: string, updates: ProfileUpdate): Promise<{ data: Profile | null; error: any }>;
    delete(id: string): Promise<{ error: any }>;
    uploadImage(file: File): Promise<{ url: string | null; error: any }>;
}

export class SupabaseProfileRepository implements IProfileRepository {
    async create(profileData: NewProfile): Promise<{ data: Profile | null; error: any }> {
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
    }

    async getAll(): Promise<{ data: Profile[] | null; error: any }> {
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
    }

    async getById(id: string): Promise<{ data: Profile | null; error: any }> {
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
    }

    async update(id: string, updates: ProfileUpdate): Promise<{ data: Profile | null; error: any }> {
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
    }

    async delete(id: string): Promise<{ error: any }> {
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
    }

    async uploadImage(file: File): Promise<{ url: string | null; error: any }> {
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
}
