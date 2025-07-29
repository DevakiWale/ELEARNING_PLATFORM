import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from '../enrollments/enrollment.entity';
import { ProgressService } from './progress.service';
import { ProgressGateway } from './progress.gateway';
import { CertificateModule } from '../certificates/certificates.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment]), // ✅ provide EnrollmentRepository
    CertificateModule,
  ],
  providers: [ProgressService, ProgressGateway],
  exports: [ProgressService],
})
export class ProgressModule {}
