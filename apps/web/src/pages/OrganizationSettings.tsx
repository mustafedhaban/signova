import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Trash2, UserPlus, Building2, Users } from 'lucide-react';
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
          <Navbar title="Organization Settings" />
          <div className="flex-1 overflow-y-auto p-8 bg-muted/30">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

              {/* Org selector + create */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 p-1 bg-muted rounded-2xl border border-border/50">
                  {organizations.map((org, index) => (
                    <button
                      key={org.id || `org-${index}`}
                      onClick={() => setSelectedOrgId(org.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                        (selectedOrg?.id === org.id) 
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                          : 'text-muted-foreground hover:bg-background hover:text-primary'
                      }`}
                    >
                      {org.name}
                    </button>
                  ))}
                </div>

                <Dialog open={showCreate} onOpenChange={setShowCreate}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-xl font-bold border-2 h-10 px-4 active:scale-95">
                      <Plus className="w-4 h-4 mr-2" /> New Organization
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Create Organization</DialogTitle>
                      <DialogDescription>
                        Launch a new workspace for your team signatures.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 pt-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Name</Label>
                          <Input
                            placeholder="e.g. Acme NGO"
                            value={createForm.name}
                            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                            className="bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl h-11 font-medium"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Slug</Label>
                          <Input
                            placeholder="acme-ngo"
                            value={createForm.slug}
                            onChange={(e) => setCreateForm({ ...createForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                            className="bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl h-11 font-medium"
                          />
                        </div>
                      </div>
                      {createError && <p className="text-xs font-bold text-destructive px-2">{createError}</p>}
                      <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setShowCreate(false)} className="rounded-xl px-6 font-bold border-2">Cancel</Button>
                        <Button variant="default" onClick={handleCreate} className="rounded-xl px-6 font-bold shadow-lg shadow-primary/20 active:scale-95">Create Workspace</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* No orgs empty state */}
              {!isLoading && organizations.length === 0 && !showCreate && (
                <div className="flex flex-col items-center justify-center p-20 text-center bg-card border-2 border-dashed rounded-[2.5rem] shadow-soft">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 rotate-3">
                    <Building2 className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-2xl mb-2 text-primary">No organizations yet</h3>
                  <p className="text-muted-foreground text-sm mb-10 max-w-xs leading-relaxed">Create a workspace to manage team signatures and unified branding.</p>
                  <Button variant="default" size="lg" onClick={() => setShowCreate(true)} className="rounded-2xl px-10 font-bold shadow-xl shadow-primary/20 h-14 text-base active:scale-95">
                    <Plus className="w-5 h-5 mr-3" /> Create First Organization
                  </Button>
                </div>
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

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Members list */}
                    <Card className="h-full">
                      <CardHeader className="border-b border-border/50 pb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">Team Members</CardTitle>
                            <CardDescription>{selectedOrg._count?.members ?? selectedOrg.members.length} member(s) active</CardDescription>
                          </div>
                          <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                        </div>
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
                      {canManage && (
                        <Card>
                          <CardHeader className="border-b border-border/50 pb-6">
                            <CardTitle className="text-lg flex items-center">
                              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                                <UserPlus className="w-4 h-4 text-primary" />
                              </div>
                              Invite Colleague
                            </CardTitle>
                            <CardDescription>Add new members to your workspace</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6 pt-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Email Address</Label>
                                <Input
                                  type="email"
                                  placeholder="colleague@example.com"
                                  value={inviteForm.email}
                                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                                  className="bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl h-11 font-medium"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Workspace Role</Label>
                                <Select
                                  value={inviteForm.role}
                                  onValueChange={(value) => setInviteForm({ ...inviteForm, role: value ?? 'member' })}
                                >
                                  <SelectTrigger className="bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl h-11 font-medium transition-all">
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-xl border-2">
                                    <SelectItem value="member">Member</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    {myRole === 'owner' && <SelectItem value="owner">Owner</SelectItem>}
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button variant="default" onClick={handleInvite} className="w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95">Send Invitation</Button>
                            </div>
                            {inviteError && <p className="text-[10px] font-bold text-destructive px-1">{inviteError}</p>}
                          </CardContent>
                        </Card>
                      )}

                      {/* Danger zone */}
                      {myRole === 'owner' && (
                        <Card className="border-destructive/30 bg-destructive/[0.02]">
                          <CardHeader>
                            <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
                            <CardDescription>Permanently remove this organization</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="rounded-xl font-bold px-6 h-10 shadow-lg shadow-destructive/20 active:scale-95"
                                >
                                  Delete Workspace
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-3xl border-2">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-xl font-bold">Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the organization
                                    <strong> {selectedOrg.name}</strong> and remove all associated data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-xl font-bold border-2">Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      deleteOrg(selectedOrg.id);
                                      setSelectedOrgId(null);
                                    }}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold shadow-lg shadow-destructive/20"
                                  >
                                    Delete Organization
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default OrganizationSettings;
