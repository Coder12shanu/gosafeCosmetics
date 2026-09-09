import { neon } from '@neondatabase/serverless';

const getDatabase = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(process.env.DATABASE_URL);
};

export default async function handler(request, response) {
  try {
    const sql = getDatabase();

    if (request.method === 'GET') {
      const rows = await sql`SELECT data FROM app_state WHERE id = 'main'`;
      return response.status(200).json({ data: rows[0]?.data || null });
    }

    if (request.method === 'PUT') {
      const data = request.body;
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return response.status(400).json({ error: 'A valid state object is required' });
      }

      await sql`
        INSERT INTO app_state (id, data, updated_at)
        VALUES ('main', ${JSON.stringify(data)}::jsonb, NOW())
        ON CONFLICT (id)
        DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
      `;
      return response.status(200).json({ data });
    }

    response.setHeader('Allow', 'GET, PUT');
    return response.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database request failed', error);
    return response.status(500).json({ error: 'Database request failed' });
  }
}
