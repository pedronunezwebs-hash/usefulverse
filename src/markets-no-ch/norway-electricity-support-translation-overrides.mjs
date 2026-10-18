// Context fixes for machine-translated terms; native-language review is still needed.
import { norwayElectricitySupportEnglish as en } from './norway-electricity-support-copy-en.mjs';

export const norwayElectricitySupportTranslationOverrides = Object.freeze({
  es: Object.freeze({
    [en.fields.scope]: 'Electricidad en Noruega · reglas de 2026 · introduce tus propios datos horarios. El idioma no cambia el país ni las reglas.',
    [en.fields.noPrices]: 'Los precios proceden del CSV que seleccionaste; esta herramienta no los descarga.',
  }),
  fr: Object.freeze({
    [en.fields.noPrices]: 'Les prix proviennent du fichier CSV que vous avez choisi ; cet outil ne les télécharge pas.',
    [en.fields.priceArea]: 'Zone de prix norvégienne indiquée dans le fichier CSV',
  }),
  de: Object.freeze({
    [en.fields.noPrices]: 'Die Preise stammen aus Ihrer CSV-Datei; dieses Tool lädt keine Preise herunter.',
    [en.fields.vat0]: '0 % Mehrwertsteuer auf Strom (bitte prüfen, ob dies für Ihren Zähler gilt)',
  }),
  pt: Object.freeze({
    [en.fields.noPrices]: 'Os preços vêm do CSV que você selecionou; esta ferramenta não os baixa.',
    [en.fields.scope]: 'Eletricidade na Noruega · regras de 2026 · insira seus próprios dados por hora. O idioma não muda o país nem as regras.',
  }),
  ja: Object.freeze({
    [en.fields.vat0]: '電気料金にかかる付加価値税 0%（ご自身のメーターに適用されるか確認してください）',
  }),
  fa: Object.freeze({
    [en.fields.noPrices]: 'قیمت‌ها از فایل CSV انتخاب‌شده خوانده می‌شوند؛ این ابزار قیمت‌ها را دانلود نمی‌کند.',
    [en.fields.scope]: 'برق در نروژ · مقررات سال ۲۰۲۶ · داده‌های ساعتی خود را وارد کنید. زبان، کشور یا مقررات را تغییر نمی‌دهد.',
  }),
  nb: Object.freeze({
    [en.fields.scope]: 'Strøm i Norge · regler for 2026 · legg inn egne timedata. Språket endrer ikke land eller regler.',
    [en.details]: 'Den vanlige strømstøtten dekker 90 % av spotprisen over 77 øre/kWh uten mva for kvalifisert forbruk, opptil 5 000 kWh per måned. Norgespris har en fast pris på 50 øre/kWh med mva (40 øre uten mva). Oppgjøret beregnes med månedens gjennomsnittlige spotpris i prisområdet og kvalifisert målt forbruk. Forbruksgrensen er 5 000 kWh per måned for bolig og 1 000 kWh per måned for fritidsbolig. En husholdning kan velge én ordning, ikke begge. Nettleie og andre gebyrer legges til separat i alle scenarioene. Sammenligningen bruker timedataene du legger inn; verktøyet henter ikke strømpriser.',
    [en.limits]: 'Bare husholdningsstrøm i Norge · regler for 2026 · beregningene skjer lokalt. Verktøyet henter ikke gjeldende priser, avgjør ikke om du har rett til støtte, omfatter ikke fjernvarme eller næringsmålere og beregner ikke en full strømregning. Mva-valget må stemme med strømregningen din. Verktøyet bruker timepriser du legger inn uten mva, samt nettleie og andre gebyrer du legger inn uten mva. Sjekk måler, kommune, månedlige grenser, leverandørvilkår og gjeldende regler hos NVE eller nettselskapet ditt.',
    [en.fields.noPrices]: 'Prisene kommer fra CSV-filen du valgte; verktøyet laster ikke ned priser.',
  }),
});
