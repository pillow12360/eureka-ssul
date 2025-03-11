import { useState, useEffect, useCallback } from 'react';
import { profileService } from '../services/profileService';
import { Profile, NewProfile, ProfileUpdate } from '../types/models';
import useAuthStore from '@/stores/useAuthStore';

export function useProfiles() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [userProfile, setUserProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const { user } = useAuthStore();

    const fetchProfiles = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await profileService.getProfiles();
            if (error) throw error;
            setProfiles(data || []);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserProfile = useCallback(async () => {
        if (!user?.id) {
            setUserProfile(null);
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await profileService.getProfileByUserId(user.id);
            if (error) throw error;
            setUserProfile(data);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    const getProfileById = async (id: string) => {
        setLoading(true);
        try {
            const { data, error } = await profileService.getProfileById(id);
            if (error) throw error;
            return data;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const createProfile = async (newProfile: NewProfile) => {
        setLoading(true);
        setError(null);
        try {
            // profileService.createProfile는 { data, error } 형태로 반환한다고 가정
            const { data, error: supaError } = await profileService.createProfile(newProfile);
            if (supaError) {
                // 409 Conflict 에러인지 확인
                if (supaError.status === 409) {
                    throw new Error("이미 계정에 프로필이 존재합니다.");
                } else {
                    throw new Error("프로필 생성 중 오류가 발생했습니다.");
                }
            }
            setUserProfile(data);
            return { data, error: null };
        } catch (err: any) {
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (id: string, updates: ProfileUpdate) => {
        setLoading(true);
        try {
            const { data, error } = await profileService.updateProfile(id, updates);
            if (error) throw error;

            // 프로필 목록 업데이트
            setProfiles(prev =>
                prev.map(profile => profile.id === id ? { ...profile, ...data } : profile)
            );

            // 사용자 프로필 업데이트
            if (data && userProfile?.id === id) {
                setUserProfile({ ...userProfile, ...data });
            }

            return data;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteProfile = async (id: string) => {
        setLoading(true);
        try {
            const { error } = await profileService.deleteProfile(id);
            if (error) throw error;

            // 프로필 목록에서 제거
            setProfiles(prev => prev.filter(profile => profile.id !== id));

            // 사용자 프로필이 삭제된 경우 초기화
            if (userProfile?.id === id) {
                setUserProfile(null);
            }

            return true;
        } catch (err) {
            setError(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const uploadProfileImage = async (file: File) => {
        setLoading(true);
        try {
            const { url, error } = await profileService.uploadProfileImage(file);
            if (error) throw error;
            return url;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        profiles,
        userProfile,
        loading,
        error,
        fetchProfiles,
        fetchUserProfile,
        getProfileById,
        createProfile,
        updateProfile,
        deleteProfile,
        uploadProfileImage
    };
}
