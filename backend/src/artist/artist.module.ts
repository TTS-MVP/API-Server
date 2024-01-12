import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from './entity/artist.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ArtistFanCountView } from './entity/artist-fan-count.view';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArtistEntity, ArtistFanCountView]),
    AuthModule,
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
