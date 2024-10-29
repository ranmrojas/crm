# CRM Fullstack Multi-tienda con Next.js

Este proyecto es un CRM (Customer Relationship Management) fullstack desarrollado con Next.js, TypeScript y  PostgreSQL diseñado para manejar múltiples tiendas con un enfoque en la seguridad y la separación de datos entre empresas.

## Lógica del proyecto
- El usuario inicia en la página de login. Si no está registrado, puede crear una nueva cuenta.
- En el registro, el usuario debe crear una nueva empresa, que por defecto creará una sucursal principal que será la tienda en donde se trabajará.
- El usuario será el super admin tanto de la empresa como de las sucursales.
- Una empresa puede tener varias tiendas o sucursales que estén relacionadas o pertenezcan a esa Empresa.
- Una sucursal solo puede tener información relacionada a la sucursal.
- Un usuario puede pertenecer a múltiples empresas.
- Al iniciar sesión, si el usuario pertenece a múltiples empresas, se le presentará un selector para elegir con qué empresa desea trabajar.
- Los usuarios pueden ser invitados a unirse a otras empresas por los administradores de esas empresas.

## Configuración de Base de Datos

El proyecto soporta dos sistemas de gestión de bases de datos:

### PostgreSQL (Producción/Desarrollo Local)
- Para usar PostgreSQL, configura la variable `DATABASE_URL` en el archivo `.env`
- Formato: `postgresql://usuario:contraseña@host:puerto/nombre_db`
- Ejemplo: `DATABASE_URL=postgresql://postgres:password@localhost:5432/crm_db`



```

El script de inicialización:
1. Detecta el sistema de base de datos a usar
2. Crea todas las tablas necesarias
3. Inserta roles y permisos básicos
4. Configura índices para optimización

### Estructura de la Base de Datos

El sistema incluye las siguientes tablas principales:

1. **Usuarios y Autenticación**
   - users
   - roles
   - permissions
   - role_permissions

2. **Empresas y Sucursales**
   - companies
   - stores
   - user_companies
   - company_settings

3. **Productos e Inventario**
   - products
   - product_categories
   - store_inventory
   - inventory_movements

4. **Ventas y Compras**
   - sales
   - sale_items
   - purchases
   - purchase_items

5. **Clientes y Proveedores**
   - customers
   - suppliers

6. **Gestión y Auditoría**
   - audit_logs
   - invitations
   - store_transfers
   - store_transfer_items

## Sistema de Roles y Permisos

### Roles Predefinidos

1. **Super Admin**
   - Acceso total al sistema
   - Todos los permisos habilitados por defecto
   - Gestión completa de empresas y usuarios

2. **Admin**
   - Gestión de su empresa y sucursales
   - Gestión de usuarios dentro de su empresa
   - Acceso a reportes y configuraciones

3. **Vendedor**
   - Gestión de ventas
   - Acceso a inventario
   - Gestión básica de clientes

4. **Usuario Jr**
   - Acceso de solo lectura
   - Visualización de productos e inventario
   - Consulta de ventas

### Categorías de Permisos

1. **Empresa**
   - Ver, editar, eliminar y crear empresas

2. **Usuarios**
   - Gestión de usuarios y permisos

3. **Sucursales**
   - Administración de tiendas

4. **Productos e Inventario**
   - Gestión de productos
   - Control de inventario

5. **Ventas y Compras**
   - Gestión de transacciones
   - Reportes y análisis

6. **Clientes y Proveedores**
   - Gestión de relaciones comerciales

7. **Configuración y Auditoría**
   - Ajustes del sistema
   - Registros de actividad

## Características Principales

1. **Autenticación y Autorización**
   - [x] Sistema de registro y login implementado
   - [x] Gestión de roles de usuario (admin, gerente de tienda, etc.)
   - [x] Protección de rutas y API endpoints

2. **Gestión Multi-tienda**
   - [x] Soporte para que una empresa tenga múltiples tiendas
   - [x] Lógica para compartir módulos entre tiendas de la misma empresa
   - [x] Seguridad para que cada tienda solo pueda acceder a su propia información
   - [x] Soporte para que un usuario pertenezca a múltiples empresas

3. **API Routes de Next.js**
   - [x] Endpoints para autenticación implementados
   - [x] Endpoints para gestión de tiendas creados
   - [x] Endpoints para manejo de productos por tienda desarrollados
   - [x] Endpoints para invitaciones entre empresas implementados

4. **Base de Datos**
   - [x] Configuración dual PostgreSQL
   - [x] Esquema básico para usuarios, empresas, tiendas y productos
   - [x] Implementación de relaciones y consultas básicas
   - [x] Esquema actualizado para soportar usuarios en múltiples empresas
   - [x] Tabla de invitaciones para unirse a empresas agregada

5. **Interfaz de Usuario**
   - [x] Dashboard principal diseñado y desarrollado
   - [x] Interfaces para gestión de tiendas creadas
   - [x] Vistas para productos y análisis implementadas
   - [x] Selector de empresa al inicio de sesión agregado
   - [x] Interfaz para invitar usuarios a una empresa creada
   - [x] Vista para gestionar invitaciones recibidas implementada

6. **Gestión de Múltiples Empresas**
   - [x] Soporte para que un usuario se registre en múltiples empresas
   - [x] Selector de empresa al iniciar sesión implementado
   - [x] Lógica de autenticación actualizada para manejar múltiples empresas
   - [x] Sistema de invitaciones entre empresas implementado

7. **Sistema de Invitaciones**
   - [x] Tabla de invitaciones en la base de datos creada
   - [x] API para enviar invitaciones implementada
   - [x] Interfaz para que los administradores inviten usuarios creada
   - [x] API para aceptar o rechazar invitaciones implementada
   - [x] Interfaz para que los usuarios gestionen sus invitaciones creada

## Progreso del Proyecto

- [x] Implementación de la lógica para múltiples empresas por usuario
- [x] Actualización del proceso de registro para manejar usuarios existentes
- [x] Modificación del inicio de sesión para seleccionar empresa
- [x] Implementación del sistema de invitaciones entre empresas
- [x] Creación de interfaces para gestionar invitaciones
- [x] Mejora del proceso de inicio de sesión con selección de empresa en la misma página
- [x] Optimización del diseño responsive y ajustes en el sidebar
- [x] Mejora en la gestión de estados de carga y redirecciones

## Próximos Pasos

1. Refinar la lógica de múltiples empresas y mejorar la experiencia del usuario
2. Implementar notificaciones por correo electrónico para las invitaciones
3. Mejorar la gestión de permisos para diferentes roles en cada empresa
4. Implementar un sistema de auditoría para rastrear cambios importantes
5. Desarrollar un panel de análisis y reportes para cada empresa y tienda
6. Mejorar la interfaz de usuario para una experiencia más intuitiva
7. Implementar pruebas automatizadas para garantizar la estabilidad del sistema
8. Optimizar el rendimiento de la aplicación, especialmente para grandes conjuntos de datos
9. Desarrollar una API documentada para integraciones de terceros
10. Implementar un sistema de respaldo y recuperación de datos

## Cómo ejecutar el proyecto

1. Clona el repositorio
2. Instala las dependencias con `npm install`
3. Configura las variables de entorno en un archivo `.env`
4. Ejecuta las migraciones de la base de datos con `npm run init-db`
5. Inicia el servidor de desarrollo con `npm run dev`
6. Abre `http://localhost:3000` en tu navegador

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir cambios mayores antes de crear un pull request.

## Licencia

Este proyecto está bajo la licencia MIT.