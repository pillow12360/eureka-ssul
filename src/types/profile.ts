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
    likes?: number;
}

export type ProfileLike = {
    id: string;
    profile_id: string;
    user_id: string;
    created_at: string;
};

export type CommentLike = {
    id: string;
    comment_id: string;
    user_id: string;
    created_at: string;
};
