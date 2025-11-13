import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  answerId: string;
}

export class UpdateCommentDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content?: string;
}
