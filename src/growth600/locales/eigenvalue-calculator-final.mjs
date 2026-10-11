// One-time Google Translate drafts; no runtime translation service.
export default Object.freeze({
  en: {
    copyLanguage: "en",
    name: "Eigenvalue Calculator",
    title: "Eigenvalue Calculator Free | UsefulVerse",
    description:
      "Find eigenvalues, eigenvectors and residuals for a real symmetric matrix. Free online calculator; values stay in your browser.",
    intro:
      "Calculate and check eigenpairs for a real symmetric matrix. See normalized eigenvectors and the residual for each result.",
    howQuestion: "How do I find the eigenvalues of a matrix?",
    howAnswer:
      "Enter a square real symmetric matrix, one row per line, with values separated by commas or spaces. Calculate to view sorted eigenvalues, normalized eigenvectors and residuals.",
    privacyQuestion: "Are my matrix values uploaded?",
    privacyAnswer:
      "No. The calculation runs locally in this browser. Matrix values are not uploaded or saved by this tool.",
    howTo: [
      "Enter a real symmetric square matrix with 2 to 8 rows.",
      "Separate values with commas or spaces and put each row on a new line.",
      "Calculate, then check each eigenvalue, normalized eigenvector and residual.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Calculate eigenpairs",
      example: "Load example",
      reset: "Clear",
      copy: "Copy results",
    },
    fields: {
      matrix: "Real symmetric matrix",
      matrixHint:
        "Enter 2–8 rows, one per line. Separate values with commas, spaces or semicolons. Example: 2, 0 on the first line and 0, 3 on the second.",
      accuracyNote:
        "Supports finite real symmetric matrices only, from 2×2 to 8×8; each value must be within ±1,000,000. Non-symmetric matrices and complex eigenvalues are not supported. Eigenvectors have unit length; their sign may vary. Floating-point results are approximate.",
      resultSummary: "Eigenpairs, sorted by eigenvalue",
      eigenvalue: "Eigenvalue",
      eigenvector: "Normalized eigenvector",
      residual: "Residual ‖Av − λv‖",
    },
    messages: {
      calculated: "Eigenpairs calculated.",
      copied: "Results copied.",
      copyUnavailable: "Clipboard is unavailable in this browser.",
      checkInputs: "Check the matrix and try again.",
      emptyMatrix: "Enter a matrix first.",
      invalidSize: "Use a square matrix from 2×2 to 8×8.",
      notSquare:
        "Every row must have the same number of values as there are rows.",
      notSymmetric: "This matrix is not symmetric; Aᵢⱼ must equal Aⱼᵢ.",
      invalidEntry: "Use finite numeric values from −1,000,000 to 1,000,000.",
      didNotConverge: "The numerical method did not converge for this input.",
      exampleLoaded: "Example loaded: eigenvalues 2 and 3.",
    },
    additionalFaqs: [
      {
        question: "What matrix types does this eigenvalue calculator support?",
        answer:
          "It supports real symmetric square matrices from 2×2 through 8×8. It does not calculate eigenvalues for non-symmetric matrices or complex eigenvalues.",
      },
      {
        question: "How can I check an eigenvector?",
        answer:
          "For each result, compare A multiplied by the displayed normalized vector with the eigenvalue multiplied by that vector. The residual reports the norm of their difference; values near zero indicate a close numerical match.",
      },
      {
        question: "Why can an eigenvector have a different sign?",
        answer:
          "If v is an eigenvector, −v is also an eigenvector for the same eigenvalue. The tool chooses a consistent sign where possible, but sign is not mathematically unique.",
      },
    ],
    sources: [],
    localizationStatus: "approved",
  },
  es: {
    copyLanguage: "es",
    name: "Calculadora de valores propios",
    title: "Calculadora de valores propios gratis | UsefulVerse",
    description:
      "Encuentre valores propios, vectores propios y residuos para una matriz simétrica real. Calculadora en línea gratuita; Los valores permanecen en su navegador.",
    intro:
      "Calcula y comprueba los pares propios de una matriz simétrica real. Consulte los vectores propios normalizados y el residual de cada resultado.",
    howQuestion: "¿Cómo encuentro los valores propios de una matriz?",
    howAnswer:
      "Introduzca una matriz simétrica real cuadrada, una fila por línea, con valores separados por comas o espacios. Calcule para ver valores propios ordenados, vectores propios normalizados y residuos.",
    privacyQuestion: "¿Están cargados los valores de mi matriz?",
    privacyAnswer:
      "No. El cálculo se ejecuta localmente en este navegador. Esta herramienta no carga ni guarda los valores de la matriz.",
    howTo: [
      "Introduzca una matriz cuadrada simétrica real de 2 a 8 filas.",
      "Separe los valores con comas o espacios y coloque cada fila en una nueva línea.",
      "Calcule y luego verifique cada valor propio, vector propio normalizado y residual.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Calcular pares propios",
      example: "Cargar ejemplo",
      reset: "Borrar",
      copy: "Copiar resultados",
    },
    fields: {
      matrix: "Matriz simétrica real",
      matrixHint:
        "Introduzca de 2 a 8 filas, una por línea. Separe los valores con comas, espacios o punto y coma. Ejemplo: 2, 0 en la primera línea y 0, 3 en la segunda.",
      accuracyNote:
        "Admite únicamente matrices simétricas reales finitas, de 2×2 a 8×8; cada valor debe estar dentro de ±1.000.000. No se admiten matrices no simétricas ni valores propios complejos. Los vectores propios tienen longitud unitaria; su signo puede variar. Los resultados de punto flotante son aproximados.",
      resultSummary: "Pares propios, ordenados por valor propio",
      eigenvalue: "Valor propio",
      eigenvector: "Vector propio normalizado",
      residual: "Residual ‖Av − λv‖",
    },
    messages: {
      calculated: "Pares propios calculados.",
      copied: "Resultados copiados.",
      copyUnavailable: "no está disponible en este navegador.",
      checkInputs: "Compruebe la matriz y vuelva a intentarlo.",
      emptyMatrix: "Introduzca primero una matriz.",
      invalidSize: "Utilice una matriz cuadrada de 2×2 a 8×8.",
      notSquare: "Cada fila debe tener el mismo número de valores que filas.",
      notSymmetric: "Esta matriz no es simétrica; Aᵢⱼ debe ser igual a Aⱼᵢ.",
      invalidEntry:
        "Utilice valores numéricos finitos desde −1.000.000 hasta 1.000.000.",
      didNotConverge: "El método numérico no convergió para esta entrada.",
      exampleLoaded: "Ejemplo cargado: valores propios 2 y 3.",
    },
    additionalFaqs: [
      {
        question:
          "¿Qué tipos de matrices admite esta calculadora de valores propios?",
        answer:
          "Admite matrices cuadradas simétricas reales desde 2×2 hasta 8×8. No calcula valores propios para matrices no simétricas o valores propios complejos.",
      },
      {
        question: "¿Cómo puedo comprobar un vector propio?",
        answer:
          "Para cada resultado, compare A multiplicado por el vector normalizado mostrado con el valor propio multiplicado por ese vector. El residual informa la norma de su diferencia; los valores cercanos a cero indican una coincidencia numérica cercana.",
      },
      {
        question: "¿Por qué un vector propio puede tener diferente signo?",
        answer:
          "Si v es un vector propio, −v también es un vector propio para el mismo valor propio. La herramienta elige un signo consistente siempre que sea posible, pero el signo no es matemáticamente único.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  fr: {
    copyLanguage: "fr",
    name: "Calculateur de valeurs propres",
    title: "Calculateur de valeurs propres gratuit | UsefulVerse",
    description:
      "Trouvez les valeurs propres, les vecteurs propres et les résidus pour une matrice symétrique réelle. Calculateur en ligne gratuit ; les valeurs restent dans…",
    intro:
      "Calcule et vérifie les paires propres pour une matrice symétrique réelle. Voir les vecteurs propres normalisés et le résidu pour chaque résultat.",
    howQuestion: "Comment trouver les valeurs propres d'une matrice ?",
    howAnswer:
      "Saisissez une matrice symétrique réelle carrée, une ligne par ligne, avec des valeurs séparées par des virgules ou des espaces. Calculez pour afficher les valeurs propres triées, les vecteurs propres normalisés et les résidus.",
    privacyQuestion: "Mes valeurs matricielles sont-elles téléchargées ?",
    privacyAnswer:
      "Non. Le calcul s'exécute localement dans ce navigateur. Les valeurs matricielles ne sont ni téléchargées ni enregistrées par cet outil.",
    howTo: [
      "Saisissez une véritable matrice carrée symétrique de 2 à 8 lignes.",
      "Séparez les valeurs par des virgules ou des espaces et placez chaque ligne sur une nouvelle ligne.",
      "Calculez, puis vérifiez chaque valeur propre, vecteur propre normalisé et résidu.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Calculer les paires propres",
      example: "Charger l'exemple",
      reset: "Effacer",
      copy: "Copier les résultats",
    },
    fields: {
      matrix: "Matrice symétrique réelle",
      matrixHint:
        "Saisissez 2 à 8 lignes, une par ligne. Séparez les valeurs par des virgules, des espaces ou des points-virgules. Exemple : 2, 0 sur la première ligne et 0, 3 sur la seconde.",
      accuracyNote:
        "Prend en charge uniquement les matrices symétriques réelles finies, de 2×2 à 8×8 ; chaque valeur doit être comprise entre ± 1 000 000. Les matrices non symétriques et les valeurs propres complexes ne sont pas prises en charge. Les vecteurs propres ont une longueur unitaire ; leur signe peut varier. Les résultats en virgule flottante sont approximatifs.",
      resultSummary: "Paires propres, triées par valeur propre",
      eigenvalue: "Valeur propre",
      eigenvector: "Vecteur propre normalisé",
      residual: "Résiduel ‖Av − λv‖",
    },
    messages: {
      calculated: "Paires propres calculées.",
      copied: "Résultats copiés.",
      copyUnavailable: "n'est pas disponible dans ce navigateur.",
      checkInputs: "Vérifiez la matrice et réessayez.",
      emptyMatrix: "Entrez d'abord une matrice.",
      invalidSize: "Utilisez une matrice carrée de 2×2 à 8×8.",
      notSquare:
        "Chaque ligne doit avoir le même nombre de valeurs qu'il y a de lignes.",
      notSymmetric:
        "Cette matrice n'est pas symétrique ; Aᵢⱼ doit être égal à Aⱼᵢ.",
      invalidEntry:
        "Utilisez des valeurs numériques finies comprises entre −1 000 000 et 1 000 000.",
      didNotConverge:
        "La méthode numérique n'a pas convergé pour cette entrée.",
      exampleLoaded: "Exemple chargé : valeurs propres 2 et 3.",
    },
    additionalFaqs: [
      {
        question:
          "Quels types de matrices ce calculateur de valeurs propres prend-il en charge ?",
        answer:
          "Il prend en charge les matrices carrées symétriques réelles de 2×2 à 8×8. Il ne calcule pas les valeurs propres des matrices non symétriques ou des valeurs propres complexes.",
      },
      {
        question: "Comment puis-je vérifier un vecteur propre ?",
        answer:
          "Pour chaque résultat, comparez A multiplié par le vecteur normalisé affiché avec la valeur propre multipliée par ce vecteur. Le résidu rapporte la norme de leur différence ; les valeurs proches de zéro indiquent une correspondance numérique étroite.",
      },
      {
        question:
          "Pourquoi un vecteur propre peut-il avoir un signe différent ?",
        answer:
          "Si v est un vecteur propre, −v est également un vecteur propre pour la même valeur propre. L'outil choisit un signe cohérent lorsque cela est possible, mais le signe n'est pas mathématiquement unique.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  pt: {
    copyLanguage: "pt",
    name: "Eigenvalue Calculator",
    title: "Eigenvalue Calculator grátis | UsefulVerse",
    description:
      "Encontre valores próprios, vetores próprios e resíduos para uma matriz simétrica real. Calculadora online gratuita; os valores permanecem no seu navegador.",
    intro:
      "Calcula e verifica pares próprios para uma matriz simétrica real. Veja os autovetores normalizados e o resíduo para cada resultado.",
    howQuestion: "Como encontro os autovalores de uma matriz?",
    howAnswer:
      "Insira uma matriz quadrada real simétrica, uma linha por linha, com valores separados por vírgulas ou espaços. Calcule para visualizar autovalores classificados, autovetores normalizados e resíduos.",
    privacyQuestion: "Meus valores de matriz foram carregados?",
    privacyAnswer:
      "Não. O cálculo é executado localmente neste navegador. Os valores da matriz não são carregados ou salvos por esta ferramenta.",
    howTo: [
      "Insira uma matriz quadrada simétrica real com 2 a 8 linhas.",
      "Separe os valores com vírgulas ou espaços e coloque cada linha em uma nova linha.",
      "Calcule e verifique cada autovalor, autovetor normalizado e resíduo.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Calcular pares próprios",
      example: "Exemplo de carregamento",
      reset: "Limpar",
      copy: "Copiar resultados",
    },
    fields: {
      matrix: "Matriz simétrica real",
      matrixHint:
        "Insira de 2 a 8 linhas, uma por linha. Separe os valores com vírgulas, espaços ou ponto e vírgula. Exemplo: 2, 0 na primeira linha e 0, 3 na segunda.",
      accuracyNote:
        "Suporta apenas matrizes simétricas reais finitas, de 2×2 a 8×8; cada valor deve estar dentro de ±1.000.000. Matrizes não simétricas e autovalores complexos não são suportados. Os autovetores têm comprimento unitário; seu sinal pode variar. Os resultados de ponto flutuante são aproximados.",
      resultSummary: "Pares próprios, classificados por valor próprio",
      eigenvalue: "Autovalor",
      eigenvector: "Autovetor normalizado",
      residual: "Residual ‖Av − λv‖",
    },
    messages: {
      calculated: "calculados.",
      copied: "copiados.",
      copyUnavailable: "não está disponível neste navegador.",
      checkInputs: "Verifique a matriz e tente novamente.",
      emptyMatrix: "Insira primeiro uma matriz.",
      invalidSize: "Use uma matriz quadrada de 2×2 a 8×8.",
      notSquare:
        "Cada linha deve ter o mesmo número de valores que o número de linhas.",
      notSymmetric: "Esta matriz não é simétrica; Aᵢⱼ deve ser igual a Aⱼᵢ.",
      invalidEntry: "Use valores numéricos finitos de −1.000.000 a 1.000.000.",
      didNotConverge: "O método numérico não convergiu para esta entrada.",
      exampleLoaded: "Exemplo carregado: autovalores 2 e 3.",
    },
    additionalFaqs: [
      {
        question: "Que tipos de matriz esta calculadora de autovalor suporta?",
        answer:
          "Suporta matrizes quadradas simétricas reais de 2×2 a 8×8. Ele não calcula autovalores para matrizes não simétricas ou autovalores complexos.",
      },
      {
        question: "Como posso verificar um autovetor?",
        answer:
          "Para cada resultado, compare A multiplicado pelo vetor normalizado exibido com o autovalor multiplicado por esse vetor. O resíduo informa a norma de sua diferença; valores próximos de zero indicam uma correspondência numérica próxima.",
      },
      {
        question: "Por que um autovetor pode ter um sinal diferente?",
        answer:
          "Se v é um autovetor, −v também é um autovetor para o mesmo autovalor. A ferramenta escolhe um sinal consistente sempre que possível, mas o sinal não é matematicamente único.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  de: {
    copyLanguage: "de",
    name: "Eigenwertrechner",
    title: "Eigenwertrechner kostenlos | UsefulVerse",
    description:
      "Finden Sie Eigenwerte, Eigenvektoren und Residuen für eine reelle symmetrische Matrix. Kostenloser Online-Rechner; Die Werte bleiben in Ihrem Browser.",
    intro:
      "Berechnen und prüfen Sie Eigenpaare für eine reelle symmetrische Matrix. Sehen Sie sich normalisierte Eigenvektoren und das Residuum für jedes Ergebnis an.",
    howQuestion: "Wie finde ich die Eigenwerte einer Matrix?",
    howAnswer:
      "Geben Sie eine quadratische reelle symmetrische Matrix ein, eine Zeile pro Zeile, mit durch Kommas oder Leerzeichen getrennten Werten. Berechnen Sie, um sortierte Eigenwerte, normalisierte Eigenvektoren und Residuen anzuzeigen.",
    privacyQuestion: "Werden meine Matrixwerte hochgeladen?",
    privacyAnswer:
      "Nein. Die Berechnung läuft lokal in diesem Browser. Matrixwerte werden von diesem Tool nicht hochgeladen oder gespeichert.",
    howTo: [
      "Geben Sie eine echte symmetrische quadratische Matrix mit 2 bis 8 Zeilen ein.",
      "Trennen Sie Werte durch Kommas oder Leerzeichen und fügen Sie jede Zeile in eine neue Zeile ein.",
      "Berechnen und überprüfen Sie dann jeden Eigenwert, jeden normalisierten Eigenvektor und jedes Residuum.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Berechnen Sie die Eigenpaare",
      example: "Beispiel laden",
      reset: "Clear",
      copy: "Ergebnisse kopieren",
    },
    fields: {
      matrix: "Reale symmetrische Matrix",
      matrixHint:
        "Geben Sie 2–8 Zeilen ein, eine pro Zeile. Trennen Sie Werte durch Kommas, Leerzeichen oder Semikolons. Beispiel: 2, 0 in der ersten Zeile und 0, 3 in der zweiten.",
      accuracyNote:
        "Unterstützt nur endliche reelle symmetrische Matrizen von 2×2 bis 8×8; Jeder Wert muss innerhalb von ±1.000.000 liegen. Nicht symmetrische Matrizen und komplexe Eigenwerte werden nicht unterstützt. Eigenvektoren haben eine Einheitslänge; ihr Vorzeichen kann variieren. Gleitkomma-Ergebnisse sind Näherungswerte.",
      resultSummary: "Eigenpaare, sortiert nach Eigenwert",
      eigenvalue: "Eigenwert",
      eigenvector: "Normalisierter Eigenvektor",
      residual: "Residuum ‖Av − λv‖",
    },
    messages: {
      calculated: "Eigenpaare berechnet.",
      copied: "Ergebnisse kopiert.",
      copyUnavailable: "-Zwischenablage ist in diesem Browser nicht verfügbar.",
      checkInputs: "Überprüfen Sie die Matrix und versuchen Sie es erneut.",
      emptyMatrix: "Geben Sie zunächst eine Matrix ein.",
      invalidSize: "Verwenden Sie eine quadratische Matrix von 2×2 bis 8×8.",
      notSquare:
        "Jede Zeile muss die gleiche Anzahl an Werten haben, wie es Zeilen gibt.",
      notSymmetric:
        "Diese Matrix ist nicht symmetrisch; Aᵢⱼ muss gleich Aⱼᵢ sein.",
      invalidEntry:
        "Verwenden Sie endliche numerische Werte von −1.000.000 bis 1.000.000.",
      didNotConverge:
        "Die numerische Methode konvergierte für diese Eingabe nicht.",
      exampleLoaded: "Beispiel geladen: Eigenwerte 2 und 3.",
    },
    additionalFaqs: [
      {
        question: "Welche Matrixtypen unterstützt dieser Eigenwertrechner?",
        answer:
          "Es unterstützt echte symmetrische quadratische Matrizen von 2×2 bis 8×8. Es werden keine Eigenwerte für nichtsymmetrische Matrizen oder komplexe Eigenwerte berechnet.",
      },
      {
        question: "Wie kann ich einen Eigenvektor überprüfen?",
        answer:
          "Vergleichen Sie für jedes Ergebnis A multipliziert mit dem angezeigten normalisierten Vektor mit dem Eigenwert multipliziert mit diesem Vektor. Das Residuum gibt die Norm ihrer Differenz an; Werte nahe Null weisen auf eine enge numerische Übereinstimmung hin.",
      },
      {
        question: "Warum kann ein Eigenvektor ein anderes Vorzeichen haben?",
        answer:
          "Wenn v ein Eigenvektor ist, ist −v auch ein Eigenvektor für denselben Eigenwert. Das Tool wählt nach Möglichkeit ein konsistentes Vorzeichen, das Vorzeichen ist jedoch mathematisch nicht eindeutig.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  ja: {
    copyLanguage: "ja",
    name: "固有値計算機",
    title: "固有値計算機 無料 | UsefulVerse",
    description:
      "実対称行列の固有値、固有ベクトル、および残差を求めます。無料のオンライン計算機;値はブラウザ内に残ります。",
    intro:
      "実対称行列の固有対を計算して確認します。正規化された固有ベクトルと各結果の残差を参照してください。",
    howQuestion: "行列の固有値を見つけるにはどうすればよいですか?",
    howAnswer:
      "正方実対称行列を 1 行に 1 行、値をカンマまたはスペースで区切って入力します。計算して、ソートされた固有値、正規化された固有ベクトル、および残差を表示します。",
    privacyQuestion: "私のマトリックス値はアップロードされていますか?",
    privacyAnswer:
      "いいえ。計算はこのブラウザでローカルに実行されます。このツールでは行列値はアップロードまたは保存されません。",
    howTo: [
      "2 ～ 8 行の実対称正方行列を入力します。",
      "値をカンマまたはスペースで区切って、各行を新しい行に置きます。",
      "計算し、各固有値、正規化固有ベクトル、残差を確認します。",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "固有ペアの計算",
      example: "ロード例",
      reset: "Clear",
      copy: "コピー結果",
    },
    fields: {
      matrix: "実対称行列",
      matrixHint:
        "1 行に 1 つずつ、2 ～ 8 行を入力します。値はカンマ、スペース、またはセミコロンで区切ります。例: 1 行目は 2、0、2 行目は 0、3。",
      accuracyNote:
        "2×2 から 8×8 までの有限実対称行列のみをサポートします。各値は±1,000,000以内でなければなりません。非対称行列と複素固有値はサポートされていません。固有ベクトルには単位長があります。それらの符号は異なる場合があります。浮動小数点の結果は概算です。",
      resultSummary: "固有値でソートされた固有ペア",
      eigenvalue: "固有値",
      eigenvector: "正規化された固有ベクトル",
      residual: "残差 ‖Av − λv ‖",
    },
    messages: {
      calculated: "固有ペアが計算されました。",
      copied: "結果がコピーされました。",
      copyUnavailable: "このブラウザではクリップボードを使用できません。",
      checkInputs: "マトリックスを確認して、再試行してください。",
      emptyMatrix: "まず行列を入力してください。",
      invalidSize: "2×2 ～ 8×8 の正方行列を使用します。",
      notSquare:
        "すべての行には、行の数と同じ数の値が含まれている必要があります。",
      notSymmetric:
        "この行列は対称ではありません。 AᵢⱼはAⱼᵢと等しくなければなりません。",
      invalidEntry: "−1,000,000 から 1,000,000 までの有限の数値を使用します。",
      didNotConverge: "数値法はこの入力に対して収束しませんでした。",
      exampleLoaded: "Example loaded: eigenvalues 2 and 3.",
    },
    additionalFaqs: [
      {
        question:
          "この固有値計算ツールはどのような行列タイプをサポートしていますか?",
        answer:
          "2×2 から 8×8 までの実対称正方行列をサポートします。非対称行列または複素固有値の固有値は計算されません。",
      },
      {
        question: "固有ベクトルを確認するにはどうすればよいですか?",
        answer:
          "各結果について、表示された正規化ベクトルを乗算した A と、そのベクトルを乗算した固有値を比較します。残差はそれらの差のノルムを報告します。ゼロに近い値は、数値がほぼ一致していることを示します。",
      },
      {
        question: "固有ベクトルの符号が異なるのはなぜですか?",
        answer:
          "v が固有ベクトルの場合、-v も同じ固有値の固有ベクトルです。このツールは可能な限り一貫した符号を選択​​しますが、符号は数学的に一意ではありません。",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  ko: {
    copyLanguage: "ko",
    name: "고유값 계산기",
    title: "고유값 계산기 무료 | UsefulVerse",
    description:
      "실수 대칭 행렬에 대한 고유값, 고유벡터 및 잔차를 찾습니다. 무료 온라인 계산기; 값은 브라우저에 그대로 유지됩니다.",
    intro:
      "실제 대칭 행렬의 고유쌍을 계산하고 확인합니다. 정규화된 고유 벡터와 각 결과의 잔차를 확인하세요.",
    howQuestion: "행렬의 고유값을 어떻게 찾나요?",
    howAnswer:
      "쉼표나 공백으로 값을 구분하여 한 줄에 한 행씩 정사각형 실수 대칭 행렬을 입력합니다. 정렬된 고유값, 정규화된 고유벡터 및 잔차를 보려면 계산하세요.",
    privacyQuestion: "내 매트릭스 값이 업로드되었습니까?",
    privacyAnswer:
      "아니요. 계산은 이 브라우저에서 로컬로 실행됩니다. 이 도구는 매트릭스 값을 업로드하거나 저장하지 않습니다.",
    howTo: [
      "2~8행의 실제 대칭 정사각형 행렬을 입력합니다.",
      "값을 쉼표나 공백으로 구분하고 각 행을 새 줄에 넣습니다.",
      "각 고유값, 정규화된 고유벡터 및 잔차를 계산한 후 확인합니다.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "고유쌍 계산",
      example: "로드 예",
      reset: "Clear",
      copy: "결과 복사",
    },
    fields: {
      matrix: "실수 대칭 행렬",
      matrixHint:
        "한 줄에 하나씩 2~8개의 행을 입력하십시오. 쉼표, 공백 또는 세미콜론으로 값을 구분하세요. 예: 첫 번째 줄에는 2, 0, 두 번째 줄에는 0, 3.",
      accuracyNote:
        "2×2에서 8×8까지 유한 실수 대칭 행렬만 지원합니다. 각 값은 ±1,000,000 이내여야 합니다. 비대칭 행렬과 복소 고유값은 지원되지 않습니다. 고유벡터는 단위 길이를 갖습니다. 그 표시는 다를 수 있습니다. 부동 소수점 결과는 대략적인 것입니다.",
      resultSummary: "고유값",
      eigenvalue: "고유값",
      eigenvector: "정규화된 고유벡터",
      residual: '잔차 "Av − λv"',
    },
    messages: {
      calculated: "고유쌍이 계산되었습니다.",
      copied: "결과가 복사되었습니다.",
      copyUnavailable: "클립보드는 이 브라우저에서 사용할 수 없습니다.",
      checkInputs: "매트릭스를 확인하고 다시 시도하십시오.",
      emptyMatrix: "먼저 행렬을 입력하세요.",
      invalidSize: "2×2에서 8×8까지의 정사각형 행렬을 사용합니다.",
      notSquare: "모든 행에는 행 수와 동일한 수의 값이 있어야 합니다.",
      notSymmetric: "이 행렬은 대칭이 아닙니다. Aᵢⱼ는 Aⱼᵢ와 같아야 합니다.",
      invalidEntry:
        "-1,000,000에서 1,000,000 사이의 유한 숫자 값을 사용합니다.",
      didNotConverge: "수치법이 이 입력에 대해 수렴되지 않았습니다.",
      exampleLoaded: "로드된 예: 고유값 2 및 3.",
    },
    additionalFaqs: [
      {
        question: "이 고유값 계산기는 어떤 행렬 유형을 지원합니까?",
        answer:
          "2×2부터 8×8까지의 실수 대칭 정사각형 행렬을 지원합니다. 비대칭 행렬이나 복소수 고유값에 대한 고유값은 계산하지 않습니다.",
      },
      {
        question: "고유벡터를 어떻게 확인할 수 있나요?",
        answer:
          "각 결과에 대해 표시된 정규화된 벡터를 곱한 A와 해당 벡터를 곱한 고유값을 비교합니다. 잔차는 차이의 표준을 보고합니다. 0에 가까운 값은 수치가 거의 일치함을 나타냅니다.",
      },
      {
        question: "고유벡터의 부호가 다른 이유는 무엇입니까?",
        answer:
          "v가 고유벡터이면 −v도 동일한 고유값에 대한 고유벡터입니다. 도구는 가능한 경우 일관된 기호를 선택하지만 기호는 수학적으로 고유하지 않습니다.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  id: {
    copyLanguage: "id",
    name: "Eigenvalue Calculator",
    title: "Eigenvalue Calculator gratis | UsefulVerse",
    description:
      "Temukan nilai eigen, vektor eigen, dan residu untuk matriks simetris nyata. Kalkulator online gratis; nilai tetap di browser Anda.",
    intro:
      "Hitung dan periksa pasangan eigen untuk matriks simetris nyata. Lihat vektor eigen yang dinormalisasi dan sisa untuk setiap hasil.",
    howQuestion: "Bagaimana cara mencari nilai eigen suatu matriks?",
    howAnswer:
      "Masukkan matriks simetris real persegi, satu baris per baris, dengan nilai dipisahkan dengan koma atau spasi. Hitung untuk melihat nilai eigen yang diurutkan, vektor eigen yang dinormalisasi, dan residu.",
    privacyQuestion: "Apakah nilai matriks saya diunggah?",
    privacyAnswer:
      "Tidak. Perhitungan berjalan secara lokal di browser ini. Nilai matriks tidak diunggah atau disimpan oleh alat ini.",
    howTo: [
      "Masukkan matriks persegi simetris nyata dengan 2 sampai 8 baris.",
      "Pisahkan nilai dengan koma atau spasi dan letakkan setiap baris pada baris baru.",
      "Hitung, lalu periksa setiap nilai eigen, vektor eigen yang dinormalisasi, dan residu.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Hitung pasangan eigen",
      example: "Muat contoh",
      reset: "Hapus",
      copy: "Copy hasil",
    },
    fields: {
      matrix: "Matriks simetris nyata",
      matrixHint:
        "Masukkan 2–8 baris, satu baris per baris. Pisahkan nilai dengan koma, spasi, atau titik koma. Contoh: 2, 0 pada baris pertama dan 0, 3 pada baris kedua.",
      accuracyNote:
        "Hanya mendukung matriks simetris nyata berhingga, dari 2×2 hingga 8×8; setiap nilai harus berada dalam ±1.000.000. Matriks non-simetris dan nilai eigen kompleks tidak didukung. Vektor eigen memiliki satuan panjang; tandanya mungkin berbeda-beda. Hasil floating-point merupakan perkiraan.",
      resultSummary: "Eigenpairs, diurutkan berdasarkan nilai eigen",
      eigenvalue: "Nilai Eigen",
      eigenvector: "Vektor eigen yang dinormalisasi",
      residual: "Sisa ‖Av − λv‖",
    },
    messages: {
      calculated: "Eigenpairs dihitung.",
      copied: "disalin.",
      copyUnavailable: "tidak tersedia di browser ini.",
      checkInputs: "Periksa matriks dan coba lagi.",
      emptyMatrix: "Masukkan matriks terlebih dahulu.",
      invalidSize: "Gunakan matriks persegi dari 2×2 hingga 8×8.",
      notSquare:
        "Setiap baris harus memiliki jumlah nilai yang sama dengan jumlah baris.",
      notSymmetric: "Matriks ini tidak simetris; Aᵢⱼ harus sama dengan Aⱼᵢ.",
      invalidEntry:
        "Gunakan nilai numerik berhingga dari −1.000.000 hingga 1.000.000.",
      didNotConverge: "Metode numerik tidak menyatu untuk masukan ini.",
      exampleLoaded: "Contoh dimuat: nilai eigen 2 dan 3.",
    },
    additionalFaqs: [
      {
        question: "Jenis matriks apa yang didukung kalkulator nilai eigen ini?",
        answer:
          "Mendukung matriks persegi simetris nyata dari 2×2 hingga 8×8. Ini tidak menghitung nilai eigen untuk matriks non-simetris atau nilai eigen kompleks.",
      },
      {
        question: "Bagaimana cara memeriksa vektor eigen?",
        answer:
          "Untuk setiap hasil, bandingkan A dikalikan dengan vektor normalisasi yang ditampilkan dengan nilai eigen dikalikan dengan vektor tersebut. Residu melaporkan tingkat perbedaannya; nilai yang mendekati nol menunjukkan kecocokan numerik yang dekat.",
      },
      {
        question: "Mengapa vektor eigen dapat mempunyai tanda yang berbeda?",
        answer:
          "Jika v adalah vektor eigen, −v juga merupakan vektor eigen untuk nilai eigen yang sama. Alat ini memilih tanda yang konsisten jika memungkinkan, namun tanda tersebut tidak unik secara matematis.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  hi: {
    copyLanguage: "hi",
    name: "आइजेनवैल्यू कैलकुलेटर",
    title: "आइजेनवैल्यू कैलकुलेटर मुफ़्त | UsefulVerse",
    description:
      "एक वास्तविक सममित मैट्रिक्स के लिए eigenvalues, eigenvectors और अवशेष खोजें। मुफ़्त ऑनलाइन कैलकुलेटर; मान आपके ब्राउज़र में रहते हैं.",
    intro:
      "वास्तविक सममित मैट्रिक्स के लिए eigenpairs की गणना और जांच करें। प्रत्येक परिणाम के लिए सामान्यीकृत आइजनवेक्टर और अवशिष्ट देखें।",
    howQuestion: "मैं मैट्रिक्स के आइगेनवैल्यू कैसे ढूंढूं?",
    howAnswer:
      "एक वर्गाकार वास्तविक सममित मैट्रिक्स दर्ज करें, प्रति पंक्ति एक पंक्ति, अल्पविराम या रिक्त स्थान द्वारा अलग किए गए मानों के साथ। क्रमबद्ध eigenvalues, सामान्यीकृत eigenvectors और अवशेषों को देखने के लिए गणना करें।",
    privacyQuestion: "क्या मेरे मैट्रिक्स मान अपलोड किए गए हैं?",
    privacyAnswer:
      "नहीं। गणना इस ब्राउज़र में स्थानीय रूप से चलती है। इस टूल द्वारा मैट्रिक्स मान अपलोड या सहेजे नहीं जाते हैं।",
    howTo: [
      "2 से 8 पंक्तियों वाला एक वास्तविक सममित वर्ग मैट्रिक्स दर्ज करें।",
      "मानों को अल्पविराम या रिक्त स्थान से अलग करें और प्रत्येक पंक्ति को एक नई पंक्ति पर रखें।",
      "गणना करें, फिर प्रत्येक eigenvalue, सामान्यीकृत eigenvector और अवशिष्ट की जाँच करें।",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "eigenpairs की गणना करें",
      example: "लोड उदाहरण",
      reset: "साफ़",
      copy: "परिणाम",
    },
    fields: {
      matrix: "वास्तविक सममित मैट्रिक्स",
      matrixHint:
        "2-8 पंक्तियाँ दर्ज करें, प्रति पंक्ति एक। मानों को अल्पविराम, रिक्त स्थान या अर्धविराम से अलग करें। उदाहरण: पहली पंक्ति में 2, 0 और दूसरी पर 0, 3।",
      accuracyNote:
        "केवल 2×2 से 8×8 तक परिमित वास्तविक सममित मैट्रिक्स का समर्थन करता है; प्रत्येक मान ±1,000,000 के भीतर होना चाहिए। गैर-सममित मैट्रिक्स और जटिल eigenvalues ​​समर्थित नहीं हैं। eigenvectors की इकाई लंबाई होती है; उनका चिन्ह भिन्न हो सकता है. फ़्लोटिंग-पॉइंट परिणाम अनुमानित हैं।",
      resultSummary: "eigenpairs, eigenvalue",
      eigenvalue: "आइजेनवैल्यू",
      eigenvector: "सामान्यीकृत eigenvector",
      residual: "अवशिष्ट ‖Av − λv‖",
    },
    messages: {
      calculated: "आइजनजोड़ियों की गणना की गई।",
      copied: "परिणाम कॉपी किए गए।",
      copyUnavailable: "क्लिपबोर्ड इस ब्राउज़र में उपलब्ध नहीं है।",
      checkInputs: "मैट्रिक्स की जाँच करें और पुनः प्रयास करें।",
      emptyMatrix: "पहले एक मैट्रिक्स दर्ज करें।",
      invalidSize: "2×2 से 8×8 तक वर्ग मैट्रिक्स का उपयोग करें।",
      notSquare:
        "प्रत्येक पंक्ति में मानों की संख्या उतनी ही होनी चाहिए जितनी पंक्तियों में हैं।",
      notSymmetric:
        "यह मैट्रिक्स सममित नहीं है; Aᵢⱼ को Aⱼᵢ के बराबर होना चाहिए।",
      invalidEntry:
        "-1,000,000 से 1,000,000 तक परिमित संख्यात्मक मानों का उपयोग करें।",
      didNotConverge: "संख्यात्मक विधि इस इनपुट के लिए अभिसरण नहीं हुई।",
      exampleLoaded: "उदाहरण लोड किया गया: eigenvalues ​​2 और 3।",
    },
    additionalFaqs: [
      {
        question:
          "यह eigenvalue कैलकुलेटर किस प्रकार के मैट्रिक्स का समर्थन करता है?",
        answer:
          "यह 2×2 से 8×8 तक वास्तविक सममित वर्ग मैट्रिक्स का समर्थन करता है। यह गैर-सममित मैट्रिक्स या जटिल eigenvalues ​​​​के लिए eigenvalues ​​​​की गणना नहीं करता है।",
      },
      {
        question: "मैं आइजेनवेक्टर की जांच कैसे कर सकता हूं?",
        answer:
          "प्रत्येक परिणाम के लिए, प्रदर्शित सामान्यीकृत वेक्टर द्वारा गुणा किए गए A की तुलना उस वेक्टर द्वारा गुणा किए गए eigenvalue से करें। अवशिष्ट उनके अंतर के मानदंड की रिपोर्ट करता है; शून्य के निकट मान एक करीबी संख्यात्मक मिलान दर्शाते हैं।",
      },
      {
        question: "एक आइजनवेक्टर का चिन्ह भिन्न क्यों हो सकता है?",
        answer:
          "यदि v एक eigenvector है, तो -v भी समान eigenvalue के लिए एक eigenvector है। जहां संभव हो, उपकरण एक सुसंगत चिह्न चुनता है, लेकिन चिह्न गणितीय रूप से अद्वितीय नहीं है।",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  ar: {
    copyLanguage: "ar",
    name: "حاسبة القيمة الذاتية",
    title: "حاسبة القيمة الذاتية مجانا | UsefulVerse",
    description:
      "أوجد القيم الذاتية والمتجهات الذاتية والمتبقيات لمصفوفة متماثلة حقيقية. آلة حاسبة مجانية على الإنترنت؛ تبقى القيم في متصفحك.",
    intro:
      "قم بحساب وفحص الأزواج الذاتية للحصول على مصفوفة متماثلة حقيقية. انظر المتجهات الذاتية المقيسة والمتبقي لكل نتيجة.",
    howQuestion: "كيف يمكنني العثور على القيم الذاتية للمصفوفة؟",
    howAnswer:
      "أدخل مصفوفة متماثلة حقيقية مربعة، صف واحد لكل سطر، مع فصل القيم بفواصل أو مسافات. قم بالحساب لعرض القيم الذاتية المصنفة والمتجهات الذاتية الطبيعية والمتبقيات.",
    privacyQuestion: "هل تم تحميل قيم المصفوفة الخاصة بي؟",
    privacyAnswer:
      "لا. يتم تشغيل الحساب محليًا في هذا المتصفح. لا يتم تحميل قيم المصفوفة أو حفظها بواسطة هذه الأداة.",
    howTo: [
      "أدخل مصفوفة مربعة متماثلة حقيقية مكونة من 2 إلى 8 صفوف.",
      "افصل بين القيم بفواصل أو مسافات ثم ضع كل صف في سطر جديد.",
      "قم بالحساب، ثم تحقق من كل قيمة ذاتية ومتجه ذاتي طبيعي ومتبقي.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "حساب الأزواج الذاتية",
      example: "قم بتحميل المثال",
      reset: "مسح",
      copy: "نسخ النتائج",
    },
    fields: {
      matrix: "مصفوفة متماثلة حقيقية",
      matrixHint:
        "أدخل 2–8 صفوف، صف واحد في كل سطر. افصل بين القيم بفواصل أو مسافات أو فواصل منقوطة. مثال: 2،0 في السطر الأول و0،3 في الثاني.",
      accuracyNote:
        "يدعم المصفوفات المتماثلة الحقيقية المحدودة فقط، من 2×2 إلى 8×8؛ يجب أن تكون كل قيمة ضمن ±1,000,000. لا يتم دعم المصفوفات غير المتماثلة والقيم الذاتية المعقدة. المتجهات الذاتية لها وحدة طول؛ قد تختلف علاماتهم. نتائج الفاصلة العائمة تقريبية.",
      resultSummary: "القيم والمتجهات الذاتية، مرتبة حسب القيمة الذاتية",
      eigenvalue: "القيمة الذاتية",
      eigenvector: "المتجهات الذاتية المقيسة",
      residual: "المتبقي ‖Av − λv‖",
    },
    messages: {
      calculated: ".",
      copied: ".",
      copyUnavailable: "غير متوفرة في هذا المتصفح.",
      checkInputs: "افحص المصفوفة وحاول مرة أخرى.",
      emptyMatrix: "أدخل المصفوفة أولاً.",
      invalidSize: "استخدم مصفوفة مربعة من 2×2 إلى 8×8.",
      notSquare: "يجب أن يحتوي كل صف على نفس عدد القيم الموجودة في الصفوف.",
      notSymmetric: "هذه المصفوفة غير متماثلة؛ يجب أن يساوي Aᵢⱼ Aⱼᵢ.",
      invalidEntry:
        "استخدم القيم الرقمية المحدودة من -1,000,000 إلى 1,000,000.",
      didNotConverge: "لم تتقارب الطريقة الرقمية لهذا الإدخال.",
      exampleLoaded: ": القيم الذاتية 2 و3.",
    },
    additionalFaqs: [
      {
        question: "ما هي أنواع المصفوفات التي تدعمها حاسبة القيمة الذاتية هذه؟",
        answer:
          "وهو يدعم المصفوفات المربعة المتماثلة الحقيقية من 2×2 إلى 8×8. ولا يحسب القيم الذاتية للمصفوفات غير المتماثلة أو القيم الذاتية المعقدة.",
      },
      {
        question: "كيف يمكنني التحقق من المتجهات الذاتية؟",
        answer:
          "لكل نتيجة، قارن A مضروبًا في المتجه المقيس المعروض مع القيمة الذاتية مضروبة في ذلك المتجه. التقارير المتبقية معيار اختلافهم؛ تشير القيم القريبة من الصفر إلى تطابق رقمي قريب.",
      },
      {
        question: "لماذا يمكن أن يكون للمتجه الذاتي إشارة مختلفة؟",
        answer:
          "إذا كان v هو ناقل ذاتي، فإن −v هو أيضًا ناقل ذاتي لنفس القيمة الذاتية. تختار الأداة إشارة متسقة حيثما أمكن ذلك، ولكن الإشارة ليست فريدة من الناحية الرياضية.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  zh: {
    copyLanguage: "zh",
    name: "特征值计算器",
    title: "特征值计算器 免费 | UsefulVerse",
    description:
      "求实数对称矩阵的特征值、特征向量和残差。免费在线计算器；值保留在您的浏览器中。",
    intro:
      "计算并检查实数对称矩阵的特征对。查看每个结果的归一化特征向量和残差。",
    howQuestion: "如何求矩阵的特征值？",
    howAnswer:
      "输入一个实对称方阵，每行一行，值之间用逗号或空格分隔。计算以查看排序的特征值、归一化特征向量和残差。",
    privacyQuestion: "我的矩阵值是否已上传？",
    privacyAnswer: "否。计算在此浏览器中本地运行。此工具不会上传或保存矩阵值。",
    howTo: [
      "输入 2 至 8 行的实对称方阵。",
      "用逗号或空格分隔值并将每一行放在一个新行上。",
      "计算，然后检查每个特征值、归一化特征向量和残差。",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "计算特征对",
      example: "加载示例",
      reset: "清除",
      copy: "复制结果",
    },
    fields: {
      matrix: "实数对称矩阵",
      matrixHint:
        "输入 2–8 行，每行一行。用逗号、空格或分号分隔值。示例：第一行为 2, 0，第二行为 0, 3。",
      accuracyNote:
        "仅支持有限实对称矩阵，从 2×2 到 8×8；每个值必须在 ±1,000,000 范围内。不支持非对称矩阵和复特征值。特征向量有单位长度；他们的标志可能会有所不同。浮点结果是近似值。",
      resultSummary: "特征对，按特征值排序",
      eigenvalue: "特征值",
      eigenvector: "归一化特征向量",
      residual: "残余 ‖Av − λv‖",
    },
    messages: {
      calculated: "特征对。",
      copied: "结果已复制。",
      copyUnavailable: "剪贴板在此浏览器中不可用。",
      checkInputs: "检查矩阵并重试。",
      emptyMatrix: "首先输入一个矩阵。",
      invalidSize: "Use a square matrix from 2×2 to 8×8.",
      notSquare: "每行的值数量必须与行数相同。",
      notSymmetric: "该矩阵不是对称的； Aᵢⱼ 必须等于 Aⱼᵢ。",
      invalidEntry: "使用从 -1,000,000 到 1,000,000 的有限数值。",
      didNotConverge: "对于该输入，数值方法未收敛。",
      exampleLoaded: "已加载示例：特征值 2 和 3。",
    },
    additionalFaqs: [
      {
        question: "该特征值计算器支持哪些矩阵类型？",
        answer:
          "它支持从 2×2 到 8×8 的实对称方阵。它不计算非对称矩阵或复特征值的特征值。",
      },
      {
        question: "如何检查特征向量？",
        answer:
          "对于每个结果，将 A 乘以显示的归一化向量与特征值乘以该向量进行比较。残差报告其差异的范数；接近零的值表示数值接近匹配。",
      },
      {
        question: "为什么特征向量可以有不同的符号？",
        answer:
          "如果 v 是特征向量，则 -v 也是相同特征值的特征向量。该工具会尽可能选择一致的符号，但符号在数学上并不唯一。",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  bn: {
    copyLanguage: "bn",
    name: "Eigenvalue ক্যালকুলেটর",
    title: "Eigenvalue ক্যালকুলেটর বিনামূল্যে | UsefulVerse",
    description:
      "একটি বাস্তব প্রতিসম ম্যাট্রিক্সের জন্য eigenvalues, eigenvectors এবং residuals খুঁজুন। বিনামূল্যে অনলাইন ক্যালকুলেটর; মান আপনার ব্রাউজারে থাকে।",
    intro:
      "একটি বাস্তব প্রতিসম ম্যাট্রিক্সের জন্য eigenpairs গণনা করুন এবং পরীক্ষা করুন। প্রতিটি ফলাফলের জন্য স্বাভাবিক eigenvectors এবং অবশিষ্টাংশ দেখুন।",
    howQuestion: "আমি কিভাবে একটি ম্যাট্রিক্সের eigenvalues খুঁজে পাব?",
    howAnswer:
      "একটি বর্গাকার বাস্তব প্রতিসম ম্যাট্রিক্স লিখুন, প্রতি লাইনে একটি সারি, কমা বা স্পেস দ্বারা আলাদা করা মান সহ। সাজানো eigenvalues, normalized eigenvectors এবং residuals দেখতে গণনা করুন।",
    privacyQuestion: "আমার ম্যাট্রিক্স মান কি আপলোড করা হয়েছে?",
    privacyAnswer:
      "নং। এই ব্রাউজারে গণনা স্থানীয়ভাবে চলে। ম্যাট্রিক্স মান এই টুল দ্বারা আপলোড বা সংরক্ষণ করা হয় না.",
    howTo: [
      "2 থেকে 8 সারি সহ একটি বাস্তব প্রতিসম বর্গ ম্যাট্রিক্স লিখুন।",
      "কমা বা স্পেস দিয়ে মান আলাদা করুন এবং প্রতিটি সারি একটি নতুন লাইনে রাখুন।",
      "গণনা করুন, তারপর প্রতিটি eigenvalue, স্বাভাবিককৃত eigenvector এবং অবশিষ্টাংশ পরীক্ষা করুন।",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "eigenpairs",
      example: "লোড উদাহরণ",
      reset: "সাফ",
      copy: "ফলাফল কপি করুন",
    },
    fields: {
      matrix: "বাস্তব প্রতিসম ম্যাট্রিক্স",
      matrixHint:
        "2-8 সারি লিখুন, প্রতি লাইনে একটি। কমা, স্পেস বা সেমিকোলন দিয়ে আলাদা মান। উদাহরণ: প্রথম লাইনে 2, 0 এবং দ্বিতীয় লাইনে 0, 3।",
      accuracyNote:
        "শুধুমাত্র 2×2 থেকে 8×8 পর্যন্ত সীমিত বাস্তব প্রতিসম ম্যাট্রিক্স সমর্থন করে; প্রতিটি মান অবশ্যই ±1,000,000 এর মধ্যে হতে হবে। অ-প্রতিসম ম্যাট্রিক্স এবং জটিল eigenvalue সমর্থিত নয়। Eigenvectors একক দৈর্ঘ্য আছে; তাদের চিহ্ন ভিন্ন হতে পারে। ফ্লোটিং-পয়েন্ট ফলাফল আনুমানিক।",
      resultSummary: "Eigenpairs, eigenvalue",
      eigenvalue: "Eigenvalue",
      eigenvector: "সাধারনকৃত eigenvector",
      residual: "অবশিষ্ট ‖Av − λv‖",
    },
    messages: {
      calculated: "Eigenpairs গণনা করা হয়েছে।",
      copied: "ফলাফল কপি করা হয়েছে।",
      copyUnavailable: "ক্লিপবোর্ড এই ব্রাউজারে অনুপলব্ধ৷",
      checkInputs: "ম্যাট্রিক্স পরীক্ষা করুন এবং আবার চেষ্টা করুন।",
      emptyMatrix: "প্রথমে একটি ম্যাট্রিক্স লিখুন।",
      invalidSize: "2×2 থেকে 8×8 পর্যন্ত একটি বর্গ ম্যাট্রিক্স ব্যবহার করুন।",
      notSquare: "প্রতিটি সারিতে সারিগুলির সমান সংখ্যক মান থাকতে হবে।",
      notSymmetric: "এই ম্যাট্রিক্সটি প্রতিসম নয়; Aᵢⱼ অবশ্যই Aⱼᵢ এর সমান হবে।",
      invalidEntry:
        "−1,000,000 থেকে 1,000,000 পর্যন্ত সসীম সাংখ্যিক মান ব্যবহার করুন।",
      didNotConverge: "এই ইনপুটের জন্য সংখ্যাসূচক পদ্ধতি একত্রিত হয়নি।",
      exampleLoaded: "উদাহরণ লোড হয়েছে: eigenvalues 2 এবং 3.",
    },
    additionalFaqs: [
      {
        question: "এই eigenvalue ক্যালকুলেটর কোন ধরনের ম্যাট্রিক্স সমর্থন করে?",
        answer:
          "এটি 2×2 থেকে 8×8 পর্যন্ত বাস্তব প্রতিসম বর্গ ম্যাট্রিক্স সমর্থন করে। এটি অ-প্রতিসম ম্যাট্রিক্স বা জটিল eigenvalues ​​এর জন্য eigenvalues ​​গণনা করে না।",
      },
      {
        question: "আমি কিভাবে একটি eigenvector চেক করতে পারি?",
        answer:
          "প্রতিটি ফলাফলের জন্য, প্রদর্শিত স্বাভাবিক ভেক্টর দ্বারা গুণিত একটি ভেক্টর দ্বারা গুণিত eigenvalue এর সাথে তুলনা করুন। অবশিষ্টাংশ তাদের পার্থক্যের আদর্শ রিপোর্ট করে; শূন্যের কাছাকাছি মান একটি কাছাকাছি সংখ্যাসূচক মিল নির্দেশ করে।",
      },
      {
        question: "কেন একটি eigenvector একটি ভিন্ন চিহ্ন থাকতে পারে?",
        answer:
          "যদি v একটি eigenvector হয়, −v একই eigenvalue-এর জন্য একটি eigenvectorও। টুলটি যেখানে সম্ভব একটি সামঞ্জস্যপূর্ণ চিহ্ন বেছে নেয়, কিন্তু চিহ্নটি গাণিতিকভাবে অনন্য নয়।",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  ru: {
    copyLanguage: "ru",
    name: "Калькулятор собственных значений",
    title: "Калькулятор собственных значений бесплатно | UsefulVerse",
    description:
      "Найдите собственные значения, собственные векторы и остатки вещественной симметричной матрицы. Бесплатный онлайн-калькулятор; значения остаются в вашем…",
    intro:
      "Вычислить и проверить собственные пары вещественной симметричной матрицы. См. нормализованные собственные векторы и остаток для каждого результата.",
    howQuestion: "Как найти собственные значения матрицы?",
    howAnswer:
      "Введите квадратную вещественную симметричную матрицу, по одной строке в строке, значения которой разделены запятыми или пробелами. Вычислите, чтобы просмотреть отсортированные собственные значения, нормализованные собственные векторы и остатки.",
    privacyQuestion: "Загружены ли значения моей матрицы?",
    privacyAnswer:
      "Нет. Расчеты выполняются локально в этом браузере. Значения матрицы не загружаются и не сохраняются с помощью этого инструмента.",
    howTo: [
      "Введите действительную симметричную квадратную матрицу с числом от 2 до 8 строк.",
      "Разделяйте значения запятыми или пробелами и помещайте каждую строку на новую строку.",
      "Вычислите, затем проверьте каждое собственное значение, нормализованный собственный вектор и невязку.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Вычислить собственные пары",
      example: "Пример загрузки",
      reset: "Clear",
      copy: "Копировать результаты",
    },
    fields: {
      matrix: "Действительная симметричная матрица",
      matrixHint:
        "Введите 2–8 строк, по одной в строке. Разделяйте значения запятыми, пробелами или точками с запятой. Пример: 2, 0 в первой строке и 0, 3 во второй.",
      accuracyNote:
        "Поддерживает только конечные вещественные симметричные матрицы от 2×2 до 8×8; каждое значение должно находиться в пределах ±1 000 000. Несимметричные матрицы и комплексные собственные значения не поддерживаются. Собственные векторы имеют единичную длину; их знак может меняться. Результаты с плавающей запятой являются приблизительными.",
      resultSummary:
        "Собственные пары, отсортированные по собственному значению",
      eigenvalue: "Собственное значение",
      eigenvector: "Нормализованный собственный вектор",
      residual: "Остаток ‖Av − λv‖",
    },
    messages: {
      calculated: "Рассчитаны собственные пары.",
      copied: "Результаты скопированы.",
      copyUnavailable: "Буфер обмена недоступен в этом браузере.",
      checkInputs: "Проверьте матрицу и повторите попытку.",
      emptyMatrix: "Сначала введите матрицу.",
      invalidSize: "Используйте квадратную матрицу от 2×2 до 8×8.",
      notSquare:
        "Каждая строка должна иметь такое же количество значений, как и количество строк.",
      notSymmetric: "Эта матрица не симметрична; Aᵢⱼ должно равняться Aⱼᵢ.",
      invalidEntry:
        "Используйте конечные числовые значения от –1 000 000 до 1 000 000.",
      didNotConverge: "Численный метод не сходился для этих входных данных.",
      exampleLoaded: "Пример загружен: собственные значения 2 и 3.",
    },
    additionalFaqs: [
      {
        question:
          "Какие типы матриц поддерживает этот калькулятор собственных значений?",
        answer:
          "Поддерживает настоящие симметричные квадратные матрицы от 2×2 до 8×8. Он не вычисляет собственные значения для несимметричных матриц или комплексных собственных значений.",
      },
      {
        question: "Как проверить собственный вектор?",
        answer:
          "Для каждого результата сравните A, умноженное на отображаемый нормализованный вектор, с собственным значением, умноженным на этот вектор. Остаток сообщает норму их разницы; значения около нуля указывают на близкое числовое совпадение.",
      },
      {
        question: "Почему собственный вектор может иметь другой знак?",
        answer:
          "Если v — собственный вектор, −v также является собственным вектором для того же собственного значения. Инструмент выбирает последовательный знак там, где это возможно, но знак не является математически уникальным.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  ur: {
    copyLanguage: "ur",
    name: "Eigenvalue کیلکولیٹر",
    title: "Eigenvalue کیلکولیٹر مفت | UsefulVerse",
    description:
      "ایک حقیقی ہم آہنگی میٹرکس کے لیے eigenvalues، eigenvectors اور residuals تلاش کریں۔ مفت آن لائن کیلکولیٹر؛ اقدار آپ کے براؤزر میں رہتی ہیں۔",
    intro:
      "ایک حقیقی ہم آہنگ میٹرکس کے لیے eigenpairs کا حساب لگائیں اور چیک کریں۔ ہر نتیجہ کے لیے نارملائزڈ ایجین ویکٹرز اور بقایا دیکھیں۔",
    howQuestion: "میں میٹرکس کی eigenvalues کیسے تلاش کروں؟",
    howAnswer:
      "ایک مربع اصلی سمی میٹرکس درج کریں، ایک قطار فی لائن، کوما یا خالی جگہوں سے الگ کی گئی اقدار کے ساتھ۔ ترتیب شدہ eigenvalues، نارملائزڈ eigenvectors اور residuals کو دیکھنے کے لیے حساب لگائیں۔",
    privacyQuestion: "کیا میری میٹرکس ویلیوز اپ لوڈ ہیں؟",
    privacyAnswer:
      "نمبر۔ حساب اس براؤزر میں مقامی طور پر چلتا ہے۔ میٹرکس کی قدریں اس ٹول کے ذریعے اپ لوڈ یا محفوظ نہیں کی جاتی ہیں۔",
    howTo: [
      "2 سے 8 قطاروں کے ساتھ ایک حقیقی ہم آہنگ مربع میٹرکس درج کریں۔",
      "قدروں کو کوما یا خالی جگہوں سے الگ کریں اور ہر قطار کو نئی لائن پر رکھیں۔",
      "حساب لگائیں، پھر ہر ایگن ویلیو، نارملائزڈ ایگین ویکٹر اور بقایا کو چیک کریں۔",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "eigen pairs",
      example: "لوڈ کی مثال",
      reset: "صاف",
      copy: "نتائج کاپی کریں",
    },
    fields: {
      matrix: "اصلی سمیٹرک میٹرکس",
      matrixHint:
        "2-8 قطاریں، ایک فی لائن درج کریں۔ قدروں کو کوما، خالی جگہوں یا سیمی کالنز سے الگ کریں۔ مثال: پہلی لائن پر 2، 0 اور دوسری لائن پر 0، 3۔",
      accuracyNote:
        "صرف 2×2 سے 8×8 تک محدود حقیقی سمی میٹرک میٹرکس کو سپورٹ کرتا ہے۔ ہر قدر ±1,000,000 کے اندر ہونی چاہیے۔ غیر ہم آہنگ میٹرکس اور پیچیدہ ایگن ویلیوز تعاون یافتہ نہیں ہیں۔ Eigenvectors کی اکائی کی لمبائی ہوتی ہے۔ ان کے نشان مختلف ہو سکتے ہیں. فلوٹنگ پوائنٹ کے نتائج تخمینی ہیں۔",
      resultSummary: "Eigenpairs، eigenvalue",
      eigenvalue: "Eigenvalue",
      eigenvector: "نارملائزڈ eigenvector",
      residual: "بقایا ‖Av - λv‖",
    },
    messages: {
      calculated: "Eigenpairs کا حساب لگایا گیا۔",
      copied: "نتائج کاپی ہو گئے۔",
      copyUnavailable: "کلپ بورڈ اس براؤزر میں دستیاب نہیں ہے۔",
      checkInputs: "میٹرکس چیک کریں اور دوبارہ کوشش کریں۔",
      emptyMatrix: "پہلے میٹرکس درج کریں۔",
      invalidSize: "2×2 سے 8×8 تک مربع میٹرکس استعمال کریں۔",
      notSquare:
        "ہر قطار کی قدروں کی اتنی ہی تعداد ہونی چاہیے جتنی قطاریں ہیں۔",
      notSymmetric: "یہ میٹرکس ہم آہنگ نہیں ہے۔ Aᵢⱼ Aⱼᵢ کے برابر ہونا چاہیے۔",
      invalidEntry:
        "−1,000,000 سے 1,000,000 تک محدود عددی اقدار کا استعمال کریں۔",
      didNotConverge: "عددی طریقہ اس ان پٹ کے لیے اکٹھا نہیں ہوا۔",
      exampleLoaded: "مثال بھری ہوئی: eigenvalues 2 اور 3.",
    },
    additionalFaqs: [
      {
        question:
          "یہ eigenvalue کیلکولیٹر کن میٹرکس کی اقسام کو سپورٹ کرتا ہے؟",
        answer:
          "یہ 2 × 2 سے 8 × 8 تک حقیقی ہم آہنگ مربع میٹرکس کو سپورٹ کرتا ہے۔ یہ غیر متوازی میٹرکس یا پیچیدہ ایگن ویلیوز کے لیے eigenvalues ​​کا حساب نہیں لگاتا ہے۔",
      },
      {
        question: "میں ایک eigenvector کو کیسے چیک کر سکتا ہوں؟",
        answer:
          "ہر ایک نتیجہ کے لیے، دکھائے گئے نارملائزڈ ویکٹر سے ضرب کردہ A کا موازنہ اس ویکٹر سے ضرب کردہ eigenvalue سے کریں۔ بقایا ان کے فرق کے معمول کی رپورٹ کرتا ہے؛ صفر کے قریب قدریں قریبی عددی مماثلت کی نشاندہی کرتی ہیں۔",
      },
      {
        question: "ایک eigenvector کی ایک مختلف علامت کیوں ہو سکتی ہے؟",
        answer:
          "اگر v ایک eigenvector ہے، −v اسی eigenvalue کے لیے ایک eigenvector بھی ہے۔ ٹول جہاں ممکن ہو ایک مستقل نشان کا انتخاب کرتا ہے، لیکن سائن ریاضی کے لحاظ سے منفرد نہیں ہے۔",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  tr: {
    copyLanguage: "tr",
    name: "Özdeğer Hesaplayıcı",
    title: "Özdeğer Hesaplayıcı ücretsiz | UsefulVerse",
    description:
      "Gerçek bir simetrik matris için özdeğerleri, özvektörleri ve artıkları bulun. Ücretsiz çevrimiçi hesap makinesi; değerler tarayıcınızda kalır.",
    intro:
      "Gerçek bir simetrik matris için özçiftleri hesaplayın ve kontrol edin. Her sonuç için normalleştirilmiş özvektörlere ve kalıntıya bakın.",
    howQuestion: "Bir matrisin özdeğerlerini nasıl bulurum?",
    howAnswer:
      "Değerleri virgül veya boşluklarla ayrılmış şekilde, satır başına bir satır olacak şekilde kare gerçek simetrik bir matris girin. Sıralanmış özdeğerleri, normalleştirilmiş özvektörleri ve artıkları görüntülemek için hesaplama yapın.",
    privacyQuestion: "Matris değerlerim yüklendi mi?",
    privacyAnswer:
      "Hayır. Hesaplama bu tarayıcıda yerel olarak çalışır. Matris değerleri bu araç tarafından yüklenmez veya kaydedilmez.",
    howTo: [
      "2 ila 8 satıra sahip gerçek bir simetrik kare matris girin.",
      "Değerleri virgül veya boşluklarla ayırın ve her satırı yeni bir satıra yerleştirin.",
      "Hesaplayın ve ardından her bir özdeğeri, normalleştirilmiş özvektörü ve artığı kontrol edin.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Özçiftleri hesaplayın",
      example: "Yük örneği",
      reset: "Temizle",
      copy: "Sonuçları kopyala",
    },
    fields: {
      matrix: "Gerçek simetrik matris",
      matrixHint:
        "Her satıra bir tane gelecek şekilde 2-8 satır girin. Değerleri virgül, boşluk veya noktalı virgülle ayırın. Örnek: İlk satırda 2, 0 ve ikinci satırda 0, 3.",
      accuracyNote:
        "Yalnızca 2×2'den 8×8'e kadar sonlu gerçek simetrik matrisleri destekler; her değer ±1.000.000 aralığında olmalıdır. Simetrik olmayan matrisler ve karmaşık özdeğerler desteklenmez. Özvektörlerin birim uzunluğu vardır; işaretleri değişebilir. Kayan nokta sonuçları yaklaşık değerlerdir.",
      resultSummary: "Özçiftler, özdeğere göre sıralanmıştır",
      eigenvalue: "Özdeğer",
      eigenvector: "Normalleştirilmiş özvektör",
      residual: "Artık ‖Av − λv‖",
    },
    messages: {
      calculated: "Özçiftler hesaplandı.",
      copied: "Sonuçlar kopyalandı.",
      copyUnavailable: "Pano bu tarayıcıda kullanılamıyor.",
      checkInputs: "Matrisi kontrol edin ve tekrar deneyin.",
      emptyMatrix: "Önce bir matris girin.",
      invalidSize: "2×2'den 8×8'e kadar bir kare matris kullanın.",
      notSquare:
        "Her satır, satır sayısıyla aynı sayıda değere sahip olmalıdır.",
      notSymmetric: "Bu matris simetrik değildir; Aᵢⱼ, Aⱼᵢ'ye eşit olmalıdır.",
      invalidEntry:
        "-1.000.000 ile 1.000.000 arasında sonlu sayısal değerler kullanın.",
      didNotConverge: "Sayısal yöntem bu girdi için yakınsamadı.",
      exampleLoaded: "Yüklenen örnek: özdeğerler 2 ve 3.",
    },
    additionalFaqs: [
      {
        question:
          "Bu özdeğer hesaplayıcısı hangi matris türlerini destekliyor?",
        answer:
          "2×2'den 8×8'e kadar gerçek simetrik kare matrisleri destekler. Simetrik olmayan matrisler veya karmaşık özdeğerler için özdeğerleri hesaplamaz.",
      },
      {
        question: "Bir özvektörü nasıl kontrol edebilirim?",
        answer:
          "Her sonuç için, A'nın görüntülenen normalleştirilmiş vektörle çarpımı ile özdeğerin o vektörle çarpımı ile karşılaştırın. Artık, farklılıklarının normunu bildirir; sıfıra yakın değerler yakın bir sayısal eşleşmeyi gösterir.",
      },
      {
        question: "Bir özvektörün işareti neden farklı olabilir?",
        answer:
          "Eğer v bir özvektör ise, −v de aynı özdeğer için bir özvektördür. Araç mümkün olan yerlerde tutarlı bir işaret seçer ancak işaret matematiksel olarak benzersiz değildir.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  vi: {
    copyLanguage: "vi",
    name: "Máy tính giá trị riêng",
    title: "Máy tính giá trị riêng miễn phí | UsefulVerse",
    description:
      "Tìm giá trị riêng, vectơ riêng và phần dư cho ma trận đối xứng thực. Máy tính trực tuyến miễn phí; các giá trị vẫn còn trong trình duyệt của bạn.",
    intro:
      "Tính toán và kiểm tra các cặp riêng cho ma trận đối xứng thực. Xem các vectơ riêng đã chuẩn hóa và phần dư cho mỗi kết quả.",
    howQuestion: "Làm cách nào để tìm giá trị riêng của ma trận?",
    howAnswer:
      "Nhập ma trận thực vuông đối xứng, mỗi hàng một dòng, với các giá trị được phân tách bằng dấu phẩy hoặc dấu cách. Tính toán để xem các giá trị riêng được sắp xếp, vectơ riêng chuẩn hóa và phần dư.",
    privacyQuestion: "Các giá trị ma trận của tôi có được tải lên không?",
    privacyAnswer:
      "Không. Phép tính chạy cục bộ trong trình duyệt này. Các giá trị ma trận không được tải lên hoặc lưu bởi công cụ này.",
    howTo: [
      "Nhập ma trận vuông đối xứng thực có từ 2 đến 8 hàng.",
      "Phân tách các giá trị bằng dấu phẩy hoặc dấu cách và đặt mỗi hàng trên một dòng mới.",
      "Tính toán, sau đó kiểm tra từng giá trị riêng, vectơ riêng chuẩn hóa và số dư.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Tính các cặp riêng",
      example: "Ví dụ tải",
      reset: "Xóa",
      copy: "Sao chép kết quả",
    },
    fields: {
      matrix: "Ma trận đối xứng thực",
      matrixHint:
        "Nhập 2–8 hàng, mỗi hàng một dòng. Phân tách các giá trị bằng dấu phẩy, dấu cách hoặc dấu chấm phẩy. Ví dụ: 2, 0 ở dòng đầu tiên và 0, 3 ở dòng thứ hai.",
      accuracyNote:
        "Chỉ hỗ trợ ma trận đối xứng thực hữu hạn, từ 2×2 đến 8×8; mỗi giá trị phải nằm trong khoảng ±1.000.000. Ma trận không đối xứng và giá trị riêng phức tạp không được hỗ trợ. Các vectơ riêng có độ dài đơn vị; dấu hiệu của họ có thể khác nhau. Kết quả dấu phẩy động là gần đúng.",
      resultSummary: "Các cặp riêng, được sắp xếp theo giá trị riêng",
      eigenvalue: "Giá trị riêng",
      eigenvector: "vectơ riêng chuẩn hóa",
      residual: "Dư ‖Av − λv‖",
    },
    messages: {
      calculated: "Các cặp Eigen đã được tính toán.",
      copied: "Đã sao chép kết quả.",
      copyUnavailable: "Clipboard không khả dụng trong trình duyệt này.",
      checkInputs: "Hãy kiểm tra ma trận và thử lại.",
      emptyMatrix: "Nhập ma trận trước.",
      invalidSize: "Sử dụng ma trận vuông từ 2×2 đến 8×8.",
      notSquare: "Mỗi hàng phải có cùng số lượng giá trị như có hàng.",
      notSymmetric: "Ma trận này không đối xứng; Aᵢⱼ phải bằng Aⱼᵢ.",
      invalidEntry:
        "Sử dụng các giá trị số hữu hạn từ −1.000.000 đến 1.000.000.",
      didNotConverge: "Phương pháp số không hội tụ cho đầu vào này.",
      exampleLoaded: "Ví dụ đã được tải: giá trị riêng 2 và 3.",
    },
    additionalFaqs: [
      {
        question: "Máy tính giá trị riêng này hỗ trợ loại ma trận nào?",
        answer:
          "Nó hỗ trợ các ma trận vuông đối xứng thực từ 2×2 đến 8×8. Nó không tính toán giá trị riêng cho ma trận không đối xứng hoặc giá trị riêng phức tạp.",
      },
      {
        question: "Làm cách nào để kiểm tra vectơ riêng?",
        answer:
          "Với mỗi kết quả, hãy so sánh A nhân với vectơ chuẩn hóa được hiển thị với giá trị riêng nhân với vectơ đó. Phần dư báo cáo chuẩn mực về sự khác biệt của chúng; các giá trị gần bằng 0 biểu thị sự trùng khớp về mặt số học.",
      },
      {
        question: "Tại sao vectơ riêng có thể có dấu khác?",
        answer:
          "Nếu v là một vectơ riêng, −v cũng là một vectơ riêng cho cùng một giá trị riêng. Công cụ chọn một dấu hiệu nhất quán nếu có thể, nhưng dấu hiệu đó không phải là dấu hiệu duy nhất về mặt toán học.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  it: {
    copyLanguage: "it",
    name: "Calcolatore degli autovalori",
    title: "Calcolatore degli autovalori gratis | UsefulVerse",
    description:
      "Trovare autovalori, autovettori e residui per una matrice reale simmetrica. Calcolatore online gratuito; i valori rimangono nel tuo browser.",
    intro:
      "Calcola e verifica gli autoaccoppiamenti per una matrice simmetrica reale. Vedi gli autovettori normalizzati e il residuo per ciascun risultato.",
    howQuestion: "Come trovo gli autovalori di una matrice?",
    howAnswer:
      "Immettere una matrice quadrata simmetrica reale, una riga per riga, con valori separati da virgole o spazi. Calcola per visualizzare autovalori ordinati, autovettori normalizzati e residui.",
    privacyQuestion: "I valori della mia matrice sono caricati?",
    privacyAnswer:
      "No. Il calcolo viene eseguito localmente in questo browser. I valori della matrice non vengono caricati o salvati da questo strumento.",
    howTo: [
      "Immettere una matrice quadrata simmetrica reale con da 2 a 8 righe.",
      "Separa i valori con virgole o spazi e inserisci ogni riga su una nuova riga.",
      "Calcolare, quindi controllare ciascun autovalore, autovettore normalizzato e residuo.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Calcola le autocoppie",
      example: "Carica esempio",
      reset: "Cancella",
      copy: "Copia risultati",
    },
    fields: {
      matrix: "Matrice reale simmetrica",
      matrixHint:
        "Inserisci da 2 a 8 righe, una per riga. Separare i valori con virgole, spazi o punto e virgola. Esempio: 2, 0 sulla prima riga e 0, 3 sulla seconda.",
      accuracyNote:
        "Supporta solo matrici simmetriche reali finite, da 2×2 a 8×8; ciascun valore deve essere compreso tra ±1.000.000. Le matrici non simmetriche e gli autovalori complessi non sono supportati. Gli autovettori hanno lunghezza unitaria; il loro segno può variare. I risultati in virgola mobile sono approssimativi.",
      resultSummary: "Autocoppie, ordinate per autovalore",
      eigenvalue: "Autovalore",
      eigenvector: "Autovettore normalizzato",
      residual: "Residuo ‖Av − λv‖",
    },
    messages: {
      calculated: "Autocoppie calcolate.",
      copied: "Risultati copiati.",
      copyUnavailable: "Appunti non è disponibile in questo browser.",
      checkInputs: "Controlla la matrice e riprova.",
      emptyMatrix: "Immettere prima una matrice.",
      invalidSize: "Utilizza una matrice quadrata da 2×2 a 8×8.",
      notSquare:
        "Ogni riga deve avere lo stesso numero di valori quante sono le righe.",
      notSymmetric:
        "Questa matrice non è simmetrica; Aᵢⱼ deve essere uguale ad Aⱼᵢ.",
      invalidEntry:
        "Utilizza valori numerici finiti compresi tra −1.000.000 e 1.000.000.",
      didNotConverge: "Il metodo numerico non converge per questo input.",
      exampleLoaded: "Esempio caricato: autovalori 2 e 3.",
    },
    additionalFaqs: [
      {
        question:
          "Quali tipi di matrice supporta questo calcolatore di autovalori?",
        answer:
          "Supporta matrici quadrate simmetriche reali da 2×2 a 8×8. Non calcola gli autovalori per matrici non simmetriche o autovalori complessi.",
      },
      {
        question: "Come posso controllare un autovettore?",
        answer:
          "Per ciascun risultato, confrontare A moltiplicato per il vettore normalizzato visualizzato con l'autovalore moltiplicato per quel vettore. Il residuo riporta la norma della loro differenza; valori vicini allo zero indicano una stretta corrispondenza numerica.",
      },
      {
        question: "Perché un autovettore può avere segno diverso?",
        answer:
          "Se v è un autovettore, anche −v è un autovettore per lo stesso autovalore. Lo strumento sceglie un segno coerente ove possibile, ma il segno non è matematicamente univoco.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  zh_tw: {
    copyLanguage: "zh_tw",
    name: "特徵值計算器",
    title: "特徵值計算器 免費 | UsefulVerse",
    description:
      "求實數對稱矩陣的特徵值、特徵向量和殘差。免費線上計算器；值保留在您的瀏覽器中。",
    intro:
      "計算並檢查實數對稱矩陣的特徵對。查看每個結果的歸一化特徵向量和殘差。",
    howQuestion: "如何求矩陣的特徵值？",
    howAnswer:
      "輸入實對稱方陣，每行一行，數值之間以逗號或空格分隔。計算以查看排序的特徵值、歸一化特徵向量和殘差。",
    privacyQuestion: "我的矩陣值是否已上傳？",
    privacyAnswer: "否。計算在此瀏覽器中本地運行。此工具不會上傳或儲存矩陣值。",
    howTo: [
      "輸入 2 至 8 行的實對稱方陣。",
      "用逗號或空格分隔值並將每一行放在一個新行上。",
      "計算，然後檢查每個特徵值、歸一化特徵向量和殘差。",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "計算特徵對",
      example: "載入範例",
      reset: "清除",
      copy: "複製結果",
    },
    fields: {
      matrix: "實數對稱矩陣",
      matrixHint:
        "輸入 2–8 行，每行一行。用逗號、空格或分號分隔數值。例：第一行為 2, 0，第二行為 0, 3。",
      accuracyNote:
        "僅支援有限實對稱矩陣，從 2×2 到 8×8；每個值必須在 ±1,000,000 範圍內。不支援非對稱矩陣和複特徵值。特徵向量有單位長度；他們的標誌可能會有所不同。浮點結果是近似值。",
      resultSummary: "特徵對，依特徵值排序",
      eigenvalue: "特徵值",
      eigenvector: "歸一化特徵向量",
      residual: "殘餘 ‖Av − λv‖",
    },
    messages: {
      calculated: "特徵對。",
      copied: "結果已複製。",
      copyUnavailable: "剪貼簿在此瀏覽器中不可用。",
      checkInputs: "檢查矩陣並重試。",
      emptyMatrix: "先輸入一個矩陣。",
      invalidSize: "Use a square matrix from 2×2 to 8×8.",
      notSquare: "每行的值數量必須與行數相同。",
      notSymmetric: "此矩陣不是對稱的； Aᵢⱼ 必須等於 Aⱼᵢ。",
      invalidEntry: "使用從 -1,000,000 到 1,000,000 的有限數值。",
      didNotConverge: "對於該輸入，數值方法未收斂。",
      exampleLoaded: "已載入範例：特徵值 2 和 3。",
    },
    additionalFaqs: [
      {
        question: "此特徵值計算器支援哪些矩陣類型？",
        answer:
          "它支援從 2×2 到 8×8 的實對稱方陣。它不計算非對稱矩陣或複特徵值的特徵值。",
      },
      {
        question: "如何檢查特徵向量？",
        answer:
          "對於每個結果，將 A 乘以顯示的歸一化向量與特徵值乘以該向量進行比較。殘差報告其差異的範數；接近零的值表示數值接近匹配。",
      },
      {
        question: "為什麼特徵向量可以有不同的符號？",
        answer:
          "如果 v 是特徵向量，則 -v 也是相同特徵值的特徵向量。該工具會盡可能選擇一致的符號，但符號在數學上並不唯一。",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  bg: {
    copyLanguage: "bg",
    name: "Калкулатор на собствената стойност",
    title: "Калкулатор на собствената стойност безплатно | UsefulVerse",
    description:
      "Намиране на собствени стойности, собствени вектори и остатъци за реална симетрична матрица. Безплатен онлайн калкулатор; стойностите остават във вашия браузър.",
    intro:
      "Изчислете и проверете собствените двойки за реална симетрична матрица. Вижте нормализираните собствени вектори и остатъка за всеки резултат.",
    howQuestion: "Как да намеря собствените стойности на матрица?",
    howAnswer:
      "Въведете квадратна реална симетрична матрица, един ред на ред, със стойности, разделени със запетаи или интервали. Изчислете, за да видите сортирани собствени стойности, нормализирани собствени вектори и остатъци.",
    privacyQuestion: "Качени ли са моите матрични стойности?",
    privacyAnswer:
      "Не. Изчислението се изпълнява локално в този браузър. Стойностите на матрицата не се качват или запазват от този инструмент.",
    howTo: [
      "Въведете реална симетрична квадратна матрица с 2 до 8 реда.",
      "Разделете стойностите със запетаи или интервали и поставете всеки ред на нов ред.",
      "Изчислете, след това проверете всяка собствена стойност, нормализиран собствен вектор и остатък.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Изчисляване на собствени двойки",
      example: "Пример за зареждане",
      reset: "Изчистване на",
      copy: "Копиране на резултатите",
    },
    fields: {
      matrix: "Реална симетрична матрица",
      matrixHint:
        "Въведете 2–8 реда, по един на ред. Разделете стойностите със запетаи, интервали или точка и запетая. Пример: 2, 0 на първия ред и 0, 3 на втория.",
      accuracyNote:
        "Поддържа само крайни реални симетрични матрици, от 2×2 до 8×8; всяка стойност трябва да е в рамките на ±1 000 000. Несиметрични матрици и комплексни собствени стойности не се поддържат. Собствените вектори имат единична дължина; техният знак може да варира. Резултатите с плаваща запетая са приблизителни.",
      resultSummary: "Собствени двойки, сортирани по собствена стойност",
      eigenvalue: "Собствена стойност",
      eigenvector: "Нормализиран собствен вектор",
      residual: "Остатъчен ‖Av − λv‖",
    },
    messages: {
      calculated: "Изчислени собствени двойки.",
      copied: "Резултатите са копирани.",
      copyUnavailable: "Клипбордът не е наличен в този браузър.",
      checkInputs: "Проверете матрицата и опитайте отново.",
      emptyMatrix: "Първо въведете матрица.",
      invalidSize: "Използвайте квадратна матрица от 2×2 до 8×8.",
      notSquare:
        "Всеки ред трябва да има същия брой стойности, колкото има редове.",
      notSymmetric:
        "Тази матрица не е симетрична; Aᵢⱼ трябва да е равно на Aⱼᵢ.",
      invalidEntry:
        "Използвайте крайни числови стойности от −1 000 000 до 1 000 000.",
      didNotConverge: "Численият метод не се сближи за този вход.",
      exampleLoaded: "Зареден пример: собствени стойности 2 и 3.",
    },
    additionalFaqs: [
      {
        question:
          "Какви типове матрици поддържа този калкулатор за собствени стойности?",
        answer:
          "Поддържа реални симетрични квадратни матрици от 2×2 до 8×8. Той не изчислява собствени стойности за несиметрични матрици или комплексни собствени стойности.",
      },
      {
        question: "Как мога да проверя собствен вектор?",
        answer:
          "За всеки резултат сравнете A, умножено по показания нормализиран вектор, със собствената стойност, умножена по този вектор. Остатъкът отчита нормата на тяхната разлика; стойности близо до нула показват близко числово съвпадение.",
      },
      {
        question: "Защо един собствен вектор може да има различен знак?",
        answer:
          "Ако v е собствен вектор, −v също е собствен вектор за същата собствена стойност. Инструментът избира последователен знак, когато е възможно, но знакът не е математически уникален.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  ca: {
    copyLanguage: "ca",
    name: "Calculadora de valors propis",
    title: "Calculadora de valors propis gratuït | UsefulVerse",
    description:
      "Troba valors propis, vectors propis i residus per a una matriu simètrica real. Calculadora en línia gratuïta; els valors romanen al vostre navegador.",
    intro:
      "Calcular i comprovar parells propis per a una matriu simètrica real. Vegeu vectors propis normalitzats i el residu de cada resultat.",
    howQuestion: "Com trobo els valors propis d'una matriu?",
    howAnswer:
      "Introduïu una matriu simètrica real quadrada, una fila per línia, amb valors separats per comes o espais. Calcula per veure valors propis ordenats, vectors propis normalitzats i residus.",
    privacyQuestion: "S'han penjat els meus valors de matriu?",
    privacyAnswer:
      "No. El càlcul s'executa localment en aquest navegador. Aquesta eina no carrega ni desa els valors de la matriu.",
    howTo: [
      "Introduïu una matriu quadrada simètrica real amb 2 a 8 files.",
      "Separeu els valors amb comes o espais i col·loqueu cada fila en una línia nova.",
      "Calculeu i comproveu cada valor propi, vector propi normalitzat i residual.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Calcula parells propis",
      example: "Carrega l'exemple",
      reset: "Esborra",
      copy: "Copia els resultats",
    },
    fields: {
      matrix: "Matriu simètrica real",
      matrixHint:
        "Introduïu de 2 a 8 files, una per línia. Separeu els valors amb comes, espais o punt i coma. Exemple: 2, 0 a la primera línia i 0, 3 a la segona.",
      accuracyNote:
        "Només admet matrius simètriques reals finites, de 2×2 a 8×8; cada valor ha d'estar dins de ±1.000.000. No s'admeten matrius no simètriques ni valors propis complexos. Els vectors propis tenen longitud unitat; el seu signe pot variar. Els resultats de coma flotant són aproximats.",
      resultSummary: "Parelles pròpies, ordenades per valor propi",
      eigenvalue: "Valor propi",
      eigenvector: "Vector propi normalitzat",
      residual: "Residual ‖Av − λv‖",
    },
    messages: {
      calculated: "Parelles pròpies calculats.",
      copied: "Resultats copiats.",
      copyUnavailable: "no està disponible en aquest navegador.",
      checkInputs: "Comproveu la matriu i torneu-ho a provar.",
      emptyMatrix: "Introduïu primer una matriu.",
      invalidSize: "Utilitzeu una matriu quadrada de 2×2 a 8×8.",
      notSquare:
        "Cada fila ha de tenir el mateix nombre de valors que hi ha files.",
      notSymmetric:
        "Aquesta matriu no és simètrica; Aᵢⱼ ha de ser igual a Aⱼᵢ.",
      invalidEntry:
        "Utilitzeu valors numèrics finits de −1.000.000 a 1.000.000.",
      didNotConverge:
        "El mètode numèric no ha convergit per a aquesta entrada.",
      exampleLoaded: "Exemple carregat: valors propis 2 i 3.",
    },
    additionalFaqs: [
      {
        question:
          "Quins tipus de matrius admet aquesta calculadora de valors propis?",
        answer:
          "Admet matrius quadrades simètriques reals de 2×2 a 8×8. No calcula valors propis per a matrius no simètriques o valors propis complexos.",
      },
      {
        question: "Com puc comprovar un vector propi?",
        answer:
          "Per a cada resultat, compareu A multiplicat pel vector normalitzat mostrat amb el valor propi multiplicat per aquest vector. El residu informa la norma de la seva diferència; els valors propers a zero indiquen una coincidència numèrica propera.",
      },
      {
        question: "Per què un vector propi pot tenir un signe diferent?",
        answer:
          "Si v és un vector propi, −v també és un vector propi per al mateix valor propi. L'eina tria un signe consistent quan és possible, però el signe no és matemàticament únic.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  nl: {
    copyLanguage: "nl",
    name: "Eigenwaardecalculator",
    title: "Eigenwaardecalculator gratis | UsefulVerse",
    description:
      "Vind eigenwaarden, eigenvectoren en residuen voor een echte symmetrische matrix. Gratis online rekenmachine; waarden blijven in uw browser staan.",
    intro:
      "Bereken en controleer eigenparen voor een echte symmetrische matrix. Zie genormaliseerde eigenvectoren en het residu voor elk resultaat.",
    howQuestion: "Hoe vind ik de eigenwaarden van een matrix?",
    howAnswer:
      "Voer een vierkante, reëel symmetrische matrix in, één rij per regel, met waarden gescheiden door komma's of spaties. Bereken om gesorteerde eigenwaarden, genormaliseerde eigenvectoren en residuen te bekijken.",
    privacyQuestion: "Worden mijn matrixwaarden geüpload?",
    privacyAnswer:
      "Nee. De berekening wordt lokaal in deze browser uitgevoerd. Matrixwaarden worden door deze tool niet geüpload of opgeslagen.",
    howTo: [
      "Voer een echte symmetrische vierkante matrix in met 2 tot 8 rijen.",
      "Scheid waarden met komma's of spaties en plaats elke rij op een nieuwe regel.",
      "Bereken en controleer vervolgens elke eigenwaarde, genormaliseerde eigenvector en residu.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Bereken eigenparen",
      example: "Laadvoorbeeld",
      reset: "Wis",
      copy: "Kopieer resultaten",
    },
    fields: {
      matrix: "Echte symmetrische matrix",
      matrixHint:
        "Voer 2–8 rijen in, één per regel. Scheid waarden met komma's, spaties of puntkomma's. Voorbeeld: 2, 0 op de eerste regel en 0, 3 op de tweede.",
      accuracyNote:
        "Ondersteunt alleen eindige, reële symmetrische matrices, van 2×2 tot 8×8; elke waarde moet binnen ±1.000.000 liggen. Niet-symmetrische matrices en complexe eigenwaarden worden niet ondersteund. Eigenvectoren hebben een eenheidslengte; hun teken kan variëren. Drijvende-kommaresultaten zijn bij benadering.",
      resultSummary: "Eigenparen, gesorteerd op eigenwaarde",
      eigenvalue: "Eigenwaarde",
      eigenvector: "Genormaliseerde eigenvector",
      residual: "Resterend ‖Av − λv‖",
    },
    messages: {
      calculated: "Eigenparen berekend.",
      copied: "Resultaten gekopieerd.",
      copyUnavailable: "Klembord is niet beschikbaar in deze browser.",
      checkInputs: "Controleer de matrix en probeer het opnieuw.",
      emptyMatrix: "Voer eerst een matrix in.",
      invalidSize: "Gebruik een vierkante matrix van 2×2 tot 8×8.",
      notSquare:
        "Elke rij moet hetzelfde aantal waarden hebben als er rijen zijn.",
      notSymmetric:
        "Deze matrix is niet symmetrisch; Aᵢⱼ moet gelijk zijn aan Aⱼᵢ.",
      invalidEntry:
        "Gebruik eindige numerieke waarden van −1.000.000 tot 1.000.000.",
      didNotConverge:
        "De numerieke methode convergeerde niet voor deze invoer.",
      exampleLoaded: "Voorbeeld geladen: eigenwaarden 2 en 3.",
    },
    additionalFaqs: [
      {
        question: "Welke matrixtypen ondersteunt deze eigenwaardecalculator?",
        answer:
          "Het ondersteunt echte symmetrische vierkante matrices van 2×2 tot en met 8×8. Er worden geen eigenwaarden berekend voor niet-symmetrische matrices of complexe eigenwaarden.",
      },
      {
        question: "Hoe kan ik een eigenvector controleren?",
        answer:
          "Vergelijk voor elk resultaat A vermenigvuldigd met de weergegeven genormaliseerde vector met de eigenwaarde vermenigvuldigd met die vector. Het residu rapporteert de norm van hun verschil; waarden dichtbij nul duiden op een nauwe numerieke overeenkomst.",
      },
      {
        question: "Waarom kan een eigenvector een ander teken hebben?",
        answer:
          "Als v een eigenvector is, is −v ook een eigenvector voor dezelfde eigenwaarde. De tool kiest waar mogelijk een consistent teken, maar teken is wiskundig gezien niet uniek.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  el: {
    copyLanguage: "el",
    name: "Υπολογιστής ιδιοτιμών",
    title: "Υπολογιστής ιδιοτιμών δωρεάν | UsefulVerse",
    description:
      "Βρείτε ιδιοτιμές, ιδιοδιανύσματα και υπολείμματα για έναν πραγματικό συμμετρικό πίνακα. Δωρεάν ηλεκτρονική αριθμομηχανή. οι τιμές παραμένουν στο πρόγραμμα…",
    intro:
      "Υπολογίστε και ελέγξτε τα ιδιοζεύγη για έναν πραγματικό συμμετρικό πίνακα. Δείτε κανονικοποιημένα ιδιοδιανύσματα και το υπόλοιπο για κάθε αποτέλεσμα.",
    howQuestion: "Πώς μπορώ να βρω τις ιδιοτιμές ενός πίνακα;",
    howAnswer:
      "Εισαγάγετε έναν τετράγωνο πραγματικό συμμετρικό πίνακα, μία γραμμή ανά γραμμή, με τιμές διαχωρισμένες με κόμμα ή κενά. Υπολογίστε για να δείτε ταξινομημένες ιδιοτιμές, κανονικοποιημένα ιδιοδιανύσματα και υπολείμματα.",
    privacyQuestion: "Έχουν μεταφορτωθεί οι τιμές του πίνακα μου;",
    privacyAnswer:
      "Όχι. Ο υπολογισμός εκτελείται τοπικά σε αυτό το πρόγραμμα περιήγησης. Οι τιμές μήτρας δεν μεταφορτώνονται ούτε αποθηκεύονται από αυτό το εργαλείο.",
    howTo: [
      "Εισαγάγετε έναν πραγματικό συμμετρικό τετράγωνο πίνακα με 2 έως 8 σειρές.",
      "Διαχωρίστε τις τιμές με κόμματα ή κενά και βάλτε κάθε σειρά σε μια νέα γραμμή.",
      "Υπολογίστε και, στη συνέχεια, ελέγξτε κάθε ιδιοτιμή, κανονικοποιημένο ιδιοδιάνυσμα και υπολειπόμενο.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Υπολογίστε τα ιδιοζεύγη",
      example: "Παράδειγμα φόρτωσης",
      reset: "Εκκαθάριση",
      copy: "Αντιγραφή αποτελεσμάτων",
    },
    fields: {
      matrix: "Πραγματικός συμμετρικός πίνακας",
      matrixHint:
        "Εισαγάγετε 2–8 σειρές, μία ανά γραμμή. Διαχωρίστε τις τιμές με κόμματα, κενά ή ερωτηματικά. Παράδειγμα: 2, 0 στην πρώτη γραμμή και 0, 3 στη δεύτερη.",
      accuracyNote:
        "Υποστηρίζει μόνο πεπερασμένους πραγματικούς συμμετρικούς πίνακες, από 2×2 έως 8×8. κάθε τιμή πρέπει να είναι εντός ±1.000.000. Οι μη συμμετρικοί πίνακες και οι σύνθετες ιδιοτιμές δεν υποστηρίζονται. Τα ιδιοδιανύσματα έχουν μοναδιαίο μήκος. το σημάδι τους μπορεί να ποικίλλει. Τα αποτελέσματα κινητής υποδιαστολής είναι κατά προσέγγιση.",
      resultSummary: "Ιδιοζεύγη, ταξινομημένα κατά ιδιοτιμή",
      eigenvalue: "Ιδιοτιμή",
      eigenvector: "Κανονοποιημένο ιδιοδιάνυσμα",
      residual: "Υπολειμματικό ‖Av − λv‖",
    },
    messages: {
      calculated: "Υπολογίστηκαν ιδιοζεύγη.",
      copied: "Τα αποτελέσματα αντιγράφηκαν.",
      copyUnavailable: "δεν είναι διαθέσιμο σε αυτό το πρόγραμμα περιήγησης.",
      checkInputs: "Ελέγξτε τη μήτρα και δοκιμάστε ξανά.",
      emptyMatrix: "Εισαγάγετε πρώτα έναν πίνακα.",
      invalidSize: "Χρησιμοποιήστε έναν τετράγωνο πίνακα από 2×2 έως 8×8.",
      notSquare:
        "Κάθε σειρά πρέπει να έχει τον ίδιο αριθμό τιμών με τις σειρές.",
      notSymmetric:
        "Αυτός ο πίνακας δεν είναι συμμετρικός. Το Aᵢⱼ πρέπει να ισούται με Aⱼᵢ.",
      invalidEntry:
        "Χρησιμοποιήστε πεπερασμένες αριθμητικές τιμές από −1.000.000 έως 1.000.000.",
      didNotConverge:
        "Η αριθμητική μέθοδος δεν συγκλίνει για αυτήν την είσοδο.",
      exampleLoaded: "Παράδειγμα φόρτωσης: ιδιοτιμές 2 και 3.",
    },
    additionalFaqs: [
      {
        question:
          "Ποιους τύπους μήτρας υποστηρίζει αυτός ο υπολογιστής ιδιοτιμών;",
        answer:
          "Υποστηρίζει πραγματικούς συμμετρικούς τετραγωνικούς πίνακες από 2×2 έως 8×8. Δεν υπολογίζει ιδιοτιμές για μη συμμετρικούς πίνακες ή μιγαδικές ιδιοτιμές.",
      },
      {
        question: "Πώς μπορώ να ελέγξω ένα ιδιοδιάνυσμα;",
        answer:
          "Για κάθε αποτέλεσμα, συγκρίνετε το A πολλαπλασιασμένο με το εμφανιζόμενο κανονικοποιημένο διάνυσμα με την ιδιοτιμή πολλαπλασιασμένη με αυτό το διάνυσμα. Το υπόλοιπο αναφέρει τον κανόνα της διαφοράς τους. τιμές κοντά στο μηδέν υποδεικνύουν στενή αριθμητική αντιστοίχιση.",
      },
      {
        question: "Γιατί ένα ιδιοδιάνυσμα μπορεί να έχει διαφορετικό πρόσημο;",
        answer:
          "Αν το v είναι ιδιοδιάνυσμα, το −v είναι επίσης ιδιοδιάνυσμα για την ίδια ιδιοτιμή. Το εργαλείο επιλέγει ένα συνεπές πρόσημο όπου είναι δυνατόν, αλλά το πρόσημο δεν είναι μαθηματικά μοναδικό.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  ms: {
    copyLanguage: "ms",
    name: "Kalkulator Nilai Eigen",
    title: "Kalkulator Nilai Eigen percuma | UsefulVerse",
    description:
      "Cari nilai eigen, vektor eigen dan baki untuk matriks simetri sebenar. Kalkulator dalam talian percuma; nilai kekal dalam penyemak imbas anda.",
    intro:
      "Kira dan semak eigenpairs untuk matriks simetri sebenar. Lihat vektor eigen yang dinormalkan dan baki untuk setiap hasil.",
    howQuestion: "Bagaimanakah cara saya mencari nilai eigen bagi matriks?",
    howAnswer:
      "Masukkan matriks simetri sebenar segi empat sama, satu baris setiap baris, dengan nilai dipisahkan dengan koma atau ruang. Kira untuk melihat nilai eigen yang diisih, vektor eigen ternormal dan baki.",
    privacyQuestion: "Adakah nilai matriks saya dimuat naik?",
    privacyAnswer:
      "No. Pengiraan berjalan secara setempat dalam penyemak imbas ini. Nilai matriks tidak dimuat naik atau disimpan oleh alat ini.",
    howTo: [
      "Masukkan matriks segi empat sama simetri sebenar dengan 2 hingga 8 baris.",
      "Asingkan nilai dengan koma atau ruang dan letakkan setiap baris pada baris baharu.",
      "Kira, kemudian semak setiap nilai eigen, vektor eigen ternormal dan baki.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Kira eigenpairs",
      example: "Muatkan contoh",
      reset: "Jelas",
      copy: "Salin keputusan",
    },
    fields: {
      matrix: "Matriks simetri sebenar",
      matrixHint:
        "Masukkan 2–8 baris, satu setiap baris. Asingkan nilai dengan koma, ruang atau titik bertitik. Contoh: 2, 0 pada baris pertama dan 0, 3 pada baris kedua.",
      accuracyNote:
        "Menyokong matriks simetri nyata terhingga sahaja, dari 2×2 hingga 8×8; setiap nilai mestilah dalam lingkungan ±1,000,000. Matriks tidak simetri dan nilai eigen kompleks tidak disokong. Eigenvectors mempunyai panjang unit; tanda mereka mungkin berbeza-beza. Keputusan titik terapung adalah anggaran.",
      resultSummary: "Eigenpairs, diisih mengikut nilai eigen",
      eigenvalue: "Nilai Eigen",
      eigenvector: "Vektor eigen ternormal",
      residual: "Baki ‖Av − λv‖",
    },
    messages: {
      calculated: "Eigenpairs dikira.",
      copied: "disalin.",
      copyUnavailable: "tidak tersedia dalam penyemak imbas ini.",
      checkInputs: "Semak matriks dan cuba lagi.",
      emptyMatrix: "Masukkan matriks dahulu.",
      invalidSize: "Gunakan matriks segi empat sama dari 2×2 hingga 8×8.",
      notSquare:
        "Setiap baris mesti mempunyai bilangan nilai yang sama seperti terdapat baris.",
      notSymmetric: "Matriks ini tidak simetri; Aᵢⱼ mesti sama dengan Aⱼᵢ.",
      invalidEntry:
        "Gunakan nilai angka terhingga daripada −1,000,000 hingga 1,000,000.",
      didNotConverge: "Kaedah berangka tidak menumpu untuk input ini.",
      exampleLoaded: "Contoh dimuatkan: nilai eigen 2 dan 3.",
    },
    additionalFaqs: [
      {
        question:
          "Apakah jenis matriks yang disokong oleh kalkulator nilai eigen ini?",
        answer:
          "Ia menyokong matriks segi empat sama simetri sebenar daripada 2×2 hingga 8×8. Ia tidak mengira nilai eigen untuk matriks tidak simetri atau nilai eigen kompleks.",
      },
      {
        question: "Bagaimanakah saya boleh menyemak vektor eigen?",
        answer:
          "Untuk setiap hasil, bandingkan A didarab dengan vektor ternormal yang dipaparkan dengan nilai eigen yang didarab dengan vektor tersebut. Sisa melaporkan norma perbezaannya; nilai berhampiran sifar menunjukkan padanan berangka yang hampir.",
      },
      {
        question: "Mengapa vektor eigen boleh mempunyai tanda yang berbeza?",
        answer:
          "Jika v ialah vektor eigen, −v juga ialah vektor eigen untuk nilai eigen yang sama. Alat ini memilih tanda yang konsisten jika boleh, tetapi tanda tidak unik secara matematik.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  pl: {
    copyLanguage: "pl",
    name: "Kalkulator wartości własnej",
    title: "Kalkulator wartości własnej za darmo | UsefulVerse",
    description:
      "Znajdź wartości własne, wektory własne i reszty dla rzeczywistej macierzy symetrycznej. Darmowy kalkulator online; wartości pozostają w przeglądarce.",
    intro:
      "Oblicz i sprawdź pary własne dla rzeczywistej macierzy symetrycznej. Zobacz znormalizowane wektory własne i resztę dla każdego wyniku.",
    howQuestion: "Jak znaleźć wartości własne macierzy?",
    howAnswer:
      "Wprowadź kwadratową, rzeczywistą macierz symetryczną, po jednym wierszu w każdym wierszu, z wartościami oddzielonymi przecinkami lub spacjami. Oblicz, aby wyświetlić posortowane wartości własne, znormalizowane wektory własne i reszty.",
    privacyQuestion: "Czy moje wartości macierzy zostały przesłane?",
    privacyAnswer:
      "Nie. Obliczenia są uruchamiane lokalnie w tej przeglądarce. To narzędzie nie przesyła ani nie zapisuje wartości macierzy.",
    howTo: [
      "Wprowadź rzeczywistą symetryczną macierz kwadratową zawierającą od 2 do 8 wierszy.",
      "Oddziel wartości przecinkami lub spacjami i umieść każdy wiersz w nowej linii.",
      "Oblicz, a następnie sprawdź każdą wartość własną, znormalizowany wektor własny i resztę.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Obliczenie par własnych",
      example: "Załaduj przykład",
      reset: "Wyczyść",
      copy: "Kopiuj wyniki",
    },
    fields: {
      matrix: "Prawdziwa macierz symetryczna",
      matrixHint:
        "Wprowadź 2–8 wierszy, po jednym w każdym wierszu. Oddziel wartości przecinkami, spacjami lub średnikami. Przykład: 2, 0 w pierwszej linii i 0, 3 w drugiej.",
      accuracyNote:
        "Obsługuje tylko skończone, rzeczywiste macierze symetryczne, od 2×2 do 8×8; każda wartość musi mieścić się w zakresie ±1 000 000. Macierze niesymetryczne i złożone wartości własne nie są obsługiwane. Wektory własne mają długość jednostkową; ich znak może się różnić. Wyniki zmiennoprzecinkowe są przybliżone.",
      resultSummary: "Pary własne, posortowane według wartości własnej",
      eigenvalue: "Wartość własna",
      eigenvector: "Znormalizowany wektor własny",
      residual: "Pozostałość ‖Av − λv‖",
    },
    messages: {
      calculated: "Obliczono pary własne.",
      copied: "Wyniki skopiowane.",
      copyUnavailable: "jest niedostępny w tej przeglądarce.",
      checkInputs: "Sprawdź matrycę i spróbuj ponownie.",
      emptyMatrix: "Najpierw wprowadź macierz.",
      invalidSize: "Użyj macierzy kwadratowej od 2×2 do 8×8.",
      notSquare:
        "Każdy wiersz musi mieć tę samą liczbę wartości, ile jest wierszy.",
      notSymmetric: "Ta macierz nie jest symetryczna; Aᵢⱼ musi być równe Aⱼᵢ.",
      invalidEntry:
        "Użyj skończonych wartości numerycznych od -1 000 000 do 1 000 000.",
      didNotConverge:
        "Metoda numeryczna nie osiągnęła zbieżności dla tego wejścia.",
      exampleLoaded: "Załadowano przykład: wartości własne 2 i 3.",
    },
    additionalFaqs: [
      {
        question:
          "Jakie typy macierzy obsługuje ten kalkulator wartości własnej?",
        answer:
          "Obsługuje rzeczywiste symetryczne macierze kwadratowe od 2×2 do 8×8. Nie oblicza wartości własnych dla macierzy niesymetrycznych ani złożonych wartości własnych.",
      },
      {
        question: "Jak mogę sprawdzić wektor własny?",
        answer:
          "Dla każdego wyniku porównaj A pomnożone przez wyświetlony znormalizowany wektor z wartością własną pomnożoną przez ten wektor. Reszta podaje normę ich różnicy; wartości bliskie zeru wskazują na bliskie dopasowanie liczbowe.",
      },
      {
        question: "Dlaczego wektor własny może mieć inny znak?",
        answer:
          "Jeśli v jest wektorem własnym, −v jest również wektorem własnym dla tej samej wartości własnej. Narzędzie wybiera spójny znak, jeśli to możliwe, ale znak nie jest matematycznie unikalny.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  sv: {
    copyLanguage: "sv",
    name: "Egenvärdeskalkylator",
    title: "Egenvärdeskalkylator gratis | UsefulVerse",
    description:
      "Hitta egenvärden, egenvektorer och residualer för en verklig symmetrisk matris. Gratis kalkylator online; värden stannar i din webbläsare.",
    intro:
      "Beräkna och kontrollera egenpar för en verklig symmetrisk matris. Se normaliserade egenvektorer och residual för varje resultat.",
    howQuestion: "Hur hittar jag egenvärdena för en matris?",
    howAnswer:
      "Ange en kvadratisk reell symmetrisk matris, en rad per rad, med värden separerade med kommatecken eller mellanslag. Beräkna för att se sorterade egenvärden, normaliserade egenvektorer och residualer.",
    privacyQuestion: "Är mina matrisvärden uppladdade?",
    privacyAnswer:
      "Nej. Beräkningen körs lokalt i den här webbläsaren. Matrisvärden laddas inte upp eller sparas av detta verktyg.",
    howTo: [
      "Ange en riktig symmetrisk kvadratisk matris med 2 till 8 rader.",
      "Separera värden med kommatecken eller mellanslag och placera varje rad på en ny rad.",
      "Beräkna och kontrollera sedan varje egenvärde, normaliserad egenvektor och residual.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Beräkna egenpar",
      example: "Ladda exempel",
      reset: "Rensa",
      copy: "Kopiera resultat",
    },
    fields: {
      matrix: "Verklig symmetrisk matris",
      matrixHint:
        "Ange 2–8 rader, en per rad. Separera värden med kommatecken, blanksteg eller semikolon. Exempel: 2, 0 på den första raden och 0, 3 på den andra.",
      accuracyNote:
        "Stöder endast ändliga reella symmetriska matriser, från 2×2 till 8×8; varje värde måste ligga inom ±1 000 000. Icke-symmetriska matriser och komplexa egenvärden stöds inte. Egenvektorer har enhetslängd; deras tecken kan variera. Flyttalsresultaten är ungefärliga.",
      resultSummary: "Egenpar, sorterade efter egenvärde",
      eigenvalue: "Egenvärde",
      eigenvector: "Normaliserad egenvektor",
      residual: "Residual ‖Av − λv‖",
    },
    messages: {
      calculated: "Egenpar beräknade.",
      copied: "Resultaten har kopierats.",
      copyUnavailable: "Urklipp är inte tillgängligt i den här webbläsaren.",
      checkInputs: "Kontrollera matrisen och försök igen.",
      emptyMatrix: "Ange en matris först.",
      invalidSize: "Använd en kvadratisk matris från 2×2 till 8×8.",
      notSquare: "Varje rad måste ha samma antal värden som det finns rader.",
      notSymmetric:
        "Denna matris är inte symmetrisk; Aᵢⱼ måste vara lika med Aⱼᵢ.",
      invalidEntry:
        "Använd ändliga numeriska värden från −1 000 000 till 1 000 000.",
      didNotConverge:
        "Den numeriska metoden konvergerade inte för denna ingång.",
      exampleLoaded: "Exempel laddat: egenvärden 2 och 3.",
    },
    additionalFaqs: [
      {
        question: "Vilka matristyper stöder denna egenvärdeskalkylator?",
        answer:
          "Den stöder riktiga symmetriska kvadratiska matriser från 2×2 till 8×8. Den beräknar inte egenvärden för icke-symmetriska matriser eller komplexa egenvärden.",
      },
      {
        question: "Hur kan jag kontrollera en egenvektor?",
        answer:
          "För varje resultat, jämför A multiplicerat med den visade normaliserade vektorn med egenvärdet multiplicerad med den vektorn. Resten rapporterar normen för deras skillnad; värden nära noll indikerar en nära numerisk matchning.",
      },
      {
        question: "Varför kan en egenvektor ha ett annat tecken?",
        answer:
          "Om v är en egenvektor, är −v också en egenvektor för samma egenvärde. Verktyget väljer ett konsekvent tecken där det är möjligt, men tecken är inte matematiskt unikt.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  th: {
    copyLanguage: "th",
    name: "เครื่องคำนวณค่าลักษณะเฉพาะ",
    title: "เครื่องคำนวณค่าลักษณะเฉพาะ ฟรี | UsefulVerse",
    description:
      "ค้นหาค่าลักษณะเฉพาะ เวกเตอร์ลักษณะเฉพาะ และค่าคงเหลือสำหรับเมทริกซ์สมมาตรจริง เครื่องคิดเลขออนไลน์ฟรี ค่าจะยังคงอยู่ในเบราว์เซอร์ของคุณ",
    intro:
      "คำนวณและตรวจสอบ eigenpairs เพื่อหาเมทริกซ์สมมาตรจริง ดูเวกเตอร์ลักษณะเฉพาะที่ทำให้เป็นมาตรฐานและค่าคงเหลือสำหรับผลลัพธ์แต่ละรายการ",
    howQuestion: "ฉันจะค้นหาค่าลักษณะเฉพาะของเมทริกซ์ได้อย่างไร",
    howAnswer:
      "ป้อนเมทริกซ์สมมาตรจริงแบบสี่เหลี่ยมจัตุรัส หนึ่งแถวต่อบรรทัด โดยคั่นค่าด้วยลูกน้ำหรือช่องว่าง คำนวณเพื่อดูค่าลักษณะเฉพาะที่เรียงลำดับแล้ว เวกเตอร์ลักษณะเฉพาะและค่าคงเหลือที่ถูกทำให้เป็นมาตรฐาน",
    privacyQuestion: "มีการอัปโหลดค่าเมทริกซ์ของฉันหรือไม่",
    privacyAnswer:
      "ไม่ การคำนวณจะทำงานภายในเบราว์เซอร์นี้ เครื่องมือนี้ไม่ได้อัปโหลดหรือบันทึกค่าเมทริกซ์",
    howTo: [
      "ป้อนเมทริกซ์จตุรัสสมมาตรจริงที่มี 2 ถึง 8 แถว",
      "คั่นค่าด้วยเครื่องหมายจุลภาคหรือช่องว่าง และขึ้นบรรทัดใหม่แต่ละแถว",
      "คำนวณ จากนั้นตรวจสอบค่าลักษณะเฉพาะแต่ละค่า เวกเตอร์ลักษณะเฉพาะและค่าคงเหลือ",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "คำนวณคู่ลักษณะเฉพาะ",
      example: "โหลดตัวอย่าง",
      reset: "ล้าง",
      copy: "คัดลอกผลลัพธ์",
    },
    fields: {
      matrix: "เมทริกซ์สมมาตรจริง",
      matrixHint:
        "ป้อน 2–8 แถว หนึ่งแถวต่อบรรทัด แยกค่าด้วยเครื่องหมายจุลภาค ช่องว่าง หรืออัฒภาค ตัวอย่าง: 2, 0 บนบรรทัดแรกและ 0, 3 ในวินาที",
      accuracyNote:
        "รองรับเมทริกซ์สมมาตรจริงที่มีขอบเขตจำกัดเท่านั้น ตั้งแต่ 2×2 ถึง 8×8; แต่ละค่าต้องอยู่ภายใน ±1,000,000 ไม่รองรับเมทริกซ์ที่ไม่สมมาตรและค่าลักษณะเฉพาะที่ซับซ้อน Eigenvectors มีความยาวหน่วย สัญญาณของพวกเขาอาจแตกต่างกันไป ผลลัพธ์จุดลอยตัวเป็นค่าโดยประมาณ",
      resultSummary: "Eigenpairs จัดเรียงตามค่าลักษณะเฉพาะ",
      eigenvalue: "ค่าลักษณะเฉพาะ",
      eigenvector: "เวกเตอร์ไอเกนที่ทำให้เป็นมาตรฐาน",
      residual: "ตกค้าง ‖Av − λv‖",
    },
    messages: {
      calculated: "Eigenpairs คำนวณแล้ว",
      copied: "แล้ว",
      copyUnavailable: "คลิปบอร์ดไม่พร้อมใช้งานในเบราว์เซอร์นี้",
      checkInputs: "ตรวจสอบเมทริกซ์แล้วลองอีกครั้ง",
      emptyMatrix: "ป้อนเมทริกซ์ก่อน",
      invalidSize: "ใช้เมทริกซ์จตุรัสตั้งแต่ 2×2 ถึง 8×8",
      notSquare: "ทุกแถวจะต้องมีจำนวนค่าเท่ากันเนื่องจากมีแถวอยู่",
      notSymmetric: "เมทริกซ์นี้ไม่สมมาตร Aᵢⱼ ต้องเท่ากับ Aⱼᵢ",
      invalidEntry: "ใช้ค่าตัวเลขจำกัดตั้งแต่ −1,000,000 ถึง 1,000,000",
      didNotConverge: "วิธีการเชิงตัวเลขไม่ได้มาบรรจบกันสำหรับอินพุตนี้",
      exampleLoaded: "ตัวอย่างที่โหลด: ค่าลักษณะเฉพาะ 2 และ 3",
    },
    additionalFaqs: [
      {
        question: "เครื่องคำนวณค่าลักษณะเฉพาะนี้รองรับเมทริกซ์ประเภทใด",
        answer:
          "รองรับเมทริกซ์จตุรัสสมมาตรจริงตั้งแต่ 2×2 ถึง 8×8 จะไม่คำนวณค่าลักษณะเฉพาะสำหรับเมทริกซ์ที่ไม่สมมาตรหรือค่าลักษณะเฉพาะที่ซับซ้อน",
      },
      {
        question: "ฉันจะตรวจสอบ eigenvector ได้อย่างไร",
        answer:
          "สำหรับผลลัพธ์แต่ละรายการ ให้เปรียบเทียบ A คูณด้วยเวกเตอร์มาตรฐานที่แสดงกับค่าลักษณะเฉพาะคูณด้วยเวกเตอร์นั้น ส่วนที่เหลือรายงานบรรทัดฐานของความแตกต่าง ค่าใกล้ศูนย์บ่งบอกถึงการจับคู่ตัวเลขที่ใกล้เคียงกัน",
      },
      {
        question: "เหตุใด eigenvector จึงสามารถมีเครื่องหมายที่แตกต่างออกไปได้",
        answer:
          "ถ้า v เป็นเวกเตอร์ลักษณะเฉพาะ −v ก็เป็นเวกเตอร์ลักษณะเฉพาะสำหรับค่าลักษณะเฉพาะเดียวกันด้วย เครื่องมือจะเลือกเครื่องหมายที่สอดคล้องกันหากเป็นไปได้ แต่เครื่องหมายนั้นไม่ได้มีลักษณะเฉพาะทางคณิตศาสตร์",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  uk: {
    copyLanguage: "uk",
    name: "Калькулятор власного значення",
    title: "Калькулятор власного значення безкоштовно | UsefulVerse",
    description:
      "Знайти власні значення, власні вектори та залишки для дійсної симетричної матриці. Безкоштовний онлайн-калькулятор; значення залишаються у вашому браузері.",
    intro:
      "Обчислити та перевірити власні пари для дійсної симетричної матриці. Перегляньте нормалізовані власні вектори та нев’язку для кожного результату.",
    howQuestion: "Як мені знайти власні значення матриці?",
    howAnswer:
      "Введіть квадратну дійсну симетричну матрицю, по одному рядку на рядок, зі значеннями, розділеними комами або пробілами. Обчислити для перегляду відсортованих власних значень, нормалізованих власних векторів і залишків.",
    privacyQuestion: "Чи завантажено значення моїх матриць?",
    privacyAnswer:
      "Ні. Розрахунок виконується локально в цьому браузері. Цей інструмент не завантажує та не зберігає значення матриці.",
    howTo: [
      "Введіть дійсну симетричну квадратну матрицю від 2 до 8 рядків.",
      "Розділяйте значення комами або пробілами та розміщуйте кожен рядок на новому рядку.",
      "Обчислити, а потім перевірити кожне власне значення, нормалізований власний вектор і нев’язку.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Обчислити власні пари",
      example: "Завантажити приклад",
      reset: "Очистити",
      copy: "Копіювати результати",
    },
    fields: {
      matrix: "Дійсна симетрична матриця",
      matrixHint:
        "Введіть 2–8 рядків, по одному на рядок. Розділяйте значення комами, пробілами або крапками з комами. Приклад: 2, 0 у першому рядку та 0, 3 у другому.",
      accuracyNote:
        "Підтримує лише скінченні дійсні симетричні матриці від 2×2 до 8×8; кожне значення має бути в межах ±1 000 000. Несиметричні матриці та комплексні власні значення не підтримуються. Власні вектори мають одиничну довжину; їх знак може бути різним. Результати з плаваючою комою є приблизними.",
      resultSummary: "Власні пари, відсортовані за власним значенням",
      eigenvalue: "Власне значення",
      eigenvector: "Нормований власний вектор",
      residual: "Залишок ‖Av − λv‖",
    },
    messages: {
      calculated: "Обчислені власні пари.",
      copied: "Результати скопійовано.",
      copyUnavailable: "недоступний у цьому браузері.",
      checkInputs: "Перевірте матрицю та повторіть спробу.",
      emptyMatrix: "Спочатку введіть матрицю.",
      invalidSize: "Використовуйте квадратну матрицю від 2×2 до 8×8.",
      notSquare:
        "Кожен рядок повинен мати таку саму кількість значень, скільки є рядків.",
      notSymmetric: "Ця матриця не є симетричною; Aᵢⱼ має дорівнювати Aⱼᵢ.",
      invalidEntry:
        "Використовуйте кінцеві числові значення від −1 000 000 до 1 000 000.",
      didNotConverge: "Чисельний метод не збігається для цього вхідного даних.",
      exampleLoaded: "Завантажено приклад: власні значення 2 і 3.",
    },
    additionalFaqs: [
      {
        question: "Які типи матриць підтримує цей калькулятор власних значень?",
        answer:
          "Він підтримує реальні симетричні квадратні матриці від 2×2 до 8×8. Він не обчислює власні значення для несиметричних матриць або комплексних власних значень.",
      },
      {
        question: "Як я можу перевірити власний вектор?",
        answer:
          "Для кожного результату порівняйте A, помножене на відображений нормалізований вектор, із власним значенням, помноженим на цей вектор. Нев'язка повідомляє норму їх різниці; значення, близькі до нуля, вказують на близьку чисельну відповідність.",
      },
      {
        question: "Чому власний вектор може мати інший знак?",
        answer:
          "Якщо v є власним вектором, −v також є власним вектором для того самого власного значення. Інструмент вибирає послідовний знак, де це можливо, але знак не є математично унікальним.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  sw: {
    copyLanguage: "sw",
    name: "Eigenvalue Calculator",
    title: "Eigenvalue Calculator bure | UsefulVerse",
    description:
      "Tafuta thamani eigen, eigenveekta na mabaki ya matrix halisi ya ulinganifu. Calculator ya bure ya mtandaoni; maadili hukaa kwenye kivinjari chako.",
    intro:
      "Kokotoa na uangalie eigenpairs kwa matriki halisi ya ulinganifu. Tazama eigenveekta zilizosawazishwa na mabaki kwa kila matokeo.",
    howQuestion: "Je, ninapataje thamani za matrix?",
    howAnswer:
      "Weka matriki ya ulinganifu halisi ya mraba, safu mlalo moja kwa kila mstari, yenye thamani zilizotenganishwa kwa koma au nafasi. Kokotoa ili kuona thamani zilizopangwa, eigenvekta zilizosawazishwa na mabaki.",
    privacyQuestion: "Je, thamani za matrix yangu zimepakiwa?",
    privacyAnswer:
      ". Hesabu inaendeshwa ndani ya kivinjari hiki. Thamani za matrix hazijapakiwa au kuhifadhiwa na zana hii.",
    howTo: [
      "Weka matrix halisi ya mraba yenye safu mlalo 2 hadi 8.",
      "Tenganisha thamani kwa koma au nafasi na uweke kila safu mlalo kwenye mstari mpya.",
      "Kokotoa, kisha angalia kila eigenvalue, eigenvector iliyorekebishwa na mabaki.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Kokotoa eigenpairs",
      example: "Pakia mfano",
      reset: "Futa",
      copy: "Nakili matokeo",
    },
    fields: {
      matrix: "Matrix halisi ya ulinganifu",
      matrixHint:
        "Weka safu 2–8, moja kwa kila mstari. Tenganisha thamani kwa koma, nafasi au nusukoloni. Mfano: 2, 0 kwenye mstari wa kwanza na 0, 3 kwa pili.",
      accuracyNote:
        "Inasaidia matrices halisi ya ulinganifu tu, kutoka 2×2 hadi 8×8; kila thamani lazima iwe ndani ya ±1,000,000. Matrices yasiyo ya ulinganifu na eigenvalues ​​changamano hazitumiki. Eigenvectors zina urefu wa kitengo; ishara zao zinaweza kutofautiana. Matokeo ya sehemu zinazoelea ni takriban.",
      resultSummary: "Eigenpairs, zimepangwa kwa eigenvalue",
      eigenvalue: "Thamani ya Eigen",
      eigenvector: "eigenvector ya kawaida",
      residual: "Residual ‖Av − λv‖",
    },
    messages: {
      calculated: "Eigenpairs zimekokotolewa.",
      copied: "yamenakiliwa.",
      copyUnavailable: "haupatikani katika kivinjari hiki.",
      checkInputs: "Angalia matrix na ujaribu tena.",
      emptyMatrix: "Ingiza tumbo kwanza.",
      invalidSize: "Tumia matrix ya mraba kutoka 2×2 hadi 8×8.",
      notSquare:
        "Kila safu mlalo lazima iwe na idadi sawa ya thamani kama kuna safu mlalo.",
      notSymmetric: "Matrix hii haina ulinganifu; Aᵢⱼ lazima iwe sawa na Aⱼᵢ.",
      invalidEntry:
        "Tumia nambari pungufu za nambari kutoka -1,000,000 hadi 1,000,000.",
      didNotConverge: "Mbinu ya nambari haikuungana kwa ingizo hili.",
      exampleLoaded: "Mfano umepakiwa: eigenvalues 2 na 3.",
    },
    additionalFaqs: [
      {
        question:
          "Je, kikokotoo hiki cha eigenvalue kinaauni aina gani za matrix?",
        answer:
          "Inaauni mizani halisi ya mraba kutoka 2×2 hadi 8×8. Haikokotoi thamani eigen kwa hesabu zisizo za ulinganifu au thamani changamano.",
      },
      {
        question: "Ninawezaje kuangalia eigenvector?",
        answer:
          "Kwa kila tokeo, linganisha A iliyozidishwa na vekta ya kawaida iliyoonyeshwa na eigenvalue inayozidishwa na vekta hiyo. Mabaki yanaripoti kawaida ya tofauti zao; thamani zilizo karibu na sufuri zinaonyesha nambari inayolingana.",
      },
      {
        question: "Kwa nini eigenvector inaweza kuwa na ishara tofauti?",
        answer:
          "Ikiwa v ni eigenvector, −v pia ni eigenvector kwa eigenvalue sawa. Zana huchagua ishara thabiti inapowezekana, lakini ishara si ya kipekee kihisabati.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  mr: {
    copyLanguage: "mr",
    name: "Eigenvalue कॅल्क्युलेटर",
    title: "Eigenvalue कॅल्क्युलेटर मोफत | UsefulVerse",
    description:
      "वास्तविक सममित मॅट्रिक्ससाठी eigenvalues, eigenvectors आणि residuals शोधा. विनामूल्य ऑनलाइन कॅल्क्युलेटर; मूल्ये तुमच्या ब्राउझरमध्ये राहतात.",
    intro:
      "रिअल सिमेट्रिक मॅट्रिक्ससाठी eigenpairs मोजा आणि तपासा. प्रत्येक निकालासाठी सामान्यीकृत इजेनव्हेक्टर्स आणि अवशिष्ट पहा.",
    howQuestion: "मला मॅट्रिक्सचे इजेनव्हॅल्यूज कसे शोधायचे?",
    howAnswer:
      "स्वल्पविराम किंवा स्पेसने विभक्त केलेल्या मूल्यांसह, प्रति ओळीत एक चौरस वास्तविक सममित मॅट्रिक्स प्रविष्ट करा. क्रमवारी लावलेले इजिनव्हॅल्यू, सामान्यीकृत इजेनव्हेक्टर आणि अवशेष पाहण्यासाठी गणना करा.",
    privacyQuestion: "माझी मॅट्रिक्स मूल्ये अपलोड केली आहेत का?",
    privacyAnswer:
      "क्रमांक. गणना स्थानिक पातळीवर या ब्राउझरमध्ये चालते. या साधनाद्वारे मॅट्रिक्स मूल्ये अपलोड किंवा जतन केलेली नाहीत.",
    howTo: [
      "2 ते 8 ओळींसह वास्तविक सममितीय चौरस मॅट्रिक्स प्रविष्ट करा.",
      "स्वल्पविराम किंवा स्पेससह मूल्ये विभक्त करा आणि प्रत्येक पंक्ती नवीन ओळीवर ठेवा.",
      "गणना करा, नंतर प्रत्येक इजिनव्हॅल्यू, सामान्यीकृत इजेनव्हेक्टर आणि अवशिष्ट तपासा.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "eigenpairs",
      example: "लोड उदाहरण",
      reset: "साफ करा",
      copy: "परिणाम कॉपी करा",
    },
    fields: {
      matrix: "रिअल सिमेट्रिक मॅट्रिक्स",
      matrixHint:
        "2-8 पंक्ती प्रविष्ट करा, प्रत्येक ओळीत एक. स्वल्पविराम, रिक्त स्थान किंवा अर्धविरामांसह मूल्ये विभक्त करा. उदाहरण: पहिल्या ओळीवर 2, 0 आणि दुसऱ्या ओळीवर 0, 3.",
      accuracyNote:
        "केवळ 2×2 ते 8×8 पर्यंत मर्यादित वास्तविक सममितीय मॅट्रिक्सचे समर्थन करते; प्रत्येक मूल्य ±1,000,000 च्या आत असणे आवश्यक आहे. नॉन-सिमेट्रिक मॅट्रिक्स आणि जटिल इजेनव्हॅल्यू समर्थित नाहीत. Eigenvectors ला एकक लांबी असते; त्यांचे चिन्ह भिन्न असू शकते. फ्लोटिंग-पॉइंट परिणाम अंदाजे आहेत.",
      resultSummary: "Eigenpairs, eigenvalue",
      eigenvalue: "Eigenvalue",
      eigenvector: "सामान्यीकृत eigenvector",
      residual: "अवशिष्ट ‖Av - λv‖",
    },
    messages: {
      calculated: "Eigenpairs गणना केली.",
      copied: "परिणाम कॉपी केले.",
      copyUnavailable: "क्लिपबोर्ड अनुपलब्ध आहे.",
      checkInputs: "मॅट्रिक्स तपासा आणि पुन्हा प्रयत्न करा.",
      emptyMatrix: "प्रथम मॅट्रिक्स प्रविष्ट करा.",
      invalidSize: "2×2 ते 8×8 पर्यंत चौरस मॅट्रिक्स वापरा.",
      notSquare:
        "प्रत्येक पंक्तीमध्ये पंक्ती आहेत तितकीच मूल्ये असणे आवश्यक आहे.",
      notSymmetric: "हे मॅट्रिक्स सममितीय नाही; Aᵢⱼ Aⱼᵢ बरोबर असणे आवश्यक आहे.",
      invalidEntry:
        "−1,000,000 ते 1,000,000 पर्यंत मर्यादित संख्यात्मक मूल्ये वापरा.",
      didNotConverge: "या इनपुटसाठी संख्यात्मक पद्धत एकत्र आली नाही.",
      exampleLoaded: "लोड केलेले उदाहरण: eigenvalues 2 आणि 3.",
    },
    additionalFaqs: [
      {
        question:
          "हे इजिनव्हॅल्यू कॅल्क्युलेटर कोणत्या मॅट्रिक्स प्रकारांना समर्थन देते?",
        answer:
          "हे 2×2 ते 8×8 पर्यंतच्या वास्तविक सममितीय स्क्वेअर मॅट्रिक्सचे समर्थन करते. हे नॉन-सिमेट्रिक मॅट्रिक्स किंवा कॉम्प्लेक्स इजेनव्हॅल्यूजसाठी इजिनव्हॅल्यूजची गणना करत नाही.",
      },
      {
        question: "मी eigenvector कसे तपासू शकतो?",
        answer:
          "प्रत्येक परिणामासाठी, प्रदर्शित केलेल्या सामान्यीकृत सदिशाने गुणाकार केलेल्या ए ची तुलना त्या सदिशाने गुणाकार केलेल्या इगनमूल्याशी करा. अवशिष्ट त्यांच्या फरकाचे प्रमाण नोंदवतात; शून्याजवळील मूल्ये जवळची संख्यात्मक जुळणी दर्शवतात.",
      },
      {
        question: "eigenvector मध्ये वेगळे चिन्ह का असू शकते?",
        answer:
          "जर v हा इजिनव्हेक्टर असेल, तर −v हा त्याच इजनव्हॅल्यूसाठी eigenvector देखील आहे. साधन शक्य असेल तेथे एक सुसंगत चिन्ह निवडते, परंतु चिन्ह गणितीयदृष्ट्या अद्वितीय नाही.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  te: {
    copyLanguage: "te",
    name: "Eigenvalue కాలిక్యులేటర్",
    title: "Eigenvalue కాలిక్యులేటర్ ఉచితం | UsefulVerse",
    description:
      "నిజమైన సిమెట్రిక్ మాతృక కోసం ఈజెన్‌వాల్యూలు, ఈజెన్‌వెక్టర్లు మరియు అవశేషాలను కనుగొనండి. ఉచిత ఆన్‌లైన్ కాలిక్యులేటర్; విలువలు మీ బ్రౌజర్‌లో ఉంటాయి.",
    intro:
      "నిజమైన సిమెట్రిక్ మ్యాట్రిక్స్ కోసం ఈజెన్‌పెయిర్‌లను లెక్కించండి మరియు తనిఖీ చేయండి. ప్రతి ఫలితం కోసం సాధారణీకరించిన ఈజెన్‌వెక్టర్లు మరియు అవశేషాలను చూడండి.",
    howQuestion: "మాతృక యొక్క ఈజెన్‌వాల్యూలను నేను ఎలా కనుగొనగలను?",
    howAnswer:
      "కామాలు లేదా ఖాళీలతో వేరు చేయబడిన విలువలతో ఒక పంక్తికి ఒక అడ్డు వరుస చొప్పున, చదరపు వాస్తవిక సమరూప మాతృకను నమోదు చేయండి. క్రమబద్ధీకరించబడిన ఈజెన్‌వాల్యూలు, సాధారణీకరించిన ఈజెన్‌వెక్టర్లు మరియు అవశేషాలను వీక్షించడానికి లెక్కించండి.",
    privacyQuestion: "నా మ్యాట్రిక్స్ విలువలు అప్‌లోడ్ చేయబడ్డాయా?",
    privacyAnswer:
      "సంఖ్య. ఈ బ్రౌజర్‌లో గణన స్థానికంగా నడుస్తుంది. మ్యాట్రిక్స్ విలువలు ఈ సాధనం ద్వారా అప్‌లోడ్ చేయబడవు లేదా సేవ్ చేయబడవు.",
    howTo: [
      "2 నుండి 8 వరుసలతో నిజమైన సిమెట్రిక్ స్క్వేర్ మ్యాట్రిక్స్‌ని నమోదు చేయండి.",
      "కామాలు లేదా ఖాళీలతో విలువలను వేరు చేయండి మరియు ప్రతి అడ్డు వరుసను కొత్త లైన్‌లో ఉంచండి.",
      "లెక్కించండి, ఆపై ప్రతి ఈజెన్‌వాల్యూ, సాధారణీకరించిన ఈజెన్‌వెక్టర్ మరియు అవశేషాలను తనిఖీ చేయండి.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "eigenpairs",
      example: "లోడ్ ఉదాహరణ",
      reset: "క్లియర్",
      copy: "ఫలితాలను కాపీ చేయండి",
    },
    fields: {
      matrix: "రియల్ సిమెట్రిక్ మ్యాట్రిక్స్",
      matrixHint:
        "2–8 వరుసలను నమోదు చేయండి, ఒక్కో పంక్తికి ఒకటి. విలువలను కామాలు, ఖాళీలు లేదా సెమికోలన్‌లతో వేరు చేయండి. ఉదాహరణ: మొదటి పంక్తిలో 2, 0 మరియు రెండవ పంక్తిలో 0, 3.",
      accuracyNote:
        "2×2 నుండి 8×8 వరకు పరిమిత వాస్తవ సౌష్టవ మాత్రికలకు మాత్రమే మద్దతు ఇస్తుంది; ప్రతి విలువ తప్పనిసరిగా ±1,000,000 లోపల ఉండాలి. నాన్-సిమెట్రిక్ మాత్రికలు మరియు కాంప్లెక్స్ ఈజెన్‌వాల్యూలకు మద్దతు లేదు. ఈజెన్‌వెక్టర్స్ యూనిట్ పొడవును కలిగి ఉంటాయి; వారి గుర్తు మారవచ్చు. ఫ్లోటింగ్ పాయింట్ ఫలితాలు సుమారుగా ఉంటాయి.",
      resultSummary: "Eigenpairs, eigenvalue",
      eigenvalue: "ఈజెన్‌వాల్యూ",
      eigenvector: "సాధారణీకరించిన ఈజెన్‌వెక్టర్",
      residual: "అవశేషాలు ‖Av - λv‖",
    },
    messages: {
      calculated: "ఈజెన్‌పెయిర్లు లెక్కించబడ్డాయి.",
      copied: "ఫలితాలు కాపీ చేయబడ్డాయి.",
      copyUnavailable: "క్లిప్‌బోర్డ్ అందుబాటులో లేదు.",
      checkInputs: "మాతృకను తనిఖీ చేసి, మళ్లీ ప్రయత్నించండి.",
      emptyMatrix: "ముందుగా మాతృకను నమోదు చేయండి.",
      invalidSize: "2×2 నుండి 8×8 వరకు స్క్వేర్ మ్యాట్రిక్స్‌ని ఉపయోగించండి.",
      notSquare: "ప్రతి అడ్డు వరుసలో కూడా అదే సంఖ్యలో అడ్డు వరుసలు ఉండాలి.",
      notSymmetric: "ఈ మాతృక సమరూపమైనది కాదు; Aᵢⱼ తప్పక Aⱼᵢకి సమానం.",
      invalidEntry:
        "−1,000,000 నుండి 1,000,000 వరకు పరిమిత సంఖ్యా విలువలను ఉపయోగించండి.",
      didNotConverge: "ఈ ఇన్‌పుట్ కోసం సంఖ్యా పద్ధతి సమ్మిళితం కాలేదు.",
      exampleLoaded: "ఉదాహరణ లోడ్ చేయబడింది: eigenvalues 2 మరియు 3.",
    },
    additionalFaqs: [
      {
        question:
          "ఈ ఈజెన్‌వాల్యూ కాలిక్యులేటర్ ఏ మ్యాట్రిక్స్ రకాలకు మద్దతు ఇస్తుంది?",
        answer:
          "ఇది 2×2 నుండి 8×8 వరకు నిజమైన సిమెట్రిక్ స్క్వేర్ మాత్రికలకి మద్దతు ఇస్తుంది. ఇది నాన్-సిమెట్రిక్ మాత్రికలు లేదా సంక్లిష్ట ఈజెన్‌వాల్యూల కోసం ఈజెన్‌వాల్యూలను లెక్కించదు.",
      },
      {
        question: "నేను ఈజెన్‌వెక్టర్‌ను ఎలా తనిఖీ చేయగలను?",
        answer:
          "ప్రతి ఫలితం కోసం, ప్రదర్శించబడిన సాధారణ వెక్టర్ ద్వారా గుణించబడిన A ని ఆ వెక్టర్ ద్వారా గుణించబడిన ఈజెన్‌వాల్యూతో సరిపోల్చండి. అవశేషాలు వాటి వ్యత్యాసం యొక్క ప్రమాణాన్ని నివేదిస్తాయి; సున్నాకి సమీపంలో ఉన్న విలువలు దగ్గరి సంఖ్యా సరిపోలికను సూచిస్తాయి.",
      },
      {
        question: "ఈజెన్‌వెక్టార్‌కు వేరే గుర్తు ఎందుకు ఉంటుంది?",
        answer:
          "v అనేది ఈజెన్‌వెక్టర్ అయితే, అదే ఈజెన్‌వాల్యూకి −v కూడా ఈజెన్‌వెక్టర్. సాధనం సాధ్యమైన చోట స్థిరమైన చిహ్నాన్ని ఎంచుకుంటుంది, కానీ సంకేతం గణితశాస్త్రపరంగా ప్రత్యేకమైనది కాదు.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  ha: {
    copyLanguage: "ha",
    name: "Kalkuletar Eigenvalue",
    title: "Kalkuletar Eigenvalue kyauta | UsefulVerse",
    description:
      "Nemo ƙimar eigenvectors, eigenvectors da sauran abubuwan da suka rage don ainihin matrix na siminti. Kalkuleta na kan layi kyauta; dabi'u sun tsaya a cikin…",
    intro:
      "Yi ƙididdigewa da bincika eigenpairs don ainihin matrix mai ma'ana. Dubi daidaitattun eigenvectors da ragowar ga kowane sakamako.",
    howQuestion: "Ta yaya zan nemo kimar matrix?",
    howAnswer:
      "Shigar da matrix daidai murabba'i na gaske, jere ɗaya a kowane layi, tare da ƙima da aka raba ta waƙafi ko sarari. Yi ƙididdigewa don duba ƙimar eigenvector ɗin da aka jera, daidaitattun eigenvectors da ragowar.",
    privacyQuestion: "An ɗora darajar matrix na?",
    privacyAnswer:
      "A'a. Lissafin yana gudana a cikin gida a cikin wannan mai binciken. Ba a loda kimar Matrix ko adana ta wannan kayan aikin.",
    howTo: [
      "Shigar da ainihin matrix murabba'in siminti tare da layuka 2 zuwa 8.",
      "Rarrabe dabi'u tare da waƙafi ko sarari kuma sanya kowane jere akan sabon layi.",
      "Yi lissafta, sannan duba kowane ƙimar eigenvector, daidaitaccen eigenvector da saura.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Lissafin eigenpairs",
      example: "Load misali",
      reset: "Share",
      copy: "Kwafi sakamakon",
    },
    fields: {
      matrix: "Matrix na gaske na siminti",
      matrixHint:
        "Shigar da layuka 2-8, ɗaya akan kowane layi. Rarrabe dabi'u tare da waƙafi, sarari ko semicolons. Misali: 2, 0 akan layi na farko da 0, 3 akan na biyu.",
      accuracyNote:
        "Yana goyan bayan ƙayyadaddun ma'auni na zahiri kawai, daga 2 × 2 zuwa 8 × 8; kowace ƙima dole ne ta kasance cikin ± 1,000,000. Ba a tallafawa matrices marasa daidaituwa da ƙayyadaddun ƙimar eigen. Eigenvectors suna da tsayin raka'a; Alamar su na iya bambanta. Sakamako-maki-daki suna da kima.",
      resultSummary: "Eigenpairs, wanda aka tsara ta eigenvalue",
      eigenvalue: "Eigenvalue",
      eigenvector: "Daidaitaccen eigenvector",
      residual: "‖ Av - λv‖",
    },
    messages: {
      calculated: "Eigenpairs an ƙididdige su.",
      copied: "an kwafi.",
      copyUnavailable: "a cikin wannan burauzar.",
      checkInputs: "Duba matrix kuma a sake gwadawa.",
      emptyMatrix: "Shigar da matrix da farko.",
      invalidSize: "Yi amfani da matrix murabba'in daga 2×2 zuwa 8×8.",
      notSquare:
        "Kowane jere dole ne ya kasance yana da adadin ƙima ɗaya kamar yadda akwai layuka.",
      notSymmetric: "This matrix is not symmetric; Aᵢⱼ must equal Aⱼᵢ.",
      invalidEntry:
        "Yi amfani da ƙididdiga masu iyaka daga -1,000,000 zuwa 1,000,000.",
      didNotConverge: "Hanyar lambobi ba ta haɗu don wannan shigarwar ba.",
      exampleLoaded: "Misali lodi: eigenvalues 2 da 3.",
    },
    additionalFaqs: [
      {
        question:
          "Wadanne nau'ikan matrix ke goyan bayan ƙididdige ƙimar eigenvalue?",
        answer:
          "Yana goyan bayan ainihin matrix murabba'in simmetric daga 2 × 2 zuwa 8 × 8. Ba ya ƙididdige ƙididdige ƙididdiga don matrices marasa daidaituwa ko hadaddun ƙimar eigenvalues.",
      },
      {
        question: "Ta yaya zan iya bincika eigenvector? Saukewa:",
        answer:
          "Ga kowane sakamako, kwatanta A wanda aka ninka ta hanyar nuna al'adar vector tare da eigenvalue wanda aka ninka ta wannan vector. Sauran sun ba da rahoton al'adar bambancin su; dabi'u kusa da sifili suna nuna kusancin lamba. Saukewa:",
      },
      {
        question:
          "Me yasa eigenvector zai iya samun wata alama ta daban? Saukewa:",
        answer:
          "Idan v ne eigenvector, -v kuma eigenvector ne don darajar eigenvector iri ɗaya. Kayan aiki yana zaɓar madaidaiciyar alamar inda zai yiwu, amma alamar ba ta bambanta da lissafi ba. Saukewa:",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  tl: {
    copyLanguage: "tl",
    name: "Eigenvalue Calculator",
    title: "Eigenvalue Calculator libre | UsefulVerse",
    description:
      "Maghanap ng mga eigenvalue, eigenvector at residual para sa isang tunay na simetriko matrix. Libreng online na calculator; mananatili ang mga halaga sa iyong…",
    intro:
      "Kalkulahin at suriin ang eigenpairs para sa isang tunay na simetriko matrix. Tingnan ang normalized eigenvectors at ang nalalabi para sa bawat resulta.",
    howQuestion: "Paano ko mahahanap ang eigenvalues ng isang matrix?",
    howAnswer:
      "Maglagay ng square real symmetric matrix, isang row bawat linya, na may mga value na pinaghihiwalay ng mga kuwit o mga puwang. Kalkulahin upang tingnan ang pinagsunod-sunod na eigenvalues, normalized eigenvectors at residual.",
    privacyQuestion: "Na-upload ba ang aking mga halaga ng matrix?",
    privacyAnswer:
      "Hindi. Ang pagkalkula ay tumatakbo nang lokal sa browser na ito. Ang mga halaga ng matrix ay hindi ina-upload o sine-save ng tool na ito.",
    howTo: [
      "Maglagay ng tunay na simetriko square matrix na may 2 hanggang 8 row.",
      "Paghiwalayin ang mga value gamit ang mga kuwit o mga puwang at ilagay ang bawat row sa isang bagong linya.",
      "Kalkulahin, pagkatapos ay suriin ang bawat eigenvalue, normalized eigenvector at natitirang.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "Kalkulahin ang eigenpairs",
      example: "I-load ang halimbawa ng",
      reset: "I-clear ang",
      copy: "Kopyahin ang mga resulta",
    },
    fields: {
      matrix: "Real symmetric matrix",
      matrixHint:
        "Maglagay ng 2–8 row, isa bawat linya. Paghiwalayin ang mga value gamit ang mga kuwit, espasyo o semicolon. Halimbawa: 2, 0 sa unang linya at 0, 3 sa pangalawa.",
      accuracyNote:
        "Sinusuportahan lamang ang may hangganan na tunay na simetriko matrice, mula 2×2 hanggang 8×8; ang bawat halaga ay dapat nasa loob ng ±1,000,000. Hindi sinusuportahan ang mga non-symmetric na matrice at kumplikadong eigenvalues. Ang mga eigenvector ay may haba ng yunit; maaaring mag-iba ang kanilang tanda. Ang mga resulta ng floating-point ay tinatayang.",
      resultSummary: "Eigenpairs, pinagsunod-sunod ayon sa eigenvalue",
      eigenvalue: "Eigenvalue",
      eigenvector: "Normalized eigenvector",
      residual: "Residual ‖Av − λv‖",
    },
    messages: {
      calculated: "Eigenpairs kalkulado.",
      copied: ".",
      copyUnavailable: "Clipboard ay hindi magagamit sa browser na ito.",
      checkInputs: "Suriin ang matrix at subukang muli.",
      emptyMatrix: "Maglagay muna ng matrix.",
      invalidSize: "Gumamit ng square matrix mula 2×2 hanggang 8×8.",
      notSquare:
        "Ang bawat hilera ay dapat may parehong bilang ng mga halaga tulad ng may mga hilera.",
      notSymmetric:
        "Ang matrix na ito ay hindi simetriko; Ang Aᵢⱼ ay dapat katumbas ng Aⱼᵢ.",
      invalidEntry:
        "Gumamit ng finite numeric values mula −1,000,000 hanggang 1,000,000.",
      didNotConverge:
        "Ang numerical na paraan ay hindi nagtagpo para sa input na ito.",
      exampleLoaded: "Halimbawang na-load: eigenvalues 2 at 3.",
    },
    additionalFaqs: [
      {
        question:
          "Anong mga uri ng matrix ang sinusuportahan ng eigenvalue calculator na ito?",
        answer:
          "Sinusuportahan nito ang tunay na simetriko square matrice mula 2×2 hanggang 8×8. Hindi nito kinakalkula ang mga eigenvalue para sa mga non-symmetric na matrice o kumplikadong eigenvalues.",
      },
      {
        question: "Paano ko masusuri ang isang eigenvector?",
        answer:
          "Para sa bawat resulta, ihambing ang A na pinarami ng ipinapakitang normalized na vector sa eigenvalue na pinarami ng vector na iyon. Ang natitirang mga ulat ng pamantayan ng kanilang pagkakaiba; ang mga halagang malapit sa zero ay nagpapahiwatig ng malapit na tugmang numero.",
      },
      {
        question: "Bakit maaaring magkaroon ng ibang sign ang eigenvector?",
        answer:
          "Kung ang v ay isang eigenvector, ang −v ay isa ring eigenvector para sa parehong eigenvalue. Pinipili ng tool ang isang pare-parehong sign kung saan posible, ngunit ang sign ay hindi natatangi sa matematika.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  ta: {
    copyLanguage: "ta",
    name: "Eigenvalue கால்குலேட்டர்",
    title: "Eigenvalue கால்குலேட்டர் இலவசம் | UsefulVerse",
    description:
      "உண்மையான சமச்சீர் மேட்ரிக்ஸிற்கான ஈஜென் மதிப்புகள், ஈஜென்வெக்டர்கள் மற்றும் எச்சங்களைக் கண்டறியவும். இலவச ஆன்லைன் கால்குலேட்டர்; மதிப்புகள் உங்கள் உலாவியில்…",
    intro:
      "உண்மையான சமச்சீர் மேட்ரிக்ஸுக்கு ஈஜென்பேயர்களைக் கணக்கிட்டு சரிபார்க்கவும். ஒவ்வொரு முடிவிற்கும் இயல்பாக்கப்பட்ட ஈஜென்வெக்டர்கள் மற்றும் எஞ்சியவற்றைப் பார்க்கவும்.",
    howQuestion: "ஒரு மேட்ரிக்ஸின் ஈஜென் மதிப்புகளை எவ்வாறு கண்டுபிடிப்பது?",
    howAnswer:
      "காற்புள்ளிகள் அல்லது இடைவெளிகளால் பிரிக்கப்பட்ட மதிப்புகளுடன், ஒரு வரிக்கு ஒரு வரிசை என்ற சதுர உண்மையான சமச்சீர் அணியை உள்ளிடவும். வரிசைப்படுத்தப்பட்ட ஈஜென் மதிப்புகள், இயல்பாக்கப்பட்ட ஈஜென்வெக்டர்கள் மற்றும் எச்சங்களைக் காண கணக்கிடவும்.",
    privacyQuestion: "எனது மேட்ரிக்ஸ் மதிப்புகள் பதிவேற்றப்பட்டதா?",
    privacyAnswer:
      "எண். கணக்கீடு இந்த உலாவியில் உள்ளூரில் இயங்கும். இந்த கருவி மூலம் மேட்ரிக்ஸ் மதிப்புகள் பதிவேற்றம் செய்யப்படவில்லை அல்லது சேமிக்கப்படவில்லை.",
    howTo: [
      "2 முதல் 8 வரிசைகள் கொண்ட உண்மையான சமச்சீர் சதுர அணியை உள்ளிடவும்.",
      "காற்புள்ளிகள் அல்லது இடைவெளிகளுடன் தனி மதிப்புகள் மற்றும் ஒவ்வொரு வரிசையையும் ஒரு புதிய வரியில் வைக்கவும்.",
      "கணக்கிடவும், பின்னர் ஒவ்வொரு ஈஜென் மதிப்பு, இயல்பாக்கப்பட்ட ஈஜென்வெக்டர் மற்றும் எஞ்சியவை ஆகியவற்றைச் சரிபார்க்கவும்.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "eigenpairs",
      example: "ஏற்ற உதாரணம்",
      reset: "தெளிவான",
      copy: "முடிவுகளை நகலெடு",
    },
    fields: {
      matrix: "உண்மையான சமச்சீர் அணி",
      matrixHint:
        "2-8 வரிசைகளை உள்ளிடவும், ஒரு வரிக்கு ஒன்று. மதிப்புகளை காற்புள்ளிகள், இடைவெளிகள் அல்லது அரைப்புள்ளிகள் மூலம் பிரிக்கவும். எடுத்துக்காட்டு: முதல் வரியில் 2, 0 மற்றும் இரண்டாவது வரியில் 0, 3.",
      accuracyNote:
        "2×2 முதல் 8×8 வரை வரையறுக்கப்பட்ட உண்மையான சமச்சீர் மெட்ரிக்குகளை மட்டுமே ஆதரிக்கிறது; ஒவ்வொரு மதிப்பும் ±1,000,000க்குள் இருக்க வேண்டும். சமச்சீர் அல்லாத மெட்ரிக்குகள் மற்றும் சிக்கலான ஈஜென் மதிப்புகள் ஆதரிக்கப்படவில்லை. ஈஜென்வெக்டர்கள் அலகு நீளம் கொண்டவை; அவர்களின் அடையாளம் மாறுபடலாம். மிதக்கும் புள்ளி முடிவுகள் தோராயமானவை.",
      resultSummary: "Eigenpairs, eigenvalue",
      eigenvalue: "Eigenvalue",
      eigenvector: "இயல்பாக்கப்பட்ட ஈஜென்வெக்டர்",
      residual: "எஞ்சிய ‖Av - λv‖",
    },
    messages: {
      calculated: "Eigenpairs கணக்கிடப்பட்டது.",
      copied: "முடிவுகள் நகலெடுக்கப்பட்டன.",
      copyUnavailable: "கிளிப்போர்டு இந்த உலாவியில் இல்லை.",
      checkInputs: "அணியைச் சரிபார்த்து மீண்டும் முயலவும்.",
      emptyMatrix: "முதலில் மேட்ரிக்ஸை உள்ளிடவும்.",
      invalidSize: "2×2 முதல் 8×8 வரையிலான சதுர அணியைப் பயன்படுத்தவும்.",
      notSquare:
        "ஒவ்வொரு வரிசையிலும் வரிசைகள் உள்ள அதே எண்ணிக்கையிலான மதிப்புகள் இருக்க வேண்டும்.",
      notSymmetric: "இந்த அணி சமச்சீர் அல்ல; Aᵢⱼ கண்டிப்பாக Aⱼᵢ.",
      invalidEntry:
        "−1,000,000 முதல் 1,000,000 வரை வரையறுக்கப்பட்ட எண் மதிப்புகளைப் பயன்படுத்தவும்.",
      didNotConverge: "இந்த உள்ளீட்டிற்கு எண்ணியல் முறை ஒன்றுபடவில்லை.",
      exampleLoaded: "எடுத்துக்காட்டு ஏற்றப்பட்டது: eigenvalues 2 மற்றும் 3.",
    },
    additionalFaqs: [
      {
        question:
          "இந்த eigenvalue கால்குலேட்டர் எந்த மேட்ரிக்ஸ் வகைகளை ஆதரிக்கிறது?",
        answer:
          "இது 2×2 முதல் 8×8 வரையிலான உண்மையான சமச்சீர் சதுர மெட்ரிக்குகளை ஆதரிக்கிறது. இது சமச்சீர் அல்லாத மெட்ரிக்குகள் அல்லது சிக்கலான ஈஜென் மதிப்புகளுக்கு ஈஜென் மதிப்புகளைக் கணக்கிடாது.",
      },
      {
        question: "ஐஜென்வெக்டரை எவ்வாறு சரிபார்க்கலாம்?",
        answer:
          "ஒவ்வொரு முடிவிற்கும், காட்டப்படும் இயல்பாக்கப்பட்ட திசையன் மூலம் பெருக்கப்படும் A ஐ அந்த வெக்டரால் பெருக்கப்படும் ஈஜென் மதிப்புடன் ஒப்பிடவும். மீதமுள்ளவை அவற்றின் வேறுபாட்டின் நெறிமுறையைப் புகாரளிக்கின்றன; பூஜ்ஜியத்திற்கு அருகில் உள்ள மதிப்புகள் நெருங்கிய எண் பொருத்தத்தைக் குறிக்கின்றன.",
      },
      {
        question: "ஒரு ஈஜென்வெக்டருக்கு ஏன் வேறு அடையாளம் இருக்க முடியும்?",
        answer:
          "v ஒரு ஈஜென்வெக்டராக இருந்தால், −v என்பதும் அதே ஈஜென்வெக்டருக்கு ஈஜென்வெக்டராகும். கருவி சாத்தியமான இடங்களில் ஒரு நிலையான அடையாளத்தைத் தேர்ந்தெடுக்கிறது, ஆனால் அடையாளம் கணித ரீதியாக தனித்துவமானது அல்ல.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  fa: {
    copyLanguage: "fa",
    name: "Eigenvalue Calculator",
    title: "Eigenvalue Calculator رایگان | UsefulVerse",
    description:
      "مقادیر ویژه، بردارهای ویژه و باقیمانده ها را برای یک ماتریس متقارن واقعی بیابید. ماشین حساب آنلاین رایگان؛ مقادیر در مرورگر شما باقی می مانند.",
    intro:
      "جفت های ویژه را برای یک ماتریس متقارن واقعی محاسبه و بررسی کنید. بردارهای ویژه نرمال شده و باقیمانده را برای هر نتیجه ببینید.",
    howQuestion: "چگونه مقادیر ویژه یک ماتریس را پیدا کنم؟",
    howAnswer:
      "یک ماتریس متقارن مربعی واقعی را وارد کنید، یک ردیف در هر خط، با مقادیر جدا شده با کاما یا فاصله. برای مشاهده مقادیر ویژه مرتب شده، بردارهای ویژه نرمال شده و باقیمانده ها محاسبه کنید.",
    privacyQuestion: "آیا مقادیر ماتریس من آپلود شده است؟",
    privacyAnswer:
      "نه. محاسبه به صورت محلی در این مرورگر اجرا می شود. مقادیر ماتریس توسط این ابزار آپلود یا ذخیره نمی شوند.",
    howTo: [
      "یک ماتریس مربع متقارن واقعی با 2 تا 8 ردیف وارد کنید.",
      "مقادیر را با کاما یا فاصله جدا کنید و هر سطر را در یک خط جدید قرار دهید.",
      "محاسبه کنید، سپس هر مقدار ویژه، بردار ویژه نرمال شده و باقیمانده را بررسی کنید.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "جفت های ویژه",
      example: "بارگذاری مثال",
      reset: "پاک کردن",
      copy: "نتایج",
    },
    fields: {
      matrix: "ماتریس متقارن واقعی",
      matrixHint:
        "2 تا 8 ردیف را وارد کنید، یکی در هر خط. مقادیر را با کاما، فاصله یا نقطه ویرگول از هم جدا کنید. مثال: 2، 0 در خط اول و 0، 3 در خط دوم.",
      accuracyNote:
        "فقط از ماتریس های متقارن واقعی محدود، از 2×2 تا 8×8 پشتیبانی می کند. هر مقدار باید در 1,000,000 ± باشد. ماتریس های نامتقارن و مقادیر ویژه پیچیده پشتیبانی نمی شوند. بردارهای ویژه دارای طول واحد هستند. نشانه آنها ممکن است متفاوت باشد. نتایج ممیز شناور تقریبی است.",
      resultSummary: "جفت های ویژه، مرتب شده بر اساس مقدار ویژه",
      eigenvalue: "مقدار ویژه",
      eigenvector: "بردار ویژه عادی شده",
      residual: "باقیمانده ‖Av − λv‖",
    },
    messages: {
      calculated: "جفت های ویژه محاسبه شده است.",
      copied: "نتایج کپی شد.",
      copyUnavailable: "در این مرورگر در دسترس نیست.",
      checkInputs: "ماتریس را بررسی کرده و دوباره امتحان کنید.",
      emptyMatrix: "ابتدا یک ماتریس را وارد کنید.",
      invalidSize: "از یک ماتریس مربع از 2×2 تا 8×8 استفاده کنید.",
      notSquare: "هر سطر باید به اندازه سطرها دارای مقادیر باشد.",
      notSymmetric: "این ماتریس متقارن نیست. Aᵢⱼ باید برابر Aⱼᵢ باشد.",
      invalidEntry:
        "از مقادیر عددی محدود از 1,000,000- تا 1,000,000 استفاده کنید.",
      didNotConverge: "روش عددی برای این ورودی همگرا نشد.",
      exampleLoaded: "مثال بارگذاری شد: مقادیر ویژه 2 و 3.",
    },
    additionalFaqs: [
      {
        question:
          "این ماشین حساب مقدار ویژه از چه نوع ماتریسی پشتیبانی می کند؟",
        answer:
          "از ماتریس های مربع متقارن واقعی از 2×2 تا 8×8 پشتیبانی می کند. مقادیر ویژه را برای ماتریس های غیر متقارن یا مقادیر ویژه پیچیده محاسبه نمی کند.",
      },
      {
        question: "چگونه می توانم بردار ویژه را بررسی کنم؟",
        answer:
          "برای هر نتیجه، ضرب A در بردار نرمال شده نمایش داده شده را با مقدار ویژه ضرب در آن بردار مقایسه کنید. باقیمانده هنجار تفاوت آنها را گزارش می کند. مقادیر نزدیک به صفر نشان دهنده تطابق عددی نزدیک است.",
      },
      {
        question: "چرا بردار ویژه می تواند علامت متفاوتی داشته باشد؟",
        answer:
          "اگر v یک بردار ویژه باشد، −v نیز یک بردار ویژه برای همان مقدار ویژه است. این ابزار در صورت امکان یک علامت ثابت را انتخاب می کند، اما علامت از نظر ریاضی منحصر به فرد نیست.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  am: {
    copyLanguage: "am",
    name: "የኢገን እሴት ማስያ",
    title: "የኢገን እሴት ማስያ ነፃ | UsefulVerse",
    description:
      "ለእውነተኛ ሲሜትሪክ ማትሪክስ ኢጂንቫሉስ፣ ኢጂንቬክተሮች እና ቀሪዎችን ያግኙ። ነፃ የመስመር ላይ ካልኩሌተር; እሴቶች በአሳሽዎ ውስጥ ይቆያሉ።",
    intro:
      "አስላ እና eigenpairs ለእውነተኛ ሲሜትሪክ ማትሪክስ ያረጋግጡ። ለእያንዳንዱ ውጤት መደበኛውን ኢጂንቬክተሮችን እና ቀሪውን ይመልከቱ።",
    howQuestion: "የማትሪክስ eigenvalues እንዴት ማግኘት እችላለሁ?",
    howAnswer:
      "በካሬ እውነተኛ ሲምሜትሪክ ማትሪክስ፣ በመስመር አንድ ረድፍ፣ በነጠላ ሰረዞች ወይም ክፍተቶች የተለዩ እሴቶችን ያስገቡ። የተደረደሩ eigenvectors እና ቀሪዎችን ለማየት አስላ።",
    privacyQuestion: "የማትሪክስ እሴቶቼ ተሰቅለዋል?",
    privacyAnswer:
      "ቁ. ስሌቱ በዚህ አሳሽ ውስጥ በአካባቢው ይሰራል። የማትሪክስ ዋጋዎች በዚህ መሳሪያ አልተሰቀሉም ወይም አልተቀመጡም።",
    howTo: [
      "ከ2 እስከ 8 ረድፎች ያለው እውነተኛ ሲሜትሪክ ካሬ ማትሪክስ ያስገቡ።",
      "እሴቶችን በነጠላ ሰረዞች ወይም ክፍተቶች ይለያዩ እና እያንዳንዱን ረድፍ በአዲስ መስመር ላይ ያድርጉ።",
      "አስላ፣ በመቀጠል እያንዳንዱን ኢጂንቬክተር፣ መደበኛ ኢጂንቬክተር እና ቀሪዎችን ያረጋግጡ።",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "eigenpairs",
      example: "ጫን ምሳሌ",
      reset: "Clear",
      copy: "ውጤቶች",
    },
    fields: {
      matrix: "እውነተኛ ሲሜትሪክ ማትሪክስ",
      matrixHint:
        "2-8 ረድፎችን አስገባ፣ በመስመር አንድ። በነጠላ ሰረዞች፣ ቦታዎች ወይም ሴሚኮሎኖች የተለዩ እሴቶች። ምሳሌ፡- 2፣ 0 በመጀመሪያው መስመር እና 0፣ 3 በሁለተኛው።",
      accuracyNote:
        "ከ 2×2 እስከ 8×8 ድረስ ያሉ ትክክለኛ ሲሜትሪክ ማትሪክቶችን ብቻ ይደግፋል። እያንዳንዱ እሴት በ ± 1,000,000 ውስጥ መሆን አለበት. ተመጣጣኝ ያልሆኑ ማትሪክስ እና ውስብስብ ኢጂኔቫሎች አይደገፉም። Eigenvectors ክፍል ርዝመት አላቸው; ምልክታቸው ሊለያይ ይችላል. ተንሳፋፊ ነጥብ ውጤቶች ግምታዊ ናቸው።",
      resultSummary: "Eigenpairs፣ በ eigenvalue",
      eigenvalue: "ኢገንቫል",
      eigenvector: "መደበኛ eigenvector",
      residual: "ቀሪ ‖Av - λv‖",
    },
    messages: {
      calculated: "Eigenpairs ይሰላል።",
      copied: "ውጤቶች ተቀድተዋል።",
      copyUnavailable: "ቅንጥብ ሰሌዳ በዚህ አሳሽ ውስጥ የለም።",
      checkInputs: "ማትሪክስ ይፈትሹ እና እንደገና ይሞክሩ።",
      emptyMatrix: "መጀመሪያ ማትሪክስ ያስገቡ።",
      invalidSize: "ካሬ ማትሪክስ ከ2×2 እስከ 8×8 ይጠቀሙ።",
      notSquare: "እያንዳንዱ ረድፍ እንደ ረድፎች ተመሳሳይ የእሴቶች ብዛት ሊኖረው ይገባል።",
      notSymmetric: "This matrix is not symmetric; Aᵢⱼ must equal Aⱼᵢ.",
      invalidEntry: "ከ-1,000,000 እስከ 1,000,000 ያሉ ውሱን የቁጥር እሴቶችን ተጠቀም።",
      didNotConverge: "ለዚህ ግቤት የቁጥር ዘዴ አልተጣመረም።",
      exampleLoaded: "ምሳሌ ተጭኗል፡ eigenvalues 2 እና 3.",
    },
    additionalFaqs: [
      {
        question: "ይህ eigenvalue ካልኩሌተር ምን ዓይነት ማትሪክስ ዓይነቶችን ይደግፋል?",
        answer:
          "ከ2×2 እስከ 8×8 እውነተኛ ሲሜትሪክ ካሬ ማትሪክስ ይደግፋል። ተመሳሳይ ያልሆኑ ማትሪክስ ወይም ውስብስብ ኢጂን እሴቶችን አይሰላም።",
      },
      {
        question: "ኢጂንቬክተርን እንዴት ማረጋገጥ እችላለሁ?",
        answer:
          "ለእያንዳንዱ ውጤት፣ በሚታየው መደበኛ ቬክተር የተባዛውን ኢጂንቫልዩ በዚያ ቬክተር ተባዝቶ ያወዳድሩ። ቀሪው የልዩነታቸውን መደበኛ ሁኔታ ሪፖርት ያደርጋል; ከዜሮ አጠገብ ያሉ እሴቶች የቅርብ የቁጥር ግጥሚያ ያመለክታሉ።",
      },
      {
        question: "ለምንድን ነው eigenvector የተለየ ምልክት ሊኖረው የሚችለው?",
        answer:
          "v eigenvector ከሆነ -v ለተመሳሳይ ኢኢገንቬክተር ነው። መሣሪያው በሚቻልበት ጊዜ ወጥ የሆነ ምልክት ይመርጣል፣ ምልክት ግን በሒሳብ ልዩ አይደለም።",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
  gu: {
    copyLanguage: "gu",
    name: "Eigenvalue Calculator",
    title: "Eigenvalue Calculator મફત | UsefulVerse",
    description:
      "વાસ્તવિક સપ્રમાણ મેટ્રિક્સ માટે eigenvalues, eigenvectors અને residuals શોધો. નિઃશુલ્ક ઑનલાઇન કેલ્ક્યુલેટર; મૂલ્યો તમારા બ્રાઉઝરમાં રહે છે.",
    intro:
      "વાસ્તવિક સપ્રમાણ મેટ્રિક્સ માટે eigenpairની ગણતરી કરો અને તપાસો. દરેક પરિણામ માટે સામાન્યકૃત eigenvectors અને શેષ જુઓ.",
    howQuestion: "હું મેટ્રિક્સના eigenvalues કેવી રીતે શોધી શકું?",
    howAnswer:
      "એક ચોરસ વાસ્તવિક સપ્રમાણ મેટ્રિક્સ દાખલ કરો, પ્રતિ લાઇન એક પંક્તિ, અલ્પવિરામ અથવા સ્પેસ દ્વારા વિભાજિત મૂલ્યો સાથે. સૉર્ટ કરેલ eigenvalues, સામાન્યકૃત eigenvectors અને અવશેષો જોવા માટે ગણતરી કરો.",
    privacyQuestion: "શું મારા મેટ્રિક્સ મૂલ્યો અપલોડ કરવામાં આવ્યા છે?",
    privacyAnswer:
      "નંબર. ગણતરી આ બ્રાઉઝરમાં સ્થાનિક રીતે ચાલે છે. મેટ્રિક્સ મૂલ્યો આ સાધન દ્વારા અપલોડ અથવા સાચવવામાં આવતાં નથી.",
    howTo: [
      "2 થી 8 પંક્તિઓ સાથે વાસ્તવિક સપ્રમાણ ચોરસ મેટ્રિક્સ દાખલ કરો.",
      "મૂલ્યોને અલ્પવિરામ અથવા સ્પેસથી અલગ કરો અને દરેક પંક્તિને નવી લાઇન પર મૂકો.",
      "ગણતરી કરો, પછી દરેક eigenvalue, સામાન્યકૃત eigenvector અને શેષને તપાસો.",
    ],
    example: {
      label: "Load a matrix with eigenvalues 2 and 3",
      values: ["2, 0\n0, 3"],
    },
    actions: {
      calculate: "eigenpairs",
      example: "લોડ ઉદાહરણ",
      reset: "સાફ કરો",
      copy: "પરિણામોની નકલ કરો",
    },
    fields: {
      matrix: "વાસ્તવિક સપ્રમાણ મેટ્રિક્સ",
      matrixHint:
        "2-8 પંક્તિઓ દાખલ કરો, એક લીટી દીઠ. અલ્પવિરામ, જગ્યાઓ અથવા અર્ધવિરામ સાથે મૂલ્યોને અલગ કરો. ઉદાહરણ: પ્રથમ લાઇન પર 2, 0 અને બીજી લાઇન પર 0, 3.",
      accuracyNote:
        "માત્ર 2×2 થી 8×8 સુધી મર્યાદિત વાસ્તવિક સપ્રમાણ મેટ્રિક્સને સપોર્ટ કરે છે; દરેક મૂલ્ય ±1,000,000 ની અંદર હોવું જોઈએ. બિન-સપ્રમાણ મેટ્રિસિસ અને જટિલ ઇજેનવેલ્યુ સપોર્ટેડ નથી. Eigenvectors એકમ લંબાઈ ધરાવે છે; તેમની નિશાની અલગ અલગ હોઈ શકે છે. ફ્લોટિંગ-પોઇન્ટ પરિણામો અંદાજિત છે.",
      resultSummary: "Eigenpairs, eigenvalue",
      eigenvalue: "Eigenvalue",
      eigenvector: "સામાન્યકૃત eigenvector",
      residual: "શેષ ‖Av - λv‖",
    },
    messages: {
      calculated: "Eigenpairs ગણતરી કરેલ.",
      copied: "પરિણામોની નકલ કરી.",
      copyUnavailable: "ક્લિપબોર્ડ આ બ્રાઉઝરમાં અનુપલબ્ધ છે.",
      checkInputs: "મેટ્રિક્સ તપાસો અને ફરી પ્રયાસ કરો.",
      emptyMatrix: "પહેલા મેટ્રિક્સ દાખલ કરો.",
      invalidSize: "2×2 થી 8×8 સુધીના ચોરસ મેટ્રિક્સનો ઉપયોગ કરો.",
      notSquare: "દરેક પંક્તિમાં પંક્તિઓ જેટલી જ સંખ્યા હોવી જોઈએ.",
      notSymmetric: "આ મેટ્રિક્સ સપ્રમાણ નથી; Aᵢⱼ Aⱼᵢ બરાબર હોવું જોઈએ.",
      invalidEntry:
        "−1,000,000 થી 1,000,000 સુધીના મર્યાદિત આંકડાકીય મૂલ્યોનો ઉપયોગ કરો.",
      didNotConverge: "આ ઇનપુટ માટે સંખ્યાત્મક પદ્ધતિ એકરૂપ થઈ નથી.",
      exampleLoaded: "ઉદાહરણ લોડ કર્યું: eigenvalues 2 અને 3.",
    },
    additionalFaqs: [
      {
        question:
          "આ eigenvalue કેલ્ક્યુલેટર કયા પ્રકારના મેટ્રિક્સને સપોર્ટ કરે છે?",
        answer:
          "તે 2×2 થી 8×8 સુધીના વાસ્તવિક સપ્રમાણ ચોરસ મેટ્રિસિસને સપોર્ટ કરે છે. તે બિન-સપ્રમાણ મેટ્રિસીસ અથવા જટિલ ઇજેન મૂલ્યો માટે eigenvalues ​​ની ગણતરી કરતું નથી.",
      },
      {
        question: "હું eigenvector કેવી રીતે તપાસી શકું?",
        answer:
          "દરેક પરિણામ માટે, પ્રદર્શિત નોર્મલાઇઝ્ડ વેક્ટર દ્વારા ગુણાકાર કરેલ એ વેક્ટર દ્વારા ગુણાકાર કરેલ ઇજનવેલ્યુ સાથે સરખામણી કરો. શેષ તેમના તફાવતના ધોરણની જાણ કરે છે; શૂન્યની નજીકના મૂલ્યો નજીકના આંકડાકીય મેળ સૂચવે છે.",
      },
      {
        question: "એક eigenvector શા માટે અલગ ચિહ્ન ધરાવી શકે છે?",
        answer:
          "જો v એ ઇજનવેક્ટર છે, તો −v એ સમાન ઇજનવેક્ટર માટે પણ એક ઇજનવેક્ટર છે. સાધન શક્ય હોય ત્યાં સુસંગત ચિહ્ન પસંદ કરે છે, પરંતુ ચિહ્ન ગાણિતિક રીતે અનન્ય નથી.",
      },
    ],
    sources: [],
    localizationStatus: "machine-accepted",
    localizationAcceptedBy: "site-owner",
    localizationAcceptedAt: "2026-10-11",
  },
});
