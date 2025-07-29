import { IsString, IsUrl, IsInt, Min } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsUrl()
  video_url: string;

  @IsInt()
  @Min(1)
  duration: number;
}
