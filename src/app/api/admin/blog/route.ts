import { NextRequest, NextResponse } from 'next/server';
import { getDb, uuidv4 } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bte-platform-secret-key-2024';

function verifyAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(authHeader.slice(7), JWT_SECRET) as { adminId: string; username: string; role: string };
  } catch {
    return null;
  }
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();
  const posts = db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { title, excerpt, content, author, category, status } = await req.json();
  if (!title || !content) return NextResponse.json({ error: 'Title and content required' }, { status: 400 });
  const db = getDb();
  const id = uuidv4();
  const slug = slugify(title) + '-' + id.slice(0, 6);
  db.prepare('INSERT INTO blog_posts (id, title, slug, excerpt, content, author, category, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(id, title, slug, excerpt || '', content, author || 'BTE Research', category || 'Insights', status || 'draft');
  return NextResponse.json({ success: true, id });
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, title, excerpt, content, author, category, status } = await req.json();
  if (!id) return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
  const db = getDb();
  db.prepare('UPDATE blog_posts SET title = COALESCE(?, title), excerpt = COALESCE(?, excerpt), content = COALESCE(?, content), author = COALESCE(?, author), category = COALESCE(?, category), status = COALESCE(?, status), updated_at = datetime(\'now\') WHERE id = ?').run(title, excerpt, content, author, category, status, id);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
  const db = getDb();
  db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
