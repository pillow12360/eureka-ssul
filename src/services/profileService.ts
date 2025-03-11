import { IProfileRepository, SupabaseProfileRepository } from '../repositories/profileRepository';
import { Profile, NewProfile, ProfileUpdate } from '../types/models';

export class ProfileService {
    private repository: IProfileRepository;

    constructor(repository: IProfileRepository = new SupabaseProfileRepository()) {
        this.repository = repository;
    }

    async createProfile(profileData: NewProfile): Promise<{ data: Profile | null; error: any }> {
        return this.repository.create(profileData);
    }

    async getProfiles(): Promise<{ data: Profile[] | null; error: any }> {
        return this.repository.getAll();
    }

    async getProfileById(id: string): Promise<{ data: Profile | null; error: any }> {
        return this.repository.getById(id);
    }

    async updateProfile(id: string, updates: ProfileUpdate): Promise<{ data: Profile | null; error: any }> {
        return this.repository.update(id, updates);
    }

    async deleteProfile(id: string): Promise<{ error: any }> {
        return this.repository.delete(id);
    }

    async uploadProfileImage(file: File): Promise<{ url: string | null; error: any }> {
        return this.repository.uploadImage(file);
    }
}

// 서비스 인스턴스 생성 (싱글톤)
export const profileService = new ProfileService();
