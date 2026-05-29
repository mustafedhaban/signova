import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';

/** Collapse app sidebar to icon rail while the builder is open. */
export function BuilderSidebarEffect() {
  const location = useLocation();
  const { setOpen } = useSidebar();
  const isBuilder = location.pathname.startsWith('/builder');

  useEffect(() => {
    if (!isBuilder) return;
    setOpen(false);
    return () => setOpen(true);
  }, [isBuilder, setOpen]);

  return null;
}
