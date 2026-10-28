# Composición local · prueba parcial, no autorización de publicar

Código en `feat/new-tools-batch-1`, PR #136. Main contiene el relevo/evidencias; no contiene el nuevo runtime ni el parche DOMPurify de este lote. Leer ESTADO/AGENTS/RUNBOOK antes de continuar.

`scripts/compose-sites.mjs` **solo consume builds locales**. Dry run por defecto; `--write` crea una salida nueva mediante staging y rename, sin modificar entradas. Nunca despliega, activa herramientas o consulta Cloudflare. Los presupuestos locales no certifican el plan real de una cuenta.

```sh
node --test scripts/compose-sites.test.mjs scripts/release-capacity.test.mjs src/composed-home-search.test.mjs
mkdir .qa-step-a
node scripts/security/build-composition-smoke.mjs .qa-step-a/prueba
```

La carpeta debe ser nueva. El arnés usa esbuild/csso, DOMPurify/marked del lock y los renderers, CSS, controladores y bundles de idioma reales. Instalar solo dependencias necesarias en un área propia acotada; medir antes de un npm ci completo. No descargar modelos al Mac ni lanzar Actions de web.

Servir `.qa-step-a/prueba/composed` en 127.0.0.1; ejecutar el contenido de `tests/browser/composition-navigation.js` como `function` de Chrome DevTools evaluate_script en una página/contexto propios. El acceso `sourcePath` del MCP puede no incluir este checkout: pasar el contenido, sin cambiar permisos. La prueba cubre 108 geometrías y 25 comprobaciones; no equivale a las siete capas.

Para builds completos **ya preparados**, todos dentro del checkout:

```sh
node scripts/compose-sites.mjs --main .qa-step-a/main --hub .qa-step-a/hub --preview .qa-step-a/preview --output .qa-step-a/unified
```

Añadir `--write` solo tras dry run correcto y gates. **No preparar esos tres árboles completos y otra copia simultáneamente:** la medición histórica ya demuestra que excedería la huella de 2 GB. Falta un flujo secuencial con respaldo/recuperación, sin borrar trabajo único. El compositor cuenta el checkout entero, no solo los tres inputs, y exige dejar 10 GB libres.

Contrato: 700 IDs existentes y 300 nuevos disjuntos, todos los existentes en sitemap; cada nueva en noindex y fuera del sitemap/hreflang indexable, sin robots bloqueante. La CLI exige los **37 locales de página nuevos**, incluido nb aunque `localeEntries` común aún tiene 36. Fallar por nb ausente es correcto; no rebajar a 36. Un home sin plantilla principal, por ejemplo si un futuro build trae solo preview nb, requiere resolver su política sin crear una home indexable por defecto.

Homes/llms/metadatos tienen resolución explícita; otras colisiones deben ser idénticas o bloquean. En assets con hash, cualquier host antiguo obliga a reconstruir la fuente. Se preservan rutas y slugs. El buscador carga un JSON con hash solo en la primera consulta; conserva vocabulario anterior y funciona por nombre/slug si falla. La taxonomía común y Planeta Infinito siguen pendientes.

Resultados: [build parcial](partial-build.json), [193 Node](node-tests.txt), [Chrome antes/después](browser.json), [producción solo lectura](production.json), [GitHub](remote.json), [alcance y pendientes](evidence.json). Primera prueba de home con vocabulario inline: 59.117 B Brotli; plantilla principal/277 tarjetas originales con 1.000 nombres ingleses tras separar índice: 23.684 B. No representa todas las homes reales traducidas.

Las nuevas 300 siguen en preview separada, 0 en main y 0 activadas. Falta build completo y su puerta, integración segura, plan/coste actual y verificación publicada. No avanzar a fase 0 ni cortar dominio hasta cerrar Paso A. Sin nuevas pruebas para Pedro en este lote.
