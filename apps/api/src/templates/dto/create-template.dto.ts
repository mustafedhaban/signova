import { IsString, IsOptional, IsBoolean, IsUrl, MinLength } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  tags?: string; // JSON-encoded string array, e.g. '["ngo","formal"]'

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsString()
  organizationId?: string;
}
