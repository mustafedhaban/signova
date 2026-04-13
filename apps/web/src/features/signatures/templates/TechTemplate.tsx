import React from 'react';
import { ISignature } from '@signova/types';
import { SocialIcon } from './socialIcons';

const TechTemplate: React.FC<{ data: Partial<ISignature> }> = ({ data }) => {
  const {
    name = 'John Doe',
    title = 'Software Engineer',
    company = 'Signova Inc.',
    email = 'john@example.com',
    phone,
    mobile,
    website,
    logoUrl,
    socialLinks = [],
    primaryColor = '#10B981',
    fontFamily = '"Courier New", monospace',
  } = data;

  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily, backgroundColor: '#0F172A', borderRadius: '8px', overflow: 'hidden' }}>
      <tbody>
        <tr>
          <td style={{ padding: '16px 20px' }}>
            {/* Terminal-style header */}
            <table cellPadding="0" cellSpacing="0" style={{ marginBottom: '10px' }}>
              <tbody>
                <tr>
                  <td style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444', marginRight: '5px', display: 'inline-block' }}></td>
                  <td style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B', marginRight: '5px', display: 'inline-block' }}></td>
                  <td style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: primaryColor, display: 'inline-block' }}></td>
                </tr>
              </tbody>
            </table>

            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  {logoUrl && (
                    <td style={{ verticalAlign: 'top', paddingRight: '14px' }}>
                      <img src={logoUrl} width="60" style={{ display: 'block', maxWidth: '60px', borderRadius: '6px', border: '1px solid #334155' }} alt="Logo" />
                    </td>
                  )}
                  <td style={{ verticalAlign: 'top' }}>
                    <p style={{ margin: '0 0 1px 0', fontSize: '16px', fontWeight: 'bold', color: primaryColor }}>
                      <span style={{ color: '#64748B' }}>$ </span>{name}
                    </p>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#94A3B8' }}>
                      <span style={{ color: '#64748B' }}># </span>{title} · {company}
                    </p>

                    <table cellPadding="0" cellSpacing="0">
                      <tbody>
                        {phone && (
                          <tr>
                            <td style={{ fontSize: '11px', color: '#64748B', paddingRight: '6px', paddingBottom: '2px' }}>tel:</td>
                            <td style={{ fontSize: '11px', color: '#CBD5E1', paddingBottom: '2px' }}>{phone}</td>
                          </tr>
                        )}
                        {mobile && (
                          <tr>
                            <td style={{ fontSize: '11px', color: '#64748B', paddingRight: '6px', paddingBottom: '2px' }}>mob:</td>
                            <td style={{ fontSize: '11px', color: '#CBD5E1', paddingBottom: '2px' }}>{mobile}</td>
                          </tr>
                        )}
                        <tr>
                          <td style={{ fontSize: '11px', color: '#64748B', paddingRight: '6px', paddingBottom: '2px' }}>mail:</td>
                          <td style={{ paddingBottom: '2px' }}>
                            <a href={`mailto:${email}`} style={{ fontSize: '11px', color: primaryColor, textDecoration: 'none' }}>{email}</a>
                          </td>
                        </tr>
                        {website && (
                          <tr>
                            <td style={{ fontSize: '11px', color: '#64748B', paddingRight: '6px' }}>web:</td>
                            <td>
                              <a href={website} style={{ fontSize: '11px', color: primaryColor, textDecoration: 'none' }}>{website.replace(/^https?:\/\//, '')}</a>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {socialLinks.length > 0 && (
                      <table cellPadding="0" cellSpacing="0" style={{ marginTop: '8px' }}>
                        <tbody>
                          <tr>
                            {socialLinks.map((link, idx) => (
                              <td key={idx} style={{ paddingRight: '5px' }}>
                                <SocialIcon platform={link.platform} url={link.url} size={22} bgColor={primaryColor} />
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TechTemplate;
