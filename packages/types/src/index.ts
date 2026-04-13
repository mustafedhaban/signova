export interface IUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: 'google' | 'microsoft';
}

export interface ISignature {
  id: string;
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
  socialLinks?: ISocialLink[];
  templateId: string;
  primaryColor?: string;
  fontFamily?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISocialLink {
  platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'github';
  url: string;
}

export interface ITeamMember extends Omit<ISignature, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
  teamId: string;
}

export interface ITeam {
  id: string;
  name: string;
  userId: string;
}
