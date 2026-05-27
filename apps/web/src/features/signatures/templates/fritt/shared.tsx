import React from 'react';
import { ISignature, ISocialLink } from '@signova/types';
import { SocialIcon } from '../socialIcons';

export const FRITT_RED = '#E54B4B';
export const FRITT_GREY_BG = '#EEEEEE';
export const FRITT_GREY_BORDER = '#CCCCCC';
export const FRITT_TEXT = '#1a1a1a';
export const FRITT_MUTED = '#666666';

export type FrittFields = ReturnType<typeof getFrittFields>;

export function getFrittFields(data: Partial<ISignature>) {
  const website = data.website || '';
  const websiteLabel = website.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return {
    name: (data.name || 'John Doe').toUpperCase(),
    title: data.title || 'Senior Content Writer',
    company: data.company || 'Signova',
    titleAtCompany: data.company
      ? `${data.title || 'Senior Content Writer'} at ${data.company}`
      : data.title || 'Senior Content Writer',
    address:
      data.address ||
      [data.company, data.department].filter(Boolean).join(', ') ||
      '32 Black Street, Winter Hour, United Kingdom',
    email: data.email || 'john@example.com',
    phone: data.phone,
    mobile: data.mobile,
    website,
    websiteLabel: websiteLabel || 'signova.com',
    logoUrl: data.logoUrl,
    socialLinks: (data.socialLinks || []) as ISocialLink[],
    red: data.primaryColor || FRITT_RED,
    fontFamily:
      data.fontFamily ||
      "Arial, Helvetica, 'Segoe UI', sans-serif",
  };
}

export const RedLogo: React.FC<{
  f: FrittFields;
  size?: number;
  paddingRight?: number;
}> = ({ f, size = 72, paddingRight = 16 }) => (
  <td style={{ verticalAlign: 'top', paddingRight, width: size }}>
    {f.logoUrl ? (
      <img
        src={f.logoUrl}
        width={size}
        height={size}
        alt=""
        style={{ display: 'block', objectFit: 'cover' }}
      />
    ) : (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: f.red,
          display: 'block',
        }}
      />
    )}
  </td>
);

export const NameBlock: React.FC<{
  f: FrittFields;
  fontSize?: number;
  align?: 'left' | 'center';
}> = ({ f, fontSize = 16, align = 'left' }) => (
  <p
    style={{
      margin: 0,
      fontSize,
      fontWeight: 700,
      color: f.red,
      letterSpacing: '0.04em',
      textAlign: align,
    }}
  >
    {f.name}
  </p>
);

export const TitleBlock: React.FC<{
  f: FrittFields;
  useCompany?: boolean;
  align?: 'left' | 'center';
  color?: string;
}> = ({ f, useCompany = false, align = 'left', color = FRITT_MUTED }) => (
  <p
    style={{
      margin: '4px 0 0',
      fontSize: 12,
      color,
      textAlign: align,
      fontWeight: 500,
    }}
  >
    {useCompany ? f.titleAtCompany : f.title}
  </p>
);

export const TitleBadge: React.FC<{ f: FrittFields }> = ({ f }) => (
  <span
    style={{
      display: 'inline-block',
      marginTop: 6,
      padding: '4px 10px',
      backgroundColor: f.red,
      color: '#ffffff',
      fontSize: 11,
      fontWeight: 600,
    }}
  >
    {f.titleAtCompany}
  </span>
);

export const VRule: React.FC<{ f: FrittFields; height?: number }> = ({ f, height = 48 }) => (
  <td
    style={{
      width: 2,
      backgroundColor: f.red,
      padding: '0 12px',
      verticalAlign: 'top',
    }}
  >
    <div style={{ width: 2, minHeight: height, backgroundColor: f.red }} />
  </td>
);

export const HRule: React.FC = () => (
  <tr>
    <td colSpan={99} style={{ padding: '10px 0' }}>
      <div style={{ height: 1, backgroundColor: FRITT_GREY_BORDER, width: '100%' }} />
    </td>
  </tr>
);

export const AddressLine: React.FC<{ f: FrittFields; align?: 'left' | 'center' }> = ({
  f,
  align = 'left',
}) => (
  <p style={{ margin: '8px 0 0', fontSize: 11, color: FRITT_MUTED, textAlign: align, lineHeight: 1.5 }}>
    {f.address}
  </p>
);

export const WebsiteLine: React.FC<{ f: FrittFields; align?: 'left' | 'center' }> = ({
  f,
  align = 'left',
}) =>
  f.website ? (
    <p style={{ margin: '4px 0 0', fontSize: 11, textAlign: align }}>
      <a href={f.website} style={{ color: f.red, textDecoration: 'none', fontWeight: 600 }}>
        {f.websiteLabel}
      </a>
    </p>
  ) : null;

export const PhoneBlock: React.FC<{ f: FrittFields; compact?: boolean }> = ({ f, compact }) => {
  if (!f.phone && !f.mobile) return null;
  const line = (label: string, value: string) => (
    <p key={label} style={{ margin: compact ? '2px 0' : '4px 0', fontSize: 11, color: FRITT_TEXT }}>
      <span style={{ color: FRITT_MUTED }}>{label}: </span>
      <a href={`tel:${value}`} style={{ color: FRITT_TEXT, textDecoration: 'none' }}>
        {value}
      </a>
    </p>
  );
  return (
    <>
      {f.phone && line('Off', f.phone)}
      {f.mobile && line('Mob', f.mobile)}
    </>
  );
};

export const SocialRow: React.FC<{
  f: FrittFields;
  align?: 'left' | 'center';
  vertical?: boolean;
}> = ({ f, align = 'left', vertical }) => {
  if (!f.socialLinks.length) {
    return (
      <table cellPadding={0} cellSpacing={0} style={{ marginTop: 8 }}>
        <tbody>
          <tr>
            <td style={{ paddingRight: 6 }}>
              <SocialIcon platform="facebook" url="#" size={18} bgColor={f.red} />
            </td>
            <td style={{ paddingRight: 6 }}>
              <SocialIcon platform="twitter" url="#" size={18} bgColor={f.red} />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  if (vertical) {
    return (
      <table cellPadding={0} cellSpacing={0} style={{ marginTop: 8 }}>
        <tbody>
          {f.socialLinks.map((link, i) => (
            <tr key={i}>
              <td style={{ paddingBottom: 4 }}>
                <table cellPadding={0} cellSpacing={0}>
                  <tbody>
                    <tr>
                      <td style={{ paddingRight: 8, verticalAlign: 'middle' }}>
                        <SocialIcon platform={link.platform} url={link.url} size={16} bgColor={f.red} />
                      </td>
                      <td style={{ fontSize: 10, color: FRITT_MUTED, verticalAlign: 'middle' }}>
                        {link.platform}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <table
      cellPadding={0}
      cellSpacing={0}
      align={align === 'center' ? 'center' : undefined}
      style={{ marginTop: 8 }}
    >
      <tbody>
        <tr>
          {f.socialLinks.map((link, i) => (
            <td key={i} style={{ paddingRight: 6 }}>
              <SocialIcon platform={link.platform} url={link.url} size={18} bgColor={f.red} />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export const FrittRoot: React.FC<{
  f: FrittFields;
  children: React.ReactNode;
}> = ({ f, children }) => (
  <table
    cellPadding={0}
    cellSpacing={0}
    style={{ fontFamily: f.fontFamily, borderCollapse: 'collapse', color: FRITT_TEXT }}
  >
    <tbody>{children}</tbody>
  </table>
);

export const GreyPanel: React.FC<{
  children: React.ReactNode;
  bordered?: boolean;
  colSpan?: number;
}> = ({ children, bordered, colSpan }) => (
  <tr>
    <td colSpan={colSpan} style={{ paddingTop: 10 }}>
      <table
        cellPadding={0}
        cellSpacing={0}
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: bordered ? 'transparent' : FRITT_GREY_BG,
          border: bordered ? `1px solid ${FRITT_GREY_BORDER}` : 'none',
        }}
      >
        <tbody>
          <tr>
            <td style={{ padding: 12 }}>{children}</td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
);
