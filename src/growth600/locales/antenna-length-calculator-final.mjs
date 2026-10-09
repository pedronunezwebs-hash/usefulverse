const antennaLengthCalculatorCopies = {
  "en": {
    "copyLanguage": "en",
    "name": "Antenna Length Calculator",
    "title": "Dipole Antenna Length Calculator Free | UsefulVerse",
    "description": "Estimate half-wave dipole or quarter-wave antenna length from frequency. Free, unlimited browser use with an editable shortening factor.",
    "intro": "Estimate a free-space half-wave dipole or quarter-wave monopole from frequency. Adjust the shortening factor to see a practical starting length and each dipole leg.",
    "howQuestion": "How do I calculate dipole antenna length from frequency?",
    "howAnswer": "First calculate wavelength as the speed of light divided by frequency. A half-wave dipole is about half that wavelength in total, with two equal legs; a quarter-wave monopole is about one quarter. An editable shortening factor can provide a practical starting estimate, but the final length depends on antenna design and surroundings.",
    "privacyQuestion": "Are my antenna values uploaded?",
    "privacyAnswer": "No. The calculation runs in this browser; your entered values are not uploaded or saved by this tool.",
    "fields": {
      "mode": "Antenna type",
      "dipole": "Half-wave dipole",
      "monopole": "Quarter-wave monopole",
      "frequency": "Operating frequency",
      "frequencyUnit": "Frequency unit",
      "hz": "Hertz (Hz)",
      "khz": "Kilohertz (kHz)",
      "mhz": "Megahertz (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "Shortening factor (0.70–1.00)",
      "accuracyNote": "This estimates a straight, thin conductor in free space. The shortening factor is an adjustable starting estimate, not a universal correction; feed, conductor diameter, nearby objects, ground and installation affect tuning. Measure and tune safely; this is not a design certification or radio-safety assessment."
    },
    "actions": {
      "calculate": "Calculate antenna length",
      "reset": "Reset",
      "copy": "Copy results",
      "example": "Try 100 MHz",
      "result": "Antenna length estimate"
    },
    "messages": {
      "calculated": "Antenna length estimate calculated.",
      "checkInputs": "Enter a valid positive frequency, antenna type, unit and shortening factor from 0.70 to 1.00.",
      "copied": "Results copied.",
      "copyUnavailable": "Copy is not available in this browser.",
      "wavelength": "Free-space wavelength",
      "idealLength": "Ideal length before shortening",
      "adjustedLength": "Estimated adjusted total length",
      "elementLength": "Length of each dipole leg",
      "imperialAdjusted": "Adjusted total length (feet)",
      "factor": "Shortening factor",
      "formula": "Formula"
    },
    "additionalFaqs": [
      {
        "question": "What is the length of a half-wave dipole at 100 MHz?",
        "answer": "In free space, the wavelength at 100 MHz is about 2.998 m, so an ideal half-wave dipole is about 1.499 m total, or about 0.749 m per leg. A practical antenna may use a shortening factor and should be tuned in its installed environment."
      },
      {
        "question": "How long is a quarter-wave antenna?",
        "answer": "Its ideal free-space conductor length is one quarter of wavelength: speed of light divided by four times frequency. The actual tuned length can differ with the conductor, feed, ground and surroundings."
      },
      {
        "question": "What does the shortening factor mean?",
        "answer": "It multiplies the ideal free-space element length to provide a starting estimate for a practical conductor. The default is only a rule of thumb; it is not the coaxial cable velocity factor and does not replace measurement or tuning."
      },
      {
        "question": "Does this calculator guarantee a tuned or safe antenna?",
        "answer": "No. It estimates basic half-wave dipole or quarter-wave monopole geometry. Real impedance and resonance depend on construction and the site. Follow radio regulations and safe installation practices, and verify with suitable instruments."
      }
    ]
  },
  "es": {
    "copyLanguage": "es",
    "name": "Calculadora de longitud de antena",
    "title": "Calculadora de longitud de antena dipolo | UsefulVerse",
    "description": "Calcule la longitud de la antena dipolo de media onda o cuarto de onda a partir de la frecuencia. Uso gratuito e ilimitado del navegador con un factor de...",
    "intro": "Estime un dipolo de media onda o un monopolo de un cuarto de onda en el espacio libre a partir de la frecuencia. Ajuste el factor de acortamiento para ver una longitud inicial práctica y cada pata del dipolo.",
    "howQuestion": "¿Cómo calculo la longitud de la antena dipolo a partir de la frecuencia?",
    "howAnswer": "Primero calcule la longitud de onda como la velocidad de la luz dividida por la frecuencia. Un dipolo de media onda tiene aproximadamente la mitad de esa longitud de onda en total, con dos patas iguales; un monopolo de un cuarto de onda equivale aproximadamente a un cuarto. Un factor de acortamiento editable puede proporcionar una estimación inicial práctica, pero la longitud final depende del diseño de la antena y del entorno.",
    "privacyQuestion": "¿Están cargados los valores de mi antena?",
    "privacyAnswer": "No. El cálculo se ejecuta en este navegador; Esta herramienta no carga ni guarda los valores ingresados.",
    "fields": {
      "mode": "Tipo de antena",
      "dipole": "Dipolo de media onda",
      "monopole": "Monopolo de cuarto de onda",
      "frequency": "Frecuencia de funcionamiento",
      "frequencyUnit": "Unidad de frecuencia",
      "hz": "Hercios (Hz)",
      "khz": "Kilohercios (kHz)",
      "mhz": "Megahercios (MHz)",
      "ghz": "Gigahercios (GHz)",
      "shorteningFactor": "Factor de acortamiento (0,70–1,00)",
      "accuracyNote": "Esto estima un conductor delgado y recto en el espacio libre. El factor de acortamiento es una estimación inicial ajustable, no una corrección universal; La alimentación, el diámetro del conductor, los objetos cercanos, la tierra y la instalación afectan la sintonización. Mida y afine de forma segura; Esta no es una certificación de diseño ni una evaluación de seguridad radioeléctrica."
    },
    "actions": {
      "calculate": "Calcular la longitud de la antena",
      "reset": "Reiniciar",
      "copy": "Copiar resultados",
      "example": "Pruebe 100MHz",
      "result": "Estimación de la longitud de la antena"
    },
    "messages": {
      "calculated": "Estimación de la longitud de la antena calculada.",
      "checkInputs": "Introduzca una frecuencia positiva válida, tipo de antena, unidad y factor de acortamiento de 0,70 a 1,00.",
      "copied": "Resultados copiados.",
      "copyUnavailable": "La copia no está disponible en este navegador.",
      "wavelength": "Longitud de onda en el espacio libre",
      "idealLength": "Longitud ideal antes de acortar",
      "adjustedLength": "Longitud total ajustada estimada",
      "elementLength": "Longitud de cada pata del dipolo",
      "imperialAdjusted": "Longitud total ajustada (pies)",
      "factor": "factor de acortamiento",
      "formula": "Fórmula"
    },
    "additionalFaqs": [
      {
        "question": "¿Cuál es la longitud de un dipolo de media onda a 100 MHz?",
        "answer": "En el espacio libre, la longitud de onda a 100 MHz es de aproximadamente 2,998 m, por lo que un dipolo de media onda ideal tiene aproximadamente 1,499 m en total, o aproximadamente 0,749 m por pata. Una antena práctica puede utilizar un factor de acortamiento y debe sintonizarse en su entorno de instalación."
      },
      {
        "question": "¿Cuánto mide una antena de un cuarto de onda?",
        "answer": "La longitud ideal de su conductor en el espacio libre es un cuarto de la longitud de onda: la velocidad de la luz dividida por cuatro veces la frecuencia. La longitud sintonizada real puede diferir según el conductor, la alimentación, la tierra y el entorno."
      },
      {
        "question": "¿Qué significa el factor de acortamiento?",
        "answer": "Multiplica la longitud ideal del elemento de espacio libre para proporcionar una estimación inicial para un conductor práctico. El valor predeterminado es sólo una regla general; no es el factor de velocidad del cable coaxial y no reemplaza la medición ni la sintonización."
      },
      {
        "question": "¿Esta calculadora garantiza una antena sintonizada o segura?",
        "answer": "No. Estima la geometría básica de un dipolo de media onda o un monopolo de un cuarto de onda. La impedancia y la resonancia reales dependen de la construcción y del sitio. Siga las normas de radio y las prácticas de instalación segura y verifique con instrumentos adecuados."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "fr": {
    "copyLanguage": "fr",
    "name": "Calculateur de longueur d'antenne",
    "title": "Calculateur de longueur d'antenne dipôle | UsefulVerse",
    "description": "Estimez la longueur de l'antenne dipôle demi-onde ou quart d'onde à partir de la fréquence. Utilisation gratuite et illimitée du navigateur avec un facteur...",
    "intro": "Estimez un dipôle demi-onde ou un monopôle quart d'onde en espace libre à partir de la fréquence. Ajustez le facteur de raccourcissement pour voir une longueur de départ pratique et chaque branche dipolaire.",
    "howQuestion": "Comment calculer la longueur de l'antenne dipôle à partir de la fréquence ?",
    "howAnswer": "Calculez d’abord la longueur d’onde comme la vitesse de la lumière divisée par la fréquence. Un dipôle demi-onde mesure environ la moitié de cette longueur d'onde au total, avec deux branches égales ; un monopôle quart d'onde mesure environ un quart. Un facteur de raccourcissement modifiable peut fournir une estimation de départ pratique, mais la longueur finale dépend de la conception de l'antenne et de son environnement.",
    "privacyQuestion": "Les valeurs de mes antennes sont-elles téléchargées ?",
    "privacyAnswer": "Non. Le calcul s'exécute dans ce navigateur ; vos valeurs saisies ne sont pas téléchargées ou enregistrées par cet outil.",
    "fields": {
      "mode": "Type d'antenne",
      "dipole": "Dipôle demi-onde",
      "monopole": "Monopôle quart d'onde",
      "frequency": "Fréquence de fonctionnement",
      "frequencyUnit": "Unité de fréquence",
      "hz": "Hertz (Hz)",
      "khz": "Kilohertz (kHz)",
      "mhz": "Mégahertz (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "Facteur de raccourcissement (0,70-1,00)",
      "accuracyNote": "Ceci estime un conducteur droit et mince dans l’espace libre. Le facteur de raccourcissement est une estimation de départ réglable et non une correction universelle ; l'alimentation, le diamètre du conducteur, les objets à proximité, la terre et l'installation affectent le réglage. Mesurez et réglez en toute sécurité ; il ne s’agit pas d’une certification de conception ou d’une évaluation de la sécurité radio."
    },
    "actions": {
      "calculate": "Calculer la longueur de l'antenne",
      "reset": "Réinitialiser",
      "copy": "Copier les résultats",
      "example": "Essayez 100 MHz",
      "result": "Estimation de la longueur de l'antenne"
    },
    "messages": {
      "calculated": "Estimation de la longueur de l'antenne calculée.",
      "checkInputs": "Entrez une fréquence positive, un type d'antenne, une unité et un facteur de raccourcissement valides compris entre 0,70 et 1,00.",
      "copied": "Résultats copiés.",
      "copyUnavailable": "La copie n'est pas disponible dans ce navigateur.",
      "wavelength": "Longueur d'onde en espace libre",
      "idealLength": "Longueur idéale avant de raccourcir",
      "adjustedLength": "Longueur totale ajustée estimée",
      "elementLength": "Longueur de chaque jambe du dipôle",
      "imperialAdjusted": "Longueur totale ajustée (pieds)",
      "factor": "Facteur de raccourcissement",
      "formula": "Formule"
    },
    "additionalFaqs": [
      {
        "question": "Quelle est la longueur d'un dipôle demi-onde à 100 MHz ?",
        "answer": "Dans l'espace libre, la longueur d'onde à 100 MHz est d'environ 2,998 m, donc un dipôle demi-onde idéal mesure environ 1,499 m au total, soit environ 0,749 m par branche. Une antenne pratique peut utiliser un facteur de raccourcissement et doit être réglée dans son environnement d'installation."
      },
      {
        "question": "Quelle est la longueur d’une antenne quart d’onde ?",
        "answer": "Sa longueur idéale de conducteur en espace libre est d’un quart de longueur d’onde : vitesse de la lumière divisée par quatre fois la fréquence. La longueur réelle accordée peut différer selon le conducteur, l'alimentation, la terre et l'environnement."
      },
      {
        "question": "Que signifie le facteur de raccourcissement ?",
        "answer": "Il multiplie la longueur idéale de l'élément en espace libre pour fournir une estimation de départ pour un conducteur pratique. La valeur par défaut n'est qu'une règle empirique ; il ne s'agit pas du facteur de vitesse du câble coaxial et ne remplace pas la mesure ou le réglage."
      },
      {
        "question": "Ce calculateur garantit-il une antenne accordée ou sûre ?",
        "answer": "Non. Il estime la géométrie de base d'un dipôle demi-onde ou d'un monopôle quart d'onde. L'impédance et la résonance réelles dépendent de la construction et du site. Suivez les réglementations radio et les pratiques d'installation sûres, et vérifiez avec les instruments appropriés."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "pt": {
    "copyLanguage": "pt",
    "name": "Calculadora de comprimento de antena",
    "title": "Calculadora de comprimento de antena dipolo | UsefulVerse",
    "description": "Estime o comprimento da antena dipolo de meia onda ou de quarto de onda a partir da frequência. Uso gratuito e ilimitado do navegador com um fator de...",
    "intro": "Estime um dipolo de meia onda no espaço livre ou um monopolo de quarto de onda a partir da frequência. Ajuste o fator de encurtamento para ver um comprimento inicial prático e cada perna dipolo.",
    "howQuestion": "Como calculo o comprimento da antena dipolo a partir da frequência?",
    "howAnswer": "Primeiro calcule o comprimento de onda como a velocidade da luz dividida pela frequência. Um dipolo de meia onda tem cerca de metade desse comprimento de onda no total, com duas pernas iguais; um monopolo de quarto de onda é cerca de um quarto. Um fator de encurtamento editável pode fornecer uma estimativa inicial prática, mas o comprimento final depende do projeto da antena e do ambiente.",
    "privacyQuestion": "Os valores da minha antena foram carregados?",
    "privacyAnswer": "Não. O cálculo é executado neste navegador; seus valores inseridos não são carregados ou salvos por esta ferramenta.",
    "fields": {
      "mode": "Tipo de antena",
      "dipole": "Dipolo de meia onda",
      "monopole": "Monopólo de quarto de onda",
      "frequency": "Frequência operacional",
      "frequencyUnit": "Unidade de frequência",
      "hz": "Hertz (Hz)",
      "khz": "Quilohertz (kHz)",
      "mhz": "Megahertz (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "Fator de encurtamento (0,70–1,00)",
      "accuracyNote": "Isso estima um condutor reto e fino no espaço livre. O fator de redução é uma estimativa inicial ajustável, não uma correção universal; alimentação, diâmetro do condutor, objetos próximos, aterramento e instalação afetam o ajuste. Meça e ajuste com segurança; esta não é uma certificação de projeto ou avaliação de segurança de rádio."
    },
    "actions": {
      "calculate": "Calcular o comprimento da antena",
      "reset": "Reiniciar",
      "copy": "Copiar resultados",
      "example": "Experimente 100 MHz",
      "result": "Estimativa do comprimento da antena"
    },
    "messages": {
      "calculated": "Estimativa do comprimento da antena calculada.",
      "checkInputs": "Insira uma frequência positiva válida, tipo de antena, unidade e fator de encurtamento de 0,70 a 1,00.",
      "copied": "Resultados copiados.",
      "copyUnavailable": "A cópia não está disponível neste navegador.",
      "wavelength": "Comprimento de onda do espaço livre",
      "idealLength": "Comprimento ideal antes de encurtar",
      "adjustedLength": "Comprimento total ajustado estimado",
      "elementLength": "Comprimento de cada perna dipolo",
      "imperialAdjusted": "Comprimento total ajustado (pés)",
      "factor": "Fator de encurtamento",
      "formula": "Fórmula"
    },
    "additionalFaqs": [
      {
        "question": "Qual é o comprimento de um dipolo de meia onda em 100 MHz?",
        "answer": "No espaço livre, o comprimento de onda em 100 MHz é de cerca de 2,998 m, então um dipolo de meia onda ideal tem cerca de 1,499 m no total, ou cerca de 0,749 m por perna. Uma antena prática pode usar um fator de encurtamento e deve ser sintonizada no ambiente instalado."
      },
      {
        "question": "Qual o comprimento de uma antena de quarto de onda?",
        "answer": "O comprimento ideal do condutor no espaço livre é um quarto do comprimento de onda: a velocidade da luz dividida por quatro vezes a frequência. O comprimento real sintonizado pode variar dependendo do condutor, alimentação, terra e arredores."
      },
      {
        "question": "O que significa o fator de encurtamento?",
        "answer": "Ele multiplica o comprimento ideal do elemento de espaço livre para fornecer uma estimativa inicial para um condutor prático. O padrão é apenas uma regra prática; não é o fator de velocidade do cabo coaxial e não substitui medição ou ajuste."
      },
      {
        "question": "Esta calculadora garante uma antena sintonizada ou segura?",
        "answer": "Não. Ele estima a geometria básica de dipolo de meia onda ou monopolo de quarto de onda. A impedância e a ressonância reais dependem da construção e do local. Siga os regulamentos de rádio e as práticas de instalação segura e verifique com instrumentos adequados."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "de": {
    "copyLanguage": "de",
    "name": "Antennenlängenrechner",
    "title": "Dipolantennenlängenrechner kostenlos | UsefulVerse",
    "description": "Schätzen Sie die Länge der Halbwellendipol- oder Viertelwellenantenne anhand der Frequenz. Kostenlose, unbegrenzte Browsernutzung mit editierbarem...",
    "intro": "Schätzen Sie einen Freiraum-Halbwellendipol oder Viertelwellenmonopol aus der Frequenz. Passen Sie den Verkürzungsfaktor an, um eine praktische Anfangslänge für jedes Dipolbein zu erhalten.",
    "howQuestion": "Wie berechne ich die Dipolantennenlänge aus der Frequenz?",
    "howAnswer": "Berechnen Sie zunächst die Wellenlänge als Lichtgeschwindigkeit dividiert durch die Frequenz. Ein Halbwellendipol hat insgesamt etwa die Hälfte dieser Wellenlänge und zwei gleiche Schenkel; ein Viertelwellenmonopol ist etwa ein Viertel. Ein editierbarer Verkürzungsfaktor kann eine praktische Anfangsschätzung liefern, die endgültige Länge hängt jedoch vom Antennendesign und der Umgebung ab.",
    "privacyQuestion": "Werden meine Antennenwerte hochgeladen?",
    "privacyAnswer": "Nein. Die Berechnung läuft in diesem Browser; Ihre eingegebenen Werte werden von diesem Tool nicht hochgeladen oder gespeichert.",
    "fields": {
      "mode": "Antennentyp",
      "dipole": "Halbwellendipol",
      "monopole": "Viertelwellenmonopol",
      "frequency": "Betriebsfrequenz",
      "frequencyUnit": "Frequenzeinheit",
      "hz": "Hertz (Hz)",
      "khz": "Kilohertz (kHz)",
      "mhz": "Megahertz (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "Verkürzungsfaktor (0,70–1,00)",
      "accuracyNote": "Dies schätzt einen geraden, dünnen Leiter im freien Raum. Der Verkürzungsfaktor ist eine anpassbare Anfangsschätzung, keine universelle Korrektur; Einspeisung, Leiterdurchmesser, Objekte in der Nähe, Boden und Installation beeinflussen die Abstimmung. Sicher messen und einstellen; Hierbei handelt es sich nicht um eine Designzertifizierung oder Funksicherheitsbewertung."
    },
    "actions": {
      "calculate": "Antennenlänge berechnen",
      "reset": "Zurücksetzen",
      "copy": "Ergebnisse kopieren",
      "example": "Versuchen Sie es mit 100 MHz",
      "result": "Schätzung der Antennenlänge"
    },
    "messages": {
      "calculated": "Schätzung der Antennenlänge berechnet.",
      "checkInputs": "Geben Sie eine gültige positive Frequenz, einen Antennentyp, eine Einheit und einen Verkürzungsfaktor von 0,70 bis 1,00 ein.",
      "copied": "Ergebnisse kopiert.",
      "copyUnavailable": "Das Kopieren ist in diesem Browser nicht verfügbar.",
      "wavelength": "Freiraumwellenlänge",
      "idealLength": "Ideale Länge vor dem Kürzen",
      "adjustedLength": "Geschätzte angepasste Gesamtlänge",
      "elementLength": "Länge jedes Dipolschenkels",
      "imperialAdjusted": "Angepasste Gesamtlänge (Fuß)",
      "factor": "Verkürzungsfaktor",
      "formula": "Formel"
    },
    "additionalFaqs": [
      {
        "question": "Wie lang ist ein Halbwellendipol bei 100 MHz?",
        "answer": "Im freien Raum beträgt die Wellenlänge bei 100 MHz etwa 2,998 m, ein idealer Halbwellendipol ist also insgesamt etwa 1,499 m oder etwa 0,749 m pro Schenkel lang. Eine praktische Antenne benötigt möglicherweise einen Verkürzungsfaktor und sollte auf die installierte Umgebung abgestimmt werden."
      },
      {
        "question": "Wie lang ist eine Viertelwellenantenne?",
        "answer": "Seine ideale Freiraumleiterlänge beträgt ein Viertel der Wellenlänge: Lichtgeschwindigkeit geteilt durch das Vierfache der Frequenz. Die tatsächlich abgestimmte Länge kann je nach Leiter, Einspeisung, Erdung und Umgebung unterschiedlich sein."
      },
      {
        "question": "Was bedeutet der Verkürzungsfaktor?",
        "answer": "Es multipliziert die ideale Länge des Freiraumelements, um eine anfängliche Schätzung für einen praktischen Leiter bereitzustellen. Der Standardwert ist nur eine Faustregel; Es handelt sich nicht um den Geschwindigkeitsfaktor des Koaxialkabels und ersetzt weder Messung noch Abstimmung."
      },
      {
        "question": "Garantiert dieser Rechner eine abgestimmte oder sichere Antenne?",
        "answer": "Nein. Es schätzt die grundlegende Halbwellendipol- oder Viertelwellenmonopolgeometrie. Die tatsächliche Impedanz und Resonanz hängen von der Konstruktion und dem Standort ab. Befolgen Sie die Funkvorschriften und sicheren Installationspraktiken und überprüfen Sie dies mit geeigneten Instrumenten."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "ja": {
    "copyLanguage": "ja",
    "name": "アンテナ長計算機",
    "title": "ダイポール アンテナの長さの無料計算ツール | UsefulVerse",
    "description": "周波数から半波長ダイポールまたは 1/4 波長アンテナの長さを推定します。編集可能な短縮係数を備えたブラウザを無料で無制限に使用できます。",
    "intro": "周波数から自由空間の半波長ダイポールまたは 1/4 波長モノポールを推定します。短縮係数を調整して、実際の開始長と各ダイポールレッグを確認します。",
    "howQuestion": "周波数からダイポールアンテナの長さを計算するにはどうすればよいですか?",
    "howAnswer": "まず、光の速度を周波数で割ったものとして波長を計算します。半波長ダイポールは、2 つの等しい脚を持ち、合計でその波長の約半分です。 1/4 波長モノポールは約 4 分の 1 です。編集可能な短縮係数を使用すると実用的な開始推定値を得ることができますが、最終的な長さはアンテナの設計と環境によって異なります。",
    "privacyQuestion": "私のアンテナ値はアップロードされていますか?",
    "privacyAnswer": "いいえ。計算はこのブラウザで実行されます。入力した値は、このツールによってアップロードまたは保存されません。",
    "fields": {
      "mode": "アンテナの種類",
      "dipole": "半波長ダイポール",
      "monopole": "1/4波長モノポール",
      "frequency": "動作周波数",
      "frequencyUnit": "周波数単位",
      "hz": "ヘルツ (Hz)",
      "khz": "キロヘルツ (kHz)",
      "mhz": "メガヘルツ (MHz)",
      "ghz": "ギガヘルツ (GHz)",
      "shorteningFactor": "短縮係数 (0.70 ～ 1.00)",
      "accuracyNote": "これは、自由空間内の真っ直ぐで薄い導体を推定します。短縮係数は調整可能な開始推定値であり、普遍的な補正ではありません。給電、導体の直径、近くの物体、アース、設置がチューニングに影響します。安全に測定して調整します。これは設計認証や無線安全性評価ではありません。"
    },
    "actions": {
      "calculate": "アンテナの長さを計算する",
      "reset": "リセット",
      "copy": "結果をコピーする",
      "example": "100MHzを試してみる",
      "result": "アンテナ長の推定"
    },
    "messages": {
      "calculated": "アンテナの長さの推定値が計算されました。",
      "checkInputs": "有効な正の周波数、アンテナ タイプ、単位、および 0.70 ～ 1.00 の短縮率を入力します。",
      "copied": "結果がコピーされました。",
      "copyUnavailable": "このブラウザではコピーできません。",
      "wavelength": "自由空間波長",
      "idealLength": "短くする前の理想的な長さ",
      "adjustedLength": "調整後の全長の目安",
      "elementLength": "各ダイポールレッグの長さ",
      "imperialAdjusted": "調整後の全長（フィート）",
      "factor": "短縮係数",
      "formula": "式"
    },
    "additionalFaqs": [
      {
        "question": "100 MHz における半波長ダイポールの長さはどれくらいですか?",
        "answer": "自由空間では、100 MHz の波長は約 2.998 m であるため、理想的な半波長ダイポールは合計で約 1.499 m、つまり脚あたり約 0.749 m になります。実際のアンテナは短縮係数を使用する場合があり、設置環境に合わせて調整する必要があります。"
      },
      {
        "question": "1/4 波長アンテナの長さはどれくらいですか?",
        "answer": "その理想的な自由空間導体の長さは波長の 4 分の 1、つまり光の速度を周波数の 4 倍で割ったものです。実際に調整される長さは、導体、フィード、グランド、および環境によって異なる場合があります。"
      },
      {
        "question": "短縮係数とは何を意味しますか?",
        "answer": "理想的な自由空間要素の長さを乗算して、実際の導体の開始推定値を提供します。デフォルトは単なる経験則です。これは同軸ケーブルの速度係数ではなく、測定や調整に代わるものではありません。"
      },
      {
        "question": "この計算機は、調整されたアンテナまたは安全なアンテナを保証しますか?",
        "answer": "いいえ。基本的な半波長ダイポールまたは 1/4 波長モノポールのジオメトリを推定します。実際のインピーダンスと共振は構造と現場によって異なります。無線規制と安全な設置手順に従い、適切な機器を使用して検証してください。"
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "ko": {
    "copyLanguage": "ko",
    "name": "안테나 길이 계산기",
    "title": "다이폴 안테나 길이 계산기 무료 | UsefulVerse",
    "description": "주파수로부터 반파장 쌍극자 또는 1/4파장 안테나 길이를 추정합니다. 편집 가능한 단축 요소를 통해 브라우저를 무료로 무제한 사용할 수 있습니다.",
    "intro": "주파수로부터 자유 공간 반파장 쌍극자 또는 1/4파장 모노폴을 추정합니다. 실제 시작 길이와 각 쌍극자 다리를 확인하려면 단축 계수를 조정하세요.",
    "howQuestion": "주파수로부터 다이폴 안테나 길이를 어떻게 계산합니까?",
    "howAnswer": "먼저 빛의 속도를 주파수로 나누어 파장을 계산합니다. 반파장 쌍극자는 총 파장의 절반 정도이며 두 개의 동일한 다리가 있습니다. 1/4 파장 모노폴은 약 1/4입니다. 편집 가능한 단축 계수는 실용적인 시작 추정치를 제공할 수 있지만 최종 길이는 안테나 설계 및 주변 환경에 따라 달라집니다.",
    "privacyQuestion": "내 안테나 값이 업로드되나요?",
    "privacyAnswer": "아니요. 계산은 이 브라우저에서 실행됩니다. 입력한 값은 이 도구에 의해 업로드되거나 저장되지 않습니다.",
    "fields": {
      "mode": "안테나 유형",
      "dipole": "반파장 쌍극자",
      "monopole": "1/4 파장 모노폴",
      "frequency": "작동 주파수",
      "frequencyUnit": "주파수 단위",
      "hz": "헤르츠(Hz)",
      "khz": "킬로헤르츠(kHz)",
      "mhz": "메가헤르츠(MHz)",
      "ghz": "기가헤르츠(GHz)",
      "shorteningFactor": "단축 계수(0.70–1.00)",
      "accuracyNote": "이는 자유 공간에서 곧고 얇은 도체를 추정합니다. 단축 계수는 조정 가능한 시작 추정치이며 보편적인 수정이 아닙니다. 피드, 도체 직경, 주변 물체, 접지 및 설치가 튜닝에 영향을 미칩니다. 안전하게 측정하고 조정하세요. 이는 설계 인증이나 무선 안전 평가가 아닙니다."
    },
    "actions": {
      "calculate": "안테나 길이 계산",
      "reset": "다시 놓기",
      "copy": "결과 복사",
      "example": "100MHz를 사용해 보세요",
      "result": "안테나 길이 추정"
    },
    "messages": {
      "calculated": "안테나 길이 추정치가 계산되었습니다.",
      "checkInputs": "유효한 양수 주파수, 안테나 유형, 단위 및 단축 계수(0.70~1.00)를 입력하세요.",
      "copied": "결과가 복사되었습니다.",
      "copyUnavailable": "이 브라우저에서는 복사할 수 없습니다.",
      "wavelength": "자유 공간 파장",
      "idealLength": "단축 전 이상적인 길이",
      "adjustedLength": "예상 조정 총 길이",
      "elementLength": "각 쌍극자 다리의 길이",
      "imperialAdjusted": "조정된 전체 길이(피트)",
      "factor": "단축 요인",
      "formula": "공식"
    },
    "additionalFaqs": [
      {
        "question": "100MHz에서 반파장 쌍극자의 길이는 얼마입니까?",
        "answer": "자유 공간에서 100MHz의 파장은 약 2.998m이므로 이상적인 반파장 쌍극자는 총 약 1.499m, 즉 다리당 약 0.749m입니다. 실제 안테나는 단축 요소를 사용할 수 있으며 설치된 환경에 맞게 조정해야 합니다."
      },
      {
        "question": "1/4 파장 안테나의 길이는 얼마나 됩니까?",
        "answer": "이상적인 자유 공간 도체 길이는 파장의 1/4, 즉 빛의 속도를 주파수의 4배로 나눈 값입니다. 실제 조정된 길이는 도체, 피드, 접지 및 주변 환경에 따라 다를 수 있습니다."
      },
      {
        "question": "단축 요소는 무엇을 의미합니까?",
        "answer": "이상적인 자유 공간 요소 길이를 곱하여 실제 도체에 대한 시작 추정치를 제공합니다. 기본값은 단지 경험적 법칙일 뿐입니다. 이는 동축 케이블 속도 인자가 아니며 측정이나 튜닝을 대체하지 않습니다."
      },
      {
        "question": "이 계산기는 튜닝된 안테나 또는 안전한 안테나를 보장합니까?",
        "answer": "아니요. 기본적인 반파장 쌍극자 또는 1/4파장 모노폴 기하학을 추정합니다. 실제 임피던스와 공진은 건설 및 현장에 따라 다릅니다. 무선 규정 및 안전한 설치 관행을 따르고 적합한 장비를 사용하여 확인하십시오."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "id": {
    "copyLanguage": "id",
    "name": "Kalkulator Panjang Antena",
    "title": "Kalkulator Panjang Antena Dipol Gratis | UsefulVerse",
    "description": "Perkirakan panjang antena dipol setengah gelombang atau seperempat gelombang dari frekuensi. Penggunaan browser gratis dan tidak terbatas dengan faktor...",
    "intro": "Perkirakan dipol setengah gelombang ruang bebas atau monopol seperempat gelombang dari frekuensi. Sesuaikan faktor pemendekan untuk melihat panjang awal praktis dan setiap kaki dipol.",
    "howQuestion": "Bagaimana cara menghitung panjang antena dipol dari frekuensi?",
    "howAnswer": "Pertama hitung panjang gelombang sebagai kecepatan cahaya dibagi frekuensi. Dipol setengah gelombang berukuran sekitar setengah panjang gelombang totalnya, dengan dua kaki yang sama; monopole seperempat gelombang adalah sekitar seperempat. Faktor pemendekan yang dapat diedit dapat memberikan perkiraan awal yang praktis, namun panjang akhirnya bergantung pada desain antena dan lingkungan sekitarnya.",
    "privacyQuestion": "Apakah nilai antena saya diunggah?",
    "privacyAnswer": "Tidak. Perhitungan berjalan di browser ini; nilai yang Anda masukkan tidak diunggah atau disimpan oleh alat ini.",
    "fields": {
      "mode": "Jenis antena",
      "dipole": "Dipol setengah gelombang",
      "monopole": "Monopole seperempat gelombang",
      "frequency": "Frekuensi operasi",
      "frequencyUnit": "Satuan frekuensi",
      "hz": "Hertz (Hz)",
      "khz": "Kilohertz (kHz)",
      "mhz": "Megahertz (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "Faktor pemendekan (0,70–1,00)",
      "accuracyNote": "Ini memperkirakan konduktor lurus dan tipis di ruang bebas. Faktor pemendekan adalah perkiraan awal yang dapat disesuaikan, bukan koreksi universal; umpan, diameter konduktor, benda-benda di sekitar, tanah dan pemasangan mempengaruhi penyetelan. Ukur dan setel dengan aman; ini bukan sertifikasi desain atau penilaian keselamatan radio."
    },
    "actions": {
      "calculate": "Hitung panjang antena",
      "reset": "Mengatur ulang",
      "copy": "Salin hasilnya",
      "example": "Coba 100MHz",
      "result": "Perkiraan panjang antena"
    },
    "messages": {
      "calculated": "Perkiraan panjang antena dihitung.",
      "checkInputs": "Masukkan frekuensi positif yang valid, jenis antena, unit dan faktor pemendekan dari 0,70 hingga 1,00.",
      "copied": "Hasil disalin.",
      "copyUnavailable": "Salinan tidak tersedia di browser ini.",
      "wavelength": "Panjang gelombang ruang bebas",
      "idealLength": "Panjang ideal sebelum diperpendek",
      "adjustedLength": "Perkiraan panjang total yang disesuaikan",
      "elementLength": "Panjang setiap kaki dipol",
      "imperialAdjusted": "Panjang total yang disesuaikan (kaki)",
      "factor": "Faktor pemendekan",
      "formula": "Rumus"
    },
    "additionalFaqs": [
      {
        "question": "Berapa panjang dipol setengah gelombang pada 100 MHz?",
        "answer": "Di ruang bebas, panjang gelombang pada 100 MHz adalah sekitar 2,998 m, sehingga dipol setengah gelombang yang ideal adalah total sekitar 1,499 m, atau sekitar 0,749 m per kaki. Antena praktis mungkin menggunakan faktor pemendekan dan harus disetel pada lingkungan pemasangannya."
      },
      {
        "question": "Berapa panjang antena seperempat gelombang?",
        "answer": "Panjang konduktor ruang bebas idealnya adalah seperempat panjang gelombang: kecepatan cahaya dibagi empat kali frekuensi. Panjang sebenarnya yang disetel dapat berbeda tergantung konduktor, umpan, ground, dan lingkungan sekitar."
      },
      {
        "question": "Apa yang dimaksud dengan faktor pemendekan?",
        "answer": "Ini mengalikan panjang elemen ruang bebas yang ideal untuk memberikan perkiraan awal untuk konduktor praktis. Standarnya hanyalah aturan praktis; ini bukan faktor kecepatan kabel koaksial dan tidak menggantikan pengukuran atau penyetelan."
      },
      {
        "question": "Apakah kalkulator ini menjamin antena disetel atau aman?",
        "answer": "Tidak. Ini memperkirakan geometri dasar dipol setengah gelombang atau monopol seperempat gelombang. Impedansi dan resonansi nyata bergantung pada konstruksi dan lokasi. Ikuti peraturan radio dan praktik pemasangan yang aman, dan verifikasi dengan instrumen yang sesuai."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "hi": {
    "copyLanguage": "hi",
    "name": "एंटीना लंबाई कैलकुलेटर",
    "title": "द्विध्रुवीय ऐन्टेना लंबाई कैलकुलेटर निःशुल्क | UsefulVerse",
    "description": "आवृत्ति से अर्ध-तरंग द्विध्रुव या चौथाई-तरंग एंटीना की लंबाई का अनुमान लगाएं। संपादन योग्य लघुकरण कारक के साथ निःशुल्क, असीमित ब्राउज़र उपयोग।",
    "intro": "आवृत्ति से मुक्त-स्थान अर्ध-तरंग द्विध्रुव या चतुर्थ-तरंग मोनोपोल का अनुमान लगाएं। व्यावहारिक प्रारंभिक लंबाई और प्रत्येक द्विध्रुव पैर को देखने के लिए छोटा करने वाले कारक को समायोजित करें।",
    "howQuestion": "मैं आवृत्ति से द्विध्रुव ऐन्टेना लंबाई की गणना कैसे करूं?",
    "howAnswer": "सबसे पहले प्रकाश की गति को आवृत्ति से विभाजित करके तरंगदैर्घ्य की गणना करें। एक अर्ध-तरंग द्विध्रुव, दो समान पादों के साथ, कुल तरंगदैर्घ्य का लगभग आधा होता है; एक क्वार्टर-वेव मोनोपोल लगभग एक चौथाई है। एक संपादन योग्य छोटा करने वाला कारक एक व्यावहारिक प्रारंभिक अनुमान प्रदान कर सकता है, लेकिन अंतिम लंबाई एंटीना डिजाइन और परिवेश पर निर्भर करती है।",
    "privacyQuestion": "क्या मेरे ऐन्टेना मान अपलोड किए गए हैं?",
    "privacyAnswer": "नहीं, गणना इस ब्राउज़र में चलती है; आपके दर्ज किए गए मान इस टूल द्वारा अपलोड या सहेजे नहीं गए हैं।",
    "fields": {
      "mode": "एंटीना प्रकार",
      "dipole": "अर्ध तरंग द्विध्रुव",
      "monopole": "क्वार्टर-वेव मोनोपोल",
      "frequency": "परिचालन आवृत्ति",
      "frequencyUnit": "आवृत्ति इकाई",
      "hz": "हर्ट्ज़ (हर्ट्ज)",
      "khz": "किलोहर्ट्ज़ (kHz)",
      "mhz": "मेगाहर्ट्ज़ (मेगाहर्ट्ज)",
      "ghz": "गीगाहर्ट्ज़ (GHz)",
      "shorteningFactor": "लघुकरण कारक (0.70–1.00)",
      "accuracyNote": "यह मुक्त स्थान में एक सीधे, पतले कंडक्टर का अनुमान लगाता है। छोटा करने का कारक एक समायोज्य प्रारंभिक अनुमान है, सार्वभौमिक सुधार नहीं; फ़ीड, कंडक्टर व्यास, आस-पास की वस्तुएं, जमीन और स्थापना ट्यूनिंग को प्रभावित करती है। सुरक्षित रूप से मापें और ट्यून करें; यह कोई डिज़ाइन प्रमाणन या रेडियो-सुरक्षा मूल्यांकन नहीं है।"
    },
    "actions": {
      "calculate": "एंटीना की लंबाई की गणना करें",
      "reset": "रीसेट करें",
      "copy": "परिणाम कॉपी करें",
      "example": "100 मेगाहर्ट्ज का प्रयास करें",
      "result": "एंटीना की लंबाई का अनुमान"
    },
    "messages": {
      "calculated": "एंटीना लंबाई अनुमान की गणना की गई।",
      "checkInputs": "0.70 से 1.00 तक वैध सकारात्मक आवृत्ति, एंटीना प्रकार, इकाई और छोटा करने वाला कारक दर्ज करें।",
      "copied": "परिणाम कॉपी किए गए.",
      "copyUnavailable": "इस ब्राउज़र में प्रतिलिपि उपलब्ध नहीं है.",
      "wavelength": "मुक्त-अंतरिक्ष तरंगदैर्घ्य",
      "idealLength": "छोटा करने से पहले आदर्श लंबाई",
      "adjustedLength": "अनुमानित समायोजित कुल लंबाई",
      "elementLength": "प्रत्येक द्विध्रुवीय पैर की लंबाई",
      "imperialAdjusted": "समायोजित कुल लंबाई (फीट)",
      "factor": "लघुकरण कारक",
      "formula": "FORMULA"
    },
    "additionalFaqs": [
      {
        "question": "100 मेगाहर्ट्ज पर अर्ध-तरंग द्विध्रुव की लंबाई क्या है?",
        "answer": "मुक्त स्थान में, 100 मेगाहर्ट्ज पर तरंग दैर्ध्य लगभग 2.998 मीटर है, इसलिए एक आदर्श अर्ध-तरंग द्विध्रुव कुल 1.499 मीटर या लगभग 0.749 मीटर प्रति पैर है। एक व्यावहारिक एंटीना शॉर्टिंग फैक्टर का उपयोग कर सकता है और इसे इसके स्थापित वातावरण में ट्यून किया जाना चाहिए।"
      },
      {
        "question": "क्वार्टर-वेव एंटीना कितने समय का होता है?",
        "answer": "इसकी आदर्श मुक्त-अंतरिक्ष कंडक्टर लंबाई तरंग दैर्ध्य का एक चौथाई है: प्रकाश की गति चार गुना आवृत्ति से विभाजित होती है। वास्तविक ट्यून की गई लंबाई कंडक्टर, फ़ीड, जमीन और परिवेश के आधार पर भिन्न हो सकती है।"
      },
      {
        "question": "लघुकरण कारक का क्या अर्थ है?",
        "answer": "यह एक व्यावहारिक कंडक्टर के लिए प्रारंभिक अनुमान प्रदान करने के लिए आदर्श मुक्त-स्थान तत्व की लंबाई को गुणा करता है। डिफ़ॉल्ट केवल अंगूठे का नियम है; यह समाक्षीय केबल वेग कारक नहीं है और माप या ट्यूनिंग को प्रतिस्थापित नहीं करता है।"
      },
      {
        "question": "क्या यह कैलकुलेटर ट्यून्ड या सुरक्षित एंटीना की गारंटी देता है?",
        "answer": "नहीं, यह बुनियादी अर्ध-तरंग द्विध्रुव या चौथाई-तरंग मोनोपोल ज्यामिति का अनुमान लगाता है। वास्तविक प्रतिबाधा और प्रतिध्वनि निर्माण और साइट पर निर्भर करती है। रेडियो नियमों और सुरक्षित स्थापना प्रथाओं का पालन करें, और उपयुक्त उपकरणों से सत्यापित करें।"
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "ar": {
    "copyLanguage": "ar",
    "name": "حاسبة طول الهوائي",
    "title": "حاسبة طول هوائي ثنائي القطب مجانًا | UsefulVerse",
    "description": "قدّر طول هوائي نصف موجة أو ربع موجة من التردد. استخدام مجاني محلي مع معامل تقصير قابل للتعديل.",
    "intro": "قدّر طول هوائي ثنائي القطب نصف الموجة أو أحادي القطب ربع الموجة في الفضاء الحر. عدّل معامل التقصير لعرض طول ابتدائي عملي وطول كل ذراع.",
    "howQuestion": "كيف أحسب طول هوائي ثنائي القطب من التردد؟",
    "howAnswer": "احسب الطول الموجي بقسمة سرعة الضوء على التردد. يبلغ طول ثنائي القطب نصف الموجة نحو نصف الطول الموجي، مقسومًا إلى ذراعين متساويين؛ ويبلغ طول أحادي القطب ربع الموجة نحو ربعه. يمكن لمعامل تقصير قابل للتعديل إعطاء تقدير أولي، لكن الطول النهائي يعتمد على تصميم الهوائي ومحيطه.",
    "privacyQuestion": "هل تُرفع قيم الهوائي؟",
    "privacyAnswer": "لا. يجري الحساب في هذا المتصفح ولا تُرفع القيم أو تُحفظ بواسطة الأداة.",
    "fields": {
      "mode": "نوع الهوائي",
      "dipole": "ثنائي القطب نصف الموجة",
      "monopole": "أحادي القطب ربع الموجة",
      "frequency": "تردد التشغيل",
      "frequencyUnit": "وحدة التردد",
      "hz": "هرتز (Hz)",
      "khz": "كيلوهرتز (kHz)",
      "mhz": "ميغاهرتز (MHz)",
      "ghz": "غيغاهرتز (GHz)",
      "shorteningFactor": "معامل التقصير (0.70–1.00)",
      "accuracyNote": "هذا تقدير لموصل مستقيم ورفيع في الفضاء الحر. معامل التقصير نقطة بداية قابلة للتعديل وليس تصحيحًا عامًا؛ فالتغذية وقطر الموصل والأجسام القريبة والأرض والتركيب تؤثر في الضبط. قِس واضبط بأمان. هذه ليست شهادة تصميم أو تقييمًا لسلامة الترددات اللاسلكية."
    },
    "actions": {
      "calculate": "احسب طول الهوائي",
      "reset": "إعادة ضبط",
      "copy": "نسخ النتائج",
      "example": "جرّب 100 MHz",
      "result": "تقدير طول الهوائي"
    },
    "messages": {
      "calculated": "حُسب تقدير طول الهوائي.",
      "checkInputs": "أدخل ترددًا موجبًا صالحًا ونوع الهوائي والوحدة ومعامل تقصير بين 0.70 و1.00.",
      "copied": "تم نسخ النتائج.",
      "copyUnavailable": "النسخ غير متاح في هذا المتصفح.",
      "wavelength": "الطول الموجي في الفضاء الحر",
      "idealLength": "الطول المثالي قبل التقصير",
      "adjustedLength": "الطول الإجمالي التقديري بعد التقصير",
      "elementLength": "طول كل ذراع من الهوائي",
      "imperialAdjusted": "الطول المعدل (قدم)",
      "factor": "معامل التقصير",
      "formula": "المعادلة",
      "exampleLoaded": "تم تحميل مثال 100 MHz."
    },
    "additionalFaqs": [
      {
        "question": "ما طول هوائي ثنائي القطب نصف الموجة عند 100 MHz؟",
        "answer": "في الفضاء الحر، يبلغ الطول الموجي عند 100 MHz نحو 2.998 m، ولذلك يبلغ طول الهوائي المثالي نحو 1.499 m إجمالًا، أو 0.749 m لكل ذراع. قد يستخدم الهوائي العملي معامل تقصير ويجب ضبطه في موقع تركيبه."
      },
      {
        "question": "ما طول هوائي ربع الموجة؟",
        "answer": "طوله المثالي في الفضاء الحر يساوي ربع الطول الموجي: سرعة الضوء مقسومة على أربعة أضعاف التردد. قد يختلف الطول المضبوط فعليًا بسبب الموصل والتغذية والأرض والمحيط."
      },
      {
        "question": "ماذا يعني معامل التقصير؟",
        "answer": "يضرب طول العنصر المثالي في الفضاء الحر ليعطي تقديرًا أوليًا لموصل عملي. القيمة الافتراضية تقريبية وليست معامل سرعة كابل المحور، ولا تغني عن القياس والضبط."
      },
      {
        "question": "هل تضمن الحاسبة ضبط الهوائي أو سلامته؟",
        "answer": "لا. إنها تقدّر هندسة أساسية لثنائي القطب نصف الموجة أو أحادي القطب ربع الموجة. تعتمد الممانعة والرنين الفعليان على التصنيع والموقع. اتبع اللوائح وممارسات التركيب الآمن وتحقق بأجهزة مناسبة."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "zh": {
    "copyLanguage": "zh",
    "name": "天线长度计算器",
    "title": "偶极子天线长度计算器免费 | UsefulVerse",
    "description": "根据频率估计半波偶极子或四分之一波天线长度。免费、无限制的浏览器使用以及可编辑的缩短因子。",
    "intro": "根据频率估计自由空间半波偶极子或四分之一波单极子。调整缩短系数以查看实际的起始长度和每个偶极子腿。",
    "howQuestion": "如何根据频率计算偶极天线长度？",
    "howAnswer": "首先将波长计算为光速除以频率。半波偶极子大约是总波长的一半，有两条相等的腿；四分之一波单极子大约是四分之一。可编辑的缩短因子可以提供实际的起始估计，但最终长度取决于天线设计和周围环境。",
    "privacyQuestion": "我的天线值是否已上传？",
    "privacyAnswer": "不。计算在此浏览器中运行；此工具不会上传或保存您输入的值。",
    "fields": {
      "mode": "天线类型",
      "dipole": "半波偶极子",
      "monopole": "四分之一波单极子",
      "frequency": "工作频率",
      "frequencyUnit": "频率单位",
      "hz": "赫兹 (Hz)",
      "khz": "千赫兹 (kHz)",
      "mhz": "兆赫 (MHz)",
      "ghz": "千兆赫 (GHz)",
      "shorteningFactor": "缩短系数 (0.70–1.00)",
      "accuracyNote": "这估计了自由空间中的直细导体。缩短因子是可调整的起始估计，而不是通用修正；馈电、导体直径、附近物体、接地和安装都会影响调谐。安全测量和调谐；这不是设计认证或无线电安全评估。"
    },
    "actions": {
      "calculate": "计算天线长度",
      "reset": "重置",
      "copy": "复制结果",
      "example": "尝试 100 MHz",
      "result": "天线长度估计"
    },
    "messages": {
      "calculated": "计算天线长度估计值。",
      "checkInputs": "输入有效的正频率、天线类型、单位和缩短系数（0.70 到 1.00）。",
      "copied": "结果已复制。",
      "copyUnavailable": "复制在此浏览器中不可用。",
      "wavelength": "自由空间波长",
      "idealLength": "缩短前的理想长度",
      "adjustedLength": "预计调整总长度",
      "elementLength": "每个偶极子腿的长度",
      "imperialAdjusted": "调整后总长度（英尺）",
      "factor": "缩短系数",
      "formula": "公式"
    },
    "additionalFaqs": [
      {
        "question": "100 MHz 时半波偶极子的长度是多少？",
        "answer": "在自由空间中，100 MHz 下的波长约为 2.998 m，因此理想的半波偶极子总长度约为 1.499 m，或每条腿约为 0.749 m。实际的天线可能会使用缩短因子，并且应该在其安装环境中进行调谐。"
      },
      {
        "question": "四分之一波长天线有多长？",
        "answer": "其理想的自由空间导体长度是波长的四分之一：光速除以四倍频率。实际调谐长度可能因导体、馈电、接地和周围环境而异。"
      },
      {
        "question": "缩短因子是什么意思？",
        "answer": "它将理想的自由空间元件长度相乘，以提供实际导体的起始估计。默认值只是一个经验法则；它不是同轴电缆速度因子，并且不能取代测量或调谐。"
      },
      {
        "question": "该计算器能否保证天线调谐或安全？",
        "answer": "不会。它估计基本的半波偶极子或四分之一波单极子几何形状。实际阻抗和谐振取决于结构和地点。遵循无线电法规和安全安装实践，并使用合适的仪器进行验证。"
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "bn": {
    "copyLanguage": "bn",
    "name": "অ্যান্টেনার দৈর্ঘ্য ক্যালকুলেটর",
    "title": "ডাইপোল অ্যান্টেনা দৈর্ঘ্য ক্যালকুলেটর | UsefulVerse",
    "description": "ফ্রিকোয়েন্সি থেকে হাফ-ওয়েভ ডাইপোল বা কোয়ার্টার-ওয়েভ অ্যান্টেনার দৈর্ঘ্য অনুমান করুন। একটি সম্পাদনাযোগ্য সংক্ষিপ্তকরণ ফ্যাক্টর সহ বিনামূল্যে, সীমাহীন...",
    "intro": "ফ্রিকোয়েন্সি থেকে একটি মুক্ত-স্থান হাফ-ওয়েভ ডাইপোল বা কোয়ার্টার-ওয়েভ মনোপোল অনুমান করুন। একটি ব্যবহারিক প্রারম্ভিক দৈর্ঘ্য এবং প্রতিটি ডাইপোল পা দেখতে ছোট করার ফ্যাক্টরটি সামঞ্জস্য করুন।",
    "howQuestion": "আমি কিভাবে ফ্রিকোয়েন্সি থেকে ডাইপোল অ্যান্টেনার দৈর্ঘ্য গণনা করব?",
    "howAnswer": "প্রথমে আলোর গতিকে ফ্রিকোয়েন্সি দ্বারা ভাগ করে তরঙ্গদৈর্ঘ্য গণনা করুন। একটি অর্ধ-তরঙ্গ ডাইপোল দুটি সমান পা সহ মোট তরঙ্গদৈর্ঘ্যের প্রায় অর্ধেক; এক চতুর্থাংশ-তরঙ্গ মনোপোল প্রায় এক চতুর্থাংশ। একটি সম্পাদনাযোগ্য সংক্ষিপ্তকরণ ফ্যাক্টর একটি ব্যবহারিক প্রারম্ভিক অনুমান প্রদান করতে পারে, তবে চূড়ান্ত দৈর্ঘ্য অ্যান্টেনার নকশা এবং পারিপার্শ্বিকতার উপর নির্ভর করে।",
    "privacyQuestion": "আমার অ্যান্টেনা মান আপলোড করা হয়?",
    "privacyAnswer": "না। গণনা এই ব্রাউজারে চলে; আপনার প্রবেশ করা মান এই টুল দ্বারা আপলোড বা সংরক্ষণ করা হয় না.",
    "fields": {
      "mode": "অ্যান্টেনার ধরন",
      "dipole": "অর্ধ-তরঙ্গ ডাইপোল",
      "monopole": "কোয়ার্টার-ওয়েভ মনোপোল",
      "frequency": "অপারেটিং ফ্রিকোয়েন্সি",
      "frequencyUnit": "ফ্রিকোয়েন্সি ইউনিট",
      "hz": "হার্টজ (Hz)",
      "khz": "কিলোহার্টজ (kHz)",
      "mhz": "মেগাহার্টজ (MHz)",
      "ghz": "গিগাহার্টজ (GHz)",
      "shorteningFactor": "সংক্ষিপ্তকরণ ফ্যাক্টর (0.70-1.00)",
      "accuracyNote": "এটি খালি জায়গায় একটি সোজা, পাতলা কন্ডাকটর অনুমান করে। সংক্ষিপ্তকরণ ফ্যাক্টর একটি সামঞ্জস্যযোগ্য প্রারম্ভিক অনুমান, একটি সর্বজনীন সংশোধন নয়; ফিড, কন্ডাকটর ব্যাস, কাছাকাছি বস্তু, স্থল এবং ইনস্টলেশন টিউনিং প্রভাবিত করে। নিরাপদে পরিমাপ করুন এবং সুর করুন; এটি একটি ডিজাইন সার্টিফিকেশন বা রেডিও-নিরাপত্তা মূল্যায়ন নয়।"
    },
    "actions": {
      "calculate": "অ্যান্টেনার দৈর্ঘ্য গণনা করুন",
      "reset": "রিসেট করুন",
      "copy": "ফলাফল কপি করুন",
      "example": "100 MHz চেষ্টা করুন",
      "result": "অ্যান্টেনার দৈর্ঘ্য অনুমান"
    },
    "messages": {
      "calculated": "অ্যান্টেনার দৈর্ঘ্য অনুমান গণনা করা হয়েছে।",
      "checkInputs": "0.70 থেকে 1.00 পর্যন্ত একটি বৈধ ইতিবাচক ফ্রিকোয়েন্সি, অ্যান্টেনার ধরন, ইউনিট এবং সংক্ষিপ্তকরণ ফ্যাক্টর লিখুন।",
      "copied": "ফলাফল কপি করা হয়েছে.",
      "copyUnavailable": "এই ব্রাউজারে অনুলিপি পাওয়া যায় না।",
      "wavelength": "মুক্ত স্থান তরঙ্গদৈর্ঘ্য",
      "idealLength": "ছোট করার আগে আদর্শ দৈর্ঘ্য",
      "adjustedLength": "আনুমানিক সামঞ্জস্য মোট দৈর্ঘ্য",
      "elementLength": "প্রতিটি ডাইপোল পায়ের দৈর্ঘ্য",
      "imperialAdjusted": "সামঞ্জস্যপূর্ণ মোট দৈর্ঘ্য (ফুট)",
      "factor": "সংক্ষিপ্তকরণ ফ্যাক্টর",
      "formula": "সূত্র"
    },
    "additionalFaqs": [
      {
        "question": "100 MHz এ একটি অর্ধ-তরঙ্গ ডাইপোলের দৈর্ঘ্য কত?",
        "answer": "মুক্ত স্থানে, 100 মেগাহার্টজে তরঙ্গদৈর্ঘ্য প্রায় 2.998 মিটার, তাই একটি আদর্শ অর্ধ-তরঙ্গ ডাইপোল প্রায় 1.499 মিটার মোট, বা প্রতি পায়ে প্রায় 0.749 মিটার। একটি ব্যবহারিক অ্যান্টেনা একটি সংক্ষিপ্তকরণ ফ্যাক্টর ব্যবহার করতে পারে এবং এটির ইনস্টল করা পরিবেশে টিউন করা উচিত।"
      },
      {
        "question": "একটি কোয়ার্টার-ওয়েভ অ্যান্টেনার সময় কত?",
        "answer": "এর আদর্শ মুক্ত-স্থান পরিবাহী দৈর্ঘ্য তরঙ্গদৈর্ঘ্যের এক চতুর্থাংশ: আলোর গতি চার গুণ ফ্রিকোয়েন্সি দ্বারা বিভক্ত। প্রকৃত টিউন করা দৈর্ঘ্য কন্ডাক্টর, ফিড, গ্রাউন্ড এবং পারিপার্শ্বিকতার সাথে ভিন্ন হতে পারে।"
      },
      {
        "question": "সংক্ষিপ্তকরণ ফ্যাক্টর মানে কি?",
        "answer": "এটি একটি ব্যবহারিক কন্ডাকটরের জন্য একটি প্রারম্ভিক অনুমান প্রদান করতে আদর্শ মুক্ত-স্থান উপাদানের দৈর্ঘ্যকে গুণ করে। ডিফল্ট শুধুমাত্র থাম্ব একটি নিয়ম; এটি সমাক্ষ তারের বেগ ফ্যাক্টর নয় এবং পরিমাপ বা টিউনিং প্রতিস্থাপন করে না।"
      },
      {
        "question": "এই ক্যালকুলেটরটি কি সুরক্ষিত বা নিরাপদ অ্যান্টেনার গ্যারান্টি দেয়?",
        "answer": "না। এটি প্রাথমিক হাফ-ওয়েভ ডাইপোল বা কোয়ার্টার-ওয়েভ মনোপোল জ্যামিতি অনুমান করে। বাস্তব প্রতিবন্ধকতা এবং অনুরণন নির্মাণ এবং সাইটের উপর নির্ভর করে। রেডিও প্রবিধান এবং নিরাপদ ইনস্টলেশন অনুশীলন অনুসরণ করুন, এবং উপযুক্ত যন্ত্র দিয়ে যাচাই করুন।"
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "ru": {
    "copyLanguage": "ru",
    "name": "Калькулятор длины антенны",
    "title": "Калькулятор длины дипольной антенны бесплатно | UsefulVerse",
    "description": "Оцените длину полуволнового диполя или четвертьволновой антенны по частоте. Бесплатное, неограниченное использование браузера с редактируемым коэффициентом...",
    "intro": "Оцените полуволновой диполь или четвертьволновой монополь в свободном пространстве по частоте. Отрегулируйте коэффициент укорочения, чтобы увидеть практическую начальную длину и каждую ветвь диполя.",
    "howQuestion": "Как рассчитать длину дипольной антенны по частоте?",
    "howAnswer": "Сначала рассчитайте длину волны как скорость света, деленную на частоту. Полуволновой диполь имеет общую длину примерно вдвое меньшую, с двумя равными ветвями; четвертьволновой монополь составляет около одной четверти. Редактируемый коэффициент сокращения может дать практическую начальную оценку, но окончательная длина зависит от конструкции антенны и условий окружающей среды.",
    "privacyQuestion": "Загружены ли значения моей антенны?",
    "privacyAnswer": "Нет. Расчеты выполняются в этом браузере; введенные вами значения не загружаются и не сохраняются этим инструментом.",
    "fields": {
      "mode": "Тип антенны",
      "dipole": "Полуволновой диполь",
      "monopole": "Четвертьволновой монополь",
      "frequency": "Рабочая частота",
      "frequencyUnit": "Единица частоты",
      "hz": "Герц (Гц)",
      "khz": "Килогерц (кГц)",
      "mhz": "Мегагерц (МГц)",
      "ghz": "Гигагерц (ГГц)",
      "shorteningFactor": "Коэффициент сокращения (0,70–1,00)",
      "accuracyNote": "Это оценивает прямой тонкий проводник в свободном пространстве. Коэффициент сокращения — это регулируемая начальная оценка, а не универсальная поправка; на настройку влияют питание, диаметр проводника, близлежащие объекты, заземление и монтаж. Измеряйте и настраивайте безопасно; это не сертификация конструкции или оценка радиобезопасности."
    },
    "actions": {
      "calculate": "Рассчитать длину антенны",
      "reset": "Перезагрузить",
      "copy": "Копировать результаты",
      "example": "Попробуйте 100 МГц",
      "result": "Оценка длины антенны"
    },
    "messages": {
      "calculated": "Рассчитана оценка длины антенны.",
      "checkInputs": "Введите допустимую положительную частоту, тип антенны, единицу измерения и коэффициент сокращения от 0,70 до 1,00.",
      "copied": "Результаты скопированы.",
      "copyUnavailable": "Копирование недоступно в этом браузере.",
      "wavelength": "Длина волны в свободном пространстве",
      "idealLength": "Идеальная длина до укорачивания",
      "adjustedLength": "Расчетная скорректированная общая длина",
      "elementLength": "Длина каждой ветви диполя",
      "imperialAdjusted": "Скорректированная общая длина (футы)",
      "factor": "Коэффициент сокращения",
      "formula": "Формула"
    },
    "additionalFaqs": [
      {
        "question": "Какова длина полуволнового диполя на частоте 100 МГц?",
        "answer": "В свободном пространстве длина волны на частоте 100 МГц составляет около 2,998 м, поэтому длина идеального полуволнового диполя составляет около 1,499 м, или около 0,749 м на ветвь. В практичной антенне может использоваться коэффициент сокращения, и ее следует настраивать в соответствии с установленной средой."
      },
      {
        "question": "Какова длина четвертьволновой антенны?",
        "answer": "Его идеальная длина проводника в свободном пространстве составляет четверть длины волны: скорость света, разделенная на частоту, умноженную на четыре. Фактическая настроенная длина может отличаться в зависимости от проводника, источника питания, заземления и окружения."
      },
      {
        "question": "Что означает коэффициент сокращения?",
        "answer": "Он умножает идеальную длину элемента свободного пространства, чтобы получить начальную оценку практического проводника. По умолчанию это всего лишь эмпирическое правило; это не коэффициент скорости коаксиального кабеля и он не заменяет измерения или настройки."
      },
      {
        "question": "Гарантирует ли этот калькулятор настроенную или безопасную антенну?",
        "answer": "Нет. Он оценивает базовую геометрию полуволнового диполя или четвертьволнового монополя. Реальный импеданс и резонанс зависят от конструкции и места установки. Соблюдайте правила радиосвязи и правила безопасной установки и проверяйте с помощью подходящих инструментов."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "ur": {
    "copyLanguage": "ur",
    "name": "اینٹینا کی لمبائی کیلکولیٹر",
    "title": "ڈوپول اینٹینا کی لمبائی کیلکولیٹر مفت | UsefulVerse",
    "description": "فریکوئنسی سے ہاف ویو ڈوپول یا کوارٹر ویو اینٹینا کی لمبائی کا اندازہ لگائیں۔ قابل تدوین قصر کرنے والے عنصر کے ساتھ مفت، لامحدود براؤزر کا استعمال۔",
    "intro": "فری اسپیس ہاف ویو ڈوپول یا کوارٹر ویو مونوپول فریکوئنسی سے اندازہ لگائیں۔ عملی آغاز کی لمبائی اور ہر ڈوپول ٹانگ کو دیکھنے کے لیے مختصر کرنے والے عنصر کو ایڈجسٹ کریں۔",
    "howQuestion": "میں فریکوئنسی سے ڈوپول اینٹینا کی لمبائی کا حساب کیسے لگا سکتا ہوں؟",
    "howAnswer": "پہلے طول موج کا حساب لگائیں جیسے روشنی کی رفتار کو تعدد سے تقسیم کیا جائے۔ ایک آدھی لہر والا ڈوپول دو برابر ٹانگوں کے ساتھ کل طول موج سے تقریباً نصف ہوتا ہے۔ ایک چوتھائی لہر کا مونوپول تقریبا ایک چوتھائی ہے۔ ایک قابل تدوین قصر کرنے والا عنصر ایک عملی ابتدائی تخمینہ فراہم کر سکتا ہے، لیکن حتمی لمبائی کا انحصار اینٹینا کے ڈیزائن اور ماحول پر ہوتا ہے۔",
    "privacyQuestion": "کیا میری اینٹینا کی قدریں اپ لوڈ کی گئی ہیں؟",
    "privacyAnswer": "نمبر۔ حساب اس براؤزر میں چلتا ہے۔ آپ کی درج کردہ اقدار اس ٹول کے ذریعے اپ لوڈ یا محفوظ نہیں کی جاتی ہیں۔",
    "fields": {
      "mode": "اینٹینا کی قسم",
      "dipole": "آدھی لہر والا ڈوپول",
      "monopole": "کوارٹر ویو مونوپول",
      "frequency": "آپریٹنگ فریکوئنسی",
      "frequencyUnit": "تعدد یونٹ",
      "hz": "ہرٹز (Hz)",
      "khz": "کلو ہرٹز (kHz)",
      "mhz": "Megahertz (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "شارٹننگ فیکٹر (0.70–1.00)",
      "accuracyNote": "یہ خالی جگہ میں ایک سیدھے، پتلے موصل کا اندازہ لگاتا ہے۔ قصر کرنے والا عنصر ایک سایڈست ابتدائی تخمینہ ہے، نہ کہ عالمگیر اصلاح؛ فیڈ، کنڈکٹر قطر، قریبی اشیاء، زمین اور تنصیب ٹیوننگ کو متاثر کرتی ہے۔ محفوظ طریقے سے پیمائش اور ٹیون؛ یہ ڈیزائن سرٹیفیکیشن یا ریڈیو سیفٹی اسسمنٹ نہیں ہے۔"
    },
    "actions": {
      "calculate": "اینٹینا کی لمبائی کا حساب لگائیں۔",
      "reset": "دوبارہ ترتیب دیں۔",
      "copy": "نتائج کاپی کریں۔",
      "example": "100 میگاہرٹز آزمائیں۔",
      "result": "اینٹینا کی لمبائی کا تخمینہ"
    },
    "messages": {
      "calculated": "اینٹینا کی لمبائی کا تخمینہ لگایا گیا۔",
      "checkInputs": "ایک درست مثبت تعدد، اینٹینا کی قسم، یونٹ اور 0.70 سے 1.00 تک مختصر کرنے کا عنصر درج کریں۔",
      "copied": "نتائج کاپی ہو گئے۔",
      "copyUnavailable": "اس براؤزر میں کاپی دستیاب نہیں ہے۔",
      "wavelength": "خالی جگہ کی طول موج",
      "idealLength": "مختصر کرنے سے پہلے مثالی لمبائی",
      "adjustedLength": "تخمینی ایڈجسٹ شدہ کل لمبائی",
      "elementLength": "ہر ڈوپول ٹانگ کی لمبائی",
      "imperialAdjusted": "ایڈجسٹ شدہ کل لمبائی (فٹ)",
      "factor": "قصر کرنے والا عنصر",
      "formula": "فارمولا"
    },
    "additionalFaqs": [
      {
        "question": "100 میگاہرٹز پر نصف لہر والے ڈوپول کی لمبائی کتنی ہے؟",
        "answer": "خالی جگہ میں، 100 میگاہرٹز پر طول موج تقریباً 2.998 میٹر ہے، اس لیے ایک مثالی نصف لہر کا ڈوپول تقریباً 1.499 میٹر، یا تقریباً 0.749 میٹر فی ٹانگ ہے۔ ایک عملی اینٹینا مختصر کرنے کا عنصر استعمال کر سکتا ہے اور اسے اس کے نصب شدہ ماحول میں ٹیون کیا جانا چاہیے۔"
      },
      {
        "question": "کوارٹر ویو اینٹینا کتنا لمبا ہے؟",
        "answer": "اس کی مثالی خالی جگہ کے موصل کی لمبائی طول موج کا ایک چوتھائی ہے: روشنی کی رفتار کو چار گنا تعدد سے تقسیم کیا جاتا ہے۔ اصل ٹیون کی لمبائی کنڈکٹر، فیڈ، زمین اور گردونواح کے ساتھ مختلف ہو سکتی ہے۔"
      },
      {
        "question": "قصر کرنے والے عنصر کا کیا مطلب ہے؟",
        "answer": "یہ ایک عملی موصل کے لیے ابتدائی تخمینہ فراہم کرنے کے لیے مثالی خالی جگہ کے عنصر کی لمبائی کو ضرب دیتا ہے۔ پہلے سے طے شدہ صرف انگوٹھے کا اصول ہے؛ یہ سماکشی کیبل کی رفتار کا عنصر نہیں ہے اور پیمائش یا ٹیوننگ کی جگہ نہیں لیتا ہے۔"
      },
      {
        "question": "کیا یہ کیلکولیٹر ٹیونڈ یا محفوظ اینٹینا کی ضمانت دیتا ہے؟",
        "answer": "نہیں، یہ بنیادی نصف لہر ڈوپول یا کوارٹر ویو مونوپول جیومیٹری کا تخمینہ لگاتا ہے۔ حقیقی رکاوٹ اور گونج تعمیر اور سائٹ پر منحصر ہے۔ ریڈیو کے ضوابط اور تنصیب کے محفوظ طریقوں پر عمل کریں، اور مناسب آلات سے تصدیق کریں۔"
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "tr": {
    "copyLanguage": "tr",
    "name": "Anten Uzunluğu Hesaplayıcı",
    "title": "Dipol Anten Uzunluğu Hesaplayıcı Ücretsiz | UsefulVerse",
    "description": "Frekanstan yarım dalga dipol veya çeyrek dalga anten uzunluğunu tahmin edin. Düzenlenebilir kısaltma faktörüyle ücretsiz, sınırsız tarayıcı kullanımı.",
    "intro": "Frekanstan boş uzaydaki yarım dalga dipolü veya çeyrek dalga monopolünü tahmin edin. Pratik bir başlangıç ​​uzunluğunu ve her bir dipol ayağını görmek için kısaltma faktörünü ayarlayın.",
    "howQuestion": "Dipol anten uzunluğunu frekanstan nasıl hesaplarım?",
    "howAnswer": "İlk önce dalga boyunu ışık hızının frekansa bölünmesiyle hesaplayın. Yarım dalga dipolü, iki eşit bacakla toplamda bu dalga boyunun yaklaşık yarısı kadardır; çeyrek dalga tekeli yaklaşık dörtte biridir. Düzenlenebilir bir kısaltma faktörü pratik bir başlangıç ​​tahmini sağlayabilir ancak nihai uzunluk anten tasarımına ve çevreye bağlıdır.",
    "privacyQuestion": "Anten değerlerim yüklendi mi?",
    "privacyAnswer": "Hayır. Hesaplama bu tarayıcıda çalışır; Girdiğiniz değerler bu araç tarafından yüklenmez veya kaydedilmez.",
    "fields": {
      "mode": "Anten türü",
      "dipole": "Yarım dalga dipol",
      "monopole": "Çeyrek dalga monopol",
      "frequency": "Çalışma frekansı",
      "frequencyUnit": "Frekans birimi",
      "hz": "Hertz (Hz)",
      "khz": "Kilohertz (kHz)",
      "mhz": "Megahertz (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "Kısalma faktörü (0,70–1,00)",
      "accuracyNote": "Bu, boş alanda düz, ince bir iletken olduğunu tahmin eder. Kısalma faktörü evrensel bir düzeltme değil, ayarlanabilir bir başlangıç ​​tahminidir; besleme, iletken çapı, yakındaki nesneler, topraklama ve kurulum ayarı etkiler. Güvenli bir şekilde ölçün ve ayarlayın; bu bir tasarım sertifikası veya radyo güvenliği değerlendirmesi değildir."
    },
    "actions": {
      "calculate": "Anten uzunluğunu hesaplayın",
      "reset": "Sıfırla",
      "copy": "Sonuçları kopyala",
      "example": "100 MHz'i deneyin",
      "result": "Anten uzunluğu tahmini"
    },
    "messages": {
      "calculated": "Anten uzunluğu tahmini hesaplandı.",
      "checkInputs": "0,70 ile 1,00 arasında geçerli bir pozitif frekans, anten tipi, birim ve kısaltma faktörü girin.",
      "copied": "Sonuçlar kopyalandı.",
      "copyUnavailable": "Kopyalama bu tarayıcıda mevcut değil.",
      "wavelength": "Boş uzay dalga boyu",
      "idealLength": "Kısaltmadan önce ideal uzunluk",
      "adjustedLength": "Tahmini düzeltilmiş toplam uzunluk",
      "elementLength": "Her dipol bacağın uzunluğu",
      "imperialAdjusted": "Düzeltilmiş toplam uzunluk (fit)",
      "factor": "Kısalma faktörü",
      "formula": "Formül"
    },
    "additionalFaqs": [
      {
        "question": "100 MHz'de yarım dalga dipolünün uzunluğu nedir?",
        "answer": "Boş uzayda, 100 MHz'deki dalga boyu yaklaşık 2,998 m'dir, dolayısıyla ideal bir yarım dalga dipolü toplamda yaklaşık 1,499 m veya bacak başına yaklaşık 0,749 m'dir. Pratik bir anten, bir kısaltma faktörü kullanabilir ve kurulduğu ortamda ayarlanmalıdır."
      },
      {
        "question": "Çeyrek dalga anteninin uzunluğu ne kadardır?",
        "answer": "İdeal boş alan iletken uzunluğu dalga boyunun dörtte biridir: ışık hızının frekansın dört katına bölümü. Ayarlanan gerçek uzunluk iletkene, beslemeye, toprağa ve çevreye göre farklılık gösterebilir."
      },
      {
        "question": "Kısalma faktörü ne anlama geliyor?",
        "answer": "Pratik bir iletken için başlangıç ​​tahmini sağlamak amacıyla ideal boş alan elemanı uzunluğunu çarpar. Varsayılan yalnızca genel bir kuraldır; koaksiyel kablo hız faktörü değildir ve ölçümün veya ayarlamanın yerini almaz."
      },
      {
        "question": "Bu hesap makinesi ayarlanmış veya güvenli bir anteni garanti ediyor mu?",
        "answer": "Hayır. Temel yarım dalga dipol veya çeyrek dalga monopol geometrisini tahmin eder. Gerçek empedans ve rezonans inşaata ve sahaya bağlıdır. Radyo yönetmeliklerine ve güvenli kurulum uygulamalarına uyun ve uygun cihazlarla doğrulayın."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "vi": {
    "copyLanguage": "vi",
    "name": "Máy tính chiều dài ăng-ten",
    "title": "Máy tính chiều dài ăng-ten lưỡng cực miễn phí | UsefulVerse",
    "description": "Ước tính độ dài ăng-ten lưỡng cực nửa sóng hoặc một phần tư sóng từ tần số. Sử dụng trình duyệt miễn phí, không giới hạn với hệ số rút ngắn có thể chỉnh sửa.",
    "intro": "Ước tính một lưỡng cực nửa sóng hoặc đơn cực một phần tư sóng trong không gian tự do từ tần số. Điều chỉnh hệ số rút ngắn để xem chiều dài bắt đầu thực tế và từng chân lưỡng cực.",
    "howQuestion": "Làm cách nào để tính chiều dài ăng-ten lưỡng cực từ tần số?",
    "howAnswer": "Đầu tiên tính bước sóng bằng tốc độ ánh sáng chia cho tần số. Một lưỡng cực nửa sóng có tổng cộng khoảng một nửa bước sóng đó, với hai chân bằng nhau; một đơn cực một phần tư sóng là khoảng một phần tư. Hệ số rút ngắn có thể chỉnh sửa có thể cung cấp ước tính ban đầu thực tế, nhưng độ dài cuối cùng phụ thuộc vào thiết kế ăng-ten và môi trường xung quanh.",
    "privacyQuestion": "Giá trị ăng-ten của tôi có được tải lên không?",
    "privacyAnswer": "Không. Phép tính chạy trong trình duyệt này; các giá trị đã nhập của bạn không được tải lên hoặc lưu bởi công cụ này.",
    "fields": {
      "mode": "Loại ăng-ten",
      "dipole": "Lưỡng cực nửa sóng",
      "monopole": "Đơn cực sóng một phần tư",
      "frequency": "Tần số hoạt động",
      "frequencyUnit": "Đơn vị tần số",
      "hz": "Hertz (Hz)",
      "khz": "Kilohertz (kHz)",
      "mhz": "Megahertz (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "Hệ số rút ngắn (0,70–1,00)",
      "accuracyNote": "Điều này ước tính một dây dẫn thẳng, mỏng trong không gian trống. Hệ số rút ngắn là ước tính ban đầu có thể điều chỉnh được, không phải là sự điều chỉnh chung; nguồn cấp dữ liệu, đường kính dây dẫn, các vật thể gần đó, mặt đất và lắp đặt ảnh hưởng đến việc điều chỉnh. Đo lường và điều chỉnh một cách an toàn; đây không phải là chứng nhận thiết kế hoặc đánh giá an toàn vô tuyến."
    },
    "actions": {
      "calculate": "Tính chiều dài anten",
      "reset": "Cài lại",
      "copy": "Sao chép kết quả",
      "example": "Hãy thử 100 MHz",
      "result": "Ước tính chiều dài ăng-ten"
    },
    "messages": {
      "calculated": "Ước tính chiều dài ăng-ten được tính toán.",
      "checkInputs": "Nhập tần số dương, loại ăng-ten, đơn vị và hệ số rút ngắn hợp lệ từ 0,70 đến 1,00.",
      "copied": "Đã sao chép kết quả.",
      "copyUnavailable": "Bản sao không có sẵn trong trình duyệt này.",
      "wavelength": "Bước sóng không gian tự do",
      "idealLength": "Chiều dài lý tưởng trước khi rút ngắn",
      "adjustedLength": "Tổng chiều dài điều chỉnh ước tính",
      "elementLength": "Chiều dài mỗi chân lưỡng cực",
      "imperialAdjusted": "Tổng chiều dài điều chỉnh (feet)",
      "factor": "Hệ số rút ngắn",
      "formula": "Công thức"
    },
    "additionalFaqs": [
      {
        "question": "Độ dài của lưỡng cực nửa sóng ở 100 MHz là bao nhiêu?",
        "answer": "Trong không gian tự do, bước sóng ở 100 MHz là khoảng 2,998 m, do đó, lưỡng cực nửa sóng lý tưởng có tổng chiều dài khoảng 1,499 m, hay khoảng 0,749 m mỗi chân. Ăng-ten thực tế có thể sử dụng hệ số rút ngắn và phải được điều chỉnh trong môi trường được lắp đặt."
      },
      {
        "question": "Ăng-ten một phần tư sóng dài bao nhiêu?",
        "answer": "Chiều dài dây dẫn trong không gian tự do lý tưởng của nó là một phần tư bước sóng: tốc độ ánh sáng chia cho bốn lần tần số. Chiều dài điều chỉnh thực tế có thể khác nhau tùy theo dây dẫn, nguồn cấp dữ liệu, mặt đất và môi trường xung quanh."
      },
      {
        "question": "Hệ số rút ngắn có nghĩa là gì?",
        "answer": "Nó nhân chiều dài phần tử trong không gian tự do lý tưởng để đưa ra ước tính ban đầu cho một dây dẫn thực tế. Mặc định chỉ là quy tắc chung; nó không phải là hệ số vận tốc cáp đồng trục và không thay thế phép đo hoặc điều chỉnh."
      },
      {
        "question": "Máy tính này có đảm bảo ăng-ten được điều chỉnh hoặc an toàn không?",
        "answer": "Không. Nó ước tính hình dạng đơn cực lưỡng cực nửa sóng hoặc một phần tư sóng cơ bản. Trở kháng và cộng hưởng thực tế phụ thuộc vào việc xây dựng và địa điểm. Tuân thủ các quy định về vô tuyến và các biện pháp lắp đặt an toàn cũng như xác minh bằng các thiết bị phù hợp."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "it": {
    "copyLanguage": "it",
    "name": "Calcolatore della lunghezza dell'antenna",
    "title": "Calcolatore della lunghezza dell'antenna a | UsefulVerse",
    "description": "Stimare la lunghezza del dipolo a semionda o dell'antenna a quarto d'onda in base alla frequenza. Utilizzo gratuito e illimitato del browser con un fattore...",
    "intro": "Stimare un dipolo a semionda o un monopolo a quarto d'onda nello spazio libero in base alla frequenza. Regola il fattore di accorciamento per vedere una lunghezza iniziale pratica e ciascuna gamba del dipolo.",
    "howQuestion": "Come posso calcolare la lunghezza dell'antenna a dipolo dalla frequenza?",
    "howAnswer": "Per prima cosa calcola la lunghezza d'onda come la velocità della luce divisa per la frequenza. Un dipolo a semionda è circa la metà della lunghezza d'onda totale, con due gambe uguali; un monopolo a quarto d'onda è circa un quarto. Un fattore di accorciamento modificabile può fornire una stima iniziale pratica, ma la lunghezza finale dipende dal design dell'antenna e dall'ambiente circostante.",
    "privacyQuestion": "I valori della mia antenna sono caricati?",
    "privacyAnswer": "No. Il calcolo viene eseguito in questo browser; i valori immessi non vengono caricati o salvati da questo strumento.",
    "fields": {
      "mode": "Tipo di antenna",
      "dipole": "Dipolo a semionda",
      "monopole": "Monopolo a quarto d'onda",
      "frequency": "Frequenza operativa",
      "frequencyUnit": "Unità di frequenza",
      "hz": "Hertz (Hz)",
      "khz": "Kilohertz (kHz)",
      "mhz": "Megahertz (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "Fattore di accorciamento (0,70–1,00)",
      "accuracyNote": "Questo stima un conduttore diritto e sottile nello spazio libero. Il fattore di accorciamento è una stima iniziale regolabile, non una correzione universale; l'alimentazione, il diametro del conduttore, gli oggetti vicini, la terra e l'installazione influiscono sulla messa a punto. Misura e sintonizza in sicurezza; questa non è una certificazione di progettazione o una valutazione della sicurezza radio."
    },
    "actions": {
      "calculate": "Calcolare la lunghezza dell'antenna",
      "reset": "Reset",
      "copy": "Copia i risultati",
      "example": "Prova 100 MHz",
      "result": "Stima della lunghezza dell'antenna"
    },
    "messages": {
      "calculated": "Stima della lunghezza dell'antenna calcolata.",
      "checkInputs": "Immettere una frequenza positiva, un tipo di antenna, un'unità e un fattore di accorciamento validi compresi tra 0,70 e 1,00.",
      "copied": "Risultati copiati.",
      "copyUnavailable": "La copia non è disponibile in questo browser.",
      "wavelength": "Lunghezza d'onda dello spazio libero",
      "idealLength": "Lunghezza ideale prima dell'accorciamento",
      "adjustedLength": "Lunghezza totale modificata stimata",
      "elementLength": "Lunghezza di ciascuna gamba del dipolo",
      "imperialAdjusted": "Lunghezza totale modificata (piedi)",
      "factor": "Fattore di accorciamento",
      "formula": "Formula"
    },
    "additionalFaqs": [
      {
        "question": "Qual è la lunghezza di un dipolo a semionda a 100 MHz?",
        "answer": "Nello spazio libero, la lunghezza d'onda a 100 MHz è di circa 2,998 m, quindi un dipolo a semionda ideale è di circa 1,499 m in totale, o circa 0,749 m per gamba. Un'antenna pratica può utilizzare un fattore di accorciamento e dovrebbe essere sintonizzata nel suo ambiente di installazione."
      },
      {
        "question": "Quanto è lunga un'antenna a quarto d'onda?",
        "answer": "La sua lunghezza ideale del conduttore nello spazio libero è un quarto della lunghezza d'onda: la velocità della luce divisa per quattro volte la frequenza. La lunghezza effettiva sintonizzata può variare a seconda del conduttore, dell'alimentazione, della terra e dell'ambiente circostante."
      },
      {
        "question": "Cosa significa il fattore di accorciamento?",
        "answer": "Moltiplica la lunghezza ideale dell'elemento dello spazio libero per fornire una stima iniziale per un conduttore pratico. L'impostazione predefinita è solo una regola pratica; non è il fattore di velocità del cavo coassiale e non sostituisce la misurazione o la messa a punto."
      },
      {
        "question": "Questo calcolatore garantisce un'antenna sintonizzata o sicura?",
        "answer": "No. Stima la geometria base del dipolo a semionda o del monopolo a quarto d'onda. L'impedenza e la risonanza reali dipendono dalla costruzione e dal sito. Seguire le normative radio e le pratiche di installazione sicura e verificare con strumenti adeguati."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "zh_tw": {
    "copyLanguage": "zh_tw",
    "name": "天線長度計算器",
    "title": "偶極子天線長度計算器免費 | UsefulVerse",
    "description": "根據頻率估計半波偶極子或四分之一波天線長度。免費、無限制的瀏覽器使用以及可編輯的縮短因子。",
    "intro": "根據頻率估計自由空間半波偶極子或四分之一波單極子。調整縮短係數以查看實際的起始長度和每個偶極子腿。",
    "howQuestion": "如何根據頻率計算偶極天線長度？",
    "howAnswer": "首先將波長計算為光速除以頻率。半波偶極子大約是總波長的一半，有兩條相等的腿；四分之一波單極子大約是四分之一。可編輯的縮短因子可以提供實際的起始估計，但最終長度取決於天線設計和周圍環境。",
    "privacyQuestion": "我的天線值是否已上傳？",
    "privacyAnswer": "不。計算在此瀏覽器中運作；此工具不會上傳或儲存您輸入的值。",
    "fields": {
      "mode": "天線類型",
      "dipole": "半波偶極子",
      "monopole": "四分之一波單極子",
      "frequency": "工作頻率",
      "frequencyUnit": "頻率單位",
      "hz": "赫茲 (Hz)",
      "khz": "千赫茲 (kHz)",
      "mhz": "兆赫 (MHz)",
      "ghz": "千兆赫 (GHz)",
      "shorteningFactor": "縮短係數 (0.70–1.00)",
      "accuracyNote": "這估計了自由空間中的直細導體。縮短因子是可調整的起始估計，而不是通用修正；饋電、導體直徑、附近物體、接地和安裝都會影響調諧。安全測量和調諧；這不是設計認證或無線電安全評估。"
    },
    "actions": {
      "calculate": "計算天線長度",
      "reset": "重置",
      "copy": "複製結果",
      "example": "嘗試 100 MHz",
      "result": "天線長度估計"
    },
    "messages": {
      "calculated": "計算天線長度估計值。",
      "checkInputs": "輸入有效的正頻率、天線類型、單位和縮短係數（0.70 到 1.00）。",
      "copied": "結果已複製。",
      "copyUnavailable": "複製在此瀏覽器中不可用。",
      "wavelength": "自由空間波長",
      "idealLength": "縮短前的理想長度",
      "adjustedLength": "預計調整總長度",
      "elementLength": "每個偶極子腿的長度",
      "imperialAdjusted": "調整後總長度（英尺）",
      "factor": "縮短係數",
      "formula": "公式"
    },
    "additionalFaqs": [
      {
        "question": "100 MHz 時半波偶極子的長度是多少？",
        "answer": "在自由空間中，100 MHz 下的波長約為 2.998 m，因此理想的半波偶極子總長度約為 1.499 m，或每條腿約為 0.749 m。實際的天線可能會使用縮短因子，並且應該在其安裝環境中進行調諧。"
      },
      {
        "question": "四分之一波長天線有多長？",
        "answer": "其理想的自由空間導體長度是波長的四分之一：光速除以四倍頻率。實際調諧長度可能因導體、饋電、接地和周圍環境而異。"
      },
      {
        "question": "縮短因子是什麼意思？",
        "answer": "它將理想的自由空間元件長度相乘，以提供實際導體的起始估計。預設值只是一個經驗法則；它不是同軸電纜速度因子，並且不能取代測量或調諧。"
      },
      {
        "question": "此計算器能否保證天線調諧或安全？",
        "answer": "不會。它估計基本的半波偶極子或四分之一波單極子幾何形狀。實際阻抗和諧振取決於結構和地點。遵循無線電法規和安全安裝實踐，並使用合適的儀器進行驗證。"
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "bg": {
    "copyLanguage": "bg",
    "name": "Калкулатор за дължина на антената",
    "title": "Безплатен калкулатор за дължина на диполна | UsefulVerse",
    "description": "Изчислете дължината на полувълнова диполна или четвърт вълнова антена от честотата. Безплатно, неограничено използване на браузър с фактор за редактиране на...",
    "intro": "Оценете полувълновия дипол или четвъртвълновия монопол в свободното пространство от честотата. Регулирайте коефициента на скъсяване, за да видите практична начална дължина и всеки диполен крак.",
    "howQuestion": "Как да изчисля дължината на диполната антена от честотата?",
    "howAnswer": "Първо изчислете дължината на вълната като скоростта на светлината, разделена на честотата. Полувълновият дипол е около половината от общата дължина на вълната, с два равни крака; четвърт вълнов монопол е около една четвърт. Коефициентът на редактиране на скъсяване може да осигури практическа начална оценка, но крайната дължина зависи от дизайна на антената и околната среда.",
    "privacyQuestion": "Качени ли са стойностите на антената ми?",
    "privacyAnswer": "Не. Изчислението се изпълнява в този браузър; въведените от вас стойности не се качват или запазват от този инструмент.",
    "fields": {
      "mode": "Тип антена",
      "dipole": "Полувълнов дипол",
      "monopole": "Четвърт вълнов монопол",
      "frequency": "Работна честота",
      "frequencyUnit": "Единица за честота",
      "hz": "Херц (Hz)",
      "khz": "килохерци (kHz)",
      "mhz": "Мегахерци (MHz)",
      "ghz": "гигахерци (GHz)",
      "shorteningFactor": "Коефициент на скъсяване (0,70–1,00)",
      "accuracyNote": "Това оценява прав, тънък проводник в свободно пространство. Коефициентът на съкращаване е регулируема начална оценка, а не универсална корекция; захранването, диаметърът на проводника, близките обекти, земята и инсталацията влияят върху настройката. Измервайте и настройвайте безопасно; това не е сертификат за проектиране или оценка на радиобезопасността."
    },
    "actions": {
      "calculate": "Изчислете дължината на антената",
      "reset": "Нулиране",
      "copy": "Копиране на резултатите",
      "example": "Опитайте 100 MHz",
      "result": "Оценка на дължината на антената"
    },
    "messages": {
      "calculated": "Изчислена приблизителна дължина на антената.",
      "checkInputs": "Въведете валидна положителна честота, тип антена, единица и коефициент на скъсяване от 0,70 до 1,00.",
      "copied": "Резултатите са копирани.",
      "copyUnavailable": "Копирането не е налично в този браузър.",
      "wavelength": "Дължина на вълната на свободното пространство",
      "idealLength": "Идеална дължина преди скъсяване",
      "adjustedLength": "Прогнозна коригирана обща дължина",
      "elementLength": "Дължина на всеки крак на дипол",
      "imperialAdjusted": "Коригирана обща дължина (футове)",
      "factor": "Фактор на скъсяване",
      "formula": "Формула"
    },
    "additionalFaqs": [
      {
        "question": "Каква е дължината на полувълнов дипол при 100 MHz?",
        "answer": "В свободното пространство дължината на вълната при 100 MHz е около 2,998 m, така че идеалният полувълнов дипол е около 1,499 m общо, или около 0,749 m на крак. Практичната антена може да използва коефициент на скъсяване и трябва да бъде настроена в инсталираната среда."
      },
      {
        "question": "Колко дълга е една четвърт вълнова антена?",
        "answer": "Неговата идеална дължина на проводника в свободното пространство е една четвърт от дължината на вълната: скоростта на светлината, разделена на четири пъти честотата. Действителната настроена дължина може да се различава в зависимост от проводника, захранването, земята и околната среда."
      },
      {
        "question": "Какво означава коефициентът на съкращаване?",
        "answer": "Той умножава идеалната дължина на елемента на свободното пространство, за да осигури начална оценка за практичен проводник. По подразбиране е само правило; това не е факторът на скоростта на коаксиалния кабел и не замества измерването или настройката."
      },
      {
        "question": "Този калкулатор гарантира ли настроена или безопасна антена?",
        "answer": "Не. Той оценява основната полувълнова диполна или четвъртвълнова монополна геометрия. Реалният импеданс и резонанс зависят от конструкцията и мястото. Следвайте разпоредбите за радиото и практиките за безопасно инсталиране и проверете с подходящи инструменти."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "ca": {
    "copyLanguage": "ca",
    "name": "Calculadora de longitud de l'antena",
    "title": "Calculadora de longitud d'antena dipol | UsefulVerse",
    "description": "Estimar la longitud de l'antena de dipol de mitja ona o quart d'ona a partir de la freqüència. Ús gratuït i il·limitat del navegador amb un factor...",
    "intro": "Estima un dipol de mitja ona d'espai lliure o un monopol de quart d'ona a partir de la freqüència. Ajusteu el factor d'escurçament per veure una longitud inicial pràctica i cada pot de dipol.",
    "howQuestion": "Com puc calcular la longitud de l'antena dipol a partir de la freqüència?",
    "howAnswer": "Calculeu primer la longitud d'ona com la velocitat de la llum dividida per la freqüència. Un dipol de mitja ona és aproximadament la meitat d'aquesta longitud d'ona en total, amb dues potes iguals; un monopol de quart d'ona és aproximadament un quart. Un factor d'escurçament editable pot proporcionar una estimació inicial pràctica, però la longitud final depèn del disseny de l'antena i l'entorn.",
    "privacyQuestion": "S'han penjat els valors de les meves antenes?",
    "privacyAnswer": "No. El càlcul s'executa en aquest navegador; Aquesta eina no carrega ni desa els valors introduïts.",
    "fields": {
      "mode": "Tipus d'antena",
      "dipole": "Dipol de mitja ona",
      "monopole": "Monopol de quart d'ona",
      "frequency": "Freqüència de funcionament",
      "frequencyUnit": "Unitat de freqüència",
      "hz": "Hertz (Hz)",
      "khz": "Kilohertz (kHz)",
      "mhz": "Megahertz (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "Factor d'escurçament (0,70–1,00)",
      "accuracyNote": "Això estima un conductor recte i prim a l'espai lliure. El factor d'escurçament és una estimació inicial ajustable, no una correcció universal; L'alimentació, el diàmetre del conductor, els objectes propers, el sòl i la instal·lació afecten l'ajust. Mesura i sintonitza amb seguretat; no es tracta d'una certificació de disseny ni d'una avaluació de seguretat radiofònica."
    },
    "actions": {
      "calculate": "Calcula la longitud de l'antena",
      "reset": "Restableix",
      "copy": "Copia els resultats",
      "example": "Prova 100 MHz",
      "result": "Estimació de la longitud de l'antena"
    },
    "messages": {
      "calculated": "Estimació de la longitud de l'antena calculada.",
      "checkInputs": "Introduïu una freqüència positiva, un tipus d'antena, una unitat i un factor d'escurçament vàlids de 0,70 a 1,00.",
      "copied": "S'han copiat els resultats.",
      "copyUnavailable": "La còpia no està disponible en aquest navegador.",
      "wavelength": "Longitud d'ona de l'espai lliure",
      "idealLength": "Longitud ideal abans d'escurçar",
      "adjustedLength": "Longitud total ajustada estimada",
      "elementLength": "Longitud de cada pot de dipol",
      "imperialAdjusted": "Longitud total ajustada (peus)",
      "factor": "Factor d'escurçament",
      "formula": "Fórmula"
    },
    "additionalFaqs": [
      {
        "question": "Quina és la longitud d'un dipol de mitja ona a 100 MHz?",
        "answer": "A l'espai lliure, la longitud d'ona a 100 MHz és d'uns 2,998 m, de manera que un dipol de mitja ona ideal és d'uns 1,499 m total, o uns 0,749 m per cama. Una antena pràctica pot utilitzar un factor d'escurçament i s'ha d'ajustar al seu entorn instal·lat."
      },
      {
        "question": "Quant dura una antena de quart d'ona?",
        "answer": "La seva longitud ideal del conductor d'espai lliure és d'un quart de la longitud d'ona: la velocitat de la llum dividida per quatre vegades la freqüència. La longitud real ajustada pot diferir amb el conductor, l'alimentació, la terra i l'entorn."
      },
      {
        "question": "Què significa el factor d'escurçament?",
        "answer": "Multiplica la longitud ideal de l'element d'espai lliure per proporcionar una estimació inicial d'un conductor pràctic. El valor predeterminat és només una regla general; no és el factor de velocitat del cable coaxial i no substitueix la mesura o l'afinació."
      },
      {
        "question": "Aquesta calculadora garanteix una antena sintonitzada o segura?",
        "answer": "No. Estima la geometria bàsica del dipol de mitja ona o del monopol de quart d'ona. La impedància i la ressonància reals depenen de la construcció i del lloc. Seguiu les normes de ràdio i les pràctiques d'instal·lació segures i comproveu-ho amb instruments adequats."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "nl": {
    "copyLanguage": "nl",
    "name": "Antennelengtecalculator",
    "title": "Dipoolantennelengtecalculator gratis | UsefulVerse",
    "description": "Schat de lengte van de halvegolfdipool- of kwartgolfantenne op basis van de frequentie. Gratis, onbeperkt browsergebruik met een bewerkbare verkortingsfactor.",
    "intro": "Schat een halvegolfdipool of kwartgolfmonopool in de vrije ruimte op basis van de frequentie. Pas de verkortingsfactor aan om een ​​praktische startlengte en iedere dipoolpoot te zien.",
    "howQuestion": "Hoe bereken ik de lengte van de dipoolantenne op basis van de frequentie?",
    "howAnswer": "Bereken eerst de golflengte als de lichtsnelheid gedeeld door de frequentie. Een halvegolfdipool heeft in totaal ongeveer de helft van die golflengte, met twee gelijke benen; een kwartgolfmonopool is ongeveer een kwart. Een bewerkbare verkortingsfactor kan een praktische startschatting opleveren, maar de uiteindelijke lengte is afhankelijk van het antenneontwerp en de omgeving.",
    "privacyQuestion": "Worden mijn antennewaarden geüpload?",
    "privacyAnswer": "Nee. De berekening wordt in deze browser uitgevoerd; uw ingevoerde waarden worden niet geüpload of opgeslagen door deze tool.",
    "fields": {
      "mode": "Antenne type",
      "dipole": "Halve golf dipool",
      "monopole": "Kwartgolf monopool",
      "frequency": "Bedrijfsfrequentie",
      "frequencyUnit": "Frequentie-eenheid",
      "hz": "Hertz (Hz)",
      "khz": "Kilohertz (kHz)",
      "mhz": "Megahertz (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "Verkortingsfactor (0,70–1,00)",
      "accuracyNote": "Dit schat een rechte, dunne geleider in de vrije ruimte. De verkortingsfactor is een instelbare startschatting, geen universele correctie; voeding, diameter van de geleider, nabijgelegen objecten, grond en installatie beïnvloeden de afstemming. Veilig meten en afstemmen; dit is geen ontwerpcertificering of radioveiligheidsbeoordeling."
    },
    "actions": {
      "calculate": "Bereken de antennelengte",
      "reset": "Opnieuw instellen",
      "copy": "Kopieer resultaten",
      "example": "Probeer 100 MHz",
      "result": "Geschatte antennelengte"
    },
    "messages": {
      "calculated": "Geschatte antennelengte berekend.",
      "checkInputs": "Voer een geldige positieve frequentie, antennetype, eenheid en verkortingsfactor in van 0,70 tot 1,00.",
      "copied": "Resultaten gekopieerd.",
      "copyUnavailable": "Kopiëren is niet beschikbaar in deze browser.",
      "wavelength": "Golflengte in de vrije ruimte",
      "idealLength": "Ideale lengte alvorens in te korten",
      "adjustedLength": "Geschatte aangepaste totale lengte",
      "elementLength": "Lengte van elke dipoolpoot",
      "imperialAdjusted": "Aangepaste totale lengte (voet)",
      "factor": "Verkortingsfactor",
      "formula": "Formule"
    },
    "additionalFaqs": [
      {
        "question": "Wat is de lengte van een halvegolfdipool bij 100 MHz?",
        "answer": "In de vrije ruimte is de golflengte bij 100 MHz ongeveer 2,998 m, dus een ideale halvegolfdipool is in totaal ongeveer 1,499 m, of ongeveer 0,749 m per been. Een praktische antenne kan een verkortingsfactor gebruiken en moet in de geïnstalleerde omgeving worden afgestemd."
      },
      {
        "question": "Hoe lang is een kwartgolfantenne?",
        "answer": "De ideale geleiderlengte in de vrije ruimte is een kwart van de golflengte: de lichtsnelheid gedeeld door vier keer de frequentie. De werkelijke afgestemde lengte kan verschillen afhankelijk van de geleider, voeding, grond en omgeving."
      },
      {
        "question": "Wat betekent de verkortingsfactor?",
        "answer": "Het vermenigvuldigt de ideale lengte van het element in de vrije ruimte om een ​​startschatting te geven voor een praktische geleider. De standaardinstelling is slechts een vuistregel; het is niet de snelheidsfactor van de coaxiale kabel en vervangt geen meting of afstemming."
      },
      {
        "question": "Garandeert deze rekenmachine een afgestemde of veilige antenne?",
        "answer": "Nee. Het schat de basisgeometrie van een halve golf dipool of kwart golf monopool. De werkelijke impedantie en resonantie zijn afhankelijk van de constructie en de locatie. Volg de radiovoorschriften en veilige installatiepraktijken en verifieer met geschikte instrumenten."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "el": {
    "copyLanguage": "el",
    "name": "Υπολογιστής μήκους κεραίας",
    "title": "Υπολογιστής μήκους κεραίας Διπόλου Δωρεάν | UsefulVerse",
    "description": "Υπολογίστε το μήκος της κεραίας μισού κύματος ή διπολικού κύματος από τη συχνότητα. Δωρεάν, απεριόριστη χρήση προγράμματος περιήγησης με επεξεργάσιμο...",
    "intro": "Υπολογίστε ένα δίπολο μισού κύματος ελεύθερου χώρου ή μονόπολο τετάρτου κύματος από τη συχνότητα. Προσαρμόστε τον συντελεστή βράχυνσης για να δείτε ένα πρακτικό μήκος εκκίνησης και κάθε δίπολο σκέλος.",
    "howQuestion": "Πώς μπορώ να υπολογίσω το μήκος της διπολικής κεραίας από τη συχνότητα;",
    "howAnswer": "Αρχικά υπολογίστε το μήκος κύματος ως την ταχύτητα του φωτός διαιρεμένη με τη συχνότητα. Ένα δίπολο μισού κύματος είναι περίπου το μισό αυτού του μήκους κύματος συνολικά, με δύο ίσα σκέλη. ένα μονόπολο τετάρτου κύματος είναι περίπου ένα τέταρτο. Ένας επεξεργάσιμος συντελεστής βράχυνσης μπορεί να παρέχει μια πρακτική εκτίμηση εκκίνησης, αλλά το τελικό μήκος εξαρτάται από το σχεδιασμό της κεραίας και το περιβάλλον.",
    "privacyQuestion": "Έχουν μεταφορτωθεί οι τιμές της κεραίας μου;",
    "privacyAnswer": "Όχι. Ο υπολογισμός εκτελείται σε αυτό το πρόγραμμα περιήγησης. Οι τιμές που εισαγάγατε δεν μεταφορτώνονται ούτε αποθηκεύονται από αυτό το εργαλείο.",
    "fields": {
      "mode": "Τύπος κεραίας",
      "dipole": "Δίπολο μισού κύματος",
      "monopole": "Μονόπολο τετάρτου κυμάτων",
      "frequency": "Συχνότητα λειτουργίας",
      "frequencyUnit": "Μονάδα συχνότητας",
      "hz": "Hertz (Hz)",
      "khz": "Kilohertz (kHz)",
      "mhz": "Megahertz (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "Συντελεστής βράχυνσης (0,70–1,00)",
      "accuracyNote": "Αυτό υπολογίζει έναν ευθύ, λεπτό αγωγό σε ελεύθερο χώρο. Ο συντελεστής συντόμευσης είναι μια ρυθμιζόμενη αρχική εκτίμηση, όχι μια καθολική διόρθωση. Η τροφοδοσία, η διάμετρος του αγωγού, τα κοντινά αντικείμενα, η γείωση και η εγκατάσταση επηρεάζουν τον συντονισμό. Μετρήστε και συντονίστε με ασφάλεια. δεν πρόκειται για πιστοποίηση σχεδιασμού ή αξιολόγηση ραδιοασφάλειας."
    },
    "actions": {
      "calculate": "Υπολογίστε το μήκος της κεραίας",
      "reset": "Επαναφορά",
      "copy": "Αντιγραφή αποτελεσμάτων",
      "example": "Δοκίμασε 100 MHz",
      "result": "Εκτίμηση μήκους κεραίας"
    },
    "messages": {
      "calculated": "Υπολογισμός μήκους κεραίας.",
      "checkInputs": "Εισαγάγετε μια έγκυρη θετική συχνότητα, τύπο κεραίας, μονάδα και συντελεστή βράχυνσης από 0,70 έως 1,00.",
      "copied": "Τα αποτελέσματα αντιγράφηκαν.",
      "copyUnavailable": "Το αντίγραφο δεν είναι διαθέσιμο σε αυτό το πρόγραμμα περιήγησης.",
      "wavelength": "Μήκος κύματος ελεύθερου χώρου",
      "idealLength": "Ιδανικό μήκος πριν από το λίπος",
      "adjustedLength": "Εκτιμώμενο προσαρμοσμένο συνολικό μήκος",
      "elementLength": "Μήκος κάθε δίπολου σκέλους",
      "imperialAdjusted": "Προσαρμοσμένο συνολικό μήκος (πόδια)",
      "factor": "Συντελεστής βράχυνσης",
      "formula": "Τύπος"
    },
    "additionalFaqs": [
      {
        "question": "Ποιο είναι το μήκος ενός διπόλου μισού κύματος στα 100 MHz;",
        "answer": "Στον ελεύθερο χώρο, το μήκος κύματος στα 100 MHz είναι περίπου 2,998 m, επομένως ένα ιδανικό δίπολο ημικυμάτων είναι περίπου 1,499 m συνολικά, ή περίπου 0,749 m ανά σκέλος. Μια πρακτική κεραία μπορεί να χρησιμοποιεί συντελεστή βράχυνσης και θα πρέπει να συντονιστεί στο εγκατεστημένο περιβάλλον της."
      },
      {
        "question": "Πόσο διαρκεί μια κεραία τετάρτου κύματος;",
        "answer": "Το ιδανικό μήκος του αγωγού ελεύθερου χώρου είναι το ένα τέταρτο του μήκους κύματος: η ταχύτητα του φωτός διαιρούμενη με τέσσερις φορές τη συχνότητα. Το πραγματικό συντονισμένο μήκος μπορεί να διαφέρει ανάλογα με τον αγωγό, την τροφοδοσία, τη γείωση και το περιβάλλον."
      },
      {
        "question": "Τι σημαίνει ο παράγοντας βράχυνσης;",
        "answer": "Πολλαπλασιάζει το ιδανικό μήκος στοιχείου ελεύθερου χώρου για να παρέχει μια αρχική εκτίμηση για έναν πρακτικό αγωγό. Η προεπιλογή είναι μόνο ένας εμπειρικός κανόνας. δεν είναι ο συντελεστής ταχύτητας ομοαξονικού καλωδίου και δεν αντικαθιστά τη μέτρηση ή τον συντονισμό."
      },
      {
        "question": "Αυτή η αριθμομηχανή εγγυάται μια συντονισμένη ή ασφαλή κεραία;",
        "answer": "Όχι. Υπολογίζει τη βασική γεωμετρία μονοπολικού διπόλου μισού κύματος ή τεταρτοκύματος. Η πραγματική αντίσταση και ο συντονισμός εξαρτώνται από την κατασκευή και την τοποθεσία. Ακολουθήστε τους κανονισμούς ραδιοφώνου και τις πρακτικές ασφαλούς εγκατάστασης και επαληθεύστε με κατάλληλα όργανα."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "ms": {
    "copyLanguage": "ms",
    "name": "Kalkulator Panjang Antena",
    "title": "Kalkulator Panjang Antena Dipole Percuma | UsefulVerse",
    "description": "Anggarkan dipol separuh gelombang atau panjang antena suku gelombang daripada frekuensi. Penggunaan penyemak imbas percuma tanpa had dengan faktor...",
    "intro": "Anggarkan dipol separuh gelombang ruang bebas atau monopol suku gelombang daripada frekuensi. Laraskan faktor pemendekan untuk melihat panjang permulaan praktikal dan setiap kaki dipol.",
    "howQuestion": "Bagaimanakah cara mengira panjang antena dipol daripada kekerapan?",
    "howAnswer": "Mula-mula hitung panjang gelombang sebagai kelajuan cahaya dibahagikan dengan kekerapan. Dipol separuh gelombang adalah kira-kira separuh panjang gelombang secara keseluruhan, dengan dua kaki yang sama; monopole suku gelombang adalah kira-kira satu perempat. Faktor pemendekan boleh diedit boleh memberikan anggaran permulaan yang praktikal, tetapi panjang akhir bergantung pada reka bentuk antena dan persekitaran.",
    "privacyQuestion": "Adakah nilai antena saya dimuat naik?",
    "privacyAnswer": "Tidak. Pengiraan berjalan dalam penyemak imbas ini; nilai yang anda masukkan tidak dimuat naik atau disimpan oleh alat ini.",
    "fields": {
      "mode": "Jenis antena",
      "dipole": "Dipol separuh gelombang",
      "monopole": "Monopol gelombang suku",
      "frequency": "Kekerapan operasi",
      "frequencyUnit": "Unit kekerapan",
      "hz": "Hertz (Hz)",
      "khz": "Kilohertz (kHz)",
      "mhz": "Megahertz (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "Faktor pemendekan (0.70–1.00)",
      "accuracyNote": "Ini menganggarkan konduktor lurus dan nipis di ruang bebas. Faktor pemendekan ialah anggaran permulaan boleh laras, bukan pembetulan sejagat; suapan, diameter konduktor, objek berdekatan, tanah dan pemasangan menjejaskan penalaan. Ukur dan tala dengan selamat; ini bukan pensijilan reka bentuk atau penilaian keselamatan radio."
    },
    "actions": {
      "calculate": "Kira panjang antena",
      "reset": "Tetapkan semula",
      "copy": "Salin keputusan",
      "example": "Cuba 100 MHz",
      "result": "Anggaran panjang antena"
    },
    "messages": {
      "calculated": "Anggaran panjang antena dikira.",
      "checkInputs": "Masukkan frekuensi positif yang sah, jenis antena, unit dan faktor pemendekan dari 0.70 hingga 1.00.",
      "copied": "Keputusan disalin.",
      "copyUnavailable": "Salinan tidak tersedia dalam penyemak imbas ini.",
      "wavelength": "Panjang gelombang ruang bebas",
      "idealLength": "Panjang ideal sebelum dipendekkan",
      "adjustedLength": "Anggaran jumlah panjang terlaras",
      "elementLength": "Panjang setiap kaki dipol",
      "imperialAdjusted": "Jumlah panjang (kaki) dilaraskan",
      "factor": "Faktor pemendekan",
      "formula": "Formula"
    },
    "additionalFaqs": [
      {
        "question": "Berapakah panjang dipol separuh gelombang pada 100 MHz?",
        "answer": "Dalam ruang bebas, panjang gelombang pada 100 MHz adalah kira-kira 2.998 m, jadi dipol separuh gelombang yang ideal ialah kira-kira 1.499 m jumlah, atau kira-kira 0.749 m setiap kaki. Antena praktikal mungkin menggunakan faktor pemendekan dan harus ditala dalam persekitaran yang dipasang."
      },
      {
        "question": "Berapa lama antena suku gelombang?",
        "answer": "Panjang konduktor ruang bebas yang ideal ialah satu perempat daripada panjang gelombang: kelajuan cahaya dibahagikan dengan kekerapan empat kali. Panjang talaan sebenar boleh berbeza dengan konduktor, suapan, tanah dan persekitaran."
      },
      {
        "question": "Apakah maksud faktor pemendekan?",
        "answer": "Ia menggandakan panjang elemen ruang bebas yang ideal untuk memberikan anggaran permulaan untuk konduktor praktikal. Lalai hanyalah peraturan biasa; ia bukan faktor halaju kabel sepaksi dan tidak menggantikan pengukuran atau penalaan."
      },
      {
        "question": "Adakah kalkulator ini menjamin antena yang ditala atau selamat?",
        "answer": "Tidak. Ia menganggarkan geometri monopol separuh gelombang asas atau monopol suku gelombang. Impedans dan resonans sebenar bergantung pada pembinaan dan tapak. Ikuti peraturan radio dan amalan pemasangan selamat, dan sahkan dengan instrumen yang sesuai."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "pl": {
    "copyLanguage": "pl",
    "name": "Kalkulator długości anteny",
    "title": "Kalkulator długości anteny dipolowej Darmowy | UsefulVerse",
    "description": "Oszacuj długość dipola półfalowego lub anteny ćwierćfalowej na podstawie częstotliwości. Bezpłatne, nieograniczone korzystanie z przeglądarki z edytowalnym...",
    "intro": "Oszacuj dipol półfalowy lub monopol ćwierćfalowy w wolnej przestrzeni na podstawie częstotliwości. Dostosuj współczynnik skracania, aby zobaczyć praktyczną długość początkową i każdą nogę dipola.",
    "howQuestion": "Jak obliczyć długość anteny dipolowej na podstawie częstotliwości?",
    "howAnswer": "Najpierw oblicz długość fali jako prędkość światła podzieloną przez częstotliwość. Dipol półfalowy ma w sumie około połowę długości fali i ma dwie równe nogi; monopol ćwierćfalowy wynosi około jednej czwartej. Edytowalny współczynnik skracania może zapewnić praktyczne oszacowanie początkowe, ale ostateczna długość zależy od konstrukcji anteny i otoczenia.",
    "privacyQuestion": "Czy wartości moich anten zostały przesłane?",
    "privacyAnswer": "Nie. Obliczenia działają w tej przeglądarce; wprowadzone wartości nie są przesyłane ani zapisywane przez to narzędzie.",
    "fields": {
      "mode": "Typ anteny",
      "dipole": "Dipol półfalowy",
      "monopole": "Monopol ćwierćfalowy",
      "frequency": "Częstotliwość robocza",
      "frequencyUnit": "Jednostka częstotliwości",
      "hz": "Herc (Hz)",
      "khz": "Kiloherc (kHz)",
      "mhz": "Megaherc (MHz)",
      "ghz": "Gigaherc (GHz)",
      "shorteningFactor": "Współczynnik skracania (0,70–1,00)",
      "accuracyNote": "To szacuje prosty, cienki przewodnik w wolnej przestrzeni. Współczynnik skracający jest regulowaną wartością szacunkową początkową, a nie uniwersalną poprawką; zasilanie, średnica przewodu, pobliskie obiekty, uziemienie i instalacja wpływają na strojenie. Bezpiecznie mierz i dostrój; nie jest to certyfikacja projektu ani ocena bezpieczeństwa radiowego."
    },
    "actions": {
      "calculate": "Oblicz długość anteny",
      "reset": "Nastawić",
      "copy": "Skopiuj wyniki",
      "example": "Spróbuj 100 MHz",
      "result": "Oszacowanie długości anteny"
    },
    "messages": {
      "calculated": "Obliczono szacunkową długość anteny.",
      "checkInputs": "Wprowadź prawidłową częstotliwość dodatnią, typ anteny, jednostkę i współczynnik skracania od 0,70 do 1,00.",
      "copied": "Wyniki skopiowane.",
      "copyUnavailable": "Kopia nie jest dostępna w tej przeglądarce.",
      "wavelength": "Długość fali w wolnej przestrzeni",
      "idealLength": "Idealna długość przed skróceniem",
      "adjustedLength": "Szacunkowa dostosowana długość całkowita",
      "elementLength": "Długość każdej nogi dipola",
      "imperialAdjusted": "Skorygowana długość całkowita (w stopach)",
      "factor": "Współczynnik skracania",
      "formula": "Formuła"
    },
    "additionalFaqs": [
      {
        "question": "Jaka jest długość dipola półfalowego przy 100 MHz?",
        "answer": "W wolnej przestrzeni długość fali przy 100 MHz wynosi około 2,998 m, więc idealny dipol półfalowy ma łącznie około 1,499 m, czyli około 0,749 m na nogę. Praktyczna antena może wykorzystywać współczynnik skracający i powinna być dostrojona w środowisku, w którym jest zainstalowana."
      },
      {
        "question": "Jak długa jest antena ćwierćfalowa?",
        "answer": "Idealna długość przewodu w wolnej przestrzeni wynosi jedną czwartą długości fali: prędkość światła podzielona przez czterokrotność częstotliwości. Rzeczywista dostrojona długość może różnić się w zależności od przewodu, zasilania, uziemienia i otoczenia."
      },
      {
        "question": "Co oznacza współczynnik skracania?",
        "answer": "Mnoży idealną długość elementu w wolnej przestrzeni, aby zapewnić początkowe oszacowanie praktycznego przewodnika. Wartość domyślna to tylko praktyczna zasada; nie jest to współczynnik prędkości kabla koncentrycznego i nie zastępuje pomiaru ani strojenia."
      },
      {
        "question": "Czy ten kalkulator gwarantuje dostrojoną i bezpieczną antenę?",
        "answer": "Nie. Ocenia podstawową geometrię dipola półfalowego lub ćwierćfalowego monopolu. Rzeczywista impedancja i rezonans zależą od konstrukcji i miejsca. Postępuj zgodnie z przepisami radiowymi i praktykami bezpiecznej instalacji oraz sprawdź za pomocą odpowiednich przyrządów."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "sv": {
    "copyLanguage": "sv",
    "name": "Antennlängdskalkylator",
    "title": "Dipol Antenn Längd Calculator Gratis | UsefulVerse",
    "description": "Beräkna halvvågsdipol- eller kvartsvågsantennlängd från frekvens. Gratis, obegränsad webbläsaranvändning med en redigerbar förkortningsfaktor.",
    "intro": "Beräkna en halvvågsdipol med fritt utrymme eller kvartsvågsmonopol från frekvensen. Justera förkortningsfaktorn för att se en praktisk startlängd och varje dipolben.",
    "howQuestion": "Hur beräknar jag dipolantennlängden utifrån frekvensen?",
    "howAnswer": "Beräkna först våglängden som ljusets hastighet dividerat med frekvensen. En halvvågsdipol är ungefär hälften av den våglängden totalt, med två lika ben; en kvartsvågsmonopol är ungefär en fjärdedel. En redigerbar förkortningsfaktor kan ge en praktisk startuppskattning, men den slutliga längden beror på antenndesign och omgivning.",
    "privacyQuestion": "Är mina antennvärden uppladdade?",
    "privacyAnswer": "Nej. Beräkningen körs i den här webbläsaren; dina angivna värden laddas inte upp eller sparas av detta verktyg.",
    "fields": {
      "mode": "Antenn typ",
      "dipole": "Halvvågsdipol",
      "monopole": "Kvartsvåg monopol",
      "frequency": "Driftsfrekvens",
      "frequencyUnit": "Frekvensenhet",
      "hz": "Hertz (Hz)",
      "khz": "Kilohertz (kHz)",
      "mhz": "Megahertz (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "Förkortningsfaktor (0,70–1,00)",
      "accuracyNote": "Detta uppskattar en rak, tunn ledare i ledigt utrymme. Förkortningsfaktorn är en justerbar startuppskattning, inte en universell korrigering; matning, ledardiameter, närliggande föremål, jord och installation påverkar inställningen. Mät och ställ in säkert; detta är inte en konstruktionscertifiering eller radiosäkerhetsbedömning."
    },
    "actions": {
      "calculate": "Beräkna antennlängden",
      "reset": "Återställa",
      "copy": "Kopiera resultat",
      "example": "Prova 100 MHz",
      "result": "Uppskattning av antennlängd"
    },
    "messages": {
      "calculated": "Uppskattning av antennlängd beräknad.",
      "checkInputs": "Ange en giltig positiv frekvens, antenntyp, enhet och förkortningsfaktor från 0,70 till 1,00.",
      "copied": "Resultaten har kopierats.",
      "copyUnavailable": "Kopiera är inte tillgängligt i den här webbläsaren.",
      "wavelength": "Våglängd för fritt utrymme",
      "idealLength": "Idealisk längd innan förkortning",
      "adjustedLength": "Beräknad justerad totallängd",
      "elementLength": "Längd på varje dipolben",
      "imperialAdjusted": "Justerad total längd (fot)",
      "factor": "Förkortningsfaktor",
      "formula": "Formel"
    },
    "additionalFaqs": [
      {
        "question": "Vad är längden på en halvvågsdipol vid 100 MHz?",
        "answer": "I fritt utrymme är våglängden vid 100 MHz cirka 2,998 m, så en ideal halvvågsdipol är cirka 1,499 m totalt, eller cirka 0,749 m per ben. En praktisk antenn kan använda en förkortningsfaktor och bör ställas in i sin installerade miljö."
      },
      {
        "question": "Hur lång är en kvartsvågsantenn?",
        "answer": "Dess idealiska ledarlängd för ledigt utrymme är en fjärdedel av våglängden: ljusets hastighet dividerat med fyra gånger frekvensen. Den faktiska avstämda längden kan skilja sig med ledare, matning, jord och omgivning."
      },
      {
        "question": "Vad betyder förkortningsfaktorn?",
        "answer": "Den multiplicerar den idealiska längden på fritt utrymmeselement för att ge en startuppskattning för en praktisk ledare. Standard är bara en tumregel; det är inte koaxialkabelns hastighetsfaktor och ersätter inte mätning eller inställning."
      },
      {
        "question": "Garanterar denna kalkylator en avstämd eller säker antenn?",
        "answer": "Nej. Den uppskattar grundläggande halvvågsdipol- eller kvartsvågsmonopolgeometri. Verklig impedans och resonans beror på konstruktionen och platsen. Följ radiobestämmelser och säker installationspraxis och verifiera med lämpliga instrument."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "th": {
    "copyLanguage": "th",
    "name": "เครื่องคำนวณความยาวเสาอากาศ",
    "title": "เครื่องคำนวณความยาวเสาอากาศไดโพลฟรี | UsefulVerse",
    "description": "ประมาณความยาวเสาอากาศไดโพลครึ่งคลื่นหรือหนึ่งในสี่คลื่นจากความถี่ ใช้เบราว์เซอร์ฟรีไม่จำกัดพร้อมตัวย่อที่แก้ไขได้",
    "intro": "ประมาณค่าไดโพลครึ่งคลื่นว่างหรือโมโนโพลสี่คลื่นจากความถี่ ปรับปัจจัยการย่อเพื่อดูความยาวเริ่มต้นที่ใช้งานจริงและขาไดโพลแต่ละอัน",
    "howQuestion": "ฉันจะคำนวณความยาวเสาอากาศไดโพลจากความถี่ได้อย่างไร",
    "howAnswer": "ขั้นแรกให้คำนวณความยาวคลื่นโดยใช้ความเร็วแสงหารด้วยความถี่ ไดโพลแบบครึ่งคลื่นจะมีความยาวคลื่นประมาณครึ่งหนึ่งของความยาวคลื่นทั้งหมด โดยมีขาสองขาเท่ากัน โมโนโพลหนึ่งในสี่ของคลื่นมีค่าประมาณหนึ่งในสี่ ปัจจัยการย่อให้สั้นลงที่แก้ไขได้สามารถให้ค่าประมาณเริ่มต้นได้จริง แต่ความยาวสุดท้ายขึ้นอยู่กับการออกแบบเสาอากาศและสภาพแวดล้อม",
    "privacyQuestion": "มีการอัพโหลดค่าเสาอากาศของฉันหรือไม่?",
    "privacyAnswer": "ไม่ การคำนวณรันในเบราว์เซอร์นี้ ค่าที่ป้อนของคุณไม่ได้อัปโหลดหรือบันทึกโดยเครื่องมือนี้",
    "fields": {
      "mode": "ประเภทเสาอากาศ",
      "dipole": "ไดโพลครึ่งคลื่น",
      "monopole": "โมโนโพลแบบควอเตอร์เวฟ",
      "frequency": "ความถี่ในการทำงาน",
      "frequencyUnit": "หน่วยความถี่",
      "hz": "เฮิรตซ์ (Hz)",
      "khz": "กิโลเฮิรตซ์ (kHz)",
      "mhz": "เมกะเฮิรตซ์ (MHz)",
      "ghz": "กิกะเฮิรตซ์ (GHz)",
      "shorteningFactor": "ปัจจัยการย่อขนาด (0.70–1.00)",
      "accuracyNote": "ค่านี้เป็นค่าประมาณของตัวนำเส้นตรงและบางในพื้นที่ว่าง ปัจจัยที่ทำให้สั้นลงคือการประมาณการเริ่มต้นที่ปรับได้ ไม่ใช่การแก้ไขแบบสากล อัตราป้อน เส้นผ่านศูนย์กลางของตัวนำ วัตถุใกล้เคียง กราวด์ และการติดตั้งส่งผลต่อการปรับจูน วัดและปรับแต่งอย่างปลอดภัย นี่ไม่ใช่การรับรองการออกแบบหรือการประเมินความปลอดภัยของวิทยุ"
    },
    "actions": {
      "calculate": "คำนวณความยาวเสาอากาศ",
      "reset": "รีเซ็ต",
      "copy": "คัดลอกผลลัพธ์",
      "example": "ลอง 100 MHz",
      "result": "การประมาณความยาวเสาอากาศ"
    },
    "messages": {
      "calculated": "คำนวณความยาวเสาอากาศโดยประมาณแล้ว",
      "checkInputs": "ป้อนความถี่บวก ประเภทเสาอากาศ หน่วย และปัจจัยการย่อที่ถูกต้องตั้งแต่ 0.70 ถึง 1.00",
      "copied": "คัดลอกผลลัพธ์แล้ว",
      "copyUnavailable": "คัดลอกไม่พร้อมใช้งานในเบราว์เซอร์นี้",
      "wavelength": "ความยาวคลื่นในอวกาศว่าง",
      "idealLength": "ความยาวที่เหมาะสมก่อนที่จะทำให้สั้นลง",
      "adjustedLength": "ความยาวรวมที่ปรับโดยประมาณแล้ว",
      "elementLength": "ความยาวของขาไดโพลแต่ละอัน",
      "imperialAdjusted": "ความยาวรวมที่ปรับแล้ว (ฟุต)",
      "factor": "ปัจจัยที่สั้นลง",
      "formula": "สูตร"
    },
    "additionalFaqs": [
      {
        "question": "ไดโพลครึ่งคลื่นที่ความถี่ 100 MHz มีความยาวเท่าใด",
        "answer": "ในอวกาศความยาวคลื่นที่ 100 MHz จะอยู่ที่ประมาณ 2.998 ม. ดังนั้นไดโพลแบบครึ่งคลื่นในอุดมคติจะมีความยาวรวมประมาณ 1.499 ม. หรือประมาณ 0.749 ม. ต่อขา เสาอากาศที่ใช้งานจริงอาจใช้ปัจจัยการย่อให้สั้นลง และควรปรับในสภาพแวดล้อมที่ติดตั้ง"
      },
      {
        "question": "เสาอากาศหนึ่งในสี่คลื่นมีความยาวเท่าใด?",
        "answer": "ความยาวตัวนำของพื้นที่ว่างในอุดมคติคือหนึ่งในสี่ของความยาวคลื่น: ความเร็วแสงหารด้วยความถี่สี่เท่า ความยาวที่ปรับตามจริงอาจแตกต่างกันไปตามตัวนำ สายป้อน กราวด์ และสภาพแวดล้อม"
      },
      {
        "question": "ปัจจัยการทำให้สั้นลงหมายถึงอะไร?",
        "answer": "โดยจะคูณความยาวขององค์ประกอบพื้นที่ว่างในอุดมคติเพื่อเป็นค่าประมาณเริ่มต้นสำหรับตัวนำที่ใช้งานได้จริง ค่าเริ่มต้นเป็นเพียงกฎทั่วไปเท่านั้น ไม่ใช่ปัจจัยความเร็วของสายโคแอกเซียลและไม่ได้แทนที่การวัดหรือการปรับจูน"
      },
      {
        "question": "เครื่องคิดเลขนี้รับประกันเสาอากาศที่ได้รับการปรับแต่งหรือปลอดภัยหรือไม่",
        "answer": "ไม่ โดยจะประมาณเรขาคณิตแบบโมโนโพลแบบครึ่งคลื่นหรือแบบโมโนโพลแบบครึ่งคลื่นพื้นฐาน อิมพีแดนซ์และเสียงสะท้อนที่แท้จริงขึ้นอยู่กับการก่อสร้างและไซต์งาน ปฏิบัติตามข้อบังคับเกี่ยวกับวิทยุและแนวทางปฏิบัติในการติดตั้งอย่างปลอดภัย และตรวจสอบด้วยเครื่องมือที่เหมาะสม"
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "uk": {
    "copyLanguage": "uk",
    "name": "Калькулятор довжини антени",
    "title": "Безкоштовний калькулятор довжини дипольної | UsefulVerse",
    "description": "Оцініть довжину півхвильової дипольної або чвертьхвильової антени за частотою. Безкоштовне, необмежене використання браузера з редагованим коефіцієнтом...",
    "intro": "Оцініть напівхвильовий диполь або чвертьхвильовий монополь вільного простору за частотою. Відрегулюйте коефіцієнт укорочення, щоб побачити практичну початкову довжину та кожну ніжку диполя.",
    "howQuestion": "Як розрахувати довжину дипольної антени за частотою?",
    "howAnswer": "Спочатку обчисліть довжину хвилі як швидкість світла, поділену на частоту. Напівхвильовий диполь має приблизно половину загальної довжини хвилі з двома рівними ногами; чвертьхвильовий монополь становить приблизно одну чверть. Коефіцієнт скорочення, який можна редагувати, може дати практичну початкову оцінку, але остаточна довжина залежить від конструкції антени та оточення.",
    "privacyQuestion": "Чи завантажено значення моїх антен?",
    "privacyAnswer": "Ні. Розрахунок виконується в цьому браузері; введені вами значення не завантажуються та не зберігаються цим інструментом.",
    "fields": {
      "mode": "Тип антени",
      "dipole": "Напівхвильовий диполь",
      "monopole": "Чвертьхвильовий монополь",
      "frequency": "Робоча частота",
      "frequencyUnit": "Одиниця частоти",
      "hz": "Герц (Гц)",
      "khz": "Кілогерц (кГц)",
      "mhz": "Мегагерц (МГц)",
      "ghz": "Гігагерц (ГГц)",
      "shorteningFactor": "Коефіцієнт укорочення (0,70–1,00)",
      "accuracyNote": "Це оцінює прямий тонкий провідник у вільному просторі. Коефіцієнт скорочення є вихідною оцінкою, що регулюється, а не універсальною поправкою; живлення, діаметр провідника, сусідні об'єкти, заземлення та монтаж впливають на налаштування. Вимірюйте та налаштовуйте безпечно; це не сертифікація проекту чи оцінка радіобезпеки."
    },
    "actions": {
      "calculate": "Розрахувати довжину антени",
      "reset": "Скинути",
      "copy": "Копіювати результати",
      "example": "Спробуйте 100 МГц",
      "result": "Оцінка довжини антени"
    },
    "messages": {
      "calculated": "Розраховано оцінку довжини антени.",
      "checkInputs": "Введіть дійсну позитивну частоту, тип антени, одиницю вимірювання та коефіцієнт скорочення від 0,70 до 1,00.",
      "copied": "Результати скопійовано.",
      "copyUnavailable": "Копіювання недоступне в цьому браузері.",
      "wavelength": "Довжина хвилі вільного простору",
      "idealLength": "Ідеальна довжина перед укороченням",
      "adjustedLength": "Розрахункова скоригована загальна довжина",
      "elementLength": "Довжина кожної ніжки диполя",
      "imperialAdjusted": "Скоригована загальна довжина (фути)",
      "factor": "Фактор укорочення",
      "formula": "Формула"
    },
    "additionalFaqs": [
      {
        "question": "Яка довжина напівхвильового диполя на частоті 100 МГц?",
        "answer": "У вільному просторі довжина хвилі на частоті 100 МГц становить приблизно 2,998 м, тому ідеальний напівхвильовий диполь має загальну довжину приблизно 1,499 м, або приблизно 0,749 м на ногу. Практична антена може використовувати коефіцієнт укорочення, і її слід налаштовувати у встановленому середовищі."
      },
      {
        "question": "Яка довжина чвертьхвильової антени?",
        "answer": "Його ідеальна довжина провідника у вільному просторі становить одну чверть довжини хвилі: швидкість світла поділена на частоту вчетверо. Фактична налаштована довжина може відрізнятися залежно від провідника, живлення, заземлення та оточення."
      },
      {
        "question": "Що означає коефіцієнт скорочення?",
        "answer": "Він множить ідеальну довжину елемента вільного простору, щоб забезпечити початкову оцінку для практичного провідника. За замовчуванням це лише емпіричне правило; він не є коефіцієнтом швидкості коаксіального кабелю і не замінює вимірювання чи налаштування."
      },
      {
        "question": "Чи гарантує цей калькулятор налаштовану або безпечну антену?",
        "answer": "Ні. Він оцінює базову геометрію напівхвильового диполя або чвертьхвильового монополя. Справжній імпеданс і резонанс залежать від конструкції та місця розташування. Дотримуйтеся правил радіозв’язку та правил безпечного встановлення та перевіряйте за допомогою відповідних інструментів."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "sw": {
    "copyLanguage": "sw",
    "name": "Kikokotoo cha Urefu wa Antena",
    "title": "Kikokotoo cha Urefu cha Dipole Antenna Bila | UsefulVerse",
    "description": "Kadiria urefu wa antena ya nusu-wimbi au antena ya robo-wimbi kutoka kwa masafa. Matumizi ya kivinjari yasiyolipishwa na yasiyo na kikomo yenye kipengele...",
    "intro": "Kadiria dipole ya nusu-wimbi ya nafasi ya bure au monopole ya robo-wimbi kutoka kwa masafa. Rekebisha kipengele cha kufupisha ili kuona urefu wa kuanzia wa vitendo na kila mguu wa dipole.",
    "howQuestion": "Ninahesabuje urefu wa antenna ya dipole kutoka kwa masafa?",
    "howAnswer": "Kwanza hesabu urefu wa mawimbi kama kasi ya mwanga iliyogawanywa na marudio. Dipole ya nusu-wimbi ni karibu nusu ya urefu wa wimbi kwa jumla, na miguu miwili sawa; monopole ya robo-wimbi ni karibu robo moja. Kipengele cha ufupishaji kinachoweza kuhaririwa kinaweza kutoa makadirio ya kuanzia, lakini urefu wa mwisho unategemea muundo wa antena na mazingira.",
    "privacyQuestion": "Je, thamani za antena zangu zimepakiwa?",
    "privacyAnswer": "Hapana. Hesabu inaendeshwa katika kivinjari hiki; thamani ulizoingiza hazijapakiwa au kuhifadhiwa na zana hii.",
    "fields": {
      "mode": "Aina ya antenna",
      "dipole": "Dipole ya nusu-wimbi",
      "monopole": "Monopole ya wimbi la robo",
      "frequency": "Mzunguko wa uendeshaji",
      "frequencyUnit": "Kitengo cha masafa",
      "hz": "Hertz (Hz)",
      "khz": "Kilohertz (kHz)",
      "mhz": "Megahertz (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "Kipengele cha kufupisha (0.70–1.00)",
      "accuracyNote": "Hii inakadiria kondakta moja kwa moja, nyembamba katika nafasi ya bure. Kipengele cha kufupisha ni makadirio ya kuanzia inayoweza kubadilishwa, sio marekebisho ya ulimwengu wote; malisho, kipenyo cha kondakta, vitu vya karibu, ardhi na usakinishaji huathiri tuning. Pima na tune kwa usalama; hii si cheti cha muundo au tathmini ya usalama wa redio."
    },
    "actions": {
      "calculate": "Kuhesabu urefu wa antena",
      "reset": "Weka upya",
      "copy": "Nakili matokeo",
      "example": "Jaribu 100 MHz",
      "result": "Makadirio ya urefu wa antena"
    },
    "messages": {
      "calculated": "Kadirio la urefu wa antena limekokotolewa.",
      "checkInputs": "Weka frequency chanya halali, aina ya antena, kitengo na kipengele cha kufupisha kutoka 0.70 hadi 1.00.",
      "copied": "Matokeo yamenakiliwa.",
      "copyUnavailable": "Nakala haipatikani katika kivinjari hiki.",
      "wavelength": "Urefu wa mawimbi ya nafasi huru",
      "idealLength": "Urefu unaofaa kabla ya kufupisha",
      "adjustedLength": "Kadirio la urefu wa jumla uliorekebishwa",
      "elementLength": "Urefu wa kila mguu wa dipole",
      "imperialAdjusted": "Urefu wa jumla uliorekebishwa (miguu)",
      "factor": "Sababu ya kufupisha",
      "formula": "Mfumo"
    },
    "additionalFaqs": [
      {
        "question": "Je, ni urefu gani wa dipole ya nusu-wimbi kwa 100 MHz?",
        "answer": "Katika nafasi ya bure, urefu wa wimbi katika 100 MHz ni karibu 2.998 m, hivyo dipole bora ya nusu ya wimbi ni kuhusu 1.499 m jumla, au kuhusu 0.749 m kwa mguu. Antena ya vitendo inaweza kutumia kipengele cha kufupisha na inapaswa kupangwa katika mazingira yake yaliyowekwa."
      },
      {
        "question": "Antena ya robo-wimbi ina muda gani?",
        "answer": "Urefu wake bora wa kondakta wa nafasi ya bure ni robo moja ya urefu wa wimbi: kasi ya mwanga imegawanywa na mzunguko wa mara nne. Urefu halisi uliowekwa unaweza kutofautiana na kondakta, malisho, ardhi na mazingira."
      },
      {
        "question": "Je, kipengele cha kufupisha kinamaanisha nini?",
        "answer": "Huzidisha urefu wa kipengele cha nafasi huru ili kutoa makadirio ya kuanzia kwa kondakta wa vitendo. Chaguo-msingi ni kanuni ya kidole gumba; si kipengele cha kasi ya kebo ya koaxial na haichukui nafasi ya kipimo au kurekebisha."
      },
      {
        "question": "Je, kikokotoo hiki kinakuhakikishia antena iliyoboreshwa au salama?",
        "answer": "Hapana. Inakadiria dipole ya msingi ya nusu-wimbi au jiometri ya monopole ya robo-wimbi. Impedans halisi na resonance hutegemea ujenzi na tovuti. Fuata kanuni za redio na mbinu salama za usakinishaji, na uthibitishe kwa ala zinazofaa."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "mr": {
    "copyLanguage": "mr",
    "name": "अँटेना लांबी कॅल्क्युलेटर",
    "title": "द्विध्रुव अँटेना लांबी कॅल्क्युलेटर विनामूल्य | UsefulVerse",
    "description": "फ्रिक्वेंसीवरून अर्ध-वेव्ह द्विध्रुव किंवा क्वार्टर-वेव्ह अँटेना लांबीचा अंदाज लावा. संपादन करण्यायोग्य शॉर्टनिंग फॅक्टरसह विनामूल्य, अमर्यादित ब्राउझर वापर.",
    "intro": "फ्री-स्पेस हाफ-वेव्ह द्विध्रुव किंवा क्वार्टर-वेव्ह मोनोपोल फ्रिक्वेंसीवरून अंदाज लावा. व्यावहारिक सुरुवातीची लांबी आणि प्रत्येक द्विध्रुवीय पाय पाहण्यासाठी शॉर्टनिंग फॅक्टर समायोजित करा.",
    "howQuestion": "मी वारंवारतेवरून द्विध्रुवीय अँटेना लांबीची गणना कशी करू?",
    "howAnswer": "प्रथम तरंगलांबी मोजा प्रकाशाचा वेग फ्रिक्वेन्सीने भागून. अर्ध-वेव्ह द्विध्रुव हे दोन समान पायांसह एकूण तरंगलांबीच्या अर्धा आहे; एक चतुर्थांश लहरी मोनोपोल सुमारे एक चतुर्थांश आहे. संपादन करण्यायोग्य शॉर्टनिंग फॅक्टर व्यावहारिक प्रारंभिक अंदाज प्रदान करू शकतो, परंतु अंतिम लांबी अँटेना डिझाइन आणि परिसर यावर अवलंबून असते.",
    "privacyQuestion": "माझी अँटेना मूल्ये अपलोड केली आहेत का?",
    "privacyAnswer": "नाही. गणना या ब्राउझरमध्ये चालते; तुमची प्रविष्ट केलेली मूल्ये या साधनाद्वारे अपलोड किंवा जतन केलेली नाहीत.",
    "fields": {
      "mode": "अँटेना प्रकार",
      "dipole": "अर्ध-लहरी द्विध्रुव",
      "monopole": "क्वार्टर-वेव्ह मोनोपोल",
      "frequency": "ऑपरेटिंग वारंवारता",
      "frequencyUnit": "वारंवारता युनिट",
      "hz": "हर्ट्झ (Hz)",
      "khz": "किलोहर्ट्झ (kHz)",
      "mhz": "मेगाहर्ट्झ (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "शॉर्टनिंग फॅक्टर (0.70-1.00)",
      "accuracyNote": "हे मोकळ्या जागेत सरळ, पातळ कंडक्टरचा अंदाज लावते. शॉर्टनिंग फॅक्टर हा एक समायोज्य प्रारंभिक अंदाज आहे, सार्वत्रिक सुधारणा नाही; फीड, कंडक्टर व्यास, जवळपासच्या वस्तू, ग्राउंड आणि इंस्टॉलेशन ट्यूनिंगवर परिणाम करतात. सुरक्षितपणे मोजा आणि ट्यून करा; हे डिझाइन प्रमाणपत्र किंवा रेडिओ-सुरक्षा मूल्यांकन नाही."
    },
    "actions": {
      "calculate": "अँटेना लांबीची गणना करा",
      "reset": "रीसेट करा",
      "copy": "परिणाम कॉपी करा",
      "example": "100 MHz वापरून पहा",
      "result": "अँटेना लांबी अंदाज"
    },
    "messages": {
      "calculated": "अँटेना लांबी अंदाज मोजला.",
      "checkInputs": "वैध सकारात्मक वारंवारता, अँटेना प्रकार, एकक आणि 0.70 ते 1.00 पर्यंत शॉर्टनिंग घटक प्रविष्ट करा.",
      "copied": "परिणाम कॉपी केले.",
      "copyUnavailable": "कॉपी या ब्राउझरमध्ये उपलब्ध नाही.",
      "wavelength": "मोकळी जागा तरंगलांबी",
      "idealLength": "लहान करण्यापूर्वी आदर्श लांबी",
      "adjustedLength": "अंदाजे समायोजित एकूण लांबी",
      "elementLength": "प्रत्येक द्विध्रुवीय पायाची लांबी",
      "imperialAdjusted": "समायोजित एकूण लांबी (फूट)",
      "factor": "शॉर्टनिंग फॅक्टर",
      "formula": "सूत्र"
    },
    "additionalFaqs": [
      {
        "question": "100 MHz वर अर्ध-वेव्ह द्विध्रुवाची लांबी किती आहे?",
        "answer": "मोकळ्या जागेत, 100 मेगाहर्ट्झची तरंगलांबी सुमारे 2.998 मीटर आहे, म्हणून एक आदर्श अर्ध-लहरी द्विध्रुव एकूण 1.499 मीटर किंवा प्रति पाय सुमारे 0.749 मीटर आहे. व्यावहारिक अँटेना शॉर्टनिंग फॅक्टर वापरू शकतो आणि त्याच्या स्थापित वातावरणात ट्यून केला पाहिजे."
      },
      {
        "question": "क्वार्टर-वेव्ह अँटेना किती लांब आहे?",
        "answer": "त्याची आदर्श फ्री-स्पेस कंडक्टर लांबी तरंगलांबीच्या एक चतुर्थांश आहे: प्रकाशाचा वेग चारपट वारंवारता भागून. कंडक्टर, फीड, ग्राउंड आणि सभोवतालची वास्तविक ट्यून केलेली लांबी भिन्न असू शकते."
      },
      {
        "question": "शॉर्टनिंग फॅक्टर म्हणजे काय?",
        "answer": "हे व्यावहारिक कंडक्टरसाठी प्रारंभिक अंदाज प्रदान करण्यासाठी आदर्श मुक्त-स्पेस घटक लांबीचा गुणाकार करते. डीफॉल्ट हा केवळ एक नियम आहे; हा समाक्षीय केबल वेग घटक नाही आणि मापन किंवा ट्यूनिंग बदलत नाही."
      },
      {
        "question": "हे कॅल्क्युलेटर ट्यून केलेल्या किंवा सुरक्षित अँटेनाची हमी देते का?",
        "answer": "नाही. हे बेसिक हाफ-वेव्ह द्विध्रुव किंवा क्वार्टर-वेव्ह मोनोपोल भूमितीचा अंदाज लावते. वास्तविक प्रतिबाधा आणि अनुनाद बांधकाम आणि साइटवर अवलंबून असते. रेडिओ नियम आणि सुरक्षित प्रतिष्ठापन पद्धतींचे अनुसरण करा आणि योग्य साधनांसह सत्यापित करा."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "te": {
    "copyLanguage": "te",
    "name": "యాంటెన్నా పొడవు కాలిక్యులేటర్",
    "title": "డిపోల్ యాంటెన్నా పొడవు కాలిక్యులేటర్ ఉచితం | UsefulVerse",
    "description": "ఫ్రీక్వెన్సీ నుండి సగం-వేవ్ డైపోల్ లేదా క్వార్టర్-వేవ్ యాంటెన్నా పొడవును అంచనా వేయండి. సవరించగలిగే సంక్షిప్త కారకంతో ఉచిత, అపరిమిత బ్రౌజర్ ఉపయోగం.",
    "intro": "ఫ్రీక్వెన్సీ నుండి ఫ్రీ-స్పేస్ హాఫ్-వేవ్ డైపోల్ లేదా క్వార్టర్-వేవ్ మోనోపోల్‌ను అంచనా వేయండి. ప్రాక్టికల్ ప్రారంభ పొడవు మరియు ప్రతి ద్విధ్రువ కాలును చూడటానికి సంక్షిప్త కారకాన్ని సర్దుబాటు చేయండి.",
    "howQuestion": "నేను ఫ్రీక్వెన్సీ నుండి డైపోల్ యాంటెన్నా పొడవును ఎలా లెక్కించగలను?",
    "howAnswer": "కాంతి వేగాన్ని పౌనఃపున్యం ద్వారా విభజించినట్లు మొదట తరంగదైర్ఘ్యాన్ని లెక్కించండి. సగం-తరంగ ద్విధ్రువం మొత్తం తరంగదైర్ఘ్యంలో సగం, రెండు సమానమైన కాళ్లతో ఉంటుంది; క్వార్టర్-వేవ్ మోనోపోల్ దాదాపు పావు వంతు. సవరించగలిగే సంక్షిప్త కారకం ఆచరణాత్మక ప్రారంభ అంచనాను అందిస్తుంది, అయితే చివరి పొడవు యాంటెన్నా రూపకల్పన మరియు పరిసరాలపై ఆధారపడి ఉంటుంది.",
    "privacyQuestion": "నా యాంటెన్నా విలువలు అప్‌లోడ్ చేయబడిందా?",
    "privacyAnswer": "సంఖ్య. ఈ బ్రౌజర్‌లో గణన నడుస్తుంది; మీరు నమోదు చేసిన విలువలు ఈ సాధనం ద్వారా అప్‌లోడ్ చేయబడవు లేదా సేవ్ చేయబడవు.",
    "fields": {
      "mode": "యాంటెన్నా రకం",
      "dipole": "హాఫ్-వేవ్ డైపోల్",
      "monopole": "క్వార్టర్-వేవ్ మోనోపోల్",
      "frequency": "ఆపరేటింగ్ ఫ్రీక్వెన్సీ",
      "frequencyUnit": "ఫ్రీక్వెన్సీ యూనిట్",
      "hz": "హెర్ట్జ్ (Hz)",
      "khz": "కిలోహెర్ట్జ్ (kHz)",
      "mhz": "మెగాహెర్ట్జ్ (MHz)",
      "ghz": "గిగాహెర్ట్జ్ (GHz)",
      "shorteningFactor": "సంక్షిప్త కారకం (0.70–1.00)",
      "accuracyNote": "ఇది ఖాళీ స్థలంలో నేరుగా, సన్నని కండక్టర్‌ను అంచనా వేస్తుంది. సంక్షిప్త కారకం అనేది సర్దుబాటు చేయగల ప్రారంభ అంచనా, సార్వత్రిక దిద్దుబాటు కాదు; ఫీడ్, కండక్టర్ వ్యాసం, సమీపంలోని వస్తువులు, భూమి మరియు సంస్థాపన ట్యూనింగ్‌ను ప్రభావితం చేస్తాయి. సురక్షితంగా కొలవండి మరియు ట్యూన్ చేయండి; ఇది డిజైన్ సర్టిఫికేషన్ లేదా రేడియో-సేఫ్టీ అసెస్‌మెంట్ కాదు."
    },
    "actions": {
      "calculate": "యాంటెన్నా పొడవును లెక్కించండి",
      "reset": "రీసెట్ చేయండి",
      "copy": "ఫలితాలను కాపీ చేయండి",
      "example": "100 MHz ప్రయత్నించండి",
      "result": "యాంటెన్నా పొడవు అంచనా"
    },
    "messages": {
      "calculated": "యాంటెన్నా పొడవు అంచనా గణించబడింది.",
      "checkInputs": "చెల్లుబాటు అయ్యే సానుకూల ఫ్రీక్వెన్సీ, యాంటెన్నా రకం, యూనిట్ మరియు 0.70 నుండి 1.00 వరకు తగ్గించే కారకాన్ని నమోదు చేయండి.",
      "copied": "ఫలితాలు కాపీ చేయబడ్డాయి.",
      "copyUnavailable": "ఈ బ్రౌజర్‌లో కాపీ అందుబాటులో లేదు.",
      "wavelength": "ఖాళీ తరంగదైర్ఘ్యం",
      "idealLength": "కుదించే ముందు ఆదర్శ పొడవు",
      "adjustedLength": "సర్దుబాటు చేయబడిన మొత్తం పొడవు అంచనా వేయబడింది",
      "elementLength": "ప్రతి ద్విధ్రువ కాలు పొడవు",
      "imperialAdjusted": "సర్దుబాటు చేసిన మొత్తం పొడవు (అడుగులు)",
      "factor": "సంక్షిప్త కారకం",
      "formula": "ఫార్ములా"
    },
    "additionalFaqs": [
      {
        "question": "100 MHz వద్ద సగం-వేవ్ డైపోల్ పొడవు ఎంత?",
        "answer": "ఖాళీ స్థలంలో, 100 MHz వద్ద తరంగదైర్ఘ్యం దాదాపు 2.998 మీ, కాబట్టి ఆదర్శవంతమైన సగం-తరంగ ద్విధ్రువం మొత్తం 1.499 మీ లేదా కాలుకు 0.749 మీ. ప్రాక్టికల్ యాంటెన్నా క్లుప్తీకరణ కారకాన్ని ఉపయోగించవచ్చు మరియు దాని ఇన్‌స్టాల్ చేయబడిన వాతావరణంలో ట్యూన్ చేయబడాలి."
      },
      {
        "question": "క్వార్టర్-వేవ్ యాంటెన్నా పొడవు ఎంత?",
        "answer": "దీని ఆదర్శవంతమైన ఖాళీ-స్థల కండక్టర్ పొడవు తరంగదైర్ఘ్యంలో నాలుగింట ఒక వంతు: కాంతి వేగం నాలుగు రెట్లు పౌనఃపున్యంతో భాగించబడుతుంది. కండక్టర్, ఫీడ్, గ్రౌండ్ మరియు పరిసరాలతో అసలైన ట్యూన్ చేసిన పొడవు తేడా ఉంటుంది."
      },
      {
        "question": "సంక్షిప్త కారకం అంటే ఏమిటి?",
        "answer": "ఇది ఆచరణాత్మక కండక్టర్ కోసం ప్రారంభ అంచనాను అందించడానికి ఆదర్శవంతమైన ఖాళీ-స్థల మూలకం పొడవును గుణిస్తుంది. డిఫాల్ట్ అనేది ఒక నియమం మాత్రమే; ఇది ఏకాక్షక కేబుల్ వేగం కారకం కాదు మరియు కొలత లేదా ట్యూనింగ్‌ను భర్తీ చేయదు."
      },
      {
        "question": "ఈ కాలిక్యులేటర్ ట్యూన్ చేయబడిన లేదా సురక్షితమైన యాంటెన్నాకు హామీ ఇస్తుందా?",
        "answer": "సంఖ్య. ఇది ప్రాథమిక హాఫ్-వేవ్ డైపోల్ లేదా క్వార్టర్-వేవ్ మోనోపోల్ జ్యామితిని అంచనా వేస్తుంది. రియల్ ఇంపెడెన్స్ మరియు ప్రతిధ్వని నిర్మాణం మరియు సైట్‌పై ఆధారపడి ఉంటుంది. రేడియో నిబంధనలు మరియు సురక్షితమైన ఇన్‌స్టాలేషన్ పద్ధతులను అనుసరించండి మరియు తగిన సాధనాలతో ధృవీకరించండి."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "ha": {
    "copyLanguage": "ha",
    "name": "Kalkuleta Length Antenna",
    "title": "Calculator Tsawon Antenna Kyauta | UsefulVerse",
    "description": "Yi ƙididdige tsawon rabin igiyar igiyar ruwa dipole ko tsawon eriya ta kwata daga mita. Amfani da kyauta, mara iyaka na burauza tare da abin da ake iya gyarawa.",
    "intro": "Yi ƙididdige madaidaicin madaurin rabin-kala na dipole ko igiyar ruwa ta kwata daga mita. Daidaita abin gajarta don ganin tsawon farawa mai aiki da kowace ƙafar dipole.",
    "howQuestion": "Ta yaya zan lissafta tsawon eriyar dipole daga mita?",
    "howAnswer": "Da farko lissafta tsayin raƙuman ruwa azaman saurin haske da aka raba ta mita. Rabin rabin igiyar igiyar ruwa shine kusan rabin wannan tsayin tsayin duka, tare da ƙafafu guda biyu daidai; monopole na kwata-kwata kusan kashi ɗaya ne. Abun gajarta da za'a iya gyarawa na iya samar da kimanta farawa mai amfani, amma tsayin ƙarshe ya dogara da ƙirar eriya da kewaye.",
    "privacyQuestion": "Ana loda kimar eriya ta?",
    "privacyAnswer": "A'a. Lissafin yana gudana a cikin wannan mai binciken; Ba a loda kimar da aka shigar ko adana ta wannan kayan aikin.",
    "fields": {
      "mode": "Nau'in eriya",
      "dipole": "Half-wave dipole",
      "monopole": "monopole-kalaman kwata-kwata",
      "frequency": "Mitar aiki",
      "frequencyUnit": "Naúrar mita",
      "hz": "Hertz (Hz)",
      "khz": "Kilohertz (kHz)",
      "mhz": "Megahertz (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "Matsayin Gajewa (0.70-1.00)",
      "accuracyNote": "Wannan yana ƙididdige madaidaiciyar jagorar sirara a cikin sarari kyauta. Matsakaicin raguwa shine ƙididdigar farawa mai daidaitacce, ba gyara na duniya ba; ciyarwa, diamita madugu, abubuwa na kusa, ƙasa da shigarwa suna shafar daidaitawa. Auna da tune lafiya; wannan ba takardar shedar ƙira ba ce ko kimanta amincin rediyo."
    },
    "actions": {
      "calculate": "Yi lissafin tsawon eriya",
      "reset": "Sake saiti",
      "copy": "Kwafi sakamakon",
      "example": "Gwada 100 MHz",
      "result": "kimanta tsawon Eriya"
    },
    "messages": {
      "calculated": "An ƙididdige ƙimar tsayin eriya.",
      "checkInputs": "Shigar da ingantacciyar mita mai inganci, nau'in eriya, raka'a da gajarta abu daga 0.70 zuwa 1.00.",
      "copied": "An kwafi sakamakon.",
      "copyUnavailable": "Babu kwafi a cikin wannan burauzar.",
      "wavelength": "Tsawon zangon sararin samaniya",
      "idealLength": "Madaidaicin tsayi kafin ragewa",
      "adjustedLength": "Ƙimar da aka daidaita jimlar tsayi",
      "elementLength": "Tsawon kowane kafa dipole",
      "imperialAdjusted": "Daidaita jimlar tsayin (ƙafa)",
      "factor": "Abun gajarta",
      "formula": "Formula"
    },
    "additionalFaqs": [
      {
        "question": "Menene tsawon dipole mai raƙuman ruwa a 100 MHz?",
        "answer": "A cikin sarari kyauta, tsayin daka a 100 MHz yana kusan 2.998 m, don haka madaidaicin dipole rabin-ƙara shine kusan 1.499 m duka, ko kusan 0.749 m kowace ƙafa. Eriya mai aiki na iya amfani da abin ragewa kuma ya kamata a saurara a wurin da aka shigar."
      },
      {
        "question": "Yaya tsawon lokacin eriya-kwata?",
        "answer": "Madaidaicin jagorar jagorar sarari kyauta shine kashi ɗaya cikin huɗu na tsawon zango: saurin hasken da aka raba da mitar sau huɗu. Madaidaicin tsayin da aka daidaita zai iya bambanta tare da jagora, ciyarwa, ƙasa da kewaye."
      },
      {
        "question": "Menene ma'anar gajarta?",
        "answer": "Yana haɓaka tsayin ɓangarorin sarari kyauta don samar da ƙimar farawa don jagorar aiki. Tsoffin ka'ida ce kawai; ba shine ma'aunin saurin kebul na coaxial ba kuma baya maye gurbin aunawa ko kunnawa."
      },
      {
        "question": "Shin wannan kalkuleta yana ba da garantin eriya mai kyau ko aminci?",
        "answer": "A'a. Yana ƙididdige ainihin juzu'in juzu'in rabin igiyar igiyar ruwa ko kwata-kwata monopole geometry. Haƙiƙancin rashin ƙarfi da resonance ya dogara da ginin da wurin. Bi dokokin rediyo da amintattun ayyukan shigarwa, kuma tabbatar da kayan aiki masu dacewa."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "tl": {
    "copyLanguage": "tl",
    "name": "Calculator ng Haba ng Antenna",
    "title": "Dipole Antenna Length Calculator Libre | UsefulVerse",
    "description": "Tantyahin ang half-wave dipole o quarter-wave na haba ng antenna mula sa frequency. Libre, walang limitasyong paggamit ng browser na may nae-edit na...",
    "intro": "Tantyahin ang isang free-space half-wave dipole o quarter-wave monopole mula sa frequency. Ayusin ang shortening factor para makita ang praktikal na panimulang haba at bawat dipole leg.",
    "howQuestion": "Paano ko kalkulahin ang haba ng dipole antenna mula sa dalas?",
    "howAnswer": "Una kalkulahin ang wavelength bilang ang bilis ng liwanag na hinati sa dalas. Ang kalahating alon na dipole ay halos kalahati ng haba ng daluyong iyon sa kabuuan, na may dalawang magkapantay na paa; ang isang quarter-wave monopole ay halos isang quarter. Ang isang nae-edit na shortening factor ay maaaring magbigay ng praktikal na panimulang pagtatantya, ngunit ang huling haba ay depende sa disenyo ng antenna at kapaligiran.",
    "privacyQuestion": "Na-upload ba ang aking mga halaga ng antenna?",
    "privacyAnswer": "Hindi. Ang pagkalkula ay tumatakbo sa browser na ito; ang iyong mga inilagay na halaga ay hindi na-upload o nai-save ng tool na ito.",
    "fields": {
      "mode": "Uri ng antena",
      "dipole": "Half-wave dipole",
      "monopole": "Quarter-wave monopole",
      "frequency": "Dalas ng pagpapatakbo",
      "frequencyUnit": "Unit ng dalas",
      "hz": "Hertz (Hz)",
      "khz": "Kilohertz (kHz)",
      "mhz": "Megahertz (MHz)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "Salik ng pagpapaikli (0.70–1.00)",
      "accuracyNote": "Tinatantya nito ang isang tuwid, manipis na konduktor sa libreng espasyo. Ang shortening factor ay isang adjustable na panimulang pagtatantya, hindi isang unibersal na pagwawasto; feed, diameter ng conductor, mga kalapit na bagay, lupa at pag-install ay nakakaapekto sa pag-tune. Sukatin at ibagay nang ligtas; hindi ito isang sertipikasyon sa disenyo o pagtatasa ng kaligtasan sa radyo."
    },
    "actions": {
      "calculate": "Kalkulahin ang haba ng antena",
      "reset": "I-reset",
      "copy": "Kopyahin ang mga resulta",
      "example": "Subukan ang 100 MHz",
      "result": "pagtatantya ng haba ng antena"
    },
    "messages": {
      "calculated": "Kinakalkula ang pagtatantya ng haba ng antena.",
      "checkInputs": "Maglagay ng wastong positibong frequency, uri ng antenna, unit at shortening factor mula 0.70 hanggang 1.00.",
      "copied": "Nakopya ang mga resulta.",
      "copyUnavailable": "Hindi available ang kopya sa browser na ito.",
      "wavelength": "Free-space na wavelength",
      "idealLength": "Tamang-tama ang haba bago paikliin",
      "adjustedLength": "Tinantyang na-adjust ang kabuuang haba",
      "elementLength": "Haba ng bawat dipole leg",
      "imperialAdjusted": "Inayos ang kabuuang haba (feet)",
      "factor": "Salik ng pagpapaikli",
      "formula": "Formula"
    },
    "additionalFaqs": [
      {
        "question": "Ano ang haba ng isang half-wave dipole sa 100 MHz?",
        "answer": "Sa libreng espasyo, ang wavelength sa 100 MHz ay ​​humigit-kumulang 2.998 m, kaya ang perpektong kalahating alon na dipole ay humigit-kumulang 1.499 m sa kabuuan, o mga 0.749 m bawat binti. Ang isang praktikal na antenna ay maaaring gumamit ng shortening factor at dapat na nakatutok sa naka-install na kapaligiran nito."
      },
      {
        "question": "Gaano katagal ang isang quarter-wave antenna?",
        "answer": "Ang perpektong haba ng free-space na conductor nito ay isang quarter ng wavelength: bilis ng liwanag na hinati sa apat na beses na frequency. Ang aktwal na nakatutok na haba ay maaaring mag-iba sa konduktor, feed, lupa at paligid."
      },
      {
        "question": "Ano ang ibig sabihin ng shortening factor?",
        "answer": "Pinaparami nito ang perpektong haba ng elemento ng libreng espasyo upang magbigay ng panimulang pagtatantya para sa isang praktikal na konduktor. Ang default ay isang panuntunan lamang ng hinlalaki; hindi ito ang coaxial cable velocity factor at hindi pinapalitan ang pagsukat o pag-tune."
      },
      {
        "question": "Ginagarantiya ba ng calculator na ito ang isang nakatutok o ligtas na antenna?",
        "answer": "Hindi. Tinatantya nito ang pangunahing half-wave dipole o quarter-wave monopole geometry. Ang tunay na impedance at resonance ay nakasalalay sa konstruksyon at sa site. Sundin ang mga regulasyon sa radyo at ligtas na mga kasanayan sa pag-install, at i-verify gamit ang angkop na mga instrumento."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "ta": {
    "copyLanguage": "ta",
    "name": "ஆண்டெனா நீள கால்குலேட்டர்",
    "title": "இருமுனை ஆண்டெனா நீள கால்குலேட்டர் இலவசம் | UsefulVerse",
    "description": "அதிர்வெண்ணிலிருந்து அரை-அலை இருமுனை அல்லது கால்-அலை ஆண்டெனா நீளத்தை மதிப்பிடவும். திருத்தக்கூடிய சுருக்கக் காரணியுடன் இலவச, வரம்பற்ற உலாவி பயன்பாடு.",
    "intro": "அதிர்வெண்ணிலிருந்து ஒரு இலவச-இட அரை-அலை இருமுனை அல்லது கால்-அலை மோனோபோலைக் கணக்கிடுங்கள். ஒரு நடைமுறை தொடக்க நீளம் மற்றும் ஒவ்வொரு இருமுனை கால்களையும் பார்க்க சுருக்க காரணியை சரிசெய்யவும்.",
    "howQuestion": "அதிர்வெண்ணிலிருந்து இருமுனை ஆண்டெனா நீளத்தை எவ்வாறு கணக்கிடுவது?",
    "howAnswer": "முதலில் அலைநீளத்தை ஒளியின் வேகத்தை அதிர்வெண்ணால் வகுக்க வேண்டும். ஒரு அரை-அலை இருமுனையானது, இரண்டு சமமான கால்களைக் கொண்ட மொத்த அலைநீளத்தில் பாதி ஆகும்; கால்-அலை மோனோபோல் என்பது கால் பகுதி. திருத்தக்கூடிய சுருக்கக் காரணி ஒரு நடைமுறை தொடக்க மதிப்பீட்டை வழங்க முடியும், ஆனால் இறுதி நீளம் ஆண்டெனா வடிவமைப்பு மற்றும் சுற்றுப்புறங்களைப் பொறுத்தது.",
    "privacyQuestion": "எனது ஆண்டெனா மதிப்புகள் பதிவேற்றப்பட்டதா?",
    "privacyAnswer": "எண். கணக்கீடு இந்த உலாவியில் இயங்குகிறது; நீங்கள் உள்ளிட்ட மதிப்புகள் இந்தக் கருவியால் பதிவேற்றம் செய்யப்படவில்லை அல்லது சேமிக்கப்படவில்லை.",
    "fields": {
      "mode": "ஆண்டெனா வகை",
      "dipole": "அரை-அலை இருமுனை",
      "monopole": "காலாண்டு அலை மோனோபோல்",
      "frequency": "இயக்க அதிர்வெண்",
      "frequencyUnit": "அதிர்வெண் அலகு",
      "hz": "ஹெர்ட்ஸ் (Hz)",
      "khz": "கிலோஹெர்ட்ஸ் (kHz)",
      "mhz": "மெகாஹெர்ட்ஸ் (MHz)",
      "ghz": "ஜிகாஹெர்ட்ஸ் (GHz)",
      "shorteningFactor": "சுருக்கக் காரணி (0.70–1.00)",
      "accuracyNote": "இது இலவச இடத்தில் நேரான, மெல்லிய கடத்தியை மதிப்பிடுகிறது. சுருக்கக் காரணி ஒரு அனுசரிப்பு தொடக்க மதிப்பீடாகும், உலகளாவிய திருத்தம் அல்ல; ஊட்டம், கடத்தி விட்டம், அருகில் உள்ள பொருள்கள், தரை மற்றும் நிறுவல் ஆகியவை டியூனிங்கை பாதிக்கின்றன. பாதுகாப்பாக அளவிடவும் மற்றும் டியூன் செய்யவும்; இது வடிவமைப்புச் சான்றிதழ் அல்லது ரேடியோ-பாதுகாப்பு மதிப்பீடு அல்ல."
    },
    "actions": {
      "calculate": "ஆண்டெனா நீளத்தைக் கணக்கிடுங்கள்",
      "reset": "மீட்டமை",
      "copy": "முடிவுகளை நகலெடுக்கவும்",
      "example": "100 மெகா ஹெர்ட்ஸ் முயற்சி",
      "result": "ஆண்டெனா நீளம் மதிப்பீடு"
    },
    "messages": {
      "calculated": "ஆண்டெனா நீளம் கணக்கிடப்பட்டது.",
      "checkInputs": "சரியான நேர்மறை அதிர்வெண், ஆண்டெனா வகை, அலகு மற்றும் 0.70 முதல் 1.00 வரை சுருக்கக் காரணி ஆகியவற்றை உள்ளிடவும்.",
      "copied": "முடிவுகள் நகலெடுக்கப்பட்டன.",
      "copyUnavailable": "இந்த உலாவியில் நகல் கிடைக்கவில்லை.",
      "wavelength": "இலவச-வெளி அலைநீளம்",
      "idealLength": "சுருக்குவதற்கு முன் சிறந்த நீளம்",
      "adjustedLength": "மதிப்பிடப்பட்ட சரிசெய்யப்பட்ட மொத்த நீளம்",
      "elementLength": "ஒவ்வொரு இருமுனை காலின் நீளம்",
      "imperialAdjusted": "சரிசெய்யப்பட்ட மொத்த நீளம் (அடி)",
      "factor": "சுருக்கக் காரணி",
      "formula": "சூத்திரம்"
    },
    "additionalFaqs": [
      {
        "question": "100 மெகா ஹெர்ட்ஸில் அரை-அலை இருமுனையின் நீளம் என்ன?",
        "answer": "இலவச இடத்தில், 100 மெகா ஹெர்ட்ஸ் அலைநீளம் சுமார் 2.998 மீ ஆகும், எனவே ஒரு சிறந்த அரை-அலை இருமுனையானது மொத்தம் 1.499 மீ அல்லது ஒரு காலுக்கு 0.749 மீ. ஒரு நடைமுறை ஆண்டெனா ஒரு சுருக்கக் காரணியைப் பயன்படுத்தலாம் மற்றும் அதன் நிறுவப்பட்ட சூழலில் டியூன் செய்யப்பட வேண்டும்."
      },
      {
        "question": "கால்-அலை ஆண்டெனா எவ்வளவு நீளமானது?",
        "answer": "அதன் சிறந்த இலவச-வெளி கடத்தி நீளம் அலைநீளத்தின் கால் பகுதி: ஒளியின் வேகம் நான்கு மடங்கு அதிர்வெண்ணால் வகுக்கப்படுகிறது. உண்மையான டியூன் செய்யப்பட்ட நீளம் கடத்தி, தீவனம், தரை மற்றும் சுற்றுப்புறத்துடன் வேறுபடலாம்."
      },
      {
        "question": "சுருக்கக் காரணி என்றால் என்ன?",
        "answer": "ஒரு நடைமுறை நடத்துனருக்கான தொடக்க மதிப்பீட்டை வழங்க இது சிறந்த இலவச-வெளி உறுப்பு நீளத்தை பெருக்குகிறது. இயல்புநிலை என்பது கட்டைவிரல் விதி மட்டுமே; இது கோஆக்சியல் கேபிள் வேகக் காரணி அல்ல மற்றும் அளவீடு அல்லது டியூனிங்கை மாற்றாது."
      },
      {
        "question": "இந்த கால்குலேட்டர் டியூன் செய்யப்பட்ட அல்லது பாதுகாப்பான ஆண்டெனாவுக்கு உத்தரவாதம் அளிக்குமா?",
        "answer": "எண். இது அடிப்படை அரை-அலை இருமுனை அல்லது கால்-அலை மோனோபோல் வடிவவியலை மதிப்பிடுகிறது. உண்மையான மின்மறுப்பு மற்றும் அதிர்வு கட்டுமானம் மற்றும் தளத்தைப் பொறுத்தது. ரேடியோ விதிமுறைகள் மற்றும் பாதுகாப்பான நிறுவல் நடைமுறைகளைப் பின்பற்றவும், பொருத்தமான கருவிகளைக் கொண்டு சரிபார்க்கவும்."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "fa": {
    "copyLanguage": "fa",
    "name": "ماشین حساب طول آنتن",
    "title": "ماشین حساب طول آنتن دوقطبی رایگان | UsefulVerse",
    "description": "طول آنتن دوقطبی یا یک چهارم موج را از فرکانس تخمین بزنید. استفاده از مرورگر رایگان و نامحدود با ضریب کوتاه‌کننده قابل ویرایش.",
    "intro": "یک دوقطبی نیمه موج فضای آزاد یا تک قطبی موج چهارم را از روی فرکانس تخمین بزنید. ضریب کوتاه شدن را تنظیم کنید تا طول شروع عملی و هر پایه دوقطبی را مشاهده کنید.",
    "howQuestion": "چگونه طول آنتن دوقطبی را از فرکانس محاسبه کنم؟",
    "howAnswer": "ابتدا طول موج را بر حسب سرعت نور تقسیم بر فرکانس محاسبه کنید. دوقطبی نیم موج تقریباً نصف کل طول موج است، با دو پایه مساوی. یک تک قطبی موج یک چهارم حدود یک چهارم است. یک ضریب کوتاه کننده قابل ویرایش می تواند یک تخمین شروع عملی ارائه دهد، اما طول نهایی به طراحی آنتن و محیط اطراف بستگی دارد.",
    "privacyQuestion": "آیا مقادیر آنتن من آپلود شده است؟",
    "privacyAnswer": "نه. محاسبه در این مرورگر انجام می شود. مقادیر وارد شده شما توسط این ابزار آپلود یا ذخیره نمی شوند.",
    "fields": {
      "mode": "نوع آنتن",
      "dipole": "دوقطبی نیم موج",
      "monopole": "تک قطبی موج چهارم",
      "frequency": "فرکانس کاری",
      "frequencyUnit": "واحد فرکانس",
      "hz": "هرتز (هرتز)",
      "khz": "کیلوهرتز (کیلوهرتز)",
      "mhz": "مگاهرتز (MHz)",
      "ghz": "گیگاهرتز (گیگاهرتز)",
      "shorteningFactor": "ضریب کوتاه کننده (0.70-1.00)",
      "accuracyNote": "این یک هادی مستقیم و نازک را در فضای آزاد تخمین می زند. ضریب کوتاه شدن یک تخمین شروع قابل تنظیم است، نه یک اصلاح جهانی. تغذیه، قطر هادی، اجسام مجاور، زمین و نصب بر تنظیم تاثیر می گذارند. اندازه گیری و تنظیم ایمن؛ این یک گواهی طراحی یا ارزیابی ایمنی رادیویی نیست."
    },
    "actions": {
      "calculate": "محاسبه طول آنتن",
      "reset": "بازنشانی کنید",
      "copy": "نتایج را کپی کنید",
      "example": "100 مگاهرتز را امتحان کنید",
      "result": "تخمین طول آنتن"
    },
    "messages": {
      "calculated": "تخمین طول آنتن محاسبه شد.",
      "checkInputs": "فرکانس مثبت معتبر، نوع آنتن، واحد و ضریب کوتاه کننده را از 0.70 تا 1.00 وارد کنید.",
      "copied": "نتایج کپی شد.",
      "copyUnavailable": "کپی در این مرورگر موجود نیست.",
      "wavelength": "طول موج فضای آزاد",
      "idealLength": "طول ایده آل قبل از کوتاه کردن",
      "adjustedLength": "طول کل تنظیم شده تخمینی",
      "elementLength": "طول هر پایه دوقطبی",
      "imperialAdjusted": "طول کل تنظیم شده (فوت)",
      "factor": "عامل کوتاه کننده",
      "formula": "فرمول"
    },
    "additionalFaqs": [
      {
        "question": "طول یک دوقطبی نیم موج در 100 مگاهرتز چقدر است؟",
        "answer": "در فضای آزاد، طول موج در 100 مگاهرتز حدود 2.998 متر است، بنابراین یک دوقطبی نیمه موج ایده آل حدود 1.499 متر یا حدود 0.749 متر در هر پا است. یک آنتن کاربردی ممکن است از یک ضریب کوتاه کننده استفاده کند و باید در محیط نصب شده خود تنظیم شود."
      },
      {
        "question": "طول آنتن ربع موج چقدر است؟",
        "answer": "طول هادی فضای آزاد ایده آل آن یک چهارم طول موج است: سرعت نور تقسیم بر چهار برابر فرکانس. طول تنظیم شده واقعی می تواند با هادی، تغذیه، زمین و محیط اطراف متفاوت باشد."
      },
      {
        "question": "فاکتور کوتاه کننده به چه معناست؟",
        "answer": "طول عنصر فضای آزاد ایده‌آل را چند برابر می‌کند تا یک تخمین اولیه برای یک هادی عملی ارائه کند. پیش فرض فقط یک قانون سرانگشتی است. این ضریب سرعت کابل کواکسیال نیست و جایگزین اندازه گیری یا تنظیم نمی شود."
      },
      {
        "question": "آیا این ماشین حساب یک آنتن تنظیم شده یا ایمن را تضمین می کند؟",
        "answer": "خیر. هندسه دو قطبی نیمه موجی یا تک قطبی یک چهارم موجی را تخمین می زند. امپدانس و رزونانس واقعی به ساخت و ساز و محل بستگی دارد. از مقررات رادیویی و روش‌های نصب ایمن پیروی کنید و با ابزار مناسب بررسی کنید."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "am": {
    "copyLanguage": "am",
    "name": "የአንቴና ርዝመት ማስያ",
    "title": "Dipole አንቴና ርዝመት ካልኩሌተር ነጻ | UsefulVerse",
    "description": "የግማሽ ሞገድ ዲፖል ወይም የሩብ ሞገድ አንቴና ርዝመት ከድግግሞሽ ይገምቱ። ነፃ፣ ያልተገደበ የአሳሽ አጠቃቀም ከአርትኦት ማሳጠር ጋር።",
    "intro": "ከድግግሞሽ ነፃ-ቦታ የግማሽ ሞገድ ዲፖል ወይም የሩብ-ማዕበል ሞኖፖል ይገምቱ። ተግባራዊ የመነሻ ርዝመት እና እያንዳንዱን የዲፕሎፕ እግር ለማየት የማሳጠር ሁኔታን ያስተካክሉ።",
    "howQuestion": "የዲፕሎል አንቴና ርዝመትን ከድግግሞሽ እንዴት ማስላት እችላለሁ?",
    "howAnswer": "በመጀመሪያ የሞገድ ርዝመትን እንደ የብርሃን ፍጥነት በድግግሞሽ ይከፋፈላል። የግማሽ ሞገድ ዳይፖል በጠቅላላው የሞገድ ርዝመት ግማሽ ያህል ነው, ሁለት እኩል እግሮች ያሉት; የሩብ ሞገድ ሞኖፖል አንድ አራተኛ ያህል ነው። ሊስተካከል የሚችል የማሳጠር ሁኔታ ተግባራዊ የሆነ የመነሻ ግምት ሊሰጥ ይችላል፣ ነገር ግን የመጨረሻው ርዝመት በአንቴና ዲዛይን እና አካባቢ ላይ የተመሰረተ ነው።",
    "privacyQuestion": "የኔ አንቴና እሴቶቼ ተሰቅለዋል?",
    "privacyAnswer": "አይደለም ስሌቱ በዚህ አሳሽ ውስጥ ይሰራል; የገቡት ዋጋዎች በዚህ መሳሪያ አልተሰቀሉም ወይም አልተቀመጡም።",
    "fields": {
      "mode": "የአንቴና ዓይነት",
      "dipole": "የግማሽ ሞገድ ዲፖል",
      "monopole": "የሩብ ሞገድ ሞኖፖል",
      "frequency": "የክወና ድግግሞሽ",
      "frequencyUnit": "የድግግሞሽ ክፍል",
      "hz": "ሄርትዝ (ኤች)",
      "khz": "ኪሎኸርትዝ (kHz)",
      "mhz": "ሜጋኸርትዝ (ሜኸ)",
      "ghz": "Gigahertz (GHz)",
      "shorteningFactor": "የማሳጠር ሁኔታ (0.70-1.00)",
      "accuracyNote": "ይህ በነፃ ቦታ ላይ ቀጥ ያለ ቀጭን ማስተላለፊያ ይገምታል. ማሳጠር የሚስተካከለው መነሻ ግምት እንጂ ሁለንተናዊ እርማት አይደለም። መጋቢ፣ የኦርኬክተሩ ዲያሜትር፣ በአቅራቢያ ያሉ ነገሮች፣ መሬት እና ተከላ በማስተካከል ላይ ተጽዕኖ ያሳድራል። በጥንቃቄ ይለኩ እና ያስተካክሉ; ይህ የንድፍ ማረጋገጫ ወይም የሬዲዮ-ደህንነት ግምገማ አይደለም።"
    },
    "actions": {
      "calculate": "የአንቴናውን ርዝመት አስሉ",
      "reset": "ዳግም አስጀምር",
      "copy": "ውጤቶችን ቅዳ",
      "example": "100 ሜኸር ይሞክሩ",
      "result": "የአንቴና ርዝመት ግምት"
    },
    "messages": {
      "calculated": "የአንቴና ርዝመት ግምት ይሰላል።",
      "checkInputs": "ትክክለኛ የሆነ አወንታዊ ድግግሞሽ፣ የአንቴና አይነት፣ አሃድ እና የማሳጠር ሁኔታ ከ0.70 እስከ 1.00 ያስገቡ።",
      "copied": "ውጤቶች ተቀድተዋል።",
      "copyUnavailable": "ቅጂ በዚህ አሳሽ ውስጥ አይገኝም።",
      "wavelength": "የነጻ-ቦታ የሞገድ ርዝመት",
      "idealLength": "ከማሳጠርዎ በፊት ተስማሚ ርዝመት",
      "adjustedLength": "የተገመተው የተስተካከለ ጠቅላላ ርዝመት",
      "elementLength": "የእያንዳንዱ የዲፕል እግር ርዝመት",
      "imperialAdjusted": "የተስተካከለ ጠቅላላ ርዝመት (እግር)",
      "factor": "የማሳጠር ሁኔታ",
      "formula": "ፎርሙላ"
    },
    "additionalFaqs": [
      {
        "question": "በ 100 ሜኸር ያለው የግማሽ ሞገድ ዲፖል ርዝመት ስንት ነው?",
        "answer": "በነጻ ቦታ፣ በ100 ሜኸር ያለው የሞገድ ርዝመት 2.998 ሜትር ያህል ነው፣ ስለዚህ ጥሩ የግማሽ ሞገድ ዳይፖል 1.499 ሜትር በድምሩ፣ ወይም በአንድ እግር 0.749 ሜትር ያህል ነው። ተግባራዊ አንቴና የማሳጠር ሁኔታን ሊጠቀም ይችላል እና በተጫነው አካባቢ መስተካከል አለበት።"
      },
      {
        "question": "የሩብ ሞገድ አንቴና ለምን ያህል ጊዜ ነው?",
        "answer": "ጥሩው የነፃ ቦታ መሪ ርዝመት አንድ አራተኛ የሞገድ ርዝመት ነው፡ የብርሃን ፍጥነት በአራት እጥፍ ድግግሞሽ ይከፈላል። ትክክለኛው የተስተካከለ ርዝመት ከኮንዳክተሩ, ከመመገብ, ከመሬት እና ከአካባቢው ጋር ሊለያይ ይችላል."
      },
      {
        "question": "ማሳጠር ምን ማለት ነው?",
        "answer": "ለተግባራዊ መሪ መነሻ ግምት ለማቅረብ ተስማሚውን የነጻ-ቦታ ኤለመንት ርዝመት ያባዛል። ነባሪው አንድ ደንብ ብቻ ነው; የኮአክሲያል የኬብል ፍጥነት ሁኔታ አይደለም እና መለኪያን ወይም ማስተካከያን አይተካም."
      },
      {
        "question": "ይህ ካልኩሌተር የተስተካከለ ወይም ደህንነቱ የተጠበቀ አንቴና ዋስትና ይሰጣል?",
        "answer": "አይደለም መሰረታዊ የግማሽ ሞገድ ዲፖል ወይም የሩብ ሞገድ ሞኖፖል ጂኦሜትሪ ይገመታል። እውነተኛው ተቃውሞ እና ሬዞናንስ በግንባታ እና በጣቢያው ላይ ይወሰናል. የሬዲዮ ደንቦችን እና ደህንነቱ የተጠበቀ የመጫኛ ልምዶችን ይከተሉ እና ተስማሚ በሆኑ መሳሪያዎች ያረጋግጡ."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  },
  "gu": {
    "copyLanguage": "gu",
    "name": "એન્ટેના લંબાઈ કેલ્ક્યુલેટર",
    "title": "ડીપોલ એન્ટેના લેન્થ કેલ્ક્યુલેટર ફ્રી | UsefulVerse",
    "description": "આવર્તનથી અર્ધ-તરંગ દ્વિધ્રુવ અથવા ક્વાર્ટર-વેવ એન્ટેના લંબાઈનો અંદાજ કાઢો. સંપાદનયોગ્ય શોર્ટનિંગ ફેક્ટર સાથે મફત, અમર્યાદિત બ્રાઉઝરનો ઉપયોગ.",
    "intro": "ફ્રીક્વન્સી પરથી ફ્રી-સ્પેસ હાફ-વેવ દ્વિધ્રુવ અથવા ક્વાર્ટર-વેવ મોનોપોલનો અંદાજ કાઢો. પ્રાયોગિક પ્રારંભિક લંબાઈ અને દરેક દ્વિધ્રુવ પગને જોવા માટે શોર્ટનિંગ ફેક્ટરને સમાયોજિત કરો.",
    "howQuestion": "હું આવર્તનથી દ્વિધ્રુવીય એન્ટેના લંબાઈની ગણતરી કેવી રીતે કરી શકું?",
    "howAnswer": "પ્રથમ તરંગલંબાઇની ગણતરી પ્રકાશની ઝડપને આવર્તન દ્વારા વિભાજિત કરો. અર્ધ-તરંગ દ્વિધ્રુવ બે સમાન પગ સાથે, કુલ તરંગલંબાઇ કરતાં અડધી હોય છે; એક ક્વાર્ટર-વેવ મોનોપોલ લગભગ એક ક્વાર્ટર છે. સંપાદનયોગ્ય શોર્ટનિંગ પરિબળ વ્યવહારુ પ્રારંભિક અંદાજ આપી શકે છે, પરંતુ અંતિમ લંબાઈ એન્ટેના ડિઝાઇન અને આસપાસના પર આધાર રાખે છે.",
    "privacyQuestion": "શું મારા એન્ટેના મૂલ્યો અપલોડ થયા છે?",
    "privacyAnswer": "નંબર. આ બ્રાઉઝરમાં ગણતરી ચાલે છે; તમારા દાખલ કરેલ મૂલ્યો આ સાધન દ્વારા અપલોડ અથવા સાચવવામાં આવતા નથી.",
    "fields": {
      "mode": "એન્ટેના પ્રકાર",
      "dipole": "અર્ધ-તરંગ દ્વિધ્રુવ",
      "monopole": "ક્વાર્ટર-વેવ મોનોપોલ",
      "frequency": "ઓપરેટિંગ આવર્તન",
      "frequencyUnit": "આવર્તન એકમ",
      "hz": "હર્ટ્ઝ (હર્ટ્ઝ)",
      "khz": "કિલોહર્ટ્ઝ (kHz)",
      "mhz": "મેગાહર્ટ્ઝ (MHz)",
      "ghz": "ગીગાહર્ટ્ઝ (ગીગાહર્ટ્ઝ)",
      "shorteningFactor": "શોર્ટનિંગ ફેક્ટર (0.70–1.00)",
      "accuracyNote": "આ ખાલી જગ્યામાં સીધા, પાતળા વાહકનો અંદાજ કાઢે છે. શોર્ટનિંગ ફેક્ટર એ એડજસ્ટેબલ પ્રારંભિક અંદાજ છે, સાર્વત્રિક કરેક્શન નથી; ફીડ, કંડક્ટર વ્યાસ, નજીકની વસ્તુઓ, જમીન અને ઇન્સ્ટોલેશન ટ્યુનિંગને અસર કરે છે. માપો અને સુરક્ષિત રીતે ટ્યુન કરો; આ કોઈ ડિઝાઇન પ્રમાણપત્ર અથવા રેડિયો-સલામતી મૂલ્યાંકન નથી."
    },
    "actions": {
      "calculate": "એન્ટેના લંબાઈની ગણતરી કરો",
      "reset": "રીસેટ કરો",
      "copy": "પરિણામોની નકલ કરો",
      "example": "100 MHz અજમાવી જુઓ",
      "result": "એન્ટેના લંબાઈ અંદાજ"
    },
    "messages": {
      "calculated": "એન્ટેના લંબાઈ અંદાજ ગણતરી.",
      "checkInputs": "માન્ય હકારાત્મક આવર્તન, એન્ટેના પ્રકાર, એકમ અને 0.70 થી 1.00 સુધી શોર્ટનિંગ ફેક્ટર દાખલ કરો.",
      "copied": "પરિણામોની નકલ કરી.",
      "copyUnavailable": "આ બ્રાઉઝરમાં નકલ ઉપલબ્ધ નથી.",
      "wavelength": "ફ્રી-સ્પેસ તરંગલંબાઇ",
      "idealLength": "ટૂંકા કરતા પહેલા આદર્શ લંબાઈ",
      "adjustedLength": "અંદાજિત સમાયોજિત કુલ લંબાઈ",
      "elementLength": "દરેક દ્વિધ્રુવ પગની લંબાઈ",
      "imperialAdjusted": "સમાયોજિત કુલ લંબાઈ (ફીટ)",
      "factor": "શોર્ટનિંગ ફેક્ટર",
      "formula": "ફોર્મ્યુલા"
    },
    "additionalFaqs": [
      {
        "question": "100 MHz પર અર્ધ-તરંગ દ્વિધ્રુવની લંબાઈ કેટલી છે?",
        "answer": "ખાલી જગ્યામાં, 100 MHz પર તરંગલંબાઇ લગભગ 2.998 મીટર છે, તેથી આદર્શ અર્ધ-તરંગ દ્વિધ્રુવ લગભગ 1.499 મીટર, અથવા લગભગ 0.749 મીટર પ્રતિ પગ છે. પ્રાયોગિક એન્ટેના શોર્ટનિંગ ફેક્ટરનો ઉપયોગ કરી શકે છે અને તેને તેના ઇન્સ્ટોલ કરેલા વાતાવરણમાં ટ્યુન કરવું જોઈએ."
      },
      {
        "question": "ક્વાર્ટર-વેવ એન્ટેના કેટલો લાંબો છે?",
        "answer": "તેની આદર્શ ફ્રી-સ્પેસ વાહક લંબાઈ તરંગલંબાઇનો એક ક્વાર્ટર છે: પ્રકાશની ઝડપ ચાર ગણી આવર્તન દ્વારા વિભાજિત. વાસ્તવિક ટ્યુન કરેલ લંબાઈ કંડક્ટર, ફીડ, જમીન અને આસપાસના વિસ્તારો સાથે અલગ હોઈ શકે છે."
      },
      {
        "question": "શોર્ટનિંગ ફેક્ટરનો અર્થ શું થાય છે?",
        "answer": "તે પ્રાયોગિક વાહક માટે પ્રારંભિક અંદાજ પૂરો પાડવા માટે આદર્શ ફ્રી-સ્પેસ તત્વ લંબાઈનો ગુણાકાર કરે છે. મૂળભૂત માત્ર અંગૂઠાનો નિયમ છે; તે કોક્સિયલ કેબલ વેગ પરિબળ નથી અને માપન અથવા ટ્યુનિંગને બદલતું નથી."
      },
      {
        "question": "શું આ કેલ્ક્યુલેટર ટ્યુન કરેલ અથવા સુરક્ષિત એન્ટેનાની ખાતરી આપે છે?",
        "answer": "ના. તે મૂળભૂત હાફ-વેવ દ્વિધ્રુવ અથવા ક્વાર્ટર-વેવ મોનોપોલ ભૂમિતિનો અંદાજ કાઢે છે. વાસ્તવિક અવબાધ અને પડઘો બાંધકામ અને સાઇટ પર આધાર રાખે છે. રેડિયો નિયમો અને સલામત સ્થાપન પદ્ધતિઓનું પાલન કરો અને યોગ્ય સાધનો વડે ચકાસો."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-10"
  }
};

export default antennaLengthCalculatorCopies;
