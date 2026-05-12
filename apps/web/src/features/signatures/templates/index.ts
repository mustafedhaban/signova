import React from 'react';
import StandardTemplate from './StandardTemplate';
import ModernTemplate from './ModernTemplate';
import CorporateTemplate from './CorporateTemplate';
import CreativeTemplate from './CreativeTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import TechTemplate from './TechTemplate';
import { ISignature } from '@signova/types';

export interface ITemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  component: React.FC<{ data: Partial<ISignature> }>;
}

export const templates: ITemplate[] = [
  { id: 'standard',  name: 'Professional Classic', description: 'Refined side-by-side layout with Indigo accents',     category: 'professional', tags: ['classic', 'formal', 'ngo'],    component: StandardTemplate  },
  { id: 'modern',    name: 'Modern Minimal',        description: 'Ultra-clean design with bold asymmetric bars',      category: 'modern',       tags: ['minimal', 'clean', 'modern'],  component: ModernTemplate    },
  { id: 'corporate', name: 'Corporate Bold',        description: 'High-impact Slate panel with structured geometry',  category: 'corporate',    tags: ['bold', 'corporate', 'formal'], component: CorporateTemplate },
  { id: 'creative',  name: 'Creative Colorful',     description: 'Playful circular branding with soft Indigo tones',  category: 'creative',     tags: ['colorful', 'creative', 'ngo'], component: CreativeTemplate  },
  { id: 'executive', name: 'Executive Formal',      description: 'Elegant serif typography with minimalist dividers', category: 'executive',    tags: ['formal', 'executive', 'ngo'],  component: ExecutiveTemplate },
  { id: 'tech',      name: 'Tech Startup',          description: 'Sleek terminal-inspired design with code syntax',  category: 'tech',         tags: ['tech', 'startup', 'modern'],   component: TechTemplate      },
];

export const getTemplateById = (id: string) =>
  templates.find((t) => t.id === id) ?? templates[0];
