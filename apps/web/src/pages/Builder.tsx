import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSignatures } from '@/features/signatures/hooks/useSignatures';
import { templates, getTemplateById, ITemplate } from '@/features/signatures/templates';
import TemplateThumbnail from '@/features/signatures/components/TemplateThumbnail';
import { ArrowLeft, Save, CheckCircle2, Copy, Download } from 'lucide-react';
import axios from 'axios';
import { exportSignatureToHtml, downloadSignatureAsHtml } from '@/features/signatures/utils/export';
import SocialLinksEditor from '@/features/signatures/components/SocialLinksEditor';

// Derive all unique categories from the templates list
const ALL_CATEGORIES = ['all', ...Array.from(new Set(templates.map((t) => t.category)))];

interface TemplatePickerProps {
  templates: ITemplate[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const TemplatePicker: React.FC<TemplatePickerProps> = ({ templates, selectedId, onSelect }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(templates.flatMap((t) => t.tags)));

  const filtered = templates.filter((t) => {
    const categoryMatch = activeCategory === 'all' || t.category === activeCategory;
    const tagMatch = !activeTag || t.tags.includes(activeTag);
    return categoryMatch && tagMatch;
  });

  return (
    <div className="space-y-3">
      {/* Category filter */}
      <div className="flex flex-wrap gap-1">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => { setActiveCategory(cat); setActiveTag(null); }}
            className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize transition-colors ${
              activeCategory === cat && !activeTag
                ? 'bg-blue-600 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-1">
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`px-2 py-0.5 rounded-full text-xs capitalize transition-colors ${
              activeTag === tag
                ? 'bg-violet-600 text-white'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.length > 0 ? (
          filtered.map((t) => (
            <TemplateThumbnail
              key={t.id}
              template={t}
              selected={selectedId === t.id}
              onClick={() => onSelect(t.id)}
            />
          ))
        ) : (
          <p className="col-span-2 text-xs text-muted-foreground text-center py-4">No templates match this filter.</p>
        )}
      </div>
    </div>
  );
};

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  logoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  templateId: z.string(),
  primaryColor: z.string().optional(),
  fontFamily: z.string().optional(),
  socialLinks: z.array(z.object({
    platform: z.enum(['linkedin', 'twitter', 'facebook', 'instagram', 'github']),
    url: z.string().url('Invalid URL'),
  })).optional(),
});

type FormData = z.infer<typeof schema>;

const Builder: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { signatures, createSignature } = useSignatures();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    const html = exportSignatureToHtml(watchedData as any);
    const blob = new Blob([html], { type: 'text/html' });
    const item = new ClipboardItem({ 'text/html': blob });
    await navigator.clipboard.write([item]);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const { register, control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      mobile: '',
      website: '',
      logoUrl: '',
      templateId: 'standard',
      primaryColor: '#2563EB',
      fontFamily: 'Arial',
      socialLinks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  });

  const watchedData = watch();
  const currentTemplate = getTemplateById(watchedData.templateId);

  useEffect(() => {
    if (id && id !== 'new') {
      const signature = signatures.find((s) => s.id === id);
      if (signature) {
        reset({
          name: signature.name,
          title: signature.title,
          company: signature.company,
          email: signature.email,
          phone: signature.phone,
          mobile: signature.mobile,
          website: signature.website,
          logoUrl: signature.logoUrl,
          templateId: signature.templateId,
          primaryColor: (signature as any).primaryColor ?? '#2563EB',
          fontFamily: (signature as any).fontFamily ?? 'Arial',
          socialLinks: signature.socialLinks as any,
        });
      }
    }
  }, [id, signatures, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      if (id === 'new') {
        await createSignature(data as any);
      } else {
        await axios.patch(`http://localhost:3000/api/v1/signatures/${id}`, data);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      navigate('/');
    } catch (error) {
      console.error('Error saving signature:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b bg-card">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Signature Builder</h1>
        </div>
        <div className="flex items-center space-x-4">
          {saveSuccess && (
            <div className="flex items-center text-green-600 animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              <span>Saved successfully!</span>
            </div>
          )}
          {copySuccess && (
            <div className="flex items-center text-green-600 animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              <span>Copied! Paste into Gmail.</span>
            </div>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center px-4 py-2 space-x-2 border rounded-md hover:bg-muted"
          >
            <Copy className="w-5 h-5" />
            <span>Copy Signature</span>
          </button>
          <button
            onClick={() => downloadSignatureAsHtml(watchedData as any, `${watchedData.name || 'signature'}.html`)}
            className="flex items-center px-4 py-2 space-x-2 border rounded-md hover:bg-muted"
          >
            <Download className="w-5 h-5" />
            <span>Download HTML</span>
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{isSaving ? 'Saving...' : 'Save Signature'}</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Form */}
        <aside className="w-1/3 overflow-y-auto border-r bg-card p-6 space-y-8">
          {/* Personal Info */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Personal Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input {...register('name')} className="w-full p-2 border rounded-md" placeholder="John Doe" />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input {...register('title')} className="w-full p-2 border rounded-md" placeholder="CEO" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <input {...register('company')} className="w-full p-2 border rounded-md" placeholder="Acme Inc." />
                </div>
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Contact Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input {...register('email')} className="w-full p-2 border rounded-md" placeholder="john@example.com" />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input {...register('phone')} className="w-full p-2 border rounded-md" placeholder="+1 234 567 890" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mobile</label>
                  <input {...register('mobile')} className="w-full p-2 border rounded-md" placeholder="+1 098 765 432" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <input {...register('website')} className="w-full p-2 border rounded-md" placeholder="https://example.com" />
                {errors.website && <p className="text-xs text-destructive mt-1">{errors.website.message}</p>}
              </div>
            </div>
          </section>

          {/* Logo */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Branding</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Logo URL</label>
              <input {...register('logoUrl')} className="w-full p-2 border rounded-md" placeholder="https://example.com/logo.png" />
              {errors.logoUrl && <p className="text-xs text-destructive mt-1">{errors.logoUrl.message}</p>}
            </div>
          </section>

          {/* Social Links */}
          <SocialLinksEditor
            fields={fields}
            register={register}
            remove={remove}
            append={append}
            errors={errors}
          />

          {/* Template Selection */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Template</h3>
            <TemplatePicker
              templates={templates}
              selectedId={watchedData.templateId}
              onSelect={(id) => setValue('templateId', id)}
            />
          </section>

          {/* Customization */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Customize</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    {...register('primaryColor')}
                    className="w-10 h-10 rounded cursor-pointer border p-0.5"
                  />
                  <input
                    type="text"
                    value={watchedData.primaryColor ?? '#2563EB'}
                    onChange={(e) => setValue('primaryColor', e.target.value)}
                    className="flex-1 p-2 border rounded-md text-sm font-mono"
                    placeholder="#2563EB"
                  />
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {['#2563EB','#7C3AED','#DC2626','#059669','#D97706','#0F172A','#B8860B','#EC4899'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setValue('primaryColor', c)}
                      className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                      style={{ backgroundColor: c, borderColor: watchedData.primaryColor === c ? '#000' : 'transparent' }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Font</label>
                <select
                  {...register('fontFamily')}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="Arial">Arial (Default)</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option value="'Courier New', monospace">Courier New</option>
                </select>
              </div>
            </div>
          </section>
        </aside>

        {/* Main Content - Preview */}
        <main className="flex-1 bg-muted p-12 overflow-y-auto flex flex-col items-center">
          <div className="w-full max-w-2xl bg-white p-12 shadow-xl rounded-sm border min-h-[300px] flex items-center justify-center">
            {currentTemplate && <currentTemplate.component data={watchedData as any} />}
          </div>
          <div className="mt-8 text-center text-muted-foreground text-sm">
            <p>This is a live preview of how your signature will appear in emails.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Builder;
