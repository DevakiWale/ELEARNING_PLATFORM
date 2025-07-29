import { Injectable } from '@nestjs/common';

import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { CoursesService } from '../courses/courses.service';
import { Course } from '../courses/course.entity'; 
@Injectable()
export class NotificationsService {
  constructor(
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly coursesService: CoursesService, // ✅ inject this
  ) {}

  async sendEnrollmentNotification(userId: string, courseId: string) {
    const user = await this.usersService.findById(userId);
    const course: Course | null = await this.coursesService.findById(courseId);

    if (!user || !course) return;

    await this.mailService.sendEnrollmentConfirmation(user.email, course.title);
  }

  async sendCourseCompletionNotification(userId: string, courseTitle: string) {
    const user = await this.usersService.findById(userId);
    if (!user) return;

    await this.mailService.sendCourseCompletion(user.email, courseTitle);
  }
}
