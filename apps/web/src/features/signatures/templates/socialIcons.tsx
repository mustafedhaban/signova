import React from 'react';
import { Linkedin, Twitter, Facebook, Instagram, Github, Globe, Mail, Phone, MapPin } from 'lucide-react';

export const socialColors: Record<string, string> = {
  linkedin: '#0A66C2',
  twitter: '#000000',
  facebook: '#1877F2',
  instagram: '#E4405F',
  github: '#181717',
};

const IconMap: Record<string, any> = {
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  github: Github,
  website: Globe,
  email: Mail,
  phone: Phone,
  address: MapPin,
};

interface SocialIconProps {
  platform: string;
  url: string;
  size?: number;
  bgColor?: string;
  iconColor?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ platform, url, size = 24, bgColor, iconColor }) => {
  const color = bgColor || socialColors[platform] || '#6366f1';
  const IconComponent = IconMap[platform.toLowerCase()];
  
  if (!IconComponent) return null;

  // Determine if background is light to set default icon color
  const isLightBg = ['#f1f5f9', '#ffffff', '#fafafa'].includes(color.toLowerCase()) || color.startsWith('rgba(255,255,255');
  const finalIconColor = iconColor || (isLightBg ? '#0f172a' : '#ffffff');

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-block',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: '50%',
        textDecoration: 'none',
        textAlign: 'center',
        lineHeight: `${size}px`,
        verticalAlign: 'middle',
      }}
    >
      <table cellPadding="0" cellSpacing="0" style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td align="center" valign="middle" style={{ padding: '0px', verticalAlign: 'middle' }}>
              <IconComponent 
                size={Math.round(size * 0.55)} 
                color={finalIconColor} 
                strokeWidth={2.5}
                style={{ display: 'block' }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </a>
  );
};
