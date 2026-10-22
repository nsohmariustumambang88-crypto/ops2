'use client';

import { useEffect, useRef, useState } from 'react';
import { countriesByRegion, type Region } from '@/lib/countries';

export default function CountrySelector() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('United States');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const q = query.trim().toLowerCase();
  const regions = (Object.keys(countriesByRegion) as Region[]).map((region) => ({
    region,
    names: countriesByRegion[region].filter((n) => n.toLowerCase().includes(q)),
  })).filter((g) => g.names.length > 0);

  return (
    <div ref={ref} className='relative'>
      <button
        type='button'
        aria-haspopup='listbox'
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className='flex items-center gap-2 h-[30px] px-3 border border-border rounded text-[12px] text-text-primary bg-white hover:bg-light-gray transition-colors'
      >
        {selected}
        <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {open && (
        <div className='absolute right-0 top-[36px] z-50 w-[300px] bg-white border border-border rounded-xl shadow-deep p-3'>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search countries'
            className='w-full h-[34px] px-3 border border-border rounded text-[13px]'
          />
          <div role='listbox' className='mt-3 max-h-[360px] overflow-y-auto'>
            {regions.map((g) => (
              <div key={g.region} className='mb-3'>
                <p className='text-[11px] font-bold uppercase tracking-wider text-primary mb-1'>{g.region}</p>
                {g.names.map((name) => (
                  <button
                    key={name}
                    type='button'
                    role='option'
                    aria-selected={name === selected}
                    onClick={() => {
                      setSelected(name);
                      setOpen(false);
                      setQuery('');
                    }}
                    className={`block w-full text-left px-2 py-1.5 rounded text-[13px] hover:bg-light-gray ${name === selected ? 'font-bold text-primary' : 'text-text-primary'}`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            ))}
            {regions.length === 0 && <p className='text-[13px] text-text-secondary px-2 py-2'>No matching country.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
