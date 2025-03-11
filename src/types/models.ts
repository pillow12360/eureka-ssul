export interface Profile {
    id: string;
    user_id?: string;
    name: string;
    features: string;
    bio: string;
    image_url: string | null;
    role?: string;
    comments: number;
    like_count: number;
    created_at: string;
    updated_at: string;
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

export interface ProfileLike {
    id: string;
    profile_id: string;
    user_id: string;
    created_at: string;
}

export type NewProfile = Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'comments' | 'like_count'>;
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
export type NewComment = Omit<Comment, 'id' | 'created_at' | 'updated_at'>;
export type NewProfileLike = Omit<ProfileLike, 'id' | 'created_at'>;
