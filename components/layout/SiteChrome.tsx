'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function SiteChrome({ header, footer, children }: { header: ReactNode; footer: ReactNode; children: ReactNode }) {
  const pathname = usePathname() ?? '';
  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }
  return (
    <>
      {header}
      {children}
      {footer}
    </>
  );
}
