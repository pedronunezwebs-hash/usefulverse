# UsefulVerse · Revisión final del plan («última pasada» y un año en piloto automático)

20-oct-2026 · Claude. Objetivo de Pedro: ejecutar este plan una vez, dejar la web **un año sola** y, cuando haya
tráfico, solo **pegar el código de anuncios**. Esta revisión añade lo que faltaba para que sea **terminable en un tiempo
razonable** y **sobreviva sin mantenimiento**. Todo está integrado en `RUNBOOK.md` y `ESTADO.md`.

---

## 1. Esfuerzo por niveles (para que el plan se pueda terminar)

Dar el tratamiento máximo a 1.000 herramientas × 37 idiomas no es terminable en un tiempo razonable. La calidad
importa más donde hay demanda. **Toda herramienta pasa la puerta mínima**, y el esfuerzo extra va donde rinde:

| Nivel | Cuáles (según `progress.csv`) | Tratamiento | Contenido orientativo |
|---|---|---|---|
| **A** | Las 150 existentes con más impresiones + las 50 nuevas con demanda confirmada | Completo: investigación long-tail, ejemplos, FAQ de 8-12 preguntas, títulos por keyword en los 10 idiomas con más impresiones, rejugabilidad, siguiente paso y widget para insertar | 900-1.400 palabras |
| **B** | Siguientes 350 por prioridad | Estándar: cómo se usa, 2 ejemplos, 6 FAQ, límites, relacionadas | 500-800 palabras |
| **C** | Resto | Puerta mínima: funciona, sin límites artificiales, intro útil, 4 FAQ, título y descripción únicos, relacionadas | 300-500 palabras |

Las cifras son orientativas: nada de relleno para llegar a un número. Un nivel C puede subir a B o A cuando Search
Console muestre impresiones. La columna `nivel` se añade a `progress.csv` en el primer lote.

## 2. Traducción: calidad objetiva y rápida

**Problema de volumen (estimación, la medirá el piloto):** con los niveles de arriba son ~540.000 palabras en inglés.
× 36 idiomas ≈ **19 millones de palabras traducidas**. Con un motor local en CPU (orden de 30-100 palabras/segundo,
sin medir todavía) son **~50-180 horas de cómputo**. Las horas gratuitas de Codespaces (~60 h al mes en 2 núcleos) y los
2.000 minutos de Actions de un repo privado **no bastan para hacerlo de una vez**. Opciones (Pedro elige):
1. **En el Mac de Pedro por la noche** (M3, ~2-4 GB de modelo, `nice -n 15`, por tandas que se pueden reanudar). Coste 0 €.
   Necesita liberar antes los ~24 GB de `/tmp`.
2. **Hacer público el repo** (y opcionalmente con licencia de código abierto): GitHub Actions es **ilimitado y gratis en repos
   públicos**, y además suma autoridad y enlaces (STRATEGY-1M §3.6). Requisito: auditar que no haya secretos en el historial.
   Las herramientas ya son código JS público en la web.
3. Repartirlo en varios meses de cuota de Codespaces.

**Decisión (20-oct-2026): repo público + GitHub Actions.** El repo se hizo público, así que las máquinas estándar de Actions
son gratis (4 núcleos y 16 GB de RAM por máquina, hasta 20 en paralelo y 6 h por trabajo). Reglas:
- Un trabajo por idioma (o por tanda), en paralelo, que se pueda reanudar, con commit de los resultados (no como artefactos).
- Solo máquinas estándar (`ubuntu-latest`); las grandes se cobran siempre.
- Uso moderado: ejecutar en tandas, no 20 máquinas día y noche durante semanas (las normas de GitHub prohíben la carga
  desproporcionada).
- Con el cómputo de sobra: MADLAD-400 3B donde gane, varios motores por frase con selección automática de la mejor, y
  controles y retrotraducción al 100 %.
- Las correcciones de nativos llegan por PR (con aprobación de Pedro).

**Reducir lo que hay que traducir:**
- **Inglés controlado** al escribir el original: frases cortas (≤ 20 palabras), una idea por frase, sin modismos, sin
  frases hechas y términos del glosario. Es lo que más mejora cualquier traducción automática, y además cumple el test
  del niño de 8 años.
- **Memoria de traducción:** cada frase única se traduce una vez. Botones, errores y textos de interfaz se repiten entre
  1.000 herramientas, así que el ahorro es enorme.
- **No se traduce** lo que no lo necesita: números, unidades, fórmulas, código, nombres de archivo, marca.

**Elegir el motor de forma objetiva, idioma a idioma (en el piloto):**
- Candidatos: M2M100 418M (MIT), MADLAD-400 3B (Apache 2.0), modelos Opus-MT por par de idiomas (comprobar la licencia de
  cada uno) y **la traducción actual** que ya está publicada.
- Juego de referencia de 40 frases por idioma (botones, errores, una FAQ, un ejemplo con cifras y una negación).
- Puntuación: controles automáticos + retrotraducción + revisión del agente (sin API de pago: ChatGPT o Claude dentro de
  la suscripción) con una rúbrica fija de 0-3: significado, negaciones y cifras, naturalidad.
- **Gana el motor con más puntos en cada idioma; si la traducción actual puntúa más, se conserva.** Se congela la elección.

**Controles automáticos en cada lote** (minutos, no horas): placeholders y cifras idénticos, proporción de longitud
0,5-2,5, idioma detectado correcto (detector ligero), nada de inglés sin traducir, escritura correcta (sin mezclar
alfabetos) y marcas RTL. **Revisión humana o del agente solo de una muestra:** 20 frases por idioma y lote.

**SEO por idioma, donde rinde:** títulos, H1 y descripción con la keyword real de cada idioma **solo en el nivel A × los
10 idiomas con más impresiones**. El resto usa plantillas de título con el glosario del idioma.

## 3. Un año sin tocar: piloto automático

**Comprobado hoy:** `usefulverse.com` está en Cloudflare Registrar, **renovación automática activada**, caduca el
**28-sep-2027** y está bloqueado contra transferencias. Falta que la **tarjeta de pago** de Cloudflare siga siendo válida
en esa fecha (y para Workers Paid cada mes).

1. **Vigilancia automática semanal (GitHub Action con cron, ~5 min al mes):**
   - 50 URLs de muestra dan 200 y una URL inventada da 404.
   - Sitemaps y `robots.txt` responden y son válidos.
   - Search Console por API (la cuenta de servicio va como *secret*): alarma si las impresiones caen > 50 % frente a la
     media de 4 semanas o si la indexación cae.
   - Si algo falla, **abre un Issue en GitHub** (llega por email a Pedro). Sin servidores ni coste.
2. **Herramientas con datos que caducan** (impuestos, prestaciones, tipos, normativa por país):
   - Cada una muestra «Datos de <año> · fuente · revisado el <fecha>».
   - **Aviso automático en la propia página** (JavaScript, sin desplegar nada): si el año actual es mayor que el año de los
     datos, aparece «Puede que estas cifras hayan cambiado en <año>; comprueba la fuente oficial».
   - El 2 de enero, una Action abre un Issue con la lista de herramientas de datos para revisar.
3. **Sin dependencias vivas:** todas las librerías servidas desde el propio sitio (sin CDN de terceros), versiones fijadas
   y sin APIs externas en tiempo de ejecución. Así nada se rompe aunque cambie un servicio externo.
4. **PWA segura:** service worker con versión y estrategia «la red primero» para el HTML. Así una versión vieja en caché
   nunca deja a nadie atascado un año. Incluye una «llave de apagado» documentada.
5. **Juegos sin mantenimiento:** el reto diario sale de la fecha (semilla), así que hay contenido nuevo cada día sin
   publicar nada.
6. **Cuentas:** 2FA en Cloudflare, GitHub y Google; avisos de facturación de Cloudflare activados; Search Console y Bing
   con notificaciones por email.
7. **Todo en GitHub:** ni una línea de trabajo solo en local. Ya está como regla del relevo.

## 4. Listo para anuncios en un día (sin activarlos todavía)

Se prepara **ahora**, durante el rediseño, para que el día que haya tráfico solo haga falta pegar el código:
1. **Huecos de anuncio reservados** en la plantilla (debajo del resultado, en la barra lateral de escritorio y a mitad del
   contenido largo), con alto fijo para no mover el diseño (CLS) y **apagados por un interruptor** de configuración. Con el
   interruptor apagado no ocupan espacio.
2. **Reglas de rendimiento:** el script de anuncios se carga después de la interacción o tras la carga, nunca bloquea el
   LCP, y no hay anuncios dentro de la herramienta mientras procesa ni ventanas emergentes.
3. **Consentimiento:** para AdSense en el EEE, Reino Unido y Suiza, Google exige un **CMP certificado integrado con IAB TCF**
   para anuncios personalizados. Opción gratuita: el mensaje de consentimiento de Google (*Privacy & messaging* de
   AdSense). Se deja preparado el lugar y la CSP para activarlo.
4. **`ads.txt`** preparado (se completa con el ID de editor el día de la activación).
5. **Política de privacidad y cookies** con una sección de anuncios lista para activar. Páginas «Sobre nosotros» y
   «Contacto», que AdSense revisa al aprobar un sitio.
6. **Checklist de activación (1 día):** solicitar AdSense → poner el ID en `ads.txt` y en la configuración → activar el CMP
   → encender el interruptor → comprobar Core Web Vitals reales durante 7 días → ajustar si el LCP o el INP empeoran.

## 5. Definición de «web terminada» (para dejarla un año)

- [ ] Fase 0 y unificación en un solo dominio hechas y verificadas.
- [ ] Diseño «Planeta Infinito» aplicado en todo el sitio.
- [ ] Todas las herramientas con la puerta mínima; nivel A completo; nivel B estándar.
- [ ] 37 idiomas en todas las herramientas activas, con el motor elegido por el piloto.
- [ ] Las 300 nuevas: subidas en `noindex` y activadas según el ritmo semanal. Las que queden por activar, en un **calendario
      automático**: la Action semanal activa hasta 30 de las que ya pasaron la puerta, sin intervención.
- [ ] Vigilancia semanal y aviso de datos caducados funcionando (probados forzando un fallo).
- [ ] Anuncios listos para activar (sección 4), Cloudflare Web Analytics activo y `KPIS.md` con la línea base.
- [ ] Dominio, tarjeta y 2FA revisados. `ESTADO.md` en «TERMINADO · modo piloto automático» con la fecha.
