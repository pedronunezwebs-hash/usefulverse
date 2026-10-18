# CH007 · Swiss basic health insurance deductible comparison

Estado de entrega: motor y formulario locales, sin despliegue. El piloto cubre 37 rutas; tras detectar texto automático corrupto, las 36 rutas no inglesas usan fallback fuente en inglés. La localización no está aprobada para usuarios hasta contar con traducción revisada.

## Scope

The user enters monthly premiums offered for the same insurer, premium region, age group, accident cover and insurance model, plus low, expected and high estimates for annual eligible treatment costs. The local calculator compares annual premiums plus modeled deductible and standard retention-fee cost sharing. It ranks the entered options by expected total and shows how the comparison changes across all three spending scenarios.

It never infers a premium, insurer offer, canton or premium region. Blank deductible offers remain out of the comparison. The selected adult/child schedule only changes which legal deductibles and statutory retention-fee cap are modeled; it does not infer the visitor's age from language or location.

## Rules modeled

- Adults: ordinary CHF 300 deductible; optional CHF 500, 1,000, 1,500, 2,000 or 2,500.
- Children under 18: ordinary CHF 0 deductible; optional CHF 100, 200, 300, 400, 500 or 600.
- After the deductible, standard retention fee is 10% of eligible remaining costs, capped at CHF 700 per year for adults and CHF 350 for children.
- Actual offers can differ by insurer and for young adults. The user enters the monthly premiums from one current quote; the tool does not fetch insurer data.

## Exclusions

This is an estimate of premiums plus the standard deductible and retention fee on eligible costs. It excludes the CHF 15 per-day hospital contribution, special 40% retention on certain medicines, maternity and preventive-service exemptions, services outside compulsory insurance, subsidies, supplementary insurance and insurer-specific exceptions. It is not medical or insurance advice; users should check the policy wording and make sure a higher deductible is affordable.

## Official sources and refresh path

- [FOPH · Optional deductibles](https://www.bag.admin.ch/en/health-insurance-optional-deductibles) — legal deductible schedules and maximum premium reductions.
- [FOPH · Co-payment](https://www.bag.admin.ch/en/health-insurance-co-payment-for-persons-resident-in-switzerland) — standard retention fee, annual caps, hospital contribution and exemptions.
- [Priminfo](https://www.priminfo.admin.ch/) — official federal premium comparison. The user copies current offers into the calculator; no premium table is redistributed and no visitor-time data request is made.

The formula and deductible options should be revisited if the Federal Office of Public Health changes the law. Premiums are refreshed by the person using current offers, so the estimator does not become stale from insurer price changes.
