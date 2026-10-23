'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import { CONTENT_KINDS, type ContentKind } from '@/lib/content';

type Item = {
  id: number;
  kind: ContentKind;
  title: string;
  summary: string | null;
  body: string | null;
  image_url: string | null;
  link_url: string | null;
  created_at: string;
};

export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>('loading');

  useEffect(() => {
    fetch(`/api/content/item/${encodeURIComponent(id)}`)
      .then((r) => {
        if (!r.ok) throw new Error('missing');
        return r.json();
      })
      .then((j: Item) => {
        setItem(j);
        setStatus('ready');
      })
      .catch(() => setStatus('missing'));
  }, [id]);

  if (status === 'loading') {
    return <Container><p className='py-24 text-center text-text-secondary'>Loading...</p></Container>;
  }

  if (status === 'missing' || !item) {
    return (
      <Container>
        <div className='py-24 text-center'>
          <h1 className='text-[36px] font-extrabold text-navy mb-4'>This page is not available.</h1>
          <Link href='/' className='font-bold text-primary'>Back to the home page</Link>
        </div>
      </Container>
    );
  }

  const paragraphs = (item.body ?? '').split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <article className='py-16 md:py-20 bg-white'>
      <Container>
        <div className='mx-auto max-w-[760px]'>
          <p className='text-xs font-bold uppercase tracking-widest text-primary mb-3'>{CONTENT_KINDS[item.kind]}</p>
          <h1 className='text-[40px] md:text-[52px] font-extrabold text-navy mb-4'>{item.title}</h1>
          {item.summary && <p className='text-[20px] text-text-secondary mb-8'>{item.summary}</p>}
          {item.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image_url} alt='' className='w-full rounded-xl mb-8' />
          )}
          <div className='space-y-5 text-[17px] leading-relaxed text-text-primary'>
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {item.link_url && (
            <a href={item.link_url} className='inline-flex mt-10 h-[42px] px-6 items-center rounded bg-primary text-white font-bold'>
              Read more
            </a>
          )}
        </div>
      </Container>
    </article>
  );
}
