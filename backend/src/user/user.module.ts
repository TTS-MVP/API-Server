import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfoEntity } from './entity/user-info.entity';
import { UserProfileEntity } from './entity/user-profile.entity';
import { AuthModule } from 'src/auth/auth.module';
import { VoteModule } from 'src/vote/vote.module';
import { ArtistModule } from 'src/artist/artist.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserInfoEntity, UserProfileEntity]),
    AuthModule,
    ArtistModule,
    forwardRef(() => VoteModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
