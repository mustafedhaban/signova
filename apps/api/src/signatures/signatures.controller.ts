import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SignaturesService } from './signatures.service';
import { CreateSignatureDto, UpdateSignatureDto } from './dto/create-signature.dto';

@Controller('signatures')
@UseGuards(AuthGuard('jwt'))
export class SignaturesController {
  constructor(private readonly signaturesService: SignaturesService) {}

  @Post()
  create(@Req() req, @Body() createSignatureDto: CreateSignatureDto) {
    return this.signaturesService.create(req.user.userId, createSignatureDto);
  }

  @Get()
  findAll(@Req() req) {
    return this.signaturesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.signaturesService.findOne(req.user.userId, id);
  }

  @Get(':id/share')
  getShareLink(@Req() req, @Param('id') id: string) {
    return this.signaturesService.generateShareLink(req.user.userId, id);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() updateSignatureDto: UpdateSignatureDto) {
    return this.signaturesService.update(req.user.userId, id, updateSignatureDto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.signaturesService.remove(req.user.userId, id);
  }
}

@Controller('share')
export class ShareController {
  constructor(private readonly signaturesService: SignaturesService) {}

  @Get(':token')
  decodeShare(@Param('token') token: string) {
    return this.signaturesService.decodeShareToken(token);
  }
}
