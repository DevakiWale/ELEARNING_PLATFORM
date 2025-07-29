import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from '../enrollments/enrollment.entity';
import { CertificateService } from '../certificates/certificates.service';
import { Course } from '../courses/course.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepo: Repository<Enrollment>,
    private certificateService: CertificateService, // Inject CertificateService
  ) {}

  async saveProgress(
    userId: string,
    courseId: string,
    lessonId: string,
    percent: number,
  ) {
    let enrollment = await this.enrollmentRepo.findOne({
      where: { user: { id: userId }, course: { id: courseId } },
      relations: ['user', 'course'],
    });

    if (!enrollment) {
      enrollment = this.enrollmentRepo.create({
        user: { id: userId },
        course: { id: courseId },
        progress: 0,
      });
    }

    enrollment.progress = percent;
    await this.enrollmentRepo.save(enrollment);

    // ✅ Check and issue certificate if progress is 100%
    if (percent === 100) {
      await this.certificateService.issue(
        enrollment.user as User,
        enrollment.course as Course,
      );
    }
  }
}
