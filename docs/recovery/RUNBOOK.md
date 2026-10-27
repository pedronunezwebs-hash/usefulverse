# UsefulVerse · Manual de ejecución para agentes (RUNBOOK)

Versión 1 · 20-oct-2026 · Válido para Codex, ChatGPT, Claude o cualquier agente con acceso al repo.
**Cómo se usa:** Pedro pega en el agente: *«Lee `AGENTS.md` y `docs/recovery/RUNBOOK.md` del repo
`pedronunezwebs-hash/usefulverse` y ejecuta el siguiente lote.»* No hace falta nada más. Este manual dice qué hacer,
en qué orden, cómo verificarlo, cuándo parar y cómo dejarlo listo para el siguiente agente.

Documentos de referencia, en orden de prioridad: `AGENTS.md` → este RUNBOOK → `docs/quality/STRATEGY-1M.md` (estrategia de crecimiento) → `docs/recovery/README.md`
(diagnóstico de la caída) → `docs/quality/PLAN.md` (plan de calidad completo) → `docs/design/planeta-infinito/`
(prototipo de marca aprobado).

---

## 0. Relevo entre agentes (siempre)

Al empezar y al terminar, sigue el **protocolo de relevo** de `docs/quality/ESTADO.md` (candado de turno, siguiente paso,
checklist, contadores). Estructura del repo: `docs/quality/MAPA-REPO.md`. **Al terminar cada sesión, todo el trabajo
va en commit y push a una rama remota**, aunque esté a medias. El 20-oct se encontró el trabajo de las 300
herramientas solo en `/tmp`, sin subir: no se repite.

---

## 1. Estado real a 20-oct-2026 (verificado)

| Hecho | Dato |
|---|---|
| Herramientas públicas | 700 (277 en `usefulverse.com` y 423 en `tools.usefulverse.com`); 25.625 URLs en los sitemaps |
| Idiomas | 37 definidos. A **600 herramientas les falta el noruego `nb`** (las 277 del dominio y 323 del subdominio) |
| Google | El 16-oct las impresiones cayeron de ~3.700/día a ~50/día. No hay acción manual: es una desconfianza algorítmica por crecer a escala con poca calidad. |
| Las «300 nuevas» | Pedro informa (20-oct) de que están **casi terminadas con ChatGPT, fuera de este repo**. No están en `main` ni publicadas: hoy ningún slug de `300-candidatas.tsv` aparece en los sitemaps. Según `PLAN-1000.md`, 50 tienen demanda confirmada ≥300.000/mes, 19 necesitan revisión y 231 son de reserva. |
| **Fallo técnico urgente** | `tools.usefulverse.com` devuelve **200 con la home** en cualquier URL inexistente (p. ej. `/tools/zzz/`). Son *soft 404*: Google ve URLs basura infinitas que parecen páginas. `usefulverse.com` sí devuelve 404 correctamente. |
| Marca | Concepto **«Planeta Infinito»** aprobado por Pedro: planeta + anillo ∞, violeta `#5B3DF5`, display Bricolage Grotesque, colores por categoría. |

---

## 2. Política de publicación (cumple con Google y es la elegida)

**¿Puede Google «bloquear» el sitio por subir mucho de golpe?** No como castigo automático por el volumen en sí. Una acción
manual solo llega si el contenido se considera spam (*scaled content abuse*: muchas páginas sin valor para los
usuarios). El riesgo real es algorítmico: cada página floja que se añade refuerza la desconfianza y alarga la
recuperación. Las páginas nuevas sin valor se quedan en «Descubierta: sin indexar» y no aportan nada. Lo que decide el
resultado es la calidad de cada página, no la velocidad de subida.

Por eso la regla es: **se publica todo lo que esté terminado, en cuanto pase la puerta de calidad, sin esperas
artificiales, pero con un freno de seguridad semanal:**

1. **Mejorar las páginas existentes no tiene límite** (no crea URLs). Es la prioridad número uno.
2. **Herramientas nuevas (las 300 hechas con ChatGPT): se suben ya, todas con `noindex`.** Google no indexa esas páginas y
   no cuentan en la valoración del sitio, pero existen y se pueden usar. Mientras estén en `noindex`: fuera del sitemap,
   fuera de los `hreflang` de las páginas indexables, nunca bloqueadas en `robots.txt` (Google tiene que poder leer el
   `noindex`) y sin envíos a buscadores.
3. **Activación con freno:** una herramienta nueva pasa a indexable (sin `noindex`, en el sitemap y en los `hreflang`) solo
   cuando supera la puerta de calidad (sección 6) y sus idiomas el piloto (sección 8). **Máximo 30 activaciones por semana**
   (≈1.100 URLs, ≈4 %). Antes de la caída se publicaban ≈900 URLs al día.
4. **Noruego (`nb`) en las 600 existentes:** se añade a cada herramienta cuando esa herramienta termina su mejora de
   calidad (sección 5), nunca en bloque sin mejorar.
5. **Las 231 candidatas de reserva no se construyen** salvo decisión expresa de Pedro.
6. **Ninguna herramienta que necesite servidores, APIs o datos de pago** (p. ej. test de velocidad con ancho de banda
   propio, tiempo meteorológico con API, chat de IA en servidor) se construye sin una ficha de costes aprobada por Pedro.
   Límite de la cuenta: Cloudflare ≤ 10 $/ciclo y GitHub en 0 $.

Si Search Console muestra una caída nueva >50 % frente a la semana anterior: **se pausa la publicación de herramientas
nuevas** (la mejora de las existentes continúa) y se avisa a Pedro.

---

## 3. Trabajar sin llenar el disco de Pedro (y en segundo plano)

El Mac de Pedro tiene **~22 GB libres** y Pedro sigue trabajando en él. Reglas:

1. **Trabajo pesado en la nube, no en el Mac:**
   - Traducción con modelos (M2M100, MADLAD: varios GB) → **solo en GitHub Codespaces**. Nunca se descargan modelos al Mac.
   - Builds completos (25.000+ páginas) → los hace **GitHub Actions** al hacer push. En local solo se construyen las
     herramientas del lote.
2. **Codespaces sin coste:** presupuesto de Codespaces en 0 $ con bloqueo (se comprueba en GitHub → Settings → Billing antes
   de crear uno). Máquina de 2 núcleos. Se borra el codespace **al terminar cada sesión**, después de comprobar que todo
   está en GitHub (`gh codespace delete`). No se dejan codespaces parados.
3. **Si se trabaja en el Mac:**
   - Clon superficial en una carpeta temporal del agente (nunca en el Escritorio):
     `git clone --depth 1 --filter=blob:none https://github.com/pedronunezwebs-hash/usefulverse.git`
   - Si otro agente usa el mismo repo, cada uno trabaja en su propio `git worktree`, nunca en el checkout del otro.
   - Builds parciales a una carpeta temporal: `USEFULVERSE_DIST=<tmp>/dist USEFULVERSE_PACKS=<idiomas> npm run build`
     (las variables ya existen en el repo). Al terminar se borra `<tmp>/dist`.
   - `node_modules`, `dist`, capturas y descargas se **borran al cerrar el lote**, sin Papelera.
   - **Antes de cada lote:** `df -h /`. Si quedan **menos de 10 GB libres**, no se empieza; se avisa a Pedro.
   - Huella máxima de un lote en el Mac: **2 GB**.
4. **Segundo plano:** procesos con prioridad baja (`nice -n 15`), un solo build a la vez y nada que ocupe la pantalla.
5. **Minutos de GitHub Actions:** como máximo **un despliegue al día** con un lote completo. Los cambios solo de
   documentación llevan `[skip ci]`. Si el uso del mes supera el 80 % de los minutos gratuitos, se paran los
   despliegues hasta el ciclo siguiente.

---

## 4. Fase 0 · Arreglos urgentes (un PR, primero de todo)

1. **404 real en `tools.usefulverse.com`:** el build del subdominio debe generar un `404.html` en la raíz de la salida
   (Cloudflare Pages solo deja de hacer el «fallback» a la home cuando existe `404.html`). Verificación después del despliegue:
   `curl -s -o /dev/null -w "%{http_code}" https://tools.usefulverse.com/tools/zzz-no-existe/` → **404**, también en
   `/es/zzz/` y en `/zzz.html`. Añadir un test que falle si el build no contiene `404.html`.
2. **Título de la home:** quitar «Free» duplicado («Everyday Online Tools — Free · no limits — Free»). Añadir un test:
   ninguna palabra repetida en un `<title>` y longitud ≤ 60 caracteres.
3. **Índice de sitemaps por idioma** en ambos hosts (`sitemap.xml` → índice; `sitemap-<idioma>.xml`), con `lastmod` real.
4. Desplegar, verificar en producción, reenviar solo los sitemaps en Search Console y Bing. Anotar el resultado en
   `docs/quality/progress.csv` (fila `fase-0`).

---

## 4a. Fase 0b · Caché y errores confirmados

1. **Antes de nada, G1:** los 106 JS de `/assets/recovered-live-only-106/` se sirven sin hash y con `immutable, max-age=31536000`.
   Pon el hash del contenido en el nombre (o una caché corta con revalidación); si no, ningún arreglo llega a quien ya
   visitó esas páginas. Verificación: `curl -I` de un asset antes y después.
2. **Los 26 errores confirmados** de `docs/quality/AUDITORIA-CATALOGO.md` §2: por cada uno, primero un test que lo
   reproduzca (con el caso de la tabla), después el arreglo y por último la prueba en el navegador. Un PR por familia.
   Anotar el avance en `ESTADO.md`.
3. Al mejorar cualquier herramienta (§5), revisar **su informe** en `docs/quality/auditoria/` y aplicar todo lo que le
   afecte: límites, huecos, SEO y UX.

## 4b. Unificar todo en `usefulverse.com` (un solo sitio, sin coste extra)

**Por qué se partió:** Cloudflare Pages en el plan gratuito admite **20.000 archivos por sitio**, y UsefulVerse tiene
~25.600 URLs (habrá ~38.000 con las 300 nuevas y el noruego). **Solución verificada (20-oct-2026):** la cuenta
`c32922f3…` ya tiene **Workers Paid (5 $/mes, ya pagado por la agencia)**. **Workers Static Assets** admite hasta
**100.000 archivos por Worker**, y Cloudflare documenta que *«Requests to static assets are free and unlimited»*. Un
Worker **solo de assets** (sin script que se ejecute en cada petición) sirve todo el sitio sin coste por visita, aunque
lleguen millones.

**Reglas de coste:** el Worker no lleva script (`main`) o, si algún día lo necesita, nunca `run_worker_first: true` para
todo el sitio. Así cada visita es una petición de asset gratuita. Nada de Pages Functions ni de proxys entre proyectos.

**Procedimiento** (después de la fase 0 y antes de la traducción masiva; una rama, un PR):
1. **Medir:** contar los archivos de `dist/` + `dist-growth600/` (+ las 300 nuevas y `nb` previstos). Debe quedar **< 80.000**
   (margen sobre 100.000). Si no, reducirlo: unificar assets compartidos y quitar duplicados de vendor/modelos.
2. **Colisiones:** comprobar que ninguna ruta de archivo choca entre los dos builds (las herramientas no chocan: 0 slugs
   comunes). Revisar `/assets/…`, las homes por idioma (`/es/`…), `robots.txt`, `sitemap.xml`, `llms.txt` y `404.html`.
   Lo del hub que choque se mueve a `/assets/hub/…`.
3. **Build único:** el hub genera sus URLs, `canonical`, `hreflang` y enlaces internos con la base `https://usefulverse.com`
   (no `tools.`). Un script `scripts/merge-sites.mjs` junta las dos salidas en `dist-site/` y genera **un** índice de sitemaps
   por idioma, **un** `robots.txt` y **un** `404.html` (el bueno de `renderNotFoundPage`). Test: toda URL del sitemap existe
   en `dist-site/`, no hay `canonical` ni `hreflang` hacia `tools.`, y las páginas `noindex` siguen fuera del sitemap.
4. **Worker de assets** (`wrangler.jsonc`):
   ```jsonc
   {
     "name": "usefulverse",
     "compatibility_date": "2026-10-01",
     "assets": { "directory": "./dist-site", "not_found_handling": "404-page", "html_handling": "auto-trailing-slash" }
   }
   ```
   Crear antes un **token nuevo y mínimo** para el Worker: «Workers Scripts Write» en la cuenta y, si hace falta para el
   dominio, solo la zona `usefulverse.com`. Guardarlo como secreto del repo; no usar la llave global.
   Pasar las cabeceras de seguridad y caché actuales a `dist-site/_headers` y las redirecciones a `_redirects` (Workers
   Static Assets admite ambos).
5. **Probar en `usefulverse.<subdominio>.workers.dev`:** muestra de 300 URLs (los dos catálogos, 37 idiomas, RTL),
   404 reales, cabeceras y Lighthouse móvil.
6. **Cambio de dominio, en ventana tranquila:** quitar `usefulverse.com` del proyecto de Pages y añadirlo como *Custom
   Domain* del Worker. Verificar 200 en la home y en 20 URLs al momento.
7. **Redirigir `tools.usefulverse.com` → `usefulverse.com`** con **una sola regla de redirección de Cloudflare**
   (Rules → Redirect Rules, incluida gratis): `https://tools.usefulverse.com/*` → `https://usefulverse.com/${1}`, **301**,
   conservando la ruta y la query. El registro DNS de `tools` sigue con proxy activo (naranja) para que la regla actúe.
   Verificar con 200 URLs: 301 → 200 en la ruta equivalente.
8. **Despliegue:** el workflow pasa de `pages deploy` (dos proyectos) a **`wrangler deploy`** del Worker en cada push a
   `main` (sin el `workflow_dispatch` manual del hub). Wrangler solo sube los archivos que cambian.
9. **Después:** reenviar el índice de sitemaps de `usefulverse.com` en Search Console (la propiedad de dominio ya cubre ambos
   hosts; no hace falta ningún «cambio de dirección») y en Bing. Mantener los dos proyectos de Pages **2 semanas** como
   vuelta atrás. Borrarlos solo con el OK de Pedro.
10. Actualizar `MAPA-REPO.md` (un sitio, un build, un despliegue) y `ESTADO.md`.

**Vuelta atrás:** devolver el dominio al proyecto de Pages `usefulverse` y desactivar la regla de redirección. Es
inmediato, porque los proyectos antiguos siguen vivos.

---

## 5. Bucle principal · Mejorar herramientas existentes (lote de 5 a 10)

**Nivel de esfuerzo (A/B/C):** ver `docs/quality/REVISION-FINAL.md` §1. Toda herramienta pasa la puerta mínima; el
tratamiento completo (long-tail profundo, 8-12 FAQ, títulos por keyword en 10 idiomas, widget) es para el nivel A.

**Primero en la cola de nivel A: la paridad PDF** (`docs/quality/PDF-VS-ILOVEPDF.md` §3): son búsquedas enormes y el motor ya existe.

**Elegir el lote:** abrir `docs/quality/progress.csv` y tomar las siguientes filas con `tipo=existente` y
`estado=pendiente`, ordenadas por `prioridad` (de menor a mayor). Preferir herramientas de la misma familia en el mismo
lote (PDF con PDF, etc.) para que se enlacen entre sí. Marcar `estado=en-curso` y el nombre del agente, y hacer push con
`[skip ci]`, para que nadie más las coja.

**Para cada herramienta del lote:**
1. **Investigar (sin APIs de pago):**
   - Consultas reales de Search Console de esa URL (si el agente tiene acceso; si no, se omite).
   - Sugerencias de Google y «Otras preguntas de los usuarios» observadas en el navegador.
   - Los 3 primeros competidores: qué cubren y qué les falta.
   - Guardar en `docs/quality/tools/<slug>/keywords.json`: keyword principal, 10-30 long-tail y preguntas reales.
2. **Auditar límites** (código + prueba): quitar los límites artificiales (nº de archivos, tableros, resultados). Los
   técnicos se resuelven con una cola, Web Workers y liberación de memoria. Los reales del dispositivo se explican en
   lenguaje simple. Test: 200 archivos o 1.000 generaciones sin fallos.
3. **Rejugabilidad** (juegos y generadores): generación procedural con semilla y validación, niveles, reto diario,
   progreso local y compartir la partida. Test: 1.000 generaciones sin repetir y todas válidas.
4. **Contenido propio** en la plantilla: intro que responde directamente, «Cómo se usa» (3 pasos), ejemplos resueltos
   y recalculados por test, usos, límites y privacidad reales, consejos y 6-12 FAQ de la investigación, más 3-5 herramientas
   relacionadas. Sin relleno.
5. **Metadatos:** título ≤ 60 caracteres con la keyword primero; descripción de 120-155 caracteres; «gratis» o «sin límites» solo
   si es verdad. JSON-LD: `WebApplication` (precio 0, `isAccessibleForFree`), `BreadcrumbList` y `FAQPage` idéntico al texto
   visible. Nunca `AggregateRating` inventado.
6. **«Siguiente paso»:** al terminar la tarea, una tarjeta dentro de la página (sin ventana emergente) con 1-3 herramientas
   del grafo `tools-graph.json`. El archivo pasa de una herramienta a otra si la entrada y la salida coinciden.
7. **Test del niño de 8 años:** frases ≤ 20 palabras en la interfaz y la intro, sin tecnicismos sin explicar. La tarea
   principal se completa en ≤ 3 pasos sin leer la ayuda.
8. **Recurrencia y difusión** (STRATEGY-1M §5):
   - juegos con reto diario, racha y tarjeta de resultado para compartir;
   - calculadoras con los valores en la URL, con `canonical` a la página base;
   - opción «Insertar en tu web» (`<iframe>`) con el enlace de crédito `rel="nofollow"` y solo con la marca.
9. **Diseño:** usar los componentes del sistema «Planeta Infinito» (cuando la fase de diseño esté hecha; antes, la
   plantilla actual).
10. **Traducir** a los 37 idiomas con el método de `METODO-TRADUCCION.md` en Codespaces (sección 8), **incluido el
   noruego `nb`** si faltaba.

**Puerta de calidad** (sección 6). Si no se pasa un punto, se arregla; no se publica a medias.

**Publicar:** un PR por lote con la lista de herramientas, el recuento de URLs antes y después, y la evidencia de la
puerta. Merge y despliegue (máximo uno al día). **Verificar en producción** (sección 9). Marcar
`estado=terminada` con la fecha y el número de PR. **Limpiar** (sección 3).

---

## 6. Puerta de calidad (por herramienta; se apunta la evidencia en el PR)

| # | Control | Evidencia |
|---|---|---|
| 1 | Funciona: casos normales, extremos e inválidos | `npm test` verde + prueba en navegador |
| 2 | Sin límites artificiales | Auditoría + test de 200 archivos o 1.000 generaciones |
| 3 | Rejugable (si aplica) | Test de no repetición |
| 4 | Contenido propio, similitud < 30 % con otras herramientas | Test de n-gramas |
| 5 | Ejemplos y fórmulas exactos | Test que recalcula cada ejemplo publicado |
| 6 | Título y descripción únicos, longitudes y promesas verdaderas | Test de metadatos |
| 7 | JSON-LD válido e idéntico a lo visible | Validador en el build |
| 8 | Siguiente paso funcionando | Prueba en navegador |
| 9 | Niño de 8 años | Revisión + prueba de tarea |
| 10 | Móvil: LCP < 1,8 s, CLS < 0,05, INP < 150 ms | Lighthouse móvil |
| 11 | Accesible (teclado, lector de pantalla, contraste AA) | axe-core + teclado |
| 12 | RTL (`ar`) y textos largos (`de`) sin cortes, a 390 px | Captura |
| 13 | 37 idiomas presentes (o los que hayan pasado el piloto), con `hreflang` recíproco | Test de cobertura |
| 14 | `npm run check` y `npm run locale:release-check` verdes | Salida del comando |
| 15 | **Las 7 capas de `docs/quality/PRUEBAS.md`**: ≥10 valores de referencia con fuente, propiedades o aleatorios, regresión, Playwright (Chromium, Firefox y WebKit; móvil 390 px; en/es/de/ar/ja/hi/nb), axe y Lighthouse | Salida de los tests + enlace al run de Actions |
| 17 | **Peso** dentro del presupuesto de `PESO-Y-DISENO.md` §2 (test de CI) | Informe de peso del PR |
| 18 | **Diseño responsive**: 320-1920 px, zoom al 200 %, sin desbordamiento, márgenes ≥ 16 px en móvil, zonas táctiles ≥ 44 px, RTL y textos largos (`PESO-Y-DISENO.md` §4) | Capturas + test visual |
| 16 | Lo que no se puede automatizar está en `PRUEBAS-PEDRO.md`, y **ninguna prueba de Pedro de esta herramienta está pendiente o en `FALLA`** | Filas de PRUEBAS-PEDRO |

---

## 7. Bucle de herramientas nuevas (las 300 hechas con ChatGPT)

**Paso A · Subida inicial en `noindex` (una sola vez, por tandas de PR manejables):**
1. Subir el código de las herramientas al repo en ramas `feat/new-tools-batch-N`; nunca directamente a `main`.
2. Marcar cada herramienta como `indexable: false` en el catálogo, para que el generador emita
   `<meta name="robots" content="noindex, follow">` en sus 37 idiomas, **no las meta en el sitemap ni en los `hreflang`** de
   otras páginas y no envíe nada a IndexNow.
3. Antes de hacer merge, tests obligatorios: (a) toda página `indexable: false` lleva el `noindex`; (b) ninguna aparece en
   ningún sitemap; (c) ninguna aparece en los `hreflang` de páginas indexables; (d) `robots.txt` no las bloquea;
   (e) `npm test`, `npm run check` y `npm run locale:release-check` en verde.
4. Desplegar y verificar en producción con una muestra de 10 URLs: 200, `noindex` presente y ausentes del sitemap.
5. En `progress.csv`: `estado=subida-noindex`.

**Paso B · Activación (bucle semanal, máximo 30 por semana):**
1. **Orden:** primero las 50 con demanda confirmada (por `rank`), después las 8 alternativas cercanas y las 11 de intención
   por revisar. Las 231 de reserva se pueden subir en `noindex`, pero no se activan sin una decisión de Pedro.
2. **Viabilidad:** si necesita servidor, API o datos de pago, se hace una ficha de costes y se para hasta que Pedro la
   apruebe. Además se comprueba que sea distinta de las 700 existentes (ver «Qué cuenta como nueva herramienta» en
   `PLAN-1000.md`).
3. Revisar sus hallazgos de la auditoría de las 300 (ver `ESTADO.md`, «Cobertura»), mejorarla con la receta de la sección 5 y
   pasar la puerta de la sección 6 y el piloto de traducción de la sección 8.
4. **Activar:** `indexable: true` → sin `noindex`, dentro del sitemap de cada idioma y en los `hreflang`. Desplegar y verificar
   (sección 9), y pedir la indexación de las 5 más importantes de la tanda.
5. En `progress.csv`: `estado=activa`, con la fecha y el PR. Contar las activaciones de la semana; al llegar a 30, parar
   hasta la semana siguiente.

## 8. Traducción

> **Antes de nada lee `docs/quality/REVISION-FINAL.md` §2:** inglés controlado, memoria de traducción, elección **objetiva**
> del motor por idioma (incluida la traducción actual si puntúa más), controles automáticos y muestra de 20 frases.
> También explica el **problema de volumen** (~19 M de palabras): dónde se ejecuta (Mac por la noche, repo público con
> Actions ilimitado o Codespaces repartido) **ya está decidido: GitHub Actions en el repo público** (ver `REVISION-FINAL.md` §2).

### Operación vigente · Pedro, 27-oct-2026

Pedro pide traducciones comprensibles y controles automáticos, sin traducción o lectura frase a frase del agente. Desde el 28-oct el workflow `UsefulVerse translation autopilot` extrae inglés del catálogo, genera, retrotraduce, comprueba significado, pone dudas en cuarentena, guarda checkpoints/paquetes en la rama de datos y reanuda a diario. `Translation alerts` avisa a Pedro en GitHub. [Operación, cobertura parcial, coste cero y límites](../quality/translation-drafts/README.md). Consultar contadores e incidencias y corregir el sistema, sin otra microversión manual por idioma. Las puertas de herramienta/publicación y el orden del plan se mantienen; no fingir aprobación nativa. El adaptador de paquetes aún requiere conexión al build de producción. Se puede preparar la web mientras Actions trabaja.

### 8.1 Pasos (Codespaces o Mac, según la decisión)

1. Abrir un codespace de 2 núcleos sobre la rama del lote.
2. Primera vez: ejecutar el **piloto** de `METODO-TRADUCCION.md` (3 herramientas y 37 idiomas) y fijar el motor por idioma.
   Umbral: 0 errores en botones, cifras y negaciones; ≤ 1 error leve cada 20 frases. Comprobar que el noruego es bokmål. Los
   resultados se guardan en `docs/quality/translation-pilot.md`.
3. Por lote: extraer solo las cadenas nuevas o cambiadas, traducirlas con memoria, pasar los controles automáticos
   (placeholders, cifras, idioma detectado, nada en inglés) y retrotraducir una muestra de 20 cadenas por idioma.
4. Hacer commit y push de los paquetes de idioma y de la memoria (SQLite con Git LFS **no**: exportarla como JSON o CSV
   comprimido < 25 MB). Después **borrar el codespace**.
5. Un idioma que no pase el umbral **no se publica** en ese lote.

---

## 9. Verificación después de cada despliegue

```bash
# 1. Cada URL nueva o cambiada: 200, canonical propio y sin noindex
curl -s -o /tmp/p.html -w "%{http_code}\n" https://usefulverse.com/tools/<slug>/
grep -o '<link rel="canonical"[^>]*>' /tmp/p.html
# 2. Cada URL de un idioma (muestra: en, es, ar, ja, nb)
# 3. Soft 404 sigue arreglado
curl -s -o /dev/null -w "%{http_code}\n" https://tools.usefulverse.com/tools/zzz-no-existe/   # → 404
# 4. Las URLs están en el sitemap de su idioma
```

Después, reenviar solo el índice de sitemaps en Search Console y Bing. Inspeccionar como máximo 5 URLs clave con
«Inspeccionar URL». Nada de envíos masivos.

---

## 10. Informe por lote (en el PR y en `docs/quality/LOG.md`)

```
Lote N · fecha · agente
Herramientas: slug1, slug2, …   (existentes: X · nuevas: Y)
URLs antes → después: …
Puerta: 14/14 en todas (enlace a la evidencia) · excepciones: …
Despliegue: run de Actions …, verificado en producción: sí/no
Idiomas publicados: 37 / excepciones por piloto: …
Minutos de Actions usados este mes: … / 2.000 · Disco libre al acabar: … GB
Siguiente lote propuesto: …
```

---

## 11. Crecimiento y KPIs (cada 2 semanas)

Además del bucle de calidad, el agente dedica una parte de cada quincena a la **fase 7** de `docs/quality/STRATEGY-1M.md`
(autoridad, marca, recurrencia) y actualiza `docs/quality/KPIS.md` con la tabla de KPIs de esa estrategia. Ninguna acción de
crecimiento publica nada en nombre de Pedro (Product Hunt, Reddit, directorios) sin su aprobación: el agente prepara los
textos y Pedro publica.

## 11b. Pruebas semanales y pruebas de Pedro

- Una Action semanal pasa por **todas** las herramientas en producción (carga sin errores, tarea principal, móvil y WebKit) y
  abre un Issue si algo falla (`PRUEBAS.md` §2). Montarla en la fase 8, o antes si se puede.
- Al empezar cada sesión, revisar `PRUEBAS-PEDRO.md`: arreglar los `FALLA` antes que nada y actualizar el contador en `ESTADO.md`.

## 12. Piloto automático y anuncios (para dejar la web un año)

Al acabar las fases de calidad, aplicar `docs/quality/REVISION-FINAL.md` §3-5:
- Action semanal de vigilancia que abre un Issue si algo falla.
- Aviso automático de datos caducados en las herramientas con normativa o impuestos.
- Activación automática semanal de hasta 30 herramientas nuevas que ya pasaron la puerta (`estado=lista-para-activar`).
- Huecos de anuncio reservados y apagados, CMP certificado preparado y `ads.txt` preparado.
- Checklist de «web terminada». `ESTADO.md` pasa a «TERMINADO · modo piloto automático».

## 13. Prohibido

- Activar (quitar el `noindex`) herramientas que no hayan pasado la puerta, o más de 30 por semana.
- Meter páginas `noindex` en el sitemap o en los `hreflang`, o bloquearlas en `robots.txt`.
- Construir las 231 de reserva, o algo con servidor o API de pago, sin aprobación.
- Borrar herramientas, cambiar slugs o borrar URLs. Una fusión, solo con aprobación de Pedro y con 301.
- Enlaces con palabras clave en los widgets incrustables (siempre `nofollow` y solo la marca); comprar enlaces; PBN.
- Herramientas que dependan de un servidor de pago para su uso «ilimitado».
- `noindex` masivo (Pedro lo ha descartado).
- Envíos masivos a IndexNow, Naver, Yandex o Google.
- Descargar modelos o hacer builds completos en el Mac de Pedro; dejar codespaces vivos.
- Trabajar en el checkout de otro agente; `reset --hard` o `push --force` sobre `main`.
- Terminar una sesión sin push (trabajo solo en local o en `/tmp`) o sin actualizar `ESTADO.md`.
- Dejar copias completas del repo, builds o modelos en `/tmp` después de terminar (el 20-oct había ~24 GB acumulados).
- Inventar datos, reseñas, fuentes o promesas («100 % seguro», «el mejor»).
