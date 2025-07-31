// src/progress/progress.controller.ts
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async saveProgress(
    @Body() body: { courseId: string; lessonId: string; percent: number },
    @Req() req,
  ) {
    const UserId = req.user?.userId;
    if (!UserId) throw new Error('User ID not found');

    const { courseId, lessonId, percent } = body;
    return this.progressService.saveProgress(
      UserId,
      courseId,
      lessonId,
      percent,
    );
  }   
}
