export interface Profile {
    id: string;
    name: string;
    features: string;
    bio: string;
    image_url: string | null;
    created_at: string;
    updated_at: string;
    comments: number;
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

export type NewProfile = Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'comments'>;
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
export type NewComment = Omit<Comment, 'id' | 'created_at' | 'updated_at'>

// omit 으로 해당 필드명 없는 타입 생성
