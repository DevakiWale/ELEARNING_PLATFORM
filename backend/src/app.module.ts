import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Course } from './courses/course.entity';
import { Lesson } from './lessons/lesson.entity';
import { Enrollment } from './enrollments/enrollment.entity';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AuthModule } from './auth/auth.module';
import { ProgressService } from './progress/progress.service';
import { ProgressGateway } from './progress/progress.gateway';
import { ProgressModule } from './progress/progress.module';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { UploadService } from './upload/upload.service';
import { UploadController } from './upload/upload.controller';
import { UploadModule } from './upload/upload.module';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/category.entity';
// import { ReviewModule } from './review/review.module';
// import { CertificateController } from './certificate/certificate.controller';
// import { Review } from './review/review.entity';
// import { Certificate } from './certificate/certificate.entity';
// import { CertificateModule } from './certificate/certificate.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CertificateController } from './certificates/certificates.controller';
import { CertificateService } from './certificates/certificates.service';
import { CertificateModule } from './certificates/certificates.module';
import { Certificate } from './certificates/certificate.entity';
import { Review } from './reviews/review.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationsModule } from './notifications/notifications.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes process.env available everywhere
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Devaki@2729',
      database: 'elearning',
      entities: [
        User,
        Course,
        Lesson,
        Enrollment,
        Category,
        Review,
        Certificate,
      ],
      synchronize: true,
    }),
    UsersModule,
    CoursesModule,
    LessonsModule,
    EnrollmentsModule,
    AuthModule,
    ProgressModule,
    ChatModule,
    UploadModule,
    CategoriesModule,
    CertificateModule,
    ReviewsModule,
    NotificationsModule,
    MailModule,
  ],
  providers: [
    ProgressService,
    ProgressGateway,
    ChatGateway,
    UploadService,
    NotificationsService,
    MailService,
  ],
  controllers: [UploadController, CertificateController],
})
export class AppModule {}
