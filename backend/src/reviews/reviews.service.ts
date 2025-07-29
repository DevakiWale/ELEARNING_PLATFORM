import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/review.dto';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async create(dto: CreateReviewDto, user: User) {
    const course = await this.courseRepo.findOne({
      where: { id: dto.courseId },
    });
    if (!course) throw new Error('Course not found');

    const review = this.reviewRepo.create({
      comment: dto.comment,
      rating: dto.rating,
      user,
      course, 
    });
    return this.reviewRepo.save(review);
  }

  async findByCourse(courseId: string) {
    return this.reviewRepo.find({
      where: { course: { id: courseId } },
      relations: ['user'],
    });
  }
}
