import { useState } from 'react';
import SocialLinksEditor from '@/features/signatures/components/SocialLinksEditor';
import TemplateThumbnail from '@/features/signatures/components/TemplateThumbnail';
import {
  templates,
  getCategoryLabel,
  type ITemplate,
} from '@/features/signatures/templates';
import { useBuilder } from '@/features/signatures/builder/BuilderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const ALL_CATEGORIES = ['all', ...Array.from(new Set(templates.map((t) => t.category)))];

function TemplatePicker({
  items,
  selectedId,
  onSelect,
}: {
  items: ITemplate[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const filtered = items.filter(
    (t) => activeCategory === 'all' || t.category === activeCategory,
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-border/80 px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {ALL_CATEGORIES.map((cat) => (
            <Button
              key={cat}
              type="button"
              variant={activeCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="h-7 text-[11px]"
            >
              {cat === 'all' ? 'All' : getCategoryLabel(cat)}
            </Button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {filtered.length} template{filtered.length === 1 ? '' : 's'}
        </p>
      </div>
      <div className="relative min-h-0 flex-1">
        <div className="min-h-0 h-full overflow-y-auto overscroll-contain px-4 py-4">
          <div className="grid grid-cols-1 gap-3 pb-2">
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
              <p className="rounded-xl border border-dashed py-8 text-center text-xs text-muted-foreground">
                No templates match this filter.
              </p>
            )}
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background to-transparent"
        />
      </div>
    </div>
  );
}

const PANEL_TITLES: Record<string, string> = {
  template: 'Choose template',
  personal: 'Personal info',
  business: 'Business info',
  design: 'Design',
};

export function BuilderContentPanel() {
  const {
    activeTab,
    register,
    setValue,
    errors,
    fields,
    append,
    remove,
    watchedData,
    organizations,
  } = useBuilder();

  return (
    <aside
      className={cn(
        'flex min-h-0 flex-1 flex-col overflow-hidden border-b border-border/80 bg-background lg:max-h-none lg:h-full lg:w-[min(100%,22rem)] lg:flex-none lg:border-b-0 lg:border-r',
        'max-h-[min(46vh,420px)] w-full',
      )}
    >
      <div className="shrink-0 border-b border-border/80 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {PANEL_TITLES[activeTab] ?? 'Editor'}
        </h2>
      </div>

      {activeTab === 'template' ? (
        <TemplatePicker
          items={templates}
          selectedId={watchedData.templateId}
          onSelect={(templateId) => setValue('templateId', templateId)}
        />
      ) : (
        <div className="relative min-h-0 flex-1 overflow-y-auto px-4 py-5">
          {activeTab === 'personal' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Full name</Label>
                <Input {...register('name')} placeholder="John Doe" />
                {errors.name ? (
                  <p className="text-[11px] text-destructive">{errors.name.message}</p>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Job title</Label>
                  <Input {...register('title')} placeholder="CEO" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Department</Label>
                  <Input {...register('department')} placeholder="Sales" />
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'business' ? (
            <div className="space-y-6">
              <section className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Email</Label>
                  <Input {...register('email')} placeholder="john@company.com" />
                  {errors.email ? (
                    <p className="text-[11px] text-destructive">{errors.email.message}</p>
                  ) : null}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Work phone</Label>
                    <Input {...register('phone')} placeholder="+1…" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Mobile</Label>
                    <Input {...register('mobile')} placeholder="+1…" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Website</Label>
                  <Input {...register('website')} placeholder="https://…" />
                  {errors.website ? (
                    <p className="text-[11px] text-destructive">{errors.website.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Company name</Label>
                  <Input {...register('company')} placeholder="Acme Inc." />
                </div>
              </section>

              <Separator />

              <SocialLinksEditor
                fields={fields}
                register={register}
                remove={remove}
                append={append}
                setValue={(name, value) => setValue(name as keyof typeof watchedData, value)}
                errors={errors}
              />
            </div>
          ) : null}

          {activeTab === 'design' ? (
          <div className="space-y-6">
            <section className="space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Branding
              </p>
              {organizations.length > 0 ? (
                <div className="space-y-2">
                  <Label className="text-xs">Organization</Label>
                  <Select
                    value={watchedData.organizationId}
                    onValueChange={(v) => setValue('organizationId', v ?? '')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Personal (None)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None (Personal)</SelectItem>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
              <div className="space-y-2">
                <Label className="text-xs">Logo URL</Label>
                <Input {...register('logoUrl')} placeholder="https://…" />
                {errors.logoUrl ? (
                  <p className="text-[11px] text-destructive">{errors.logoUrl.message}</p>
                ) : null}
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Style
              </p>
              <div className="space-y-3">
                <Label className="text-xs">Accent color</Label>
                <div className="flex items-center gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border">
                    <input
                      type="color"
                      {...register('primaryColor')}
                      className="absolute inset-0 size-full scale-150 cursor-pointer"
                    />
                  </div>
                  <Input
                    type="text"
                    value={watchedData.primaryColor ?? '#0369a1'}
                    onChange={(e) => setValue('primaryColor', e.target.value)}
                    className="font-mono text-xs uppercase"
                    placeholder="#6366F1"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {['#0369a1', '#0f172a', '#334155', '#0ea5e9', '#ef4444', '#f59e0b', '#10b981', '#1e293b'].map(
                    (c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setValue('primaryColor', c)}
                        className={cn(
                          'size-7 rounded-md border transition-transform hover:scale-105',
                          watchedData.primaryColor === c && 'ring-2 ring-primary ring-offset-1',
                        )}
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ),
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Typography</Label>
                <Select
                  value={watchedData.fontFamily}
                  onValueChange={(v) => setValue('fontFamily', v ?? 'Arial')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial">Arial (Default)</SelectItem>
                    <SelectItem value="Georgia, serif">Georgia</SelectItem>
                    <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                    <SelectItem value="'Trebuchet MS', sans-serif">Trebuchet MS</SelectItem>
                    <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                    <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>
          </div>
        ) : null}
        </div>
      )}
    </aside>
  );
}
