import { Controller, Post, Req, Param, UseGuards, Get } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { CoursesService } from 'src/courses/courses.service';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(
    private readonly enrollmentsService: EnrollmentsService,
    private readonly coursesService: CoursesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':courseId')
  async enroll(@Param('courseId') courseId: string, @Req() req: Request) {
    const userId = (req.user as any).userId;

    return this.enrollmentsService.enrollUser(
      { id: userId } as any,
      { id: courseId } as any,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyEnrollments(@Req() req) {
    const userId = (req.user as any).userId;
    return this.enrollmentsService.findByUser(userId);
  }
}
