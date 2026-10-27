# Base de pruebas · AgroTrack CR

Esta matriz vincula las 12 historias de los documentos con pruebas repetibles. No representa aceptación del Product Owner ni resultados de sesiones con productores reales.

| Historias | Caso y resultado esperado | Evidencia automática |
| --- | --- | --- |
| HU-01/02 | Rechazar área inválida; guardar productor y finca y recuperarlos. | API: perfil; navegador: flujo del productor |
| HU-03/04 | Generar IDs diferentes; rechazar área cero; editar y consultar lotes. | API: lotes; navegador: creación y persistencia |
| HU-05 | Rechazar cantidades negativas, cero, no numéricas, fechas inválidas/futuras o anteriores al inicio. Aceptar cosecha válida. | API: eventos; navegador: cosecha |
| HU-06 | Rechazar un insumo sin nombre y aceptar uno con cantidad y fecha válidas. | API: eventos |
| HU-07 | Registrar actividad con descripción y fecha. | API: eventos |
| HU-08 | Recuperar eventos propios y ordenar cronológicamente el reporte. | API: reporte |
| HU-09 | Reporte con identificación del lote, finca, productor y eventos. | API: reporte; navegador: generación |
| HU-10 | Descargar archivo legible con nombre del lote. | Navegador: evento de descarga |
| HU-11 | Contraseña no almacenada en claro; credenciales incorrectas rechazadas; sesión válida y cierre efectivo. | API: autenticación y cierre; navegador: registro y cierre |
| HU-12 | Segundo productor no ve lotes/eventos ajenos; no puede obtener reportes, editar ni agregar eventos a ellos. | API: aislamiento |
| RNF-01 | Interfaz utilizable en ancho de 390 px sin desbordamiento global. | Navegador: vista móvil; aceptación humana pendiente |

## Guion de aceptación manual

1. Crear una cuenta propia con un correo aún no registrado y contraseña de al menos ocho caracteres.
2. Completar perfil y finca. Intentar un área negativa; comprobar que no se guarda. Guardar datos válidos.
3. Crear dos lotes, editar uno y comprobar que sus identificadores no cambian ni se repiten.
4. Registrar cosecha, insumo y actividad. Probar cantidad cero y fecha futura; verificar rechazo.
5. Filtrar el historial por lote y tipo; contrastarlo con los datos introducidos.
6. Generar un reporte, descargarlo y abrirlo. Comparar finca, cultivo, cantidades y fechas.
7. Cerrar sesión, volver a entrar y verificar persistencia.
8. Con otra cuenta, confirmar que no aparecen los registros anteriores; complementar con los casos de API de acceso directo.
9. Repetir tareas clave con al menos tres productores o representantes. Registrar ayuda solicitada, errores y tiempo; calcular el porcentaje que termina sin ayuda. Meta documental: al menos 80 %.

Registrar cada defecto con: ID, historia/caso, versión, navegador, precondiciones, pasos, resultado esperado, resultado observado, severidad, evidencia y estado. Mantener separados aprobado, fallido, no ejecutado y bloqueado. Las metas de liberación del acta (cobertura de requisitos críticos, ≥90 % de casos aprobados, cero defectos críticos y vulnerabilidades altas abiertas) deben evaluarse con la matriz completa del equipo, no deducirse de esta suite inicial.

## Validación ejecutada en este entorno

- Compilación de producción: aprobada.
- Pruebas automatizadas de lógica y API: 9 aprobadas (2 unitarias y 7 de API/integración), 0 fallidas.
- Pruebas de navegador Chromium: 3 aprobadas; flujo completo, demostración/búsqueda y bloqueo de descarga pública de la base de datos. La descarga del reporte se contrastó con el contenido esperado.
- Vista móvil: comprobada a 390 × 844 px, sin desbordamiento global.
- Arranque de producción: interfaz compilada, autenticación, lotes y datos de demostración comprobados en una instancia temporal separada.
- Revisión humana, usabilidad con productores, migración a PostgreSQL, despliegue HTTPS y auditoría exhaustiva de seguridad: pendientes.

## Ampliación: animales

Esta funcionalidad se agregó por solicitud posterior del usuario; no forma parte de las 12 historias agrícolas originales. Casos nuevos:

| Caso | Resultado esperado | Evidencia |
| --- | --- | --- |
| AN-01 | Finca obligatoria; registrar y editar animal con identidad única por productor. | API y navegador |
| AN-02 | Rechazar identificadores vacíos/duplicados, peso negativo/cero, especie/estado inválidos, fecha futura o nacimiento posterior al ingreso. | API; navegador verifica duplicados |
| AN-03 | Guardar eventos con fecha válida desde el ingreso; rechazar descripción vacía y pesos inválidos. No permitir mover el ingreso después de eventos existentes. | API y navegador |
| AN-04 | Mostrar historial y descargar reporte con animal, finca y eventos cronológicos. | API; navegador verifica contenido descargado |
| AN-05 | Denegar ficha/eventos, edición, nuevos eventos y reportes de otros productores. | API |
| AN-06 | Conservar animales tras recarga y mostrar sección a 390 px sin desbordamiento global. | Navegador |

Validación de esta ampliación: 14 pruebas de lógica/API aprobadas (las 9 anteriores más 5 nuevas), 4 de navegador aprobadas (las 3 anteriores más el flujo animal), compilación aprobada. Los ejemplos son ficticios y los registros no constituyen certificados sanitarios ni recomendaciones veterinarias. La corrección del observador `.vs` requiere comprobación adicional en Windows.
