import React from 'react';
import { ISignature } from '@signova/types';
import { SocialIcon } from './socialIcons';

const ModernTemplate: React.FC<{ data: Partial<ISignature> }> = ({ data }) => {
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
          <td>
            {/* Minimalist Top Bar */}
            <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td style={{ backgroundColor: primaryColor, height: '3px', borderRadius: '4px', display: 'block', width: '60px' }}></td>
                </tr>
              </tbody>
            </table>

            <table cellPadding="0" cellSpacing="0" style={{ marginTop: '20px' }}>
              <tbody>
                <tr>
                  {/* Info Column */}
                  <td style={{ verticalAlign: 'top' }}>
                    <p style={{ margin: '0 0 2px 0', fontSize: '24px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.03em' }}>
                      {name}
                    </p>
                    <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                      {title} <span style={{ color: primaryColor, margin: '0 4px', fontWeight: '900' }}>/</span> {company}
                    </p>

                    {/* Horizontal Info Grid */}
                    <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          {logoUrl && (
                            <td style={{ verticalAlign: 'middle', paddingRight: '20px' }}>
                              <img src={logoUrl} width="56" height="56" style={{ display: 'block', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${primaryColor}11` }} alt="Logo" />
                            </td>
                          )}
                          <td style={{ verticalAlign: 'middle' }}>
                            <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                              <tbody>
                                <tr>
                                  <td style={{ paddingBottom: '6px' }}>
                                    <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                                      <tbody>
                                        <tr>
                                          <td style={{ paddingRight: '10px' }}>
                                            <SocialIcon platform="email" url={`mailto:${email}`} size={18} bgColor={primaryColor} />
                                          </td>
                                          <td>
                                            <a href={`mailto:${email}`} style={{ color: '#0f172a', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>{email}</a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                                {(phone || mobile) && (
                                  <tr>
                                    <td style={{ paddingBottom: '6px' }}>
                                      <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                                        <tbody>
                                          <tr>
                                            <td style={{ paddingRight: '10px' }}>
                                              <SocialIcon platform="phone" url={`tel:${phone || mobile}`} size={18} bgColor="#0f172a" />
                                            </td>
                                            <td>
                                              <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>{phone || mobile}</span>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                )}
                                {website && (
                                  <tr>
                                    <td>
                                      <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                                        <tbody>
                                          <tr>
                                            <td style={{ paddingRight: '10px' }}>
                                              <SocialIcon platform="website" url={website} size={18} bgColor={primaryColor} />
                                            </td>
                                            <td>
                                              <a href={website} style={{ color: primaryColor, textDecoration: 'none', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {website.replace(/^https?:\/\//, '')}
                                              </a>
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
                      </tbody>
                    </table>

                    {/* Social links - minimalist row */}
                    {socialLinks.length > 0 && (
                      <table cellPadding="0" cellSpacing="0" style={{ marginTop: '24px' }}>
                        <tbody>
                          <tr>
                            {socialLinks.map((link, idx) => (
                              <td key={idx} style={{ paddingRight: '10px' }}>
                                <SocialIcon platform={link.platform} url={link.url} size={20} bgColor="#0f172a" />
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

export default ModernTemplate;
