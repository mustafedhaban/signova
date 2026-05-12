import React from 'react';
import { UseFormRegister, UseFieldArrayRemove, FieldErrors } from 'react-hook-form';
import { 
  Trash2, 
  Plus, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram, 
  Github, 
  Globe,
  MoreHorizontal
} from 'lucide-react';
import { socialColors } from '../templates/socialIcons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const PlatformIcons: Record<string, React.FC<{ className?: string }>> = {
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  github: Github,
};

const platformColors: Record<string, string> = {
  linkedin: 'text-[#0A66C2]',
  twitter: 'text-[#000000]',
  facebook: 'text-[#1877F2]',
  instagram: 'text-[#E4405F]',
  github: 'text-[#181717]',
};

const platforms = ['linkedin', 'twitter', 'facebook', 'instagram', 'github'] as const;
type Platform = typeof platforms[number];

interface SocialLinkField {
  id: string;
  platform: Platform;
  url: string;
}

interface SocialLinksEditorProps {
  fields: SocialLinkField[];
  register: UseFormRegister<any>;
  remove: UseFieldArrayRemove;
  append: (value: { platform: Platform; url: string }) => void;
  setValue: (name: string, value: any) => void;
  errors?: FieldErrors<any>;
}

const SocialLinksEditor: React.FC<SocialLinksEditorProps> = ({
  fields,
  register,
  remove,
  append,
  setValue,
  errors,
}) => {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/60 flex items-center">
          <Globe className="w-3 h-3 mr-2" /> Social Presence
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append({ platform: 'linkedin', url: '' })}
          className="h-8 rounded-lg text-xs font-bold text-primary hover:bg-primary/5 px-2"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Profile
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => {
          const platform = field.platform as Platform;
          const Icon = PlatformIcons[platform] || MoreHorizontal;
          const color = platformColors[platform];

          return (
            <div key={field.id} className="flex items-start space-x-3 group animate-in slide-in-from-right-2 duration-300">
              <div className="w-[130px] shrink-0">
                <Select
                  value={platform}
                  onValueChange={(val) => setValue(`socialLinks.${index}.platform`, val)}
                >
                  <SelectTrigger className="bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl h-11 font-medium transition-all">
                    <SelectValue>
                      <div className="flex items-center">
                        <Icon className={`w-3.5 h-3.5 mr-2 ${color}`} />
                        <span className="truncate capitalize">{platform}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2">
                    {platforms.map((p) => {
                      const PIcon = PlatformIcons[p] || MoreHorizontal;
                      return (
                        <SelectItem key={p} value={p} className="rounded-lg">
                          <div className="flex items-center">
                            <PIcon className={`w-3.5 h-3.5 mr-2 ${platformColors[p]}`} />
                            <span className="capitalize">{p}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-1">
                <Input
                  {...register(`socialLinks.${index}.url` as const)}
                  placeholder="Profile URL (e.g. linkedin.com/in/johndoe)"
                  className="bg-muted/40 border-2 border-transparent focus:border-primary/20 focus:bg-background rounded-xl h-11 font-medium transition-all"
                />
                {(errors?.socialLinks as any)?.[index]?.url && (
                  <p className="text-[10px] font-bold text-destructive px-1">
                    {(errors?.socialLinks as any)?.[index]?.url?.message}
                  </p>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="h-11 w-11 rounded-xl text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-all shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          );
        })}

        {fields.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-[2rem] bg-muted/20">
            <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-3">
              <Globe className="w-6 h-6 text-muted-foreground/40" />
            </div>
            <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest text-center px-6 leading-relaxed">
              No social profiles linked.<br/>Add your first profile above.
            </p>
          </div>
        )}
      </div>

      {/* Live Preview */}
      {fields.length > 0 && (
        <div className="mt-6 p-5 bg-white border-2 border-dashed rounded-3xl shadow-soft animate-in zoom-in-95 duration-500">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-4 block ml-1">Live Social Preview</Label>
          <div className="flex flex-wrap gap-3">
            {fields.map((field, index) => {
              const p = field.platform as Platform;
              const PIcon = PlatformIcons[p] || MoreHorizontal;
              const bg = socialColors[p] || '#374151';
              return (
                <div
                  key={index}
                  style={{ backgroundColor: bg }}
                  className={`flex items-center justify-center w-9 h-9 rounded-xl shadow-lg transition-all duration-300 ${!field.url ? 'opacity-20 grayscale scale-90' : 'hover:scale-110 hover:-translate-y-1 shadow-black/10'}`}
                >
                  <PIcon className="w-4.5 h-4.5 text-white" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default SocialLinksEditor;
