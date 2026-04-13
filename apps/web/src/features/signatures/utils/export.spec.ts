import { describe, it, expect, vi } from 'vitest';
import { exportSignatureToHtml } from './export';

describe('exportSignatureToHtml', () => {
  it('should render signature with standard template', () => {
    const signature = {
      name: 'John Test',
      email: 'john@test.com',
      templateId: 'standard',
    };
    
    const result = exportSignatureToHtml(signature);
    
    expect(result).toContain('John Test');
    expect(result).toContain('john@test.com');
    expect(result).toContain('font-family: Arial, sans-serif;');
  });

  it('should use standard template if templateId is missing', () => {
    const signature = {
      name: 'Fallback Test',
      email: 'fallback@test.com',
    };
    
    const result = exportSignatureToHtml(signature);
    expect(result).toContain('Fallback Test');
  });
});
