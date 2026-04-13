import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';

@Controller('teams')
@UseGuards(AuthGuard('jwt'))
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Req() req, @Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(req.user.userId, createTeamDto);
  }

  @Get()
  findAll(@Req() req) {
    return this.teamsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.teamsService.findOne(req.user.userId, id);
  }

  @Post(':id/import')
  importCsv(@Req() req, @Param('id') id: string, @Body() body: { members: any[] }) {
    return this.teamsService.importCsv(req.user.userId, id, body.members);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.teamsService.remove(req.user.userId, id);
  }
}
