import React, { useState } from 'react';
import { useTeams, type TeamWithCount } from '../hooks/useTeams';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
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
import { toast } from '@/lib/toast';

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
      toast.success(`Team "${name}" created`);
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
      toast.success(`Team "${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
    } catch {
      setDeleteError('Failed to delete team. Try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-8 animate-spin text-primary" aria-label="Loading teams" />
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleCreate} className="mb-6">
        <FieldGroup className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Field className="min-w-0 flex-1">
            <FieldLabel htmlFor="team-name">New team</FieldLabel>
            <Input
              id="team-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Fundraising 2026"
              className="h-10"
            />
          </Field>
          <Button type="submit" disabled={isCreating} className="w-full sm:w-auto sm:shrink-0">
            {isCreating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            Create team
          </Button>
        </FieldGroup>
      </form>
      {createError ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{createError}</AlertDescription>
        </Alert>
      ) : null}

      {teams.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
          No teams yet. Create a team above, then use CSV import to add bulk signatures.
        </p>
      ) : (
        <ul className="space-y-2">
          {teams.map((team) => (
            <li
              key={team.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-border/80 bg-card px-4 py-3 transition-colors hover:bg-muted/30 sm:px-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="size-5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{team.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {team._count?.signatures ?? 0} signature
                    {(team._count?.signatures ?? 0) === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="secondary" className="hidden font-normal sm:inline-flex">
                  CSV import
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Delete team ${team.name}`}
                  onClick={() => setDeleteTarget(team)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete team?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes &quot;{deleteTarget?.name}&quot;. Signatures linked to this team are not
              deleted automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError ? (
            <p className="text-sm font-medium text-destructive">{deleteError}</p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
