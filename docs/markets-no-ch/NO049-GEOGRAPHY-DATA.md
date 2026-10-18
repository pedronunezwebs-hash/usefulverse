# NO049 — origen y actualización del mapa

## Qué cubre

El quiz usa contornos de unidades Admin 0 de Natural Earth 1:50m, versión 5.1.1. Natural Earth publica estos datos como dominio público. La capa sigue el control de facto por defecto; no es una fuente legal de fronteras. El mapa está simplificado para aprender geografía y omite o generaliza islas pequeñas. El modo disponible es mundial o por continente; no hay mapas administrativos de municipios, cantones o provincias.

La geometría trae 242 unidades; 239 tienen ISO 3166-1 alpha-2 y pueden ser opciones de respuesta. Las otras se dibujan como contexto, pero no se preguntan. El mapa no convierte soberanía disputada en una afirmación legal. Los nombres visibles de las opciones se resuelven con `Intl.DisplayNames` del navegador cuando el motor ofrece una traducción.

## Frescura verificable

La copia incluida se descargó y simplificó localmente el 2026-10-16. Natural Earth mantiene la capa 1:50m Admin 0 Countries en versión 5.1.1. La herramienta muestra esa fecha y versión en la interfaz. No afirma “actualización continua”: la web usa el fichero local y no consulta servidores externos al jugar.

Para refrescar antes de preparar una futura versión:

1. Revisar la [página oficial de 1:50m Cultural Vectors](https://www.naturalearthdata.com/downloads/50m-cultural-vectors/) y las [condiciones de reutilización](https://www.naturalearthdata.com/about/terms-of-use/).
2. Confirmar que Admin 0 Countries continúa en dominio público, anotar la versión publicada y revisar avisos de cambios.
3. Ejecutar `python3 scripts/localization/update-geography-map-data.py` desde la raíz del repositorio.
4. Revisar el diff: IDs, ISO2, geometrías, cobertura NO/CH, tamaño y fecha. Si cambia la versión de Natural Earth, actualizar explícitamente el metadato de versión en el script y en esta ficha; el refresco no debe presentarla silenciosamente como 5.1.1.
5. Ejecutar las pruebas de `geography-quiz` y volver a construir el piloto. No actualizar mapas desde el navegador de cada visitante.

El script descarga solo datos públicos y no usa una API de pago. La descarga ocurre cuando alguien ejecuta el refresco manual, no en cada build ni en las rutas publicadas.

## Diseño global

El contenido practica países, banderas y continentes sin asumir conocimientos noruegos o suizos. Los nombres de países y continentes se adaptan al idioma disponible en el navegador. Las instrucciones no preguntan por países anfitriones ni cambian el alcance geográfico a partir del idioma. Se eliminaron las preguntas frecuentes que trataban Noruega y Suiza como el contexto natural del usuario.

Los resultados, errores y elementos por repasar se guardan en `localStorage` de este navegador. No se suben ni se comparten entre dispositivos. La versión no contiene puntuación mundial o competición en línea.

## Fuente

- Natural Earth, [1:50m Cultural Vectors — Admin 0 Countries](https://www.naturalearthdata.com/downloads/50m-cultural-vectors/), versión 5.1.1.
- Natural Earth, [Terms of Use](https://www.naturalearthdata.com/about/terms-of-use/): los vectores y ráster publicados en el sitio son de dominio público.
