import { IsString, IsOptional, IsEmail, IsUrl, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SocialLinkDto {
  @IsString()
  platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'github';

  @IsUrl()
  url: string;
}

export class CreateSignatureDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  mobile?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];

  @IsString()
  templateId: string;
}

export class UpdateSignatureDto extends CreateSignatureDto {}
