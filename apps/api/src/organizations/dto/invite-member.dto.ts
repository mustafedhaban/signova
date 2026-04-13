import { IsEmail, IsIn } from 'class-validator';

export class InviteMemberDto {
  @IsEmail()
  email: string;

  @IsIn(['owner', 'admin', 'member'])
  role: 'owner' | 'admin' | 'member';
}
