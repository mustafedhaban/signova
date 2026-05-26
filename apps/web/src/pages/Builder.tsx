import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Copy, 
  CheckCircle2, 
  Palette, 
  Layout, 
  User, 
  Mail, 
  Building2,
  Loader2
} from 'lucide-react';
import { useSignatures } from '@/features/signatures/hooks/useSignatures';
import { useOrganizations } from '@/features/organizations/hooks/useOrganizations';
import { templates, getTemplateById, ITemplate } from '@/features/signatures/templates';
import TemplateThumbnail from '@/features/signatures/components/TemplateThumbnail';
import SocialLinksEditor from '@/features/signatures/components/SocialLinksEditor';
import { exportSignatureToHtml, downloadSignatureAsHtml } from '@/features/signatures/utils/export';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toSignatureApiPayload } from '@/features/signatures/utils/api-payload';

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
    <div className="space-y-6">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat && !activeTag ? 'default' : 'secondary'}
            size="sm"
            onClick={() => { setActiveCategory(cat); setActiveTag(null); }}
            className="rounded-xl text-[10px] font-bold uppercase tracking-widest h-8 px-4"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <Button
            key={tag}
            variant={activeTag === tag ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className="rounded-xl text-[10px] font-bold uppercase tracking-widest h-8 px-4"
          >
            #{tag}
          </Button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-4">
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
          <p className="col-span-2 text-xs text-muted-foreground text-center py-8 bg-muted/20 rounded-2xl border-2 border-dashed">
            No templates match this filter.
          </p>
        )}
      </div>
    </div>
  );
};

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().optional(),
  company: z.string().optional(),
  department: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  website: z.string().url('Invalid URL').or(z.literal('')).optional(),
  logoUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  templateId: z.string(),
  organizationId: z.string().optional(),
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
  const [searchParams] = useSearchParams();
  const { signatures, createSignature } = useSignatures();
  const { organizations } = useOrganizations();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const handleCopy = async () => {
    const html = exportSignatureToHtml(watchedData as any);
    const blob = new Blob([html], { type: 'text/html' });
    await navigator.clipboard.write([new ClipboardItem({ 'text/html': blob })]);
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
      organizationId: '',
      primaryColor: '#6366f1',
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

  // Set default organization if none selected and orgs available
  useEffect(() => {
    if (organizations.length > 0 && !watchedData.organizationId && id === 'new') {
      const firstOrg = organizations[0];
      setValue('organizationId', firstOrg.id);
      if (!watchedData.company) {
        setValue('company', firstOrg.name);
      }
    }
  }, [organizations, watchedData.organizationId, watchedData.company, setValue, id]);

  // Update company name and branding when organization changes
  useEffect(() => {
    if (watchedData.organizationId) {
      const selectedOrg = organizations.find(o => o.id === watchedData.organizationId);
      if (selectedOrg) {
        if (!watchedData.company) {
          setValue('company', selectedOrg.name);
        }
        if (!watchedData.logoUrl && selectedOrg.logoUrl) {
          setValue('logoUrl', selectedOrg.logoUrl);
        }
        if (selectedOrg.primaryColor) {
          setValue('primaryColor', selectedOrg.primaryColor);
        }
        if (selectedOrg.fontFamily) {
          setValue('fontFamily', selectedOrg.fontFamily);
        }
      }
    }
  }, [watchedData.organizationId, organizations, setValue, watchedData.company, watchedData.logoUrl]);

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
          organizationId: (signature as any).organizationId ?? '',
          primaryColor: (signature as any).primaryColor ?? '#6366f1',
          fontFamily: (signature as any).fontFamily ?? 'Arial',
          socialLinks: signature.socialLinks as any,
        });
      }
    }
  }, [id, signatures, reset]);

  // Prefill from share token (?prefill=<token>)
  useEffect(() => {
    const token = searchParams.get('prefill');
    if (!token || id !== 'new') return;
    try {
      const json = atob(token.replace(/-/g, '+').replace(/_/g, '/'));
      const data = JSON.parse(json);
      reset({
        name: data.name ?? '',
        title: data.title ?? '',
        company: data.company ?? '',
        email: data.email ?? '',
        phone: data.phone ?? '',
        mobile: data.mobile ?? '',
        website: data.website ?? '',
        logoUrl: data.logoUrl ?? '',
        templateId: data.templateId ?? 'standard',
        primaryColor: data.primaryColor ?? '#6366f1',
        fontFamily: data.fontFamily ?? 'Arial',
        socialLinks: data.socialLinks ?? [],
      });
    } catch {
      // invalid token — ignore
    }
  }, [searchParams, id, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    setSaveError(null);
    const payload = toSignatureApiPayload(data as Record<string, unknown>);
    try {
      if (id === 'new') {
        await createSignature(payload as Partial<typeof data>);
      } else {
        await axios.patch(
          `http://localhost:3000/api/v1/signatures/${id}`,
          payload,
        );
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      navigate('/');
    } catch (error) {
      console.error('Error saving signature:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : null;
      setSaveError(
        Array.isArray(message)
          ? message.join(', ')
          : typeof message === 'string'
            ? message
            : 'Failed to save signature. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 h-20 shrink-0">
        <div className="flex items-center space-x-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-xl h-11 w-11 hover:bg-muted active:scale-95 border  hover:border-border transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-primary">Signature Builder</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-0.5">
              {id === 'new' ? 'Creating New' : 'Editing Signature'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {saveSuccess && (
            <div className="flex items-center px-3 py-1.5 bg-success/10 text-success rounded-lg text-xs font-bold animate-in fade-in slide-in-from-right-4 border border-success/20">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              <span>Saved!</span>
            </div>
          )}
          {saveError && (
            <div className="max-w-xs px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs font-bold border border-destructive/20">
              {saveError}
            </div>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleCopy} className="rounded-xl h-11 w-11 font-bold active:scale-[0.98] border-2">
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy HTML to Clipboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => downloadSignatureAsHtml(watchedData as any, `${watchedData.name || 'signature'}.html`)} className="rounded-xl h-11 w-11 font-bold active:scale-[0.98] border-2">
                  <Download className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download as .html file</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="flex items-center px-6 h-11 space-x-2 text-white bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all font-bold text-sm shadow-lg shadow-primary/20 active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden h-full">
        {/* Sidebar - Form */}
        <aside className="relative z-20 flex h-auto min-h-[min(50vh,480px)] w-full shrink-0 flex-col overflow-hidden border-r bg-card shadow-xl lg:h-full lg:min-h-0 lg:w-[420px]">
          <div className="p-6 border-b flex items-center justify-between bg-card/80 backdrop-blur-md sticky top-0 z-30">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Editor</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Signature Builder</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/')} className="rounded-xl h-9 border-2 font-bold px-4 active:scale-95">Cancel</Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSubmit(onSubmit)} 
                disabled={isSaving}
                className="rounded-xl h-9 bg-primary shadow-lg shadow-primary/20 font-bold px-6 active:scale-95 transition-all"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <CheckCircle2 className="w-4 h-4" /> : 'Save'}
              </Button>
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="px-6 py-4 bg-muted/20 border-b">
              <TabsList className="w-full h-12 p-1 bg-muted rounded-xl border border-border/50">
                <TabsTrigger value="info" className="flex-1 rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <User className="w-3.5 h-3.5 mr-2" />
                  Info
                </TabsTrigger>
                <TabsTrigger value="template" className="flex-1 rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Layout className="w-3.5 h-3.5 mr-2" />
                  Template
                </TabsTrigger>
                <TabsTrigger value="design" className="flex-1 rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  <Palette className="w-3.5 h-3.5 mr-2" />
                  Design
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-8 min-h-full">
                <TabsContent value="info" className="m-0 space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
                  <section>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/60">Personal Details</h3>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2.5">
                        <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Full Name</Label>
                        <Input {...register('name')} className="bg-muted/40 border-2  focus:border-primary/20 focus:bg-background rounded-xl transition-all h-12 font-medium" placeholder="John Doe" />
                        {errors.name && <p className="text-[10px] font-bold text-destructive mt-1 ml-1">{errors.name.message}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2.5">
                          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Job Title</Label>
                          <Input {...register('title')} className="bg-muted/40 border-2  focus:border-primary/20 focus:bg-background rounded-xl transition-all h-12 font-medium" placeholder="CEO" />
                        </div>
                        <div className="space-y-2.5">
                          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Department</Label>
                          <Input {...register('department')} className="bg-muted/40 border-2  focus:border-primary/20 focus:bg-background rounded-xl transition-all h-12 font-medium" placeholder="Sales" />
                        </div>
                      </div>
                    </div>
                  </section>

                  <Separator className="bg-border/50" />

                  <section>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/60">Contact Details</h3>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2.5">
                        <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Email Address</Label>
                        <Input {...register('email')} className="bg-muted/40 border-2  focus:border-primary/20 focus:bg-background rounded-xl transition-all h-12 font-medium" placeholder="john@company.com" />
                        {errors.email && <p className="text-[10px] font-bold text-destructive mt-1 ml-1">{errors.email.message}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2.5">
                          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Work Phone</Label>
                          <Input {...register('phone')} className="bg-muted/40 border-2  focus:border-primary/20 focus:bg-background rounded-xl transition-all h-12 font-medium" placeholder="+1..." />
                        </div>
                        <div className="space-y-2.5">
                          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Mobile</Label>
                          <Input {...register('mobile')} className="bg-muted/40 border-2  focus:border-primary/20 focus:bg-background rounded-xl transition-all h-12 font-medium" placeholder="+1..." />
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Company Website</Label>
                        <Input {...register('website')} className="bg-muted/40 border-2  focus:border-primary/20 focus:bg-background rounded-xl transition-all h-12 font-medium" placeholder="https://..." />
                        {errors.website && <p className="text-[10px] font-bold text-destructive mt-1 ml-1">{errors.website.message}</p>}
                      </div>
                    </div>
                  </section>
                  
                  <Separator className="bg-border/50" />

                  <section>
                    <SocialLinksEditor
                      fields={fields}
                      register={register}
                      remove={remove}
                      append={append}
                      setValue={(name, value) => setValue(name as any, value)}
                      errors={errors}
                    />
                  </section>
                </TabsContent>

                <TabsContent value="template" className="m-0 space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
                  <section>
                    <div className="flex items-center space-x-3 mb-8">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Layout className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/60">Choose Layout</h3>
                    </div>
                    <TemplatePicker
                      templates={templates}
                      selectedId={watchedData.templateId}
                      onSelect={(id) => setValue('templateId', id)}
                    />
                  </section>
                </TabsContent>

                <TabsContent value="design" className="m-0 space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
                  <section>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/60">Branding & Workspace</h3>
                    </div>
                    <div className="space-y-6">
                      {organizations.length > 0 && (
                        <div className="space-y-2.5">
                          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Organization</Label>
                          <Select 
                            value={watchedData.organizationId} 
                            onValueChange={(v) => setValue('organizationId', v ?? '')}
                          >
                            <SelectTrigger className="bg-muted/40 border-2  focus:ring-primary/20 focus:bg-background rounded-xl h-12 font-medium">
                              <SelectValue placeholder="Personal (None)" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="" className="rounded-lg">None (Personal)</SelectItem>
                              {organizations.map((org) => (
                                <SelectItem key={org.id} value={org.id} className="rounded-lg">{org.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="space-y-2.5">
                        <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Company Name</Label>
                        <Input {...register('company')} className="bg-muted/40 border-2  focus:border-primary/20 focus:bg-background rounded-xl transition-all h-12 font-medium" placeholder="Acme Inc." />
                      </div>
                      <div className="space-y-2.5">
                        <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Logo URL</Label>
                        <Input {...register('logoUrl')} className="bg-muted/40 border-2  focus:border-primary/20 focus:bg-background rounded-xl transition-all h-12 font-medium" placeholder="https://..." />
                        {errors.logoUrl && <p className="text-[10px] font-bold text-destructive mt-1 ml-1">{errors.logoUrl.message}</p>}
                      </div>
                    </div>
                  </section>

                  <Separator className="bg-border/50" />

                  <section>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Palette className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/60">Visual Style</h3>
                    </div>
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Accent Color</Label>
                        <div className="flex items-center gap-5">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-muted shadow-sm group ring-offset-background focus-within:ring-2 focus-within:ring-primary/20">
                            <input
                              type="color"
                              {...register('primaryColor')}
                              className="absolute inset-0 w-full h-full scale-150 cursor-pointer"
                            />
                          </div>
                          <Input
                            type="text"
                            value={watchedData.primaryColor ?? '#6366f1'}
                            onChange={(e) => setValue('primaryColor', e.target.value)}
                            className="flex-1 bg-muted/40 border-2  focus:border-primary/20 focus:bg-background rounded-xl h-12 font-mono uppercase text-sm font-bold"
                            placeholder="#6366F1"
                          />
                        </div>
                        <div className="flex gap-2.5 mt-2 flex-wrap">
                          {['#6366f1','#7c3aed','#ec4899','#ef4444','#f59e0b','#10b981','#3b82f6','#1e293b'].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setValue('primaryColor', c)}
                              className={cn(
                                "w-9 h-9 rounded-xl border-2 transition-all hover:scale-110 shadow-sm",
                                watchedData.primaryColor === c ? 'border-primary scale-110 shadow-lg shadow-primary/20' : ''
                              )}
                              style={{ backgroundColor: c }}
                              title={c}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Typography</Label>
                        <Select 
                          value={watchedData.fontFamily} 
                          onValueChange={(v) => setValue('fontFamily', v ?? 'Arial')}
                        >
                          <SelectTrigger className="bg-muted/40 border-2  focus:ring-primary/20 focus:bg-background rounded-xl h-12 font-medium">
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="Arial" className="rounded-lg">Arial (Default)</SelectItem>
                            <SelectItem value="Georgia, serif" className="rounded-lg">Georgia</SelectItem>
                            <SelectItem value="'Times New Roman', serif" className="rounded-lg">Times New Roman</SelectItem>
                            <SelectItem value="'Trebuchet MS', sans-serif" className="rounded-lg">Trebuchet MS</SelectItem>
                            <SelectItem value="Verdana, sans-serif" className="rounded-lg">Verdana</SelectItem>
                            <SelectItem value="'Courier New', monospace" className="rounded-lg">Courier New</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </section>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </aside>

        {/* Main Content - Preview */}
        <main className="flex-1 bg-muted/30 p-8 lg:p-20 overflow-y-auto flex flex-col items-center justify-start relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--primary)/0.05,transparent_50%)] pointer-events-none" />
          
          <div className="w-full max-w-2xl bg-card border-2 border-border/50 rounded-[2.5rem] shadow-2xl p-12 mb-10 relative z-10 animate-in-up">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Live Preview</h3>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-success" />
              </div>
            </div>

            <div className="bg-card p-10 rounded-3xl border-2 border-border/30 shadow-inner min-h-[240px] flex items-center justify-center overflow-auto">
              {currentTemplate ? (
                <div className="w-full transition-all duration-500 animate-in-fade">
                  <currentTemplate.component data={watchedData as any} />
                </div>
              ) : (
                <p className="text-muted-foreground italic">Select a template to begin</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 relative z-10 animate-in-up delay-100">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleCopy} className="rounded-2xl h-14 w-14 font-bold active:scale-95 border-2 bg-card shadow-xl hover:bg-muted hover:border-primary/20 transition-all">
                    <Copy className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-xl border-2 px-4 py-2 font-bold text-xs uppercase tracking-widest">Copy HTML</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => downloadSignatureAsHtml(watchedData as any, `${watchedData.name || 'signature'}.html`)} className="rounded-2xl h-14 w-14 font-bold active:scale-95 border-2 bg-card shadow-xl hover:bg-muted hover:border-primary/20 transition-all">
                    <Download className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-xl border-2 px-4 py-2 font-bold text-xs uppercase tracking-widest">Download .html</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Builder;
