import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedEntity } from './entity/feed.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ArtistModule } from 'src/artist/artist.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedEntity]),
    AuthModule,
    UserModule,
    ArtistModule,
  ],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
