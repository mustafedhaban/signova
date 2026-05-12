import React, { useState } from 'react';
import { useTeams } from '../hooks/useTeams';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card className="shadow-soft border-2 overflow-hidden">
      <CardHeader className="border-b border-border/50 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Bulk Import Signatures</CardTitle>
            <CardDescription>Upload a CSV file to create multiple signatures at once</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={downloadTemplate} className="rounded-xl font-bold border-2">
            <Download className="w-4 h-4 mr-2" /> Template
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Team name */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Team Name</Label>
          <Input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="e.g. Sales Department"
            className="bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl h-11 font-medium transition-all"
          />
        </div>

        {/* Drop zone */}
        <div className="relative group">
          <div className="border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center bg-muted/20 group-hover:bg-muted/40 group-hover:border-primary/40 transition-all duration-300">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-7 h-7 text-primary" />
            </div>
            {file ? (
              <p className="text-sm font-bold text-primary">{file.name}</p>
            ) : (
              <p className="text-sm font-medium text-muted-foreground text-center">
                Click or drag a CSV file here to upload
              </p>
            )}
            <p className="text-[10px] font-bold text-muted-foreground mt-3 uppercase tracking-wider text-center max-w-[280px]">
              Required: name, email <br/> Optional: title, company, phone, mobile, website
            </p>
          </div>
        </div>

        {/* Header errors */}
        {headerErrors.length > 0 && (
          <Alert variant="destructive" className="rounded-2xl border-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-bold">Header Errors</AlertTitle>
            <AlertDescription className="text-xs font-medium">
              {headerErrors.map((e, i) => (
                <div key={i} className="mt-1 flex items-center">
                  <span className="w-1 h-1 bg-destructive rounded-full mr-2" /> {e}
                </div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* Preview */}
        {showPreview && parsedRows.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="rounded-lg text-[10px] font-bold px-2 py-0.5 border-2 uppercase tracking-widest bg-green-50 text-green-700 border-green-200">
                  {validRows.length} valid
                </Badge>
                {invalidRows.length > 0 && (
                  <Badge variant="destructive" className="rounded-lg text-[10px] font-bold px-2 py-0.5 border-2 uppercase tracking-widest">
                    {invalidRows.length} invalid
                  </Badge>
                )}
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{parsedRows.length} total</span>
              </div>
              <button 
                onClick={() => setShowPreview(!showPreview)} 
                className="text-[10px] font-bold text-muted-foreground hover:text-primary flex items-center uppercase tracking-widest transition-colors"
              >
                <Eye className="w-3.5 h-3.5 mr-1.5" /> {showPreview ? 'Hide' : 'Show'} preview
              </button>
            </div>

            <div className="border-2 rounded-2xl overflow-hidden bg-background">
              <ScrollArea className="h-64">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 border-b-2">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-muted-foreground uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left font-bold text-muted-foreground uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left font-bold text-muted-foreground uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left font-bold text-muted-foreground uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-center font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-t-0">
                    {parsedRows.map((row) => (
                      <tr key={row.index} className={`transition-colors hover:bg-muted/30 ${row.valid ? '' : 'bg-destructive/5'}`}>
                        <td className="px-4 py-3 font-medium text-muted-foreground/60">{row.index}</td>
                        <td className="px-4 py-3 font-bold">{row.data.name || <span className="text-destructive">MISSING</span>}</td>
                        <td className="px-4 py-3 font-medium">{row.data.email || <span className="text-destructive">MISSING</span>}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.data.title || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            {row.valid ? (
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-destructive/10 rounded-full flex items-center justify-center" title={row.errors.join(', ')}>
                                <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </div>

            {invalidRows.length > 0 && (
              <Alert variant="destructive" className="rounded-2xl border-2 bg-destructive/[0.02]">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-bold">Row Errors</AlertTitle>
                <AlertDescription className="text-[10px] font-bold space-y-1">
                  {invalidRows.map((row) => (
                    <div key={row.index}>Row {row.index}: {row.errors.join(', ')}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Upload error */}
        {uploadError && (
          <Alert variant="destructive" className="rounded-2xl border-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-bold">Upload Failed</AlertTitle>
            <AlertDescription className="text-xs font-medium">{uploadError}</AlertDescription>
          </Alert>
        )}

        {/* Success */}
        {importResult && (
          <Alert className="rounded-2xl border-2 border-green-200 bg-green-50 text-green-700">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="font-bold">Import Successful</AlertTitle>
            <AlertDescription className="text-xs font-medium">
              Successfully imported {importResult.count} signature{importResult.count !== 1 ? 's' : ''}!
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleImport}
          disabled={isUploading || validRows.length === 0 || !teamName.trim()}
          className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-95"
        >
          {isUploading ? (
            <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Importing Members...</>
          ) : (
            <><FileText className="w-5 h-5 mr-3" /> Import {validRows.length > 0 ? `${validRows.length} Signatures` : 'Signatures'}</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CSVUploader;
