import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Navbar from '@/components/Navbar';
import { PageShell } from '@/components/layout/page-shell';
import { SectionCard } from '@/components/layout/section-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/features/auth/hooks/useAuth';
import ChangePasswordForm from '@/features/auth/components/ChangePasswordForm';
import axios from 'axios';
import { AlertCircle, CheckCircle2, Download, Trash2, Settings as SettingsIcon } from 'lucide-react';
import { toast, toastApiError } from '@/lib/toast';

const API = 'http://localhost:3000/api/v1/users/me';

const Settings = () => {
  const { user, logout, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const handleSave = async () => {
    setSaveError('');
    setIsSaving(true);
    try {
      await axios.patch(API, { name: name.trim(), avatarUrl: avatarUrl.trim() || undefined });
      setSaveSuccess(true);
      toast.success('Profile updated');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e: unknown) {
      toastApiError(e, 'Failed to save profile');
      setSaveError(
        e && typeof e === 'object' && 'response' in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data?.message ||
              'Failed to save profile'
          : 'Failed to save profile',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API}/export`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-signova-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (deleteInput !== user?.email) return;
    try {
      await axios.delete(API);
      logout();
    } catch {
      setSaveError('Failed to delete account. Please try again.');
    }
  };

  return (
    <AppLayout defaultTab="settings">
      {() => (
        <>
          <Navbar title="Settings" description="Profile, security, and account" />
          <PageShell size="md">
            <SectionCard
              icon={SettingsIcon}
              title="Profile"
              description="Update your personal information and avatar"
            >
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Avatar className="size-20 rounded-lg">
                    <AvatarImage src={avatarUrl} alt={name} />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-2xl font-semibold text-primary">
                      {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Field className="flex-1">
                    <FieldLabel htmlFor="avatarUrl">Avatar URL</FieldLabel>
                    <Input
                      id="avatarUrl"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/avatar.png"
                      className="h-10"
                    />
                  </Field>
                </div>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Full name</FieldLabel>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="h-10"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" value={user?.email ?? ''} disabled className="h-10" />
                  </Field>
                </FieldGroup>

                {saveError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertTitle>Save failed</AlertTitle>
                    <AlertDescription>{saveError}</AlertDescription>
                  </Alert>
                ) : null}

                {saveSuccess ? (
                  <Alert className="border-success/30 bg-success/10 text-success">
                    <CheckCircle2 className="size-4" />
                    <AlertDescription>Profile updated successfully.</AlertDescription>
                  </Alert>
                ) : null}

                <Button onClick={handleSave} disabled={isSaving} className="h-10">
                  {isSaving ? (
                    <>
                      <Spinner className="mr-2" />
                      Saving…
                    </>
                  ) : (
                    'Save changes'
                  )}
                </Button>
              </div>
            </SectionCard>

            <ChangePasswordForm hasPassword={!!user?.hasPassword} onSuccess={refreshUser} />

            <SectionCard
              icon={Download}
              title="Account management"
              description="Export your data and view account details"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Provider</p>
                    <p className="mt-1 font-medium capitalize">{user?.provider ?? 'dev'}</p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Member since</p>
                    <p className="mt-1 font-medium">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : '—'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleExport} className="h-10 w-full sm:w-auto">
                  <Download className="size-4" />
                  Export data (GDPR)
                </Button>
              </div>
            </SectionCard>

            <SectionCard
              icon={Trash2}
              title="Danger zone"
              description="Permanently delete your account and all data"
              variant="destructive"
            >
              {!showDeleteConfirm ? (
                <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 className="size-4" />
                  Delete my account
                </Button>
              ) : (
                <div className="space-y-4 rounded-lg border border-destructive/20 bg-card p-4">
                  <p className="text-sm text-muted-foreground">
                    This removes all signatures, organizations, and team data. Type{' '}
                    <span className="font-medium text-destructive">{user?.email}</span> to confirm.
                  </p>
                  <Field>
                    <FieldLabel htmlFor="deleteConfirm">Confirm email</FieldLabel>
                    <Input
                      id="deleteConfirm"
                      value={deleteInput}
                      onChange={(e) => setDeleteInput(e.target.value)}
                      placeholder={user?.email}
                      className="h-10"
                    />
                  </Field>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={deleteInput !== user?.email}
                      className="flex-1"
                    >
                      Permanently delete
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteInput('');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </SectionCard>
          </PageShell>
        </>
      )}
    </AppLayout>
  );
};

export default Settings;
