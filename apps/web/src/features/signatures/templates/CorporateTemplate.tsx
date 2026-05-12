import React from 'react';
import { ISignature } from '@signova/types';
import { SocialIcon } from './socialIcons';

const CorporateTemplate: React.FC<{ data: Partial<ISignature> }> = ({ data }) => {
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
    fontFamily = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  } = data;

  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily, borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          {/* Left Panel: Brand & Logo */}
          <td style={{ backgroundColor: '#0f172a', padding: '28px 20px', verticalAlign: 'top', textAlign: 'center', width: '130px', borderRadius: '16px 0 0 16px' }}>
            <table cellPadding="0" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td align="center">
                    {logoUrl ? (
                      <img src={logoUrl} width="72" height="72" style={{ display: 'block', borderRadius: '12px', margin: '0 auto 16px auto', border: '2px solid rgba(255,255,255,0.1)' }} alt="Logo" />
                    ) : (
                      <div style={{ width: '72px', height: '72px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', margin: '0 auto 16px auto', border: '1px dashed rgba(255,255,255,0.2)' }} />
                    )}
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style={{ margin: '0', fontSize: '10px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {company}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>

          {/* Right Panel: Content */}
          <td style={{ padding: '28px 32px', verticalAlign: 'top', border: '1px solid #e2e8f0', borderLeft: 'none', borderRadius: '0 16px 16px 0', backgroundColor: '#ffffff' }}>
            <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ paddingBottom: '2px' }}>
                    <h1 style={{ margin: '0', fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }}>
                      {name}
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingBottom: '20px' }}>
                    <p style={{ margin: '0', fontSize: '14px', color: primaryColor, fontWeight: '700' }}>
                      {title}
                    </p>
                  </td>
                </tr>

                {/* Contact Table */}
                <tr>
                  <td>
                    <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                      <tbody>
                        {(phone || mobile) && (
                          <tr>
                            <td style={{ paddingBottom: '8px' }}>
                              <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                                <tbody>
                                  <tr>
                                    <td style={{ paddingRight: '12px' }}>
                                      <SocialIcon platform="phone" url={`tel:${phone || mobile}`} size={20} bgColor="#f1f5f9" />
                                    </td>
                                    <td style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                                      {phone || mobile}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td style={{ paddingBottom: '8px' }}>
                            <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                              <tbody>
                                <tr>
                                  <td style={{ paddingRight: '12px' }}>
                                    <SocialIcon platform="email" url={`mailto:${email}`} size={20} bgColor="#f1f5f9" />
                                  </td>
                                  <td style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                                    <a href={`mailto:${email}`} style={{ color: '#0f172a', textDecoration: 'none' }}>{email}</a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        {website && (
                          <tr>
                            <td style={{ paddingBottom: '20px' }}>
                              <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                                <tbody>
                                  <tr>
                                    <td style={{ paddingRight: '12px' }}>
                                      <SocialIcon platform="website" url={website} size={20} bgColor="#f1f5f9" />
                                    </td>
                                    <td style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                                      <a href={website} style={{ color: primaryColor, textDecoration: 'none', fontWeight: '800' }}>{website.replace(/^https?:\/\//, '')}</a>
                                    </td>
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

                {/* Social Footer */}
                {socialLinks.length > 0 && (
                  <tr>
                    <td>
                      <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                        <tbody>
                          <tr>
                            {socialLinks.map((link, idx) => (
                              <td key={idx} style={{ paddingRight: '8px' }}>
                                <SocialIcon platform={link.platform} url={link.url} size={22} bgColor="#0f172a" />
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

export default CorporateTemplate;
