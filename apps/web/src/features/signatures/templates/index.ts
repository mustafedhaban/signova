import StandardTemplate from './StandardTemplate';
import ModernTemplate from './ModernTemplate';
import CorporateTemplate from './CorporateTemplate';
import CreativeTemplate from './CreativeTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import TechTemplate from './TechTemplate';
import { frittTemplates, FRITT_CATEGORY_LABELS } from './fritt/catalog';

export type { ITemplate } from './types';
export { FRITT_CATEGORY_LABELS };

import type { ITemplate } from './types';

const coreTemplates: ITemplate[] = [
  { id: 'standard',  name: 'Professional Classic', description: 'Refined side-by-side layout with Indigo accents',     category: 'professional',    component: StandardTemplate  },
  { id: 'modern',    name: 'Modern Minimal',        description: 'Ultra-clean design with bold asymmetric bars',      category: 'modern',       component: ModernTemplate    },
  { id: 'corporate', name: 'Corporate Bold',        description: 'High-impact Slate panel with structured geometry',  category: 'corporate',    component: CorporateTemplate },
  { id: 'creative',  name: 'Creative Colorful',     description: 'Playful circular branding with soft Indigo tones',  category: 'creative',     component: CreativeTemplate  },
  { id: 'executive', name: 'Executive Formal',      description: 'Elegant serif typography with minimalist dividers', category: 'executive',    component: ExecutiveTemplate },
  { id: 'tech',      name: 'Tech Startup',          description: 'Sleek terminal-inspired design with code syntax',  category: 'tech',         component: TechTemplate      },
];

export const templates: ITemplate[] = [...coreTemplates, ...frittTemplates];

export const getTemplateById = (id: string) =>
  templates.find((t) => t.id === id) ?? templates[0];

export function getCategoryLabel(category: string): string {
  return FRITT_CATEGORY_LABELS[category] ?? category.replace(/-/g, ' ');
}
