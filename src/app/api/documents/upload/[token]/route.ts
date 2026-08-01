import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const db = getDb();

  const doc = db.prepare(
    'SELECT * FROM documents WHERE download_url_token = ?'
  ).get(token) as { id: string } | undefined;

  if (!doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('signedAgreement') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'data', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.name) || '.pdf';
    const filename = `signed_${doc.id}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    db.prepare(
      "UPDATE documents SET status = 'submitted', uploaded_signed_file_url = ?, submitted_at = datetime('now'), updated_at = datetime('now') WHERE id = ?"
    ).run(filePath, doc.id);

    return NextResponse.json({
      success: true,
      message: 'Signed agreement successfully submitted. A platform agent has been assigned for verification.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
