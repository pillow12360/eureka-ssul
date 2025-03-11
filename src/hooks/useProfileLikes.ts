import { useState, useCallback } from 'react';
import { profileLikeService } from '../services/profileLikeService';
import useAuthStore from '@/stores/useAuthStore';

export function useProfileLikes(profileId?: string) {
    const [likeCount, setLikeCount] = useState<number>(0);
    const [userLiked, setUserLiked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    const { user } = useAuthStore();

    const fetchLikeStatus = useCallback(async (pId: string = profileId || '') => {
        if (!pId) return;

        setLoading(true);
        try {
            // 좋아요 수 가져오기
            const { count, error: countError } = await profileLikeService.getLikeCount(pId);
            if (countError) throw countError;
            setLikeCount(count);

            // 현재 사용자가 좋아요 했는지 확인
            if (user?.id) {
                const { liked, error: likedError } = await profileLikeService.checkUserLiked(pId, user.id);
                if (likedError) throw likedError;
                setUserLiked(liked);
            }

            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [profileId, user?.id]);

    const toggleLike = async (pId: string = profileId || '') => {
        if (!pId || !user?.id) return;

        setLoading(true);
        try {
            if (userLiked) {
                // 좋아요 취소
                const { error } = await profileLikeService.unlikeProfile(pId, user.id);
                if (error) throw error;
                setLikeCount(prev => Math.max(0, prev - 1));
                setUserLiked(false);
            } else {
                // 좋아요 추가
                const { error } = await profileLikeService.likeProfile(pId, user.id);
                if (error) throw error;
                setLikeCount(prev => prev + 1);
                setUserLiked(true);
            }
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        likeCount,
        userLiked,
        loading,
        error,
        fetchLikeStatus,
        toggleLike
    };
}
