import { ptBR } from './locales/pt-br.mjs';
import { deDE } from './locales/de.mjs';
import { longtailBodies } from './locales/longtail.mjs';
import { advancedToolLocales } from './locales/advanced-tools.mjs';
import { expandedToolLocales } from './locales/expanded-tools.mjs';
import { expandedToolUiLocales } from './locales/expanded-ui.mjs';
import { priorityToolLocales } from './locales/priority-tools.mjs';
import { browserBatchLocales } from './locales/browser-batch.mjs';
import { imageFormatLocales } from './locales/image-formats.mjs';
import { officePackageLocales, tiffHints } from './locales/office-package.mjs';
import { mediaToolLocales } from './locales/media-tools.mjs';
import { toolSuiteLocales } from './locales/tool-suite.mjs';
import { pdfParityLocales } from './locales/pdf-parity.mjs';
import { pdfRedactLocales } from './locales/pdf-redact.mjs';
import { imageCaptureUiLocales } from './locales/image-capture.mjs';
import { htmlToPdfLocales } from './locales/html-to-pdf.mjs';
import { pdfToPdfaLocales } from './locales/pdf-to-pdfa.mjs';
import { pdfOfficeUiLocales } from './locales/pdf-office-ui.mjs';
import { pdfOnlyLocaleData } from './locales/pdf-only-locales.mjs';
import { pdfOnlyExtraLocaleData } from './locales/pdf-only-extra.mjs';
import { pdfOnlyUiLocales } from './locales/pdf-only-ui.mjs';
import { guidePacks } from './locales/guide-packs.mjs';
import {
  expandedLocaleCopyFixes,
  expandedLocaleFaqFixes,
  expandedLocaleGuideFixes,
  expandedLocaleMetaFixes,
  expandedLocaleStatusFixes,
  expandedLocaleTemplateFixes,
  expandedLocaleTitleFixes,
  expandedLocaleTranslationReview,
  expandedLocaleUiFixes,
} from './locales/expanded-locale-review.mjs';

export const locales = {
  en: { code: 'en', name: 'English', prefix: '', homeTitle: 'Everyday Online Tools', homeDescription: 'Fast, private browser tools for text, files, data, SEO and everyday tasks. No account and no upload required.' },
  es: { code: 'es', name: 'Español', prefix: '/es', homeTitle: 'Herramientas online', homeDescription: 'Herramientas rápidas y privadas para texto, datos, SEO y tareas cotidianas. Sin cuenta ni archivos subidos.' },
  fr: { code: 'fr', name: 'Français', prefix: '/fr', homeTitle: 'UsefulVerse — Des outils simples au quotidien', homeDescription: 'Des outils rapides et privés pour le texte, les données, le SEO et les tâches du quotidien. Sans compte ni envoi de fichiers.' },
  pt: { code: 'pt-BR', name: 'Português (Brasil)', prefix: '/pt-br', homeTitle: 'UsefulVerse — Ferramentas online simples e gratuitas', homeDescription: 'Ferramentas online rápidas e privadas para texto, dados, SEO e tarefas do dia a dia. Sem conta e sem enviar arquivos.' },
  de: { code: 'de', name: 'Deutsch', prefix: '/de', homeTitle: 'UsefulVerse — Einfache Online-Tools für den Alltag', homeDescription: 'Schnelle, private Browser-Tools für Text, Daten, SEO und alltägliche Aufgaben. Ohne Konto und ohne Datei-Upload.' },
};

// These languages are published only for the PDF tool cluster. They are kept
// separate from `locales` so they do not imply that the full 88-tool site has
// been translated.
export const pdfToolIds = [
  'pdf-tools', 'pdf-protect-unlock', 'pdf-repair', 'pdf-crop', 'pdf-redact', 'pdf-to-pdfa',
  'image-to-pdf', 'pdf-to-image', 'pdf-page-editor', 'pdf-ocr', 'pdf-document-converter',
  'html-to-pdf', 'pdf-to-markdown', 'pdf-form-filler', 'pdf-compare',
];
export const pdfOnlyLocaleDataAll = { ...pdfOnlyLocaleData, ...pdfOnlyExtraLocaleData };
export const expandedFullLocaleKeys = ['it', 'zh_tw', 'bg', 'ca', 'nl', 'el', 'ms', 'pl', 'sv', 'th', 'uk', 'sw'];
export const numberWordsLocaleCodes = {
  it: 'it-IT', zh_tw: 'zh-TW', bg: 'bg-BG', ca: 'ca-ES', nl: 'nl-NL', el: 'el-GR',
  ms: 'ms-MY', pl: 'pl-PL', sv: 'sv-SE', th: 'th-TH', uk: 'uk-UA', sw: 'sw-KE',
};
export const pdfOnlyLocaleKeys = Object.keys(pdfOnlyLocaleDataAll).filter((key) => !expandedFullLocaleKeys.includes(key));
export const pdfOnlyLocales = {};
export const pdfOnlyPacks = {};

export function localePath(language, toolId = '') {
  const prefix = (locales[language] ?? pdfOnlyLocales[language])?.prefix ?? '';
  return `${prefix}${toolId ? `/tools/${toolId}/` : '/'}`;
}

export function localeHomePath(language) {
  return pdfOnlyLocales[language] ? localePath(language, 'pdf-tools') : localePath(language);
}

export const ui = {
  es: {
    'UsefulVerse home': 'Inicio de UsefulVerse', 'Main navigation': 'Navegación principal', Language: 'Idioma', Tools: 'Herramientas', 'How it works': 'Cómo funciona', 'Find a tool': 'Buscar una herramienta', 'A useful place on the internet': 'Un lugar útil en internet', 'Do the small things': 'Resuelve lo pequeño', 'faster.': 'más rápido.', 'Simple browser tools for text, data and everyday work. No account. No upload. Just open a tool and get it done.': 'Herramientas sencillas para texto, datos y tareas cotidianas. Sin cuenta ni archivos subidos. Abre una herramienta y termina en un momento.', 'Explore tools': 'Ver herramientas', 'UsefulVerse principles': 'Principios de UsefulVerse', 'Fast by default': 'Rápido desde el inicio', 'Private by design': 'Privado por diseño', 'Free to use': 'Gratis', 'The toolbox': 'La caja de herramientas', 'Find the right tool.': 'Encuentra la herramienta adecuada.', 'Search tools': 'Buscar herramientas', All: 'Todas', Writing: 'Escritura', Text: 'Texto', Developer: 'Desarrollo', SEO: 'SEO', Everyday: 'Uso diario', Privacy: 'Privacidad', Data: 'Datos', Design: 'Diseño', 'Open tool': 'Abrir herramienta', 'No tools match that search yet. Try another word.': 'Ninguna herramienta coincide con tu búsqueda. Prueba otra palabra.', 'Why UsefulVerse': 'Por qué UsefulVerse', 'Small tools.': 'Herramientas pequeñas.', 'Clear answers.': 'Respuestas claras.', 'Each tool has one clear job. You can start in seconds.': 'Cada herramienta hace una cosa. Puedes empezar en segundos.', 'Work privately': 'Trabaja en privado', 'Your text stays in your browser for browser-first tools.': 'En las herramientas locales, tu texto no sale del navegador.', 'Take the result': 'Llévate el resultado', 'Copy it or use it where you need it next.': 'Cópialo o úsalo donde lo necesites.', 'Simple tools that respect your time and your files.': 'Herramientas sencillas que respetan tu tiempo y tus archivos.', 'All tools': 'Todas las herramientas', 'Privacy first': 'Privacidad ante todo', 'Breadcrumb': 'Ruta de navegación', 'tool': 'Herramienta', 'Runs in your browser. No upload.': 'Funciona en tu navegador. No se suben datos.', 'About this tool': 'Acerca de esta herramienta', ' made simple.': ' sin complicaciones.', 'Common questions': 'Preguntas frecuentes', 'Keep going': 'Sigue explorando', 'More useful tools': 'Más herramientas útiles', 'Browse all tools': 'Ver todas las herramientas',
    'Text to count': 'Texto que quieres contar', 'Start typing or paste your text here...': 'Empieza a escribir o pega tu texto aquí…', Words: 'Palabras', Characters: 'Caracteres', 'Without spaces': 'Sin espacios', Lines: 'Líneas', 'Reading time': 'Tiempo de lectura', 'Copy summary': 'Copiar resumen', Clear: 'Borrar', 'Your counts update as you type.': 'El recuento se actualiza mientras escribes.', 'Text to convert': 'Texto que quieres convertir', 'Paste text here...': 'Pega el texto aquí…', 'Text case options': 'Opciones de mayúsculas y minúsculas', UPPERCASE: 'MAYÚSCULAS', lowercase: 'minúsculas', 'Sentence case': 'Tipo oración', 'Title Case': 'Mayúscula Inicial', Result: 'Resultado', 'Your converted text will appear here...': 'El texto convertido aparecerá aquí…', 'Copy result': 'Copiar resultado', 'Choose a format to create your result.': 'Elige un formato para crear el resultado.', 'List to clean': 'Lista que quieres limpiar', 'Paste one item per line...': 'Pega un elemento por línea…', 'Trim spaces': 'Quitar espacios al inicio y al final', 'Ignore case': 'Ignorar mayúsculas y minúsculas', 'Remove empty lines': 'Quitar líneas vacías', 'Remove duplicates': 'Quitar duplicados', 'Your cleaned list will appear here.': 'La lista limpia aparecerá aquí.', 'Clean list': 'Lista limpia', 'Cleaned lines...': 'Líneas limpias…', 'JSON to format': 'JSON que quieres dar formato', 'Format JSON': 'Dar formato a JSON', Minify: 'Minimizar', 'Paste JSON to validate it.': 'Pega JSON para validarlo.', 'Formatted JSON...': 'JSON con formato…', 'Base64 direction': 'Dirección de Base64', 'Encode to Base64': 'Codificar a Base64', 'Decode Base64': 'Decodificar Base64', 'Value to convert': 'Valor que quieres convertir', 'Text to encode...': 'Texto que quieres codificar…', 'Base64 to decode...': 'Base64 que quieres decodificar…', Convert: 'Convertir', 'Runs only in your browser.': 'Se procesa únicamente en tu navegador.', 'Result...': 'Resultado…', 'URL direction': 'Dirección de URL', 'Encode URL text': 'Codificar texto para URL', 'Decode URL text': 'Decodificar texto de URL', 'URL text to convert': 'Texto de URL que quieres convertir', 'Use encode for text that must travel safely inside a URL.': 'Usa «Codificar» para incluir texto de forma segura en una URL.', 'Title or phrase': 'Título o frase', 'How to write a great blog post': 'Cómo escribir una buena entrada de blog', 'Keep numbers': 'Conservar números', 'Keep non-Latin letters': 'Conservar letras no latinas', 'URL slug': 'Parte legible de la URL (slug)', 'your-clean-url-slug': 'tu-url-limpia', 'Create slug': 'Crear slug', 'Copy slug': 'Copiar slug', 'A good slug is short, clear and easy to read.': 'Un buen slug es corto, claro y fácil de leer.', 'What is a percentage of a number?': '¿Cuánto es un porcentaje de una cantidad?', Percent: 'Porcentaje', 'Base number': 'Cantidad total', 'What percent is one number of another?': '¿Qué porcentaje representa una cantidad de otra?', Part: 'Parte', 'Whole number': 'Número entero', 'What is the percentage change?': '¿Cuál es el cambio porcentual?', From: 'De', to: 'a', 'New number': 'Nuevo valor', Calculate: 'Calcular', 'Copy answers': 'Copiar resultados', 'Fill in any calculation you need.': 'Completa los datos del cálculo que necesites.', 'Your password': 'Tu contraseña', 'Click Generate password': 'Pulsa «Generar contraseña»', 'Length:': 'Longitud:', Uppercase: 'Mayúsculas', Lowercase: 'Minúsculas', Numbers: 'Números', Symbols: 'Símbolos', 'Exclude similar characters': 'Excluir caracteres parecidos', 'Generate password': 'Generar contraseña', 'Copy password': 'Copiar contraseña', 'Generated locally with your browser’s secure random generator.': 'Se genera en tu navegador con un sistema seguro de números aleatorios.', 'Unix timestamp to date': 'De marca de tiempo Unix a fecha', 'Timestamp in seconds or milliseconds': 'Marca de tiempo en segundos o milisegundos', 'Convert to date': 'Convertir a fecha', UTC: 'UTC', 'Your local time': 'Tu hora local', 'Date to Unix timestamp': 'De fecha a marca de tiempo Unix', 'Date and time in your time zone': 'Fecha y hora en tu zona horaria', 'Convert to timestamp': 'Convertir a marca de tiempo', Seconds: 'Segundos', Milliseconds: 'Milisegundos', 'Your dates stay in this browser.': 'Tus fechas se quedan en este navegador.', 'HTML entity direction': 'Dirección de entidades HTML', 'Encode HTML': 'Codificar HTML', 'Decode HTML': 'Decodificar HTML', 'Use & symbols safely': 'Usa los símbolos & de forma segura', 'CSV data': 'Datos CSV', 'Convert to JSON': 'Convertir a JSON', 'The first row becomes the JSON keys.': 'La primera fila se convierte en las claves de JSON.', 'JSON result': 'Resultado JSON', 'JSON array': 'Array de JSON', 'Convert to CSV': 'Convertir a CSV', 'Use an array of JSON objects with a shared set of keys.': 'Usa un array de objetos JSON con las mismas claves.', 'CSV result': 'Resultado CSV', Minimum: 'Mínimo', Maximum: 'Máximo', 'Whole number only': 'Solo números enteros', 'Generate number': 'Generar número', 'Uses your browser’s secure random source.': 'Usa el generador seguro de números aleatorios de tu navegador.', 'How many?': '¿Cuántos?', 'UUID v4 identifiers': 'Identificadores UUID v4', 'Generate UUIDs': 'Generar UUID', 'Generated locally with your browser’s secure random source.': 'Se genera localmente con el generador seguro de tu navegador.', 'Copy UUIDs': 'Copiar UUID', 'Text to hash': 'Texto que quieres resumir', 'Create SHA-256 hash': 'Crear hash SHA-256', 'The text stays in this browser.': 'El texto se queda en este navegador.', 'SHA-256 hexadecimal digest': 'Resumen hexadecimal SHA-256', 'Copy hash': 'Copiar hash', Pattern: 'Expresión', Flags: 'Indicadores', 'Text to test': 'Texto que quieres probar', 'Test expression': 'Probar expresión', 'Regular expressions run locally in your browser.': 'Las expresiones regulares se procesan en tu navegador.', Matches: 'Coincidencias', 'No matches yet.': 'Aún no hay coincidencias.', 'JSON Web Token': 'JSON Web Token', 'Paste a JWT here...': 'Pega aquí un JWT…', 'Decode token': 'Decodificar token', 'Decoding does not verify a token or its signature.': 'Decodificar el token no verifica su autenticidad ni su firma.', Header: 'Cabecera', Payload: 'Contenido', 'Color value': 'Valor del color', 'Convert color': 'Convertir color', 'Supports HEX, RGB and HSL colors.': 'Compatible con colores HEX, RGB y HSL.', 'HEX to RGB': 'De HEX a RGB', 'URL to parse': 'URL que quieres analizar', 'Parse URL': 'Analizar URL', 'The URL is analyzed locally.': 'La URL se analiza localmente.', Protocol: 'Protocolo', Host: 'Servidor', Path: 'Ruta', Query: 'Consulta', Hash: 'Fragmento', 'Query parameters': 'Parámetros de consulta', 'Number to Roman numeral': 'De número a número romano', 'Convert to Roman': 'Convertir a romano', 'Roman numeral to number': 'De número romano a número', 'Roman numeral': 'Número romano', 'Convert to number': 'Convertir a número', 'Conversions run only in your browser.': 'Las conversiones se hacen solo en tu navegador.', 'From base': 'Base de origen', 'Decimal (10)': 'Decimal (10)', 'Binary (2)': 'Binario (2)', 'Hexadecimal (16)': 'Hexadecimal (16)', 'Octal (8)': 'Octal (8)', 'To base': 'Base de destino', 'Integer to convert': 'Número entero que quieres convertir', 'Convert number': 'Convertir número', 'Supports whole numbers in bases 2–36.': 'Admite números enteros en cualquier base del 2 al 36.', 'Check number': 'Comprobar número', 'Checks integers up to one trillion locally.': 'Comprueba localmente números enteros de hasta un billón.', 'Numbers to average': 'Números para calcular la media', 'Separate numbers with spaces, commas or new lines.': 'Separa los números con espacios, comas o saltos de línea.', Average: 'Media', Sum: 'Suma', Count: 'Recuento', Minimum: 'Mínimo', Maximum: 'Máximo', 'Solve proportion': 'Resolver proporción', 'Solve A:B = C:X, then see the simplified A:B ratio.': 'Resuelve A:B = C:X y obtén la proporción A:B simplificada.', 'Missing value X': 'Valor desconocido X', 'Simplified A:B': 'A:B simplificada', Start: 'Inicio', End: 'Fin', 'Date and time': 'Fecha y hora', 'Calculate duration': 'Calcular duración', 'Choose a start and end time.': 'Elige la hora de inicio y de fin.', 'Total days': 'Días totales', 'Total hours': 'Horas totales', 'Exact duration': 'Duración exacta', 'Convert to words': 'Convertir a palabras', 'Supports whole numbers from -999,999,999,999 to 999,999,999,999.': 'Admite números enteros del -999.999.999.999 al 999.999.999.999.', 'Written number': 'Número escrito con palabras', 'One million two hundred...': 'Un millón doscientos…', 'Text with line breaks': 'Texto con saltos de línea', 'Paste text with\nbroken lines\nhere...': 'Pega aquí el texto\ncon saltos de línea…', 'Join with spaces': 'Unir con espacios', 'Remove breaks': 'Quitar saltos', 'Your text stays in this browser.': 'Tu texto se queda en este navegador.', 'Clean result': 'Resultado limpio', 'Your clean paragraph will appear here...': 'Tu párrafo limpio aparecerá aquí…', 'Original text': 'Texto original', 'Changed text': 'Texto modificado', 'Paste the original...': 'Pega el original…', 'Paste the changed version...': 'Pega la versión modificada…', 'Compare text': 'Comparar textos', 'Comparison runs locally line by line.': 'La comparación se hace línea por línea en tu navegador.', Differences: 'Diferencias', 'No comparison yet.': 'Aún no hay comparación.', Type: 'Tipo', Length: 'Longitud', Weight: 'Peso', Temperature: 'Temperatura', Volume: 'Volumen', Value: 'Valor', 'Convert unit': 'Convertir unidad', 'Conversions run locally in your browser.': 'Las conversiones se hacen en tu navegador.', 'Days between dates': 'Días entre fechas', 'Start date': 'Fecha de inicio', 'End date': 'Fecha de fin', 'Calculate difference': 'Calcular diferencia', 'Add or subtract days': 'Sumar o restar días', 'Starting date': 'Fecha inicial', 'Days to add': 'Días que quieres sumar', 'Use a negative number to subtract': 'Usa un número negativo para restar', 'Calculate date': 'Calcular fecha', 'Dates are calculated in your browser.': 'Las fechas se calculan en tu navegador.', 'Link or short text': 'Enlace o texto corto', Size: 'Tamaño', 'Always black and white for reliable scanning.': 'Siempre en blanco y negro para que se lea bien.', 'Generate QR code': 'Generar código QR', 'Generated locally in your browser. Nothing is uploaded.': 'Se genera en tu navegador. No se suben datos.', 'Download PNG': 'Descargar PNG', 'Generated QR code': 'Código QR generado', 'Time zone': 'Zona horaria', 'New York (Eastern)': 'Nueva York (Este)', 'Chicago (Central)': 'Chicago (Centro)', 'Denver (Mountain)': 'Denver (Montaña)', 'Los Angeles (Pacific)': 'Los Ángeles (Pacífico)', London: 'Londres', Madrid: 'Madrid', 'Ho Chi Minh City': 'Ciudad Ho Chi Minh', Tokyo: 'Tokio', Sydney: 'Sídney', To: 'A', 'Convert time': 'Convertir hora', 'Uses your browser’s time zone data, including daylight saving changes.': 'Usa los datos de zonas horarias de tu navegador, incluidos los cambios de horario estacional.',
  },
  fr: {
    'UsefulVerse home': 'Accueil UsefulVerse', 'Main navigation': 'Navigation principale', Language: 'Langue', Tools: 'Outils', 'How it works': 'Comment ça marche', 'Find a tool': 'Trouver un outil', 'A useful place on the internet': 'Un espace utile sur Internet', 'Do the small things': 'Faites les petites choses', 'faster.': 'plus vite.', 'Simple browser tools for text, data and everyday work. No account. No upload. Just open a tool and get it done.': 'Des outils simples pour le texte, les données et le quotidien. Sans compte ni envoi de fichiers. Ouvrez un outil et c’est fait.', 'Explore tools': 'Découvrir les outils', 'UsefulVerse principles': 'Les principes de UsefulVerse', 'Fast by default': 'Rapide par défaut', 'Private by design': 'Pensé pour la confidentialité', 'Free to use': 'Gratuit', 'The toolbox': 'La boîte à outils', 'Find the right tool.': 'Trouvez le bon outil.', 'Search tools': 'Rechercher des outils', All: 'Tout', Writing: 'Écriture', Text: 'Texte', Developer: 'Développement', SEO: 'SEO', Everyday: 'Quotidien', Privacy: 'Confidentialité', Data: 'Données', Design: 'Design', 'Open tool': 'Ouvrir l’outil', 'No tools match that search yet. Try another word.': 'Aucun outil ne correspond à votre recherche. Essayez un autre mot.', 'Why UsefulVerse': 'Pourquoi UsefulVerse', 'Small tools.': 'De petits outils.', 'Clear answers.': 'Des réponses claires.', 'Each tool has one clear job. You can start in seconds.': 'Chaque outil a une fonction précise. Vous pouvez commencer en quelques secondes.', 'Work privately': 'Travaillez en privé', 'Your text stays in your browser for browser-first tools.': 'Avec les outils locaux, votre texte reste dans le navigateur.', 'Take the result': 'Récupérez le résultat', 'Copy it or use it where you need it next.': 'Copiez-le ou utilisez-le où vous en avez besoin.', 'Simple tools that respect your time and your files.': 'Des outils simples qui respectent votre temps et vos fichiers.', 'All tools': 'Tous les outils', 'Privacy first': 'La confidentialité avant tout', 'Breadcrumb': 'Fil d’Ariane', 'tool': 'Outil', 'Runs in your browser. No upload.': 'Fonctionne dans votre navigateur. Aucun envoi.', 'About this tool': 'À propos de cet outil', ' made simple.': ' en toute simplicité.', 'Common questions': 'Questions fréquentes', 'Keep going': 'Continuez', 'More useful tools': 'Plus d’outils utiles', 'Browse all tools': 'Voir tous les outils',
    'Text to count': 'Texte à compter', 'Start typing or paste your text here...': 'Commencez à saisir ou collez votre texte ici…', Words: 'Mots', Characters: 'Caractères', 'Without spaces': 'Sans espaces', Lines: 'Lignes', 'Reading time': 'Temps de lecture', 'Copy summary': 'Copier le résumé', Clear: 'Effacer', 'Your counts update as you type.': 'Le décompte se met à jour pendant la saisie.', 'Text to convert': 'Texte à convertir', 'Paste text here...': 'Collez le texte ici…', 'Text case options': 'Options de casse', UPPERCASE: 'MAJUSCULES', lowercase: 'minuscules', 'Sentence case': 'Casse de phrase', 'Title Case': 'Majuscule À Chaque Mot', Result: 'Résultat', 'Your converted text will appear here...': 'Le texte converti apparaîtra ici…', 'Copy result': 'Copier le résultat', 'Choose a format to create your result.': 'Choisissez un format pour créer le résultat.', 'List to clean': 'Liste à nettoyer', 'Paste one item per line...': 'Collez un élément par ligne…', 'Trim spaces': 'Supprimer les espaces superflus', 'Ignore case': 'Ignorer la casse', 'Remove empty lines': 'Supprimer les lignes vides', 'Remove duplicates': 'Supprimer les doublons', 'Your cleaned list will appear here.': 'Votre liste nettoyée apparaîtra ici.', 'Clean list': 'Liste nettoyée', 'Cleaned lines...': 'Lignes nettoyées…', 'JSON to format': 'JSON à mettre en forme', 'Format JSON': 'Mettre en forme le JSON', Minify: 'Minifier', 'Paste JSON to validate it.': 'Collez le JSON pour le valider.', 'Formatted JSON...': 'JSON mis en forme…', 'Base64 direction': 'Sens de conversion Base64', 'Encode to Base64': 'Encoder en Base64', 'Decode Base64': 'Décoder Base64', 'Value to convert': 'Valeur à convertir', 'Text to encode...': 'Texte à encoder…', 'Base64 to decode...': 'Base64 à décoder…', Convert: 'Convertir', 'Runs only in your browser.': 'Le traitement reste dans votre navigateur.', 'Result...': 'Résultat…', 'URL direction': 'Sens de conversion URL', 'Encode URL text': 'Encoder du texte pour une URL', 'Decode URL text': 'Décoder le texte URL', 'URL text to convert': 'Texte URL à convertir', 'Use encode for text that must travel safely inside a URL.': 'Utilisez « Encoder » pour insérer du texte dans une URL en toute sécurité.', 'Title or phrase': 'Titre ou expression', 'How to write a great blog post': 'Comment rédiger un excellent article de blog', 'Keep numbers': 'Conserver les chiffres', 'Keep non-Latin letters': 'Conserver les lettres non latines', 'URL slug': 'Slug d’URL', 'your-clean-url-slug': 'votre-url-claire', 'Create slug': 'Créer le slug', 'Copy slug': 'Copier le slug', 'A good slug is short, clear and easy to read.': 'Un bon slug est court, clair et facile à lire.', 'What is a percentage of a number?': 'Quel est le pourcentage d’un nombre ?', Percent: 'Pourcentage', 'Base number': 'Nombre de référence', 'What percent is one number of another?': 'Quel pourcentage représente un nombre par rapport à un autre ?', Part: 'Partie', 'Whole number': 'Nombre entier', 'What is the percentage change?': 'Quel est le pourcentage d’évolution ?', From: 'De', to: 'à', 'New number': 'Nouvelle valeur', Calculate: 'Calculer', 'Copy answers': 'Copier les résultats', 'Fill in any calculation you need.': 'Saisissez les valeurs du calcul souhaité.', 'Your password': 'Votre mot de passe', 'Click Generate password': 'Cliquez sur « Générer un mot de passe »', 'Length:': 'Longueur :', Uppercase: 'Majuscules', Lowercase: 'Minuscules', Numbers: 'Chiffres', Symbols: 'Symboles', 'Exclude similar characters': 'Exclure les caractères ressemblants', 'Generate password': 'Générer un mot de passe', 'Copy password': 'Copier le mot de passe', 'Generated locally with your browser’s secure random generator.': 'Généré dans votre navigateur avec un générateur aléatoire sécurisé.', 'Unix timestamp to date': 'Convertir un timestamp Unix en date', 'Timestamp in seconds or milliseconds': 'Timestamp en secondes ou millisecondes', 'Convert to date': 'Convertir en date', UTC: 'UTC', 'Your local time': 'Votre heure locale', 'Date to Unix timestamp': 'Convertir une date en timestamp Unix', 'Date and time in your time zone': 'Date et heure dans votre fuseau horaire', 'Convert to timestamp': 'Convertir en timestamp', Seconds: 'Secondes', Milliseconds: 'Millisecondes', 'Your dates stay in this browser.': 'Vos dates restent dans ce navigateur.', 'HTML entity direction': 'Sens de conversion des entités HTML', 'Encode HTML': 'Encoder le HTML', 'Decode HTML': 'Décoder le HTML', 'Use & symbols safely': 'Utilisez les symboles & en toute sécurité', 'CSV data': 'Données CSV', 'Convert to JSON': 'Convertir en JSON', 'The first row becomes the JSON keys.': 'La première ligne devient les clés JSON.', 'JSON result': 'Résultat JSON', 'JSON array': 'Tableau JSON', 'Convert to CSV': 'Convertir en CSV', 'Use an array of JSON objects with a shared set of keys.': 'Utilisez un tableau d’objets JSON avec les mêmes clés.', 'CSV result': 'Résultat CSV', Minimum: 'Minimum', Maximum: 'Maximum', 'Whole number only': 'Nombres entiers uniquement', 'Generate number': 'Générer un nombre', 'Uses your browser’s secure random source.': 'Utilise la source aléatoire sécurisée de votre navigateur.', 'How many?': 'Combien ?', 'UUID v4 identifiers': 'Identifiants UUID v4', 'Generate UUIDs': 'Générer des UUID', 'Generated locally with your browser’s secure random source.': 'Généré localement avec la source aléatoire sécurisée de votre navigateur.', 'Copy UUIDs': 'Copier les UUID', 'Text to hash': 'Texte à hacher', 'Create SHA-256 hash': 'Créer un hachage SHA-256', 'The text stays in this browser.': 'Le texte reste dans ce navigateur.', 'SHA-256 hexadecimal digest': 'Empreinte hexadécimale SHA-256', 'Copy hash': 'Copier le hachage', Pattern: 'Expression', Flags: 'Drapeaux', 'Text to test': 'Texte à tester', 'Test expression': 'Tester l’expression', 'Regular expressions run locally in your browser.': 'Les expressions régulières sont traitées dans votre navigateur.', Matches: 'Correspondances', 'No matches yet.': 'Aucune correspondance pour le moment.', 'JSON Web Token': 'JSON Web Token', 'Paste a JWT here...': 'Collez un JWT ici…', 'Decode token': 'Décoder le jeton', 'Decoding does not verify a token or its signature.': 'Le décodage ne vérifie ni le jeton ni sa signature.', Header: 'En-tête', Payload: 'Charge utile', 'Color value': 'Valeur de la couleur', 'Convert color': 'Convertir la couleur', 'Supports HEX, RGB and HSL colors.': 'Prend en charge les couleurs HEX, RGB et HSL.', 'HEX to RGB': 'HEX vers RGB', 'URL to parse': 'URL à analyser', 'Parse URL': 'Analyser l’URL', 'The URL is analyzed locally.': 'L’URL est analysée localement.', Protocol: 'Protocole', Host: 'Hôte', Path: 'Chemin', Query: 'Requête', Hash: 'Fragment', 'Query parameters': 'Paramètres de requête', 'Number to Roman numeral': 'Nombre en chiffre romain', 'Convert to Roman': 'Convertir en chiffre romain', 'Roman numeral to number': 'Chiffre romain en nombre', 'Roman numeral': 'Chiffre romain', 'Convert to number': 'Convertir en nombre', 'Conversions run only in your browser.': 'Les conversions restent dans votre navigateur.', 'From base': 'Base de départ', 'Decimal (10)': 'Décimal (10)', 'Binary (2)': 'Binaire (2)', 'Hexadecimal (16)': 'Hexadécimal (16)', 'Octal (8)': 'Octal (8)', 'To base': 'Base d’arrivée', 'Integer to convert': 'Nombre entier à convertir', 'Convert number': 'Convertir le nombre', 'Supports whole numbers in bases 2–36.': 'Prend en charge les nombres entiers dans toutes les bases de 2 à 36.', 'Check number': 'Vérifier le nombre', 'Checks integers up to one trillion locally.': 'Vérifie localement les nombres entiers jusqu’à un billion.', 'Numbers to average': 'Nombres à calculer', 'Separate numbers with spaces, commas or new lines.': 'Séparez les nombres par des espaces, des virgules ou des retours à la ligne.', Average: 'Moyenne', Sum: 'Somme', Count: 'Nombre', Minimum: 'Minimum', Maximum: 'Maximum', 'Solve proportion': 'Résoudre la proportion', 'Solve A:B = C:X, then see the simplified A:B ratio.': 'Résolvez A:B = C:X, puis affichez le rapport A:B simplifié.', 'Missing value X': 'Valeur manquante X', 'Simplified A:B': 'Rapport A:B simplifié', Start: 'Début', End: 'Fin', 'Date and time': 'Date et heure', 'Calculate duration': 'Calculer la durée', 'Choose a start and end time.': 'Choisissez une heure de début et une heure de fin.', 'Total days': 'Nombre total de jours', 'Total hours': 'Nombre total d’heures', 'Exact duration': 'Durée exacte', 'Convert to words': 'Convertir en toutes lettres', 'Supports whole numbers from -999,999,999,999 to 999,999,999,999.': 'Prend en charge les nombres entiers de -999 999 999 999 à 999 999 999 999.', 'Written number': 'Nombre en toutes lettres', 'One million two hundred...': 'Un million deux cents…', 'Text with line breaks': 'Texte avec des retours à la ligne', 'Paste text with\nbroken lines\nhere...': 'Collez ici du texte\navec des retours\nà la ligne…', 'Join with spaces': 'Joindre avec des espaces', 'Remove breaks': 'Supprimer les retours', 'Your text stays in this browser.': 'Votre texte reste dans ce navigateur.', 'Clean result': 'Résultat nettoyé', 'Your clean paragraph will appear here...': 'Votre paragraphe nettoyé apparaîtra ici…', 'Original text': 'Texte d’origine', 'Changed text': 'Texte modifié', 'Paste the original...': 'Collez le texte d’origine…', 'Paste the changed version...': 'Collez la version modifiée…', 'Compare text': 'Comparer les textes', 'Comparison runs locally line by line.': 'La comparaison s’effectue ligne par ligne dans votre navigateur.', Differences: 'Différences', 'No comparison yet.': 'Aucune comparaison pour le moment.', Type: 'Type', Length: 'Longueur', Weight: 'Poids', Temperature: 'Température', Volume: 'Volume', Value: 'Valeur', 'Convert unit': 'Convertir l’unité', 'Conversions run locally in your browser.': 'Les conversions s’effectuent dans votre navigateur.', 'Days between dates': 'Nombre de jours entre deux dates', 'Start date': 'Date de début', 'End date': 'Date de fin', 'Calculate difference': 'Calculer la différence', 'Add or subtract days': 'Ajouter ou soustraire des jours', 'Starting date': 'Date de départ', 'Days to add': 'Jours à ajouter', 'Use a negative number to subtract': 'Utilisez un nombre négatif pour soustraire', 'Calculate date': 'Calculer la date', 'Dates are calculated in your browser.': 'Les dates sont calculées dans votre navigateur.', 'Link or short text': 'Lien ou texte court', Size: 'Taille', 'Always black and white for reliable scanning.': 'Toujours en noir et blanc pour une lecture fiable.', 'Generate QR code': 'Générer un code QR', 'Generated locally in your browser. Nothing is uploaded.': 'Généré dans votre navigateur. Rien n’est envoyé.', 'Download PNG': 'Télécharger le PNG', 'Generated QR code': 'Code QR généré', 'Time zone': 'Fuseau horaire', 'New York (Eastern)': 'New York (heure de l’Est)', 'Chicago (Central)': 'Chicago (heure du Centre)', 'Denver (Mountain)': 'Denver (heure des Rocheuses)', 'Los Angeles (Pacific)': 'Los Angeles (heure du Pacifique)', London: 'Londres', Madrid: 'Madrid', 'Ho Chi Minh City': 'Hô Chi Minh-Ville', Tokyo: 'Tokyo', Sydney: 'Sydney', To: 'Vers', 'Convert time': 'Convertir l’heure', 'Uses your browser’s time zone data, including daylight saving changes.': 'Utilise les données de fuseau horaire du navigateur, y compris le changement d’heure.',
  },
};

Object.assign(ui.es, { 'Open a tool': 'Abrir una herramienta', 'Calculate average': 'Calcular promedio', "Generated locally with your browser's secure random generator.": 'Se genera en tu navegador con un generador seguro de números aleatorios.', 'Generated locally with your browser’s secure random generator.': 'Se genera en tu navegador con un generador seguro de números aleatorios.', 'URL components': 'Componentes de la URL', 'Whole number from 1 to 3,999': 'Número entero del 1 al 3.999', '% of': '% de', of: 'de', 'Tool categories': 'Categorías de herramientas' });
Object.assign(ui.fr, { 'Open a tool': 'Ouvrir un outil', 'Calculate average': 'Calculer la moyenne', "Generated locally with your browser's secure random generator.": 'Généré dans votre navigateur avec un générateur de nombres aléatoires sécurisé.', 'Generated locally with your browser’s secure random generator.': 'Généré dans votre navigateur avec un générateur de nombres aléatoires sécurisé.', 'URL components': 'Composants de l’URL', 'Whole number from 1 to 3,999': 'Nombre entier de 1 à 3 999', '% of': '% de', of: 'de', 'Tool categories': 'Catégories d’outils' });
ui.pt = ptBR.ui;

export const runtimeMessages = {
  es: {
    'There is nothing to copy yet.': 'Todavía no hay nada que copiar.', 'Copied to your clipboard.': 'Copiado al portapapeles.', 'Copy was blocked. Select the result and copy it manually.': 'No se pudo copiar. Selecciona el resultado y cópialo manualmente.', 'Your cleaned list will appear here.': 'La lista limpia aparecerá aquí.', 'Valid JSON. Your result is ready.': 'JSON válido. El resultado está listo.', 'Paste JSON to validate it.': 'Pega JSON para validarlo.', 'Conversion complete.': 'Conversión completada.', 'That does not look like valid Base64 text.': 'El texto no parece un Base64 válido.', 'Runs only in your browser.': 'Se procesa únicamente en tu navegador.', 'This text has an invalid URL escape sequence.': 'El texto contiene una secuencia de escape de URL no válida.', 'Slug created.': 'Slug creado.', 'Type a title first.': 'Escribe un título primero.', 'A good slug is short, clear and easy to read.': 'Un buen slug es corto, claro y fácil de leer.', 'Calculation complete.': 'Cálculo completado.', 'Enter valid numbers to calculate.': 'Introduce números válidos para calcular.', 'Fill in any calculation you need.': 'Completa los datos del cálculo que necesites.', 'Choose at least one character type.': 'Elige al menos un tipo de carácter.', 'Password created locally. Store it in a password manager.': 'Contraseña creada en tu navegador. Guárdala en un gestor de contraseñas.', 'Enter a valid Unix timestamp.': 'Introduce una marca de tiempo Unix válida.', 'That timestamp is outside the supported date range.': 'La marca de tiempo está fuera del intervalo admitido.', 'Date converted.': 'Fecha convertida.', 'Choose a valid date and time.': 'Elige una fecha y hora válidas.', 'Timestamp converted.': 'Marca de tiempo convertida.', 'Your dates stay in this browser.': 'Tus fechas se quedan en este navegador.', 'The first row becomes the JSON keys.': 'La primera fila se convierte en las claves de JSON.', 'Use an array of JSON objects with a shared set of keys.': 'Usa un array de objetos JSON con las mismas claves.', 'Enter a valid minimum and maximum.': 'Introduce un mínimo y un máximo válidos.', 'Use an integer range smaller than 4.29 billion.': 'Usa un intervalo entero menor de 4.290 millones.', 'Random number generated locally.': 'Número aleatorio generado localmente.', 'Uses your browser’s secure random source.': 'Usa el generador seguro de números aleatorios de tu navegador.', 'Choose a number from 1 to 100.': 'Elige un número del 1 al 100.', 'Generated locally with your browser’s secure random source.': 'Se genera localmente con el generador seguro de tu navegador.', 'SHA-256 hash created locally.': 'Hash SHA-256 creado localmente.', 'Your browser could not create the hash.': 'Tu navegador no pudo crear el hash.', 'The text stays in this browser.': 'El texto se queda en este navegador.', 'No matches found.': 'No se encontraron coincidencias.', 'No matches yet.': 'Aún no hay coincidencias.', 'Regular expressions run locally in your browser.': 'Las expresiones regulares se procesan en tu navegador.', 'Header and payload decoded. Signature was not verified.': 'Cabecera y contenido decodificados. No se verificó la firma.', 'Decoding does not verify a token or its signature.': 'Decodificar el token no verifica su autenticidad ni su firma.', 'Color converted.': 'Color convertido.', 'Supports HEX, RGB and HSL colors.': 'Compatible con colores HEX, RGB y HSL.', 'URL parsed locally.': 'URL analizada localmente.', 'Enter a complete URL, including https://.': 'Introduce una URL completa, incluido https://.', 'The URL is analyzed locally.': 'La URL se analiza localmente.', 'Number converted.': 'Número convertido.', 'Conversions run only in your browser.': 'Las conversiones se hacen solo en tu navegador.', 'Number converted locally.': 'Número convertido localmente.', 'Supports whole numbers in bases 2–36.': 'Admite números enteros en cualquier base del 2 al 36.', 'Enter a whole number from 0 to 1,000,000,000,000.': 'Introduce un número entero del 0 al 1.000.000.000.000.', 'Number checked locally.': 'Número comprobado localmente.', 'Checks integers up to one trillion locally.': 'Comprueba localmente números enteros de hasta un billón.', 'Enter valid numbers separated by spaces, commas or lines.': 'Introduce números válidos separados por espacios, comas o saltos de línea.', 'Average calculated locally.': 'Promedio calculado localmente.', 'Separate numbers with spaces, commas or new lines.': 'Separa los números con espacios, comas o saltos de línea.', 'Enter three positive numbers.': 'Introduce tres números positivos.', 'Proportion solved locally.': 'Proporción resuelta localmente.', 'Solve A:B = C:X, then see the simplified A:B ratio.': 'Resuelve A:B = C:X y obtén la proporción A:B simplificada.', 'Choose valid times with the end after the start.': 'Elige horas válidas y asegúrate de que el final sea posterior al inicio.', 'Duration calculated locally.': 'Duración calculada localmente.', 'Choose a start and end time.': 'Elige la hora de inicio y de fin.', 'Enter a whole number.': 'Introduce un número entero.', 'Number converted locally.': 'Número convertido localmente.', 'Line breaks removed locally.': 'Saltos de línea eliminados localmente.', 'Paste text first.': 'Pega el texto primero.', 'Your text stays in this browser.': 'Tu texto se queda en este navegador.', 'No differences found.': 'No se encontraron diferencias.', 'The texts are identical.': 'Los textos son idénticos.', 'Comparison runs locally line by line.': 'La comparación se hace línea por línea en tu navegador.', 'Enter a valid number.': 'Introduce un número válido.', 'Unit converted locally.': 'Unidad convertida localmente.', 'Conversions run locally in your browser.': 'Las conversiones se hacen en tu navegador.', 'Choose two valid dates.': 'Elige dos fechas válidas.', 'Date difference calculated.': 'Diferencia entre fechas calculada.', 'Choose a date and enter a whole number of days.': 'Elige una fecha e introduce un número entero de días.', 'Date calculated.': 'Fecha calculada.', 'Dates are calculated in your browser.': 'Las fechas se calculan en tu navegador.', 'Paste a link or short text first.': 'Pega primero un enlace o un texto corto.', 'QR code ready. Nothing left this browser.': 'Código QR listo. Nada sale de tu navegador.', 'The PNG could not be created. Try again.': 'No se pudo crear el PNG. Inténtalo de nuevo.', 'PNG download started.': 'Ha comenzado la descarga del PNG.', 'Generated locally in your browser. Nothing is uploaded.': 'Se genera en tu navegador. No se sube nada.', 'Time converted locally with daylight saving support.': 'Hora convertida localmente con ajuste al horario estacional.', 'Uses your browser’s time zone data, including daylight saving changes.': 'Usa los datos de zonas horarias de tu navegador, incluidos los cambios de horario estacional.',
  },
  fr: {
    'There is nothing to copy yet.': 'Il n’y a encore rien à copier.', 'Copied to your clipboard.': 'Copié dans le presse-papiers.', 'Copy was blocked. Select the result and copy it manually.': 'La copie a échoué. Sélectionnez le résultat et copiez-le manuellement.', 'Your cleaned list will appear here.': 'Votre liste nettoyée apparaîtra ici.', 'Valid JSON. Your result is ready.': 'JSON valide. Votre résultat est prêt.', 'Paste JSON to validate it.': 'Collez du JSON pour le valider.', 'Conversion complete.': 'Conversion terminée.', 'That does not look like valid Base64 text.': 'Ce texte ne semble pas être du Base64 valide.', 'Runs only in your browser.': 'Le traitement reste dans votre navigateur.', 'This text has an invalid URL escape sequence.': 'Ce texte contient une séquence d’échappement URL invalide.', 'Slug created.': 'Slug créé.', 'Type a title first.': 'Saisissez d’abord un titre.', 'A good slug is short, clear and easy to read.': 'Un bon slug est court, clair et facile à lire.', 'Calculation complete.': 'Calcul terminé.', 'Enter valid numbers to calculate.': 'Saisissez des nombres valides pour calculer.', 'Fill in any calculation you need.': 'Saisissez les valeurs du calcul souhaité.', 'Choose at least one character type.': 'Choisissez au moins un type de caractère.', 'Password created locally. Store it in a password manager.': 'Mot de passe créé localement. Enregistrez-le dans un gestionnaire de mots de passe.', 'Enter a valid Unix timestamp.': 'Saisissez un timestamp Unix valide.', 'That timestamp is outside the supported date range.': 'Ce timestamp est hors de la plage de dates prise en charge.', 'Date converted.': 'Date convertie.', 'Choose a valid date and time.': 'Choisissez une date et une heure valides.', 'Timestamp converted.': 'Timestamp converti.', 'Your dates stay in this browser.': 'Vos dates restent dans ce navigateur.', 'The first row becomes the JSON keys.': 'La première ligne devient les clés JSON.', 'Use an array of JSON objects with a shared set of keys.': 'Utilisez un tableau d’objets JSON avec les mêmes clés.', 'Enter a valid minimum and maximum.': 'Saisissez un minimum et un maximum valides.', 'Use an integer range smaller than 4.29 billion.': 'Utilisez une plage entière inférieure à 4,29 milliards.', 'Random number generated locally.': 'Nombre aléatoire généré localement.', 'Uses your browser’s secure random source.': 'Utilise la source aléatoire sécurisée de votre navigateur.', 'Choose a number from 1 to 100.': 'Choisissez un nombre de 1 à 100.', 'Generated locally with your browser’s secure random source.': 'Généré localement avec la source aléatoire sécurisée de votre navigateur.', 'SHA-256 hash created locally.': 'Hachage SHA-256 créé localement.', 'Your browser could not create the hash.': 'Votre navigateur n’a pas pu créer le hachage.', 'The text stays in this browser.': 'Le texte reste dans ce navigateur.', 'No matches found.': 'Aucune correspondance trouvée.', 'No matches yet.': 'Aucune correspondance pour le moment.', 'Regular expressions run locally in your browser.': 'Les expressions régulières sont traitées dans votre navigateur.', 'Header and payload decoded. Signature was not verified.': 'En-tête et charge utile décodés. La signature n’a pas été vérifiée.', 'Decoding does not verify a token or its signature.': 'Le décodage ne vérifie ni le jeton ni sa signature.', 'Color converted.': 'Couleur convertie.', 'Supports HEX, RGB and HSL colors.': 'Prend en charge les couleurs HEX, RGB et HSL.', 'URL parsed locally.': 'URL analysée localement.', 'Enter a complete URL, including https://.': 'Saisissez une URL complète, y compris https://.', 'The URL is analyzed locally.': 'L’URL est analysée localement.', 'Number converted.': 'Nombre converti.', 'Conversions run only in your browser.': 'Les conversions restent dans votre navigateur.', 'Number converted locally.': 'Nombre converti localement.', 'Supports whole numbers in bases 2–36.': 'Prend en charge les nombres entiers dans toutes les bases de 2 à 36.', 'Enter a whole number from 0 to 1,000,000,000,000.': 'Saisissez un entier entre 0 et 1 000 000 000 000.', 'Number checked locally.': 'Nombre vérifié localement.', 'Checks integers up to one trillion locally.': 'Vérifie localement les entiers jusqu’à un billion.', 'Enter valid numbers separated by spaces, commas or lines.': 'Saisissez des nombres valides séparés par des espaces, virgules ou retours à la ligne.', 'Average calculated locally.': 'Moyenne calculée localement.', 'Separate numbers with spaces, commas or new lines.': 'Séparez les nombres par des espaces, virgules ou retours à la ligne.', 'Enter three positive numbers.': 'Saisissez trois nombres positifs.', 'Proportion solved locally.': 'Proportion calculée localement.', 'Solve A:B = C:X, then see the simplified A:B ratio.': 'Résolvez A:B = C:X pour obtenir le rapport A:B simplifié.', 'Choose valid times with the end after the start.': 'Choisissez des heures valides et placez la fin après le début.', 'Duration calculated locally.': 'Durée calculée localement.', 'Choose a start and end time.': 'Choisissez une heure de début et une heure de fin.', 'Enter a whole number.': 'Saisissez un nombre entier.', 'Number converted locally.': 'Nombre converti localement.', 'Line breaks removed locally.': 'Retours à la ligne supprimés localement.', 'Paste text first.': 'Collez d’abord le texte.', 'Your text stays in this browser.': 'Votre texte reste dans ce navigateur.', 'No differences found.': 'Aucune différence trouvée.', 'The texts are identical.': 'Les textes sont identiques.', 'Comparison runs locally line by line.': 'La comparaison s’effectue ligne par ligne dans votre navigateur.', 'Enter a valid number.': 'Saisissez un nombre valide.', 'Unit converted locally.': 'Unité convertie localement.', 'Conversions run locally in your browser.': 'Les conversions s’effectuent dans votre navigateur.', 'Choose two valid dates.': 'Choisissez deux dates valides.', 'Date difference calculated.': 'Différence entre les dates calculée.', 'Choose a date and enter a whole number of days.': 'Choisissez une date et saisissez un nombre entier de jours.', 'Date calculated.': 'Date calculée.', 'Dates are calculated in your browser.': 'Les dates sont calculées dans votre navigateur.', 'Paste a link or short text first.': 'Collez d’abord un lien ou un court texte.', 'QR code ready. Nothing left this browser.': 'Code QR prêt. Rien ne quitte votre navigateur.', 'The PNG could not be created. Try again.': 'Impossible de créer le PNG. Réessayez.', 'PNG download started.': 'Téléchargement du PNG démarré.', 'Generated locally in your browser. Nothing is uploaded.': 'Généré dans votre navigateur. Rien n’est envoyé.', 'Time converted locally with daylight saving support.': 'Heure convertie localement avec prise en charge du changement d’heure.', 'Uses your browser’s time zone data, including daylight saving changes.': 'Utilise les données de fuseau horaire du navigateur, y compris le changement d’heure.',
  },
};

Object.assign(runtimeMessages.es, { 'Prime number': 'Número primo', 'Not prime': 'No es primo', Strong: 'Segura', Good: 'Buena', Meters: 'Metros', Kilometers: 'Kilómetros', Centimeters: 'Centímetros', Millimeters: 'Milímetros', Inches: 'Pulgadas', Feet: 'Pies', Yards: 'Yardas', Miles: 'Millas', Kilograms: 'Kilogramos', Grams: 'Gramos', Milligrams: 'Miligramos', Pounds: 'Libras', Ounces: 'Onzas', Liters: 'Litros', Milliliters: 'Mililitros', 'US gallons': 'Galones estadounidenses', 'US quarts': 'Cuartos estadounidenses', 'US cups': 'Tazas estadounidenses', Celsius: 'Celsius', Fahrenheit: 'Fahrenheit', Kelvin: 'Kelvin' });
Object.assign(runtimeMessages.fr, { 'Prime number': 'Nombre premier', 'Not prime': 'Ce n’est pas un nombre premier', Strong: 'Fort', Good: 'Correct', Meters: 'Mètres', Kilometers: 'Kilomètres', Centimeters: 'Centimètres', Millimeters: 'Millimètres', Inches: 'Pouces', Feet: 'Pieds', Yards: 'Yards', Miles: 'Milles', Kilograms: 'Kilogrammes', Grams: 'Grammes', Milligrams: 'Milligrammes', Pounds: 'Livres', Ounces: 'Onces', Liters: 'Litres', Milliliters: 'Millilitres', 'US gallons': 'Gallons américains', 'US quarts': 'Quarts américains', 'US cups': 'Tasses américaines', Celsius: 'Celsius', Fahrenheit: 'Fahrenheit', Kelvin: 'Kelvin' });
runtimeMessages.pt = ptBR.runtimeMessages;

Object.assign(runtimeMessages.es, { 'No query parameters.': 'No hay parámetros de consulta.', 'No comparison yet.': 'Aún no hay ninguna comparación.', 'Roman numeral converted.': 'Número romano convertido.' });
Object.assign(runtimeMessages.fr, { 'No query parameters.': 'Aucun paramètre de requête.', 'No comparison yet.': 'Aucune comparaison pour le moment.', 'Roman numeral converted.': 'Nombre romain converti.' });
// Error messages app.js shows outside English (Portuguese and German already had them).
Object.assign(runtimeMessages.es, { 'Invalid JSON. Check the quotes, commas and brackets.': 'JSON no válido. Revisa las comillas, las comas y los corchetes.', 'Could not convert the CSV. Check the header row, commas and quotes.': 'No se pudo convertir el CSV. Revisa la fila de encabezados, las comas y las comillas.', 'Could not convert the JSON. Check that it is an array of objects with valid syntax.': 'No se pudo convertir el JSON. Comprueba que sea un array de objetos con una sintaxis válida.', 'Enter a valid regular expression and supported flags.': 'Introduce una expresión regular válida e indicadores compatibles.', 'This JWT could not be decoded. Check that it has three dot-separated parts and valid Base64URL data.': 'No se pudo decodificar este JWT. Comprueba que tenga tres partes separadas por puntos y datos Base64URL válidos.', 'Use a valid HEX, RGB or HSL color, such as #4D6BFF.': 'Usa un color HEX, RGB o HSL válido, como #4D6BFF.', 'Use a valid whole number or Roman numeral between 1 and 3,999.': 'Usa un número entero o un número romano válido entre 1 y 3999.', 'Enter an integer using digits valid for the selected base.': 'Introduce un número entero con dígitos válidos para la base seleccionada.', 'Use a whole number between -999,999,999,999 and 999,999,999,999.': 'Usa un número entero entre -999.999.999.999 y 999.999.999.999.', 'Use a link or text of 106 bytes or fewer. Short links work best.': 'Usa un enlace o un texto de 106 bytes como máximo. Los enlaces cortos funcionan mejor.', 'This date and time is invalid for the selected time zone.': 'Esa fecha y hora no es válida en la zona horaria seleccionada.' });
Object.assign(runtimeMessages.fr, { 'Invalid JSON. Check the quotes, commas and brackets.': 'JSON non valide. Vérifiez les guillemets, les virgules et les crochets.', 'Could not convert the CSV. Check the header row, commas and quotes.': 'Impossible de convertir le CSV. Vérifiez la ligne d’en-tête, les virgules et les guillemets.', 'Could not convert the JSON. Check that it is an array of objects with valid syntax.': 'Impossible de convertir le JSON. Vérifiez qu’il s’agit d’un tableau d’objets à la syntaxe valide.', 'Enter a valid regular expression and supported flags.': 'Saisissez une expression régulière valide et des drapeaux pris en charge.', 'This JWT could not be decoded. Check that it has three dot-separated parts and valid Base64URL data.': 'Impossible de décoder ce JWT. Vérifiez qu’il comporte trois parties séparées par des points et des données Base64URL valides.', 'Use a valid HEX, RGB or HSL color, such as #4D6BFF.': 'Utilisez une couleur HEX, RGB ou HSL valide, par exemple #4D6BFF.', 'Use a valid whole number or Roman numeral between 1 and 3,999.': 'Utilisez un entier ou un chiffre romain valide entre 1 et 3 999.', 'Enter an integer using digits valid for the selected base.': 'Saisissez un entier avec des chiffres valides pour la base choisie.', 'Use a whole number between -999,999,999,999 and 999,999,999,999.': 'Utilisez un entier entre -999 999 999 999 et 999 999 999 999.', 'Use a link or text of 106 bytes or fewer. Short links work best.': 'Utilisez un lien ou un texte de 106 octets maximum. Les liens courts fonctionnent mieux.', 'This date and time is invalid for the selected time zone.': 'Cette date et cette heure ne sont pas valides dans le fuseau horaire choisi.' });

const copy = {
  es: {
    'word-counter': ['Contador de palabras', 'Contador de palabras', 'Cuenta palabras, caracteres, líneas y tiempo de lectura de un vistazo.', 'contador de palabras, contador de caracteres, contador de letras, tiempo de lectura', 'Pega o escribe tu texto. El recuento se actualiza al instante en tu navegador.', 'Útil para ensayos, publicaciones, solicitudes, notas y cualquier texto que quieras contar sin subirlo.'],
    'text-case-converter': ['Conversor de mayúsculas y minúsculas', 'Conversor de texto', 'Pasa el texto a mayúsculas, minúsculas, tipo oración o formato de título.', 'conversor de mayúsculas, conversor de minúsculas, formato de título, formato de oración', 'Pega el texto, elige un formato y copia el resultado.', 'Una herramienta sencilla para limpiar encabezados, nombres de productos, pies de foto y texto copiado de otras aplicaciones.'],
    'remove-duplicate-lines': ['Eliminar líneas duplicadas', 'Quitar duplicados', 'Limpia una lista quitando líneas repetidas sin cambiar el orden original.', 'eliminar líneas duplicadas, líneas únicas, quitar duplicados de lista, limpiar lista', 'Pega un elemento por línea. Los elementos repetidos desaparecen con un clic.', 'Útil para listas de palabras clave, URL, nombres, identificadores, etiquetas y filas copiadas de hojas de cálculo.'],
    'json-formatter': ['Formateador JSON', 'Formateador JSON', 'Da formato, minimiza y valida JSON directamente en tu dispositivo.', 'formateador JSON, validador JSON, embellecer JSON, minimizar JSON', 'Pega JSON para darle formato o reducirlo. Los errores se explican con claridad.', 'Tu JSON se queda en esta pestaña del navegador. No se envía a ningún servidor.'],
    'base64-encoder-decoder': ['Codificador y decodificador Base64', 'Conversor Base64', 'Codifica texto en Base64 o decodifica Base64 para recuperar el texto.', 'codificador Base64, decodificador Base64, codificar Base64, decodificar Base64', 'Elige una dirección, pega el valor y conviértelo localmente.', 'Funciona con texto Unicode normal y no necesita una cuenta ni una API.'],
    'url-encoder-decoder': ['Codificador y decodificador de URL', 'Conversor de URL', 'Codifica texto para una URL o decodifica texto codificado al instante.', 'codificador URL, decodificador URL, codificación porcentual, decodificar URL', 'Pega una URL o un texto, elige la dirección y copia el resultado.', 'La conversión se hace al instante en tu navegador con el estándar URL integrado.'],
    'text-to-slug': ['Convertir texto a slug', 'Generador de slug', 'Convierte un título en un slug limpio, en minúsculas y listo para usar en una URL.', 'convertir texto a slug, generador de slug, generador de slug URL, slug SEO', 'Escribe un título y obtén una versión sencilla compatible con URL.', 'Los acentos, signos y espacios repetidos se limpian automáticamente para crear un slug legible.'],
    'percentage-calculator': ['Calculadora de porcentajes', 'Calculadora de porcentajes', 'Calcula porcentajes, variaciones y el valor porcentual de una cantidad en segundos.', 'calculadora de porcentajes, calcular porcentaje, cambio porcentual, porcentaje de una cantidad', 'Introduce los números que conoces y obtén una respuesta clara.', 'Úsala para descuentos, cambios de precio, márgenes, notas, propinas y cálculos cotidianos.'],
    'password-generator': ['Generador de contraseñas', 'Generador de contraseñas', 'Crea una contraseña aleatoria local y elige su longitud y caracteres.', 'generador de contraseñas, contraseña segura, contraseña aleatoria, contraseña protegida', 'Elige las opciones, crea una contraseña y cópiala. No se sube nada.', 'La contraseña se genera en este navegador con Web Crypto. No reutilices contraseñas entre cuentas.'],
    'timestamp-converter': ['Conversor de marcas de tiempo', 'Conversor de timestamps', 'Convierte marcas de tiempo Unix en fechas y fechas en segundos o milisegundos.', 'conversor timestamp Unix, conversor epoch, timestamp a fecha, fecha a timestamp', 'Convierte entre hora Unix y fechas legibles sin enviar datos.', 'Consulta la hora UTC y local junto con los segundos y milisegundos para tu código.'],
    'html-entity-encoder-decoder': ['Codificador y decodificador de entidades HTML', 'Conversor de entidades HTML', 'Codifica caracteres especiales para HTML o decodifica entidades a texto legible.', 'codificador de entidades HTML, decodificador HTML, escapar HTML, caracteres HTML especiales', 'Pega texto, elige una dirección y convierte caracteres especiales HTML.', 'Útil para escribir fragmentos HTML seguros, depurar texto codificado y revisar entidades sin enviar tu contenido.'],
    'csv-to-json': ['Convertir CSV a JSON', 'CSV a JSON', 'Convierte datos separados por comas en JSON limpio directamente en tu navegador.', 'CSV a JSON, conversor CSV, convertir CSV a JSON, analizador CSV', 'Pega datos CSV con encabezados y conviértelos en un array JSON.', 'Las comas entre comillas, los saltos de línea y las comillas escapadas se procesan localmente.'],
    'json-to-csv': ['Convertir JSON a CSV', 'JSON a CSV', 'Convierte un array de objetos JSON en una tabla lista para CSV.', 'JSON a CSV, conversor JSON, convertir JSON a CSV, exportar JSON a CSV', 'Pega un array de objetos y obtén una columna CSV por cada clave.', 'Los valores anidados se conservan como texto JSON y se escapan para hojas de cálculo.'],
    'random-number-generator': ['Generador de números aleatorios', 'Número aleatorio', 'Genera enteros o decimales aleatorios y seguros entre dos límites.', 'generador de números aleatorios, entero aleatorio, decimal aleatorio, selector de números', 'Indica un mínimo y un máximo, y genera un número aleatorio localmente.', 'Usa la fuente segura de tu navegador y nunca envía los límites ni el resultado.'],
    'uuid-generator': ['Generador de UUID', 'Generador de UUID', 'Genera uno o varios UUID versión 4 localmente con una fuente aleatoria segura.', 'generador UUID, generador GUID, UUID aleatorio, generador UUID v4', 'Elige cuántos identificadores necesitas y cópialos con un clic.', 'Útil para datos de prueba, registros de bases de datos y desarrollo. Se crean localmente con Web Crypto.'],
    'sha256-hash-generator': ['Generador de hash SHA-256', 'Hash SHA-256', 'Crea un hash SHA-256 hexadecimal desde texto, directamente en tu navegador.', 'generador de hash SHA-256, SHA-256 online, hash de texto, generador de checksum', 'Pega texto y crea su resumen SHA-256 hexadecimal localmente.', 'Web Crypto calcula el hash en tu navegador. El hash es irreversible y no cifra el texto original.'],
    'regex-tester': ['Probador de expresiones regulares', 'Probador Regex', 'Prueba una expresión regular con texto de ejemplo y consulta las coincidencias.', 'probador regex, probador de expresiones regulares, validador regex, regexp online', 'Escribe un patrón, elige indicadores y pruébalo con tu texto.', 'Depura patrones antes de usarlos en JavaScript, formularios o búsquedas. Todo funciona localmente.'],
    'jwt-decoder': ['Decodificador JWT', 'Decodificador JWT', 'Lee localmente la cabecera y el contenido de un JSON Web Token, sin verificarlo.', 'decodificador JWT, decodificar JWT, decodificador JSON Web Token, analizador JWT', 'Pega un JWT para inspeccionar su cabecera y contenido legibles en tu navegador.', 'Esta herramienta decodifica los datos, pero no verifica la firma ni demuestra que el token sea fiable.'],
    'color-converter': ['Conversor de colores', 'Conversor de colores', 'Convierte colores entre HEX, RGB y HSL y previsualiza el resultado al instante.', 'conversor de colores, HEX a RGB, RGB a HEX, HEX a HSL, selector de color', 'Introduce un color HEX, RGB o HSL y obtén enseguida los demás formatos.', 'Útil para CSS, paletas de marca y comprobaciones rápidas. Todo ocurre en tu navegador.'],
    'url-parser': ['Analizador de URL', 'Analizador de URL', 'Separa una URL en protocolo, servidor, ruta, parámetros de consulta y fragmento.', 'analizador URL, analizar URL, ver parámetros de consulta, componentes de URL', 'Pega una URL para inspeccionar sus partes y parámetros.', 'Una forma clara de depurar enlaces, etiquetas UTM, redirecciones y consultas sin enviar la URL.'],
    'roman-numeral-converter': ['Conversor de números romanos', 'Números romanos', 'Convierte números en números romanos y viceversa al instante.', 'conversor de números romanos, convertir números romanos, número a romano, conversor de fechas romanas', 'Introduce un número o un número romano y obtén el formato equivalente.', 'Convierte localmente números enteros del 1 al 3.999. Útil para fechas, nombres, esquemas y ejercicios.'],
    'binary-converter': ['Conversor binario', 'Conversor binario', 'Convierte enteros entre formatos binario, decimal, hexadecimal y octal.', 'conversor binario, conversor de bases, decimal a binario, hexadecimal a binario', 'Elige las bases de entrada y salida, introduce un entero y conviértelo localmente.', 'Útil para programación, redes y aprendizaje. BigInt procesa números grandes en tu navegador.'],
    'prime-number-checker': ['Comprobador de números primos', 'Comprobar números primos', 'Comprueba si un número entero es primo y obtén el resultado en tu dispositivo.', 'comprobador de números primos, comprobar primo online, ¿es primo este número?, prueba de primalidad', 'Introduce un número entero y comprueba con un clic si es primo.', 'El cálculo se hace en tu navegador y admite números de hasta un billón para consultas prácticas.'],
    'average-calculator': ['Calculadora de promedio', 'Calculadora de promedio', 'Calcula la media, suma, cantidad, mínimo y máximo de una lista de números.', 'calculadora de promedio, calculadora de media, calcular promedio, media de números', 'Pega números separados por espacios, comas o saltos de línea para calcular la media.', 'Útil para notas, mediciones, presupuestos y comprobaciones rápidas. Tus números se quedan aquí.'],
    'ratio-proportion-calculator': ['Calculadora de razones y proporciones', 'Calculadora de proporciones', 'Resuelve el valor que falta en una razón y simplifica proporciones en segundos.', 'calculadora de razones, calculadora de proporciones, resolver una proporción', 'Introduce tres valores para hallar el cuarto en a:b = c:x.', 'Úsala con recetas, planos a escala, descuentos, mezclas y otras relaciones proporcionales.'],
    'time-duration-calculator': ['Calculadora de duración', 'Calculadora de duración', 'Calcula la duración exacta entre dos fechas y horas en días, horas y minutos.', 'calculadora de duración, calculadora de intervalos, duración entre fechas, calculadora de horas', 'Elige una hora de inicio y de fin para calcular la duración.', 'Útil para horas de trabajo, proyectos, viajes, eventos e intervalos de varios días.'],
    'number-to-words-converter': ['Convertir números a palabras', 'Números a palabras', 'Convierte números enteros en palabras en español directamente en tu navegador.', 'convertir números a palabras, números escritos, convertir cifras a letras', 'Introduce un número entero y obtén su escritura en español, lista para copiar.', 'Útil para documentos, cheques, facturas, clases y cualquier texto que requiera cifras en letras.'],
    'remove-line-breaks': ['Eliminar saltos de línea', 'Quitar saltos de línea', 'Une líneas de texto con espacios o elimina saltos directamente en tu navegador.', 'eliminar saltos de línea, quitar saltos de texto, unir líneas de texto', 'Pega texto de un documento y convierte las líneas cortadas en un párrafo limpio.', 'Limpia texto copiado de PDF, Word, correos y hojas de cálculo sin subirlo.'],
    'text-diff-checker': ['Comparador de textos', 'Comparar textos', 'Compara dos textos línea por línea y descubre qué ha cambiado.', 'comparar textos online, comparador de diferencias, comparar documentos, diff checker', 'Pega el original y la versión modificada para encontrar las líneas diferentes.', 'Útil para borradores, código, archivos de configuración y documentos sin subirlos.'],
    'unit-converter': ['Conversor de unidades', 'Conversor de unidades', 'Convierte unidades comunes de longitud, peso, temperatura y volumen en segundos.', 'conversor de unidades, conversor de medidas, conversor métrico, convertir unidades online', 'Elige un tipo de medida y las unidades para convertir un valor localmente.', 'Un conversor práctico que funciona sin cuenta, subida de archivos ni API externa.'],
    'date-calculator': ['Calculadora de fechas', 'Calculadora de fechas', 'Calcula días entre fechas o suma y resta días a una fecha inicial.', 'calculadora de fechas, días entre fechas, diferencia de fechas, sumar días a una fecha', 'Compara dos fechas o avanza y retrocede desde una fecha inicial.', 'Útil para plazos, planificación, contratos, horarios y cálculos sencillos de fechas.'],
    'qr-code-generator': ['Generador de códigos QR', 'Generador QR', 'Crea y descarga un código QR desde un enlace o texto directamente en tu navegador.', 'generador de códigos QR, crear código QR, creador de QR online', 'Pega un enlace o mensaje corto y descarga el código QR en tu dispositivo.', 'El código se genera localmente, no se sube nada y puedes descargarlo en PNG.'],
    'time-zone-converter': ['Conversor de zonas horarias', 'Zonas horarias', 'Convierte fecha y hora entre zonas horarias habituales con horario de verano.', 'conversor de zonas horarias, diferencia horaria, convertir hora entre países', 'Elige fecha, hora y dos lugares para consultar la hora local correspondiente.', 'Usa la base internacional de zonas horarias del navegador y tiene en cuenta el horario de verano.'],
  },
  fr: {
    'word-counter': ['Compteur de mots', 'Compteur de mots', 'Comptez les mots, caractères, lignes et le temps de lecture en un coup d’œil.', 'compteur de mots, compteur de caractères, compteur de lettres, temps de lecture', 'Collez ou saisissez votre texte. Le décompte se met à jour dans le navigateur.', 'Utile pour les essais, publications, candidatures, notes et tout texte à compter sans le téléverser.'],
    'text-case-converter': ['Convertisseur de casse', 'Convertisseur de texte', 'Convertissez votre texte en majuscules, minuscules, casse de phrase ou de titre.', 'convertisseur majuscules, convertisseur minuscules, casse de titre, casse de phrase', 'Collez votre texte, choisissez un format et copiez le résultat.', 'Un outil simple pour corriger les titres, noms de produits, légendes et textes copiés.'],
    'remove-duplicate-lines': ['Supprimer les lignes en double', 'Supprimer les doublons', 'Nettoyez une liste en supprimant les lignes répétées sans changer leur ordre.', 'supprimer les lignes en double, lignes uniques, dédoublonner une liste, nettoyer une liste', 'Collez un élément par ligne. Les doublons disparaissent en un clic.', 'Utile pour les mots-clés, URL, noms, identifiants, étiquettes et lignes de tableur copiées.'],
    'json-formatter': ['Formateur JSON', 'Formateur JSON', 'Formatez, réduisez et validez du JSON directement sur votre appareil.', 'formateur JSON, validateur JSON, embellir JSON, minifier JSON', 'Collez du JSON pour le formater ou le réduire. Les erreurs sont expliquées clairement.', 'Votre JSON reste dans cet onglet. Rien n’est envoyé à un serveur.'],
    'base64-encoder-decoder': ['Encodeur et décodeur Base64', 'Convertisseur Base64', 'Encodez du texte en Base64 ou décodez du Base64 en texte lisible.', 'encodeur Base64, décodeur Base64, encoder en Base64, décoder Base64', 'Choisissez un sens, collez votre valeur et convertissez-la localement.', 'Compatible avec le texte Unicode, sans compte ni API.'],
    'url-encoder-decoder': ['Encodeur et décodeur d’URL', 'Convertisseur URL', 'Encodez du texte pour une URL ou décodez du texte encodé instantanément.', 'encodeur URL, décodeur URL, encodage en pourcentage, décoder une URL', 'Collez une URL ou du texte, choisissez le sens et copiez le résultat.', 'La conversion s’effectue dans votre navigateur selon la norme URL.'],
    'text-to-slug': ['Convertir un texte en slug', 'Générateur de slug', 'Transformez un titre en slug clair, en minuscules et prêt à utiliser dans une URL.', 'convertir texte en slug, générateur de slug, slug URL, slug SEO', 'Saisissez un titre et obtenez une version simple adaptée aux URL.', 'Les accents, signes et espaces répétés sont nettoyés pour produire un slug lisible.'],
    'percentage-calculator': ['Calculatrice de pourcentages', 'Calculatrice de pourcentages', 'Calculez des pourcentages, des variations et la valeur d’un pourcentage en quelques secondes.', 'calculatrice de pourcentage, calculer un pourcentage, variation en pourcentage', 'Saisissez les nombres connus et obtenez une réponse claire.', 'À utiliser pour les réductions, variations de prix, marges, notes, pourboires et calculs courants.'],
    'password-generator': ['Générateur de mots de passe', 'Générateur de mots de passe', 'Créez un mot de passe aléatoire local et choisissez sa longueur et ses caractères.', 'générateur de mots de passe, mot de passe sécurisé, mot de passe aléatoire', 'Choisissez vos options, créez un mot de passe et copiez-le. Rien n’est envoyé.', 'Il est généré dans ce navigateur avec Web Crypto. N’utilisez jamais le même mot de passe partout.'],
    'timestamp-converter': ['Convertisseur de timestamp', 'Convertisseur Unix', 'Convertissez des timestamps Unix en dates et des dates en secondes ou millisecondes.', 'convertisseur timestamp Unix, convertisseur epoch, timestamp en date, date en timestamp', 'Convertissez l’heure Unix en date lisible sans transmettre de données.', 'Affichez l’heure UTC et locale ainsi que les secondes et millisecondes pour votre code.'],
    'html-entity-encoder-decoder': ['Encodeur et décodeur d’entités HTML', 'Convertisseur d’entités HTML', 'Encodez les caractères HTML spéciaux ou décodez les entités en texte lisible.', 'encodeur entités HTML, décodeur HTML, échapper HTML, caractères HTML spéciaux', 'Collez du texte, choisissez un sens et convertissez les caractères HTML spéciaux.', 'Utile pour rédiger des extraits HTML sûrs et déboguer du texte encodé sans envoyer son contenu.'],
    'csv-to-json': ['Convertir CSV en JSON', 'CSV vers JSON', 'Convertissez des données séparées par des virgules en JSON dans votre navigateur.', 'CSV en JSON, convertisseur CSV, convertir CSV en JSON, analyseur CSV', 'Collez des données CSV avec une ligne d’en-tête et créez un tableau JSON.', 'Les virgules entre guillemets, retours à la ligne et guillemets échappés sont traités localement.'],
    'json-to-csv': ['Convertir JSON en CSV', 'JSON vers CSV', 'Transformez un tableau d’objets JSON en tableau prêt pour un fichier CSV.', 'JSON en CSV, convertisseur JSON, convertir JSON en CSV, exporter JSON en CSV', 'Collez un tableau d’objets pour obtenir une colonne CSV par clé.', 'Les valeurs imbriquées restent au format JSON et sont échappées pour les tableurs.'],
    'random-number-generator': ['Générateur de nombres aléatoires', 'Nombre aléatoire', 'Générez des entiers ou décimaux aléatoires et sécurisés entre deux limites.', 'générateur de nombres aléatoires, entier aléatoire, nombre décimal aléatoire', 'Définissez un minimum et un maximum, puis générez un nombre localement.', 'Utilise la source sécurisée du navigateur et n’envoie jamais les limites ni le résultat.'],
    'uuid-generator': ['Générateur d’UUID', 'Générateur d’UUID', 'Générez un ou plusieurs UUID version 4 localement avec une source aléatoire sécurisée.', 'générateur UUID, générateur GUID, UUID aléatoire, générateur UUID v4', 'Choisissez le nombre d’identifiants et copiez-les en un clic.', 'Utile pour les données de test, bases de données et développements. Créés localement avec Web Crypto.'],
    'sha256-hash-generator': ['Générateur de hachage SHA-256', 'Hachage SHA-256', 'Créez un hachage SHA-256 hexadécimal à partir de texte dans votre navigateur.', 'générateur hachage SHA-256, SHA-256 en ligne, hachage de texte, somme de contrôle', 'Collez du texte pour créer son empreinte SHA-256 hexadécimale localement.', 'Web Crypto calcule le hachage dans votre navigateur. Le hachage ne chiffre pas le texte.'],
    'regex-tester': ['Testeur d’expressions régulières', 'Testeur Regex', 'Testez une expression régulière avec un texte exemple et repérez les correspondances.', 'testeur regex, testeur expression régulière, validateur regex, regexp en ligne', 'Saisissez un motif, choisissez des indicateurs et testez-le sur votre texte.', 'Déboguez vos motifs avant JavaScript, une validation de formulaire ou une recherche. Tout reste local.'],
    'jwt-decoder': ['Décodeur JWT', 'Décodeur JWT', 'Lisez l’en-tête et la charge utile d’un JSON Web Token localement, sans le vérifier.', 'décodeur JWT, décoder JWT, décodeur JSON Web Token, analyseur JWT', 'Collez un JWT pour examiner son en-tête et sa charge utile lisibles dans le navigateur.', 'Cet outil décode les données mais ne vérifie pas la signature ni la fiabilité du jeton.'],
    'color-converter': ['Convertisseur de couleurs', 'Convertisseur de couleurs', 'Convertissez les couleurs entre HEX, RGB et HSL et prévisualisez le résultat.', 'convertisseur de couleurs, HEX vers RGB, RGB vers HEX, HEX vers HSL', 'Saisissez une couleur HEX, RGB ou HSL pour obtenir les autres formats.', 'Utile pour CSS, les palettes de marque et les vérifications rapides. Tout se passe dans le navigateur.'],
    'url-parser': ['Analyseur d’URL', 'Analyseur d’URL', 'Détaillez une URL en protocole, hôte, chemin, paramètres de requête et fragment.', 'analyseur URL, analyser URL, afficher les paramètres de requête, composants URL', 'Collez une URL pour examiner ses différentes parties et paramètres.', 'Une façon claire de déboguer des liens, balises UTM, redirections et requêtes sans transmettre l’URL.'],
    'roman-numeral-converter': ['Convertisseur de chiffres romains', 'Chiffres romains', 'Convertissez des nombres en chiffres romains et inversement instantanément.', 'convertisseur chiffres romains, convertir chiffres romains, nombre en chiffre romain', 'Saisissez un nombre ou un chiffre romain pour obtenir le format correspondant.', 'Convertit localement les entiers de 1 à 3 999. Utile pour les dates, noms, plans et exercices.'],
    'binary-converter': ['Convertisseur binaire', 'Convertisseur binaire', 'Convertissez des entiers entre les formats binaire, décimal, hexadécimal et octal.', 'convertisseur binaire, convertisseur de base, décimal en binaire, hexadécimal en binaire', 'Choisissez les bases d’entrée et de sortie, saisissez un entier et convertissez-le localement.', 'Utile pour la programmation, les réseaux et l’apprentissage. BigInt traite les grands nombres dans le navigateur.'],
    'prime-number-checker': ['Vérificateur de nombres premiers', 'Tester un nombre premier', 'Vérifiez si un entier est un nombre premier directement sur votre appareil.', 'vérificateur nombre premier, tester nombre premier, ce nombre est-il premier', 'Saisissez un entier et vérifiez en un clic s’il est premier.', 'Le calcul est effectué dans votre navigateur et accepte les nombres jusqu’à un billion.'],
    'average-calculator': ['Calculatrice de moyenne', 'Calculatrice de moyenne', 'Calculez la moyenne, la somme, le nombre, le minimum et le maximum d’une liste.', 'calculatrice moyenne, calculer moyenne, moyenne de nombres, moyenne arithmétique', 'Collez des nombres séparés par des espaces, virgules ou retours à la ligne.', 'Utile pour les notes, mesures, budgets et vérifications rapides. Vos nombres restent ici.'],
    'ratio-proportion-calculator': ['Calculatrice de rapports et proportions', 'Calculatrice de proportion', 'Trouvez la valeur manquante d’un rapport et simplifiez les proportions en quelques secondes.', 'calculatrice rapport, calculatrice proportion, résoudre une proportion', 'Saisissez trois valeurs pour trouver la quatrième dans a:b = c:x.', 'À utiliser pour les recettes, plans à l’échelle, réductions, mélanges et autres proportions.'],
    'time-duration-calculator': ['Calculatrice de durée', 'Calculatrice de durée', 'Calculez la durée exacte entre deux dates et heures en jours, heures et minutes.', 'calculatrice durée, durée entre deux dates, calcul heures, calcul intervalle', 'Choisissez une heure de début et de fin pour calculer la durée.', 'Utile pour les heures de travail, projets, voyages, événements et intervalles de plusieurs jours.'],
    'number-to-words-converter': ['Convertir les nombres en lettres', 'Nombres en lettres', 'Convertissez des entiers en toutes lettres en français dans votre navigateur.', 'convertir nombres en lettres, écrire un nombre en lettres, nombres en toutes lettres', 'Saisissez un entier pour obtenir sa forme écrite en français, prête à copier.', 'Utile pour les documents, chèques, factures, cours et textes écrits en toutes lettres.'],
    'remove-line-breaks': ['Supprimer les retours à la ligne', 'Supprimer les sauts de ligne', 'Joignez les lignes avec des espaces ou supprimez les retours dans le navigateur.', 'supprimer retours à la ligne, supprimer sauts de ligne, joindre des lignes de texte', 'Collez du texte d’un document pour réunir ses lignes en un paragraphe clair.', 'Nettoyez du texte copié de PDF, Word, courriels et tableurs sans le transmettre.'],
    'text-diff-checker': ['Comparateur de textes', 'Comparer des textes', 'Comparez deux textes ligne par ligne pour repérer ce qui a changé.', 'comparer des textes en ligne, comparateur de différences, comparer documents, diff checker', 'Collez le texte d’origine et sa version modifiée pour repérer les lignes différentes.', 'Utile pour les brouillons, code, fichiers de configuration et documents, sans téléversement.'],
    'unit-converter': ['Convertisseur d’unités', 'Convertisseur d’unités', 'Convertissez les unités courantes de longueur, poids, température et volume.', 'convertisseur unités, convertisseur mesure, convertisseur métrique, conversion unités en ligne', 'Choisissez un type de mesure et les unités pour convertir une valeur localement.', 'Un convertisseur pratique, sans compte, envoi de fichier ni API externe.'],
    'date-calculator': ['Calculatrice de dates', 'Calculatrice de dates', 'Calculez le nombre de jours entre deux dates ou ajoutez et soustrayez des jours.', 'calculatrice dates, jours entre deux dates, différence de dates, ajouter des jours à une date', 'Comparez deux dates ou avancez et reculez depuis une date de départ.', 'Utile pour les échéances, plannings, contrats et calculs simples dans votre fuseau local.'],
    'qr-code-generator': ['Générateur de codes QR', 'Générateur QR', 'Créez et téléchargez un code QR à partir d’un lien ou d’un texte dans le navigateur.', 'générateur code QR, créer un code QR, générateur QR en ligne', 'Collez un lien ou un court message et téléchargez le code QR sur votre appareil.', 'Le code est généré localement, rien n’est envoyé et vous pouvez télécharger un PNG.'],
    'time-zone-converter': ['Convertisseur de fuseaux horaires', 'Fuseaux horaires', 'Convertissez la date et l’heure entre plusieurs fuseaux avec gestion du changement d’heure.', 'convertisseur fuseau horaire, décalage horaire, convertir heure entre pays', 'Choisissez une date, une heure et deux lieux pour voir les heures locales correspondantes.', 'Utilise la base internationale du navigateur et tient compte des changements d’heure.'],
  },
};

copy.pt = ptBR.copy;
ui.de = deDE.ui;
runtimeMessages.de = deDE.runtimeMessages;
copy.de = deDE.copy;

// Self-contained language packs live in src/locales/<key>/index.mjs. USEFULVERSE_PACKS=ja,ko limits the
// build to some packs so one language can be checked while another is still being edited.
export const packKeys = ['ja', 'ko', 'id', 'hi', 'ar', 'zh', 'bn', 'ru', 'ur', 'tr', 'vi', ...expandedFullLocaleKeys];
const enabledPacks = process.env.USEFULVERSE_PACKS?.split(',').map((key) => key.trim()).filter(Boolean) ?? packKeys;
export const packs = {};
for (const key of packKeys.filter((item) => enabledPacks.includes(item))) packs[key] = (await import(`./locales/${key}/index.mjs`)).pack;
for (const [key, pack] of Object.entries(packs)) {
  const { code, name, prefix, homeTitle, homeDescription } = pack.meta;
  if (expandedLocaleTranslationReview[key]) pack.meta.translationReview = expandedLocaleTranslationReview[key];
  pack.meta.keepEnglish ??= [];
  if (!pack.meta.keepEnglish.includes('Code 128')) pack.meta.keepEnglish.push('Code 128');
  locales[key] = { code, name, prefix, homeTitle, homeDescription };
  ui[key] = pack.ui;
  runtimeMessages[key] = pack.runtimeMessages;
  copy[key] = pack.copy;
}

// Existing non-English packs had no localized guide articles. Load them as
// static content, and use the same dictionary for article chrome and runtime UI.
for (const [language, guidePack] of Object.entries(guidePacks)) {
  const pack = packs[language];
  const guideUi = guidePack.ui ?? {};
  Object.assign(ui[language] ??= {}, guideUi);
  Object.assign(runtimeMessages[language] ??= {}, guideUi);
  if (!pack) continue;
  if (Array.isArray(guidePack.guides)) pack.guides = guidePack.guides;
  Object.assign(pack.ui, guideUi);
  Object.assign(pack.runtimeMessages, guideUi);
}

const guideNavigationLabels = {
  en: 'Guides', es: 'Guías', fr: 'Guides', pt: 'Guias', de: 'Ratgeber', ja: 'ガイド', ko: '가이드',
  id: 'Panduan', hi: 'मार्गदर्शिकाएँ', ar: 'الأدلة', zh: '指南', bn: 'নির্দেশিকা', ru: 'Руководства',
  ur: 'رہنما', tr: 'Kılavuzlar', vi: 'Hướng dẫn', it: 'Guide', zh_tw: '指南', bg: 'Ръководства',
  ca: 'Guies', nl: 'Gidsen', el: 'Οδηγοί', ms: 'Panduan', pl: 'Poradniki', sv: 'Guider', th: 'คู่มือ',
  uk: 'Посібники', sw: 'Miongozo',
};
for (const [language, label] of Object.entries(guideNavigationLabels)) {
  ui[language] ??= {};
  runtimeMessages[language] ??= {};
  ui[language].Guides = label;
  runtimeMessages[language].Guides = label;
  if (packs[language]) {
    packs[language].ui.Guides = label;
    packs[language].runtimeMessages.Guides = label;
  }
}

// Add the browser-only tool copy after the standard locale packs are assembled,
// so the same translations drive page generation, browser UI, SEO and FAQs.
for (const [language, data] of Object.entries(advancedToolLocales)) {
  Object.assign(ui[language], data.ui);
  Object.assign(runtimeMessages[language], data.ui);
  Object.assign(copy[language], data.copy);
  const pack = packs[language];
  if (!pack) continue;
  Object.assign(pack.ui, data.ui);
  Object.assign(pack.runtimeMessages, data.ui);
  Object.assign(pack.copy, data.copy);
  for (const [id, values] of Object.entries(data.copy)) {
    const [title, shortTitle, description, , intro, body] = values;
    pack.seo[id] = { title: shortTitle, description: description.length >= 25 ? description : `${description} ${intro}` };
    pack.faq[id] = [
      { question: data.faqHow.replace('{title}', shortTitle), answer: intro },
      { question: data.faqPrivacyQuestion, answer: data.faqPrivacyAnswer.replace('{body}', body) },
    ];
  }
}

// UI, SEO metadata and FAQs for the next browser-only tool batch.
for (const [language, data] of Object.entries(expandedToolLocales)) {
  const toolUi = { ...(data.ui ?? {}), ...(imageCaptureUiLocales[language] ?? {}), ...(expandedToolUiLocales[language] ?? {}) };
  if (Object.keys(toolUi).length) {
    ui[language] ??= {};
    runtimeMessages[language] ??= {};
    Object.assign(ui[language], toolUi);
    Object.assign(runtimeMessages[language], toolUi);
  }
  if (language === 'en') continue;
  Object.assign(copy[language] ??= {}, data.copy);
  const pack = packs[language];
  for (const [id, values] of Object.entries(data.copy)) {
    const [title, shortTitle, description, , intro, body] = values;
    const safeDescription = description.length >= 25 && description.length <= 155
      ? description
      : `${intro.slice(0, 145).replace(/[\s,;:]+$/u, '')}…`;
    if (pack) {
      Object.assign(pack.ui, toolUi);
      Object.assign(pack.runtimeMessages, toolUi);
      Object.assign(pack.copy, { [id]: values });
      pack.seo[id] = { title: shortTitle, description: safeDescription };
      const faq = advancedToolLocales[language];
      pack.faq[id] = [
        { question: faq.faqHow.replace('{title}', shortTitle), answer: intro },
        { question: faq.faqPrivacyQuestion, answer: faq.faqPrivacyAnswer.replace('{body}', body) },
      ];
    }
  }
}

// First SEO-priority tool set: its page copy, controls, metadata and FAQ are
// translated together for every supported language.
for (const [language, data] of Object.entries(priorityToolLocales)) {
  Object.assign(ui[language] ??= {}, data.ui);
  Object.assign(runtimeMessages[language] ??= {}, data.ui);
  Object.assign(copy[language] ??= {}, data.copy);
  const pack = packs[language];
  if (!pack) continue;
  Object.assign(pack.ui, data.ui);
  Object.assign(pack.runtimeMessages, data.ui);
  Object.assign(pack.copy, data.copy);
  for (const [id, values] of Object.entries(data.copy)) {
    const [title, shortTitle, description, , intro, body] = values;
    const safeDescription = description.length >= 25 && description.length <= 155
      ? description
      : `${intro.slice(0, 145).replace(/[\s,;:]+$/u, '')}…`;
    pack.seo[id] = { title: shortTitle, description: safeDescription };
    const faq = advancedToolLocales[language];
    pack.faq[id] = [
      { question: faq.faqHow.replace('{title}', shortTitle), answer: intro },
      { question: faq.faqPrivacyQuestion, answer: faq.faqPrivacyAnswer.replace('{body}', body) },
    ];
  }
}

// The next browser-only batch is shipped as localized static pages across every active language.
for (const [language, data] of Object.entries(browserBatchLocales)) {
  Object.assign(ui[language] ??= {}, data.ui);
  Object.assign(runtimeMessages[language] ??= {}, data.ui);
  Object.assign(copy[language] ??= {}, data.copy);
  const pack = packs[language];
  if (!pack) continue;
  Object.assign(pack.ui, data.ui);
  Object.assign(pack.runtimeMessages, data.ui);
  Object.assign(pack.copy, data.copy);
  for (const [id, values] of Object.entries(data.copy)) {
    const [title, shortTitle, description, , intro, body] = values;
    pack.seo[id] = { title: shortTitle, description: description.length >= 25 && description.length <= 155 ? description : `${intro.slice(0, 145)}…` };
    const faq = advancedToolLocales[language];
    pack.faq[id] = [
      { question: faq.faqHow.replace('{name}', shortTitle).replace('{title}', shortTitle), answer: intro },
      { question: faq.faqPrivacyQuestion, answer: faq.faqPrivacyAnswer.replace('{body}', body) },
    ];
  }
}

// Image input-format support is shared by the converter, resizer and image-to-PDF tools.
// Keep each localized page, its controls, SEO copy and FAQ in sync with that runtime.
for (const [language, data] of Object.entries(imageFormatLocales)) {
  const tiffHint = tiffHints[language];
  if (tiffHint) data.ui['Multi-page TIFF uses only its first page. Some TIFF compression variants may not decode.'] = tiffHint;
  for (const id of ['image-format-converter', 'image-resizer-compressor', 'image-to-pdf']) {
    const values = data.copy[id];
    if (!values) continue;
    values[3] = `${values[3]}, TIFF/TIF, TIFF to JPG, TIF to PNG, TIFF to PDF`;
    values[5] = `${values[5]} ${tiffHint}`;
    const pack = packs[language];
    if (pack) pack.faq[id]?.push({ question: ({
      en: 'Can I use TIFF/TIF files with this image tool?', es: '¿Puedo usar archivos TIFF/TIF con esta herramienta de imágenes?', fr: 'Puis-je utiliser des fichiers TIFF/TIF avec cet outil ?', pt: 'Posso usar arquivos TIFF/TIF nesta ferramenta de imagem?', de: 'Kann ich TIFF/TIF-Dateien mit diesem Bildwerkzeug verwenden?', ja: 'この画像ツールでTIFF/TIFファイルを使えますか？', ko: '이 이미지 도구에서 TIFF/TIF 파일을 사용할 수 있나요?', id: 'Bisakah saya memakai file TIFF/TIF dengan alat gambar ini?', hi: 'क्या इस चित्र टूल में TIFF/TIF फ़ाइलें इस्तेमाल कर सकते हैं?', ar: 'هل يمكنني استخدام ملفات TIFF/TIF مع أداة الصور هذه؟', zh: '此图片工具支持 TIFF/TIF 文件吗？', bn: 'এই ছবি টুলে কি TIFF/TIF ফাইল ব্যবহার করা যায়?', ru: 'Можно ли использовать файлы TIFF/TIF в этом инструменте?', ur: 'کیا اس تصویری ٹول میں TIFF/TIF فائلیں استعمال کر سکتا ہوں؟', tr: 'Bu görsel aracında TIFF/TIF dosyaları kullanabilir miyim?', vi: 'Tôi có thể dùng tệp TIFF/TIF với công cụ ảnh này không?'
    })[language], answer: tiffHint });
  }
  Object.assign(ui[language] ??= {}, data.ui);
  Object.assign(runtimeMessages[language] ??= {}, data.ui);
  Object.assign(copy[language] ??= {}, data.copy);
  const pack = packs[language];
  if (!pack) continue;
  Object.assign(pack.ui, data.ui);
  Object.assign(pack.runtimeMessages, data.ui);
  Object.assign(pack.copy, data.copy);
  for (const [id, values] of Object.entries(data.copy)) {
    const [title, shortTitle, description, , intro, body] = values;
    const safeDescription = description.length >= 25 && description.length <= 155
      ? description
      : `${intro.slice(0, 145).replace(/[\\s,;:]+$/u, '')}…`;
    pack.seo[id] = { title: data.seoTitles?.[id] ?? shortTitle, description: safeDescription };
    const faq = advancedToolLocales[language];
    pack.faq[id] = [
      { question: data.faqQuestions?.[id] ?? faq.faqHow.replace('{title}', shortTitle).replace('{name}', shortTitle), answer: intro },
      { question: faq.faqPrivacyQuestion, answer: faq.faqPrivacyAnswer.replace('{body}', body) },
    ];
  }
}

// Office Open XML package recompression is a local, optional tool. Keep its page,
// FAQs and runtime messages translated together for the whole published locale set.
for (const [language, data] of Object.entries(officePackageLocales)) {
  Object.assign(ui[language] ??= {}, data.ui);
  Object.assign(runtimeMessages[language] ??= {}, data.ui);
  Object.assign(copy[language] ??= {}, data.copy);
  const pack = packs[language];
  if (!pack) continue;
  Object.assign(pack.ui, data.ui);
  Object.assign(pack.runtimeMessages, data.ui);
  Object.assign(pack.copy, data.copy);
  Object.assign(pack.seo, data.seo);
  Object.assign(pack.faq, data.faq);
}

// Keep the audio compressor and the audio/video transcriber localized with their UI,
// tool copy, SEO metadata and FAQs. Heavy media code remains separately lazy-loaded.
for (const [language, data] of Object.entries(mediaToolLocales)) {
  Object.assign(ui[language] ??= {}, data.ui);
  Object.assign(runtimeMessages[language] ??= {}, data.ui);
  Object.assign(copy[language] ??= {}, data.copy);
  const pack = packs[language];
  if (!pack) continue;
  Object.assign(pack.ui, data.ui);
  Object.assign(pack.runtimeMessages, data.ui);
  Object.assign(pack.copy, data.copy);
  for (const [id, values] of Object.entries(data.copy)) {
    const [, shortTitle, description, , intro, body] = values;
    const safeDescription = description.length >= 25 && description.length <= 155
      ? description
      : `${intro.slice(0, 145).replace(/[\s,;:]+$/u, '')}…`;
    pack.seo[id] = { title: shortTitle, description: safeDescription };
    const faq = advancedToolLocales[language];
    pack.faq[id] = [
      { question: faq.faqHow.replace('{title}', shortTitle), answer: intro },
      { question: faq.faqPrivacyQuestion, answer: faq.faqPrivacyAnswer.replace('{body}', body) },
    ];
  }
}

// The cross-tool suite adds browser-local PDF workflows, ZIP, media, calculators
// and private document builders. Keep each route localized with its runtime UI.
for (const [language, data] of Object.entries(toolSuiteLocales)) {
  if (language === 'en') continue;
  Object.assign(ui[language] ??= {}, data.ui);
  Object.assign(runtimeMessages[language] ??= {}, data.ui);
  Object.assign(copy[language] ??= {}, data.copy);
  const pack = packs[language];
  if (!pack) continue;
  Object.assign(pack.ui, data.ui);
  Object.assign(pack.runtimeMessages, data.ui);
  Object.assign(pack.copy, data.copy);
  for (const [id, values] of Object.entries(data.copy)) {
    const [title, shortTitle, description, , intro, body] = values;
    pack.seo[id] = { title: shortTitle, description };
    pack.faq[id] = [
      { question: data.faq.how.replace('{name}', shortTitle), answer: intro },
      { question: data.faq.privacyQuestion, answer: data.faq.privacyAnswer },
    ];
  }
  pack.meta.keepEnglish = [...new Set([...(pack.meta.keepEnglish ?? []), 'PDF', 'DOCX', 'ZIP', 'OCR', 'MP3', 'M4A', 'AAC', 'OGG', 'Opus', 'MP4', 'WebM', 'sin(30) + sqrt(16)', 'all or 1-3,5', 'INV-001', 'USD'])];
}

// Password protection and best-effort PDF repair are processed by the visitor's
// browser. Keep their page copy and controls localized in every current locale.
for (const [language, data] of Object.entries(pdfParityLocales)) {
  Object.assign(ui[language] ??= {}, data.ui);
  Object.assign(runtimeMessages[language] ??= {}, data.ui);
  Object.assign(copy[language] ??= {}, data.copy);
  const pack = packs[language];
  if (!pack) continue;
  Object.assign(pack.ui, data.ui);
  Object.assign(pack.runtimeMessages, data.ui);
  Object.assign(pack.copy, data.copy);
  for (const [id, values] of Object.entries(data.copy)) {
    const [, shortTitle, description, , intro] = values;
    pack.seo[id] = { title: shortTitle, description };
    pack.faq[id] = [
      { question: pack.page.faqHow.replace('{name}', shortTitle), answer: intro },
      { question: pack.page.privacyQuestion, answer: pack.page.privacyAnswer },
    ];
  }
  pack.meta.keepEnglish = [...new Set([...(pack.meta.keepEnglish ?? []), 'PDF', 'QPDF', 'AES-256', 'MB'])];
}

// Permanent PDF redaction is available only after its complete local workflow
// copy, runtime controls, SEO text and FAQ are translated for each current locale.
for (const [language, data] of Object.entries(pdfRedactLocales)) {
  Object.assign(ui[language] ??= {}, data.ui);
  Object.assign(runtimeMessages[language] ??= {}, data.ui);
  Object.assign(copy[language] ??= {}, data.copy);
  const pack = packs[language];
  if (!pack) continue;
  Object.assign(pack.ui, data.ui);
  Object.assign(pack.runtimeMessages, data.ui);
  Object.assign(pack.copy, data.copy);
  const [, shortTitle, description, , intro] = data.copy['pdf-redact'];
  pack.seo['pdf-redact'] = { title: shortTitle, description };
  pack.faq['pdf-redact'] = [
    { question: pack.page.faqHow.replace('{name}', shortTitle), answer: intro },
    { question: pack.page.privacyQuestion, answer: pack.page.privacyAnswer },
  ];
  pack.meta.keepEnglish = [...new Set([...(pack.meta.keepEnglish ?? []), 'PDF', 'MB', 'dpi'])];
}

// HTML-to-PDF uses the visitor's browser print dialog and only accepts sanitized,
// user-provided markup. Keep the page copy and every visible control localized.
for (const [language, data] of Object.entries(htmlToPdfLocales)) {
  Object.assign(ui[language] ??= {}, data.ui);
  Object.assign(runtimeMessages[language] ??= {}, data.ui);
  Object.assign(copy[language] ??= {}, data.copy);
  const pack = packs[language];
  if (!pack) continue;
  Object.assign(pack.ui, data.ui);
  Object.assign(pack.runtimeMessages, data.ui);
  Object.assign(pack.copy, data.copy);
  const [, shortTitle, description, , intro, body] = data.copy['html-to-pdf'];
  pack.seo['html-to-pdf'] = { title: shortTitle, description };
  pack.faq['html-to-pdf'] = [
    { question: pack.page.faqHow.replace('{name}', shortTitle), answer: intro },
    { question: pack.page.privacyQuestion, answer: body },
  ];
  pack.meta.keepEnglish = [...new Set([...(pack.meta.keepEnglish ?? []), 'HTML', 'PDF'])];
}

// PDF/A-1b visual-copy workflow, with explicit fidelity and per-file-validation caveats.
for (const [language, data] of Object.entries(pdfToPdfaLocales)) {
  Object.assign(ui[language] ??= {}, data.ui);
  Object.assign(runtimeMessages[language] ??= {}, data.ui);
  Object.assign(copy[language] ??= {}, data.copy);
  const pack = packs[language];
  if (!pack) continue;
  Object.assign(pack.ui, data.ui);
  Object.assign(pack.runtimeMessages, data.ui);
  Object.assign(pack.copy, data.copy);
  const [, shortTitle, description, , intro, body] = data.copy['pdf-to-pdfa'];
  pack.seo['pdf-to-pdfa'] = { title: shortTitle, description };
  pack.faq['pdf-to-pdfa'] = [
    { question: pack.page.faqHow.replace('{name}', shortTitle), answer: intro },
    { question: pack.page.privacyQuestion, answer: body },
  ];
  pack.meta.keepEnglish = [...new Set([...(pack.meta.keepEnglish ?? []), 'PDF/A-1b', 'veraPDF', 'sRGB', 'MB', 'dpi'])];
}

// Shared PDF editor and Office-conversion UI for every currently supported locale.
for (const [language, data] of Object.entries(pdfOfficeUiLocales)) {
  Object.assign(ui[language] ??= {}, data);
  Object.assign(runtimeMessages[language] ??= {}, data);
  const pack = packs[language];
  if (!pack) continue;
  Object.assign(pack.ui, data);
  Object.assign(pack.runtimeMessages, data);
}

// Keep the original PDF-only source packs available for translation export, but
// do not expose duplicate routes for locales promoted to full-site coverage.
for (const [language, data] of Object.entries(pdfOnlyLocaleDataAll)) {
  if (expandedFullLocaleKeys.includes(language)) continue;
  const locale = {
    code: data.meta.code,
    name: data.meta.name,
    prefix: data.meta.prefix,
    tag: data.meta.tag,
    homeTitle: data.meta.homeTitle,
    homeDescription: data.meta.homeDescription,
  };
  pdfOnlyLocales[language] = locale;
  ui[language] = { ...(data.ui ?? {}), ...(pdfOnlyUiLocales[language] ?? {}), PDF: 'PDF', Files: data.meta.homeLabel, Design: data.meta.homeLabel, 'Files tool': data.meta.homeLabel };
  runtimeMessages[language] = { ...ui[language], ...(data.runtimeMessages ?? {}) };
  copy[language] = data.copy;
  const seo = {};
  const faq = {};
  for (const toolId of pdfToolIds) {
    const values = data.copy[toolId];
    if (!values) throw new Error(`PDF-only locale ${language} is missing ${toolId}`);
    const [title, shortTitle, description, , intro, body] = values;
    seo[toolId] = { title: shortTitle, description };
    faq[toolId] = [
      { question: data.page.faqHow.replace('{name}', shortTitle), answer: intro },
      { question: data.page.privacyQuestion, answer: data.page.privacyAnswer },
    ];
    // Localize dynamic labels used by renderToolPage.
    ui[language][`About ${title}.`] = data.page.about.replace('{title}', title);
    ui[language][`${title} made simple.`] = data.page.madeSimple.replace('{title}', title);
    ui[language][`${title} workspace`] = data.page.workspace.replace('{title}', title);
  }
  pdfOnlyPacks[language] = {
    meta: data.meta,
    page: data.page,
    ui: ui[language],
    runtimeMessages: runtimeMessages[language],
    copy: data.copy,
    seo,
    faq,
    templates: {},
  };
}

// Parameterized runtime strings for app.js (see src/locales/template-keys.mjs). Packs bring their own.
export const runtimeTemplates = {
  es: { 'diff.found': { one: '{count} línea distinta encontrada.', other: '{count} líneas distintas encontradas.' }, 'diff.line': 'Línea {line}:', 'diff.empty': '(vacía)', 'url.none': '(ninguno)', 'timestamp.local': 'Hora local: {value}', 'timestamp.seconds': 'Segundos: {value}', 'timestamp.milliseconds': 'Milisegundos: {value}' },
  fr: { 'diff.found': { one: '{count} ligne différente trouvée.', other: '{count} lignes différentes trouvées.' }, 'diff.line': 'Ligne {line} :', 'diff.empty': '(vide)', 'url.none': '(aucun)', 'timestamp.local': 'Heure locale : {value}', 'timestamp.seconds': 'Secondes : {value}', 'timestamp.milliseconds': 'Millisecondes : {value}' },
  pt: { 'diff.found': { one: '{count} linha diferente encontrada.', other: '{count} linhas diferentes encontradas.' }, 'diff.line': 'Linha {line}:', 'diff.empty': '(vazia)', 'url.none': '(nenhum)', 'timestamp.local': 'Horário local: {value}', 'timestamp.seconds': 'Segundos: {value}', 'timestamp.milliseconds': 'Milissegundos: {value}' },
  de: { 'diff.found': { one: '{count} abweichende Zeile gefunden.', other: '{count} abweichende Zeilen gefunden.' }, 'diff.line': 'Zeile {line}:', 'diff.empty': '(leer)', 'url.none': '(keine)', 'timestamp.local': 'Ortszeit: {value}', 'timestamp.seconds': 'Sekunden: {value}', 'timestamp.milliseconds': 'Millisekunden: {value}' },
};
for (const [key, pack] of Object.entries(packs)) runtimeTemplates[key] = pack.templates;

// Static strings that older locales were missing; packs translate them in their own ui.
Object.assign(ui.es, { 'Color preview': 'Vista previa del color', 'JSON result...': 'Resultado JSON…', 'CSV result...': 'Resultado CSV…', 'Your UUIDs will appear here...': 'Tus UUID aparecerán aquí…', 'Text to hash...': 'Texto para el hash…', 'Your hash will appear here...': 'Tu hash aparecerá aquí…', 'Paste sample text here...': 'Pega aquí un texto de ejemplo…', Seoul: 'Seúl', Jakarta: 'Yakarta', 'India (Kolkata)': 'India (Calcuta)' });
Object.assign(ui.fr, { 'Color preview': 'Aperçu de la couleur', 'JSON result...': 'Résultat JSON…', 'CSV result...': 'Résultat CSV…', 'Your UUIDs will appear here...': 'Vos UUID apparaîtront ici…', 'Text to hash...': 'Texte à hacher…', 'Your hash will appear here...': 'Votre hachage apparaîtra ici…', 'Paste sample text here...': 'Collez un texte d’exemple ici…', Seoul: 'Séoul', Jakarta: 'Jakarta', 'India (Kolkata)': 'Inde (Calcutta)' });
Object.assign(ui.pt, { 'Color preview': 'Prévia da cor', 'JSON result...': 'Resultado JSON…', 'CSV result...': 'Resultado CSV…', 'Your UUIDs will appear here...': 'Seus UUIDs aparecerão aqui…', 'Text to hash...': 'Texto para gerar o hash…', 'Your hash will appear here...': 'Seu hash aparecerá aqui…', 'Paste sample text here...': 'Cole um texto de exemplo aqui…', Seoul: 'Seul', Jakarta: 'Jacarta', 'India (Kolkata)': 'Índia (Calcutá)' });

// Some static UI labels are also emitted by the browser runtime. Keep only
// translations used by at least one runtime dictionary to avoid copying the
// entire German UI catalog into every locale bundle.
const germanRuntimeKeys = new Set(Object.values(runtimeMessages).flatMap((messages) => Object.keys(messages)));
for (const key of germanRuntimeKeys) {
  if (!runtimeMessages.de[key] && ui.de[key]) runtimeMessages.de[key] = ui.de[key];
}
Object.assign(runtimeMessages.de, {
  'Important limits and output': 'Wichtige Grenzen und Ausgabe',
  'all or 1-3,5': 'alle oder 1–3,5',
  'Rotate 90°': 'Um 90° drehen',
  'pages ready to edit': 'Seiten zum Bearbeiten bereit',
  'Area selected. Choose the replacement and apply it.': 'Bereich ausgewählt. Wählen Sie den Ersatz und wenden Sie ihn an.',
  added: 'hinzugefügt', removed: 'entfernt', 'text changed': 'Text geändert',
  Original: 'Original', Updated: 'Aktualisiert', '(no extractable text)': '(kein extrahierbarer Text)',
  'No text differences were found on matching pages.': 'Auf den übereinstimmenden Seiten wurden keine Textunterschiede gefunden.',
  'Page counts': 'Seitenzahlen', 'supported form fields found.': 'unterstützte Formularfelder gefunden.',
  PDF: 'PDF', 'Files tool': 'Dateiwerkzeuge',
});

const intentionallySharedLocaleTerms = {
  it: ['SEO', 'UTC', 'US Letter', 'A4', 'PDF', 'Privacy', 'Host', 'Query', 'Volume', 'Data', 'Standard', 'Standard — 150 dpi', 'Celsius', 'Fahrenheit', 'Kelvin', 'Pomodoro', 'Widescreen (16:9)', 'SQL query', 'SHA-256 checksum', 'MP3 audio', 'OGG / Opus audio', 'Seoul', 'Jakarta', 'India (Kolkata)', 'Ho Chi Minh City', 'Tokyo', 'Sydney', 'Madrid', 'Email', 'Location', 'Original'],
  zh_tw: ['SEO', 'US Letter', 'A4', 'PDF', 'UTC', 'UUID v4 identifiers', 'JSON Web Token', 'Pomodoro', 'GitHub Flavored Markdown', 'MP3 audio', 'OGG / Opus audio', 'Seoul', 'Jakarta', 'India (Kolkata)', 'Ho Chi Minh City', 'Tokyo', 'Sydney', 'Madrid', 'Email', 'Location'],
  bg: ['SEO', 'UTC', 'US Letter', 'A4', 'PDF', 'JSON Web Token', 'UUID v4 identifiers', 'Pomodoro', 'Stopwatch', 'SQL query', 'SHA-256 checksum', 'MP3 audio', 'OGG / Opus audio', 'Seoul', 'Jakarta', 'India (Kolkata)', 'Ho Chi Minh City', 'Tokyo', 'Sydney', 'Madrid', 'Email'],
  ca: ['SEO', 'UTC', 'US Letter', 'A4', 'PDF', 'Text', 'Data', 'Part', 'Protocol', 'Decimal', 'Decimal (10)', 'Octal (8)', 'Celsius', 'Fahrenheit', 'Kelvin', 'Grams', 'Original', 'Transparent', 'JSON array', 'UUID v4 identifiers', 'JSON Web Token', 'GitHub Flavored Markdown', 'Pomodoro', 'Stopwatch', 'SQL query', 'Miles (US MPG)', 'WCAG AA · normal text', 'WCAG AAA · normal text', 'SHA-256 checksum', 'Seoul', 'Jakarta', 'India (Kolkata)', 'Ho Chi Minh City', 'Tokyo', 'Sydney', 'Madrid', 'Email'],
  nl: ['SEO', 'UTC', 'US Letter', 'A4', 'PDF', 'Privacy', 'Minimum', 'Maximum', 'Protocol', 'Host', 'Type', 'Volume', 'Meters', 'Kilometers', 'Centimeters', 'Millimeters', 'Milliliters', 'Inches', 'Yards', 'Celsius', 'Fahrenheit', 'Kelvin', 'Chicago (Central)', 'Denver (Mountain)', 'Los Angeles (Pacific)', 'UUID v4 identifiers', 'JSON Web Token', 'SHA-256 checksum', 'GitHub Flavored Markdown', 'Pomodoro', 'Stopwatch', 'SQL query', 'MP3 audio', 'M4A / AAC audio', 'OGG / Opus audio', 'MP4 video', 'WebM video', 'Miles (US MPG)', 'Kilometers (L/100 km)', 'Seoul', 'Jakarta', 'India (Kolkata)', 'Ho Chi Minh City', 'Tokyo', 'Sydney', 'Madrid', 'Email', 'Profile'],
  el: ['SEO', 'UTC', 'US Letter', 'A4', 'PDF', 'UUID v4 identifiers', 'JSON Web Token', 'Pomodoro', 'SQL query', 'SHA-256 checksum', 'MP3 audio', 'OGG / Opus audio', 'Seoul', 'Jakarta', 'India (Kolkata)', 'Ho Chi Minh City', 'Tokyo', 'Sydney', 'Madrid', 'Email'],
  ms: ['SEO', 'UTC', 'US Letter', 'A4', 'PDF', 'Data', 'Unit', 'Fahrenheit', 'UUID v4 identifiers', 'JSON Web Token', 'Pomodoro', 'SQL query', 'SHA-256 checksum', 'MP3 audio', 'OGG / Opus audio', 'Quarterly', 'Chicago (Central)', 'Denver (Mountain)', 'London', 'Seoul', 'Jakarta', 'India (Kolkata)', 'Ho Chi Minh City', 'Tokyo', 'Sydney', 'Madrid', 'Email', 'Profile'],
  pl: ['SEO', 'UTC', 'US Letter', 'A4', 'PDF', 'Data', 'UUID v4 identifiers', 'JSON Web Token', 'GitHub Flavored Markdown', 'Pomodoro', 'SQL query', 'SHA-256 checksum', 'MP3 audio', 'M4A / AAC audio', 'OGG / Opus audio', 'Miles (US MPG)', 'Host', 'Chicago (Central)', 'Seoul', 'Jakarta', 'India (Kolkata)', 'Ho Chi Minh City', 'Tokyo', 'Sydney', 'Madrid', 'Email'],
  sv: ['SEO', 'UTC', 'US Letter', 'A4', 'PDF', 'Text', 'Decimal (10)', 'Standard', 'Standard — 150 dpi', 'Celsius', 'Fahrenheit', 'Kelvin', 'UUID v4 identifiers', 'JSON Web Token', 'GitHub Flavored Markdown', 'Pomodoro', 'SQL query', 'SHA-256 checksum', 'WCAG AA · normal text', 'WCAG AAA · normal text', 'MP3 audio', 'M4A / AAC audio', 'OGG / Opus audio', 'MP4 video', 'WebM video', 'Miles (US MPG)', 'Square (1:1)', 'Widescreen (16:9)', 'Chicago (Central)', 'Seoul', 'Jakarta', 'India (Kolkata)', 'Ho Chi Minh City', 'Tokyo', 'Sydney', 'Madrid', 'London', 'Email', 'Original'],
  th: ['SEO', 'UTC', 'US Letter', 'A4', 'PDF', 'UUID v4 identifiers', 'JSON Web Token', 'Pomodoro', 'SQL query', 'SHA-256 checksum', 'MP3 audio', 'OGG / Opus audio', 'Seoul', 'Jakarta', 'India (Kolkata)', 'Ho Chi Minh City', 'Tokyo', 'Sydney', 'Madrid', 'Email'],
  uk: ['SEO', 'UTC', 'US Letter', 'A4', 'PDF', 'UUID v4 identifiers', 'JSON Web Token', 'Pomodoro', 'SQL query', 'SHA-256 checksum', 'MP3 audio', 'OGG / Opus audio', 'Seoul', 'Jakarta', 'India (Kolkata)', 'Ho Chi Minh City', 'Tokyo', 'Sydney', 'Madrid', 'Email'],
  sw: ['SEO', 'UTC', 'US Letter', 'A4', 'PDF', 'Hash', 'Fahrenheit', 'UUID v4 identifiers', 'JSON Web Token', 'Pomodoro', 'SQL query', 'SHA-256 checksum', 'MP3 audio', 'OGG / Opus audio', 'Seoul', 'Jakarta', 'India (Kolkata)', 'Ho Chi Minh City', 'Tokyo', 'Sydney', 'Madrid', 'Email'],
};
for (const [language, pack] of Object.entries(packs)) {
  const metadataFix = expandedLocaleMetaFixes[language];
  if (metadataFix?.homeTitle) pack.meta.homeTitle = metadataFix.homeTitle;
  if (metadataFix?.homeDescription) pack.meta.homeDescription = metadataFix.homeDescription;
  Object.assign(pack.ui, expandedLocaleUiFixes[language] ?? {}, expandedLocaleStatusFixes[language] ?? {});
  Object.assign(pack.runtimeMessages, expandedLocaleUiFixes[language] ?? {}, expandedLocaleStatusFixes[language] ?? {});
  for (const [toolId, title] of Object.entries(expandedLocaleTitleFixes[language] ?? {})) {
    if (!pack.copy[toolId]) continue;
    pack.copy[toolId][0] = title;
  }
  for (const [templateId, template] of Object.entries(expandedLocaleTemplateFixes[language] ?? {})) {
    const current = pack.templates[templateId];
    pack.templates[templateId] = typeof current === 'string' ? template : { ...current, other: template };
  }
  if (language === 'zh_tw') {
    pack.templates['regex.matches'].other = '{count} 個符合項目。';
    pack.templates['diff.found'].other = '{count} 行不同。';
  }
  if (language === 'uk') {
    pack.templates['regex.matches'].many = '{count} збігів знайдено.';
    pack.templates['diff.found'].many = 'Знайдено {count} відмінних рядків.';
  }
  for (const [toolId, replacements] of Object.entries(expandedLocaleCopyFixes[language] ?? {})) {
    const current = pack.copy[toolId];
    if (!Array.isArray(current)) continue;
    pack.copy[toolId] = current.map((value, index) => Object.hasOwn(replacements, index) ? replacements[index] : value);
  }
  for (const [toolId, replacements] of Object.entries(expandedLocaleFaqFixes[language] ?? {})) {
    for (const [index, fields] of Object.entries(replacements)) {
      const item = pack.faq?.[toolId]?.[Number(index)];
      if (!item) throw new Error(`Missing ${language} FAQ entry ${toolId}[${index}] for its reviewed correction`);
      Object.assign(item, fields);
    }
  }
  for (const [slug, replacements] of Object.entries(expandedLocaleGuideFixes[language] ?? {})) {
    const guide = pack.guides?.find((item) => item.slug === slug);
    if (!guide) throw new Error(`Missing ${language} guide ${slug} for its reviewed correction`);
    for (const { path, value } of replacements) {
      let target = guide;
      for (const segment of path.slice(0, -1)) target = target?.[segment];
      const key = path.at(-1);
      if (!target || !(key in target)) throw new Error(`Missing ${language} guide field ${slug}.${path.join('.')}`);
      target[key] = value;
    }
  }
  pack.meta.keepEnglish = [...new Set([...(pack.meta.keepEnglish ?? []), ...(intentionallySharedLocaleTerms[language] ?? [])])];
  Object.assign(ui[language] ??= {}, pack.ui);
  Object.assign(runtimeMessages[language] ??= {}, pack.runtimeMessages);
  locales[language].homeTitle = pack.meta.homeTitle;
  locales[language].homeDescription = pack.meta.homeDescription;
}

const truncateMetadata = (value, limit, addEllipsis = false) => {
  const text = String(value ?? '').trim().replace(/\s+/gu, ' ');
  if (text.length <= limit) return text;
  const suffix = addEllipsis ? '…' : '';
  const allowance = limit - suffix.length;
  const prefix = text.slice(0, allowance + 1);
  const boundary = prefix.lastIndexOf(' ');
  const end = boundary >= Math.floor(allowance * 0.6) ? boundary : allowance;
  return `${prefix.slice(0, end).replace(/[\s,;:—–-]+$/u, '')}${suffix}`;
};
for (const [language, metaFix] of Object.entries(expandedLocaleMetaFixes)) {
  const pack = packs[language];
  for (const [toolId, values] of Object.entries(metaFix.seo ?? {})) {
    Object.assign(pack.seo[toolId], values);
  }
}
for (const pack of Object.values(packs)) {
  for (const [toolId, metadata] of Object.entries(pack.seo)) {
    metadata.title = truncateMetadata(metadata.title, 51);
    if (metadata.description.length < 25) {
      const intro = pack.copy[toolId]?.[4] ?? '';
      metadata.description = intro.length >= 25 ? intro : `${metadata.description} — ${pack.meta.name}`;
    }
    metadata.description = truncateMetadata(metadata.description, 155, true);
  }
}

// Camera strings have one canonical translation source. Apply them after the
// feature-specific packs so older pack copy cannot silently replace the
// reviewed camera wording in the generated page and browser runtime.
for (const [language, data] of Object.entries(imageCaptureUiLocales)) {
  Object.assign(ui[language] ??= {}, data);
  Object.assign(runtimeMessages[language] ??= {}, data);
  const pack = packs[language];
  if (!pack) continue;
  Object.assign(pack.ui, data);
  Object.assign(pack.runtimeMessages, data);
}

export function localizedTool(tool, language) {
  const values = copy[language]?.[tool.id];
  if (!values) {
    const body = longtailBodies[tool.id]?.[language];
    return body ? { ...tool, body } : tool;
  }
  const [title, shortTitle, description, keywords, intro, body] = values;
  return { ...tool, title, shortTitle, description, keywords, intro, body: longtailBodies[tool.id]?.[language] ?? body, category: pdfOnlyLocales[language] ? 'PDF' : ui[language][tool.category] ?? tool.category };
}

export function translateStaticHtml(html, language, dynamic = {}) {
  const dictionary = { ...ui[language], ...dynamic };
  if (!dictionary) return html;
  const decode = (value) => value.replaceAll('&#10;', '\n').replaceAll('&#13;', '\r').replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#039;', "'");
  const encode = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;').replaceAll('\r', '&#13;').replaceAll('\n', '&#10;');
  const translations = new Map(Object.entries(dictionary).map(([key, value]) => [decode(key), decode(value)]));
  const translate = (value) => {
    const decoded = decode(value);
    const leading = decoded.match(/^\s*/u)?.[0] ?? '';
    const trailing = decoded.match(/\s*$/u)?.[0] ?? '';
    const key = decoded.slice(leading.length, decoded.length - trailing.length);
    const translation = translations.get(key);
    return translation === undefined ? value : encode(`${leading}${translation}${trailing}`);
  };
  const parts = html.split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<[^>]+>)/giu);
  return parts.map((part) => {
    if (/^<(?:script|style)\b/iu.test(part)) return part;
    if (part.startsWith('<')) return part.replace(/\b(aria-label|placeholder|title)="([^"]*)"/gu, (_, name, value) => `${name}="${translate(value)}"`);
    return translate(part);
  }).join('');
}

export const localeEntries = Object.entries(locales).map(([key, value]) => ({ key, ...value }));
export const pdfOnlyLocaleEntries = pdfOnlyLocaleKeys.map((key) => ({ key, ...pdfOnlyLocales[key] }));
export const pdfLocaleEntries = [...localeEntries, ...pdfOnlyLocaleEntries];
