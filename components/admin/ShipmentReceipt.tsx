'use client';

import type { ShipmentValues } from '@/components/admin/ShipmentForm';

const val = (v: ShipmentValues, k: string) => (v[k] && String(v[k]).trim() ? String(v[k]) : '—');

function fmt(value?: string) {
  if (!value) return '—';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '—' : d.toLocaleString();
}

const modeLabel: Record<string, string> = { land: 'Land', air: 'Air', sea: 'Sea' };

export default function ShipmentReceipt({ values, reference }: { values: ShipmentValues; reference?: string }) {
  const address = (prefix: 'sender' | 'receiver') =>
    [val(values, `${prefix}_address`), val(values, `${prefix}_city`), val(values, `${prefix}_postal_code`), val(values, `${prefix}_country`)]
      .filter((x) => x !== '—')
      .join(', ') || '—';

  const row = (label: string, value: string) => (
    <div className='flex justify-between gap-4 py-1.5 text-[13px]'>
      <span className='text-text-secondary'>{label}</span>
      <span className='text-right font-bold text-navy break-words max-w-[60%]'>{value}</span>
    </div>
  );

  return (
    <div className='bg-white border border-border rounded-xl shadow-medium overflow-hidden font-mono'>
      <div className='bg-navy text-white text-center py-4'>
        <p className='text-[16px] font-extrabold tracking-widest'>OPS LOGISTICS</p>
        <p className='text-[11px] tracking-wider opacity-80'>SHIPPING RECEIPT</p>
      </div>

      <div className='px-5 py-4 border-b border-dashed border-border'>
        {row('Reference', reference || '—')}
        {row('Issued', new Date().toLocaleString())}
        {row('Transport', modeLabel[val(values, 'transport_mode')] ?? '—')}
        {row('Service', val(values, 'service_type').toUpperCase())}
        {row('Status', val(values, 'status').replace(/_/g, ' ').toUpperCase())}
      </div>

      <div className='px-5 py-4 border-b border-dashed border-border'>
        <p className='text-[11px] font-bold tracking-wider text-primary mb-1'>FROM (SENDER)</p>
        {row('Name', val(values, 'sender_name'))}
        {row('Email', val(values, 'sender_email'))}
        {row('Phone', val(values, 'sender_phone'))}
        {row('Address', address('sender'))}
      </div>

      <div className='px-5 py-4 border-b border-dashed border-border'>
        <p className='text-[11px] font-bold tracking-wider text-primary mb-1'>TO (RECEIVER)</p>
        {row('Name', val(values, 'receiver_name'))}
        {row('Email', val(values, 'receiver_email'))}
        {row('Phone', val(values, 'receiver_phone'))}
        {row('Address', address('receiver'))}
      </div>

      <div className='px-5 py-4 border-b border-dashed border-border'>
        <p className='text-[11px] font-bold tracking-wider text-primary mb-1'>ROUTE</p>
        {row('Carrier', val(values, 'carrier'))}
        {row('Flight / vessel', val(values, 'flight_number'))}
        {row('From', val(values, 'route_origin'))}
        {row('To', val(values, 'route_destination'))}
        {row('Departs', fmt(values.departure_at))}
        {row('Arrives', fmt(values.arrival_at))}
      </div>

      <div className='px-5 py-4 border-b border-dashed border-border'>
        <p className='text-[11px] font-bold tracking-wider text-primary mb-1'>PARCEL</p>
        {row('Type', val(values, 'shipment_type'))}
        {row('Weight', values.weight ? `${values.weight} kg` : '—')}
        {row('Dimensions', val(values, 'dimensions'))}
        {row('Priority', val(values, 'priority'))}
        {row('Contents', val(values, 'contents'))}
      </div>

      <div className='px-5 py-5'>
        <div className='h-10 border-b border-navy' />
        <p className='text-[11px] text-text-secondary mt-1'>Sender signature</p>
        <p className='text-[10px] text-text-secondary mt-3 leading-snug'>
          Keep this receipt. Track your shipment with the reference above.
        </p>
        <button
          type='button'
          onClick={() => window.print()}
          className='mt-4 w-full h-[40px] rounded border border-navy text-navy font-bold font-sans print:hidden'
        >
          Print receipt
        </button>
      </div>
    </div>
  );
}
