import React from 'react';
import { ISignature } from '@signova/types';
import { SocialIcon } from './socialIcons';

const CreativeTemplate: React.FC<{ data: Partial<ISignature> }> = ({ data }) => {
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
    fontFamily = "'Quicksand', 'Rounded Mplus 1c', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  } = data;

  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily, borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          <td>
            <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  {/* Left Column: Creative Logo Circle */}
                  <td style={{ verticalAlign: 'top', paddingRight: '24px' }}>
                    <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td align="center" style={{ backgroundColor: `${primaryColor}15`, borderRadius: '50%', padding: '12px' }}>
                            {logoUrl ? (
                              <img src={logoUrl} width="64" height="64" style={{ display: 'block', borderRadius: '50%', objectFit: 'cover' }} alt="Logo" />
                            ) : (
                              <div style={{ width: '64px', height: '64px', backgroundColor: primaryColor, borderRadius: '50%' }} />
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>

                  {/* Right Column: Bubbly Content */}
                  <td style={{ verticalAlign: 'middle' }}>
                    <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td style={{ paddingBottom: '2px' }}>
                            <p style={{ margin: '0', fontSize: '22px', fontWeight: '900', color: primaryColor, letterSpacing: '-0.01em' }}>{name}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ paddingBottom: '12px' }}>
                            <p style={{ margin: '0', fontSize: '13px', color: '#64748b', fontWeight: '700' }}>
                              {title} <span style={{ color: primaryColor }}>@</span> {company}
                            </p>
                          </td>
                        </tr>

                        {/* Creative Contact Pill */}
                        <tr>
                          <td style={{ paddingBottom: '16px' }}>
                            <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                              <tbody>
                                <tr>
                                  <td style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                                    <a href={`mailto:${email}`} style={{ color: '#0f172a', textDecoration: 'none' }}>{email}</a>
                                    {website && (
                                      <>
                                        <span style={{ margin: '0 8px', color: '#e2e8f0' }}>•</span>
                                        <a href={website} style={{ color: primaryColor, textDecoration: 'none', fontWeight: '800' }}>{website.replace(/^https?:\/\//, '')}</a>
                                      </>
                                    )}
                                  </td>
                                </tr>
                                {(phone || mobile) && (
                                  <tr>
                                    <td style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', paddingTop: '4px' }}>
                                      {phone || mobile}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </td>
                        </tr>

                        {/* Floating Social Icons */}
                        {socialLinks.length > 0 && (
                          <tr>
                            <td>
                              <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                                <tbody>
                                  <tr>
                                    {socialLinks.map((link, idx) => (
                                      <td key={idx} style={{ paddingRight: '12px' }}>
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

export default CreativeTemplate;
