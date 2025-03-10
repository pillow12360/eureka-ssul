// src/api/profileApi.ts
import { supabase, Profile, featuresArrayToString } from '../lib/supabase';

// 프로필 생성 함수
export const createProfile = async (
    name: string,
    features: string[],
    bio: string,
    imageFile?: File
): Promise<{ data: Profile | null; error: Error | null }> => {
    try {
        let image_url = null;

        // 이미지 파일이 있으면 스토리지에 업로드
        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `profiles/${fileName}`;

            // 이미지 업로드
            const { error: uploadError } = await supabase.storage
                .from('profile-images')
                .upload(filePath, imageFile);

            if (uploadError) {
                throw uploadError;
            }

            // 이미지 URL 가져오기
            const { data } = supabase.storage
                .from('profile-images')
                .getPublicUrl(filePath);

            image_url = data.publicUrl;
        }

        // 프로필 데이터 생성
        const { data, error } = await supabase
            .from('profiles')
            .insert({
                name,
                features: featuresArrayToString(features),
                bio,
                image_url,
            })
            .select()
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error('프로필 생성 오류:', error);
        return { data: null, error: error as Error };
    }
};

// 모든 프로필 조회 함수
export const getAllProfiles = async (): Promise<{ data: Profile[] | null; error: Error | null }> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error('프로필 조회 오류:', error);
        return { data: null, error: error as Error };
    }
};

// 특정 프로필 조회 함수
export const getProfileById = async (id: string): Promise<{ data: Profile | null; error: Error | null }> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        console.error('프로필 조회 오류:', error);
        return { data: null, error: error as Error };
    }
};
