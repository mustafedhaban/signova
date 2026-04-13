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
    primaryColor = '#2563EB',
    fontFamily = 'Arial',
  } = data;

  // Derive a dark panel color from primaryColor by using it directly for the border
  return (
    <table cellPadding="0" cellSpacing="0" style={{ fontFamily, fontSize: 'medium', borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          {/* Left colored panel */}
          <td style={{ backgroundColor: '#1E3A5F', padding: '20px 16px', verticalAlign: 'top', textAlign: 'center', width: '120px' }}>
            {logoUrl ? (
              <img src={logoUrl} width="80" style={{ display: 'block', maxWidth: '80px', margin: '0 auto 12px auto', borderRadius: '4px' }} alt="Logo" />
            ) : (
              <div style={{ width: '80px', height: '80px', backgroundColor: '#2D5A8E', borderRadius: '4px', margin: '0 auto 12px auto' }} />
            )}
            <p style={{ margin: '0', fontSize: '11px', color: '#93C5FD', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {company}
            </p>
          </td>

          {/* Right content */}
          <td style={{ padding: '20px 20px', verticalAlign: 'top', borderLeft: `4px solid ${primaryColor}` }}>
            <p style={{ margin: '0 0 2px 0', fontSize: '20px', fontWeight: 'bold', color: '#1E3A5F' }}>
              {name}
            </p>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: primaryColor, fontWeight: '600' }}>
              {title}
            </p>

            {/* Contact details */}
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                {phone && (
                  <tr>
                    <td style={{ paddingBottom: '3px', paddingRight: '8px', fontSize: '12px', color: '#6B7280', width: '16px' }}>T</td>
                    <td style={{ paddingBottom: '3px', fontSize: '13px', color: '#374151' }}>{phone}</td>
                  </tr>
                )}
                {mobile && (
                  <tr>
                    <td style={{ paddingBottom: '3px', paddingRight: '8px', fontSize: '12px', color: '#6B7280', width: '16px' }}>M</td>
                    <td style={{ paddingBottom: '3px', fontSize: '13px', color: '#374151' }}>{mobile}</td>
                  </tr>
                )}
                <tr>
                  <td style={{ paddingBottom: '3px', paddingRight: '8px', fontSize: '12px', color: '#6B7280', width: '16px' }}>E</td>
                  <td style={{ paddingBottom: '3px' }}>
                    <a href={`mailto:${email}`} style={{ fontSize: '13px', color: primaryColor, textDecoration: 'none' }}>{email}</a>
                  </td>
                </tr>
                {website && (
                  <tr>
                    <td style={{ paddingRight: '8px', fontSize: '12px', color: '#6B7280', width: '16px' }}>W</td>
                    <td>
                      <a href={website} style={{ fontSize: '13px', color: primaryColor, textDecoration: 'none' }}>{website.replace(/^https?:\/\//, '')}</a>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <table cellPadding="0" cellSpacing="0" style={{ marginTop: '10px' }}>
                <tbody>
                  <tr>
                    {socialLinks.map((link, idx) => (
                      <td key={idx} style={{ paddingRight: '5px' }}>
                        <SocialIcon platform={link.platform} url={link.url} size={26} bgColor="#1E3A5F" />
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

export default CorporateTemplate;
