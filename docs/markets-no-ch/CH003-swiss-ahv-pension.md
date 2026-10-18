# CH003 · Swiss AHV/AVS retirement-pension scenario calculator

## Supported estimate

This local calculator applies the federal normal-retirement formula to a determining average annual income (RAM) entered by the user from an AHV individual account or official estimate. It rounds the RAM upward to the next official income-table band, applies the formula, caps the full monthly amount at the year's maximum, and adjusts by one forty-fourth for each missing contribution year. Contribution durations can be entered in quarter-year steps from 43 through 44 years to represent the current retirement-age transition. It displays 12 regular monthly amounts plus the 13th old-age pension for a full year of entitlement.

Current built-in values cover 2026 and the officially announced 2027 values. The 2026 minimum/maximum are CHF 1,260/2,520 per month; from 1 January 2027 the BSV has set CHF 1,280/2,560. The federal formula is 74% of the minimum plus 13/600 of RAM up to 36 times the minimum; above that threshold it is 104% of the minimum plus 8/600 of RAM. Amounts are rounded to a whole franc.

## Not inferred or included

The user supplies official determining average income and contribution duration. The tool does not infer the insured career from current salary, personal status, age, nationality, or location. It does not establish eligibility or reference age, calculate early/late-claim adjustments, income splitting, care/education credits, transition-generation supplements, spouse caps, or partial-year entitlement. Those require a verified individual record or rule branches outside this local scenario; the linked ESCAL or compensation office is authoritative.

The estimate is calculated locally and no entered amounts are sent to a server. Automated translation packs are static; native review remains required before publication.

## Sources and update path

- [BSV · AHV pension benefits and limits](https://www.bsv.admin.ch/de/leistungen-ahv-detail)
- [BSV · 2027 adjustment decision, 2 October 2026](https://www.bsv.admin.ch/de/newnsb/BqB41FVYi5FB)
- [Fedlex · AHVG, Article 34](https://www.fedlex.admin.ch/eli/cc/63/837_843_843/de)
- [AHV/IV · old-age pensions leaflet 3.01 and published rounding examples](https://www.ahv-iv.ch/p/3.01.d)
- [BSV · 13th AHV old-age pension](https://www.bsv.admin.ch/de/umsetzung-13-ahv-rente)
- [Official ESCAL pension estimate](https://www.ahv-iv.ch/de/Formulare/Online-Rentensch%C3%A4tzung-ESCAL)

Refresh year-specific minimum/maximum figures and the official formula when BSV publishes an adjustment. No paid service or visitor-time network request is used for calculations.
