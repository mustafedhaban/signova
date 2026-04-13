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
    primaryColor = '#000000',
    fontFamily = 'Arial',
  } = data;

  return (
    <table cellPadding="0" cellSpacing="0" style={{ verticalAlign: '-webkit-baseline-middle', fontSize: 'medium', fontFamily }}>
      <tbody>
        <tr>
          <td>
            <table cellPadding="0" cellSpacing="0" style={{ verticalAlign: '-webkit-baseline-middle', fontSize: 'medium', fontFamily }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: 'top' }}>
                    <table cellPadding="0" cellSpacing="0" style={{ verticalAlign: '-webkit-baseline-middle', fontSize: 'medium', fontFamily }}>
                      <tbody>
                        <tr>
                          <td style={{ textAlign: 'center' }}>
                            {logoUrl ? (
                              <img src={logoUrl} width="100" style={{ display: 'block', maxWidth: '100px' }} alt="Logo" />
                            ) : (
                              <div style={{ width: '100px', height: '100px', backgroundColor: '#eee', borderRadius: '8px' }} />
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td width="30"></td>
                  <td style={{ padding: '0px', verticalAlign: 'middle' }}>
                    <h3 style={{ margin: '0px', fontSize: '18px', color: primaryColor }}>
                      <span>{name}</span>
                    </h3>
                    <p style={{ margin: '0px', color: primaryColor, fontSize: '14px', lineHeight: '22px' }}>
                      <span>{title}</span>
                    </p>
                    <p style={{ margin: '0px', fontWeight: 'bold', color: primaryColor, fontSize: '14px', lineHeight: '22px' }}>
                      <span>{company}</span>
                    </p>
                    <table cellPadding="0" cellSpacing="0" style={{ verticalAlign: '-webkit-baseline-middle', fontSize: 'medium', fontFamily, width: '100%' }}>
                      <tbody>
                        <tr>
                          <td height="10"></td>
                        </tr>
                        <tr>
                          <td style={{ width: '100%', borderBottom: `1px solid ${primaryColor}`, borderLeft: 'none', display: 'block' }}></td>
                        </tr>
                        <tr>
                          <td height="10"></td>
                        </tr>
                      </tbody>
                    </table>
                    <table cellPadding="0" cellSpacing="0" style={{ verticalAlign: '-webkit-baseline-middle', fontSize: 'medium', fontFamily }}>
                      <tbody>
                        {phone && (
                          <tr style={{ verticalAlign: 'middle' }}>
                            <td width="20" style={{ verticalAlign: 'middle' }}>
                              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>T:</span>
                            </td>
                            <td style={{ padding: '0px' }}>
                              <span style={{ fontSize: '14px', color: primaryColor }}>{phone}</span>
                            </td>
                          </tr>
                        )}
                        {mobile && (
                          <tr style={{ verticalAlign: 'middle' }}>
                            <td width="20" style={{ verticalAlign: 'middle' }}>
                              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>M:</span>
                            </td>
                            <td style={{ padding: '0px' }}>
                              <span style={{ fontSize: '14px', color: primaryColor }}>{mobile}</span>
                            </td>
                          </tr>
                        )}
                        <tr style={{ verticalAlign: 'middle' }}>
                          <td width="20" style={{ verticalAlign: 'middle' }}>
                            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>E:</span>
                          </td>
                          <td style={{ padding: '0px' }}>
                            <a href={`mailto:${email}`} style={{ textDecoration: 'none', color: primaryColor, fontSize: '14px' }}>{email}</a>
                          </td>
                        </tr>
                        {website && (
                          <tr style={{ verticalAlign: 'middle' }}>
                            <td width="20" style={{ verticalAlign: 'middle' }}>
                              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>W:</span>
                            </td>
                            <td style={{ padding: '0px' }}>
                              <a href={website} style={{ textDecoration: 'none', color: primaryColor, fontSize: '14px' }}>{website}</a>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <table cellPadding="0" cellSpacing="0" style={{ verticalAlign: '-webkit-baseline-middle', fontSize: 'medium', fontFamily }}>
                      <tbody>
                        <tr>
                          <td height="10"></td>
                        </tr>
                        <tr style={{ verticalAlign: 'middle' }}>
                          {socialLinks.map((link, idx) => (
                            <td key={idx} style={{ paddingRight: '6px' }}>
                              <SocialIcon platform={link.platform} url={link.url} size={26} />
                            </td>
                          ))}
                        </tr>
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
