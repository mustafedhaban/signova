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
    primaryColor = '#10b981',
    fontFamily = "'Fira Code', 'JetBrains Mono', 'Courier New', Courier, monospace",
  } = data;

  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily, backgroundColor: '#0f172a', borderRadius: '16px', overflow: 'hidden', borderCollapse: 'collapse', border: '1px solid #1e293b' }}>
      <tbody>
        {/* Terminal Header Bar */}
        <tr>
          <td style={{ backgroundColor: '#1e293b', padding: '10px 16px' }}>
            <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff5f56', marginRight: '6px', display: 'inline-block' }}></td>
                  <td style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffbd2e', marginRight: '6px', display: 'inline-block' }}></td>
                  <td style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#27c93f', display: 'inline-block' }}></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>

        <tr>
          <td style={{ padding: '24px 32px' }}>
            <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  {/* Logo column */}
                  {logoUrl && (
                    <td style={{ verticalAlign: 'top', paddingRight: '24px' }}>
                      <img src={logoUrl} width="56" height="56" style={{ display: 'block', borderRadius: '12px', border: '1px solid #334155', filter: 'brightness(0.9)' }} alt="Logo" />
                    </td>
                  )}

                  {/* Tech Content */}
                  <td style={{ verticalAlign: 'top' }}>
                    <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td style={{ paddingBottom: '4px' }}>
                            <p style={{ margin: '0', fontSize: '18px', fontWeight: '700', color: '#f8fafc', letterSpacing: '-0.02em' }}>
                              <span style={{ color: primaryColor }}>const</span> {name.replace(/\s+/g, '')} = <span style={{ color: '#e2e8f0' }}>()</span> <span style={{ color: primaryColor }}>=&gt;</span>
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ paddingBottom: '20px' }}>
                            <p style={{ margin: '0', fontSize: '13px', color: '#94a3b8' }}>
                              <span style={{ color: '#64748b' }}>//</span> {title} <span style={{ color: '#64748b' }}>@</span> {company}
                            </p>
                          </td>
                        </tr>

                        {/* Contact as object */}
                        <tr>
                          <td style={{ paddingBottom: '24px' }}>
                            <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                              <tbody>
                                <tr>
                                  <td style={{ fontSize: '12px', color: '#64748b', verticalAlign: 'top', paddingRight: '8px' }}>email:</td>
                                  <td><a href={`mailto:${email}`} style={{ fontSize: '12px', color: primaryColor, textDecoration: 'none' }}>'{email}'</a>,</td>
                                </tr>
                                {(phone || mobile) && (
                                  <tr>
                                    <td style={{ fontSize: '12px', color: '#64748b', verticalAlign: 'top', paddingRight: '8px' }}>phone:</td>
                                    <td><span style={{ fontSize: '12px', color: '#cbd5e1' }}>'{phone || mobile}'</span>,</td>
                                  </tr>
                                )}
                                {website && (
                                  <tr>
                                    <td style={{ fontSize: '12px', color: '#64748b', verticalAlign: 'top', paddingRight: '8px' }}>web:</td>
                                    <td><a href={website} style={{ fontSize: '12px', color: primaryColor, textDecoration: 'none' }}>'{website.replace(/^https?:\/\//, '')}'</a></td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </td>
                        </tr>

                        {/* Social footer - console style */}
                        {socialLinks.length > 0 && (
                          <tr>
                            <td>
                              <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                                <tbody>
                                  <tr>
                                    <td style={{ fontSize: '11px', color: '#475569', paddingRight: '12px' }}>$ follow:</td>
                                    {socialLinks.map((link, idx) => (
                                      <td key={idx} style={{ paddingRight: '8px' }}>
                                        <SocialIcon platform={link.platform} url={link.url} size={18} bgColor="#1e293b" />
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
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TechTemplate;
