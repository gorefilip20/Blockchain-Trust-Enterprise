import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const db = getDb();

  const doc = db.prepare(
    'SELECT * FROM documents WHERE download_url_token = ?'
  ).get(token) as { id: string; name: string; raw_markdown_content: string | null; status: string } | undefined;

  if (!doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  if (!doc.raw_markdown_content) {
    return NextResponse.json({ error: 'No content available for download' }, { status: 404 });
  }

  db.prepare(
    "UPDATE documents SET status = 'downloaded', downloaded_at = datetime('now'), updated_at = datetime('now') WHERE id = ?"
  ).run(doc.id);

  const filename = `${doc.name.replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_')}.md`;

  return new NextResponse(doc.raw_markdown_content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
