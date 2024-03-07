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
    channelId: string,
    maxResults: number = 50,
    order: 'date' | 'viewCount' = 'date',
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
      q: '',
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
        mediaItems.push(data);
      });
    } catch (error) {
      throw new GlobalException('유튜브 API 호출에 실패했습니다.', 500);
    }

    return mediaItems;
  }

  async getMedia(
    userId: number,
    order: 'date' | 'viewCount' = 'date',
    limit: number = 20,
  ): Promise<VideoItemDTO[]> {
    // 유저 최애 아티스트 조회
    const userProfile = await this.userService.getUserProfileByUserId(userId);
    const favoriteArtistId = userProfile?.favoriteArtistId;
    if (!favoriteArtistId) {
      throw new GlobalException('최애 아티스트가 등록되지 않았습니다.', 500);
    }

    // 아티스트 유튜브 id 조회
    const artistInfo = await this.artistService.getArtistById(favoriteArtistId);
    const artistYoutubeId = artistInfo?.youtubeChannelId;
    if (!artistYoutubeId) {
      return [];
    }

    // 유튜브 채널 ID로 업로드 영상 조회
    const result = await this.getArtistYoutubeMedias(
      artistYoutubeId,
      limit,
      order,
    );

    return result;
  }
}
