const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function initializePostgres() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Conectado a PostgreSQL');

    // Leer y ejecutar el script de creación de tablas
    const createTablesSQL = fs.readFileSync(
      path.join(__dirname, 'postgres/create-tables.sql'),
      'utf8'
    );
    await client.query(createTablesSQL);
    console.log('Tablas creadas exitosamente');

    // Leer y ejecutar el script de roles y permisos
    const rolesAndPermissionsSQL = fs.readFileSync(
      path.join(__dirname, 'postgres/roles-permissions.sql'),
      'utf8'
    );
    await client.query(rolesAndPermissionsSQL);
    console.log('Roles y permisos inicializados');

    console.log('Base de datos PostgreSQL inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar PostgreSQL:', error);
    throw error;
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  initializePostgres().catch(console.error);
}

module.exports = { initializePostgres };