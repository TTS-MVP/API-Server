import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistEntity } from './entity/artist.entity';
import { Repository } from 'typeorm';
import { ApiOperation } from '@nestjs/swagger';
import { ArtistDto } from './dto/artist.dto';

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

      // Artist 엔터티에서 DTO로 변환
      const artistDtos = artists.map(
        (artist) =>
          new ArtistDto(
            artist.id,
            artist.name,
            artist.likesCount,
            artist.thumbnailUrl,
          ),
      );

      return artistDtos;
    } catch (error) {
      // 에러 처리
      console.error('Error while fetching artists:', error);
      throw new Error('Failed to fetch artists');
    }
  }
}
