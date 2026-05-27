import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useOrganizations, type Organization } from '../hooks/useOrganizations';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Loader2, UserPlus } from 'lucide-react';

const roleBadgeVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  owner: 'default',
  admin: 'secondary',
  member: 'outline',
};

const ORG_API = 'http://localhost:3000/api/v1/organizations';

const OrganizationMembersCard: React.FC = () => {
  const { user } = useAuth();
  const { organizations, isLoading, inviteMember } = useOrganizations();
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'member' });
  const [inviteError, setInviteError] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const orgId = selectedOrgId || organizations[0]?.id;

  const orgDetailQuery = useQuery<Organization>({
    queryKey: ['organizations', orgId],
    enabled: !!orgId,
    queryFn: async () => (await axios.get(`${ORG_API}/${orgId}`)).data,
  });

  const selectedOrg = orgDetailQuery.data;
  const myRole = selectedOrg?.members?.find((m) => m.user?.id === user?.id)?.role;
  const canManage = myRole === 'owner' || myRole === 'admin';

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg || !inviteForm.email.trim()) {
      setInviteError('Email is required.');
      return;
    }
    setInviteError('');
    setIsInviting(true);
    inviteMember(
      { orgId: selectedOrg.id, email: inviteForm.email.trim(), role: inviteForm.role },
      {
        onSuccess: () => {
          setInviteForm({ email: '', role: 'member' });
          setIsInviting(false);
        },
        onError: (err: unknown) => {
          const message =
            err && typeof err === 'object' && 'response' in err
              ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
              : undefined;
          setInviteError(message || 'Failed to invite member.');
          setIsInviting(false);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <Card className="rounded-[2.5rem] border shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Organization members</CardTitle>
          <CardDescription>
            Create an organization to invite colleagues with Owner, Admin, or Member roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            to="/organizations"
            className="inline-flex items-center justify-center rounded-xl border-2 border-border px-4 py-2 text-sm font-bold hover:bg-muted"
          >
            <Building2 className="mr-2 h-4 w-4" />
            Go to Organizations
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-[2.5rem] border shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg">Organization members</CardTitle>
        <CardDescription>
          Invite by email (user must already have a Signova account). They receive an email when
          Resend or SMTP is configured; otherwise the API logs the invite in development.
        </CardDescription>
        {organizations.length > 1 && (
          <Select value={orgId} onValueChange={(v) => setSelectedOrgId(v ?? '')}>
            <SelectTrigger className="mt-2 max-w-xs rounded-xl border-2">
              <SelectValue placeholder="Select organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {orgDetailQuery.isLoading && (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        <ul className="space-y-3">
          {selectedOrg?.members?.map((m) => (
            <li
              key={m.user.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-muted/20 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="h-9 w-9 rounded-lg">
                  <AvatarImage src={m.user.avatarUrl} alt={m.user.name} />
                  <AvatarFallback className="text-xs font-bold">
                    {m.user.name?.charAt(0) ?? '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{m.user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.user.email}</p>
                </div>
              </div>
              <Badge
                variant={roleBadgeVariant[m.role] ?? 'outline'}
                className="shrink-0 rounded-lg text-[10px] font-bold uppercase"
              >
                {m.role}
              </Badge>
            </li>
          ))}
        </ul>

        {canManage && (
          <form onSubmit={handleInvite} className="space-y-3 border-t border-border pt-6">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <UserPlus className="h-4 w-4 text-primary" />
              Invite member
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invite-email" className="text-xs font-bold uppercase tracking-wider">
                  Email
                </Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="colleague@ngo.org"
                  className="rounded-xl border-2"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider">Role</Label>
                <Select
                  value={inviteForm.role}
                  onValueChange={(value) => setInviteForm({ ...inviteForm, role: value ?? 'member' })}
                >
                  <SelectTrigger className="rounded-xl border-2">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {inviteError && (
              <p className="text-xs font-bold text-destructive">{inviteError}</p>
            )}
            <Button type="submit" disabled={isInviting} className="rounded-xl font-bold">
              {isInviting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add member'}
            </Button>
          </form>
        )}

        <Link
          to="/organizations"
          className="inline-block text-xs font-bold text-primary underline-offset-2 hover:underline"
        >
          Full organization settings
        </Link>
      </CardContent>
    </Card>
  );
};

export default OrganizationMembersCard;
