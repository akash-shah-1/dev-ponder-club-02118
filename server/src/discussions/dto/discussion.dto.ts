import { IsString, IsArray, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDiscussionDto {
  @ApiProperty({ minLength: 10, maxLength: 200 })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  title: string;

  @ApiProperty({ minLength: 30 })
  @IsString()
  @MinLength(30)
  content: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty()
  @IsString()
  category: string;
}

export class UpdateDiscussionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(30)
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;
}

export class CreateDiscussionReplyDto {
  @ApiProperty({ minLength: 10 })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parentReplyId?: string;
}