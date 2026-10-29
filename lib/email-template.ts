import { SERVICE_EMAIL } from '@/lib/site';

export type EmailSection = { title: string; rows: [string, string][] };

export type EmailModel = {
  heading: string;
  intro: string[];
  sections?: EmailSection[];
  button?: { label: string; url: string };
  footer?: string;
};

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Builds the HTML and plain-text versions of an email with the same content, so both read alike.
export function renderEmail(model: EmailModel) {
  const footer = model.footer ?? `OPS Logistics · ${SERVICE_EMAIL}`;

  const sectionsHtml = (model.sections ?? [])
    .map((s) => `
      <tr><td style="padding:18px 28px 6px;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#1173D4;">${escapeHtml(s.title)}</td></tr>
      ${s.rows
        .filter(([, value]) => value && value.trim() && value !== '—')
        .map(([label, value]) => `
        <tr>
          <td style="padding:6px 28px;font-size:14px;color:#666666;width:40%;vertical-align:top;border-bottom:1px dashed #D5DFEC;">${escapeHtml(label)}</td>
          <td style="padding:6px 28px;font-size:14px;font-weight:700;color:#0B2C5F;text-align:right;vertical-align:top;border-bottom:1px dashed #D5DFEC;">${escapeHtml(value)}</td>
        </tr>`)
        .join('')}`)
    .join('');

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#E3E9F2;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#E3E9F2;padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr><td style="background:#0B2C5F;color:#ffffff;text-align:center;padding:20px 16px;">
            <div style="font-size:16px;font-weight:800;letter-spacing:3px;color:#ffffff;">OPS LOGISTICS</div>
            <div style="font-size:11px;letter-spacing:2px;color:#ffffff;opacity:0.8;">SHIPMENT RECEIPT</div>
          </td></tr>
          <tr><td style="padding:28px 28px 8px;">
            <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;color:#0B2C5F;">${escapeHtml(model.heading)}</h1>
            ${model.intro.map((p) => `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#1A1A1A;">${escapeHtml(p)}</p>`).join('')}
          </td></tr>
          ${sectionsHtml}
          ${model.button ? `
          <tr><td align="center" style="padding:24px 28px 8px;">
            <a href="${escapeHtml(model.button.url)}" style="display:inline-block;background:#1173D4;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 24px;border-radius:8px;">${escapeHtml(model.button.label)}</a>
          </td></tr>` : ''}
          <tr><td style="padding:20px 28px 26px;font-size:12px;line-height:1.5;color:#666666;text-align:center;">
            ${escapeHtml(footer)}
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  const lines: string[] = [model.heading, ''];
  for (const p of model.intro) lines.push(p, '');
  for (const s of model.sections ?? []) {
    const rows = s.rows.filter(([, value]) => value && value.trim() && value !== '—');
    if (rows.length === 0) continue;
    lines.push(s.title.toUpperCase());
    for (const [label, value] of rows) lines.push(`${label}: ${value}`);
    lines.push('');
  }
  if (model.button) lines.push(`${model.button.label}: ${model.button.url}`, '');
  lines.push(footer);

  return { html, text: lines.join('\n') };
}
