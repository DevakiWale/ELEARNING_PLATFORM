import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from '../enrollments/enrollment.entity';
import { CertificateService } from '../certificates/certificates.service';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';
import { User } from 'src/users/user.entity';
import { Course } from 'src/courses/course.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepo: Repository<Enrollment>,
    private certificateService: CertificateService,
    private usersService: UsersService,
    private coursesService: CoursesService,
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

    // ✅ Issue certificate after 100% completion with full entities
    if (percent === 100 && enrollment.user && enrollment.course) {
      await this.certificateService.issue(enrollment.user, enrollment.course);
    }
  }
}
