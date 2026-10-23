import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';

// Set NEXT_PUBLIC_SITE_URL to your public domain (for example https://opslogistic.com).
const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ops2-tawny.vercel.app').replace(/\/$/, '');

// Public pages. Add a path here when a new public page is built.
const staticPaths = [
  '/', '/track', '/quote', '/ship-now', '/request-business-account', '/contact',
  '/express-document-parcel', '/ops-global-forwarding', '/business-offerings',
  '/retailer-and-volume-shipper-options', '/refund-escrow',
  '/pet-shipping', '/pet-shipping-policy',
  '/about-us', '/careers', '/sustainability', '/innovation',
  '/customer-service', '/faq', '/service-updates',
  '/solutions', '/solutions/contract-logistics', '/solutions/ecommerce', '/solutions/customs',
  '/solutions/cold-chain', '/solutions/last-mile', '/solutions/freight',
  '/industries', '/industries/technology', '/industries/healthcare', '/industries/retail',
  '/industries/automotive', '/industries/energy',
  '/blog', '/case-studies', '/white-papers', '/tariff-updates',
  '/privacy-policy', '/terms-of-use', '/cookie-policy',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
  }));

  try {
    const r = await db.query('SELECT id, updated_at FROM site_content WHERE published = true ORDER BY id');
    for (const row of r.rows) {
      entries.push({ url: `${BASE}/content/${row.id}`, lastModified: new Date(row.updated_at) });
    }
  } catch {
    // The published content list is optional; the static pages still appear.
  }

  return entries;
}
