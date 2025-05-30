import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { CommentService } from './dto/comment-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from '../comment/dto/create-comment.dto.js';
import { DEFAULT_COMMENTS_COUNT, SortType } from '../../constants.js';
import mongoose from 'mongoose';


@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    return comment.populate('author');
  }

  public async calculateCommentsCountByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.aggregate([
      { '$match': { offerId: new mongoose.Types.ObjectId(offerId) } },
      {
        '$count': 'offerComments'
      }
    ]);
    return result[0].offerComments;
  }

  public async calculateAverageRateByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.aggregate([
      { '$match': { offerId: new mongoose.Types.ObjectId(offerId) } },
      {
        '$group': {
          _id: null,
          averageRating: { '$avg': '$rate' }
        }
      }, {
        '$project': {
          _id: 0,
          averageRating: '$averageRating'
        }
      }
    ]);
    return result[0].averageRating;
  }

  public async findByOfferId(offerId: string, limit = DEFAULT_COMMENTS_COUNT): Promise<DocumentType<CommentEntity>[] | null> {
    return this.commentModel.find({ offerId }).sort({ commentCount: SortType.Down })
      .limit(limit);
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }

}
