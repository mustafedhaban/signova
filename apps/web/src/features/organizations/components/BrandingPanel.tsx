import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Palette, Image as ImageIcon, Type } from 'lucide-react';
import { Organization } from '../hooks/useOrganizations';

const FONT_OPTIONS = ['Arial', 'Georgia', 'Helvetica', 'Trebuchet MS', 'Verdana', 'Times New Roman'];
const FONT_SIZE_OPTIONS = ['12', '13', '14', '15', '16'];

interface BrandingPanelProps {
  org: Organization;
  canEdit: boolean;
  onSave: (data: Partial<Organization>) => void;
}

const BrandingPanel: React.FC<BrandingPanelProps> = ({ org, canEdit, onSave }) => {
  const [form, setForm] = useState({
    logoUrl: org.logoUrl ?? '',
    bannerUrl: org.bannerUrl ?? '',
    primaryColor: org.primaryColor ?? '#6366f1',
    secondaryColor: org.secondaryColor ?? '#1e293b',
    fontFamily: org.fontFamily ?? 'Arial',
    fontSize: org.fontSize ?? '14',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      logoUrl: org.logoUrl ?? '',
      bannerUrl: org.bannerUrl ?? '',
      primaryColor: org.primaryColor ?? '#6366f1',
      secondaryColor: org.secondaryColor ?? '#1e293b',
      fontFamily: org.fontFamily ?? 'Arial',
      fontSize: org.fontSize ?? '14',
    });
  }, [org.id]);

  const handleSave = () => {
    onSave({ id: org.id, ...form } as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card>
      <CardHeader className="border-b border-border/50 pb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Palette className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Workspace Branding</CardTitle>
            <CardDescription>Customize visual identity for all team signatures</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 pt-8">

        {/* Logo & Banner URLs */}
        <section className="space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/60 flex items-center">
            <ImageIcon className="w-3 h-3 mr-2" /> Assets & Imagery
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Logo URL</Label>
              <Input
                placeholder="https://example.com/logo.png"
                value={form.logoUrl}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                disabled={!canEdit}
                className="bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl h-11 font-medium transition-all"
              />
              {form.logoUrl && (
                <div className="mt-2 p-2 bg-white rounded-xl border-2 border-border/50 inline-block shadow-sm">
                  <img src={form.logoUrl} alt="Logo preview" className="h-10 object-contain" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Banner URL</Label>
              <Input
                placeholder="https://example.com/banner.png"
                value={form.bannerUrl}
                onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
                disabled={!canEdit}
                className="bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl h-11 font-medium transition-all"
              />
              {form.bannerUrl && (
                <div className="mt-2 rounded-xl overflow-hidden border-2 border-border/50 shadow-sm">
                  <img src={form.bannerUrl} alt="Banner preview" className="h-12 w-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Colors */}
        <section className="space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/60 flex items-center">
            <Palette className="w-3 h-3 mr-2" /> Brand Colors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Primary Color</Label>
              <div className="flex items-center space-x-3">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-muted shadow-sm shrink-0">
                  <input
                    type="color"
                    value={form.primaryColor}
                    onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                    disabled={!canEdit}
                    className="absolute inset-0 w-full h-full scale-150 cursor-pointer"
                  />
                </div>
                <Input
                  value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  disabled={!canEdit}
                  className="bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl h-11 font-mono uppercase text-sm"
                  maxLength={7}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Secondary Color</Label>
              <div className="flex items-center space-x-3">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-muted shadow-sm shrink-0">
                  <input
                    type="color"
                    value={form.secondaryColor}
                    onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                    disabled={!canEdit}
                    className="absolute inset-0 w-full h-full scale-150 cursor-pointer"
                  />
                </div>
                <Input
                  value={form.secondaryColor}
                  onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                  disabled={!canEdit}
                  className="bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl h-11 font-mono uppercase text-sm"
                  maxLength={7}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Font */}
        <section className="space-y-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/60 flex items-center">
            <Type className="w-3 h-3 mr-2" /> Typography
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Font Family</Label>
              <Select
                value={form.fontFamily}
                onValueChange={(value) => setForm({ ...form, fontFamily: value ?? '' })}
                disabled={!canEdit}
              >
                <SelectTrigger className="bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl h-11 font-medium transition-all">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  {FONT_OPTIONS.map((f) => (
                    <SelectItem key={f} value={f} style={{ fontFamily: f }}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase tracking-widest">Base Font Size</Label>
              <Select
                value={form.fontSize}
                onValueChange={(value) => setForm({ ...form, fontSize: value ?? '' })}
                disabled={!canEdit}
              >
                <SelectTrigger className="bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl h-11 font-medium transition-all">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  {FONT_SIZE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}px
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Preview */}
        <section className="space-y-4">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/60 ml-1">Live Branding Preview</Label>
          <div
            className="p-8 bg-white border-2 border-dashed border-border rounded-3xl shadow-soft transition-all duration-500 overflow-hidden"
            style={{ fontFamily: form.fontFamily, fontSize: `${form.fontSize}px` }}
          >
            <div className="flex items-center space-x-6">
              {form.logoUrl ? (
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border p-2">
                  <img src={form.logoUrl} alt="logo" className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/20">
                  <Palette className="w-6 h-6 text-primary/30" />
                </div>
              )}
              <div>
                <p className="font-bold tracking-tight mb-1" style={{ color: form.primaryColor, fontSize: '20px' }}>
                  {org.name}
                </p>
                <p className="font-medium opacity-80" style={{ color: form.secondaryColor }}>Your Name · Your Title</p>
              </div>
            </div>
            {form.bannerUrl && (
              <div className="mt-6 rounded-2xl overflow-hidden shadow-sm border-2 border-white">
                <img src={form.bannerUrl} alt="banner" className="w-full h-16 object-cover" />
              </div>
            )}
          </div>
        </section>

        {canEdit && (
          <Button 
            variant={saved ? 'secondary' : 'default'} 
            onClick={handleSave} 
            className={`w-full h-12 rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98] ${
              saved ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/20' : 'shadow-primary/20'
            }`}
          >
            {saved ? '✓ Branding Applied' : 'Save & Apply Branding'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BrandingPanel;
