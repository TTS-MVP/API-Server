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
  // 아티스트의 유튜브 재생목록 id들 조회
  private async getArtistYoutubePlaylistInfos(
    channelId: string,
    maxResults: number = 50,
  ) {
    const playlistNames = [];
    const playlistIds = [];

    const playlistsUrl = `https://www.googleapis.com/youtube/v3/playlists`;

    const playlistsParams = {
      part: 'snippet',
      channelId,
      key: this.configService.get('YOUTUBE_API_KEY'),
      maxResults,
    };

    try {
      const playlistsRes = await axios.get(`${playlistsUrl}`, {
        params: playlistsParams,
      });
      const playlistsData = playlistsRes.data;

      for (const item of playlistsData.items) {
        playlistNames.push(item.snippet.title);
        playlistIds.push(item.id);
      }
    } catch (error) {
      throw new GlobalException('유튜브 API 호출에 실패했습니다.', 500);
    }

    return [playlistNames, playlistIds];
  }

  private async getPlaylistItems(playlistId: string, maxResults: number = 50) {
    const playlistItems = [];
    const playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems`;

    const playlistItemsParams = {
      part: 'snippet',
      playlistId,
      key: this.configService.get('YOUTUBE_API_KEY'),
      maxResults,
    };

    try {
      const playlistItemsRes = await axios.get(`${playlistItemsUrl}`, {
        params: playlistItemsParams,
      });
      const playlistItemsData = playlistItemsRes.data;
      playlistItemsData.items.forEach((item) => {
        const data = {
          title: item.snippet.title,
          thumbnailUrl: item.snippet.thumbnails.standard.url,
          publishedAt: item.snippet.publishedAt,
        };
        playlistItems.push(data);
      });
    } catch (error) {
      throw new GlobalException('유튜브 API 호출에 실패했습니다.', 500);
    }

    return playlistItems;
  }

  private async getArtistYoutubeMedias(
    channelId: string,
    maxResults: number = 50,
  ) {
    const mediaItems = [];
    const mediaItemsUrl = `https://www.googleapis.com/youtube/v3/search`;

    const mediaItemsParams = {
      part: 'snippet',
      channelId,
      key: this.configService.get('YOUTUBE_API_KEY'),
      maxResults,
      order: 'date',
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

  async getMedia(userId: number): Promise<VideoItemDTO[]> {
    // 유저 최애 아티스트 조회
    const userProfile = await this.userService.getUserProfileByUserId(userId);
    const favoriteArtistId = userProfile?.favoriteArtistId;
    if (!favoriteArtistId) {
      throw new Error('최애 아티스트가 존재하지 않습니다.');
    }

    // 아티스트 유튜브 id 조회
    const artistInfo = await this.artistService.getArtistById(favoriteArtistId);
    const artistYoutubeId = artistInfo?.youtubeChannelId;
    if (!artistYoutubeId) {
      return [];
    }

    // 유튜브 채널 ID로 업로드 영상 조회
    const result = await this.getArtistYoutubeMedias(artistYoutubeId, 20);

    return result;
  }
}
