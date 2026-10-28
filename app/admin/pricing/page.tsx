'use client';

import { useEffect, useState, type FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

type Rule = {
  id: number;
  origin_country: string;
  destination_country: string;
  service_type: string;
  weight_min: string;
  weight_max: string;
  price_per_kg: string;
  price_per_shipment: string;
  surcharge: string;
};
type Discount = { id: number; customer_id: number; shipment_count_min: number; shipment_count_max: number; discount_percentage: string };
type Tariff = { id: number; country_code: string; hs_code: string; duty_percentage: string; tax_percentage: string; last_updated: string };

const input = 'mt-1 w-full h-[42px] px-3 border border-border rounded text-[15px]';
const emptyRule = { origin_country: '', destination_country: '', service_type: 'express', weight_min: '0', weight_max: '', price_per_kg: '', price_per_shipment: '', surcharge: '0' };

export default function PricingPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [rule, setRule] = useState(emptyRule);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const token = () => localStorage.getItem('adminToken') ?? '';
  const auth = () => ({ Authorization: `Bearer ${token()}` });

  const load = async () => {
    const [r, d, t] = await Promise.all([
      fetch('/api/pricing/rules').then((x) => (x.ok ? x.json() : [])),
      fetch('/api/pricing/discounts', { headers: auth() }).then((x) => (x.ok ? x.json() : [])),
      fetch('/api/pricing/tariffs').then((x) => (x.ok ? x.json() : [])),
    ]);
    setRules(Array.isArray(r) ? r : []);
    setDiscounts(Array.isArray(d) ? d : []);
    setTariffs(Array.isArray(t) ? t : []);
  };

  useEffect(() => {
    load().catch(() => setError('Could not load pricing.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addRule = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const res = await fetch('/api/pricing/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...auth() },
      body: JSON.stringify({
        ...rule,
        weight_min: Number(rule.weight_min) || 0,
        weight_max: Number(rule.weight_max) || null,
        price_per_kg: Number(rule.price_per_kg) || 0,
        price_per_shipment: Number(rule.price_per_shipment) || 0,
        surcharge: Number(rule.surcharge) || 0,
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error || 'Could not save the rule.');
      return;
    }
    setMessage('Pricing rule added.');
    setRule(emptyRule);
    load();
  };

  return (
    <AdminLayout>
      <div className='space-y-8'>
        <div>
          <h1 className='text-[36px] font-extrabold text-navy'>Pricing</h1>
          <p>Lane rates, volume discounts and tariff rates used when quoting.</p>
        </div>

        {message && <div role='status' className='rounded-xl border border-green-300 bg-green-50 text-green-800 px-5 py-4'>{message}</div>}
        {error && <div role='alert' className='rounded-xl border border-red-300 bg-red-50 text-red-800 px-5 py-4'>{error}</div>}

        <form onSubmit={addRule} className='bg-white border border-border rounded-xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4'>
          <h2 className='md:col-span-4 text-[22px] font-extrabold text-navy'>Add a lane rate</h2>
          <label><span className='text-[14px] font-bold'>From country</span><input required value={rule.origin_country} onChange={(e) => setRule({ ...rule, origin_country: e.target.value })} className={input} /></label>
          <label><span className='text-[14px] font-bold'>To country</span><input required value={rule.destination_country} onChange={(e) => setRule({ ...rule, destination_country: e.target.value })} className={input} /></label>
          <label><span className='text-[14px] font-bold'>Service</span>
            <select value={rule.service_type} onChange={(e) => setRule({ ...rule, service_type: e.target.value })} className={input}>
              <option value='express'>Express</option>
              <option value='standard'>Standard</option>
              <option value='economy'>Economy</option>
              <option value='freight'>Freight</option>
            </select>
          </label>
          <label><span className='text-[14px] font-bold'>Surcharge</span><input type='number' step='0.01' value={rule.surcharge} onChange={(e) => setRule({ ...rule, surcharge: e.target.value })} className={input} /></label>
          <label><span className='text-[14px] font-bold'>Weight from (kg)</span><input type='number' step='0.1' value={rule.weight_min} onChange={(e) => setRule({ ...rule, weight_min: e.target.value })} className={input} /></label>
          <label><span className='text-[14px] font-bold'>Weight to (kg)</span><input type='number' step='0.1' value={rule.weight_max} onChange={(e) => setRule({ ...rule, weight_max: e.target.value })} className={input} /></label>
          <label><span className='text-[14px] font-bold'>Price per kg</span><input type='number' step='0.01' value={rule.price_per_kg} onChange={(e) => setRule({ ...rule, price_per_kg: e.target.value })} className={input} /></label>
          <label><span className='text-[14px] font-bold'>Price per shipment</span><input type='number' step='0.01' value={rule.price_per_shipment} onChange={(e) => setRule({ ...rule, price_per_shipment: e.target.value })} className={input} /></label>
          <div className='md:col-span-4'>
            <button type='submit' className='h-[42px] px-6 rounded bg-primary text-white font-bold'>Add rule</button>
          </div>
        </form>

        <section className='bg-white border border-border rounded-xl overflow-x-auto'>
          <h2 className='px-5 py-4 text-[18px] font-extrabold text-navy border-b border-border'>Lane rates</h2>
          <table className='w-full text-left text-[14px]'>
            <thead className='bg-light-gray'><tr>
              <th className='px-4 py-3'>Route</th><th className='px-4 py-3'>Service</th><th className='px-4 py-3'>Weight (kg)</th><th className='px-4 py-3'>Per kg</th><th className='px-4 py-3'>Per shipment</th><th className='px-4 py-3'>Surcharge</th>
            </tr></thead>
            <tbody>
              {rules.length === 0 && <tr><td className='px-4 py-6' colSpan={6}>No lane rates yet.</td></tr>}
              {rules.map((r) => (
                <tr key={r.id} className='border-t border-border'>
                  <td className='px-4 py-3 font-bold text-navy'>{r.origin_country} → {r.destination_country}</td>
                  <td className='px-4 py-3 capitalize'>{r.service_type}</td>
                  <td className='px-4 py-3'>{r.weight_min} – {r.weight_max ?? 'any'}</td>
                  <td className='px-4 py-3'>${Number(r.price_per_kg).toFixed(2)}</td>
                  <td className='px-4 py-3'>${Number(r.price_per_shipment).toFixed(2)}</td>
                  <td className='px-4 py-3'>${Number(r.surcharge).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className='bg-white border border-border rounded-xl overflow-x-auto'>
          <h2 className='px-5 py-4 text-[18px] font-extrabold text-navy border-b border-border'>Volume discounts</h2>
          <table className='w-full text-left text-[14px]'>
            <thead className='bg-light-gray'><tr>
              <th className='px-4 py-3'>Customer</th><th className='px-4 py-3'>Shipments from</th><th className='px-4 py-3'>Shipments to</th><th className='px-4 py-3'>Discount</th>
            </tr></thead>
            <tbody>
              {discounts.length === 0 && <tr><td className='px-4 py-6' colSpan={4}>No volume discounts yet.</td></tr>}
              {discounts.map((d) => (
                <tr key={d.id} className='border-t border-border'>
                  <td className='px-4 py-3'>#{d.customer_id}</td>
                  <td className='px-4 py-3'>{d.shipment_count_min}</td>
                  <td className='px-4 py-3'>{d.shipment_count_max}</td>
                  <td className='px-4 py-3'>{Number(d.discount_percentage)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className='bg-white border border-border rounded-xl overflow-x-auto'>
          <h2 className='px-5 py-4 text-[18px] font-extrabold text-navy border-b border-border'>Tariff rates (duty and tax)</h2>
          <table className='w-full text-left text-[14px]'>
            <thead className='bg-light-gray'><tr>
              <th className='px-4 py-3'>Country</th><th className='px-4 py-3'>HS code</th><th className='px-4 py-3'>Duty</th><th className='px-4 py-3'>Tax</th><th className='px-4 py-3'>Updated</th>
            </tr></thead>
            <tbody>
              {tariffs.length === 0 && <tr><td className='px-4 py-6' colSpan={5}>No tariff rates loaded.</td></tr>}
              {tariffs.map((t) => (
                <tr key={t.id} className='border-t border-border'>
                  <td className='px-4 py-3'>{t.country_code}</td>
                  <td className='px-4 py-3'>{t.hs_code}</td>
                  <td className='px-4 py-3'>{Number(t.duty_percentage)}%</td>
                  <td className='px-4 py-3'>{Number(t.tax_percentage)}%</td>
                  <td className='px-4 py-3'>{new Date(t.last_updated).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AdminLayout>
  );
}
