import { NextRequest, NextResponse } from 'next/server';
import { getDb, uuidv4 } from '@/lib/db';

export async function GET(req: NextRequest) {
  const db = getDb();
  const userId = req.nextUrl.searchParams.get('userId') || 'demo-user';

  const portfolio = db.prepare('SELECT * FROM paper_portfolios WHERE user_id = ?').get(userId) as Record<string, unknown> | undefined;
  const positions = db.prepare('SELECT * FROM paper_positions WHERE user_id = ? ORDER BY market_value DESC').all(userId);
  const trades = db.prepare('SELECT * FROM paper_trades WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').all(userId);

  if (!portfolio) {
    // Auto-create a default portfolio for this user
    const id = uuidv4();
    db.prepare('INSERT INTO paper_portfolios (id, user_id) VALUES (?, ?)').run(id, userId);
    const newPortfolio = db.prepare('SELECT * FROM paper_portfolios WHERE user_id = ?').get(userId);
    return NextResponse.json({ portfolio: newPortfolio, positions: [], trades: [] });
  }

  return NextResponse.json({ portfolio, positions, trades });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId = 'demo-user', symbol, side, orderType = 'market', quantity, price } = body;

  if (!symbol || !side || !quantity || !price) {
    return NextResponse.json({ error: 'symbol, side, quantity, and price are required.' }, { status: 400 });
  }
  if (!['buy', 'sell'].includes(side)) {
    return NextResponse.json({ error: 'side must be buy or sell.' }, { status: 400 });
  }
  if (quantity <= 0 || price <= 0) {
    return NextResponse.json({ error: 'quantity and price must be positive.' }, { status: 400 });
  }

  const db = getDb();
  const totalValue = quantity * price;

  // Ensure portfolio exists
  let portfolio = db.prepare('SELECT * FROM paper_portfolios WHERE user_id = ?').get(userId) as { id: string; cash_balance: number; total_value: number; total_pnl: number } | undefined;
  if (!portfolio) {
    const portfolioId = uuidv4();
    db.prepare('INSERT INTO paper_portfolios (id, user_id) VALUES (?, ?)').run(portfolioId, userId);
    portfolio = db.prepare('SELECT * FROM paper_portfolios WHERE user_id = ?').get(userId) as { id: string; cash_balance: number; total_value: number; total_pnl: number };
  }

  // Check buying power for buys
  if (side === 'buy' && totalValue > portfolio.cash_balance) {
    return NextResponse.json({ error: 'Insufficient cash balance for this trade.' }, { status: 400 });
  }

  // For sells, check position exists with enough quantity
  if (side === 'sell') {
    const position = db.prepare('SELECT * FROM paper_positions WHERE user_id = ? AND symbol = ?').get(userId, symbol) as { quantity: number } | undefined;
    if (!position || position.quantity < quantity) {
      return NextResponse.json({ error: 'Insufficient position to sell.' }, { status: 400 });
    }
  }

  const tradeId = uuidv4();

  // Insert trade record
  db.prepare(
    'INSERT INTO paper_trades (id, user_id, symbol, side, order_type, quantity, price, total_value, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(tradeId, userId, symbol, side, orderType, quantity, price, totalValue, 'filled');

  // Update position
  const existingPosition = db.prepare('SELECT * FROM paper_positions WHERE user_id = ? AND symbol = ?').get(userId, symbol) as { id: string; quantity: number; avg_cost: number } | undefined;

  if (side === 'buy') {
    if (existingPosition) {
      const newQty = existingPosition.quantity + quantity;
      const newAvgCost = ((existingPosition.avg_cost * existingPosition.quantity) + totalValue) / newQty;
      const marketValue = newQty * price;
      const unrealizedPnl = marketValue - (newAvgCost * newQty);
      db.prepare(
        "UPDATE paper_positions SET quantity = ?, avg_cost = ?, current_price = ?, market_value = ?, unrealized_pnl = ?, updated_at = datetime('now') WHERE id = ?"
      ).run(newQty, newAvgCost, price, marketValue, unrealizedPnl, existingPosition.id);
    } else {
      const posId = uuidv4();
      db.prepare(
        'INSERT INTO paper_positions (id, user_id, symbol, quantity, avg_cost, current_price, market_value, unrealized_pnl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).run(posId, userId, symbol, quantity, price, price, totalValue, 0);
    }
    // Decrease cash
    db.prepare(
      "UPDATE paper_portfolios SET cash_balance = cash_balance - ?, updated_at = datetime('now') WHERE user_id = ?"
    ).run(totalValue, userId);
  } else {
    // Sell
    if (existingPosition) {
      const newQty = existingPosition.quantity - quantity;
      if (newQty <= 0) {
        db.prepare('DELETE FROM paper_positions WHERE id = ?').run(existingPosition.id);
      } else {
        const marketValue = newQty * price;
        const unrealizedPnl = marketValue - (existingPosition.avg_cost * newQty);
        db.prepare(
          "UPDATE paper_positions SET quantity = ?, current_price = ?, market_value = ?, unrealized_pnl = ?, updated_at = datetime('now') WHERE id = ?"
        ).run(newQty, price, marketValue, unrealizedPnl, existingPosition.id);
      }
      // Increase cash and record realized PnL
      const realizedPnl = (price - existingPosition.avg_cost) * quantity;
      db.prepare(
        "UPDATE paper_portfolios SET cash_balance = cash_balance + ?, total_pnl = total_pnl + ?, updated_at = datetime('now') WHERE user_id = ?"
      ).run(totalValue, realizedPnl, userId);
    }
  }

  // Recalculate total portfolio value
  const positions = db.prepare('SELECT COALESCE(SUM(market_value), 0) as total_market FROM paper_positions WHERE user_id = ?').get(userId) as { total_market: number };
  const updatedPortfolio = db.prepare('SELECT cash_balance, total_pnl FROM paper_portfolios WHERE user_id = ?').get(userId) as { cash_balance: number; total_pnl: number };
  const newTotalValue = updatedPortfolio.cash_balance + positions.total_market;
  const pnlPercent = ((newTotalValue - 100000) / 100000) * 100;

  db.prepare(
    "UPDATE paper_portfolios SET total_value = ?, total_pnl_percent = ?, updated_at = datetime('now') WHERE user_id = ?"
  ).run(newTotalValue, pnlPercent, userId);

  const trade = db.prepare('SELECT * FROM paper_trades WHERE id = ?').get(tradeId);
  return NextResponse.json({ success: true, trade }, { status: 201 });
}
