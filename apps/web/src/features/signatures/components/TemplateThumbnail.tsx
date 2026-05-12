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
      className={`group w-full border-2 rounded-2xl overflow-hidden text-left transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20 ${
        selected
          ? 'border-primary ring-2 ring-primary/10 shadow-lg shadow-primary/10'
          : 'border-border/60 hover:border-primary/40 hover:shadow-md'
      }`}
    >
      {/* Thumbnail preview */}
      <div
        ref={containerRef}
        className="relative bg-white overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
        style={{ height: '110px' }}
        aria-hidden="true"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: '600px',
            pointerEvents: 'none',
            userSelect: 'none',
            padding: '24px',
          }}
        >
          <template.component data={PREVIEW_DATA} />
        </div>
        {selected && (
          <div className="absolute inset-0 bg-primary/5 border-b-2 border-primary/20" />
        )}
      </div>

      {/* Label */}
      <div className={`px-4 py-3 border-t-2 transition-colors duration-300 ${selected ? 'bg-primary/5 border-primary/10' : 'bg-muted/20 border-border/40 group-hover:bg-primary/5'}`}>
        <p className={`text-xs font-bold truncate tracking-tight ${selected ? 'text-primary' : 'text-foreground'}`}>
          {template.name}
        </p>
        <p className="text-[10px] font-medium text-muted-foreground truncate mt-0.5 opacity-80">{template.description}</p>
      </div>
    </button>
  );
};

export default TemplateThumbnail;
