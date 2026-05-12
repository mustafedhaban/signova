import React from 'react';
import { ISignature } from '@signova/types';
import { SocialIcon } from './socialIcons';

const ExecutiveTemplate: React.FC<{ data: Partial<ISignature> }> = ({ data }) => {
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
    primaryColor = '#6366f1',
    fontFamily = "Georgia, 'Times New Roman', Times, serif",
  } = data;

  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily, borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          <td style={{ padding: '32px 40px', border: '1px solid #f1f5f9', backgroundColor: '#ffffff', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse', width: '100%' }}>
              <tbody>
                {/* Header: Name & Title */}
                <tr>
                  <td align="center" style={{ paddingBottom: '4px' }}>
                    <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '400', color: '#0f172a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{name}</h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style={{ paddingBottom: '24px' }}>
                    <p style={{ margin: '0', fontSize: '13px', color: primaryColor, fontStyle: 'italic', letterSpacing: '0.1em', fontWeight: '600' }}>{title}</p>
                  </td>
                </tr>

                {/* Divider Line */}
                <tr>
                  <td align="center" style={{ paddingBottom: '24px' }}>
                    <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse', width: '40px' }}>
                      <tbody>
                        <tr>
                          <td style={{ borderBottom: `2px solid ${primaryColor}`, height: '1px' }}></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* Main Content Row */}
                <tr>
                  <td align="center">
                    <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          {/* Logo if exists */}
                          {logoUrl && (
                            <td style={{ verticalAlign: 'middle', paddingRight: '32px' }}>
                              <img src={logoUrl} width="64" height="64" style={{ display: 'block', opacity: 0.9, filter: 'grayscale(100%)' }} alt="Logo" />
                            </td>
                          )}
                          
                          {/* Contact Info */}
                          <td style={{ verticalAlign: 'middle', textAlign: 'left' }}>
                            <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                              <tbody>
                                <tr>
                                  <td style={{ paddingBottom: '4px' }}>
                                    <p style={{ margin: '0', fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{company}</p>
                                  </td>
                                </tr>
                                <tr>
                                  <td style={{ paddingBottom: '2px' }}>
                                    <a href={`mailto:${email}`} style={{ fontSize: '13px', color: '#0f172a', textDecoration: 'none' }}>{email}</a>
                                  </td>
                                </tr>
                                {(phone || mobile) && (
                                  <tr>
                                    <td style={{ paddingBottom: '2px' }}>
                                      <span style={{ fontSize: '13px', color: '#64748b' }}>{phone || mobile}</span>
                                    </td>
                                  </tr>
                                )}
                                {website && (
                                  <tr>
                                    <td>
                                      <a href={website} style={{ fontSize: '13px', color: primaryColor, textDecoration: 'none', fontWeight: '600' }}>{website.replace(/^https?:\/\//, '')}</a>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* Social Footer */}
                {socialLinks.length > 0 && (
                  <tr>
                    <td align="center" style={{ paddingTop: '24px' }}>
                      <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                        <tbody>
                          <tr>
                            {socialLinks.map((link, idx) => (
                              <td key={idx} style={{ padding: '0 8px' }}>
                                <SocialIcon platform={link.platform} url={link.url} size={18} bgColor="#0f172a" />
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ExecutiveTemplate;
