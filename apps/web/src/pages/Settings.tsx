import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import axios from 'axios';
import { CheckCircle2, Download, Trash2, Settings as SettingsIcon } from 'lucide-react';

const API = 'http://localhost:3000/api/v1/users/me';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
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
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e: any) {
      setSaveError(e.response?.data?.message || 'Failed to save profile');
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
          <Navbar title="Settings" />
          <div className="flex-1 overflow-y-auto p-8 bg-muted/30">
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

              {/* Profile */}
              <Card>
                <CardHeader className="pb-8 border-b border-border/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <SettingsIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Profile Settings</CardTitle>
                      <CardDescription>Update your personal information and avatar</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 pt-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <Avatar className="w-24 h-24 rounded-3xl border-4 border-background shadow-soft ring-1 ring-border/50 transition-transform hover:rotate-3">
                      <AvatarImage src={avatarUrl} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                        {name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 w-full space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Avatar URL</Label>
                      <Input
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/avatar.png"
                        className="bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl transition-all h-12 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl transition-all h-12 font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1 opacity-60">Email Address</Label>
                      <Input 
                        value={user?.email ?? ''} 
                        disabled 
                        className="bg-muted/20 border-2 border-transparent rounded-xl h-12 font-bold opacity-60 cursor-not-allowed" 
                      />
                    </div>
                  </div>

                  {saveError && (
                    <Alert variant="destructive" className="rounded-2xl border-2">
                      <AlertDescription className="font-bold">{saveError}</AlertDescription>
                    </Alert>
                  )}

                  {saveSuccess && (
                    <Alert className="rounded-2xl border-2 border-green-200 bg-green-50 text-green-700">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="font-bold">Profile updated successfully!</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`w-full sm:w-auto h-12 px-10 rounded-2xl font-bold transition-all shadow-xl active:scale-95 ${
                      saveSuccess 
                        ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/20' 
                        : 'shadow-primary/20'
                    }`}
                  >
                    {isSaving ? 'Saving Changes...' : saveSuccess ? '✓ Saved' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>

              {/* Account info */}
              <Card>
                <CardHeader className="pb-8 border-b border-border/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Download className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Account Management</CardTitle>
                      <CardDescription>Manage your data and account details</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 transition-colors hover:bg-muted/50">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Provider</p>
                      <p className="font-bold capitalize text-sm">{user?.provider ?? 'dev'}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-2xl border border-border/50 transition-colors hover:bg-muted/50">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Member Since</p>
                      <p className="font-bold text-sm">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleExport} className="w-full h-12 rounded-2xl font-bold border-2 hover:bg-muted active:scale-[0.98]">
                    <Download className="w-4 h-4 mr-2" /> Export Data (GDPR)
                  </Button>
                </CardContent>
              </Card>

              {/* Danger zone */}
              <Card className="border-destructive/30 bg-destructive/[0.02]">
                <CardHeader className="pb-6 border-b border-destructive/10">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                      <Trash2 className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-destructive">Danger Zone</CardTitle>
                      <CardDescription>Permanently delete your account and all data</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {!showDeleteConfirm ? (
                    <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} className="w-full sm:w-auto h-12 px-10 rounded-2xl font-bold shadow-lg shadow-destructive/20 active:scale-[0.98]">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete My Account
                    </Button>
                  ) : (
                    <div className="space-y-6 p-6 border-2 border-destructive/20 rounded-3xl bg-white animate-in zoom-in-95 duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                          <Trash2 className="w-5 h-5 text-destructive" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-destructive">Wait! This is permanent.</p>
                          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                            Deleting your account will remove all signatures, organizations, and team data. This action cannot be reversed.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                          Confirm by typing: <span className="text-destructive select-all">{user?.email}</span>
                        </Label>
                        <Input
                          value={deleteInput}
                          onChange={(e) => setDeleteInput(e.target.value)}
                          placeholder={user?.email}
                          className="bg-muted/40 border-2 border-transparent focus:border-destructive/30 focus:bg-background rounded-xl h-11 font-medium"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                          variant="destructive"
                          onClick={handleDelete}
                          disabled={deleteInput !== user?.email}
                          className="flex-1 h-12 rounded-2xl font-bold shadow-lg shadow-destructive/20 active:scale-[0.98]"
                        >
                          Permanently Delete Account
                        </Button>
                        <Button variant="outline" onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }} className="flex-1 h-12 rounded-2xl font-bold border-2 active:scale-[0.98]">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default Settings;
