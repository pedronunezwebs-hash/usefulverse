# Traducción en segundo plano

Decisión de Pedro, 27-oct-2026: que GitHub genere y compruebe traducciones comprensibles mientras el agente mejora la web. No invertir una sesión del chat en cada idioma ni releer todas las traducciones. Esta primera integración cubre las fuentes actuales de las 300 candidatas; todavía no conecta todos los formatos de las 700 existentes ni exporta a paquetes de producción.

## Ejecutar

```sh
gh workflow run translation-drafts.yml --repo pedronunezwebs-hash/usefulverse --ref feat/new-tools-batch-1 -f minutes=240
```

Cuatro tandas por idioma (nueve destinos cada una), máximo dos máquinas estándar simultáneas. Presupuesto de 4 h por job, timeout de 5 h, máximo 20 horas de runner en una ejecución; unas 8–10 h de ejecución sin contar colas si se agota todo el presupuesto. No es una estimación de finalización del corpus. Se para antes si acaba o llega a 32 MiB de registros por job. No hay cron, bucle infinito ni siguiente tanda automática. El Mac puede apagarse y el chat no tiene que seguir abierto. Para probar una selección: `-f locales=es,ur,nb-NO`.

## Qué hace solo GitHub

1. Extrae el inglés actual de las 300: 15.815 claves, 9.505 pares distintos texto/contexto, 36 destinos; el recuento se vuelve a medir en cada ejecución.
2. Deduplica y reutiliza checkpoints únicamente con el mismo texto, hash, contexto, idioma, modelo y configuración. Traducir una frase compartida no equivale a perder su asociación con las claves de cada herramienta.
3. Ejecuta MADLAD-400 3B CPU int8 (Apache-2.0), revisión fija `fa184c675da0b5c9e1c8694fccd4e12e2d422094`, beam 2. No llama a ninguna API de traducción ni consume tokens de ChatGPT.
4. Comprueba texto vacío, números/signos, variables, URLs, código, etiquetas y formatos protegidos, marcadores dañados, truncamiento e inglés idéntico. Añade avisos de idioma, alfabeto y longitud. Retrotraduce como máximo 20 frases por destino y señala cambios detectados de datos/negación.
5. Guarda cada registro completo inmediatamente en los logs (`UVDRAFT_RECORD`), antes de continuar; muestra contadores y resumen con pendientes. Un error posterior no borra los registros ya emitidos. El bloqueo de una tanda no declara aprobado un idioma.

Los controles automáticos detectan errores, pero no demuestran que toda frase conserve su significado. Un borrador sin avisos no equivale a idioma nativo ni a herramienta terminada. No se maquillan los datos antiguos ni se rebajan sus tests para convertir un fallo histórico en aprobado.

## Recuperar sin releer traducciones

Con el job terminado (aunque los otros sigan en marcha):

```sh
gh api repos/pedronunezwebs-hash/usefulverse/actions/jobs/JOB_ID/logs > job.log
python3 scripts/localization/background-drafts.py collect --output docs/quality/translation-drafts/checkpoints/batch-N.jsonl job.log
```

El colector valida identidades y controles, rechaza conflictos, conserva lo que ya contiene la salida y escribe de forma atómica. Recoger todos los jobs, hacer commit/push de los checkpoints y borrar logs locales. La próxima ejecución lee los checkpoints versionados y omite esos destinos exactos, incluidos los que están señalados para revisión; no repite automáticamente una traducción defectuosa para gastar horas sin resolverla. Consultar resúmenes y avisos antes de lanzar más trabajo.

Los logs tienen retención finita de GitHub: recoger/guardar checkpoints al cerrar la tanda, nunca tratarlos como respaldo permanente ni borrarlos antes del commit. La primera tanda está desatendida durante su ejecución; la recolección/importación final aún necesita ejecutar el colector y hacer commit. No hay permisos de escritura automática al repositorio: se conserva `contents:read`, sin ampliar credenciales.

## Coste y seguridad

Repo público verificado, solo `ubuntu-latest` estándar. Minutos de cómputo gratuitos conforme a GitHub; uso acotado para producir los archivos del propio proyecto, sin mantener un servicio. No artifacts ni cachés persistentes, Packages, LFS, Codespaces, runners grandes/GPU, secretos o Cloudflare. Logs/resúmenes no consumen cuota de artifacts. Los modelos/dependencias se descargan solo en la máquina desechable de Actions y se limpian al terminar. No se activa ni publica ninguna traducción con este workflow; URLs indexables sin cambio.

Fuentes comprobadas el 27-oct: [facturación](https://docs.github.com/en/billing/concepts/product-billing/github-actions), [límites](https://docs.github.com/en/actions/reference/limits), [uso permitido](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features#actions).
