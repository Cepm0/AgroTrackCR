# AgroTrackCR

Aplicación académica de trazabilidad agrícola para la Asociación de Productores Independientes del Valle (APIV), organización ficticia descrita en el primer entregable. Implementada a partir del primer entregable, el acta constitutiva y el programa del curso 16-0589 proporcionados por el equipo. Los documentos son referencias de requisitos; sus cronogramas, aprobaciones y tareas académicas no se ejecutan automáticamente.

## Ejecutar

Requiere Node.js 24 (usa `node:sqlite`) y npm. Desde este directorio:

```sh
npm ci
npm run dev
```

El servidor escucha en el puerto 3000. Para ejecutar varias copias a la vez, configura `PORT` y `HMR_PORT` con puertos libres diferentes; establece `PLAYWRIGHT_BASE_URL` para probar la copia correspondiente. La interfaz y la API se sirven desde el mismo origen. Crea una cuenta y completa **Mi perfil** antes de registrar lotes. **Explorar con datos de ejemplo** crea una cuenta aislada y tres lotes ficticios; sus credenciales son aleatorias y no se ofrecen para acceso posterior. Para conservar tu acceso, usa una cuenta creada por ti.

La base de datos persiste en `data/agrotrack.sqlite`, fuera del control de versiones. No eliminar ese archivo si se quieren conservar los datos. No introducir datos personales reales en las prácticas. No hay dependencias de fuentes, imágenes ni APIs externas durante el uso.

```sh
npm run build
NODE_ENV=production npm start
npm test
npx playwright test
```

Para Playwright, inicia primero la aplicación. La configuración usa `/usr/bin/chromium`; establece `CHROMIUM_PATH` si está instalado en otra ubicación. Capturas y resultados se generan en `test-results/` (ignorado por Git). Las pruebas de API usan una base temporal en memoria. Las pruebas de navegador crean cuentas y datos propios en la base de la instancia de desarrollo.

## Funciones implementadas

- HU-01/02: cuenta del productor y registro/actualización de finca, ubicación, área y teléfono.
- HU-03/04: creación de lotes con identificador generado por el servidor, consulta, búsqueda, filtros y edición.
- HU-05/06/07: registro de cosechas, insumos y otras actividades, con fecha, cantidades y unidades según el tipo.
- HU-08: historial por lote, con filtros de tipo y orden de más reciente a más antiguo. El reporte ordena de más antiguo a más reciente.
- HU-09/10: reporte por lote con productor, finca, cultivo e historial; descarga de texto UTF-8 legible, no PDF ni certificación oficial.
- HU-11/12: registro e inicio/cierre de sesión; contraseñas derivadas con scrypt y sal aleatoria; sesiones con cookies HttpOnly, SameSite=Lax y vencimiento de 24 horas; autorización por propietario en el servidor.

Los datos de ejemplo son sintéticos. Los indicadores se calculan con los registros del productor; el indicador de cosecha suma únicamente cantidades registradas en kg para no mezclar unidades.

## Arquitectura y diferencias frente a la propuesta

React + Vite para presentación; Express para reglas de negocio; SQLite para persistencia. Se eligió SQLite para que el equipo pueda ejecutar y probar el MVP sin instalar un servidor PostgreSQL. PostgreSQL figura como tecnología propuesta en el entregable, pero **no está implementado**. Los módulos de la API están en `server/app.js`; el punto de entrada está en `server/index.js`; la interfaz en `src/main.jsx` y `src/style.css`.

GitHub Pages solo admite contenido estático: **no puede ejecutar este backend**. El sitio completo requiere un alojamiento con Node.js y almacenamiento persistente. La inclusión del código en GitHub no constituye un despliegue de la aplicación. Este repositorio contiene la aplicación AgroTrack CR, independiente del sitio personal.

En desarrollo se usa HTTP local. Para despliegue, configura un proxy HTTPS y `SECURE_COOKIES=true`, conserva el mismo origen para la interfaz y la API y respalda la base de datos. La configuración HTTPS en un alojamiento público no se ha ejecutado ni verificado. No se afirma cumplimiento completo del RNF-02 ni certificación de seguridad.

## QA y límites

`docs/PRUEBAS.md` contiene la matriz inicial y un guion de aceptación. Las pruebas automatizadas son una base para el curso; no sustituyen revisión por pares, pruebas con al menos tres productores, entrevistas, evidencias del equipo ni aprobación del Product Owner. Estas actividades permanecen pendientes. No se añadieron pagos, inventario, integraciones externas ni certificación oficial.

## Animales de la finca

La sección **Animales** amplía el alcance agrícola original por solicitud del usuario. Permite registrar y editar animales individualmente: nombre, identificación/arete único por productor (sin distinguir mayúsculas), especie, raza, sexo, ingreso, nacimiento opcional, estado, peso de referencia y notas. Incluye bovinos, porcinos, ovinos, caprinos, equinos, aves y otras especies. Las aves también se registran individualmente; no hay gestión de hatos o grupos.

Cada ficha tiene un historial de vacunación, desparasitación, revisiones veterinarias, alimentación, reproducción, traslados y otros eventos, con descripción y peso observado opcional. El historial muestra primero los eventos recientes; el reporte descargable los ordena cronológicamente. El peso de referencia de la ficha no se actualiza automáticamente con los eventos: ambos se identifican por separado. El reporte animal se descarga desde la ficha, no desde la sección de reportes agrícolas.

Los registros pertenecen al productor autenticado y están asociados a su finca. Requiere completar el perfil antes de registrar animales. El servidor crea las nuevas tablas automáticamente al reiniciarse; conserva usuarios, lotes y eventos existentes. No se debe borrar `data/agrotrack.sqlite` para actualizar. Las nuevas sesiones de demostración incluyen a Luna (bovino) y Lucero (equino); las cuentas de demostración creadas antes de esta actualización pueden registrar animales manualmente o iniciar una nueva demostración.

Para actualizar una copia local de Windows, detén el servidor con Ctrl+C, guarda tus cambios locales y ejecuta `git pull --ff-only`, `npm.cmd ci` y `npm.cmd run dev`. Si Git informa conflictos o cambios locales, resuélvelos antes de continuar; no borres archivos ni uses un reset forzado. Para producción, vuelve a ejecutar `npm.cmd run build` antes del inicio. La carpeta `.vs` se ignora en Git y en el observador de archivos de Vite para evitar observar los índices bloqueados de Visual Studio; este ajuste no se ha validado en Windows en este entorno.
