import { Injectable } from '@nestjs/common';

@Injectable()
export class ArtistService {
  getArtist(): string {
    return 'This action returns all artist';
  }
}
