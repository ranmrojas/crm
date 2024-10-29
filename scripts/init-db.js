require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('Error: DATABASE_URL no está configurada en las variables de entorno');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : undefined
  });

  try {
    console.log('Conectando a PostgreSQL...');
    
    // Verificar la conexión
    await pool.query('SELECT NOW()');
    console.log('Conexión establecida correctamente');

    // Leer y ejecutar el script de creación de tablas
    console.log('Creando tablas...');
    const createTablesSQL = fs.readFileSync(
      path.join(__dirname, 'postgres/create-tables.sql'),
      'utf8'
    );
    await pool.query(createTablesSQL);
    console.log('Tablas creadas correctamente');

    // Leer y ejecutar el script de roles y permisos
    console.log('Insertando roles y permisos...');
    const rolesPermissionsSQL = fs.readFileSync(
      path.join(__dirname, 'postgres/roles-permissions.sql'),
      'utf8'
    );
    await pool.query(rolesPermissionsSQL);
    console.log('Roles y permisos insertados correctamente');
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
  } finally {
    await pool.end();
  }
}

initializeDatabase();