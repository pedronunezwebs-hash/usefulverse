// Context fixes for machine-translated terminology; review with native speakers before publication.
import { norwayTollCostEnglish as en } from './norway-toll-cost-copy-en.mjs';

export const norwayTollCostTranslationOverrides = Object.freeze({
  fr: Object.freeze({
    [en.fields.refreshData]: 'Actualiser les données des points de péage de Statens vegvesen',
    [en.fields.stationSearch]: 'Rechercher des points de péage en Norvège par point, projet ou commune',
    [en.fields.direction]: 'L’itinéraire passe par ce point de péage dans le sens où le péage est perçu',
  }),
  de: Object.freeze({
    [en.fields.stationSearch]: 'Norwegische Mautstellen nach Name, Projekt oder Gemeinde suchen',
    [en.fields.direction]: 'Die Route passiert diese Mautstelle in der Richtung, für die die Maut erhoben wird',
  }),
  nb: Object.freeze({
    [en.fields.scope]: 'Anslag over bompengekostnader i Norge · dato for stasjonsdata 17. oktober 2026 · språk på siden endrer ikke land eller bompengeregler.',
    [en.fields.direction]: 'Ruten passerer denne bomstasjonen i innkrevingsretningen for bompenger',
    [en.fields.electricMissing]: 'Egen takst for små elbiler mangler; taksten for liten bil vises som referanse',
  }),
});
