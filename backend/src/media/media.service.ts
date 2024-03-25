import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ArtistService } from 'src/artist/artist.service';
import { GlobalException } from 'src/common/dto/response.dto';
import { UserService } from 'src/user/user.service';
import { VideoItemDTO } from './dto/media.dto';

@Injectable()
export class MediaService {
  constructor(
    private readonly artistService: ArtistService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  private async getArtistYoutubeMedias(
    channelId?: string,
    query: string = '',
    maxResults: number = 50,
    order: 'date' | 'viewCount' | 'relevance' = 'date',
  ) {
    const mediaItems = [];
    const mediaItemsUrl = `https://www.googleapis.com/youtube/v3/search`;

    const mediaItemsParams = {
      part: 'snippet',
      channelId,
      key: this.configService.get('YOUTUBE_API_KEY'),
      maxResults,
      order: order,
      type: 'video',
      q: query,
    };

    try {
      const mediaItemsRes = await axios.get(`${mediaItemsUrl}`, {
        params: mediaItemsParams,
      });
      const mediaItemsData = mediaItemsRes.data;
      mediaItemsData.items.forEach((item) => {
        // 쇼츠 영상은 제외
        //if (item.snippet.description == 'shorts.') return;
        const data = {
          title: item.snippet.title,
          thumbnailUrl: item.snippet.thumbnails.high.url,
          publishedAt: item.snippet.publishedAt,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          views: 0,
        };
        console.log(data);
        mediaItems.push(data);
      });
    } catch (error) {
      return [];
      //throw new GlobalException('유튜브 API 호출에 실패했습니다.', 500);
    }

    return mediaItems;
  }

  async getMedia(
    userId: number,
    order: 'date' | 'viewCount' = 'date',
    limit: number = 20,
  ): Promise<VideoItemDTO[]> {
    // 유저 최애 아티스트 조회
    let searchKeyword;
    const userProfile = await this.userService.getUserProfileByUserId(userId);
    const favoriteArtistId = userProfile?.favoriteArtistId;
    if (!favoriteArtistId) {
      throw new GlobalException('최애 아티스트가 등록되지 않았습니다.', 500);
    }

    // 아티스트 유튜브 id 조회
    const artistInfo = await this.artistService.getArtistById(favoriteArtistId);
    const artistYoutubeId = artistInfo?.youtubeChannelId;
    if (!artistYoutubeId) {
      // 유튜브 채널 ID가 없을 경우 아티스트 이름으로 영상 검색
      searchKeyword = artistInfo.name + ' 트로트 가수 유튜브';
      return await this.getArtistYoutubeMedias(
        artistYoutubeId,
        searchKeyword,
        limit,
        'relevance',
      );
    } else {
      return await this.getArtistYoutubeMedias(
        artistYoutubeId,
        searchKeyword,
        limit,
        order,
      );
    }
  }
}
