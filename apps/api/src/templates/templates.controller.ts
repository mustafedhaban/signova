import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';

@Controller('templates')
@UseGuards(AuthGuard('jwt'))
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  findAll(@Req() req, @Query('orgId') orgId?: string, @Query('category') category?: string, @Query('tag') tag?: string) {
    return this.templatesService.findAll(req.user.userId, orgId, category, tag);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTemplateDto) {
    return this.templatesService.create(dto);
  }

  @Post(':id/duplicate')
  duplicate(@Req() req, @Param('id') id: string) {
    return this.templatesService.duplicate(id, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templatesService.remove(id);
  }
}
