// src/lessons/lessons.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { LessonsService } from './lessons.service';
import { Request } from 'express';

@Controller()
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @UseGuards(JwtAuthGuard, new RolesGuard(['instructor']))
  @Post('courses/:courseId/lessons')
  async addLesson(
    @Param('courseId') courseId: string,
    @Body() dto: CreateLessonDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any).userId;
    return this.lessonsService.addLesson(courseId, dto, userId);
  }

  @Get('courses/:courseId/lessons')
  async getLessons(@Param('courseId') courseId: string) {
    return this.lessonsService.getLessons(courseId);
  }

  // ✅ NEW: Get lesson by ID
  @Get('lessons/:id')
  async getLessonById(@Param('id') id: string) {
    return this.lessonsService.getLessonById(id);
  }
}
