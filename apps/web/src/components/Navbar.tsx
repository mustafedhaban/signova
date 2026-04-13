import React from 'react';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  title: string;
  showNewButton?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ title, showNewButton = false }) => {
  const navigate = useNavigate();

  return (
    <header className="h-16 px-6 bg-card border-b shadow-sm sticky top-0 z-10 flex items-center justify-between shrink-0">
      <h2 className="text-lg font-bold text-primary">{title}</h2>
      {showNewButton && (
        <button
          onClick={() => navigate('/builder/new')}
          className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Signature</span>
        </button>
      )}
    </header>
  );
};

export default Navbar;
