import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Enrollment } from '../enrollments/enrollment.entity';
import { Course } from '../courses/course.entity';
import { Review } from '../reviews/review.entity';

export type UserRole = 'student' | 'instructor' | 'admin';

@Entity()
export class User {
  [x: string]: any;
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ type: 'enum', enum: ['student', 'instructor', 'admin'] })
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments: Enrollment[];

  @OneToMany(() => Course, (course) => course.created_by)
  courses: Course[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
