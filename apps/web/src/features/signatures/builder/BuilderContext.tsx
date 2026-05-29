import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useSignatures } from '@/features/signatures/hooks/useSignatures';
import { useOrganizations } from '@/features/organizations/hooks/useOrganizations';
import { getTemplateById } from '@/features/signatures/templates';
import { exportSignatureToHtml, downloadSignatureAsHtml } from '@/features/signatures/utils/export';
import { toSignatureApiPayload } from '@/features/signatures/utils/api-payload';
import { setLastSignatureHtml } from '@/features/signatures/utils/signature-clipboard';
import { API_BASE } from '@/lib/api';

export const builderSchema = z.object({
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
  socialLinks: z
    .array(
      z.object({
        platform: z.enum(['linkedin', 'twitter', 'facebook', 'instagram', 'github']),
        url: z.string().url('Invalid URL'),
      }),
    )
    .optional(),
});

export type BuilderFormData = z.infer<typeof builderSchema>;

type BuilderContextValue = {
  id: string | undefined;
  isNew: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  register: ReturnType<typeof useForm<BuilderFormData>>['register'];
  control: ReturnType<typeof useForm<BuilderFormData>>['control'];
  handleSubmit: ReturnType<typeof useForm<BuilderFormData>>['handleSubmit'];
  watch: ReturnType<typeof useForm<BuilderFormData>>['watch'];
  setValue: ReturnType<typeof useForm<BuilderFormData>>['setValue'];
  errors: ReturnType<typeof useForm<BuilderFormData>>['formState']['errors'];
  fields: ReturnType<typeof useFieldArray<BuilderFormData>>['fields'];
  append: ReturnType<typeof useFieldArray<BuilderFormData>>['append'];
  remove: ReturnType<typeof useFieldArray<BuilderFormData>>['remove'];
  watchedData: BuilderFormData;
  currentTemplate: ReturnType<typeof getTemplateById>;
  organizations: ReturnType<typeof useOrganizations>['organizations'];
  saveSuccess: boolean;
  saveError: string | null;
  isSaving: boolean;
  installGuideOpen: boolean;
  setInstallGuideOpen: (open: boolean) => void;
  onSubmit: (data: BuilderFormData) => Promise<void>;
  handleDownloadHtml: () => void;
};

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) {
    throw new Error('useBuilder must be used within BuilderProvider');
  }
  return ctx;
}

export function useBuilderOptional() {
  return useContext(BuilderContext);
}

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signatures, createSignature } = useSignatures();
  const { organizations } = useOrganizations();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('template');
  const [installGuideOpen, setInstallGuideOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BuilderFormData>({
    resolver: zodResolver(builderSchema),
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
      primaryColor: '#0369a1',
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
  const isNew = id === 'new';

  useEffect(() => {
    if (organizations.length > 0 && !watchedData.organizationId && isNew) {
      const firstOrg = organizations[0];
      setValue('organizationId', firstOrg.id);
      if (!watchedData.company) {
        setValue('company', firstOrg.name);
      }
    }
  }, [organizations, watchedData.organizationId, watchedData.company, setValue, isNew]);

  useEffect(() => {
    if (watchedData.organizationId) {
      const selectedOrg = organizations.find((o) => o.id === watchedData.organizationId);
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
    if (id && !isNew) {
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
          organizationId: (signature as { organizationId?: string }).organizationId ?? '',
          primaryColor: (signature as { primaryColor?: string }).primaryColor ?? '#0369a1',
          fontFamily: (signature as { fontFamily?: string }).fontFamily ?? 'Arial',
          socialLinks: signature.socialLinks as BuilderFormData['socialLinks'],
        });
      }
    }
  }, [id, isNew, signatures, reset]);

  useEffect(() => {
    const token = searchParams.get('prefill');
    if (!token || !isNew) return;
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
        primaryColor: data.primaryColor ?? '#0369a1',
        fontFamily: data.fontFamily ?? 'Arial',
        socialLinks: data.socialLinks ?? [],
      });
    } catch {
      // invalid token — ignore
    }
  }, [searchParams, isNew, reset]);

  const onSubmit = async (data: BuilderFormData) => {
    setIsSaving(true);
    setSaveError(null);
    const payload = toSignatureApiPayload(data as Record<string, unknown>);
    try {
      const signatureHtml = exportSignatureToHtml(
        data as Parameters<typeof exportSignatureToHtml>[0],
      );
      setLastSignatureHtml(signatureHtml);

      if (isNew) {
        const created = await createSignature(payload as Partial<BuilderFormData>);
        navigate(`/builder/${created.id}`, { replace: true });
      } else {
        await axios.patch(`${API_BASE}/signatures/${id}`, payload);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setInstallGuideOpen(true);
    } catch (error) {
      console.error('Error saving signature:', error);
      const message = axios.isAxiosError(error) ? error.response?.data?.message : null;
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

  const handleDownloadHtml = () => {
    downloadSignatureAsHtml(
      watchedData as Parameters<typeof downloadSignatureAsHtml>[0],
      `${watchedData.name || 'signature'}.html`,
    );
  };

  return (
    <BuilderContext.Provider
      value={{
        id,
        isNew,
        activeTab,
        setActiveTab,
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        errors,
        fields,
        append,
        remove,
        watchedData,
        currentTemplate,
        organizations,
        saveSuccess,
        saveError,
        isSaving,
        installGuideOpen,
        setInstallGuideOpen,
        onSubmit,
        handleDownloadHtml,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}
