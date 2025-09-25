import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { SourceDto, UpdateSourceDto } from './dto/sources.dto';

@Controller(':id/sources')
export class SourcesController {
  constructor(private sourcesService: SourcesService) {}

  @Get()
  getSources(@Param('id') userId: string) {
    return this.sourcesService.getSources(userId);
  }

  @Get(':sourceId')
  getSource(@Param('sourceId') sourceId: string, @Param('id') userId: string) {
    return this.sourcesService.getSource(sourceId, userId);
  }

  @Post('')
  createSource(@Param('id') userId: string, @Body() data: SourceDto) {
    return this.sourcesService.createSource(userId, data);
  }

  @Patch(':sourceId')
  updateSource(
    @Param('sourceId') sourceId: string,
    @Param('id') userId: string,
    @Body() data: UpdateSourceDto
  ) {
    return this.sourcesService.updateSource(sourceId, userId, data);
  }

  @Delete(':sourceId')
  deleteSource(@Param('sourceId') sourceId: string, @Param('id') userId: string) {
    return this.sourcesService.deleteSource(sourceId, userId);
  }
}
