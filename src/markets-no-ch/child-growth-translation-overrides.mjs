import { childGrowthEnglish as en } from './child-growth-copy-en.mjs';

export const childGrowthTranslationOverrides = Object.freeze({
  es: Object.freeze({
    [en.intro]: 'Registra la estatura y el peso del niño en varias fechas y compara cada medición con una sola curva de referencia. Elígela de forma consciente: ni el idioma ni la ubicación seleccionan el estándar por ti.',
    [en.details]: 'Las tablas LMS de CDC 2000 cubren de 2 a 20 años. Las fechas exactas determinan la edad; la tabla CDC agrupa las edades por meses. El IMC por encima del percentil 95 usa el método CDC ampliado y sus datos de dispersión de 2022. Compara con una población de referencia de EE. UU.; no es un estándar específico de tu país ni universal.',
    [en.fields.acknowledgement]: 'Entiendo que esta es una referencia de Estados Unidos, no un estándar elegido para mi país.',
    [en.fields.reference]: 'Referencia que utiliza esta calculadora', [en.fields.referenceOption]: 'Curvas de crecimiento CDC de Estados Unidos de 2000, de 2 a 20 años',
    [en.fields.female]: 'Gráfica de crecimiento para niñas', [en.fields.male]: 'Gráfica de crecimiento para niños',
    [en.fields.sourceTerms]: 'Condiciones de reutilización de CDC: atribuir el material a CDC, mostrar de forma clara que CDC no respalda esta herramienta, no alterar el contenido de origen e indicar que el material está disponible gratis en CDC.',
    [en.fields.disclaimer]: 'CDC no respalda ni ha aprobado esta herramienta. Este material también está disponible gratis en CDC.',
    [en.fields.sourceReuse]: 'Condiciones de reutilización del contenido de CDC',
  }),
  nb: Object.freeze({
    [en.name]: 'Vekstkurve for barn · CDC-referanse for USA',
    [en.title]: 'Vekstkurve for barn · CDC-referanse fra USA',
    [en.fields.reference]: 'Referansen denne kalkulatoren bruker', [en.fields.referenceOption]: 'CDC-vekstdiagrammer fra USA (2000), alder 2–20 år',
    [en.intro]: 'Registrer barnets høyde og vekt på flere datoer, og sammenlign målingene med én valgt referanse. Velg referansen bevisst; språk eller sted velger ikke standarden for deg.',
    [en.fields.female]: 'Jentediagram', [en.fields.male]: 'Guttediagram',
    [en.fields.heightPercentile]: 'Høyde for alder · persentil', [en.fields.weightPercentile]: 'Vekt for alder · persentil',
    [en.fields.sex]: 'Kjønnskategori i CDC-referansediagrammet', [en.fields.clear]: 'Slett alle målinger', [en.fields.sourceReuse]: 'Vilkår for gjenbruk av CDC-innhold',
    [en.details]: 'De inkluderte CDC LMS-tabellene fra 2000 dekker alder 2–20 år. Fødselsdato og måledato bestemmer alderen, som legges i CDC-tabellens aldersintervall på én måned. BMI over 95. persentil beregnes med CDCs utvidede metode og spredningsdata fra 2022. Dette er en sammenligning med en referansepopulasjon fra USA, ikke en landsspesifikk eller universell standard.',
    [en.fields.sourceTerms]: 'CDC-vilkår for gjenbruk: oppgi CDC som kilde, vis tydelig at CDC ikke støtter verktøyet, ikke endre kildeinnholdet, og opplys at materialet er gratis tilgjengelig fra CDC.',
    [en.fields.disclaimer]: 'CDC har ikke godkjent eller støttet dette verktøyet. Materialet er også gratis tilgjengelig fra CDC.',
  }),
});
