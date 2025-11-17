import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { KnowledgeService } from './knowledge.service';
import { CreateKnowledgeDto, UpdateKnowledgeDto, KnowledgeFiltersDto } from './dto/knowledge.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user.decorator';

@ApiTags('knowledge')
@Controller('knowledge')
export class KnowledgeController {
  constructor(
    private knowledgeService: KnowledgeService,
  ) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a knowledge article' })
  async create(
    @Body() createKnowledgeDto: CreateKnowledgeDto,
    @CurrentUserId() userId: string,
  ) {
    return this.knowledgeService.create(createKnowledgeDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all knowledge articles' })
  async findAll(@Query() filters: KnowledgeFiltersDto) {
    return this.knowledgeService.findAll(filters);
  }

  @Get('most-viewed')
  @ApiOperation({ summary: 'Get most viewed articles' })
  @ApiQuery({ name: 'limit', required: false })
  async getMostViewed(@Query('limit') limit?: number) {
    return this.knowledgeService.getMostViewed(limit);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get articles by category' })
  async getByCategory(@Param('category') category: string) {
    return this.knowledgeService.getByCategory(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by ID' })
  async findOne(@Param('id') id: string) {
    return this.knowledgeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update article' })
  async update(
    @Param('id') id: string,
    @Body() updateKnowledgeDto: UpdateKnowledgeDto,
    @CurrentUserId() userId: string,
  ) {
    return this.knowledgeService.update(id, updateKnowledgeDto, userId);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete article' })
  async remove(@Param('id') id: string, @CurrentUserId() userId: string) {
    return this.knowledgeService.remove(id, userId);
  }
}
