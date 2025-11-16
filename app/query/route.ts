import postgres from 'postgres';

const allowDevRoutes =
  process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEV_ROUTES === 'true';

const sql = allowDevRoutes ? postgres(process.env.POSTGRES_URL!, { ssl: 'require' }) : null;

async function listInvoices() {
  if (!sql) throw new Error('Route disabled'); // defensive
  return sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `;
}

export async function GET() {
  if (!allowDevRoutes) return new Response(null, { status: 404 });

  try {
    return Response.json(await listInvoices());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
