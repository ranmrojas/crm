# BOLT - Guía de Desarrollo y Directrices
solo hablame en espanol, y no haga ningun cambio si autorizacion revise el bolt.md para la directrices de trabajo

## Introducción

BOLT es el entorno de desarrollo integrado para el CRM Fullstack Multi-tienda. Esta guía proporciona las directrices y mejores prácticas para el desarrollo en este entorno.

## Directrices Fundamentales

1. **Revisión del README**
   - SIEMPRE revisar el README.md completo antes de cualquier modificación
   - NO mostrar el readme resumido o abreviado
   - Entender la lógica del proyecto y su estructura actual
   - No modificar el README sin autorización explícita
   - Al agregar contenido al README, preservar todo el contenido existente

2. **Control de Cambios**
   - No realizar cambios sin autorización explícita
   - No modificar funcionalidades existentes que estén funcionando
   - No alterar diseños UI implementados sin aprobación
   - Solicitar autorización antes de ejecutar cualquier comando o implementar cambios

  
1. **Inicio del Desarrollo**
   - Revisar README.md completo
   - Verificar la configuración actual
   - No iniciar el servidor automáticamente

3. **Modificaciones**
   - Solicitar autorización para cambios
   - Documentar modificaciones propuestas
   - Esperar aprobación antes de implementar

   
## Comandos y Ejecución

IMPORTANTE: NO ejecutar comandos automáticamente. Esperar autorización para:
- `npm install`
- `npm run dev`
- `npm run init-db`
- Cualquier otro comando npm

## Mejores Prácticas

1. **Documentación**
   - Mantener documentación actualizada
   - No eliminar documentación existente
   - Agregar nuevas secciones sin modificar las existentes

2. **Código**
   - Seguir estándares establecidos
   - No refactorizar sin autorización
   - Mantener compatibilidad con implementaciones existentes

3. **Base de Datos**
   - Respetar esquemas existentes
   - Mantener compatibilidad PostgreSQL/SQLite
   - No modificar datos de prueba sin autorización

## Desarrollo en StackBlitz

1. **Entorno**
   - Usar SQLite por defecto
   - No modificar configuración automáticamente
   - Esperar autorización para cambios

2. **Pruebas**
   - No ejecutar pruebas automáticamente
   - Documentar casos de prueba propuestos
   - Esperar aprobación para implementación

## Mantenimiento

1. **Actualizaciones**
   - Proponer actualizaciones documentadas
   - Esperar aprobación antes de implementar
   - Mantener registro de cambios

2. **Depuración**
   - Documentar problemas encontrados
   - Proponer soluciones
   - Esperar autorización para implementar fixes

## Notas Importantes

- No iniciar el servidor automáticamente
- No ejecutar npm install sin autorización
- No modificar configuraciones existentes
- Mantener la compatibilidad con ambos sistemas de base de datos
- Solicitar aprobación para cualquier cambio
- Preservar toda la documentación existente