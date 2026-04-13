export declare class SocialLinkDto {
    platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'github';
    url: string;
}
export declare class CreateSignatureDto {
    name: string;
    title?: string;
    company?: string;
    department?: string;
    phone?: string;
    mobile?: string;
    website?: string;
    email: string;
    address?: string;
    logoUrl?: string;
    socialLinks?: SocialLinkDto[];
    templateId: string;
}
export declare class UpdateSignatureDto extends CreateSignatureDto {
}
