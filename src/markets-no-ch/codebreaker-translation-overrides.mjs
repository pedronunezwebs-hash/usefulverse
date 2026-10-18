import { codebreakerEnglish as en } from './codebreaker-copy-en.mjs';

export const codebreakerTranslationOverrides = Object.freeze({
  es: Object.freeze({
    [en.intro]: 'Descifra un código oculto usando las pistas que aparecen tras cada intento. Elige el reto diario o configura una partida de práctica con la longitud y las repeticiones que prefieras.',
    [en.fields.feedback]: '{exact} en la posición correcta · {misplaced} en otra posición',
    [en.fields.scope]: 'Las reglas y el reto diario son iguales en todo el mundo; solo cambia el idioma de la interfaz.',
  }),
  pt: Object.freeze({
    [en.intro]: 'Descubra um código oculto usando as pistas exibidas após cada tentativa. Escolha o desafio diário ou configure uma partida de prática com o tamanho e as repetições que preferir.',
    [en.fields.feedback]: '{exact} na posição correta · {misplaced} em outra posição',
  }),
  nb: Object.freeze({
    [en.name]: 'Kodeknekkerspill',
    [en.title]: 'Kodeknekkerspill på nett · daglige og egendefinerte logikkoppgaver',
    [en.intro]: 'Finn den skjulte koden ved hjelp av tydelige hint etter hvert forsøk. Velg dagens oppgave eller lag en øvingsrunde med ønsket kodelengde og om symboler kan gjentas.',
    [en.fields.challenge]: 'Vanskelig · 5 plasser, 8 symboler, gjentakelser tillatt',
    [en.fields.tutorialTitle]: 'Eksempel på et hint',
    [en.fields.tutorial]: 'Hvis et forsøk gir 1 riktig plassering og 2 riktige symboler på feil plass, er ett symbol i riktig posisjon og to andre finnes i koden. Hintet viser ikke hvilke plasser det gjelder.',
    [en.fields.slot]: 'Posisjon {number}',
    [en.fields.selectSymbol]: 'Velg symbol for posisjon {number}',
    [en.example]: 'Velg et symbol for hver posisjon, og send inn forsøket. Et nøyaktig treff betyr at både symbol og posisjon stemmer. Et treff på feil plass betyr at symbolet finnes i koden, men står et annet sted.',
    [en.faq[0].q]: 'Endres oppgaven hvis jeg bytter språk?',
    [en.fields.feedback]: '{exact} på riktig plass · {misplaced} på en annen plass',
    [en.fields.scope]: 'Reglene og dagens kode er de samme over hele verden; bare grensesnittspråket endres.',
    [en.fields.dailyDone]: 'Dagens runde er ferdig. Du kan spille den på nytt eller komme tilbake i morgen.',
  }),
  de: Object.freeze({
    [en.fields.feedback]: '{exact} an der richtigen Stelle · {misplaced} an anderer Stelle',
  }),
});
