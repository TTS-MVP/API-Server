import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { ArtistModule } from 'src/artist/artist.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ArtistModule, UserModule, AuthModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
