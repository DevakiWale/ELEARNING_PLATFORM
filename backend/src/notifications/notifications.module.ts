import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsListener } from './notifications.listener';
import { UsersModule } from 'src/users/users.module';
import { CoursesModule } from 'src/courses/courses.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  providers: [NotificationsService, NotificationsListener],
  imports: [UsersModule, CoursesModule, MailModule],
  exports: [NotificationsService],
})
export class NotificationsModule {}
