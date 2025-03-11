import { useState, useCallback } from 'react';
import { commentService } from '../services/commentService';
import { Comment, NewComment } from '../types/models';

export function useComments(profileId?: string) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchComments = useCallback(async (pId: string = profileId || '') => {
        if (!pId) return;

        setLoading(true);
        try {
            const { data, error } = await commentService.getCommentsByProfileId(pId);
            if (error) throw error;
            setComments(data || []);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [profileId]);

    const createComment = async (commentData: NewComment) => {
        setLoading(true);
        try {
            const { data, error } = await commentService.createComment(commentData);
            if (error) throw error;
            setComments(prev => data ? [...prev, data] : prev);
            return data;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateComment = async (id: string, content: string) => {
        setLoading(true);
        try {
            const { data, error } = await commentService.updateComment(id, content);
            if (error) throw error;
            setComments(prev =>
                prev.map(comment => comment.id === id ? { ...comment, content } : comment)
            );
            return data;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteComment = async (id: string, pId: string) => {
        setLoading(true);
        try {
            const { error } = await commentService.deleteComment(id, pId);
            if (error) throw error;
            setComments(prev => prev.filter(comment => comment.id !== id));
            return true;
        } catch (err) {
            setError(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        comments,
        loading,
        error,
        fetchComments,
        createComment,
        updateComment,
        deleteComment
    };
}
