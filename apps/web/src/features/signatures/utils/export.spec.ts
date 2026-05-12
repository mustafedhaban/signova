import { describe, it, expect } from 'vitest';
import { exportSignatureToHtml } from './export';
import { ISignature } from '@signova/types';

describe('exportSignatureToHtml', () => {
  it('should render signature with standard template', () => {
    const signature: Partial<ISignature> = {
      name: 'John Test',
      email: 'john@test.com',
      templateId: 'standard',
    };
    
    const result = exportSignatureToHtml(signature as ISignature);
    
    expect(result).toContain('John Test');
    expect(result).toContain('john@test.com');
    expect(result).toContain('font-family: Arial, sans-serif;');
  });

  it('should use standard template if templateId is missing', () => {
    const signature: Partial<ISignature> = {
      name: 'Fallback Test',
      email: 'fallback@test.com',
    };
    
    const result = exportSignatureToHtml(signature as ISignature);
    expect(result).toContain('Fallback Test');
  });
});
