# CH002 · Swiss annual tax scenario comparator

## Product scope

This is a local comparison companion for results calculated by the official Swiss Federal Tax Administration (ESTV) calculator. It is not an independent Swiss tax estimator and does not apply federal, cantonal, municipal, church or personal-tax rules.

The user opens the live ESTV calculator, calculates each household/municipality/year there, then enters the taxable income and wealth bases and the tax breakdown here. The browser computes totals, effective rates, differences, and a CSV export for up to four scenarios. It flags comparisons as like-for-like only when the tax year and taxable bases match. Inputs are not sent to a server.

This scope avoids copying canton and municipality tables with unclear redistribution terms and avoids stale embedded tax data. Users always calculate against ESTV's current online data first. ESTV says its interactive calculator supports individual income/wealth tax calculations, household inputs, municipality comparisons, and tax breakdowns; its May 2026 notes describe the calculation as non-binding and without guarantee.

## Sources

- [ESTV interactive tax calculator](https://swisstaxcalculator.estv.admin.ch/)
- [ESTV calculator landing page](https://www.estv.admin.ch/de/steuerrechner-steuern-berechnen)
- [ESTV calculation notes, May 2026](https://www.estv.admin.ch/dam/de/sd-web/4wCmxZ0qNcsD/Erlaeuterungen-Steuerberechnungen_de-fr-it-en.pdf)
- [ESTV Swiss tax-burden survey profile](https://www.estv.admin.ch/dam/de/sd-web/R1HHFfLGKCEl/steckbrief-steuerbelastung-schweiz-de.pdf)

## Release gate

The 56 English strings are in static locale packs for 36 non-English locales; Bokmål is also included as the 37th page. The automatically generated copy requires native review before publication. The pilot is local only. Do not describe this page as an automatic estimate or tax filing advice.
