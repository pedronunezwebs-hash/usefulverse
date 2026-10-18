# CH005 · Swiss occupational pension (BVG/LPP) scenario

## Scope and use

This browser-only scenario estimates the statutory mandatory coordinated salary and age-related retirement credit for one employer, using federal limits effective in 2026 or 2027. It then projects a user-entered mandatory BVG balance with transparent, editable salary-growth, interest and conversion-rate assumptions. It excludes plan-specific extra-mandatory benefits, risk costs, fees, gaps, purchases, multiple concurrent jobs, part-time coordination rules and the pension fund's individual regulations. Use the insurance certificate and pension fund forecast for personal planning.

The age credit rates are 7%, 10%, 15% and 18% by statutory age bands. These are gross retirement credits, not the employee's payroll deduction: how the employer and employee finance them is determined by the pension plan, subject to the employer's statutory minimum contribution obligation.

## Dated federal limits

| Limit | 2026 | From 1 January 2027 |
|---|---:|---:|
| Entry threshold | CHF 22,680 | CHF 23,040 |
| Coordination deduction | CHF 26,460 | CHF 26,880 |
| Minimum coordinated salary | CHF 3,780 | CHF 3,840 |
| Upper salary limit | CHF 90,720 | CHF 92,160 |
| BVG mandatory minimum interest | 1.25% currently published | 2027 decision pending on 17 October 2026 |
| Mandatory conversion rate at reference age | 6.8% | 6.8% statutory minimum |

The federal pension commission recommended a 1.75% minimum interest rate for 2027 on 31 August 2026. That recommendation was not yet a Federal Council decision when checked on 17 October 2026, so it is only discussed in the page copy; the projection field remains user-editable and does not silently apply it as law.

## Projection assumptions

The estimate compounds the user-entered current mandatory balance. For each remaining integer age from the current age up to (excluding) the scenario retirement age, it applies the published age-band credit to a salary grown by the entered annual rate, adds that credit at year end, and applies the entered annual interest. The same selected year's legal limits are held constant through all future projection years. The displayed pension multiplies the resulting mandatory balance by the user's conversion-rate assumption. These are transparent scenario mechanics, not a forecast, entitlement decision or promise of future law.

The mandatory salary rule is applied only to a single entered employer salary. Under-threshold salaries display zero mandatory coordinated salary, while noting that a pension fund may offer broader cover. Plan rules can be more generous than these federal minimum assumptions.

## Sources and refresh path

- [BSV · occupational pension rules and benefits](https://www.bsv.admin.ch/de/altersvorsorge-beruflichen-vorsorge), updated 5 January 2026.
- [BSV · federal decision on 2027 limit adjustments](https://www.bsv.admin.ch/de/newnsb/BqB41FVYi5FB), 2 October 2026; includes the 2027 limits in the linked official PDF.
- [BSV · 2026 occupational-pension key figures PDF](https://www.bsv.admin.ch/dam/de/sd-web/3jZGqTLgADbl/BPP_Zahlen_85_2026.pdf).
- [BSV · age-related annual retirement credit rates](https://www.bsv.admin.ch/dam/bsv/de/dokumente/das_leistungszielderberuflichenvorsorge.pdf.download.pdf/das_leistungszielderberuflichenvorsorge.pdf).
- [BSV · minimum-interest recommendation for 2027](https://www.bsv.admin.ch/de/newnsb/0OLsO33MmzIC), 31 August 2026; the release states that the Federal Council decides.

Limits are updated only after the BSV publishes a binding change. The live site has no data refresh service; the dated source links make the supported years visible and revisitable without paid APIs or visitor tracking.
