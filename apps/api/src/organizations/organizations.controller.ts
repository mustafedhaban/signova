import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateBrandingDto } from './dto/update-branding.dto';

@Controller('organizations')
@UseGuards(AuthGuard('jwt'))
export class OrganizationsController {
  constructor(private readonly orgsService: OrganizationsService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateOrganizationDto) {
    return this.orgsService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.orgsService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.orgsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    return this.orgsService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.orgsService.remove(req.user.userId, id);
  }

  @Post(':id/members')
  inviteMember(@Req() req, @Param('id') id: string, @Body() dto: InviteMemberDto) {
    return this.orgsService.inviteMember(req.user.userId, id, dto.email, dto.role);
  }

  @Delete(':id/members/:memberId')
  removeMember(@Req() req, @Param('id') id: string, @Param('memberId') memberId: string) {
    return this.orgsService.removeMember(req.user.userId, id, memberId);
  }

  @Patch(':id/branding')
  updateBranding(@Req() req, @Param('id') id: string, @Body() dto: UpdateBrandingDto) {
    return this.orgsService.updateBranding(req.user.userId, id, dto);
  }

  @Patch(':id/members/:memberId/role')
  updateMemberRole(
    @Req() req,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body('role') role: string,
  ) {
    return this.orgsService.updateMemberRole(req.user.userId, id, memberId, role);
  }
}
