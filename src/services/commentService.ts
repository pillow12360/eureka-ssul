import { ICommentRepository, SupabaseCommentRepository } from '../repositories/commentRepository';
import { Comment, NewComment } from '../types/models';

export class CommentService {
    private repository: ICommentRepository;

    constructor(repository: ICommentRepository = new SupabaseCommentRepository()) {
        this.repository = repository;
    }

    async getCommentsByProfileId(profileId: string): Promise<{ data: Comment[] | null; error: any }> {
        return this.repository.getByProfileId(profileId);
    }

    async createComment(commentData: NewComment): Promise<{ data: Comment | null; error: any }> {
        return this.repository.create(commentData);
    }

    async updateComment(id: string, content: string): Promise<{ data: Comment | null; error: any }> {
        return this.repository.update(id, content);
    }

    async deleteComment(id: string, profileId: string): Promise<{ error: any }> {
        return this.repository.delete(id, profileId);
    }
}

// 서비스 인스턴스 생성 (싱글톤)
export const commentService = new CommentService();
