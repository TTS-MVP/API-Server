import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ArtistService } from 'src/artist/artist.service';
import { GlobalException } from 'src/common/dto/response.dto';
import { UserService } from 'src/user/user.service';

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

  async getMedia(userId: number) {
    const result = [];

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

    // 유튜브 API를 통해 해당 아티스트의 재생목록들 조회
    const [playlistNames, playlistIds] =
      await this.getArtistYoutubePlaylistInfos(artistYoutubeId);

    for (const playlistId of playlistIds) {
      const playlistItems = await this.getPlaylistItems(playlistId, 5);
      const seriesName = playlistNames[playlistIds.indexOf(playlistId)];

      // 시리즈 아이템 배열에 추가
      const seriesItem = {
        seriesName,
        items: playlistItems.map((item) => ({
          title: item.title,
          thumbnailUrl: item.thumbnailUrl,
          publishedAt: item.publishedAt,
        })),
      };

      result.push(seriesItem);
    }

    return result;
  }
}
