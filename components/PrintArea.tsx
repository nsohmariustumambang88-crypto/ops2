'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

// Renders its children into a container directly under <body>. The screen hides that container and
// the print styles in globals.css hide everything else, so printing shows only these children.
export default function PrintArea({ children }: { children: ReactNode }) {
  const [node, setNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.createElement('div');
    el.id = 'print-area';
    document.body.appendChild(el);
    setNode(el);
    return () => el.remove();
  }, []);

  return node ? createPortal(children, node) : null;
}
