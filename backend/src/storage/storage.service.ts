import { DownloadResponse, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalException } from 'src/common/dto/response.dto';

export class StorageFile {
  buffer: Buffer;
  metadata: Map<string, string>;
  contentType: string;
}

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;
  private readonly bucketBaseUrl = 'https://storage.googleapis.com';

  constructor(private readonly configService: ConfigService) {
    try {
      this.storage = new Storage({
        projectId: this.configService.get('GCB_PROJECT_ID'),
        credentials: {
          client_email: this.configService.get('GCB_CLIENT_EMAIL'),
          private_key: this.configService
            .get('GCB_PRIVATE_KEY')
            .split(String.raw`\n`)
            .join('\n'),
        },
      });

      this.bucket = this.configService.get('GCB_STORAGE_MEDIA_BUCKET');
    } catch (error) {
      console.error('Google Cloud Storage 연결 실패:', error.message);
    }
  }

  async saveImage(path: string, imageFile: Express.Multer.File) {
    try {
      await this.storage.bucket(this.bucket).file(path).save(imageFile.buffer, {
        contentType: imageFile.mimetype,
      });
      return `${this.bucketBaseUrl}/${this.bucket}/${path}`;
    } catch (error) {
      throw new GlobalException(error.message, 500);
    }
  }

  async deleteImageByPath(path: string) {
    await this.storage
      .bucket(this.bucket)
      .file(path)
      .delete({ ignoreNotFound: true });
  }

  async deleteImageByUrl(url: string) {
    const path = url.split(`${this.bucketBaseUrl}/${this.bucket}/`)[1];
    if (!path) return;
    await this.storage
      .bucket(this.bucket)
      .file(path)
      .delete({ ignoreNotFound: true });
  }

  // async get(path: string): Promise<StorageFile> {
  // }
}
