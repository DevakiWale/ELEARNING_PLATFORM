import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { Course } from '../courses/course.entity';
// src/lessons/lessons.service.ts

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
  ) {}

  async addLesson(courseId: string, dto: CreateLessonDto, userId: string) {
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['created_by'],
    });

    if (!course) throw new NotFoundException('Course not found');
    if (course.created_by.id !== userId)
      throw new ForbiddenException('You are not the owner of this course');

    const lesson = this.lessonRepo.create({ ...dto, course });
    return this.lessonRepo.save(lesson);
  }

  async getLessons(courseId: string) {
    return this.lessonRepo.find({
      where: { course: { id: courseId } },
      order: { created_at: 'ASC' },
    });
  }

  // ✅ NEW: Find a single lesson
  async getLessonById(id: string) {
    const lesson = await this.lessonRepo.findOne({
      where: { id },
      relations: ['course'],
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }
}
