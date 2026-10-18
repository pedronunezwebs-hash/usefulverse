# CH004–CH006 · estado de traducción y revisión

## Cobertura local

Los tres pilotos tienen 37 rutas (36 idiomas de interfaz más inglés) y packs estáticos completos por clave: CH004 tiene 55 cadenas, CH005 57 y CH006 50. El navegador no llama a un servicio de traducción ni transmite las entradas del cálculo.

Los borradores se generaron localmente con MADLAD-400. Tras una revisión de muestras se corrigió el espaciado entre cláusulas y se normalizaron respuestas iniciales `Yes.`/`No.` para evitar expansiones erróneas del modelo. El build aislado de estas tres herramientas generó 111 rutas en `/private/tmp/usefulverse-protected-pensions-pilot-20261018`; el build integrado posterior generó 592 páginas para 16 herramientas ×37 idiomas en `/private/tmp/usefulverse-final16-pilot-20261018`.

## Pendiente de revisión nativa

El inventario histórico contiene 338 fragmentos que el modelo local dejó en inglés por no traducir o cambiar importes, porcentajes o años: 97 de CH004, 208 de CH005 y 33 de CH006. Se mapearon a 302 frases completas por herramienta/idioma y se generaron traducciones estáticas gratuitas con cada secuencia numérica enmascarada y comprobada antes de sustituirla. 246 valores se tradujeron; 56 permanecen iguales a la fuente porque son números/códigos o el cognado válido “Scenario” (cuatro usos italiano/noruego/neerlandés/sueco). Diez frases de BVG con fechas se corrigieron manualmente para respetar el orden natural de fecha y los valores 17-oct-2026, 2027 y 1,75%. El smoke de HTML verificó que los 338 valores objetivo aparecen en las 111 páginas financieras y en el build integrado de 592 páginas. Los registros originales y residuales están en `CH004-CH006-translation-review-fallbacks.json` y `CH004-CH006-translation-review-fallback-residuals.json`.

El build comprueba claves completas y render de rutas; no certifica calidad semántica, terminología financiera, adecuación cultural ni experiencia visual. Los textos siguen siendo borradores y requieren revisión nativa antes de publicar. No se hizo suite automatizada ni revisión visual en este paso.
