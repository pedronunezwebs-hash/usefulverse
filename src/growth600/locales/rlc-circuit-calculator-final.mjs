const rlcCircuitCalculatorCopies = {
  "en": {
    "copyLanguage": "en",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC Circuit Calculator",
    "title": "RLC Circuit Calculator Free & Unlimited | UsefulVerse",
    "description": "Find RLC resonance, Q, bandwidth and impedance for series or parallel circuits. Free, local and unlimited.",
    "intro": "Choose a series or parallel RLC model, enter component values, and inspect resonance plus impedance at a frequency you choose.",
    "howQuestion": "How do you calculate RLC resonance?",
    "howAnswer": "For ideal lumped components, resonant frequency is 1/(2π√(LC)). Quality factor and bandwidth depend on whether the resistor is in series or parallel. This calculator also evaluates complex impedance at your selected frequency.",
    "privacyQuestion": "Are my circuit values uploaded?",
    "privacyAnswer": "No. The math and response curve run in this browser; your entered values are not uploaded or saved.",
    "fields": {
      "topology": "Circuit topology",
      "series": "Series RLC",
      "parallel": "Parallel RLC",
      "resistance": "Resistance (Ω)",
      "inductance": "Inductance",
      "inductanceUnit": "Inductance unit",
      "henries": "Henries (H)",
      "millihenries": "Millihenries (mH)",
      "microhenries": "Microhenries (µH)",
      "capacitance": "Capacitance",
      "capacitanceUnit": "Capacitance unit",
      "farads": "Farads (F)",
      "microfarads": "Microfarads (µF)",
      "nanofarads": "Nanofarads (nF)",
      "picofarads": "Picofarads (pF)",
      "frequency": "Frequency to evaluate",
      "frequencyUnit": "Frequency unit",
      "hertz": "Hertz (Hz)",
      "kilohertz": "Kilohertz (kHz)",
      "voltage": "Source voltage (V RMS)",
      "accuracyNote": "Ideal lumped, linear RLC model only. Parallel mode means R, L and C are all in parallel. It ignores tolerances, parasitics, coil resistance, source impedance, nonlinear parts, load coupling and safety. It does not certify a real circuit or select parts. Check datasheets and consult a qualified professional before building or using real hardware. Runs locally; no upload.",
      "chartTitle": "Impedance across frequency",
      "chartDescription": "Log-frequency sweep from one tenth to ten times the resonant frequency. The curve shows ideal impedance magnitude for the selected series or parallel topology."
    },
    "actions": {
      "calculate": "Calculate RLC circuit",
      "reset": "Reset",
      "copy": "Copy results",
      "example": "Load example",
      "result": "RLC results"
    },
    "messages": {
      "copied": "Results copied.",
      "copyUnavailable": "Copy is not available in this browser.",
      "calculated": "RLC estimate calculated.",
      "checkInputs": "Check R, L, C, frequency, voltage, topology and units.",
      "model": "Model",
      "resonance": "Resonant frequency",
      "qualityFactor": "Quality factor (Q)",
      "bandwidth": "Approximate bandwidth",
      "inductiveReactance": "Inductive reactance (XL)",
      "capacitiveReactance": "Capacitive reactance (XC)",
      "complexImpedance": "Complex impedance (R + jX)",
      "impedanceMagnitudePhase": "Impedance magnitude / phase",
      "current": "Source current (ideal RMS)"
    },
    "additionalFaqs": [
      {
        "question": "What is the resonant frequency formula?",
        "answer": "For an ideal inductor L and capacitor C, f₀ = 1/(2π√(LC)). Use henries and farads to obtain hertz. The resistor changes damping and Q, not this ideal LC resonance formula."
      },
      {
        "question": "How do series and parallel RLC circuits differ?",
        "answer": "At resonance, an ideal series RLC has minimum impedance equal to R; an ideal parallel RLC has maximum impedance equal to R. Current and voltage behavior therefore differ even though ideal f₀ is the same."
      },
      {
        "question": "How are Q and bandwidth calculated?",
        "answer": "For the series model, Q = ω₀L/R and bandwidth is R/(2πL). For the parallel model, Q = R/(ω₀L) and bandwidth is 1/(2πRC). These are ideal single-resonance relationships."
      },
      {
        "question": "Does this model include real component tolerances?",
        "answer": "No. It assumes ideal, linear, lumped R, L and C components. Parasitics, inductor winding resistance, source impedance, loading and component variation can shift or damp real circuits."
      },
      {
        "question": "Can this calculator certify a circuit as safe?",
        "answer": "No. It is an educational estimate, not a design approval or safety assessment. Confirm component ratings and real-world behavior with datasheets and qualified engineering review."
      }
    ]
  },
  "es": {
    "copyLanguage": "es",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Calculadora de circuito RLC",
    "title": "Calculadora de circuitos RLC gratuita e | UsefulVerse",
    "description": "Encuentre resonancia RLC, Q, ancho de banda e impedancia para circuitos en serie o paralelo. Gratis, local e ilimitado.",
    "intro": "Elija un modelo RLC en serie o paralelo, ingrese los valores de los componentes e inspeccione la resonancia más la impedancia a la frecuencia que elija.",
    "howQuestion": "¿Cómo se calcula la resonancia RLC?",
    "howAnswer": "Para componentes agrupados ideales, la frecuencia de resonancia es 1/(2π√(LC)). El factor de calidad y el ancho de banda dependen de si la resistencia está en serie o en paralelo. Esta calculadora también evalúa la impedancia compleja en la frecuencia seleccionada.",
    "privacyQuestion": "¿Se cargan los valores de mi circuito?",
    "privacyAnswer": "No. Las curvas matemáticas y de respuesta se ejecutan en este navegador; Los valores ingresados ​​no se cargan ni se guardan.",
    "fields": {
      "topology": "Topología del circuito",
      "series": "Serie RLC",
      "parallel": "RLC paralelo",
      "resistance": "Resistencia (Ω)",
      "inductance": "Inductancia",
      "inductanceUnit": "unidad de inductancia",
      "henries": "Enrique (H)",
      "millihenries": "Milihenrios (mH)",
      "microhenries": "Microhenrios (μH)",
      "capacitance": "Capacidad",
      "capacitanceUnit": "unidad de capacitancia",
      "farads": "Faradios (F)",
      "microfarads": "Microfaradios (μF)",
      "nanofarads": "Nanofaradios (nF)",
      "picofarads": "Picofradios (pF)",
      "frequency": "Frecuencia a evaluar",
      "frequencyUnit": "Unidad de frecuencia",
      "hertz": "Hercios (Hz)",
      "kilohertz": "Kilohercios (kHz)",
      "voltage": "Tensión de fuente (V RMS)",
      "accuracyNote": "Modelo RLC lineal y concentrado ideal únicamente. El modo paralelo significa que R, L y C están todos en paralelo. Ignora tolerancias, parásitos, resistencia de la bobina, impedancia de la fuente, piezas no lineales, acoplamiento de carga y seguridad. No certifica un circuito real ni piezas seleccionadas. Consulte las hojas de datos y consulte a un profesional calificado antes de construir o utilizar hardware real. Se ejecuta localmente; sin carga.",
      "chartTitle": "Impedancia a través de la frecuencia",
      "chartDescription": "Barrido de frecuencia logarítmica de una décima a diez veces la frecuencia de resonancia. La curva muestra la magnitud de impedancia ideal para la topología en serie o en paralelo seleccionada."
    },
    "actions": {
      "calculate": "Calcular el circuito RLC",
      "reset": "Reiniciar",
      "copy": "Copiar resultados",
      "example": "Cargar ejemplo",
      "result": "resultados de RLC"
    },
    "messages": {
      "copied": "Resultados copiados.",
      "copyUnavailable": "La copia no está disponible en este navegador.",
      "calculated": "Estimación de RLC calculada.",
      "checkInputs": "Verifique R, L, C, frecuencia, voltaje, topología y unidades.",
      "model": "Modelo",
      "resonance": "frecuencia resonante",
      "qualityFactor": "Factor de calidad (Q)",
      "bandwidth": "Ancho de banda aproximado",
      "inductiveReactance": "Reactancia inductiva (XL)",
      "capacitiveReactance": "Reactancia capacitiva (XC)",
      "complexImpedance": "Impedancia compleja (R + jX)",
      "impedanceMagnitudePhase": "Magnitud / fase de impedancia",
      "current": "Corriente de fuente (RMS ideal)"
    },
    "additionalFaqs": [
      {
        "question": "¿Cuál es la fórmula de la frecuencia resonante?",
        "answer": "Para un inductor ideal L y un condensador C, f₀ = 1/(2π√(LC)). Utilice henrios y faradios para obtener hercios. La resistencia cambia la amortiguación y Q, no esta fórmula de resonancia LC ideal."
      },
      {
        "question": "¿En qué se diferencian los circuitos RLC en serie y en paralelo?",
        "answer": "En resonancia, un RLC en serie ideal tiene una impedancia mínima igual a R; un RLC paralelo ideal tiene una impedancia máxima igual a R. Por lo tanto, el comportamiento de la corriente y el voltaje difieren aunque f₀ ideal sea el mismo."
      },
      {
        "question": "¿Cómo se calculan Q y el ancho de banda?",
        "answer": "Para el modelo en serie, Q = ω₀L/R y el ancho de banda es R/(2πL). Para el modelo paralelo, Q = R/(ω₀L) y el ancho de banda es 1/(2πRC). Éstas son relaciones ideales de resonancia única."
      },
      {
        "question": "¿Este modelo incluye tolerancias reales de los componentes?",
        "answer": "No. Asume componentes R, L y C ideales, lineales y agrupados. Los parásitos, la resistencia del devanado del inductor, la impedancia de la fuente, la carga y la variación de los componentes pueden desplazar o amortiguar los circuitos reales."
      },
      {
        "question": "¿Puede esta calculadora certificar que un circuito es seguro?",
        "answer": "No. Es una estimación educativa, no una aprobación de diseño o evaluación de seguridad. Confirme las clasificaciones de los componentes y el comportamiento en el mundo real con hojas de datos y una revisión de ingeniería calificada."
      }
    ]
  },
  "fr": {
    "copyLanguage": "fr",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Calculateur de circuits RLC",
    "title": "Calculateur de circuit RLC gratuit et | UsefulVerse",
    "description": "Recherchez la résonance RLC, Q, la bande passante et l'impédance pour les circuits en série ou en parallèle. Gratuit, local et illimité.",
    "intro": "Choisissez un modèle RLC série ou parallèle, entrez les valeurs des composants et inspectez la résonance et l'impédance à une fréquence de votre choix.",
    "howQuestion": "Comment calculer la résonance RLC ?",
    "howAnswer": "Pour les composants groupés idéaux, la fréquence de résonance est de 1/(2π√(LC)). Le facteur de qualité et la bande passante dépendent du fait que la résistance soit en série ou en parallèle. Ce calculateur évalue également l'impédance complexe à la fréquence sélectionnée.",
    "privacyQuestion": "Les valeurs de mes circuits sont-elles téléchargées ?",
    "privacyAnswer": "Non. Les calculs et la courbe de réponse s'exécutent dans ce navigateur ; vos valeurs saisies ne sont ni téléchargées ni enregistrées.",
    "fields": {
      "topology": "Topologie des circuits",
      "series": "Série RLC",
      "parallel": "RLC parallèle",
      "resistance": "Résistance (Ω)",
      "inductance": "Inductance",
      "inductanceUnit": "Unité d'inductance",
      "henries": "Henri (H)",
      "millihenries": "Millihenries (mH)",
      "microhenries": "Microhenries (µH)",
      "capacitance": "Capacitance",
      "capacitanceUnit": "Unité de capacité",
      "farads": "Farads (F)",
      "microfarads": "Microfarads (µF)",
      "nanofarads": "Nanofarads (nF)",
      "picofarads": "Picofarads (pF)",
      "frequency": "Fréquence à évaluer",
      "frequencyUnit": "Unité de fréquence",
      "hertz": "Hertz (Hz)",
      "kilohertz": "Kilohertz (kHz)",
      "voltage": "Tension source (V RMS)",
      "accuracyNote": "Modèle RLC linéaire et groupé idéal uniquement. Le mode parallèle signifie que R, L et C sont tous en parallèle. Il ignore les tolérances, les parasites, la résistance de la bobine, l'impédance de la source, les pièces non linéaires, le couplage de charge et la sécurité. Il ne certifie pas un circuit réel ni ne sélectionne de pièces. Vérifiez les fiches techniques et consultez un professionnel qualifié avant de construire ou d’utiliser du matériel réel. Fonctionne localement ; pas de téléchargement.",
      "chartTitle": "Impédance à travers la fréquence",
      "chartDescription": "Balayage de fréquence logarithmique d'un dixième à dix fois la fréquence de résonance. La courbe montre l'amplitude d'impédance idéale pour la topologie série ou parallèle sélectionnée."
    },
    "actions": {
      "calculate": "Calculer le circuit RLC",
      "reset": "Réinitialiser",
      "copy": "Copier les résultats",
      "example": "Charger un exemple",
      "result": "Résultats du RLC"
    },
    "messages": {
      "copied": "Résultats copiés.",
      "copyUnavailable": "La copie n'est pas disponible dans ce navigateur.",
      "calculated": "Estimation RLC calculée.",
      "checkInputs": "Vérifiez R, L, C, la fréquence, la tension, la topologie et les unités.",
      "model": "Modèle",
      "resonance": "Fréquence de résonance",
      "qualityFactor": "Facteur de qualité (Q)",
      "bandwidth": "Bande passante approximative",
      "inductiveReactance": "Réactance inductive (XL)",
      "capacitiveReactance": "Réactance capacitive (XC)",
      "complexImpedance": "Impédance complexe (R + jX)",
      "impedanceMagnitudePhase": "Impédance amplitude / phase",
      "current": "Courant source (RMS idéal)"
    },
    "additionalFaqs": [
      {
        "question": "Quelle est la formule de la fréquence de résonance ?",
        "answer": "Pour une inductance L idéale et un condensateur C, f₀ = 1/(2π√(LC)). Utilisez des Henry et des Farads pour obtenir du hertz. La résistance modifie l'amortissement et Q, pas cette formule de résonance LC idéale."
      },
      {
        "question": "En quoi les circuits RLC série et parallèle diffèrent-ils ?",
        "answer": "A la résonance, une série idéale RLC a une impédance minimale égale à R ; un RLC parallèle idéal a une impédance maximale égale à R. Le comportement du courant et de la tension diffère donc même si le f₀ idéal est le même."
      },
      {
        "question": "Comment sont calculés Q et la bande passante ?",
        "answer": "Pour le modèle série, Q = ω₀L/R et la bande passante est R/(2πL). Pour le modèle parallèle, Q = R/(ω₀L) et la bande passante est de 1/(2πRC). Ce sont des relations idéales à résonance unique."
      },
      {
        "question": "Ce modèle inclut-il de réelles tolérances de composants ?",
        "answer": "Non. Il suppose des composantes R, L et C idéales, linéaires et regroupées. Les parasites, la résistance de l'enroulement de l'inducteur, l'impédance de la source, la charge et la variation des composants peuvent déplacer ou amortir les circuits réels."
      },
      {
        "question": "Cette calculatrice peut-elle certifier qu'un circuit est sûr ?",
        "answer": "Non. Il s’agit d’une estimation pédagogique, et non d’une approbation de conception ou d’une évaluation de sécurité. Confirmez les évaluations des composants et leur comportement dans le monde réel avec des fiches techniques et un examen technique qualifié."
      }
    ]
  },
  "pt": {
    "copyLanguage": "pt",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Calculadora de Circuito RLC",
    "title": "Calculadora de circuito RLC gratuita e | UsefulVerse",
    "description": "Encontre ressonância RLC, Q, largura de banda e impedância para circuitos em série ou paralelo. Gratuito, local e ilimitado.",
    "intro": "Escolha um modelo RLC em série ou paralelo, insira os valores dos componentes e inspecione a ressonância mais a impedância na frequência que você escolher.",
    "howQuestion": "Como você calcula a ressonância RLC?",
    "howAnswer": "Para componentes concentrados ideais, a frequência de ressonância é 1/(2π√(LC)). O fator de qualidade e a largura de banda dependem se o resistor está em série ou paralelo. Esta calculadora também avalia a impedância complexa na frequência selecionada.",
    "privacyQuestion": "Os valores do meu circuito foram carregados?",
    "privacyAnswer": "Não. A curva matemática e de resposta são executadas neste navegador; seus valores inseridos não são carregados ou salvos.",
    "fields": {
      "topology": "Topologia de circuito",
      "series": "Série RLC",
      "parallel": "RLC paralelo",
      "resistance": "Resistência (Ω)",
      "inductance": "Indutância",
      "inductanceUnit": "Unidade de indutância",
      "henries": "Henrique (H)",
      "millihenries": "Milienries (mH)",
      "microhenries": "Microhenries (µH)",
      "capacitance": "Capacitância",
      "capacitanceUnit": "Unidade de capacitância",
      "farads": "Farads (F)",
      "microfarads": "Microfarads (µF)",
      "nanofarads": "Nanofarads (nF)",
      "picofarads": "Picofarads (pF)",
      "frequency": "Frequência para avaliar",
      "frequencyUnit": "Unidade de frequência",
      "hertz": "Hertz (Hz)",
      "kilohertz": "Quilohertz (kHz)",
      "voltage": "Tensão da fonte (V RMS)",
      "accuracyNote": "Somente modelo RLC linear concentrado e ideal. O modo paralelo significa que R, L e C estão todos em paralelo. Ignora tolerâncias, parasitas, resistência da bobina, impedância da fonte, peças não lineares, acoplamento de carga e segurança. Não certifica um circuito real nem seleciona peças. Verifique as fichas técnicas e consulte um profissional qualificado antes de construir ou usar hardware real. Executa localmente; sem upload.",
      "chartTitle": "Impedância através da frequência",
      "chartDescription": "Varredura de frequência logarítmica de um décimo a dez vezes a frequência de ressonância. A curva mostra a magnitude de impedância ideal para a topologia em série ou paralela selecionada."
    },
    "actions": {
      "calculate": "Calcular circuito RLC",
      "reset": "Reiniciar",
      "copy": "Copiar resultados",
      "example": "Exemplo de carregamento",
      "result": "Resultados RLC"
    },
    "messages": {
      "copied": "Resultados copiados.",
      "copyUnavailable": "A cópia não está disponível neste navegador.",
      "calculated": "Estimativa RLC calculada.",
      "checkInputs": "Verifique R, L, C, frequência, tensão, topologia e unidades.",
      "model": "Modelo",
      "resonance": "Frequência ressonante",
      "qualityFactor": "Fator de qualidade (Q)",
      "bandwidth": "Largura de banda aproximada",
      "inductiveReactance": "Reatância indutiva (XL)",
      "capacitiveReactance": "Reatância capacitiva (XC)",
      "complexImpedance": "Impedância complexa (R + jX)",
      "impedanceMagnitudePhase": "Magnitude/fase da impedância",
      "current": "Corrente de fonte (RMS ideal)"
    },
    "additionalFaqs": [
      {
        "question": "Qual é a fórmula da frequência ressonante?",
        "answer": "Para um indutor L e um capacitor C ideais, f₀ = 1/(2π√(LC)). Use Henrys e Farads para obter hertz. O resistor altera o amortecimento e Q, não esta fórmula de ressonância LC ideal."
      },
      {
        "question": "Como os circuitos RLC em série e paralelo diferem?",
        "answer": "Na ressonância, uma série ideal RLC tem impedância mínima igual a R; um RLC paralelo ideal tem impedância máxima igual a R. O comportamento da corrente e da tensão, portanto, diferem, embora o f₀ ideal seja o mesmo."
      },
      {
        "question": "Como o Q e a largura de banda são calculados?",
        "answer": "Para o modelo em série, Q = ω₀L/R e a largura de banda é R/(2πL). Para o modelo paralelo, Q = R/(ω₀L) e a largura de banda é 1/(2πRC). Estas são relações ideais de ressonância única."
      },
      {
        "question": "Este modelo inclui tolerâncias reais de componentes?",
        "answer": "Não. Ele assume componentes R, L e C ideais, lineares e concentrados. Parasitas, resistência do enrolamento do indutor, impedância da fonte, carga e variação dos componentes podem deslocar ou amortecer circuitos reais."
      },
      {
        "question": "Esta calculadora pode certificar um circuito como seguro?",
        "answer": "Não. É uma estimativa educacional, não uma aprovação de projeto ou avaliação de segurança. Confirme as classificações dos componentes e o comportamento no mundo real com folhas de dados e revisão de engenharia qualificada."
      }
    ]
  },
  "de": {
    "copyLanguage": "de",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC-Schaltungsrechner",
    "title": "RLC-Schaltkreisrechner kostenlos und | UsefulVerse",
    "description": "Finden Sie RLC-Resonanz, Q, Bandbreite und Impedanz für Reihen- oder Parallelschaltungen. Kostenlos, lokal und unbegrenzt.",
    "intro": "Wählen Sie ein serielles oder paralleles RLC-Modell, geben Sie Komponentenwerte ein und prüfen Sie Resonanz und Impedanz bei einer von Ihnen gewählten Frequenz.",
    "howQuestion": "Wie berechnet man die RLC-Resonanz?",
    "howAnswer": "Für ideale konzentrierte Komponenten beträgt die Resonanzfrequenz 1/(2π√(LC)). Gütefaktor und Bandbreite hängen davon ab, ob der Widerstand in Reihe oder parallel geschaltet ist. Dieser Rechner wertet auch die komplexe Impedanz bei der von Ihnen gewählten Frequenz aus.",
    "privacyQuestion": "Werden meine Schaltungswerte hochgeladen?",
    "privacyAnswer": "Nein. Die Berechnungs- und Antwortkurve wird in diesem Browser ausgeführt. Ihre eingegebenen Werte werden nicht hochgeladen oder gespeichert.",
    "fields": {
      "topology": "Schaltungstopologie",
      "series": "Serie RLC",
      "parallel": "Paralleles RLC",
      "resistance": "Widerstand (Ω)",
      "inductance": "Induktivität",
      "inductanceUnit": "Induktivitätseinheit",
      "henries": "Henries (H)",
      "millihenries": "Millihenries (mH)",
      "microhenries": "Mikrohenry (µH)",
      "capacitance": "Kapazität",
      "capacitanceUnit": "Kapazitätseinheit",
      "farads": "Farad (F)",
      "microfarads": "Mikrofarad (µF)",
      "nanofarads": "Nanofarad (nF)",
      "picofarads": "Pikofarad (pF)",
      "frequency": "Häufigkeit der Auswertung",
      "frequencyUnit": "Frequenzeinheit",
      "hertz": "Hertz (Hz)",
      "kilohertz": "Kilohertz (kHz)",
      "voltage": "Quellenspannung (V RMS)",
      "accuracyNote": "Nur ideales konzentriertes, lineares RLC-Modell. Parallelmodus bedeutet, dass R, L und C alle parallel sind. Es ignoriert Toleranzen, Parasiten, Spulenwiderstand, Quellenimpedanz, nichtlineare Teile, Lastkopplung und Sicherheit. Es werden keine echten Schaltkreise oder ausgewählte Teile zertifiziert. Überprüfen Sie die Datenblätter und konsultieren Sie einen qualifizierten Fachmann, bevor Sie echte Hardware bauen oder verwenden. Läuft lokal; kein Upload.",
      "chartTitle": "Impedanz über der Frequenz",
      "chartDescription": "Logarithmischer Frequenzdurchlauf von einem Zehntel bis zum Zehnfachen der Resonanzfrequenz. Die Kurve zeigt die ideale Impedanzgröße für die ausgewählte Reihen- oder Paralleltopologie."
    },
    "actions": {
      "calculate": "Berechnen Sie die RLC-Schaltung",
      "reset": "Zurücksetzen",
      "copy": "Ergebnisse kopieren",
      "example": "Beispiel laden",
      "result": "RLC-Ergebnisse"
    },
    "messages": {
      "copied": "Ergebnisse kopiert.",
      "copyUnavailable": "Das Kopieren ist in diesem Browser nicht verfügbar.",
      "calculated": "RLC-Schätzung berechnet.",
      "checkInputs": "Überprüfen Sie R, L, C, Frequenz, Spannung, Topologie und Einheiten.",
      "model": "Modell",
      "resonance": "Resonanzfrequenz",
      "qualityFactor": "Qualitätsfaktor (Q)",
      "bandwidth": "Ungefähre Bandbreite",
      "inductiveReactance": "Induktiver Blindwiderstand (XL)",
      "capacitiveReactance": "Kapazitive Reaktanz (XC)",
      "complexImpedance": "Komplexe Impedanz (R + jX)",
      "impedanceMagnitudePhase": "Impedanzbetrag/Phase",
      "current": "Quellstrom (idealer RMS)"
    },
    "additionalFaqs": [
      {
        "question": "Wie lautet die Resonanzfrequenzformel?",
        "answer": "Für einen idealen Induktor L und Kondensator C gilt f₀ = 1/(2π√(LC)). Verwenden Sie Henry und Farad, um Hertz zu erhalten. Der Widerstand ändert Dämpfung und Q, nicht diese ideale LC-Resonanzformel."
      },
      {
        "question": "Wie unterscheiden sich serielle und parallele RLC-Schaltungen?",
        "answer": "Bei Resonanz hat ein idealer Reihen-RLC eine minimale Impedanz gleich R; Ein idealer paralleler RLC hat eine maximale Impedanz gleich R. Strom- und Spannungsverhalten unterscheiden sich daher, obwohl das ideale f₀ gleich ist."
      },
      {
        "question": "Wie werden Q und Bandbreite berechnet?",
        "answer": "Für das Reihenmodell gilt Q = ω₀L/R und die Bandbreite beträgt R/(2πL). Für das Parallelmodell gilt Q = R/(ω₀L) und die Bandbreite beträgt 1/(2πRC). Dies sind ideale Einzelresonanzbeziehungen."
      },
      {
        "question": "Berücksichtigt dieses Modell reale Bauteiltoleranzen?",
        "answer": "Nein. Es werden ideale, lineare, konzentrierte R-, L- und C-Komponenten angenommen. Parasitäre Faktoren, der Widerstand der Induktorwicklung, die Impedanz der Quelle, Last- und Komponentenschwankungen können reale Schaltkreise verschieben oder dämpfen."
      },
      {
        "question": "Kann dieser Rechner einen Stromkreis als sicher zertifizieren?",
        "answer": "Nein. Es handelt sich um eine pädagogische Schätzung, nicht um eine Designgenehmigung oder Sicherheitsbewertung. Bestätigen Sie die Komponentenbewertungen und das Verhalten in der Praxis anhand von Datenblättern und einer qualifizierten technischen Prüfung."
      }
    ]
  },
  "ja": {
    "copyLanguage": "ja",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC回路計算機",
    "title": "RLC 回路計算機無料&無制限 | UsefulVerse",
    "description": "直列または並列回路の RLC 共振、Q、帯域幅、インピーダンスを求めます。無料、ローカル、無制限。",
    "intro": "直列または並列 RLC モデルを選択し、コンポーネントの値を入力し、選択した周波数での共振とインピーダンスを検査します。",
    "howQuestion": "RLC 共振はどのように計算しますか?",
    "howAnswer": "理想的な集中成分の場合、共振周波数は 1/(2π√(LC)) です。品質係数と帯域幅は、抵抗が直列か並列かによって異なります。この計算機は、選択した周波数での複素インピーダンスも評価します。",
    "privacyQuestion": "私の回路値はアップロードされていますか?",
    "privacyAnswer": "いいえ。計算と応答曲線はこのブラウザで実行されます。入力した値はアップロードまたは保存されません。",
    "fields": {
      "topology": "回路トポロジ",
      "series": "RLCシリーズ",
      "parallel": "並列 RLC",
      "resistance": "抵抗(Ω)",
      "inductance": "インダクタンス",
      "inductanceUnit": "インダクタンス単位",
      "henries": "ヘンリー (H)",
      "millihenries": "ミリヘンリー (mH)",
      "microhenries": "マイクロヘンリー (μH)",
      "capacitance": "キャパシタンス",
      "capacitanceUnit": "静電容量ユニット",
      "farads": "ファラッド (F)",
      "microfarads": "マイクロファラッド (μF)",
      "nanofarads": "ナノファラッド (nF)",
      "picofarads": "ピコファラッド (pF)",
      "frequency": "評価する頻度",
      "frequencyUnit": "周波数単位",
      "hertz": "ヘルツ (Hz)",
      "kilohertz": "キロヘルツ (kHz)",
      "voltage": "電源電圧 (V RMS)",
      "accuracyNote": "理想的な集中線形 RLC モデルのみ。パラレル モードとは、R、L、C がすべて並列であることを意味します。許容誤差、寄生成分、コイル抵抗、電源インピーダンス、非線形部品、負荷結合、安全性は無視されます。実際の回路や選択された部品を保証するものではありません。実際のハードウェアを構築または使用する前に、データシートを確認し、資格のある専門家に相談してください。ローカルで実行します。アップロードはありません。",
      "chartTitle": "周波数全体のインピーダンス",
      "chartDescription": "共振周波数の 10 分の 1 から 10 倍までの対数周波数掃引。曲線は、選択した直列または並列トポロジの理想的なインピーダンスの大きさを示します。"
    },
    "actions": {
      "calculate": "RLC回路の計算",
      "reset": "リセット",
      "copy": "結果をコピーする",
      "example": "負荷例",
      "result": "RLCの結果"
    },
    "messages": {
      "copied": "結果がコピーされました。",
      "copyUnavailable": "このブラウザではコピーできません。",
      "calculated": "RLC 推定値が計算されました。",
      "checkInputs": "R、L、C、周波数、電圧、トポロジー、単位を確認してください。",
      "model": "モデル",
      "resonance": "共振周波数",
      "qualityFactor": "品質係数 (Q)",
      "bandwidth": "おおよその帯域幅",
      "inductiveReactance": "誘導リアクタンス (XL)",
      "capacitiveReactance": "容量性リアクタンス (XC)",
      "complexImpedance": "複素インピーダンス (R + jX)",
      "impedanceMagnitudePhase": "インピーダンスの大きさ/位相",
      "current": "ソース電流 (理想的な RMS)"
    },
    "additionalFaqs": [
      {
        "question": "共振周波数の公式は何ですか?",
        "answer": "理想的なインダクタ L とコンデンサ C の場合、f₀ = 1/(2π√(LC)) となります。ヘルツを取得するには、ヘンリーとファラドを使用します。この理想的な LC 共振式ではなく、抵抗によってダンピングと Q が変化します。"
      },
      {
        "question": "直列 RLC 回路と並列 RLC 回路はどのように異なりますか?",
        "answer": "共振時、理想的な直列 RLC は R に等しい最小インピーダンスを持ちます。理想的な並列 RLC の最大インピーダンスは R に等しいため、理想的な f₀ が同じであっても、電流と電圧の動作は異なります。"
      },
      {
        "question": "Qと帯域幅はどのように計算されますか?",
        "answer": "直列モデルの場合、Q = ω₀L/R、帯域幅は R/(2πL) です。並列モデルの場合、Q = R/(ω₀L)、帯域幅は 1/(2πRC) です。これらは理想的な単一共鳴関係です。"
      },
      {
        "question": "このモデルには実際のコンポーネントの公差が含まれていますか?",
        "answer": "いいえ。理想的な線形の集中 R、L、C 成分を想定しています。寄生素子、インダクタ巻線抵抗、電源インピーダンス、負荷、部品の変動により、実際の回路が変化したり、減衰したりする可能性があります。"
      },
      {
        "question": "この計算機は回路が安全であることを証明できますか?",
        "answer": "いいえ。これは教育上の見積もりであり、設計の承認や安全性の評価ではありません。データシートと資格のあるエンジニアリングレビューでコンポーネントの評価と実際の動作を確認します。"
      }
    ]
  },
  "ko": {
    "copyLanguage": "ko",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC 회로 계산기",
    "title": "RLC 회로 계산기 무료 및 무제한 | UsefulVerse",
    "description": "직렬 또는 병렬 회로에 대한 RLC 공진, Q, 대역폭 및 임피던스를 찾아보세요. 무료, 지역 및 무제한.",
    "intro": "직렬 또는 병렬 RLC 모델을 선택하고, 구성 요소 값을 입력하고, 선택한 주파수에서 공진과 임피던스를 검사합니다.",
    "howQuestion": "RLC 공명을 어떻게 계산합니까?",
    "howAnswer": "이상적인 집중 부품의 경우 공진 주파수는 1/(2π√(LC))입니다. 품질 계수와 대역폭은 저항기가 직렬인지 병렬인지에 따라 달라집니다. 이 계산기는 선택한 주파수에서 복소 임피던스도 평가합니다.",
    "privacyQuestion": "내 회로 값이 업로드됩니까?",
    "privacyAnswer": "아니요. 수학 및 응답 곡선은 이 브라우저에서 실행됩니다. 입력한 값은 업로드되거나 저장되지 않습니다.",
    "fields": {
      "topology": "회로 토폴로지",
      "series": "시리즈 RLC",
      "parallel": "병렬 RLC",
      "resistance": "저항(Ω)",
      "inductance": "인덕턴스",
      "inductanceUnit": "인덕턴스 유닛",
      "henries": "헨리(H)",
      "millihenries": "밀리헨리(mH)",
      "microhenries": "마이크로헨리(μH)",
      "capacitance": "정전 용량",
      "capacitanceUnit": "용량 단위",
      "farads": "패럿(F)",
      "microfarads": "마이크로패럿(μF)",
      "nanofarads": "나노패럿(nF)",
      "picofarads": "피코패럿(pF)",
      "frequency": "평가 빈도",
      "frequencyUnit": "주파수 단위",
      "hertz": "헤르츠(Hz)",
      "kilohertz": "킬로헤르츠(kHz)",
      "voltage": "소스 전압(V RMS)",
      "accuracyNote": "이상적인 집중 선형 RLC 모델만 해당됩니다. 병렬 모드는 R, L, C가 모두 병렬임을 의미합니다. 허용 오차, 기생, 코일 저항, 소스 임피던스, 비선형 부품, 부하 결합 및 안전을 무시합니다. 실제 회로나 일부 부품을 인증하지는 않습니다. 실제 하드웨어를 구축하거나 사용하기 전에 데이터시트를 확인하고 자격을 갖춘 전문가에게 문의하세요. 로컬로 실행됩니다. 업로드가 없습니다.",
      "chartTitle": "주파수 전반에 걸친 임피던스",
      "chartDescription": "공진 주파수의 10분의 1에서 10배까지의 로그 주파수 스윕입니다. 곡선은 선택한 직렬 또는 병렬 토폴로지에 대한 이상적인 임피던스 크기를 보여줍니다."
    },
    "actions": {
      "calculate": "RLC 회로 계산",
      "reset": "다시 놓기",
      "copy": "결과 복사",
      "example": "로드 예시",
      "result": "RLC 결과"
    },
    "messages": {
      "copied": "결과가 복사되었습니다.",
      "copyUnavailable": "이 브라우저에서는 복사할 수 없습니다.",
      "calculated": "RLC 추정치가 계산되었습니다.",
      "checkInputs": "R, L, C, 주파수, 전압, 토폴로지, 단위를 확인하세요.",
      "model": "모델",
      "resonance": "공진주파수",
      "qualityFactor": "품질 계수(Q)",
      "bandwidth": "대략적인 대역폭",
      "inductiveReactance": "유도성 리액턴스(XL)",
      "capacitiveReactance": "용량성 리액턴스(XC)",
      "complexImpedance": "복소 임피던스(R + jX)",
      "impedanceMagnitudePhase": "임피던스 크기/위상",
      "current": "소스 전류(이상적인 RMS)"
    },
    "additionalFaqs": [
      {
        "question": "공진 주파수 공식은 무엇입니까?",
        "answer": "이상적인 인덕터 L과 커패시터 C의 경우 f₀ = 1/(2π√(LC))입니다. 헤르츠를 얻으려면 헨리와 패럿을 사용하십시오. 저항은 이상적인 LC 공진 공식이 아닌 댐핑과 Q를 변경합니다."
      },
      {
        "question": "직렬 및 병렬 RLC 회로는 어떻게 다릅니까?",
        "answer": "공진에서 이상적인 직렬 RLC는 R과 동일한 최소 임피던스를 갖습니다. 이상적인 병렬 RLC는 R과 동일한 최대 임피던스를 갖습니다. 따라서 이상적인 f₀이 동일하더라도 전류 및 전압 동작은 다릅니다."
      },
      {
        "question": "Q와 대역폭은 어떻게 계산되나요?",
        "answer": "계열 모델의 경우 Q = Ω₀L/R이고 대역폭은 R/(2πL)입니다. 병렬 모델의 경우 Q = R/(Ω₀L)이고 대역폭은 1/(2πRC)입니다. 이는 이상적인 단일 공진 관계입니다."
      },
      {
        "question": "이 모델에는 실제 부품 공차가 포함되어 있습니까?",
        "answer": "아니요. 이상적이고 선형이며 집중된 R, L 및 C 구성요소를 가정합니다. 기생 성분, 인덕터 권선 저항, 소스 임피던스, 로딩 및 부품 변동은 실제 회로를 이동시키거나 감쇠시킬 수 있습니다."
      },
      {
        "question": "이 계산기가 회로가 안전한지 인증할 수 있나요?",
        "answer": "아니요. 이는 설계 승인이나 안전 평가가 아닌 교육적 추정치입니다. 데이터시트와 검증된 엔지니어링 검토를 통해 구성요소 등급과 실제 동작을 확인하세요."
      }
    ]
  },
  "id": {
    "copyLanguage": "id",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Kalkulator Sirkuit RLC",
    "title": "Kalkulator Sirkuit RLC Gratis & Tidak | UsefulVerse",
    "description": "Temukan resonansi RLC, Q, bandwidth dan impedansi untuk rangkaian seri atau paralel. Gratis, lokal, dan tidak terbatas.",
    "intro": "Pilih model RLC seri atau paralel, masukkan nilai komponen, dan periksa resonansi ditambah impedansi pada frekuensi yang Anda pilih.",
    "howQuestion": "Bagaimana cara menghitung resonansi RLC?",
    "howAnswer": "Untuk komponen gabungan yang ideal, frekuensi resonansinya adalah 1/(2π√(LC)). Faktor kualitas dan bandwidth bergantung pada apakah resistor dirangkai seri atau paralel. Kalkulator ini juga mengevaluasi impedansi kompleks pada frekuensi pilihan Anda.",
    "privacyQuestion": "Apakah nilai sirkuit saya diunggah?",
    "privacyAnswer": "Tidak. Kurva matematika dan respons dijalankan di browser ini; nilai yang Anda masukkan tidak diunggah atau disimpan.",
    "fields": {
      "topology": "Topologi sirkuit",
      "series": "Seri RLC",
      "parallel": "RLC paralel",
      "resistance": "Resistensi (Ω)",
      "inductance": "Induktansi",
      "inductanceUnit": "Satuan induktansi",
      "henries": "Henri (H)",
      "millihenries": "Milihenri (mH)",
      "microhenries": "Mikrohenri (µH)",
      "capacitance": "Kapasitansi",
      "capacitanceUnit": "Satuan kapasitansi",
      "farads": "Farad (P)",
      "microfarads": "Mikrofarad (µF)",
      "nanofarads": "Nanofarad (nF)",
      "picofarads": "Pikofarad (pF)",
      "frequency": "Frekuensi untuk dievaluasi",
      "frequencyUnit": "Satuan frekuensi",
      "hertz": "Hertz (Hz)",
      "kilohertz": "Kilohertz (kHz)",
      "voltage": "Tegangan sumber (V RMS)",
      "accuracyNote": "Hanya model RLC linier yang disamakan dan ideal. Mode paralel berarti R, L dan C semuanya paralel. Ini mengabaikan toleransi, parasit, resistansi koil, impedansi sumber, bagian nonlinier, kopling beban, dan keselamatan. Itu tidak mensertifikasi sirkuit nyata atau bagian tertentu. Periksa lembar data dan konsultasikan dengan profesional yang berkualifikasi sebelum membuat atau menggunakan perangkat keras sebenarnya. Berjalan secara lokal; tidak ada unggahan.",
      "chartTitle": "Impedansi melintasi frekuensi",
      "chartDescription": "Sapuan frekuensi log dari sepersepuluh hingga sepuluh kali frekuensi resonansi. Kurva menunjukkan besaran impedansi ideal untuk topologi seri atau paralel yang dipilih."
    },
    "actions": {
      "calculate": "Hitung rangkaian RLC",
      "reset": "Mengatur ulang",
      "copy": "Salin hasilnya",
      "example": "Muat contoh",
      "result": "Hasil RLC"
    },
    "messages": {
      "copied": "Hasil disalin.",
      "copyUnavailable": "Salinan tidak tersedia di browser ini.",
      "calculated": "Estimasi RLC dihitung.",
      "checkInputs": "Periksa R, L, C, frekuensi, tegangan, topologi dan satuan.",
      "model": "Model",
      "resonance": "Frekuensi resonansi",
      "qualityFactor": "Faktor kualitas (Q)",
      "bandwidth": "Perkiraan bandwidth",
      "inductiveReactance": "Reaktansi induktif (XL)",
      "capacitiveReactance": "Reaktansi kapasitif (XC)",
      "complexImpedance": "Impedansi kompleks (R + jX)",
      "impedanceMagnitudePhase": "Besaran impedansi/fasa",
      "current": "Sumber arus (RMS ideal)"
    },
    "additionalFaqs": [
      {
        "question": "Apa rumus frekuensi resonansi?",
        "answer": "Untuk induktor ideal L dan kapasitor C, f₀ = 1/(2π√(LC)). Gunakan henries dan farad untuk mendapatkan hertz. Resistor mengubah redaman dan Q, bukan rumus resonansi LC ideal ini."
      },
      {
        "question": "Apa perbedaan rangkaian RLC seri dan paralel?",
        "answer": "Pada resonansi, RLC seri ideal memiliki impedansi minimum sama dengan R; RLC paralel ideal memiliki impedansi maksimum sama dengan R. Oleh karena itu, perilaku arus dan tegangan berbeda meskipun f₀ ideal sama."
      },
      {
        "question": "Bagaimana Q dan bandwidth dihitung?",
        "answer": "Untuk model seri, Q = ω₀L/R dan bandwidth adalah R/(2πL). Untuk model paralel, Q = R/(ω₀L) dan bandwidth adalah 1/(2πRC). Ini adalah hubungan resonansi tunggal yang ideal."
      },
      {
        "question": "Apakah model ini menyertakan toleransi komponen nyata?",
        "answer": "Tidak. Ini mengasumsikan komponen R, L dan C yang ideal, linier, disatukan. Parasit, resistansi belitan induktor, impedansi sumber, pembebanan, dan variasi komponen dapat menggeser atau meredam rangkaian nyata."
      },
      {
        "question": "Bisakah kalkulator ini menyatakan suatu sirkuit aman?",
        "answer": "Tidak. Ini merupakan perkiraan pendidikan, bukan persetujuan desain atau penilaian keselamatan. Konfirmasikan peringkat komponen dan perilaku dunia nyata dengan lembar data dan tinjauan teknis yang berkualitas."
      }
    ]
  },
  "hi": {
    "copyLanguage": "hi",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "आरएलसी सर्किट कैलकुलेटर",
    "title": "आरएलसी सर्किट कैलकुलेटर मुफ़्त और असीमित | UsefulVerse",
    "description": "श्रृंखला या समानांतर सर्किट के लिए आरएलसी अनुनाद, क्यू, बैंडविड्थ और प्रतिबाधा खोजें। मुफ़्त, स्थानीय और असीमित।",
    "intro": "एक श्रृंखला या समानांतर आरएलसी मॉडल चुनें, घटक मान दर्ज करें, और आपके द्वारा चुनी गई आवृत्ति पर अनुनाद प्लस प्रतिबाधा का निरीक्षण करें।",
    "howQuestion": "आप आरएलसी अनुनाद की गणना कैसे करते हैं?",
    "howAnswer": "आदर्श गांठदार घटकों के लिए, गुंजयमान आवृत्ति 1/(2π√(LC)) है। गुणवत्ता कारक और बैंडविड्थ इस पर निर्भर करता है कि अवरोधक श्रृंखला में है या समानांतर में। यह कैलकुलेटर आपके चयनित आवृत्ति पर जटिल प्रतिबाधा का भी मूल्यांकन करता है।",
    "privacyQuestion": "क्या मेरे सर्किट मान अपलोड किए गए हैं?",
    "privacyAnswer": "नहीं, गणित और प्रतिक्रिया वक्र इस ब्राउज़र में चलते हैं; आपके दर्ज किए गए मान अपलोड या सहेजे नहीं गए हैं.",
    "fields": {
      "topology": "सर्किट टोपोलॉजी",
      "series": "सीरीज आरएलसी",
      "parallel": "समानांतर आरएलसी",
      "resistance": "प्रतिरोध (Ω)",
      "inductance": "अधिष्ठापन",
      "inductanceUnit": "प्रेरकत्व इकाई",
      "henries": "हेनरीज़ (एच)",
      "millihenries": "मिलिहेनरीज (एमएच)",
      "microhenries": "माइक्रोहेनरीज़ (µH)",
      "capacitance": "समाई",
      "capacitanceUnit": "समाई इकाई",
      "farads": "फैराड (एफ)",
      "microfarads": "माइक्रोफ़ारड (μF)",
      "nanofarads": "नैनोफ़ारड्स (एनएफ)",
      "picofarads": "पिकोफैराड (पीएफ)",
      "frequency": "मूल्यांकन करने की आवृत्ति",
      "frequencyUnit": "आवृत्ति इकाई",
      "hertz": "हर्ट्ज़ (हर्ट्ज)",
      "kilohertz": "किलोहर्ट्ज़ (kHz)",
      "voltage": "स्रोत वोल्टेज (वी आरएमएस)",
      "accuracyNote": "केवल गांठदार, रैखिक आरएलसी मॉडल ही आदर्श है। समानांतर मोड का मतलब है कि आर, एल और सी सभी समानांतर में हैं। यह सहनशीलता, परजीवी, कुंडल प्रतिरोध, स्रोत प्रतिबाधा, अरेखीय भाग, लोड युग्मन और सुरक्षा को नजरअंदाज करता है। यह वास्तविक सर्किट या चुनिंदा भागों को प्रमाणित नहीं करता है। वास्तविक हार्डवेयर बनाने या उपयोग करने से पहले डेटाशीट की जाँच करें और एक योग्य पेशेवर से परामर्श लें। स्थानीय स्तर पर चलता है; कोई अपलोड नहीं.",
      "chartTitle": "आवृत्ति के पार प्रतिबाधा",
      "chartDescription": "लॉग-फ़्रीक्वेंसी स्वीप गुंजयमान आवृत्ति के दसवें से दस गुना तक। वक्र चयनित श्रृंखला या समानांतर टोपोलॉजी के लिए आदर्श प्रतिबाधा परिमाण दिखाता है।"
    },
    "actions": {
      "calculate": "आरएलसी सर्किट की गणना करें",
      "reset": "रीसेट करें",
      "copy": "परिणाम कॉपी करें",
      "example": "उदाहरण लोड करें",
      "result": "आरएलसी परिणाम"
    },
    "messages": {
      "copied": "परिणाम कॉपी किए गए.",
      "copyUnavailable": "इस ब्राउज़र में प्रतिलिपि उपलब्ध नहीं है.",
      "calculated": "आरएलसी अनुमान की गणना की गई।",
      "checkInputs": "आर, एल, सी, आवृत्ति, वोल्टेज, टोपोलॉजी और इकाइयों की जांच करें।",
      "model": "नमूना",
      "resonance": "गुंजयमान आवृत्ति",
      "qualityFactor": "गुणवत्ता कारक (क्यू)",
      "bandwidth": "अनुमानित बैंडविड्थ",
      "inductiveReactance": "आगमनात्मक प्रतिक्रिया (एक्सएल)",
      "capacitiveReactance": "कैपेसिटिव रिएक्शन (XC)",
      "complexImpedance": "जटिल प्रतिबाधा (आर + जेएक्स)",
      "impedanceMagnitudePhase": "प्रतिबाधा परिमाण / चरण",
      "current": "स्रोत वर्तमान (आदर्श आरएमएस)"
    },
    "additionalFaqs": [
      {
        "question": "गुंजयमान आवृत्ति सूत्र क्या है?",
        "answer": "एक आदर्श प्रारंभकर्ता L और संधारित्र C के लिए, f₀ = 1/(2π√(LC))। हर्ट्ज़ प्राप्त करने के लिए हेनरी और फैराड का उपयोग करें। रोकनेवाला भिगोना और क्यू बदलता है, यह आदर्श एलसी अनुनाद सूत्र नहीं।"
      },
      {
        "question": "श्रृंखला और समानांतर आरएलसी सर्किट कैसे भिन्न होते हैं?",
        "answer": "अनुनाद पर, एक आदर्श श्रृंखला आरएलसी में आर के बराबर न्यूनतम प्रतिबाधा होती है; एक आदर्श समानांतर आरएलसी में अधिकतम प्रतिबाधा आर के बराबर होती है। वर्तमान और वोल्टेज व्यवहार भिन्न होता है, भले ही आदर्श एफ₀ समान हो।"
      },
      {
        "question": "Q और बैंडविड्थ की गणना कैसे की जाती है?",
        "answer": "श्रृंखला मॉडल के लिए, Q = ω₀L/R और बैंडविड्थ R/(2πL) है। समानांतर मॉडल के लिए, Q = R/(ω₀L) और बैंडविड्थ 1/(2πRC) है। ये आदर्श एकल-अनुनाद संबंध हैं।"
      },
      {
        "question": "क्या इस मॉडल में वास्तविक घटक सहनशीलता शामिल है?",
        "answer": "नहीं, यह आदर्श, रैखिक, गांठदार आर, एल और सी घटकों को मानता है। परजीवी, प्रारंभ करनेवाला घुमावदार प्रतिरोध, स्रोत प्रतिबाधा, लोडिंग और घटक भिन्नता वास्तविक सर्किट को स्थानांतरित या नम कर सकती है।"
      },
      {
        "question": "क्या यह कैलकुलेटर किसी सर्किट को सुरक्षित प्रमाणित कर सकता है?",
        "answer": "नहीं, यह एक शैक्षिक अनुमान है, डिज़ाइन अनुमोदन या सुरक्षा मूल्यांकन नहीं। डेटाशीट और योग्य इंजीनियरिंग समीक्षा के साथ घटक रेटिंग और वास्तविक दुनिया के व्यवहार की पुष्टि करें।"
      }
    ]
  },
  "ar": {
    "copyLanguage": "ar",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "حاسبة دائرة RLC",
    "title": "حاسبة دائرة RLC مجانًا وبلا حدود | UsefulVerse",
    "description": "احسب رنين دائرة RLC ومعامل Q وعرض النطاق والممانعة. مجانية ومحلية وبلا حدود.",
    "intro": "اختر دائرة RLC على التوالي أو التوازي، وأدخل قيم العناصر لعرض الرنين والممانعة عند تردد تختاره.",
    "howQuestion": "كيف تحسب دائرة RLC تردد الرنين؟",
    "howAnswer": "للعناصر المثالية المركزة، تردد الرنين هو 1/(2π√(LC)). يعتمد معامل الجودة Q وعرض النطاق على توصيل المقاومة على التوالي أو التوازي. وتحسب الأداة الممانعة المركبة عند التردد الذي تختاره.",
    "privacyQuestion": "هل تُرفع قيم الدائرة؟",
    "privacyAnswer": "لا. تُجرى الحسابات ويُرسم منحنى الاستجابة في هذا المتصفح، ولا تُرفع القيم أو تُحفظ.",
    "fields": {
      "topology": "تركيب الدائرة",
      "series": "RLC على التوالي",
      "parallel": "RLC على التوازي",
      "resistance": "المقاومة (Ω)",
      "inductance": "المحث",
      "inductanceUnit": "وحدة المحث",
      "henries": "هنري (H)",
      "millihenries": "ملي هنري (mH)",
      "microhenries": "ميكرو هنري (µH)",
      "capacitance": "السعة",
      "capacitanceUnit": "وحدة السعة",
      "farads": "فاراد (F)",
      "microfarads": "ميكروفاراد (µF)",
      "nanofarads": "نانوفاراد (nF)",
      "picofarads": "بيكوفاراد (pF)",
      "frequency": "التردد المراد تحليله",
      "frequencyUnit": "وحدة التردد",
      "hertz": "هرتز (Hz)",
      "kilohertz": "كيلوهرتز (kHz)",
      "voltage": "جهد المصدر (فولت RMS)",
      "accuracyNote": "نموذج RLC مثالي وخطي ومركّز فقط. يعني وضع التوازي أن R وL وC كلها على التوازي. لا يحسب التفاوت أو العناصر الطفيلية أو مقاومة ملف المحث أو ممانعة المصدر أو العناصر غير الخطية أو اقتران الحمل أو السلامة. لا يعتمد دائرة حقيقية ولا يختار مكوناتها. راجع البيانات الفنية واستشر مختصًا قبل بناء أجهزة حقيقية أو استخدامها. يعمل محليًا ولا يرفع البيانات.",
      "chartTitle": "الممانعة حسب التردد",
      "chartDescription": "مسح لوغاريتمي للتردد من عُشر تردد الرنين إلى عشرة أمثاله. يوضح المنحنى مقدار الممانعة المثالي للتركيب المحدد على التوالي أو التوازي."
    },
    "actions": {
      "calculate": "احسب دائرة RLC",
      "reset": "إعادة ضبط",
      "copy": "نسخ النتائج",
      "example": "تحميل المثال",
      "result": "نتائج RLC"
    },
    "messages": {
      "copied": "تم نسخ النتائج.",
      "copyUnavailable": "النسخ غير متاح في هذا المتصفح.",
      "calculated": "تم حساب تقدير دائرة RLC.",
      "checkInputs": "تحقق من قيم R وL وC والتردد والجهد والتركيب والوحدات.",
      "model": "النموذج",
      "resonance": "تردد الرنين",
      "qualityFactor": "معامل الجودة (Q)",
      "bandwidth": "عرض النطاق التقريبي",
      "inductiveReactance": "المفاعلة الحثية (XL)",
      "capacitiveReactance": "المفاعلة السعوية (XC)",
      "complexImpedance": "الممانعة المركبة (R + jX)",
      "impedanceMagnitudePhase": "مقدار الممانعة / الطور",
      "current": "تيار المصدر (RMS مثالي)"
    },
    "additionalFaqs": [
      {
        "question": "ما صيغة تردد الرنين؟",
        "answer": "للمحث L والمكثف C المثاليين، f₀ = 1/(2π√(LC)). استخدم الهنري والفاراد لتحصل على الهرتز. تغيّر المقاومة التخميد ومعامل Q، لا صيغة الرنين المثالية."
      },
      {
        "question": "ما الفرق بين دائرة RLC على التوالي والتوازي؟",
        "answer": "عند الرنين، تكون ممانعة دائرة RLC المثالية على التوالي أقل ما يمكن وتساوي R، بينما تكون ممانعة دائرة التوازي أكبر ما يمكن وتساوي R. لذلك يختلف سلوك التيار والجهد رغم تساوي تردد الرنين المثالي."
      },
      {
        "question": "كيف يُحسب معامل Q وعرض النطاق؟",
        "answer": "لنموذج التوالي: Q = ω₀L/R وعرض النطاق R/(2πL). ولنموذج التوازي: Q = R/(ω₀L) وعرض النطاق 1/(2πRC). هذه علاقات مثالية لرنين واحد."
      },
      {
        "question": "هل تحسب الأداة تفاوتات العناصر الحقيقية؟",
        "answer": "لا. تفترض عناصر مثالية وخطية ومركزة. قد تغيّر العناصر الطفيلية ومقاومة ملف المحث وممانعة المصدر والحمل وتفاوت المكونات استجابة الدائرة الحقيقية."
      },
      {
        "question": "هل تثبت الحاسبة أن الدائرة آمنة؟",
        "answer": "لا. هذا تقدير تعليمي وليس اعتمادًا للتصميم أو تقييمًا للسلامة. تحقّق من تصنيفات العناصر والسلوك الفعلي بمراجعة البيانات الفنية ومهندس مؤهل."
      }
    ]
  },
  "zh": {
    "copyLanguage": "zh",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC 电路计算器",
    "title": "RLC 电路计算器免费且无限制 | UsefulVerse",
    "description": "查找串联或并联电路的 RLC 谐振、Q、带宽和阻抗。免费、本地且无限制。",
    "intro": "选择串联或并联 RLC 模型，输入元件值，并在您选择的频率下检查谐振和阻抗。",
    "howQuestion": "如何计算 RLC 谐振？",
    "howAnswer": "对于理想的集总元件，谐振频率为 1/(2π√(LC))。品质因数和带宽取决于电阻是串联还是并联。该计算器还可以评估您选择的频率下的复阻抗。",
    "privacyQuestion": "我的电路值是否已上传？",
    "privacyAnswer": "不。数学和响应曲线在此浏览器中运行；您输入的值不会上传或保存。",
    "fields": {
      "topology": "电路拓扑",
      "series": "RLC系列",
      "parallel": "并行RLC",
      "resistance": "电阻（Ω）",
      "inductance": "电感",
      "inductanceUnit": "电感单位",
      "henries": "亨利 (H)",
      "millihenries": "毫亨 (mH)",
      "microhenries": "微亨 (µH)",
      "capacitance": "电容",
      "capacitanceUnit": "电容单位",
      "farads": "法拉 (F)",
      "microfarads": "微法 (μF)",
      "nanofarads": "纳法 (nF)",
      "picofarads": "皮法 (pF)",
      "frequency": "评估频率",
      "frequencyUnit": "频率单位",
      "hertz": "赫兹 (Hz)",
      "kilohertz": "千赫兹 (kHz)",
      "voltage": "源电压（V RMS）",
      "accuracyNote": "仅理想的集总线性 RLC 模型。并联模式是指R、L、C全部并联。它忽略了容差、寄生、线圈电阻、源阻抗、非线性部件、负载耦合和安全性。它不认证真实电路或选择的部件。在构建或使用真实硬件之前，请检查数据表并咨询合格的专业人员。在本地运行；没有上传。",
      "chartTitle": "跨频率阻抗",
      "chartDescription": "对数频率扫描为谐振频率的十分之一到十倍。该曲线显示了所选串联或并联拓扑的理想阻抗大小。"
    },
    "actions": {
      "calculate": "计算RLC电路",
      "reset": "重置",
      "copy": "复制结果",
      "example": "负载示例",
      "result": "RLC结果"
    },
    "messages": {
      "copied": "结果已复制。",
      "copyUnavailable": "复制在此浏览器中不可用。",
      "calculated": "已计算 RLC 估计值。",
      "checkInputs": "检查 R、L、C、频率、电压、拓扑和单位。",
      "model": "模型",
      "resonance": "谐振频率",
      "qualityFactor": "品质因数 (Q)",
      "bandwidth": "大约带宽",
      "inductiveReactance": "感抗（XL）",
      "capacitiveReactance": "容抗(XC)",
      "complexImpedance": "复数阻抗 (R + jX)",
      "impedanceMagnitudePhase": "阻抗幅值/相位",
      "current": "源电流（理想 RMS）"
    },
    "additionalFaqs": [
      {
        "question": "谐振频率公式是什么？",
        "answer": "对于理想的电感器 L 和电容器 C，f₀ = 1/(2π√(LC))。使用亨利和法拉获得赫兹。电阻改变阻尼和 Q，而不是这个理想的 LC 谐振公式。"
      },
      {
        "question": "串联和并联 RLC 电路有何不同？",
        "answer": "在谐振时，理想串联 RLC 的最小阻抗等于 R；理想的并联 RLC 的最大阻抗等于 R。因此，即使理想的 f₀ 相同，电流和电压行为也会有所不同。"
      },
      {
        "question": "Q和带宽是如何计算的？",
        "answer": "对于串联模型，Q = ω₀L/R，带宽为 R/(2πL)。对于并行模型，Q = R/(ω₀L)，带宽为 1/(2πRC)。这些是理想的单共振关系。"
      },
      {
        "question": "该模型是否包含真实的组件公差？",
        "answer": "不会。它假设理想的、线性的、集总的 R、L 和 C 分量。寄生效应、电感器绕组电阻、源阻抗、负载和元件变化可能会改变或抑制实际电路。"
      },
      {
        "question": "该计算器可以证明电路安全吗？",
        "answer": "不。这是教育评估，而不是设计批准或安全评估。通过数据表和合格的工程审查来确认组件评级和实际行为。"
      }
    ]
  },
  "bn": {
    "copyLanguage": "bn",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC সার্কিট ক্যালকুলেটর",
    "title": "RLC সার্কিট ক্যালকুলেটর বিনামূল্যে এবং | UsefulVerse",
    "description": "সিরিজ বা সমান্তরাল সার্কিটের জন্য RLC অনুরণন, Q, ব্যান্ডউইথ এবং প্রতিবন্ধকতা খুঁজুন। বিনামূল্যে, স্থানীয় এবং সীমাহীন।",
    "intro": "একটি সিরিজ বা সমান্তরাল RLC মডেল চয়ন করুন, উপাদানের মান লিখুন এবং আপনার চয়ন করা ফ্রিকোয়েন্সিতে অনুরণন প্লাস প্রতিবন্ধকতা পরিদর্শন করুন।",
    "howQuestion": "আপনি কিভাবে RLC অনুরণন গণনা করবেন?",
    "howAnswer": "আদর্শ লুম্পড উপাদানগুলির জন্য, অনুরণিত ফ্রিকোয়েন্সি হল 1/(2π√(LC))। মানের ফ্যাক্টর এবং ব্যান্ডউইথ নির্ভর করে যে প্রতিরোধকটি সিরিজ বা সমান্তরাল কিনা তার উপর। এই ক্যালকুলেটরটি আপনার নির্বাচিত ফ্রিকোয়েন্সিতে জটিল প্রতিবন্ধকতাও মূল্যায়ন করে।",
    "privacyQuestion": "আমার সার্কিট মান আপলোড করা হয়?",
    "privacyAnswer": "না। এই ব্রাউজারে ম্যাথ এবং রেসপন্স কার্ভ চলে; আপনার প্রবেশ করা মান আপলোড বা সংরক্ষণ করা হয় না.",
    "fields": {
      "topology": "সার্কিট টপোলজি",
      "series": "সিরিজ RLC",
      "parallel": "সমান্তরাল RLC",
      "resistance": "প্রতিরোধ (Ω)",
      "inductance": "ইন্ডাকট্যান্স",
      "inductanceUnit": "ইন্ডাকট্যান্স ইউনিট",
      "henries": "হেনরিস (এইচ)",
      "millihenries": "Millihenries (mH)",
      "microhenries": "মাইক্রোহেনরি (µH)",
      "capacitance": "ক্যাপাসিট্যান্স",
      "capacitanceUnit": "ক্যাপাসিট্যান্স ইউনিট",
      "farads": "ফ্যারাডস (এফ)",
      "microfarads": "মাইক্রোফ্যারাডস (µF)",
      "nanofarads": "Nanofarads (nF)",
      "picofarads": "Picofarads (pF)",
      "frequency": "মূল্যায়নের ফ্রিকোয়েন্সি",
      "frequencyUnit": "ফ্রিকোয়েন্সি ইউনিট",
      "hertz": "হার্টজ (Hz)",
      "kilohertz": "কিলোহার্টজ (kHz)",
      "voltage": "উৎস ভোল্টেজ (V RMS)",
      "accuracyNote": "আদর্শ lumped, রৈখিক RLC মডেল শুধুমাত্র. সমান্তরাল মোড মানে R, L এবং C সবই সমান্তরাল। এটি সহনশীলতা, পরজীবী, কুণ্ডলী প্রতিরোধ, উত্স প্রতিবন্ধকতা, অরৈখিক অংশ, লোড কাপলিং এবং সুরক্ষা উপেক্ষা করে। এটি একটি বাস্তব সার্কিট বা নির্বাচন অংশ প্রত্যয়িত না. প্রকৃত হার্ডওয়্যার তৈরি বা ব্যবহার করার আগে ডেটাশিট পরীক্ষা করুন এবং একজন যোগ্যতাসম্পন্ন পেশাদারের সাথে পরামর্শ করুন। স্থানীয়ভাবে চলে; আপলোড নেই।",
      "chartTitle": "ফ্রিকোয়েন্সি জুড়ে প্রতিবন্ধকতা",
      "chartDescription": "লগ-ফ্রিকোয়েন্সি সুইপ এক দশমাংশ থেকে অনুরণিত কম্পাঙ্কের দশগুণ। বক্ররেখাটি নির্বাচিত সিরিজ বা সমান্তরাল টপোলজির জন্য আদর্শ প্রতিবন্ধকতার মাত্রা দেখায়।"
    },
    "actions": {
      "calculate": "RLC সার্কিট গণনা করুন",
      "reset": "রিসেট করুন",
      "copy": "ফলাফল কপি করুন",
      "example": "লোড উদাহরণ",
      "result": "RLC ফলাফল"
    },
    "messages": {
      "copied": "ফলাফল কপি করা হয়েছে.",
      "copyUnavailable": "এই ব্রাউজারে অনুলিপি পাওয়া যায় না।",
      "calculated": "RLC অনুমান গণনা করা হয়েছে।",
      "checkInputs": "R, L, C, ফ্রিকোয়েন্সি, ভোল্টেজ, টপোলজি এবং ইউনিট পরীক্ষা করুন।",
      "model": "মডেল",
      "resonance": "অনুরণিত ফ্রিকোয়েন্সি",
      "qualityFactor": "কোয়ালিটি ফ্যাক্টর (Q)",
      "bandwidth": "আনুমানিক ব্যান্ডউইথ",
      "inductiveReactance": "প্রবর্তক প্রতিক্রিয়া (XL)",
      "capacitiveReactance": "ক্যাপাসিটিভ বিক্রিয়া (XC)",
      "complexImpedance": "জটিল প্রতিবন্ধকতা (R + jX)",
      "impedanceMagnitudePhase": "প্রতিবন্ধকতা মাত্রা / ফেজ",
      "current": "উৎস বর্তমান (আদর্শ RMS)"
    },
    "additionalFaqs": [
      {
        "question": "অনুরণিত ফ্রিকোয়েন্সি সূত্র কি?",
        "answer": "একটি আদর্শ ইন্ডাক্টর L এবং ক্যাপাসিটরের জন্য C, f₀ = 1/(2π√(LC))। হার্টজ পেতে হেনরি এবং ফ্যারাড ব্যবহার করুন। রোধ স্যাঁতসেঁতে এবং Q পরিবর্তন করে, এই আদর্শ এলসি অনুরণন সূত্র নয়।"
      },
      {
        "question": "কিভাবে সিরিজ এবং সমান্তরাল RLC সার্কিট পৃথক?",
        "answer": "অনুরণনে, একটি আদর্শ সিরিজ RLC এর ন্যূনতম প্রতিবন্ধকতা R এর সমান থাকে; একটি আদর্শ সমান্তরাল RLC-এর সর্বোচ্চ প্রতিবন্ধকতা R-এর সমান। কারেন্ট এবং ভোল্টেজ আচরণ তাই ভিন্ন হয় যদিও আদর্শ f₀ একই।"
      },
      {
        "question": "প্রশ্ন এবং ব্যান্ডউইথ কিভাবে গণনা করা হয়?",
        "answer": "সিরিজ মডেলের জন্য, Q = ω₀L/R এবং ব্যান্ডউইথ হল R/(2πL)। সমান্তরাল মডেলের জন্য, Q = R/(ω₀L) এবং ব্যান্ডউইথ হল 1/(2πRC)। এগুলি আদর্শ একক অনুরণন সম্পর্ক।"
      },
      {
        "question": "এই মডেলটি কি প্রকৃত উপাদান সহনশীলতা অন্তর্ভুক্ত করে?",
        "answer": "নং এটি আদর্শ, রৈখিক, lumped R, L এবং C উপাদান অনুমান করে। পরজীবী, ইন্ডাক্টর উইন্ডিং রেজিস্ট্যান্স, সোর্স ইম্পিডেন্স, লোডিং এবং কম্পোনেন্ট ভ্যারিয়েশন বাস্তব সার্কিটগুলিকে স্থানান্তরিত বা স্যাঁতসেঁতে করতে পারে।"
      },
      {
        "question": "এই ক্যালকুলেটর কি নিরাপদ হিসাবে একটি সার্কিট প্রত্যয়িত করতে পারে?",
        "answer": "না। এটি একটি শিক্ষাগত অনুমান, নকশা অনুমোদন বা নিরাপত্তা মূল্যায়ন নয়। ডেটাশিট এবং যোগ্য ইঞ্জিনিয়ারিং পর্যালোচনা সহ উপাদান রেটিং এবং বাস্তব-বিশ্বের আচরণ নিশ্চিত করুন।"
      }
    ]
  },
  "ru": {
    "copyLanguage": "ru",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Калькулятор цепи RLC",
    "title": "Калькулятор цепей RLC бесплатно и без | UsefulVerse",
    "description": "Найдите резонанс RLC, добротность, полосу пропускания и импеданс для последовательных или параллельных цепей. Бесплатно, локально и без ограничений.",
    "intro": "Выберите последовательную или параллельную модель RLC, введите значения компонентов и проверьте резонанс и импеданс на выбранной вами частоте.",
    "howQuestion": "Как рассчитать RLC-резонанс?",
    "howAnswer": "Для идеальных компонентов с сосредоточенными параметрами резонансная частота равна 1/(2π√(LC)). Добротность и полоса пропускания зависят от того, включен ли резистор последовательно или параллельно. Этот калькулятор также оценивает комплексное сопротивление на выбранной вами частоте.",
    "privacyQuestion": "Загружены ли значения моей схемы?",
    "privacyAnswer": "Нет. Математические расчеты и кривая отклика выполняются в этом браузере; введенные вами значения не загружаются и не сохраняются.",
    "fields": {
      "topology": "Топология схемы",
      "series": "Серия РЛК",
      "parallel": "Параллельный RLC",
      "resistance": "Сопротивление (Ом)",
      "inductance": "Индуктивность",
      "inductanceUnit": "Единица индуктивности",
      "henries": "Генрис (Д)",
      "millihenries": "Миллигенри (мГн)",
      "microhenries": "Микрогенри (мкГн)",
      "capacitance": "Емкость",
      "capacitanceUnit": "Единица емкости",
      "farads": "Фарады (Ф)",
      "microfarads": "Микрофарады (мкФ)",
      "nanofarads": "Нанофарады (нФ)",
      "picofarads": "Пикофарады (пФ)",
      "frequency": "Частота оценки",
      "frequencyUnit": "Единица частоты",
      "hertz": "Герц (Гц)",
      "kilohertz": "Килогерц (кГц)",
      "voltage": "Напряжение источника (В, среднеквадратичное значение)",
      "accuracyNote": "Только идеальная сосредоточенная линейная модель RLC. Параллельный режим означает, что R, L и C включены параллельно. Он игнорирует допуски, паразитные помехи, сопротивление катушки, полное сопротивление источника, нелинейные части, связь нагрузки и безопасность. Он не сертифицирует реальную схему или отдельные детали. Прежде чем создавать или использовать настоящее оборудование, ознакомьтесь с техническими данными и проконсультируйтесь с квалифицированным специалистом. Запускается локально; нет загрузки.",
      "chartTitle": "Импеданс по частоте",
      "chartDescription": "Логарифмическая развертка частоты от одной десятой до десятикратной резонансной частоты. Кривая показывает идеальную величину импеданса для выбранной последовательной или параллельной топологии."
    },
    "actions": {
      "calculate": "Рассчитать RLC-схему",
      "reset": "Перезагрузить",
      "copy": "Копировать результаты",
      "example": "Загрузить пример",
      "result": "Результаты РЛК"
    },
    "messages": {
      "copied": "Результаты скопированы.",
      "copyUnavailable": "Копирование недоступно в этом браузере.",
      "calculated": "Рассчитана оценка RLC.",
      "checkInputs": "Проверьте R, L, C, частоту, напряжение, топологию и единицы измерения.",
      "model": "Модель",
      "resonance": "Резонансная частота",
      "qualityFactor": "Добротность (Q)",
      "bandwidth": "Приблизительная пропускная способность",
      "inductiveReactance": "Индуктивное реактивное сопротивление (XL)",
      "capacitiveReactance": "Емкостное реактивное сопротивление (XC)",
      "complexImpedance": "Комплексный импеданс (R + jX)",
      "impedanceMagnitudePhase": "Величина импеданса/фаза",
      "current": "Ток источника (идеальное среднеквадратичное значение)"
    },
    "additionalFaqs": [
      {
        "question": "Какова формула резонансной частоты?",
        "answer": "Для идеального дросселя L и конденсатора C f₀ = 1/(2π√(LC)). Используйте генри и фарады, чтобы получить герцы. Резистор меняет демпфирование и добротность, а не эту идеальную формулу LC-резонанса."
      },
      {
        "question": "Чем отличаются последовательные и параллельные схемы RLC?",
        "answer": "При резонансе идеальный последовательный RLC имеет минимальный импеданс, равный R; идеальный параллельный RLC имеет максимальный импеданс, равный R. Поэтому поведение тока и напряжения различается, даже если идеальное f₀ ​​одинаково."
      },
      {
        "question": "Как рассчитываются добротность и пропускная способность?",
        "answer": "Для серийной модели Q = ω₀L/R, а ширина полосы равна R/(2πL). Для параллельной модели Q = R/(ω₀L) и полоса пропускания равна 1/(2πRC). Это идеальные однорезонансные связи."
      },
      {
        "question": "Включает ли эта модель реальные допуски компонентов?",
        "answer": "Нет. Он предполагает идеальные, линейные, сосредоточенные компоненты R, L и C. Паразитные воздействия, сопротивление обмотки индуктора, сопротивление источника, нагрузка и изменения компонентов могут смещать или демпфировать реальные цепи."
      },
      {
        "question": "Может ли этот калькулятор сертифицировать цепь как безопасную?",
        "answer": "Нет. Это образовательная оценка, а не утверждение проекта или оценка безопасности. Подтвердите номинальные характеристики компонентов и их реальное поведение с помощью технических характеристик и квалифицированной инженерной экспертизы."
      }
    ]
  },
  "ur": {
    "copyLanguage": "ur",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC سرکٹ کیلکولیٹر",
    "title": "RLC سرکٹ کیلکولیٹر مفت اور لامحدود | UsefulVerse",
    "description": "سیریز یا متوازی سرکٹس کے لیے RLC گونج، Q، بینڈوتھ اور مائبادی تلاش کریں۔ مفت، مقامی اور لامحدود۔",
    "intro": "ایک سیریز یا متوازی RLC ماڈل کا انتخاب کریں، اجزاء کی قدریں درج کریں، اور اپنے منتخب کردہ فریکوئنسی پر گونج کے علاوہ رکاوٹ کا معائنہ کریں۔",
    "howQuestion": "آپ RLC گونج کا حساب کیسے لگاتے ہیں؟",
    "howAnswer": "مثالی lumped اجزاء کے لیے، گونجنے والی فریکوئنسی 1/(2π√(LC)) ہے۔ کوالٹی فیکٹر اور بینڈوڈتھ کا انحصار اس بات پر ہے کہ ریزسٹر سیریز میں ہے یا متوازی۔ یہ کیلکولیٹر آپ کی منتخب فریکوئنسی پر پیچیدہ رکاوٹ کا بھی جائزہ لیتا ہے۔",
    "privacyQuestion": "کیا میری سرکٹ ویلیوز اپ لوڈ ہیں؟",
    "privacyAnswer": "نمبر۔ اس براؤزر میں ریاضی اور ردعمل کا وکر چلتا ہے۔ آپ کی درج کردہ اقدار کو اپ لوڈ یا محفوظ نہیں کیا گیا ہے۔",
    "fields": {
      "topology": "سرکٹ ٹوپولوجی",
      "series": "سیریز RLC",
      "parallel": "متوازی RLC",
      "resistance": "مزاحمت (Ω)",
      "inductance": "انڈکٹنس",
      "inductanceUnit": "انڈکٹنس یونٹ",
      "henries": "ہنریز (ایچ)",
      "millihenries": "Millihenries (mH)",
      "microhenries": "مائکرو ہینریز (µH)",
      "capacitance": "اہلیت",
      "capacitanceUnit": "اہلیت یونٹ",
      "farads": "فراڈس (F)",
      "microfarads": "Microfarads (µF)",
      "nanofarads": "Nanofarads (nF)",
      "picofarads": "Picofarads (pF)",
      "frequency": "تعدد کا اندازہ کرنا",
      "frequencyUnit": "تعدد یونٹ",
      "hertz": "ہرٹز (Hz)",
      "kilohertz": "کلو ہرٹز (kHz)",
      "voltage": "ماخذ وولٹیج (V RMS)",
      "accuracyNote": "صرف آئیڈیل lumped، لکیری RLC ماڈل۔ متوازی وضع کا مطلب ہے کہ R، L اور C سبھی متوازی ہیں۔ یہ رواداری، پرجیوی، کنڈلی مزاحمت، ذریعہ رکاوٹ، غیر خطی حصوں، لوڈ کپلنگ اور حفاظت کو نظر انداز کرتا ہے. یہ ایک حقیقی سرکٹ یا منتخب حصوں کی تصدیق نہیں کرتا ہے۔ اصلی ہارڈ ویئر بنانے یا استعمال کرنے سے پہلے ڈیٹا شیٹ چیک کریں اور کسی مستند پیشہ ور سے مشورہ کریں۔ مقامی طور پر چلتا ہے؛ کوئی اپ لوڈ نہیں۔",
      "chartTitle": "تعدد میں رکاوٹ",
      "chartDescription": "لاگ فریکوئنسی جھاڑو ایک دسویں سے دس گنا گونج فریکوئنسی. وکر منتخب سیریز یا متوازی ٹوپولوجی کے لئے مثالی مائبادا کی شدت کو ظاہر کرتا ہے۔"
    },
    "actions": {
      "calculate": "RLC سرکٹ کا حساب لگائیں۔",
      "reset": "دوبارہ ترتیب دیں۔",
      "copy": "نتائج کاپی کریں۔",
      "example": "لوڈ کی مثال",
      "result": "RLC کے نتائج"
    },
    "messages": {
      "copied": "نتائج کاپی ہو گئے۔",
      "copyUnavailable": "اس براؤزر میں کاپی دستیاب نہیں ہے۔",
      "calculated": "RLC تخمینہ کا حساب لگایا گیا۔",
      "checkInputs": "R، L، C، فریکوئنسی، وولٹیج، ٹوپولوجی اور یونٹس چیک کریں۔",
      "model": "ماڈل",
      "resonance": "گونجنے والی تعدد",
      "qualityFactor": "معیار کا عنصر (Q)",
      "bandwidth": "تخمینی بینڈوڈتھ",
      "inductiveReactance": "دلکش رد عمل (XL)",
      "capacitiveReactance": "Capacitive reactance (XC)",
      "complexImpedance": "پیچیدہ رکاوٹ (R + jX)",
      "impedanceMagnitudePhase": "رکاوٹ کی شدت / مرحلہ",
      "current": "ماخذ موجودہ (مثالی RMS)"
    },
    "additionalFaqs": [
      {
        "question": "گونج فریکوئنسی فارمولا کیا ہے؟",
        "answer": "ایک مثالی انڈکٹر L اور capacitor C کے لیے، f₀ = 1/(2π√(LC))۔ ہرٹز حاصل کرنے کے لیے ہینریز اور فاراد کا استعمال کریں۔ ریزسٹر ڈیمپنگ اور Q کو تبدیل کرتا ہے، یہ مثالی LC گونج فارمولہ نہیں۔"
      },
      {
        "question": "سیریز اور متوازی RLC سرکٹس کیسے مختلف ہیں؟",
        "answer": "گونج میں، ایک مثالی سیریز RLC کی کم از کم رکاوٹ R کے برابر ہوتی ہے۔ ایک مثالی متوازی RLC میں R کے برابر زیادہ سے زیادہ رکاوٹ ہوتی ہے۔ کرنٹ اور وولٹیج کا رویہ مختلف ہوتے ہیں حالانکہ مثالی f₀ ایک ہی ہے۔"
      },
      {
        "question": "Q اور بینڈوتھ کا حساب کیسے لگایا جاتا ہے؟",
        "answer": "سیریز ماڈل کے لیے، Q = ω₀L/R اور بینڈوتھ R/(2πL) ہے۔ متوازی ماڈل کے لیے، Q = R/(ω₀L) اور بینڈوتھ 1/(2πRC) ہے۔ یہ مثالی واحد گونج تعلقات ہیں۔"
      },
      {
        "question": "کیا اس ماڈل میں حقیقی اجزاء کی رواداری شامل ہے؟",
        "answer": "نہیں، یہ مثالی، لکیری، lumped R، L اور C اجزاء کو فرض کرتا ہے۔ پیراسیٹکس، انڈکٹر وائنڈنگ ریزسٹنس، سورس امپیڈنس، لوڈنگ اور اجزاء کی تبدیلی اصلی سرکٹس کو شفٹ یا گیلا کر سکتی ہے۔"
      },
      {
        "question": "کیا یہ کیلکولیٹر کسی سرکٹ کو محفوظ قرار دے سکتا ہے؟",
        "answer": "نہیں، یہ ایک تعلیمی تخمینہ ہے، ڈیزائن کی منظوری یا حفاظتی تشخیص نہیں۔ ڈیٹا شیٹس اور قابل انجینئرنگ جائزے کے ساتھ اجزاء کی درجہ بندی اور حقیقی دنیا کے رویے کی تصدیق کریں۔"
      }
    ]
  },
  "tr": {
    "copyLanguage": "tr",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC Devre Hesaplayıcı",
    "title": "RLC Devre Hesaplayıcı Ücretsiz ve Sınırsız | UsefulVerse",
    "description": "Seri veya paralel devreler için RLC rezonansını, Q'sunu, bant genişliğini ve empedansını bulun. Ücretsiz, yerel ve sınırsız.",
    "intro": "Bir seri veya paralel RLC modeli seçin, bileşen değerlerini girin ve seçtiğiniz frekansta rezonans artı empedansı inceleyin.",
    "howQuestion": "RLC rezonansını nasıl hesaplarsınız?",
    "howAnswer": "İdeal toplu bileşenler için rezonans frekansı 1/(2π√(LC))'dir. Kalite faktörü ve bant genişliği, direncin seri veya paralel olmasına bağlıdır. Bu hesaplayıcı aynı zamanda seçtiğiniz frekanstaki karmaşık empedansı da değerlendirir.",
    "privacyQuestion": "Devre değerlerim yüklendi mi?",
    "privacyAnswer": "Hayır. Matematik ve yanıt eğrisi bu tarayıcıda çalışır; Girdiğiniz değerler yüklenmez veya kaydedilmez.",
    "fields": {
      "topology": "Devre topolojisi",
      "series": "RLC Serisi",
      "parallel": "Paralel RLC",
      "resistance": "Direnç (Ω)",
      "inductance": "İndüktans",
      "inductanceUnit": "Endüktans ünitesi",
      "henries": "Henries (H)",
      "millihenries": "Milihenri (mH)",
      "microhenries": "Mikrohenriler (μH)",
      "capacitance": "Kapasite",
      "capacitanceUnit": "Kapasite ünitesi",
      "farads": "Faradlar (F)",
      "microfarads": "Mikrofaradlar (μF)",
      "nanofarads": "Nanofaradlar (nF)",
      "picofarads": "Pikofaradlar (pF)",
      "frequency": "Değerlendirme sıklığı",
      "frequencyUnit": "Frekans birimi",
      "hertz": "Hertz (Hz)",
      "kilohertz": "Kilohertz (kHz)",
      "voltage": "Kaynak voltajı (V RMS)",
      "accuracyNote": "Yalnızca ideal toplu, doğrusal RLC modeli. Paralel mod, R, L ve C'nin hepsinin paralel olduğu anlamına gelir. Toleransları, parazitleri, bobin direncini, kaynak empedansını, doğrusal olmayan parçaları, yük bağlantısını ve güvenliği göz ardı eder. Gerçek bir devreyi veya seçilmiş parçaları onaylamaz. Gerçek donanım oluşturmadan veya kullanmadan önce veri sayfalarını kontrol edin ve kalifiye bir uzmana danışın. Yerel olarak çalışır; yükleme yok.",
      "chartTitle": "Frekans boyunca empedans",
      "chartDescription": "Rezonans frekansının onda birinden on katına kadar log frekansı taraması. Eğri, seçilen seri veya paralel topoloji için ideal empedans büyüklüğünü gösterir."
    },
    "actions": {
      "calculate": "RLC devresini hesaplayın",
      "reset": "Sıfırla",
      "copy": "Sonuçları kopyala",
      "example": "Örnek yükle",
      "result": "RLC sonuçları"
    },
    "messages": {
      "copied": "Sonuçlar kopyalandı.",
      "copyUnavailable": "Kopyalama bu tarayıcıda mevcut değil.",
      "calculated": "RLC tahmini hesaplandı.",
      "checkInputs": "R, L, C, frekans, voltaj, topoloji ve birimleri kontrol edin.",
      "model": "Modeli",
      "resonance": "Rezonans frekansı",
      "qualityFactor": "Kalite faktörü (Q)",
      "bandwidth": "Yaklaşık bant genişliği",
      "inductiveReactance": "Endüktif reaktans (XL)",
      "capacitiveReactance": "Kapasitif reaktans (XC)",
      "complexImpedance": "Karmaşık empedans (R + jX)",
      "impedanceMagnitudePhase": "Empedans büyüklüğü/fazı",
      "current": "Kaynak akımı (ideal RMS)"
    },
    "additionalFaqs": [
      {
        "question": "Rezonans frekansı formülü nedir?",
        "answer": "İdeal bir L indüktörü ve C kondansatörü için f₀ = 1/(2π√(LC)) Hertz'i elde etmek için Henry ve Farad'ları kullanın. Direnç, bu ideal LC rezonans formülünü değil, sönümlemeyi ve Q'yu değiştirir."
      },
      {
        "question": "Seri ve paralel RLC devreleri nasıl farklılık gösterir?",
        "answer": "Rezonansta ideal bir RLC serisi, R'ye eşit minimum empedansa sahiptir; ideal bir paralel RLC'nin maksimum empedansı R'ye eşittir. Bu nedenle ideal f₀ aynı olsa bile akım ve gerilim davranışı farklılık gösterir."
      },
      {
        "question": "Q ve bant genişliği nasıl hesaplanır?",
        "answer": "Seri model için Q = ω₀L/R ve bant genişliği R/(2πL)'dir. Paralel model için Q = R/(ω₀L) ve bant genişliği 1/(2πRC)'dir. Bunlar ideal tek rezonans ilişkileridir."
      },
      {
        "question": "Bu model gerçek bileşen toleranslarını içeriyor mu?",
        "answer": "Hayır. İdeal, doğrusal, toplu R, L ve C bileşenlerini varsayar. Parazit, indüktör sargı direnci, kaynak empedansı, yükleme ve bileşen değişimi gerçek devreleri kaydırabilir veya sönümleyebilir."
      },
      {
        "question": "Bu hesap makinesi bir devrenin güvenli olduğunu onaylayabilir mi?",
        "answer": "Hayır. Bu bir eğitim tahminidir, tasarım onayı veya güvenlik değerlendirmesi değildir. Bileşen derecelendirmelerini ve gerçek dünyadaki davranışını veri sayfaları ve nitelikli mühendislik incelemesiyle doğrulayın."
      }
    ]
  },
  "vi": {
    "copyLanguage": "vi",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Máy tính mạch RLC",
    "title": "Máy tính mạch RLC miễn phí & không giới hạn | UsefulVerse",
    "description": "Tìm cộng hưởng RLC, Q, băng thông và trở kháng cho mạch nối tiếp hoặc song song. Miễn phí, địa phương và không giới hạn.",
    "intro": "Chọn mô hình RLC nối tiếp hoặc song song, nhập các giá trị thành phần và kiểm tra sự cộng hưởng cộng với trở kháng ở tần số bạn chọn.",
    "howQuestion": "Làm thế nào để bạn tính toán cộng hưởng RLC?",
    "howAnswer": "Đối với các thành phần gộp lý tưởng, tần số cộng hưởng là 1/(2π√(LC)). Hệ số chất lượng và băng thông phụ thuộc vào việc điện trở mắc nối tiếp hay song song. Máy tính này cũng đánh giá trở kháng phức tạp ở tần số bạn đã chọn.",
    "privacyQuestion": "Giá trị mạch của tôi có được tải lên không?",
    "privacyAnswer": "Không. Đường cong toán học và phản hồi chạy trong trình duyệt này; các giá trị đã nhập của bạn không được tải lên hoặc lưu.",
    "fields": {
      "topology": "Cấu trúc liên kết mạch",
      "series": "Dòng RLC",
      "parallel": "RLC song song",
      "resistance": "Điện trở (Ω)",
      "inductance": "Điện cảm",
      "inductanceUnit": "đơn vị điện cảm",
      "henries": "Henries (H)",
      "millihenries": "Millihenries (mH)",
      "microhenries": "Vi hen (µH)",
      "capacitance": "điện dung",
      "capacitanceUnit": "đơn vị điện dung",
      "farads": "Farad (F)",
      "microfarads": "Microfarad (µF)",
      "nanofarads": "Nanofarad (nF)",
      "picofarads": "Picofarat (pF)",
      "frequency": "Tần suất đánh giá",
      "frequencyUnit": "Đơn vị tần số",
      "hertz": "Hertz (Hz)",
      "kilohertz": "Kilohertz (kHz)",
      "voltage": "Nguồn điện áp (V RMS)",
      "accuracyNote": "Chỉ có mô hình RLC tuyến tính, gộp lại lý tưởng. Chế độ song song có nghĩa là R, L và C đều song song. Nó bỏ qua dung sai, ký sinh, điện trở cuộn dây, trở kháng nguồn, các bộ phận phi tuyến, khớp nối tải và độ an toàn. Nó không chứng nhận một mạch thực hoặc các bộ phận chọn lọc. Kiểm tra bảng dữ liệu và tham khảo ý kiến ​​​​của chuyên gia có trình độ trước khi xây dựng hoặc sử dụng phần cứng thực. Chạy cục bộ; không tải lên.",
      "chartTitle": "Trở kháng trên tần số",
      "chartDescription": "Tần số quét log từ một phần mười đến mười lần tần số cộng hưởng. Đường cong biểu thị cường độ trở kháng lý tưởng cho cấu trúc liên kết nối tiếp hoặc song song đã chọn."
    },
    "actions": {
      "calculate": "Tính toán mạch RLC",
      "reset": "Cài lại",
      "copy": "Sao chép kết quả",
      "example": "Tải ví dụ",
      "result": "kết quả RLC"
    },
    "messages": {
      "copied": "Đã sao chép kết quả.",
      "copyUnavailable": "Bản sao không có sẵn trong trình duyệt này.",
      "calculated": "Ước tính RLC được tính toán.",
      "checkInputs": "Kiểm tra R, L, C, tần số, điện áp, cấu trúc liên kết và đơn vị.",
      "model": "Người mẫu",
      "resonance": "Tần số cộng hưởng",
      "qualityFactor": "Hệ số chất lượng (Q)",
      "bandwidth": "Băng thông gần đúng",
      "inductiveReactance": "Điện kháng cảm ứng (XL)",
      "capacitiveReactance": "Phản ứng điện dung (XC)",
      "complexImpedance": "Trở kháng phức tạp (R + jX)",
      "impedanceMagnitudePhase": "Độ lớn trở kháng/pha",
      "current": "Nguồn hiện tại (RMS lý tưởng)"
    },
    "additionalFaqs": [
      {
        "question": "Công thức tần số cộng hưởng là gì?",
        "answer": "Đối với một cuộn cảm lý tưởng L và tụ điện C, f₀ = 1/(2π√(LC)). Sử dụng henries và farad để thu được hertz. Điện trở thay đổi độ giảm chấn và Q, không phải công thức cộng hưởng LC lý tưởng này."
      },
      {
        "question": "Mạch RLC nối tiếp và song song khác nhau như thế nào?",
        "answer": "Khi cộng hưởng, một RLC nối tiếp lý tưởng có trở kháng tối thiểu bằng R; một RLC song song lý tưởng có trở kháng tối đa bằng R. Do đó, hành vi hiện tại và điện áp khác nhau mặc dù f₀ lý tưởng là như nhau."
      },
      {
        "question": "Q và băng thông được tính như thế nào?",
        "answer": "Đối với model nối tiếp, Q = ω₀L/R và băng thông là R/(2πL). Đối với mô hình song song, Q = R/(ω₀L) và băng thông là 1/(2πRC). Đây là những mối quan hệ cộng hưởng đơn lý tưởng."
      },
      {
        "question": "Mô hình này có bao gồm dung sai thành phần thực tế không?",
        "answer": "Không. Nó giả sử các thành phần R, L và C lý tưởng, tuyến tính, gộp lại. Ký sinh, điện trở cuộn dây cảm ứng, trở kháng nguồn, tải và biến đổi thành phần có thể làm dịch chuyển hoặc làm ẩm mạch thực."
      },
      {
        "question": "Máy tính này có thể chứng nhận một mạch là an toàn không?",
        "answer": "Không. Đây là ước tính mang tính giáo dục, không phải là phê duyệt thiết kế hoặc đánh giá an toàn. Xác nhận xếp hạng thành phần và hành vi trong thế giới thực bằng bảng dữ liệu và đánh giá kỹ thuật đủ tiêu chuẩn."
      }
    ]
  },
  "it": {
    "copyLanguage": "it",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Calcolatore del circuito RLC",
    "title": "Calcolatrice di circuiti RLC gratuita e | UsefulVerse",
    "description": "Trova risonanza RLC, Q, larghezza di banda e impedenza per circuiti in serie o in parallelo. Gratuito, locale e illimitato.",
    "intro": "Scegli un modello RLC in serie o parallelo, inserisci i valori dei componenti e ispeziona la risonanza più l'impedenza alla frequenza di tua scelta.",
    "howQuestion": "Come si calcola la risonanza RLC?",
    "howAnswer": "Per componenti concentrati ideali, la frequenza di risonanza è 1/(2π√(LC)). Il fattore di qualità e la larghezza di banda dipendono dal fatto che il resistore sia in serie o in parallelo. Questo calcolatore valuta anche l'impedenza complessa alla frequenza selezionata.",
    "privacyQuestion": "I valori del mio circuito sono caricati?",
    "privacyAnswer": "No. I calcoli e la curva di risposta vengono eseguiti in questo browser; i valori inseriti non vengono caricati o salvati.",
    "fields": {
      "topology": "Topologia del circuito",
      "series": "Serie RLC",
      "parallel": "RLC parallelo",
      "resistance": "Resistenza (Ω)",
      "inductance": "Induttanza",
      "inductanceUnit": "Unità di induttanza",
      "henries": "Henries (H)",
      "millihenries": "Millihenry (mH)",
      "microhenries": "Microhenry (μH)",
      "capacitance": "Capacità",
      "capacitanceUnit": "Unità di capacità",
      "farads": "Farad (F)",
      "microfarads": "Microfarad (μF)",
      "nanofarads": "Nanofarad (nF)",
      "picofarads": "Picofarad (pF)",
      "frequency": "Frequenza da valutare",
      "frequencyUnit": "Unità di frequenza",
      "hertz": "Hertz (Hz)",
      "kilohertz": "Kilohertz (kHz)",
      "voltage": "Tensione sorgente (V RMS)",
      "accuracyNote": "Solo modello RLC lineare, concentrato ideale. La modalità parallela significa che R, L e C sono tutti in parallelo. Ignora tolleranze, parassiti, resistenza della bobina, impedenza della sorgente, parti non lineari, accoppiamento del carico e sicurezza. Non certifica un circuito reale né seleziona parti. Controlla le schede tecniche e consulta un professionista qualificato prima di costruire o utilizzare hardware reale. Funziona localmente; nessun caricamento.",
      "chartTitle": "Impedenza attraverso la frequenza",
      "chartDescription": "Sweep di frequenza logaritmica da un decimo a dieci volte la frequenza di risonanza. La curva mostra l'ampiezza dell'impedenza ideale per la serie selezionata o la topologia parallela."
    },
    "actions": {
      "calculate": "Calcolare il circuito RLC",
      "reset": "Reset",
      "copy": "Copia i risultati",
      "example": "Carica esempio",
      "result": "Risultati RLC"
    },
    "messages": {
      "copied": "Risultati copiati.",
      "copyUnavailable": "La copia non è disponibile in questo browser.",
      "calculated": "Stima RLC calcolata.",
      "checkInputs": "Controllare R, L, C, frequenza, tensione, topologia e unità.",
      "model": "Modello",
      "resonance": "Frequenza di risonanza",
      "qualityFactor": "Fattore di qualità (Q)",
      "bandwidth": "Larghezza di banda approssimativa",
      "inductiveReactance": "Reattanza induttiva (XL)",
      "capacitiveReactance": "Reattanza capacitiva (XC)",
      "complexImpedance": "Impedenza complessa (R + jX)",
      "impedanceMagnitudePhase": "Magnitudo/fase dell'impedenza",
      "current": "Corrente sorgente (RMS ideale)"
    },
    "additionalFaqs": [
      {
        "question": "Qual è la formula della frequenza di risonanza?",
        "answer": "Per un induttore L ideale e un condensatore C, f₀ = 1/(2π√(LC)). Usa Henry e Farad per ottenere gli Hertz. Il resistore modifica lo smorzamento e Q, non questa formula di risonanza LC ideale."
      },
      {
        "question": "In cosa differiscono i circuiti RLC in serie e in parallelo?",
        "answer": "Alla risonanza, una serie ideale RLC ha un'impedenza minima pari a R; un RLC parallelo ideale ha un'impedenza massima pari a R. Il comportamento di corrente e tensione quindi differisce anche se f₀ ideale è lo stesso."
      },
      {
        "question": "Come vengono calcolati Q e larghezza di banda?",
        "answer": "Per il modello in serie, Q = ω₀L/R e la larghezza di banda è R/(2πL). Per il modello parallelo, Q = R/(ω₀L) e la larghezza di banda è 1/(2πRC). Queste sono relazioni ideali di risonanza singola."
      },
      {
        "question": "Questo modello include tolleranze reali dei componenti?",
        "answer": "No. Si presuppone componenti R, L e C ideali, lineari e concentrati. I parassiti, la resistenza dell'avvolgimento dell'induttore, l'impedenza della sorgente, il carico e la variazione dei componenti possono spostare o smorzare i circuiti reali."
      },
      {
        "question": "Questo calcolatore può certificare un circuito come sicuro?",
        "answer": "No. Si tratta di una stima educativa, non di un'approvazione del progetto o di una valutazione della sicurezza. Conferma le valutazioni dei componenti e il comportamento nel mondo reale con schede tecniche e revisioni tecniche qualificate."
      }
    ]
  },
  "zh_tw": {
    "copyLanguage": "zh_tw",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC 電路計算器",
    "title": "RLC 電路計算器免費且無限制 | UsefulVerse",
    "description": "尋找串聯或併聯電路的 RLC 諧振、Q、頻寬和阻抗。免費、本地且無限制。",
    "intro": "選擇串聯或併聯 RLC 模型，輸入元件值，並在您選擇的頻率下檢查諧振和阻抗。",
    "howQuestion": "如何計算 RLC 諧振？",
    "howAnswer": "對於理想的集總元件，諧振頻率為 1/(2π√(LC))。品質因數和頻寬取決於電阻是串聯還是並聯。此計算器還可以評估您選擇的頻率下的複阻抗。",
    "privacyQuestion": "我的電路值是否已上傳？",
    "privacyAnswer": "不。數學和回應曲線在此瀏覽器中運行；您輸入的值不會上傳或儲存。",
    "fields": {
      "topology": "電路拓撲",
      "series": "RLC系列",
      "parallel": "並行RLC",
      "resistance": "電阻（Ω）",
      "inductance": "電感",
      "inductanceUnit": "電感單位",
      "henries": "亨利 (H)",
      "millihenries": "毫亨 (mH)",
      "microhenries": "微亨 (µH)",
      "capacitance": "電容",
      "capacitanceUnit": "電容單位",
      "farads": "法拉 (F)",
      "microfarads": "微法 (μF)",
      "nanofarads": "納法 (nF)",
      "picofarads": "皮法 (pF)",
      "frequency": "評估頻率",
      "frequencyUnit": "頻率單位",
      "hertz": "赫茲 (Hz)",
      "kilohertz": "千赫茲 (kHz)",
      "voltage": "源電壓（V RMS）",
      "accuracyNote": "僅理想的集總線性 RLC 模型。並聯模式是指R、L、C全部並聯。它忽略了容差、寄生、線圈電阻、源阻抗、非線性部件、負載耦合和安全性。它不認證真實電路或選擇的部件。在建置或使用真實硬體之前，請檢查資料表並諮詢合格的專業人員。在本地運行；沒有上傳。",
      "chartTitle": "跨頻率阻抗",
      "chartDescription": "對數頻率掃描為諧振頻率的十分之一到十倍。此曲線顯示了所選串聯或併聯拓撲的理想阻抗大小。"
    },
    "actions": {
      "calculate": "計算RLC電路",
      "reset": "重置",
      "copy": "複製結果",
      "example": "負載範例",
      "result": "RLC結果"
    },
    "messages": {
      "copied": "結果已複製。",
      "copyUnavailable": "複製在此瀏覽器中不可用。",
      "calculated": "已計算 RLC 估計值。",
      "checkInputs": "檢查 R、L、C、頻率、電壓、拓樸和單位。",
      "model": "模型",
      "resonance": "諧振頻率",
      "qualityFactor": "品質因數 (Q)",
      "bandwidth": "大約頻寬",
      "inductiveReactance": "感抗（XL）",
      "capacitiveReactance": "容抗(XC)",
      "complexImpedance": "複數阻抗 (R + jX)",
      "impedanceMagnitudePhase": "阻抗幅值/相位",
      "current": "源電流（理想 RMS）"
    },
    "additionalFaqs": [
      {
        "question": "諧振頻率公式是什麼？",
        "answer": "對於理想的感應器 L 和電容器 C，f₀ = 1/(2π√(LC))。使用亨利和法拉獲得赫茲。電阻改變阻尼和 Q，而不是這個理想的 LC 諧振公式。"
      },
      {
        "question": "串聯和並聯 RLC 電路有何不同？",
        "answer": "在諧振時，理想串聯 RLC 的最小阻抗等於 R；理想的並聯 RLC 的最大阻抗等於 R。因此，即使理想的 f₀ 相同，電流和電壓行為也會有所不同。"
      },
      {
        "question": "Q和頻寬是如何計算的？",
        "answer": "對於串聯模型，Q = ω₀L/R，頻寬為 R/(2πL)。對於平行模型，Q = R/(ω₀L)，頻寬為 1/(2πRC)。這些是理想的單一共振關係。"
      },
      {
        "question": "該模型是否包含真實的組件公差？",
        "answer": "不會。它假設理想的、線性的、集總的 R、L 和 C 分量。寄生效應、電感器繞組電阻、源阻抗、負載和元件變化可能會改變或抑制實際電路。"
      },
      {
        "question": "此計算器可以證明電路安全嗎？",
        "answer": "不。這是教育評估，而不是設計批准或安全評估。透過數據表和合格的工程審查來確認組件評級和實際行為。"
      }
    ]
  },
  "bg": {
    "copyLanguage": "bg",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC верижен калкулатор",
    "title": "RLC Circuit Calculator Безплатен и | UsefulVerse",
    "description": "Намерете RLC резонанс, Q, честотна лента и импеданс за серийни или паралелни вериги. Безплатно, местно и неограничено.",
    "intro": "Изберете сериен или паралелен RLC модел, въведете стойности на компонентите и проверете резонанс плюс импеданс на честота, която изберете.",
    "howQuestion": "Как изчислявате RLC резонанса?",
    "howAnswer": "За идеални групирани компоненти резонансната честота е 1/(2π√(LC)). Коефициентът на качество и честотната лента зависят от това дали резисторът е последователно или паралелно. Този калкулатор също така оценява комплексния импеданс при избраната от вас честота.",
    "privacyQuestion": "Качени ли са моите стойности на веригата?",
    "privacyAnswer": "Не. Математическите изчисления и кривата на отговора се изпълняват в този браузър; въведените от вас стойности не се качват или запазват.",
    "fields": {
      "topology": "Топология на веригата",
      "series": "Серия RLC",
      "parallel": "Паралелен RLC",
      "resistance": "Съпротивление (Ω)",
      "inductance": "Индуктивност",
      "inductanceUnit": "Индуктивна единица",
      "henries": "Хенрис (H)",
      "millihenries": "милихенри (mH)",
      "microhenries": "Микрохенри (µH)",
      "capacitance": "Капацитет",
      "capacitanceUnit": "Единица за капацитет",
      "farads": "Фаради (F)",
      "microfarads": "Микрофаради (µF)",
      "nanofarads": "Нанофаради (nF)",
      "picofarads": "Пикофаради (pF)",
      "frequency": "Честота за оценка",
      "frequencyUnit": "Единица за честота",
      "hertz": "Херц (Hz)",
      "kilohertz": "килохерци (kHz)",
      "voltage": "Напрежение на източника (V RMS)",
      "accuracyNote": "Само идеален групиран, линеен RLC модел. Паралелен режим означава, че всички R, L и C са паралелни. Той пренебрегва допуски, паразити, съпротивление на бобината, импеданс на източника, нелинейни части, свързване на товара и безопасност. Той не удостоверява реална верига или избрани части. Проверете таблиците с данни и се консултирайте с квалифициран специалист, преди да изградите или използвате истински хардуер. Работи локално; няма качване.",
      "chartTitle": "Импеданс на честота",
      "chartDescription": "Промяна на логаритмичната честота от една десета до десет пъти резонансната честота. Кривата показва идеалната величина на импеданса за избраната серийна или паралелна топология."
    },
    "actions": {
      "calculate": "Изчислете RLC верига",
      "reset": "Нулиране",
      "copy": "Копиране на резултатите",
      "example": "Пример за натоварване",
      "result": "RLC резултати"
    },
    "messages": {
      "copied": "Резултатите са копирани.",
      "copyUnavailable": "Копирането не е налично в този браузър.",
      "calculated": "RLC оценка е изчислена.",
      "checkInputs": "Проверете R, L, C, честота, напрежение, топология и единици.",
      "model": "Модел",
      "resonance": "Резонансна честота",
      "qualityFactor": "Качествен фактор (Q)",
      "bandwidth": "Приблизителна честотна лента",
      "inductiveReactance": "Индуктивно съпротивление (XL)",
      "capacitiveReactance": "Капацитивно съпротивление (XC)",
      "complexImpedance": "Комплексен импеданс (R + jX)",
      "impedanceMagnitudePhase": "Величина / фаза на импеданса",
      "current": "Ток на източника (идеална RMS)"
    },
    "additionalFaqs": [
      {
        "question": "Каква е формулата за резонансната честота?",
        "answer": "За идеален индуктор L и кондензатор C, f₀ = 1/(2π√(LC)). Използвайте хенри и фаради, за да получите херцове. Резисторът променя затихването и Q, а не тази идеална LC резонансна формула."
      },
      {
        "question": "Как се различават серийните и паралелните RLC вериги?",
        "answer": "При резонанс идеалната серия RLC има минимален импеданс равен на R; идеален паралелен RLC има максимален импеданс, равен на R. Следователно поведението на тока и напрежението се различава, въпреки че идеалното f₀ е същото."
      },
      {
        "question": "Как се изчисляват Q и честотната лента?",
        "answer": "За серийния модел Q = ω₀L/R и честотната лента е R/(2πL). За паралелния модел Q = R/(ω₀L) и честотната лента е 1/(2πRC). Това са идеални връзки с единичен резонанс."
      },
      {
        "question": "Този модел включва ли реални толеранси на компонентите?",
        "answer": "Не. Предполага идеални, линейни, групирани R, L и C компоненти. Паразитите, съпротивлението на намотката на индуктора, импедансът на източника, натоварването и вариациите на компонентите могат да изместят или овлажнят реални вериги."
      },
      {
        "question": "Може ли този калкулатор да удостовери верига като безопасна?",
        "answer": "Не. Това е образователна оценка, а не одобрение на дизайн или оценка на безопасността. Потвърдете оценките на компонентите и поведението в реалния свят с листове с данни и квалифициран инженерен преглед."
      }
    ]
  },
  "ca": {
    "copyLanguage": "ca",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Calculadora de circuits RLC",
    "title": "Calculadora de circuits RLC gratuïta i | UsefulVerse",
    "description": "Trobeu la ressonància RLC, Q, ample de banda i impedància per a circuits en sèrie o paral·lel. Gratuït, local i il·limitat.",
    "intro": "Trieu un model RLC en sèrie o paral·lel, introduïu els valors dels components i inspeccioneu la ressonància més la impedància a la freqüència que trieu.",
    "howQuestion": "Com es calcula la ressonància RLC?",
    "howAnswer": "Per als components aglutinats ideals, la freqüència de ressonància és 1/(2π√(LC)). El factor de qualitat i l'amplada de banda depenen de si la resistència està en sèrie o en paral·lel. Aquesta calculadora també avalua la impedància complexa a la freqüència seleccionada.",
    "privacyQuestion": "S'han penjat els valors del meu circuit?",
    "privacyAnswer": "No. Les matemàtiques i la corba de resposta s'executen en aquest navegador; els valors introduïts no es pengen ni es desaran.",
    "fields": {
      "topology": "Topologia de circuits",
      "series": "Sèrie RLC",
      "parallel": "RLC paral·lel",
      "resistance": "Resistència (Ω)",
      "inductance": "Inductància",
      "inductanceUnit": "Unitat d'inductància",
      "henries": "Henries (H)",
      "millihenries": "Millenries (mH)",
      "microhenries": "Microhenries (µH)",
      "capacitance": "Capacitat",
      "capacitanceUnit": "Unitat de capacitat",
      "farads": "Farads (F)",
      "microfarads": "Microfarads (µF)",
      "nanofarads": "Nanofarads (nF)",
      "picofarads": "Picofarads (pF)",
      "frequency": "Freqüència a avaluar",
      "frequencyUnit": "Unitat de freqüència",
      "hertz": "Hertz (Hz)",
      "kilohertz": "Kilohertz (kHz)",
      "voltage": "Tensió de la font (V RMS)",
      "accuracyNote": "Només model RLC lineal i agrupat ideal. El mode paral·lel significa que R, L i C estan tots en paral·lel. Ignora les toleràncies, els paràsits, la resistència de la bobina, la impedància de la font, les peces no lineals, l'acoblament de càrrega i la seguretat. No certifica un circuit real ni selecciona peces. Consulteu les fitxes i consulteu un professional qualificat abans de construir o utilitzar maquinari real. Funciona localment; sense càrrega.",
      "chartTitle": "Impedància a través de la freqüència",
      "chartDescription": "Escombrat de freqüència logarítmica d'una dècima a deu vegades la freqüència de ressonància. La corba mostra la magnitud d'impedància ideal per a la topologia en sèrie o paral·lela seleccionada."
    },
    "actions": {
      "calculate": "Calcula el circuit RLC",
      "reset": "Restableix",
      "copy": "Copia els resultats",
      "example": "Exemple de càrrega",
      "result": "Resultats RLC"
    },
    "messages": {
      "copied": "S'han copiat els resultats.",
      "copyUnavailable": "La còpia no està disponible en aquest navegador.",
      "calculated": "Estimació RLC calculada.",
      "checkInputs": "Comproveu R, L, C, freqüència, tensió, topologia i unitats.",
      "model": "Model",
      "resonance": "Freqüència de ressonància",
      "qualityFactor": "Factor de qualitat (Q)",
      "bandwidth": "Ample de banda aproximat",
      "inductiveReactance": "reactància inductiva (XL)",
      "capacitiveReactance": "reactància capacitiva (XC)",
      "complexImpedance": "Impedància complexa (R + jX)",
      "impedanceMagnitudePhase": "Impedància magnitud / fase",
      "current": "Font de corrent (RMS ideal)"
    },
    "additionalFaqs": [
      {
        "question": "Quina és la fórmula de la freqüència de ressonància?",
        "answer": "Per a un inductor L ideal i un condensador C, f₀ = 1/(2π√(LC)). Utilitzeu henries i farads per obtenir hertz. La resistència canvia l'amortiment i la Q, no aquesta fórmula de ressonància LC ideal."
      },
      {
        "question": "Com es diferencien els circuits RLC en sèrie i en paral·lel?",
        "answer": "A la ressonància, una sèrie ideal RLC té una impedància mínima igual a R; un RLC paral·lel ideal té una impedància màxima igual a R. Per tant, el comportament de corrent i tensió difereix encara que f₀ ideal sigui el mateix."
      },
      {
        "question": "Com es calculen la Q i l'amplada de banda?",
        "answer": "Per al model de sèrie, Q = ω₀L/R i l'amplada de banda és R/(2πL). Per al model paral·lel, Q = R/(ω₀L) i l'amplada de banda és 1/(2πRC). Aquestes són relacions ideals d'una sola ressonància."
      },
      {
        "question": "Aquest model inclou toleràncies reals dels components?",
        "answer": "No. Suposa components R, L i C ideals, lineals i agrupats. Els paràsits, la resistència del bobinat de l'inductor, la impedància de la font, la càrrega i la variació dels components poden desplaçar o humitejar els circuits reals."
      },
      {
        "question": "Aquesta calculadora pot certificar un circuit com a segur?",
        "answer": "No. És una estimació educativa, no una aprovació del disseny o una avaluació de seguretat. Confirmeu les classificacions dels components i el comportament del món real amb fulls de dades i revisió d'enginyeria qualificada."
      }
    ]
  },
  "nl": {
    "copyLanguage": "nl",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC-circuitcalculator",
    "title": "RLC-circuitcalculator gratis en onbeperkt | UsefulVerse",
    "description": "Vind RLC-resonantie, Q, bandbreedte en impedantie voor serie- of parallelle circuits. Gratis, lokaal en onbeperkt.",
    "intro": "Kies een serieel of parallel RLC-model, voer componentwaarden in en inspecteer de resonantie plus impedantie bij een door u gekozen frequentie.",
    "howQuestion": "Hoe bereken je RLC-resonantie?",
    "howAnswer": "Voor ideale samengevoegde componenten is de resonantiefrequentie 1/(2π√(LC)). Kwaliteitsfactor en bandbreedte zijn afhankelijk van het feit of de weerstand in serie of parallel staat. Deze rekenmachine evalueert ook de complexe impedantie op de door u geselecteerde frequentie.",
    "privacyQuestion": "Worden mijn circuitwaarden geüpload?",
    "privacyAnswer": "Nee. De wiskunde- en responscurve worden in deze browser uitgevoerd; uw ingevoerde waarden worden niet geüpload of opgeslagen.",
    "fields": {
      "topology": "Circuittopologie",
      "series": "Serie RLC",
      "parallel": "Parallelle RLC",
      "resistance": "Weerstand (Ω)",
      "inductance": "Inductie",
      "inductanceUnit": "Inductie-eenheid",
      "henries": "Henriës (H)",
      "millihenries": "Millihenries (mH)",
      "microhenries": "Microhenries (uH)",
      "capacitance": "Capaciteit",
      "capacitanceUnit": "Capaciteit eenheid",
      "farads": "Farad (V)",
      "microfarads": "Microfarad (μF)",
      "nanofarads": "Nanofarad (nF)",
      "picofarads": "Picofarads (pF)",
      "frequency": "Frequentie om te evalueren",
      "frequencyUnit": "Frequentie-eenheid",
      "hertz": "Hertz (Hz)",
      "kilohertz": "Kilohertz (kHz)",
      "voltage": "Bronspanning (V RMS)",
      "accuracyNote": "Alleen ideaal samengevoegd, lineair RLC-model. Parallelle modus betekent dat R, L en C allemaal parallel zijn. Het negeert toleranties, parasitaire factoren, spoelweerstand, bronimpedantie, niet-lineaire onderdelen, belastingkoppeling en veiligheid. Het certificeert geen echt circuit of selecteert geen onderdelen. Controleer de datasheets en raadpleeg een gekwalificeerde professional voordat u echte hardware bouwt of gebruikt. Draait lokaal; geen upload.",
      "chartTitle": "Impedantie over de frequentie",
      "chartDescription": "Log-frequentiebereik van een tiende tot tien keer de resonantiefrequentie. De curve toont de ideale impedantiegrootte voor de geselecteerde serie- of parallelle topologie."
    },
    "actions": {
      "calculate": "Bereken het RLC-circuit",
      "reset": "Opnieuw instellen",
      "copy": "Kopieer resultaten",
      "example": "Voorbeeld laden",
      "result": "RLC-resultaten"
    },
    "messages": {
      "copied": "Resultaten gekopieerd.",
      "copyUnavailable": "Kopiëren is niet beschikbaar in deze browser.",
      "calculated": "RLC-schatting berekend.",
      "checkInputs": "Controleer R, L, C, frequentie, spanning, topologie en eenheden.",
      "model": "Model",
      "resonance": "Resonante frequentie",
      "qualityFactor": "Kwaliteitsfactor (Q)",
      "bandwidth": "Geschatte bandbreedte",
      "inductiveReactance": "Inductieve reactantie (XL)",
      "capacitiveReactance": "Capacitieve reactantie (XC)",
      "complexImpedance": "Complexe impedantie (R + jX)",
      "impedanceMagnitudePhase": "Impedantiegrootte / fase",
      "current": "Bronstroom (ideaal RMS)"
    },
    "additionalFaqs": [
      {
        "question": "Wat is de resonantiefrequentieformule?",
        "answer": "Voor een ideale inductor L en condensator C geldt f₀ = 1/(2π√(LC)). Gebruik henries en farads om hertz te verkrijgen. De weerstand verandert de demping en Q, niet deze ideale LC-resonantieformule."
      },
      {
        "question": "Hoe verschillen serie- en parallelle RLC-circuits?",
        "answer": "Bij resonantie heeft een ideale serie RLC een minimale impedantie gelijk aan R; een ideale parallelle RLC heeft een maximale impedantie gelijk aan R. Stroom- en spanningsgedrag verschillen daarom, ook al is ideale f₀ hetzelfde."
      },
      {
        "question": "Hoe worden Q en bandbreedte berekend?",
        "answer": "Voor het seriemodel geldt Q = ω₀L/R en de bandbreedte is R/(2πL). Voor het parallelle model geldt Q = R/(ω₀L) en de bandbreedte is 1/(2πRC). Dit zijn ideale single-resonantierelaties."
      },
      {
        "question": "Bevat dit model echte componenttoleranties?",
        "answer": "Nee. Er wordt uitgegaan van ideale, lineaire, samengevoegde R-, L- en C-componenten. Parasieten, weerstand van de inductorwikkeling, bronimpedantie, belasting en componentvariatie kunnen echte circuits verschuiven of dempen."
      },
      {
        "question": "Kan deze rekenmachine een circuit als veilig certificeren?",
        "answer": "Nee. Het is een educatieve schatting, geen ontwerpgoedkeuring of veiligheidsbeoordeling. Bevestig componentbeoordelingen en gedrag in de praktijk met datasheets en gekwalificeerde technische beoordeling."
      }
    ]
  },
  "el": {
    "copyLanguage": "el",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Υπολογιστής κυκλώματος RLC",
    "title": "Υπολογιστής κυκλώματος RLC Δωρεάν & | UsefulVerse",
    "description": "Βρείτε συντονισμό RLC, Q, εύρος ζώνης και σύνθετη αντίσταση για σειρές ή παράλληλα κυκλώματα. Δωρεάν, τοπικό και απεριόριστο.",
    "intro": "Επιλέξτε ένα σειριακό ή παράλληλο μοντέλο RLC, εισαγάγετε τιμές εξαρτημάτων και επιθεωρήστε συντονισμό συν σύνθετη αντίσταση σε συχνότητα που επιλέγετε.",
    "howQuestion": "Πώς υπολογίζετε τον συντονισμό RLC;",
    "howAnswer": "Για ιδανικά συμπαγή εξαρτήματα, η συχνότητα συντονισμού είναι 1/(2π√(LC)). Ο παράγοντας ποιότητας και το εύρος ζώνης εξαρτώνται από το αν η αντίσταση είναι σε σειρά ή παράλληλη. Αυτή η αριθμομηχανή αξιολογεί επίσης την σύνθετη αντίσταση στην επιλεγμένη συχνότητα.",
    "privacyQuestion": "Έχουν μεταφορτωθεί οι τιμές του κυκλώματος μου;",
    "privacyAnswer": "Όχι. Η καμπύλη μαθηματικών και απόκρισης εκτελείται σε αυτό το πρόγραμμα περιήγησης. Οι τιμές που εισαγάγατε δεν μεταφορτώνονται ούτε αποθηκεύονται.",
    "fields": {
      "topology": "Τοπολογία κυκλώματος",
      "series": "Σειρά RLC",
      "parallel": "Παράλληλη RLC",
      "resistance": "Αντίσταση (Ω)",
      "inductance": "Επαγωγή",
      "inductanceUnit": "Μονάδα επαγωγής",
      "henries": "Χένρις (Η)",
      "millihenries": "Millihenries (mH)",
      "microhenries": "Microhenries (μH)",
      "capacitance": "Χωρητικότητα",
      "capacitanceUnit": "Μονάδα χωρητικότητας",
      "farads": "Farads (F)",
      "microfarads": "Μικροφαράδες (μF)",
      "nanofarads": "Nanofarads (nF)",
      "picofarads": "Picofarads (pF)",
      "frequency": "Συχνότητα αξιολόγησης",
      "frequencyUnit": "Μονάδα συχνότητας",
      "hertz": "Hertz (Hz)",
      "kilohertz": "Kilohertz (kHz)",
      "voltage": "Τάση πηγής (V RMS)",
      "accuracyNote": "Ιδανικό ομαδοποιημένο, γραμμικό μοντέλο RLC μόνο. Παράλληλη λειτουργία σημαίνει ότι τα R, L και C είναι όλα παράλληλα. Αγνοεί τις ανοχές, τα παρασιτικά, την αντίσταση πηνίου, την αντίσταση πηγής, τα μη γραμμικά μέρη, τη σύζευξη φορτίου και την ασφάλεια. Δεν πιστοποιεί πραγματικό κύκλωμα ή επιλεγμένα εξαρτήματα. Ελέγξτε τα φύλλα δεδομένων και συμβουλευτείτε έναν εξειδικευμένο επαγγελματία πριν κατασκευάσετε ή χρησιμοποιήσετε πραγματικό υλικό. Εκτελείται τοπικά. χωρίς μεταφόρτωση.",
      "chartTitle": "Αντίσταση σε όλη τη συχνότητα",
      "chartDescription": "Σάρωση log-frequency από το ένα δέκατο σε δέκα φορές τη συχνότητα συντονισμού. Η καμπύλη δείχνει ιδανικό μέγεθος αντίστασης για την επιλεγμένη σειρά ή παράλληλη τοπολογία."
    },
    "actions": {
      "calculate": "Υπολογίστε το κύκλωμα RLC",
      "reset": "Επαναφορά",
      "copy": "Αντιγραφή αποτελεσμάτων",
      "example": "Παράδειγμα φόρτωσης",
      "result": "Αποτελέσματα RLC"
    },
    "messages": {
      "copied": "Τα αποτελέσματα αντιγράφηκαν.",
      "copyUnavailable": "Το αντίγραφο δεν είναι διαθέσιμο σε αυτό το πρόγραμμα περιήγησης.",
      "calculated": "Υπολογίστηκε εκτίμηση RLC.",
      "checkInputs": "Ελέγξτε τα R, L, C, τη συχνότητα, την τάση, την τοπολογία και τις μονάδες.",
      "model": "Μοντέλο",
      "resonance": "Συχνότητα συντονισμού",
      "qualityFactor": "Συντελεστής ποιότητας (Q)",
      "bandwidth": "Εύρος ζώνης κατά προσέγγιση",
      "inductiveReactance": "Επαγωγική αντίδραση (XL)",
      "capacitiveReactance": "Χωρητική αντίδραση (XC)",
      "complexImpedance": "Σύνθετη αντίσταση (R + jX)",
      "impedanceMagnitudePhase": "Μέγεθος σύνθετης αντίστασης / φάση",
      "current": "Ρεύμα πηγής (ιδανικό RMS)"
    },
    "additionalFaqs": [
      {
        "question": "Τι είναι ο τύπος συχνότητας συντονισμού;",
        "answer": "Για έναν ιδανικό επαγωγέα L και πυκνωτή C, f0 = 1/(2π√(LC)). Χρησιμοποιήστε henries και farads για να αποκτήσετε Hertz. Η αντίσταση αλλάζει την απόσβεση και το Q, όχι αυτή την ιδανική φόρμουλα συντονισμού LC."
      },
      {
        "question": "Πώς διαφέρουν τα σειριακά και τα παράλληλα κυκλώματα RLC;",
        "answer": "Στον συντονισμό, μια ιδανική σειρά RLC έχει ελάχιστη αντίσταση ίση με R; ένα ιδανικό παράλληλο RLC έχει μέγιστη σύνθετη αντίσταση ίση με το R. Επομένως, η συμπεριφορά ρεύματος και τάσης διαφέρουν ακόμη και αν το ιδανικό f0 είναι το ίδιο."
      },
      {
        "question": "Πώς υπολογίζεται το Q και το εύρος ζώνης;",
        "answer": "Για το μοντέλο σειράς, Q = ω₀L/R και το εύρος ζώνης είναι R/(2πL). Για το παράλληλο μοντέλο, Q = R/(ω₀L) και το εύρος ζώνης είναι 1/(2πRC). Αυτές είναι ιδανικές σχέσεις μονής αντήχησης."
      },
      {
        "question": "Περιλαμβάνει αυτό το μοντέλο πραγματικές ανοχές εξαρτημάτων;",
        "answer": "Όχι. Υποθέτει ιδανικά, γραμμικά, ομαδοποιημένα στοιχεία R, L και C. Τα παρασιτικά, η αντίσταση περιέλιξης του επαγωγέα, η σύνθετη αντίσταση πηγής, η φόρτιση και η διακύμανση των εξαρτημάτων μπορούν να μετατοπίσουν ή να σβήσουν τα πραγματικά κυκλώματα."
      },
      {
        "question": "Μπορεί αυτή η αριθμομηχανή να πιστοποιήσει ένα κύκλωμα ως ασφαλές;",
        "answer": "Όχι. Είναι μια εκπαιδευτική εκτίμηση, όχι μια έγκριση σχεδιασμού ή αξιολόγηση ασφάλειας. Επιβεβαιώστε τις αξιολογήσεις εξαρτημάτων και τη συμπεριφορά του πραγματικού κόσμου με φύλλα δεδομένων και πιστοποιημένη αναθεώρηση μηχανικής."
      }
    ]
  },
  "ms": {
    "copyLanguage": "ms",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Kalkulator Litar RLC",
    "title": "Kalkulator Litar RLC Percuma & Tanpa Had | UsefulVerse",
    "description": "Cari resonans RLC, Q, lebar jalur dan galangan untuk litar siri atau selari. Percuma, tempatan dan tidak terhad.",
    "intro": "Pilih model RLC siri atau selari, masukkan nilai komponen dan periksa resonans serta impedans pada frekuensi yang anda pilih.",
    "howQuestion": "Bagaimana anda mengira resonans RLC?",
    "howAnswer": "Untuk komponen terkumpul yang ideal, frekuensi resonan ialah 1/(2π√(LC)). Faktor kualiti dan lebar jalur bergantung kepada sama ada perintang berada dalam siri atau selari. Kalkulator ini juga menilai impedans kompleks pada frekuensi yang anda pilih.",
    "privacyQuestion": "Adakah nilai litar saya dimuat naik?",
    "privacyAnswer": "Tidak. Keluk matematik dan tindak balas dijalankan dalam penyemak imbas ini; nilai yang anda masukkan tidak dimuat naik atau disimpan.",
    "fields": {
      "topology": "Topologi litar",
      "series": "Siri RLC",
      "parallel": "RLC selari",
      "resistance": "Rintangan (Ω)",
      "inductance": "Kearuhan",
      "inductanceUnit": "Unit kearuhan",
      "henries": "Henry (H)",
      "millihenries": "Millihenries (mH)",
      "microhenries": "Microhenries (µH)",
      "capacitance": "Kapasitansi",
      "capacitanceUnit": "Unit kapasiti",
      "farads": "Farads (F)",
      "microfarads": "Mikrofarad (µF)",
      "nanofarads": "Nanofarad (nF)",
      "picofarads": "Picofarads (pF)",
      "frequency": "Kekerapan untuk menilai",
      "frequencyUnit": "Unit kekerapan",
      "hertz": "Hertz (Hz)",
      "kilohertz": "Kilohertz (kHz)",
      "voltage": "Voltan sumber (V RMS)",
      "accuracyNote": "Model RLC linear bergumpal yang ideal sahaja. Mod selari bermakna R, L dan C semuanya selari. Ia mengabaikan toleransi, parasitik, rintangan gegelung, galangan sumber, bahagian tak linear, gandingan beban dan keselamatan. Ia tidak memperakui litar sebenar atau memilih bahagian. Semak lembaran data dan berunding dengan profesional yang berkelayakan sebelum membina atau menggunakan perkakasan sebenar. Berjalan secara tempatan; tiada muat naik.",
      "chartTitle": "Impedans merentasi frekuensi",
      "chartDescription": "Sapuan frekuensi log dari satu persepuluh hingga sepuluh kali ganda frekuensi resonans. Lengkung menunjukkan magnitud impedans yang ideal untuk siri yang dipilih atau topologi selari."
    },
    "actions": {
      "calculate": "Kira litar RLC",
      "reset": "Tetapkan semula",
      "copy": "Salin keputusan",
      "example": "Muatkan contoh",
      "result": "keputusan RLC"
    },
    "messages": {
      "copied": "Keputusan disalin.",
      "copyUnavailable": "Salinan tidak tersedia dalam penyemak imbas ini.",
      "calculated": "Anggaran RLC dikira.",
      "checkInputs": "Semak R, L, C, frekuensi, voltan, topologi dan unit.",
      "model": "Model",
      "resonance": "Kekerapan resonans",
      "qualityFactor": "Faktor kualiti (Q)",
      "bandwidth": "Anggaran lebar jalur",
      "inductiveReactance": "Reaktans induktif (XL)",
      "capacitiveReactance": "Tindak balas kapasitif (XC)",
      "complexImpedance": "Impedans kompleks (R + jX)",
      "impedanceMagnitudePhase": "Magnitud / fasa impedans",
      "current": "Sumber semasa (RMS ideal)"
    },
    "additionalFaqs": [
      {
        "question": "Apakah formula frekuensi resonans?",
        "answer": "Untuk induktor L dan kapasitor C yang ideal, f₀ = 1/(2π√(LC)). Gunakan henry dan farad untuk mendapatkan hertz. Perintang menukar redaman dan Q, bukan formula resonans LC yang ideal ini."
      },
      {
        "question": "Bagaimanakah litar RLC siri dan selari berbeza?",
        "answer": "Pada resonans, RLC siri ideal mempunyai impedans minimum sama dengan R; RLC selari ideal mempunyai impedans maksimum sama dengan R. Oleh itu kelakuan arus dan voltan berbeza walaupun f₀ ideal adalah sama."
      },
      {
        "question": "Bagaimanakah Q dan lebar jalur dikira?",
        "answer": "Untuk model siri, Q = ω₀L/R dan lebar jalur ialah R/(2πL). Untuk model selari, Q = R/(ω₀L) dan lebar jalur ialah 1/(2πRC). Ini adalah hubungan resonans tunggal yang ideal."
      },
      {
        "question": "Adakah model ini termasuk toleransi komponen sebenar?",
        "answer": "Tidak. Ia menganggap komponen R, L dan C yang ideal, linear, bergumpal. Parasit, rintangan belitan induktor, impedans sumber, pemuatan dan variasi komponen boleh menganjak atau melembapkan litar sebenar."
      },
      {
        "question": "Bolehkah kalkulator ini mengesahkan litar sebagai selamat?",
        "answer": "Tidak. Ia adalah anggaran pendidikan, bukan kelulusan reka bentuk atau penilaian keselamatan. Sahkan penilaian komponen dan tingkah laku dunia sebenar dengan lembaran data dan semakan kejuruteraan yang berkelayakan."
      }
    ]
  },
  "pl": {
    "copyLanguage": "pl",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Kalkulator obwodu RLC",
    "title": "Kalkulator obwodów RLC Darmowy i | UsefulVerse",
    "description": "Znajdź rezonans RLC, Q, szerokość pasma i impedancję dla obwodów szeregowych lub równoległych. Bezpłatnie, lokalnie i bez ograniczeń.",
    "intro": "Wybierz szeregowy lub równoległy model RLC, wprowadź wartości komponentów i sprawdź rezonans i impedancję przy wybranej częstotliwości.",
    "howQuestion": "Jak obliczyć rezonans RLC?",
    "howAnswer": "W przypadku idealnych elementów skupionych częstotliwość rezonansowa wynosi 1/(2π√(LC)). Współczynnik jakości i szerokość pasma zależą od tego, czy rezystor jest podłączony szeregowo, czy równolegle. Kalkulator ten ocenia również złożoną impedancję przy wybranej częstotliwości.",
    "privacyQuestion": "Czy wartości mojego obwodu zostały przesłane?",
    "privacyAnswer": "Nie. Krzywa matematyczna i odpowiedzi działają w tej przeglądarce; wprowadzone wartości nie zostaną przesłane ani zapisane.",
    "fields": {
      "topology": "Topologia obwodu",
      "series": "Seria RLC",
      "parallel": "Równoległy RLC",
      "resistance": "Rezystancja (Ω)",
      "inductance": "Indukcyjność",
      "inductanceUnit": "Jednostka indukcyjności",
      "henries": "Henryk (H)",
      "millihenries": "Millihenry (mH)",
      "microhenries": "Mikrohenrowie (µH)",
      "capacitance": "Pojemność",
      "capacitanceUnit": "Jednostka pojemności",
      "farads": "Farady (F)",
      "microfarads": "Mikrofarady (µF)",
      "nanofarads": "Nanofarady (nF)",
      "picofarads": "Pikofarady (pF)",
      "frequency": "Częstotliwość do oceny",
      "frequencyUnit": "Jednostka częstotliwości",
      "hertz": "Herc (Hz)",
      "kilohertz": "Kiloherc (kHz)",
      "voltage": "Napięcie źródła (V RMS)",
      "accuracyNote": "Tylko idealny, skupiony, liniowy model RLC. Tryb równoległy oznacza, że ​​R, L i C są równoległe. Ignoruje tolerancje, zjawiska pasożytnicze, rezystancję cewki, impedancję źródła, części nieliniowe, sprzężenie obciążenia i bezpieczeństwo. Nie certyfikuje rzeczywistego obwodu ani wybranych części. Przed zbudowaniem lub użyciem prawdziwego sprzętu sprawdź arkusze danych i skonsultuj się z wykwalifikowanym specjalistą. Działa lokalnie; brak przesyłania.",
      "chartTitle": "Impedancja w poprzek częstotliwości",
      "chartDescription": "Przemiatanie częstotliwości logarytmicznej od jednej dziesiątej do dziesięciu razy częstotliwości rezonansowej. Krzywa pokazuje idealną wielkość impedancji dla wybranej topologii szeregowej lub równoległej."
    },
    "actions": {
      "calculate": "Oblicz obwód RLC",
      "reset": "Nastawić",
      "copy": "Skopiuj wyniki",
      "example": "Załaduj przykład",
      "result": "Wyniki RLC"
    },
    "messages": {
      "copied": "Wyniki skopiowane.",
      "copyUnavailable": "Kopia nie jest dostępna w tej przeglądarce.",
      "calculated": "Obliczono oszacowanie RLC.",
      "checkInputs": "Sprawdź R, L, C, częstotliwość, napięcie, topologię i jednostki.",
      "model": "Model",
      "resonance": "Częstotliwość rezonansowa",
      "qualityFactor": "Współczynnik jakości (Q)",
      "bandwidth": "Przybliżona szerokość pasma",
      "inductiveReactance": "Reaktancja indukcyjna (XL)",
      "capacitiveReactance": "Reaktancja pojemnościowa (XC)",
      "complexImpedance": "Złożona impedancja (R + jX)",
      "impedanceMagnitudePhase": "Wielkość/faza impedancji",
      "current": "Prąd źródła (idealny RMS)"
    },
    "additionalFaqs": [
      {
        "question": "Jaki jest wzór na częstotliwość rezonansową?",
        "answer": "Dla idealnej cewki indukcyjnej L i kondensatora C f₀ = 1/(2π√(LC)). Aby uzyskać herc, użyj henrów i faradów. Rezystor zmienia tłumienie i Q, a nie ten idealny wzór rezonansu LC."
      },
      {
        "question": "Czym różnią się szeregowe i równoległe obwody RLC?",
        "answer": "W rezonansie idealna seria RLC ma minimalną impedancję równą R; idealny równoległy RLC ma maksymalną impedancję równą R. Dlatego zachowanie prądu i napięcia różni się, mimo że idealne f₀ jest takie samo."
      },
      {
        "question": "Jak obliczana jest Q i przepustowość?",
        "answer": "Dla modelu szeregowego Q = ω₀L/R, a szerokość pasma wynosi R/(2πL). Dla modelu równoległego Q = R/(ω₀L), a szerokość pasma wynosi 1/(2πRC). Są to idealne relacje z pojedynczym rezonansem."
      },
      {
        "question": "Czy ten model uwzględnia rzeczywiste tolerancje komponentów?",
        "answer": "Nie. Zakłada idealne, liniowe, skupione komponenty R, L i C. Pasożyty, rezystancja uzwojenia cewki indukcyjnej, impedancja źródła, obciążenie i zmienność komponentów mogą przesuwać lub tłumić rzeczywiste obwody."
      },
      {
        "question": "Czy ten kalkulator może zaświadczyć, że obwód jest bezpieczny?",
        "answer": "Nie. Jest to szacunkowa ocena edukacyjna, a nie zatwierdzenie projektu lub ocena bezpieczeństwa. Potwierdź parametry komponentów i zachowanie w świecie rzeczywistym za pomocą arkuszy danych i wykwalifikowanej recenzji inżynierskiej."
      }
    ]
  },
  "sv": {
    "copyLanguage": "sv",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC Circuit Calculator",
    "title": "RLC Circuit Calculator gratis och obegränsat | UsefulVerse",
    "description": "Hitta RLC-resonans, Q, bandbredd och impedans för serie- eller parallellkretsar. Gratis, lokalt och obegränsat.",
    "intro": "Välj en serie- eller parallell RLC-modell, ange komponentvärden och inspektera resonans plus impedans vid en frekvens du väljer.",
    "howQuestion": "Hur beräknar man RLC-resonans?",
    "howAnswer": "För idealiska klumpade komponenter är resonansfrekvensen 1/(2π√(LC)). Kvalitetsfaktor och bandbredd beror på om motståndet är i serie eller parallellt. Denna kalkylator utvärderar också komplex impedans vid din valda frekvens.",
    "privacyQuestion": "Är mina kretsvärden uppladdade?",
    "privacyAnswer": "Nej. Matematiken och svarskurvan körs i den här webbläsaren; dina angivna värden laddas inte upp eller sparas.",
    "fields": {
      "topology": "Kretstopologi",
      "series": "Serie RLC",
      "parallel": "Parallell RLC",
      "resistance": "Motstånd (Ω)",
      "inductance": "Induktans",
      "inductanceUnit": "Induktansenhet",
      "henries": "Henries (H)",
      "millihenries": "Millihenries (mH)",
      "microhenries": "Microhenries (µH)",
      "capacitance": "Kapacitans",
      "capacitanceUnit": "Kapacitansenhet",
      "farads": "Farads (F)",
      "microfarads": "Mikrofarader (µF)",
      "nanofarads": "Nanofarads (nF)",
      "picofarads": "Picofarads (pF)",
      "frequency": "Frekvens att utvärdera",
      "frequencyUnit": "Frekvensenhet",
      "hertz": "Hertz (Hz)",
      "kilohertz": "Kilohertz (kHz)",
      "voltage": "Källspänning (V RMS)",
      "accuracyNote": "Endast idealisk klumpad, linjär RLC-modell. Parallellt läge betyder att R, L och C alla är parallella. Den ignorerar toleranser, parasiter, spolresistans, källimpedans, olinjära delar, lastkoppling och säkerhet. Den certifierar inte en riktig krets eller utvalda delar. Kontrollera datablad och rådfråga en kvalificerad fackman innan du bygger eller använder riktig hårdvara. Körs lokalt; ingen uppladdning.",
      "chartTitle": "Impedans över frekvens",
      "chartDescription": "Log-frekvenssvep från en tiondel till tio gånger resonansfrekvensen. Kurvan visar ideal impedansstorlek för den valda serie- eller parallelltopologin."
    },
    "actions": {
      "calculate": "Beräkna RLC-krets",
      "reset": "Återställa",
      "copy": "Kopiera resultat",
      "example": "Ladda exempel",
      "result": "RLC-resultat"
    },
    "messages": {
      "copied": "Resultaten har kopierats.",
      "copyUnavailable": "Kopiera är inte tillgängligt i den här webbläsaren.",
      "calculated": "RLC-uppskattning beräknad.",
      "checkInputs": "Kontrollera R, L, C, frekvens, spänning, topologi och enheter.",
      "model": "Modell",
      "resonance": "Resonansfrekvens",
      "qualityFactor": "Kvalitetsfaktor (Q)",
      "bandwidth": "Ungefärlig bandbredd",
      "inductiveReactance": "Induktiv reaktans (XL)",
      "capacitiveReactance": "Kapacitiv reaktans (XC)",
      "complexImpedance": "Komplex impedans (R + jX)",
      "impedanceMagnitudePhase": "Impedans storlek / fas",
      "current": "Källström (ideal RMS)"
    },
    "additionalFaqs": [
      {
        "question": "Vad är formeln för resonansfrekvens?",
        "answer": "För en ideal induktor L och kondensator C, f₀ = 1/(2π√(LC)). Använd henries och farads för att få hertz. Motståndet ändrar dämpning och Q, inte denna idealiska LC-resonansformel."
      },
      {
        "question": "Hur skiljer sig serie- och parallella RLC-kretsar?",
        "answer": "Vid resonans har en ideal serie RLC minsta impedans lika med R; en ideal parallell RLC har maximal impedans lika med R. Ström- och spänningsbeteende skiljer sig därför åt även om ideal f0 är detsamma."
      },
      {
        "question": "Hur beräknas Q och bandbredd?",
        "answer": "För seriemodellen är Q = ω₀L/R och bandbredden R/(2πL). För den parallella modellen är Q = R/(ω₀L) och bandbredden 1/(2πRC). Dessa är idealiska enstaka resonansförhållanden."
      },
      {
        "question": "Inkluderar denna modell verkliga komponenttoleranser?",
        "answer": "Nej. Det förutsätter idealiska, linjära, klumpade R-, L- och C-komponenter. Parasiter, induktorlindningsresistans, källimpedans, belastning och komponentvariation kan förskjuta eller dämpa verkliga kretsar."
      },
      {
        "question": "Kan den här kalkylatorn certifiera en krets som säker?",
        "answer": "Nej. Det är en pedagogisk uppskattning, inte ett konstruktionsgodkännande eller säkerhetsbedömning. Bekräfta komponentbetyg och verkliga beteende med datablad och kvalificerad ingenjörsgranskning."
      }
    ]
  },
  "th": {
    "copyLanguage": "th",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "เครื่องคำนวณวงจร RLC",
    "title": "เครื่องคำนวณวงจร RLC ฟรีและไม่ จำกัด | UsefulVerse",
    "description": "ค้นหาเรโซแนนซ์ RLC, Q, แบนด์วิธ และอิมพีแดนซ์สำหรับวงจรอนุกรมหรือขนาน ฟรี ในพื้นที่ และไม่จำกัด",
    "intro": "เลือกโมเดล RLC แบบอนุกรมหรือแบบขนาน ป้อนค่าส่วนประกอบ และตรวจสอบเรโซแนนซ์บวกอิมพีแดนซ์ที่ความถี่ที่คุณเลือก",
    "howQuestion": "คุณจะคำนวณเรโซแนนซ์ RLC ได้อย่างไร",
    "howAnswer": "สำหรับส่วนประกอบที่เป็นก้อนในอุดมคติ ความถี่เรโซแนนซ์คือ 1/(2π√(LC)) ปัจจัยด้านคุณภาพและแบนด์วิธขึ้นอยู่กับว่าตัวต้านทานเป็นแบบอนุกรมหรือแบบขนาน เครื่องคิดเลขนี้ยังประเมินอิมพีแดนซ์ที่ซับซ้อนตามความถี่ที่คุณเลือกอีกด้วย",
    "privacyQuestion": "มีการอัพโหลดค่าวงจรของฉันหรือไม่",
    "privacyAnswer": "ไม่ เส้นโค้งทางคณิตศาสตร์และการตอบสนองทำงานในเบราว์เซอร์นี้ ค่าที่คุณป้อนไม่ได้ถูกอัพโหลดหรือบันทึก",
    "fields": {
      "topology": "โทโพโลยีวงจร",
      "series": "ซีรีส์ RLC",
      "parallel": "RLC แบบขนาน",
      "resistance": "ความต้านทาน (Ω)",
      "inductance": "ตัวเหนี่ยวนำ",
      "inductanceUnit": "หน่วยความเหนี่ยวนำ",
      "henries": "อองรีส์ (เหย้า)",
      "millihenries": "มิลลิเฮนรีส์ (mH)",
      "microhenries": "ไมโครเฮนรี (µH)",
      "capacitance": "ความจุ",
      "capacitanceUnit": "หน่วยความจุ",
      "farads": "ฟารัดส์ (F)",
      "microfarads": "ไมโครฟารัด (µF)",
      "nanofarads": "นาโนฟารัด (nF)",
      "picofarads": "พิโคฟารัด (pF)",
      "frequency": "ความถี่ในการประเมิน",
      "frequencyUnit": "หน่วยความถี่",
      "hertz": "เฮิรตซ์ (Hz)",
      "kilohertz": "กิโลเฮิรตซ์ (kHz)",
      "voltage": "แรงดันแหล่งจ่าย (V RMS)",
      "accuracyNote": "รุ่น RLC เชิงเส้นแบบก้อนในอุดมคติเท่านั้น โหมดขนานหมายความว่า R, L และ C ขนานกันทั้งหมด โดยไม่สนใจค่าความคลาดเคลื่อน ปรสิต ความต้านทานของคอยล์ อิมพีแดนซ์ของแหล่งกำเนิด ชิ้นส่วนที่ไม่เป็นเชิงเส้น การต่อโหลด และความปลอดภัย ไม่รับรองวงจรจริงหรือเลือกชิ้นส่วน ตรวจสอบเอกสารข้อมูลและปรึกษาผู้เชี่ยวชาญที่ผ่านการรับรองก่อนสร้างหรือใช้ฮาร์ดแวร์จริง ทำงานในพื้นที่ ไม่มีการอัพโหลด",
      "chartTitle": "ความต้านทานข้ามความถี่",
      "chartDescription": "กวาดความถี่บันทึกจากหนึ่งในสิบถึงสิบเท่าของความถี่เรโซแนนซ์ เส้นโค้งแสดงขนาดอิมพีแดนซ์ในอุดมคติสำหรับซีรีย์ที่เลือกหรือโทโพโลยีแบบขนาน"
    },
    "actions": {
      "calculate": "คำนวณวงจร RLC",
      "reset": "รีเซ็ต",
      "copy": "คัดลอกผลลัพธ์",
      "example": "โหลดตัวอย่าง",
      "result": "ผลลัพธ์ของ RLC"
    },
    "messages": {
      "copied": "คัดลอกผลลัพธ์แล้ว",
      "copyUnavailable": "คัดลอกไม่พร้อมใช้งานในเบราว์เซอร์นี้",
      "calculated": "คำนวณค่าประมาณ RLC แล้ว",
      "checkInputs": "ตรวจสอบ R, L, C, ความถี่, แรงดันไฟฟ้า, โทโพโลยีและหน่วย",
      "model": "แบบอย่าง",
      "resonance": "ความถี่เรโซแนนซ์",
      "qualityFactor": "ปัจจัยด้านคุณภาพ (Q)",
      "bandwidth": "แบนด์วิธโดยประมาณ",
      "inductiveReactance": "รีแอคแทนซ์แบบเหนี่ยวนำ (XL)",
      "capacitiveReactance": "รีแอคแทนซ์แบบคาปาซิทีฟ (XC)",
      "complexImpedance": "อิมพีแดนซ์เชิงซ้อน (R + jX)",
      "impedanceMagnitudePhase": "ขนาดความต้านทาน / เฟส",
      "current": "แหล่งกระแส (RMS ในอุดมคติ)"
    },
    "additionalFaqs": [
      {
        "question": "สูตรความถี่เรโซแนนซ์คืออะไร?",
        "answer": "สำหรับตัวเหนี่ยวนำ L และตัวเก็บประจุ C ในอุดมคติ f₀ = 1/(2π√(LC)) ใช้เฮนรีและฟารัดเพื่อรับเฮิรตซ์ ตัวต้านทานเปลี่ยนการหน่วงและ Q ไม่ใช่สูตรเรโซแนนซ์ LC ในอุดมคตินี้"
      },
      {
        "question": "วงจร RLC แบบอนุกรมและแบบขนานแตกต่างกันอย่างไร?",
        "answer": "ที่เสียงสะท้อน อนุกรม RLC ในอุดมคติจะมีอิมพีแดนซ์ขั้นต่ำเท่ากับ R; RLC แบบขนานในอุดมคติมีความต้านทานสูงสุดเท่ากับ R ดังนั้นพฤติกรรมกระแสและแรงดันไฟฟ้าจึงแตกต่างกันแม้ว่า f₀ ในอุดมคติจะเหมือนกันก็ตาม"
      },
      {
        "question": "Q และแบนด์วิธคำนวณอย่างไร",
        "answer": "สำหรับรุ่นอนุกรม Q = ω₀L/R และแบนด์วิธคือ R/(2πL) สำหรับโมเดลคู่ขนาน Q = R/(ω₀L) และแบนด์วิธคือ 1/(2πRC) สิ่งเหล่านี้เป็นความสัมพันธ์แบบเรโซแนนซ์เดียวในอุดมคติ"
      },
      {
        "question": "โมเดลนี้รวมค่าความคลาดเคลื่อนของส่วนประกอบจริงด้วยหรือไม่",
        "answer": "ไม่ โดยถือว่าส่วนประกอบ R, L และ C ในอุดมคติเป็นเส้นตรง ปรสิต ความต้านทานของขดลวดเหนี่ยวนำ อิมพีแดนซ์ของแหล่งกำเนิด โหลด และการแปรผันของส่วนประกอบต่างๆ สามารถเปลี่ยนหรือทำให้วงจรจริงชื้นได้"
      },
      {
        "question": "เครื่องคิดเลขนี้สามารถรับรองวงจรว่าปลอดภัยได้หรือไม่?",
        "answer": "ไม่ มันเป็นการประมาณการทางการศึกษา ไม่ใช่การอนุมัติการออกแบบหรือการประเมินความปลอดภัย ยืนยันการให้คะแนนส่วนประกอบและพฤติกรรมในโลกแห่งความเป็นจริงด้วยเอกสารข้อมูลและการตรวจสอบทางวิศวกรรมที่ผ่านการรับรอง"
      }
    ]
  },
  "uk": {
    "copyLanguage": "uk",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Калькулятор схеми RLC",
    "title": "Безкоштовний і необмежений калькулятор RLC | UsefulVerse",
    "description": "Знайдіть резонанс RLC, добротність, смугу пропускання та імпеданс для послідовних або паралельних ланцюгів. Безкоштовно, локально та без обмежень.",
    "intro": "Виберіть послідовну або паралельну модель RLC, введіть значення компонентів і перевірте резонанс плюс імпеданс на вибраній частоті.",
    "howQuestion": "Як обчислити резонанс RLC?",
    "howAnswer": "Для ідеальних зосереджених компонентів резонансна частота становить 1/(2π√(LC)). Коефіцієнт якості та пропускна здатність залежать від послідовного або паралельного з’єднання резистора. Цей калькулятор також оцінює комплексний опір на вибраній частоті.",
    "privacyQuestion": "Чи завантажені мої значення схеми?",
    "privacyAnswer": "Ні. Математична крива та крива відповідей працюють у цьому браузері; введені значення не завантажуються та не зберігаються.",
    "fields": {
      "topology": "Топологія ланцюга",
      "series": "Серія RLC",
      "parallel": "Паралельний RLC",
      "resistance": "Опір (Ω)",
      "inductance": "індуктивність",
      "inductanceUnit": "Блок індуктивності",
      "henries": "Генріс (H)",
      "millihenries": "мілігенрі (мГн)",
      "microhenries": "Мікрогенрі (мкГн)",
      "capacitance": "Ємність",
      "capacitanceUnit": "Одиниця вимірювання ємності",
      "farads": "Фаради (F)",
      "microfarads": "Мікрофарад (мкФ)",
      "nanofarads": "Нанофарад (нФ)",
      "picofarads": "Пікофарад (пФ)",
      "frequency": "Частота для оцінки",
      "frequencyUnit": "Одиниця частоти",
      "hertz": "Герц (Гц)",
      "kilohertz": "Кілогерц (кГц)",
      "voltage": "Напруга джерела (В RMS)",
      "accuracyNote": "Лише ідеальна лінійна модель RLC із зосередженими елементами. Паралельний режим означає, що R, L і C працюють паралельно. Він ігнорує допуски, паразити, опір котушки, імпеданс джерела, нелінійні частини, зв'язок навантаження та безпеку. Він не сертифікує реальну схему або окремі частини. Перевірте таблиці даних і проконсультуйтеся з кваліфікованим фахівцем перед створенням або використанням справжнього обладнання. Запускається локально; немає завантаження.",
      "chartTitle": "Імпеданс по частоті",
      "chartDescription": "Розгортка логарифмічної частоти від однієї десятої до десяти резонансної частоти. Крива показує ідеальну величину імпедансу для вибраної послідовної або паралельної топології."
    },
    "actions": {
      "calculate": "Розрахувати схему RLC",
      "reset": "Скинути",
      "copy": "Копіювати результати",
      "example": "Приклад навантаження",
      "result": "Результати RLC"
    },
    "messages": {
      "copied": "Результати скопійовано.",
      "copyUnavailable": "Копіювання недоступне в цьому браузері.",
      "calculated": "Розрахована оцінка RLC.",
      "checkInputs": "Перевірте R, L, C, частоту, напругу, топологію та одиниці.",
      "model": "Модель",
      "resonance": "Резонансна частота",
      "qualityFactor": "Фактор якості (Q)",
      "bandwidth": "Приблизна пропускна здатність",
      "inductiveReactance": "Індуктивний опір (XL)",
      "capacitiveReactance": "Ємнісний реактивний опір (XC)",
      "complexImpedance": "Комплексний імпеданс (R + jX)",
      "impedanceMagnitudePhase": "Величина опору / фаза",
      "current": "Струм джерела (ідеальне середньоквадратичне значення)"
    },
    "additionalFaqs": [
      {
        "question": "Яка формула резонансної частоти?",
        "answer": "Для ідеальної котушки індуктивності L і конденсатора C f₀ = 1/(2π√(LC)). Використовуйте генрі та фаради, щоб отримати герц. Резистор змінює затухання та Q, а не цю ідеальну формулу резонансу LC."
      },
      {
        "question": "Чим відрізняються послідовні та паралельні схеми RLC?",
        "answer": "У резонансі ідеальна послідовність RLC має мінімальний опір, рівний R; ідеальний паралельний RLC має максимальний імпеданс, рівний R. Тому поведінка струму та напруги відрізняється, навіть якщо ідеальне f₀ однакове."
      },
      {
        "question": "Як обчислюється Q і пропускна здатність?",
        "answer": "Для серії моделей Q = ω₀L/R, а пропускна здатність дорівнює R/(2πL). Для паралельної моделі Q = R/(ω₀L), а пропускна здатність становить 1/(2πRC). Це ідеальні однорезонансні співвідношення."
      },
      {
        "question": "Чи включає ця модель реальні допуски на компоненти?",
        "answer": "Ні. Він передбачає ідеальні, лінійні, зосереджені компоненти R, L і C. Паразити, опір обмотки індуктора, імпеданс джерела, зміна навантаження та компонентів можуть зміщувати або демпфувати реальні схеми."
      },
      {
        "question": "Чи може цей калькулятор сертифікувати схему як безпечну?",
        "answer": "Ні. Це освітня оцінка, а не схвалення проекту чи оцінка безпеки. Підтвердьте оцінки компонентів і поведінку в реальному світі за допомогою таблиць даних і кваліфікованого інженерного огляду."
      }
    ]
  },
  "sw": {
    "copyLanguage": "sw",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Kikokotoo cha Mzunguko wa RLC",
    "title": "Kikokotoo cha Mzunguko cha RLC Bila Malipo & | UsefulVerse",
    "description": "Pata resonance ya RLC, Q, kipimo data na impedance kwa safu au saketi sambamba. Bure, ya ndani na isiyo na kikomo.",
    "intro": "Chagua mfululizo au muundo sambamba wa RLC, weka thamani za vijenzi, na ukague resonance plus impedance kwa marudio unayochagua.",
    "howQuestion": "Unahesabuje resonance ya RLC?",
    "howAnswer": "Kwa viambajengo vilivyo bora, masafa ya resonant ni 1/(2π√(LC)). Sababu ya ubora na kipimo data hutegemea ikiwa kipingamizi kiko katika mfululizo au sambamba. Kikokotoo hiki pia hutathmini kizuizi changamano katika masafa uliyochagua.",
    "privacyQuestion": "Je, thamani za mzunguko wangu zimepakiwa?",
    "privacyAnswer": "Hapana. Kiwango cha hesabu na majibu kinaendeshwa katika kivinjari hiki; thamani ulizoingiza hazijapakiwa au kuhifadhiwa.",
    "fields": {
      "topology": "Topolojia ya mzunguko",
      "series": "Mfululizo wa RLC",
      "parallel": "Sambamba na RLC",
      "resistance": "Upinzani (Ω)",
      "inductance": "Inductance",
      "inductanceUnit": "Kitengo cha inductance",
      "henries": "Henry (H)",
      "millihenries": "Milihenries (mH)",
      "microhenries": "Microhenries (µH)",
      "capacitance": "Uwezo",
      "capacitanceUnit": "Kitengo cha uwezo",
      "farads": "Farads (F)",
      "microfarads": "Mikrofaradi (µF)",
      "nanofarads": "Nanofarad (nF)",
      "picofarads": "Picofaradi (pF)",
      "frequency": "Mara kwa mara kutathminiwa",
      "frequencyUnit": "Kitengo cha masafa",
      "hertz": "Hertz (Hz)",
      "kilohertz": "Kilohertz (kHz)",
      "voltage": "Chanzo cha voltage (V RMS)",
      "accuracyNote": "Mfano mzuri wa luped, mstari wa RLC pekee. Hali sambamba inamaanisha R, L na C zote ziko sambamba. Inapuuza uvumilivu, vimelea, upinzani wa coil, impedance ya chanzo, sehemu zisizo za mstari, kuunganisha mzigo na usalama. Haidhibitishi mzunguko halisi au sehemu za kuchagua. Angalia hifadhidata na kushauriana na mtaalamu aliyehitimu kabla ya kujenga au kutumia vifaa halisi. Inaendesha ndani ya nchi; hakuna upakiaji.",
      "chartTitle": "Impedans katika mzunguko",
      "chartDescription": "Log-frequency zoa kutoka moja ya kumi hadi mara kumi ya frequency resonant. Mviringo unaonyesha ukubwa bora wa kizuizi kwa mfululizo uliochaguliwa au topolojia sambamba."
    },
    "actions": {
      "calculate": "Kuhesabu mzunguko wa RLC",
      "reset": "Weka upya",
      "copy": "Nakili matokeo",
      "example": "Mfano wa mzigo",
      "result": "Matokeo ya RLC"
    },
    "messages": {
      "copied": "Matokeo yamenakiliwa.",
      "copyUnavailable": "Nakala haipatikani katika kivinjari hiki.",
      "calculated": "Kadirio la RLC limekokotolewa.",
      "checkInputs": "Angalia R, L, C, frequency, voltage, topolojia na vitengo.",
      "model": "Mfano",
      "resonance": "Mzunguko wa resonant",
      "qualityFactor": "Kipengele cha ubora (Q)",
      "bandwidth": "Takriban bandwidth",
      "inductiveReactance": "Mwitikio kwa kufata neno (XL)",
      "capacitiveReactance": "Mwitikio wa uwezo (XC)",
      "complexImpedance": "Uzuiaji tata (R + jX)",
      "impedanceMagnitudePhase": "Ukubwa wa impedance / awamu",
      "current": "Chanzo cha sasa (RMS bora)"
    },
    "additionalFaqs": [
      {
        "question": "Formula ya masafa ya resonant ni nini?",
        "answer": "Kwa indukta bora L na capacitor C, f₀ = 1/(2π√(LC)). Tumia henries na farads kupata hertz. Kipinga hubadilisha unyevu na Q, sio fomula hii bora ya resonance ya LC."
      },
      {
        "question": "Je, mizunguko ya mfululizo na sambamba ya RLC hutofautianaje?",
        "answer": "Katika resonance, mfululizo bora wa RLC una impedance ya chini sawa na R; RLC inayolingana bora ina kizuizi cha juu zaidi sawa na R. Tabia ya sasa na ya volti kwa hivyo hutofautiana ingawa f₀ bora ni sawa."
      },
      {
        "question": "Q na kipimo data huhesabiwaje?",
        "answer": "Kwa mfano wa mfululizo, Q = ω₀L/R na bandwidth ni R/(2πL). Kwa mfano sambamba, Q = R/(ω₀L) na bandwidth ni 1/(2πRC). Haya ni mahusiano bora ya resonance moja."
      },
      {
        "question": "Je, mtindo huu unajumuisha uvumilivu wa vipengele halisi?",
        "answer": "Hapana. Inachukua vipengele bora, vya mstari, vya R, L na C. Vimelea, upinzani wa vilima vya inductor, impedance ya chanzo, upakiaji na tofauti ya sehemu inaweza kuhama au unyevu wa nyaya halisi."
      },
      {
        "question": "Je, kikokotoo hiki kinaweza kuthibitisha mzunguko kuwa salama?",
        "answer": "Hapana. Ni makadirio ya kielimu, si idhini ya muundo au tathmini ya usalama. Thibitisha ukadiriaji wa sehemu na tabia ya ulimwengu halisi kwa hifadhidata na ukaguzi wa kihandisi uliohitimu."
      }
    ]
  },
  "mr": {
    "copyLanguage": "mr",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC सर्किट कॅल्क्युलेटर",
    "title": "RLC सर्किट कॅल्क्युलेटर मोफत आणि अमर्यादित | UsefulVerse",
    "description": "मालिका किंवा समांतर सर्किट्ससाठी RLC रेझोनान्स, Q, बँडविड्थ आणि प्रतिबाधा शोधा. विनामूल्य, स्थानिक आणि अमर्यादित.",
    "intro": "मालिका किंवा समांतर RLC मॉडेल निवडा, घटक मूल्ये प्रविष्ट करा आणि तुम्ही निवडलेल्या वारंवारतेवर अनुनाद अधिक प्रतिबाधाचे निरीक्षण करा.",
    "howQuestion": "तुम्ही RLC रेझोनान्सची गणना कशी करता?",
    "howAnswer": "आदर्श लम्पड घटकांसाठी, रेझोनंट वारंवारता 1/(2π√(LC)) आहे. गुणवत्तेचा घटक आणि बँडविड्थ हे रेझिस्टर मालिकेत आहे की समांतर यावर अवलंबून आहे. हे कॅल्क्युलेटर तुमच्या निवडलेल्या वारंवारतेवर जटिल प्रतिबाधाचे देखील मूल्यांकन करते.",
    "privacyQuestion": "माझी सर्किट व्हॅल्यू अपलोड केली आहेत का?",
    "privacyAnswer": "क्र. या ब्राउझरमध्ये गणित आणि प्रतिसाद वक्र चालते; तुमची प्रविष्ट केलेली मूल्ये अपलोड किंवा जतन केलेली नाहीत.",
    "fields": {
      "topology": "सर्किट टोपोलॉजी",
      "series": "मालिका RLC",
      "parallel": "समांतर RLC",
      "resistance": "प्रतिकार (Ω)",
      "inductance": "अधिष्ठाता",
      "inductanceUnit": "इंडक्टन्स युनिट",
      "henries": "हेन्रीज (एच)",
      "millihenries": "Millihenries (mH)",
      "microhenries": "मायक्रोहेनरीज (µH)",
      "capacitance": "क्षमता",
      "capacitanceUnit": "कॅपेसिटन्स युनिट",
      "farads": "फॅराड्स (एफ)",
      "microfarads": "मायक्रोफरॅड्स (µF)",
      "nanofarads": "नॅनोफरॅड्स (nF)",
      "picofarads": "Picofarads (pF)",
      "frequency": "मूल्यांकन करण्यासाठी वारंवारता",
      "frequencyUnit": "वारंवारता युनिट",
      "hertz": "हर्ट्झ (Hz)",
      "kilohertz": "किलोहर्ट्झ (kHz)",
      "voltage": "स्रोत व्होल्टेज (V RMS)",
      "accuracyNote": "केवळ आदर्श लम्पड, रेखीय RLC मॉडेल. समांतर मोड म्हणजे R, L आणि C हे सर्व समांतर आहेत. हे सहनशीलता, परजीवी, कॉइल प्रतिरोध, स्त्रोत प्रतिबाधा, नॉनलाइनर भाग, लोड कपलिंग आणि सुरक्षिततेकडे दुर्लक्ष करते. हे वास्तविक सर्किट किंवा निवडक भाग प्रमाणित करत नाही. डेटाशीट तपासा आणि वास्तविक हार्डवेअर तयार करण्यापूर्वी किंवा वापरण्यापूर्वी पात्र व्यावसायिकांचा सल्ला घ्या. स्थानिक पातळीवर चालते; अपलोड नाही.",
      "chartTitle": "वारंवारता ओलांडून प्रतिबाधा",
      "chartDescription": "लॉग-फ्रिक्वेंसी स्वीप एक दशांश ते रेझोनंट वारंवारतेच्या दहापट. वक्र निवडलेल्या मालिका किंवा समांतर टोपोलॉजीसाठी आदर्श प्रतिबाधा परिमाण दाखवते."
    },
    "actions": {
      "calculate": "आरएलसी सर्किटची गणना करा",
      "reset": "रीसेट करा",
      "copy": "परिणाम कॉपी करा",
      "example": "लोड उदाहरण",
      "result": "RLC परिणाम"
    },
    "messages": {
      "copied": "परिणाम कॉपी केले.",
      "copyUnavailable": "कॉपी या ब्राउझरमध्ये उपलब्ध नाही.",
      "calculated": "RLC अंदाज मोजला.",
      "checkInputs": "R, L, C, वारंवारता, व्होल्टेज, टोपोलॉजी आणि एकके तपासा.",
      "model": "मॉडेल",
      "resonance": "अनुनाद वारंवारता",
      "qualityFactor": "गुणवत्ता घटक (Q)",
      "bandwidth": "अंदाजे बँडविड्थ",
      "inductiveReactance": "प्रेरक प्रतिक्रिया (XL)",
      "capacitiveReactance": "कॅपेसिटिव्ह रिॲक्टन्स (XC)",
      "complexImpedance": "जटिल प्रतिबाधा (R + jX)",
      "impedanceMagnitudePhase": "प्रतिबाधा परिमाण / टप्पा",
      "current": "स्रोत वर्तमान (आदर्श RMS)"
    },
    "additionalFaqs": [
      {
        "question": "रेझोनंट वारंवारता सूत्र काय आहे?",
        "answer": "आदर्श इंडक्टर L आणि कॅपेसिटर C साठी, f₀ = 1/(2π√(LC)). हर्ट्झ मिळविण्यासाठी हेन्री आणि फॅराड्स वापरा. रेझिस्टर डॅम्पिंग आणि क्यू बदलते, हे आदर्श एलसी रेझोनान्स फॉर्म्युला नाही."
      },
      {
        "question": "मालिका आणि समांतर RLC सर्किट्स कसे वेगळे आहेत?",
        "answer": "रेझोनन्सच्या वेळी, आदर्श मालिका RLC मध्ये R च्या बरोबरीचा किमान प्रतिबाधा असतो; आदर्श समांतर RLC मध्ये R प्रमाणे जास्तीत जास्त प्रतिबाधा असते. वर्तमान आणि व्होल्टेजचे वर्तन आदर्श f₀ समान असले तरीही भिन्न असतात."
      },
      {
        "question": "Q आणि बँडविड्थची गणना कशी केली जाते?",
        "answer": "मालिका मॉडेलसाठी, Q = ω₀L/R आणि बँडविड्थ R/(2πL) आहे. समांतर मॉडेलसाठी, Q = R/(ω₀L) आणि बँडविड्थ 1/(2πRC) आहे. हे आदर्श एकल-अनुनाद संबंध आहेत."
      },
      {
        "question": "या मॉडेलमध्ये वास्तविक घटक सहिष्णुता समाविष्ट आहे का?",
        "answer": "नाही. हे आदर्श, रेखीय, lumped R, L आणि C घटक गृहीत धरते. परजीवी, इंडक्टर वाइंडिंग प्रतिरोध, स्त्रोत प्रतिबाधा, लोडिंग आणि घटक भिन्नता वास्तविक सर्किट्स बदलू शकतात किंवा ओलसर करू शकतात."
      },
      {
        "question": "हा कॅल्क्युलेटर सर्किटला सुरक्षित असल्याचे प्रमाणित करू शकतो का?",
        "answer": "नाही. हा एक शैक्षणिक अंदाज आहे, डिझाइनची मान्यता किंवा सुरक्षितता मूल्यांकन नाही. डेटाशीट आणि पात्र अभियांत्रिकी पुनरावलोकनासह घटक रेटिंग आणि वास्तविक-जगातील वर्तनाची पुष्टी करा."
      }
    ]
  },
  "te": {
    "copyLanguage": "te",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC సర్క్యూట్ కాలిక్యులేటర్",
    "title": "RLC సర్క్యూట్ కాలిక్యులేటర్ ఉచితం & అపరిమిత | UsefulVerse",
    "description": "సిరీస్ లేదా సమాంతర సర్క్యూట్‌ల కోసం RLC రెసొనెన్స్, Q, బ్యాండ్‌విడ్త్ మరియు ఇంపెడెన్స్‌ను కనుగొనండి. ఉచిత, స్థానిక మరియు అపరిమిత.",
    "intro": "సిరీస్ లేదా సమాంతర RLC మోడల్‌ని ఎంచుకోండి, కాంపోనెంట్ విలువలను నమోదు చేయండి మరియు మీరు ఎంచుకున్న ఫ్రీక్వెన్సీలో రెసొనెన్స్ ప్లస్ ఇంపెడెన్స్‌ని తనిఖీ చేయండి.",
    "howQuestion": "మీరు RLC ప్రతిధ్వనిని ఎలా లెక్కిస్తారు?",
    "howAnswer": "ఆదర్శవంతమైన లంప్డ్ భాగాల కోసం, ప్రతిధ్వని ఫ్రీక్వెన్సీ 1/(2π√(LC)). నాణ్యమైన కారకం మరియు బ్యాండ్‌విడ్త్ రెసిస్టర్ సిరీస్‌లో ఉందా లేదా సమాంతరంగా ఉందా అనే దానిపై ఆధారపడి ఉంటుంది. ఈ కాలిక్యులేటర్ మీరు ఎంచుకున్న ఫ్రీక్వెన్సీ వద్ద కాంప్లెక్స్ ఇంపెడెన్స్‌ను కూడా అంచనా వేస్తుంది.",
    "privacyQuestion": "నా సర్క్యూట్ విలువలు అప్‌లోడ్ చేయబడిందా?",
    "privacyAnswer": "సంఖ్య. ఈ బ్రౌజర్‌లో గణితం మరియు ప్రతిస్పందన వక్రరేఖ నడుస్తుంది; మీరు నమోదు చేసిన విలువలు అప్‌లోడ్ చేయబడవు లేదా సేవ్ చేయబడవు.",
    "fields": {
      "topology": "సర్క్యూట్ టోపోలాజీ",
      "series": "సిరీస్ RLC",
      "parallel": "సమాంతర RLC",
      "resistance": "ప్రతిఘటన (Ω)",
      "inductance": "ఇండక్టెన్స్",
      "inductanceUnit": "ఇండక్టెన్స్ యూనిట్",
      "henries": "హెన్రీస్ (H)",
      "millihenries": "మిల్లిహెన్రీస్ (mH)",
      "microhenries": "మైక్రోహెన్రీస్ (µH)",
      "capacitance": "కెపాసిటెన్స్",
      "capacitanceUnit": "కెపాసిటెన్స్ యూనిట్",
      "farads": "ఫారడ్స్ (F)",
      "microfarads": "మైక్రోఫారడ్స్ (µF)",
      "nanofarads": "నానోఫారడ్స్ (nF)",
      "picofarads": "పికోఫారడ్స్ (pF)",
      "frequency": "మూల్యాంకనం చేయడానికి ఫ్రీక్వెన్సీ",
      "frequencyUnit": "ఫ్రీక్వెన్సీ యూనిట్",
      "hertz": "హెర్ట్జ్ (Hz)",
      "kilohertz": "కిలోహెర్ట్జ్ (kHz)",
      "voltage": "మూల వోల్టేజ్ (V RMS)",
      "accuracyNote": "ఆదర్శవంతమైన లంప్డ్, లీనియర్ RLC మోడల్ మాత్రమే. సమాంతర మోడ్ అంటే R, L మరియు C అన్నీ సమాంతరంగా ఉంటాయి. ఇది టాలరెన్స్, పరాన్నజీవులు, కాయిల్ రెసిస్టెన్స్, సోర్స్ ఇంపెడెన్స్, నాన్ లీనియర్ పార్ట్స్, లోడ్ కప్లింగ్ మరియు సేఫ్టీని విస్మరిస్తుంది. ఇది నిజమైన సర్క్యూట్ లేదా ఎంపిక భాగాలను ధృవీకరించదు. డేటాషీట్‌లను తనిఖీ చేయండి మరియు నిజమైన హార్డ్‌వేర్‌ను నిర్మించడానికి లేదా ఉపయోగించే ముందు అర్హత కలిగిన నిపుణులను సంప్రదించండి. స్థానికంగా నడుస్తుంది; అప్‌లోడ్ లేదు.",
      "chartTitle": "ఫ్రీక్వెన్సీ అంతటా ఇంపెడెన్స్",
      "chartDescription": "లాగ్-ఫ్రీక్వెన్సీ స్వీప్ ప్రతిధ్వని పౌనఃపున్యానికి పదో వంతు నుండి పది రెట్లు. ఎంచుకున్న శ్రేణి లేదా సమాంతర టోపోలాజీకి వక్రరేఖ ఆదర్శ నిరోధక పరిమాణాన్ని చూపుతుంది."
    },
    "actions": {
      "calculate": "RLC సర్క్యూట్‌ను లెక్కించండి",
      "reset": "రీసెట్ చేయండి",
      "copy": "ఫలితాలను కాపీ చేయండి",
      "example": "లోడ్ ఉదాహరణ",
      "result": "RLC ఫలితాలు"
    },
    "messages": {
      "copied": "ఫలితాలు కాపీ చేయబడ్డాయి.",
      "copyUnavailable": "ఈ బ్రౌజర్‌లో కాపీ అందుబాటులో లేదు.",
      "calculated": "RLC అంచనా లెక్కించబడింది.",
      "checkInputs": "R, L, C, ఫ్రీక్వెన్సీ, వోల్టేజ్, టోపోలాజీ మరియు యూనిట్లను తనిఖీ చేయండి.",
      "model": "మోడల్",
      "resonance": "ప్రతిధ్వని ఫ్రీక్వెన్సీ",
      "qualityFactor": "నాణ్యత అంశం (Q)",
      "bandwidth": "సుమారుగా బ్యాండ్‌విడ్త్",
      "inductiveReactance": "ప్రేరక ప్రతిచర్య (XL)",
      "capacitiveReactance": "కెపాసిటివ్ రియాక్టెన్స్ (XC)",
      "complexImpedance": "కాంప్లెక్స్ ఇంపెడెన్స్ (R + jX)",
      "impedanceMagnitudePhase": "ఇంపెడెన్స్ పరిమాణం / దశ",
      "current": "సోర్స్ కరెంట్ (ఆదర్శ RMS)"
    },
    "additionalFaqs": [
      {
        "question": "ప్రతిధ్వని ఫ్రీక్వెన్సీ ఫార్ములా అంటే ఏమిటి?",
        "answer": "ఆదర్శవంతమైన ఇండక్టర్ L మరియు కెపాసిటర్ C కోసం, f₀ = 1/(2π√(LC)). హెర్ట్జ్ పొందడానికి హెన్రీస్ మరియు ఫారడ్స్ ఉపయోగించండి. రెసిస్టర్ డంపింగ్ మరియు Qని మారుస్తుంది, ఈ ఆదర్శ LC రెసొనెన్స్ ఫార్ములా కాదు."
      },
      {
        "question": "సిరీస్ మరియు సమాంతర RLC సర్క్యూట్‌లు ఎలా విభిన్నంగా ఉంటాయి?",
        "answer": "ప్రతిధ్వని వద్ద, ఒక ఆదర్శ శ్రేణి RLC కనిష్ట ఇంపెడెన్స్ R కి సమానం; ఒక ఆదర్శ సమాంతర RLC గరిష్టంగా Rకు సమానమైన ఇంపెడెన్స్‌ను కలిగి ఉంటుంది. ప్రస్తుత మరియు వోల్టేజ్ ప్రవర్తన కాబట్టి ఆదర్శ f₀ ఒకేలా ఉన్నప్పటికీ తేడా ఉంటుంది."
      },
      {
        "question": "Q మరియు బ్యాండ్‌విడ్త్ ఎలా లెక్కించబడతాయి?",
        "answer": "సిరీస్ మోడల్ కోసం, Q = ω₀L/R మరియు బ్యాండ్‌విడ్త్ R/(2πL). సమాంతర నమూనా కోసం, Q = R/(ω₀L) మరియు బ్యాండ్‌విడ్త్ 1/(2πRC). ఇవి ఆదర్శవంతమైన సింగిల్-రెసొనెన్స్ సంబంధాలు."
      },
      {
        "question": "ఈ మోడల్ నిజమైన కాంపోనెంట్ టాలరెన్స్‌లను కలిగి ఉందా?",
        "answer": "సంఖ్య. ఇది ఆదర్శవంతమైన, సరళ, లంప్డ్ R, L మరియు C భాగాలను ఊహిస్తుంది. పరాన్నజీవులు, ఇండక్టర్ వైండింగ్ రెసిస్టెన్స్, సోర్స్ ఇంపెడెన్స్, లోడింగ్ మరియు కాంపోనెంట్ వైవిధ్యం రియల్ సర్క్యూట్‌లను మార్చవచ్చు లేదా తడి చేయవచ్చు."
      },
      {
        "question": "ఈ కాలిక్యులేటర్ సర్క్యూట్ సురక్షితమని ధృవీకరించగలదా?",
        "answer": "కాదు. ఇది విద్యాపరమైన అంచనా, డిజైన్ ఆమోదం లేదా భద్రతా అంచనా కాదు. డేటాషీట్‌లు మరియు అర్హత కలిగిన ఇంజనీరింగ్ సమీక్షతో కాంపోనెంట్ రేటింగ్‌లు మరియు వాస్తవ-ప్రపంచ ప్రవర్తనను నిర్ధారించండి."
      }
    ]
  },
  "ha": {
    "copyLanguage": "ha",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "Kalkuleta na kewayawa RLC",
    "title": "Kalkuleta na kewayawa RLC Kyauta & Unlimited | UsefulVerse",
    "description": "Nemo resonance RLC, Q, bandwidth da impedance don jerin ko da'irar layi ɗaya. Kyauta, gida da mara iyaka.",
    "intro": "Zaɓi jeri ko ƙirar RLC mai kama da juna, shigar da ƙimar ɓangaren, sa'annan duba sautin ƙara da rashin ƙarfi a mitar da kuka zaɓa.",
    "howQuestion": "Ta yaya kuke lissafta resonance na RLC?",
    "howAnswer": "Don ingantattun abubuwan haɗin gwiwa, mitar resonant shine 1/(2π√(LC)). Ingancin factor da bandwidth sun dogara akan ko resistor yana cikin jerin ko a layi daya. Wannan kalkuleta kuma yana kimanta hadaddun rashin ƙarfi a mitar da kuka zaɓa.",
    "privacyQuestion": "An ɗora darajar da'ira na?",
    "privacyAnswer": "A'a. Math da lanƙwan amsa suna gudana a cikin wannan burauzar; Ba a loda kimar da aka shigar ko adanawa.",
    "fields": {
      "topology": "Tsarin yanayi",
      "series": "Farashin RLC",
      "parallel": "Daidaici RLC",
      "resistance": "Juriya (Ω)",
      "inductance": "Inductance",
      "inductanceUnit": "Naúrar Inductance",
      "henries": "Henry (H)",
      "millihenries": "Millihenries (mH)",
      "microhenries": "Microhenries (µH)",
      "capacitance": "Capacitance",
      "capacitanceUnit": "Naúrar Capacitance",
      "farads": "Farads (F)",
      "microfarads": "Microfarads (µF)",
      "nanofarads": "Nanofarads (nF)",
      "picofarads": "Picofarads (pF)",
      "frequency": "Mitar tantancewa",
      "frequencyUnit": "Naúrar mita",
      "hertz": "Hertz (Hz)",
      "kilohertz": "Kilohertz (kHz)",
      "voltage": "Tushen wutan lantarki (V RMS)",
      "accuracyNote": "Madaidaici dunƙule, ƙirar RLC madaidaiciya kawai. Yanayin layi ɗaya yana nufin R, L da C duk suna cikin layi ɗaya. Yana watsi da juriya, parasitics, juriya na coil, impedance tushe, sassan da ba na layi ba, haɗar kaya da aminci. Ba ya tabbatar da ainihin kewayawa ko zaɓi sassa. Bincika takaddun bayanai kuma tuntuɓi ƙwararrun ƙwararrun kafin gini ko amfani da kayan aiki na gaske. Gudun gida; babu upload.",
      "chartTitle": "Tashin hankali a fadin mita",
      "chartDescription": "Mitar log-mita daga kashi ɗaya cikin goma zuwa sau goma na mitar resonant. Lanƙwan yana nuna madaidaicin girman girman kai don jerin da aka zaɓa ko topology a layi daya."
    },
    "actions": {
      "calculate": "Yi lissafin kewaye RLC",
      "reset": "Sake saiti",
      "copy": "Kwafi sakamakon",
      "example": "Loda misali",
      "result": "Sakamakon RLC"
    },
    "messages": {
      "copied": "An kwafi sakamakon.",
      "copyUnavailable": "Babu kwafi a cikin wannan burauzar.",
      "calculated": "Ƙimar RLC.",
      "checkInputs": "Duba R, L, C, mita, ƙarfin lantarki, topology da raka'a.",
      "model": "Samfura",
      "resonance": "Resonant mita",
      "qualityFactor": "Matsayi mai inganci (Q)",
      "bandwidth": "Ƙimar bandwidth",
      "inductiveReactance": "Reactance Inductive (XL)",
      "capacitiveReactance": "Reactance Reactance (XC)",
      "complexImpedance": "Complex impedance (R + jX)",
      "impedanceMagnitudePhase": "Impedance girma / lokaci",
      "current": "Tushen halin yanzu (madaidaicin RMS)"
    },
    "additionalFaqs": [
      {
        "question": "Menene ma'anar mitar resonant?",
        "answer": "Don ingantaccen inductor L da capacitor C, f₀ = 1/(2π√(LC)). Yi amfani da henries da farads don samun hertz. Resistor yana canza damping da Q, ba wannan madaidaicin tsarin resonance na LC ba."
      },
      {
        "question": "Ta yaya jerin da na'urorin RLC masu kama da juna suka bambanta?",
        "answer": "A resonance, ingantaccen jerin RLC yana da ƙaramin impedance daidai da R; daidaitaccen daidaitaccen RLC yana da matsakaicin matsananciyar ƙarfi daidai da R. Halin halin yanzu da ƙarfin lantarki don haka ya bambanta duk da cewa f₀ manufa ɗaya ce."
      },
      {
        "question": "Ta yaya ake lissafin Q da bandwidth?",
        "answer": "Don samfurin jerin, Q = ω₀L / R da bandwidth shine R / (2πL). Don ƙirar layi ɗaya, Q = R/(ω₀L) kuma bandwidth shine 1/(2πRC). Waɗannan su ne manufa guda-resonance dangantaka."
      },
      {
        "question": "Shin wannan samfurin ya ƙunshi haƙƙin haƙƙin ɓangarori na gaske?",
        "answer": "A'a. Yana ɗauka manufa, madaidaiciya, lumped R, L da C abubuwan. Parasitics, juriya na inductor, rashin ƙarfi na tushe, lodi da kuma bambancin sassa na iya jujjuya ko daskarar da da'irori na gaske."
      },
      {
        "question": "Shin wannan kalkuleta zai iya tabbatar da da'ira a matsayin mai lafiya?",
        "answer": "A'a. Kiyasin ilimi ne, ba amincewar ƙira ko ƙimar aminci ba. Tabbatar da ƙima na sassa da halayya ta zahiri tare da takaddun bayanai da ƙwararrun nazarin injiniya."
      }
    ]
  },
  "tl": {
    "copyLanguage": "tl",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC Circuit Calculator",
    "title": "RLC Circuit Calculator Libre at Walang | UsefulVerse",
    "description": "Maghanap ng RLC resonance, Q, bandwidth at impedance para sa mga serye o parallel na circuit. Libre, lokal at walang limitasyon.",
    "intro": "Pumili ng isang serye o parallel na modelo ng RLC, ilagay ang mga halaga ng bahagi, at siyasatin ang resonance at impedance sa frequency na iyong pinili.",
    "howQuestion": "Paano mo kinakalkula ang resonance ng RLC?",
    "howAnswer": "Para sa perpektong bukol na bahagi, ang dalas ng resonant ay 1/(2π√(LC)). Ang kadahilanan ng kalidad at bandwidth ay nakasalalay sa kung ang risistor ay nasa serye o parallel. Sinusuri din ng calculator na ito ang kumplikadong impedance sa iyong napiling frequency.",
    "privacyQuestion": "Na-upload ba ang aking mga halaga ng circuit?",
    "privacyAnswer": "Hindi. Ang math at response curve ay tumatakbo sa browser na ito; ang iyong mga inilagay na halaga ay hindi na-upload o nai-save.",
    "fields": {
      "topology": "Topology ng circuit",
      "series": "Serye ng RLC",
      "parallel": "Parallel RLC",
      "resistance": "Paglaban (Ω)",
      "inductance": "Inductance",
      "inductanceUnit": "Unit ng inductance",
      "henries": "Henry (H)",
      "millihenries": "Millihenries (mH)",
      "microhenries": "Microhenries (µH)",
      "capacitance": "Kapasidad",
      "capacitanceUnit": "Yunit ng kapasidad",
      "farads": "Farads (F)",
      "microfarads": "Microfarads (µF)",
      "nanofarads": "Nanofarads (nF)",
      "picofarads": "Picofarads (pF)",
      "frequency": "Dalas ng pagsusuri",
      "frequencyUnit": "Unit ng dalas",
      "hertz": "Hertz (Hz)",
      "kilohertz": "Kilohertz (kHz)",
      "voltage": "Pinagmulan ng boltahe (V RMS)",
      "accuracyNote": "Tamang-tama na bukol, linear na modelo ng RLC lamang. Parallel mode ay nangangahulugan na ang R, L at C ay magkatulad. Binabalewala nito ang mga tolerance, parasitics, coil resistance, source impedance, nonlinear parts, load coupling at kaligtasan. Hindi nito pinatutunayan ang isang tunay na circuit o mga piling bahagi. Suriin ang mga datasheet at kumunsulta sa isang kwalipikadong propesyonal bago bumuo o gumamit ng tunay na hardware. Tumatakbo nang lokal; walang upload.",
      "chartTitle": "Impedance sa dalas",
      "chartDescription": "Log-frequency sweep mula sa ikasampu hanggang sampung beses ang resonant frequency. Ang curve ay nagpapakita ng perpektong impedance magnitude para sa napiling serye o parallel topology."
    },
    "actions": {
      "calculate": "Kalkulahin ang RLC circuit",
      "reset": "I-reset",
      "copy": "Kopyahin ang mga resulta",
      "example": "Halimbawa ng pag-load",
      "result": "Mga resulta ng RLC"
    },
    "messages": {
      "copied": "Nakopya ang mga resulta.",
      "copyUnavailable": "Hindi available ang kopya sa browser na ito.",
      "calculated": "Kinakalkula ang pagtatantya ng RLC.",
      "checkInputs": "Suriin ang R, L, C, dalas, boltahe, topology at mga yunit.",
      "model": "Modelo",
      "resonance": "Resonant frequency",
      "qualityFactor": "Salik ng kalidad (Q)",
      "bandwidth": "Tinatayang bandwidth",
      "inductiveReactance": "Inductive reactance (XL)",
      "capacitiveReactance": "Capacitive reactance (XC)",
      "complexImpedance": "Kumplikadong impedance (R + jX)",
      "impedanceMagnitudePhase": "Impedance magnitude / phase",
      "current": "Pinagmulan ng kasalukuyang (perpektong RMS)"
    },
    "additionalFaqs": [
      {
        "question": "Ano ang resonant frequency formula?",
        "answer": "Para sa perpektong inductor L at capacitor C, f₀ = 1/(2π√(LC)). Gumamit ng henries at farads upang makakuha ng hertz. Ang risistor ay nagbabago ng pamamasa at Q, hindi ito perpektong LC resonance formula."
      },
      {
        "question": "Paano naiiba ang mga serye at parallel na RLC circuit?",
        "answer": "Sa resonance, ang isang perpektong serye ng RLC ay may pinakamababang impedance na katumbas ng R; isang perpektong parallel RLC ay may pinakamataas na impedance katumbas ng R. Kasalukuyan at boltahe pag-uugali samakatuwid ay naiiba kahit na ideal f₀ ay pareho."
      },
      {
        "question": "Paano kinakalkula ang Q at bandwidth?",
        "answer": "Para sa modelo ng serye, ang Q = ω₀L/R at ang bandwidth ay R/(2πL). Para sa parallel model, Q = R/(ω₀L) at bandwidth ay 1/(2πRC). Ang mga ito ay perpektong single-resonance na relasyon."
      },
      {
        "question": "Kasama ba sa modelong ito ang mga tunay na pagpapahintulot sa bahagi?",
        "answer": "Hindi. Ipinapalagay nito ang perpekto, linear, lumped R, L at C na mga bahagi. Ang mga parasitiko, inductor winding resistance, source impedance, loading at component variation ay maaaring maglipat o mamasa-masa ang mga tunay na circuit."
      },
      {
        "question": "Maaari bang patunayan ng calculator na ito na ligtas ang isang circuit?",
        "answer": "Hindi. Ito ay isang pagtatantya sa edukasyon, hindi isang pag-apruba sa disenyo o pagtatasa sa kaligtasan. Kumpirmahin ang mga rating ng bahagi at pag-uugali sa totoong mundo gamit ang mga datasheet at kwalipikadong pagsusuri sa engineering."
      }
    ]
  },
  "ta": {
    "copyLanguage": "ta",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC சர்க்யூட் கால்குலேட்டர்",
    "title": "RLC சர்க்யூட் கால்குலேட்டர் இலவசம் & | UsefulVerse",
    "description": "தொடர் அல்லது இணை சுற்றுகளுக்கான RLC அதிர்வு, Q, அலைவரிசை மற்றும் மின்மறுப்பு ஆகியவற்றைக் கண்டறியவும். இலவசம், உள்ளூர் மற்றும் வரம்பற்றது.",
    "intro": "ஒரு தொடர் அல்லது இணையான RLC மாதிரியைத் தேர்வுசெய்து, கூறு மதிப்புகளை உள்ளிடவும், மேலும் நீங்கள் தேர்ந்தெடுக்கும் அதிர்வெண்ணில் அதிர்வு மற்றும் மின்மறுப்பை ஆய்வு செய்யவும்.",
    "howQuestion": "RLC அதிர்வுகளை எவ்வாறு கணக்கிடுவது?",
    "howAnswer": "சிறந்த லம்ப் செய்யப்பட்ட கூறுகளுக்கு, அதிர்வு அதிர்வெண் 1/(2π√(LC)) ஆகும். தரக் காரணி மற்றும் அலைவரிசை ஆகியவை மின்தடையம் தொடரில் உள்ளதா அல்லது இணையாக உள்ளதா என்பதைப் பொறுத்தது. இந்த கால்குலேட்டர் நீங்கள் தேர்ந்தெடுத்த அதிர்வெண்ணில் சிக்கலான மின்மறுப்பை மதிப்பிடுகிறது.",
    "privacyQuestion": "எனது சுற்று மதிப்புகள் பதிவேற்றப்பட்டதா?",
    "privacyAnswer": "எண். இந்த உலாவியில் கணிதம் மற்றும் பதில் வளைவு இயங்குகிறது; நீங்கள் உள்ளிட்ட மதிப்புகள் பதிவேற்றம் செய்யப்படவில்லை அல்லது சேமிக்கப்படவில்லை.",
    "fields": {
      "topology": "சர்க்யூட் டோபாலஜி",
      "series": "தொடர் RLC",
      "parallel": "இணை RLC",
      "resistance": "எதிர்ப்பு (Ω)",
      "inductance": "தூண்டல்",
      "inductanceUnit": "தூண்டல் அலகு",
      "henries": "ஹென்றிஸ் (எச்)",
      "millihenries": "மில்லிஹென்ரிஸ் (mH)",
      "microhenries": "மைக்ரோஹென்ரிஸ் (µH)",
      "capacitance": "கொள்ளளவு",
      "capacitanceUnit": "கொள்ளளவு அலகு",
      "farads": "ஃபராட்ஸ் (எஃப்)",
      "microfarads": "மைக்ரோஃபாரட்ஸ் (µF)",
      "nanofarads": "நானோஃபராட்ஸ் (nF)",
      "picofarads": "பிகோஃபாரட்ஸ் (pF)",
      "frequency": "மதிப்பிடுவதற்கான அதிர்வெண்",
      "frequencyUnit": "அதிர்வெண் அலகு",
      "hertz": "ஹெர்ட்ஸ் (Hz)",
      "kilohertz": "கிலோஹெர்ட்ஸ் (kHz)",
      "voltage": "மூல மின்னழுத்தம் (V RMS)",
      "accuracyNote": "ஐடியல் லம்ப்ட், லீனியர் ஆர்எல்சி மாடல் மட்டும். பேரலல் பயன்முறை என்றால் ஆர், எல் மற்றும் சி அனைத்தும் இணையாக உள்ளன. இது சகிப்புத்தன்மை, ஒட்டுண்ணிகள், சுருள் எதிர்ப்பு, மூல மின்மறுப்பு, நேரியல் அல்லாத பாகங்கள், சுமை இணைப்பு மற்றும் பாதுகாப்பு ஆகியவற்றை புறக்கணிக்கிறது. இது உண்மையான சுற்று அல்லது தேர்ந்தெடுக்கப்பட்ட பகுதிகளை சான்றளிக்காது. உண்மையான வன்பொருளை உருவாக்குவதற்கு அல்லது பயன்படுத்துவதற்கு முன் தரவுத்தாள்களைச் சரிபார்த்து, தகுதிவாய்ந்த நிபுணரை அணுகவும். உள்நாட்டில் இயங்குகிறது; பதிவேற்றம் இல்லை.",
      "chartTitle": "அதிர்வெண் முழுவதும் மின்மறுப்பு",
      "chartDescription": "பதிவு அதிர்வெண் ஸ்வீப் ஒரு பத்தில் இருந்து பத்து மடங்கு அதிர்வு அதிர்வெண். வளைவானது தேர்ந்தெடுக்கப்பட்ட தொடர் அல்லது இணையான இடவியலுக்கான சிறந்த மின்மறுப்பு அளவைக் காட்டுகிறது."
    },
    "actions": {
      "calculate": "RLC சுற்று கணக்கிடவும்",
      "reset": "மீட்டமை",
      "copy": "முடிவுகளை நகலெடுக்கவும்",
      "example": "ஏற்ற உதாரணம்",
      "result": "RLC முடிவுகள்"
    },
    "messages": {
      "copied": "முடிவுகள் நகலெடுக்கப்பட்டன.",
      "copyUnavailable": "இந்த உலாவியில் நகல் கிடைக்கவில்லை.",
      "calculated": "RLC மதிப்பீடு கணக்கிடப்பட்டது.",
      "checkInputs": "R, L, C, அதிர்வெண், மின்னழுத்தம், இடவியல் மற்றும் அலகுகளை சரிபார்க்கவும்.",
      "model": "மாதிரி",
      "resonance": "அதிர்வு அதிர்வெண்",
      "qualityFactor": "தரக் காரணி (கே)",
      "bandwidth": "தோராயமான அலைவரிசை",
      "inductiveReactance": "தூண்டல் எதிர்வினை (XL)",
      "capacitiveReactance": "கொள்ளளவு எதிர்வினை (XC)",
      "complexImpedance": "சிக்கலான மின்மறுப்பு (R + jX)",
      "impedanceMagnitudePhase": "மின்மறுப்பு அளவு / கட்டம்",
      "current": "மூல மின்னோட்டம் (சிறந்த RMS)"
    },
    "additionalFaqs": [
      {
        "question": "அதிர்வு அதிர்வெண் சூத்திரம் என்றால் என்ன?",
        "answer": "ஒரு சிறந்த மின்தூண்டி L மற்றும் மின்தேக்கி Cக்கு, f₀ = 1/(2π√(LC)). ஹெர்ட்ஸைப் பெற ஹென்ரிஸ் மற்றும் ஃபாரட்களைப் பயன்படுத்தவும். மின்தடையானது damping மற்றும் Q ஐ மாற்றுகிறது, இந்த சிறந்த LC அதிர்வு சூத்திரம் அல்ல."
      },
      {
        "question": "தொடர் மற்றும் இணையான RLC சுற்றுகள் எவ்வாறு வேறுபடுகின்றன?",
        "answer": "எதிரொலியில், ஒரு சிறந்த தொடர் RLC ஆனது Rக்கு சமமான குறைந்தபட்ச மின்மறுப்பைக் கொண்டுள்ளது; ஒரு சிறந்த இணையான RLC ஆனது R க்கு சமமான அதிகபட்ச மின்மறுப்பைக் கொண்டுள்ளது. தற்போதைய மற்றும் மின்னழுத்த நடத்தை சிறந்த f₀ ஒரே மாதிரியாக இருந்தாலும் வேறுபடுகிறது."
      },
      {
        "question": "Q மற்றும் அலைவரிசை எவ்வாறு கணக்கிடப்படுகிறது?",
        "answer": "தொடர் மாதிரிக்கு, Q = ω₀L/R மற்றும் அலைவரிசை R/(2πL) ஆகும். இணை மாதிரிக்கு, Q = R/(ω₀L) மற்றும் அலைவரிசை 1/(2πRC) ஆகும். இவை சிறந்த ஒற்றை-அதிர்வு உறவுகள்."
      },
      {
        "question": "இந்த மாதிரியில் உண்மையான கூறு சகிப்புத்தன்மை உள்ளதா?",
        "answer": "எண். இது இலட்சிய, நேரியல், கட்டி R, L மற்றும் C கூறுகளை எடுத்துக்கொள்கிறது. ஒட்டுண்ணிகள், தூண்டல் முறுக்கு எதிர்ப்பு, மூல மின்மறுப்பு, ஏற்றுதல் மற்றும் கூறு மாறுபாடு ஆகியவை உண்மையான சுற்றுகளை மாற்றலாம் அல்லது ஈரப்படுத்தலாம்."
      },
      {
        "question": "இந்த கால்குலேட்டர் ஒரு சுற்று பாதுகாப்பானது என சான்றளிக்க முடியுமா?",
        "answer": "இல்லை. இது ஒரு கல்வி மதிப்பீடு, வடிவமைப்பு ஒப்புதல் அல்லது பாதுகாப்பு மதிப்பீடு அல்ல. தரவுத்தாள்கள் மற்றும் தகுதிவாய்ந்த பொறியியல் மதிப்பாய்வு மூலம் கூறு மதிப்பீடுகள் மற்றும் நிஜ உலக நடத்தையை உறுதிப்படுத்தவும்."
      }
    ]
  },
  "fa": {
    "copyLanguage": "fa",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "ماشین حساب مدار RLC",
    "title": "ماشین حساب مدار RLC رایگان و نامحدود | UsefulVerse",
    "description": "رزونانس RLC، Q، پهنای باند و امپدانس مدارهای سری یا موازی را بیابید. رایگان، محلی و نامحدود.",
    "intro": "یک مدل RLC سری یا موازی را انتخاب کنید، مقادیر جزء را وارد کنید و رزونانس به اضافه امپدانس را در فرکانس انتخابی خود بررسی کنید.",
    "howQuestion": "چگونه رزونانس RLC را محاسبه می کنید؟",
    "howAnswer": "برای اجزای توده ای ایده آل، فرکانس تشدید 1/(2π√(LC)) است. فاکتور کیفیت و پهنای باند به سری یا موازی بودن مقاومت بستگی دارد. این ماشین حساب همچنین امپدانس پیچیده را در فرکانس انتخابی شما ارزیابی می کند.",
    "privacyQuestion": "آیا مقادیر مدار من آپلود شده است؟",
    "privacyAnswer": "خیر. منحنی ریاضی و پاسخ در این مرورگر اجرا می شود. مقادیر وارد شده شما آپلود یا ذخیره نمی شوند.",
    "fields": {
      "topology": "توپولوژی مدار",
      "series": "سری RLC",
      "parallel": "RLC موازی",
      "resistance": "مقاومت (Ω)",
      "inductance": "اندوکتانس",
      "inductanceUnit": "واحد اندوکتانس",
      "henries": "هنریس (H)",
      "millihenries": "Millihenries (mH)",
      "microhenries": "میکروهنری (µH)",
      "capacitance": "ظرفیت",
      "capacitanceUnit": "واحد ظرفیت",
      "farads": "فرادز (F)",
      "microfarads": "میکروفاراد (μF)",
      "nanofarads": "نانوفارادها (nF)",
      "picofarads": "پیکوفاراد (pF)",
      "frequency": "فرکانس ارزیابی",
      "frequencyUnit": "واحد فرکانس",
      "hertz": "هرتز (هرتز)",
      "kilohertz": "کیلوهرتز (کیلوهرتز)",
      "voltage": "ولتاژ منبع (V RMS)",
      "accuracyNote": "فقط مدل RLC خطی و توده ای ایده آل. حالت موازی یعنی R، L و C همه موازی هستند. این تلورانس ها، انگلی ها، مقاومت سیم پیچ، امپدانس منبع، قطعات غیرخطی، کوپلینگ بار و ایمنی را نادیده می گیرد. مدار واقعی را تأیید نمی کند یا قطعات را انتخاب نمی کند. قبل از ساخت یا استفاده از سخت افزار واقعی، برگه های داده را بررسی کنید و با یک متخصص واجد شرایط مشورت کنید. به صورت محلی اجرا می شود؛ بدون آپلود",
      "chartTitle": "امپدانس در فرکانس",
      "chartDescription": "جابجایی Log-frequency از یک دهم تا ده برابر فرکانس تشدید. منحنی بزرگی امپدانس ایده آل را برای سری انتخاب شده یا توپولوژی موازی نشان می دهد."
    },
    "actions": {
      "calculate": "مدار RLC را محاسبه کنید",
      "reset": "بازنشانی کنید",
      "copy": "نتایج را کپی کنید",
      "example": "بارگذاری مثال",
      "result": "نتایج RLC"
    },
    "messages": {
      "copied": "نتایج کپی شد.",
      "copyUnavailable": "کپی در این مرورگر موجود نیست.",
      "calculated": "برآورد RLC محاسبه شد.",
      "checkInputs": "R، L، C، فرکانس، ولتاژ، توپولوژی و واحدها را بررسی کنید.",
      "model": "مدل",
      "resonance": "فرکانس تشدید",
      "qualityFactor": "فاکتور کیفیت (Q)",
      "bandwidth": "پهنای باند تقریبی",
      "inductiveReactance": "راکتانس القایی (XL)",
      "capacitiveReactance": "راکتانس خازنی (XC)",
      "complexImpedance": "امپدانس پیچیده (R + jX)",
      "impedanceMagnitudePhase": "بزرگی امپدانس / فاز",
      "current": "جریان منبع (RMS ایده آل)"
    },
    "additionalFaqs": [
      {
        "question": "فرمول فرکانس تشدید چیست؟",
        "answer": "برای یک سلف ایده آل L و خازن C، f₀ = 1/(2π√(LC)). برای بدست آوردن هرتز از هانری و فاراد استفاده کنید. مقاومت میرایی و Q را تغییر می دهد، نه این فرمول رزونانس LC ایده آل."
      },
      {
        "question": "مدارهای RLC سری و موازی چگونه متفاوت هستند؟",
        "answer": "در تشدید، یک سری RLC ایده آل دارای حداقل امپدانس برابر با R است. یک RLC موازی ایده آل دارای حداکثر امپدانس برابر با R است. بنابراین رفتار جریان و ولتاژ متفاوت است حتی اگر f0 ایده آل یکسان باشد."
      },
      {
        "question": "Q و پهنای باند چگونه محاسبه می شود؟",
        "answer": "برای مدل سری، Q = ω₀L/R و پهنای باند R/(2πL) است. برای مدل موازی، Q = R/(ω₀L) و پهنای باند 1/(2πRC) است. اینها روابط تک رزونانس ایده آلی هستند."
      },
      {
        "question": "آیا این مدل شامل تلورانس های واقعی اجزا است؟",
        "answer": "خیر. اجزای R، L و C ایده‌آل، خطی، توده‌ای را در نظر می‌گیرد. انگل‌ها، مقاومت سیم‌پیچ سلف، امپدانس منبع، بارگذاری و تغییرات اجزا می‌توانند مدارهای واقعی را تغییر داده یا مرطوب کنند."
      },
      {
        "question": "آیا این ماشین حساب می تواند یک مدار را ایمن بودن تایید کند؟",
        "answer": "خیر. این یک برآورد آموزشی است، نه یک تاییدیه طراحی یا ارزیابی ایمنی. رتبه بندی اجزا و رفتار در دنیای واقعی را با برگه های داده و بررسی مهندسی واجد شرایط تأیید کنید."
      }
    ]
  },
  "am": {
    "copyLanguage": "am",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC የወረዳ ካልኩሌተር",
    "title": "RLC የወረዳ ማስያ ነጻ & ያልተገደበ | UsefulVerse",
    "description": "ለተከታታይ ወይም በትይዩ ወረዳዎች RLC ሬዞናንስ፣ Q፣ ባንድዊድዝ እና impedance ያግኙ። ነፃ ፣ አካባቢያዊ እና ያልተገደበ።",
    "intro": "ተከታታይ ወይም ትይዩ RLC ሞዴል ምረጥ፣ የመለዋወጫ እሴቶችን አስገባ እና በመረጥከው ድግግሞሽ ሬዞናንስ ፕላስ ኢምፔዳንስን መርምር።",
    "howQuestion": "የ RLC ድምጽን እንዴት ያሰሉታል?",
    "howAnswer": "ለጥሩ ጥቅጥቅ ያሉ ክፍሎች፣ የማስተጋባት ድግግሞሽ 1/(2π√(LC)) ነው። የጥራት ደረጃ እና የመተላለፊያ ይዘት የሚወሰነው ተቃዋሚው በተከታታይ ወይም ትይዩ እንደሆነ ነው። ይህ ካልኩሌተር በመረጡት ድግግሞሽ ላይ ውስብስብ እክልን ይገመግማል።",
    "privacyQuestion": "የወረዳ እሴቶቼ ተሰቅለዋል?",
    "privacyAnswer": "በዚህ አሳሽ ውስጥ የሂሳብ እና የምላሽ ጥምዝ ይሠራል; የገቡት ዋጋዎች አልተሰቀሉም ወይም አልተቀመጡም።",
    "fields": {
      "topology": "የወረዳ ቶፖሎጂ",
      "series": "ተከታታይ RLC",
      "parallel": "ትይዩ RLC",
      "resistance": "መቋቋም (Ω)",
      "inductance": "መነሳሳት።",
      "inductanceUnit": "የኢንደክሽን ክፍል",
      "henries": "ሄንሪስ (ኤች)",
      "millihenries": "ሚሊሄንሪ (ኤምኤች)",
      "microhenries": "ማይክሮኤነሪዎች (µH)",
      "capacitance": "አቅም",
      "capacitanceUnit": "አቅም አሃድ",
      "farads": "ፋራድስ (ኤፍ)",
      "microfarads": "ማይክሮፋራዶች (µኤፍ)",
      "nanofarads": "ናኖፋራድስ (ኤንኤፍ)",
      "picofarads": "ፒኮፋራድስ (ፒኤፍ)",
      "frequency": "ለመገምገም ድግግሞሽ",
      "frequencyUnit": "የድግግሞሽ ክፍል",
      "hertz": "ሄርትዝ (ኤች)",
      "kilohertz": "ኪሎኸርትዝ (kHz)",
      "voltage": "የምንጭ ቮልቴጅ (V RMS)",
      "accuracyNote": "በጣም ጥሩ ቋጠሮ፣ መስመራዊ RLC ሞዴል ብቻ። ትይዩ ሞድ ማለት R፣ L እና C ሁሉም በትይዩ ናቸው። መቻቻልን ፣ ጥገኛ ተውሳኮችን ፣ የጥቅል መቋቋምን ፣ የምንጭ መጨናነቅን ፣ የመስመር ላይ ያልሆኑ ክፍሎችን ፣ የጭነት ማያያዣዎችን እና ደህንነትን ችላ ይላል። የእውነተኛውን ዑደት አያረጋግጥም ወይም ክፍሎችን አይመርጥም. እውነተኛ ሃርድዌር ከመገንባቱ ወይም ከመጠቀምዎ በፊት የውሂብ ሉሆችን ይፈትሹ እና ብቃት ያለው ባለሙያ ያማክሩ። በአካባቢው ይሠራል; ሰቀላ የለም።",
      "chartTitle": "በተደጋጋሚ ድግግሞሽ",
      "chartDescription": "የምዝግብ ማስታወሻ-ድግግሞሽ መጥረግ ከአንድ አስረኛ ወደ አስር እጥፍ የሚያስተጋባ ድግግሞሽ። ኩርባው ለተመረጡት ተከታታዮች ወይም ትይዩ ቶፖሎጂ ተስማሚ የሆነ የኢምፔዳንስ መጠን ያሳያል።"
    },
    "actions": {
      "calculate": "የ RLC ወረዳን አስላ",
      "reset": "ዳግም አስጀምር",
      "copy": "ውጤቶችን ቅዳ",
      "example": "ምሳሌ ጫን",
      "result": "የ RLC ውጤቶች"
    },
    "messages": {
      "copied": "ውጤቶች ተቀድተዋል።",
      "copyUnavailable": "ቅጂ በዚህ አሳሽ ውስጥ አይገኝም።",
      "calculated": "የ RLC ግምት ይሰላል።",
      "checkInputs": "R, L, C, ድግግሞሽ, ቮልቴጅ, ቶፖሎጂ እና አሃዶችን ያረጋግጡ.",
      "model": "ሞዴል",
      "resonance": "አስተጋባ ድግግሞሽ",
      "qualityFactor": "የጥራት ደረጃ (Q)",
      "bandwidth": "ግምታዊ የመተላለፊያ ይዘት",
      "inductiveReactance": "ኢንዳክቲቭ ምላሽ (ኤክስኤል)",
      "capacitiveReactance": "አቅም ያለው ምላሽ (ኤክስሲ)",
      "complexImpedance": "ውስብስብ መከላከያ (R + jX)",
      "impedanceMagnitudePhase": "የኢምፔዳንስ መጠን / ደረጃ",
      "current": "የአሁኑ ምንጭ (ተስማሚ RMS)"
    },
    "additionalFaqs": [
      {
        "question": "የሚያስተጋባ ድግግሞሽ ቀመር ምንድን ነው?",
        "answer": "ለአንድ ተስማሚ ኢንዳክተር L እና capacitor C፣ f₀ = 1/(2π√(LC))። ኸርትዝ ለማግኘት ሄንሪ እና ፋራዶችን ይጠቀሙ። የ resistor damping እና Q ይለውጣል, ይህ ተስማሚ LC ሬዞናንስ ቀመር አይደለም."
      },
      {
        "question": "ተከታታይ እና ትይዩ የ RLC ወረዳዎች እንዴት ይለያያሉ?",
        "answer": "በሬዞናንስ ፣ ሃሳባዊ ተከታታይ RLC ከ R ጋር እኩል የሆነ ዝቅተኛ መከላከያ አለው። አንድ ሃሳባዊ ትይዩ RLC ከፍተኛው impedance R ጋር እኩል ነው. የአሁን እና የቮልቴጅ ባህሪ ስለዚህ ፍጹም f₀ ተመሳሳይ ቢሆንም ይለያያል."
      },
      {
        "question": "Q እና የመተላለፊያ ይዘት እንዴት ይሰላሉ?",
        "answer": "ለተከታታይ ሞዴል፣ Q = ω₀L/R እና የመተላለፊያ ይዘት R/(2πL) ነው። ለትይዩ ሞዴል፣ Q = R/(ω₀L) እና የመተላለፊያ ይዘት 1/(2πRC) ነው። እነዚህ ተስማሚ ነጠላ-ሬዞናንስ ግንኙነቶች ናቸው."
      },
      {
        "question": "ይህ ሞዴል የእውነተኛ አካላት መቻቻልን ያካትታል?",
        "answer": "አይ እሱ ሃሳባዊ፣ መስመራዊ፣ lumped R፣ L እና C ክፍሎችን ይወስዳል። ጥገኛ ተውሳኮች፣ የኢንደክተር ጠመዝማዛ መቋቋም፣ የምንጭ መጨናነቅ፣ የመጫኛ እና የአካላት ልዩነት የእውነተኛ ወረዳዎችን መቀየር ወይም እርጥበት ሊያመጣ ይችላል።"
      },
      {
        "question": "ይህ ካልኩሌተር ወረዳን ደህንነቱ የተጠበቀ መሆኑን ማረጋገጥ ይችላል?",
        "answer": "አይደለም ትምህርታዊ ግምት እንጂ የንድፍ ማረጋገጫ ወይም የደህንነት ግምገማ አይደለም። የክፍል ደረጃዎችን እና የገሃዱ ዓለም ባህሪን በመረጃ ሉህ እና ብቁ የምህንድስና ግምገማ ያረጋግጡ።"
      }
    ]
  },
  "gu": {
    "copyLanguage": "gu",
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-09",
    "name": "RLC સર્કિટ કેલ્ક્યુલેટર",
    "title": "RLC સર્કિટ કેલ્ક્યુલેટર ફ્રી અને અમર્યાદિત | UsefulVerse",
    "description": "શ્રેણી અથવા સમાંતર સર્કિટ માટે આરએલસી રેઝોનન્સ, ક્યૂ, બેન્ડવિડ્થ અને અવરોધ શોધો. મફત, સ્થાનિક અને અમર્યાદિત.",
    "intro": "શ્રેણી અથવા સમાંતર RLC મોડેલ પસંદ કરો, ઘટક મૂલ્યો દાખલ કરો અને તમે પસંદ કરો છો તે આવર્તન પર રેઝોનન્સ વત્તા અવરોધનું નિરીક્ષણ કરો.",
    "howQuestion": "તમે RLC રેઝોનન્સની ગણતરી કેવી રીતે કરશો?",
    "howAnswer": "આદર્શ લમ્પ્ડ ઘટકો માટે, રેઝોનન્ટ આવર્તન 1/(2π√(LC)) છે. ગુણવત્તા પરિબળ અને બેન્ડવિડ્થ રેઝિસ્ટર શ્રેણીમાં છે કે સમાંતર છે તેના પર આધાર રાખે છે. આ કેલ્ક્યુલેટર તમારી પસંદ કરેલી આવર્તન પર જટિલ અવબાધનું પણ મૂલ્યાંકન કરે છે.",
    "privacyQuestion": "શું મારા સર્કિટ મૂલ્યો અપલોડ થયા છે?",
    "privacyAnswer": "નંબર. આ બ્રાઉઝરમાં ગણિત અને પ્રતિભાવ વળાંક ચાલે છે; તમારા દાખલ કરેલ મૂલ્યો અપલોડ કે સાચવવામાં આવતા નથી.",
    "fields": {
      "topology": "સર્કિટ ટોપોલોજી",
      "series": "શ્રેણી RLC",
      "parallel": "સમાંતર RLC",
      "resistance": "પ્રતિકાર (Ω)",
      "inductance": "ઇન્ડક્ટન્સ",
      "inductanceUnit": "ઇન્ડક્ટન્સ યુનિટ",
      "henries": "હેન્રીઝ (H)",
      "millihenries": "Millihenries (mH)",
      "microhenries": "માઇક્રોહેનરીઝ (µH)",
      "capacitance": "ક્ષમતા",
      "capacitanceUnit": "ક્ષમતા એકમ",
      "farads": "ફેરાડ્સ (એફ)",
      "microfarads": "માઇક્રોફારાડ્સ (µF)",
      "nanofarads": "નેનોફારાડ્સ (nF)",
      "picofarads": "પીકોફારાડ્સ (પીએફ)",
      "frequency": "મૂલ્યાંકન કરવાની આવર્તન",
      "frequencyUnit": "આવર્તન એકમ",
      "hertz": "હર્ટ્ઝ (હર્ટ્ઝ)",
      "kilohertz": "કિલોહર્ટ્ઝ (kHz)",
      "voltage": "સ્ત્રોત વોલ્ટેજ (V RMS)",
      "accuracyNote": "આદર્શ લમ્પ્ડ, રેખીય RLC મોડલ માત્ર. સમાંતર સ્થિતિ એટલે R, L અને C બધા સમાંતર છે. તે સહનશીલતા, પરોપજીવી, કોઇલ પ્રતિકાર, સ્ત્રોત અવબાધ, બિનરેખીય ભાગો, લોડ જોડાણ અને સલામતીને અવગણે છે. તે વાસ્તવિક સર્કિટ અથવા પસંદ કરેલા ભાગોને પ્રમાણિત કરતું નથી. વાસ્તવિક હાર્ડવેર બનાવતા અથવા ઉપયોગ કરતા પહેલા ડેટાશીટ્સ તપાસો અને લાયકાત ધરાવતા વ્યાવસાયિકની સલાહ લો. સ્થાનિક રીતે ચાલે છે; કોઈ અપલોડ નથી.",
      "chartTitle": "સમગ્ર આવર્તન પર અવરોધ",
      "chartDescription": "લૉગ-ફ્રિકવન્સી સ્વીપ દસમા ભાગથી રેઝોનન્ટ આવર્તનના દસ ગણા. વક્ર પસંદ કરેલ શ્રેણી અથવા સમાંતર ટોપોલોજી માટે આદર્શ અવબાધ તીવ્રતા દર્શાવે છે."
    },
    "actions": {
      "calculate": "RLC સર્કિટની ગણતરી કરો",
      "reset": "રીસેટ કરો",
      "copy": "પરિણામોની નકલ કરો",
      "example": "લોડ ઉદાહરણ",
      "result": "RLC પરિણામો"
    },
    "messages": {
      "copied": "પરિણામોની નકલ કરી.",
      "copyUnavailable": "આ બ્રાઉઝરમાં નકલ ઉપલબ્ધ નથી.",
      "calculated": "RLC અંદાજની ગણતરી.",
      "checkInputs": "આર, એલ, સી, આવર્તન, વોલ્ટેજ, ટોપોલોજી અને એકમો તપાસો.",
      "model": "મોડલ",
      "resonance": "રેઝોનન્ટ આવર્તન",
      "qualityFactor": "ગુણવત્તા પરિબળ (Q)",
      "bandwidth": "અંદાજિત બેન્ડવિડ્થ",
      "inductiveReactance": "પ્રેરક પ્રતિક્રિયા (XL)",
      "capacitiveReactance": "કેપેસિટીવ રિએક્ટન્સ (XC)",
      "complexImpedance": "જટિલ અવબાધ (R + jX)",
      "impedanceMagnitudePhase": "અવબાધ તીવ્રતા / તબક્કો",
      "current": "વર્તમાન સ્ત્રોત (આદર્શ RMS)"
    },
    "additionalFaqs": [
      {
        "question": "રેઝોનન્ટ ફ્રીક્વન્સી ફોર્મ્યુલા શું છે?",
        "answer": "આદર્શ ઇન્ડક્ટર L અને કેપેસિટર C માટે, f₀ = 1/(2π√(LC)). હર્ટ્ઝ મેળવવા માટે હેન્રી અને ફેરાડ્સનો ઉપયોગ કરો. રેઝિસ્ટર ભીનાશ અને ક્યુને બદલે છે, આ આદર્શ એલસી રેઝોનન્સ ફોર્મ્યુલા નથી."
      },
      {
        "question": "શ્રેણી અને સમાંતર RLC સર્કિટ કેવી રીતે અલગ પડે છે?",
        "answer": "રેઝોનન્સ વખતે, આદર્શ શ્રેણી RLCમાં R ની બરાબર લઘુત્તમ અવબાધ હોય છે; આદર્શ સમાંતર આરએલસીમાં મહત્તમ અવબાધ R સમાન હોય છે. વર્તમાન અને વોલ્ટેજની વર્તણૂક તેથી આદર્શ f₀ સમાન હોવા છતાં અલગ પડે છે."
      },
      {
        "question": "Q અને બેન્ડવિડ્થની ગણતરી કેવી રીતે કરવામાં આવે છે?",
        "answer": "શ્રેણી મોડેલ માટે, Q = ω₀L/R અને બેન્ડવિડ્થ R/(2πL) છે. સમાંતર મોડેલ માટે, Q = R/(ω₀L) અને બેન્ડવિડ્થ 1/(2πRC) છે. આ આદર્શ સિંગલ-રેઝોનન્સ સંબંધો છે."
      },
      {
        "question": "શું આ મોડેલમાં વાસ્તવિક ઘટક સહિષ્ણુતા શામેલ છે?",
        "answer": "ના. તે આદર્શ, રેખીય, લમ્પ્ડ R, L અને C ઘટકોને ધારે છે. પરોપજીવી, ઇન્ડક્ટર વિન્ડિંગ પ્રતિકાર, સ્ત્રોત અવબાધ, લોડિંગ અને ઘટકોની વિવિધતા વાસ્તવિક સર્કિટને શિફ્ટ અથવા ભીની કરી શકે છે."
      },
      {
        "question": "શું આ કેલ્ક્યુલેટર સર્કિટને સલામત તરીકે પ્રમાણિત કરી શકે છે?",
        "answer": "ના. તે શૈક્ષણિક અંદાજ છે, ડિઝાઇનની મંજૂરી અથવા સલામતી મૂલ્યાંકન નથી. ડેટાશીટ્સ અને લાયક એન્જિનિયરિંગ સમીક્ષા સાથે ઘટક રેટિંગ્સ અને વાસ્તવિક-વિશ્વના વર્તનની પુષ્ટિ કરો."
      }
    ]
  }
};

export default rlcCircuitCalculatorCopies;
