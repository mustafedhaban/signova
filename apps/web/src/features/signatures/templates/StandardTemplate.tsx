import React from 'react';
import { ISignature } from '@signova/types';
import { SocialIcon } from './socialIcons';

const StandardTemplate: React.FC<{ data: Partial<ISignature> }> = ({ data }) => {
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
    <table cellPadding="0" cellSpacing="0" style={{ verticalAlign: 'middle', borderCollapse: 'collapse', fontFamily }}>
      <tbody>
        <tr>
          <td style={{ padding: '0px' }}>
            <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  {/* Left Column: Logo */}
                  <td style={{ verticalAlign: 'top', paddingRight: '24px', borderRight: `2px solid ${primaryColor}22` }}>
                    <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td align="center">
                            {logoUrl ? (
                              <img src={logoUrl} width="80" height="80" style={{ display: 'block', borderRadius: '12px', objectFit: 'cover' }} alt="Logo" />
                            ) : (
                              <div style={{ width: '80px', height: '80px', backgroundColor: `${primaryColor}11`, borderRadius: '12px', border: `1px dashed ${primaryColor}44` }} />
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>

                  {/* Right Column: Content */}
                  <td style={{ verticalAlign: 'top', paddingLeft: '24px' }}>
                    <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td style={{ paddingBottom: '4px' }}>
                            <h2 style={{ margin: '0px', fontSize: '20px', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.02em' }}>
                              {name}
                            </h2>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ paddingBottom: '16px' }}>
                            <p style={{ margin: '0px', fontSize: '13px', fontWeight: '600', color: primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {title} <span style={{ color: '#cbd5e1', margin: '0 4px' }}>|</span> {company}
                            </p>
                          </td>
                        </tr>
                        
                        {/* Contact Rows */}
                        <tr>
                          <td>
                            <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                              <tbody>
                                {(phone || mobile) && (
                                  <tr>
                                    <td style={{ paddingBottom: '6px' }}>
                                      <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                                        <tbody>
                                          <tr>
                                            <td style={{ paddingRight: '12px' }}>
                                              <SocialIcon platform="phone" url={`tel:${phone || mobile}`} size={20} bgColor={primaryColor} />
                                            </td>
                                            <td>
                                              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{phone || mobile}</span>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                )}
                                <tr>
                                  <td style={{ paddingBottom: '6px' }}>
                                    <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                                      <tbody>
                                        <tr>
                                          <td style={{ paddingRight: '12px' }}>
                                            <SocialIcon platform="email" url={`mailto:${email}`} size={20} bgColor={primaryColor} />
                                          </td>
                                          <td>
                                            <a href={`mailto:${email}`} style={{ textDecoration: 'none', color: '#0f172a', fontSize: '13px', fontWeight: '600' }}>{email}</a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                                {website && (
                                  <tr>
                                    <td style={{ paddingBottom: '12px' }}>
                                      <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                                        <tbody>
                                          <tr>
                                            <td style={{ paddingRight: '12px' }}>
                                              <SocialIcon platform="website" url={website} size={20} bgColor={primaryColor} />
                                            </td>
                                            <td>
                                              <a href={website} style={{ textDecoration: 'none', color: primaryColor, fontSize: '13px', fontWeight: '800' }}>{website.replace(/^https?:\/\//, '')}</a>
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

                        {/* Social Icons */}
                        {socialLinks.length > 0 && (
                          <tr>
                            <td>
                              <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                                <tbody>
                                  <tr>
                                    {socialLinks.map((link, idx) => (
                                      <td key={idx} style={{ paddingRight: '8px' }}>
                                        <SocialIcon platform={link.platform} url={link.url} size={22} bgColor={primaryColor} />
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

export default StandardTemplate;
