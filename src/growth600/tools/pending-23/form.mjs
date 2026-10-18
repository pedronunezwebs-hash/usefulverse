const escaped = (value) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

const field = (id, key, type = 'text', extra = {}) => ({ id, key, type, ...extra });
const schemas = {
  'sunrise-sunset-calculator': [field('date','date','date',{value:'2026-06-21'}),field('latitude','latitude','number',{value:'40.4168',min:-90,max:90,step:'any'}),field('longitude','longitude','number',{value:'-3.7038',min:-180,max:180,step:'any'}),field('timeZone','timeZone','text',{value:'Europe/Madrid',maxLength:80})],
  'moonrise-moonset-calculator': [field('date','date','date',{value:'2026-06-21'}),field('latitude','latitude','number',{value:'40.4168',min:-90,max:90,step:'any'}),field('longitude','longitude','number',{value:'-3.7038',min:-180,max:180,step:'any'}),field('timeZone','timeZone','text',{value:'Europe/Madrid',maxLength:80})],
  'persian-calendar-converter': [field('mode','mode','select',{options:[['to-persian','toPersian'],['to-gregorian','toGregorian']]}),field('date','date','date',{value:'2024-03-20'}),field('persianYear','persianYear','number',{value:1403,min:1,max:3000}),field('persianMonth','persianMonth','number',{value:1,min:1,max:12}),field('persianDay','persianDay','number',{value:1,min:1,max:31})],
  'project-risk-matrix': [field('rows','rows','textarea',{value:'Late supplier | 3 | 4\nPrice change | 2 | 5',rows:7})],
  'org-chart-maker': [field('rows','rows','textarea',{value:'CEO |\nSales | CEO\nOperations | CEO',rows:7})],
  'sankey-diagram-generator': [field('rows','rows','textarea',{value:'Revenue | Costs | 40\nRevenue | Profit | 60',rows:7})],
  'event-budget-calculator': [field('rows','rows','textarea',{value:'Venue | 1000 | 900\nFood | 500 | 620',rows:7})],
  'decision-tree-maker': [field('rows','rows','textarea',{value:'Need speed? | Choose the faster option | Within budget?\nWithin budget? | Choose the faster option | Find another option',rows:7})],
  'shift-scheduler': [field('rows','rows','textarea',{value:'Alex | 1 | 09:00 | 17:00\nSam | 2 | 10:00 | 18:00',rows:7})],
  'subscription-tracker': [field('rows','rows','textarea',{value:'Music | 10 | monthly\nNews | 60 | yearly',rows:7})],
  'radar-chart-maker': [field('rows','rows','textarea',{value:'Speed | 80\nCost | 60\nQuality | 95\nSupport | 75',rows:7})],
  'packing-box-calculator': [field('boxLength','boxLength','number',{value:40,min:0.001,step:'any'}),field('boxWidth','boxWidth','number',{value:30,min:0.001,step:'any'}),field('boxHeight','boxHeight','number',{value:20,min:0.001,step:'any'}),field('itemLength','itemLength','number',{value:10,min:0.001,step:'any'}),field('itemWidth','itemWidth','number',{value:10,min:0.001,step:'any'}),field('itemHeight','itemHeight','number',{value:10,min:0.001,step:'any'})],
  'car-running-cost-calculator': [field('distance','distance','number',{value:12000,min:0,max:2000000,step:'any'}),field('fuelEfficiency','fuelEfficiency','number',{value:7,min:0.01,step:'any'}),field('fuelPrice','fuelPrice','number',{value:1.8,min:0,step:'any'}),field('maintenancePerDistance','maintenancePerDistance','number',{value:0.08,min:0,step:'any'}),field('insurancePerYear','insurancePerYear','number',{value:600,min:0,step:'any'}),field('taxPerYear','taxPerYear','number',{value:100,min:0,step:'any'})],
  'bra-size-calculator': [field('underbust','underbust','number',{value:75,min:40,max:180,step:'any'}),field('bust','bust','number',{value:90,min:40,max:200,step:'any'}),field('unit','unit','select',{options:[['cm','centimeters'],['in','inches']]}),field('system','system','select',{options:[['US','usSystem'],['UK','ukSystem']]})],
  'logo-maker': [field('text','logoText','text',{value:'UsefulVerse',maxLength:40}),field('color','foregroundColor','color',{value:'#4257D6'}),field('background','backgroundColor','color',{value:'#F4F5FA'}),field('shape','logoShape','select',{options:[['round','shapeRound'],['square','shapeSquare'],['none','shapeNone']]}),field('layout','logoLayout','select',{options:[['inline','layoutInline'],['stacked','layoutStacked']]})],
  'writing-prompt-generator': [field('genre','genre','select',{options:[['any','genreAny'],['fantasy','genreFantasy'],['mystery','genreMystery'],['sciFi','genreSciFi'],['romance','genreRomance']]}),field('seed','seed','text',{value:'',maxLength:100})],
  'color-palette-from-image': [field('file','imageFile','file',{accept:'image/*'})],
  'text-summarizer': [field('text','text','textarea',{value:'A useful tool should solve one clear task. It should explain what it does and show its assumptions. Simple browser tools can help people finish everyday work. They should keep private text on the device and provide a clear result.',rows:9,maxLength:100000}),field('maxSentences','maxSentences','number',{value:3,min:1,max:10})],
  'speed-reading-app': [field('text','text','textarea',{value:'Paste or write a passage here. Start the reader when you are ready. You can pause at any time and continue from the same word.',rows:8,maxLength:50000}),field('wpm','wpm','number',{value:300,min:60,max:1500})],
  'mockup-generator': [field('file','imageFile','file',{accept:'image/*'}),field('frame','frame','select',{options:[['phone','phoneFrame'],['browser','browserFrame']]}),field('background','backgroundColor','color',{value:'#E8ECF5'})],
  'acrostic-poem-maker': [field('keyword','keyword','text',{value:'MOON',maxLength:40}),field('words','wordSuggestions','textarea',{value:'Magic\nOpen\nOrbit\nNight',rows:6,maxLength:5000})],
  'word-frequency-counter': [field('text','text','textarea',{value:'Alpha beta alpha gamma beta alpha',rows:9,maxLength:250000}),field('limit','resultLimit','number',{value:50,min:1,max:500})],
  'image-histogram': [field('file','imageFile','file',{accept:'image/*'})],
};

export const pendingToolIds = Object.freeze(Object.keys(schemas));

export function renderPendingToolForm(toolId, copy) {
  const schema = schemas[toolId];
  if (!schema) throw new Error(`No form schema for ${toolId}.`);
  const values = copy?.fields ?? {};
  const inputs = schema.map((item) => {
    const id = `${toolId}-${item.id}`;
    let control;
    if (item.type === 'textarea') control = `<textarea id="${id}" name="${item.id}" data-input="${item.id}" rows="${item.rows ?? 4}" maxlength="${item.maxLength ?? 100000}">${escaped(item.value)}</textarea>`;
    else if (item.type === 'select') control = `<select id="${id}" name="${item.id}" data-input="${item.id}">${item.options.map(([value,key]) => `<option value="${escaped(value)}">${escaped(values[key])}</option>`).join('')}</select>`;
    else {
      const attrs = [`type="${item.type}"`,`id="${id}"`,`name="${item.id}"`,`data-input="${item.id}"`];
      if (item.value !== undefined) attrs.push(`value="${escaped(item.value)}"`);
      if (item.min !== undefined) attrs.push(`min="${item.min}"`);
      if (item.max !== undefined) attrs.push(`max="${item.max}"`);
      if (item.step !== undefined) attrs.push(`step="${escaped(item.step)}"`);
      if (item.maxLength !== undefined) attrs.push(`maxlength="${item.maxLength}"`);
      if (item.accept !== undefined) attrs.push(`accept="${escaped(item.accept)}"`);
      control = `<input ${attrs.join(' ')}>`;
    }
    return `<div class="field"><label for="${id}">${escaped(values[item.key])}</label>${control}</div>`;
  }).join('');
  const actions = copy?.actions ?? {};
  return `<section class="pending-tool" data-pending-tool="${toolId}"><form data-pending-form novalidate><div class="calculator-grid">${inputs}</div><p class="hint" data-tool-note>${escaped(values.accuracyNote)}</p><div class="actions"><button type="submit" class="button button--primary" data-action="run">${escaped(actions.run)}</button>${['color-palette-from-image','image-histogram','mockup-generator'].includes(toolId) ? '' : `<button type="button" class="button button--secondary" data-action="example">${escaped(actions.example)}</button>`}<button type="reset" class="button button--secondary">${escaped(actions.reset)}</button></div></form><div class="pending-result" data-result aria-live="polite"><h2>${escaped(values.resultTitle)}</h2><div data-result-content></div><p class="status" data-status role="status" aria-live="polite"></p></div></section>`;
}
