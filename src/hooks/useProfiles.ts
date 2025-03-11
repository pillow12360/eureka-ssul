import { useState, useEffect, useCallback } from 'react';
import { profileService } from '../services/profileService';
import { Profile, NewProfile, ProfileUpdate } from '../types/models';

export function useProfiles() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

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

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

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

    const createProfile = async (profileData: NewProfile) => {
        setLoading(true);
        try {
            const { data, error } = await profileService.createProfile(profileData);
            if (error) throw error;
            setProfiles(prev => data ? [data, ...prev] : prev);
            return data;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (id: string, updates: ProfileUpdate) => {
        setLoading(true);
        try {
            const { data, error } = await profileService.updateProfile(id, updates);
            if (error) throw error;
            setProfiles(prev =>
                prev.map(profile => profile.id === id ? { ...profile, ...data } : profile)
            );
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
            setProfiles(prev => prev.filter(profile => profile.id !== id));
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
        loading,
        error,
        fetchProfiles,
        getProfileById,
        createProfile,
        updateProfile,
        deleteProfile,
        uploadProfileImage
    };
}
