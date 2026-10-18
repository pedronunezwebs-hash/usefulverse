// Context fixes for craft vocabulary; machine translations still need native review.
import { beadPatternEnglish as en } from './bead-pattern-copy-en.mjs';

export const beadPatternTranslationOverrides = Object.freeze({
  es: Object.freeze({
    [en.intro]: 'Crea un patrón con cuadrícula a partir de una imagen propia: para cuentas o punto de cruz. Elige el tamaño de la cuadrícula y la paleta; consulta el símbolo y la cantidad de celdas de cada color. Todo se procesa en tu dispositivo.',
    [en.fields.gridHelp]: 'Cada casilla es un punto o una cuenta. Sigue el símbolo y el color que aparecen en la leyenda.',
  }),
  fr: Object.freeze({
    [en.fields.gridHelp]: 'Chaque case représente un point ou une perle. Suivez le symbole et la couleur indiqués dans la légende.',
  }),
  de: Object.freeze({
    [en.fields.gridHelp]: 'Jedes Kästchen steht für einen Stich oder eine Perle. Orientieren Sie sich an Symbol und Farbe in der Legende.',
  }),
  pt: Object.freeze({
    [en.details]: 'A imagem é dividida em quadrados e reduzida à quantidade de cores escolhida. A opção de pontilhamento pode sugerir tons adicionais usando quadrados vizinhos. Cada quadrado preenchido recebe um símbolo; a legenda mostra quantos há de cada cor. O resultado é um rascunho visual: não associa as cores a uma marca, tamanho de miçanga, tabela de linhas ou kit específico.',
    [en.fields.gridHelp]: 'Cada quadrado representa um ponto ou uma miçanga. Siga o símbolo e a cor indicados na legenda.',
  }),
  ja: Object.freeze({
    [en.fields.gridHelp]: 'マス目1つが1目またはビーズ1個を表します。凡例の記号と色を確認しながら作業してください。',
  }),
  fa: Object.freeze({
    [en.fields.gridHelp]: 'هر مربع نشان‌دهنده یک خانه یا یک مهره است. نماد و رنگ آن را با راهنمای الگو تطبیق دهید.',
  }),
  ar: Object.freeze({
    [en.fields.gridHelp]: 'يمثل كل مربع غرزة أو خرزة واحدة. طابق الرمز واللون مع دليل النمط.',
  }),
  nb: Object.freeze({
    [en.fields.gridHelp]: 'Hver rute viser én maske eller én perle. Følg symbolet og fargen i tegnforklaringen.',
    [en.fields.rows]: 'Rader i rutenettet (0 = tilpass bildet automatisk)',
  }),
  zh_tw: Object.freeze({
    [en.fields.empty]: '空白格（對應圖片中的透明區域）',
    [en.fields.gridHelp]: '每個方格代表一個針目或一顆珠子。請依照圖例中的符號與顏色製作。',
  }),
});
