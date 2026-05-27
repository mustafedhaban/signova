import { ITemplate } from '../types';
import {
  FrittPhoto01,
  FrittPhoto02,
  FrittPhoto03,
  FrittPhoto04,
  FrittPhoto05,
  FrittPhoto06,
  FrittPhoto07,
} from './with-photo';
import {
  FrittBox01,
  FrittBox02,
  FrittBox03,
  FrittBox04,
  FrittBox05,
  FrittBox06,
} from './boxed';
import { FrittMin01, FrittMin02, FrittMin03, FrittMin04 } from './minimal';
import { FrittCenter01, FrittCenter02, FrittCenter03 } from './centered';

/** 20 corporate signatures from CorporateTemplates.png reference sheet */
export const frittTemplates: ITemplate[] = [
  // With photo / logo block (7)
  {
    id: 'fritt-photo-01',
    name: 'Classic Red Block',
    description: 'Logo left, name beside red divider, address and social below',
    category: 'with-photo',
    tags: ['corporate', 'logo', 'red'],
    component: FrittPhoto01,
  },
  {
    id: 'fritt-photo-02',
    name: 'Split Contact Grid',
    description: 'Logo left, two-column phone and social under address',
    category: 'with-photo',
    tags: ['corporate', 'grid'],
    component: FrittPhoto02,
  },
  {
    id: 'fritt-photo-03',
    name: 'Compact Grid',
    description: 'Tighter logo layout with contact and social columns',
    category: 'with-photo',
    tags: ['corporate', 'compact'],
    component: FrittPhoto03,
  },
  {
    id: 'fritt-photo-04',
    name: 'Inline Title Bar',
    description: 'Name and title on one row with grey separator',
    category: 'with-photo',
    tags: ['corporate', 'inline'],
    component: FrittPhoto04,
  },
  {
    id: 'fritt-photo-05',
    name: 'Vertical Social',
    description: 'Logo left, stacked address and vertical social icons',
    category: 'with-photo',
    tags: ['corporate', 'social'],
    component: FrittPhoto05,
  },
  {
    id: 'fritt-photo-06',
    name: 'Title Badge',
    description: 'Bold name with red title badge on white',
    category: 'with-photo',
    tags: ['corporate', 'badge'],
    component: FrittPhoto06,
  },
  {
    id: 'fritt-photo-07',
    name: 'Stacked Classic',
    description: 'Logo left, single-column stacked contact lines',
    category: 'with-photo',
    tags: ['corporate', 'stacked'],
    component: FrittPhoto07,
  },

  // Boxed (6)
  {
    id: 'fritt-box-01',
    name: 'Grey Panel Solid',
    description: 'Header row plus solid grey contact panel',
    category: 'boxed',
    tags: ['corporate', 'panel'],
    component: FrittBox01,
  },
  {
    id: 'fritt-box-02',
    name: 'Grey Panel Split',
    description: 'Split contact and social inside grey fill',
    category: 'boxed',
    tags: ['corporate', 'panel'],
    component: FrittBox02,
  },
  {
    id: 'fritt-box-03',
    name: 'Grey Panel Border',
    description: 'Bordered grey box with two-column details',
    category: 'boxed',
    tags: ['corporate', 'border'],
    component: FrittBox03,
  },
  {
    id: 'fritt-box-04',
    name: 'Bordered Compact',
    description: 'Bordered panel with phone, web, and social',
    category: 'boxed',
    tags: ['corporate', 'border'],
    component: FrittBox04,
  },
  {
    id: 'fritt-box-05',
    name: 'Header + Footer Bar',
    description: 'Name left, contact box right, full-width address bar',
    category: 'boxed',
    tags: ['corporate', 'footer'],
    component: FrittBox05,
  },
  {
    id: 'fritt-box-06',
    name: 'Header + Footer Outline',
    description: 'Outlined contact box and bordered address strip',
    category: 'boxed',
    tags: ['corporate', 'footer'],
    component: FrittBox06,
  },

  // Minimal (4)
  {
    id: 'fritt-min-01',
    name: 'Divider Columns',
    description: 'Name left, red rule, address right — no logo',
    category: 'minimal',
    tags: ['minimal', 'clean'],
    component: FrittMin01,
  },
  {
    id: 'fritt-min-02',
    name: 'Contact Columns',
    description: 'Name and address left, phones right, social below',
    category: 'minimal',
    tags: ['minimal', 'columns'],
    component: FrittMin02,
  },
  {
    id: 'fritt-min-03',
    name: 'Horizontal Rule',
    description: 'Split header, divider line, address and social footer',
    category: 'minimal',
    tags: ['minimal', 'rule'],
    component: FrittMin03,
  },
  {
    id: 'fritt-min-04',
    name: 'Simple Stack',
    description: 'Clean left-aligned stack — typography only',
    category: 'minimal',
    tags: ['minimal', 'simple'],
    component: FrittMin04,
  },

  // Centered (3)
  {
    id: 'fritt-center-01',
    name: 'Centered Classic',
    description: 'Centered name, social, rule, then contact block',
    category: 'centered',
    tags: ['centered', 'formal'],
    component: FrittCenter01,
  },
  {
    id: 'fritt-center-02',
    name: 'Centered Split',
    description: 'Centered header, rule, web and social at bottom',
    category: 'centered',
    tags: ['centered', 'social'],
    component: FrittCenter02,
  },
  {
    id: 'fritt-center-03',
    name: 'Centered Full',
    description: 'Fully centered lines for all details',
    category: 'centered',
    tags: ['centered', 'symmetric'],
    component: FrittCenter03,
  },
];

export const FRITT_CATEGORY_LABELS: Record<string, string> = {
  'with-photo': 'With photo',
  boxed: 'Boxed',
  minimal: 'Minimal',
  centered: 'Centered',
};
