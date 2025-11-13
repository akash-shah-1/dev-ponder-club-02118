import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerDto {
  @ApiProperty({ minLength: 30 })
  @IsString()
  @MinLength(30)
  content: string;

  @ApiProperty()
  @IsString()
  questionId: string;
}

export class UpdateAnswerDto {
  @ApiProperty({ minLength: 30 })
  @IsString()
  @MinLength(30)
  content: string;
}