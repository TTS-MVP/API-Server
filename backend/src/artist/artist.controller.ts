import { Controller, Get } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('artist')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  getArtist(): string {
    return this.artistService.getArtist();
  }
}
