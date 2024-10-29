import { Pool } from 'pg';

let pgPool: Pool | null = null;

async function getDb() {
  if (pgPool) {
    return pgPool;
  }

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL no está configurada en las variables de entorno');
  }

  try {
    pgPool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : undefined,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Verificar la conexión
    await pgPool.query('SELECT NOW()');
    console.log('Conectado a PostgreSQL');
    return pgPool;
  } catch (error) {
    console.error('Error al conectar con PostgreSQL:', error);
    throw error;
  }
}

async function closeDb() {
  if (pgPool) {
    await pgPool.end();
    pgPool = null;
  }
}

// Función helper para ejecutar consultas
async function query(sql: string, params: any[] = []) {
  const connection = await getDb();
  const result = await connection.query(sql, params);
  return result.rows;
}

// Función helper para ejecutar una única consulta
async function queryOne(sql: string, params: any[] = []) {
  const connection = await getDb();
  const result = await connection.query(sql, params);
  return result.rows[0];
}

// Función helper para ejecutar consultas que modifican datos
async function execute(sql: string, params: any[] = []) {
  const connection = await getDb();
  return connection.query(sql, params);
}

export {
  getDb,
  closeDb,
  query,
  queryOne,
  execute
};