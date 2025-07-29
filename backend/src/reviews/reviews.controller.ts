import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Post()
  createReview(@Body() dto: CreateReviewDto, @Req() req) {
    const userId = req.user?.id;
    return this.reviewService.create(dto, userId);
  }

  @Get()
  getReviews(@Query('courseId') courseId: string) {
    if (!courseId) {
      throw new BadRequestException('Missing courseId query parameter');
    }
    return this.reviewService.findByCourse(courseId);
  }
}
