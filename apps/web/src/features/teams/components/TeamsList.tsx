import React, { useState } from 'react';
import { useTeams, type TeamWithCount } from '../hooks/useTeams';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Plus, Trash2, Users } from 'lucide-react';

const TeamsList: React.FC = () => {
  const { teams, isLoading, createTeam, deleteTeam, isCreating, isDeleting } = useTeams();
  const [newName, setNewName] = useState('');
  const [createError, setCreateError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<TeamWithCount | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) {
      setCreateError('Team name is required.');
      return;
    }
    setCreateError('');
    try {
      await createTeam({ name });
      setNewName('');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setCreateError(message || 'Failed to create team.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteError('');
    try {
      await deleteTeam(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      setDeleteError('Failed to delete team. Try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="team-name" className="text-xs font-black uppercase tracking-widest">
            New team
          </Label>
          <Input
            id="team-name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Fundraising 2026"
            className="rounded-xl border-2"
          />
        </div>
        <Button type="submit" disabled={isCreating} className="rounded-xl font-bold sm:h-10">
          {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Create team
        </Button>
      </form>
      {createError && (
        <Alert variant="destructive" className="mb-4 rounded-xl">
          <AlertDescription>{createError}</AlertDescription>
        </Alert>
      )}

      {teams.length === 0 ? (
        <p className="rounded-2xl border border-dashed bg-muted/20 p-8 text-center text-sm text-muted-foreground">
          No teams yet. Create a team above, then use CSV import to add bulk signatures.
        </p>
      ) : (
        <ul className="space-y-3">
          {teams.map((team) => (
            <li
              key={team.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-muted/20 px-4 py-4 sm:px-6"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold text-foreground">{team.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {team._count?.signatures ?? 0} signature
                    {(team._count?.signatures ?? 0) === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="secondary" className="rounded-lg text-[10px] font-bold uppercase">
                  CSV import
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-xl text-destructive hover:bg-destructive/10"
                  aria-label={`Delete team ${team.name}`}
                  onClick={() => setDeleteTarget(team)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete team?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes &quot;{deleteTarget?.name}&quot;. Signatures linked to this team are not
              deleted automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p className="text-sm font-medium text-destructive">{deleteError}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TeamsList;
