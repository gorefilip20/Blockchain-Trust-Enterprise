import { NextRequest, NextResponse } from 'next/server';
import { getDb, uuidv4 } from '@/lib/db';
import crypto from 'crypto';
import {
  generateSubscriptionAgreement,
  generateOperatingAgreement,
  generateArticlesOfOrganization,
  generateCorporateTree,
} from '@/lib/templates';

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('client_id');
  const entityId = searchParams.get('entity_id');

  if (entityId) {
    const docs = db.prepare(
      'SELECT * FROM documents WHERE entity_id = ? ORDER BY created_at DESC'
    ).all(entityId);
    return NextResponse.json(docs);
  }

  if (clientId) {
    const docs = db.prepare(
      'SELECT * FROM documents WHERE client_id = ? ORDER BY created_at DESC'
    ).all(clientId);
    return NextResponse.json(docs);
  }

  const all = db.prepare(`
    SELECT d.*, c.first_name || ' ' || c.last_name as client_name,
      e.entity_name
    FROM documents d
    JOIN clients c ON d.client_id = c.id
    LEFT JOIN entities e ON d.entity_id = e.id
    ORDER BY d.created_at DESC
  `).all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = getDb();
  const id = uuidv4();

  const { client_id, entity_id, doc_type, name, file_path } = body;

  try {
    const downloadToken = crypto.randomBytes(32).toString('hex');

    let markdownContent: string | null = null;

    if (entity_id && ['subscription_agreement', 'operating_agreement', 'articles_of_organization', 'corporate_tree'].includes(doc_type)) {
      const entity = db.prepare('SELECT * FROM entities WHERE id = ?').get(entity_id) as Record<string, unknown> | undefined;
      const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(client_id) as Record<string, unknown> | undefined;

      if (entity && client) {
        const entityData = {
          legal_name: entity.entity_name as string,
          jurisdiction: entity.jurisdiction as string,
          tier_type: entity.tier_type as string,
          member_type: entity.member_type as string || 'multi_member',
          ein: entity.ein as string | undefined,
          registered_agent: entity.registered_agent as string | undefined,
          registered_agent_address: entity.registered_agent_address as string | undefined,
          parent_entity_name: undefined as string | undefined,
          privacy_shield: entity.privacy_shield as number,
          tax_classification: entity.tax_classification as string | undefined,
        };

        if (entity.parent_entity_id) {
          const parent = db.prepare('SELECT entity_name FROM entities WHERE id = ?').get(entity.parent_entity_id as string) as { entity_name: string } | undefined;
          if (parent) entityData.parent_entity_name = parent.entity_name;
        }

        const clientData = {
          first_name: client.first_name as string,
          last_name: client.last_name as string,
          email: client.email as string,
        };

        switch (doc_type) {
          case 'subscription_agreement':
            markdownContent = generateSubscriptionAgreement(entityData, clientData);
            break;
          case 'operating_agreement':
            markdownContent = generateOperatingAgreement(entityData, clientData);
            break;
          case 'articles_of_organization':
            markdownContent = generateArticlesOfOrganization(entityData, clientData);
            break;
          case 'corporate_tree': {
            const subsidiaries = db.prepare(
              'SELECT * FROM entities WHERE parent_entity_id = ?'
            ).all(entity_id) as Record<string, unknown>[];
            if (subsidiaries.length > 0) {
              const sub = subsidiaries[0];
              markdownContent = generateCorporateTree(
                entityData,
                {
                  legal_name: sub.entity_name as string,
                  jurisdiction: sub.jurisdiction as string,
                  tier_type: 'subsidiary',
                  member_type: 'single_member',
                  ein: sub.ein as string | undefined,
                  registered_agent: sub.registered_agent as string | undefined,
                  registered_agent_address: sub.registered_agent_address as string | undefined,
                  privacy_shield: sub.privacy_shield as number,
                  tax_classification: 'disregarded_entity',
                },
                clientData
              );
            }
            break;
          }
        }
      }
    }

    db.prepare(`
      INSERT INTO documents (id, client_id, entity_id, doc_type, name, file_path, raw_markdown_content, download_url_token, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'generated')
    `).run(id, client_id, entity_id || null, doc_type, name, file_path || null, markdownContent, downloadToken);

    return NextResponse.json({ id, download_url_token: downloadToken, ...body }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const db = getDb();
  const { id, status, reviewed_by } = body;

  if (!id) return NextResponse.json({ error: 'Document ID required' }, { status: 400 });

  const updates: string[] = [];
  const values: unknown[] = [];

  if (status) {
    updates.push('status = ?');
    values.push(status);
    if (status === 'downloaded') updates.push("downloaded_at = datetime('now')");
    if (status === 'submitted') updates.push("submitted_at = datetime('now')");
  }
  if (reviewed_by) {
    updates.push('reviewed_by = ?');
    values.push(reviewed_by);
  }

  if (updates.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

  updates.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE documents SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  return NextResponse.json({ success: true });
}
