# Auditoría · Juegos y puzzles (UsefulVerse, 20-oct-2026)

Alcance: 92 páginas (80 de `juegos.csv` + 12 juegos de `otros.csv`). Se descargó y leyó el JS de producción de cada juego (`/assets/*.js`, `/assets/market-tools/*.mjs`, módulos `*-runtime.js` que carga `app.js` → `opportunity-runtime.js`). Revisados en profundidad: 31 juegos. No se ha probado nada en un navegador real, así que el comportamiento táctil y visual sale de leer el código. Los volúmenes de palabra clave son orientativos y [NV] = no verificado, porque no hay API de pago.

## Resumen

1. **La rejugabilidad está partida en dos.** Las 30 páginas de `market-tools` (suguru, shikaku, codebreaker, bubble-shooter, juegos de cartas nórdicos y alpinos…) traen semilla, autoguardado y, en algunos casos, reto diario. Suguru es el único juego con reto diario, estadísticas y racha, así que debe servir de **patrón interno** para los demás. En cambio, los juegos de más demanda (sudoku, solitario, 2048, buscaminas, mahjong, ajedrez) **no guardan la partida, no tienen estadísticas, ni reto diario, ni opción de compartir**.
2. **Hay listas fijas muy cortas en juegos de demanda alta.** Crucigrama: 43 pistas. Ahorcado: 24 palabras. Jeroglíficos (rebus): 10. Problemas de ajedrez: unos 10, todos mate en 1. Entrenador de aperturas: 10. Sokoban: 2 niveles. Tangram: 3 siluetas. Senku (peg solitaire): 1 tablero.
3. **El generador de sudoku produce siempre el mismo tipo de cuadrícula.** Parte de un patrón fijo `(w*3+floor(w/3)+g)%9`, de modo que **200 de 200 soluciones** generadas tienen la estructura de «tríos repetidos» (comprobado ejecutando el JS). Además, «difícil» deja siempre exactamente 31 pistas, sin graduar por técnicas. Killer sudoku usa el mismo patrón.
4. **Faltan funciones básicas frente a los líderes.** El ajedrez, las damas, el conecta 4, Reversi, el Go y el backgammon son **solo para dos personas en el mismo dispositivo, sin rival de IA**, aunque Stockfish 19 ya está alojado para el tablero de análisis. El 2048 **no admite deslizar el dedo**. El juego de palabras de cinco letras **solo incluye la lista en noruego**, también en la página en inglés. Mahjong es una rejilla plana de 8×6 con símbolos ●◆▰, y el Kakuro es un 4×4 de sumas: ninguno de los dos es el juego real que se busca.
5. **SEO:** las páginas de `usefulverse.com` usan el título genérico «X — Free · no limits | UsefulVerse» (distinto del H1), tienen 2 preguntas frecuentes de relleno («Is my data uploaded?») y unas 300 palabras. Las 30 páginas de `market-tools` **no tienen JSON-LD** y cada una incrusta unos **74 KB de textos de otras herramientas** (impuestos noruegos, pensiones suizas…). Además hay un título en noruego en la página inglesa de crazy-eights («Vri åtter Online»).

## Rejugabilidad

| slug | ¿infinito? | evidencia | arreglo |
|---|---|---|---|
| sudoku | Sí en número; **no en variedad** | `sudoku-runtime.js` `H()`: patrón `(w*3+Math.floor(w/3)+g)%9+1`; `P()`: `{easy:36,medium:44,hard:50}` huecos; 200/200 cuadrículas con tríos repetidos; sin guardado, temporizador ni estadísticas | Generador de cuadrícula aleatoria (backtracking desde cero); dificultad graduada por técnicas (singles → pares → X-wing); autoguardado; tiempos y estadísticas; reto diario por semilla |
| killer-sudoku | Igual que sudoku | `killer-sudoku.*.js` con el mismo `(c*3+Math.floor(c/3)+f)%9` | Mismo arreglo (compartir generador) |
| solitaire | Sí (barajado aleatorio) | `solitaire-runtime.js`: `Y()` Fisher-Yates con `crypto`; deshacer 100; sin número de partida, puntuación ni estadísticas | Número de partida y semilla, partidas ganables, puntuación, tiempo, % de victorias y racha |
| spider / freecell / pyramid / tripeaks | Sí | `Math.random` sin semilla expuesta; FreeCell sin numeración tipo Microsoft | FreeCell con «Game #1–1 000 000» (el algoritmo es público); reto diario |
| mahjong-solitaire | Sí, pero trivial | `mahjong-solitaire-runtime.js`: `Array(48)`, `width:8,height:6`, fichas `["●","◆","▰"]` × 1–4; la ficha está libre si tiene un lado horizontal vacío | Disposiciones reales de 144 fichas por capas (tortuga, etc.) y fichas mahjong en SVG; barajar, pista y deshacer |
| chess-puzzles | **No** | `chess-puzzles.*.js`: unas 10 posiciones `{id:"queen-rook-01",fen:…,san:"Qxf6#"}`, solo mate en 1 con blancas | Incluir un subconjunto de la base de problemas de Lichess (licencia CC0) por nivel y tema, con problema diario y racha |
| chess-opening-trainer | No | 10 aperturas (`name:"Italian Game"`…); el desplegable muestra 7 | Ampliar a más de 40 líneas y repaso espaciado |
| chess-game | n/a (sin IA) | `chess-game-runtime.js`: solo `f.move` local; página «local two-player game» | Rival Stockfish con niveles (el worker ya está en `/assets/vendor/stockfish-19.0.0/`) |
| crossword-online | **No** | Página con `puzzles[43]` y `maxEntries:10`; las FAQ admiten «small, finite set» | Banco de más de 2 000 pistas por idioma y crucigrama diario por semilla |
| five-letter-word-game | Solo en noruego | `five-letter-word-controller.mjs`: `bankId='nb-bokmal…'`, `nb-targets.txt` (5 177) y `nb-accepted.txt` (11 389); no hay lista inglesa (`en-targets.txt` → devuelve la home con código 200) | Listas propias por idioma (EN/ES/FR/DE/PT/IT…), modos diario e ilimitado, estadísticas y racha |
| hangman-game | **No** | `wordBank[24]` (`apple, forest, river…`), también en ES | Más de 1 000 palabras por idioma, con categorías y nivel |
| rebus-puzzles | **No** | 10 objetos `{id:"head-heels",…}` | Más de 200 o una plantilla generativa; rebus diario |
| sokoban | **No** | 2 niveles («First push», «Up the lane») | Paquetes de niveles libres (p. ej. de licencia abierta [NV]) y generador sencillo |
| tangram | No | 3 siluetas (House/Boat/Bird) | Más de 50 siluetas |
| peg-solitaire | No | Solo el tablero inglés | Tableros europeo, triangular y diamante |
| nonogram | Sí, pero pobre | `nonogram-runtime.js`: `s=5` fijo, ruido aleatorio `<.44` | 10×10, 15×15 y 20×20 con imágenes; garantizar resolución lógica |
| kakuro | Sí, pero no es Kakuro | `kakuro-runtime.js`: `size:4`, sumas de fila y columna sin casillas negras | Kakuro real con bloques y pistas por tramo, tamaños 7–12 |
| minesweeper | Sí | Primer clic seguro, «chording» (abrir vecinas), clic derecho, modo bandera | Mejores tiempos, tamaño personalizado, modo «sin adivinar», tablero diario |
| 2048-game | Sí | `2048-game-runtime.js`: sin `touch` ni `pointer`; deshacer 1; sin récord | Deslizar, récord en `localStorage`, autoguardado, tableros de 3×3/5×5/6×6 |
| match-three-game | Sí (12 niveles y luego repite el último) | `MATCH_LEVELS` con 12 objetivos y semilla | Niveles procedurales sin tope |
| brick-breaker-game | Casi | `createBrickLayout`: `pattern=(row+column+level/2)%5` | Patrones con semilla y potenciadores |
| codebreaker / shikaku / suguru / bubble-shooter | **Sí** (diario) | `dailyShikakuSeed`, `dailyBubbleSeed`, `daily` en suguru con `usefulverse-suguru-stats-v1` y racha | Modelo a seguir; añadir compartir a codebreaker y bubble |
| hashi / futoshiki / hitori / nurikabe / slitherlink / binary | Sí (generador con comprobación de solución única) | `generation`, `uniquely` y `solver` en cada JS | Reto diario, guardado y tamaños mayores (slitherlink y shikaku llegan como máximo a 6×6) |
| battleship | Sí, pero pobre | `battleship-runtime.js`: `L=[4,3,2]` en 8×8; el disparo de la CPU `H()` es al azar | Tablero 10×10 con 5 barcos (5,4,3,3,2), colocación manual y CPU que remata (busca y hunde) |
| jigsaw-puzzle | Depende de la foto del usuario | Intercambio de cuadrados, máximo 5×5 | Imágenes de stock libres, piezas con encaje y hasta 300 piezas |
| word-search-maker | No se puede jugar | Solo genera texto («Calculate») | Página de juego «word search» con temas y selección por arrastre |

## Huecos frente a los líderes

Volumen relativo [NV]: A = muy alto, M = medio, B = bajo.

| keyword (EN) | qué falta | líder de referencia | demanda | prioridad |
|---|---|---|---|---|
| play chess against computer | IA con niveles en chess-game | Chess.com, Lichess | A | P1 |
| wordle unlimited / word guess game | Lista inglesa y del resto de idiomas | NYT Wordle | A | P1 |
| mahjong solitaire / mahjong | Mahjong real por capas | Poki, mahjongsolitaire [NV] | A | P1 |
| daily sudoku / sudoku hard / expert | Diario y dificultad real | sudoku.com | A | P1 |
| word search (play) | Página de juego | puzzle-baron, coolmath [NV] | A | P1 |
| checkers / reversi / connect 4 vs computer | IA | CrazyGames, Poki | A | P1 |
| klondike solitaire turn 3 | Página propia y puntuación | solitaired.com | A | P1 |
| chess puzzles (cientos) | Banco CC0 | Lichess | A | P1 |
| connections-style word groups | Juego nuevo («word groups», sin la marca) | NYT Connections | A | P2 |
| spelling bee-style (letter hive) | Juego nuevo | NYT | M | P2 |
| block puzzle (estilo Tetris, sin la marca) | Juego nuevo | Poki | A | P2 |
| calcudoku / mathdoku (tipo KenKen) | Juego nuevo | KenKen, Tatham («Keen») | M | P2 |
| golf / yukon / forty thieves solitaire | Variantes | solitaired.com | M | P2 |
| cryptogram | Juego nuevo | puzzle-baron | M | P2 |
| word scramble / word ladder | Juego nuevo | coolmath [NV] | M | P2 |
| nonogram 10x10/15x15 | Tamaños | puzzle-nonograms [NV] | M | P2 |
| star battle / tents / light up / skyscrapers / flow | Puzzles lógicos | Simon Tatham, puzzle-baron | M | P3 |
| dinosaur / flappy-style / 2048 variantes | Arcade | Poki, CrazyGames | M | P3 |
| backgammon vs computer | IA | GammonVillage [NV] | M | P3 |

## Páginas dedicadas y variantes

| página nueva o renombrada | base técnica existente | demanda | nota |
|---|---|---|---|
| /sudoku/easy, /medium, /hard, /expert | sudoku | A | Solo tras graduar la dificultad por técnicas |
| /daily-sudoku (y killer diario) | sudoku + semilla por fecha | A | Mismo puzzle para todos, compartir el tiempo |
| /printable-sudoku | sudoku | M | Exportar a PDF y lotes de 4/6 |
| /klondike-solitaire, /solitaire-turn-3 | solitaire (`drawCount:3` ya existe) | A | Contenido propio, no duplicado |
| /spider-solitaire-1-suit, -2-suit | spider (opción ya existe) | M | |
| /freecell-game-number | freecell | M | Partidas numeradas |
| /chess-vs-computer | chess-game + Stockfish | A | No borrar chess-game: queda como «dos jugadores» |
| /checkers-vs-computer, /reversi-vs-computer, /connect-4-vs-computer | board-games-runtime | A | Mismo criterio |
| /minesweeper-expert, /no-guess-minesweeper | minesweeper | M | |
| /word-search, /word-search-printable | word-search-maker | A | El generador queda como «maker» |
| /wordle-unlimited-en (nombre sin marca) | five-letter-word-game | A | Una página por idioma de lista |
| /yatzy (redirigir slug) | dice-poker-game | A | El slug dice «dice poker», pero el juego es Yatzy; el «dice poker» real es otro juego |
| /chinese-checkers | halma-game | M | Variante en estrella |
| /mahjong-tiles-classic | mahjong-solitaire | A | Disposición real |

**Casi duplicados (diferenciar, nunca borrar):** typing-practice frente a typing-speed-test (uno de lecciones, otro de medir WPM: diferenciar títulos e intención); chess-game frente a chess-analysis-board (uno para jugar, otro para analizar); memory-game frente a memory-test (juego frente a medición); crossword-online frente a crossword-maker; jigsaw-puzzle (hoy «maker») frente a un futuro jigsaw con imágenes; sudoku frente a sudoku-solver (enlazar entre ellos: «resolver el de hoy»).

## Problemas por juego

| slug | problema | evidencia | arreglo | P |
|---|---|---|---|---|
| sudoku | Todas las cuadrículas tienen la misma estructura y la dificultad solo cuenta huecos | `H()`; prueba: 200/200 y «hard» siempre con 31 pistas | Generador real y graduación por técnicas | P1 |
| sudoku | No hay temporizador, guardado, deshacer, contador de errores, resaltado de iguales ni autonotas | `sudoku-runtime.js`: `localStorage` solo guarda hashes de partidas recientes (`usefulverse:sudoku:recent:v1`) | Añadir todo eso más estadísticas | P1 |
| five-letter-word-game | En inglés no hay lista inglesa y el título promete «Choose a Language» | Opciones `nb` y `custom` | Listas EN/ES/FR/DE/PT como mínimo | P1 |
| five-letter-word-game | El día del reto va por UTC: en España cambia a la 01:00 o 02:00 | `now.toISOString().slice(0,10)` | Usar la fecha local (o UTC, pero indicarlo en la interfaz) | P3 |
| chess-game | Sin rival de IA | Página «Play a local two-player game» | Stockfish lite con 8 niveles | P1 |
| chess-puzzles | Unos 10 problemas, mate en 1 y solo blancas | Lista `fen` | Base de Lichess (CC0), ritmo por puntuación y diario | P1 |
| crossword-online | 43 pistas y como mucho 10 entradas | Página con `puzzles[43]` | Banco grande y diario | P1 |
| hangman-game | 24 palabras | `wordBank[24]` | Más de 1 000 por idioma, con categorías | P1 |
| mahjong-solitaire | No es mahjong: 48 fichas planas y símbolos geométricos | Runtime y la propia página: «not the traditional layered layout» | Disposiciones por capas, pista, barajar y deshacer | P1 |
| 2048-game | No se puede deslizar en móvil; el teclado solo funciona con el foco dentro del juego | Sin `touch`/`pointer`; `e.contains(document.activeElement)` | Gestos con `pointer` y escuchar el teclado en `document` mientras la partida está visible | P1 |
| solitaire | Sin arrastrar, sin doble clic que mande la carta a la fundación, sin autocompletar ni puntuación; cartas en texto («A♠») | `solitaire-runtime.js` solo con `click` | Arrastrar con `pointer`, envío automático, cartas en SVG y estadísticas | P1 |
| connect-four / reversi / checkers / go / backgammon | Sin IA | `board-games-runtime.js` sin búsqueda; páginas «Local Two-Player» | Minimax o alfa-beta con 3 niveles (Go: MCTS sencillo, P3) | P1 |
| kakuro | No es Kakuro (4×4 de sumas) | `size:4`, `rowSums`/`columnSums` | Kakuro real, o renombrarlo «sum grid» y crear el real | P1 |
| crazy-eights-card-game | Título en noruego en EN y ES | `<title>Vri åtter Online…` | Título «Crazy Eights Online» | P1 |
| market-tools (30 páginas) | Sin JSON-LD (ni WebApplication ni FAQPage); unos 74 KB de JSON con textos de otras herramientas | `data-tool-copy` con 56 claves (`norwayTax`, `swissUid`…) | Dividir el JSON por herramienta y añadir schema | P1 |
| usefulverse.com (22 juegos) | Título genérico distinto del H1; 2 FAQ de plantilla; texto «made simple» | `Sudoku online — Free · no limits` frente al H1 «Free Sudoku Online — Unique Puzzles» | Títulos con intención («Sudoku Online – Easy to Expert, Daily»), 5–8 FAQ reales, reglas y estrategia (800+ palabras) | P1 |
| tic-tac-toe | IA perfecta, imposible de ganar, sin niveles | Minimax completo en `y()` | Fácil (al azar), medio (minimax con errores) e imposible | P2 |
| battleship | 8×8 con 3 barcos y CPU que dispara al azar | `L=[4,3,2]`, `H()` | 10×10, flota estándar, colocación manual y CPU que remata | P2 |
| nonogram | Solo 5×5 | `let s=5` | Más tamaños | P2 |
| sokoban / tangram / peg / rebus | Contenido fijo de 2, 3, 1 y 10 elementos | Ver tabla de rejugabilidad | Ampliar paquetes | P2 |
| chess-opening-trainer | Desplegable con 7 frente a 10 en el JS | `<select>` frente a `name:` | Revisar y ampliar | P2 |
| minesweeper | Sin mejores tiempos; «difícil» de 30 columnas en móvil [NV visual] | Sin `localStorage` | Récords; zoom o scroll en móvil | P2 |
| snake-game | Sin deslizar ni récord guardado | Botones `data-action` sin `touch` | Gestos y récord | P2 |
| jigsaw-puzzle | Intercambio de cuadrados, no piezas; obliga a subir una foto | Página «Select one square tile, then another» | Piezas con encaje e imágenes incluidas | P2 |
| dice-poker-game | El slug no coincide con el juego (Yatzy) | Título «Yatzy Online» | Slug /yatzy con redirección 301 y un dice poker real aparte | P2 |
| IA de cartas y tableros (mancala, dots, gomoku, hearts, spades…) | Heurística voraz de 1 jugada, sin selector de dificultad | Mancala `h()`: elige el máximo de `score` de una jugada | Nivel «difícil» con búsqueda a 2–4 jugadas o Monte Carlo [fuerza no medida] | P2 |
| assets | Una ruta inexistente devuelve la home con 200 (soft-404) | `curl …/en-targets.txt` → `<title>Free everyday tools` | Devolver 404 real en `/assets/` | P3 |
| todos | Sin pantalla completa ni sonido opcional (fuera de los arcade) | `requestFullscreen` = 0 en todos; audio solo en pinball, minigolf, brick y match-3 | Botón de pantalla completa común y sonidos con interruptor | P3 |
| cribbage | Está clasificado fuera de Juegos | Aparece en otro CSV | Moverlo a la categoría Juegos | P3 |

## Ideas para superar a la competencia (sin servidor)

1. **Reto diario con semilla por fecha** en todos los juegos con generador (sudoku, killer, minesweeper, nonogram, solitaire, freecell, mahjong, hashi…). Basta con `seed = hash("sudoku:"+YYYY-MM-DD+":"+nivel)`, porque el generador ya acepta un `random`: hoy recibe `W` de `crypto` y habría que pasarle un PRNG con semilla. No hace falta servidor y todos juegan el mismo puzzle.
2. **Módulo común de «sesión de juego»** a partir del patrón de suguru (`*-save-v1`, `*-stats-v1`, racha): autoguardado, partidas jugadas y ganadas, mejor tiempo, racha actual y máxima, histograma. Un solo módulo para más de 90 páginas.
3. **Tarjeta para compartir:** texto con emojis, como ya hace five-letter, y además una imagen generada con `canvas` («Sudoku diario · Difícil · 07:42 · sin pistas»), con `navigator.share` en móvil y un enlace `?seed=` para retar a otra persona a la misma partida.
4. **Enlaces de reto entre personas:** `?seed=…&mode=…` en solitario, buscaminas o 2048 («¿me superas en esta misma partida?»), sin cuentas.
5. **Ventaja de 37 idiomas:** listas de palabras propias por idioma (ahorcado, cinco letras, sopa de letras, crucigrama). NYT y los demás líderes apenas cubren el inglés. Es el foso competitivo más claro.
6. **IA con niveles** reutilizando Stockfish (ya alojado) y un minimax común para tableros, con una página «vs computer» por juego.
7. **Calidad sin coste:** gestos táctiles comunes (deslizar o arrastrar con `pointer`), pantalla completa, sonidos opcionales, deshacer ilimitado, pistas con explicación de la técnica (sudoku: «par desnudo en la fila 3»). Esto último lo hacen pocos líderes gratis.
8. **Contenido CC0 o libre** para los juegos de lista fija: problemas de Lichess (CC0), listas de palabras con licencia abierta por idioma (como ya se hizo con Norsk Ordbank CC BY 4.0) y paquetes de Sokoban de licencia libre [verificar licencias].
9. **SEO por variante y diario:** páginas de dificultad, de variante y diarias con contenido propio (reglas, estrategia, FAQ real, `HowTo`/`FAQPage`), enlazadas desde un centro «Sudoku», «Solitaire», etc.
10. **Logros locales** (primer «sin pistas», 7 días seguidos, menos de 5 minutos en difícil) guardados en `localStorage`: más retención sin servidor ni cuentas.

[NV] pendientes: volúmenes de búsqueda, comportamiento táctil real en móvil, fuerza real de las IA y licencias de los paquetes de terceros.
