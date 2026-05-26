import { IsString, IsOptional, IsEmail, IsUrl, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type, Transform } from 'class-transformer';

const emptyToUndefined = ({ value }: { value: unknown }) =>
  value === '' || value === null ? undefined : value;

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

  @Transform(emptyToUndefined)
  @IsUrl()
  @IsOptional()
  website?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  address?: string;

  @Transform(emptyToUndefined)
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

  @Transform(emptyToUndefined)
  @IsUUID()
  @IsOptional()
  organizationId?: string;

  @IsString()
  @IsOptional()
  primaryColor?: string;

  @IsString()
  @IsOptional()
  fontFamily?: string;
}

export class UpdateSignatureDto extends CreateSignatureDto {}
