import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { uploadFile, deleteFile, uploadSignature } from '@/lib/cloudinary';

type Ctx = { params: Promise<{ path: string[] }> };

const fail = (msg: string, status = 500) => NextResponse.json({ error: msg }, { status });

async function ownsShipment(shipmentId: string, userId: string) {
  const r = await db.query('SELECT id FROM shipments WHERE id = $1 AND user_id = $2', [shipmentId, userId]);
  return r.rows.length > 0;
}

export async function GET(request: Request, { params }: Ctx) {
  const auth = requireUser(request);
  if ('error' in auth) return fail(auth.error, auth.status);
  const path = (await params).path.join('/');

  try {
    if (path === 'signature') return NextResponse.json(uploadSignature());

    if (path === 'documents') {
      const r = await db.query(
        `SELECT id, document_type, file_url, file_name, file_size, created_at
         FROM documents WHERE user_id = $1 ORDER BY created_at DESC`,
        [auth.user.id]
      );
      return NextResponse.json({ documents: r.rows });
    }

    const m = path.match(/^shipment-images\/([^/]+)$/);
    if (m) {
      if (!(await ownsShipment(m[1], auth.user.id))) return fail('Unauthorized access to shipment', 403);
      const r = await db.query(
        'SELECT id, image_url, created_at FROM shipment_images WHERE shipment_id = $1 ORDER BY created_at DESC',
        [m[1]]
      );
      return NextResponse.json({ images: r.rows });
    }

    return fail('Not found', 404);
  } catch {
    return fail('Request failed');
  }
}

export async function POST(request: Request, { params }: Ctx) {
  const auth = requireUser(request);
  if ('error' in auth) return fail(auth.error, auth.status);
  const path = (await params).path.join('/');

  try {
    if (path === 'document') {
      const form = await request.formData();
      const file = form.get('file');
      if (!(file instanceof File)) return fail('No file uploaded', 400);
      const documentType = String(form.get('document_type') || 'general');
      const up = await uploadFile(file);
      const r = await db.query(
        `INSERT INTO documents (user_id, document_type, file_url, file_name, file_size, cloudinary_id)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, file_url, file_name`,
        [auth.user.id, documentType, up.secure_url, up.original_name, up.size, up.public_id]
      );
      return NextResponse.json({ message: 'Document uploaded successfully', document: r.rows[0] }, { status: 201 });
    }

    const m = path.match(/^shipment-images\/([^/]+)$/);
    if (m) {
      if (!(await ownsShipment(m[1], auth.user.id))) return fail('Unauthorized access to shipment', 403);
      const form = await request.formData();
      const files = form.getAll('files').filter((f): f is File => f instanceof File);
      if (files.length === 0) return fail('No files uploaded', 400);
      const images = [];
      for (const file of files.slice(0, 10)) {
        const up = await uploadFile(file);
        const r = await db.query(
          `INSERT INTO shipment_images (shipment_id, image_url, cloudinary_id)
           VALUES ($1, $2, $3) RETURNING id, image_url`,
          [m[1], up.secure_url, up.public_id]
        );
        images.push(r.rows[0]);
      }
      return NextResponse.json(
        { message: `${images.length} images uploaded successfully`, images },
        { status: 201 }
      );
    }

    return fail('Not found', 404);
  } catch {
    return fail('Request failed');
  }
}

export async function DELETE(request: Request, { params }: Ctx) {
  const auth = requireUser(request);
  if ('error' in auth) return fail(auth.error, auth.status);
  const path = (await params).path.join('/');

  try {
    const m = path.match(/^documents\/([^/]+)$/);
    if (!m) return fail('Not found', 404);

    const r = await db.query(
      'SELECT cloudinary_id FROM documents WHERE id = $1 AND user_id = $2',
      [m[1], auth.user.id]
    );
    if (r.rows.length === 0) return fail('Document not found', 404);

    if (r.rows[0].cloudinary_id) await deleteFile(r.rows[0].cloudinary_id);
    await db.query('DELETE FROM documents WHERE id = $1', [m[1]]);
    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch {
    return fail('Request failed');
  }
}
