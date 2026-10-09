const pulleyCalculatorCopies = {
  "en": {
    "copyLanguage": "en",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Pulley Calculator",
    "title": "Pulley Calculator Free & Unlimited | UsefulVerse",
    "description": "Estimate belt length, pulley RPM and belt speed from two diameters and center distance. Free, local and unlimited.",
    "intro": "Estimate the pitch length and speed relationship for a simple open belt between two pulleys. Enter dimensions in the same unit.",
    "howQuestion": "How do you calculate belt length between two pulleys?",
    "howAnswer": "For an open two-pulley drive, this calculator uses a common approximation based on center distance and the two pulley diameters. It also estimates driven RPM from the diameter ratio, assuming no slip.",
    "privacyQuestion": "Are my measurements uploaded?",
    "privacyAnswer": "No. All calculations and the sketch are generated in this browser; your measurements are not uploaded or saved.",
    "fields": {
      "driverDiameter": "Driver pulley diameter",
      "drivenDiameter": "Driven pulley diameter",
      "centerDistance": "Distance between pulley centers",
      "diameterUnit": "Dimension unit",
      "millimeters": "Millimeters (mm)",
      "inches": "Inches (in)",
      "inputRpm": "Driver input speed (RPM)",
      "accuracyNote": "Approximate pitch length for an ideal, open two-pulley belt. Use the same unit for all dimensions. Real belt length and speed can differ with belt profile, pitch, tension, slip, wear and tolerances. This does not select a purchasable belt or assess power, guarding or safety. Check manufacturer data before use. Runs locally; no upload.",
      "sketchTitle": "Open-belt layout (not to scale)",
      "sketchDescription": "Diagram of two pulleys connected by an open belt, with the driver on the left and driven pulley on the right."
    },
    "actions": {
      "calculate": "Calculate belt drive",
      "reset": "Reset",
      "copy": "Copy results",
      "example": "Load example",
      "result": "Estimated results"
    },
    "messages": {
      "copied": "Results copied.",
      "copyUnavailable": "Copy is not available in this browser.",
      "calculated": "Belt-drive estimate calculated.",
      "checkInputs": "Check both diameters, center distance, unit and input RPM.",
      "beltLength": "Approximate belt pitch length",
      "outputRpm": "Ideal driven speed",
      "speedRatio": "Speed ratio (driver / driven)",
      "beltSpeed": "Driver belt speed",
      "smallWrap": "Approximate wrap on smaller pulley",
      "model": "Model",
      "openBelt": "Open two-pulley approximation"
    },
    "additionalFaqs": [
      {
        "question": "What is the approximate belt-length formula?",
        "answer": "A common open-belt pitch-length approximation is L ≈ 2C + 1.57(D + d) + (D − d)²/(4C), where C is center distance and D and d are the larger and smaller pulley pitch diameters. Actual belt selection should use the manufacturer’s pitch and sizing data."
      },
      {
        "question": "How does pulley diameter change RPM?",
        "answer": "With no slip, driven RPM is approximately input RPM multiplied by driver diameter and divided by driven diameter. A larger driven pulley reduces speed; a larger driver pulley increases it."
      },
      {
        "question": "Does this calculator include belt slip or tension?",
        "answer": "No. It is an ideal geometry and ratio estimate for an open two-pulley layout. It does not account for slip, tension, belt construction, load, wear or catalog belt sizes."
      },
      {
        "question": "Can I use the estimate to order a belt?",
        "answer": "Use it as a first estimate only. Confirm belt pitch, profile, effective length, center adjustment and manufacturer sizing tables before buying or operating a drive."
      }
    ]
  },
  "es": {
    "copyLanguage": "es",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Calculadora de poleas",
    "title": "Calculadora de poleas gratis e ilimitada | UsefulVerse",
    "description": "Calcule la longitud de la correa, las RPM de la polea y la velocidad de la correa a partir de dos diámetros y la distancia entre centros. Gratis, local e...",
    "intro": "Calcule la relación entre la longitud del paso y la velocidad para una correa abierta simple entre dos poleas. Introduzca las dimensiones en la misma unidad.",
    "howQuestion": "¿Cómo se calcula la longitud de la correa entre dos poleas?",
    "howAnswer": "Para una transmisión abierta de dos poleas, esta calculadora utiliza una aproximación común basada en la distancia entre centros y los diámetros de las dos poleas. También estima las RPM impulsadas a partir de la relación de diámetros, suponiendo que no haya deslizamiento.",
    "privacyQuestion": "¿Están cargadas mis medidas?",
    "privacyAnswer": "No. Todos los cálculos y el boceto se generan en este navegador; sus medidas no se cargan ni se guardan.",
    "fields": {
      "driverDiameter": "Diámetro de la polea conductora",
      "drivenDiameter": "Diámetro de la polea conducida",
      "centerDistance": "Distancia entre centros de poleas",
      "diameterUnit": "Unidad de dimensión",
      "millimeters": "Milímetros (mm)",
      "inches": "Pulgadas (pulg)",
      "inputRpm": "Velocidad de entrada del conductor (RPM)",
      "accuracyNote": "Longitud de paso aproximada para una correa abierta ideal de dos poleas. Utilice la misma unidad para todas las dimensiones. La longitud y velocidad reales de la correa pueden diferir según el perfil, el paso, la tensión, el deslizamiento, el desgaste y las tolerancias de la correa. Esto no selecciona un cinturón que se pueda comprar ni evalúa la potencia, la protección o la seguridad. Verifique los datos del fabricante antes de su uso. Se ejecuta localmente; sin carga.",
      "sketchTitle": "Diseño de cinturón abierto (no a escala)",
      "sketchDescription": "Esquema de dos poleas unidas por una correa abierta, con la polea conductora a la izquierda y la polea conducida a la derecha."
    },
    "actions": {
      "calculate": "Calcular la transmisión por correa",
      "reset": "Reiniciar",
      "copy": "Copiar resultados",
      "example": "Cargar ejemplo",
      "result": "Resultados estimados"
    },
    "messages": {
      "copied": "Resultados copiados.",
      "copyUnavailable": "La copia no está disponible en este navegador.",
      "calculated": "Estimación de transmisión por correa calculada.",
      "checkInputs": "Verifique ambos diámetros, distancia entre centros, unidad y RPM de entrada.",
      "beltLength": "Longitud aproximada del paso de la correa",
      "outputRpm": "Velocidad de conducción ideal",
      "speedRatio": "Relación de velocidad (conductor/conducido)",
      "beltSpeed": "Velocidad de la correa del conductor",
      "smallWrap": "Envoltura aproximada en polea más pequeña",
      "model": "Modelo",
      "openBelt": "Aproximación abierta de dos poleas"
    },
    "additionalFaqs": [
      {
        "question": "¿Cuál es la fórmula aproximada de la longitud del cinturón?",
        "answer": "Una aproximación común de la longitud del paso de una correa abierta es L ≈ 2C + 1,57 (D + d) + (D − d)²/(4C), donde C es la distancia entre centros y D y d son los diámetros de paso de las poleas mayores y menores. La selección real de la correa debe utilizar los datos de paso y tamaño del fabricante."
      },
      {
        "question": "¿Cómo cambia el diámetro de la polea en las RPM?",
        "answer": "Sin deslizamiento, las RPM impulsadas son aproximadamente las RPM de entrada multiplicadas por el diámetro del impulsor y divididas por el diámetro impulsado. Una polea conducida más grande reduce la velocidad; una polea impulsora más grande lo aumenta."
      },
      {
        "question": "¿Esta calculadora incluye el deslizamiento o la tensión de la correa?",
        "answer": "No. Es una estimación ideal de geometría y relación para un diseño abierto de dos poleas. No tiene en cuenta el deslizamiento, la tensión, la construcción de la correa, la carga, el desgaste ni los tamaños de la correa del catálogo."
      },
      {
        "question": "¿Puedo utilizar el presupuesto para pedir un cinturón?",
        "answer": "Úselo sólo como una primera estimación. Confirme el paso de la correa, el perfil, la longitud efectiva, el ajuste central y las tablas de tamaños del fabricante antes de comprar u operar una transmisión."
      }
    ]
  },
  "fr": {
    "copyLanguage": "fr",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Calculateur de poulie",
    "title": "Calculatrice de poulie gratuite et illimitée | UsefulVerse",
    "description": "Estimez la longueur de la courroie, le régime de la poulie et la vitesse de la courroie à partir de deux diamètres et d'un entraxe. Gratuit, local et illimité.",
    "intro": "Estimez la relation entre la longueur du pas et la vitesse pour une simple courroie ouverte entre deux poulies. Entrez les dimensions dans la même unité.",
    "howQuestion": "Comment calculer la longueur de la courroie entre deux poulies ?",
    "howAnswer": "Pour un entraînement ouvert à deux poulies, ce calculateur utilise une approximation courante basée sur l'entraxe et les deux diamètres de poulie. Il estime également le régime moteur à partir du rapport des diamètres, en supposant qu'il n'y a pas de glissement.",
    "privacyQuestion": "Mes mesures sont-elles téléchargées ?",
    "privacyAnswer": "Non. Tous les calculs et le croquis sont générés dans ce navigateur ; vos mesures ne sont ni téléchargées ni enregistrées.",
    "fields": {
      "driverDiameter": "Diamètre de la poulie motrice",
      "drivenDiameter": "Diamètre de la poulie menée",
      "centerDistance": "Distance entre les centres des poulies",
      "diameterUnit": "Unité de dimension",
      "millimeters": "Millimètres (mm)",
      "inches": "Pouces (po)",
      "inputRpm": "Vitesse d'entrée du pilote (RPM)",
      "accuracyNote": "Longueur de pas approximative pour une courroie idéale et ouverte à deux poulies. Utilisez la même unité pour toutes les dimensions. La longueur et la vitesse réelles de la courroie peuvent différer selon le profil, le pas, la tension, le glissement, l'usure et les tolérances de la courroie. Cela ne sélectionne pas une ceinture achetable ni n’évalue la puissance, la protection ou la sécurité. Vérifiez les données du fabricant avant utilisation. Fonctionne localement ; pas de téléchargement.",
      "sketchTitle": "Disposition à ceinture ouverte (pas à l'échelle)",
      "sketchDescription": "Schéma de deux poulies reliées par une courroie ouverte, avec l'entraîneur à gauche et la poulie menée à droite."
    },
    "actions": {
      "calculate": "Calculer l'entraînement par courroie",
      "reset": "Réinitialiser",
      "copy": "Copier les résultats",
      "example": "Charger un exemple",
      "result": "Résultats estimés"
    },
    "messages": {
      "copied": "Résultats copiés.",
      "copyUnavailable": "La copie n'est pas disponible dans ce navigateur.",
      "calculated": "Estimation d'entraînement par courroie calculée.",
      "checkInputs": "Vérifiez les deux diamètres, l’entraxe, l’unité et le régime d’entrée.",
      "beltLength": "Longueur approximative du pas de courroie",
      "outputRpm": "Vitesse de conduite idéale",
      "speedRatio": "Rapport de vitesse (conducteur/entraîné)",
      "beltSpeed": "Vitesse de la courroie du conducteur",
      "smallWrap": "Enroulement approximatif sur une poulie plus petite",
      "model": "Modèle",
      "openBelt": "approximation ouverte à deux poulies"
    },
    "additionalFaqs": [
      {
        "question": "Quelle est la formule approximative de la longueur de la ceinture ?",
        "answer": "Une approximation courante de la longueur de pas de courroie ouverte est L ≈ 2C + 1,57(D + d) + (D − d)²/(4C), où C est l'entraxe et D et d sont les diamètres de pas de poulie plus grands et plus petits. La sélection réelle de la courroie doit utiliser les données de pas et de dimensionnement du fabricant."
      },
      {
        "question": "Comment le diamètre de la poulie change-t-il le régime ?",
        "answer": "Sans glissement, le régime entraîné correspond approximativement au régime d'entrée multiplié par le diamètre de l'entraîneur et divisé par le diamètre entraîné. Une poulie entraînée plus grande réduit la vitesse ; une poulie motrice plus grande l'augmente."
      },
      {
        "question": "Ce calculateur inclut-il le glissement ou la tension de la courroie ?",
        "answer": "Non. Il s’agit d’une estimation idéale de la géométrie et du rapport pour une configuration ouverte à deux poulies. Il ne tient pas compte du glissement, de la tension, de la construction de la courroie, de la charge, de l'usure ou des tailles de courroie du catalogue."
      },
      {
        "question": "Puis-je utiliser le devis pour commander une ceinture ?",
        "answer": "Utilisez-le uniquement comme première estimation. Confirmez le pas de courroie, le profil, la longueur efficace, le réglage central et les tableaux de dimensionnement du fabricant avant d'acheter ou d'utiliser un entraînement."
      }
    ]
  },
  "pt": {
    "copyLanguage": "pt",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Calculadora de polia",
    "title": "Calculadora de polias grátis e ilimitada | UsefulVerse",
    "description": "Estime o comprimento da correia, as RPM da polia e a velocidade da correia a partir de dois diâmetros e distância central. Gratuito, local e ilimitado.",
    "intro": "Estime o comprimento do passo e a relação de velocidade para uma correia aberta simples entre duas polias. Insira as dimensões na mesma unidade.",
    "howQuestion": "Como você calcula o comprimento da correia entre duas polias?",
    "howAnswer": "Para um acionamento aberto de duas polias, esta calculadora usa uma aproximação comum baseada na distância central e nos diâmetros das duas polias. Ele também estima as RPM acionadas a partir da relação de diâmetro, assumindo que não há escorregamento.",
    "privacyQuestion": "Minhas medições são carregadas?",
    "privacyAnswer": "Não. Todos os cálculos e o esboço são gerados neste navegador; suas medições não são carregadas ou salvas.",
    "fields": {
      "driverDiameter": "Diâmetro da polia motriz",
      "drivenDiameter": "Diâmetro da polia acionada",
      "centerDistance": "Distância entre centros de polias",
      "diameterUnit": "Unidade de dimensão",
      "millimeters": "Milímetros (mm)",
      "inches": "Polegadas (pol.)",
      "inputRpm": "Velocidade de entrada do driver (RPM)",
      "accuracyNote": "Comprimento aproximado do passo para uma correia ideal de duas polias abertas. Use a mesma unidade para todas as dimensões. O comprimento e a velocidade reais da correia podem diferir de acordo com o perfil, passo, tensão, deslizamento, desgaste e tolerâncias da correia. Isso não seleciona um cinto comprável nem avalia potência, proteção ou segurança. Verifique os dados do fabricante antes de usar. Executa localmente; sem upload.",
      "sketchTitle": "Layout de faixa aberta (sem escala)",
      "sketchDescription": "Diagrama de duas polias conectadas por uma correia aberta, com a polia acionadora à esquerda e a polia acionada à direita."
    },
    "actions": {
      "calculate": "Calcular transmissão por correia",
      "reset": "Reiniciar",
      "copy": "Copiar resultados",
      "example": "Exemplo de carregamento",
      "result": "Resultados estimados"
    },
    "messages": {
      "copied": "Resultados copiados.",
      "copyUnavailable": "A cópia não está disponível neste navegador.",
      "calculated": "Estimativa de transmissão por correia calculada.",
      "checkInputs": "Verifique ambos os diâmetros, distância central, unidade e RPM de entrada.",
      "beltLength": "Comprimento aproximado do passo da correia",
      "outputRpm": "Velocidade ideal de condução",
      "speedRatio": "Relação de velocidade (motorista/conduzido)",
      "beltSpeed": "Velocidade da correia condutora",
      "smallWrap": "Envolvimento aproximado na polia menor",
      "model": "Modelo",
      "openBelt": "Aproximação aberta de duas polias"
    },
    "additionalFaqs": [
      {
        "question": "Qual é a fórmula aproximada do comprimento do cinto?",
        "answer": "Uma aproximação comum do comprimento do passo da correia aberta é L ≈ 2C + 1,57(D + d) + (D − d)²/(4C), onde C é a distância central e D e d são os diâmetros primitivos da polia maiores e menores. A seleção real da correia deve usar os dados de inclinação e dimensionamento do fabricante."
      },
      {
        "question": "Como o diâmetro da polia muda o RPM?",
        "answer": "Sem deslizamento, o RPM acionado é aproximadamente o RPM de entrada multiplicado pelo diâmetro do acionador e dividido pelo diâmetro acionado. Uma polia acionada maior reduz a velocidade; uma polia condutora maior aumenta isso."
      },
      {
        "question": "Esta calculadora inclui deslizamento ou tensão da correia?",
        "answer": "Não. É uma estimativa ideal de geometria e proporção para um layout aberto de duas polias. Ele não leva em consideração deslizamento, tensão, construção da correia, carga, desgaste ou tamanhos de correia catalogados."
      },
      {
        "question": "Posso usar o orçamento para encomendar um cinto?",
        "answer": "Use-o apenas como uma primeira estimativa. Confirme o passo da correia, o perfil, o comprimento efetivo, o ajuste central e as tabelas de dimensionamento do fabricante antes de comprar ou operar um inversor."
      }
    ]
  },
  "de": {
    "copyLanguage": "de",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Riemenscheibenrechner",
    "title": "Riemenscheibenrechner kostenlos und | UsefulVerse",
    "description": "Schätzen Sie die Riemenlänge, die Riemenscheibendrehzahl und die Riemengeschwindigkeit anhand von zwei Durchmessern und einem Achsabstand. Kostenlos, lokal...",
    "intro": "Schätzen Sie die Beziehung zwischen Teilungslänge und Geschwindigkeit für einen einfachen offenen Riemen zwischen zwei Riemenscheiben. Geben Sie die Abmessungen in derselben Einheit ein.",
    "howQuestion": "Wie berechnet man die Riemenlänge zwischen zwei Riemenscheiben?",
    "howAnswer": "Für einen offenen Antrieb mit zwei Riemenscheiben verwendet dieser Rechner eine allgemeine Näherung, die auf dem Achsabstand und den beiden Riemenscheibendurchmessern basiert. Es schätzt auch die angetriebene Drehzahl aus dem Durchmesserverhältnis unter der Annahme, dass kein Schlupf vorliegt.",
    "privacyQuestion": "Werden meine Maße hochgeladen?",
    "privacyAnswer": "Nein. Alle Berechnungen und die Skizze werden in diesem Browser erstellt; Ihre Messungen werden nicht hochgeladen oder gespeichert.",
    "fields": {
      "driverDiameter": "Durchmesser der Antriebsriemenscheibe",
      "drivenDiameter": "Durchmesser der angetriebenen Riemenscheibe",
      "centerDistance": "Abstand zwischen den Riemenscheibenmitten",
      "diameterUnit": "Maßeinheit",
      "millimeters": "Millimeter (mm)",
      "inches": "Zoll (in)",
      "inputRpm": "Fahrereingangsgeschwindigkeit (U/min)",
      "accuracyNote": "Ungefähre Teilungslänge für einen idealen, offenen Riemen mit zwei Riemenscheiben. Verwenden Sie für alle Dimensionen die gleiche Einheit. Die tatsächliche Riemenlänge und -geschwindigkeit kann je nach Riemenprofil, Teilung, Spannung, Schlupf, Verschleiß und Toleranzen variieren. Dabei wird weder ein käuflicher Gürtel ausgewählt noch Leistung, Schutz oder Sicherheit beurteilt. Vor Gebrauch Herstellerangaben prüfen. Läuft lokal; kein Upload.",
      "sketchTitle": "Offenes Bandlayout (nicht maßstabsgetreu)",
      "sketchDescription": "Diagramm von zwei Riemenscheiben, die durch einen offenen Riemen verbunden sind, mit der Antriebsriemenscheibe links und der Abtriebsriemenscheibe rechts."
    },
    "actions": {
      "calculate": "Riemenantrieb berechnen",
      "reset": "Zurücksetzen",
      "copy": "Ergebnisse kopieren",
      "example": "Beispiel laden",
      "result": "Geschätzte Ergebnisse"
    },
    "messages": {
      "copied": "Ergebnisse kopiert.",
      "copyUnavailable": "Das Kopieren ist in diesem Browser nicht verfügbar.",
      "calculated": "Schätzung des Riemenantriebs berechnet.",
      "checkInputs": "Überprüfen Sie beide Durchmesser, den Achsabstand, die Einheit und die Eingangsdrehzahl.",
      "beltLength": "Ungefähre Teilungslänge des Riemens",
      "outputRpm": "Ideale Fahrgeschwindigkeit",
      "speedRatio": "Geschwindigkeitsverhältnis (Fahrer / angetrieben)",
      "beltSpeed": "Geschwindigkeit des Antriebsriemens",
      "smallWrap": "Ungefähre Umschlingung bei kleinerer Riemenscheibe",
      "model": "Modell",
      "openBelt": "Offene Zwei-Riemenscheiben-Näherung"
    },
    "additionalFaqs": [
      {
        "question": "Wie lautet die ungefähre Formel für die Gürtellänge?",
        "answer": "Eine übliche Näherung für die Teilungslänge offener Riemen ist L ≈ 2C + 1,57(D + d) + (D − d)²/(4C), wobei C der Achsabstand und D und d die größeren und kleineren Teilungsdurchmesser der Riemenscheiben sind. Bei der tatsächlichen Riemenauswahl sollten die Teilungs- und Größendaten des Herstellers berücksichtigt werden."
      },
      {
        "question": "Wie verändert der Riemenscheibendurchmesser die Drehzahl?",
        "answer": "Ohne Schlupf ist die angetriebene Drehzahl ungefähr die Eingangsdrehzahl, multipliziert mit dem Antriebsdurchmesser und dividiert durch den angetriebenen Durchmesser. Eine größere angetriebene Riemenscheibe verringert die Geschwindigkeit; eine größere Antriebsscheibe erhöht sie."
      },
      {
        "question": "Berücksichtigt dieser Rechner den Riemenschlupf oder die Riemenspannung?",
        "answer": "Nein. Es handelt sich um eine ideale Geometrie- und Übersetzungsschätzung für ein offenes Zwei-Riemenscheiben-Layout. Schlupf, Spannung, Riemenkonstruktion, Belastung, Verschleiß oder Kataloggrößen der Riemen werden dabei nicht berücksichtigt."
      },
      {
        "question": "Kann ich den Kostenvoranschlag nutzen, um einen Gürtel zu bestellen?",
        "answer": "Verwenden Sie es nur als erste Schätzung. Überprüfen Sie die Riementeilung, das Profil, die effektive Länge, die Mitteneinstellung und die Größentabellen des Herstellers, bevor Sie einen Antrieb kaufen oder in Betrieb nehmen."
      }
    ]
  },
  "ja": {
    "copyLanguage": "ja",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "プーリー計算機",
    "title": "滑車計算機無料&無制限 | UsefulVerse",
    "description": "2 つの直径と中心距離からベルトの長さ、プーリーの回転数、ベルト速度を推定します。無料、ローカル、無制限。",
    "intro": "2 つのプーリー間の単純なオープン ベルトのピッチ長さと速度の関係を推定します。寸法も同じ単位で入力してください。",
    "howQuestion": "2 つのプーリー間のベルトの長さはどのように計算しますか?",
    "howAnswer": "オープン 2 プーリー ドライブの場合、この計算機は中心距離と 2 つのプーリーの直径に基づく一般的な近似を使用します。また、スリップがないと仮定して、直径比から駆動回転数を推定します。",
    "privacyQuestion": "私の測定値はアップロードされていますか?",
    "privacyAnswer": "いいえ。すべての計算とスケッチはこのブラウザで生成されます。測定値はアップロードまたは保存されません。",
    "fields": {
      "driverDiameter": "ドライバープーリー径",
      "drivenDiameter": "従動プーリー径",
      "centerDistance": "プーリ中心間距離",
      "diameterUnit": "寸法単位",
      "millimeters": "ミリメートル (mm)",
      "inches": "インチ (インチ)",
      "inputRpm": "ドライバー入力速度 (RPM)",
      "accuracyNote": "理想的なオープン 2 プーリー ベルトのおおよそのピッチ長さ。すべての寸法に同じ単位を使用します。実際のベルトの長さと速度は、ベルトのプロファイル、ピッチ、張力、滑り、摩耗、公差によって異なります。これは、購入可能なベルトを選択したり、パワー、ガード、安全性を評価したりするものではありません。使用前にメーカーのデータを確認してください。ローカルで実行します。アップロードはありません。",
      "sketchTitle": "オープンベルトのレイアウト (縮尺は一定ではありません)",
      "sketchDescription": "開いたベルトで接続された 2 つのプーリーの図。左側がドライバー、右側が従動プーリーです。"
    },
    "actions": {
      "calculate": "ベルトドライブの計算",
      "reset": "リセット",
      "copy": "結果をコピーする",
      "example": "負荷例",
      "result": "推定結果"
    },
    "messages": {
      "copied": "結果がコピーされました。",
      "copyUnavailable": "このブラウザではコピーできません。",
      "calculated": "ベルトドライブの推定値を計算しました。",
      "checkInputs": "直径、中心距離、単位、入力 RPM の両方を確認してください。",
      "beltLength": "ベルトピッチ長さの目安",
      "outputRpm": "理想的な駆動速度",
      "speedRatio": "速度比（ドライバー/ドリブン）",
      "beltSpeed": "ドライバーベルトの速度",
      "smallWrap": "小さい方のプーリーにおおよその巻き付き",
      "model": "モデル",
      "openBelt": "開いた 2 つのプーリーの近似"
    },
    "additionalFaqs": [
      {
        "question": "ベルトの長さのおおよその計算式は何ですか?",
        "answer": "一般的なオープンベルトのピッチ長の近似は、L ≈ 2C + 1.57(D + d) + (D − d)²/(4C) です。ここで、C は中心距離、D と d は大きいプーリー ピッチ直径と小さいプーリー ピッチ直径です。実際のベルトの選択には、メーカーのピッチとサイズのデータ​​を使用する必要があります。"
      },
      {
        "question": "プーリーの直径によって回転数はどのように変化しますか?",
        "answer": "スリップがない場合、被駆動 RPM は、およそ入力 RPM にドライバー直径を掛け、被駆動直径で除算した値になります。従動プーリーが大きいと速度が低下します。ドライバープーリーを大きくすると増加します。"
      },
      {
        "question": "この計算にはベルトのスリップや張力が含まれますか?",
        "answer": "いいえ。これは、オープン 2 プーリー レイアウトの理想的なジオメトリと比率の推定値です。スリップ、張力、ベルトの構造、負荷、摩耗、カタログのベルト サイズは考慮されていません。"
      },
      {
        "question": "見積書を利用してベルトを注文することはできますか?",
        "answer": "最初の見積もりとしてのみ使用してください。ドライブを購入または操作する前に、ベルトピッチ、プロファイル、有効長、中心調整、およびメーカーのサイズ表を確認してください。"
      }
    ]
  },
  "ko": {
    "copyLanguage": "ko",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "풀리 계산기",
    "title": "풀리 계산기 무료 및 무제한 | UsefulVerse",
    "description": "두 개의 직경과 중심 거리로부터 벨트 길이, 풀리 RPM 및 벨트 속도를 추정합니다. 무료, 지역 및 무제한.",
    "intro": "두 풀리 사이의 단순한 개방형 벨트에 대한 피치 길이와 속도 관계를 추정합니다. 동일한 단위로 치수를 입력합니다.",
    "howQuestion": "두 풀리 사이의 벨트 길이를 어떻게 계산합니까?",
    "howAnswer": "개방형 2개 풀리 드라이브의 경우 이 계산기는 중심 거리와 두 개의 풀리 직경을 기반으로 한 일반적인 근사치를 사용합니다. 또한 미끄러짐이 없다고 가정하여 직경 비율로부터 구동 ​​RPM을 추정합니다.",
    "privacyQuestion": "내 측정값이 업로드되나요?",
    "privacyAnswer": "아니요. 모든 계산과 스케치는 이 브라우저에서 생성됩니다. 측정값이 업로드되거나 저장되지 않습니다.",
    "fields": {
      "driverDiameter": "드라이버 풀리 직경",
      "drivenDiameter": "종동 풀리 직경",
      "centerDistance": "풀리 중심 사이의 거리",
      "diameterUnit": "차원 단위",
      "millimeters": "밀리미터(mm)",
      "inches": "인치(인치)",
      "inputRpm": "드라이버 입력 속도(RPM)",
      "accuracyNote": "이상적인 개방형 2개 풀리 벨트의 대략적인 피치 길이입니다. 모든 치수에 동일한 단위를 사용합니다. 실제 벨트 길이와 속도는 벨트 프로파일, 피치, 장력, 미끄러짐, 마모 및 공차에 따라 다를 수 있습니다. 이는 구매 가능한 벨트를 선택하거나 전력, 보호 또는 안전을 평가하지 않습니다. 사용하기 전에 제조업체 데이터를 확인하십시오. 로컬로 실행됩니다. 업로드가 없습니다.",
      "sketchTitle": "개방형 벨트 레이아웃(규모에 맞지 않음)",
      "sketchDescription": "개방형 벨트로 연결된 두 개의 도르래 다이어그램(왼쪽에 구동 장치, 오른쪽에 종동 도르래 포함)."
    },
    "actions": {
      "calculate": "벨트 구동 계산",
      "reset": "다시 놓기",
      "copy": "결과 복사",
      "example": "로드 예시",
      "result": "예상 결과"
    },
    "messages": {
      "copied": "결과가 복사되었습니다.",
      "copyUnavailable": "이 브라우저에서는 복사할 수 없습니다.",
      "calculated": "벨트 구동 추정치가 계산되었습니다.",
      "checkInputs": "직경, 중심 거리, 단위 및 입력 RPM을 모두 확인하십시오.",
      "beltLength": "대략적인 벨트 피치 길이",
      "outputRpm": "이상적인 구동 속도",
      "speedRatio": "속도비(운전자/구동)",
      "beltSpeed": "드라이버 벨트 속도",
      "smallWrap": "더 작은 도르래를 대략적으로 감음",
      "model": "모델",
      "openBelt": "개방형 2-풀리 근사"
    },
    "additionalFaqs": [
      {
        "question": "대략적인 벨트 길이 공식은 무엇입니까?",
        "answer": "일반적인 오픈 벨트 피치 길이 근사치는 L ≒ 2C + 1.57(D + d) + (D − d)²/(4C)입니다. 여기서 C는 중심 거리이고 D와 d는 더 크고 작은 풀리 피치 직경입니다. 실제 벨트 선택에는 제조업체의 피치 및 크기 데이터를 사용해야 합니다."
      },
      {
        "question": "풀리 직경은 RPM을 어떻게 변경합니까?",
        "answer": "슬립이 없는 경우 구동 RPM은 대략 입력 RPM에 드라이버 직경을 곱하고 구동 직경으로 나눈 값입니다. 더 큰 종동 풀리는 속도를 감소시킵니다. 더 큰 드라이버 풀리가 증가합니다."
      },
      {
        "question": "이 계산기에는 벨트 미끄러짐이나 장력이 포함되어 있습니까?",
        "answer": "아니요. 이는 개방형 2개 풀리 레이아웃에 대한 이상적인 형상 및 비율 추정치입니다. 미끄러짐, 장력, 벨트 구성, 하중, 마모 또는 카탈로그 벨트 크기는 고려되지 않습니다."
      },
      {
        "question": "견적을 사용하여 벨트를 주문할 수 있나요?",
        "answer": "첫 번째 추정치로만 사용하십시오. 드라이브를 구입하거나 작동하기 전에 벨트 피치, 프로파일, 유효 길이, 중심 조정 및 제조업체 크기 조정 테이블을 확인하십시오."
      }
    ]
  },
  "id": {
    "copyLanguage": "id",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Kalkulator Katrol",
    "title": "Kalkulator Katrol Gratis & Tidak Terbatas | UsefulVerse",
    "description": "Perkirakan panjang sabuk, RPM katrol, dan kecepatan sabuk dari dua diameter dan jarak tengah. Gratis, lokal, dan tidak terbatas.",
    "intro": "Perkirakan hubungan panjang nada dan kecepatan untuk sabuk terbuka sederhana antara dua katrol. Masukkan dimensi dalam satuan yang sama.",
    "howQuestion": "Bagaimana cara menghitung panjang sabuk antara dua katrol?",
    "howAnswer": "Untuk penggerak dua katrol terbuka, kalkulator ini menggunakan perkiraan umum berdasarkan jarak pusat dan diameter kedua katrol. Ia juga memperkirakan RPM yang didorong dari rasio diameter, dengan asumsi tidak ada slip.",
    "privacyQuestion": "Apakah pengukuran saya diunggah?",
    "privacyAnswer": "Tidak. Semua perhitungan dan sketsa dibuat di browser ini; pengukuran Anda tidak diunggah atau disimpan.",
    "fields": {
      "driverDiameter": "Diameter katrol penggerak",
      "drivenDiameter": "Diameter katrol yang digerakkan",
      "centerDistance": "Jarak antar pusat katrol",
      "diameterUnit": "Satuan dimensi",
      "millimeters": "Milimeter (mm)",
      "inches": "Inci (dalam)",
      "inputRpm": "Kecepatan masukan pengemudi (RPM)",
      "accuracyNote": "Perkiraan panjang pitch untuk sabuk dua katrol terbuka yang ideal. Gunakan satuan yang sama untuk semua dimensi. Panjang dan kecepatan belt sebenarnya dapat berbeda tergantung profil belt, pitch, tegangan, slip, keausan, dan toleransi. Ini tidak memilih sabuk yang dapat dibeli atau menilai kekuatan, perlindungan, atau keselamatan. Periksa data pabrikan sebelum digunakan. Berjalan secara lokal; tidak ada unggahan.",
      "sketchTitle": "Tata letak sabuk terbuka (tidak sesuai skala)",
      "sketchDescription": "Diagram dua buah katrol yang dihubungkan oleh sebuah sabuk terbuka, dengan penggerak di sebelah kiri dan katrol yang digerakkan di sebelah kanan."
    },
    "actions": {
      "calculate": "Hitung penggerak sabuk",
      "reset": "Mengatur ulang",
      "copy": "Salin hasilnya",
      "example": "Muat contoh",
      "result": "Perkiraan hasil"
    },
    "messages": {
      "copied": "Hasil disalin.",
      "copyUnavailable": "Salinan tidak tersedia di browser ini.",
      "calculated": "Perkiraan penggerak sabuk dihitung.",
      "checkInputs": "Periksa kedua diameter, jarak pusat, satuan dan masukan RPM.",
      "beltLength": "Perkiraan panjang jarak sabuk",
      "outputRpm": "Kecepatan berkendara ideal",
      "speedRatio": "Rasio kecepatan (pengemudi/penggerak)",
      "beltSpeed": "Kecepatan sabuk pengemudi",
      "smallWrap": "Perkiraan lilitan pada katrol yang lebih kecil",
      "model": "Model",
      "openBelt": "Buka pendekatan dua katrol"
    },
    "additionalFaqs": [
      {
        "question": "Berapa rumus perkiraan panjang sabuk?",
        "answer": "Perkiraan panjang pitch sabuk terbuka yang umum adalah L ≈ 2C + 1.57(D + d) + (D − d)²/(4C), dengan C adalah jarak pusat dan D dan d adalah diameter pitch katrol yang lebih besar dan lebih kecil. Pemilihan sabuk yang sebenarnya harus menggunakan data pitch dan ukuran dari pabrikan."
      },
      {
        "question": "Bagaimana diameter katrol mengubah RPM?",
        "answer": "Tanpa slip, RPM yang digerakkan adalah kira-kira RPM masukan dikalikan dengan diameter penggerak dan dibagi dengan diameter yang digerakkan. Katrol yang digerakkan lebih besar mengurangi kecepatan; katrol penggerak yang lebih besar akan meningkatkannya."
      },
      {
        "question": "Apakah kalkulator ini termasuk slip atau ketegangan sabuk?",
        "answer": "Tidak. Ini adalah perkiraan geometri dan rasio yang ideal untuk tata letak dua katrol terbuka. Hal ini tidak memperhitungkan slip, tegangan, konstruksi belt, beban, keausan atau ukuran katalog belt."
      },
      {
        "question": "Bisakah saya menggunakan perkiraan tersebut untuk memesan ikat pinggang?",
        "answer": "Gunakan itu sebagai perkiraan pertama saja. Konfirmasikan jarak sabuk, profil, panjang efektif, penyesuaian tengah, dan tabel ukuran pabrikan sebelum membeli atau mengoperasikan penggerak."
      }
    ]
  },
  "hi": {
    "copyLanguage": "hi",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "चरखी कैलकुलेटर",
    "title": "पुली कैलकुलेटर मुफ़्त और असीमित | UsefulVerse",
    "description": "दो व्यास और केंद्र की दूरी से बेल्ट की लंबाई, चरखी आरपीएम और बेल्ट की गति का अनुमान लगाएं। मुफ़्त, स्थानीय और असीमित।",
    "intro": "दो पुली के बीच एक साधारण खुली बेल्ट के लिए पिच की लंबाई और गति संबंध का अनुमान लगाएं। उसी इकाई में आयाम दर्ज करें.",
    "howQuestion": "आप दो पुली के बीच बेल्ट की लंबाई की गणना कैसे करते हैं?",
    "howAnswer": "एक खुली दो-पुली ड्राइव के लिए, यह कैलकुलेटर केंद्र की दूरी और दो चरखी व्यास के आधार पर एक सामान्य अनुमान का उपयोग करता है। यह व्यास अनुपात से संचालित आरपीएम का भी अनुमान लगाता है, यह मानते हुए कि कोई फिसलन नहीं है।",
    "privacyQuestion": "क्या मेरे माप अपलोड किए गए हैं?",
    "privacyAnswer": "नहीं, सभी गणनाएँ और रेखाचित्र इस ब्राउज़र में उत्पन्न होते हैं; आपके माप अपलोड या सहेजे नहीं गए हैं.",
    "fields": {
      "driverDiameter": "चालक चरखी व्यास",
      "drivenDiameter": "चालित चरखी व्यास",
      "centerDistance": "चरखी केन्द्रों के बीच की दूरी",
      "diameterUnit": "आयाम इकाई",
      "millimeters": "मिलीमीटर (मिमी)",
      "inches": "इंच (इंच)",
      "inputRpm": "ड्राइवर इनपुट गति (आरपीएम)",
      "accuracyNote": "एक आदर्श, खुली दो-पुली बेल्ट के लिए अनुमानित पिच लंबाई। सभी आयामों के लिए एक ही इकाई का उपयोग करें। वास्तविक बेल्ट की लंबाई और गति बेल्ट प्रोफ़ाइल, पिच, तनाव, फिसलन, घिसाव और सहनशीलता के साथ भिन्न हो सकती है। यह क्रय योग्य बेल्ट का चयन नहीं करता है या शक्ति, सुरक्षा या सुरक्षा का आकलन नहीं करता है। उपयोग से पहले निर्माता डेटा की जाँच करें। स्थानीय स्तर पर चलता है; कोई अपलोड नहीं.",
      "sketchTitle": "ओपन-बेल्ट लेआउट (स्केल के अनुसार नहीं)",
      "sketchDescription": "एक खुली बेल्ट से जुड़ी दो पुली का आरेख, जिसमें बायीं ओर चालक और दाईं ओर चालित चरखी है।"
    },
    "actions": {
      "calculate": "बेल्ट ड्राइव की गणना करें",
      "reset": "रीसेट करें",
      "copy": "परिणाम कॉपी करें",
      "example": "उदाहरण लोड करें",
      "result": "अनुमानित परिणाम"
    },
    "messages": {
      "copied": "परिणाम कॉपी किए गए.",
      "copyUnavailable": "इस ब्राउज़र में प्रतिलिपि उपलब्ध नहीं है.",
      "calculated": "बेल्ट-ड्राइव अनुमान की गणना की गई।",
      "checkInputs": "दोनों व्यास, केंद्र की दूरी, इकाई और इनपुट आरपीएम की जाँच करें।",
      "beltLength": "अनुमानित बेल्ट पिच लंबाई",
      "outputRpm": "आदर्श चालित गति",
      "speedRatio": "गति अनुपात (चालक/चालित)",
      "beltSpeed": "ड्राइवर बेल्ट की गति",
      "smallWrap": "छोटी चरखी पर अनुमानित आवरण",
      "model": "नमूना",
      "openBelt": "दो-पुली सन्निकटन खोलें"
    },
    "additionalFaqs": [
      {
        "question": "बेल्ट-लंबाई का अनुमानित सूत्र क्या है?",
        "answer": "एक सामान्य ओपन-बेल्ट पिच-लंबाई सन्निकटन L ≈ 2C + 1.57(D + d) + (D - d)²/(4C) है, जहां C केंद्र की दूरी है और D और d बड़े और छोटे पुली पिच व्यास हैं। वास्तविक बेल्ट चयन में निर्माता की पिच और आकार डेटा का उपयोग करना चाहिए।"
      },
      {
        "question": "चरखी का व्यास RPM कैसे बदलता है?",
        "answer": "बिना किसी स्लिप के, संचालित आरपीएम लगभग इनपुट आरपीएम को ड्राइवर व्यास से गुणा किया जाता है और संचालित व्यास से विभाजित किया जाता है। एक बड़ी चालित चरखी गति कम कर देती है; एक बड़ा चालक चरखी इसे बढ़ाता है।"
      },
      {
        "question": "क्या इस कैलकुलेटर में बेल्ट स्लिप या तनाव शामिल है?",
        "answer": "नहीं, यह खुले दो-पुली लेआउट के लिए एक आदर्श ज्यामिति और अनुपात अनुमान है। इसमें स्लिप, तनाव, बेल्ट निर्माण, भार, घिसाव या कैटलॉग बेल्ट आकार का हिसाब नहीं होता है।"
      },
      {
        "question": "क्या मैं बेल्ट ऑर्डर करने के लिए अनुमान का उपयोग कर सकता हूँ?",
        "answer": "इसे केवल प्रथम अनुमान के रूप में उपयोग करें। ड्राइव खरीदने या चलाने से पहले बेल्ट पिच, प्रोफ़ाइल, प्रभावी लंबाई, केंद्र समायोजन और निर्माता आकार तालिकाओं की पुष्टि करें।"
      }
    ]
  },
  "ar": {
    "copyLanguage": "ar",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "حاسبة البكرات",
    "title": "حاسبة البكرات مجانًا وبلا حدود | UsefulVerse",
    "description": "احسب طول الحزام وسرعة البكرتين من الأقطار والمسافة بين المركزين. مجانية ومحلية وبلا حدود.",
    "intro": "قدّر طول الحزام وعلاقة السرعة لحزام مفتوح بسيط بين بكرتين. أدخل جميع الأبعاد بالوحدة نفسها.",
    "howQuestion": "كيف يُقدّر طول الحزام بين بكرتين؟",
    "howAnswer": "في نظام حزام مفتوح ببكرتين، تستخدم الحاسبة صيغة تقريبية تعتمد على المسافة بين مركزي البكرتين وقطريهما. كما تقدّر سرعة البكرة المُدارة من نسبة القطرين، بافتراض عدم الانزلاق.",
    "privacyQuestion": "هل تُرفع قياساتي؟",
    "privacyAnswer": "لا. تُجرى الحسابات ويُنشأ الرسم في هذا المتصفح، ولا تُرفع قياساتك أو تُحفظ.",
    "fields": {
      "driverDiameter": "قطر بكرة القيادة",
      "drivenDiameter": "قطر البكرة المُدارة",
      "centerDistance": "المسافة بين مركزي البكرتين",
      "diameterUnit": "وحدة القياس",
      "millimeters": "مليمترات (mm)",
      "inches": "بوصات (in)",
      "inputRpm": "سرعة بكرة القيادة (دورة/دقيقة)",
      "accuracyNote": "طول تقريبي لخطوة الحزام في نظام مثالي مفتوح بين بكرتين. استخدم الوحدة نفسها لكل الأبعاد. قد يختلف الطول والسرعة الفعليان حسب نوع الحزام وخطوته والشد والانزلاق والتآكل والتفاوتات. لا تختار الحاسبة حزامًا متاحًا للبيع ولا تقيّم القدرة أو وسائل الحماية أو السلامة. راجع بيانات الشركة المصنّعة قبل الشراء أو التشغيل. تعمل محليًا ولا تُرفع البيانات.",
      "sketchTitle": "ترتيب الحزام المفتوح (الرسم غير مقياسي)",
      "sketchDescription": "رسم لبكرتين متصلتين بحزام مفتوح، بكرة القيادة يسارًا والبكرة المُدارة يمينًا."
    },
    "actions": {
      "calculate": "احسب نظام الحزام",
      "reset": "إعادة ضبط",
      "copy": "نسخ النتائج",
      "example": "تحميل المثال",
      "result": "النتائج التقديرية"
    },
    "messages": {
      "copied": "تم نسخ النتائج.",
      "copyUnavailable": "النسخ غير متاح في هذا المتصفح.",
      "calculated": "تم حساب تقدير نظام الحزام.",
      "checkInputs": "تحقق من القطرين والمسافة بين المركزين والوحدة وسرعة الدوران.",
      "beltLength": "طول خطوة الحزام التقريبي",
      "outputRpm": "سرعة البكرة المُدارة المثالية",
      "speedRatio": "نسبة السرعة (القيادة / المُدارة)",
      "beltSpeed": "السرعة الخطية للحزام عند بكرة القيادة",
      "smallWrap": "زاوية التفاف تقريبية حول البكرة الأصغر",
      "model": "النموذج",
      "openBelt": "تقريب لنظام مفتوح بين بكرتين"
    },
    "additionalFaqs": [
      {
        "question": "ما صيغة تقدير طول الحزام؟",
        "answer": "من الصيغ التقريبية الشائعة لحزام مفتوح: L ≈ 2C + 1.57(D + d) + (D − d)²/(4C)، حيث C هي المسافة بين المركزين، وD وd قطرا خطوتي البكرتين الأكبر والأصغر. استخدم بيانات الشركة المصنّعة لاختيار الحزام الفعلي."
      },
      {
        "question": "كيف يؤثر قطر البكرة في سرعة الدوران؟",
        "answer": "بافتراض عدم الانزلاق، تُقدّر سرعة دوران البكرة المُدارة بضرب سرعة بكرة القيادة في قطرها ثم القسمة على قطر البكرة المُدارة. تكبّر البكرة المُدارة تخفّض السرعة، بينما تكبّر بكرة القيادة ترفعها."
      },
      {
        "question": "هل تحسب الأداة انزلاق الحزام أو شده؟",
        "answer": "لا. هذا تقدير هندسي ونسبة سرعة مثاليان لترتيب مفتوح بين بكرتين. لا يحسب الانزلاق أو الشد أو نوع الحزام أو الحمل أو التآكل أو المقاسات المتاحة."
      },
      {
        "question": "هل يمكنني طلب حزام اعتمادًا على هذا التقدير؟",
        "answer": "استخدمه كتقدير أولي فقط. تحقّق من خطوة الحزام ونوعه وطوله الفعلي وإمكانية ضبط المسافة وجداول الشركة المصنّعة قبل الشراء أو التشغيل."
      }
    ]
  },
  "zh": {
    "copyLanguage": "zh",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "滑轮计算器",
    "title": "滑轮计算器免费且无限制 | UsefulVerse",
    "description": "根据两个直径和中心距估算皮带长度、皮带轮转速和皮带速度。免费、本地且无限制。",
    "intro": "估计两个滑轮之间的简单开放式皮带的节距长度和速度关系。以相同单位输入尺寸。",
    "howQuestion": "如何计算两个皮带轮之间的皮带长度？",
    "howAnswer": "对于开放式双皮带轮驱动装置，该计算器使用基于中心距和两个皮带轮直径的通用近似值。假设没有打滑，它还可以根据直径比估算驱动转速。",
    "privacyQuestion": "我的测量结果上传了吗？",
    "privacyAnswer": "不会。所有的计算和草图都是在这个浏览器中生成的；您的测量结果不会上传或保存。",
    "fields": {
      "driverDiameter": "驱动轮直径",
      "drivenDiameter": "从动带轮直径",
      "centerDistance": "滑轮中心间距离",
      "diameterUnit": "尺寸单位",
      "millimeters": "毫米 (mm)",
      "inches": "英寸（英寸）",
      "inputRpm": "驱动器输入速度 (RPM)",
      "accuracyNote": "理想的开放式双滑轮皮带的近似节距长度。所有尺寸均使用相同的单位。实际的皮带长度和速度可能因皮带轮廓、节距、张力、滑动、磨损和公差而异。这不会选择可购买的腰带或评估力量、防护或安全性。使用前检查制造商数据。在本地运行；没有上传。",
      "sketchTitle": "开放式传送带布局（未按比例）",
      "sketchDescription": "通过开放式皮带连接两个皮带轮的示意图，驱动皮带轮位于左侧，从动皮带轮位于右侧。"
    },
    "actions": {
      "calculate": "计算皮带传动",
      "reset": "重置",
      "copy": "复制结果",
      "example": "负载示例",
      "result": "预计结果"
    },
    "messages": {
      "copied": "结果已复制。",
      "copyUnavailable": "复制在此浏览器中不可用。",
      "calculated": "已计算皮带传动估算值。",
      "checkInputs": "检查直径、中心距、单位和输入转速。",
      "beltLength": "大约皮带节距长度",
      "outputRpm": "理想驱动速度",
      "speedRatio": "速比（驱动/从动）",
      "beltSpeed": "驱动带速度",
      "smallWrap": "较小滑轮上的近似缠绕",
      "model": "模型",
      "openBelt": "开式二滑轮​​近似"
    },
    "additionalFaqs": [
      {
        "question": "皮带长度的近似公式是什么？",
        "answer": "常见的开式皮带节距长度近似值为 L ≈ 2C + 1.57(D + d) + (D − d)²/(4C)，其中 C 是中心距，D 和 d 是较大和较小的皮带轮节径。实际的皮带选择应使用制造商的节距和尺寸数据。"
      },
      {
        "question": "皮带轮直径如何改变转速？",
        "answer": "在没有打滑的情况下，从动转速大约等于输入转速乘以驱动器直径再除以从动直径。较大的从动皮带轮会降低速度；较大的驱动皮带轮会增加它。"
      },
      {
        "question": "该计算器是否包括皮带打滑或张力？",
        "answer": "不会。这是开放式双滑轮布局的理想几何形状和比率估计。它不考虑滑动、张力、皮带结构、负载、磨损或目录皮带尺寸。"
      },
      {
        "question": "我可以使用估价来订购腰带吗？",
        "answer": "仅将其用作初步估计。在购买或操作驱动器之前，请确认皮带节距、轮廓、有效长度、中心调整和制造商尺寸表。"
      }
    ]
  },
  "bn": {
    "copyLanguage": "bn",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "পুলি ক্যালকুলেটর",
    "title": "পুলি ক্যালকুলেটর ফ্রি এবং আনলিমিটেড | UsefulVerse",
    "description": "দুই ব্যাস এবং কেন্দ্রের দূরত্ব থেকে বেল্টের দৈর্ঘ্য, পুলি RPM এবং বেল্টের গতি অনুমান করুন। বিনামূল্যে, স্থানীয় এবং সীমাহীন।",
    "intro": "দুটি পুলির মধ্যে একটি সাধারণ খোলা বেল্টের জন্য পিচের দৈর্ঘ্য এবং গতির সম্পর্ক অনুমান করুন। একই ইউনিটে মাত্রা লিখুন।",
    "howQuestion": "আপনি কিভাবে দুটি কপিকল মধ্যে বেল্ট দৈর্ঘ্য গণনা করবেন?",
    "howAnswer": "একটি খোলা দুই-পুলি ড্রাইভের জন্য, এই ক্যালকুলেটরটি কেন্দ্রের দূরত্ব এবং দুটি পুলি ব্যাসের উপর ভিত্তি করে একটি সাধারণ অনুমান ব্যবহার করে। এটি ব্যাস অনুপাত থেকে চালিত RPM অনুমান করে, অনুমান করে কোন স্লিপ নেই।",
    "privacyQuestion": "আমার পরিমাপ আপলোড করা হয়?",
    "privacyAnswer": "না। সমস্ত গণনা এবং স্কেচ এই ব্রাউজারে তৈরি করা হয়; আপনার পরিমাপ আপলোড বা সংরক্ষণ করা হয় না.",
    "fields": {
      "driverDiameter": "ড্রাইভার পুলি ব্যাস",
      "drivenDiameter": "চালিত কপিকল ব্যাস",
      "centerDistance": "পুলি কেন্দ্রের মধ্যে দূরত্ব",
      "diameterUnit": "মাত্রা একক",
      "millimeters": "মিলিমিটার (মিমি)",
      "inches": "ইঞ্চি (ইঞ্চি)",
      "inputRpm": "ড্রাইভার ইনপুট গতি (RPM)",
      "accuracyNote": "একটি আদর্শ, খোলা দুই-পুলি বেল্টের জন্য আনুমানিক পিচ দৈর্ঘ্য। সমস্ত মাত্রার জন্য একই ইউনিট ব্যবহার করুন। প্রকৃত বেল্টের দৈর্ঘ্য এবং গতি বেল্ট প্রোফাইল, পিচ, টান, স্লিপ, পরিধান এবং সহনশীলতার সাথে ভিন্ন হতে পারে। এটি একটি ক্রয়যোগ্য বেল্ট নির্বাচন করে না বা ক্ষমতা, পাহারা বা নিরাপত্তা মূল্যায়ন করে না। ব্যবহারের আগে প্রস্তুতকারকের ডেটা পরীক্ষা করুন। স্থানীয়ভাবে চলে; আপলোড নেই।",
      "sketchTitle": "ওপেন-বেল্ট লেআউট (স্কেল করার জন্য নয়)",
      "sketchDescription": "একটি খোলা বেল্ট দ্বারা সংযুক্ত দুটি পুলির চিত্র, বামদিকে ড্রাইভার এবং ডানদিকে চালিত পুলি।"
    },
    "actions": {
      "calculate": "বেল্ট ড্রাইভ গণনা করুন",
      "reset": "রিসেট করুন",
      "copy": "ফলাফল কপি করুন",
      "example": "লোড উদাহরণ",
      "result": "আনুমানিক ফলাফল"
    },
    "messages": {
      "copied": "ফলাফল কপি করা হয়েছে.",
      "copyUnavailable": "এই ব্রাউজারে অনুলিপি পাওয়া যায় না।",
      "calculated": "বেল্ট-ড্রাইভ অনুমান গণনা করা হয়েছে।",
      "checkInputs": "ব্যাস, কেন্দ্রের দূরত্ব, ইউনিট এবং ইনপুট RPM উভয়ই পরীক্ষা করুন।",
      "beltLength": "আনুমানিক বেল্ট পিচ দৈর্ঘ্য",
      "outputRpm": "আদর্শ চালিত গতি",
      "speedRatio": "গতির অনুপাত (চালক/চালিত)",
      "beltSpeed": "ড্রাইভার বেল্টের গতি",
      "smallWrap": "আনুমানিক ছোট কপিকল উপর মোড়ানো",
      "model": "মডেল",
      "openBelt": "দুই-পুলি আনুমানিক খোলা"
    },
    "additionalFaqs": [
      {
        "question": "আনুমানিক বেল্ট-দৈর্ঘ্য সূত্র কি?",
        "answer": "একটি সাধারণ খোলা-বেল্ট পিচ-দৈর্ঘ্যের অনুমান হল L ≈ 2C + 1.57(D + d) + (D − d)²/(4C), যেখানে C হল কেন্দ্রের দূরত্ব এবং D এবং d হল বড় এবং ছোট পুলি পিচের ব্যাস। প্রকৃত বেল্ট নির্বাচন প্রস্তুতকারকের পিচ এবং সাইজিং ডেটা ব্যবহার করা উচিত।"
      },
      {
        "question": "পুলির ব্যাস কিভাবে RPM পরিবর্তন করে?",
        "answer": "কোন স্লিপ ছাড়াই, চালিত RPM হল আনুমানিক ইনপুট RPM কে ড্রাইভার ব্যাস দ্বারা গুণিত এবং চালিত ব্যাস দ্বারা ভাগ করা হয়। একটি বড় চালিত কপিকল গতি হ্রাস করে; একটি বৃহত্তর ড্রাইভার পুলি এটি বাড়ায়।"
      },
      {
        "question": "এই ক্যালকুলেটর কি বেল্ট স্লিপ বা টেনশন অন্তর্ভুক্ত করে?",
        "answer": "না। এটি একটি ওপেন টু-পুলি লেআউটের জন্য একটি আদর্শ জ্যামিতি এবং অনুপাতের অনুমান। এটি স্লিপ, টান, বেল্ট নির্মাণ, লোড, পরিধান বা ক্যাটালগ বেল্টের আকারের জন্য অ্যাকাউন্ট করে না।"
      },
      {
        "question": "আমি একটি বেল্ট অর্ডার করার জন্য অনুমান ব্যবহার করতে পারি?",
        "answer": "এটি শুধুমাত্র প্রথম অনুমান হিসাবে ব্যবহার করুন। একটি ড্রাইভ কেনা বা পরিচালনা করার আগে বেল্ট পিচ, প্রোফাইল, কার্যকরী দৈর্ঘ্য, কেন্দ্র সমন্বয় এবং প্রস্তুতকারকের সাইজিং টেবিল নিশ্চিত করুন।"
      }
    ]
  },
  "ru": {
    "copyLanguage": "ru",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Калькулятор шкивов",
    "title": "Калькулятор шкивов бесплатно и без | UsefulVerse",
    "description": "Оцените длину ремня, частоту вращения шкива и скорость ремня по двум диаметрам и межцентровому расстоянию. Бесплатно, локально и без ограничений.",
    "intro": "Оцените соотношение длины шага и скорости для простого открытого ремня между двумя шкивами. Введите размеры в одних и тех же единицах измерения.",
    "howQuestion": "Как рассчитать длину ремня между двумя шкивами?",
    "howAnswer": "Для открытого привода с двумя шкивами в этом калькуляторе используется общее приближение, основанное на межосевом расстоянии и диаметрах двух шкивов. Он также оценивает число оборотов привода на основе соотношения диаметров, предполагая отсутствие проскальзывания.",
    "privacyQuestion": "Загружены ли мои измерения?",
    "privacyAnswer": "Нет. Все расчеты и эскиз создаются в этом браузере; ваши измерения не загружаются и не сохраняются.",
    "fields": {
      "driverDiameter": "Диаметр приводного шкива",
      "drivenDiameter": "Диаметр ведомого шкива",
      "centerDistance": "Расстояние между центрами шкивов",
      "diameterUnit": "Единица измерения",
      "millimeters": "Миллиметры (мм)",
      "inches": "Дюймы (дюймы)",
      "inputRpm": "Входная скорость драйвера (об/мин)",
      "accuracyNote": "Приблизительная длина шага для идеального открытого двухшкивного ремня. Используйте одну и ту же единицу измерения для всех размеров. Реальная длина и скорость ремня могут различаться в зависимости от профиля ремня, шага, натяжения, проскальзывания, износа и допусков. При этом не осуществляется выбор приобретаемого пояса и не оценивается мощность, защита или безопасность. Перед использованием проверьте данные производителя. Запускается локально; нет загрузки.",
      "sketchTitle": "Компоновка с открытой лентой (не в масштабе)",
      "sketchDescription": "Схема двух шкивов, соединенных открытым ремнем, с ведущим слева и ведомым справа."
    },
    "actions": {
      "calculate": "Рассчитать ременную передачу",
      "reset": "Перезагрузить",
      "copy": "Копировать результаты",
      "example": "Загрузить пример",
      "result": "Предполагаемые результаты"
    },
    "messages": {
      "copied": "Результаты скопированы.",
      "copyUnavailable": "Копирование недоступно в этом браузере.",
      "calculated": "Рассчитана оценка ременной передачи.",
      "checkInputs": "Проверьте оба диаметра, межосевое расстояние, единицу измерения и входную частоту вращения.",
      "beltLength": "Приблизительная длина шага ремня",
      "outputRpm": "Идеальная скорость движения",
      "speedRatio": "Передаточное число (водитель/ведомый)",
      "beltSpeed": "Скорость ремня водителя",
      "smallWrap": "Приблизительное накручивание на меньшем шкиве",
      "model": "Модель",
      "openBelt": "Открытое двухшкивное приближение"
    },
    "additionalFaqs": [
      {
        "question": "Какова приблизительная формула длины ремня?",
        "answer": "Обычное приближение длины шага открытого ремня составляет L ≈ 2C + 1,57(D + d) + (D - d)²/(4C), где C - межосевое расстояние, а D и d - больший и меньший диаметры шага шкива. При фактическом выборе ремня следует использовать данные о шаге и размерах, указанные производителем."
      },
      {
        "question": "Как диаметр шкива влияет на число оборотов?",
        "answer": "При отсутствии проскальзывания ведомая частота вращения приблизительно равна входной частоте вращения, умноженной на диаметр привода и разделенной на ведомый диаметр. Ведомый шкив большего размера снижает скорость; больший ведущий шкив увеличивает его."
      },
      {
        "question": "Учитывает ли этот калькулятор проскальзывание или натяжение ремня?",
        "answer": "Нет. Это идеальная геометрия и оценка передаточного отношения для открытой схемы с двумя шкивами. Он не учитывает проскальзывание, натяжение, конструкцию ремня, нагрузку, износ или размеры ремня по каталогу."
      },
      {
        "question": "Могу ли я использовать смету для заказа ремня?",
        "answer": "Используйте его только в качестве первой оценки. Перед покупкой или эксплуатацией привода проверьте шаг ремня, профиль, эффективную длину, регулировку центра и таблицы размеров производителя."
      }
    ]
  },
  "ur": {
    "copyLanguage": "ur",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "گھرنی کیلکولیٹر",
    "title": "گھرنی کیلکولیٹر مفت اور لا محدود | UsefulVerse",
    "description": "بیلٹ کی لمبائی، گھرنی RPM اور بیلٹ کی رفتار کا دو قطر اور درمیانی فاصلے سے اندازہ لگائیں۔ مفت، مقامی اور لامحدود۔",
    "intro": "دو پلیوں کے درمیان ایک سادہ کھلی پٹی کے لیے پچ کی لمبائی اور رفتار کے تعلق کا اندازہ لگائیں۔ ایک ہی یونٹ میں طول و عرض درج کریں۔",
    "howQuestion": "آپ دو پلیوں کے درمیان بیلٹ کی لمبائی کا حساب کیسے لگاتے ہیں؟",
    "howAnswer": "کھلی دو پللی ڈرائیو کے لیے، یہ کیلکولیٹر مرکز کے فاصلے اور دو پللی کے قطر کی بنیاد پر ایک مشترکہ تخمینہ استعمال کرتا ہے۔ یہ قطر کے تناسب سے چلنے والے RPM کا تخمینہ بھی لگاتا ہے، یہ فرض کرتے ہوئے کہ کوئی پرچی نہیں ہے۔",
    "privacyQuestion": "کیا میری پیمائشیں اپ لوڈ کی گئی ہیں؟",
    "privacyAnswer": "نہیں، تمام حسابات اور خاکہ اس براؤزر میں تیار کیا گیا ہے۔ آپ کی پیمائشیں اپ لوڈ یا محفوظ نہیں ہیں۔",
    "fields": {
      "driverDiameter": "ڈرائیور گھرنی قطر",
      "drivenDiameter": "کارفرما گھرنی قطر",
      "centerDistance": "گھرنی مراکز کے درمیان فاصلہ",
      "diameterUnit": "طول و عرض یونٹ",
      "millimeters": "ملی میٹر (ملی میٹر)",
      "inches": "انچ (انچ)",
      "inputRpm": "ڈرائیور ان پٹ کی رفتار (RPM)",
      "accuracyNote": "ایک مثالی، کھلی دو پللی بیلٹ کے لیے پچ کی تخمینی لمبائی۔ تمام جہتوں کے لیے ایک ہی یونٹ کا استعمال کریں۔ حقیقی بیلٹ کی لمبائی اور رفتار بیلٹ پروفائل، پچ، تناؤ، پرچی، پہننے اور رواداری کے ساتھ مختلف ہوسکتی ہے۔ یہ قابل خرید بیلٹ کا انتخاب نہیں کرتا ہے یا طاقت، حفاظت یا حفاظت کا اندازہ نہیں لگاتا ہے۔ استعمال کرنے سے پہلے کارخانہ دار کا ڈیٹا چیک کریں۔ مقامی طور پر چلتا ہے؛ کوئی اپ لوڈ نہیں۔",
      "sketchTitle": "اوپن بیلٹ لے آؤٹ (پیمانہ نہیں)",
      "sketchDescription": "دو پلیوں کا خاکہ جو ایک کھلی بیلٹ سے جڑا ہوا ہے، جس میں بائیں طرف ڈرائیور اور دائیں طرف چلائی گئی گھرنی ہے۔"
    },
    "actions": {
      "calculate": "بیلٹ ڈرائیو کا حساب لگائیں۔",
      "reset": "دوبارہ ترتیب دیں۔",
      "copy": "نتائج کاپی کریں۔",
      "example": "لوڈ کی مثال",
      "result": "تخمینی نتائج"
    },
    "messages": {
      "copied": "نتائج کاپی ہو گئے۔",
      "copyUnavailable": "اس براؤزر میں کاپی دستیاب نہیں ہے۔",
      "calculated": "بیلٹ ڈرائیو کا تخمینہ لگایا گیا۔",
      "checkInputs": "دونوں قطر، مرکز کا فاصلہ، یونٹ اور ان پٹ RPM چیک کریں۔",
      "beltLength": "لگ بھگ بیلٹ پچ کی لمبائی",
      "outputRpm": "مثالی چلنے والی رفتار",
      "speedRatio": "رفتار کا تناسب (ڈرائیور / کارفرما)",
      "beltSpeed": "ڈرائیور بیلٹ کی رفتار",
      "smallWrap": "چھوٹی گھرنی پر لگ بھگ لپیٹنا",
      "model": "ماڈل",
      "openBelt": "دو گھرنی کا تخمینہ کھولیں۔"
    },
    "additionalFaqs": [
      {
        "question": "بیلٹ کی لمبائی کا تخمینی فارمولا کیا ہے؟",
        "answer": "ایک عام اوپن بیلٹ پچ کی لمبائی کا تخمینہ L ≈ 2C + 1.57(D + d) + (D − d)²/(4C) ہے، جہاں C مرکز کا فاصلہ ہے اور D اور d پللی پچ کے بڑے اور چھوٹے قطر ہیں۔ بیلٹ کے اصل انتخاب میں مینوفیکچرر کی پچ اور سائز کا ڈیٹا استعمال کرنا چاہیے۔"
      },
      {
        "question": "گھرنی کا قطر RPM کو کیسے تبدیل کرتا ہے؟",
        "answer": "بغیر کسی پرچی کے، کارفرما RPM تقریباً ان پٹ RPM ہے جسے ڈرائیور کے قطر سے ضرب اور کارفرما قطر سے تقسیم کیا جاتا ہے۔ ایک بڑی کارفرما گھرنی رفتار کو کم کرتی ہے۔ ایک بڑی ڈرائیور گھرنی اسے بڑھاتی ہے۔"
      },
      {
        "question": "کیا اس کیلکولیٹر میں بیلٹ سلپ یا ٹینشن شامل ہے؟",
        "answer": "نہیں، یہ ایک کھلی دو پللی لے آؤٹ کے لیے ایک مثالی جیومیٹری اور تناسب کا تخمینہ ہے۔ اس میں پرچی، تناؤ، بیلٹ کی تعمیر، بوجھ، پہننے یا کیٹلاگ بیلٹ کے سائز کا حساب نہیں ہے۔"
      },
      {
        "question": "کیا میں بیلٹ آرڈر کرنے کے لیے تخمینہ استعمال کر سکتا ہوں؟",
        "answer": "اسے صرف پہلے تخمینہ کے طور پر استعمال کریں۔ ڈرائیو خریدنے یا چلانے سے پہلے بیلٹ پچ، پروفائل، موثر لمبائی، سینٹر ایڈجسٹمنٹ اور مینوفیکچرر سائزنگ ٹیبل کی تصدیق کریں۔"
      }
    ]
  },
  "tr": {
    "copyLanguage": "tr",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Kasnak Hesaplayıcı",
    "title": "Kasnak Hesaplayıcı Ücretsiz ve Sınırsız | UsefulVerse",
    "description": "İki çap ve merkez mesafesinden kayış uzunluğunu, kasnak devrini ve kayış hızını tahmin edin. Ücretsiz, yerel ve sınırsız.",
    "intro": "İki makara arasındaki basit açık kayış için hatve uzunluğu ve hız ilişkisini tahmin edin. Boyutları aynı birimde girin.",
    "howQuestion": "İki kasnak arasındaki kayış uzunluğunu nasıl hesaplarsınız?",
    "howAnswer": "Açık iki makaralı bir tahrik için bu hesaplayıcı, merkez mesafesine ve iki makara çapına dayalı ortak bir yaklaşım kullanır. Ayrıca kayma olmadığını varsayarak çap oranından tahrik edilen RPM'yi de tahmin eder.",
    "privacyQuestion": "Ölçümlerim yüklendi mi?",
    "privacyAnswer": "Hayır. Tüm hesaplamalar ve çizim bu tarayıcıda oluşturulur; ölçümleriniz yüklenmez veya kaydedilmez.",
    "fields": {
      "driverDiameter": "Sürücü kasnağı çapı",
      "drivenDiameter": "Tahrikli kasnak çapı",
      "centerDistance": "Kasnak merkezleri arasındaki mesafe",
      "diameterUnit": "Boyut birimi",
      "millimeters": "Milimetre (mm)",
      "inches": "İnç (inç)",
      "inputRpm": "Sürücü giriş hızı (RPM)",
      "accuracyNote": "İdeal, açık iki kasnaklı kayış için yaklaşık hatve uzunluğu. Tüm boyutlar için aynı birimi kullanın. Gerçek bant uzunluğu ve hızı, bant profiline, eğime, gerginliğe, kaymaya, aşınmaya ve toleranslara göre farklılık gösterebilir. Bu, satın alınabilir bir kemeri seçmez veya gücü, korumayı veya güvenliği değerlendirmez. Kullanmadan önce üretici verilerini kontrol edin. Yerel olarak çalışır; yükleme yok.",
      "sketchTitle": "Açık bant düzeni (ölçekli değil)",
      "sketchDescription": "Sürücünün solda ve tahrikli makaranın sağda olduğu, açık bir kayışla bağlanan iki makaranın diyagramı."
    },
    "actions": {
      "calculate": "Kayış tahrikini hesaplayın",
      "reset": "Sıfırla",
      "copy": "Sonuçları kopyala",
      "example": "Örnek yükle",
      "result": "Tahmini sonuçlar"
    },
    "messages": {
      "copied": "Sonuçlar kopyalandı.",
      "copyUnavailable": "Kopyalama bu tarayıcıda mevcut değil.",
      "calculated": "Kayış tahrik tahmini hesaplandı.",
      "checkInputs": "Her iki çapı, merkez mesafesini, birimi ve giriş devrini kontrol edin.",
      "beltLength": "Yaklaşık bant aralığı uzunluğu",
      "outputRpm": "İdeal sürüş hızı",
      "speedRatio": "Hız oranı (sürücü / tahrikli)",
      "beltSpeed": "Sürücü kayışı hızı",
      "smallWrap": "Daha küçük kasnak üzerinde yaklaşık sarma",
      "model": "Modeli",
      "openBelt": "Açık iki kasnak yaklaşımı"
    },
    "additionalFaqs": [
      {
        "question": "Yaklaşık kemer uzunluğu formülü nedir?",
        "answer": "Yaygın bir açık kayış hatve uzunluğu yaklaşımı L ≈ 2C + 1,57(D + d) + (D − d)²/(4C)'dir; burada C merkez mesafesidir ve D ve d daha büyük ve daha küçük kasnak hatve çaplarıdır. Gerçek bant seçiminde üreticinin hatve ve boyutlandırma verileri kullanılmalıdır."
      },
      {
        "question": "Kasnak çapı RPM'yi nasıl değiştirir?",
        "answer": "Kayma olmadığında, tahrik edilen RPM yaklaşık olarak giriş RPM'sinin sürücü çapıyla çarpımı ve tahrik edilen çapa bölünmesiyle elde edilir. Daha büyük bir tahrikli kasnak hızı azaltır; daha büyük bir sürücü kasnağı bunu arttırır."
      },
      {
        "question": "Bu hesaplayıcı kayış kaymasını veya gerginliğini içeriyor mu?",
        "answer": "Hayır. Açık iki makaralı düzen için ideal bir geometri ve oran tahminidir. Kayma, gerginlik, bant yapısı, yük, aşınma veya katalog bant boyutları dikkate alınmaz."
      },
      {
        "question": "Tahmini kemer siparişi vermek için kullanabilir miyim?",
        "answer": "Bunu yalnızca ilk tahmin olarak kullanın. Bir sürücüyü satın almadan veya çalıştırmadan önce kayış eğimini, profilini, etkin uzunluğunu, merkez ayarını ve üretici boyut tablolarını doğrulayın."
      }
    ]
  },
  "vi": {
    "copyLanguage": "vi",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Máy tính ròng rọc",
    "title": "Máy tính ròng rọc miễn phí & không giới hạn | UsefulVerse",
    "description": "Ước tính chiều dài dây đai, vòng/phút của ròng rọc và tốc độ dây đai từ hai đường kính và khoảng cách tâm. Miễn phí, địa phương và không giới hạn.",
    "intro": "Hãy ước tính mối liên hệ giữa chiều dài bước và tốc độ của một đai hở đơn giản giữa hai ròng rọc. Nhập kích thước trong cùng một đơn vị.",
    "howQuestion": "Làm thế nào để bạn tính chiều dài vành đai giữa hai ròng rọc?",
    "howAnswer": "Đối với bộ truyền động hai ròng rọc hở, máy tính này sử dụng phép tính gần đúng chung dựa trên khoảng cách tâm và đường kính hai ròng rọc. Nó cũng ước tính RPM được điều khiển từ tỷ lệ đường kính, giả sử không bị trượt.",
    "privacyQuestion": "Số đo của tôi có được tải lên không?",
    "privacyAnswer": "Không. Tất cả các phép tính và bản phác thảo đều được tạo trong trình duyệt này; số đo của bạn không được tải lên hoặc lưu.",
    "fields": {
      "driverDiameter": "Đường kính ròng rọc điều khiển",
      "drivenDiameter": "Đường kính ròng rọc dẫn động",
      "centerDistance": "Khoảng cách giữa tâm ròng rọc",
      "diameterUnit": "Đơn vị kích thước",
      "millimeters": "Milimet (mm)",
      "inches": "Inch (trong)",
      "inputRpm": "Tốc độ đầu vào của trình điều khiển (RPM)",
      "accuracyNote": "Chiều dài bước gần đúng cho một đai hai ròng rọc hở, lý tưởng. Sử dụng cùng một đơn vị cho tất cả các kích thước. Chiều dài và tốc độ đai thực có thể khác nhau tùy theo hình dạng đai, bước, độ căng, độ trượt, độ mòn và dung sai. Điều này không chọn dây đai có thể mua được hoặc đánh giá sức mạnh, khả năng bảo vệ hoặc độ an toàn. Kiểm tra dữ liệu của nhà sản xuất trước khi sử dụng. Chạy cục bộ; không tải lên.",
      "sketchTitle": "Bố trí vành đai mở (không theo tỷ lệ)",
      "sketchDescription": "Sơ đồ hai ròng rọc nối với nhau bằng một đai hở, với bộ dẫn động ở bên trái và ròng rọc bị dẫn động ở bên phải."
    },
    "actions": {
      "calculate": "Tính toán bộ truyền đai",
      "reset": "Cài lại",
      "copy": "Sao chép kết quả",
      "example": "Tải ví dụ",
      "result": "Kết quả ước tính"
    },
    "messages": {
      "copied": "Đã sao chép kết quả.",
      "copyUnavailable": "Bản sao không có sẵn trong trình duyệt này.",
      "calculated": "Tính toán ước tính truyền động đai.",
      "checkInputs": "Kiểm tra cả đường kính, khoảng cách trung tâm, đơn vị và RPM đầu vào.",
      "beltLength": "Chiều dài bước đai gần đúng",
      "outputRpm": "Tốc độ điều khiển lý tưởng",
      "speedRatio": "Tỷ lệ tốc độ (người lái / người lái)",
      "beltSpeed": "Tốc độ đai lái xe",
      "smallWrap": "Quấn gần đúng trên ròng rọc nhỏ hơn",
      "model": "Người mẫu",
      "openBelt": "Mở xấp xỉ hai ròng rọc"
    },
    "additionalFaqs": [
      {
        "question": "Công thức chiều dài đai gần đúng là gì?",
        "answer": "Phép tính gần đúng chiều dài bước đai đai hở phổ biến là L ≈ 2C + 1,57(D + d) + (D − d)²/(4C), trong đó C là khoảng cách tâm và D và d là đường kính bước ròng rọc lớn hơn và nhỏ hơn. Lựa chọn đai thực tế nên sử dụng dữ liệu về kích thước và bước của nhà sản xuất."
      },
      {
        "question": "Đường kính ròng rọc thay đổi RPM như thế nào?",
        "answer": "Khi không bị trượt, RPM được dẫn động xấp xỉ RPM đầu vào nhân với đường kính của bộ dẫn động và chia cho đường kính được dẫn động. Ròng rọc dẫn động lớn hơn làm giảm tốc độ; một ròng rọc điều khiển lớn hơn sẽ làm tăng nó."
      },
      {
        "question": "Máy tính này có bao gồm độ trượt hoặc độ căng của đai không?",
        "answer": "Không. Đây là ước tính hình học và tỷ lệ lý tưởng cho bố trí hai ròng rọc mở. Nó không tính đến độ trượt, lực căng, kết cấu đai, tải trọng, độ mòn hoặc phân loại kích thước đai."
      },
      {
        "question": "Tôi có thể sử dụng ước tính để đặt mua thắt lưng không?",
        "answer": "Chỉ sử dụng nó như là ước tính đầu tiên. Xác nhận bước đai, biên dạng, chiều dài hiệu dụng, điều chỉnh tâm và bảng kích thước của nhà sản xuất trước khi mua hoặc vận hành bộ truyền động."
      }
    ]
  },
  "it": {
    "copyLanguage": "it",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Calcolatore della puleggia",
    "title": "Calcolatore della puleggia gratuito e | UsefulVerse",
    "description": "Stimare la lunghezza della cinghia, il numero di giri della puleggia e la velocità della cinghia da due diametri e interasse. Gratuito, locale e illimitato.",
    "intro": "Stimare la relazione tra lunghezza primitiva e velocità di una semplice cinghia aperta tra due pulegge. Inserisci le dimensioni nella stessa unità.",
    "howQuestion": "Come si calcola la lunghezza della cinghia tra due pulegge?",
    "howAnswer": "Per un azionamento aperto a due pulegge, questo calcolatore utilizza un'approssimazione comune basata sull'interasse e sui diametri delle due pulegge. Stima inoltre il numero di giri guidato dal rapporto tra i diametri, presupponendo l'assenza di slittamento.",
    "privacyQuestion": "Le mie misure sono caricate?",
    "privacyAnswer": "No. Tutti i calcoli e lo schizzo vengono generati in questo browser; le tue misurazioni non vengono caricate o salvate.",
    "fields": {
      "driverDiameter": "Diametro della puleggia motrice",
      "drivenDiameter": "Diametro puleggia condotta",
      "centerDistance": "Distanza tra i centri delle pulegge",
      "diameterUnit": "Unità di dimensione",
      "millimeters": "Millimetri (mm)",
      "inches": "pollici (pollici)",
      "inputRpm": "Velocità di ingresso del driver (RPM)",
      "accuracyNote": "Lunghezza primitiva approssimativa per una cinghia a due pulegge aperta ideale. Utilizzare la stessa unità per tutte le dimensioni. La lunghezza e la velocità reali della cinghia possono variare in base al profilo, al passo, alla tensione, allo scorrimento, all'usura e alle tolleranze della cinghia. Ciò non seleziona una cintura acquistabile né valuta la potenza, la protezione o la sicurezza. Controllare i dati del produttore prima dell'uso. Funziona localmente; nessun caricamento.",
      "sketchTitle": "Layout a cintura aperta (non in scala)",
      "sketchDescription": "Schema di due pulegge collegate da una cinghia aperta, con la puleggia conduttrice a sinistra e la puleggia condotta a destra."
    },
    "actions": {
      "calculate": "Calcolare la trasmissione a cinghia",
      "reset": "Reset",
      "copy": "Copia i risultati",
      "example": "Carica esempio",
      "result": "Risultati stimati"
    },
    "messages": {
      "copied": "Risultati copiati.",
      "copyUnavailable": "La copia non è disponibile in questo browser.",
      "calculated": "Calcolo della stima della trasmissione a cinghia.",
      "checkInputs": "Controllare entrambi i diametri, l'interasse, l'unità e il numero di giri in ingresso.",
      "beltLength": "Lunghezza approssimativa della cinghia",
      "outputRpm": "Velocità di guida ideale",
      "speedRatio": "Rapporto di velocità (conducente/guidato)",
      "beltSpeed": "Velocità della cinghia del conducente",
      "smallWrap": "Avvolgimento approssimativo su puleggia più piccola",
      "model": "Modello",
      "openBelt": "Approssimazione aperta a due pulegge"
    },
    "additionalFaqs": [
      {
        "question": "Qual è la formula approssimativa della lunghezza della cintura?",
        "answer": "Una comune approssimazione della lunghezza primitiva della cinghia aperta è L ≈ 2C + 1,57(D + d) + (D − d)²/(4C), dove C è l'interasse e D e d sono i diametri primitivi della puleggia maggiore e minore. La selezione effettiva della cinghia dovrebbe utilizzare i dati di passo e dimensionamento del produttore."
      },
      {
        "question": "Come cambia il diametro della puleggia RPM?",
        "answer": "Senza slittamento, il numero di giri condotto corrisponde approssimativamente al numero di giri in ingresso moltiplicato per il diametro del trascinatore e diviso per il diametro condotto. Una puleggia condotta più grande riduce la velocità; una puleggia motrice più grande lo aumenta."
      },
      {
        "question": "Questo calcolatore include lo slittamento o la tensione della cinghia?",
        "answer": "No. Si tratta di una stima ideale della geometria e del rapporto per un layout aperto a due pulegge. Non tiene conto dello slittamento, della tensione, della struttura della cinghia, del carico, dell'usura o delle dimensioni della cinghia catalogate."
      },
      {
        "question": "Posso utilizzare il preventivo per ordinare una cintura?",
        "answer": "Usalo solo come prima stima. Verificare il passo, il profilo, la lunghezza effettiva, la regolazione del centro e le tabelle delle dimensioni del produttore prima di acquistare o utilizzare un azionamento."
      }
    ]
  },
  "zh_tw": {
    "copyLanguage": "zh_tw",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "滑輪計算器",
    "title": "滑輪計算器免費且無限制 | UsefulVerse",
    "description": "根據兩個直徑和中心距估算皮帶長度、皮帶輪轉速和皮帶速度。免費、本地且無限制。",
    "intro": "估計兩個滑輪之間的簡單開放式皮帶的節距長度和速度關係。以相同單位輸入尺寸。",
    "howQuestion": "如何計算兩個皮帶輪之間的皮帶長度？",
    "howAnswer": "對於開放式雙皮帶輪驅動裝置，該計算器使用基於中心距和兩個皮帶輪直徑的通用近似值。假設沒有打滑，它也可以根據直徑比估算驅動轉速。",
    "privacyQuestion": "我的測量結果上傳了嗎？",
    "privacyAnswer": "不會。所有的計算和草圖都是在這個瀏覽器中產生的；您的測量結果不會上傳或儲存。",
    "fields": {
      "driverDiameter": "驅動輪直徑",
      "drivenDiameter": "從動帶輪直徑",
      "centerDistance": "滑輪中心間距離",
      "diameterUnit": "尺寸單位",
      "millimeters": "毫米 (mm)",
      "inches": "英吋（英吋）",
      "inputRpm": "驅動器輸入速度 (RPM)",
      "accuracyNote": "理想的開放式雙滑輪皮帶的近似節距長度。所有尺寸均使用相同的單位。實際的皮帶長度和速度可能因皮帶輪廓、節距、張力、滑動、磨損和公差而異。這不會選擇可購買的腰帶或評估力量、防護或安全性。使用前檢查製造商數據。在本地運行；沒有上傳。",
      "sketchTitle": "開放式傳送帶佈局（未按比例）",
      "sketchDescription": "透過開放式皮帶連接兩個皮帶輪的示意圖，驅動皮帶輪位於左側，從動皮帶輪位於右側。"
    },
    "actions": {
      "calculate": "計算皮帶傳動",
      "reset": "重置",
      "copy": "複製結果",
      "example": "負載範例",
      "result": "預計結果"
    },
    "messages": {
      "copied": "結果已複製。",
      "copyUnavailable": "複製在此瀏覽器中不可用。",
      "calculated": "已計算皮帶傳動估算值。",
      "checkInputs": "檢查直徑、中心距、單位和輸入轉速。",
      "beltLength": "大約皮帶節距長度",
      "outputRpm": "理想驅動速度",
      "speedRatio": "速比（驅動/從動）",
      "beltSpeed": "驅動帶速度",
      "smallWrap": "較小滑輪上的近似纏繞",
      "model": "模型",
      "openBelt": "開式二滑輪近似"
    },
    "additionalFaqs": [
      {
        "question": "皮帶長度的近似公式是什麼？",
        "answer": "常見的開式皮帶節距長度近似值為 L ≈ 2C + 1.57(D + d) + (D − d)²/(4C)，其中 C 是中心距，D 和 d 是較大且較小的皮帶輪節徑。實際的皮帶選擇應使用製造商的節距和尺寸資料。"
      },
      {
        "question": "皮帶輪直徑如何改變轉速？",
        "answer": "在沒有打滑的情況下，從動轉速大約等於輸入轉速乘以驅動器直徑再除以從動直徑。較大的從動皮帶輪會降低速度；較大的驅動皮帶輪會增加它。"
      },
      {
        "question": "該計算器是否包括皮帶打滑或張力？",
        "answer": "不會。這是開放式雙滑輪佈局的理想幾何形狀和比率估計。它不考慮滑動、張力、皮帶結構、負載、磨損或目錄皮帶尺寸。"
      },
      {
        "question": "我可以使用估價來訂購皮帶嗎？",
        "answer": "僅將其用作初步估計。在購買或操作驅動器之前，請確認皮帶節距、輪廓、有效長度、中心調整和製造商尺寸表。"
      }
    ]
  },
  "bg": {
    "copyLanguage": "bg",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Калкулатор на макари",
    "title": "Калкулатор на макара Безплатен и неограничен | UsefulVerse",
    "description": "Изчислете дължината на ремъка, оборотите на ремъка и скоростта на ремъка от два диаметъра и централно разстояние. Безплатно, местно и неограничено.",
    "intro": "Оценете връзката между дължината на стъпката и скоростта за обикновен отворен ремък между две макари. Въведете размери в същата единица.",
    "howQuestion": "Как изчислявате дължината на колана между две макари?",
    "howAnswer": "За отворено задвижване с две макари този калкулатор използва общо приближение въз основа на централното разстояние и диаметъра на двете макари. Той също така оценява задвижваните обороти от съотношението на диаметъра, като се приема, че няма приплъзване.",
    "privacyQuestion": "Моите измервания качени ли са?",
    "privacyAnswer": "Не. Всички изчисления и скицата се генерират в този браузър; вашите измервания не се качват или запазват.",
    "fields": {
      "driverDiameter": "Диаметър на задвижващата ролка",
      "drivenDiameter": "Диаметър на задвижваната шайба",
      "centerDistance": "Разстояние между центровете на макарите",
      "diameterUnit": "Мерна единица",
      "millimeters": "Милиметри (mm)",
      "inches": "Инчове (в)",
      "inputRpm": "Входна скорост на водача (RPM)",
      "accuracyNote": "Приблизителна дължина на стъпката за идеален отворен ремък с две макари. Използвайте една и съща единица за всички измерения. Реалната дължина и скорост на колана могат да се различават в зависимост от профила на колана, стъпката, напрежението, приплъзването, износването и допустимите отклонения. Това не избира колан, който може да бъде закупен, нито оценява мощност, защита или безопасност. Проверете данните на производителя преди употреба. Работи локално; няма качване.",
      "sketchTitle": "Оформление с отворен колан (не в мащаб)",
      "sketchDescription": "Диаграма на две макари, свързани с отворен ремък, с водача отляво и задвижващата ролка отдясно."
    },
    "actions": {
      "calculate": "Изчислете ремъчно задвижване",
      "reset": "Нулиране",
      "copy": "Копиране на резултатите",
      "example": "Пример за натоварване",
      "result": "Очаквани резултати"
    },
    "messages": {
      "copied": "Резултатите са копирани.",
      "copyUnavailable": "Копирането не е налично в този браузър.",
      "calculated": "Изчислена оценка за ремъчно задвижване.",
      "checkInputs": "Проверете двата диаметъра, центровото разстояние, единицата и входните RPM.",
      "beltLength": "Приблизителна дължина на стъпката на колана",
      "outputRpm": "Идеална скорост на движение",
      "speedRatio": "Съотношение на скоростта (водач/задвижван)",
      "beltSpeed": "Скорост на колана на водача",
      "smallWrap": "Приблизително обвиване на по-малък скрипец",
      "model": "Модел",
      "openBelt": "Отворено приближение с две макари"
    },
    "additionalFaqs": [
      {
        "question": "Каква е формулата за приблизителна дължина на колана?",
        "answer": "Общото приближение на дължината на стъпката на отворения ремък е L ≈ 2C + 1,57(D + d) + (D − d)²/(4C), където C е централното разстояние, а D и d са по-големият и по-малкият диаметър на стъпката на шайбата. Действителният избор на колан трябва да се основава на данните за стъпката и размера на производителя."
      },
      {
        "question": "Как се променя диаметърът на ролката в RPM?",
        "answer": "Без приплъзване задвижваните обороти са приблизително входни обороти, умножени по диаметъра на задвижващия механизъм и разделени на задвижвания диаметър. По-голямата задвижвана шайба намалява скоростта; по-голяма задвижваща шайба го увеличава."
      },
      {
        "question": "Този калкулатор включва ли приплъзване или напрежение на колана?",
        "answer": "Не. Това е идеална оценка на геометрията и съотношението за отворено оформление с две макари. Не отчита приплъзване, напрежение, конструкция на колана, натоварване, износване или каталожни размери на колана."
      },
      {
        "question": "Мога ли да използвам оценката, за да поръчам колан?",
        "answer": "Използвайте го само като първа оценка. Потвърдете стъпката на ремъка, профила, ефективната дължина, централната настройка и таблиците за оразмеряване на производителя, преди да закупите или използвате задвижване."
      }
    ]
  },
  "ca": {
    "copyLanguage": "ca",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Calculadora de politges",
    "title": "Calculadora de politges gratuïta i | UsefulVerse",
    "description": "Estimar la longitud de la corretja, les RPM de la politja i la velocitat de la corretja a partir de dos diàmetres i la distància central. Gratuït, local i...",
    "intro": "Estimar la relació entre la longitud de pas i la velocitat d'una corretja oberta simple entre dues politges. Introduïu dimensions a la mateixa unitat.",
    "howQuestion": "Com es calcula la longitud de la corretja entre dues politges?",
    "howAnswer": "Per a una unitat oberta de dues politges, aquesta calculadora utilitza una aproximació comuna basada en la distància central i els dos diàmetres de la politja. També estima les RPM impulsades a partir de la relació de diàmetres, suposant que no hi ha lliscament.",
    "privacyQuestion": "S'han penjat les meves mesures?",
    "privacyAnswer": "No. Tots els càlculs i l'esbós es generen en aquest navegador; les teves mesures no es carreguen ni es guarden.",
    "fields": {
      "driverDiameter": "Diàmetre de la politja conductora",
      "drivenDiameter": "Diàmetre de la politja conduïda",
      "centerDistance": "Distància entre els centres de la politja",
      "diameterUnit": "Unitat de dimensions",
      "millimeters": "Mil·límetres (mm)",
      "inches": "Polzades (polzades)",
      "inputRpm": "Velocitat d'entrada del conductor (RPM)",
      "accuracyNote": "Longitud aproximada de pas per a un cinturó ideal i obert de dues politges. Utilitzeu la mateixa unitat per a totes les dimensions. La longitud i la velocitat reals del cinturó poden diferir amb el perfil, el pas, la tensió, el lliscament, el desgast i les toleràncies del cinturó. Això no selecciona un cinturó comprable ni avalua la potència, la protecció o la seguretat. Comproveu les dades del fabricant abans d'utilitzar. Funciona localment; sense càrrega.",
      "sketchTitle": "Disseny de cinturó obert (no a escala)",
      "sketchDescription": "Esquema de dues politges connectades per una corretja oberta, amb el conductor a l'esquerra i la politja conduïda a la dreta."
    },
    "actions": {
      "calculate": "Calcula la transmissió per corretja",
      "reset": "Restableix",
      "copy": "Copia els resultats",
      "example": "Exemple de càrrega",
      "result": "Resultats estimats"
    },
    "messages": {
      "copied": "S'han copiat els resultats.",
      "copyUnavailable": "La còpia no està disponible en aquest navegador.",
      "calculated": "Estimació de la transmissió per corretja calculada.",
      "checkInputs": "Comproveu els dos diàmetres, la distància central, la unitat i les RPM d'entrada.",
      "beltLength": "Longitud aproximada del pas del cinturó",
      "outputRpm": "Velocitat de conducció ideal",
      "speedRatio": "Relació de velocitat (conductor/conduït)",
      "beltSpeed": "Velocitat del cinturó del conductor",
      "smallWrap": "Embolcall aproximat a la politja més petita",
      "model": "Model",
      "openBelt": "Aproximació oberta de dues politges"
    },
    "additionalFaqs": [
      {
        "question": "Quina és la fórmula aproximada de la longitud del cinturó?",
        "answer": "Una aproximació comuna de la longitud de pas de la corretja oberta és L ≈ 2C + 1,57(D + d) + (D − d)²/(4C), on C és la distància entre el centre i D i d són els diàmetres de pas de la politja més gran i més petit. La selecció real del cinturó hauria d'utilitzar les dades de mida i el pas del fabricant."
      },
      {
        "question": "Com canvia el diàmetre de la politja RPM?",
        "answer": "Sense lliscament, les RPM impulsades són aproximadament les RPM d'entrada multiplicades pel diàmetre del conductor i dividides pel diàmetre impulsat. Una politja conduïda més gran redueix la velocitat; una politja conductora més gran l'augmenta."
      },
      {
        "question": "Aquesta calculadora inclou el lliscament o la tensió del cinturó?",
        "answer": "No. És una estimació de geometria i proporció ideal per a una disposició oberta de dues politges. No té en compte el lliscament, la tensió, la construcció del cinturó, la càrrega, el desgast o les mides del cinturó de catàleg."
      },
      {
        "question": "Puc utilitzar el pressupost per demanar un cinturó?",
        "answer": "Utilitzeu-lo només com a primera estimació. Confirmeu el pas de la corretja, el perfil, la longitud efectiva, l'ajust central i les taules de mida del fabricant abans de comprar o utilitzar una unitat."
      }
    ]
  },
  "nl": {
    "copyLanguage": "nl",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Katrol rekenmachine",
    "title": "Katrolcalculator Gratis en onbeperkt | UsefulVerse",
    "description": "Schat de riemlengte, het toerental van de poelie en de riemsnelheid op basis van twee diameters en hartafstand. Gratis, lokaal en onbeperkt.",
    "intro": "Schat de relatie tussen de steeklengte en de snelheid voor een eenvoudige open riem tussen twee katrollen. Voer afmetingen in dezelfde eenheid in.",
    "howQuestion": "Hoe bereken je de riemlengte tussen twee poelies?",
    "howAnswer": "Voor een open aandrijving met twee poelies gebruikt deze calculator een gebruikelijke benadering op basis van de hartafstand en de twee poeliediameters. Het schat ook het aangedreven toerental op basis van de diameterverhouding, ervan uitgaande dat er geen slip is.",
    "privacyQuestion": "Worden mijn metingen geüpload?",
    "privacyAnswer": "Nee. Alle berekeningen en de schets worden in deze browser gegenereerd; uw metingen worden niet geüpload of opgeslagen.",
    "fields": {
      "driverDiameter": "Diameter aandrijfpoelie",
      "drivenDiameter": "Diameter aangedreven poelie",
      "centerDistance": "Afstand tussen de middelpunten van de poelies",
      "diameterUnit": "Afmeting eenheid",
      "millimeters": "Millimeter (mm)",
      "inches": "Inch (inch)",
      "inputRpm": "Ingangssnelheid bestuurder (RPM)",
      "accuracyNote": "Geschatte steeklengte voor een ideale, open riem met twee poelies. Gebruik dezelfde eenheid voor alle afmetingen. De werkelijke riemlengte en -snelheid kunnen verschillen afhankelijk van het riemprofiel, de spoed, de spanning, de slip, de slijtage en de toleranties. Hierbij wordt geen koopbare riem geselecteerd, noch wordt vermogen, bewaking of veiligheid beoordeeld. Controleer de gegevens van de fabrikant vóór gebruik. Draait lokaal; geen upload.",
      "sketchTitle": "Open bandindeling (niet op schaal)",
      "sketchDescription": "Schema van twee katrollen verbonden door een open riem, met de bestuurder links en de aangedreven katrol rechts."
    },
    "actions": {
      "calculate": "Bereken de riemaandrijving",
      "reset": "Opnieuw instellen",
      "copy": "Kopieer resultaten",
      "example": "Voorbeeld laden",
      "result": "Geschatte resultaten"
    },
    "messages": {
      "copied": "Resultaten gekopieerd.",
      "copyUnavailable": "Kopiëren is niet beschikbaar in deze browser.",
      "calculated": "Schatting van de riemaandrijving berekend.",
      "checkInputs": "Controleer beide diameters, hartafstand, eenheid en ingevoerd toerental.",
      "beltLength": "Geschatte lengte van de riemsteek",
      "outputRpm": "Ideale gereden snelheid",
      "speedRatio": "Snelheidsverhouding (bestuurder / gereden)",
      "beltSpeed": "Snelheid van de aandrijfriem",
      "smallWrap": "Geschatte wikkeling op kleinere katrol",
      "model": "Model",
      "openBelt": "Open benadering met twee katrollen"
    },
    "additionalFaqs": [
      {
        "question": "Wat is bij benadering de formule voor de riemlengte?",
        "answer": "Een gebruikelijke benadering van de steeklengte van een open riem is L ≈ 2C + 1,57 (D + d) + (D - d)²/(4C), waarbij C de hartafstand is en D en d de grotere en kleinere poeliesteekdiameters zijn. Bij de daadwerkelijke riemkeuze moet gebruik worden gemaakt van de steek- en maatgegevens van de fabrikant."
      },
      {
        "question": "Hoe verandert de poeliediameter het toerental?",
        "answer": "Zonder slip is het aangedreven toerental ongeveer het ingangstoerental vermenigvuldigd met de diameter van de aandrijving en gedeeld door de aangedreven diameter. Een grotere aangedreven katrol vermindert de snelheid; een grotere aandrijfpoelie vergroot deze."
      },
      {
        "question": "Houdt deze calculator rekening met riemslip of -spanning?",
        "answer": "Nee. Het is een ideale schatting van de geometrie en verhoudingen voor een open lay-out met twee katrollen. Er wordt geen rekening gehouden met slip, spanning, bandconstructie, belasting, slijtage of catalogusbandmaten."
      },
      {
        "question": "Kan ik de prijsopgave gebruiken om een ​​riem te bestellen?",
        "answer": "Gebruik het alleen als een eerste schatting. Controleer de riemsteek, het profiel, de effectieve lengte, de middenafstelling en de maattabellen van de fabrikant voordat u een aandrijving koopt of gebruikt."
      }
    ]
  },
  "el": {
    "copyLanguage": "el",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Αριθμομηχανή τροχαλίας",
    "title": "Αριθμομηχανή τροχαλίας Δωρεάν & Απεριόριστη | UsefulVerse",
    "description": "Υπολογίστε το μήκος του ιμάντα, τις σ.α.λ. της τροχαλίας και την ταχύτητα του ιμάντα από δύο διαμέτρους και την κεντρική απόσταση. Δωρεάν, τοπικό και...",
    "intro": "Υπολογίστε τη σχέση μήκους βήματος και ταχύτητας για έναν απλό ανοιχτό ιμάντα μεταξύ δύο τροχαλιών. Εισαγάγετε διαστάσεις στην ίδια μονάδα.",
    "howQuestion": "Πώς υπολογίζετε το μήκος ιμάντα μεταξύ δύο τροχαλιών;",
    "howAnswer": "Για μια ανοιχτή κίνηση δύο τροχαλιών, αυτή η αριθμομηχανή χρησιμοποιεί μια κοινή προσέγγιση με βάση την κεντρική απόσταση και τις δύο διαμέτρους τροχαλιών. Εκτιμά επίσης τις κινούμενες στροφές από την αναλογία διαμέτρου, υποθέτοντας ότι δεν υπάρχει ολίσθηση.",
    "privacyQuestion": "Έχουν ανέβει οι μετρήσεις μου;",
    "privacyAnswer": "Όχι. Όλοι οι υπολογισμοί και το σκίτσο δημιουργούνται σε αυτό το πρόγραμμα περιήγησης. οι μετρήσεις σας δεν μεταφορτώνονται ή αποθηκεύονται.",
    "fields": {
      "driverDiameter": "Διάμετρος τροχαλίας οδηγού",
      "drivenDiameter": "Διάμετρος κινούμενης τροχαλίας",
      "centerDistance": "Απόσταση μεταξύ των κέντρων της τροχαλίας",
      "diameterUnit": "Μονάδα διαστάσεων",
      "millimeters": "Χιλιοστά (mm)",
      "inches": "ίντσες (in)",
      "inputRpm": "Ταχύτητα εισόδου προγράμματος οδήγησης (RPM)",
      "accuracyNote": "Κατά προσέγγιση μήκος βήματος για έναν ιδανικό, ανοιχτό ιμάντα δύο τροχαλιών. Χρησιμοποιήστε την ίδια μονάδα για όλες τις διαστάσεις. Το πραγματικό μήκος και η ταχύτητα του ιμάντα μπορεί να διαφέρουν ανάλογα με το προφίλ, το βήμα, την τάση, την ολίσθηση, τη φθορά και τις ανοχές. Αυτό δεν επιλέγει μια ζώνη που μπορεί να αγοραστεί ούτε αξιολογεί την ισχύ, τη φύλαξη ή την ασφάλεια. Ελέγξτε τα δεδομένα κατασκευαστή πριν από τη χρήση. Εκτελείται τοπικά. χωρίς μεταφόρτωση.",
      "sketchTitle": "Διάταξη ανοιχτής ζώνης (όχι σε κλίμακα)",
      "sketchDescription": "Διάγραμμα δύο τροχαλιών που συνδέονται με ανοιχτό ιμάντα, με τον οδηγό στα αριστερά και την κινούμενη τροχαλία στα δεξιά."
    },
    "actions": {
      "calculate": "Υπολογισμός κίνησης ιμάντα",
      "reset": "Επαναφορά",
      "copy": "Αντιγραφή αποτελεσμάτων",
      "example": "Παράδειγμα φόρτωσης",
      "result": "Εκτιμώμενα αποτελέσματα"
    },
    "messages": {
      "copied": "Τα αποτελέσματα αντιγράφηκαν.",
      "copyUnavailable": "Το αντίγραφο δεν είναι διαθέσιμο σε αυτό το πρόγραμμα περιήγησης.",
      "calculated": "Υπολογίστηκε εκτίμηση κίνησης ιμάντα.",
      "checkInputs": "Ελέγξτε και τις δύο διαμέτρους, την κεντρική απόσταση, τη μονάδα και τις στροφές εισόδου.",
      "beltLength": "Κατά προσέγγιση μήκος βήματος ζώνης",
      "outputRpm": "Ιδανική ταχύτητα οδήγησης",
      "speedRatio": "Λόγος ταχύτητας (οδηγού/οδηγού)",
      "beltSpeed": "Ταχύτητα ζώνης οδηγού",
      "smallWrap": "Κατά προσέγγιση περιτύλιγμα σε μικρότερη τροχαλία",
      "model": "Μοντέλο",
      "openBelt": "Ανοιχτή προσέγγιση δύο τροχαλιών"
    },
    "additionalFaqs": [
      {
        "question": "Ποιος είναι ο κατά προσέγγιση τύπος μήκους ζώνης;",
        "answer": "Μια κοινή προσέγγιση μήκους βήματος ανοιχτού ιμάντα είναι L ≈ 2C + 1,57(D + d) + (D − d)²/(4C), όπου C είναι η κεντρική απόσταση και D και d είναι οι μεγαλύτερες και μικρότερες διάμετροι βήματος της τροχαλίας. Η πραγματική επιλογή ζώνης θα πρέπει να χρησιμοποιεί τα δεδομένα βήματος και μεγέθους του κατασκευαστή."
      },
      {
        "question": "Πώς αλλάζει η διάμετρος της τροχαλίας RPM;",
        "answer": "Χωρίς ολίσθηση, οι κινούμενες στροφές ανά λεπτό είναι κατά προσέγγιση RPM εισόδου πολλαπλασιαζόμενες με τη διάμετρο του οδηγού και διαιρούμενο με τη διάμετρο κίνησης. Μια μεγαλύτερη κινούμενη τροχαλία μειώνει την ταχύτητα. μια μεγαλύτερη τροχαλία οδηγού την αυξάνει."
      },
      {
        "question": "Αυτή η αριθμομηχανή περιλαμβάνει ολίσθηση ή τάνυση ζώνης;",
        "answer": "Όχι. Είναι μια ιδανική εκτίμηση γεωμετρίας και αναλογίας για μια ανοιχτή διάταξη δύο τροχαλιών. Δεν λαμβάνει υπόψη τα μεγέθη ζώνης ολίσθησης, τάνυσης, κατασκευής ιμάντα, φορτίου, φθοράς ή καταλόγου."
      },
      {
        "question": "Μπορώ να χρησιμοποιήσω την εκτίμηση για να παραγγείλω μια ζώνη;",
        "answer": "Χρησιμοποιήστε το μόνο ως πρώτη εκτίμηση. Επιβεβαιώστε το βήμα του ιμάντα, το προφίλ, το πραγματικό μήκος, τη ρύθμιση του κέντρου και τους πίνακες μεγεθών κατασκευαστή πριν αγοράσετε ή χειριστείτε μια μονάδα δίσκου."
      }
    ]
  },
  "ms": {
    "copyLanguage": "ms",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Kalkulator Takal",
    "title": "Kalkulator Takal Percuma & Tanpa Had | UsefulVerse",
    "description": "Anggarkan panjang tali pinggang, RPM takal dan kelajuan tali pinggang dari dua diameter dan jarak tengah. Percuma, tempatan dan tidak terhad.",
    "intro": "Anggarkan panjang pic dan hubungan kelajuan untuk tali pinggang terbuka yang ringkas antara dua takal. Masukkan dimensi dalam unit yang sama.",
    "howQuestion": "Bagaimanakah anda mengira panjang tali pinggang antara dua takal?",
    "howAnswer": "Untuk pemacu dua takal terbuka, kalkulator ini menggunakan anggaran biasa berdasarkan jarak tengah dan dua diameter takal. Ia juga menganggarkan RPM terdorong daripada nisbah diameter, dengan mengandaikan tiada gelongsor.",
    "privacyQuestion": "Adakah ukuran saya dimuat naik?",
    "privacyAnswer": "Tidak. Semua pengiraan dan lakaran dijana dalam pelayar ini; ukuran anda tidak dimuat naik atau disimpan.",
    "fields": {
      "driverDiameter": "Diameter takal pemandu",
      "drivenDiameter": "Diameter takal dipacu",
      "centerDistance": "Jarak antara pusat takal",
      "diameterUnit": "Unit dimensi",
      "millimeters": "milimeter (mm)",
      "inches": "Inci (dalam)",
      "inputRpm": "Kelajuan input pemacu (RPM)",
      "accuracyNote": "Anggaran panjang padang untuk tali pinggang dua takal yang ideal dan terbuka. Gunakan unit yang sama untuk semua dimensi. Panjang dan kelajuan tali pinggang sebenar boleh berbeza dengan profil tali pinggang, padang, ketegangan, gelinciran, haus dan toleransi. Ini tidak memilih tali pinggang yang boleh dibeli atau menilai kuasa, pengawal atau keselamatan. Semak data pengilang sebelum digunakan. Berjalan secara tempatan; tiada muat naik.",
      "sketchTitle": "Susun atur tali pinggang terbuka (bukan mengikut skala)",
      "sketchDescription": "Gambar rajah dua takal yang disambungkan oleh tali pinggang terbuka, dengan pemandu di sebelah kiri dan takal dipacu di sebelah kanan."
    },
    "actions": {
      "calculate": "Kira pemacu tali pinggang",
      "reset": "Tetapkan semula",
      "copy": "Salin keputusan",
      "example": "Muatkan contoh",
      "result": "Anggaran hasil"
    },
    "messages": {
      "copied": "Keputusan disalin.",
      "copyUnavailable": "Salinan tidak tersedia dalam penyemak imbas ini.",
      "calculated": "Anggaran pemacu tali pinggang dikira.",
      "checkInputs": "Periksa kedua-dua diameter, jarak tengah, unit dan RPM input.",
      "beltLength": "Anggaran panjang padang tali pinggang",
      "outputRpm": "Kelajuan yang dipandu ideal",
      "speedRatio": "Nisbah kelajuan (pemandu / dipandu)",
      "beltSpeed": "Kelajuan tali pinggang pemandu",
      "smallWrap": "Balut anggaran pada takal yang lebih kecil",
      "model": "Model",
      "openBelt": "Buka anggaran dua takal"
    },
    "additionalFaqs": [
      {
        "question": "Apakah anggaran formula panjang tali pinggang?",
        "answer": "Anggaran panjang pic tali pinggang terbuka yang biasa ialah L ≈ 2C + 1.57(D + d) + (D − d)²/(4C), dengan C ialah jarak tengah dan D dan d ialah diameter pic takal yang lebih besar dan lebih kecil. Pemilihan tali pinggang sebenar harus menggunakan data padang dan saiz pengeluar."
      },
      {
        "question": "Bagaimanakah diameter takal menukar RPM?",
        "answer": "Tanpa gelincir, RPM terdorong adalah lebih kurang RPM input didarab dengan diameter pemacu dan dibahagikan dengan diameter terdorong. Takal didorong yang lebih besar mengurangkan kelajuan; takal pemandu yang lebih besar meningkatkannya."
      },
      {
        "question": "Adakah kalkulator ini termasuk slip atau ketegangan tali pinggang?",
        "answer": "Tidak. Ia merupakan anggaran geometri dan nisbah yang ideal untuk susun atur dua takal terbuka. Ia tidak mengambil kira saiz gelongsor, ketegangan, pembinaan tali pinggang, beban, haus atau katalog tali pinggang."
      },
      {
        "question": "Bolehkah saya menggunakan anggaran untuk menempah tali pinggang?",
        "answer": "Gunakannya sebagai anggaran pertama sahaja. Sahkan padang tali pinggang, profil, panjang berkesan, pelarasan tengah dan jadual saiz pengeluar sebelum membeli atau mengendalikan pemacu."
      }
    ]
  },
  "pl": {
    "copyLanguage": "pl",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Kalkulator koła pasowego",
    "title": "Kalkulator koła pasowego bezpłatny i | UsefulVerse",
    "description": "Oszacuj długość paska, prędkość obrotową koła pasowego i prędkość paska na podstawie dwóch średnic i odległości od środka. Bezpłatnie, lokalnie i bez...",
    "intro": "Oszacuj zależność długości podziałki i prędkości dla prostego otwartego pasa pomiędzy dwoma kołami pasowymi. Wprowadź wymiary w tej samej jednostce.",
    "howQuestion": "Jak obliczyć długość paska między dwoma kołami pasowymi?",
    "howAnswer": "W przypadku otwartego napędu dwukołowego kalkulator ten wykorzystuje typowe przybliżenie oparte na odległości od środka i dwóch średnicach kół pasowych. Oszacowuje również napędzane obroty na podstawie stosunku średnicy, zakładając brak poślizgu.",
    "privacyQuestion": "Czy moje pomiary zostały przesłane?",
    "privacyAnswer": "Nie. Wszystkie obliczenia i szkic są generowane w tej przeglądarce; Twoje pomiary nie zostały przesłane ani zapisane.",
    "fields": {
      "driverDiameter": "Średnica koła pasowego napędu",
      "drivenDiameter": "Średnica napędzanego koła pasowego",
      "centerDistance": "Odległość między środkami kół pasowych",
      "diameterUnit": "Jednostka wymiaru",
      "millimeters": "Milimetry (mm)",
      "inches": "Cale (cale)",
      "inputRpm": "Prędkość wejściowa kierowcy (RPM)",
      "accuracyNote": "Przybliżona długość podziałowa idealnego, otwartego paska z dwoma kołami pasowymi. Użyj tej samej jednostki dla wszystkich wymiarów. Rzeczywista długość i prędkość paska mogą się różnić w zależności od profilu paska, skoku, napięcia, poślizgu, zużycia i tolerancji. Nie dotyczy to wyboru pasa, który można kupić, ani oceny mocy, ochrony ani bezpieczeństwa. Przed użyciem sprawdź dane producenta. Działa lokalnie; brak przesyłania.",
      "sketchTitle": "Układ z otwartym pasem (nie w skali)",
      "sketchDescription": "Schemat dwóch kół pasowych połączonych otwartym paskiem, z zabierakiem po lewej stronie i napędzanym kołem pasowym po prawej stronie."
    },
    "actions": {
      "calculate": "Oblicz napęd pasowy",
      "reset": "Nastawić",
      "copy": "Skopiuj wyniki",
      "example": "Załaduj przykład",
      "result": "Szacowane wyniki"
    },
    "messages": {
      "copied": "Wyniki skopiowane.",
      "copyUnavailable": "Kopia nie jest dostępna w tej przeglądarce.",
      "calculated": "Obliczono oszacowanie napędu pasowego.",
      "checkInputs": "Sprawdź obie średnice, odległość od środka, jednostkę i obroty wejściowe.",
      "beltLength": "Przybliżona długość podziałki paska",
      "outputRpm": "Idealna prędkość jazdy",
      "speedRatio": "Stosunek prędkości (kierowca/prowadzony)",
      "beltSpeed": "Prędkość pasa kierowcy",
      "smallWrap": "Przybliżone owinięcie na mniejszym kole pasowym",
      "model": "Model",
      "openBelt": "Otwarte przybliżenie dwukołowe"
    },
    "additionalFaqs": [
      {
        "question": "Jaki jest przybliżony wzór na długość paska?",
        "answer": "Typowym przybliżeniem długości podziałowej pasa otwartego jest L ≈ 2C + 1,57 (D + d) + (D - d)²/(4C), gdzie C to odległość od środka, a D i d to większe i mniejsze średnice podziałowe kół pasowych. Rzeczywisty dobór paska powinien opierać się na danych dotyczących podziałki i rozmiaru producenta."
      },
      {
        "question": "Jak średnica koła pasowego zmienia prędkość obrotową?",
        "answer": "Bez poślizgu, napędzane obroty to w przybliżeniu wejściowe obroty pomnożone przez średnicę zabieraka i podzielone przez napędzaną średnicę. Większe napędzane koło pasowe zmniejsza prędkość; większe koło pasowe napędu zwiększa je."
      },
      {
        "question": "Czy ten kalkulator uwzględnia poślizg i napięcie paska?",
        "answer": "Nie. Jest to idealna szacunkowa geometria i przełożenie dla otwartego układu z dwoma kołami pasowymi. Nie uwzględnia poślizgu, napięcia, konstrukcji paska, obciążenia, zużycia ani katalogowych rozmiarów pasów."
      },
      {
        "question": "Czy mogę skorzystać z wyceny przy zamówieniu paska?",
        "answer": "Użyj go tylko jako pierwszego oszacowania. Przed zakupem lub uruchomieniem napędu sprawdź podziałkę paska, profil, długość efektywną, regulację środkową i tabele rozmiarów producenta."
      }
    ]
  },
  "sv": {
    "copyLanguage": "sv",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Remskiva Kalkylator",
    "title": "Pulley Calculator gratis och obegränsat | UsefulVerse",
    "description": "Beräkna remlängd, remskiva RPM och remhastighet från två diametrar och centrumavstånd. Gratis, lokalt och obegränsat.",
    "intro": "Uppskatta stigningslängden och hastighetsförhållandet för en enkel öppen rem mellan två remskivor. Ange mått i samma enhet.",
    "howQuestion": "Hur räknar man ut remlängden mellan två remskivor?",
    "howAnswer": "För en öppen tvåhjulsdrift använder denna kalkylator en vanlig approximation baserad på centrumavstånd och de två remskivornas diametrar. Den uppskattar också drivna varvtal från diameterförhållandet, förutsatt att inget slirning sker.",
    "privacyQuestion": "Är mina mått uppladdade?",
    "privacyAnswer": "Nej. Alla beräkningar och skissen genereras i den här webbläsaren; dina mått laddas inte upp eller sparas.",
    "fields": {
      "driverDiameter": "Drivskiva diameter",
      "drivenDiameter": "Driv remskiva diameter",
      "centerDistance": "Avstånd mellan remskivors centrum",
      "diameterUnit": "Måttenhet",
      "millimeters": "Millimeter (mm)",
      "inches": "tum (in)",
      "inputRpm": "Förarens ingångshastighet (RPM)",
      "accuracyNote": "Ungefärlig stigningslängd för en idealisk, öppen rem med två remskivor. Använd samma enhet för alla dimensioner. Verklig bandlängd och hastighet kan skilja sig åt med bandprofil, stigning, spänning, slirning, slitage och toleranser. Detta väljer inte ett köpbart bälte eller bedömer kraft, skydd eller säkerhet. Kontrollera tillverkarens data före användning. Körs lokalt; ingen uppladdning.",
      "sketchTitle": "Layout med öppet bälte (inte i skalen)",
      "sketchDescription": "Diagram över två remskivor förbundna med en öppen rem, med föraren till vänster och driven remskiva till höger."
    },
    "actions": {
      "calculate": "Beräkna remdrift",
      "reset": "Återställa",
      "copy": "Kopiera resultat",
      "example": "Ladda exempel",
      "result": "Uppskattade resultat"
    },
    "messages": {
      "copied": "Resultaten har kopierats.",
      "copyUnavailable": "Kopiera är inte tillgängligt i den här webbläsaren.",
      "calculated": "Uppskattning av remdrift beräknad.",
      "checkInputs": "Kontrollera både diametrar, centrumavstånd, enhet och ingående varvtal.",
      "beltLength": "Ungefärlig bandstigningslängd",
      "outputRpm": "Idealisk körhastighet",
      "speedRatio": "Hastighetsförhållande (förare/körd)",
      "beltSpeed": "Förarens bältes hastighet",
      "smallWrap": "Ungefärlig lindning på mindre remskiva",
      "model": "Modell",
      "openBelt": "Öppna tvåhjulsapproximation"
    },
    "additionalFaqs": [
      {
        "question": "Vad är formeln för ungefärlig bälteslängd?",
        "answer": "En vanlig approximation av stigningslängd för öppen rem är L ≈ 2C + 1,57(D + d) + (D − d)²/(4C), där C är centrumavstånd och D och d är de större och mindre remskivornas stigningsdiametrar. Faktiskt val av bälte bör använda tillverkarens stignings- och storleksdata."
      },
      {
        "question": "Hur ändrar remskivans diameter RPM?",
        "answer": "Utan slirning är det drivna varvtalet ungefär ingående varvtal multiplicerat med drivhjulsdiameter och dividerat med driven diameter. En större driven remskiva minskar hastigheten; en större drivremskiva ökar den."
      },
      {
        "question": "Inkluderar denna kalkylator remslirning eller spänning?",
        "answer": "Nej. Det är en idealisk uppskattning av geometri och förhållande för en öppen layout med två remskivor. Den tar inte hänsyn till slirning, spänning, remkonstruktion, belastning, slitage eller katalogbandstorlekar."
      },
      {
        "question": "Kan jag använda uppskattningen för att beställa ett bälte?",
        "answer": "Använd det endast som en första uppskattning. Bekräfta remstigning, profil, effektiv längd, centrumjustering och tillverkarens storlekstabeller innan du köper eller använder en enhet."
      }
    ]
  },
  "th": {
    "copyLanguage": "th",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "เครื่องคิดเลขลูกรอก",
    "title": "เครื่องคิดเลข Pulley ฟรีและไม่ จำกัด | UsefulVerse",
    "description": "ประมาณความยาวของสายพาน, RPM ของรอก และความเร็วของสายพานจากเส้นผ่านศูนย์กลางสองเส้นและระยะห่างจากศูนย์กลาง ฟรี ในพื้นที่ และไม่จำกัด",
    "intro": "ประมาณความสัมพันธ์ระหว่างความยาวพิทช์และความเร็วของสายพานเปิดธรรมดาระหว่างรอกสองตัว ป้อนขนาดในหน่วยเดียวกัน",
    "howQuestion": "คุณจะคำนวณความยาวของสายพานระหว่างรอกสองตัวได้อย่างไร?",
    "howAnswer": "สำหรับไดรฟ์สองลูกรอกแบบเปิด เครื่องคิดเลขนี้ใช้การประมาณทั่วไปโดยพิจารณาจากระยะห่างจากศูนย์กลางและเส้นผ่านศูนย์กลางของรอกทั้งสอง นอกจากนี้ยังประมาณค่า RPM ที่ขับเคลื่อนจากอัตราส่วนเส้นผ่านศูนย์กลาง โดยถือว่าไม่มีการลื่นไถล",
    "privacyQuestion": "การวัดของฉันถูกอัปโหลดหรือไม่?",
    "privacyAnswer": "ไม่ การคำนวณและภาพร่างทั้งหมดถูกสร้างขึ้นในเบราว์เซอร์นี้ การวัดของคุณไม่ได้อัปโหลดหรือบันทึก",
    "fields": {
      "driverDiameter": "เส้นผ่านศูนย์กลางรอกของไดรเวอร์",
      "drivenDiameter": "เส้นผ่านศูนย์กลางลูกรอกขับเคลื่อน",
      "centerDistance": "ระยะห่างระหว่างศูนย์ลูกรอก",
      "diameterUnit": "หน่วยมิติ",
      "millimeters": "มิลลิเมตร (มม.)",
      "inches": "นิ้ว (นิ้ว)",
      "inputRpm": "ความเร็วอินพุตของไดรเวอร์ (RPM)",
      "accuracyNote": "ความยาวพิทช์โดยประมาณสำหรับสายพานสองลูกรอกแบบเปิดในอุดมคติ ใช้หน่วยเดียวกันสำหรับทุกมิติ ความยาวและความเร็วจริงของสายพานอาจแตกต่างกันไปตามโปรไฟล์ของสายพาน ระยะพิทช์ ความตึง การลื่น การสึกหรอ และพิกัดความเผื่อ การดำเนินการนี้ไม่ได้เลือกเข็มขัดที่ซื้อได้หรือประเมินกำลัง การป้องกัน หรือความปลอดภัย ตรวจสอบข้อมูลผู้ผลิตก่อนใช้งาน ทำงานในพื้นที่ ไม่มีการอัพโหลด",
      "sketchTitle": "รูปแบบสายพานเปิด (ไม่ปรับขนาด)",
      "sketchDescription": "แผนผังของรอกสองตัวที่เชื่อมต่อกันด้วยสายพานเปิด โดยมีตัวขับอยู่ทางด้านซ้ายและรอกขับเคลื่อนอยู่ทางด้านขวา"
    },
    "actions": {
      "calculate": "คำนวณสายพานขับ",
      "reset": "รีเซ็ต",
      "copy": "คัดลอกผลลัพธ์",
      "example": "โหลดตัวอย่าง",
      "result": "ผลลัพธ์โดยประมาณ"
    },
    "messages": {
      "copied": "คัดลอกผลลัพธ์แล้ว",
      "copyUnavailable": "คัดลอกไม่พร้อมใช้งานในเบราว์เซอร์นี้",
      "calculated": "คำนวณประมาณการสายพานขับแล้ว",
      "checkInputs": "ตรวจสอบทั้งเส้นผ่านศูนย์กลาง ระยะศูนย์กลาง หน่วย และ RPM อินพุต",
      "beltLength": "ความยาวพิทช์ของสายพานโดยประมาณ",
      "outputRpm": "ความเร็วขับเคลื่อนที่เหมาะสม",
      "speedRatio": "อัตราส่วนความเร็ว (คนขับ / ขับเคลื่อน)",
      "beltSpeed": "ความเร็วของสายพานคนขับ",
      "smallWrap": "พันประมาณบนรอกขนาดเล็ก",
      "model": "แบบอย่าง",
      "openBelt": "เปิดการประมาณสองลูกรอก"
    },
    "additionalFaqs": [
      {
        "question": "สูตรความยาวสายพานโดยประมาณคือเท่าใด",
        "answer": "การประมาณความยาวพิตช์ของสายพานเปิดทั่วไปคือ L µ 2C + 1.57(D + d) + (D − d)²/(4C) โดยที่ C คือระยะห่างจากศูนย์กลาง และ D และ d คือเส้นผ่านศูนย์กลางพิตช์ของรอกที่ใหญ่กว่าและเล็กกว่า การเลือกสายพานจริงควรใช้ข้อมูลระยะห่างและขนาดของผู้ผลิต"
      },
      {
        "question": "เส้นผ่านศูนย์กลางของรอกเปลี่ยน RPM อย่างไร",
        "answer": "เมื่อไม่มีสลิป RPM ที่ขับเคลื่อนจะมีค่า RPM อินพุตโดยประมาณคูณด้วยเส้นผ่านศูนย์กลางตัวขับและหารด้วยเส้นผ่านศูนย์กลางตัวขับเคลื่อน รอกขับเคลื่อนที่ใหญ่กว่าจะช่วยลดความเร็ว ลูกรอกของคนขับที่ใหญ่กว่าจะเพิ่มขึ้น"
      },
      {
        "question": "เครื่องคิดเลขนี้รวมการเลื่อนของสายพานหรือความตึงหรือไม่",
        "answer": "ไม่ นี่เป็นรูปทรงเรขาคณิตและการประมาณอัตราส่วนที่เหมาะสมที่สุดสำหรับเลย์เอาท์แบบสองรอกแบบเปิด โดยไม่ได้คำนึงถึงการลื่น ความตึง โครงสร้างของสายพาน น้ำหนักบรรทุก การสึกหรอ หรือขนาดสายพานตามแค็ตตาล็อก"
      },
      {
        "question": "ฉันสามารถใช้ประมาณการเพื่อสั่งเข็มขัดได้หรือไม่?",
        "answer": "ใช้เป็นการประมาณการครั้งแรกเท่านั้น ตรวจสอบระยะห่างของสายพาน โปรไฟล์ ความยาวที่มีประสิทธิภาพ การปรับกึ่งกลาง และตารางขนาดของผู้ผลิตก่อนซื้อหรือใช้งานระบบขับเคลื่อน"
      }
    ]
  },
  "uk": {
    "copyLanguage": "uk",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Калькулятор шківа",
    "title": "Безкоштовний і необмежений калькулятор шківа | UsefulVerse",
    "description": "Оцініть довжину ременя, оберти шківа та швидкість ременя за двома діаметрами та міжцентровою відстанню. Безкоштовно, локально та без обмежень.",
    "intro": "Оцініть співвідношення довжини кроку та швидкості для простого відкритого ременя між двома шківами. Введіть розміри в одній одиниці.",
    "howQuestion": "Як розрахувати довжину ременя між двома шківами?",
    "howAnswer": "Для відкритого приводу з двома шківами цей калькулятор використовує загальне наближення на основі міжцентрової відстані та діаметрів двох шківів. Він також оцінює кількість обертів на хвилину на основі співвідношення діаметрів, припускаючи відсутність ковзання.",
    "privacyQuestion": "Чи завантажено мої вимірювання?",
    "privacyAnswer": "Ні. Усі розрахунки та ескіз генеруються в цьому браузері; ваші вимірювання не завантажуються та не зберігаються.",
    "fields": {
      "driverDiameter": "Діаметр приводного шківа",
      "drivenDiameter": "Діаметр веденого шківа",
      "centerDistance": "Відстань між центрами шківів",
      "diameterUnit": "Одиниця вимірювання",
      "millimeters": "міліметри (мм)",
      "inches": "Дюйми (in)",
      "inputRpm": "Вхідна швидкість водія (RPM)",
      "accuracyNote": "Приблизна довжина кроку для ідеального відкритого ременя з двома шківами. Використовуйте одну одиницю для всіх розмірів. Реальна довжина та швидкість стрічки можуть відрізнятися залежно від профілю стрічки, кроку, натягу, ковзання, зносу та допусків. Це не вибирає ремінь, який можна придбати, і не оцінює потужність, захист чи безпеку. Перед використанням перевірте дані виробника. Запускається локально; немає завантаження.",
      "sketchTitle": "Відкритий пояс (не в масштабі)",
      "sketchDescription": "Діаграма двох шківів, з’єднаних відкритим ременем, з приводом ліворуч і веденим шківом праворуч."
    },
    "actions": {
      "calculate": "Розрахувати пасову передачу",
      "reset": "Скинути",
      "copy": "Копіювати результати",
      "example": "Приклад навантаження",
      "result": "Орієнтовні результати"
    },
    "messages": {
      "copied": "Результати скопійовано.",
      "copyUnavailable": "Копіювання недоступне в цьому браузері.",
      "calculated": "Розрахована оцінка пасової передачі.",
      "checkInputs": "Перевірте обидва діаметри, міжцентрову відстань, одиницю вимірювання та кількість обертів на хвилину.",
      "beltLength": "Приблизна довжина кроку ременя",
      "outputRpm": "Ідеальна швидкість руху",
      "speedRatio": "Співвідношення швидкості (водій / керований)",
      "beltSpeed": "Швидкість ременя водія",
      "smallWrap": "Приблизне намотування на менший шків",
      "model": "Модель",
      "openBelt": "Відкрита двошківна апроксимація"
    },
    "additionalFaqs": [
      {
        "question": "Яка приблизна формула довжини пояса?",
        "answer": "Загальне наближення довжини кроку відкритого ременя становить L ≈ 2C + 1,57(D + d) + (D − d)²/(4C), де C — міжцентрова відстань, а D і d — більший і менший діаметри кроку шківа. Фактичний вибір ременя повинен ґрунтуватися на даних виробника про крок і розміри."
      },
      {
        "question": "Як діаметр шківа змінює частоту обертання?",
        "answer": "Без ковзання кількість обертів на хвилину приводу дорівнює приблизно вхідній частоті обертів на хвилину, помноженій на діаметр приводу та поділеній на діаметр приводу. Більший ведений шків зменшує швидкість; більший ведучий шків збільшує його."
      },
      {
        "question": "Цей калькулятор включає ковзання або натяг ременя?",
        "answer": "Ні. Це ідеальна оцінка геометрії та співвідношення для відкритого макета з двома шківами. Він не враховує ковзання, натяг, конструкцію ременя, навантаження, знос або каталожні розміри ременя."
      },
      {
        "question": "Чи можу я скористатися кошторисом для замовлення пояса?",
        "answer": "Використовуйте його лише як першу оцінку. Перевірте крок ременя, профіль, ефективну довжину, регулювання центру та таблиці розмірів виробника перед покупкою або експлуатацією приводу."
      }
    ]
  },
  "sw": {
    "copyLanguage": "sw",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Kikokotoo cha Pulley",
    "title": "Kikokotoo cha Pulley Bure & Bila kikomo | UsefulVerse",
    "description": "Kadiria urefu wa ukanda, kapi ya RPM na kasi ya ukanda kutoka kwa vipenyo viwili na umbali wa katikati. Bure, ya ndani na isiyo na kikomo.",
    "intro": "Kadiria urefu wa lami na uhusiano wa kasi kwa ukanda rahisi wazi kati ya kapi mbili. Ingiza vipimo katika kitengo sawa.",
    "howQuestion": "Unahesabuje urefu wa mkanda kati ya kapi mbili?",
    "howAnswer": "Kwa kiendeshi cha kapi mbili wazi, kikokotoo hiki kinatumia makadirio ya kawaida kulingana na umbali wa katikati na vipenyo viwili vya kapi. Pia inakadiria RPM inayoendeshwa kutoka kwa uwiano wa kipenyo, ikizingatiwa hakuna kuteleza.",
    "privacyQuestion": "Je, vipimo vyangu vimepakiwa?",
    "privacyAnswer": "Hapana. Mahesabu yote na mchoro hutolewa katika kivinjari hiki; vipimo vyako havijapakiwa au kuhifadhiwa.",
    "fields": {
      "driverDiameter": "Kipenyo cha pulley ya dereva",
      "drivenDiameter": "Kipenyo cha pulley inayoendeshwa",
      "centerDistance": "Umbali kati ya vituo vya pulley",
      "diameterUnit": "Kitengo cha vipimo",
      "millimeters": "Milimita (mm)",
      "inches": "Inchi (ndani)",
      "inputRpm": "Kasi ya kuingiza kiendeshi (RPM)",
      "accuracyNote": "Takriban urefu wa lami kwa mkanda bora, wazi wa puli mbili. Tumia kitengo sawa kwa vipimo vyote. Urefu wa kweli wa ukanda na kasi inaweza kutofautiana na wasifu wa ukanda, lami, mvutano, kuteleza, kuvaa na uvumilivu. Hii haichagui mkanda unaoweza kununuliwa au kutathmini nguvu, ulinzi au usalama. Angalia data ya mtengenezaji kabla ya kutumia. Inaendesha ndani ya nchi; hakuna upakiaji.",
      "sketchTitle": "Mpangilio wa ukanda wazi (sio kwa kiwango)",
      "sketchDescription": "Mchoro wa kapi mbili zilizounganishwa na ukanda wazi, na dereva upande wa kushoto na kapi inayoendeshwa upande wa kulia."
    },
    "actions": {
      "calculate": "Kuhesabu gari la ukanda",
      "reset": "Weka upya",
      "copy": "Nakili matokeo",
      "example": "Mfano wa mzigo",
      "result": "Matokeo yaliyokadiriwa"
    },
    "messages": {
      "copied": "Matokeo yamenakiliwa.",
      "copyUnavailable": "Nakala haipatikani katika kivinjari hiki.",
      "calculated": "Kadirio la ukandamizaji limekokotolewa.",
      "checkInputs": "Angalia vipenyo vyote viwili, umbali wa katikati, kitengo na pembejeo RPM.",
      "beltLength": "Takriban urefu wa lami ya ukanda",
      "outputRpm": "Kasi inayofaa inayoendeshwa",
      "speedRatio": "Uwiano wa kasi (dereva / inaendeshwa)",
      "beltSpeed": "Kasi ya ukanda wa dereva",
      "smallWrap": "Ufungaji wa takriban kwenye pulley ndogo",
      "model": "Mfano",
      "openBelt": "Fungua makadirio ya puli mbili"
    },
    "additionalFaqs": [
      {
        "question": "Je! ni takriban fomula gani ya urefu wa mkanda?",
        "answer": "Kadirio la kawaida la urefu wa lami ya ukanda ulio wazi ni L ≈ 2C + 1.57(D + d) + (D − d)²/(4C), ambapo C ni umbali wa katikati na D na d ni vipenyo vikubwa na vidogo vya lami. Uchaguzi halisi wa mikanda unapaswa kutumia data ya sauti na ukubwa wa mtengenezaji."
      },
      {
        "question": "Je, kipenyo cha pulley kinabadilishaje RPM?",
        "answer": "Bila kuteleza, RPM inayoendeshwa ni takriban pembejeo ya RPM inayozidishwa na kipenyo cha kiendeshi na kugawanywa kwa kipenyo kinachoendeshwa. Pulley kubwa inayoendeshwa hupunguza kasi; kapi kubwa ya dereva huongeza."
      },
      {
        "question": "Je, kikokotoo hiki kinajumuisha kuteleza kwa ukanda au mvutano?",
        "answer": "Hapana. Ni jiometri bora na makadirio ya uwiano kwa mpangilio wazi wa puli mbili. Haizingatii kuteleza, mvutano, ujenzi wa mikanda, mzigo, uvaaji au saizi za mikanda ya katalogi."
      },
      {
        "question": "Je, ninaweza kutumia makadirio kuagiza ukanda?",
        "answer": "Itumie kama makadirio ya kwanza pekee. Thibitisha kiwango cha ukanda, wasifu, urefu unaofaa, marekebisho ya kituo na meza za ukubwa wa mtengenezaji kabla ya kununua au kuendesha gari."
      }
    ]
  },
  "mr": {
    "copyLanguage": "mr",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "पुली कॅल्क्युलेटर",
    "title": "पुली कॅल्क्युलेटर विनामूल्य आणि अमर्यादित | UsefulVerse",
    "description": "दोन व्यास आणि मध्यभागी अंतरावरून बेल्टची लांबी, पुली RPM आणि बेल्टचा वेग अंदाज लावा. विनामूल्य, स्थानिक आणि अमर्यादित.",
    "intro": "दोन पुलींमधील साध्या खुल्या पट्ट्यासाठी खेळपट्टीची लांबी आणि गती संबंधाचा अंदाज लावा. त्याच युनिटमध्ये परिमाणे प्रविष्ट करा.",
    "howQuestion": "दोन पुलींमधील बेल्टची लांबी तुम्ही कशी मोजता?",
    "howAnswer": "ओपन टू-पली ड्राईव्हसाठी, हा कॅल्क्युलेटर मध्यभागी अंतर आणि दोन पुली व्यासांवर आधारित सामान्य अंदाजे वापरतो. ते व्यास गुणोत्तरावरून चालविलेल्या RPM चाही अंदाज लावते, स्लिप नाही असे गृहीत धरते.",
    "privacyQuestion": "माझे मोजमाप अपलोड केले आहेत?",
    "privacyAnswer": "नाही. सर्व गणना आणि स्केच या ब्राउझरमध्ये व्युत्पन्न केले जातात; तुमचे मोजमाप अपलोड किंवा जतन केलेले नाहीत.",
    "fields": {
      "driverDiameter": "ड्रायव्हर पुली व्यास",
      "drivenDiameter": "चरित कप्पी व्यास",
      "centerDistance": "पुली केंद्रांमधील अंतर",
      "diameterUnit": "परिमाण युनिट",
      "millimeters": "मिलिमीटर (मिमी)",
      "inches": "इंच (मध्ये)",
      "inputRpm": "ड्रायव्हर इनपुट स्पीड (RPM)",
      "accuracyNote": "आदर्श, खुल्या दोन-पुली बेल्टसाठी अंदाजे खेळपट्टीची लांबी. सर्व परिमाणांसाठी समान युनिट वापरा. बेल्ट प्रोफाइल, खेळपट्टी, ताण, स्लिप, परिधान आणि सहनशीलतेसह वास्तविक बेल्टची लांबी आणि वेग भिन्न असू शकतो. हे खरेदी करण्यायोग्य बेल्ट निवडत नाही किंवा शक्ती, पहारा किंवा सुरक्षिततेचे मूल्यांकन करत नाही. वापरण्यापूर्वी निर्माता डेटा तपासा. स्थानिक पातळीवर चालते; अपलोड नाही.",
      "sketchTitle": "ओपन-बेल्ट लेआउट (स्केल करण्यासाठी नाही)",
      "sketchDescription": "खुल्या पट्ट्याने जोडलेल्या दोन पुलींचा आकृती, डावीकडे ड्रायव्हर आणि उजवीकडे चाललेली पुली."
    },
    "actions": {
      "calculate": "बेल्ट ड्राइव्हची गणना करा",
      "reset": "रीसेट करा",
      "copy": "परिणाम कॉपी करा",
      "example": "लोड उदाहरण",
      "result": "अंदाजे परिणाम"
    },
    "messages": {
      "copied": "परिणाम कॉपी केले.",
      "copyUnavailable": "कॉपी या ब्राउझरमध्ये उपलब्ध नाही.",
      "calculated": "बेल्ट-ड्राइव्ह अंदाज मोजला.",
      "checkInputs": "व्यास, मध्यभागी अंतर, युनिट आणि इनपुट RPM दोन्ही तपासा.",
      "beltLength": "अंदाजे बेल्ट पिच लांबी",
      "outputRpm": "आदर्श चालित गती",
      "speedRatio": "गती प्रमाण (ड्रायव्हर/चालित)",
      "beltSpeed": "ड्रायव्हर बेल्ट गती",
      "smallWrap": "लहान पुलीवर अंदाजे ओघ",
      "model": "मॉडेल",
      "openBelt": "दोन-पुली अंदाजे उघडा"
    },
    "additionalFaqs": [
      {
        "question": "बेल्ट-लांबीचे अंदाजे सूत्र काय आहे?",
        "answer": "एक सामान्य ओपन-बेल्ट पिच-लांबी अंदाजे L ≈ 2C + 1.57(D + d) + (D − d)²/(4C), जेथे C मध्य अंतर आहे आणि D आणि d हे पुली पिच व्यास मोठे आणि लहान आहेत. वास्तविक बेल्ट निवडीसाठी निर्मात्याची खेळपट्टी आणि आकारमान डेटा वापरला पाहिजे."
      },
      {
        "question": "पुलीचा व्यास आरपीएम कसा बदलतो?",
        "answer": "कोणत्याही स्लिपशिवाय, चालित RPM हे अंदाजे इनपुट RPM आहे जे ड्रायव्हर व्यासाने गुणाकार केले जाते आणि चालविलेल्या व्यासाने भागले जाते. मोठी चालणारी पुली वेग कमी करते; एक मोठी ड्रायव्हर पुली ते वाढवते."
      },
      {
        "question": "या कॅल्क्युलेटरमध्ये बेल्ट स्लिप किंवा टेंशन समाविष्ट आहे का?",
        "answer": "नाही. ओपन टू-पली लेआउटसाठी हा एक आदर्श भूमिती आणि गुणोत्तर अंदाज आहे. हे स्लिप, टेंशन, बेल्ट बांधणी, लोड, पोशाख किंवा कॅटलॉग बेल्ट आकारांसाठी खाते नाही."
      },
      {
        "question": "बेल्ट ऑर्डर करण्यासाठी मी अंदाज वापरू शकतो का?",
        "answer": "फक्त प्रथम अंदाज म्हणून वापरा. ड्राइव्ह विकत घेण्यापूर्वी किंवा चालविण्यापूर्वी बेल्ट पिच, प्रोफाइल, प्रभावी लांबी, केंद्र समायोजन आणि निर्माता आकार सारण्यांची पुष्टी करा."
      }
    ]
  },
  "te": {
    "copyLanguage": "te",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "పుల్లీ కాలిక్యులేటర్",
    "title": "పుల్లీ కాలిక్యులేటర్ ఉచితం & అపరిమిత | UsefulVerse",
    "description": "రెండు వ్యాసాలు మరియు మధ్య దూరం నుండి బెల్ట్ పొడవు, పుల్లీ RPM మరియు బెల్ట్ వేగాన్ని అంచనా వేయండి. ఉచిత, స్థానిక మరియు అపరిమిత.",
    "intro": "రెండు పుల్లీల మధ్య ఒక సాధారణ ఓపెన్ బెల్ట్ కోసం పిచ్ పొడవు మరియు వేగ సంబంధాన్ని అంచనా వేయండి. అదే యూనిట్‌లో కొలతలు నమోదు చేయండి.",
    "howQuestion": "మీరు రెండు పుల్లీల మధ్య బెల్ట్ పొడవును ఎలా లెక్కించాలి?",
    "howAnswer": "ఓపెన్ టూ-కల్లీ డ్రైవ్ కోసం, ఈ కాలిక్యులేటర్ మధ్య దూరం మరియు రెండు కప్పి వ్యాసాల ఆధారంగా సాధారణ ఉజ్జాయింపును ఉపయోగిస్తుంది. ఇది వ్యాసం నిష్పత్తి నుండి నడిచే RPMని కూడా అంచనా వేస్తుంది, స్లిప్ లేదు.",
    "privacyQuestion": "నా కొలతలు అప్‌లోడ్ చేయబడ్డాయా?",
    "privacyAnswer": "సంఖ్య. అన్ని లెక్కలు మరియు స్కెచ్ ఈ బ్రౌజర్‌లో రూపొందించబడ్డాయి; మీ కొలతలు అప్‌లోడ్ చేయబడలేదు లేదా సేవ్ చేయబడలేదు.",
    "fields": {
      "driverDiameter": "డ్రైవర్ పుల్లీ వ్యాసం",
      "drivenDiameter": "నడిచే కప్పి వ్యాసం",
      "centerDistance": "పుల్లీ కేంద్రాల మధ్య దూరం",
      "diameterUnit": "డైమెన్షన్ యూనిట్",
      "millimeters": "మిల్లీమీటర్లు (మిమీ)",
      "inches": "అంగుళాలు (లో)",
      "inputRpm": "డ్రైవర్ ఇన్‌పుట్ వేగం (RPM)",
      "accuracyNote": "ఆదర్శవంతమైన, ఓపెన్ టూ-పుల్లీ బెల్ట్ కోసం సుమారు పిచ్ పొడవు. అన్ని కొలతలు కోసం ఒకే యూనిట్ ఉపయోగించండి. బెల్ట్ ప్రొఫైల్, పిచ్, టెన్షన్, స్లిప్, వేర్ మరియు టాలరెన్స్‌లతో నిజమైన బెల్ట్ పొడవు మరియు వేగం భిన్నంగా ఉండవచ్చు. ఇది కొనుగోలు చేయగల బెల్ట్‌ను ఎంచుకోదు లేదా పవర్, గార్డింగ్ లేదా భద్రతను అంచనా వేయదు. ఉపయోగించే ముందు తయారీదారు డేటాను తనిఖీ చేయండి. స్థానికంగా నడుస్తుంది; అప్‌లోడ్ లేదు.",
      "sketchTitle": "ఓపెన్-బెల్ట్ లేఅవుట్ (స్కేల్ కాదు)",
      "sketchDescription": "ఓపెన్ బెల్ట్‌తో అనుసంధానించబడిన రెండు పుల్లీల రేఖాచిత్రం, డ్రైవర్ ఎడమవైపు మరియు నడిచే కప్పి కుడి వైపున ఉంటుంది."
    },
    "actions": {
      "calculate": "బెల్ట్ డ్రైవ్‌ను లెక్కించండి",
      "reset": "రీసెట్ చేయండి",
      "copy": "ఫలితాలను కాపీ చేయండి",
      "example": "లోడ్ ఉదాహరణ",
      "result": "అంచనా వేసిన ఫలితాలు"
    },
    "messages": {
      "copied": "ఫలితాలు కాపీ చేయబడ్డాయి.",
      "copyUnavailable": "ఈ బ్రౌజర్‌లో కాపీ అందుబాటులో లేదు.",
      "calculated": "బెల్ట్-డ్రైవ్ అంచనా లెక్కించబడింది.",
      "checkInputs": "వ్యాసాలు, మధ్య దూరం, యూనిట్ మరియు ఇన్‌పుట్ RPM రెండింటినీ తనిఖీ చేయండి.",
      "beltLength": "సుమారు బెల్ట్ పిచ్ పొడవు",
      "outputRpm": "ఆదర్శ నడిచే వేగం",
      "speedRatio": "వేగ నిష్పత్తి (డ్రైవర్ / నడిచే)",
      "beltSpeed": "డ్రైవర్ బెల్ట్ వేగం",
      "smallWrap": "చిన్న కప్పిపై సుమారుగా చుట్టండి",
      "model": "మోడల్",
      "openBelt": "రెండు-కప్పు ఉజ్జాయింపును తెరవండి"
    },
    "additionalFaqs": [
      {
        "question": "సుమారుగా బెల్ట్-పొడవు సూత్రం ఏమిటి?",
        "answer": "ఒక సాధారణ ఓపెన్-బెల్ట్ పిచ్-పొడవు ఉజ్జాయింపు L ≈ 2C + 1.57(D + d) + (D - d)²/(4C), ఇక్కడ C అనేది మధ్య దూరం మరియు D మరియు d అనేది పెద్ద మరియు చిన్న పుల్లీ పిచ్ వ్యాసాలు. వాస్తవ బెల్ట్ ఎంపిక తయారీదారు యొక్క పిచ్ మరియు పరిమాణ డేటాను ఉపయోగించాలి."
      },
      {
        "question": "పుల్లీ వ్యాసం RPMని ఎలా మారుస్తుంది?",
        "answer": "స్లిప్ లేకుండా, నడిచే RPM అనేది సుమారుగా ఇన్‌పుట్ RPM అనేది డ్రైవర్ వ్యాసంతో గుణించబడుతుంది మరియు నడిచే వ్యాసంతో భాగించబడుతుంది. పెద్దగా నడిచే కప్పి వేగాన్ని తగ్గిస్తుంది; ఒక పెద్ద డ్రైవర్ పుల్లీ దానిని పెంచుతుంది."
      },
      {
        "question": "ఈ కాలిక్యులేటర్‌లో బెల్ట్ స్లిప్ లేదా టెన్షన్ ఉందా?",
        "answer": "నం. ఇది ఓపెన్ టూ-పుల్లీ లేఅవుట్ కోసం ఆదర్శవంతమైన జ్యామితి మరియు నిష్పత్తి అంచనా. ఇది స్లిప్, టెన్షన్, బెల్ట్ నిర్మాణం, లోడ్, వేర్ లేదా కేటలాగ్ బెల్ట్ పరిమాణాలకు కారణం కాదు."
      },
      {
        "question": "నేను బెల్ట్‌ను ఆర్డర్ చేయడానికి అంచనాను ఉపయోగించవచ్చా?",
        "answer": "దీన్ని మొదటి అంచనాగా మాత్రమే ఉపయోగించండి. డ్రైవ్‌ను కొనుగోలు చేయడానికి లేదా ఆపరేట్ చేయడానికి ముందు బెల్ట్ పిచ్, ప్రొఫైల్, ఎఫెక్టివ్ లెంగ్త్, సెంటర్ సర్దుబాటు మరియు తయారీదారు పరిమాణ పట్టికలను నిర్ధారించండి."
      }
    ]
  },
  "ha": {
    "copyLanguage": "ha",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Kalkuleta na Pulley",
    "title": "Pulley Kalkuleta Kyauta & Unlimited | UsefulVerse",
    "description": "Ƙididdiga tsayin bel, RPM Puley da saurin bel daga diamita biyu da nisan tsakiya. Kyauta, gida da mara iyaka.",
    "intro": "Yi ƙididdige tsayin farar da alaƙar saurin don buɗaɗɗen bel mai sauƙi tsakanin jakunkuna biyu. Shigar da girma a cikin raka'a ɗaya.",
    "howQuestion": "Yaya ake lissafin tsayin bel tsakanin jakunkuna biyu?",
    "howAnswer": "Don buɗaɗɗen tuƙi mai jan hankali biyu, wannan kalkuleta yana amfani da ƙima na gama gari dangane da nisa ta tsakiya da diamita na ja. Hakanan yana ƙididdige RPM da aka kora daga ma'aunin diamita, ba tare da zamewa ba.",
    "privacyQuestion": "Ana loda ma'auni na?",
    "privacyAnswer": "A'a. Ana samar da duk lissafin lissafi da zane a cikin wannan mai binciken; Ba a ɗora ma'aunin ku ko adanawa.",
    "fields": {
      "driverDiameter": "Diamita na direba",
      "drivenDiameter": "Diamita na jan hankali",
      "centerDistance": "Nisa tsakanin cibiyoyin jan hankali",
      "diameterUnit": "Naúrar girma",
      "millimeters": "Millimeters (mm)",
      "inches": "Inci (a)",
      "inputRpm": "Gudun shigar da direba (RPM)",
      "accuracyNote": "Kimanin tsayin farar don manufa, buɗaɗɗen bel mai jan hankali biyu. Yi amfani da naúrar guda ɗaya don kowane girma. Tsawon bel na gaske da sauri na iya bambanta tare da bayanan bel, farar, tashin hankali, zamewa, sawa da haƙuri. Wannan baya zaɓi bel ɗin da za'a iya siye ko tantance ƙarfi, tsaro ko aminci. Bincika bayanan masana'anta kafin amfani. Gudun gida; babu upload.",
      "sketchTitle": "Tsarin buɗaɗɗen bel (ba don sikeli ba)",
      "sketchDescription": "Jadawalin jakunkuna guda biyu da aka haɗa ta hanyar buɗaɗɗen bel, tare da direba a hagu kuma mai tuƙi a dama."
    },
    "actions": {
      "calculate": "Yi lissafin bel ɗin tuƙi",
      "reset": "Sake saiti",
      "copy": "Kwafi sakamakon",
      "example": "Loda misali",
      "result": "Kiyasin sakamako"
    },
    "messages": {
      "copied": "An kwafi sakamakon.",
      "copyUnavailable": "Babu kwafi a cikin wannan burauzar.",
      "calculated": "Ƙimar belt-drive an ƙididdige shi.",
      "checkInputs": "Duba diamita biyu, nisan tsakiya, naúrar da shigar da RPM.",
      "beltLength": "Kimanin tsayin girman bel",
      "outputRpm": "Madaidaicin gudun hijira",
      "speedRatio": "Matsakaicin saurin gudu (direba / tuƙi)",
      "beltSpeed": "Gudun bel ɗin direba",
      "smallWrap": "Kimanin kunsa a kan ƙaramin abin wuya",
      "model": "Samfura",
      "openBelt": "Buɗe ƙimayar juzu'i biyu"
    },
    "additionalFaqs": [
      {
        "question": "Menene madaidaicin dabarar tsawon bel?",
        "answer": "Matsakaicin tsayin farar buɗaɗɗen bel gama gari shine L ≈ 2C + 1.57(D + d) + (D - d)²/(4C), inda C shine nesa ta tsakiya kuma D da d sune mafi girma kuma ƙarami diamita. Zaɓin bel na ainihi ya kamata ya yi amfani da farar masana'anta da bayanan girman girman."
      },
      {
        "question": "Ta yaya diamita pulley ke canza RPM?",
        "answer": "Ba tare da zamewa ba, RPM da aka kora yana kusan shigarwar RPM ana ninka ta da diamita na direba kuma an raba ta da diamita mai tuƙi. Babban abin tuƙi yana rage gudu; babban direban motar yana ƙara shi."
      },
      {
        "question": "Shin wannan kalkuleta ya haɗa da zamewar bel ko tashin hankali?",
        "answer": "A'a. Yana da madaidaicin lissafin lissafi da ƙididdige rabo don shimfidar buɗaɗɗen jan hankali biyu. Ba shi da lissafin zamewa, tashin hankali, ginin bel, kaya, sawa ko girman bel na kasida."
      },
      {
        "question": "Zan iya amfani da kimantawa don yin odar bel?",
        "answer": "Yi amfani da shi azaman ƙimar farko kawai. Tabbatar da farar bel, bayanin martaba, ingantaccen tsayi, daidaitawar tsakiya da tebur masu ƙima kafin siye ko aiki da tuƙi."
      }
    ]
  },
  "tl": {
    "copyLanguage": "tl",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Calculator ng kalo",
    "title": "Pulley Calculator Libre at Walang limitasyong | UsefulVerse",
    "description": "Tantyahin ang haba ng sinturon, pulley RPM at bilis ng sinturon mula sa dalawang diameter at distansya sa gitna. Libre, lokal at walang limitasyon.",
    "intro": "Tantyahin ang ugnayan ng haba ng pitch at bilis para sa isang simpleng bukas na sinturon sa pagitan ng dalawang pulley. Maglagay ng mga dimensyon sa parehong unit.",
    "howQuestion": "Paano mo kinakalkula ang haba ng sinturon sa pagitan ng dalawang pulley?",
    "howAnswer": "Para sa isang bukas na two-pulley drive, ang calculator na ito ay gumagamit ng isang karaniwang approximation batay sa distansya sa gitna at ang dalawang diameter ng pulley. Tinatantya din nito ang hinimok na RPM mula sa ratio ng diameter, sa pag-aakalang walang slip.",
    "privacyQuestion": "Na-upload ba ang aking mga sukat?",
    "privacyAnswer": "Hindi. Ang lahat ng mga kalkulasyon at ang sketch ay nabuo sa browser na ito; hindi na-upload o nai-save ang iyong mga sukat.",
    "fields": {
      "driverDiameter": "diameter ng driver pulley",
      "drivenDiameter": "hinimok na pulley diameter",
      "centerDistance": "Distansya sa pagitan ng mga sentro ng pulley",
      "diameterUnit": "Unit ng sukat",
      "millimeters": "Milimetro (mm)",
      "inches": "pulgada (in)",
      "inputRpm": "Bilis ng input ng driver (RPM)",
      "accuracyNote": "Tinatayang haba ng pitch para sa perpektong, bukas na two-pulley belt. Gamitin ang parehong unit para sa lahat ng dimensyon. Ang tunay na haba at bilis ng sinturon ay maaaring mag-iba sa belt profile, pitch, tension, slip, wear at tolerances. Hindi ito pumipili ng mabibiling sinturon o tinatasa ang kapangyarihan, pagbabantay o kaligtasan. Suriin ang data ng tagagawa bago gamitin. Tumatakbo nang lokal; walang upload.",
      "sketchTitle": "Layout ng open-belt (hindi sa sukat)",
      "sketchDescription": "Diagram ng dalawang pulley na konektado ng isang bukas na sinturon, kung saan ang driver ay nasa kaliwa at hinihimok na pulley sa kanan."
    },
    "actions": {
      "calculate": "Kalkulahin ang belt drive",
      "reset": "I-reset",
      "copy": "Kopyahin ang mga resulta",
      "example": "Halimbawa ng pag-load",
      "result": "Tinantyang mga resulta"
    },
    "messages": {
      "copied": "Nakopya ang mga resulta.",
      "copyUnavailable": "Hindi available ang kopya sa browser na ito.",
      "calculated": "Kinakalkula ang pagtatantya ng belt-drive.",
      "checkInputs": "Suriin ang parehong diameter, distansya ng gitna, unit at input RPM.",
      "beltLength": "Tinatayang haba ng pitch ng belt",
      "outputRpm": "Tamang-tama na bilis ng pagmamaneho",
      "speedRatio": "Ang ratio ng bilis (driver / driven)",
      "beltSpeed": "Bilis ng driver belt",
      "smallWrap": "Tinatayang pambalot sa mas maliit na kalo",
      "model": "Modelo",
      "openBelt": "Buksan ang dalawang-pulley approximation"
    },
    "additionalFaqs": [
      {
        "question": "Ano ang tinatayang formula ng haba ng sinturon?",
        "answer": "Ang karaniwang open-belt pitch-length approximation ay L ≈ 2C + 1.57(D + d) + (D − d)²/(4C), kung saan ang C ay center distance at D at d ang mas malaki at mas maliit na pulley pitch diameter. Ang aktwal na pagpili ng sinturon ay dapat gumamit ng data ng pitch at laki ng tagagawa."
      },
      {
        "question": "Paano nagbabago ang diameter ng pulley sa RPM?",
        "answer": "Nang walang slip, ang driven RPM ay tinatayang input RPM na pinarami ng driver diameter at hinati sa driven na diameter. Ang isang mas malaking hinimok na kalo ay binabawasan ang bilis; ang isang mas malaking driver pulley ay nagpapataas nito."
      },
      {
        "question": "Kasama ba sa calculator na ito ang belt slip o tension?",
        "answer": "Hindi. Ito ay isang perpektong geometry at pagtatantya ng ratio para sa isang bukas na layout na may dalawang pulley. Hindi nito isinasaalang-alang ang pagkadulas, pag-igting, paggawa ng sinturon, pagkarga, pagsusuot o mga laki ng sinturon ng catalog."
      },
      {
        "question": "Maaari ko bang gamitin ang pagtatantya upang mag-order ng sinturon?",
        "answer": "Gamitin ito bilang unang pagtatantya lamang. Kumpirmahin ang pitch ng belt, profile, epektibong haba, pagsasaayos sa gitna at mga talahanayan ng laki ng tagagawa bago bumili o magpatakbo ng drive."
      }
    ]
  },
  "ta": {
    "copyLanguage": "ta",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "கப்பி கால்குலேட்டர்",
    "title": "கப்பி கால்குலேட்டர் இலவச & வரம்பற்ற | UsefulVerse",
    "description": "இரண்டு விட்டம் மற்றும் மைய தூரத்திலிருந்து பெல்ட் நீளம், கப்பி RPM மற்றும் பெல்ட் வேகத்தை மதிப்பிடவும். இலவசம், உள்ளூர் மற்றும் வரம்பற்றது.",
    "intro": "இரண்டு புல்லிகளுக்கு இடையில் ஒரு எளிய திறந்த பெல்ட்டிற்கான சுருதி நீளம் மற்றும் வேக உறவை மதிப்பிடவும். அதே அலகில் பரிமாணங்களை உள்ளிடவும்.",
    "howQuestion": "இரண்டு கப்பிகளுக்கு இடையே உள்ள பெல்ட்டின் நீளத்தை எவ்வாறு கணக்கிடுவது?",
    "howAnswer": "திறந்த இரண்டு-கப்பி இயக்கிக்கு, இந்த கால்குலேட்டர் மைய தூரம் மற்றும் இரண்டு கப்பி விட்டம் ஆகியவற்றின் அடிப்படையில் பொதுவான தோராயத்தைப் பயன்படுத்துகிறது. இது விட்டம் விகிதத்தில் இருந்து இயக்கப்படும் RPM ஐ மதிப்பிடுகிறது, எந்த சீட்டுகளும் இல்லை என்று கருதுகிறது.",
    "privacyQuestion": "எனது அளவீடுகள் பதிவேற்றப்பட்டதா?",
    "privacyAnswer": "இல்லை. அனைத்து கணக்கீடுகளும் ஓவியமும் இந்த உலாவியில் உருவாக்கப்படுகின்றன; உங்கள் அளவீடுகள் பதிவேற்றப்படவில்லை அல்லது சேமிக்கப்படவில்லை.",
    "fields": {
      "driverDiameter": "டிரைவர் கப்பி விட்டம்",
      "drivenDiameter": "இயக்கப்படும் கப்பி விட்டம்",
      "centerDistance": "கப்பி மையங்களுக்கு இடையிலான தூரம்",
      "diameterUnit": "பரிமாண அலகு",
      "millimeters": "மில்லிமீட்டர்கள் (மிமீ)",
      "inches": "அங்குலம் (உள்)",
      "inputRpm": "இயக்கி உள்ளீடு வேகம் (RPM)",
      "accuracyNote": "ஒரு சிறந்த, திறந்த இரண்டு-கப்பி பெல்ட்டுக்கான தோராயமான சுருதி நீளம். அனைத்து பரிமாணங்களுக்கும் ஒரே அலகு பயன்படுத்தவும். உண்மையான பெல்ட் நீளம் மற்றும் வேகம் பெல்ட் சுயவிவரம், சுருதி, டென்ஷன், ஸ்லிப், தேய்மானம் மற்றும் சகிப்புத்தன்மை ஆகியவற்றுடன் வேறுபடலாம். இது வாங்கக்கூடிய பெல்ட்டைத் தேர்ந்தெடுக்காது அல்லது சக்தி, பாதுகாப்பு அல்லது பாதுகாப்பை மதிப்பிடாது. பயன்படுத்துவதற்கு முன் உற்பத்தியாளர் தரவைச் சரிபார்க்கவும். உள்நாட்டில் இயங்குகிறது; பதிவேற்றம் இல்லை.",
      "sketchTitle": "திறந்த-பெல்ட் தளவமைப்பு (அளவிடக்கூடாது)",
      "sketchDescription": "ஒரு திறந்த பெல்ட் மூலம் இணைக்கப்பட்ட இரண்டு புல்லிகளின் வரைபடம், இடதுபுறத்தில் இயக்கி மற்றும் வலதுபுறத்தில் இயக்கப்படும் கப்பி."
    },
    "actions": {
      "calculate": "பெல்ட் டிரைவைக் கணக்கிடுங்கள்",
      "reset": "மீட்டமை",
      "copy": "முடிவுகளை நகலெடுக்கவும்",
      "example": "ஏற்ற உதாரணம்",
      "result": "மதிப்பிடப்பட்ட முடிவுகள்"
    },
    "messages": {
      "copied": "முடிவுகள் நகலெடுக்கப்பட்டன.",
      "copyUnavailable": "இந்த உலாவியில் நகல் கிடைக்கவில்லை.",
      "calculated": "பெல்ட் டிரைவ் மதிப்பீடு கணக்கிடப்பட்டது.",
      "checkInputs": "விட்டம், மைய தூரம், அலகு மற்றும் உள்ளீடு RPM இரண்டையும் சரிபார்க்கவும்.",
      "beltLength": "தோராயமான பெல்ட் சுருதி நீளம்",
      "outputRpm": "சிறந்த இயக்கப்படும் வேகம்",
      "speedRatio": "வேக விகிதம் (இயக்கி / இயக்கப்படும்)",
      "beltSpeed": "டிரைவர் பெல்ட் வேகம்",
      "smallWrap": "சிறிய கப்பி மீது தோராயமான மடக்கு",
      "model": "மாதிரி",
      "openBelt": "இரண்டு-கப்பி தோராயத்தைத் திறக்கவும்"
    },
    "additionalFaqs": [
      {
        "question": "தோராயமான பெல்ட் நீள சூத்திரம் என்ன?",
        "answer": "ஒரு பொதுவான திறந்த-பெல்ட் சுருதி நீளம் தோராயமானது L ≈ 2C + 1.57(D + d) + (D - d)²/(4C), இங்கு C என்பது மையத் தூரம் மற்றும் D மற்றும் d என்பது பெரிய மற்றும் சிறிய கப்பி சுருதி விட்டம் ஆகும். உண்மையான பெல்ட் தேர்வு உற்பத்தியாளரின் சுருதி மற்றும் அளவு தரவைப் பயன்படுத்த வேண்டும்."
      },
      {
        "question": "கப்பி விட்டம் எப்படி RPM ஐ மாற்றுகிறது?",
        "answer": "ஸ்லிப் இல்லாமல், இயக்கப்படும் RPM என்பது தோராயமாக உள்ளீடு RPM என்பது இயக்கி விட்டத்தால் பெருக்கப்பட்டு இயக்கப்படும் விட்டத்தால் வகுக்கப்படுகிறது. ஒரு பெரிய இயக்கப்படும் கப்பி வேகத்தை குறைக்கிறது; ஒரு பெரிய இயக்கி கப்பி அதை அதிகரிக்கிறது."
      },
      {
        "question": "இந்த கால்குலேட்டரில் பெல்ட் ஸ்லிப் அல்லது டென்ஷன் உள்ளதா?",
        "answer": "இல்லை. இது ஒரு திறந்த இரண்டு-கப்பி தளவமைப்பிற்கான சிறந்த வடிவியல் மற்றும் விகித மதிப்பீடாகும். இது ஸ்லிப், டென்ஷன், பெல்ட் கட்டுமானம், சுமை, தேய்மானம் அல்லது பட்டியல் பெல்ட் அளவுகளைக் கணக்கில் கொள்ளாது."
      },
      {
        "question": "பெல்ட்டை ஆர்டர் செய்ய மதிப்பீட்டைப் பயன்படுத்தலாமா?",
        "answer": "முதல் மதிப்பீடாக மட்டுமே பயன்படுத்தவும். டிரைவை வாங்கும் அல்லது இயக்கும் முன் பெல்ட் சுருதி, சுயவிவரம், பயனுள்ள நீளம், மைய சரிசெய்தல் மற்றும் உற்பத்தியாளர் அளவு அட்டவணைகளை உறுதிப்படுத்தவும்."
      }
    ]
  },
  "fa": {
    "copyLanguage": "fa",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "ماشین حساب قرقره",
    "title": "ماشین حساب قرقره رایگان و نامحدود | UsefulVerse",
    "description": "طول تسمه، دور قرقره و سرعت تسمه را از دو قطر و فاصله مرکز تخمین بزنید. رایگان، محلی و نامحدود.",
    "intro": "رابطه طول گام و سرعت را برای یک تسمه باز ساده بین دو قرقره تخمین بزنید. ابعاد را در همان واحد وارد کنید.",
    "howQuestion": "چگونه طول تسمه بین دو قرقره را محاسبه کنید؟",
    "howAnswer": "برای یک درایو دو قرقره باز، این ماشین حساب از یک تقریب معمول بر اساس فاصله مرکز و دو قطر قرقره استفاده می کند. همچنین RPM رانده شده را از نسبت قطر، با فرض عدم لغزش، تخمین می زند.",
    "privacyQuestion": "آیا اندازه گیری های من آپلود شده است؟",
    "privacyAnswer": "خیر. تمام محاسبات و طرح در این مرورگر ایجاد می شود. اندازه گیری های شما آپلود یا ذخیره نمی شود.",
    "fields": {
      "driverDiameter": "قطر قرقره درایور",
      "drivenDiameter": "قطر قرقره رانده",
      "centerDistance": "فاصله بین مراکز قرقره",
      "diameterUnit": "واحد ابعاد",
      "millimeters": "میلی متر (میلی متر)",
      "inches": "اینچ (اینچ)",
      "inputRpm": "سرعت ورودی درایور (RPM)",
      "accuracyNote": "طول تقریبی گام برای یک تسمه دو قرقره باز و ایده آل. برای همه ابعاد از یک واحد استفاده کنید. طول و سرعت واقعی تسمه می تواند با مشخصات تسمه، گام، کشش، لغزش، سایش و تحمل متفاوت باشد. این تسمه قابل خرید را انتخاب نمی کند یا قدرت، محافظ یا ایمنی را ارزیابی نمی کند. قبل از استفاده اطلاعات سازنده را بررسی کنید. به صورت محلی اجرا می شود؛ بدون آپلود",
      "sketchTitle": "طرح کمربند باز (نه به مقیاس)",
      "sketchDescription": "نمودار دو قرقره که توسط یک تسمه باز متصل شده اند، با راننده در سمت چپ و قرقره رانده در سمت راست."
    },
    "actions": {
      "calculate": "محاسبه درایو تسمه",
      "reset": "بازنشانی کنید",
      "copy": "نتایج را کپی کنید",
      "example": "بارگذاری مثال",
      "result": "نتایج تخمینی"
    },
    "messages": {
      "copied": "نتایج کپی شد.",
      "copyUnavailable": "کپی در این مرورگر موجود نیست.",
      "calculated": "تخمین تسمه محرک محاسبه شد.",
      "checkInputs": "هر دو قطر، فاصله مرکز، واحد و RPM ورودی را بررسی کنید.",
      "beltLength": "طول تقریبی گام کمربند",
      "outputRpm": "سرعت رانندگی ایده آل",
      "speedRatio": "نسبت سرعت (راننده/راننده)",
      "beltSpeed": "سرعت تسمه راننده",
      "smallWrap": "بسته بندی تقریبی روی قرقره کوچکتر",
      "model": "مدل",
      "openBelt": "تقریب دو قرقره باز"
    },
    "additionalFaqs": [
      {
        "question": "فرمول تقریبی طول کمربند چیست؟",
        "answer": "یک تقریب معمول طول گام کمربند باز L ≈ 2C + 1.57 (D + d) + (D - d)²/(4C) است، که در آن C فاصله مرکز و D و d قطرهای بزرگتر و کوچکتر گام قرقره هستند. انتخاب واقعی تسمه باید از داده های گام و اندازه سازنده استفاده کند."
      },
      {
        "question": "قطر قرقره چگونه RPM را تغییر می دهد؟",
        "answer": "بدون لغزش، RPM رانده تقریباً RPM ورودی ضرب در قطر درایور و تقسیم بر قطر رانده است. قرقره رانده بزرگتر سرعت را کاهش می دهد. قرقره راننده بزرگتر آن را افزایش می دهد."
      },
      {
        "question": "آیا این ماشین حساب شامل لغزش یا کشش تسمه می شود؟",
        "answer": "خیر. این یک تخمین هندسه و نسبت ایده آل برای طرح دو قرقره باز است. لغزش، کشش، ساخت تسمه، بار، سایش یا اندازه کمربند کاتالوگ را در نظر نمی گیرد."
      },
      {
        "question": "آیا می توانم از تخمین برای سفارش کمربند استفاده کنم؟",
        "answer": "فقط به عنوان تخمین اول از آن استفاده کنید. قبل از خرید یا راه اندازی درایو، گام تسمه، مشخصات، طول موثر، تنظیم مرکز و جداول اندازه سازنده را تأیید کنید."
      }
    ]
  },
  "am": {
    "copyLanguage": "am",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "የፑሊ ካልኩሌተር",
    "title": "የፑሊ ካልኩሌተር ነፃ እና ያልተገደበ | UsefulVerse",
    "description": "ከሁለት ዲያሜትሮች እና ከመሃል ርቀቶች የቀበቶ ርዝመት፣ ፑሊ RPM እና ቀበቶ ፍጥነት ይገምቱ። ነፃ ፣ አካባቢያዊ እና ያልተገደበ።",
    "intro": "በሁለት መዘዋወሪያዎች መካከል ላለ ቀላል ክፍት ቀበቶ የከፍታውን ርዝመት እና የፍጥነት ግንኙነት ይገምቱ። በተመሳሳይ ክፍል ውስጥ ልኬቶችን ያስገቡ።",
    "howQuestion": "በሁለት መዞሪያዎች መካከል ያለውን ቀበቶ ርዝመት እንዴት ማስላት ይቻላል?",
    "howAnswer": "ለክፍት ባለ ሁለት-ፑሊ ድራይቭ፣ ይህ ካልኩሌተር በመካከለኛው ርቀት እና በሁለቱ የፑሊ ዲያሜትሮች ላይ የተመሰረተ የጋራ መጠጋጋትን ይጠቀማል። እንዲሁም ምንም መንሸራተት እንደሌለ በማሰብ ከዲያሜትር ጥምርታ የሚነዳ RPM ይገምታል።",
    "privacyQuestion": "የእኔ መለኪያዎች ተሰቅለዋል?",
    "privacyAnswer": "አይደለም ሁሉም ስሌቶች እና ንድፍ በዚህ አሳሽ ውስጥ ይፈጠራሉ; የእርስዎ መለኪያዎች አልተሰቀሉም ወይም አልተቀመጡም.",
    "fields": {
      "driverDiameter": "የሾፌር ፑሊ ዲያሜትር",
      "drivenDiameter": "የሚነዳ ፑሊ ዲያሜትር",
      "centerDistance": "በፑሊ ማእከሎች መካከል ያለው ርቀት",
      "diameterUnit": "ልኬት ክፍል",
      "millimeters": "ሚሊሜትር (ሚሜ)",
      "inches": "ኢንች (ውስጥ)",
      "inputRpm": "የአሽከርካሪ ግቤት ፍጥነት (አርፒኤም)",
      "accuracyNote": "ግምታዊ የፒች ርዝመት ለአንድ ሃሳባዊ፣ ክፍት ባለ ሁለት-ፑሊ ቀበቶ። ለሁሉም ልኬቶች ተመሳሳይ ክፍል ይጠቀሙ። የሪል ቀበቶ ርዝመት እና ፍጥነት ከቀበቶ መገለጫ፣ ቅጥነት፣ ውጥረት፣ መንሸራተት፣ መልበስ እና መቻቻል ሊለያዩ ይችላሉ። ይህ ሊገዛ የሚችል ቀበቶ አይመርጥም ወይም ኃይልን, ጥበቃን ወይም ደህንነትን አይገመግም. ከመጠቀምዎ በፊት የአምራች ውሂብን ያረጋግጡ። በአካባቢው ይሠራል; ሰቀላ የለም።",
      "sketchTitle": "ክፍት ቀበቶ አቀማመጥ (ለመጠን አይደለም)",
      "sketchDescription": "በክፍት ቀበቶ የተገናኙ የሁለት መዘዋወሪያዎች ዲያግራም ሾፌሩ በግራ እና በስተቀኝ የሚነዳው ፑሊ ጋር።"
    },
    "actions": {
      "calculate": "ቀበቶ መንዳት ያሰሉ",
      "reset": "ዳግም አስጀምር",
      "copy": "ውጤቶችን ቅዳ",
      "example": "ምሳሌ ጫን",
      "result": "ግምታዊ ውጤቶች"
    },
    "messages": {
      "copied": "ውጤቶች ተቀድተዋል።",
      "copyUnavailable": "ቅጂ በዚህ አሳሽ ውስጥ አይገኝም።",
      "calculated": "ቀበቶ-ድራይቭ ግምት ይሰላል።",
      "checkInputs": "ሁለቱንም ዲያሜትሮች፣ የመሃል ርቀት፣ አሃድ እና ግቤት RPM ያረጋግጡ።",
      "beltLength": "ግምታዊ ቀበቶ የመጠን ርዝመት",
      "outputRpm": "ተስማሚ የሚነዳ ፍጥነት",
      "speedRatio": "የፍጥነት ጥምርታ (ሹፌር/የሚነዳ)",
      "beltSpeed": "የአሽከርካሪ ቀበቶ ፍጥነት",
      "smallWrap": "በትንሹ ፑሊ ላይ ግምታዊ መጠቅለያ",
      "model": "ሞዴል",
      "openBelt": "ባለ ሁለት-ፑል መጠጋጋትን ይክፈቱ"
    },
    "additionalFaqs": [
      {
        "question": "ግምታዊ ቀበቶ-ርዝመት ቀመር ምንድን ነው?",
        "answer": "የጋራ ክፍት ቀበቶ የፒች-ርዝማኔ መጠጋጋት L ≈ 2C + 1.57(D +d) + (D -d)²/(4C) ሲሆን ሐ የመሃል ርቀት ሲሆን D እና d ትላልቅ እና ትናንሽ የፑልይ ፕሌት ዲያሜትሮች ናቸው። ትክክለኛው ቀበቶ ምርጫ የአምራችውን ድምጽ እና የመጠን መረጃን መጠቀም አለበት."
      },
      {
        "question": "የፑልሊ ዲያሜትር RPM እንዴት ይለውጣል?",
        "answer": "ያለምንም ሸርተቴ፣ የሚነዳ RPM በግምት ግቤት RPM በሾፌር ዲያሜትር ተባዝቶ በተነዳ ዲያሜትር ይከፈላል። ትልቅ የሚነዳ ፑልሊ ፍጥነትን ይቀንሳል; አንድ ትልቅ ሹፌር ይጨምረዋል."
      },
      {
        "question": "ይህ ካልኩሌተር ቀበቶ መንሸራተትን ወይም ውጥረትን ያካትታል?",
        "answer": "አይደለም ለተከፈተ ሁለት-ፑሊ አቀማመጥ ተስማሚ ጂኦሜትሪ እና ጥምርታ ግምት ነው። የመንሸራተቻ, የጭንቀት, የቀበቶ ግንባታ, ጭነት, ልብስ ወይም የካታሎግ ቀበቶ መጠኖችን ግምት ውስጥ አያስገባም."
      },
      {
        "question": "ቀበቶ ለማዘዝ ግምቱን መጠቀም እችላለሁ?",
        "answer": "እንደ መጀመሪያ ግምት ብቻ ይጠቀሙበት። ድራይቭ ከመግዛትዎ ወይም ከማሠራትዎ በፊት ቀበቶውን ከፍታ ፣ መገለጫ ፣ ውጤታማ ርዝመት ፣ የመሃል ማስተካከያ እና የአምራች መጠን ጠረጴዛዎችን ያረጋግጡ።"
      }
    ]
  },
  "gu": {
    "copyLanguage": "gu",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "પુલી કેલ્ક્યુલેટર",
    "title": "પુલી કેલ્ક્યુલેટર ફ્રી અને અમર્યાદિત | UsefulVerse",
    "description": "બે વ્યાસ અને કેન્દ્રના અંતરથી બેલ્ટની લંબાઈ, પુલી RPM અને બેલ્ટની ઝડપનો અંદાજ કાઢો. મફત, સ્થાનિક અને અમર્યાદિત.",
    "intro": "બે ગરગડી વચ્ચેના સરળ ખુલ્લા પટ્ટા માટે પિચની લંબાઈ અને ઝડપ સંબંધનો અંદાજ કાઢો. સમાન એકમમાં પરિમાણો દાખલ કરો.",
    "howQuestion": "તમે બે ગરગડી વચ્ચેના પટ્ટાની લંબાઈની ગણતરી કેવી રીતે કરશો?",
    "howAnswer": "ઓપન ટુ-પલી ડ્રાઈવ માટે, આ કેલ્ક્યુલેટર કેન્દ્રના અંતર અને બે પુલી વ્યાસના આધારે સામાન્ય અંદાજનો ઉપયોગ કરે છે. તે વ્યાસના ગુણોત્તર પરથી ચાલતા RPMનો અંદાજ પણ લગાવે છે, કોઈ સ્લિપ નહીં ધારીને.",
    "privacyQuestion": "શું મારું માપ અપલોડ કરવામાં આવ્યું છે?",
    "privacyAnswer": "ના. તમામ ગણતરીઓ અને સ્કેચ આ બ્રાઉઝરમાં જનરેટ કરવામાં આવે છે; તમારા માપન અપલોડ અથવા સાચવેલ નથી.",
    "fields": {
      "driverDiameter": "ડ્રાઈવર ગરગડી વ્યાસ",
      "drivenDiameter": "ચલાવાયેલ ગરગડી વ્યાસ",
      "centerDistance": "ગરગડી કેન્દ્રો વચ્ચેનું અંતર",
      "diameterUnit": "પરિમાણ એકમ",
      "millimeters": "મિલીમીટર (મીમી)",
      "inches": "ઇંચ (માં)",
      "inputRpm": "ડ્રાઇવર ઇનપુટ સ્પીડ (RPM)",
      "accuracyNote": "આદર્શ, ખુલ્લા બે-પલી બેલ્ટ માટે આશરે પિચ લંબાઈ. બધા પરિમાણો માટે સમાન એકમનો ઉપયોગ કરો. બેલ્ટ પ્રોફાઇલ, પીચ, ટેન્શન, સ્લિપ, વસ્ત્રો અને સહનશીલતા સાથે વાસ્તવિક બેલ્ટની લંબાઈ અને ઝડપ અલગ હોઈ શકે છે. આ ખરીદી શકાય તેવો પટ્ટો પસંદ કરતું નથી અથવા શક્તિ, રક્ષણ અથવા સલામતીનું મૂલ્યાંકન કરતું નથી. ઉપયોગ કરતા પહેલા ઉત્પાદકનો ડેટા તપાસો. સ્થાનિક રીતે ચાલે છે; કોઈ અપલોડ નથી.",
      "sketchTitle": "ઓપન-બેલ્ટ લેઆઉટ (સ્કેલ કરવા માટે નહીં)",
      "sketchDescription": "ખુલ્લા પટ્ટા દ્વારા જોડાયેલ બે ગરગડીનો આકૃતિ, જેમાં ડ્રાઇવર ડાબી બાજુ અને જમણી બાજુએ ચાલતી પુલી છે."
    },
    "actions": {
      "calculate": "બેલ્ટ ડ્રાઇવની ગણતરી કરો",
      "reset": "રીસેટ કરો",
      "copy": "પરિણામોની નકલ કરો",
      "example": "લોડ ઉદાહરણ",
      "result": "અંદાજિત પરિણામો"
    },
    "messages": {
      "copied": "પરિણામોની નકલ કરી.",
      "copyUnavailable": "આ બ્રાઉઝરમાં નકલ ઉપલબ્ધ નથી.",
      "calculated": "બેલ્ટ-ડ્રાઇવ અંદાજની ગણતરી.",
      "checkInputs": "બંને વ્યાસ, કેન્દ્રનું અંતર, એકમ અને ઇનપુટ RPM તપાસો.",
      "beltLength": "અંદાજિત બેલ્ટ પિચ લંબાઈ",
      "outputRpm": "આદર્શ સંચાલિત ગતિ",
      "speedRatio": "સ્પીડ રેશિયો (ડ્રાઈવર/ચાલિત)",
      "beltSpeed": "ડ્રાઈવર બેલ્ટ ઝડપ",
      "smallWrap": "નાની ગરગડી પર અંદાજિત લપેટી",
      "model": "મોડલ",
      "openBelt": "બે ગરગડી અંદાજ ખોલો"
    },
    "additionalFaqs": [
      {
        "question": "અંદાજિત બેલ્ટ-લેન્થ ફોર્મ્યુલા શું છે?",
        "answer": "સામાન્ય ઓપન-બેલ્ટ પિચ-લંબાઈનો અંદાજ L ≈ 2C + 1.57(D + d) + (D − d)²/(4C), જ્યાં C કેન્દ્રનું અંતર છે અને D અને d એ મોટા અને નાના પુલી પિચ વ્યાસ છે. વાસ્તવિક પટ્ટાની પસંદગીમાં ઉત્પાદકની પિચ અને કદના ડેટાનો ઉપયોગ કરવો જોઈએ."
      },
      {
        "question": "ગરગડીનો વ્યાસ RPM કેવી રીતે બદલે છે?",
        "answer": "કોઈ સ્લિપ વિના, ચાલિત RPM એ આશરે ઇનપુટ RPM છે જેને ડ્રાઇવર વ્યાસ દ્વારા ગુણાકાર કરવામાં આવે છે અને ચાલિત વ્યાસ દ્વારા વિભાજિત કરવામાં આવે છે. મોટી ચાલતી ગરગડી ઝડપ ઘટાડે છે; મોટી ડ્રાઈવર ગરગડી તેને વધારે છે."
      },
      {
        "question": "શું આ કેલ્ક્યુલેટરમાં બેલ્ટ સ્લિપ અથવા ટેન્શન શામેલ છે?",
        "answer": "ના. ઓપન ટુ-પલી લેઆઉટ માટે તે એક આદર્શ ભૂમિતિ અને ગુણોત્તર અંદાજ છે. તે સ્લિપ, ટેન્શન, બેલ્ટ બાંધકામ, લોડ, વસ્ત્રો અથવા કેટલોગ બેલ્ટના કદ માટે જવાબદાર નથી."
      },
      {
        "question": "શું હું બેલ્ટ ઓર્ડર કરવા માટે અંદાજનો ઉપયોગ કરી શકું?",
        "answer": "તેનો ઉપયોગ ફક્ત પ્રથમ અંદાજ તરીકે કરો. ડ્રાઇવ ખરીદતા અથવા ઓપરેટ કરતા પહેલા બેલ્ટ પિચ, પ્રોફાઇલ, અસરકારક લંબાઈ, કેન્દ્ર ગોઠવણ અને ઉત્પાદક કદના કોષ્ટકોની પુષ્ટિ કરો."
      }
    ]
  }
};

export default pulleyCalculatorCopies;
