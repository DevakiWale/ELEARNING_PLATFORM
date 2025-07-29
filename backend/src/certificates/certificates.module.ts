// src/certificates/certificate.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './certificate.entity';
import { CertificateService } from './certificates.service';
import { CertificateController } from './certificates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate])],
  providers: [CertificateService],
  controllers: [CertificateController],
  exports: [CertificateService], // ✅ VERY IMPORTANT
})
export class CertificateModule {}
