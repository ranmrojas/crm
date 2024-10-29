-- Roles básicos
INSERT INTO roles (name, description) VALUES
    ('super_admin', 'Administrador con acceso total al sistema'),
    ('admin', 'Administrador de empresa con acceso limitado'),
    ('vendedor', 'Usuario con permisos de ventas y gestión básica'),
    ('usuariojr', 'Usuario con permisos básicos de consulta')
ON CONFLICT (name) DO NOTHING;

-- Permisos del sistema
INSERT INTO permissions (name, description) VALUES
    ('company.view', 'Permiso para ver la información de la empresa'),
    ('stores.view', 'Permiso para ver las tiendas'),
    ('products.view', 'Permiso para ver los productos'),
    ('inventory.view', 'Permiso para ver el inventario'),
    ('sales.view', 'Permiso para ver las ventas'),
    ('sales.create', 'Permiso para crear ventas'),
    ('sales.edit', 'Permiso para editar ventas'),
    ('customers.view', 'Permiso para ver los clientes'),
    ('customers.create', 'Permiso para crear clientes'),
    ('customers.edit', 'Permiso para editar clientes'),
    ('reports.sales', 'Permiso para ver los reportes de ventas')
ON CONFLICT (name) DO NOTHING;

-- Asignar TODOS los permisos al super_admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'super_admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Asignar permisos al admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'admin' 
AND p.name IN (
    'company.view', 'company.edit',
    'users.view', 'users.create', 'users.edit', 'users.invite',
    'stores.view', 'stores.create', 'stores.edit',
    'products.view', 'products.create', 'products.edit', 'products.delete',
    'inventory.view', 'inventory.adjust', 'inventory.transfer',
    'sales.view', 'sales.create', 'sales.edit', 'sales.reports',
    'purchases.view', 'purchases.create', 'purchases.edit',
    'customers.view', 'customers.create', 'customers.edit',
    'suppliers.view', 'suppliers.create', 'suppliers.edit',
    'settings.view', 'settings.edit',
    'reports.sales', 'reports.inventory', 'reports.financial'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Asignar permisos al rol 'vendedor'
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'vendedor'
AND p.name IN (
    'company.view',
    'stores.view',
    'products.view',
    'inventory.view',
    'sales.view', 'sales.create', 'sales.edit',
    'customers.view', 'customers.create', 'customers.edit',
    'reports.sales'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Asignar permisos al rol 'usuariojr'
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'usuariojr'
AND p.name IN (
    'company.view',
    'stores.view',
    'products.view',
    'inventory.view',
    'sales.view',
    'customers.view'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;