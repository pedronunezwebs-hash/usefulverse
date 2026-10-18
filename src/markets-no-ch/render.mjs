import { marketTools } from './catalog.mjs';
import { model3dViewerTranslationsByLocale } from './3d-model-viewer-translations.mjs';
import { model3dViewerGeneratedTranslationsByLocale } from './3d-model-viewer-generated-translations.mjs';
import { dxfViewerTranslationsByLocale } from './dxf-viewer-translations.mjs';
import { dxfViewerGeneratedTranslationsByLocale } from './dxf-viewer-generated-translations.mjs';
import { translationsByLocale } from './translations.mjs';
import { norwayDisabilityBenefitTranslationsByLocale } from './norway-disability-benefit-translations.mjs';
import { norwayStudentFinanceTranslationsByLocale } from './norway-student-finance-translations.mjs';
import { norwayBsuTranslationsByLocale } from './norway-bsu-translations.mjs';
import { norwayCommutingDeductionTranslationsByLocale } from './norway-commuting-deduction-translations.mjs';
import { norwayMileageReimbursementTranslationsByLocale } from './norway-mileage-reimbursement-translations.mjs';
import { latePaymentInterestTranslationsByLocale } from './late-payment-interest-translations.mjs';
import { norwayImportCostTranslationsByLocale } from './norway-import-cost-translations.mjs';
import { norwayCarImportCostTranslationsByLocale } from './norway-car-import-cost-translations.mjs';
import { norwayTollCostTranslationsByLocale } from './norway-toll-cost-translations.mjs';
import { norwayTollCostTranslationOverrides } from './norway-toll-cost-translation-overrides.mjs';
import { norwayPropertyTransferTranslationsByLocale } from './norway-property-transfer-translations.mjs';
import { norwayPropertyTransferTranslationOverrides } from './norway-property-transfer-translation-overrides.mjs';
import { norwayElectricitySupportTranslationsByLocale } from './norway-electricity-support-translations.mjs';
import { norwayElectricitySupportTranslationOverrides } from './norway-electricity-support-translation-overrides.mjs';
import { beadPatternTranslationsByLocale } from './bead-pattern-translations.mjs';
import { beadPatternTranslationOverrides } from './bead-pattern-translation-overrides.mjs';
import { codebreakerTranslationsByLocale } from './codebreaker-translations.mjs';
import { codebreakerTranslationOverrides } from './codebreaker-translation-overrides.mjs';
import { shoeSizeTranslationsByLocale } from './shoe-size-translations.mjs';
import { shoeSizeTranslationOverrides } from './shoe-size-translation-overrides.mjs';
import { ringSizeTranslationsByLocale } from './ring-size-translations.mjs';
import { ringSizeTranslationOverrides } from './ring-size-translation-overrides.mjs';
import { childGrowthTranslationsByLocale } from './child-growth-translations.mjs';
import { childGrowthTranslationOverrides } from './child-growth-translation-overrides.mjs';
import { phoneticTranslationOverrides } from './phonetic-translation-overrides.mjs';
import { childGrowthSource } from './cdc-growth-sources.mjs';
import { grisCardGameTranslationsByLocale } from './gris-card-game-translations.mjs';
import { grisCardGameTranslationOverrides } from './gris-card-game-translation-overrides.mjs';
import { fiveLetterWordEnglish } from './five-letter-word-copy-en.mjs';
import { fiveLetterWordTranslationsByLocale } from './five-letter-word-translations.mjs';
import { fiveLetterWordTranslationOverridesByLocale } from './five-letter-word-translation-overrides.mjs';
import { bridgeGameEnglish } from './bridge-game-copy-en.mjs';
import { bridgeGameTranslationsByLocale } from './bridge-game-translations.mjs';
import { bridgeGameTranslationOverridesByLocale } from './bridge-game-translation-overrides.mjs';
import { farkleEnglish } from './farkle-copy-en.mjs';
import { farkleTranslationsByLocale } from './farkle-translations.mjs';
import { farkleTranslationOverridesByLocale } from './farkle-translation-overrides.mjs';
import { swissNetSalaryTranslationsByLocale } from './swiss-net-salary-translations.mjs';
import { swissNetSalaryTranslationOverrides } from './swiss-net-salary-translation-overrides.mjs';
import { swissTaxCompareTranslationsByLocale } from './swiss-tax-compare-translations.mjs';
import { swissAhvPensionTranslationsByLocale } from './swiss-ahv-pension-translations.mjs';
import { swissPillar3aTranslationsByLocale } from './swiss-pillar-3a-translations.mjs';
import { swissBvgPensionEnglish } from './swiss-bvg-pension-copy-en.mjs';
import { swissBvgPensionTranslationsByLocale } from './swiss-bvg-pension-translations.mjs';
import { swissPensionWithdrawalEnglish } from './swiss-pension-withdrawal-copy-en.mjs';
import { swissPensionWithdrawalTranslationsByLocale } from './swiss-pension-withdrawal-translations.mjs';
import { swissHealthDeductibleTranslationsByLocale } from './swiss-health-deductible-translations.mjs';
import { swissRentAdjustmentTranslationsByLocale } from './swiss-rent-adjustment-translations.mjs';
import { swissVacationAccrualTranslationsByLocale } from './swiss-vacation-accrual-translations.mjs';
import { swissPremiumReductionTranslationsByLocale } from './swiss-premium-reduction-translations.mjs';
import { remainingToolsEnglish } from './remaining-tools-copy-en.mjs';
import { resumeStructureEnglish } from './resume-structure-copy-en.mjs';
import { vocalRemoverEnglish } from './vocal-remover-copy-en.mjs';
import { finalCandidateTranslationsByLocale } from './final-candidate-translations.mjs';
import { finalCandidateTranslationOverridesByLocale } from './final-candidate-translation-overrides.mjs';
import { swissProtectedFallbackTranslationOverridesByLocale } from './swiss-protected-fallback-translation-overrides.mjs';
import { swissProtectedFallbackManualOverridesByLocale } from './swiss-protected-fallback-manual-overrides.mjs';
import { swissProtectedFallbackFullTranslationOverridesByLocale } from './swiss-protected-fallback-full-translation-overrides.mjs';
import { tools as baseTools } from '../catalog.mjs';
import { localizedTool } from '../locales.mjs';

const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const finalCandidateModes = new Set(['swissHealthDeductible', 'swissPremiumReduction', 'swissRentAdjustment', 'swissVacationAccrual']);
const safeJson = (value) => JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026');
const byMode = Object.fromEntries(marketTools.map((tool) => [tool.mode, tool]));

function swissQrBillForm(copy) {
  const f = copy.fields;
  const styles = `<style>
    .qr-bill-tool fieldset{border:1px solid var(--line);border-radius:.75rem;padding:1rem;margin:1rem 0;min-width:0}.qr-bill-tool legend{font-weight:750;padding-inline:.4rem}.qr-bill-tool .qr-read-panel{border-top:1px solid var(--line);padding-top:1rem;margin-top:1.25rem}.qr-bill-tool [data-qr-bill-output]{margin-top:1.5rem}.qr-bill-print-sheet{display:grid;grid-template-columns:29.52% 70.48%;width:100%;min-height:24rem;background:#fff;border:1px solid var(--line);color:#111;font:12px/1.35 Arial,sans-serif}.qr-bill-print-sheet p{margin:.35rem 0;overflow-wrap:anywhere}.qr-bill-print-sheet h4{margin:0 0 .7rem;font-size:1rem}.qr-bill-receipt,.qr-bill-payment{padding:.8rem;min-width:0}.qr-bill-receipt{border-inline-end:1px dashed #777}.qr-bill-payment{display:grid;grid-template-columns:minmax(120px,46mm) 1fr;align-content:start;gap:.45rem .8rem}.qr-bill-code{grid-row:1/6}.qr-bill-code svg{display:block;width:min(46mm,100%);height:auto}.qr-bill-payment-info{min-width:0}.qr-bill-payment-info p{margin:.5rem 0}.qr-bill-calibration{grid-column:2;display:grid;grid-template-columns:100mm 1fr;align-items:center;gap:.4rem;margin-top:.5rem}.qr-bill-calibration span{display:block;width:100mm;border-top:1px solid #111}.qr-bill-calibration small{font-size:9px}.qr-bill-tool button:hover{filter:brightness(.96)}@media(max-width:600px){.qr-bill-print-sheet{grid-template-columns:1fr}.qr-bill-receipt{border-inline-end:0;border-bottom:1px dashed #777}.qr-bill-payment{grid-template-columns:minmax(105px,40%) 1fr}.qr-bill-calibration{grid-template-columns:minmax(90px,100mm) 1fr}.qr-bill-calibration span{max-width:100%}}@media print{@page{size:A4 portrait;margin:0}body:has([data-qr-print]){background:#fff}body:has([data-qr-print]) .top,body:has([data-qr-print]) main>p,body:has([data-qr-print]) main>h1,body:has([data-qr-print]) main>.content,body:has([data-qr-print]) main>aside,body:has([data-qr-print]) footer,body:has([data-qr-print]) .panel>h2,body:has([data-qr-print]) .qr-bill-tool>fieldset,body:has([data-qr-print]) .qr-read-panel,body:has([data-qr-print]) .qr-bill-tool>[data-qr-bill-status],body:has([data-qr-print]) .qr-bill-output>h3,body:has([data-qr-print]) .qr-bill-output>.actions{display:none!important}body:has([data-qr-print]) main{max-width:none;padding:0;margin:0}body:has([data-qr-print]) .panel,body:has([data-qr-print]) .qr-bill-output{display:block!important;border:0;margin:0;padding:0}body:has([data-qr-print]) .qr-bill-print-sheet{width:210mm;height:105mm;min-height:105mm;border:0;break-after:page}.qr-bill-receipt{padding:4mm 3mm}.qr-bill-payment{padding:4mm 5mm;grid-template-columns:46mm 1fr}.qr-bill-code svg{width:46mm}.qr-bill-calibration{grid-template-columns:100mm 1fr}}</style>`;
  const text = (id, label, max, extra = '') => `<label class="field">${escape(label)}<input id="${id}" maxlength="${max}" ${extra}></label>`;
  const country = (id, label, optional = false) => `<label class="field">${escape(label)}<input id="${id}" maxlength="2" ${optional ? '' : 'value="CH" required'} autocomplete="country"></label>`;
  const currency = `<label class="field">${escape(f.currency)}<select id="qr-bill-currency"><option value="CHF">${escape(f.chf)}</option><option value="EUR">${escape(f.eur)}</option></select></label>`;
  const referenceType = `<label class="field">${escape(f.referenceType)}<select id="qr-bill-reference-type"><option value="NON" selected>${escape(f.non)}</option><option value="QRR">${escape(f.qrr)}</option><option value="SCOR">${escape(f.scor)}</option></select></label>`;
  const address = (id, title, name, street, building, postal, city, countryCode, optional = false) => `<fieldset><legend>${escape(title)}</legend><div class="fields">${text(`${id}-name`, name, 70, optional ? '' : 'required')}${text(`${id}-street`, street, 70)}${text(`${id}-building`, building, 16)}${text(`${id}-postal`, postal, 16, optional ? '' : 'required')}${text(`${id}-city`, city, 35, optional ? '' : 'required')}${country(`${id}-country`, countryCode, optional)}</div></fieldset>`;
  return `${styles}<div class="qr-bill-tool"><fieldset><legend>${escape(f.input)}</legend>${text('qr-bill-iban', f.iban, 34, 'placeholder="CH…" autocomplete="off" spellcheck="false" required')}${address('qr-bill-creditor', f.creditorHeading, f.creditorName, f.street, f.building, f.postalCode, f.city, f.country)}<div class="fields"><label class="field">${escape(f.amount)}<input id="qr-bill-amount" inputmode="decimal" maxlength="12" placeholder="50.00"></label>${currency}${referenceType}</div>${text('qr-bill-reference', f.reference, 27, 'autocomplete="off" spellcheck="false" placeholder="27 digits for QRR"')}<p class="hint">${escape(f.debtorHeading)}</p>${address('qr-bill-debtor', f.debtorHeading, f.debtorName, f.debtorStreet, f.debtorBuilding, f.debtorPostalCode, f.debtorCity, f.debtorCountry, true)}<label class="field">${escape(f.message)}<textarea id="qr-bill-message" rows="2" maxlength="140"></textarea></label>${text('qr-bill-billing', f.billing, 140)}<div class="actions"><button type="button" class="primary" data-action="generateQrBill">${escape(f.generate)}</button><button type="button" data-action="loadQrSample">${escape(f.loadSample)}</button><button type="button" data-action="clearQrBill">${escape(f.clear)}</button></div></fieldset><section class="qr-read-panel"><h3>${escape(f.uploadQr)}</h3><label class="field">${escape(f.chooseImage)}<input id="qr-bill-image" type="file" accept="image/png,image/jpeg"></label><button type="button" data-action="readQrImage">${escape(f.readImage)}</button><label class="field">${escape(f.payload)}<textarea id="qr-bill-payload-input" rows="4" maxlength="5000" spellcheck="false"></textarea></label><button type="button" data-action="checkQrPayload">${escape(f.validate)}</button></section><p class="hint" data-qr-bill-status role="status" aria-live="polite">${escape(f.ready)}</p><section class="qr-bill-output" data-qr-bill-output hidden><h3>${escape(f.output)}</h3><div class="qr-bill-preview" data-qr-bill-preview></div><div class="actions"><button type="button" data-action="downloadQrPayload">${escape(f.exportPayload)}</button><button type="button" data-action="downloadQrSvg">${escape(f.downloadSvg)}</button><button type="button" data-action="printQrBill">${escape(f.print)}</button></div></section></div>`;
}

function frequencyToneForm(copy) {
  const f = copy.fields;
  return `<div class="frequency-tone-tool" data-frequency-tone><p class="hint">${escape(f.local)}</p><p class="hint">${escape(f.safety)}</p><label class="field" for="frequency-tone-preset">${escape(f.preset)}<select id="frequency-tone-preset" data-tone-preset><option value="custom">${escape(f.custom)}</option><option value="100">${escape(f.low)}</option><option value="440">${escape(f.reference)}</option><option value="1000">${escape(f.mid)}</option><option value="8000">${escape(f.high)}</option><option value="sweep">${escape(f.sweepPreset)}</option></select></label><label class="field" for="frequency-tone-mode">${escape(f.mode)}<select id="frequency-tone-mode" data-tone-mode><option value="tone">${escape(f.tone)}</option><option value="sweep">${escape(f.sweep)}</option></select></label><label class="field" data-tone-single for="frequency-tone-frequency">${escape(f.frequency)}<input id="frequency-tone-frequency" data-tone-frequency type="number" inputmode="numeric" min="20" max="20000" step="1" value="440" required></label><div class="fields" data-tone-sweep hidden><label class="field" for="frequency-tone-start">${escape(f.startFrequency)}<input id="frequency-tone-start" data-tone-start type="number" inputmode="numeric" min="20" max="20000" step="1" value="200" required></label><label class="field" for="frequency-tone-end">${escape(f.endFrequency)}<input id="frequency-tone-end" data-tone-end type="number" inputmode="numeric" min="20" max="20000" step="1" value="1200" required></label></div><label class="field" for="frequency-tone-waveform">${escape(f.waveform)}<select id="frequency-tone-waveform" data-tone-waveform><option value="sine">${escape(f.sine)}</option><option value="square">${escape(f.square)}</option><option value="triangle">${escape(f.triangle)}</option><option value="sawtooth">${escape(f.sawtooth)}</option></select></label><label class="field" for="frequency-tone-channel">${escape(f.channel)}<select id="frequency-tone-channel" data-tone-channel><option value="mono">${escape(f.mono)}</option><option value="stereo">${escape(f.stereo)}</option></select></label><label class="field" for="frequency-tone-duration">${escape(f.duration)}<input id="frequency-tone-duration" data-tone-duration type="number" min="0.25" max="10" step="0.25" value="1" required></label><label class="field" for="frequency-tone-volume">${escape(f.volume)} <output data-tone-volume-value>2%</output><input id="frequency-tone-volume" data-tone-volume type="range" min="0" max="10" step="1" value="2"></label><div class="actions"><button type="button" class="primary" data-tone-play>${escape(f.play)}</button><button type="button" data-tone-stop disabled>${escape(f.stop)}</button><button type="button" data-tone-export>${escape(f.export)}</button></div><p class="hint" data-tone-status role="status" aria-live="polite">${escape(f.ready)}</p></div>`;
}

function norwayEmployerCostForm(copy) {
  const f = copy.fields;
  const number = (id, label, value, max = 1000000000000) => `<label class="field" for="${id}">${escape(label)}<input id="${id}" type="number" inputmode="decimal" min="0" max="${max}" step="any" value="${value}" required></label>`;
  return `<div class="norway-employer-cost-tool" data-norway-employer-cost><p class="hint">${escape(f.zoneHelp)}</p><div class="fields">${number('employer-payroll', f.annualPayroll, 1000000)}${number('employer-holiday-base', f.holidayBase, 1000000)}${number('employer-holiday-rate', f.holidayRate, 10.2, 30)}${number('employer-taxable-pay', f.taxableOtherPay, 0)}${number('employer-pension-base', f.pensionBase, 1000000)}${number('employer-pension-rate', f.pensionRate, 0, 20)}${number('employer-other-costs', f.otherCosts, 0)}</div><div class="fields"><label class="field" for="employer-zone">${escape(f.zone)}<select id="employer-zone"><option value="I">${escape(f.zoneI)}</option><option value="Ia">${escape(f.zoneIa)}</option><option value="II">${escape(f.zoneII)}</option><option value="III">${escape(f.zoneIII)}</option><option value="IV">${escape(f.zoneIV)}</option><option value="IVa">${escape(f.zoneIVa)}</option><option value="V">${escape(f.zoneV)}</option></select></label><label class="field" for="employer-sector">${escape(f.sector)}<select id="employer-sector"><option value="ordinary">${escape(f.ordinary)}</option><option value="agricultureFishing">${escape(f.agricultureFishing)}</option></select></label></div><label class="field" data-employer-allowance for="employer-allowance-used" hidden>${escape(f.allowanceUsed)}<input id="employer-allowance-used" type="number" inputmode="decimal" min="0" max="850000" step="any" value="0"></label><p class="hint">${escape(f.allowanceHelp)} ${escape(f.costHelp)}</p><button type="button" data-employer-toggle-compare aria-expanded="false">${escape(f.compareOffers)}</button><fieldset data-employer-offer-b hidden><legend>${escape(f.offerBHeading)}</legend><div class="fields">${number('employer-b-payroll', f.annualPayroll, 1000000)}${number('employer-b-holiday-base', f.holidayBase, 1000000)}${number('employer-b-holiday-rate', f.holidayRate, 10.2, 30)}${number('employer-b-taxable-pay', f.taxableOtherPay, 0)}${number('employer-b-pension-base', f.pensionBase, 1000000)}${number('employer-b-pension-rate', f.pensionRate, 0, 20)}${number('employer-b-other-costs', f.otherCosts, 0)}</div><p class="hint">${escape(f.comparisonHelp)}</p></fieldset><div class="actions"><button type="button" class="primary" data-employer-calculate>${escape(f.calculate)}</button><button type="button" data-employer-clear>${escape(f.clear)}</button></div><p class="hint" data-employer-status role="status" aria-live="polite">${escape(f.ready)}</p><section class="norway-employer-cost-output" data-employer-result aria-live="polite" hidden></section><p class="hint">${escape(f.privateNote)}</p></div>`;
}

function norwayCompanyCarForm(copy) {
  const f = copy.fields;
  const number = (id, label, value, min, max, step = 'any') => `<label class="field" for="${id}">${escape(label)}<input id="${id}" type="number" inputmode="decimal" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
  return `<div class="norway-company-car-tool"><p class="hint">${escape(f.scope)}</p><div class="fields">${number('company-car-list-price', f.listPrice, 500000, 1, 1000000000)}${number('company-car-months', f.months, 12, 1, 12, 1)}${number('company-car-work-km', f.workKm, 0, 0, 2000000, 1)}${number('company-car-marginal-rate', f.marginalRate, 30, 0, 100)}${number('company-car-own-cost', f.ownCost, 0, 0, 1000000000)}</div><label class="field" for="company-car-old"><input id="company-car-old" type="checkbox"> ${escape(f.oldCar)}</label><label class="field" for="company-car-log"><input id="company-car-log" type="checkbox"> ${escape(f.mileageLog)}</label><p class="hint">${escape(f.mileageStatus)}</p><p class="hint">${escape(f.noFullTax)}</p><div class="actions"><button type="button" class="primary" data-company-car-calculate>${escape(f.calculate)}</button><button type="button" data-company-car-clear>${escape(f.clear)}</button></div><p class="hint" data-company-car-status role="status" aria-live="polite">${escape(f.ready)}</p><section data-company-car-result aria-live="polite" hidden></section><p class="hint">${escape(f.privateNote)}</p></div>`;
}

function norwayDisabilityBenefitForm(copy) {
  const f = copy.fields;
  const years = [f.year1, f.year2, f.year3, f.year4, f.year5];
  const incomeFields = years.map((label, index) => `<label class="field" for="disability-income-${index + 1}">${escape(label)}<input id="disability-income-${index + 1}" type="number" inputmode="decimal" min="0" max="1000000000" step="any" required></label>`).join('');
  return `<div class="norway-disability-benefit-tool" data-disability-tool><p class="hint">${escape(f.scope)}</p><h3>${escape(f.incomeHeading)}</h3><p class="hint">${escape(f.incomeHelp)}</p><div class="fields">${incomeFields}</div><div class="fields"><label class="field" for="disability-degree">${escape(f.disabilityDegree)}<input id="disability-degree" type="number" inputmode="decimal" min="0" max="100" step="1" value="100" required></label><label class="field" for="disability-insurance-time">${escape(f.insuranceTime)}<input id="disability-insurance-time" type="number" inputmode="decimal" min="0" max="100" step="any" value="100" required></label><label class="field" for="disability-minimum">${escape(f.personalMinimum)}<input id="disability-minimum" type="number" inputmode="decimal" min="0" max="1000000000" step="any"></label></div><p class="hint">${escape(f.minimumHelp)}</p><div class="actions"><button type="button" class="primary" data-disability-calculate>${escape(f.calculate)}</button><button type="button" data-disability-clear>${escape(f.clear)}</button></div><p class="hint" data-disability-status role="status" aria-live="polite">${escape(f.ready)}</p><section data-disability-result aria-live="polite" hidden></section><p class="source-links">${escape(f.sourcesHeading)}: <a href="https://www.nav.no/uforetrygd" target="_blank" rel="noopener noreferrer">${escape(f.sourceNav)}</a> · <a href="https://www.nav.no/grunnbelopet" target="_blank" rel="noopener noreferrer">${escape(f.sourceG)}</a> · <a href="https://www.nav.no/regelendring-uforetrygd" target="_blank" rel="noopener noreferrer">${escape(f.sourceRules)}</a> · <a href="https://www.nav.no/uforetrygd" target="_blank" rel="noopener noreferrer">${escape(f.officialCalculator)}</a></p></div>`;
}

function norwayStudentFinanceForm(copy) {
  const f = copy.fields;
  const number = (id, label, value, min = 0, max = 1000000000, step = 'any') => `<label class="field" for="student-${id}">${escape(label)}<input id="student-${id}" type="number" inputmode="decimal" min="${min}" max="${max}" step="${step}" value="${value}" ${value === '' ? '' : 'required'}></label>`;
  const check = (id, label) => `<label class="check"><input id="student-${id}" type="checkbox"> ${escape(label)}</label>`;
  return `<div class="norway-student-finance-tool" data-student-finance-tool><p class="hint">${escape(f.scope)}</p><div class="fields">${number('basis-loan', f.basisLoan, '')}${number('support-months', f.supportMonths, '', 1, 12, 1)}${number('income', f.income, '')}${number('assets', f.assets, '', -1000000000)}${number('passed-credits', f.passedCredits, '', 0, 1000)}${number('supported-credits', f.supportedCredits, '', 0, 1000)}</div><p class="hint">${escape(f.loanHelp)} ${escape(f.incomeHelp)} ${escape(f.assetsHelp)}</p><div class="fields">${check('degree', f.degree)}${check('away', f.away)}${check('shared-assets', f.sharedAssets)}</div><h3>${escape(f.repaymentHeading)}</h3><p class="hint">${escape(f.repaymentHelp)}</p><div class="fields">${number('other-debt', f.additionalDebt, '')}${number('annual-rate', f.annualRate, '', 0, 100)}${number('repayment-years', f.repaymentYears, '', 1, 60, 1)}</div><div class="actions"><button type="button" class="primary" data-student-calculate>${escape(f.calculate)}</button><button type="button" data-student-clear>${escape(f.clear)}</button></div><p class="hint" data-student-status role="status" aria-live="polite">${escape(f.ready)}</p><section data-student-result aria-live="polite" hidden></section><p class="source-links">${escape(f.sourcesHeading)}: <a href="https://lanekassen.no/nb-NO/stipend-og-lan/omgjoring-av-basislan/" target="_blank" rel="noopener noreferrer">${escape(f.sourceConversion)}</a> · <a href="https://lanekassen.no/nb-NO/regelverk/tildeling/del3-kapittel12/slik-fungerer-omgjoring/" target="_blank" rel="noopener noreferrer">${escape(f.sourceFormula)}</a> · <a href="https://lanekassen.no/nb-NO/hjelp-og-kontakt/tre-ting-du-ma-vite-om-stipend-og-lan-for-2026-2027/" target="_blank" rel="noopener noreferrer">${escape(f.sourceStudyYear)}</a> · <a href="https://lanekassen.no/nb-NO/stipend-og-lan/omgjoring-av-basislan/" target="_blank" rel="noopener noreferrer">${escape(f.officialCalculator)}</a></p></div>`;
}

function norwayBsuForm(copy) {
  const f = copy.fields;
  const number = (id, label, value, min = 0, max = 1000000000, step = 'any') => `<label class="field" for="bsu-${id}">${escape(label)}<input id="bsu-${id}" type="number" inputmode="decimal" min="${min}" max="${max}" step="${step}" value="${value}" ${value === '' ? '' : 'required'}></label>`;
  const check = (id, label) => `<label class="check"><input id="bsu-${id}" type="checkbox"> ${escape(label)}</label>`;
  return `<div class="norway-bsu-tool" data-bsu-tool><p class="hint">${escape(f.scope)}</p><div class="fields">${number('age', f.age, '')}${number('prior-deposits', f.priorDeposits, '')}${number('already-deposited', f.alreadyDeposited, '')}${number('planned-deposit', f.plannedDeposit, '')}${number('tax-capacity', f.taxCapacity, '')}${number('account-balance', f.accountBalance, '')}</div><div class="fields">${check('owns-home', f.ownsHome)}${check('withdrawal', f.withdrawal)}${check('eligible-account', f.eligibleAccount)}</div><h3>${escape(f.savingsHeading)}</h3><div class="fields">${number('ordinary-balance', f.ordinaryBalance, '')}${number('projection-years', f.projectionYears, '', 0, 50, 1)}${number('bsu-rate', f.bsuRate, '', 0, 100)}${number('ordinary-rate', f.ordinaryRate, '', 0, 100)}</div><p class="hint">${escape(f.comparisonHelp)}</p><div class="actions"><button type="button" class="primary" data-bsu-calculate>${escape(f.calculate)}</button><button type="button" data-bsu-clear>${escape(f.clear)}</button></div><p class="hint" data-bsu-status role="status" aria-live="polite">${escape(f.ready)}</p><section data-bsu-result aria-live="polite" hidden></section><p class="source-links">${escape(f.sourcesHeading)}: <a href="https://www.skatteetaten.no/en/Rates/Deduction-for-young-peoples-housing-savings-BSU/" target="_blank" rel="noopener noreferrer">${escape(f.sourceRates)}</a> · <a href="https://www.skatteetaten.no/en/person/taxes/get-the-taxes-right/bank-and-loans/bsu/" target="_blank" rel="noopener noreferrer">${escape(f.sourceRules)}</a> · <a href="https://www.regjeringen.no/no/tema/okonomi-og-budsjett/skatter-og-avgifter/skatte-og-avgiftssatser/skattesatser-2026/id3121978/" target="_blank" rel="noopener noreferrer">${escape(f.sourceTaxRates)}</a> · <a href="https://www.skatteetaten.no/en/person/taxes/get-the-taxes-right/bank-and-loans/bsu/" target="_blank" rel="noopener noreferrer">${escape(f.officialPage)}</a></p></div>`;
}

function norwayCommutingDeductionForm(copy) {
  const f = copy.fields;
  const field = (id, label, min, max, step = 'any') => `<label class="field" for="commuting-${id}">${escape(label)}<input id="commuting-${id}" type="number" inputmode="decimal" min="${min}" max="${max}" step="${step}" required></label>`;
  return `<div class="norway-commuting-deduction-tool" data-commuting-deduction-tool><p class="hint">${escape(f.scope)}</p><div class="fields">${field('distance', f.distance, 0, 10000)}${field('days', f.days, 0, 366, 1)}${field('home-office-days', f.homeOfficeDays, 0, 366, 1)}${field('tax-rate', f.taxRate, 0, 100)}</div><p class="hint">${escape(f.taxRateHelp)}</p><div class="actions"><button type="button" class="primary" data-commuting-calculate>${escape(f.calculate)}</button><button type="button" data-commuting-clear>${escape(f.clear)}</button></div><p class="hint" data-commuting-status role="status" aria-live="polite">${escape(f.ready)}</p><section data-commuting-result aria-live="polite" hidden></section><p class="source-links">${escape(f.sourcesHeading)}: <a href="https://www.skatteetaten.no/nn/tabellar-og-satsar/fradrag-for-reiser-mellom-hjem-og-arbeid/" target="_blank" rel="noopener noreferrer">${escape(f.sourceRates)}</a> · <a href="https://www.skatteetaten.no/en/rettskilder/type/handboker/skatte-abc/gjeldende/r-8-reise-mellom-hjem-og-fast-arbeidssted-arbeidsreiser/R-8.015/R-8.016/" target="_blank" rel="noopener noreferrer">${escape(f.sourceRules)}</a> · <a href="https://www.skatteetaten.no/rettskilder/type/uttalelser/uttalelser/forskuddsutskrivingen-2026/" target="_blank" rel="noopener noreferrer">${escape(f.source2026)}</a></p></div>`;
}

function norwayMileageReimbursementForm(copy) {
  const f = copy.fields;
  return `<div class="norway-mileage-reimbursement-tool" data-mileage-tool><p class="hint">${escape(f.scope)}</p><h3>${escape(f.tripHeading)}</h3><div data-mileage-trips></div><div class="actions"><button type="button" data-mileage-add>${escape(f.addTrip)}</button><button type="button" class="primary" data-mileage-calculate>${escape(f.calculate)}</button><button type="button" data-mileage-clear>${escape(f.clear)}</button></div><label class="field" for="mileage-tax-rate">${escape(f.taxRate)}<input id="mileage-tax-rate" type="number" inputmode="decimal" min="0" max="100" step="any"></label><p class="hint">${escape(f.taxRateHelp)}</p><div class="actions"><button type="button" data-mileage-csv>${escape(f.exportCsv)}</button><button type="button" data-mileage-print>${escape(f.print)}</button></div><p class="hint" data-mileage-status role="status" aria-live="polite">${escape(f.ready)}</p><section data-mileage-result aria-live="polite" hidden></section><p class="source-links">${escape(f.sourceHeading)}: <a href="https://www.skatteetaten.no/en/Rates/Car-allowance-distance-based-allowance/" target="_blank" rel="noopener noreferrer">${escape(f.sourceTax)}</a> · <a href="https://www.regjeringen.no/no/dokumenter/saravtale-om-dekning-av-utgifter-til-reise-og-kost-innenlands/id3083006/" target="_blank" rel="noopener noreferrer">${escape(f.sourceGovernment)}</a></p></div>`;
}

function latePaymentInterestForm(copy) {
  const f = copy.fields;
  return `<div class="late-payment-interest-tool" data-late-interest-tool><p class="hint">${escape(f.scope)}</p><div class="fields"><label class="field" for="late-principal">${escape(f.principal)}<input id="late-principal" type="number" inputmode="decimal" min="0.01" step="any" required></label><label class="field" for="late-currency">${escape(f.currency)}<input id="late-currency" type="text" inputmode="text" autocomplete="off" maxlength="3" minlength="3" value="NOK" required></label><label class="field" for="late-due-date">${escape(f.dueDate)}<input id="late-due-date" type="date" required></label><label class="field" for="late-start-date">${escape(f.startDate)}<input id="late-start-date" type="date" required></label><label class="field" for="late-end-date">${escape(f.endDate)}<input id="late-end-date" type="date" required></label></div><label class="field" for="late-rate-profile">${escape(f.rateProfile)}<select id="late-rate-profile"><option value="norway2026">${escape(f.norwayProfile)}</option><option value="custom">${escape(f.customProfile)}</option></select></label><h3>${escape(f.rateHeading)}</h3><div data-late-rates></div><button type="button" data-late-add-rate>${escape(f.addRate)}</button><h3>${escape(f.paymentHeading)}</h3><div data-late-payments></div><button type="button" data-late-add-payment>${escape(f.addPayment)}</button><div class="actions"><button type="button" class="primary" data-late-calculate>${escape(f.calculate)}</button><button type="button" data-late-clear>${escape(f.clear)}</button><button type="button" data-late-export>${escape(f.exportCsv)}</button></div><p class="hint" data-late-status role="status" aria-live="polite">${escape(f.ready)}</p><section data-late-result aria-live="polite" hidden></section><p class="source-links">${escape(f.sourcesHeading)}: <a href="https://www.finanstilsynet.no/analyser-og-statistikk/forsinkelsesrente-og-standardkompensasjon/forsinkelsesrente/" target="_blank" rel="noopener noreferrer">${escape(f.sourceNorway)}</a> · <a href="https://www.regjeringen.no/no/dokumenter/forsinkelsesrenteloven/id429519/" target="_blank" rel="noopener noreferrer">${escape(f.sourceLaw)}</a></p></div>`;
}

function norwayImportCostForm(copy) {
  const f = copy.fields;
  const number = (id, label, min, max = 1e12, value = '') => `<label class="field" for="import-${id}">${escape(label)}<input id="import-${id}" type="number" inputmode="decimal" min="${min}" max="${max}" step="any" value="${value}" required></label>`;
  return `<div class="norway-import-cost-tool" data-import-cost-tool><p class="hint">${escape(f.scope)}</p><div class="fields"><label class="field" for="import-currency">${escape(f.currency)}<input id="import-currency" type="text" maxlength="3" minlength="3" value="NOK" required></label>${number('exchange-rate', f.exchangeRate, 0.00000001, 1000000000, 1)}${number('purchase-price', f.purchasePrice, 0)}${number('shipping', f.shipping, 0)}${number('insurance', f.insurance, 0)}${number('other-taxes', f.otherTaxes, 0, 1e12, 0)}${number('carrier-fee', f.carrierFee, 0, 1e12, 0)}${number('duty-rate', f.dutyRate, 0, 1000)}${number('vat-rate', f.vatRate, 0, 100, 25)}</div><p class="hint">${escape(f.dutyHelp)}</p><p class="hint">${escape(f.vatHelp)}</p><div class="fields"><label class="check"><input id="import-voec-checkout" type="checkbox"> ${escape(f.voecAtCheckout)}</label><label class="check"><input id="import-voec-eligible" type="checkbox"> ${escape(f.voecEligible)}</label></div><div class="actions"><button type="button" class="primary" data-import-calculate>${escape(f.calculate)}</button><button type="button" data-import-clear>${escape(f.clear)}</button></div><p class="hint" data-import-status role="status" aria-live="polite">${escape(f.ready)}</p><section data-import-result aria-live="polite" hidden></section><p class="source-links">${escape(f.sourcesHeading)}: <a href="https://www.toll.no/en/online-shopping/calculation-norwegian-vat" target="_blank" rel="noopener noreferrer">${escape(f.sourceCalculation)}</a> · <a href="https://www.skatteetaten.no/en/business-and-organisation/vat-and-duties/vat/foreign/e-commerce-voec/sending-goods-under-the-voec-scheme/" target="_blank" rel="noopener noreferrer">${escape(f.sourceVoec)}</a> · <a href="https://www.toll.no/en/online-shopping/shopping-from-online-shops-not-registered-in-the-voec-scheme" target="_blank" rel="noopener noreferrer">${escape(f.sourceCustoms)}</a></p></div>`;
}

function norwayCarImportCostForm(copy) {
  const f = copy.fields;
  const number = (id, label, min = 0, max = 1e12, value = '') => `<label class="field" for="car-import-${id}">${escape(label)}<input id="car-import-${id}" type="number" inputmode="decimal" min="${min}" max="${max}" step="any" value="${value}" ${value === '' ? '' : 'required'}></label>`;
  return `<div class="norway-car-import-cost-tool" data-car-import-tool><p class="hint">${escape(f.scope)}</p><div class="fields"><label class="field" for="car-import-currency">${escape(f.currency)}<input id="car-import-currency" type="text" maxlength="3" minlength="3" value="NOK" required></label>${number('exchange-rate', f.exchangeRate, 0.00000001, 1000000000, 1)}${number('purchase-price', f.purchasePrice, 0)}${number('shipping', f.shipping, 0, 1e12, 0)}${number('insurance', f.insurance, 0, 1e12, 0)}${number('vat-rate', f.vatRate, 0, 100, 25)}${number('one-off-tax', f.oneOffTax)}${number('scrap-tax', f.scrapTax, 0, 1e12, 2400)}${number('greenhouse-tax', f.greenhouseTax, 0, 1e12, 0)}${number('other-fees', f.otherFees, 0, 1e12, 0)}${number('local-price', f.localPrice, 0, 1e12, '')}</div><p class="hint">${escape(f.vatHelp)}</p><p class="hint">${escape(f.oneOffHelp)}</p><div class="actions"><button type="button" class="primary" data-car-import-calculate>${escape(f.calculate)}</button><button type="button" data-car-import-clear>${escape(f.clear)}</button></div><p class="hint" data-car-import-status role="status" aria-live="polite">${escape(f.ready)}</p><section data-car-import-result aria-live="polite" hidden></section><p class="source-links">${escape(f.sourcesHeading)}: <a href="https://www.skatteetaten.no/en/person/duties/cars-and-other-vehicles/importing/" target="_blank" rel="noopener noreferrer">${escape(f.sourceImport)}</a> · <a href="https://www.skatteetaten.no/en/person/duties/cars-and-other-vehicles/importing/other-taxes/" target="_blank" rel="noopener noreferrer">${escape(f.sourceOtherTaxes)}</a> · <a href="https://www.skatteetaten.no/en/person/duties/cars-and-other-vehicles/importing/one-off-registration-tax/" target="_blank" rel="noopener noreferrer">${escape(f.sourceOneOffTax)}</a></p></div>`;
}

function norwayTollCostForm(copy) {
  const f = copy.fields;
  const small = (id, label, type = 'text', extra = '') => `<label class="field" for="${id}">${escape(label)}<input id="${id}" type="${type}" ${extra}></label>`;
  return `<div class="norway-toll-cost-tool" data-norway-toll-tool>
    <p class="hint" data-toll-scope>${escape(f.scope)}</p>
    <section aria-labelledby="toll-gpx-heading"><h3 id="toll-gpx-heading">${escape(f.gpxHeading)}</h3><p class="hint">${escape(f.gpxHelp)}</p><div class="fields">${small('toll-gpx-file', f.gpxFile, 'file', 'accept=".gpx,application/gpx+xml,application/xml,text/xml"') }<button type="button" data-toll-match>${escape(f.matchRoute)}</button></div><button type="button" data-toll-refresh>${escape(f.refreshData)}</button><p class="hint">${escape(f.refreshHelp)}</p><p class="hint" role="status" aria-live="polite" data-toll-route-status>${escape(f.ready)}</p></section>
    <section aria-labelledby="toll-search-heading"><h3 id="toll-search-heading">${escape(f.stationSearch)}</h3><div class="fields"><label class="field" for="toll-station-search">${escape(f.stationSearch)}<input id="toll-station-search" type="search" autocomplete="off" maxlength="100"></label><label class="field" for="toll-station-choice">${escape(f.stationChoice)}<select id="toll-station-choice"><option value="">${escape(f.noStation)}</option></select></label><button type="button" data-toll-add-station>${escape(f.addStation)}</button></div></section>
    <section aria-labelledby="toll-candidates-heading"><h3 id="toll-candidates-heading">${escape(f.candidateHeading)}</h3><div data-toll-candidates aria-live="polite"></div></section>
    <section aria-labelledby="toll-passes-heading"><h3 id="toll-passes-heading">${escape(f.selectedHeading)}</h3><div data-toll-passes aria-live="polite"><p class="hint">${escape(f.noPasses)}</p></div></section>
    <section aria-label="${escape(f.vehicle)}"><div class="fields"><label class="field" for="toll-vehicle">${escape(f.vehicle)}<select id="toll-vehicle"><option value="small">${escape(f.small)}</option><option value="large">${escape(f.large)}</option><option value="electric-small">${escape(f.electricSmall)}</option></select></label>${small('toll-discount', f.discount, 'number', 'min="0" max="100" step="any" value="0"')}<p class="hint">${escape(f.discountHelp)}</p></div></section>
    <div class="actions"><button type="button" class="primary" data-toll-calculate>${escape(f.calculate)}</button><button type="button" data-toll-clear>${escape(f.clear)}</button><button type="button" data-toll-export disabled>${escape(copy.actions.exportCsv)}</button></div>
    <p class="hint" role="status" aria-live="polite" data-toll-status>${escape(f.ready)}</p>
    <section data-toll-result class="result" aria-live="polite" hidden></section>
    <p class="source-links">${escape(f.sourceHeading)}: <a href="https://data.norge.no/nb/datasets/2ef6845c-7e58-3d9e-ad38-1a996e41d9bc/bomstasjoner-i-nvdb" target="_blank" rel="noopener noreferrer">${escape(f.sourceDataset)}</a> · <a href="https://data.norge.no/nlod/no" target="_blank" rel="noopener noreferrer">${escape(f.sourceLicense)}</a> · <a href="https://www.autopass.no/en/user/rates-and-discounts/" target="_blank" rel="noopener noreferrer">${escape(f.sourceAutoPass)}</a> · <a href="https://www.autopass.no/en" target="_blank" rel="noopener noreferrer">${escape(f.sourceMap)}</a></p><p class="hint">${escape(f.attribution)}</p>
  </div>`;
}

function norwayPropertyTransferForm(copy) {
  const f = copy.fields;
  const value = (id, label, initial = '', min = '0', max = '1000000000000', step = '1') => `<label class="field" for="property-transfer-${id}">${escape(label)}<input id="property-transfer-${id}" type="number" inputmode="decimal" min="${min}" max="${max}" step="${step}" value="${initial}" required></label>`;
  return `<div class="norway-property-transfer-tool" data-property-transfer-tool>
    <p class="hint">${escape(f.scope)}</p>
    <div class="fields">${value('market-value', f.propertyValue)}${value('share', f.share, '100', '0.01', '100', 'any')}</div>
    <label class="field" for="property-transfer-title-type">${escape(f.titleType)}<select id="property-transfer-title-type"><option value="property-title">${escape(f.propertyTitle)}</option><option value="housing-cooperative">${escape(f.housingCooperative)}</option></select></label>
    <label class="check"><input id="property-transfer-exemption" type="checkbox"> ${escape(f.exemption)}</label><p class="hint">${escape(f.exemptionHelp)}</p>
    <div class="fields">${value('registration-fee', f.registrationFee, '545', '0', '10000000')}${value('documents', f.documents, '1', '1', '100')}</div>
    <p class="hint">${escape(f.assumptions)}</p>
    <div class="actions"><button type="button" class="primary" data-property-transfer-calculate>${escape(f.calculate)}</button><button type="button" data-property-transfer-clear>${escape(f.clear)}</button><button type="button" data-property-transfer-export>${escape(f.export)}</button><button type="button" data-property-transfer-print>${escape(f.print)}</button></div>
    <p class="hint" data-property-transfer-status role="status" aria-live="polite">${escape(f.ready)}</p><section data-property-transfer-result aria-live="polite" hidden></section>
    <p class="source-links">${escape(f.sourceHeading)}: <a href="https://lovdata.no/dokument/STV/forskrift/2025-12-18-2777/%C2%A71" target="_blank" rel="noopener noreferrer">${escape(f.sourceRates)}</a> · <a href="https://www.kartverket.no/eiendom/dokumentavgift-og-gebyr/tinglysingsgebyr" target="_blank" rel="noopener noreferrer">${escape(f.sourceFees)}</a> · <a href="https://www.kartverket.no/en/property/borettslag/transfer-of-unit-in-a-housing-cooperative" target="_blank" rel="noopener noreferrer">${escape(f.sourceCooperative)}</a> · <a href="https://www.kartverket.no/eiendom/dokumentavgift-og-gebyr/fritak-for-dokumentavgift" target="_blank" rel="noopener noreferrer">${escape(f.sourceExemptions)}</a> · <a href="https://www.kartverket.no/en/property/transfer-of-property" target="_blank" rel="noopener noreferrer">${escape(f.sourcePropertyValue)}</a></p>
  </div>`;
}

function norwayElectricitySupportForm(copy) {
  const f = copy.fields;
  const number = (id, label, value = '0', max = 1000) => `<label class="field" for="electricity-${id}">${escape(label)}<input id="electricity-${id}" type="number" inputmode="decimal" min="0" max="${max}" step="any" value="${value}" required></label>`;
  return `<div class="norway-electricity-support-tool" data-electricity-support-tool>
    <p class="hint">${escape(f.scope)}</p>
    <section aria-labelledby="electricity-csv-heading"><h3 id="electricity-csv-heading">${escape(f.csvHeading)}</h3><p class="hint">${escape(f.csvHelp)}</p><div class="fields"><label class="field" for="electricity-csv">${escape(f.file)}<input id="electricity-csv" type="file" accept=".csv,text/csv"></label><button type="button" data-electricity-template>${escape(f.template)}</button></div><p class="hint" data-electricity-file-status role="status" aria-live="polite">${escape(f.ready)}</p></section>
    <div class="fields"><label class="field" for="electricity-meter-type">${escape(f.meterType)}<select id="electricity-meter-type"><option value="household">${escape(f.household)}</option><option value="holiday-home">${escape(f.holidayHome)}</option></select></label><label class="field" for="electricity-price-area">${escape(f.priceArea)}<select id="electricity-price-area"><option value="NO1">${escape(f.no1)}</option><option value="NO2">${escape(f.no2)}</option><option value="NO3">${escape(f.no3)}</option><option value="NO4">${escape(f.no4)}</option><option value="NO5">${escape(f.no5)}</option></select></label><label class="field" for="electricity-vat">${escape(f.vat)}<select id="electricity-vat"><option value="25">${escape(f.vat25)}</option><option value="0">${escape(f.vat0)}</option></select></label></div>
    <p class="hint">${escape(f.extraHelp)}</p><div class="fields">${number('network-variable', f.networkVariable, '0', 100)}${number('network-fixed', f.networkFixed, '0', 10000000)}${number('other-variable', f.otherVariable, '0', 100)}${number('other-fixed', f.otherFixed, '0', 10000000)}</div>
    <div class="actions"><button type="button" class="primary" data-electricity-calculate>${escape(f.calculate)}</button><button type="button" data-electricity-clear>${escape(f.clear)}</button><button type="button" data-electricity-export>${escape(f.export)}</button><button type="button" data-electricity-print>${escape(f.print)}</button></div>
    <p class="hint" data-electricity-status role="status" aria-live="polite">${escape(f.ready)}</p><section data-electricity-result aria-live="polite" hidden></section>
    <p class="source-links">${escape(f.sourceHeading)}: <a href="https://www.nve.no/reguleringsmyndigheten/kunde/stroem/dette-er-stroemstoetteordningen/" target="_blank" rel="noopener noreferrer">${escape(f.sourceSupport)}</a> · <a href="https://www.nve.no/reguleringsmyndigheten/kunde/stroem/dette-er-norgespris/" target="_blank" rel="noopener noreferrer">${escape(f.sourceNorgespris)}</a> · <a href="https://www.nve.no/reguleringsmyndigheten/kunde/stroem/dette-er-norgespris/boer-jeg-velge-norgespris/" target="_blank" rel="noopener noreferrer">${escape(f.sourceThreshold)}</a></p>
  </div>`;
}

function beadPatternForm(copy) {
  const f = copy.fields;
  return `<div class="bead-pattern-tool" data-bead-pattern-tool>
    <p class="hint">${escape(f.scope)}</p>
    <label class="field" for="bead-pattern-image">${escape(f.imageFile)}<input id="bead-pattern-image" type="file" accept="image/png,image/jpeg,image/webp"></label>
    <p class="hint">${escape(f.imageHelp)}</p>
    <div class="fields">
      <label class="field" for="bead-pattern-columns">${escape(f.columns)}<input id="bead-pattern-columns" type="number" inputmode="numeric" min="1" max="80" step="1" value="40" required></label>
      <label class="field" for="bead-pattern-rows">${escape(f.rows)}<input id="bead-pattern-rows" type="number" inputmode="numeric" min="0" max="125" step="1" value="0" required></label>
      <label class="field" for="bead-pattern-palette">${escape(f.paletteSize)}<input id="bead-pattern-palette" type="number" inputmode="numeric" min="1" max="24" step="1" value="12" required></label>
      <label class="field" for="bead-pattern-craft">${escape(f.craftType)}<select id="bead-pattern-craft"><option value="beads">${escape(f.beads)}</option><option value="cross-stitch">${escape(f.crossStitch)}</option></select></label>
    </div>
    <div class="fields"><label class="check"><input id="bead-pattern-dither" type="checkbox"> ${escape(f.dither)}</label><label class="check"><input id="bead-pattern-transparency" type="checkbox"> ${escape(f.preserveTransparency)}</label></div>
    <div class="actions"><button type="button" class="primary" data-bead-generate>${escape(f.generate)}</button><button type="button" data-bead-clear>${escape(f.clear)}</button></div>
    <p class="hint" data-bead-status role="status" aria-live="polite">${escape(f.ready)}</p>
    <section class="bead-pattern-output" data-bead-output hidden><h3 data-bead-title></h3><p data-bead-summary></p><h4>${escape(f.gridHeading)}</h4><p class="hint">${escape(f.gridHelp)}</p><div class="bead-pattern-scroll"><div class="bead-pattern-grid" data-bead-grid role="grid" aria-label="${escape(f.gridHeading)}"></div></div><h4>${escape(f.legendHeading)}</h4><div class="bead-legend-scroll"><table class="bead-pattern-legend"><thead><tr><th scope="col">${escape(f.symbol)}</th><th scope="col">${escape(f.color)}</th><th scope="col">${escape(f.count)}</th></tr></thead><tbody data-bead-legend></tbody></table></div><div class="actions"><button type="button" data-bead-svg>${escape(f.exportSvg)}</button><button type="button" data-bead-png>${escape(f.exportPng)}</button><button type="button" data-bead-csv>${escape(f.exportCsv)}</button><button type="button" data-bead-print>${escape(f.print)}</button></div></section>
  </div>`;
}

function codebreakerForm(copy) {
  const f = copy.fields;
  return `<div class="codebreaker-tool" data-codebreaker-tool>
    <p class="hint">${escape(f.scope)}</p>
    <div class="fields"><label class="field" for="codebreaker-mode">${escape(f.mode)}<select id="codebreaker-mode"><option value="daily">${escape(f.daily)}</option><option value="practice" selected>${escape(f.practice)}</option></select></label></div>
    <fieldset data-codebreaker-setup><legend>${escape(f.setupHeading)}</legend>
      <div class="fields" data-codebreaker-config>
        <label class="field" for="codebreaker-difficulty">${escape(f.difficulty)}<select id="codebreaker-difficulty"><option value="relaxed">${escape(f.relaxed)}</option><option value="standard" selected>${escape(f.standard)}</option><option value="challenge">${escape(f.challenge)}</option></select></label>
        <label class="field" for="codebreaker-length">${escape(f.length)}<select id="codebreaker-length"><option value="3">3</option><option value="4" selected>4</option><option value="5">5</option><option value="6">6</option></select></label>
        <label class="field" for="codebreaker-symbol-count">${escape(f.symbolCount)}<select id="codebreaker-symbol-count"><option value="4">4</option><option value="6" selected>6</option><option value="8">8</option><option value="10">10</option></select></label>
        <label class="check"><input id="codebreaker-duplicates" type="checkbox" checked> ${escape(f.duplicates)}</label>
      </div>
    </fieldset>
    <p class="hint" data-codebreaker-date-line hidden>${escape(f.dateLabel)}: <time data-codebreaker-date></time> · ${escape(f.standard)}</p>
    <div class="actions"><button type="button" class="primary" data-codebreaker-start>${escape(f.newGame)}</button></div>
    <p class="hint">${escape(f.tutorialTitle)}: ${escape(f.tutorial)}</p>
    <section data-codebreaker-controls hidden>
      <h3>${escape(f.guessHeading)}</h3><div class="fields" data-codebreaker-current></div>
      <div class="actions"><button type="button" class="primary" data-codebreaker-guess disabled>${escape(f.guess)}</button><button type="button" data-codebreaker-clear>${escape(f.clear)}</button></div>
      <p role="status" aria-live="polite" data-codebreaker-status>${escape(f.ready)}</p>
      <p class="hint" data-codebreaker-attempts></p>
      <h3>${escape(f.legendHeading)}</h3><div class="table-scroll"><table><thead><tr><th scope="col">${escape(f.symbol)}</th><th scope="col">${escape(f.color)}</th></tr></thead><tbody data-codebreaker-legend></tbody></table></div>
      <h3>${escape(f.historyHeading)}</h3><ol class="codebreaker-history" data-codebreaker-history><li>${escape(f.historyEmpty)}</li></ol>
    </section>
  </div>`;
}

function shoeSizeForm(copy) {
  const f = copy.fields;
  const units = (id, label) => `<label class="field" for="${id}">${escape(label)}<select id="${id}"><option value="mm">${escape(f.mm)}</option><option value="cm" selected>${escape(f.cm)}</option><option value="in">${escape(f.inches)}</option></select></label>`;
  return `<div class="shoe-size-tool" data-shoe-size-tool>
    <p class="hint">${escape(f.scope)}</p>
    <div class="fields"><label class="field" for="shoe-left">${escape(f.left)}<input id="shoe-left" type="number" inputmode="decimal" min="0.1" max="400" step="any" required></label><label class="field" for="shoe-right">${escape(f.right)}<input id="shoe-right" type="number" inputmode="decimal" min="0.1" max="400" step="any" required></label>${units('shoe-unit', f.unit)}</div>
    <fieldset><legend>${escape(f.chartHeading)}</legend>
      <div class="fields"><label class="field" for="shoe-chart-label">${escape(f.chartLabel)}<input id="shoe-chart-label" maxlength="80"></label><label class="field" for="shoe-chart-date">${escape(f.chartDate)}<input id="shoe-chart-date" type="month"></label>${units('shoe-chart-unit', f.chartUnit)}<label class="field" for="shoe-chart-basis">${escape(f.chartBasis)}<select id="shoe-chart-basis"><option value="foot">${escape(f.footBasis)}</option><option value="inside">${escape(f.insideBasis)}</option></select></label></div>
      <label class="field" for="shoe-chart">${escape(f.chartHeading)}<textarea id="shoe-chart" rows="6" maxlength="20000" placeholder="Size; foot length&#10;Size 39; 250&#10;Size 40; 258"></textarea></label><p class="hint">${escape(f.chartHelp)}</p>
      <div class="fields"><label class="field" for="shoe-allowance">${escape(f.allowance)}<input id="shoe-allowance" type="number" inputmode="numeric" min="0" max="30" step="1" value="10"></label><p class="hint">${escape(f.allowanceHelp)}</p></div>
    </fieldset>
    <div class="actions"><button type="button" class="primary" data-shoe-calculate>${escape(f.calculate)}</button><button type="button" data-shoe-download>${escape(f.download)}</button><button type="button" data-shoe-print>${escape(f.print)}</button></div>
    <p class="hint" role="status" aria-live="polite" data-shoe-status>${escape(f.ready)}</p>
    <section data-shoe-output hidden><h3>${escape(f.resultHeading)}</h3><div data-shoe-result></div></section>
    <p class="hint">${escape(f.sourceNote)}</p><p class="source-links">${escape(f.source)}: <a href="https://www.iso.org/standard/71594.html" target="_blank" rel="noopener noreferrer">${escape(f.sourceMondopoint)}</a> · <a href="https://committee.iso.org/standard/83106.html?browse=tc" target="_blank" rel="noopener noreferrer">${escape(f.sourceConversion)}</a></p>
  </div>`;
}

function childGrowthForm(copy) {
  const f = copy.fields;
  return `<div class="child-growth-tool" data-child-growth-tool>
    <fieldset><legend>${escape(f.reference)}</legend><p class="growth-reference-name">${escape(f.referenceOption)}</p><label class="check"><input type="checkbox" data-growth-ack> ${escape(f.acknowledgement)}</label></fieldset>
    <div class="fields">
      <label class="field" for="growth-sex">${escape(f.sex)}<select id="growth-sex" required><option value="" selected disabled>${escape(f.chooseSex)}</option><option value="female">${escape(f.female)}</option><option value="male">${escape(f.male)}</option></select></label>
      <label class="field" for="growth-birth">${escape(f.birthDate)}<input id="growth-birth" type="date" required></label>
      <label class="field" for="growth-date">${escape(f.measurementDate)}<input id="growth-date" type="date" required></label>
      <label class="field" for="growth-height">${escape(f.height)}<input id="growth-height" type="number" inputmode="decimal" min="60" max="230" step="0.1" required></label>
      <label class="field" for="growth-weight">${escape(f.weight)}<input id="growth-weight" type="number" inputmode="decimal" min="5" max="250" step="0.1" required></label>
    </div>
    <div class="actions"><button type="button" class="primary" data-growth-add disabled>${escape(f.add)}</button><button type="button" data-growth-clear>${escape(f.clear)}</button><button type="button" data-growth-csv>${escape(f.export)}</button><button type="button" data-growth-print>${escape(f.print)}</button></div>
    <p role="status" aria-live="polite" data-growth-status>${escape(f.ready)}</p>
    <section data-growth-results hidden><h3>${escape(f.chartHeading)}</h3><p class="hint">${escape(f.chartHelp)}</p><div class="growth-chart-scroll"><svg data-growth-chart role="img" aria-label="${escape(f.chartHeading)}" viewBox="0 0 640 280" preserveAspectRatio="xMidYMid meet"></svg></div><h3>${escape(f.history)}</h3><div class="table-scroll"><table><thead><tr><th scope="col">${escape(f.date)}</th><th scope="col">${escape(f.age)}</th><th scope="col">${escape(f.heightPercentile)}</th><th scope="col">${escape(f.weightPercentile)}</th><th scope="col">${escape(f.bmi)}</th><th scope="col">${escape(f.bmiPercentile)}</th><th scope="col"></th></tr></thead><tbody data-growth-history></tbody></table></div><p class="hint" data-growth-warning hidden>${escape(f.aboveRange)}</p></section>
    <p class="source-links"><strong>${escape(f.sourceHeading)}:</strong> <a href="https://www.cdc.gov/growthcharts/cdc-data-files.htm" target="_blank" rel="noopener noreferrer">${escape(f.sourceName)}</a> · <a href="https://www.cdc.gov/growthcharts/extended-bmi-data-files.htm" target="_blank" rel="noopener noreferrer">${escape(f.sourceExtended)}</a> · <a href="https://www.cdc.gov/growth-chart-training/hcp/using-growth-charts/recommendations-and-rationale.html" target="_blank" rel="noopener noreferrer">${escape(f.sourceRecommendation)}</a> · <a href="https://www.cdc.gov/other/agencymaterials.html" target="_blank" rel="noopener noreferrer">${escape(f.sourceReuse)}</a></p><p class="hint">${escape(f.sourceDate)}: ${escape(childGrowthSource.retrievedAt)}</p><p class="hint">${escape(f.sourceTerms)}</p><p class="hint">${escape(f.disclaimer)}</p>
  </div>`;
}

function ringSizeForm(copy) {
  const f = copy.fields;
  const unitOptions = [['mm', f.millimetres], ['cm', f.centimetres], ['in', f.inches]].map(([value, text]) => `<option value="${value}"${value === 'mm' ? ' selected' : ''}>${escape(text)}</option>`).join('');
  return `<div class="ring-size-tool" data-ring-size-tool>
    <p class="hint">${escape(f.scope)}</p>
    <div class="fields"><label class="field" for="ring-basis">${escape(f.measurement)}<select id="ring-basis"><option value="circumference">${escape(f.circumference)}</option><option value="diameter">${escape(f.diameter)}</option></select></label><label class="field" for="ring-value">${escape(f.value)}<input id="ring-value" type="number" inputmode="decimal" min="0.1" max="400" step="any" required></label><label class="field" for="ring-unit">${escape(f.unit)}<select id="ring-unit">${unitOptions}</select></label></div>
    <fieldset><legend>${escape(f.chartHeading)}</legend><div class="fields"><label class="field" for="ring-chart-label">${escape(f.chartLabel)}<input id="ring-chart-label" maxlength="80"></label><label class="field" for="ring-chart-date">${escape(f.chartDate)}<input id="ring-chart-date" type="month"></label><label class="field" for="ring-chart-unit">${escape(f.chartUnit)}<select id="ring-chart-unit">${unitOptions}</select></label><label class="field" for="ring-chart-basis">${escape(f.chartBasis)}<select id="ring-chart-basis"><option value="circumference">${escape(f.chartCircumference)}</option><option value="diameter">${escape(f.chartDiameter)}</option></select></label></div><label class="field" for="ring-chart">${escape(f.chartHeading)}<textarea id="ring-chart" rows="5" maxlength="12000" placeholder="Size 6; 16.5&#10;Size 7; 17.3"></textarea></label><p class="hint">${escape(f.chartHelp)}</p></fieldset>
    <div class="actions"><button type="button" class="primary" data-ring-calculate>${escape(f.calculate)}</button><button type="button" data-ring-export>${escape(f.export)}</button><button type="button" data-ring-print>${escape(f.print)}</button><button type="button" data-ring-clear>${escape(copy.actions.reset)}</button></div>
    <p role="status" aria-live="polite" data-ring-status>${escape(f.ready)}</p>
    <section data-ring-output hidden><h3>${escape(f.result)}</h3><div class="table-scroll"><table><tbody data-ring-result></tbody></table></div><figure class="ring-scale-check" data-ring-calibration hidden><svg viewBox="0 0 378 32" role="img" aria-label="${escape(f.calibration)}"><line x1="0" x2="378" y1="12" y2="12" stroke="currentColor" stroke-width="2"/><line x1="0" x2="0" y1="5" y2="20" stroke="currentColor"/><line x1="378" x2="378" y1="5" y2="20" stroke="currentColor"/><text x="189" y="30" text-anchor="middle" font-size="12">${escape(f.calibration)}</text></svg><figcaption>${escape(f.calibrationHelp)}</figcaption></figure></section>
    <p>${escape(copy.details)}</p><p class="source-links">${escape(f.source)}: <a href="https://committee.iso.org/standard/65408.html" target="_blank" rel="noopener noreferrer">${escape(f.sourceIso)}</a></p><p class="hint">${escape(f.sourceNote)}</p>
  </div>`;
}

function model3dViewerForm(copy) {
  const f = copy.fields;
  return `<div class="model3d-viewer" data-model3d-viewer>
    <label class="field" for="model3d-file">${escape(f.filesWithStep)}<input id="model3d-file" type="file" accept=".stl,.obj,.gltf,.glb,.step,.stp,model/stl,model/obj,model/gltf+json,model/gltf-binary"></label>
    <div class="fields" data-model3d-step-controls hidden><label class="field" for="model3d-step-unit">${escape(f.stepUnits)}<select id="model3d-step-unit" required><option value="" selected disabled>${escape(f.stepUnitRequired)}</option><option value="millimeter">${escape(f.stepMm)}</option><option value="centimeter">${escape(f.stepCm)}</option><option value="meter">${escape(f.stepM)}</option><option value="inch">${escape(f.stepIn)}</option><option value="foot">${escape(f.stepFt)}</option></select></label><button type="button" data-model3d-load-step disabled>${escape(f.stepLoad)}</button></div>
    <p class="hint" role="status" aria-live="polite" data-model3d-status>${escape(f.ready)}</p>
    <button type="button" data-model3d-cancel hidden>${escape(f.cancel)}</button>
    <div class="model3d-actions"><button type="button" data-model3d-fit disabled>${escape(f.resetView)}</button><button type="button" data-model3d-rotate="left" disabled>${escape(f.rotateLeft)}</button><button type="button" data-model3d-rotate="right" disabled>${escape(f.rotateRight)}</button><button type="button" data-model3d-rotate="up" disabled>${escape(f.rotateUp)}</button><button type="button" data-model3d-rotate="down" disabled>${escape(f.rotateDown)}</button><button type="button" data-model3d-zoom="in" disabled>${escape(f.zoomIn)}</button><button type="button" data-model3d-zoom="out" disabled>${escape(f.zoomOut)}</button><button type="button" data-model3d-screenshot disabled>${escape(f.screenshot)}</button><button type="button" data-model3d-clear disabled>${escape(f.clear)}</button></div>
    <div class="model3d-stage" data-model3d-stage tabindex="0" role="application" aria-label="${escape(copy.name)}"><p>${escape(f.ready)}</p></div>
    <section data-model3d-info hidden><h3>${escape(f.meshInfo)}</h3><dl data-model3d-metadata></dl><h4>${escape(f.supported)}</h4><ul class="model3d-formats"><li>STL · ${escape(f.supportedYes)}</li><li>OBJ · ${escape(f.supportedYes)}</li><li>glTF 2.0 (.gltf, .glb) · ${escape(f.supportedYes)}</li><li>STEP · ${escape(f.supportedYes)}</li></ul></section>
    <p class="hint">${escape(f.limits)}</p><p class="hint">${escape(f.unsupportedInfo)}</p>
    <details class="model3d-license"><summary>${escape(f.stepLicenseHeading)}</summary><p>${escape(f.stepLicenseNotice)}</p><p><a href="/assets/OCCT-IMPORT-JS-LGPL-2.1.txt" target="_blank" rel="noopener noreferrer">occt-import-js LGPL-2.1</a> · <a href="/assets/OCCT-LGPL-2.1.txt" target="_blank" rel="noopener noreferrer">${escape(f.stepLicenseOcct)}</a> · <a href="/assets/OCCT-LGPL-EXCEPTION-1.0.txt" target="_blank" rel="noopener noreferrer">${escape(f.stepLicenseException)}</a></p><p><a href="https://github.com/kovacsv/occt-import-js/tree/0.0.23" target="_blank" rel="noopener noreferrer">occt-import-js source 0.0.23</a> · <a href="https://github.com/Open-Cascade-SAS/OCCT/tree/V7_6_1" target="_blank" rel="noopener noreferrer">Open CASCADE source V7_6_1</a></p></details>
  </div>`;
}

function dxfViewerForm(copy) {
  const f = copy.fields;
  return `<div class="dxf-viewer" data-dxf-viewer>
    <label class="field" for="dxf-file">${escape(f.file)}<input id="dxf-file" type="file" accept=".dxf,application/dxf"></label>
    <p class="hint" role="status" aria-live="polite" data-dxf-status>${escape(f.ready)}</p>
    <button type="button" data-dxf-cancel hidden>${escape(f.cancel)}</button>
    <div class="dxf-actions"><button type="button" data-dxf-fit disabled>${escape(f.resetView)}</button><button type="button" data-dxf-zoom="in" disabled>${escape(f.zoomIn)}</button><button type="button" data-dxf-zoom="out" disabled>${escape(f.zoomOut)}</button><button type="button" data-dxf-measure disabled>${escape(f.measurement)}</button><button type="button" data-dxf-clear-measure hidden>${escape(f.clearMeasure)}</button><button type="button" data-dxf-svg disabled>${escape(f.exportSvg)}</button><button type="button" data-dxf-png disabled>${escape(f.exportPng)}</button><button type="button" data-dxf-clear disabled>${escape(f.clear)}</button></div>
    <p class="hint" data-dxf-measure-help hidden>${escape(f.measureHelp)}</p>
    <div class="dxf-stage" data-dxf-stage tabindex="0" role="application" aria-label="${escape(f.drawing)}"><p>${escape(f.ready)}</p></div>
    <section data-dxf-info hidden><h3>${escape(f.bounds)}</h3><dl data-dxf-metadata></dl><h3>${escape(f.layerHeading)}</h3><p data-dxf-no-layers hidden>${escape(f.noLayers)}</p><div class="dxf-layers" data-dxf-layers></div><h3>${escape(f.unsupportedEntities)}</h3><ul data-dxf-unsupported></ul><p class="hint">${escape(f.unsupportedNote)}</p><h3>${escape(f.measurement)}</h3><div class="fields"><label class="field" for="dxf-x1">${escape(f.firstX)}<input id="dxf-x1" type="number" step="any"></label><label class="field" for="dxf-y1">${escape(f.firstY)}<input id="dxf-y1" type="number" step="any"></label><label class="field" for="dxf-x2">${escape(f.secondX)}<input id="dxf-x2" type="number" step="any"></label><label class="field" for="dxf-y2">${escape(f.secondY)}<input id="dxf-y2" type="number" step="any"></label></div><button type="button" data-dxf-coordinate-measure>${escape(f.measureFromCoordinates)}</button><div data-dxf-measure-result role="status" aria-live="polite" hidden></div></section>
    <details class="dxf-license"><summary>${escape(f.licenseHeading)}</summary><p>${escape(f.licenseNotice)}</p><p><a href="/assets/DXF-PARSER-MIT-LICENSE.txt" target="_blank" rel="noopener noreferrer">dxf-parser · ${escape(f.licenseMit)}</a> · <a href="/assets/LOGLEVEL-MIT-LICENSE.txt" target="_blank" rel="noopener noreferrer">${escape(f.licenseLoglevel)}</a> · <a href="https://github.com/gdsestimating/dxf-parser/tree/4a164a1dcdbc7dbaae714fae9c2997157c1b5c13" target="_blank" rel="noopener noreferrer">dxf-parser 1.1.2 source</a></p></details>
  </div>`;
}

function bridgeGameForm(copy) {
  const f = copy.fields;
  const strains = ['clubs', 'diamonds', 'hearts', 'spades', 'notrump'];
  return `<div class="bridge-tool" data-bridge-game>
    <p class="hint">${escape(f.scope)}</p><fieldset class="bridge-settings"><legend>${escape(f.vulnerability)}</legend><label class="field" for="bridge-vulnerability">${escape(f.vulnerability)}<select id="bridge-vulnerability" data-bridge-vulnerability><option value="none">${escape(f.none)}</option><option value="ns">${escape(f.ns)}</option><option value="ew">${escape(f.ew)}</option><option value="both">${escape(f.both)}</option></select></label><button type="button" data-bridge-new>${escape(f.newHand)}</button><button type="button" data-bridge-export disabled>${escape(f.export)}</button></fieldset>
    <section class="bridge-system"><h3>${escape(f.systemHeading)}</h3><p>${escape(f.system)}</p><p>${escape(f.practiceNote)}</p></section>
    <p class="hint" data-bridge-status role="status" aria-live="polite">${escape(f.ready)}</p>
    <section class="bridge-board" data-bridge-board hidden><div class="bridge-summary"><p>${escape(f.hand)} <strong data-bridge-hand-number></strong> · ${escape(f.dealer)}: <strong data-bridge-dealer></strong></p><p>${escape(f.vulnerability)}: <strong data-bridge-vul></strong></p><p>${escape(f.contract)}: <strong data-bridge-contract>—</strong> · ${escape(f.declarer)}: <strong data-bridge-declarer>—</strong></p><p>${escape(f.nsSide)}: <strong data-bridge-ns-score></strong> · ${escape(f.ewSide)}: <strong data-bridge-ew-score></strong></p></div>
      <div class="bridge-table"><section class="bridge-seat" data-bridge-seat="0"><h4>${escape(f.north)}</h4><div data-bridge-hand></div></section><section class="bridge-seat" data-bridge-seat="1"><h4>${escape(f.east)}</h4><div data-bridge-hand></div></section><section class="bridge-seat bridge-seat-south" data-bridge-seat="2"><h4>${escape(f.south)}</h4><div data-bridge-hand></div></section><section class="bridge-seat" data-bridge-seat="3"><h4>${escape(f.west)}</h4><div data-bridge-hand></div></section></div>
      <p class="hint" data-bridge-dummy-note>${escape(f.dummyHidden)}</p><section><h3>${escape(f.trick)}</h3><div class="bridge-current-trick" data-bridge-trick></div></section>
      <section class="bridge-auction"><h3>${escape(f.auction)}</h3><ol data-bridge-auction></ol></section><p class="hint">${escape(f.tricksWon)}: ${escape(f.nsSide)} <strong data-bridge-tricks-ns>0</strong> · ${escape(f.ewSide)} <strong data-bridge-tricks-ew>0</strong></p>
      <section class="bridge-call-controls" data-bridge-call-controls><label class="field" for="bridge-level">${escape(f.level)}<select id="bridge-level" data-bridge-level>${Array.from({ length: 7 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}</select></label><label class="field" for="bridge-strain">${escape(f.strain)}<select id="bridge-strain" data-bridge-strain>${strains.map((strain, index) => `<option value="${index}">${escape(f[strain])}</option>`).join('')}</select></label><button type="button" class="primary" data-bridge-bid>${escape(f.bid)}</button><button type="button" data-bridge-pass>${escape(f.pass)}</button><button type="button" data-bridge-double>${escape(f.double)}</button><button type="button" data-bridge-redouble>${escape(f.redouble)}</button></section>
      <section class="bridge-result" data-bridge-result hidden><h3>${escape(f.boardResult)}</h3><p data-bridge-result-text></p><button type="button" data-bridge-next>${escape(f.nextHand)}</button></section>
    </section>
    <details class="bridge-rules"><summary>${escape(f.sourceHeading)}</summary><p>${escape(f.sourceWbf)}</p><p><a href="https://www.worldbridge.org/regulations/2017-laws-of-duplicate-bridge/" target="_blank" rel="noopener noreferrer">World Bridge Federation · Laws of Duplicate Bridge</a></p><p><a href="https://www.worldbridge.org/2023/12/changes-to-the-2017-laws-of-duplicate-bridge/" target="_blank" rel="noopener noreferrer">WBF amendments effective 2024</a></p></details>
  </div>`;
}

function farkleGameForm(copy) {
  const f = copy.fields;
  return `<div class="farkle-tool" data-farkle-game>
    <p class="hint">${escape(f.scope)}</p>
    <fieldset class="farkle-settings"><legend>${escape(f.settings)}</legend>
      <label class="field" for="farkle-mode">${escape(f.mode)}<select id="farkle-mode" data-farkle-mode><option value="cpu">${escape(f.againstCpu)}</option><option value="practice">${escape(f.practice)}</option></select></label>
      <label class="field" for="farkle-opponents">${escape(f.opponents)}<select id="farkle-opponents" data-farkle-opponents><option value="1">${escape(f.oneCpu)}</option><option value="2">${escape(f.twoCpu)}</option><option value="3">${escape(f.threeCpu)}</option></select></label>
      <label class="field" for="farkle-variant">${escape(f.scoring)}<select id="farkle-variant" data-farkle-variant><option value="fixed">${escape(f.fixed)}</option><option value="doubling">${escape(f.doubling)}</option></select></label>
      <label class="field" for="farkle-entry">${escape(f.entry)}<input id="farkle-entry" data-farkle-entry type="number" min="100" max="100000" step="100" value="500"></label>
      <label class="field" for="farkle-target">${escape(f.target)}<input id="farkle-target" data-farkle-target type="number" min="1000" max="100000" step="500" value="10000"></label>
      <button type="button" class="primary" data-farkle-start>${escape(f.newGame)}</button>
    </fieldset>
    <details class="farkle-rules"><summary>${escape(f.rulesHeading)}</summary><p data-farkle-active-rules>${escape(f.fixedRules)}</p><p>${escape(copy.details)}</p><p>${escape(f.sourceNote)} <a href="https://www.playmonster.com/wp-content/uploads/2018/06/Farkle-Rules.pdf" target="_blank" rel="noopener noreferrer">PlayMonster · Farkle rules sheet</a>.</p></details>
    <p class="hint" data-farkle-status role="status" aria-live="polite">${escape(f.ready)}</p>
    <section class="farkle-board" data-farkle-board hidden>
      <div class="farkle-summary"><p>${escape(f.currentPlayer)}: <strong data-farkle-current></strong></p><p>${escape(f.turnPoints)}: <strong data-farkle-risk>0</strong></p><p data-farkle-dice-left></p></div>
      <div class="farkle-dice" data-farkle-dice role="group" aria-label="${escape(f.dice)}"></div><p class="hint" data-farkle-selection-score aria-live="polite"></p>
      <div class="farkle-actions"><button type="button" class="primary" data-farkle-roll disabled>${escape(f.roll)}</button><button type="button" data-farkle-hold disabled>${escape(f.hold)}</button><button type="button" data-farkle-bank disabled>${escape(f.bank)}</button><button type="button" data-farkle-undo disabled>${escape(f.undo)}</button><button type="button" data-farkle-export disabled>${escape(f.export)}</button></div>
      <section class="farkle-scores"><h3>${escape(f.scores)}</h3><div class="table-scroll"><table><thead><tr><th scope="col">${escape(f.player)}</th><th scope="col">${escape(f.total)}</th><th scope="col">${escape(f.entryStatus)}</th></tr></thead><tbody data-farkle-scores></tbody></table></div></section>
      <section class="farkle-history"><h3>${escape(f.recentTurns)}</h3><ol data-farkle-history></ol></section>
      <p class="result" data-farkle-winner role="status" aria-live="polite"></p>
    </section>
  </div>`;
}

function swissNetSalaryForm(copy) {
  const f = copy.fields;
  const cantons = ['AG','AI','AR','BE','BL','BS','FR','GE','GL','GR','JU','LU','NE','NW','OW','SG','SH','SO','SZ','TG','TI','UR','VD','VS','ZG','ZH'];
  const field = (id, label, value, max = 100000000) => `<label class="field" for="${id}">${escape(label)}<input id="${id}" type="number" inputmode="decimal" min="0" max="${max}" step="any" value="${value}" required></label>`;
  return `<div class="swiss-net-salary-tool" data-swiss-net-salary>
    <div class="fields">${field('ch-net-gross', f.grossPerPay, 8000)}
      <label class="field" for="ch-net-payments">${escape(f.payments)}<select id="ch-net-payments"><option value="12">${escape(f.twelve)}</option><option value="13" selected>${escape(f.thirteen)}</option></select></label>
      ${field('ch-net-age', f.age, 35, 100)}
      <label class="field" for="ch-net-status">${escape(f.contributionStatus)}<select id="ch-net-status"><option value="standard">${escape(f.standard)}</option><option value="underContributionAge">${escape(f.underAge)}</option><option value="postReferenceAge">${escape(f.postReference)}</option></select></label>
      <label class="check" data-ch-net-allowance hidden><input id="ch-net-allowance" type="checkbox"> ${escape(f.allowance)}</label>
      <label class="field" for="ch-net-canton">${escape(f.canton)}<select id="ch-net-canton">${cantons.map((canton) => `<option value="${canton}">${canton}</option>`).join('')}</select></label>
      <label class="field" for="ch-net-tax-status">${escape(f.taxStatus)}<select id="ch-net-tax-status"><option value="ordinary">${escape(f.ordinaryTax)}</option><option value="source">${escape(f.sourceTax)}</option></select></label>
    </div>
    <p class="hint">${escape(f.statusHelp)} ${escape(f.cantonHelp)}</p>
    <fieldset class="swiss-net-deductions"><legend>${escape(f.annualDeductions)}</legend><div class="fields">${field('ch-net-pension', f.pension, 0)}${field('ch-net-accident', f.accident, 0)}<label class="field" for="ch-net-source-tax">${escape(f.withholding)}<input id="ch-net-source-tax" type="number" inputmode="decimal" min="0" max="100000000" step="any" value="0" required></label>${field('ch-net-other', f.other, 0)}</div><p class="hint" data-ch-net-source-help>${escape(f.sourceTaxHelp)}</p><p class="hint">${escape(f.customHelp)}</p></fieldset>
    <p class="hint">${escape(f.taxNotIncluded)}</p>
    <div class="actions"><button type="button" class="primary" data-ch-net-calculate>${escape(f.calculate)}</button><button type="button" data-ch-net-reset>${escape(f.reset)}</button></div>
    <p class="hint" data-ch-net-status role="status" aria-live="polite">${escape(f.ready)}</p>
    <section class="swiss-net-result" data-ch-net-result aria-live="polite" hidden></section>
    <p class="source-links">${escape(f.sourceNote)} <a href="https://www.ahv-iv.ch/p/2.01.e" target="_blank" rel="noopener noreferrer">${escape(f.ahvSource)}</a> · <a href="https://www.bsv.admin.ch/en/old-age-provision-occupational-benefits-plan" target="_blank" rel="noopener noreferrer">${escape(f.pensionSource)}</a></p>
  </div>`;
}

function swissTaxCompareForm(copy) {
  const f = copy.fields;
  const amountFields = ['taxableFederalIncome', 'taxableCantonalIncome', 'taxableWealth', 'federalIncomeTax', 'cantonalIncomeTax', 'municipalIncomeTax', 'churchIncomeTax', 'wealthTax', 'personalTax'];
  const input = (key) => `<label class="field">${escape(f[key])}<input type="number" data-tax-field="${key}" min="0" max="1000000000" step="0.01" inputmode="decimal" ${['taxableFederalIncome','taxableCantonalIncome','taxableWealth'].includes(key) ? 'required' : ''} ${['churchIncomeTax','personalTax','federalIncomeTax','cantonalIncomeTax','municipalIncomeTax','wealthTax'].includes(key) ? 'value="0"' : ''}></label>`;
  const scenario = (index) => `<fieldset class="swiss-tax-scenario" data-tax-scenario><legend>${escape(f.scenario)} ${index + 1}</legend><div class="fields"><label class="field">${escape(f.label)}<input type="text" data-tax-field="label" maxlength="60" value="${escape(index === 0 ? 'Scenario 1' : 'Scenario 2')}" required></label><label class="field">${escape(f.year)}<input type="number" data-tax-field="year" min="2010" max="2100" step="1" value="2026" required></label><label class="field">${escape(f.location)}<input type="text" data-tax-field="location" maxlength="100" required></label>${amountFields.slice(0, 3).map(input).join('')}</div><details><summary>${escape(f.breakdownHeading)}</summary><div class="fields">${amountFields.slice(3).map(input).join('')}</div></details><button type="button" data-tax-remove>${escape(f.remove)}</button></fieldset>`;
  return `<div class="swiss-tax-compare-tool" data-swiss-tax-compare><p class="hint">${escape(f.officialSteps)}</p><p class="actions"><a class="button primary" href="https://swisstaxcalculator.estv.admin.ch/" target="_blank" rel="noopener noreferrer">${escape(f.openEstv)}</a></p><div data-tax-scenarios>${scenario(0)}${scenario(1)}</div><div class="actions"><button type="button" data-tax-add>${escape(f.add)}</button><button type="button" class="primary" data-tax-compare>${escape(f.calculate)}</button><button type="button" data-tax-reset>${escape(f.reset)}</button></div><p class="hint" data-tax-status role="status" aria-live="polite">${escape(f.ready)}</p><section class="swiss-tax-result" data-tax-result aria-live="polite" hidden></section><p class="source-links">${escape(f.sourceNote)} <a href="https://www.estv.admin.ch/de/steuerrechner-steuern-berechnen" target="_blank" rel="noopener noreferrer">${escape(f.estvSource)}</a> · <a href="https://www.estv.admin.ch/dam/de/sd-web/4wCmxZ0qNcsD/Erlaeuterungen-Steuerberechnungen_de-fr-it-en.pdf" target="_blank" rel="noopener noreferrer">${escape(f.docsSource)}</a></p></div>`;
}

function swissAhvPensionForm(copy) {
  const f = copy.fields;
  return `<div class="swiss-ahv-pension-tool" data-swiss-ahv-pension><div class="fields"><label class="field">${escape(f.year)}<select data-ahv-year><option value="2026">${escape(f.year2026)}</option><option value="2027">${escape(f.year2027)}</option></select></label><label class="field">${escape(f.average)}<input type="number" data-ahv-average min="0" max="1000000000" step="1" inputmode="numeric" required></label><label class="field">${escape(f.creditedYears)}<input type="number" data-ahv-credited min="1" max="44" step="0.25" inputmode="decimal" required></label><label class="field">${escape(f.fullYears)}<select data-ahv-full-years required><option value="" disabled selected>—</option><option value="43">${escape(f.years43)}</option><option value="43.25">${escape(f.years43q1)}</option><option value="43.5">${escape(f.years43q2)}</option><option value="43.75">${escape(f.years43q3)}</option><option value="44">${escape(f.years44)}</option></select></label></div><p class="hint">${escape(f.averageHelp)}</p><div class="actions"><button type="button" class="primary" data-ahv-calculate>${escape(f.calculate)}</button><button type="button" data-ahv-reset>${escape(f.reset)}</button></div><p class="hint" data-ahv-status role="status" aria-live="polite">${escape(f.ready)}</p><section class="swiss-ahv-result" data-ahv-result aria-live="polite" hidden></section><p class="source-links"><a href="https://www.ahv-iv.ch/de/Formulare/Online-Rentensch%C3%A4tzung-ESCAL" target="_blank" rel="noopener noreferrer">${escape(f.guidance)}</a> · ${escape(f.sourceNote)} <a href="https://www.ahv-iv.ch/de/Sozialversicherungen/Alters-und-Hinterlassenenversicherung-AHV" target="_blank" rel="noopener noreferrer">${escape(f.ahvSource)}</a> · <a href="https://www.bsv.admin.ch/de/leistungen-ahv-detail" target="_blank" rel="noopener noreferrer">${escape(f.bsvSource)}</a> · <a href="https://www.bsv.admin.ch/de/umsetzung-13-ahv-rente" target="_blank" rel="noopener noreferrer">${escape(f.thirteenthSource)}</a></p></div>`;
}

function swissPillar3aForm(copy) {
  const f = copy.fields;
  const input = (key, data, options = '') => `<label class="field">${escape(f[key])}<input type="number" data-3a-field="${data}" min="0" max="1000000000" step="0.01" inputmode="decimal" ${options}></label>`;
  return `<div class="swiss-pillar3a-tool" data-swiss-pillar-3a><div class="fields"><label class="field">${escape(f.year)}<select data-3a-field="year"><option value="2026">${escape(f.year2026)}</option><option value="2027">${escape(f.year2027)}</option></select></label><label class="field">${escape(f.secondPillar)}<select data-3a-field="secondPillarStatus"><option value="withSecondPillar">${escape(f.withSecondPillar)}</option><option value="withoutSecondPillar">${escape(f.withoutSecondPillar)}</option></select></label>${input('earned','qualifyingEarnedIncome','required')}${input('contribution','contribution','required')}<label class="field">${escape(f.location)}<input type="text" data-3a-field="location" maxlength="100" required></label><label class="field">${escape(f.profile)}<input type="text" data-3a-field="profile" maxlength="100" required></label>${input('taxBefore','taxBefore','required')}${input('taxAfter','taxAfter','required')}</div><label class="check"><input type="checkbox" data-3a-field="eligibleIncomeConfirmed"> ${escape(f.eligibility)}</label><p class="hint">${escape(f.guidance)}</p><p class="actions"><a class="button primary" href="https://swisstaxcalculator.estv.admin.ch/" target="_blank" rel="noopener noreferrer">${escape(f.openEstv)}</a></p><div class="actions"><button type="button" class="primary" data-3a-calculate>${escape(f.calculate)}</button><button type="button" data-3a-reset>${escape(f.reset)}</button></div><p class="hint" data-3a-status role="status" aria-live="polite">${escape(f.ready)}</p><section class="swiss-pillar3a-result" data-3a-result aria-live="polite" hidden></section><p class="source-links">${escape(f.sourceNote)} <a href="https://www.bsv.admin.ch/de/die-dritte-saeule" target="_blank" rel="noopener noreferrer">${escape(f.bsv3a)}</a> · <a href="https://www.bsv.admin.ch/de/newnsb/6ck3kzVxBNQ4" target="_blank" rel="noopener noreferrer">${escape(f.bsvLimits)}</a> · <a href="https://www.estv.admin.ch/de/steuerrechner-steuern-berechnen" target="_blank" rel="noopener noreferrer">${escape(f.estv)}</a></p></div>`;
}

function swissBvgPensionForm(copy) {
  const f = copy.fields;
  const number = (key, data, min, max, step = '0.01') => `<label class="field">${escape(f[key])}<input type="number" data-bvg-field="${data}" min="${min}" max="${max}" step="${step}" inputmode="decimal" ${data === 'annualSalaryGrowth' ? 'value="0"' : data === 'interestRate' ? 'value="1.25"' : data === 'conversionRate' ? 'value="6.8"' : 'required'}></label>`;
  return `<div class="swiss-bvg-tool" data-swiss-bvg-pension><div class="fields"><label class="field">${escape(f.year)}<select data-bvg-field="year"><option value="2026">${escape(f.year2026)}</option><option value="2027">${escape(f.year2027)}</option></select></label>${number('salary','annualSalary',0,1000000000)}${number('age','age',17,69,'1')}${number('retirementAge','retirementAge',58,70,'1')}${number('balance','currentMandatoryBalance',0,1000000000)}${number('salaryGrowth','annualSalaryGrowth',0,20)}${number('interest','interestRate',0,20)}${number('conversion','conversionRate',0,20)}</div><p class="hint">${escape(f.retirementHelp)}</p><p class="hint">${escape(f.interestNote)}</p><div class="actions"><button type="button" class="primary" data-bvg-calculate>${escape(f.calculate)}</button><button type="button" data-bvg-reset>${escape(f.reset)}</button></div><p class="hint" data-bvg-status role="status" aria-live="polite">${escape(f.ready)}</p><section class="swiss-bvg-result" data-bvg-result aria-live="polite" hidden></section><p class="source-links">${escape(f.sourceNote)} <a href="https://www.bsv.admin.ch/de/altersvorsorge-beruflichen-vorsorge" target="_blank" rel="noopener noreferrer">${escape(f.bsvRules)}</a> · <a href="https://www.bsv.admin.ch/de/newnsb/BqB41FVYi5FB" target="_blank" rel="noopener noreferrer">${escape(f.bsv2027)}</a> · <a href="https://www.bsv.admin.ch/dam/de/sd-web/3jZGqTLgADbl/BPP_Zahlen_85_2026.pdf" target="_blank" rel="noopener noreferrer">${escape(f.bsvTables)}</a></p></div>`;
}

function swissPensionWithdrawalForm(copy) {
  const f = copy.fields;
  const scenario = (index) => `<fieldset class="swiss-pension-withdrawal-scenario" data-withdrawal-scenario><legend>${escape(f.scenario)} ${index + 1}</legend><div class="fields"><label class="field">${escape(f.label)}<input type="text" data-withdrawal-field="label" maxlength="60" value="${escape(`${f.scenario} ${index + 1}`)}" required></label><label class="field">${escape(f.year)}<input type="number" data-withdrawal-field="year" min="2010" max="2100" step="1" value="2026" required></label><label class="field">${escape(f.location)}<input type="text" data-withdrawal-field="location" maxlength="100" required></label><label class="field">${escape(f.household)}<input type="text" data-withdrawal-field="household" maxlength="100" required></label><label class="field">${escape(f.capital)}<input type="number" data-withdrawal-field="capital" min="0.01" max="1000000000" step="0.01" inputmode="decimal" required></label><label class="field">${escape(f.tax)}<input type="number" data-withdrawal-field="tax" min="0" max="1000000000" step="0.01" inputmode="decimal" required></label></div><button type="button" data-withdrawal-remove>${escape(f.remove)}</button></fieldset>`;
  return `<div class="swiss-pension-withdrawal-tool" data-swiss-pension-withdrawal><p class="hint">${escape(f.steps)}</p><p class="hint">${escape(f.limit)}</p><p class="actions"><a class="button primary" href="https://swisstaxcalculator.estv.admin.ch/" target="_blank" rel="noopener noreferrer">${escape(f.openEstv)}</a></p><div data-withdrawal-scenarios>${scenario(0)}${scenario(1)}</div><template data-withdrawal-template>${scenario(0)}${scenario(1)}</template><div class="actions"><button type="button" data-withdrawal-add>${escape(f.add)}</button><button type="button" class="primary" data-withdrawal-calculate>${escape(f.calculate)}</button><button type="button" data-withdrawal-reset>${escape(f.reset)}</button></div><p class="hint" data-withdrawal-status role="status" aria-live="polite">${escape(f.ready)}</p><section class="swiss-pension-withdrawal-result" data-withdrawal-result aria-live="polite" hidden></section><p class="source-links">${escape(f.sourceNote)} <a href="https://www.estv.admin.ch/de/steuerrechner-steuern-berechnen" target="_blank" rel="noopener noreferrer">${escape(f.estv)}</a> · <a href="https://www.estv.admin.ch/dam/de/sd-web/4wCmxZ0qNcsD/Erlaeuterungen-Steuerberechnungen_de-fr-it-en.pdf" target="_blank" rel="noopener noreferrer">${escape(f.estvRules)}</a> · <a href="https://www.ch.ch/en/taxes-and-finances/old-age-pension/3rd-pillar/" target="_blank" rel="noopener noreferrer">${escape(f.rules)}</a></p></div>`;
}

function swissHealthDeductibleForm(copy) {
  const f = copy.fields;
  const costInput = (key, data) => `<label class="field">${escape(f[key])}<input type="number" data-health-spend data-health-${data} min="0" max="10000000" step="0.01" inputmode="decimal" required></label>`;
  return `<div class="swiss-health-deductible-tool" data-swiss-health-deductible><div class="fields"><label class="field">${escape(f.insuredGroup)}<select data-health-group><option value="adult">${escape(f.adult)}</option><option value="child">${escape(f.child)}</option></select></label>${costInput('lowSpend','low')}${costInput('expectedSpend','expected')}${costInput('highSpend','high')}</div><fieldset class="swiss-health-quotes"><legend>${escape(f.premiumHeading)}</legend><div data-health-quotes></div></fieldset><p class="hint">${escape(copy.limits)}</p><div class="actions"><button type="button" class="primary" data-health-calculate>${escape(f.calculate)}</button><button type="button" data-health-reset>${escape(f.reset)}</button></div><p class="hint" data-health-status role="status" aria-live="polite">${escape(f.ready)}</p><section data-health-result aria-live="polite" hidden></section><p class="source-links">${escape(f.sourceNote)} <a href="https://www.bag.admin.ch/en/health-insurance-optional-deductibles" target="_blank" rel="noopener noreferrer">${escape(f.bagRules)}</a> · <a href="https://www.priminfo.admin.ch/" target="_blank" rel="noopener noreferrer">${escape(f.priminfo)}</a></p></div>`;
}

function swissRentAdjustmentForm(copy) {
  const f = copy.fields;
  const input = (key, name, min, max, step) => `<label class="field">${escape(f[key])}<input type="number" name="${name}" data-rent-field="${key}" min="${min}" max="${max}" step="${step}" inputmode="decimal" required></label>`;
  return `<div class="swiss-rent-adjustment-tool" data-swiss-rent-adjustment><p class="hint">${escape(f.scope)}</p><form><div class="fields">${input('rent','monthlyRent',0.01,1000000,0.01)}${input('leaseRate','leaseRate',0,5,0.25)}${input('currentRate','currentRate',0,5,0.25)}</div><div class="actions"><button type="button" class="primary" data-rent-calculate>${escape(f.calculate)}</button><button type="button" data-rent-clear>${escape(f.clear)}</button></div></form><p class="hint" data-rent-status role="status" aria-live="polite">${escape(f.ready)}</p><section data-rent-result aria-live="polite" hidden></section><p class="source-links">${escape(f.sourceHeading)}: <a href="https://www.bwo.admin.ch/de/referenzzinssatz" target="_blank" rel="noopener noreferrer">${escape(f.sourceName)}</a></p></div>`;
}

function swissVacationAccrualForm(copy) {
  const f = copy.fields;
  const dates = (id, name, value) => `<label class="field" for="${id}">${escape(f[id])}<input id="${id}" type="date" name="${name}" value="${value}" required></label>`;
  const number = (id, name, value, min, max, step = 'any') => `<label class="field" for="${id}">${escape(f[id])}<input id="${id}" type="number" name="${name}" value="${value}" min="${min}" max="${max}" step="${step}" inputmode="decimal" required></label>`;
  return `<div class="swiss-vacation-accrual-tool" data-swiss-vacation-accrual><p class="hint">${escape(f.note)}</p><form><div class="fields">${number('year','year',new Date().getFullYear(),1900,2100,'1')}${number('weeks','annualWeeks',4,4,12,0.25)}${number('workdays','workdaysPerWeek',5,1,7,0.5)}${dates('start','employmentStart',`${new Date().getFullYear()}-01-01`)}${dates('end','employmentEnd',`${new Date().getFullYear()}-12-31`)}${number('taken','daysTaken',0,0,366,0.25)}</div><div class="actions"><button type="button" class="primary" data-vacation-calculate>${escape(f.calculate)}</button><button type="button" data-vacation-clear>${escape(f.clear)}</button></div></form><p data-vacation-status role="status" aria-live="polite">${escape(copy.messages.ready)}</p><section data-vacation-result aria-live="polite" hidden></section></div>`;
}

function swissPremiumReductionForm(copy) {
  const f = copy.fields;
  return `<div class="swiss-premium-reduction-tool" data-swiss-premium-reduction><p class="hint">${escape(f.note)}</p><form><div class="fields"><label class="field">${escape(f.premium)}<input type="number" name="monthlyPremium" min="0.01" max="100000" step="0.01" inputmode="decimal" required></label><label class="field">${escape(f.reduction)}<input type="number" name="monthlyReduction" min="0" max="100000" step="0.01" inputmode="decimal" required></label></div><div class="actions"><button type="button" class="primary" data-premium-calculate>${escape(f.calculate)}</button><button type="button" data-premium-clear>${escape(f.clear)}</button></div></form><p data-premium-status role="status" aria-live="polite">${escape(copy.messages.ready)}</p><section data-premium-result aria-live="polite" hidden></section><p class="source-links"><a href="https://www.bag.admin.ch/en/health-insurance-premium-subsidies" target="_blank" rel="noopener noreferrer">${escape(copy.fields.source ?? 'Official information on Swiss premium reductions')}</a></p></div>`;
}

function remainingToolForm(mode, copy) {
  const f = copy.fields;
  const input = (name, type = 'number', extra = '') => `<label class="field">${escape(f[name])}<input name="${name}" type="${type}" ${extra}></label>`;
  const area = (name, rows = 4) => `<label class="field">${escape(f[name])}<textarea name="${name}" rows="${rows}" ${mode === 'spellcheck' ? 'spellcheck="true"' : ''}></textarea></label>`;
  if (mode === 'swissUnemployment') return `<div data-remaining-tool="${mode}"><p class="hint">${escape(copy.scope)}</p><form><div class="fields">${input('salary','number','min="0.01" max="1000000" step="0.01" required')}<label class="field">${escape(f.rate)}<select name="rate"><option value="70">${escape(f.rate70)}</option><option value="80">${escape(f.rate80)}</option></select></label></div><div class="actions"><button type="button" class="primary" data-remaining-calculate>${escape(f.calculate)}</button><button type="reset">${escape(f.clear)}</button></div></form><section data-remaining-result hidden aria-live="polite"></section><p data-remaining-status role="status">${escape(copy.messages.ready)}</p><p class="source-links"><a href="https://www.arbeit.swiss/en/jobseekers/insurance-benefits" target="_blank" rel="noopener noreferrer">${escape(f.sources)}</a></p></div>`;
  if (mode === 'swissTenancy') return `<div data-remaining-tool="${mode}"><p class="hint">${escape(copy.scope)}</p><form><div class="fields">${input('months','number','min="0" max="36" step="1" required')}${input('noticeDay','number','min="1" max="31" step="1" required')}${input('received','date','required')}${input('sender','text','required')}${input('senderAddress','text')}${input('recipient','text','required')}${input('recipientAddress','text')}${input('property','text','required')}${input('place','text','required')}${input('sentDate','date','required')}${input('subject','text','value="Termination of tenancy" required')}</div><div class="actions"><button type="button" class="primary" data-remaining-calculate>${escape(f.calculate)}</button><button type="reset">${escape(f.clear)}</button></div></form><section data-remaining-result hidden aria-live="polite"></section><p data-remaining-status role="status">${escape(copy.messages.ready)}</p></div>`;
  if (mode === 'swissPropertyGain') return `<div data-remaining-tool="${mode}"><p class="hint">${escape(copy.scope)}</p><form><div class="fields">${input('sale','number','min="0" step="0.01" required')}${input('purchase','number','min="0" step="0.01" required')}${input('costs','number','min="0" step="0.01" required')}${input('rate','number','min="0" max="100" step="0.01" required')}</div><div class="actions"><button type="button" class="primary" data-remaining-calculate>${escape(f.calculate)}</button><button type="reset">${escape(f.clear)}</button></div></form><section data-remaining-result hidden aria-live="polite"></section><p data-remaining-status role="status">${escape(copy.messages.ready)}</p></div>`;
  if (mode === 'swissInheritance') return `<div data-remaining-tool="${mode}"><p class="hint">${escape(copy.scope)}</p><form><div class="fields">${input('amount','number','min="0" step="0.01" required')}${input('exemption','number','min="0" step="0.01" required')}${input('rate','number','min="0" max="100" step="0.01" required')}</div><div class="actions"><button type="button" class="primary" data-remaining-calculate>${escape(f.calculate)}</button><button type="reset">${escape(f.clear)}</button></div></form><section data-remaining-result hidden aria-live="polite"></section><p data-remaining-status role="status">${escape(copy.messages.ready)}</p></div>`;
  if (mode === 'swissChildBudget') return `<div data-remaining-tool="${mode}"><p class="hint">${escape(copy.scope)}</p><form><div class="fields">${input('need','number','min="0" step="0.01" required')}${input('incomeA','number','min="0" step="0.01" required')}${input('incomeB','number','min="0" step="0.01" required')}${input('creditA','number','min="0" step="0.01" value="0" required')}</div><div class="actions"><button type="button" class="primary" data-remaining-calculate>${escape(f.calculate)}</button><button type="reset">${escape(f.clear)}</button></div></form><section data-remaining-result hidden aria-live="polite"></section><p data-remaining-status role="status">${escape(copy.messages.ready)}</p></div>`;
  if (mode === 'hyphenation') return `<div data-remaining-tool="${mode}"><p class="hint">${escape(copy.scope)}</p><form>${input('language','text','value="en" maxlength="35" required')}${input('width','number','min="20" max="100" value="48" required')}${area('text',6)}<div class="actions"><button type="button" class="primary" data-remaining-preview>${escape(f.preview)}</button><button type="reset">${escape(f.clear)}</button></div></form><section data-remaining-result class="hyphen-preview" hidden aria-live="polite"></section><p data-remaining-status role="status">${escape(copy.messages.ready)}</p></div>`;
  if (mode === 'spellcheck') return `<div data-remaining-tool="${mode}"><p class="hint">${escape(copy.scope)}</p><form>${input('language','text','value="en" maxlength="35" required')}${area('text',10)}<div class="actions"><button type="button" data-remaining-copy>${escape(f.copy)}</button><button type="reset">${escape(f.clear)}</button></div></form><p data-remaining-status role="status">${escape(copy.messages.ready)}</p></div>`;
  if (mode === 'resume') return `<div data-remaining-tool="${mode}"><p class="hint">${escape(copy.scope)}</p><form><label class="field">${escape(f.file)}<input name="file" type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"></label>${area('text',10)}${area('job',6)}<div class="actions"><button type="button" class="primary" data-remaining-analyze>${escape(f.analyze)}</button><button type="reset">${escape(f.clear)}</button></div></form><section data-remaining-result hidden aria-live="polite"></section><p data-remaining-status role="status">${escape(copy.messages.ready)}</p></div>`;
  return '';
}

function resumeStructureForm(copy) {
  const f = copy.fields;
  return `<div class="resume-structure-tool" data-resume-checker><p class="hint">${escape(copy.intro)}</p><div class="fields"><label class="field" for="resume-file">${escape(f.resume)}<input id="resume-file" data-resume-file type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"></label><label class="field" for="resume-job">${escape(f.jobText)}<textarea id="resume-job" data-resume-job rows="6" maxlength="30000" placeholder="${escape(f.jobPlaceholder)}"></textarea></label></div><p class="hint">${escape(f.resumeHelp)} ${escape(f.jobHelp)}</p><div class="actions"><button type="button" class="primary" data-resume-analyze disabled>${escape(f.analyze)}</button><button type="button" data-resume-clear>${escape(f.clear)}</button></div><p data-resume-status role="status" aria-live="polite">${escape(f.empty)}</p><section data-resume-output aria-live="polite"></section></div>`;
}

function vocalRemoverForm(copy) {
  const f = copy.fields;
  return `<div data-vocal-remover><p class="hint">${escape(copy.intro)}</p><label class="field">${escape(f.file)}<input data-vocal-file type="file" accept="audio/*" required></label><div class="actions"><button type="button" class="primary" data-vocal-start>${escape(f.separate)}</button><button type="button" data-vocal-clear>${escape(f.cancel)}</button></div><p data-vocal-status role="status" aria-live="polite">${escape(copy.messages.ready)}</p><progress data-vocal-progress max="1" value="0" hidden aria-label="${escape(f.progress)}"></progress><section data-vocal-results hidden aria-live="polite"></section><p class="source-links"><a href="https://huggingface.co/MixDirective/open-unmix-umxhq-vocals-onnx/tree/e06097d3193a4c3168b5ddd2a479a680b1176c16" target="_blank" rel="noopener noreferrer">${escape(f.source)}</a> · <a href="https://github.com/sigsep/open-unmix-pytorch" target="_blank" rel="noopener noreferrer">Open-Unmix project</a> · <a href="https://zenodo.org/records/3370489" target="_blank" rel="noopener noreferrer">Original UMX-HQ weights record</a></p></div>`;
}

function formFor(mode, copy) {
  const f = copy.fields;
  if (mode === 'bridgeGame') return bridgeGameForm(copy);
  if (mode === 'farkleGame') return farkleGameForm(copy);
  if (mode === 'swissNetSalary') return swissNetSalaryForm(copy);
  if (mode === 'swissTaxCompare') return swissTaxCompareForm(copy);
  if (mode === 'swissAhvPension') return swissAhvPensionForm(copy);
  if (mode === 'swissPillar3a') return swissPillar3aForm(copy);
  if (mode === 'swissBvgPension') return swissBvgPensionForm(copy);
  if (mode === 'swissPensionWithdrawal') return swissPensionWithdrawalForm(copy);
  if (mode === 'swissHealthDeductible') return swissHealthDeductibleForm(copy);
  if (mode === 'swissRentAdjustment') return swissRentAdjustmentForm(copy);
  if (mode === 'swissVacationAccrual') return swissVacationAccrualForm(copy);
  if (mode === 'swissPremiumReduction') return swissPremiumReductionForm(copy);
  if (Object.hasOwn(remainingToolsEnglish, mode)) return remainingToolForm(mode, copy);
  if (mode === 'resumeStructure') return resumeStructureForm(copy);
  if (mode === 'vocalRemover') return vocalRemoverForm(copy);
  if (mode === 'fiveLetterWord') return `<div class="five-letter-tool" data-five-letter-game><p class="hint">${escape(f.scope)}</p><label class="field" for="word-bank">${escape(f.bank)}<select id="word-bank" data-word-bank><option value="" disabled selected>${escape(f.bankPrompt)}</option><option value="nb">${escape(f.bokmal)}</option><option value="custom">${escape(f.own)}</option></select></label><section data-word-import hidden><h3>${escape(f.importHeading)}</h3><p class="hint">${escape(f.importHelp)}</p><label class="field" for="word-language-name">${escape(f.languageName)}<input id="word-language-name" maxlength="40" autocomplete="off"></label><label class="field" for="word-language-tag">${escape(f.languageTag)}<input id="word-language-tag" maxlength="35" autocomplete="off" placeholder="es, tr, ar"></label><label class="field" for="word-list">${escape(f.pastedWords)}<textarea id="word-list" rows="6" maxlength="200000" spellcheck="false"></textarea></label><label class="field" for="word-file">${escape(f.file)}<input id="word-file" type="file" accept=".txt,text/plain"></label><button type="button" data-word-save>${escape(f.saveList)}</button><button type="button" data-word-clear>${escape(f.clearList)}</button><p class="hint" data-word-bank-status role="status" aria-live="polite"></p></section><label class="field" for="word-mode">${escape(f.mode)}<select id="word-mode" data-word-mode><option value="daily">${escape(f.daily)}</option><option value="practice">${escape(f.practice)}</option></select></label><p class="hint">${escape(f.dailyNote)}</p><button type="button" class="primary" data-word-new>${escape(f.newGame)}</button><form data-word-form><label class="field" for="word-guess">${escape(f.guess)}<input id="word-guess" data-word-guess maxlength="40" autocomplete="off" autocapitalize="none" spellcheck="false" required disabled></label><button type="submit" data-word-submit disabled>${escape(f.submit)}</button></form><p class="hint" data-word-status role="status" aria-live="polite">${escape(f.ready)}</p><div data-word-board class="five-letter-board" role="group" aria-label="${escape(f.guess)}"></div><p class="hint" data-word-legend>${escape(f.correct)} · ${escape(f.present)} · ${escape(f.absent)}</p><div class="actions"><button type="button" data-word-share disabled>${escape(f.share)}</button><button type="button" data-word-history-clear>${escape(f.clearHistory)}</button></div><p class="hint" data-word-history>${escape(f.history)}</p><p class="hint">${escape(f.customBankNote)}</p><details><summary>${escape(f.source)}</summary><p>${escape(f.attribution)} · <a href="/assets/five-letter-word-bank/ATTRIBUTION.txt">${escape(f.source)}</a></p></details></div>`;
  if (mode === 'norwayEmployerCost') return norwayEmployerCostForm(copy);
  if (mode === 'norwayDisabilityBenefit') return norwayDisabilityBenefitForm(copy);
  if (mode === 'norwayStudentFinance') return norwayStudentFinanceForm(copy);
  if (mode === 'norwayBsu') return norwayBsuForm(copy);
  if (mode === 'norwayCommutingDeduction') return norwayCommutingDeductionForm(copy);
  if (mode === 'norwayMileageReimbursement') return norwayMileageReimbursementForm(copy);
  if (mode === 'latePaymentInterest') return latePaymentInterestForm(copy);
  if (mode === 'norwayImportCost') return norwayImportCostForm(copy);
  if (mode === 'norwayCarImportCost') return norwayCarImportCostForm(copy);
  if (mode === 'norwayTollCost') return norwayTollCostForm(copy);
  if (mode === 'norwayPropertyTransfer') return norwayPropertyTransferForm(copy);
  if (mode === 'norwayElectricitySupport') return norwayElectricitySupportForm(copy);
  if (mode === 'beadPattern') return beadPatternForm(copy);
  if (mode === 'codebreaker') return codebreakerForm(copy);
  if (mode === 'shoeSize') return shoeSizeForm(copy);
  if (mode === 'childGrowth') return childGrowthForm(copy);
  if (mode === 'ringSize') return ringSizeForm(copy);
  if (mode === 'model3dViewer') return model3dViewerForm(copy);
  if (mode === 'dxfViewer') return dxfViewerForm(copy);
  if (mode === 'swissQrBill') return swissQrBillForm(copy);
  const number = (id, label, value, min = '0.01', max = '100000') => `<label class="field" for="${id}">${escape(label)}<input id="${id}" name="${id}" type="number" inputmode="decimal" value="${value}" min="${min}" max="${max}" step="any" required></label>`;
  const select = (id, label, options) => `<label class="field" for="${id}">${escape(label)}<select id="${id}" name="${id}">${options.map(([value, text]) => `<option value="${value}">${escape(text)}</option>`).join('')}</select></label>`;
  if (mode === 'knitting') return `<div class="fields">${number('stitches', f.stitches, 20, 1, 10000)}${number('rows', f.rows, 28, 1, 20000)}${number('sample-width', f.sampleWidth, 10, 0.1, 200)}${number('sample-height', f.sampleHeight, 10, 0.1, 200)}${number('target-width', f.targetWidth, 50, 0.1, 2000)}${number('target-height', f.targetHeight, 40, 0.1, 2000)}${number('repeat', f.repeat, 1, 1, 200)}<label class="check"><input id="symmetric" type="checkbox"> ${escape(f.symmetric)}</label></div><button class="primary" data-action="calculate">${escape(copy.actions.calculate)}</button><button data-action="print">${escape(copy.actions.print)}</button><div data-result class="result" aria-live="polite" hidden></div>`;
  if (mode === 'phonetic') return `<label class="field" for="phonetic-input">${escape(f.input)}<textarea id="phonetic-input" rows="5" maxlength="5000" placeholder="${escape(f.inputPlaceholder)}"></textarea></label>${select('phonetic-direction', f.direction, [['encode', f.encode], ['decode', f.decode]])}<p class="hint">${escape(f.separatorNote)}</p><div class="actions"><button class="primary" data-action="convert">${escape(copy.actions.convert)}</button><button data-action="copy">${escape(copy.actions.copy)}</button><button data-action="speak">${escape(f.speak)}</button><button data-action="clear">${escape(f.clear)}</button><button data-action="practice">${escape(f.practice)}</button></div><label class="field" data-practice hidden>${escape(f.answer)}<input id="practice-answer" maxlength="16" autocomplete="off"></label><div data-result class="result" aria-live="polite" hidden></div>`;
  if (mode === 'holidayPay') return `<div class="fields">${number('holiday-basis', f.basis, 500000, 0, 100000000)}<label class="check"><input id="holiday-age" type="checkbox"> ${escape(f.age)}</label><label class="check"><input id="holiday-five-week" type="checkbox"> ${escape(f.fiveWeek)}</label></div><button class="primary" data-action="calculate">${escape(copy.actions.calculate)}</button><button data-action="reset">${escape(f.reset)}</button><div data-result class="result" aria-live="polite" hidden></div>`;
  if (mode === 'grades') return `<div class="fields">${number('score', f.score, 45, 0, 1000000000)}${number('maximum', f.maximum, 50, 0.01, 1000000000)}</div><h3>${escape(copy.scaleLabel)}</h3><div class="fields">${number('threshold-a', f.thresholdA, 90, 0, 100)}${number('threshold-b', f.thresholdB, 80, 0, 100)}${number('threshold-c', f.thresholdC, 0, 0, 100)}<label class="field" for="label-a">${escape(f.labelA)}<input id="label-a" value="A" maxlength="12"></label><label class="field" for="label-b">${escape(f.labelB)}<input id="label-b" value="B" maxlength="12"></label><label class="field" for="label-c">${escape(f.labelC)}<input id="label-c" value="C" maxlength="12"></label></div><button class="primary" data-action="calculate">${escape(copy.actions.calculate)}</button><button data-action="csv">${escape(copy.actions.exportCsv)}</button><button data-action="print">${escape(copy.actions.print)}</button><div data-result class="result" aria-live="polite" hidden></div>`;
  if (mode === 'graph') return `<div class="fields">${select('page-size', f.page, [['a4', f.a4], ['letter', f.letter], ['custom', f.custom]])}<div class="field" data-custom hidden>${number('width-mm', f.width, 210, 40, 1000)}${number('height-mm', f.height, 297, 40, 1000)}</div>${select('pattern', f.pattern, [['grid', f.grid], ['dots', f.dots], ['isometric', f.isometric]])}${number('spacing-mm', f.spacing, 5, 1, 50)}${number('margin-mm', f.margin, 10, 0, 400)}${number('copies', f.copies, 1, 1, 20)}<label class="field" for="grid-color">${escape(f.color)}<input id="grid-color" type="color" value="#b7c7d8"></label></div><button class="primary" data-action="generate">${escape(copy.actions.generate)}</button><button data-action="download">${escape(copy.actions.download)}</button><button data-action="print">${escape(copy.actions.print)}</button><p class="hint">${escape(copy.messages.printScale)}</p><div data-result class="result" aria-live="polite" hidden></div><div data-print class="print-output" aria-hidden="true"></div>`;
  return `<div class="fields">${select('size', f.size, [['6', f.six], ['8', f.eight], ['10', f.ten]])}</div><p>${escape(f.puzzleHelp)}</p><div data-board class="binary-board" role="grid" aria-label="${escape(copy.name)}"></div><div class="actions"><button class="primary" data-action="check">${escape(copy.actions.check)}</button><button data-action="new">${escape(copy.actions.newPuzzle)}</button><button data-action="hint">${escape(copy.actions.hint)}</button><button data-action="solution">${escape(copy.actions.solution)}</button></div><div data-result class="result" aria-live="polite" hidden></div>`;
}

export function renderPage({ tool, locale, locales, copy, baseOrigin = 'https://tools.usefulverse.com' }) {
  const translate = (value, dictionary) => {
    if (typeof value === 'string') return dictionary[value] ?? value;
    if (Array.isArray(value)) return value.map((item) => translate(item, dictionary));
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, translate(item, dictionary)]));
    return value;
  };
  const dictionary = {
    ...(translationsByLocale[locale.key] ?? {}),
    ...(tool.mode === 'norwayDisabilityBenefit' ? norwayDisabilityBenefitTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'norwayStudentFinance' ? norwayStudentFinanceTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'norwayBsu' ? norwayBsuTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'norwayCommutingDeduction' ? norwayCommutingDeductionTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'norwayMileageReimbursement' ? norwayMileageReimbursementTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'latePaymentInterest' ? latePaymentInterestTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'norwayImportCost' ? norwayImportCostTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'norwayCarImportCost' ? norwayCarImportCostTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'norwayTollCost' ? norwayTollCostTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'norwayTollCost' ? norwayTollCostTranslationOverrides[locale.key] ?? {} : {}),
    ...(tool.mode === 'norwayPropertyTransfer' ? norwayPropertyTransferTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'norwayPropertyTransfer' ? norwayPropertyTransferTranslationOverrides[locale.key] ?? {} : {}),
    ...(tool.mode === 'norwayElectricitySupport' ? norwayElectricitySupportTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'norwayElectricitySupport' ? norwayElectricitySupportTranslationOverrides[locale.key] ?? {} : {}),
    ...(tool.mode === 'beadPattern' ? beadPatternTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'beadPattern' ? beadPatternTranslationOverrides[locale.key] ?? {} : {}),
    ...(tool.mode === 'codebreaker' ? codebreakerTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'codebreaker' ? codebreakerTranslationOverrides[locale.key] ?? {} : {}),
    ...(tool.mode === 'shoeSize' ? shoeSizeTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'shoeSize' ? shoeSizeTranslationOverrides[locale.key] ?? {} : {}),
    ...(tool.mode === 'childGrowth' ? childGrowthTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'childGrowth' ? childGrowthTranslationOverrides[locale.key] ?? {} : {}),
    ...(tool.mode === 'phonetic' ? phoneticTranslationOverrides[locale.key] ?? {} : {}),
    ...(tool.mode === 'ringSize' ? ringSizeTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'ringSize' ? ringSizeTranslationOverrides[locale.key] ?? {} : {}),
    ...(tool.mode === 'model3dViewer' ? model3dViewerGeneratedTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'dxfViewer' ? dxfViewerGeneratedTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'model3dViewer' ? model3dViewerTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'dxfViewer' ? dxfViewerTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'grisCardGame' ? grisCardGameTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'grisCardGame' ? grisCardGameTranslationOverrides[locale.key] ?? {} : {}),
    ...(tool.mode === 'fiveLetterWord' ? fiveLetterWordTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'fiveLetterWord' ? fiveLetterWordTranslationOverridesByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'bridgeGame' ? bridgeGameTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'bridgeGame' ? bridgeGameTranslationOverridesByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'farkleGame' ? farkleTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'farkleGame' ? farkleTranslationOverridesByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'swissNetSalary' ? swissNetSalaryTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'swissNetSalary' ? swissNetSalaryTranslationOverrides[locale.key] ?? {} : {}),
    ...(tool.mode === 'swissTaxCompare' ? swissTaxCompareTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'swissAhvPension' ? swissAhvPensionTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'swissPillar3a' ? swissPillar3aTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'swissPillar3a' ? swissProtectedFallbackTranslationOverridesByLocale[locale.key]?.swissPillar3a ?? {} : {}),
    ...(tool.mode === 'swissPillar3a' ? swissProtectedFallbackFullTranslationOverridesByLocale[locale.key]?.swissPillar3a ?? {} : {}),
    ...(tool.mode === 'swissPillar3a' ? swissProtectedFallbackManualOverridesByLocale[locale.key]?.swissPillar3a ?? {} : {}),
    ...(tool.mode === 'swissBvgPension' ? swissBvgPensionTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'swissBvgPension' ? swissProtectedFallbackTranslationOverridesByLocale[locale.key]?.swissBvgPension ?? {} : {}),
    ...(tool.mode === 'swissBvgPension' ? swissProtectedFallbackFullTranslationOverridesByLocale[locale.key]?.swissBvgPension ?? {} : {}),
    ...(tool.mode === 'swissBvgPension' ? swissProtectedFallbackManualOverridesByLocale[locale.key]?.swissBvgPension ?? {} : {}),
    ...(tool.mode === 'swissPensionWithdrawal' ? swissPensionWithdrawalTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'swissPensionWithdrawal' ? swissProtectedFallbackTranslationOverridesByLocale[locale.key]?.swissPensionWithdrawal ?? {} : {}),
    ...(tool.mode === 'swissPensionWithdrawal' ? swissProtectedFallbackFullTranslationOverridesByLocale[locale.key]?.swissPensionWithdrawal ?? {} : {}),
    ...(tool.mode === 'swissPensionWithdrawal' ? swissProtectedFallbackManualOverridesByLocale[locale.key]?.swissPensionWithdrawal ?? {} : {}),
    ...(tool.mode === 'swissHealthDeductible' ? swissHealthDeductibleTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'swissRentAdjustment' ? swissRentAdjustmentTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'swissVacationAccrual' ? swissVacationAccrualTranslationsByLocale[locale.key] ?? {} : {}),
    ...(tool.mode === 'swissPremiumReduction' ? swissPremiumReductionTranslationsByLocale[locale.key] ?? {} : {}),
    ...((Object.hasOwn(remainingToolsEnglish, tool.mode) || tool.mode === 'resumeStructure' || tool.mode === 'vocalRemover' || finalCandidateModes.has(tool.mode)) ? finalCandidateTranslationsByLocale[locale.key] ?? {} : {}),
    ...((Object.hasOwn(remainingToolsEnglish, tool.mode) || tool.mode === 'resumeStructure' || tool.mode === 'vocalRemover' || finalCandidateModes.has(tool.mode)) ? finalCandidateTranslationOverridesByLocale[locale.key] ?? {} : {}),
  };
  copy = translate(copy, dictionary);
  if (tool.mode === 'warCardGame') {
    const cardTerms = presidentCardGameTranslationsByLocale[locale.key] ?? {};
    copy.fields = {
      ...copy.fields,
      suit0: cardTerms.Spades ?? 'Spades', suit1: cardTerms.Hearts ?? 'Hearts',
      suit2: cardTerms.Diamonds ?? 'Diamonds', suit3: cardTerms.Clubs ?? 'Clubs',
    };
  }
  if (tool.mode === 'amerikanerCardGame') {
    const cardTerms = presidentCardGameTranslationsByLocale[locale.key] ?? {};
    copy.fields = {
      ...copy.fields,
      spades: cardTerms.Spades ?? copy.fields.spades, hearts: cardTerms.Hearts ?? copy.fields.hearts,
      diamonds: cardTerms.Diamonds ?? copy.fields.diamonds, clubs: cardTerms.Clubs ?? copy.fields.clubs,
      jack: cardTerms.Jack ?? copy.fields.jack, queen: cardTerms.Queen ?? copy.fields.queen,
      king: cardTerms.King ?? copy.fields.king, ace: cardTerms.Ace ?? copy.fields.ace,
    };
  }
  const route = (entry) => `${baseOrigin}${entry.prefix}/tools/${tool.id}/`;
  const canonical = route(locale);
  const langLinks = locales.map((entry) => `<a lang="${escape(entry.code)}" href="${escape(route(entry))}">${escape(entry.name)}</a>`).join('');
  const faq = (copy.faq ?? copy.fields?.faq ?? []).map(({ q, a }) => `<details><summary>${escape(q)}</summary><p>${escape(a)}</p></details>`).join('');
  const mainSiteLocalePrefix = locale.key === 'nb' ? '' : (locale.prefix ?? '');
  const linkHtml = tool.related.map((id) => {
    const candidate = marketTools.find((item) => item.id === id);
    if (candidate) {
      const label = dictionary[candidate.name] ?? candidate.name;
      return `<a href="${escape(`${baseOrigin}${locale.prefix ?? ''}/tools/${id}/`)}">${escape(label)}</a>`;
    }
    const existing = baseTools.find((candidate) => candidate.id === id);
    const label = existing ? localizedTool(existing, locale.key).shortTitle : id.replaceAll('-', ' ');
    return `<a href="https://usefulverse.com${mainSiteLocalePrefix}/tools/${escape(id)}/">${escape(label)}</a>`;
  }).join(' · ');
  let form = formFor(tool.mode, copy);
  if (tool.mode === 'swissQrBill') form += '<p class="source-links"><a href="https://www.six-group.com/en/products-services/banking-services/payment-standardization/standards/qr-bill.html" target="_blank" rel="noopener noreferrer">SIX · Swiss QR-bill standard</a></p>';
  if (tool.mode === 'jass') form += `<p class="source-links">${escape(copy.fields.source)}: <a href="https://www.swisslos.ch/en/jass/informations/jass-rules/schieber-jass.html" target="_blank" rel="noopener noreferrer">${escape(copy.fields.swisslos)}</a> · <a href="https://static.swisslos.ch/media/en/swisslos/jass/ssm/official-rules-swiss-schieber-championship.pdf" target="_blank" rel="noopener noreferrer">${escape(copy.fields.tournamentRules)}</a></p>`;
  // The natal-chart controller only needs field labels and result copy. Keep
  // the embedded payload narrow so dictionaries for unrelated tools cannot
  // leak into this route or inflate every localized HTML response.
  const json = safeJson(tool.mode === 'natalChart' ? { fields: copy.fields } : copy);
  return `<!doctype html><html lang="${escape(locale.code)}" dir="${locale.rtl ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${escape(copy.description)}"><meta name="robots" content="index,follow"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="canonical" href="${escape(canonical)}"><link rel="alternate" hreflang="x-default" href="${escape(route(locales.find((item) => item.key === 'en')))}">${locales.map((entry) => `<link rel="alternate" hreflang="${escape(entry.code)}" href="${escape(route(entry))}">`).join('')}<link rel="stylesheet" href="/assets/markets-no-ch.css"><title>${escape(copy.title)}</title></head><body><header class="top"><a class="brand" href="/">${escape(copy.siteName)}</a><details class="language"><summary>${escape(copy.language)}: ${escape(locale.name)}</summary><nav>${langLinks}</nav></details></header><main data-market-tool="${escape(tool.mode)}"><p class="eyebrow">${escape(copy.freeBadge)}</p><h1>${escape(copy.name)}</h1><p class="intro">${escape(copy.intro)}</p><p class="privacy">${escape(copy.privacy)}</p><section class="panel" aria-labelledby="use-tool"><h2 id="use-tool">${escape(copy.useTool)}</h2>${form}<script type="application/json" data-tool-copy>${json}</script></section><section class="content"><h2>${escape(copy.exampleHeading)}</h2><p>${escape(copy.example)}</p><h2>${escape(copy.howItWorks)}</h2><p>${escape(copy.details)}</p><h2>${escape(copy.faqHeading)}</h2>${faq}<h2>${escape(copy.limitsHeading)}</h2><p>${escape(copy.limits)}</p></section><aside><h2>${escape(copy.related)}</h2><p>${linkHtml}</p></aside></main><footer><a href="/">${escape(copy.home)}</a> · ${escape(copy.siteName)}</footer><script type="module" src="/assets/controller.mjs" defer></script></body></html>`;
}

export const marketFormModes = Object.freeze(Object.fromEntries(marketTools.map(({ id, mode }) => [id, mode])));
