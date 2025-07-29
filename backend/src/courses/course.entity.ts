import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Lesson } from '../lessons/lesson.entity';
import { Enrollment } from '../enrollments/enrollment.entity';
import { Category } from '../categories/category.entity';
import { Review } from 'src/reviews/review.entity';
import { Certificate } from 'src/certificates/certificate.entity';
@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  thumbnail_url: string;

  @Column({ type: 'decimal', default: 0 })
  price: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  syllabus: string;

  @ManyToOne(() => User, (user) => user.courses)
  created_by: User;

  @ManyToOne(() => Category, (category) => category.courses, { nullable: true })
  category: Category;

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @OneToMany(() => Review, (review) => review.course)
  reviews: Review[];
  
  @OneToMany(() => Certificate, (certificate) => certificate.course)
  certificates: Certificate[];

  @CreateDateColumn()
  created_at: Date;
}
