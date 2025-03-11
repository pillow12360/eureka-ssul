import { IProfileLikeRepository, SupabaseProfileLikeRepository } from '../repositories/profileLikeRepository';
import { ProfileLike, NewProfileLike } from '../types/models';

export class ProfileLikeService {
    private repository: IProfileLikeRepository;

    constructor(repository: IProfileLikeRepository = new SupabaseProfileLikeRepository()) {
        this.repository = repository;
    }

    async likeProfile(profileId: string, userId: string): Promise<{ data: ProfileLike | null; error: any }> {
        const likeData: NewProfileLike = {
            profile_id: profileId,
            user_id: userId
        };
        return this.repository.create(likeData);
    }

    async unlikeProfile(profileId: string, userId: string): Promise<{ error: any }> {
        return this.repository.delete(profileId, userId);
    }

    async getProfileLikes(profileId: string): Promise<{ data: ProfileLike[] | null; error: any }> {
        return this.repository.getByProfileId(profileId);
    }

    async checkUserLiked(profileId: string, userId: string): Promise<{ liked: boolean; error: any }> {
        const { data, error } = await this.repository.getByProfileAndUser(profileId, userId);
        return { liked: !!data, error };
    }

    async getLikeCount(profileId: string): Promise<{ count: number; error: any }> {
        return this.repository.getLikeCount(profileId);
    }
}

// 서비스 인스턴스 생성 (싱글톤)
export const profileLikeService = new ProfileLikeService();
