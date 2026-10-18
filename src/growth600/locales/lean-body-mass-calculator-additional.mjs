import translatedRows from './lean-body-mass-calculator-translated-rows.mjs';

function makeTranslatedCopy(copyLanguage, values, titleOverride) {
  if (values.length !== 38 || values.some((value) => !value)) throw new Error(`Incomplete Lean Body Mass translation: ${copyLanguage}`);
  const [name, rawTitle, rawDescription, intro, howQuestion, howAnswer, privacyQuestion, privacyAnswer,
    method, directMethod, boerMethod, equationSet, maleEquation, femaleEquation, weight, height,
    bodyFatPercent, unitSystem, metric, imperial, result, fatMass, formula, sourceBoer, accuracyNote,
    calculate, example, reset, resultAction, calculated, checkInputs, resultMessage,
    faq1Question, faq1Answer, faq2Question, faq2Answer, faq3Question, faq3Answer] = values;
  const title = titleOverride ?? (copyLanguage === 'es' ? 'Calculadora de masa magra gratis | UsefulVerse'
    : copyLanguage === 'fr' ? 'Calculateur de masse maigre gratuit | UsefulVerse'
      : 'Calculadora de massa magra grátis | UsefulVerse');
  const description = rawDescription.length <= 160 ? rawDescription : `${rawDescription.slice(0, 157).replace(/\s+\S*$/u, '').trimEnd()}…`;
  return Object.freeze({
    copyLanguage, name, title, description, intro, howQuestion, howAnswer, privacyQuestion, privacyAnswer,
    fields: { method, directMethod, boerMethod, equationSet, maleEquation, femaleEquation, weight, height, bodyFatPercent, unitSystem, metric, imperial, result, fatMass, formula, directFormula: 'LBM = W × (1 − BF% ÷ 100)', boerMaleFormula: 'LBM = 0.407W (kg) + 0.267H (cm) − 19.2', boerFemaleFormula: 'LBM = 0.252W (kg) + 0.473H (cm) − 48.3', sourceBoer, accuracyNote },
    actions: { calculate, example, reset, result: resultAction },
    messages: { calculated, checkInputs, result: resultMessage.replace('UVTOKENfatMassX', '{fatMass}').replace('UVTOKENMassX', '{fatMass}').replace('UVTOKENunitX', '{unit}').replace('UVTOKENleanPercentX', '{leanPercent}') },
    additionalFaqs: [
      { question: faq1Question, answer: faq1Answer },
      { question: faq2Question, answer: faq2Answer },
      { question: faq3Question, answer: faq3Answer },
    ],
  });
}

function fitTranslatedTitle(rawTitle) {
  const suffix = ' | UsefulVerse';
  const maximum = 60 - suffix.length;
  let prefix = rawTitle.split('|')[0].trim();
  if (prefix.length > maximum) prefix = prefix.slice(0, maximum).replace(/\s+\S*$/u, '').trim();
  return `${prefix.replace(/[,:;–—-]+$/u, '').trim()}${suffix}`;
}

const translatedCopies = Object.fromEntries(Object.entries(translatedRows).map(([locale, rows]) => [
  locale,
  makeTranslatedCopy(locale, rows, fitTranslatedTitle(rows[1])),
]));

const spanishCopy = makeTranslatedCopy('es', [
  'Calculadora de masa corporal magra',
  'Calculadora de masa corporal magra: gratuita e ilimitada | UsefulVerse',
  'Estima la masa corporal magra y la masa grasa a partir del porcentaje de grasa corporal o mediante la ecuación de Boer. Calculadora local gratuita con límites claros.',
  'Elige entre un cálculo directo basado en un porcentaje de grasa corporal que ya conozcas o una estimación mediante la ecuación publicada de Boer (basada en altura y peso). Consulta el método y las premisas.',
  '¿Cómo calculo la masa corporal magra?',
  'Si conoces el porcentaje de grasa corporal, la masa magra se obtiene multiplicando el peso corporal por la diferencia entre uno y dicho porcentaje. De lo contrario, la estimación de Boer utiliza una ecuación específica según el sexo, basada en el peso y la altura. Los resultados son estimaciones, no una medición de la composición corporal.',
  '¿Es privada esta calculadora de masa corporal magra?',
  'Sí. El cálculo se realiza en tu navegador. Los datos de peso, altura y porcentaje de grasa corporal que introduces no se suben a ningún servidor ni se guardan.',
  'Método de cálculo', 'Usar porcentaje de grasa corporal conocido', 'Estimar mediante la ecuación de Boer', 'Ecuación de Boer', 'Ecuación para hombres', 'Ecuación para mujeres', 'Peso corporal', 'Estatura', 'Porcentaje de grasa corporal', 'Unidades', 'Sistema métrico (kg, cm)', 'Sistema imperial (lb, in)', 'Masa corporal magra estimada', 'Masa grasa estimada', 'Fórmula utilizada', 'Artículo de Boer (1984) en PubMed',
  'Las estimaciones varían según el método y la persona. La ecuación de Boer es una regresión poblacional, no una medición directa. Estimación válida solo para adultos; no apta para niños ni durante el embarazo, y no constituye asesoramiento médico. Consulte a un profesional de la salud cualificado sobre decisiones relacionadas con la salud.',
  'Calcular', 'Cargar ejemplo', 'Restablecer', 'Resultado del cálculo', 'Estimación calculada.', 'Revise los valores y el método seleccionado.',
  'Masa grasa: UVTOKENfatMassX UVTOKENunitX. Masa magra: UVTOKENleanPercentX%.',
  '¿Cuál es la diferencia entre masa magra y masa grasa?', 'Esta calculadora considera la masa magra como el peso corporal menos la masa grasa estimada según el método seleccionado. No mide únicamente el músculo ni separa todos los componentes tisulares.',
  '¿Qué estima la ecuación de Boer?', 'Estima la masa corporal magra a partir de la estatura y el peso, utilizando una ecuación publicada para hombres o mujeres. Puede diferir de una medición individual, por lo que debe considerarse una estimación aproximada.',
  '¿Puedo utilizar este resultado como consejo médico?', 'No. El resultado es una estimación y no constituye un diagnóstico ni una recomendación de tratamiento. Está destinado a adultos; no es aplicable a niños ni a casos de embarazo. Consulte a un profesional de la salud cualificado sobre decisiones relacionadas con su salud personal.',
]);

const frenchCopy = makeTranslatedCopy('fr', [
  'Calculateur de masse maigre', 'Calculateur de masse maigre gratuit et illimité | UsefulVerse',
  "Estimez la masse maigre et la masse grasse à partir du taux de graisse corporelle ou de l'équation de Boer. Calculateur local gratuit avec des limites clairement indiquées.",
  "Choisissez entre un calcul direct basé sur un taux de graisse corporelle connu ou une estimation utilisant l'équation de Boer (basée sur la taille et le poids). Consultez la méthode et les hypothèses.",
  'Comment calculer la masse maigre ?',
  'Si vous connaissez votre taux de graisse corporelle, la masse maigre correspond au poids total multiplié par (1 moins ce taux). Sinon, l’estimation de Boer utilise une équation spécifique au sexe basée sur le poids et la taille. Les résultats sont des estimations et non une mesure précise de la composition corporelle.',
  'Ce calculateur de masse maigre garantit-il la confidentialité ?',
  'Oui. Le calcul s’effectue directement dans votre navigateur. Vos données de poids, de taille et de taux de graisse corporelle ne sont ni transmises ni enregistrées.',
  'Méthode de calcul', 'Utiliser le taux de graisse corporelle connu', 'Estimation via l’équation de Boer', 'Équation de Boer', 'Équation pour les hommes', 'Équation pour les femmes', 'Poids corporel', 'Taille', 'Taux de graisse corporelle', 'Unités', 'Métriques (kg, cm)', 'Impériales (lb, in)', 'Masse maigre estimée', 'Masse grasse estimée', 'Formule utilisée', 'Article de Boer (1984) sur PubMed',
  'Les estimations varient selon la méthode et la personne. L’équation de Boer repose sur une régression de population et ne constitue pas une mesure directe. Estimation pour adultes uniquement ; ne convient pas aux enfants ni aux femmes enceintes et ne constitue pas un avis médical. Consultez un professionnel de santé qualifié pour toute décision concernant votre santé.',
  'Calculer', 'Charger un exemple', 'Réinitialiser', 'Résultat du calcul', 'Estimation calculée.', 'Vérifiez les valeurs et la méthode sélectionnée.',
  'Masse grasse : UVTOKENfatMassX UVTOKENunitX. Masse maigre : UVTOKENleanPercentX%.',
  'Quelle est la différence entre la masse maigre et la masse grasse ?', 'Ce calculateur définit la masse maigre comme le poids corporel moins la masse grasse estimée selon la méthode choisie. Il ne mesure pas uniquement le muscle et ne distingue pas chaque composant tissulaire.',
  'Que permet d’estimer l’équation de Boer ?', 'Elle estime la masse maigre à partir de la taille et du poids, en utilisant une équation publiée spécifique aux hommes ou aux femmes. Le résultat pouvant différer d’une mesure individuelle, considérez-le comme une estimation approximative.',
  'Puis-je utiliser ce résultat comme avis médical ?', 'Non. Ce résultat est une estimation et ne constitue ni un diagnostic ni une recommandation de traitement. Il est destiné aux adultes et ne s’applique pas aux enfants ni aux femmes enceintes. Consultez un professionnel de santé qualifié pour toute décision concernant votre santé.',
]);

const portugueseCopy = makeTranslatedCopy('pt', [
  'Calculadora de massa corporal magra', 'Calculadora de Massa Corporal Magra Gratuita e Ilimitada | UsefulVerse',
  'Estime a massa corporal magra e a massa gorda a partir do percentual de gordura corporal ou da equação de Boer. Calculadora local gratuita com limites claros.',
  'Escolha entre um cálculo direto baseado em um percentual de gordura corporal que você já possui ou uma estimativa pela equação de Boer (que utiliza altura e peso). Veja o método e as premissas.',
  'Como calculo a massa corporal magra?',
  'Se você souber o percentual de gordura corporal, a massa magra é o peso corporal multiplicado por um menos esse percentual. Caso contrário, a estimativa de Boer utiliza uma equação específica para o sexo, com base no peso e na altura. Os resultados são estimativas, não uma medição da composição corporal.',
  'Esta calculadora de massa corporal magra é privada?',
  'Sim. O cálculo é realizado no seu navegador. Seus dados de peso, altura e percentual de gordura corporal não são enviados para servidores nem salvos.',
  'Método de cálculo', 'Usar percentual de gordura corporal conhecido', 'Estimar com a equação de Boer', 'Equação de Boer', 'Equação para homens', 'Equação para mulheres', 'Peso corporal', 'Altura', 'Percentual de gordura corporal', 'Unidades', 'Métrico (kg, cm)', 'Imperial (lb, pol)', 'Massa corporal magra estimada', 'Massa gorda estimada', 'Fórmula utilizada', 'Artigo de Boer (1984) no PubMed',
  'As estimativas variam de acordo com o método e a pessoa. A equação de Boer é uma regressão populacional, não uma medição direta. Estimativa apenas para adultos; não se aplica a crianças ou gestantes e não constitui aconselhamento médico. Consulte um profissional de saúde qualificado sobre decisões relacionadas à saúde.',
  'Calcular', 'Carregar exemplo', 'Reiniciar', 'Resultado do cálculo', 'Estimativa calculada.', 'Verifique os valores e o método selecionado.',
  'Massa gorda: UVTOKENfatMassX UVTOKENunitX. Massa magra: UVTOKENleanPercentX%.',
  'Qual é a diferença entre massa magra e massa gorda?', 'Esta calculadora considera a massa magra como o peso corporal menos a massa gorda estimada pelo método selecionado. Ela não mede apenas o músculo nem separa todos os componentes teciduais.',
  'O que a equação de Boer estima?', 'Ela estima a massa corporal magra a partir da altura e do peso, utilizando uma equação publicada para homens ou mulheres. O resultado pode diferir de uma medição individual; portanto, considere-o como uma estimativa aproximada.',
  'Posso usar este resultado como orientação médica?', 'Não. O resultado é uma estimativa e não constitui diagnóstico ou recomendação de tratamento. Destina-se a adultos, não sendo aplicável a crianças ou gestantes. Consulte um profissional de saúde qualificado sobre decisões relacionadas à sua saúde.',
]);

const tagalogCopy = makeTranslatedCopy('tl', [
  'Calculator ng Lean Body Mass', 'Calculator ng Lean Body Mass Libre, Walang Limitasyon | UsefulVerse',
  'Tantyahin ang lean body mass at fat mass mula sa porsyento ng body-fat o ang equation ng Boer. Libreng lokal na calculator na may malinaw na mga limitasyon.',
  'Pumili ng direktang kalkulasyon mula sa porsyento ng body-fat na mayroon ka na, o isang pagtatantya mula sa nailathalang equation ng taas at timbang ng Boer. Tingnan ang pamamaraan at mga pagpapalagay.',
  'Paano ko kakalkulahin ang lean body mass?',
  'Kung alam mo ang porsyento ng body-fat, ang lean mass ay ang timbang ng katawan na pinarami ng isa binawasan ng porsyentong iyon. Kung hindi, ang pagtatantya ng Boer ay gumagamit ng equation na partikular sa kasarian na may timbang at taas. Ang mga resulta ay mga pagtatantya, hindi isang pagsukat ng komposisyon ng katawan.',
  'Pribado ba ang lean body mass calculator na ito?',
  'Oo. Ang kalkulasyon ay tumatakbo sa iyong browser. Ang iyong timbang, taas at body-fat entry ay hindi na-upload o na-save.',
  'Paraan ng pagkalkula', 'Gamitin ang kilalang porsyento ng taba sa katawan', 'Tantyahin gamit ang ekwasyon ng Boer', 'Set ng ekwasyon ng Boer', 'Ekwasyon ng kalalakihan', 'Ekwasyon ng kababaihan', 'Timbang ng katawan', 'Taas', 'Porsyento ng taba sa katawan', 'Mga Yunit', 'Sukatan (kg, cm)', 'Imperial (lb, in)', 'Tinatayang lean body mass', 'Tinatayang fat mass', 'Pormularyo na ginamit', 'Papel ni Boer (1984) sa PubMed',
  'Nag-iiba ang mga pagtatantya depende sa pamamaraan at tao. Ang equation ni Boer ay isang population regression, hindi isang direktang pagsukat. Pagtatantya lamang para sa nasa hustong gulang; hindi para sa mga bata o pagbubuntis at hindi medikal na payo. Magtanong sa isang kwalipikadong clinician tungkol sa mga desisyon sa kalusugan.',
  'Kalkulahin ang', 'I-load ang halimbawa', 'I-reset ang', 'Resulta ng pagkalkula', 'Tinantyang nakalkula.', 'Suriin ang mga halaga at ang napiling pamamaraan.',
  'Mass ng taba: UVTOKENMassX UVTOKENunitX. Lean mass: UVTOKENleanPercentX%.',
  'Ano ang pagkakaiba sa pagitan ng lean mass at fat mass?', 'Tinatrato ng calculator na ito ang lean mass bilang timbang ng katawan na binawasan ng tinantyang mass ng taba para sa napiling pamamaraan. Hindi nito sinusukat ang kalamnan nang mag-isa o pinaghihiwalay ang bawat bahagi ng tisyu.',
  'Ano ang tinatantya ng Boer equation?', 'Tinatantya nito ang lean body mass mula sa taas at timbang gamit ang isang nailathalang set ng equation para sa mga kalalakihan o kababaihan. Maaari itong magkaiba sa isang indibidwal na sukat, kaya ituring ito bilang isang magaspang na pagtatantya.',
  'Maaari ko bang gamitin ang resultang ito bilang medikal na payo?', 'Hindi. Ang resulta ay isang pagtatantya at hindi isang rekomendasyon sa diagnosis o paggamot. Ito ay inilaan para sa mga matatanda, hindi para sa mga bata o pagbubuntis. Magtanong sa isang kwalipikadong propesyonal sa pangangalagang pangkalusugan tungkol sa mga personal na desisyon sa kalusugan.',
], 'Kalkulator ng Lean Body Mass libre | UsefulVerse');

const germanCopy = makeTranslatedCopy('de', [
  'Rechner für die fettfreie Körpermasse', 'Kostenloser, unbegrenzter Rechner für die fettfreie Körpermasse | UsefulVerse',
  'Schätzen Sie die fettfreie Körpermasse und die Fettmasse anhand des Körperfettanteils oder der Boer-Formel. Kostenloser, lokal funktionierender Rechner mit klar definierten Grenzen.',
  'Wählen Sie zwischen einer direkten Berechnung auf Basis eines bereits bekannten Körperfettanteils oder einer Schätzung mithilfe der veröffentlichten Boer-Formel (basierend auf Körpergröße und Gewicht). Informieren Sie sich über die Methode und die zugrunde liegenden Annahmen.',
  'Wie berechne ich die fettfreie Körpermasse?',
  'Wenn der Körperfettanteil bekannt ist, ergibt sich die fettfreie Masse aus dem Körpergewicht multipliziert mit dem Wert „1 minus Körperfettanteil“. Andernfalls verwendet die Boer-Schätzung eine geschlechtsspezifische Formel, die Gewicht und Körpergröße einbezieht. Die Ergebnisse sind Schätzwerte und keine exakte Messung der Körperzusammensetzung.',
  'Ist die Nutzung dieses Rechners für die fettfreie Körpermasse privat?',
  'Ja. Die Berechnung erfolgt direkt in Ihrem Browser. Ihre Angaben zu Gewicht, Körpergröße und Körperfettanteil werden weder hochgeladen noch gespeichert.',
  'Berechnungsmethode', 'Bekannten Körperfettanteil verwenden', 'Schätzung mittels Boer-Gleichung', 'Boer-Gleichung', 'Gleichung für Männer', 'Gleichung für Frauen', 'Körpergewicht', 'Körpergröße', 'Körperfettanteil', 'Einheiten', 'Metrisch (kg, cm)', 'Imperial (lb, in)', 'Geschätzte fettfreie Körpermasse', 'Geschätzte Fettmasse', 'Verwendete Formel', 'Boer (1984) Publikation auf PubMed',
  'Die Schätzwerte variieren je nach Methode und Person. Die Boer-Gleichung basiert auf einer Regressionsanalyse der Bevölkerung und stellt keine direkte Messung dar. Schätzung nur für Erwachsene; nicht für Kinder oder Schwangere geeignet und keine medizinische Beratung. Konsultieren Sie bei gesundheitsbezogenen Entscheidungen eine qualifizierte medizinische Fachkraft.',
  'Berechnen', 'Beispiel laden', 'Zurücksetzen', 'Berechnungsergebnis', 'Schätzwert berechnet.', 'Überprüfen Sie die Werte und die gewählte Methode.',
  'Fettmasse: UVTOKENfatMassX UVTOKENunitX. Fettfreie Masse: UVTOKENleanPercentX%.',
  'Was ist der Unterschied zwischen fettfreier Masse und Fettmasse?', 'Dieser Rechner definiert die fettfreie Masse als Körpergewicht abzüglich der für die gewählte Methode geschätzten Fettmasse. Er misst nicht allein die Muskelmasse und differenziert auch nicht zwischen allen einzelnen Gewebebestandteilen.',
  'Was schätzt die Boer-Gleichung?', 'Sie schätzt die fettfreie Körpermasse anhand von Körpergröße und Gewicht mithilfe einer veröffentlichten Formel für Männer oder Frauen. Da das Ergebnis von einer individuellen Messung abweichen kann, sollte es als grobe Schätzung betrachtet werden.',
  'Kann ich dieses Ergebnis als medizinischen Rat verwenden?', 'Nein. Das Ergebnis ist eine Schätzung und stellt weder eine Diagnose noch eine Behandlungsempfehlung dar. Es ist für Erwachsene gedacht, nicht für Kinder oder Schwangere. Wenden Sie sich bei Fragen zu persönlichen Gesundheitsentscheidungen an qualifiziertes medizinisches Fachpersonal.',
], 'Rechner für fettfreie Masse kostenlos | UsefulVerse');

const japaneseCopy = makeTranslatedCopy('ja', [
  '除脂肪体重計算ツール', '無料・無制限の除脂肪体重計算ツール | UsefulVerse',
  '体脂肪率またはBoer（ブール）の式を用いて、除脂肪体重と体脂肪量を推定します。 利用条件が明確な、無料のローカル計算ツールです。',
  '既知の体脂肪率から直接計算する方法か、Boerが発表した身長・体重に基づく式から推定する方法かを選択できます。 計算方法や前提条件もご確認ください。',
  '除脂肪体重はどのように計算するのですか？',
  '体脂肪率がわかっている場合、除脂肪体重は「体重 × (1 - 体脂肪率)」で求められます。 体脂肪率が不明な場合は、体重と身長を用いたBoerの推定式（性別により異なります）を使用します。 算出される結果は推定値であり、精密な体組成測定ではありません。',
  'この除脂肪体重計算ツールはプライバシーが保護されていますか？',
  'はい。 計算はブラウザ上で行われます。 入力された体重、身長、体脂肪率のデータがアップロードされたり、保存されたりすることはありません。',
  '計算方法', '既知の体脂肪率を使用', 'Boer（ボーア）式で推定', 'Boer式の設定', '男性用の式', '女性用の式', '体重', '身長', '体脂肪率', '単位', 'メートル法 (kg, cm)', 'ヤード・ポンド法 (lb, in)', '推定除脂肪体重', '推定体脂肪量', '使用した計算式', 'PubMed掲載のBoer (1984) 論文',
  '推定値は方法や個人によって異なります。 Boer式は集団回帰に基づくものであり、直接測定ではありません。 成人の推定のみを対象としており、小児や妊婦には適用されません。 また、本情報は医学的助言ではありません。 健康に関する判断については、有資格の医療専門家にご相談ください。',
  '計算', '例を読み込む', 'リセット', '計算結果', '推定値が計算されました。', '値と選択した方法を確認してください。',
  '脂肪量：UVTOKENfatMassX UVTOKENunitX。 除脂肪量：UVTOKENleanPercentX%。',
  '除脂肪量と脂肪量の違いは何ですか？', 'この計算機では、除脂肪量を「体重から選択した方法による推定脂肪量を引いたもの」として扱います。 筋肉量のみを測定したり、すべての組織成分を個別に測定したりするものではありません。',
  'Boer（ボーア）の式は何を推定するものですか？', '男女別に公表されている式を用い、身長と体重から除脂肪体重を推定します。 個別の実測値とは異なる場合があるため、あくまで目安としてお考えください。',
  'この結果を医学的なアドバイスとして利用できますか？', 'いいえ。この結果は推定値であり、診断や治療の推奨を行うものではありません。 本計算機は成人を対象としており、小児や妊婦には適用されません。 個人の健康に関する判断については、専門の医療従事者にご相談ください。',
], '除脂肪体重計算 無料 | UsefulVerse');

const koreanCopy = makeTranslatedCopy('ko', [
  '제지방량 계산기', '무료 무제한 제지방량 계산기 | UsefulVerse',
  '체지방률 또는 Boer 공식을 사용하여 제지방량과 체지방량을 추정해 보세요. 명확한 기준을 갖춘 무료 계산기입니다.',
  '이미 알고 있는 체지방률을 이용한 직접 계산 방식이나, 널리 알려진 Boer의 신장 및 체중 공식을 이용한 추정 방식 중 하나를 선택하세요. 계산 방법과 전제 조건을 확인하실 수 있습니다.',
  '제지방량은 어떻게 계산하나요?',
  '체지방률을 알고 있다면, 체중에서 (1 - 체지방률)을 곱하여 제지방량을 구할 수 있습니다. 체지방률을 모르는 경우, Boer 추정 공식을 사용하여 성별, 체중, 신장을 바탕으로 계산합니다. 결과는 추정치이며 정밀한 체성분 측정값은 아닙니다.',
  '이 제지방량 계산기는 개인정보를 보호하나요?',
  '네, 그렇습니다. 계산은 사용자의 브라우저 내에서 이루어집니다. 입력하신 체중, 신장, 체지방률 정보는 서버로 전송되거나 저장되지 않습니다.',
  '계산 방법', '알려진 체지방률 사용', 'Boer 공식을 이용한 추정', 'Boer 공식 설정', '남성용 공식', '여성용 공식', '체중', '신장', '체지방률', '단위', '미터법 (kg, cm)', '야드파운드법 (lb, in)', '추정 제지방량', '추정 체지방량', '사용된 공식', 'PubMed의 Boer(1984) 논문',
  '추정치는 방법과 개인에 따라 다를 수 있습니다. Boer 공식은 직접 측정이 아닌 인구 집단 회귀 분석에 기반한 것입니다. 성인에게만 적용되는 추정치이며, 소아나 임산부에게는 적합하지 않고 의학적 조언에 해당하지 않습니다. 건강 관련 결정은 자격을 갖춘 의료 전문가와 상의하십시오.',
  '계산', '예시 불러오기', '초기화', '계산 결과', '추정치 계산 완료.', '값과 선택한 방법을 확인하십시오.',
  '체지방량: UVTOKENfatMassX UVTOKENunitX. 제지방량: UVTOKENleanPercentX%.',
  '제지방량과 체지방량의 차이는 무엇인가요?', '이 계산기는 선택한 방법에 따른 추정 체지방량을 체중에서 뺀 값을 제지방량으로 간주합니다. 근육량만을 측정하거나 모든 조직 성분을 개별적으로 구분하지는 않습니다.',
  'Boer 공식은 무엇을 추정하나요?', '남성 또는 여성용으로 발표된 공식을 사용하여 키와 체중으로부터 제지방량을 추정합니다. 실제 개별 측정값과는 다를 수 있으므로 대략적인 추정치로만 참고하십시오.',
  '이 결과를 의학적 조언으로 활용할 수 있나요?', '아니요. 이 결과는 추정치일 뿐이며 진단이나 치료 권고가 아닙니다. 성인을 대상으로 하며 어린이나 임산부에게는 적용되지 않습니다. 개인의 건강 관련 결정에 대해서는 자격을 갖춘 의료 전문가와 상담하십시오.',
], '제지방량 계산기 무료 | UsefulVerse');

const indonesianCopy = makeTranslatedCopy('id', [
  'Kalkulator massa tubuh bebas lemak', 'Kalkulator Massa Tubuh Bebas Lemak Gratis & Tanpa Batas | UsefulVerse',
  'Estimasi massa tubuh bebas lemak dan massa lemak berdasarkan persentase lemak tubuh atau rumus Boer. Kalkulator lokal gratis dengan batasan yang jelas.',
  'Pilih antara perhitungan langsung menggunakan persentase lemak tubuh yang sudah Anda miliki, atau estimasi menggunakan rumus Boer (berdasarkan tinggi dan berat badan) yang telah dipublikasikan. Lihat metode dan asumsinya.',
  'Bagaimana cara menghitung massa tubuh bebas lemak?',
  'Jika Anda mengetahui persentase lemak tubuh, massa bebas lemak adalah berat badan dikalikan dengan (1 dikurangi persentase tersebut). Jika tidak, estimasi Boer menggunakan rumus khusus jenis kelamin yang melibatkan berat dan tinggi badan. Hasilnya merupakan estimasi, bukan pengukuran komposisi tubuh yang sebenarnya.',
  'Apakah kalkulator massa tubuh bebas lemak ini menjaga privasi?',
  'Ya. Perhitungan dilakukan di dalam browser Anda. Data berat badan, tinggi badan, dan persentase lemak tubuh yang Anda masukkan tidak diunggah ataupun disimpan.',
  'Metode perhitungan', 'Gunakan persentase lemak tubuh yang diketahui', 'Estimasi dengan persamaan Boer', 'Persamaan Boer', 'Persamaan untuk pria', 'Persamaan untuk wanita', 'Berat badan', 'Tinggi badan', 'Persentase lemak tubuh', 'Satuan', 'Metrik (kg, cm)', 'Imperial (lb, in)', 'Estimasi massa tubuh tanpa lemak', 'Estimasi massa lemak', 'Rumus yang digunakan', 'Makalah Boer (1984) di PubMed',
  'Estimasi bervariasi tergantung metode dan individu. Persamaan Boer merupakan regresi populasi, bukan pengukuran langsung. Hanya untuk estimasi orang dewasa; tidak berlaku untuk anak-anak atau kehamilan, serta bukan merupakan saran medis. Konsultasikan keputusan kesehatan dengan tenaga medis profesional yang kompeten.',
  'Hitung', 'Muat contoh', 'Atur ulang', 'Hasil perhitungan', 'Estimasi telah dihitung.', 'Periksa nilai dan metode yang dipilih.',
  'Massa lemak: UVTOKENfatMassX UVTOKENunitX. Massa bebas lemak: UVTOKENleanPercentX%.',
  'Apa perbedaan antara massa bebas lemak dan massa lemak?', 'Kalkulator ini menganggap massa bebas lemak sebagai berat badan dikurangi estimasi massa lemak untuk metode yang dipilih. Kalkulator ini tidak mengukur otot saja atau memisahkan setiap komponen jaringan.',
  'Apa yang diestimasi oleh persamaan Boer?', 'Persamaan ini mengestimasi massa tubuh bebas lemak berdasarkan tinggi dan berat badan menggunakan persamaan yang telah dipublikasikan untuk pria atau wanita. Hasilnya bisa berbeda dari pengukuran individu, jadi anggaplah ini sebagai estimasi kasar.',
  'Bisakah saya menggunakan hasil ini sebagai saran medis?', 'Tidak. Hasil ini merupakan estimasi dan bukan diagnosis atau rekomendasi pengobatan. Hasil ini ditujukan untuk orang dewasa, bukan anak-anak atau kondisi kehamilan. Konsultasikan dengan tenaga kesehatan profesional yang berkualifikasi mengenai keputusan kesehatan pribadi.',
], 'Kalkulator massa bebas lemak gratis | UsefulVerse');

const hindiCopy = makeTranslatedCopy('hi', [
  'लीन बॉडी मास कैलकुलेटर', 'लीन बॉडी मास कैलकुलेटर - मुफ़्त, अनलिमिटेड | UsefulVerse',
  'बॉडी-फ़ैट प्रतिशत या बोअर इक्वेशन से लीन बॉडी मास और फ़ैट मास का अनुमान लगाएं। साफ़ सीमाओं वाला मुफ़्त लोकल कैलकुलेटर।',
  'अपने पास मौजूद बॉडी-फ़ैट प्रतिशत से सीधे कैलकुलेशन चुनें, या पब्लिश किए गए बोअर हाइट-एंड-वेट इक्वेशन से अनुमान लगाएं। तरीका और मान्यताएं देखें।',
  'मैं लीन बॉडी मास कैसे कैलकुलेट करूं?',
  'अगर आपको बॉडी-फ़ैट प्रतिशत पता है, तो लीन मास का मतलब है बॉडी वेट को एक में से उस प्रतिशत को घटाकर गुणा करना। नहीं तो, बोअर अनुमान में वज़न और ऊंचाई के साथ लिंग-विशिष्ट इक्वेशन का इस्तेमाल किया जाता है। नतीजे अनुमान होते हैं, बॉडी-कंपोज़िशन का माप नहीं।',
  'क्या यह लीन बॉडी मास कैलकुलेटर प्राइवेट है?',
  'हां। कैलकुलेशन आपके ब्राउज़र में होता है। आपका वज़न, ऊंचाई और बॉडी-फ़ैट की जानकारी अपलोड या सेव नहीं की जाती है।',
  'कैलकुलेशन का तरीका', 'ज्ञात बॉडी-फैट प्रतिशत का उपयोग करें', 'बोअर इक्वेशन से अनुमान लगाएं', 'बोअर इक्वेशन सेट', 'पुरुषों के लिए इक्वेशन', 'महिलाओं के लिए इक्वेशन', 'शरीर का वज़न', 'लंबाई', 'बॉडी-फैट प्रतिशत', 'यूनिट्स', 'मीट्रिक (kg, cm)', 'इंपीरियल (lb, in)', 'अनुमानित लीन बॉडी मास', 'अनुमानित फैट मास', 'इस्तेमाल किया गया फ़ॉर्मूला', 'PubMed पर बोअर (1984) का पेपर',
  'अनुमान तरीके और व्यक्ति के अनुसार अलग-अलग हो सकते हैं। बोअर इक्वेशन एक पॉप्युलेशन रिग्रेशन है, न कि सीधा माप। केवल वयस्कों के लिए अनुमान; बच्चों या गर्भावस्था के लिए नहीं और न ही यह मेडिकल सलाह है। स्वास्थ्य संबंधी फैसलों के लिए किसी योग्य डॉक्टर से पूछें।',
  'कैलकुलेट करें', 'उदाहरण लोड करें', 'रीसेट करें', 'कैलकुलेशन का नतीजा', 'अनुमान कैलकुलेट किया गया।', 'वैल्यू और चुने गए तरीके की जाँच करें।',
  'फैट मास: UVTOKENfatMassX UVTOKENunitX। लीन मास: UVTOKENleanPercentX%।',
  'लीन मास और फैट मास में क्या अंतर है?', 'यह कैलकुलेटर चुने गए तरीके के लिए लीन मास को शरीर के वज़न में से अनुमानित फैट मास घटाकर मानता है। यह सिर्फ़ मांसपेशियों को नहीं मापता और न ही हर टिश्यू के हिस्से को अलग-अलग करता है।',
  'बोअर इक्वेशन (Boer equation) क्या अनुमान लगाता है?', 'यह पुरुषों या महिलाओं के लिए पब्लिश किए गए इक्वेशन सेट का इस्तेमाल करके लंबाई और वज़न से लीन बॉडी मास का अनुमान लगाता है। यह किसी व्यक्ति के असल माप से अलग हो सकता है, इसलिए इसे एक मोटे तौर पर अनुमान ही मानें।',
  'क्या मैं इस नतीजे का इस्तेमाल मेडिकल सलाह के तौर पर कर सकता हूँ?', 'नहीं। यह नतीजा एक अनुमान है और यह कोई बीमारी का पता लगाने या इलाज की सलाह नहीं है। यह वयस्कों के लिए है, बच्चों या गर्भावस्था के लिए नहीं। अपनी सेहत से जुड़े फ़ैसलों के लिए किसी क्वालिफ़ाइड हेल्थकेयर प्रोफ़ेशनल से पूछें।',
], 'लीन बॉडी मास कैलकुलेटर मुफ्त | UsefulVerse');

const arabicCopy = makeTranslatedCopy('ar', [
  'حاسبة كتلة الجسم الخالية من الدهون', 'حاسبة كتلة الجسم الخالية من الدهون: مجانية وغير محدودة | UsefulVerse',
  'قم بتقدير كتلة الجسم الخالية من الدهون وكتلة الدهون استناداً إلى نسبة الدهون في الجسم أو معادلة بوير (Boer). حاسبة محلية مجانية ذات نطاقات واضحة.',
  'اختر إما الحساب المباشر بناءً على نسبة الدهون في الجسم المتوفرة لديك، أو التقدير باستخدام معادلة بوير المنشورة التي تعتمد على الطول والوزن. اطلع على الطريقة والافتراضات المستخدمة.',
  'كيف أحسب كتلة الجسم الخالية من الدهون؟',
  'إذا كنت تعرف نسبة الدهون في الجسم، فإن الكتلة الخالية من الدهون تساوي وزن الجسم مضروباً في (1 ناقص تلك النسبة). أما في حال عدم توفرها، فتستخدم معادلة بوير التقديرية التي تعتمد على الجنس والوزن والطول. النتائج عبارة عن تقديرات وليست قياساً دقيقاً لمكونات الجسم.',
  'هل تتمتع حاسبة كتلة الجسم الخالية من الدهون هذه بالخصوصية؟',
  'نعم. تتم عملية الحساب داخل متصفحك؛ حيث لا يتم رفع بيانات الوزن والطول ونسبة الدهون التي تدخلها أو حفظها.',
  'طريقة الحساب', 'استخدام نسبة معروفة للدهون في الجسم', 'التقدير باستخدام معادلة بوير (Boer)', 'معادلة بوير', 'معادلة الرجال', 'معادلة النساء', 'وزن الجسم', 'الطول', 'نسبة الدهون في الجسم', 'الوحدات', 'النظام المتري (كجم، سم)', 'النظام الإمبراطوري (رطل، بوصة)', 'الكتلة الخالية من الدهون المقدرة', 'كتلة الدهون المقدرة', 'الصيغة المستخدمة', 'ورقة بحث بوير (1984) على موقع PubMed',
  'تختلف التقديرات باختلاف الطريقة والشخص. تُعد معادلة بوير نموذجاً للانحدار الإحصائي على مستوى المجموعة السكانية وليست قياساً مباشراً. التقديرات مخصصة للبالغين فقط؛ ولا تنطبق على الأطفال أو حالات الحمل، كما أنها لا تُعد نصيحة طبية. يرجى استشارة أخصائي رعاية صحية مؤهل بشأن القرارات المتعلقة بالصحة.',
  'حساب', 'تحميل مثال', 'إعادة تعيين', 'نتيجة الحساب', 'تم حساب التقدير.', 'تحقق من القيم والطريقة المحددة.',
  'كتلة الدهون: UVTOKENfatMassX UVTOKENunitX. الكتلة الخالية من الدهون: UVTOKENleanPercentX%.',
  'ما الفرق بين الكتلة الخالية من الدهون وكتلة الدهون؟', 'تتعامل هذه الحاسبة مع الكتلة الخالية من الدهون على أنها وزن الجسم مطروحاً منه كتلة الدهون المقدرة وفقاً للطريقة المحددة. وهي لا تقيس العضلات وحدها ولا تفصل بين مكونات الأنسجة المختلفة.',
  'ماذا تُقدِّر معادلة بوير (Boer)؟', 'تُقدِّر هذه المعادلة كتلة الجسم الخالية من الدهون بناءً على الطول والوزن باستخدام معادلة منشورة مخصصة للرجال أو النساء. قد تختلف النتيجة عن القياس الفعلي للفرد، لذا ينبغي اعتبارها تقديراً تقريبياً.',
  'هل يمكنني استخدام هذه النتيجة كنصيحة طبية؟', 'لا. هذه النتيجة عبارة عن تقدير وليست تشخيصاً أو توصية علاجية. وهي مخصصة للبالغين، ولا تنطبق على الأطفال أو حالات الحمل. يُرجى استشارة أخصائي رعاية صحية مؤهل بشأن القرارات المتعلقة بصحتك الشخصية.',
], 'حاسبة كتلة الجسم النحيل مجاناً | UsefulVerse');

const chineseCopy = makeTranslatedCopy('zh', [
  '去脂体重计算器', '免费、无限次使用的去脂体重计算器 | UsefulVerse',
  '根据体脂率或 Boer 公式估算去脂体重和脂肪量。这是一个免费的本地计算工具，使用条件清晰明确。',
  '您可以选择直接利用已知的体脂率进行计算，也可以根据公认的 Boer 身高体重公式进行估算。查看计算方法与假设条件。',
  '如何计算去脂体重？',
  '如果已知体脂率，去脂体重即为总体重乘以（1 减去体脂率）。若无体脂率数据，则采用 Boer 公式，结合性别、体重和身高进行估算。计算结果仅为估算值，并非精确的身体成分测量数据。',
  '使用此去脂体重计算器是否保护隐私？',
  '是的。计算过程在您的浏览器内完成，您输入的体重、身高和体脂率数据不会被上传或保存。',
  '计算方法', '使用已知体脂率', '使用 Boer 方程估算', 'Boer 方程组', '男性方程', '女性方程', '体重', '身高', '体脂率', '单位', '公制 (kg, cm)', '英制 (lb, in)', '估算的去脂体重', '估算的脂肪量', '所用公式', 'PubMed 上的 Boer (1984) 论文',
  '估算结果因方法和个人情况而异。Boer 方程基于群体回归分析，而非直接测量。仅适用于成人估算；不适用于儿童或孕妇，也不构成医疗建议。有关健康方面的决定，请咨询合格的临床医生。',
  '计算', '加载示例', '重置', '计算结果', '估算已完成。', '请检查数值和所选方法。',
  '脂肪量：UVTOKENfatMassX UVTOKENunitX。瘦体重：UVTOKENleanPercentX%。',
  '瘦体重和脂肪量有什么区别？', '该计算器将瘦体重定义为体重减去所选方法估算出的脂肪量。它并不单独测量肌肉，也不会区分每一种组织成分。',
  'Boer 公式估算的是什么？', '它利用针对男性或女性的既定公式，根据身高和体重估算瘦体重。该结果可能与个体实际测量值存在差异，因此请将其视为粗略估算。',
  '我可以将此结果作为医疗建议吗？', '不可以。该结果仅为估算值，并非诊断结果或治疗建议。它适用于成人，不适用于儿童或孕妇。有关个人健康决策，请咨询具备资质的医疗保健专业人员。',
], '去脂体重计算器免费 | UsefulVerse');

const bengaliCopy = makeTranslatedCopy('bn', [
  'লিন বডি মাস ক্যালকুলেটর', 'লিন বডি মাস ক্যালকুলেটর: বিনামূল্যে ও আনলিমিটেড | UsefulVerse',
  'শরীরের চর্বির শতাংশ (body-fat percentage) বা বোয়ার সমীকরণ (Boer equation) ব্যবহার করে লিন বডি মাস এবং ফ্যাট মাস নির্ণয় করুন। এটি একটি বিনামূল্যের ক্যালকুলেটর যা নির্দিষ্ট সীমার ভিত্তিতে কাজ করে।',
  'আপনার জানা শরীরের চর্বির শতাংশ থেকে সরাসরি হিসাব করুন অথবা উচ্চতা ও ওজনের ওপর ভিত্তি করে বোয়ার সমীকরণ ব্যবহার করে আনুমানিক হিসাবটি বেছে নিন। পদ্ধতি এবং এর শর্তাবলি দেখে নিন।',
  'আমি কীভাবে লিন বডি মাস হিসাব করব?',
  'যদি আপনার শরীরের চর্বির শতাংশ জানা থাকে, তবে লিন মাস হলো শরীরের ওজন এবং (১ বিয়োগ চর্বির শতাংশ)-এর গুণফল। অন্যথায়, বোয়ার পদ্ধতি অনুযায়ী উচ্চতা ও ওজন ব্যবহার করে লিঙ্গ-ভিত্তিক সমীকরণের মাধ্যমে হিসাব করা হয়। প্রাপ্ত ফলাফলগুলো আনুমানিক; এগুলো শরীরের গঠনের কোনো সুনির্দিষ্ট পরিমাপ নয়।',
  'এই লিন বডি মাস ক্যালকুলেটরটি কি ব্যক্তিগত গোপনীয়তা বজায় রাখে?',
  'হ্যাঁ। হিসাবটি আপনার ব্রাউজারেই সম্পন্ন হয়। আপনার ওজন, উচ্চতা এবং শরীরের চর্বির শতাংশ সংক্রান্ত তথ্য কোথাও আপলোড বা সংরক্ষণ করা হয় না।',
  'হিসাবের পদ্ধতি', 'জানা শরীরের চর্বির শতাংশ ব্যবহার করুন', 'বোয়ার সমীকরণ দিয়ে অনুমান করুন', 'বোয়ার সমীকরণ সেট', 'পুরুষদের জন্য সমীকরণ', 'মহিলাদের জন্য সমীকরণ', 'শরীরের ওজন', 'উচ্চতা', 'শরীরের চর্বির শতাংশ', 'একক', 'মেট্রিক (কেজি, সেমি)', 'ইম্পেরিয়াল (পাউন্ড, ইঞ্চি)', 'আনুমানিক লিন বডি মাস', 'আনুমানিক চর্বির ভর', 'ব্যবহৃত সূত্র', 'PubMed-এ বোয়ার (১৯৮৪)-এর গবেষণাপত্র',
  'পদ্ধতি এবং ব্যক্তিভেদে অনুমানের তারতম্য হতে পারে। বোয়ার সমীকরণটি সমষ্টিগত পরিসংখ্যানের ওপর ভিত্তি করে তৈরি, এটি কোনো সরাসরি পরিমাপ নয়। এটি শুধুমাত্র প্রাপ্তবয়স্কদের ক্ষেত্রে প্রযোজ্য; শিশু বা গর্ভাবস্থার জন্য নয় এবং এটি কোনো চিকিৎসা পরামর্শও নয়। স্বাস্থ্য সংক্রান্ত সিদ্ধান্তের জন্য একজন যোগ্য চিকিৎসকের পরামর্শ নিন।',
  'গণনা করুন', 'উদাহরণ লোড করুন', 'রিসেট করুন', 'গণনার ফলাফল', 'আনুমানিক হিসাব সম্পন্ন হয়েছে।', 'মান এবং নির্বাচিত পদ্ধতিটি যাচাই করুন।',
  'চর্বির পরিমাণ: UVTOKENfatMassX UVTOKENunitX। লিন মাস: UVTOKENleanPercentX%।',
  'লিন মাস এবং ফ্যাট মাসের মধ্যে পার্থক্য কী?', 'এই ক্যালকুলেটরটি নির্বাচিত পদ্ধতির জন্য শরীরের মোট ওজন থেকে আনুমানিক চর্বির পরিমাণ বাদ দিয়ে লিন মাস নির্ধারণ করে। এটি শুধুমাত্র পেশী পরিমাপ করে না বা শরীরের প্রতিটি টিস্যুর উপাদানকে আলাদা করে না।',
  'বোয়ার সমীকরণ কীসের হিসাব করে?', 'এটি পুরুষ বা মহিলাদের জন্য নির্ধারিত একটি প্রকাশিত সমীকরণ ব্যবহার করে উচ্চতা ও ওজন থেকে লিন বডি মাসের হিসাব করে। এটি ব্যক্তিগত পরিমাপ থেকে ভিন্ন হতে পারে, তাই এটিকে একটি আনুমানিক হিসাব হিসেবে বিবেচনা করুন।',
  'আমি কি এই ফলাফলটিকে চিকিৎসকের পরামর্শ হিসেবে ব্যবহার করতে পারি?', 'না। এই ফলাফলটি একটি আনুমানিক হিসাব মাত্র এবং এটি কোনো রোগ নির্ণয় বা চিকিৎসার সুপারিশ নয়। এটি প্রাপ্তবয়স্কদের জন্য প্রযোজ্য; শিশু বা গর্ভাবস্থার ক্ষেত্রে এটি প্রযোজ্য নয়। ব্যক্তিগত স্বাস্থ্য সংক্রান্ত সিদ্ধান্তের বিষয়ে একজন যোগ্য স্বাস্থ্যসেবা পেশাদারের পরামর্শ নিন।',
], 'লিন বডি মাস ক্যালকুলেটর বিনামূল্যে | UsefulVerse');

const russianCopy = makeTranslatedCopy('ru', [
  'Калькулятор безжировой массы тела', 'Бесплатный калькулятор безжировой массы тела без ограничений | UsefulVerse',
  'Рассчитайте безжировую массу и массу жира, используя процентное содержание жира в организме или формулу Бура (Boer). Бесплатный локальный калькулятор с понятными условиями использования.',
  'Выберите прямой расчет на основе известного вам процента жира в организме или оценочный расчет по опубликованной формуле Бура (учитывающей рост и вес). Ознакомьтесь с методом и допущениями.',
  'Как рассчитать безжировую массу тела?',
  'Если известен процент жира в организме, безжировая масса рассчитывается как произведение массы тела на величину «единица минус этот процент». В противном случае используется формула Бура, учитывающая пол, вес и рост. Полученные результаты являются оценочными и не заменяют полноценное измерение состава тела.',
  'Конфиденциален ли этот калькулятор безжировой массы тела?',
  'Да. Расчет выполняется непосредственно в вашем браузере. Введенные вами данные о весе, росте и проценте жира не передаются на сервер и не сохраняются.',
  'Метод расчета', 'Использовать известный процент жира в организме', 'Оценка по формуле Бура (Boer)', 'Формула Бура', 'Формула для мужчин', 'Формула для женщин', 'Масса тела', 'Рост', 'Процент жира в организме', 'Единицы измерения', 'Метрическая система (кг, см)', 'Британская/американская система (фунты, дюймы)', 'Расчетная безжировая масса тела', 'Расчетная масса жира', 'Используемая формула', 'Статья Бура (1984) на PubMed',
  'Результаты оценки зависят от метода и индивидуальных особенностей человека. Формула Бура основана на популяционной регрессии, а не на прямом измерении. Оценка предназначена только для взрослых; не применяется для детей и беременных женщин и не является медицинской рекомендацией. По вопросам, касающимся здоровья, обращайтесь к квалифицированному специалисту.',
  'Рассчитать', 'Загрузить пример', 'Сбросить', 'Результат расчета', 'Расчет выполнен.', 'Проверьте введенные значения и выбранный метод.',
  'Жировая масса: UVTOKENfatMassX UVTOKENunitX. Безжировая масса: UVTOKENleanPercentX%.',
  'В чем разница между безжировой и жировой массой?', 'В данном калькуляторе безжировая масса определяется как масса тела за вычетом жировой массы, рассчитанной по выбранному методу. Он не измеряет отдельно мышечную массу и не разделяет все компоненты тканей организма.',
  'Что позволяет оценить уравнение Бура?', 'Оно позволяет оценить безжировую массу тела на основе роста и веса с использованием опубликованных формул для мужчин или женщин. Полученный результат может отличаться от данных индивидуальных измерений, поэтому его следует рассматривать как приблизительную оценку.',
  'Можно ли считать этот результат медицинской рекомендацией?', 'Нет. Этот результат является оценочным и не служит диагнозом или рекомендацией по лечению. Он предназначен для взрослых; расчет не применим к детям или беременным женщинам. По вопросам, касающимся вашего здоровья, обращайтесь к квалифицированному медицинскому специалисту.',
], 'Калькулятор безжировой массы бесплатно | UsefulVerse');

const urduCopy = makeTranslatedCopy('ur', [
  'لین باڈی ماس کیلکولیٹر', 'لین باڈی ماس کیلکولیٹر: مفت اور لامحدود | UsefulVerse',
  'جسم میں چربی کے تناسب یا Boer مساوات کی مدد سے لین باڈی ماس اور فیٹ ماس کا تخمینہ لگائیں۔ واضح حدود کے ساتھ ایک مفت لوکل کیلکولیٹر۔',
  'جسم میں چربی کے اس تناسب کا انتخاب کریں جو آپ کے پاس پہلے سے موجود ہے، یا Boer کی شائع شدہ قد اور وزن کی مساوات سے تخمینہ حاصل کریں۔ طریقہ کار اور مفروضے ملاحظہ کریں۔',
  'میں لین باڈی ماس کا حساب کیسے لگاؤں؟',
  'اگر آپ کو جسم میں چربی کا تناسب معلوم ہے، تو لین ماس جسمانی وزن کو (ایک میں سے اس تناسب کو منہا کرنے کے بعد) ضرب دے کر حاصل ہوتا ہے۔ بصورتِ دیگر، Boer کا تخمینہ وزن اور قد پر مبنی جنس کے لحاظ سے مخصوص مساوات استعمال کرتا ہے۔ نتائج تخمینے ہیں، جسمانی ساخت کی حتمی پیمائش نہیں۔',
  'کیا یہ لین باڈی ماس کیلکولیٹر پرائیویسی کے لحاظ سے محفوظ ہے؟',
  'جی ہاں۔ حساب کتاب آپ کے براؤزر میں ہی ہوتا ہے۔ آپ کا وزن، قد اور جسم میں چربی سے متعلق ڈیٹا نہ تو اپ لوڈ کیا جاتا ہے اور نہ ہی محفوظ کیا جاتا ہے۔',
  'حساب کا طریقہ', 'جسم کی چربی کا معلوم فیصد استعمال کریں', 'Boer مساوات کے ذریعے تخمینہ لگائیں', 'Boer مساوات کا سیٹ', 'مردوں کے لیے مساوات', 'خواتین کے لیے مساوات', 'جسمانی وزن', 'قد', 'جسم کی چربی کا فیصد', 'اکائیاں', 'میٹرک (کلوگرام، سینٹی میٹر)', 'امپیریل (پاؤنڈ، انچ)', 'لین باڈی ماس کا تخمینہ', 'چربی کے وزن کا تخمینہ', 'استعمال شدہ فارمولا', 'PubMed پر Boer (1984) کا مقالہ',
  'تخمینے طریقے اور فرد کے لحاظ سے مختلف ہو سکتے ہیں۔ Boer مساوات آبادی کے اعداد و شمار پر مبنی ریگریشن ہے، براہ راست پیمائش نہیں۔ یہ تخمینہ صرف بالغوں کے لیے ہے؛ بچوں یا حمل کے دوران اس کا اطلاق نہیں ہوتا اور یہ طبی مشورہ بھی نہیں۔ صحت سے متعلق فیصلوں کے لیے کسی ماہر طبی معالج سے مشورہ کریں۔',
  'حساب لگائیں', 'مثال لوڈ کریں', 'ری سیٹ کریں', 'حساب کا نتیجہ', 'تخمینہ لگا لیا گیا ہے۔', 'اقدار اور منتخب کردہ طریقہ کار کو چیک کریں۔',
  'چربی کا وزن: UVTOKENfatMassX UVTOKENunitX۔ لین ماس: UVTOKENleanPercentX%۔',
  'لین ماس اور فیٹ ماس میں کیا فرق ہے؟', 'یہ کیلکولیٹر لین ماس کو جسمانی وزن میں سے منتخب کردہ طریقہ کار کے مطابق تخمینہ شدہ چربی کا وزن نکال کر شمار کرتا ہے۔ یہ صرف پٹھوں کی پیمائش نہیں کرتا اور نہ ہی جسم کے ہر ٹشو کے جزو کو الگ کرتا ہے۔',
  'Boer مساوات کس چیز کا تخمینہ لگاتی ہے؟', 'یہ مردوں یا خواتین کے لیے شائع شدہ مساوات کا استعمال کرتے ہوئے قد اور وزن کی بنیاد پر لین باڈی ماس کا تخمینہ لگاتی ہے۔ یہ انفرادی پیمائش سے مختلف ہو سکتا ہے، لہذا اسے عمومی تخمینہ سمجھیں۔',
  'کیا میں اس نتیجے کو طبی مشورے کے طور پر استعمال کر سکتا ہوں؟', 'نہیں۔ یہ نتیجہ محض ایک تخمینہ ہے، تشخیص یا علاج کی تجویز نہیں۔ یہ بالغوں کے لیے ہے، بچوں یا حمل کی حالت کے لیے نہیں۔ ذاتی صحت سے متعلق فیصلوں کے لیے کسی مستند طبی ماہر سے مشورہ کریں۔',
], 'لین باڈی ماس کیلکولیٹر مفت | UsefulVerse');

const turkishCopy = makeTranslatedCopy('tr', [
  'Yağsız vücut kütlesi hesaplayıcı', 'Ücretsiz ve Sınırsız Yağsız Vücut Kütlesi Hesaplayıcı | UsefulVerse',
  'Vücut yağı yüzdesi veya Boer denklemi üzerinden yağsız vücut kütlesini ve yağ kütlesini tahmin edin. Net sınırları olan, ücretsiz ve yerel bir hesaplayıcı.',
  'Halihazırda bildiğiniz bir vücut yağı yüzdesine dayalı doğrudan hesaplamayı ya da yayınlanmış Boer boy-kilo denklemiyle yapılan tahmini seçin. Yöntemi ve varsayımları inceleyin.',
  'Yağsız vücut kütlesini nasıl hesaplarım?',
  'Vücut yağı yüzdesini biliyorsanız, yağsız kütle; vücut ağırlığının, 1 eksi bu yüzde değeri ile çarpılmasıyla bulunur. Aksi takdirde, Boer tahmini; kilo ve boy verilerini kullanan, cinsiyete özgü bir denklemden yararlanır. Sonuçlar birer tahmindir; kesin bir vücut kompozisyonu ölçümü değildir.',
  'Bu yağsız vücut kütlesi hesaplayıcı gizliliğe önem veriyor mu?',
  'Evet. Hesaplama işlemi tarayıcınızda gerçekleşir. Kilo, boy ve vücut yağına ilişkin girdiğiniz veriler herhangi bir yere yüklenmez veya kaydedilmez.',
  'Hesaplama yöntemi', 'Bilinen vücut yağı yüzdesini kullan', 'Boer denklemi ile tahmin et', 'Boer denklemi seti', 'Erkekler için denklem', 'Kadınlar için denklem', 'Vücut ağırlığı', 'Boy', 'Vücut yağı yüzdesi', 'Birimler', 'Metrik (kg, cm)', 'İngiliz/Amerikan (lb, inç)', 'Tahmini yağsız vücut kütlesi', 'Tahmini yağ kütlesi', 'Kullanılan formül', "PubMed'de Boer (1984) makalesi",
  'Tahminler yönteme ve kişiye göre değişir. Boer denklemi bir popülasyon regresyonudur, doğrudan bir ölçüm değildir. Yalnızca yetişkinler için tahmindir; çocuklar veya hamilelik için uygun değildir ve tıbbi tavsiye niteliği taşımaz. Sağlıkla ilgili kararlar için yetkili bir klinisyene danışın.',
  'Hesapla', 'Örneği yükle', 'Sıfırla', 'Hesaplama sonucu', 'Tahmin hesaplandı.', 'Değerleri ve seçilen yöntemi kontrol edin.',
  'Yağ kütlesi: UVTOKENfatMassX UVTOKENunitX. Yağsız kütle: UVTOKENleanPercentX%.',
  'Yağsız kütle ile yağ kütlesi arasındaki fark nedir?', 'Bu hesaplayıcı, yağsız kütleyi, seçilen yöntem için vücut ağırlığından tahmini yağ kütlesinin çıkarılmasıyla elde edilen değer olarak ele alır. Sadece kası ölçmez veya her bir doku bileşenini ayrı ayrı hesaplamaz.',
  'Boer denklemi neyi tahmin eder?', 'Erkekler veya kadınlar için yayınlanmış bir denklem setini kullanarak boy ve kilodan yağsız vücut kütlesini tahmin eder. Bireysel ölçümden farklılık gösterebilir, bu nedenle bunu kaba bir tahmin olarak değerlendirin.',
  'Bu sonucu tıbbi tavsiye olarak kullanabilir miyim?', 'Hayır. Sonuç bir tahmindir; teşhis veya tedavi önerisi niteliği taşımaz. Çocuklar veya hamilelik durumu için değil, yetişkinler için hazırlanmıştır. Kişisel sağlık kararlarıyla ilgili olarak yetkili bir sağlık uzmanına danışın.',
], 'Yağsız vücut kütlesi hesaplayıcı ücretsiz | UsefulVerse');

const vietnameseCopy = makeTranslatedCopy('vi', [
  'Công cụ tính khối lượng cơ thể không mỡ', 'Công cụ tính khối lượng cơ thể không mỡ - Miễn phí, Không giới hạn | UsefulVerse',
  'Ước tính khối lượng cơ thể không mỡ và khối lượng mỡ dựa trên tỷ lệ mỡ cơ thể hoặc công thức Boer. Công cụ tính toán trực tiếp, miễn phí và minh bạch.',
  'Chọn tính toán trực tiếp từ tỷ lệ mỡ cơ thể có sẵn hoặc ước tính theo công thức Boer (dựa trên chiều cao và cân nặng). Xem chi tiết về phương pháp và các giả định.',
  'Làm thế nào để tính khối lượng cơ thể không mỡ?',
  'Nếu đã biết tỷ lệ mỡ cơ thể, khối lượng không mỡ được tính bằng cách lấy trọng lượng cơ thể nhân với (1 trừ đi tỷ lệ mỡ đó). Nếu không, phương pháp ước tính Boer sẽ sử dụng công thức riêng cho từng giới tính dựa trên cân nặng và chiều cao. Kết quả chỉ mang tính ước tính, không phải là phép đo thành phần cơ thể chuyên sâu.',
  'Công cụ tính khối lượng cơ thể không mỡ này có đảm bảo tính riêng tư không?',
  'Có. Quá trình tính toán diễn ra ngay trên trình duyệt của bạn. Các thông tin về cân nặng, chiều cao và tỷ lệ mỡ cơ thể mà bạn nhập vào sẽ không bị tải lên hay lưu lại.',
  'Phương pháp tính toán', 'Sử dụng tỷ lệ mỡ cơ thể đã biết', 'Ước tính bằng phương trình Boer', 'Bộ phương trình Boer', 'Phương trình cho nam giới', 'Phương trình cho nữ giới', 'Trọng lượng cơ thể', 'Chiều cao', 'Tỷ lệ mỡ cơ thể', 'Đơn vị đo', 'Hệ mét (kg, cm)', 'Hệ đo lường Anh/Mỹ (lb, in)', 'Khối lượng cơ thể nạc ước tính', 'Khối lượng mỡ ước tính', 'Công thức sử dụng', 'Bài nghiên cứu của Boer (1984) trên PubMed',
  'Các ước tính có thể thay đổi tùy theo phương pháp và từng cá nhân. Phương trình Boer là mô hình hồi quy dựa trên dữ liệu quần thể, không phải là phép đo trực tiếp. Chỉ áp dụng cho người trưởng thành; không dùng cho trẻ em hoặc phụ nữ mang thai và không thay thế cho lời khuyên y tế. Hãy tham khảo ý kiến chuyên gia y tế về các quyết định liên quan đến sức khỏe.',
  'Tính toán', 'Tải ví dụ', 'Đặt lại', 'Kết quả tính toán', 'Đã tính toán xong ước tính.', 'Kiểm tra các giá trị và phương pháp đã chọn.',
  'Khối lượng mỡ: UVTOKENfatMassX UVTOKENunitX. Khối lượng nạc: UVTOKENleanPercentX%.',
  'Sự khác biệt giữa khối lượng nạc và khối lượng mỡ là gì?', 'Công cụ này tính khối lượng nạc bằng cách lấy trọng lượng cơ thể trừ đi khối lượng mỡ ước tính theo phương pháp đã chọn. Nó không đo riêng cơ bắp hay tách biệt từng thành phần mô.',
  'Phương trình Boer ước tính điều gì?', 'Nó ước tính khối lượng cơ thể nạc dựa trên chiều cao và cân nặng, sử dụng phương trình đã được công bố dành cho nam hoặc nữ. Kết quả có thể khác so với đo đạc thực tế của từng cá nhân, vì vậy hãy coi đây là một ước tính sơ bộ.',
  'Tôi có thể sử dụng kết quả này như lời khuyên y tế không?', 'Không. Kết quả này chỉ là ước tính, không phải là chẩn đoán hay khuyến nghị điều trị. Nó dành cho người trưởng thành, không áp dụng cho trẻ em hoặc phụ nữ mang thai. Hãy tham khảo ý kiến chuyên gia y tế có chuyên môn về các quyết định liên quan đến sức khỏe cá nhân.',
], 'Tính khối lượng cơ thể nạc miễn phí | UsefulVerse');

export default Object.freeze({
  es: spanishCopy,
  de: germanCopy,
  fr: frenchCopy,
  id: indonesianCopy,
  hi: hindiCopy,
  ja: japaneseCopy,
  ko: koreanCopy,
  ar: arabicCopy,
  zh: chineseCopy,
  bn: bengaliCopy,
  ru: russianCopy,
  ur: urduCopy,
  tr: turkishCopy,
  vi: vietnameseCopy,
  pt: portugueseCopy,
  tl: tagalogCopy,
  gu: Object.freeze({
    copyLanguage: 'gu',
    name: 'લીન બોડી માસ કેલ્ક્યુલેટર',
    title: 'લીન બોડી માસ કેલ્ક્યુલેટર મફત | UsefulVerse',
    description: 'બોડી-ફેટ ટકાવારી અથવા Boer સમીકરણથી લીન બોડી માસ અને ફેટ માસનો અંદાજ મેળવો. સ્પષ્ટ મર્યાદાઓ સાથેનું મફત કેલ્ક્યુલેટર.',
    intro: 'તમારી પાસેની બોડી-ફેટ ટકાવારી પરથી સીધી ગણતરી કરો અથવા પ્રકાશિત Boer ઊંચાઈ અને વજનના સમીકરણથી અંદાજ મેળવો. પદ્ધતિ અને ધારણાઓ જુઓ.',
    howQuestion: 'લીન બોડી માસની ગણતરી કેવી રીતે કરવી?',
    howAnswer: 'જો તમને બોડી-ફેટ ટકાવારી ખબર હોય, તો લીન માસ શરીરના વજનને 1 માંથી તે ટકાવારી બાદ કર્યા પછીના ભાગથી ગુણવાથી મળે છે. અન્યથા, Boer અંદાજ વજન અને ઊંચાઈ સાથે લિંગ-આધારિત સમીકરણ વાપરે છે. પરિણામો અંદાજ છે, શરીરની રચનાનું સીધું માપન નથી.',
    privacyQuestion: 'શું આ કેલ્ક્યુલેટર ખાનગી છે?',
    privacyAnswer: 'હા. ગણતરી તમારા બ્રાઉઝરમાં થાય છે. તમારું વજન, ઊંચાઈ અને બોડી-ફેટની વિગતો અપલોડ કે સાચવવામાં આવતી નથી.',
    fields: {
      method: 'ગણતરીની પદ્ધતિ', directMethod: 'જાણીતી બોડી-ફેટ ટકાવારી વાપરો', boerMethod: 'Boer સમીકરણથી અંદાજ',
      equationSet: 'Boer સમીકરણનો પ્રકાર', maleEquation: 'પુરુષો માટેનું સમીકરણ', femaleEquation: 'સ્ત્રીઓ માટેનું સમીકરણ',
      weight: 'શરીરનું વજન', height: 'ઊંચાઈ', bodyFatPercent: 'બોડી-ફેટ ટકાવારી', unitSystem: 'એકમો', metric: 'મેટ્રિક (kg, cm)', imperial: 'ઈમ્પિરિયલ (lb, in)',
      result: 'અંદાજિત લીન બોડી માસ', fatMass: 'અંદાજિત ફેટ માસ', formula: 'વપરાયેલ સૂત્ર',
      directFormula: 'LBM = W × (1 − BF% ÷ 100)',
      boerMaleFormula: 'LBM = 0.407W (kg) + 0.267H (cm) − 19.2',
      boerFemaleFormula: 'LBM = 0.252W (kg) + 0.473H (cm) − 48.3',
      sourceBoer: 'PubMed પર Boer (1984) નો લેખ',
      accuracyNote: 'અંદાજો પદ્ધતિ અને વ્યક્તિ પ્રમાણે બદલાય છે. Boer સમીકરણ વસ્તી-આધારિત આંકડાકીય મોડેલ છે, સીધું માપન નથી. ફક્ત પુખ્ત વયના લોકો માટે; બાળકો કે ગર્ભાવસ્થા માટે નહીં અને તબીબી સલાહ નથી. આરોગ્યના નિર્ણય માટે લાયક ચિકિત્સકની સલાહ લો.',
    },
    actions: { calculate: 'ગણતરી કરો', example: 'ઉદાહરણ લોડ કરો', reset: 'રીસેટ', result: 'ગણતરીનું પરિણામ' },
    messages: {
      calculated: 'અંદાજ તૈયાર છે.', checkInputs: 'મૂલ્યો અને પસંદ કરેલી પદ્ધતિ તપાસો.',
      result: 'ફેટ માસ: {fatMass} {unit}. લીન માસ: {leanPercent}%.',
    },
    additionalFaqs: [
      { question: 'લીન માસ અને ફેટ માસમાં શું તફાવત છે?', answer: 'આ કેલ્ક્યુલેટર પસંદ કરેલી પદ્ધતિ મુજબના અંદાજિત ફેટ માસને શરીરના વજનમાંથી બાદ કરીને લીન માસ ગણે છે. તે ફક્ત સ્નાયુનું માપન કરતું નથી કે શરીરના દરેક પેશીને અલગ પાડતું નથી.' },
      { question: 'Boer સમીકરણ શું અંદાજે છે?', answer: 'તે પુરુષો અથવા સ્ત્રીઓ માટેના પ્રકાશિત સમીકરણથી ઊંચાઈ અને વજન પરથી લીન બોડી માસનો અંદાજ આપે છે. વ્યક્તિગત માપનથી પરિણામ અલગ હોઈ શકે છે, તેથી તેને અંદાજ તરીકે જ લો.' },
      { question: 'શું હું આ પરિણામને તબીબી સલાહ માની શકું?', answer: 'ના. આ અંદાજ છે, નિદાન કે સારવારની ભલામણ નથી. તે પુખ્ત વયના લોકો માટે છે, બાળકો કે ગર્ભાવસ્થા માટે નહીં. વ્યક્તિગત આરોગ્યના નિર્ણય માટે લાયક આરોગ્ય નિષ્ણાતની સલાહ લો.' },
    ],
  }),
  ...translatedCopies,
});
