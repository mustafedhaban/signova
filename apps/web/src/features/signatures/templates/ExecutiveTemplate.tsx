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
    primaryColor = '#B8860B',
    fontFamily = 'Georgia, serif',
  } = data;

  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily, borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          <td style={{ padding: '16px 20px', borderLeft: `3px solid ${primaryColor}`, backgroundColor: '#FAFAF8' }}>
            {/* Name + title */}
            <p style={{ margin: '0 0 2px 0', fontSize: '20px', fontWeight: 'bold', color: '#1C1C1C', letterSpacing: '0.3px' }}>{name}</p>
            <p style={{ margin: '0 0 2px 0', fontSize: '13px', color: primaryColor, fontStyle: 'italic', letterSpacing: '0.5px' }}>{title}</p>
            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px' }}>{company}</p>

            {/* Divider */}
            <table cellPadding="0" cellSpacing="0" style={{ width: '100%', marginBottom: '10px' }}>
              <tbody>
                <tr>
                  <td style={{ borderBottom: `1px solid ${primaryColor}`, display: 'block' }}></td>
                </tr>
              </tbody>
            </table>

            {/* Contact + logo row */}
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  <td style={{ verticalAlign: 'top', paddingRight: '20px' }}>
                    <table cellPadding="0" cellSpacing="0">
                      <tbody>
                        {phone && (
                          <tr>
                            <td style={{ fontSize: '12px', color: '#555', paddingBottom: '3px', paddingRight: '6px', fontStyle: 'italic' }}>T:</td>
                            <td style={{ fontSize: '12px', color: '#333', paddingBottom: '3px' }}>{phone}</td>
                          </tr>
                        )}
                        {mobile && (
                          <tr>
                            <td style={{ fontSize: '12px', color: '#555', paddingBottom: '3px', paddingRight: '6px', fontStyle: 'italic' }}>M:</td>
                            <td style={{ fontSize: '12px', color: '#333', paddingBottom: '3px' }}>{mobile}</td>
                          </tr>
                        )}
                        <tr>
                          <td style={{ fontSize: '12px', color: '#555', paddingBottom: '3px', paddingRight: '6px', fontStyle: 'italic' }}>E:</td>
                          <td style={{ paddingBottom: '3px' }}>
                            <a href={`mailto:${email}`} style={{ fontSize: '12px', color: primaryColor, textDecoration: 'none' }}>{email}</a>
                          </td>
                        </tr>
                        {website && (
                          <tr>
                            <td style={{ fontSize: '12px', color: '#555', paddingRight: '6px', fontStyle: 'italic' }}>W:</td>
                            <td>
                              <a href={website} style={{ fontSize: '12px', color: primaryColor, textDecoration: 'none' }}>{website.replace(/^https?:\/\//, '')}</a>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                  {logoUrl && (
                    <td style={{ verticalAlign: 'middle' }}>
                      <img src={logoUrl} width="70" style={{ display: 'block', maxWidth: '70px', opacity: 0.85 }} alt="Logo" />
                    </td>
                  )}
                </tr>
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
  );
};

export default ExecutiveTemplate;
