import { IsString, IsNotEmpty, IsOptional, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export class CreateKnowledgeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ enum: ArticleStatus, required: false })
  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus;
}

export class UpdateKnowledgeDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ enum: ArticleStatus, required: false })
  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus;
}

export class KnowledgeFiltersDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ enum: ArticleStatus, required: false })
  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;
}
