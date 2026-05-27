import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Navbar from '@/components/Navbar';
import { PageShell } from '@/components/layout/page-shell';
import { EmptyState } from '@/components/layout/empty-state';
import { SectionCard } from '@/components/layout/section-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useOrganizations, Organization } from '@/features/organizations/hooks/useOrganizations';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Plus, Trash2, UserPlus, Building2 } from 'lucide-react';
import BrandingPanel from '@/features/organizations/components/BrandingPanel';

const roleBadgeVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  owner: 'default',
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
        <div className="flex flex-col h-full overflow-hidden">
          <Navbar
            title="Organizations"
            description="Workspaces, branding, and team members"
          />
          <PageShell size="lg">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {organizations.length > 0 ? (
                  <Tabs
                    value={selectedOrg?.id ?? organizations[0]?.id}
                    onValueChange={setSelectedOrgId}
                  >
                    <TabsList className="h-auto flex-wrap justify-start">
                      {organizations.map((org, index) => (
                        <TabsTrigger key={org.id || `org-${index}`} value={org.id} className="text-sm">
                          {org.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                ) : (
                  <div />
                )}

                <Dialog open={showCreate} onOpenChange={setShowCreate}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="size-4" />
                      New organization
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create organization</DialogTitle>
                      <DialogDescription>
                        Launch a new workspace for your team signatures.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="org-name">Name</FieldLabel>
                          <Input
                            id="org-name"
                            placeholder="e.g. Acme NGO"
                            value={createForm.name}
                            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                            className="h-10"
                          />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="org-slug">Slug</FieldLabel>
                          <Input
                            id="org-slug"
                            placeholder="acme-ngo"
                            value={createForm.slug}
                            onChange={(e) =>
                              setCreateForm({
                                ...createForm,
                                slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                              })
                            }
                            className="h-10"
                          />
                        </Field>
                      </FieldGroup>
                      {createError ? (
                        <Alert variant="destructive">
                          <AlertDescription>{createError}</AlertDescription>
                        </Alert>
                      ) : null}
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setShowCreate(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreate}>Create workspace</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {!isLoading && organizations.length === 0 && !showCreate && (
                <EmptyState
                  icon={Building2}
                  title="No organizations yet"
                  description="Create a workspace to manage team signatures and unified branding."
                  action={{ label: 'Create organization', onClick: () => setShowCreate(true) }}
                />
              )}

              {/* Selected org details */}
              {selectedOrg && (
                <div className="grid grid-cols-1 gap-8">
                  {/* Branding */}
                  <BrandingPanel
                    org={selectedOrg}
                    canEdit={canManage}
                    onSave={(data) => updateBranding(data as any)}
                  />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Team members</CardTitle>
                        <CardDescription>
                          {selectedOrg._count?.members ?? selectedOrg.members.length} active member(s)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {selectedOrg.members?.map((m, index) => (
                            <div key={m.id || `member-${index}`} className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shadow-sm">
                                  {m.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                                </div>
                                <div>
                                  <p className="text-sm font-bold leading-tight">{m.user?.name}</p>
                                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">{m.user?.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Badge variant={roleBadgeVariant[m.role] ?? 'outline'} className="rounded-lg text-[10px] font-bold px-2 py-0.5 border-2 shadow-sm uppercase tracking-widest">{m.role}</Badge>

                                {canManage && m.user?.id !== user?.id && (
                                  <button
                                    onClick={() => removeMember({ orgId: selectedOrg.id, memberId: m.user.id })}
                                    className="p-2 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-8">
                      {/* Invite member */}
                      {canManage ? (
                        <SectionCard
                          icon={UserPlus}
                          title="Invite colleague"
                          description="Add new members to your workspace"
                        >
                          <FieldGroup>
                            <Field>
                              <FieldLabel htmlFor="invite-email">Email</FieldLabel>
                              <Input
                                id="invite-email"
                                type="email"
                                placeholder="colleague@example.com"
                                value={inviteForm.email}
                                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                                className="h-10"
                              />
                            </Field>
                            <Field>
                              <FieldLabel>Role</FieldLabel>
                              <Select
                                value={inviteForm.role}
                                onValueChange={(value) => setInviteForm({ ...inviteForm, role: value ?? 'member' })}
                              >
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="member">Member</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  {myRole === 'owner' ? <SelectItem value="owner">Owner</SelectItem> : null}
                                </SelectContent>
                              </Select>
                            </Field>
                          </FieldGroup>
                          {inviteError ? (
                            <Alert variant="destructive" className="mt-4">
                              <AlertDescription>{inviteError}</AlertDescription>
                            </Alert>
                          ) : null}
                          <Button onClick={handleInvite} className="mt-4 w-full">
                            Send invitation
                          </Button>
                        </SectionCard>
                      ) : null}

                      {myRole === 'owner' ? (
                        <SectionCard
                          icon={Trash2}
                          title="Danger zone"
                          description="Permanently remove this organization"
                          variant="destructive"
                        >
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Delete workspace
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete organization?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This permanently deletes <strong>{selectedOrg.name}</strong> and all
                                  associated data. This cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    deleteOrg(selectedOrg.id);
                                    setSelectedOrgId(null);
                                  }}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete organization
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </SectionCard>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
          </PageShell>
        </div>
      )}
    </AppLayout>
  );
};

export default OrganizationSettings;
