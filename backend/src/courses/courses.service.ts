import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { User } from '../users/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async create(dto: CreateCourseDto, user: User) {
    if (!user || !user.id) {
      throw new Error('Invalid user creating course');
    }

    const course = this.courseRepo.create({
      ...dto,
      created_by: user,
    });

    return this.courseRepo.save(course);
  }

  async findAllApproved() {
    return this.courseRepo.find({
      where: { status: 'approved' },
      relations: ['created_by'],
    });
  }

  async findAllPending() {
    return this.courseRepo.find({ where: { status: 'pending' } });
  }

  async approve(id: string) {
    return this.courseRepo.update(id, { status: 'approved' });
  }

  async reject(id: string) {
    return this.courseRepo.update(id, { status: 'rejected' });
  }

  async findOne(id: string) {
    return this.courseRepo.findOne({
      where: { id },
      relations: ['created_by'],
    });
  }

  async getFilteredCourses(params: {
    search?: string;
    category?: string;
    sort?: string;
  }) {
    const { search, category, sort } = params;

    const query = this.courseRepo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.created_by', 'user')
      .leftJoinAndSelect('course.category', 'category');

    if (search) {
      query.andWhere(
        'LOWER(course.title) LIKE :search OR LOWER(user.name) LIKE :search',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    if (category) {
      query.andWhere('course.categoryId = :category', { category });
    }

    if (sort === 'price_asc') {
      query.orderBy('course.price', 'ASC');
    } else if (sort === 'price_desc') {
      query.orderBy('course.price', 'DESC');
    } else if (sort === 'title') {
      query.orderBy('course.title', 'ASC');
    } else {
      query.orderBy('course.createdAt', 'DESC'); // default
    }

    return await query.getMany();
  }

  async getAnalyticsForInstructor(instructorId: string) {
    const courses = await this.courseRepo.find({
      where: { created_by: { id: instructorId } },
      relations: ['enrollments', 'lessons', 'reviews'],
    });

    return courses.map((course) => ({
      title: course.title,
      totalEnrollments: course.enrollments.length,
      avgRating:
        course.reviews.reduce((acc, r) => acc + r.rating, 0) /
        (course.reviews.length || 1),
      totalLessons: course.lessons.length,
    }));
  }

  async findById(id: string): Promise<Course | null> {
    return this.courseRepo.findOne({
      where: { id },
      relations: ['created_by'],
    });
  }
}
