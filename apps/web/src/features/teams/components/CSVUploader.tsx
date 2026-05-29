import React, { useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeams } from '../hooks/useTeams';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Download,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { buildTemplateCsv, parseSignatureCsv, type ParsedCsvRow } from '../utils/parse-csv';
import { toast, toastApiError } from '@/lib/toast';

type TeamMode = 'new' | 'existing';

const downloadTemplate = () => {
  const blob = new Blob([buildTemplateCsv()], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'signature-import-template.csv';
  a.click();
  URL.revokeObjectURL(url);
};

const CSVUploader: React.FC = () => {
  const navigate = useNavigate();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [teamMode, setTeamMode] = useState<TeamMode>('new');
  const [teamName, setTeamName] = useState('');
  const [existingTeamId, setExistingTeamId] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedCsvRow[]>([]);
  const [headerErrors, setHeaderErrors] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<{ count: number } | null>(null);
  const { teams, createTeam, importCsv } = useTeams();

  const validRows = parsedRows.filter((r) => r.valid);
  const invalidRows = parsedRows.filter((r) => !r.valid);

  const teamReady =
    teamMode === 'new' ? teamName.trim().length > 0 : Boolean(existingTeamId);

  const canImport = teamReady && validRows.length > 0 && !isUploading;

  const importBlockedReason = (() => {
    if (isUploading) return null;
    if (!file) return 'Upload a CSV file first';
    if (headerErrors.length) return headerErrors[0];
    if (validRows.length === 0) {
      return parsedRows.length
        ? 'Fix invalid rows in your CSV (see preview)'
        : 'No data rows found in the CSV';
    }
    if (teamMode === 'new' && !teamName.trim()) return 'Enter a team name or pick an existing team';
    if (teamMode === 'existing' && !existingTeamId) {
      return teams.length === 0
        ? 'Create a team below first, or switch to “New team”'
        : 'Select a team to import into';
    }
    return null;
  })();

  const resetFileState = () => {
    setFile(null);
    setParsedRows([]);
    setHeaderErrors([]);
    setPreviewOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith('.csv')) {
      setHeaderErrors(['Please upload a .csv file']);
      resetFileState();
      return;
    }

    setFile(selected);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { rows, headerErrors: hErrs } = parseSignatureCsv(text);
      setHeaderErrors(hErrs);
      setParsedRows(rows);
      setPreviewOpen(!hErrs.length && rows.length > 0);

      if (hErrs.length) {
        toast.error(hErrs[0]);
      } else if (rows.length === 0) {
        toast.error('No data rows found in CSV');
      } else {
        const valid = rows.filter((r) => r.valid).length;
        toast.success(`Parsed ${valid} valid row${valid === 1 ? '' : 's'}`);
      }
    };
    reader.onerror = () => {
      toast.error('Could not read the file');
      resetFileState();
    };
    reader.readAsText(selected);
  };

  const handleImport = async () => {
    if (!canImport) {
      if (importBlockedReason) toast.error(importBlockedReason);
      return;
    }

    setIsUploading(true);
    try {
      let teamId = existingTeamId;
      if (teamMode === 'new') {
        const team = await createTeam({ name: teamName.trim() });
        teamId = team.id;
      }

      const result = await importCsv({
        teamId,
        members: validRows.map((r) => r.data),
      });

      const count = result.count ?? validRows.length;
      setImportResult({ count });
      toast.success(`Imported ${count} signature${count === 1 ? '' : 's'}. View them under Signatures.`);

      resetFileState();
      setTeamName('');
      setExistingTeamId('');
      setTeamMode('new');

      navigate(`/?tab=signatures`);
    } catch (e: unknown) {
      toastApiError(e, 'Import failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="overflow-hidden border shadow-soft">
      <CardHeader className="border-b border-border/50 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold">Bulk import signatures</CardTitle>
            <CardDescription>
              Upload a CSV to create multiple signatures for a team at once
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" type="button" onClick={downloadTemplate}>
            <Download className="size-4" />
            Template
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <FieldGroup>
          <Field>
            <FieldLabel>Import into</FieldLabel>
            <Select
              value={teamMode}
              onValueChange={(v) => {
                setTeamMode((v as TeamMode) ?? 'new');
                setImportResult(null);
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New team</SelectItem>
                <SelectItem value="existing">Existing team</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {teamMode === 'new' ? (
            <Field>
              <FieldLabel htmlFor="import-team-name">Team name</FieldLabel>
              <Input
                id="import-team-name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Sales Department"
                className="h-10"
              />
            </Field>
          ) : (
            <Field>
              <FieldLabel>Team</FieldLabel>
              {teams.length === 0 ? (
                <FieldDescription>
                  No teams yet — create one in the list below, or switch to “New team”.
                </FieldDescription>
              ) : (
                <Select
                  value={existingTeamId}
                  onValueChange={(v) => setExistingTeamId(v ?? '')}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                        {(team._count?.signatures ?? 0) > 0
                          ? ` (${team._count?.signatures} signatures)`
                          : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
          )}
        </FieldGroup>

        <div className="space-y-2">
          <Label htmlFor={fileInputId} className="text-sm font-medium">
            CSV file
          </Label>
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-8">
            <input
              ref={fileInputRef}
              id={fileInputId}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="sr-only"
            />
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Upload className="size-6" aria-hidden />
            </div>
            {file ? (
              <p className="text-sm font-medium text-primary">{file.name}</p>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Choose a .csv file with columns: name, email (plus optional fields)
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? 'Change file' : 'Browse files'}
            </Button>
          </div>
        </div>

        {headerErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>CSV format issue</AlertTitle>
            <AlertDescription>
              <ul className="mt-1 list-inside list-disc text-sm">
                {headerErrors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {parsedRows.length > 0 && !headerErrors.length && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-normal">
                  {validRows.length} valid
                </Badge>
                {invalidRows.length > 0 && (
                  <Badge variant="destructive" className="font-normal">
                    {invalidRows.length} invalid
                  </Badge>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen((v) => !v)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Eye className="size-3.5" />
                {previewOpen ? 'Hide preview' : 'Show preview'}
              </button>
            </div>

            {previewOpen ? (
            <div className="overflow-hidden rounded-xl border">
              <ScrollArea className="h-56">
                <table className="w-full text-xs">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">#</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Name</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Email</th>
                      <th className="px-3 py-2 text-center font-medium text-muted-foreground">
                        OK
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {parsedRows.map((row) => (
                      <tr
                        key={row.index}
                        className={row.valid ? '' : 'bg-destructive/5'}
                      >
                        <td className="px-3 py-2 text-muted-foreground">{row.index}</td>
                        <td className="px-3 py-2 font-medium">{row.data.name || '—'}</td>
                        <td className="px-3 py-2">{row.data.email || '—'}</td>
                        <td className="px-3 py-2 text-center">
                          {row.valid ? (
                            <CheckCircle2 className="inline size-4 text-success" />
                          ) : (
                            <span title={row.errors.join(', ')}>
                              <AlertCircle className="inline size-4 text-destructive" />
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </div>
            ) : null}

            {invalidRows.length > 0 && (
              <Alert variant="destructive">
                <AlertDescription className="text-xs">
                  {invalidRows.slice(0, 5).map((row) => (
                    <div key={row.index}>
                      Row {row.index}: {row.errors.join(', ')}
                    </div>
                  ))}
                  {invalidRows.length > 5 ? (
                    <div className="mt-1">…and {invalidRows.length - 5} more</div>
                  ) : null}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {importResult && (
          <Alert className="border-success/30 bg-success/10 text-success">
            <CheckCircle2 className="size-4" />
            <AlertTitle>Import complete</AlertTitle>
            <AlertDescription>
              {importResult.count} signature{importResult.count === 1 ? '' : 's'} created. Check
              the Signatures tab in the sidebar.
            </AlertDescription>
          </Alert>
        )}

        {importBlockedReason && !isUploading && file && (
          <p className="text-center text-sm text-muted-foreground">{importBlockedReason}</p>
        )}

        <Button
          type="button"
          onClick={handleImport}
          disabled={!canImport}
          className="w-full"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Importing…
            </>
          ) : (
            <>
              <FileText className="size-4" />
              Import {validRows.length > 0 ? `${validRows.length} signatures` : 'signatures'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CSVUploader;
