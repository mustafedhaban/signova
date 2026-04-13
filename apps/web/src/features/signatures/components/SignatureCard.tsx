import React, { useState } from 'react';
import { ISignature } from '@signova/types';
import { Mail, Phone, Globe, Trash2, Edit2, Check, Copy, Share2 } from 'lucide-react';
import { exportSignatureToHtml } from '../utils/export';

interface SignatureCardProps {
  signature: ISignature;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const SignatureCard: React.FC<SignatureCardProps> = ({ signature, onDelete, onEdit }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareCopied, setShareCopied] = useState(false);

  const handleCopyHtml = () => {
    const html = exportSignatureToHtml(signature);
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/signatures/${signature.id}/share`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setShareUrl(data.url);
      await navigator.clipboard.writeText(data.url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch {
      // fallback: just show nothing
    }
  };

  return (
    <div className="p-6 bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-primary">{signature.name}</h3>
          {signature.title && <p className="text-sm text-muted-foreground">{signature.title}</p>}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(signature.id)}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(signature.id)}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center text-sm text-muted-foreground">
          <Mail className="w-4 h-4 mr-2" />
          <span>{signature.email}</span>
        </div>
        {signature.phone && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="w-4 h-4 mr-2" />
            <span>{signature.phone}</span>
          </div>
        )}
        {signature.website && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Globe className="w-4 h-4 mr-2" />
            <span>{signature.website}</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          Updated {new Date(signature.updatedAt).toLocaleDateString()}
        </span>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className={`flex items-center text-sm font-medium transition-colors ${shareCopied ? 'text-green-600' : 'text-muted-foreground hover:text-blue-600'}`}
            title="Copy shareable link"
          >
            {shareCopied ? <Check className="w-4 h-4 mr-1" /> : <Share2 className="w-4 h-4 mr-1" />}
            {shareCopied ? 'Link copied!' : 'Share'}
          </button>
          <button
            onClick={handleCopyHtml}
            className={`flex items-center text-sm font-medium transition-colors ${copied ? 'text-green-600' : 'text-blue-600 hover:underline'}`}
          >
            {copied ? (
              <><Check className="w-4 h-4 mr-1" />Copied!</>
            ) : (
              <><Copy className="w-4 h-4 mr-1" />Copy HTML</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignatureCard;
