import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useOrganizations, Organization } from '@/features/organizations/hooks/useOrganizations';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Plus, Trash2, UserPlus, Building2 } from 'lucide-react';
import BrandingPanel from '@/features/organizations/components/BrandingPanel';

const roleBadgeVariant: Record<string, 'blue' | 'secondary' | 'outline'> = {
  owner: 'blue',
  admin: 'secondary',
  member: 'outline',
};

const OrganizationSettings: React.FC = () => {
  const { user } = useAuth();
  const { organizations, isLoading, createOrg, inviteMember, removeMember, deleteOrg, updateBranding } = useOrganizations();
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', slug: '' });
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'member' });
  const [createError, setCreateError] = useState('');
  const [inviteError, setInviteError] = useState('');

  const selectedOrg = organizations.find((o) => o.id === selectedOrgId) ?? organizations[0] ?? null;
  const myRole = selectedOrg?.members?.find((m) => m.user?.id === user?.id)?.role;
  const canManage = myRole === 'owner' || myRole === 'admin';

  const handleCreate = () => {
    setCreateError('');
    if (!createForm.name.trim() || !createForm.slug.trim()) {
      setCreateError('Name and slug are required.');
      return;
    }
    createOrg(
      { name: createForm.name.trim(), slug: createForm.slug.trim() },
      {
        onSuccess: (org: Organization) => {
          setShowCreate(false);
          setCreateForm({ name: '', slug: '' });
          setSelectedOrgId(org.id);
        },
        onError: (e: any) => setCreateError(e.response?.data?.message || 'Failed to create organization'),
      }
    );
  };

  const handleInvite = () => {
    setInviteError('');
    if (!inviteForm.email) { setInviteError('Email is required.'); return; }
    if (!selectedOrg) return;
    inviteMember(
      { orgId: selectedOrg.id, email: inviteForm.email, role: inviteForm.role },
      {
        onSuccess: () => setInviteForm({ email: '', role: 'member' }),
        onError: (e: any) => setInviteError(e.response?.data?.message || 'Failed to invite member'),
      }
    );
  };

  return (
    <AppLayout defaultTab="settings">
      {() => (
        <>
          <Navbar title="Organization Settings" />
          <div className="flex-1 overflow-y-auto p-8 bg-muted/20">
            <div className="max-w-3xl mx-auto space-y-6">

              {/* Org selector + create */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {organizations.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => setSelectedOrgId(org.id)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        (selectedOrg?.id === org.id) ? 'bg-blue-600 text-white' : 'bg-card border hover:bg-muted'
                      }`}
                    >
                      {org.name}
                    </button>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowCreate(!showCreate)}>
                  <Plus className="w-4 h-4 mr-1" /> New Organization
                </Button>
              </div>

              {/* Create org form */}
              {showCreate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Create Organization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Name</Label>
                        <Input
                          placeholder="My NGO"
                          value={createForm.name}
                          onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Slug</Label>
                        <Input
                          placeholder="my-ngo"
                          value={createForm.slug}
                          onChange={(e) => setCreateForm({ ...createForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                        />
                      </div>
                    </div>
                    {createError && <p className="text-sm text-destructive">{createError}</p>}
                    <div className="flex space-x-2">
                      <Button variant="blue" size="sm" onClick={handleCreate}>Create</Button>
                      <Button variant="outline" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* No orgs empty state */}
              {!isLoading && organizations.length === 0 && !showCreate && (
                <div className="flex flex-col items-center justify-center p-16 text-center bg-card border border-dashed rounded-lg">
                  <Building2 className="w-10 h-10 text-muted-foreground mb-4" />
                  <h3 className="font-bold text-lg mb-1">No organizations yet</h3>
                  <p className="text-muted-foreground text-sm mb-4">Create one to manage team signatures and branding.</p>
                  <Button variant="blue" size="sm" onClick={() => setShowCreate(true)}>
                    <Plus className="w-4 h-4 mr-1" /> Create Organization
                  </Button>
                </div>
              )}

              {/* Selected org details */}
              {selectedOrg && (
                <>
                  {/* Branding */}
                  <BrandingPanel
                    org={selectedOrg}
                    canEdit={canManage}
                    onSave={(data) => updateBranding(data as any)}
                  />

                  {/* Members list */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Members</CardTitle>
                      <CardDescription>{selectedOrg._count?.members ?? selectedOrg.members.length} member(s)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedOrg.members?.map((m) => (
                        <div key={m.id} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                              {m.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{m.user?.name}</p>
                              <p className="text-xs text-muted-foreground">{m.user?.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={roleBadgeVariant[m.role] ?? 'outline'}>{m.role}</Badge>
                            {canManage && m.user?.id !== user?.id && (
                              <button
                                onClick={() => removeMember({ orgId: selectedOrg.id, memberId: m.user.id })}
                                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Invite member */}
                  {canManage && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center">
                          <UserPlus className="w-4 h-4 mr-2" /> Invite Member
                        </CardTitle>
                        <CardDescription>User must already have an account</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex space-x-2">
                          <Input
                            type="email"
                            placeholder="colleague@example.com"
                            value={inviteForm.email}
                            onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                            className="flex-1"
                          />
                          <select
                            value={inviteForm.role}
                            onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                            className="px-3 py-2 border rounded-md text-sm bg-background"
                          >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                            {myRole === 'owner' && <option value="owner">Owner</option>}
                          </select>
                          <Button variant="blue" size="sm" onClick={handleInvite}>Invite</Button>
                        </div>
                        {inviteError && <p className="text-sm text-destructive">{inviteError}</p>}
                      </CardContent>
                    </Card>
                  )}

                  {/* Danger zone */}
                  {myRole === 'owner' && (
                    <Card className="border-destructive/30">
                      <CardHeader>
                        <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (window.confirm(`Delete "${selectedOrg.name}"? This cannot be undone.`)) {
                              deleteOrg(selectedOrg.id);
                              setSelectedOrgId(null);
                            }
                          }}
                        >
                          Delete Organization
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default OrganizationSettings;
