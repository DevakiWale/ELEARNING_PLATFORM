import { IsUUID, IsInt, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  courseId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;
}
