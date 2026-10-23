'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import type { ContentKind } from '@/lib/content';

type Item = { id: number; title: string; summary: string | null; image_url: string | null };

// Published entries from the admin panel for one content type. Renders nothing when there are none.
export default function ContentList({ kind, heading }: { kind: ContentKind; heading: string }) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let active = true;
    fetch(`/api/content/${kind}`)
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j) => { if (active) setItems(j.data ?? []); })
      .catch(() => { if (active) setItems([]); });
    return () => { active = false; };
  }, [kind]);

  if (items.length === 0) return null;

  return (
    <section className='py-12 md:py-16 bg-white'>
      <Container>
        <h2 className='text-[32px] md:text-[36px] font-extrabold text-navy mb-8'>{heading}</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {items.map((item) => (
            <Link key={item.id} href={`/content/${item.id}`} className='block border border-border rounded-xl overflow-hidden bg-white hover:shadow-medium transition-shadow'>
              {item.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt='' className='w-full h-[180px] object-cover' />
              )}
              <div className='p-5'>
                <h3 className='text-[20px] font-extrabold text-navy mb-2'>{item.title}</h3>
                {item.summary && <p className='text-[15px] text-text-secondary'>{item.summary}</p>}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
