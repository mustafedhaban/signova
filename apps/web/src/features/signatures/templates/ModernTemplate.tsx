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
    primaryColor = '#2563EB',
    fontFamily = 'Arial',
  } = data;

  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily, fontSize: 'medium' }}>
      <tbody>
        <tr>
          <td>
            {/* Top accent bar */}
            <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td style={{ backgroundColor: primaryColor, height: '4px', display: 'block', width: '100%' }}></td>
                </tr>
              </tbody>
            </table>

            <table cellPadding="0" cellSpacing="0" style={{ marginTop: '12px' }}>
              <tbody>
                <tr>
                  {/* Left: logo */}
                  {logoUrl && (
                    <td style={{ verticalAlign: 'top', paddingRight: '16px' }}>
                      <img src={logoUrl} width="80" style={{ display: 'block', maxWidth: '80px', borderRadius: '6px' }} alt="Logo" />
                    </td>
                  )}
                  {/* Right: info */}
                  <td style={{ verticalAlign: 'top' }}>
                    <p style={{ margin: '0 0 2px 0', fontSize: '20px', fontWeight: 'bold', color: '#111827', letterSpacing: '-0.3px' }}>
                      {name}
                    </p>
                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: primaryColor, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {title}{company ? ` · ${company}` : ''}
                    </p>

                    {/* Divider */}
                    <table cellPadding="0" cellSpacing="0" style={{ width: '100%', marginBottom: '8px' }}>
                      <tbody>
                        <tr>
                          <td style={{ borderBottom: '1px solid #E5E7EB', display: 'block' }}></td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Contact row */}
                    <table cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          {phone && (
                            <td style={{ paddingRight: '16px', fontSize: '13px', color: '#6B7280' }}>
                              📞 <span style={{ color: '#374151' }}>{phone}</span>
                            </td>
                          )}
                          {mobile && (
                            <td style={{ paddingRight: '16px', fontSize: '13px', color: '#6B7280' }}>
                              📱 <span style={{ color: '#374151' }}>{mobile}</span>
                            </td>
                          )}
                          <td style={{ paddingRight: '16px', fontSize: '13px' }}>
                            <a href={`mailto:${email}`} style={{ color: primaryColor, textDecoration: 'none' }}>{email}</a>
                          </td>
                          {website && (
                            <td style={{ fontSize: '13px' }}>
                              <a href={website} style={{ color: primaryColor, textDecoration: 'none' }}>{website.replace(/^https?:\/\//, '')}</a>
                            </td>
                          )}
                        </tr>
                      </tbody>
                    </table>

                    {/* Social links */}
                    {socialLinks.length > 0 && (
                      <table cellPadding="0" cellSpacing="0" style={{ marginTop: '8px' }}>
                        <tbody>
                          <tr>
                            {socialLinks.map((link, idx) => (
                              <td key={idx} style={{ paddingRight: '6px' }}>
                                <SocialIcon platform={link.platform} url={link.url} size={26} />
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
