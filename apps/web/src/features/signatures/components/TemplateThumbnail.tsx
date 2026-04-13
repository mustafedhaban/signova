import React, { useRef, useEffect, useState } from 'react';
import { ITemplate } from '../templates';
import { ISignature } from '@signova/types';

const PREVIEW_DATA: Partial<ISignature> = {
  name: 'Jane Smith',
  title: 'Marketing Director',
  company: 'Acme NGO',
  email: 'jane@acmengo.org',
  phone: '+1 555 000 1234',
  socialLinks: [],
};

interface TemplateThumbnailProps {
  template: ITemplate;
  selected: boolean;
  onClick: () => void;
}

const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({ template, selected, onClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.28);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      setScale(containerWidth / 600);
    }
  }, []);

  return (
    <button
      onClick={onClick}
      className={`w-full border rounded-lg overflow-hidden text-left transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        selected
          ? 'border-blue-600 ring-1 ring-blue-600 shadow-md'
          : 'border-border hover:border-blue-300 hover:shadow-sm'
      }`}
    >
      {/* Thumbnail preview */}
      <div
        ref={containerRef}
        className="relative bg-white overflow-hidden"
        style={{ height: '90px' }}
        aria-hidden="true"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: '600px',
            pointerEvents: 'none',
            userSelect: 'none',
            padding: '12px',
          }}
        >
          <template.component data={PREVIEW_DATA} />
        </div>
      </div>

      {/* Label */}
      <div className={`px-3 py-2 border-t ${selected ? 'bg-blue-50 border-blue-200' : 'bg-muted/40 border-border'}`}>
        <p className="text-xs font-semibold truncate">{template.name}</p>
        <p className="text-xs text-muted-foreground truncate">{template.description}</p>
      </div>
    </button>
  );
};

export default TemplateThumbnail;
