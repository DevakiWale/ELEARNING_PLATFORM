import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from '../enrollments/enrollment.entity';
import { ProgressService } from './progress.service';
import { ProgressGateway } from './progress.gateway';
import { CertificateModule } from '../certificates/certificates.module';
import { Certificate } from 'src/certificates/certificate.entity';
import { User } from 'src/users/user.entity';
import { Course } from 'src/courses/course.entity';
import { CertificateService } from 'src/certificates/certificates.service';
import { UsersService } from 'src/users/users.service';
import { CoursesService } from 'src/courses/courses.service';
import { ProgressController } from './progress.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, Certificate, User, Course]), // ✅ provide EnrollmentRepository
    CertificateModule,
  ],
  providers: [
    ProgressService,
    ProgressGateway,
    CertificateService,
    UsersService,
    CoursesService,
  ],
  exports: [ProgressService],
  controllers: [ProgressController],
})
export class ProgressModule {}
