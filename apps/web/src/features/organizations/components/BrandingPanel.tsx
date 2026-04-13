import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    primaryColor: org.primaryColor ?? '#2563EB',
    secondaryColor: org.secondaryColor ?? '#1E3A5F',
    fontFamily: org.fontFamily ?? 'Arial',
    fontSize: org.fontSize ?? '14',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      logoUrl: org.logoUrl ?? '',
      bannerUrl: org.bannerUrl ?? '',
      primaryColor: org.primaryColor ?? '#2563EB',
      secondaryColor: org.secondaryColor ?? '#1E3A5F',
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
      <CardHeader>
        <CardTitle className="text-base">Branding</CardTitle>
        <CardDescription>Customize your organization's visual identity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Logo & Banner URLs */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <Label>Logo URL</Label>
            <Input
              placeholder="https://example.com/logo.png"
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              disabled={!canEdit}
            />
            {form.logoUrl && (
              <img src={form.logoUrl} alt="Logo preview" className="h-12 mt-1 object-contain rounded border p-1" />
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Banner URL</Label>
            <Input
              placeholder="https://example.com/banner.png"
              value={form.bannerUrl}
              onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
              disabled={!canEdit}
            />
            {form.bannerUrl && (
              <img src={form.bannerUrl} alt="Banner preview" className="h-16 mt-1 w-full object-cover rounded border" />
            )}
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Primary Color</Label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                disabled={!canEdit}
                className="w-10 h-10 rounded border cursor-pointer p-0.5"
              />
              <Input
                value={form.primaryColor}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                disabled={!canEdit}
                className="font-mono text-sm"
                maxLength={7}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Secondary Color</Label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={form.secondaryColor}
                onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                disabled={!canEdit}
                className="w-10 h-10 rounded border cursor-pointer p-0.5"
              />
              <Input
                value={form.secondaryColor}
                onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                disabled={!canEdit}
                className="font-mono text-sm"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        {/* Font */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Font Family</Label>
            <select
              value={form.fontFamily}
              onChange={(e) => setForm({ ...form, fontFamily: e.target.value })}
              disabled={!canEdit}
              className="w-full px-3 py-2 border rounded-md text-sm bg-background"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Font Size</Label>
            <select
              value={form.fontSize}
              onChange={(e) => setForm({ ...form, fontSize: e.target.value })}
              disabled={!canEdit}
              className="w-full px-3 py-2 border rounded-md text-sm bg-background"
            >
              {FONT_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}px</option>
              ))}
            </select>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-1.5">
          <Label>Preview</Label>
          <div
            className="p-4 border rounded-md"
            style={{ fontFamily: form.fontFamily, fontSize: `${form.fontSize}px` }}
          >
            <div className="flex items-center space-x-3">
              {form.logoUrl && (
                <img src={form.logoUrl} alt="logo" className="h-10 object-contain" />
              )}
              <div>
                <p style={{ color: form.primaryColor, fontWeight: 'bold', fontSize: '16px' }}>
                  {org.name}
                </p>
                <p style={{ color: form.secondaryColor }}>Your Name · Your Title</p>
              </div>
            </div>
            {form.bannerUrl && (
              <img src={form.bannerUrl} alt="banner" className="mt-3 w-full h-12 object-cover rounded" />
            )}
          </div>
        </div>

        {canEdit && (
          <Button variant={saved ? 'secondary' : 'blue'} onClick={handleSave} className="w-full">
            {saved ? '✓ Saved' : 'Save Branding'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BrandingPanel;
