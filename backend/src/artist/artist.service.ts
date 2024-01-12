import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistEntity } from './entity/artist.entity';
import { Repository } from 'typeorm';
import { ArtistDto } from './dto/artist.dto';
import { GlobalException } from 'src/common/dto/response.dto';
import { ArtistFanCountView } from './entity/artist-fan-count.view';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistEntity)
    private artistRepository: Repository<ArtistEntity>,
    @InjectRepository(ArtistFanCountView)
    private artistFanCountRepository: Repository<ArtistFanCountView>,
  ) {}
  async getAllArtists(): Promise<ArtistDto[]> {
    try {
      const artists = await this.artistFanCountRepository.find();

      return artists.map(({ id, name, thumbnailUrl }) => ({
        id,
        name,
        thumbnailUrl,
      }));
    } catch (error) {
      console.log(error);
      throw new GlobalException('데이터베이스 오류', 500);
    }
  }

  async getArtistById(id: number): Promise<ArtistDto> {
    try {
      const artist = await this.artistRepository.findOne({ where: { id } });
      if (!artist) {
        throw new GlobalException('존재하지 않는 아티스트입니다.', 404);
      }

      return {
        id: artist.id,
        name: artist.name,
        thumbnailUrl: artist.thumbnailUrl,
      };
    } catch (error) {
      throw new GlobalException('데이터베이스 오류', 500);
    }
  }
}
