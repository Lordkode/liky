import { Like } from "../generated/prisma";
import { LikeRepository } from "../repository/like.repository";

export interface LikeDTO {
  imageId: string;
  userId: string;
}
export class LikeService {
  private likeRepository: LikeRepository;

  constructor() {
    this.likeRepository = new LikeRepository();
  }

  async createLike(likeDTO: LikeDTO): Promise<Like> {
    return await this.likeRepository.createLike({
      image: { connect: { id: likeDTO.imageId } },
      user: { connect: { id: likeDTO.userId } },
    });
  }

  async deleteLike(likeDTO: LikeDTO): Promise<Like> {
    return await this.likeRepository.deleteLike(
      likeDTO.userId,
      likeDTO.imageId
    );
  }
}
