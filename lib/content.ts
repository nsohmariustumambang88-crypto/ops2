export const CONTENT_KINDS = {
  blog: 'Blog post',
  case_study: 'Case study',
  industry: 'Industry',
  solution: 'Solution',
  white_paper: 'White paper',
  tariff_update: 'Tariff update',
} as const;

export type ContentKind = keyof typeof CONTENT_KINDS;

export function isContentKind(value: string): value is ContentKind {
  return Object.prototype.hasOwnProperty.call(CONTENT_KINDS, value);
}

export const ENQUIRY_KINDS = ['contact', 'quote', 'ship_now', 'business_account'] as const;

export function pickContentFields(body: Record<string, unknown>) {
  const str = (v: unknown) => (v === undefined || v === null || String(v).trim() === '' ? null : String(v).trim());
  return {
    title: str(body.title),
    summary: str(body.summary),
    body: str(body.body),
    image_url: str(body.image_url),
    link_url: str(body.link_url),
    published: body.published === undefined ? true : Boolean(body.published),
    sort_order: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0,
  };
}
