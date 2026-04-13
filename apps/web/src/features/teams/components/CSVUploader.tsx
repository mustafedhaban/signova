import React, { useState } from 'react';
import { useTeams } from '../hooks/useTeams';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Download, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const REQUIRED_HEADERS = ['name', 'email'];
const OPTIONAL_HEADERS = ['title', 'company', 'phone', 'mobile', 'website'];
const ALL_HEADERS = [...REQUIRED_HEADERS, ...OPTIONAL_HEADERS];

interface ParsedRow {
  index: number;
  data: Record<string, string>;
  errors: string[];
  valid: boolean;
}

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const parseCsv = (text: string): { rows: ParsedRow[]; headerErrors: string[] } => {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { rows: [], headerErrors: ['CSV must have a header row and at least one data row'] };

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
  const headerErrors: string[] = [];

  REQUIRED_HEADERS.forEach((h) => {
    if (!headers.includes(h)) headerErrors.push(`Missing required column: "${h}"`);
  });

  if (headerErrors.length) return { rows: [], headerErrors };

  const rows: ParsedRow[] = lines.slice(1).map((line, i) => {
    const values = line.split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
    const data: Record<string, string> = {};
    headers.forEach((h, idx) => { data[h] = values[idx] ?? ''; });

    const errors: string[] = [];
    if (!data.name?.trim()) errors.push('Name is required');
    if (!data.email?.trim()) errors.push('Email is required');
    else if (!validateEmail(data.email)) errors.push('Invalid email format');

    return { index: i + 2, data, errors, valid: errors.length === 0 };
  });

  return { rows, headerErrors: [] };
};

const downloadTemplate = () => {
  const csv = [
    ALL_HEADERS.join(','),
    'John Doe,john@example.com,CEO,Acme Inc,+1234567890,,https://example.com',
    'Jane Smith,jane@example.com,Designer,Acme Inc,+0987654321,,',
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'signature-import-template.csv';
  a.click();
  URL.revokeObjectURL(url);
};

const CSVUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [teamName, setTeamName] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [headerErrors, setHeaderErrors] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<{ count: number } | null>(null);
  const [uploadError, setUploadError] = useState('');
  const { createTeam, importCsv } = useTeams();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.name.endsWith('.csv')) {
      setHeaderErrors(['Please upload a .csv file']);
      return;
    }
    setFile(selected);
    setImportResult(null);
    setUploadError('');
    setParsedRows([]);
    setHeaderErrors([]);
    setShowPreview(false);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { rows, headerErrors: hErrs } = parseCsv(text);
      setHeaderErrors(hErrs);
      setParsedRows(rows);
      if (!hErrs.length && rows.length > 0) setShowPreview(true);
    };
    reader.readAsText(selected);
  };

  const validRows = parsedRows.filter((r) => r.valid);
  const invalidRows = parsedRows.filter((r) => !r.valid);

  const handleImport = async () => {
    if (!teamName.trim()) { setUploadError('Team name is required'); return; }
    if (validRows.length === 0) { setUploadError('No valid rows to import'); return; }

    setIsUploading(true);
    setUploadError('');
    try {
      const team = await createTeam({ name: teamName.trim() });
      const result = await importCsv({ teamId: team.id, members: validRows.map((r) => r.data) });
      setImportResult({ count: result.count ?? validRows.length });
      setFile(null);
      setTeamName('');
      setParsedRows([]);
      setShowPreview(false);
    } catch (e: any) {
      setUploadError(e.response?.data?.message || 'Import failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Bulk Import Signatures</h2>
        <Button variant="outline" size="sm" onClick={downloadTemplate}>
          <Download className="w-4 h-4 mr-1.5" /> Download Template
        </Button>
      </div>

      {/* Team name */}
      <div className="space-y-1.5">
        <Label>Team Name</Label>
        <Input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="e.g. Sales Department"
        />
      </div>

      {/* Drop zone */}
      <div className="relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center hover:border-blue-400 bg-muted/30 transition-colors">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
        {file ? (
          <p className="text-sm font-medium text-blue-600">{file.name}</p>
        ) : (
          <p className="text-sm text-muted-foreground">Click or drag a CSV file here</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Required: name, email — Optional: title, company, phone, mobile, website
        </p>
      </div>

      {/* Header errors */}
      {headerErrors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 space-y-1">
          {headerErrors.map((e, i) => (
            <div key={i} className="flex items-center text-sm text-destructive">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0" /> {e}
            </div>
          ))}
        </div>
      )}

      {/* Preview */}
      {showPreview && parsedRows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-sm">
              <Badge variant="blue">{validRows.length} valid</Badge>
              {invalidRows.length > 0 && (
                <Badge variant="destructive">{invalidRows.length} invalid</Badge>
              )}
              <span className="text-muted-foreground">{parsedRows.length} total rows</span>
            </div>
            <button onClick={() => setShowPreview(!showPreview)} className="text-xs text-muted-foreground hover:text-foreground flex items-center">
              <Eye className="w-3.5 h-3.5 mr-1" /> {showPreview ? 'Hide' : 'Show'} preview
            </button>
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">#</th>
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-left font-medium">Email</th>
                    <th className="px-3 py-2 text-left font-medium">Title</th>
                    <th className="px-3 py-2 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.map((row) => (
                    <tr key={row.index} className={`border-t ${row.valid ? '' : 'bg-destructive/5'}`}>
                      <td className="px-3 py-2 text-muted-foreground">{row.index}</td>
                      <td className="px-3 py-2">{row.data.name || <span className="text-destructive">—</span>}</td>
                      <td className="px-3 py-2">{row.data.email || <span className="text-destructive">—</span>}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.data.title || '—'}</td>
                      <td className="px-3 py-2">
                        {row.valid ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <span className="text-destructive" title={row.errors.join(', ')}>
                            <AlertCircle className="w-4 h-4" />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {invalidRows.length > 0 && (
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-md p-3 space-y-1">
              <p className="font-medium text-destructive">Row errors:</p>
              {invalidRows.map((row) => (
                <p key={row.index}>Row {row.index}: {row.errors.join(', ')}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload error */}
      {uploadError && (
        <div className="flex items-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          <AlertCircle className="w-4 h-4 mr-2" /> {uploadError}
        </div>
      )}

      {/* Success */}
      {importResult && (
        <div className="flex items-center text-sm text-green-600 bg-green-50 p-3 rounded-md">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Successfully imported {importResult.count} signature{importResult.count !== 1 ? 's' : ''}!
        </div>
      )}

      <Button
        variant="blue"
        className="w-full"
        onClick={handleImport}
        disabled={isUploading || validRows.length === 0 || !teamName.trim()}
      >
        {isUploading ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importing...</>
        ) : (
          <><FileText className="w-4 h-4 mr-2" /> Import {validRows.length > 0 ? `${validRows.length} Signatures` : 'Team'}</>
        )}
      </Button>
    </div>
  );
};

export default CSVUploader;
