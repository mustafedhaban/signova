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
    primaryColor = '#7C3AED',
    fontFamily = 'Arial',
  } = data;

  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily }}>
      <tbody>
        <tr>
          <td>
            {/* Gradient top bar */}
            <table cellPadding="0" cellSpacing="0" style={{ width: '100%', marginBottom: '12px' }}>
              <tbody>
                <tr>
                  <td style={{ height: '5px', background: `linear-gradient(90deg, ${primaryColor}, #EC4899, #F59E0B)`, display: 'block', borderRadius: '3px' }}></td>
                </tr>
              </tbody>
            </table>

            <table cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  {logoUrl && (
                    <td style={{ verticalAlign: 'top', paddingRight: '14px' }}>
                      <img src={logoUrl} width="70" style={{ display: 'block', maxWidth: '70px', borderRadius: '50%', border: `2px solid ${primaryColor}` }} alt="Logo" />
                    </td>
                  )}
                  <td style={{ verticalAlign: 'top' }}>
                    <p style={{ margin: '0 0 1px 0', fontSize: '19px', fontWeight: 'bold', color: '#1F2937' }}>{name}</p>
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: primaryColor, fontWeight: '600' }}>
                      {title}{company ? ` @ ${company}` : ''}
                    </p>

                    <table cellPadding="0" cellSpacing="0">
                      <tbody>
                        {phone && (
                          <tr>
                            <td style={{ fontSize: '12px', color: '#6B7280', paddingRight: '12px', paddingBottom: '2px' }}>📞 {phone}</td>
                          </tr>
                        )}
                        {mobile && (
                          <tr>
                            <td style={{ fontSize: '12px', color: '#6B7280', paddingRight: '12px', paddingBottom: '2px' }}>📱 {mobile}</td>
                          </tr>
                        )}
                        <tr>
                          <td style={{ paddingBottom: '2px' }}>
                            <a href={`mailto:${email}`} style={{ fontSize: '12px', color: primaryColor, textDecoration: 'none' }}>{email}</a>
                          </td>
                        </tr>
                        {website && (
                          <tr>
                            <td>
                              <a href={website} style={{ fontSize: '12px', color: primaryColor, textDecoration: 'none' }}>{website.replace(/^https?:\/\//, '')}</a>
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
                                <SocialIcon platform={link.platform} url={link.url} size={24} bgColor={primaryColor} />
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

export default CreativeTemplate;
