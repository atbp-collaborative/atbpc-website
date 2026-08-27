import { useState, useEffect } from 'react';

export function useCardLayout() {
  const [layout, setLayout] = useState<'col' | 'row'>('col');

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      if (w >= 1.05 * h) {
        setLayout('row');
      } else {
        setLayout('col');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return layout;
}
