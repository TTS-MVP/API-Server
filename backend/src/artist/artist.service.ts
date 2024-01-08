import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistEntity } from './entity/artist.entity';
import { Repository } from 'typeorm';
import { ArtistDto } from './dto/artist.dto';
import { GlobalException } from 'src/common/dto/response.dto';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistEntity)
    private artistRepository: Repository<ArtistEntity>,
  ) {}
  async getAllArtists(): Promise<ArtistDto[]> {
    try {
      const artists = await this.artistRepository.find({
        order: { likesCount: 'DESC', name: 'ASC' },
      });

      return artists.map(({ id, name, thumbnailUrl }) => ({
        id,
        name,
        thumbnailUrl,
      }));
    } catch (error) {
      throw new GlobalException('데이터베이스 오류', 500);
    }
  }
}
