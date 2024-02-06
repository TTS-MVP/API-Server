import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedEntity } from './entity/feed.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { GlobalException } from 'src/common/dto/response.dto';
import { ArtistService } from 'src/artist/artist.service';
import {
  DetailFeedDto,
  FeedDto,
  FeedsDto,
  summaryFeedDto,
} from './dto/get-feed.dto';
import { CommentEntity } from './entity/comment.entity';
import { CreateFeedDto } from './dto/create-feed.dto';
import { StorageService } from 'src/storage/storage.service';
import { plainToInstance } from 'class-transformer';
import { CommentDto } from './dto/comment.dto';
import { SummaryProfileDTO } from 'src/user/dto/profile.dto';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(FeedEntity)
    private readonly feedRepository: Repository<FeedEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly userService: UserService,
    private readonly artistService: ArtistService,
    private readonly storageService: StorageService,
  ) {}

  async getHotFeeds(): Promise<summaryFeedDto[]> {
    const feedQueryBuilder = await this.feedRepository
      .createQueryBuilder('feed')
      .where('feed.status = :status', { status: 1 })
      .andWhere('feed.thumbnailUrl IS NOT NULL')
      .orderBy('feed.likeCount', 'DESC')
      .limit(5);
    const feeds = await feedQueryBuilder.getMany();

    // summaryFeedDto로 변환
    const transformedFeeds = feeds.map((feed) =>
      plainToInstance(summaryFeedDto, feed),
    );

    return transformedFeeds;
  }

  private async processFeedData(feed) {
    let transformedFeed = plainToInstance(FeedDto, feed);
    transformedFeed = {
      ...transformedFeed,
      userProfile: plainToInstance(
        SummaryProfileDTO,
        transformedFeed.userProfile,
      ),
    };
    return transformedFeed;
  }

  private async processCommentData(comment: CommentEntity) {
    return plainToInstance(CommentDto, comment);
  }

  private async createFeedQueryBuilder(
    favoriteArtistId: number,
    status: number,
  ): Promise<SelectQueryBuilder<FeedEntity>> {
    return this.feedRepository
      .createQueryBuilder('feed')
      .innerJoinAndSelect('feed.userProfile', 'userProfile')
      .where('feed.status = :status', { status })
      .andWhere('feed.favoriteArtistId = :favoriteArtistId', {
        favoriteArtistId,
      })
      .orderBy('feed.createdAt', 'DESC');
  }

  private async getFeeds(favoriteArtistId: number) {
    const feedQueryBuilder = await this.createFeedQueryBuilder(
      favoriteArtistId,
      1, // status: 1
    );
    return feedQueryBuilder.getMany();
  }

  async getFeed(userId: number) {
    const userInfo = await this.userService.getUserProfileByUserId(userId);
    const favoriteArtistId = userInfo?.favoriteArtistId;
    if (!favoriteArtistId)
      throw new GlobalException('존재하지 않는 아티스트입니다.', 404);

    const artistProfile = await this.artistService.getArtistById(
      favoriteArtistId,
    );

    const feeds = await this.getFeeds(favoriteArtistId);

    // 데이터 전처리
    feeds.forEach(this.processFeedData);

    return {
      artistProfile,
      feeds,
    };
  }

  async getFeedById(feedId: number): Promise<DetailFeedDto> {
    let feed;
    try {
      // 피드를 가져온다.
      feed = await this.feedRepository
        .createQueryBuilder('feed')
        .innerJoinAndSelect('feed.userProfile', 'userProfile')
        .where('feed.id = :feedId', { feedId })
        .andWhere('feed.status = :status', { status: 1 })
        .getOne();
    } catch (err) {
      console.log(feedId);
      throw new GlobalException(err, 500);
    }

    if (!feed) throw new GlobalException('존재하지 않는 피드입니다.', 404);

    // 데이터 전처리
    feed = await this.processFeedData(feed);

    // 피드의 댓글을 가져온다.
    let comments;
    comments = await this.getFeedCommentByFeedId(feedId);

    // 데이터 전처리
    comments = await comments.forEach(this.processCommentData);
    if (!comments) comments = [];

    console.log(comments);
    return {
      ...feed,
      comments,
    };
  }

  private async getFeedCommentByFeedId(feedId: number) {
    // 피드의 댓글을 가져온다.
    return await this.commentRepository
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.userProfile', 'userProfile')
      .where('comment.feedId = :feedId', { feedId })
      .andWhere('comment.status = :status', { status: 1 })
      .getMany();
  }

  async createFeed(
    userId: number,
    createFeedDto: CreateFeedDto,
    imageFile: Express.Multer.File,
  ) {
    const { content } = createFeedDto;

    // 유저 정보를 가져온다.
    const userInfo = await this.userService.getUserProfileByUserId(userId);
    const favoriteArtistId = userInfo?.favoriteArtistId;
    if (!favoriteArtistId)
      throw new GlobalException('존재하지 않는 아티스트입니다.', 404);

    // TODO: 사진 multipart/form-data로 받아서 multer로 처리하기
    let imageUrl;
    if (imageFile) {
      // 이미지를 저장한다.
      const path = `feed/${Date.now()}_${imageFile.originalname}`;
      imageUrl = await this.storageService.saveImage(path, imageFile);
    }

    try {
      // 피드를 생성한다.
      var feed = await this.feedRepository.save({
        content,
        thumbnailUrl: imageUrl,
        favoriteArtistId,
        userId,
      });
    } catch (error) {
      throw new GlobalException('피드 생성에 실패했습니다.', 400);
    }
  }

  async updateFeed(
    feedId: number,
    userId: number,
    createFeedDto: CreateFeedDto,
    imageFile: Express.Multer.File,
  ) {
    const { content } = createFeedDto;

    try {
      // 피드가 존재하는지 확인하고, 삭제되지 않았는지 확인한다.
      const feed = await this.getFeedById(feedId);
      if (feed?.userProfile?.id !== userId)
        throw new GlobalException('피드 수정 권한이 없습니다.', 403);
      // 사진을 수정했는지 확인한다.
      let imageUrl;
      if (imageFile) {
        const path = `feed/${Date.now()}_${imageFile.originalname}`;
        // 기존 사진을 삭제한다.
        await this.storageService.deleteImageByUrl(feed.thumbnailUrl);
        // 이미지를 저장한다.
        imageUrl = await this.storageService.saveImage(path, imageFile);
      }
      await this.feedRepository.update(feedId, {
        content,
        thumbnailUrl: imageUrl || feed.thumbnailUrl,
      });
    } catch (error) {
      if (error instanceof GlobalException) throw error;
      throw new GlobalException('피드 수정에 실패했습니다.', 400);
    }
  }

  async deleteFeed(feedId: number, userId: number) {
    try {
      // 피드가 존재하는지 확인하고, 삭제되지 않았는지 확인한다.
      const feed = await this.getFeedById(feedId);
      if (feed?.userProfile?.id !== userId)
        throw new GlobalException('피드 수정 권한이 없습니다.', 403);
      await this.feedRepository.update(feedId, { status: 2 });
    } catch (error) {
      if (error instanceof GlobalException) throw error;
      throw new GlobalException('피드 삭제에 실패했습니다.', 400);
    }
  }

  // 댓글
  async createComment(feedId: number, userId: number, content: string) {
    try {
      // 피드가 존재하는지 확인하고, 삭제되지 않았는지 확인한다.
      await this.getFeedById(feedId);
      await this.commentRepository.save({
        feedId,
        userId,
        content,
      });
    } catch (error) {
      if (error instanceof GlobalException) throw error;
      throw new GlobalException('댓글 생성에 실패했습니다.', 400);
    }
  }

  private async getCommentById(commentId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, status: 1 },
    });
    if (!comment)
      throw new GlobalException('존재하지 않거나 삭제된 댓글입니다.', 404);
    return comment;
  }

  async updateComment(commentId: number, userId: number, content: string) {
    try {
      // 댓글이 존재하는지 확인하고, 삭제되지 않았는지 확인한다.
      const comment = await this.getCommentById(commentId);
      if (comment?.userId !== userId)
        throw new GlobalException('댓글 수정 권한이 없습니다.', 403);
      await this.commentRepository.update(commentId, {
        content,
      });
    } catch (error) {
      if (error instanceof GlobalException) throw error;
      throw new GlobalException('댓글 수정에 실패했습니다.', 400);
    }
  }

  async deleteComment(commentId: number, userId: number) {
    try {
      // 댓글이 존재하는지 확인하고, 삭제되지 않았는지 확인한다.
      const comment = await this.getCommentById(commentId);
      if (comment?.userId !== userId)
        throw new GlobalException('댓글 삭제 권한이 없습니다.', 403);
      await this.commentRepository.update(commentId, { status: 2 });
    } catch (error) {
      if (error instanceof GlobalException) throw error;
      throw new GlobalException('댓글 삭제에 실패했습니다.', 400);
    }
  }

  async createLike(feedId: number, userId: number) {
    try {
      // 피드가 존재하는지 확인하고, 삭제되지 않았는지 확인한다.
      const feed = await this.getFeedById(feedId);
      // 글 작성자가 누르는 경우
      if (feed?.userProfile?.id === userId)
        throw new GlobalException(
          '자신의 글에는 좋아요를 누를 수 없습니다.',
          403,
        );
      await this.feedRepository.update(feedId, {
        likeCount: feed.likeCount + 1,
      });
      return feed.likeCount + 1;
    } catch (error) {
      if (error instanceof GlobalException) throw error;
      throw new GlobalException('좋아요 처리에 실패했습니다.', 400);
    }
  }

  async deleteLike(feedId: number, userId: number) {
    try {
      // 피드가 존재하는지 확인하고, 삭제되지 않았는지 확인한다.
      const feed = await this.getFeedById(feedId);
      // 글 작성자가 누르는 경우
      if (feed?.userProfile?.id === userId)
        throw new GlobalException(
          '자신의 글에는 좋아요를 누를 수 없습니다.',
          403,
        );
      await this.feedRepository.update(feedId, {
        likeCount: feed.likeCount - 1,
      });
      return feed.likeCount - 1;
    } catch (error) {
      if (error instanceof GlobalException) throw error;
      throw new GlobalException('좋아요 처리에 실패했습니다.', 400);
    }
  }
}
