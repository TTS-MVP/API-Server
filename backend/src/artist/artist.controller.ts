import { Controller, Get, UseGuards } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiGetAllArtists } from './decorator/swagger.decorator';
import { ResponseDto } from 'src/common/dto/response.dto';
import { ArtistDto } from './dto/artist.dto';
import { AuthGuard } from 'src/auth/auth-guard.service';

@ApiTags('아티스트')
@UseGuards(AuthGuard)
@ApiBearerAuth('accessToken')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}
  /* 
  컨트롤러에서는 다음과 같은 주요 작업을 수행하는 것이 좋습니다:

  1. 요청의 검증 및 가공: HTTP 요청에서 필요한 정보를 추출하고 필요한 경우 가공합니다.
  2. 비즈니스 로직 호출: 서비스나 다른 관련된 계층으로부터 비즈니스 로직을 호출합니다.
  3. HTTP 응답 구성: 비즈니스 로직의 결과를 기반으로 HTTP 응답을 생성합니다.
  */
  @ApiGetAllArtists()
  @Get()
  async getAllArtists(): Promise<ResponseDto<ArtistDto[]>> {
    const artists = await this.artistService.getAllArtists();
    return new ResponseDto(true, 200, '아티스트 목록 조회 성공', artists);
  }
}
