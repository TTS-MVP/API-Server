import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedEntity } from './entity/feed.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { GlobalException } from 'src/common/dto/response.dto';
import { ArtistService } from 'src/artist/artist.service';
import { DetailFeedDto, FeedsDto } from './dto/get-feed.dto';
import { CommentEntity } from './entity/comment.entity';
import { CreateFeedDto } from './dto/create-feed.dto';
import { StorageService } from 'src/storage/storage.service';

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

  private async processFeedData(feed: FeedEntity) {
    delete feed.userId;
    delete feed.favoriteArtistId;
    delete feed.status;
    feed.userProfile = {
      id: feed.userProfile.id,
      nickName: feed.userProfile.nickName,
      thumbnailUrl: feed.userProfile.thumbnailUrl,
    };
  }

  private async processCommentData(comment: CommentEntity) {
    delete comment.userId;
    delete comment.feedId;
    delete comment.status;
    comment.userProfile = {
      id: comment.userProfile.id,
      nickName: comment.userProfile.nickName,
      thumbnailUrl: comment.userProfile.thumbnailUrl,
    };
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

  async getFeed(userId: number): Promise<FeedsDto> {
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
    // 피드를 가져온다.
    const feed = await this.feedRepository
      .createQueryBuilder('feed')
      .innerJoinAndSelect('feed.userProfile', 'userProfile')
      .where('feed.id = :feedId', { feedId })
      .andWhere('feed.status = :status', { status: 1 })
      .getOne();

    // 데이터 전처리
    this.processFeedData(feed);

    // 피드의 댓글을 가져온다.
    const comments = await this.getFeedCommentByFeedId(feedId);

    // 데이터 전처리
    comments.forEach(this.processCommentData);

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
      throw new GlobalException('피드 생성에 실패했습니다.', 500);
    }
  }
}
