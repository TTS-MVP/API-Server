import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedEntity } from './entity/feed.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { GlobalException } from 'src/common/dto/response.dto';
import { ArtistService } from 'src/artist/artist.service';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(FeedEntity)
    private readonly feedRepository: Repository<FeedEntity>,
    private readonly userService: UserService,
    private readonly artistService: ArtistService,
  ) {}
  async getFeed(userId: number) {
    // 유저가 좋아하는 아티스트의 아이디를 가져온다.
    const userInfo = await this.userService.getUserProfileByUserId(userId);
    const favoriteArtistId = userInfo?.favoriteArtistId;
    if (!favoriteArtistId)
      throw new GlobalException('존재하지 않는 아티스트입니다.', 404);
    // 아티스트의 프로필 사진과 이름을 가져온다.
    const artistProfile = await this.artistService.getArtistById(
      favoriteArtistId,
    );
    const feeds = await this.feedRepository
      .createQueryBuilder('feed')
      .innerJoinAndSelect('feed.userProfile', 'userProfile') // 'userProfile'는 UserProfile 엔터티의 alias입니다.
      .where('feed.status = :status', { status: 1 })
      .andWhere('feed.favoriteArtistId = :favoriteArtistId', {
        favoriteArtistId,
      })
      .getMany();

    // 데이터 전처리
    feeds.forEach((feed) => {
      delete feed.userId;
      delete feed.favoriteArtistId;
      delete feed.status;
      feed.userProfile = {
        id: feed.userProfile.id,
        nickName: feed.userProfile.nickName,
        thumbnailUrl: feed.userProfile.thumbnailUrl,
      };
    });

    return {
      artistProfile,
      feeds,
    };
  }
}
