# CH004 · Swiss pillar 3a contribution and tax-saving scenarios

## Product scope

The local engine applies the statutory annual deduction ceiling for 2026/2027 using the user's second-pillar status and (without a second pillar) qualifying Swiss earned income. It displays the contribution within the legal ceiling and any excess. To estimate the tax effect, the user compares the complete official ESTV annual income/wealth tax totals before and after entering only the eligible pillar 3a deduction in the second ESTV run. No marginal rate, canton rate or tax-table result is guessed or embedded.

The user supplies a consistent municipality and household profile for both official calculations. The page calculates the difference between the entered totals, not the binding tax assessment. It does not estimate withdrawal taxation, investment returns, fees or recommend a provider. Inputs remain in the browser.

## Current deduction ceilings

| Tax year | Member of second pillar | No second pillar |
| --- | ---: | ---: |
| 2026 | CHF 7,258 | Up to 20% of qualifying earned income, capped at CHF 36,288 |
| 2027 | CHF 7,373 | Up to 20% of qualifying earned income, capped at CHF 36,864 |

## Sources and refresh path

- [BSV · the third pillar and deduction rules](https://www.bsv.admin.ch/de/die-dritte-saeule)
- [BSV · 2027 deduction limits, 5 October 2026](https://www.bsv.admin.ch/de/newnsb/6ck3kzVxBNQ4)
- [ESTV · official tax calculator](https://www.estv.admin.ch/de/steuerrechner-steuern-berechnen)
- [ESTV · calculation documentation](https://www.estv.admin.ch/dam/de/sd-web/4wCmxZ0qNcsD/Erlaeuterungen-Steuerberechnungen_de-fr-it-en.pdf)

The legal ceilings are reviewed when BSV updates the annual amounts. ESTV remains the source of the location- and household-specific tax results. No paid service or visitor-time network request is used.
