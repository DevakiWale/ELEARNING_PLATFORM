import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './enrollment.entity';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { CoursesModule } from 'src/courses/courses.module';
import { UsersModule } from 'src/users/users.module';
import { Course } from 'src/courses/course.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment, Course, User]),
    CoursesModule,
    UsersModule,
  ],
  providers: [EnrollmentsService],
  exports: [TypeOrmModule, EnrollmentsService],
  controllers: [EnrollmentsController],
})
export class EnrollmentsModule {}
