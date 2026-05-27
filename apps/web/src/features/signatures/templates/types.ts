import React from 'react';
import { ISignature } from '@signova/types';

export interface ITemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags?: string[];
  component: React.FC<{ data: Partial<ISignature> }>;
}
