const REQUIRED_HEADERS = ['name', 'email'] as const;
const OPTIONAL_HEADERS = ['title', 'company', 'phone', 'mobile', 'website'] as const;
export const CSV_HEADERS = [...REQUIRED_HEADERS, ...OPTIONAL_HEADERS];

export type ParsedCsvRow = {
  index: number;
  data: Record<string, string>;
  errors: string[];
  valid: boolean;
};

function detectDelimiter(headerLine: string): ',' | ';' | '\t' {
  const comma = (headerLine.match(/,/g) ?? []).length;
  const semi = (headerLine.match(/;/g) ?? []).length;
  const tab = (headerLine.match(/\t/g) ?? []).length;
  if (semi > comma && semi >= tab) return ';';
  if (tab > comma && tab >= semi) return '\t';
  return ',';
}

function parseCsvLine(line: string, delimiter: ',' | ';' | '\t'): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map((v) => v.replace(/^["']|["']$/g, '').trim());
}

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function parseSignatureCsv(text: string): {
  rows: ParsedCsvRow[];
  headerErrors: string[];
} {
  const normalized = text.replace(/^\uFEFF/, '').trim();
  const lines = normalized.split(/\r?\n/).filter((l) => l.trim());

  if (lines.length < 2) {
    return { rows: [], headerErrors: ['CSV must have a header row and at least one data row'] };
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseCsvLine(lines[0], delimiter).map((h) => h.toLowerCase());
  const headerErrors: string[] = [];

  for (const h of REQUIRED_HEADERS) {
    if (!headers.includes(h)) headerErrors.push(`Missing required column: "${h}"`);
  }

  if (headerErrors.length) return { rows: [], headerErrors };

  const rows: ParsedCsvRow[] = lines.slice(1).map((line, i) => {
    const values = parseCsvLine(line, delimiter);
    const data: Record<string, string> = {};
    headers.forEach((h, idx) => {
      data[h] = values[idx] ?? '';
    });

    const errors: string[] = [];
    if (!data.name?.trim()) errors.push('Name is required');
    if (!data.email?.trim()) errors.push('Email is required');
    else if (!validateEmail(data.email.trim())) errors.push('Invalid email format');

    return { index: i + 2, data, errors, valid: errors.length === 0 };
  });

  return { rows, headerErrors: [] };
}

export function buildTemplateCsv(): string {
  return [
    CSV_HEADERS.join(','),
    'John Doe,john@example.com,CEO,Acme Inc,+1234567890,,https://example.com',
    'Jane Smith,jane@example.com,Designer,Acme Inc,+0987654321,,',
  ].join('\n');
}
