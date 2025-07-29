import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findByUser(userId: string) {
    return this.enrollmentRepo.find({
      where: { user: { id: userId } },
      relations: ['course', 'course.lessons'],
    });
  }

  async isEnrolled(userId: string, courseId: string) {
    return this.enrollmentRepo.findOne({
      where: { user: { id: userId }, course: { id: courseId } },
      relations: ['user', 'course'],
    });
  }

  async enrollUser(user: User, course: Course) {
    const exists = await this.isEnrolled(user.id, course.id);
    if (exists) return exists;

    const enrollment = this.enrollmentRepo.create({
      user,
      course,
      progress: 0,
    });

    const saved = await this.enrollmentRepo.save(enrollment);

    // Emit event 📢
    this.eventEmitter.emit('enrollment.created', {
      userId: user.id,
      courseId: course.id,
    });

    return saved;
  }

  async updateProgress(userId: string, courseId: string, percent: number) {
    const enrollment = await this.isEnrolled(userId, courseId);
    if (!enrollment) return null;

    enrollment.progress = percent;
    return this.enrollmentRepo.save(enrollment);
  }
}
