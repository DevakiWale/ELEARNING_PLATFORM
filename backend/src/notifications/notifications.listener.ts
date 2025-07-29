import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsListener {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('enrollment.created')
  async handleEnrollmentCreatedEvent(payload: { userId: string; courseId: string }) {
    await this.notificationsService.sendEnrollmentNotification(payload.userId, payload.courseId);
  }

  @OnEvent('course.completed')
  async handleCourseCompletionEvent(payload: { userId: string; courseTitle: string }) {
    await this.notificationsService.sendCourseCompletionNotification(payload.userId, payload.courseTitle);
  }
}
