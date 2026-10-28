# 28-oct · Webs sin Actions; traductor intacto; dominio único confirmado

Pedro restringe Actions para todo el trabajo de herramientas/webs y confirma que la excepción deliberada es el traductor,
con sus comprobaciones/entrega/avisos. La captura aportada muestra 0 $ gastados y presupuestos de pago bloqueados, no un cargo.
Se mantiene ese límite; no se ejecutan nuevas Actions de herramientas aunque las máquinas públicas estándar fueran gratuitas.

## Cambios verificados

- Deshabilitados por API los tres workflows de webs: `deploy-cloudflare.yml`, `validate-staged.yml` y `measure-release-capacity.yml`.
  No había ejecuciones activas de ellos que cancelar. No se modifican sus bytes, que también conservan referencias de pilotos antiguos.
- Los siete `translation-*.yml` mantienen estado `active`; la campaña 40565692987 sigue ejecutándose. No se cancela, relanza ni
  cambia fuente, presupuesto, modelos, memoria/checkpoints o avisos del traductor.
- Dependabot es un flujo dinámico gestionado por GitHub y rechaza la deshabilitación normal con HTTP 422. Se pausa la fuente
  de nuevos trabajos: PR de seguridad automáticas deshabilitadas y configuración de versiones retirada de `.github/dependabot.yml`,
  con copia exacta archivada aquí. Las alertas de vulnerabilidades siguen habilitadas. No se cierran PR existentes; GitHub puede
  conservar ejecuciones históricas y continuar rebases previos durante su periodo de conservación. No se promete borrar ese historial.
  Referencias: [flujo dinámico](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-on-actions),
  [desactivar versiones](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configure-version-updates),
  [API de actualizaciones de seguridad](https://docs.github.com/en/rest/repos/repos#disable-dependabot-security-updates).
- Las comprobaciones de este lote son lecturas posteriores de la configuración, estados y hashes; no se crean nuevos tests
  de aplicación ni se ejecuta un build. Los procedimientos de QA/publicación pasan a local/manual con evidencia en el PR.

## Un dominio y costes

La unificación en `usefulverse.com` ya está prevista en RUNBOOK §4b. La medición anterior de origen único es una referencia de
38.117 rutas de archivo, con colisiones pendientes de resolver; no es una salida desplegable. El sitio unificado debe componer
homes/metadatos/sitemaps, conservar los 700 indexables y los 300 noindex, y redirigir `tools.` mediante 301 manteniendo ruta/query.
No cambia ningún slug en este lote.

La ruta prevista es Workers Static Assets **sin script que se ejecute por visita**, con publicación manual. Cloudflare documenta
peticiones estáticas gratuitas y sin coste adicional de almacenamiento; el límite es 20.000 assets en Free y 100.000 en Paid.
Antes del corte hay que verificar que el plan Paid ya consignado en el repo sigue activo y que la configuración concreta no añade
costes. No se consulta ni cambia Cloudflare en este lote, ni se compra un plan ni se asume factura total cero.
Fuentes: [assets y facturación](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/),
[límites](https://developers.cloudflare.com/workers/platform/limits/).

## Relevo

Continuar la UI inglesa de los 14 propietarios de mercado y después los 106 recuperados con QA local/manual. Preparar el build
único conforme a §4b sin usar Actions para la web. Si un proceso no cabe en la huella local permitida, dividirlo y medirlo;
no reactivar Actions como atajo. Mantener los 18 controles/siete capas, pruebas físicas solo aplicables y sin nuevas activaciones.
La migración y el corte de dominio no se han realizado. Cero comprobaciones nuevas de producción, nuevas pruebas de Pedro o
cambios de estado de herramientas. El traductor continúa por la excepción autorizada.

Cierre: árbol de workflows, scripts, src y datos históricos del traductor idénticos a antes del lote; siete workflows activos. Se conservan para revisión manual las PR de dependencias #133/#134/#135, sin cerrarlas. Configuración/alertas comprobadas de nuevo; no hay ejecuciones no traductoras activas al verificar. Sin temporales propios creados. [Recibo](../ops-manual-v1/closure.json).
