import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Component, SortType } from '../../types/index.js';
import { CommentEntity, CommentService, MAX_COMMENTS_COUNT } from './index.js';
import { CreateCommentDto } from './dto/index.js';


@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate('authorId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    const limit = MAX_COMMENTS_COUNT;
    return this.commentModel
      .find({offerId}, {}, {limit})
      .sort({createdAt: SortType.Down})
      .populate('authorId')
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    return this.commentModel
      .deleteMany({offerId})
      .exec()
      .then((res) => res.deletedCount);
  }
}
