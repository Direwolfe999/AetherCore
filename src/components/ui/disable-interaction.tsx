'use client';

import { useEffect } from 'react';

export function DisableInteraction() {
  useEffect(() => {
    // Disable right click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    // Completely disable text selection and dragging
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    // Prevent default drag behaviors for images/links
    const handleDragStart = (e: DragEvent) => e.preventDefault();
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.body.style.userSelect = 'auto';
      document.body.style.webkitUserSelect = 'auto';
    };
  }, []);

  return null;
}
