import { breathingExerciseEnglishCopy } from './breathing-exercise.en.mjs';

const makeCopy = (copy) => Object.freeze({
  ...copy,
  ...(copy.copyLanguage !== 'en' && copy.localizationStatus === 'machine-accepted' ? {
    localizationAcceptedBy: 'site-owner',
    localizationAcceptedAt: '2026-10-13',
  } : {}),
  fields: Object.freeze(copy.fields),
  actions: Object.freeze(copy.actions),
  messages: Object.freeze(copy.messages),
  additionalFaqs: Object.freeze(copy.additionalFaqs.map((faq) => Object.freeze(faq))),
});

const translations = {
  en: breathingExerciseEnglishCopy,
  es: {
    copyLanguage: 'es', localizationStatus: 'machine-accepted', name: 'Ejercicio de respiración', title: 'Ejercicio de respiración gratis | UsefulVerse',
    description: 'Temporizador gratis de respiración en caja, 4-7-8 o ritmo personalizado, con sonido opcional, pausa y reinicio.',
    intro: 'Elige un ritmo de respiración suave y sigue la guía visual. Mantén la sesión cómoda y detente cuando quieras.',
    howQuestion: '¿Cómo uso este ejercicio de respiración?', howAnswer: 'Elige un patrón o ajusta cada fase, selecciona la duración de la sesión y pulsa Iniciar. Puedes pausar o reiniciar cuando quieras. El sonido es opcional y comienza al iniciar.',
    privacyQuestion: '¿Se sube mi sesión de respiración?', privacyAnswer: 'No. El temporizador funciona en esta página. No se usan cuentas, cargas, API ni almacenamiento de sesiones.',
    fields: { pattern: 'Patrón de respiración', custom: 'Personalizado', balanced: 'Ritmo suave · inhalar 4 / exhalar 6', box: 'Respiración en caja · 4 / 4 / 4 / 4', fourSevenEight: '4-7-8 · inhalar 4 / retener 7 / exhalar 8', inhale: 'Inhalar (segundos)', holdIn: 'Retener tras inhalar (segundos)', exhale: 'Exhalar (segundos)', holdOut: 'Retener tras exhalar (segundos)', duration: 'Duración de la sesión (segundos)', sound: 'Señales de sonido', soundHint: 'Reproducir un tono suave al cambiar de fase', motionNote: 'La guía evita movimientos bruscos si está activada la opción de movimiento reducido.', safetyNote: 'Este temporizador es para el bienestar general, no es atención médica. Respira cómodamente y detente si te sientes mal.', phase: 'Fase actual', cycle: 'Ciclo', remaining: 'Tiempo restante', inhaleCue: 'Inhala', holdCue: 'Retén suavemente', exhaleCue: 'Exhala', complete: 'Completado' },
    actions: { start: 'Iniciar', pause: 'Pausar', resume: 'Reanudar', reset: 'Reiniciar' },
    messages: { started: 'Sesión de respiración iniciada.', paused: 'Sesión en pausa.', resumed: 'Sesión reanudada.', reset: 'Sesión reiniciada.', finished: 'Sesión completada. Respira con calma.', checkInputs: 'Introduce segundos enteros dentro de los límites indicados.', soundUnavailable: 'El sonido no está disponible aquí; la guía visual sigue funcionando.', inhaleCue: 'Inhala.', holdCue: 'Retén suavemente.', exhaleCue: 'Exhala.' },
    example: { pattern: 'box', inhaleSeconds: 4, holdAfterInhaleSeconds: 4, exhaleSeconds: 4, holdAfterExhaleSeconds: 4, durationSeconds: 60 },
    additionalFaqs: [
      { question: '¿Puedo usar la respiración en caja o 4-7-8?', answer: 'Sí. Elige un patrón o ajusta la duración de las fases. Son ritmos de respiración, no tratamientos médicos.' },
      { question: '¿Seguirá funcionando si cierro la pestaña?', answer: 'No se garantiza. El navegador puede pausar pestañas en segundo plano y el dispositivo puede suspenderse. Mantén esta página abierta y el dispositivo activo para un tiempo más fiable.' },
      { question: '¿Puedo apagar el sonido o detenerme antes?', answer: 'Sí. El sonido es opcional y puedes desactivarlo. Pausar o Reiniciar detiene el temporizador activo.' },
    ],
  },
  fr: {
    copyLanguage: 'fr', localizationStatus: 'machine-accepted', name: 'Exercice de respiration', title: 'Exercice de respiration gratuit | UsefulVerse',
    description: 'Minuteur gratuit de respiration carrée, 4-7-8 ou personnalisée. Son facultatif, pause et réinitialisation.',
    intro: 'Choisissez un rythme de respiration doux et suivez le guide visuel. Gardez une séance confortable et arrêtez-vous quand vous le souhaitez.',
    howQuestion: 'Comment utiliser cet exercice de respiration ?', howAnswer: 'Choisissez un préréglage ou configurez chaque phase, sélectionnez la durée et appuyez sur Démarrer. Vous pouvez mettre en pause ou réinitialiser à tout moment. Le son est facultatif et démarre avec la séance.',
    privacyQuestion: 'Ma séance de respiration est-elle envoyée ?', privacyAnswer: 'Non. Le minuteur fonctionne sur cette page. Aucun compte, envoi, API ou stockage de séance n’est utilisé.',
    fields: { pattern: 'Rythme respiratoire', custom: 'Personnalisé', balanced: 'Rythme doux · inspirer 4 / expirer 6', box: 'Respiration carrée · 4 / 4 / 4 / 4', fourSevenEight: '4-7-8 · inspirer 4 / retenir 7 / expirer 8', inhale: 'Inspiration (secondes)', holdIn: 'Rétention après inspiration (secondes)', exhale: 'Expiration (secondes)', holdOut: 'Rétention après expiration (secondes)', duration: 'Durée de la séance (secondes)', sound: 'Signaux sonores', soundHint: 'Jouer un son doux au changement de phase', motionNote: 'Le guide évite les mouvements brusques lorsque l’option de réduction des mouvements est activée.', safetyNote: 'Ce minuteur contribue au bien-être général, ce n’est pas un soin médical. Respirez confortablement et arrêtez-vous si vous vous sentez mal.', phase: 'Phase actuelle', cycle: 'Cycle', remaining: 'Temps restant', inhaleCue: 'Inspirez', holdCue: 'Retenez doucement', exhaleCue: 'Expirez', complete: 'Terminé' },
    actions: { start: 'Démarrer', pause: 'Pause', resume: 'Reprendre', reset: 'Réinitialiser' },
    messages: { started: 'Séance de respiration démarrée.', paused: 'Séance en pause.', resumed: 'Séance reprise.', reset: 'Séance réinitialisée.', finished: 'Séance terminée. Respirez tranquillement.', checkInputs: 'Saisissez des secondes entières dans les limites indiquées.', soundUnavailable: 'Le son n’est pas disponible ici ; le guide visuel fonctionne toujours.', inhaleCue: 'Inspirez.', holdCue: 'Retenez doucement.', exhaleCue: 'Expirez.' },
    example: { pattern: 'box', inhaleSeconds: 4, holdAfterInhaleSeconds: 4, exhaleSeconds: 4, holdAfterExhaleSeconds: 4, durationSeconds: 60 },
    additionalFaqs: [
      { question: 'Puis-je utiliser la respiration carrée ou la méthode 4-7-8 ?', answer: 'Oui. Choisissez un préréglage ou ajustez la durée des phases. Ce sont des rythmes respiratoires, pas un traitement médical.' },
      { question: 'Le minuteur continue-t-il si je ferme l’onglet ?', answer: 'Ce n’est pas garanti. Les navigateurs peuvent suspendre les onglets en arrière-plan et les appareils peuvent se mettre en veille. Gardez la page ouverte et l’appareil actif pour un minutage plus fiable.' },
      { question: 'Puis-je couper le son ou arrêter plus tôt ?', answer: 'Oui. Le son est facultatif et peut être désactivé. Pause ou Réinitialiser arrête le minutage en cours.' },
    ],
  },
  pt: {
    copyLanguage: 'pt', localizationStatus: 'machine-accepted', name: 'Exercício de respiração', title: 'Exercício de respiração grátis | UsefulVerse',
    description: 'Temporizador grátis de respiração quadrada, 4-7-8 ou ritmo personalizado. Som opcional, pausa e reinício.',
    intro: 'Escolha um ritmo de respiração suave e siga o guia visual. Mantenha a sessão confortável e pare quando quiser.',
    howQuestion: 'Como uso este exercício de respiração?', howAnswer: 'Escolha uma predefinição ou ajuste cada fase, selecione a duração da sessão e pressione Iniciar. Pause ou reinicie a qualquer momento. O som é opcional e começa com a sessão.',
    privacyQuestion: 'Minha sessão de respiração é enviada?', privacyAnswer: 'Não. O temporizador funciona nesta página. Não usa conta, envio, API ou armazenamento de sessões.',
    fields: { pattern: 'Padrão de respiração', custom: 'Personalizado', balanced: 'Ritmo leve · inspirar 4 / expirar 6', box: 'Respiração quadrada · 4 / 4 / 4 / 4', fourSevenEight: '4-7-8 · inspirar 4 / segurar 7 / expirar 8', inhale: 'Inspirar (segundos)', holdIn: 'Segurar após inspirar (segundos)', exhale: 'Expirar (segundos)', holdOut: 'Segurar após expirar (segundos)', duration: 'Duração da sessão (segundos)', sound: 'Sinais sonoros', soundHint: 'Tocar um som suave na mudança de fase', motionNote: 'O guia evita movimentos bruscos quando a opção de movimento reduzido está ativada.', safetyNote: 'Este é um temporizador para o bem-estar geral, não um atendimento médico. Respire confortavelmente e pare se não se sentir bem.', phase: 'Fase atual', cycle: 'Ciclo', remaining: 'Tempo restante', inhaleCue: 'Inspire', holdCue: 'Segure suavemente', exhaleCue: 'Expire', complete: 'Concluído' },
    actions: { start: 'Iniciar', pause: 'Pausar', resume: 'Retomar', reset: 'Reiniciar' },
    messages: { started: 'Sessão de respiração iniciada.', paused: 'Sessão pausada.', resumed: 'Sessão retomada.', reset: 'Sessão reiniciada.', finished: 'Sessão concluída. Respire com calma.', checkInputs: 'Insira segundos inteiros dentro dos limites indicados.', soundUnavailable: 'O som não está disponível aqui; o guia visual continua funcionando.', inhaleCue: 'Inspire.', holdCue: 'Segure suavemente.', exhaleCue: 'Expire.' },
    example: { pattern: 'box', inhaleSeconds: 4, holdAfterInhaleSeconds: 4, exhaleSeconds: 4, holdAfterExhaleSeconds: 4, durationSeconds: 60 },
    additionalFaqs: [
      { question: 'Posso usar a respiração quadrada ou 4-7-8?', answer: 'Sim. Escolha uma predefinição ou ajuste a duração das fases. São ritmos de respiração, não tratamento médico.' },
      { question: 'O temporizador continua se eu fechar a aba?', answer: 'Não há garantia. Navegadores podem pausar abas em segundo plano e dispositivos podem suspender. Mantenha a página aberta e o aparelho ativo para uma contagem mais confiável.' },
      { question: 'Posso desligar o som ou parar antes?', answer: 'Sim. O som é opcional e pode ser desativado. Pausar ou Reiniciar encerra a contagem ativa.' },
    ],
  },
  de: {
    copyLanguage: 'de', localizationStatus: 'machine-accepted', name: 'Atemübung', title: 'Atemübung kostenlos online | UsefulVerse',
    description: 'Kostenloser Atemtimer für Box-Atmung, 4-7-8 oder eigene Rhythmen. Optionaler Ton, Pause und Neustart.',
    intro: 'Wählen Sie einen angenehmen Atemrhythmus und folgen Sie der visuellen Anleitung. Atmen Sie entspannt und hören Sie jederzeit auf.',
    howQuestion: 'Wie verwende ich diese Atemübung?', howAnswer: 'Wählen Sie eine Voreinstellung oder legen Sie die Phasen fest, bestimmen Sie die Sitzungsdauer und drücken Sie auf Start. Sie können jederzeit pausieren oder zurücksetzen. Der Ton ist optional und beginnt mit der Sitzung.',
    privacyQuestion: 'Wird meine Atemsitzung hochgeladen?', privacyAnswer: 'Nein. Der Timer läuft auf dieser Seite. Es werden kein Konto, Upload, API oder gespeicherte Sitzungsdaten verwendet.',
    fields: { pattern: 'Atemmuster', custom: 'Individuell', balanced: 'Entspannter Rhythmus · Einatmen 4 / Ausatmen 6', box: 'Box-Atmung · 4 / 4 / 4 / 4', fourSevenEight: '4-7-8 · Einatmen 4 / Halten 7 / Ausatmen 8', inhale: 'Einatmen (Sekunden)', holdIn: 'Halten nach dem Einatmen (Sekunden)', exhale: 'Ausatmen (Sekunden)', holdOut: 'Halten nach dem Ausatmen (Sekunden)', duration: 'Sitzungsdauer (Sekunden)', sound: 'Tonsignale', soundHint: 'Sanften Ton bei Phasenwechsel abspielen', motionNote: 'Bei aktivierter Einstellung für reduzierte Bewegung vermeidet die Anleitung abrupte Bewegungen.', safetyNote: 'Dies ist ein allgemeiner Wellness-Timer, kein medizinisches Hilfsmittel. Atmen Sie entspannt und brechen Sie ab, falls Sie sich unwohl fühlen.', phase: 'Aktuelle Phase', cycle: 'Zyklus', remaining: 'Verbleibende Zeit', inhaleCue: 'Einatmen', holdCue: 'Sanft halten', exhaleCue: 'Ausatmen', complete: 'Abgeschlossen' },
    actions: { start: 'Start', pause: 'Pause', resume: 'Fortsetzen', reset: 'Zurücksetzen' },
    messages: { started: 'Atemsitzung gestartet.', paused: 'Sitzung pausiert.', resumed: 'Sitzung fortgesetzt.', reset: 'Sitzung zurückgesetzt.', finished: 'Sitzung abgeschlossen. Atmen Sie entspannt durch.', checkInputs: 'Geben Sie ganze Sekunden innerhalb der angegebenen Grenzen ein.', soundUnavailable: 'Hier ist kein Ton verfügbar; die visuelle Anleitung funktioniert weiterhin.', inhaleCue: 'Einatmen.', holdCue: 'Sanft halten.', exhaleCue: 'Ausatmen.' },
    example: { pattern: 'box', inhaleSeconds: 4, holdAfterInhaleSeconds: 4, exhaleSeconds: 4, holdAfterExhaleSeconds: 4, durationSeconds: 60 },
    additionalFaqs: [
      { question: 'Kann ich Box-Atmung oder die 4-7-8-Methode verwenden?', answer: 'Ja. Wählen Sie eine Voreinstellung oder passen Sie die Phasen an. Dies sind Atemrhythmen, keine medizinische Behandlung.' },
      { question: 'Läuft der Timer weiter, wenn ich den Tab schließe?', answer: 'Nicht garantiert. Browser können Hintergrund-Tabs pausieren, und Geräte können in den Ruhezustand wechseln. Lassen Sie diese Seite geöffnet und das Gerät aktiv, damit die Zeitmessung zuverlässiger ist.' },
      { question: 'Kann ich den Ton ausschalten oder früher stoppen?', answer: 'Ja. Der Ton ist optional und kann ausgeschaltet werden. Pause oder Zurücksetzen beendet die laufende Zeitmessung.' },
    ],
  },
  ja: {
    copyLanguage: 'ja', localizationStatus: 'machine-accepted', name: '呼吸エクササイズ', title: '呼吸エクササイズ — 無料オンライン | UsefulVerse',
    description: 'ボックス呼吸、4-7-8、またはカスタム設定の無料呼吸タイマー。音声、停止、リセットに対応。',
    intro: '心地よい呼吸のペースを選び、画面のガイドに従ってください。無理をせず、いつでも中断できます。',
    howQuestion: 'この呼吸エクササイズの使い方は？', howAnswer: 'プリセットまたは各段階の時間を設定し、セッションの長さを選んで「開始」を押します。いつでも一時停止やリセットが可能です。音声はオプションで、開始後にのみ流れます。',
    privacyQuestion: '呼吸セッションのデータはアップロードされますか？', privacyAnswer: 'いいえ。タイマーはこのページ内だけで動作します。アカウント登録、アップロード、API通信、セッションデータの保存は行いません。',
    fields: { pattern: '呼吸パターン', custom: 'カスタム', balanced: 'ゆったり — 吸う 4 / 吐く 6', box: 'ボックス呼吸 — 4 / 4 / 4 / 4', fourSevenEight: '4-7-8 — 吸う 4 / 止める 7 / 吐く 8', inhale: '吸う（秒）', holdIn: '吸った後に止める（秒）', exhale: '吐く（秒）', holdOut: '吐いた後に止める（秒）', duration: 'セッションの長さ（秒）', sound: '音声ガイド', soundHint: '段階が変わる時に穏やかな音を鳴らす', motionNote: '「動きを抑える」設定が有効な場合、ガイドの急激な動きは避けられます。', safetyNote: 'これは一般的なウェルネス用タイマーであり、医療行為ではありません。心地よいペースで呼吸し、体調が優れない場合は中止してください。', phase: '現在の段階', cycle: 'サイクル', remaining: '残り時間', inhaleCue: '吸う', holdCue: '穏やかに止める', exhaleCue: '吐く', complete: '完了' },
    actions: { start: '開始', pause: '一時停止', resume: '再開', reset: 'リセット' },
    messages: { started: '呼吸セッションを開始しました。', paused: 'セッションを一時停止しました。', resumed: 'セッションを再開しました。', reset: 'セッションをリセットしました。', finished: 'セッション完了です。リラックスして呼吸を整えてください。', checkInputs: '表示された範囲内で、秒数（整数）を入力してください。', soundUnavailable: 'ここでは音声は利用できませんが、視覚的なガイドは機能します。', inhaleCue: '息を吸います。', holdCue: '軽く息を止めます。', exhaleCue: '息を吐きます。' },
    example: { pattern: 'box', inhaleSeconds: 4, holdAfterInhaleSeconds: 4, exhaleSeconds: 4, holdAfterExhaleSeconds: 4, durationSeconds: 60 },
    additionalFaqs: [
      { question: 'ボックス呼吸や4-7-8法を使えますか？', answer: 'はい。プリセットを選択するか、各段階の時間を調整してください。これらは呼吸のペースを整えるためのものであり、医療行為ではありません。' },
      { question: 'タブを閉じても動作し続けますか？', answer: '保証はできません。ブラウザがバックグラウンドのタブを一時停止したり、デバイスがスリープ状態になったりすることがあります。正確なタイミングには、このページを開いたままにし、デバイスをスリープさせないでください。' },
      { question: '音声をオフにしたり、途中で終了したりできますか？', answer: 'はい。音声は任意で、オフにできます。「一時停止」または「リセット」を押すと実行中のタイマーはすぐに停止します。' },
    ],
  },
  ko: {
    copyLanguage: 'ko', localizationStatus: 'machine-accepted', name: '호흡 운동', title: '호흡 운동 — 무료 온라인 | UsefulVerse',
    description: '박스 호흡, 4-7-8 또는 사용자 지정 호흡 타이머. 선택 사운드, 일시 정지 및 초기화 기능.',
    intro: '편안한 호흡 속도를 선택하고 시각적 가이드를 따라 하세요. 편안하게 진행하고 원할 때 멈추세요.',
    howQuestion: '이 호흡 운동은 어떻게 사용하나요?', howAnswer: '사전 설정이나 각 단계별 시간을 선택하고 세션 시간을 정한 뒤 시작을 누르세요. 언제든 일시 정지하거나 초기화할 수 있습니다. 소리는 선택 사항이며 시작 후에만 재생됩니다.',
    privacyQuestion: '호흡 운동 기록이 업로드되나요?', privacyAnswer: '아니요. 타이머는 이 페이지 내에서만 작동합니다. 계정 생성, 데이터 업로드, API 사용 또는 세션 기록 저장이 이루어지지 않습니다.',
    fields: { pattern: '호흡 패턴', custom: '사용자 지정', balanced: '편안한 속도 · 들이마시기 4 / 내쉬기 6', box: '박스 호흡 · 4 / 4 / 4 / 4', fourSevenEight: '4-7-8 · 들이마시기 4 / 멈추기 7 / 내쉬기 8', inhale: '들이마시기 (초)', holdIn: '들이마신 후 멈추기 (초)', exhale: '내쉬기 (초)', holdOut: '내쉰 후 멈추기 (초)', duration: '세션 시간 (초)', sound: '소리 알림', soundHint: '단계가 바뀔 때 부드러운 알림음 재생', motionNote: '움직임 최소화 설정이 켜져 있으면 가이드 화면의 급격한 움직임을 줄입니다.', safetyNote: '일반 웰니스용 타이머이며 의료 서비스가 아닙니다. 편안하게 호흡하고 몸이 불편하면 중단하세요.', phase: '현재 단계', cycle: '사이클', remaining: '남은 시간', inhaleCue: '들이마시기', holdCue: '부드럽게 멈추기', exhaleCue: '내쉬기', complete: '완료' },
    actions: { start: '시작', pause: '일시 정지', resume: '계속하기', reset: '초기화' },
    messages: { started: '호흡 운동이 시작되었습니다.', paused: '세션이 일시 중지되었습니다.', resumed: '세션이 재개되었습니다.', reset: '세션이 초기화되었습니다.', finished: '세션이 완료되었습니다. 편안하게 숨을 쉬세요.', checkInputs: '표시된 범위 내에서 초 단위 시간을 입력하세요.', soundUnavailable: '여기서는 소리를 사용할 수 없지만 시각적 가이드는 계속 작동합니다.', inhaleCue: '숨을 들이마시세요.', holdCue: '부드럽게 멈추세요.', exhaleCue: '숨을 내쉬세요.' },
    example: { pattern: 'box', inhaleSeconds: 4, holdAfterInhaleSeconds: 4, exhaleSeconds: 4, holdAfterExhaleSeconds: 4, durationSeconds: 60 },
    additionalFaqs: [
      { question: '박스 호흡법이나 4-7-8 호흡법을 사용할 수 있나요?', answer: '네. 사전 설정을 선택하거나 각 단계의 시간을 조절하세요. 이는 호흡 속도 조절을 위한 패턴이며 의학적 치료가 아닙니다.' },
      { question: '탭을 닫아도 계속 실행되나요?', answer: '보장할 수 없습니다. 브라우저가 백그라운드 탭을 일시 중지하거나 기기가 절전 모드로 전환될 수 있습니다. 정확한 시간을 위해 페이지를 열어두고 기기가 깨어 있도록 하세요.' },
      { question: '소리를 끄거나 중간에 멈출 수 있나요?', answer: '네. 소리는 선택 사항이며 끌 수 있습니다. 일시 정지나 초기화를 누르면 활성 타이머가 즉시 멈춥니다.' },
    ],
  },
  ar: {
    copyLanguage: 'ar', localizationStatus: 'machine-accepted', name: 'تمرين التنفس', title: 'تمرين التنفس — مجاني عبر الإنترنت | UsefulVerse',
    description: 'مؤقت تنفس مجاني بأنماط التنفس الصندوقي أو 4-7-8 أو إيقاع مخصص. صوت اختياري وإيقاف وإعادة ضبط.',
    intro: 'اختر إيقاعاً مريحاً للتنفس واتبع الدليل البصري. حافظ على راحتك أثناء الجلسة وتوقف متى شئت.',
    howQuestion: 'كيف أستخدم تمرين التنفس هذا؟', howAnswer: 'اختر نمطاً جاهزاً أو حدد مدة كل مرحلة، واختر طول الجلسة ثم اضغط على بدء. يمكنك الإيقاف المؤقت أو إعادة الضبط في أي وقت. الصوت اختياري ويبدأ بعد تشغيل التمرين.',
    privacyQuestion: 'هل يتم رفع بيانات جلسة التنفس؟', privacyAnswer: 'لا. يعمل المؤقت في هذه الصفحة فقط. لا تُستخدم حسابات أو عمليات رفع أو API أو تخزين للجلسات.',
    fields: { pattern: 'نمط التنفس', custom: 'مخصص', balanced: 'إيقاع هادئ · شهيق 4 / زفير 6', box: 'التنفس الصندوقي · 4 / 4 / 4 / 4', fourSevenEight: '4-7-8 · شهيق 4 / حبس النفس 7 / زفير 8', inhale: 'الشهيق (بالثواني)', holdIn: 'حبس النفس بعد الشهيق (بالثواني)', exhale: 'الزفير (بالثواني)', holdOut: 'حبس النفس بعد الزفير (بالثواني)', duration: 'مدة الجلسة (بالثواني)', sound: 'التنبيهات الصوتية', soundHint: 'تشغيل نغمة هادئة عند تغير المرحلة', motionNote: 'يتجنب الدليل الحركات المفاجئة عند تفعيل خيار تقليل الحركة.', safetyNote: 'هذا مؤقت عام للصحة والعافية وليس أداة طبية. تنفس براحة وتوقف إذا شعرت بانزعاج.', phase: 'المرحلة الحالية', cycle: 'الدورة', remaining: 'الوقت المتبقي', inhaleCue: 'شهيق', holdCue: 'حبس النفس برفق', exhaleCue: 'زفير', complete: 'اكتمل' },
    actions: { start: 'بدء', pause: 'إيقاف مؤقت', resume: 'استئناف', reset: 'إعادة ضبط' },
    messages: { started: 'بدأت جلسة التنفس.', paused: 'تم إيقاف الجلسة مؤقتاً.', resumed: 'تم استئناف الجلسة.', reset: 'تمت إعادة ضبط الجلسة.', finished: 'اكتملت الجلسة. خذ نفساً مريحاً.', checkInputs: 'أدخل المدة بالثواني الكاملة ضمن الحدود الموضحة.', soundUnavailable: 'الصوت غير متاح هنا؛ لكن الدليل البصري لا يزال يعمل.', inhaleCue: 'شهيق.', holdCue: 'احبس النفس برفق.', exhaleCue: 'زفير.' },
    example: { pattern: 'box', inhaleSeconds: 4, holdAfterInhaleSeconds: 4, exhaleSeconds: 4, holdAfterExhaleSeconds: 4, durationSeconds: 60 },
    additionalFaqs: [
      { question: 'هل يمكنني استخدام التنفس الصندوقي أو تقنية 4-7-8؟', answer: 'نعم. اختر إعداداً مسبقاً أو عدّل مدة المراحل. هذه أنماط لتنظيم وتيرة التنفس وليست علاجاً طبياً.' },
      { question: 'هل يستمر المؤقت إذا أغلقت علامة التبويب؟', answer: 'لا يوجد ضمان. قد توقف المتصفحات علامات التبويب في الخلفية وقد تدخل الأجهزة في وضع السكون. أبقِ الصفحة مفتوحة والجهاز نشطاً للحصول على توقيت أدق.' },
      { question: 'هل يمكنني إيقاف الصوت أو التوقف مبكراً؟', answer: 'نعم. الصوت اختياري ويمكن إيقافه. يؤدي الإيقاف المؤقت أو إعادة الضبط إلى إنهاء التوقيت النشط.' },
    ],
  },
};

const compactLocaleDrafts = {
  am: `A00|የአተነፋፈስ ልምምድ
A01|የአተነፋፈስ ልምምድ — ነፃ እና ኦንላይን | UsefulVerse
A02|እንደ Box፣ 4-7-8 ወይም በራስዎ ፍላጎት በሚያዘጋጁት ፍጥነት የሚሰራ ነፃ የአተነፋፈስ ጊዜ መቆጣጠሪያ ይከተሉ። እንደ አማራጭ ድምፅ፣ ማቆም እና ዳግም ማስጀመር ይቻላል፤ አካውንት ወይም ፋይል መጫን አያስፈልግም።
A03|ረጋ ያለ የአተነፋፈስ ፍጥነት ይምረጡና የሚታየውን መመሪያ ይከተሉ። ልምምዱን ምቹ ያድርጉ፤ በማንኛውም ጊዜ ማቆም ይችላሉ።
A04|ይህን የአተነፋፈስ ልምምድ እንዴት እጠቀማለሁ?
A05|ቅድመ ዝግጅት የተደረገለትን ምርጫ ይምረጡ ወይም እያንዳንዱን ደረጃ ያዘጋጁ፣ የክፍለ ጊዜውን ርዝመት ይምረጡና Start ን ይጫኑ። በማንኛውም ጊዜ ማቆም ወይም ዳግም ማስጀመር ይችላሉ። ድምፅ አማራጭ ነው፤ የሚጀምረው ከጀመሩ በኋላ ብቻ ነው።
A06|የአተነፋፈስ ክፍለ ጊዜዬ ወደ ኢንተርኔት ይጫናል?
A07|አይጫንም። ጊዜ መቁጠሩ በዚህ ገጽ ላይ ይከናወናል። አካውንት፣ ፋይል መጫን፣ API ወይም የተቀመጠ ክፍለ ጊዜ አይጠቀምም።
A08|የአተነፋፈስ ንድፍ
A09|በራስ የተዘጋጀ
A10|ቀላል ፍጥነት — ወደ ውስጥ 4 / ወደ ውጭ 6
A11|Box አተነፋፈስ — 4 / 4 / 4 / 4
A12|4-7-8 — ወደ ውስጥ 4 / መያዝ 7 / ወደ ውጭ 8
A13|ወደ ውስጥ መተንፈስ (ሰከንዶች)
A14|ከውስጥ ከተነፈሱ በኋላ መያዝ (ሰከንዶች)
A15|ወደ ውጭ መተንፈስ (ሰከንዶች)
A16|ከውጭ ከተነፈሱ በኋላ መያዝ (ሰከንዶች)
A17|የክፍለ ጊዜ ርዝመት (ሰከንዶች)
A18|የድምፅ ምልክቶች
A19|ደረጃው ሲቀየር ለስላሳ ድምፅ ያጫውቱ
A20|የእንቅስቃሴ ቅነሳ ከተነቃ መመሪያው ከባድ እንቅስቃሴን ያስወግዳል።
A21|ይህ ለአጠቃላይ ደህንነት የሚረዳ ጊዜ መቆጣጠሪያ ነው፣ የሕክምና እንክብካቤ አይደለም። በምቾት ይተንፍሱ፤ ጤንነት ካልተሰማዎት ያቁሙ።
A22|አሁን ያለው ደረጃ
A23|ዑደት
A24|የቀረው ጊዜ
A25|ወደ ውስጥ ይተንፍሱ
A26|በቀስታ ይያዙ
A27|ወደ ውጭ ይተንፍሱ
A28|ተጠናቋል
A29|ጀምር
A30|ለጊዜው አቁም
A31|ቀጥል
A32|ዳግም አስጀምር
B00|የአተነፋፈስ ክፍለ ጊዜ ተጀምሯል። B01|ክፍለ ጊዜው ለጊዜው ቆሟል። B02|ክፍለ ጊዜው ቀጥሏል። B03|ክፍለ ጊዜው ዳግም ተጀምሯል። B04|ክፍለ ጊዜው ተጠናቋል። በምቾት ይተንፍሱ። B05|በታዩት ገደቦች ውስጥ ሙሉ ሰከንዶችን ያስገቡ። B06|ድምፅ እዚህ አይገኝም፤ የሚታየው መመሪያ ግን ይሰራል። B07|ወደ ውስጥ ይተንፍሱ። B08|በቀስታ ይያዙ። B09|ወደ ውጭ ይተንፍሱ።
C00|Box አተነፋፈስ ወይም 4-7-8 መጠቀም እችላለሁ?
C01|አዎ። ቅድመ ዝግጅት የተደረገለትን ንድፍ ይምረጡ ወይም የደረጃዎቹን ርዝመት ያስተካክሉ። እነዚህ የአተነፋፈስ ፍጥነት ንድፎች ናቸው፣ የሕክምና ሕክምና አይደሉም።
C02|ታቡን ስዘጋ ሥራውን ይቀጥላል?
C03|ዋስትና የለም። አሳሾች ከበስተጀርባ ያሉ ታቦችን ሊያቆሙ ይችላሉ፣ መሳሪያዎችም ወደ እንቅልፍ ሊገቡ ይችላሉ። በጣም ትክክለኛ የጊዜ ቆጠራ ለማግኘት ገጹን ክፍት እና መሳሪያውን ንቁ ያድርጉ።
C04|ድምፁን ማጥፋት ወይም ቀድሜ ማቆም እችላለሁ?
C05|አዎ። ድምፅ አማራጭ ነው፣ ከStart በኋላ ይጀምራል እና ማጥፋት ይቻላል። Pause ወይም Reset ሲጫኑ ጊዜ ቆጠራው ወዲያውኑ ያበቃል።`,
  bn: `A00|শ্বাস-প্রশ্বাসের ব্যায়াম
A01|শ্বাস-প্রশ্বাসের ব্যায়াম — বিনামূল্যে অনলাইনে | UsefulVerse
A02|বক্স, ৪-৭-৮ বা নিজের পছন্দমতো (কাস্টম) গতিতে শ্বাস-প্রশ্বাসের টাইমার অনুসরণ করুন। ঐচ্ছিক শব্দ, বিরতি এবং রিসেট সুবিধা রয়েছে; কোনো অ্যাকাউন্ট বা আপলোডের প্রয়োজন নেই।
A03|শ্বাস-প্রশ্বাসের একটি আরামদায়ক গতি বেছে নিন এবং ভিজ্যুয়াল নির্দেশিকা অনুসরণ করুন। সেশনটি আরামদায়ক রাখুন; যেকোনো সময় থামতে পারেন।
A04|আমি কীভাবে এই শ্বাস-প্রশ্বাসের ব্যায়ামটি করব?
A05|একটি পূর্বনির্ধারিত পদ্ধতি বেছে নিন অথবা প্রতিটি ধাপ নিজে ঠিক করুন, সেশনের সময়কাল নির্বাচন করুন এবং 'শুরু করুন' (Start)-এ চাপ দিন। যেকোনো সময় বিরতি বা রিসেট করা যাবে। অডিও ঐচ্ছিক এবং এটি কেবল শুরু করার পরেই বাজবে।
A06|আমার শ্বাস-প্রশ্বাসের সেশন কি আপলোড হচ্ছে?
A07|না। টাইমিং এই পেজেই চলে। কোনো অ্যাকাউন্ট, আপলোড, এপিআই (API) বা সেশন সেভ করার ব্যবস্থা নেই।
A08|শ্বাস-প্রশ্বাসের ধরন
A09|কাস্টম (নিজের পছন্দমতো)
A10|সহজ গতি — শ্বাস নেওয়া ৪ / ছাড়া ৬
A11|বক্স ব্রিদিং — ৪ / ৪ / ৪ / ৪
A12|৪-৭-৮ — শ্বাস নেওয়া ৪ / ধরে রাখা ৭ / ছাড়া ৮
A13|শ্বাস নেওয়া (সেকেন্ড)
A14|শ্বাস নেওয়ার পর ধরে রাখা (সেকেন্ড)
A15|শ্বাস ছাড়া (সেকেন্ড)
A16|শ্বাস ছাড়ার পর ধরে রাখা (সেকেন্ড)
A17|সেশনের সময়কাল (সেকেন্ড)
A18|শব্দ সংকেত
A19|ধাপ পরিবর্তনের সময় মৃদু শব্দ বাজানো
A20|'কম নড়াচড়া' (reduced motion) মোড চালু থাকলে নির্দেশিকাটি জোরপূর্বক নড়াচড়া এড়িয়ে চলে।
A21|এটি সাধারণ সুস্থতার জন্য একটি টাইমার, কোনো চিকিৎসা সেবা নয়। আরামদায়কভাবে শ্বাস নিন এবং অসুস্থ বোধ করলে থামিয়ে দিন।
A22|বর্তমান ধাপ
A23|চক্র
A24|অবশিষ্ট সময়
A25|শ্বাস নিন
A26|আলতো করে ধরে রাখুন
A27|শ্বাস ছাড়ুন
A28|সম্পন্ন
A29|শুরু করুন
A30|বিরতি
A31|আবার শুরু করুন
A32|রিসেট
B00|শ্বাস-প্রশ্বাসের সেশন শুরু হয়েছে। B01|সেশনটি থামানো হয়েছে। B02|সেশনটি পুনরায় শুরু হয়েছে। B03|সেশনটি রিসেট করা হয়েছে। B04|সেশন সম্পন্ন। স্বাচ্ছন্দ্যে শ্বাস নিন। B05|প্রদর্শিত সীমার মধ্যে পূর্ণ সেকেন্ডের মান লিখুন। B06|এখানে শব্দ বা অডিওর সুবিধা নেই; তবে ভিজ্যুয়াল নির্দেশিকাটি কাজ করবে। B07|শ্বাস নিন। B08|ধীরভাবে শ্বাস ধরে রাখুন। B09|শ্বাস ছাড়ুন।
C00|আমি কি 'বক্স ব্রিদিং' (box breathing) বা '৪-৭-৮' পদ্ধতি ব্যবহার করতে পারি?
C01|হ্যাঁ। আপনি পূর্বনির্ধারিত সেটিংস বেছে নিতে পারেন অথবা ধাপগুলোর সময়কাল নিজের মতো ঠিক করে নিতে পারেন। এগুলো শ্বাস-প্রশ্বাসের ছন্দ বা গতি নিয়ন্ত্রণের পদ্ধতি মাত্র, কোনো চিকিৎসা নয়।
C02|ট্যাবটি বন্ধ করলে কি এটি চলতে থাকবে?
C03|এর কোনো নিশ্চয়তা নেই। ব্রাউজার ব্যাকগ্রাউন্ড ট্যাব থামিয়ে দিতে পারে এবং ডিভাইস 'স্লিপ মোড'-এ চলে যেতে পারে। সঠিক সময়ের হিসাব পেতে এই পেজটি খোলা রাখুন এবং ডিভাইসটি সচল রাখুন।
C04|আমি কি শব্দ বন্ধ করতে পারি বা আগেই থামিয়ে দিতে পারি?
C05|হ্যাঁ। শব্দ বা অডিও ঐচ্ছিক; 'Start' বোতাম চাপার পর এটি চালু হয় এবং আপনি চাইলে সেটি বন্ধ (আনচেক) করে রাখতে পারেন। 'Pause' বা 'Reset' করলে চলমান টাইমিং বা সময় গণনা অবিলম্বে বন্ধ হয়ে যাবে।`,
  ru: `A00|Дыхательное упражнение
A01|Дыхательное упражнение — бесплатно онлайн | UsefulVerse
A02|Используйте бесплатный таймер для дыхательных практик: «квадратное дыхание», 4-7-8 или собственный ритм. Доступны звуковое сопровождение, пауза и сброс; регистрация или загрузка данных не требуются.
A03|Выберите комфортный темп дыхания и следуйте визуальным подсказкам. Занимайтесь в удобном для себя режиме; остановиться можно в любой момент.
A04|Как пользоваться этим упражнением?
A05|Выберите готовый режим или настройте длительность каждой фазы и общую продолжительность сеанса, затем нажмите «Старт». В любой момент можно поставить сеанс на паузу или сбросить настройки. Звуковое сопровождение — по желанию; оно включается только после начала упражнения.
A06|Передаются ли данные о сеансе куда-либо?
A07|Нет. Таймер работает непосредственно на этой странице. Регистрация, загрузка данных, использование API или сохранение сеансов не предусмотрены.
A08|Ритм дыхания
A09|Пользовательский
A10|Спокойный темп — вдох 4 / выдох 6
A11|«Квадратное дыхание» — 4 / 4 / 4 / 4
A12|4-7-8 — вдох 4 / задержка 7 / выдох 8
A13|Вдох (секунды)
A14|Задержка после вдоха (секунды)
A15|Выдох (секунды)
A16|Задержка после выдоха (секунды)
A17|Длительность сеанса (секунды)
A18|Звуковые сигналы
A19|Мягкий звуковой сигнал при смене фазы
A20|При включенном режиме ограниченной анимации визуальный гид не использует резких движений.
A21|Это таймер для оздоровительных практик, а не медицинское устройство. Дышите комфортно; прекратите упражнение, если почувствуете недомогание.
A22|Текущая фаза
A23|Цикл
A24|Осталось времени
A25|Вдох
A26|Мягкая задержка
A27|Выдох
A28|Завершено
A29|Старт
A30|Пауза
A31|Продолжить
A32|Сброс
B00|Сеанс дыхания начат. B01|Сеанс приостановлен. B02|Сеанс возобновлен. B03|Сеанс сброшен. B04|Сеанс завершен. Сделайте спокойный вдох. B05|Введите длительность в целых секундах в указанных пределах. B06|Звук здесь недоступен, но визуальная подсказка продолжает работать. B07|Вдох. B08|Мягкая задержка. B09|Выдох.
C00|Можно ли использовать технику «дыхание по квадрату» или 4-7-8?
C01|Да. Выберите готовый режим или настройте длительность фаз. Это лишь схемы ритма дыхания, а не медицинская процедура.
C02|Продолжится ли работа, если я закрою вкладку?
C03|Гарантии нет. Браузеры могут приостанавливать работу фоновых вкладок, а устройства — переходить в спящий режим. Для максимально точного отсчета времени держите страницу открытой, а устройство — активным.
C04|Можно ли отключить звук или остановить сеанс раньше времени?
C05|Да. Звук не обязателен: он включается после нажатия кнопки «Старт», но эту опцию можно отключить. Приостановка или сброс немедленно прекращают отсчет времени.`,
  ur: `A00|سانس لینے کی مشق
A01|سانس لینے کی مشق — مفت آن لائن | UsefulVerse
A02|سانس لینے کے مفت ٹائمر کی پیروی کریں جس میں باکس، 4-7-8 یا اپنی مرضی کی رفتار شامل ہے۔ آواز، وقفہ اور ری سیٹ کے اختیارات موجود ہیں؛ اکاؤنٹ یا اپ لوڈ کی ضرورت نہیں۔
A03|سانس لینے کی دھیمی رفتار کا انتخاب کریں اور بصری رہنمائی پر عمل کریں۔ سیشن کو آرام دہ رکھیں؛ جب چاہیں رک جائیں۔
A04|میں سانس لینے کی اس مشق کو کیسے استعمال کروں؟
A05|پہلے سے طے شدہ طریقہ منتخب کریں یا ہر مرحلے کی ترتیب خود طے کریں، سیشن کا دورانیہ منتخب کریں اور 'شروع کریں' دبائیں۔ کسی بھی وقت وقفہ لیں یا ری سیٹ کریں۔ آڈیو اختیاری ہے اور صرف شروع کرنے کے بعد چلتی ہے۔
A06|کیا میرا سانس لینے کا سیشن اپ لوڈ ہوتا ہے؟
A07|نہیں۔ ٹائمنگ اسی صفحے پر چلتی ہے۔ اکاؤنٹ، اپ لوڈ، API یا محفوظ شدہ سیشن استعمال نہیں ہوتا۔
A08|سانس لینے کا طریقہ
A09|اپنی مرضی کے مطابق
A10|آسان رفتار — سانس اندر 4 / سانس باہر 6
A11|باکس بریتھنگ — 4 / 4 / 4 / 4
A12|4-7-8 — سانس اندر 4 / روکنا 7 / سانس باہر 8
A13|سانس اندر لینا (سیکنڈز)
A14|سانس اندر لینے کے بعد روکنا (سیکنڈز)
A15|سانس باہر نکالنا (سیکنڈز)
A16|سانس باہر نکالنے کے بعد روکنا (سیکنڈز)
A17|سیشن کا دورانیہ (سیکنڈز)
A18|آواز کے اشارے
A19|مرحلہ تبدیل ہونے پر ہلکی آواز چلائیں
A20|کم حرکت کی ترتیب فعال ہونے پر گائیڈ اچانک حرکت سے گریز کرتی ہے۔
A21|یہ عمومی تندرستی کے لیے ٹائمر ہے، طبی علاج نہیں۔ آرام سے سانس لیں اور اگر طبیعت خراب محسوس ہو تو رک جائیں۔
A22|موجودہ مرحلہ
A23|سائیکل
A24|باقی وقت
A25|سانس اندر لیں
A26|آرام سے روکیں
A27|سانس باہر نکالیں
A28|مکمل
A29|شروع کریں
A30|وقفہ
A31|دوبارہ شروع کریں
A32|ری سیٹ کریں
B00|سانس لینے کا سیشن شروع ہو گیا۔ B01|سیشن روک دیا گیا۔ B02|سیشن دوبارہ شروع ہو گیا۔ B03|سیشن ری سیٹ کر دیا گیا۔ B04|سیشن مکمل ہو گیا۔ آرام سے سانس لیں۔ B05|ظاہر کردہ حدود کے اندر مکمل سیکنڈز درج کریں۔ B06|یہاں آواز دستیاب نہیں؛ بصری رہنمائی پھر بھی کام کرتی ہے۔ B07|سانس اندر لیں۔ B08|آہستگی سے روک کر رکھیں۔ B09|سانس باہر نکالیں۔
C00|کیا میں باکس بریتھنگ یا 4-7-8 کا طریقہ استعمال کر سکتا ہوں؟
C01|جی ہاں۔ پہلے سے طے شدہ طریقہ منتخب کریں یا مراحل کا دورانیہ ترتیب دیں۔ یہ سانس لینے کی رفتار کے نمونے ہیں، طبی علاج نہیں۔
C02|کیا ٹیب بند کرنے پر بھی یہ چلتا رہے گا؟
C03|اس کی کوئی ضمانت نہیں۔ براؤزر پس منظر کے ٹیبز روک سکتے ہیں اور ڈیوائس سلیپ موڈ میں جا سکتی ہے۔ درست ٹائمنگ کے لیے صفحہ کھلا اور ڈیوائس فعال رکھیں۔
C04|کیا میں آواز بند یا جلدی روک سکتا ہوں؟
C05|جی ہاں۔ آواز اختیاری ہے اور شروع کرنے کے بعد چلتی ہے؛ اسے بند کیا جا سکتا ہے۔ وقفہ یا ری سیٹ کرنے سے ٹائمر فوراً رک جاتا ہے۔`,
  zh: `A00|呼吸练习
A01|呼吸练习 — 免费在线 | UsefulVerse
A02|跟随免费的呼吸计时器进行练习，支持方框呼吸法、4-7-8 呼吸法或自定义节奏。提供可选声音提示、暂停和重置；无需账户或上传数据。
A03|选择舒适的呼吸节奏，跟随视觉引导进行练习。保持过程舒适自然；可随时停止。
A04|如何使用此呼吸练习？
A05|选择预设模式或自定义各阶段时长，设定练习总时长，然后点击“开始”。可随时暂停或重置。音频为可选功能，仅在练习开始后播放。
A06|我的呼吸练习数据会被上传吗？
A07|不会。计时过程仅在当前页面运行。不涉及账户、数据上传、API 调用或会话记录保存。
A08|呼吸模式
A09|自定义
A10|轻松节奏 — 吸气 4 / 呼气 6
A11|方框呼吸法 — 4 / 4 / 4 / 4
A12|4-7-8 呼吸法 — 吸气 4 / 屏息 7 / 呼气 8
A13|吸气（秒）
A14|吸气后屏息（秒）
A15|呼气（秒）
A16|呼气后屏息（秒）
A17|练习时长（秒）
A18|声音提示
A19|阶段切换时播放柔和提示音
A20|启用“减少动态效果”模式后，引导动画将避免剧烈动作。
A21|本工具仅用于日常健康辅助，不属于医疗服务。请保持舒适的呼吸状态，如感不适请立即停止。
A22|当前阶段
A23|循环
A24|剩余时间
A25|吸气
A26|轻柔屏息
A27|呼气
A28|完成
A29|开始
A30|暂停
A31|继续
A32|重置
B00|呼吸练习已开始。 B01|练习已暂停。 B02|练习已恢复。 B03|练习已重置。 B04|练习结束。请自然呼吸，放松一下。 B05|请在显示的范围内输入整数秒数。 B06|此处无法播放声音；但视觉引导仍可正常使用。 B07|吸气。 B08|轻柔屏息。 B09|呼气。
C00|我可以使用方框呼吸法或 4-7-8 呼吸法吗？
C01|可以。您可以选择预设模式，也可以自行调整各阶段时长。这些是呼吸节奏引导，不是医疗手段。
C02|关闭标签页后，练习还会继续吗？
C03|无法保证。浏览器可能暂停后台标签页，设备也可能进入休眠状态。为确保计时准确，请保持页面开启并让设备处于唤醒状态。
C04|我可以关闭声音或提前结束练习吗？
C05|可以。声音是可选的，点击“开始”后才会播放，也可以取消勾选。点击“暂停”或“重置”会立即停止计时。`,
  vi: `A00|Bài tập thở
A01|Bài tập thở — Trực tuyến miễn phí | UsefulVerse
A02|Theo dõi bộ đếm thời gian thở miễn phí với các nhịp thở kiểu Box, 4-7-8 hoặc tùy chỉnh. Có tùy chọn âm thanh, tạm dừng và đặt lại; không cần tài khoản hay tải dữ liệu lên.
A03|Chọn nhịp thở nhẹ nhàng và làm theo hướng dẫn trực quan. Hãy giữ cho buổi tập thoải mái; dừng lại bất cứ khi nào bạn muốn.
A04|Làm thế nào để sử dụng bài tập thở này?
A05|Chọn chế độ có sẵn hoặc tự thiết lập từng giai đoạn, chọn thời lượng buổi tập và nhấn Bắt đầu. Bạn có thể tạm dừng hoặc đặt lại bất cứ lúc nào. Âm thanh là tùy chọn và chỉ phát sau khi bạn bắt đầu.
A06|Buổi tập thở của tôi có bị tải lên máy chủ không?
A07|Không. Việc đếm thời gian diễn ra ngay trên trang này. Không sử dụng tài khoản, tải dữ liệu lên, API hay lưu lại thông tin buổi tập.
A08|Kiểu thở
A09|Tùy chỉnh
A10|Nhịp độ nhẹ nhàng — hít vào 4 / thở ra 6
A11|Thở kiểu Box — 4 / 4 / 4 / 4
A12|4-7-8 — hít vào 4 / giữ hơi 7 / thở ra 8
A13|Hít vào (giây)
A14|Giữ hơi sau khi hít vào (giây)
A15|Thở ra (giây)
A16|Giữ hơi sau khi thở ra (giây)
A17|Thời lượng buổi tập (giây)
A18|Tín hiệu âm thanh
A19|Phát âm thanh nhẹ khi chuyển giai đoạn
A20|Hướng dẫn tránh chuyển động mạnh khi chế độ giảm chuyển động được bật.
A21|Đây là công cụ hỗ trợ sức khỏe nói chung, không phải phương pháp điều trị y tế. Hãy hít thở thoải mái và dừng lại nếu bạn cảm thấy không khỏe.
A22|Giai đoạn hiện tại
A23|Chu kỳ
A24|Thời gian còn lại
A25|Hít vào
A26|Giữ hơi nhẹ nhàng
A27|Thở ra
A28|Hoàn tất
A29|Bắt đầu
A30|Tạm dừng
A31|Tiếp tục
A32|Đặt lại
B00|Buổi tập thở đã bắt đầu. B01|Phiên tập đã tạm dừng. B02|Phiên tập đã tiếp tục. B03|Phiên tập đã được đặt lại. B04|Hoàn tất phiên tập. Hãy hít thở thoải mái. B05|Nhập số giây nguyên trong phạm vi giới hạn hiển thị. B06|Không có âm thanh ở chế độ này; hướng dẫn bằng hình ảnh vẫn hoạt động. B07|Hít vào. B08|Giữ hơi nhẹ nhàng. B09|Thở ra.
C00|Tôi có thể dùng phương pháp thở kiểu Box hoặc kỹ thuật 4-7-8 không?
C01|Có. Bạn có thể chọn thiết lập có sẵn hoặc điều chỉnh thời gian từng giai đoạn. Đây là cách điều chỉnh nhịp thở, không phải liệu pháp y tế.
C02|Bộ đếm có tiếp tục chạy khi tôi đóng thẻ không?
C03|Không đảm bảo. Trình duyệt có thể tạm dừng thẻ chạy nền và thiết bị có thể chuyển sang chế độ ngủ. Hãy giữ trang mở và thiết bị hoạt động để thời gian được chính xác hơn.
C04|Tôi có thể tắt âm thanh hoặc dừng sớm không?
C05|Có. Âm thanh là tùy chọn, chỉ phát sau khi bạn nhấn Bắt đầu và có thể tắt. Nhấn Tạm dừng hoặc Đặt lại để dừng đếm thời gian ngay lập tức.`,
  it: `A00|Esercizio di respirazione
A01|Esercizio di respirazione — Online e gratuito | UsefulVerse
A02|Timer gratuito per la respirazione: ritmo quadrato, 4-7-8 o personalizzato. Audio facoltativo, pausa e ripristino.
A03|Scegli un ritmo di respirazione delicato e segui la guida visiva. Mantieni la sessione confortevole; interrompi quando vuoi.
A04|Come si usa questo esercizio di respirazione?
A05|Scegli un'impostazione predefinita o configura ogni fase, seleziona la durata della sessione e premi Avvia. Puoi mettere in pausa o ripristinare in qualsiasi momento. L'audio è facoltativo e si attiva solo dopo l'avvio.
A06|La mia sessione di respirazione viene caricata online?
A07|No. Il conteggio avviene direttamente in questa pagina. Non vengono usati account, caricamenti, API o salvataggi della sessione.
A08|Schema di respirazione
A09|Personalizzato
A10|Ritmo facile — inspira 4 / espira 6
A11|Respirazione quadrata — 4 / 4 / 4 / 4
A12|4-7-8 — inspira 4 / trattieni 7 / espira 8
A13|Inspira (secondi)
A14|Trattieni dopo l'inspirazione (secondi)
A15|Espira (secondi)
A16|Trattieni dopo l'espirazione (secondi)
A17|Durata della sessione (secondi)
A18|Segnali sonori
A19|Riproduci un suono delicato al cambio di fase
A20|La guida evita movimenti bruschi quando è attiva l'opzione di movimento ridotto.
A21|Questo è un timer per il benessere generale, non un dispositivo medico. Respira comodamente e interrompi se non ti senti bene.
A22|Fase attuale
A23|Ciclo
A24|Tempo rimanente
A25|Inspira
A26|Trattieni delicatamente
A27|Espira
A28|Completato
A29|Avvia
A30|Pausa
A31|Riprendi
A32|Ripristina
B00|Sessione di respirazione avviata. B01|Sessione in pausa. B02|Sessione ripresa. B03|Sessione ripristinata. B04|Sessione completata. Fai un respiro rilassato. B05|Inserisci un numero intero di secondi entro i limiti indicati. B06|L'audio non è disponibile qui; la guida visiva rimane attiva. B07|Inspira. B08|Trattieni delicatamente. B09|Espira.
C00|Posso usare la respirazione quadrata o la tecnica 4-7-8?
C01|Sì. Scegli un'impostazione predefinita o regola la durata delle singole fasi. Sono schemi per il ritmo respiratorio, non un trattamento medico.
C02|Il conteggio prosegue se chiudo la scheda?
C03|Non è garantito. I browser possono sospendere le schede in background e i dispositivi possono entrare in modalità di risparmio energetico. Mantieni la pagina aperta e il dispositivo attivo per un tempo più preciso.
C04|Posso disattivare l'audio o interrompere la sessione in anticipo?
C05|Sì. L'audio è facoltativo e può essere disattivato. Pausa o Ripristina interrompe immediatamente il conteggio in corso.`,
  zh_tw: `A00|呼吸練習
A01|呼吸練習 — 免費線上 | UsefulVerse
A02|免費呼吸計時器，支援方框呼吸、4-7-8 或自訂節奏。可選聲音、暫停和重設。
A03|選擇舒適的呼吸節奏，並跟隨視覺指南。保持練習舒適；隨時可以停止。
A04|如何使用此呼吸練習？
A05|選擇預設或設定每個階段，選擇練習時長，然後點選「開始」。隨時可以暫停或重設。音訊為可選，僅在開始後播放。
A06|我的呼吸練習會被上傳嗎？
A07|不會。計時在此頁面進行。無需註冊、上傳、API 或儲存練習。
A08|呼吸模式
A09|自訂
A10|輕鬆節奏 — 吸氣 4 秒 / 吐氣 6 秒
A11|方框呼吸 — 4 / 4 / 4 / 4
A12|4-7-8 — 吸氣 4 秒 / 屏息 7 秒 / 吐氣 8 秒
A13|吸氣（秒）
A14|吸氣後屏息（秒）
A15|呼氣（秒）
A16|呼氣後屏息（秒）
A17|練習時長（秒）
A18|聲音提示
A19|階段變化時播放柔和音調
A20|啟用「減少動態效果」模式時，視覺引導會避免突然動作。
A21|這是一般健康計時器，並非醫療照護。請舒適地呼吸，如果感到不適，請停止。
A22|目前階段
A23|循環
A24|剩餘時間
A25|吸氣
A26|輕輕屏息
A27|呼氣
A28|完成
A29|開始
A30|暫停
A31|恢復
A32|重設
B00|呼吸練習已開始。 B01|練習已暫停。 B02|練習已恢復。 B03|練習已重設。 B04|練習完成。請輕鬆呼吸。 B05|請在所示範圍內輸入整數秒。 B06|此處無聲音提示；視覺引導仍然有效。 B07|吸氣。 B08|輕輕屏息。 B09|呼氣。
C00|我可以使用方框呼吸法或 4-7-8 呼吸法嗎？
C01|可以。選擇預設呼吸法或調整各階段時長。這些是呼吸節奏引導，不是醫療治療。
C02|關閉分頁後，計時會繼續嗎？
C03|無法保證。瀏覽器可能暫停背景分頁，裝置也可能進入睡眠模式。為了更準確計時，請保持此頁面開啟且裝置處於喚醒狀態。
C04|我可以關閉聲音或提前停止嗎？
C05|可以。聲音是可選的，開始後才會播放，也可以取消勾選。按「暫停」或「重設」會立即停止計時。`,
  bg: `A00|Дихателно упражнение
A01|Дихателно упражнение — Безплатно онлайн | UsefulVerse
A02|Безплатен таймер за дишане: квадратно дишане, 4-7-8 или собствен ритъм. Звук, пауза и нулиране по избор.
A03|Изберете плавен ритъм на дишане и следвайте визуалните указания. Поддържайте комфортно темпо; спрете, когато пожелаете.
A04|Как да използвам това дихателно упражнение?
A05|Изберете предварително зададен режим или настройте всяка фаза, изберете продължителност на сесията и натиснете „Старт“. Можете да поставите на пауза или да нулирате по всяко време. Звукът е по избор и се включва едва след стартиране.
A06|Качват ли се данните от дихателната ми сесия?
A07|Не. Отчитането на времето става директно на тази страница. Не се изискват акаунт или качване на данни; не се използват API или запазване на сесии.
A08|Модел на дишане
A09|Персонализиран
A10|Лек ритъм — вдишване 4 / издишване 6
A11|Квадратно дишане — 4 / 4 / 4 / 4
A12|4-7-8 — вдишване 4 / задържане 7 / издишване 8
A13|Вдишване (секунди)
A14|Задържане след вдишване (секунди)
A15|Издишване (секунди)
A16|Задържане след издишване (секунди)
A17|Продължителност на сесията (секунди)
A18|Звукови сигнали
A19|Възпроизвеждане на мек сигнал при смяна на фазата
A20|Визуалните указания избягват резки движения, когато е активиран режимът за ограничено движение.
A21|Това е таймер за общо благосъстояние, а не медицинска услуга. Дишайте комфортно и спрете, ако се почувствате зле.
A22|Текуща фаза
A23|Цикъл
A24|Оставащо време
A25|Вдишайте
A26|Задръжте леко
A27|Издишайте
A28|Готово
A29|Старт
A30|Пауза
A31|Продължаване
A32|Нулиране
B00|Дихателната сесия започна. B01|Сесията е на пауза. B02|Сесията е възобновена. B03|Сесията е нулирана. B04|Сесията приключи. Поемете си дъх спокойно. B05|Въведете цели секунди в посочените граници. B06|Тук звукът не е наличен; визуалният водач продължава да работи. B07|Вдишайте. B08|Задръжте леко. B09|Издишайте.
C00|Мога ли да използвам квадратно дишане или техниката 4-7-8?
C01|Да. Изберете предварителна настройка или коригирайте продължителността на фазите. Това са модели за ритъм на дишане, а не медицинско лечение.
C02|Ще продължи ли да работи, ако затворя раздела?
C03|Няма гаранция. Браузърите могат да поставят на пауза фоновите раздели, а устройствата — да преминават в режим на готовност. Дръжте страницата отворена и устройството активно за по-точно отчитане.
C04|Мога ли да изключа звука или да спра по-рано?
C05|Да. Звукът е по избор и може да бъде изключен. Пауза или Нулиране незабавно прекратява отчитането на времето.`,
  ca: `A00|Exercici de respiració
A01|Exercici de respiració — Gratuït i en línia | UsefulVerse
A02|Temporitzador gratuït de respiració: ritme quadrat, 4-7-8 o personalitzat. So opcional, pausa i reinici.
A03|Tria un ritme de respiració suau i segueix la guia visual. Mantingues la sessió còmoda; atura-la quan vulguis.
A04|Com utilitzo aquest exercici de respiració?
A05|Tria una opció predefinida o configura cada fase, selecciona la durada de la sessió i prem «Inicia». Pots fer una pausa o reiniciar en qualsevol moment. L'àudio és opcional i només comença un cop iniciada la sessió.
A06|Es penja la meva sessió de respiració?
A07|No. El temporitzador funciona dins d'aquesta pàgina. No s'utilitzen comptes, càrregues de dades, API ni es desa la sessió.
A08|Patró de respiració
A09|Personalitzat
A10|Ritme suau — inspira 4 / expira 6
A11|Respiració quadrada — 4 / 4 / 4 / 4
A12|4-7-8 — inspira 4 / retén 7 / expira 8
A13|Inspira (segons)
A14|Retén després d'inspirar (segons)
A15|Expira (segons)
A16|Retén després d'expirar (segons)
A17|Durada de la sessió (segons)
A18|Indicadors sonors
A19|Reprodueix un to suau quan canviï la fase
A20|La guia evita moviments sobtats quan s'activa l'opció de moviment reduït.
A21|Aquest és un temporitzador de benestar general, no un tractament mèdic. Respira còmodament i atura't si no et trobes bé.
A22|Fase actual
A23|Cicle
A24|Temps restant
A25|Inspira
A26|Retén suaument
A27|Expira
A28|Completat
A29|Inicia
A30|Pausa
A31|Reprèn
A32|Reinicia
B00|Sessió de respiració iniciada. B01|Sessió en pausa. B02|Sessió represa. B03|Sessió reiniciada. B04|Sessió finalitzada. Fes una respiració còmoda. B05|Introdueix segons sencers dins dels límits indicats. B06|El so no està disponible aquí; la guia visual continua funcionant. B07|Inspira. B08|Retén suaument. B09|Expira.
C00|Puc utilitzar la respiració quadrada o la tècnica 4-7-8?
C01|Sí. Tria una configuració predeterminada o ajusta la durada de les fases. Són patrons de ritme, no un tractament mèdic.
C02|Continuarà funcionant si tanco la pestanya?
C03|No hi ha garanties. Els navegadors poden pausar les pestanyes en segon pla i els dispositius poden entrar en mode de repòs. Mantén la pàgina oberta i el dispositiu actiu per a una temporització més fiable.
C04|Puc desactivar el so o aturar-ho abans d'hora?
C05|Sí. El so és opcional i es pot desactivar. Pausa o Reinicia atura immediatament la temporització en curs.`,
  ha: `A00|Atisayen Numfashi
A01|Atisayen Numfashi — Kyauta ta Yanar Gizo | UsefulVerse
A02|Agogon numfashi na kyauta: tsarin box, 4-7-8 ko naka. Sauti, dakatarwa da sake farawa zaɓi ne.
A03|Zaɓi saurin numfashi mai sauƙi sannan ka bi jagorar gani. Ka tabbata kana cikin yanayi mai daɗi yayin atisayen; za ka iya dakatarwa duk lokacin da kake so.
A04|Ta yaya zan yi amfani da wannan atisayen numfashi?
A05|Zaɓi tsarin da aka riga aka tanada ko saita kowane mataki, zaɓi tsawon atisayen, sannan danna Fara. Za ka iya dakatarwa ko sake farawa a kowane lokaci. Sauti zaɓi ne kuma yana aiki ne bayan ka fara.
A06|Ana loda bayanan atisayen numfashina?
A07|A'a. Agogon yana aiki ne a cikin wannan shafin kawai. Ba a amfani da asusu, lodawa, API ko adana bayanan atisayen.
A08|Tsarin numfashi
A09|Na musamman
A10|Sauri mai sauƙi — shaka iska 4 / fitar da iska 6
A11|Numfashin box — 4 / 4 / 4 / 4
A12|4-7-8 — shaka iska 4 / riƙe 7 / fitar da iska 8
A13|Shaka iska (daƙiƙa)
A14|Riƙe numfashi bayan shaka (daƙiƙa)
A15|Fitar da iska (daƙiƙa)
A16|Riƙe numfashi bayan fitar da iska (daƙiƙa)
A17|Tsawon lokacin atisayen (daƙiƙa)
A18|Alamun sauti
A19|Kunna sauti mai laushi idan mataki ya canza
A20|Jagorar tana guje wa motsi mai ƙarfi idan an kunna zaɓin rage motsi.
A21|Wannan agogo ne na walwala gaba ɗaya, ba magani ba. Yi numfashi cikin kwanciyar hankali kuma ka dakatar idan ka ji rashin lafiya.
A22|Matakin yanzu
A23|Zagaye
A24|Lokacin da ya rage
A25|Shaka iska
A26|Riƙe a hankali
A27|Fitar da iska
A28|An kammala
A29|Fara
A30|Dakatar
A31|Ci gaba
A32|Sake farawa
B00|An fara atisayen numfashi. B01|An dakatar da zaman. B02|An ci gaba da zaman. B03|An sake saita zaman. B04|Zaman ya kammala. Yi numfashi cikin sauƙi. B05|Shigar da daƙiƙa cikakku cikin iyakokin da aka nuna. B06|Sauti ba ya nan; jagorar gani har yanzu tana aiki. B07|Shaka iska. B08|Riƙe a hankali. B09|Fitar da iska.
C00|Zan iya amfani da numfashin box ko 4-7-8?
C01|Eh. Zaɓi tsarin da aka tanada ko daidaita tsawon kowane mataki. Waɗannan hanyoyi ne na daidaita numfashi, ba magani ba.
C02|Shin agogon zai ci gaba idan na rufe shafin?
C03|Babu garanti. Masu bincike na iya dakatar da shafuka na baya kuma na'urori su shiga yanayin barci. Buɗe wannan shafin kuma bar na'urar a kunne don samun lokaci mafi inganci.
C04|Zan iya kashe sauti ko tsayawa da wuri?
C05|Eh. Sauti zaɓi ne kuma ana iya kashe shi. Dakatar ko sake saita agogo don tsayar da shi nan take.`,
  fa: `A00|تمرین تنفس
A01|تمرین تنفس — رایگان و آنلاین | UsefulVerse
A02|تایمر رایگان تنفس: الگوی جعبه‌ای، ۴-۷-۸ یا سرعت دلخواه. صدای اختیاری، توقف و بازنشانی.
A03|سرعت ملایمی برای تنفس انتخاب کنید و راهنمای تصویری را دنبال کنید. تمرین را در وضعیتی راحت انجام دهید و هر زمان خواستید، آن را متوقف کنید.
A04|چگونه از این تمرین تنفس استفاده کنم؟
A05|یکی از حالت‌های پیش‌فرض را انتخاب کنید یا زمان هر مرحله را تعیین کنید؛ سپس مدت جلسه را مشخص کرده و «شروع» را بزنید. هر زمان می‌توانید تمرین را متوقف یا بازنشانی کنید. صدا اختیاری است و تنها پس از شروع فعال می‌شود.
A06|آیا اطلاعات جلسه تنفس من بارگذاری می‌شود؟
A07|خیر. زمان‌بندی فقط در همین صفحه اجرا می‌شود. نیازی به حساب، بارگذاری اطلاعات، API یا ذخیره جلسه نیست.
A08|الگوی تنفس
A09|دلخواه
A10|سرعت آرام — دم ۴ / بازدم ۶
A11|تنفس جعبه‌ای — ۴ / ۴ / ۴ / ۴
A12|۴-۷-۸ — دم ۴ / حبس ۷ / بازدم ۸
A13|دم (ثانیه)
A14|حبس پس از دم (ثانیه)
A15|بازدم (ثانیه)
A16|حبس پس از بازدم (ثانیه)
A17|مدت جلسه (ثانیه)
A18|نشانه‌های صوتی
A19|هنگام تغییر مرحله، صدای ملایمی پخش شود
A20|هنگام فعال بودن حالت کاهش حرکت، راهنما از حرکات ناگهانی پرهیز می‌کند.
A21|این تایمر برای تندرستی عمومی است و جایگزین مراقبت پزشکی نیست. راحت نفس بکشید و اگر احساس ناخوشایندی داشتید، تمرین را متوقف کنید.
A22|مرحله فعلی
A23|چرخه
A24|زمان باقی‌مانده
A25|دم
A26|حبس ملایم نفس
A27|بازدم
A28|کامل شد
A29|شروع
A30|توقف
A31|ادامه
A32|بازنشانی
B00|جلسه تنفس آغاز شد. B01|جلسه متوقف شد. B02|جلسه از سر گرفته شد. B03|جلسه بازنشانی شد. B04|جلسه کامل شد. راحت نفس بکشید. B05|عدد صحیح ثانیه را در محدوده نمایش‌داده‌شده وارد کنید. B06|صدا در دسترس نیست؛ راهنمای تصویری همچنان کار می‌کند. B07|نفس بکشید. B08|به‌آرامی نگه دارید. B09|بازدم کنید.
C00|آیا می‌توانم از تنفس جعبه‌ای یا روش ۴-۷-۸ استفاده کنم؟
C01|بله. یک الگوی آماده انتخاب کنید یا مدت هر مرحله را تنظیم کنید. این‌ها الگوهای تنظیم ریتم تنفس هستند، نه درمان پزشکی.
C02|اگر برگه را ببندم، تایمر همچنان کار می‌کند؟
C03|تضمینی نیست. مرورگرها ممکن است برگه‌های پس‌زمینه را متوقف کنند و دستگاه‌ها به حالت خواب بروند. برای زمان‌بندی دقیق‌تر، صفحه را باز و دستگاه را فعال نگه دارید.
C04|می‌توانم صدا را خاموش کنم یا زودتر متوقف شوم؟
C05|بله. صدا اختیاری است و می‌توان آن را خاموش کرد. توقف یا بازنشانی، زمان‌سنجی فعال را فوراً پایان می‌دهد.`,
  gu: `A00|શ્વાસ લેવાની કસરત
A01|શ્વાસ લેવાની કસરત — મફત ઓનલાઇન | UsefulVerse
A02|મફત શ્વાસ ટાઈમર: બોક્સ, 4-7-8 અથવા તમારી ગતિ. વૈકલ્પિક અવાજ, થોભાવો અને રીસેટ.
A03|શ્વાસ લેવાની હળવી ગતિ પસંદ કરો અને વિઝ્યુઅલ માર્ગદર્શિકાને અનુસરો. સત્રને આરામદાયક રાખો; જ્યારે ઈચ્છો ત્યારે અટકી જાઓ.
A04|હું આ શ્વાસ લેવાની કસરતનો ઉપયોગ કેવી રીતે કરું?
A05|પહેલેથી નિર્ધારિત વિકલ્પ પસંદ કરો અથવા દરેક તબક્કો જાતે નક્કી કરો, સત્રની અવધિ પસંદ કરો અને 'શરૂ કરો' દબાવો. કોઈપણ સમયે થોભાવી અથવા રીસેટ કરી શકાય છે. ઓડિયો વૈકલ્પિક છે અને શરૂ કર્યા પછી જ વાગે છે.
A06|શું મારું શ્વાસ લેવાનું સત્ર અપલોડ થાય છે?
A07|ના. સમયની ગણતરી આ પેજ પર જ થાય છે. એકાઉન્ટ, અપલોડ, API અથવા સત્રની માહિતી સાચવવામાં આવતી નથી.
A08|શ્વાસ લેવાની પદ્ધતિ
A09|કસ્ટમ
A10|સરળ ગતિ — શ્વાસ લો 4 / શ્વાસ છોડો 6
A11|બોક્સ બ્રીધિંગ — 4 / 4 / 4 / 4
A12|4-7-8 — શ્વાસ લો 4 / રોકી રાખો 7 / શ્વાસ છોડો 8
A13|શ્વાસ લો (સેકન્ડ)
A14|શ્વાસ લીધા પછી રોકી રાખો (સેકન્ડ)
A15|શ્વાસ છોડો (સેકન્ડ)
A16|શ્વાસ છોડ્યા પછી રોકી રાખો (સેકન્ડ)
A17|સત્રની અવધિ (સેકન્ડ)
A18|ધ્વનિ સંકેતો
A19|તબક્કો બદલાય ત્યારે હળવો અવાજ વગાડો
A20|ઓછી હિલચાલ સક્ષમ હોય ત્યારે માર્ગદર્શિકા અચાનક હિલચાલ ટાળે છે.
A21|આ સામાન્ય સુખાકારી માટેનું ટાઈમર છે, તબીબી સારવાર નથી. આરામથી શ્વાસ લો અને અસ્વસ્થતા અનુભવાય તો અટકી જાઓ.
A22|વર્તમાન તબક્કો
A23|ચક્ર
A24|બાકી સમય
A25|શ્વાસ લો
A26|હળવાશથી રોકી રાખો
A27|શ્વાસ છોડો
A28|પૂર્ણ
A29|શરૂ કરો
A30|થોભાવો
A31|ફરી શરૂ કરો
A32|રીસેટ કરો
B00|શ્વાસ લેવાનું સત્ર શરૂ થયું. B01|સત્ર અટકાવવામાં આવ્યું. B02|સત્ર ફરી શરૂ થયું. B03|સત્ર રીસેટ થયું. B04|સત્ર પૂર્ણ થયું. આરામથી શ્વાસ લો. B05|દર્શાવેલ મર્યાદાની અંદર પૂરા સેકન્ડ દાખલ કરો. B06|અહીં અવાજ ઉપલબ્ધ નથી; વિઝ્યુઅલ માર્ગદર્શિકા કામ કરે છે. B07|શ્વાસ લો. B08|હળવાશથી રોકી રાખો. B09|શ્વાસ છોડો.
C00|શું હું બોક્સ બ્રીધિંગ અથવા 4-7-8 પદ્ધતિનો ઉપયોગ કરી શકું?
C01|હા. પ્રીસેટ પસંદ કરો અથવા તબક્કાની અવધિ ગોઠવો. આ શ્વાસની ગતિના નમૂનાઓ છે, તબીબી સારવાર નથી.
C02|ટેબ બંધ કરું તો ટાઈમર ચાલતું રહેશે?
C03|ખાતરી નથી. બ્રાઉઝર બેકગ્રાઉન્ડ ટેબને અટકાવી શકે છે અને ઉપકરણ સ્લીપ મોડમાં જઈ શકે છે. વિશ્વસનીય સમય માટે પેજ ખુલ્લું રાખો અને ઉપકરણ ચાલુ રાખો.
C04|શું હું અવાજ બંધ કરી શકું અથવા વહેલું અટકી શકું?
C05|હા. અવાજ વૈકલ્પિક છે અને બંધ કરી શકાય છે. થોભાવો અથવા રીસેટ દબાવવાથી ટાઈમર તરત અટકે છે.`,
  te: `A00|శ్వాస వ్యాయామం
A01|శ్వాస వ్యాయామం — ఉచిత ఆన్‌లైన్ | UsefulVerse
A02|ఉచిత శ్వాస టైమర్: బాక్స్, 4-7-8 లేదా మీకు నచ్చిన వేగం. ఐచ్ఛిక సౌండ్, పాజ్ మరియు రీసెట్.
A03|నెమ్మదైన శ్వాస వేగాన్ని ఎంచుకుని, విజువల్ గైడ్‌ను అనుసరించండి. సెషన్‌ను సౌకర్యవంతంగా ఉంచుకోండి; మీకు నచ్చినప్పుడు ఆపండి.
A04|ఈ శ్వాస వ్యాయామాన్ని ఎలా ఉపయోగించాలి?
A05|ప్రీసెట్‌ను ఎంచుకోండి లేదా ప్రతి దశను సెట్ చేయండి, సెషన్ నిడివిని ఎంచుకుని, ప్రారంభించండి నొక్కండి. ఎప్పుడైనా పాజ్ చేయండి లేదా రీసెట్ చేయండి. ఆడియో ఐచ్ఛికం; మీరు ప్రారంభించిన తర్వాత మాత్రమే మొదలవుతుంది.
A06|నా శ్వాస సెషన్ అప్‌లోడ్ చేయబడుతుందా?
A07|లేదు. టైమింగ్ ఈ పేజీలోనే నడుస్తుంది. ఖాతా, అప్‌లోడ్, API లేదా సేవ్ చేసిన సెషన్ ఉపయోగించబడదు.
A08|శ్వాస విధానం
A09|ప్రత్యేకమైనది
A10|సులభమైన వేగం — 4 సార్లు శ్వాస లోపలికి / 6 సార్లు బయటకు
A11|బాక్స్ బ్రీతింగ్ — 4 / 4 / 4 / 4
A12|4-7-8 — 4 సార్లు లోపలికి / 7 సార్లు ఆపి / 8 సార్లు బయటకు
A13|శ్వాస లోపలికి (సెకన్లు)
A14|శ్వాస లోపలికి తీసుకున్న తర్వాత ఆపడం (సెకన్లు)
A15|శ్వాస బయటకు వదలడం (సెకన్లు)
A16|శ్వాస బయటకు వదిలిన తర్వాత ఆపడం (సెకన్లు)
A17|సెషన్ నిడివి (సెకన్లు)
A18|శబ్ద సూచనలు
A19|దశ మారినప్పుడు మృదువైన శబ్దం వినిపించండి
A20|తగ్గించిన కదలికను ఆన్ చేసినప్పుడు గైడ్ ఆకస్మిక కదలికలను నివారిస్తుంది.
A21|ఇది సాధారణ ఆరోగ్య టైమర్, వైద్య సంరక్షణ కాదు. సౌకర్యవంతంగా శ్వాస తీసుకోండి; అనారోగ్యంగా అనిపిస్తే ఆపండి.
A22|ప్రస్తుత దశ
A23|చక్రం
A24|మిగిలిన సమయం
A25|శ్వాస లోపలికి తీసుకోండి
A26|మెల్లగా ఆపండి
A27|శ్వాస బయటకు వదలండి
A28|పూర్తయింది
A29|ప్రారంభించండి
A30|పాజ్
A31|మళ్లీ ప్రారంభించండి
A32|రీసెట్
B00|శ్వాస సెషన్ ప్రారంభమైంది. B01|సెషన్ పాజ్ చేయబడింది. B02|సెషన్ మళ్లీ ప్రారంభమైంది. B03|సెషన్ రీసెట్ చేయబడింది. B04|సెషన్ పూర్తయింది. నెమ్మదిగా శ్వాస తీసుకోండి. B05|చూపిన పరిమితులలో పూర్తి సెకన్లను నమోదు చేయండి. B06|ఇక్కడ సౌండ్ అందుబాటులో లేదు; విజువల్ గైడ్ పనిచేస్తుంది. B07|శ్వాస లోపలికి తీసుకోండి. B08|మెల్లగా ఆపండి. B09|శ్వాస బయటకు వదలండి.
C00|నేను బాక్స్ బ్రీతింగ్ లేదా 4-7-8ని ఉపయోగించవచ్చా?
C01|అవును. ప్రీసెట్‌ను ఎంచుకోండి లేదా ప్రతి దశ నిడివిని సర్దుబాటు చేయండి. ఇవి శ్వాస వేగ పద్ధతులు మాత్రమే, వైద్య చికిత్స కాదు.
C02|ట్యాబ్ మూసివేసినప్పుడు టైమర్ కొనసాగుతుందా?
C03|హామీ లేదు. బ్రౌజర్‌లు బ్యాక్‌గ్రౌండ్ ట్యాబ్‌లను, నిద్రలో ఉన్న పరికరాలను పాజ్ చేయవచ్చు. ఖచ్చితమైన సమయం కోసం ఈ పేజీని తెరిచి, పరికరాన్ని మేల్కొని ఉంచండి.
C04|నేను సౌండ్‌ను ఆఫ్ చేయవచ్చా లేదా ముందుగానే ఆపవచ్చా?
C05|అవును. సౌండ్ ఐచ్ఛికం; స్టార్ట్ నొక్కిన తర్వాత మొదలవుతుంది, దాన్ని ఆఫ్ చేయవచ్చు. పాజ్ లేదా రీసెట్ యాక్టివ్ టైమింగ్‌ను వెంటనే ముగిస్తుంది.`,
  tl: `A00|Ehersisyo sa Paghinga
A01|Ehersisyo sa Paghinga — Libreng Online | UsefulVerse
A02|Libreng breathing timer: box, 4-7-8 o sarili mong pacing. Opsyonal na tunog, pause at reset.
A03|Pumili ng banayad na bilis ng paghinga at sundin ang visual na gabay. Panatilihing komportable ang sesyon; huminto kahit kailan mo gusto.
A04|Paano ko gagamitin ang ehersisyo sa paghinga na ito?
A05|Pumili ng preset o itakda ang bawat yugto, piliin ang haba ng sesyon at pindutin ang Start. I-pause o i-reset anumang oras. Opsyonal ang audio at magsisimula lamang pagkatapos mong magsimula.
A06|Na-upload ba ang aking sesyon ng paghinga?
A07|Hindi. Tumatakbo ang timing sa pahinang ito. Walang account, upload, API o naka-save na sesyon ang ginagamit.
A08|Pattern ng paghinga
A09|Pasadya
A10|Madaling bilis — huminga papasok 4 / palabas 6
A11|Box breathing — 4 / 4 / 4 / 4
A12|4-7-8 — huminga papasok 4 / pigil 7 / palabas 8
A13|Huminga papasok (segundo)
A14|Pigilan pagkatapos huminga papasok (segundo)
A15|Huminga palabas (segundo)
A16|Pigilan pagkatapos huminga palabas (segundo)
A17|Haba ng sesyon (segundo)
A18|Mga hudyat ng tunog
A19|Magpatugtog ng mahinang tono kapag nagbabago ang yugto
A20|Iniiwasan ng gabay ang biglaang galaw kapag naka-on ang pinababang galaw.
A21|Pangkalahatang timer ito para sa kalusugan, hindi pangangalagang medikal. Huminga nang komportable at huminto kung masama ang pakiramdam.
A22|Kasalukuyang yugto
A23|Siklo
A24|Natitirang oras
A25|Huminga papasok
A26|Dahan-dahang pigilin
A27|Huminga palabas
A28|Tapos na
A29|Simulan
A30|I-pause
A31|Ipagpatuloy
A32|I-reset
B00|Nagsimula na ang sesyon ng paghinga. B01|Nahinto ang sesyon. B02|Nagpatuloy ang sesyon. B03|Ni-reset ang sesyon. B04|Tapos na ang sesyon. Huminga nang komportable. B05|Maglagay ng buong segundo sa loob ng ipinapakitang mga limitasyon. B06|Hindi magagamit ang tunog dito; gumagana pa rin ang visual na gabay. B07|Huminga papasok. B08|Dahan-dahang pigilin. B09|Huminga palabas.
C00|Maaari ko bang gamitin ang box breathing o 4-7-8?
C01|Oo. Pumili ng preset o ayusin ang haba ng mga yugto. Mga pattern ito ng paghinga, hindi medikal na paggamot.
C02|Tatakbo pa ba ito kapag isinara ko ang tab?
C03|Walang garantiya. Maaaring i-pause ng mga browser ang background tab at maaaring matulog ang device. Panatilihing bukas ang page at gising ang device para sa mas maaasahang timing.
C04|Maaari ko bang patayin ang tunog o huminto nang maaga?
C05|Oo. Opsyonal ang tunog at maaari itong patayin. Agad na ititigil ng I-pause o I-reset ang aktibong timer.`,
  ta: `A00|சுவாசப் பயிற்சி
A01|சுவாசப் பயிற்சி — இலவசம் | UsefulVerse
A02|இலவச சுவாச டைமர்: Box, 4-7-8 அல்லது தனிப்பயன் வேகம். விருப்ப ஒலி, இடைநிறுத்தம் மற்றும் மீட்டமைப்பு.
A03|மென்மையான சுவாச வேகத்தைத் தேர்ந்தெடுத்து, திரையில் உள்ள வழிகாட்டியைப் பின்பற்றவும். பயிற்சியை வசதியாக மேற்கொள்ளுங்கள்; எப்போது வேண்டுமானாலும் நிறுத்தலாம்.
A04|இந்தச் சுவாசப் பயிற்சியை எவ்வாறு பயன்படுத்துவது?
A05|முன்னமைவைத் தேர்ந்தெடுக்கவும் அல்லது ஒவ்வொரு நிலையையும் அமைக்கவும்; பயிற்சியின் கால அளவைத் தேர்ந்தெடுத்து 'தொடங்கு' என்பதை அழுத்தவும். எப்போது வேண்டுமானாலும் இடைநிறுத்தலாம் அல்லது மீட்டமைக்கலாம். ஒலி விருப்பத்திற்குரியது; தொடங்கிய பின்னரே ஒலிக்கும்.
A06|எனது சுவாசப் பயிற்சித் தரவு பதிவேற்றப்படுகிறதா?
A07|இல்லை. நேரக் கணக்கீடு இந்தப் பக்கத்திலேயே நடைபெறுகிறது. கணக்கு, பதிவேற்றம், API அல்லது சேமிக்கப்பட்ட பயிற்சி எதுவும் பயன்படுத்தப்படுவதில்லை.
A08|சுவாச முறை
A09|தனிப்பயன்
A10|எளிய வேகம் — உள்ளிழுத்தல் 4 / வெளியிடுதல் 6
A11|Box breathing — 4 / 4 / 4 / 4
A12|4-7-8 — உள்ளிழுத்தல் 4 / நிறுத்துதல் 7 / வெளியிடுதல் 8
A13|உள்ளிழுத்தல் (நொடிகள்)
A14|உள்ளிழுத்த பின் நிறுத்துதல் (நொடிகள்)
A15|வெளியிடுதல் (நொடிகள்)
A16|வெளியிட்ட பின் நிறுத்துதல் (நொடிகள்)
A17|பயிற்சியின் கால அளவு (நொடிகள்)
A18|ஒலி குறிப்புகள்
A19|நிலை மாறும்போது மென்மையான ஒலியை ஒலிக்கச் செய்யவும்
A20|குறைந்த அசைவு அமைப்பு இயக்கப்பட்டால் வழிகாட்டி திடீர் அசைவுகளைத் தவிர்க்கும்.
A21|இது பொதுவான நல்வாழ்வுக்கான டைமர்; மருத்துவச் சிகிச்சை அல்ல. வசதியாகச் சுவாசிக்கவும்; உடல்நலக்குறைவு ஏற்பட்டால் நிறுத்தவும்.
A22|தற்போதைய நிலை
A23|சுழற்சி
A24|மீதமுள்ள நேரம்
A25|உள்ளிழுக்கவும்
A26|மென்மையாக நிறுத்தி வைக்கவும்
A27|வெளியேற்றவும்
A28|முடிந்தது
A29|தொடங்கு
A30|இடைநிறுத்து
A31|தொடரவும்
A32|மீட்டமை
B00|சுவாசப் பயிற்சி தொடங்கியது. B01|பயிற்சி இடைநிறுத்தப்பட்டது. B02|பயிற்சி மீண்டும் தொடங்கியது. B03|பயிற்சி மீட்டமைக்கப்பட்டது. B04|பயிற்சி முடிந்தது. நிதானமாக மூச்சு விடுங்கள். B05|காட்டப்பட்டுள்ள வரம்புகளுக்குள் முழு வினாடிகளை உள்ளிடவும். B06|இங்கு ஒலி இல்லை; காட்சி வழிகாட்டி தொடர்ந்து செயல்படும். B07|மூச்சை உள்ளிழுக்கவும். B08|மென்மையாக நிறுத்தி வைக்கவும். B09|மூச்சை வெளியேற்றவும்.
C00|நான் Box Breathing அல்லது 4-7-8 முறையைப் பயன்படுத்தலாமா?
C01|ஆம். முன்னமைவைத் தேர்ந்தெடுக்கவும் அல்லது ஒவ்வொரு நிலையின் கால அளவை மாற்றவும். இவை சுவாச வேக வழிகாட்டிகள்; மருத்துவச் சிகிச்சை அல்ல.
C02|தாவலை மூடினாலும் டைமர் இயங்குமா?
C03|உறுதியில்லை. உலாவிகள் பின்னணித் தாவல்களை இடைநிறுத்தலாம்; சாதனங்கள் தூக்க நிலைக்குச் செல்லலாம். துல்லியமான நேரக் கணக்கிற்கு பக்கத்தைத் திறந்தும் சாதனத்தைச் செயலிலும் வைத்திருக்கவும்.
C04|ஒலியை அணைக்கவோ முன்கூட்டியே நிறுத்தவோ முடியுமா?
C05|ஆம். ஒலி விருப்பத்திற்குரியது; அதை அணைக்கலாம். இடைநிறுத்து அல்லது மீட்டமை என்பதை அழுத்தினால் டைமர் உடனடியாக நிற்கும்.`,
  el: `A00|Άσκηση αναπνοής
A01|Άσκηση αναπνοής — Δωρεάν online | UsefulVerse
A02|Δωρεάν χρονόμετρο αναπνοής: τεχνική «κουτιού», 4-7-8 ή προσαρμοσμένος ρυθμός. Προαιρετικός ήχος, παύση και επαναφορά.
A03|Επιλέξτε έναν ήπιο ρυθμό αναπνοής και ακολουθήστε τον οπτικό οδηγό. Διατηρήστε τη διαδικασία άνετη και σταματήστε όποτε θέλετε.
A04|Πώς χρησιμοποιώ αυτή την άσκηση αναπνοής;
A05|Επιλέξτε μια προκαθορισμένη ρύθμιση ή ορίστε κάθε φάση, επιλέξτε τη διάρκεια της συνεδρίας και πατήστε «Έναρξη». Μπορείτε να κάνετε παύση ή επαναφορά ανά πάσα στιγμή. Ο ήχος είναι προαιρετικός και ενεργοποιείται μόνο αφού ξεκινήσετε.
A06|Μεταφορτώνονται τα δεδομένα της συνεδρίας αναπνοής μου;
A07|Όχι. Η χρονομέτρηση γίνεται σε αυτή τη σελίδα. Δεν χρησιμοποιούνται λογαριασμός, μεταφόρτωση δεδομένων, API ή αποθήκευση συνεδρίας.
A08|Μοτίβο αναπνοής
A09|Προσαρμοσμένο
A10|Ήπιος ρυθμός — εισπνοή 4 / εκπνοή 6
A11|Αναπνοή «κουτιού» — 4 / 4 / 4 / 4
A12|4-7-8 — εισπνοή 4 / κράτημα 7 / εκπνοή 8
A13|Εισπνοή (δευτερόλεπτα)
A14|Κράτημα μετά την εισπνοή (δευτερόλεπτα)
A15|Εκπνοή (δευτερόλεπτα)
A16|Κράτημα μετά την εκπνοή (δευτερόλεπτα)
A17|Διάρκεια συνεδρίας (δευτερόλεπτα)
A18|Ηχητικά σήματα
A19|Αναπαραγωγή απαλού ήχου κατά την αλλαγή φάσης
A20|Ο οδηγός αποφεύγει τις απότομες κινήσεις όταν είναι ενεργοποιημένη η λειτουργία μειωμένης κίνησης.
A21|Πρόκειται για χρονόμετρο γενικής ευεξίας, όχι για ιατρική φροντίδα. Αναπνεύστε άνετα και σταματήστε εάν νιώσετε αδιαθεσία.
A22|Τρέχουσα φάση
A23|Κύκλος
A24|Χρόνος που απομένει
A25|Εισπνοή
A26|Ήπιο κράτημα
A27|Εκπνοή
A28|Ολοκλήρωση
A29|Έναρξη
A30|Παύση
A31|Συνέχιση
A32|Επαναφορά
B00|Η συνεδρία αναπνοής ξεκίνησε. B01|Η συνεδρία διακόπηκε προσωρινά. B02|Η συνεδρία συνεχίστηκε. B03|Η συνεδρία επανεκκινήθηκε. B04|Η συνεδρία ολοκληρώθηκε. Πάρτε μια άνετη ανάσα. B05|Εισαγάγετε ακέραια δευτερόλεπτα εντός των εμφανιζόμενων ορίων. B06|Ο ήχος δεν είναι διαθέσιμος εδώ· ο οπτικός οδηγός λειτουργεί κανονικά. B07|Εισπνεύστε. B08|Κρατήστε την αναπνοή σας απαλά. B09|Εκπνεύστε.
C00|Μπορώ να χρησιμοποιήσω την τεχνική «αναπνοή του κουτιού» ή τη μέθοδο 4-7-8;
C01|Ναι. Επιλέξτε μια προκαθορισμένη ρύθμιση ή προσαρμόστε τη διάρκεια των φάσεων. Πρόκειται για πρότυπα ρυθμού αναπνοής, όχι για ιατρική θεραπεία.
C02|Θα συνεχίσει να λειτουργεί αν κλείσω την καρτέλα;
C03|Δεν υπάρχει εγγύηση. Τα προγράμματα περιήγησης ενδέχεται να θέτουν σε παύση τις καρτέλες στο παρασκήνιο και οι συσκευές να μεταβούν σε αναστολή λειτουργίας. Διατηρήστε τη σελίδα ανοιχτή και τη συσκευή ενεργή για αξιόπιστη χρονομέτρηση.
C04|Μπορώ να απενεργοποιήσω τον ήχο ή να σταματήσω νωρίτερα;
C05|Ναι. Ο ήχος είναι προαιρετικός και μπορεί να απενεργοποιηθεί. Η παύση ή η επαναφορά τερματίζει άμεσα τη χρονομέτρηση.`,
  uk: `A00|Дихальна вправа
A01|Дихальна вправа — безкоштовно онлайн | UsefulVerse
A02|Безкоштовний таймер дихання: квадратне дихання, 4-7-8 або власний темп. Опційний звук, пауза та скидання.
A03|Оберіть спокійний темп дихання та дотримуйтесь візуальних підказок. Дихайте комфортно; зупиніться в будь-який момент.
A04|Як користуватися цією дихальною вправою?
A05|Оберіть готовий режим або налаштуйте фази, виберіть тривалість сеансу та натисніть «Почати». Ви можете призупинити або скинути таймер у будь-який момент. Звук необов'язковий і вмикається лише після початку вправи.
A06|Чи завантажуються дані мого сеансу дихання?
A07|Ні. Таймер працює безпосередньо на цій сторінці. Не потрібні реєстрація, завантаження даних, API чи збереження сеансів.
A08|Схема дихання
A09|Власна
A10|Легкий темп — вдих 4 / видих 6
A11|Квадратне дихання — 4 / 4 / 4 / 4
A12|4-7-8 — вдих 4 / затримка 7 / видих 8
A13|Вдих (секунди)
A14|Затримка після вдиху (секунди)
A15|Видих (секунди)
A16|Затримка після видиху (секунди)
A17|Тривалість сеансу (секунди)
A18|Звукові сигнали
A19|Відтворювати м'який сигнал при зміні фази
A20|Візуальний супровід уникає різких рухів, якщо активовано режим обмеженої анімації.
A21|Це таймер загального оздоровлення, а не медичний засіб. Дихайте комфортно та припиніть вправу, якщо відчуєте нездужання.
A22|Поточна фаза
A23|Цикл
A24|Залишилося часу
A25|Вдих
A26|М'яка затримка
A27|Видих
A28|Завершено
A29|Почати
A30|Пауза
A31|Продовжити
A32|Скинути
B00|Сеанс дихання розпочато. B01|Сеанс призупинено. B02|Сеанс відновлено. B03|Сеанс скинуто. B04|Сеанс завершено. Зробіть спокійний вдих. B05|Введіть цілу кількість секунд у зазначених межах. B06|Звук тут недоступний, але візуальна підказка працює. B07|Вдихніть. B08|Затримайте дихання без напруження. B09|Видихніть.
C00|Чи можна використовувати квадратне дихання або метод 4-7-8?
C01|Так. Виберіть готовий режим або налаштуйте тривалість фаз. Це схеми ритму дихання, а не медична процедура.
C02|Чи продовжить таймер працювати, якщо я закрию вкладку?
C03|Гарантії немає. Браузери можуть призупиняти фонові вкладки, а пристрої — переходити в сплячий режим. Для точного відліку тримайте сторінку відкритою, а пристрій — активним.
C04|Чи можна вимкнути звук або зупинити раніше?
C05|Так. Звук необов'язковий і його можна вимкнути. Пауза або скидання миттєво зупиняє відлік.`,
  sw: `A00|Zoezi la Kupumua
A01|Zoezi la Kupumua — Bure Mtandaoni | UsefulVerse
A02|Kipima muda cha kupumua cha bure: mbinu ya box, 4-7-8 au kasi yako. Sauti ya hiari, kusitisha na kuanza upya.
A03|Chagua kasi tulivu ya kupumua na ufuate mwongozo wa kuona. Hakikisha zoezi linakufanya ujisikie vizuri; simama wakati wowote unapotaka.
A04|Ninafanyaje zoezi hili la kupumua?
A05|Chagua mpangilio uliopo au weka muda wa kila hatua, chagua muda wa zoezi na ubonyeze Anza. Sitisha au anza upya wakati wowote. Sauti ni ya hiari na huanza tu baada ya kuanza zoezi.
A06|Je, zoezi langu la kupumua linapakiwa mtandaoni?
A07|Hapana. Kipima muda kinafanya kazi kwenye ukurasa huu tu. Hakuna akaunti, upakiaji wa data, API au uhifadhi wa taarifa za zoezi.
A08|Mbinu ya kupumua
A09|Maalum
A10|Kasi tulivu — vuta hewa 4 / toa hewa 6
A11|Kupumua kwa box — 4 / 4 / 4 / 4
A12|4-7-8 — vuta hewa 4 / shikilia 7 / toa hewa 8
A13|Vuta hewa (sekunde)
A14|Shikilia baada ya kuvuta hewa (sekunde)
A15|Toa hewa (sekunde)
A16|Shikilia baada ya kutoa hewa (sekunde)
A17|Muda wa zoezi (sekunde)
A18|Ishara za sauti
A19|Cheza sauti laini wakati hatua inabadilika
A20|Mwongozo huepuka miondoko ya ghafla wakati chaguo la kupunguza miondoko limewashwa.
A21|Hiki ni kipima muda cha ustawi wa jumla, si huduma ya kimatibabu. Pumua kwa raha na usimame ikiwa hujisikii vizuri.
A22|Hatua ya sasa
A23|Mzunguko
A24|Muda uliobaki
A25|Vuta hewa
A26|Shikilia taratibu
A27|Toa hewa
A28|Imekamilika
A29|Anza
A30|Sitisha
A31|Endelea
A32|Anza upya
B00|Zoezi la kupumua limeanza. B01|Kipindi kimesitishwa. B02|Kipindi kimeendelea. B03|Kipindi kimewekwa upya. B04|Kipindi kimekamilika. Pumua kwa utulivu. B05|Weka sekunde kamili ndani ya viwango vilivyoonyeshwa. B06|Sauti haipatikani hapa; mwongozo wa kuona bado unafanya kazi. B07|Vuta pumzi ndani. B08|Shikilia taratibu. B09|Toa pumzi nje.
C00|Je, naweza kutumia mbinu ya box breathing au 4-7-8?
C01|Ndiyo. Chagua mpangilio uliowekwa awali au rekebisha muda wa kila hatua. Hizi ni mbinu za kupanga kasi ya kupumua, si matibabu.
C02|Je, kipima muda kitaendelea nikifunga kichupo?
C03|Hakuna uhakika. Vivinjari vinaweza kusitisha vichupo vya chinichini na vifaa kuingia katika hali ya usingizi. Weka ukurasa wazi na kifaa kiwe hai ili kupata muda sahihi zaidi.
C04|Je, naweza kuzima sauti au kusimama mapema?
C05|Ndiyo. Sauti ni hiari na inaweza kuzimwa. Kusitisha au kuanza upya husimamisha kipima muda mara moja.`,
  mr: `A00|श्वसनाचा व्यायाम
A01|श्वसनाचा व्यायाम — मोफत ऑनलाइन | UsefulVerse
A02|मोफत श्वसन टाइमर: बॉक्स, 4-7-8 किंवा स्वतःचा वेग. ऐच्छिक आवाज, थांबवणे आणि रीसेट.
A03|श्वसनाची सहज गती निवडा आणि स्क्रीनवरील मार्गदर्शनाचे अनुसरण करा. सत्र आरामदायक ठेवा; तुम्हाला हवे तेव्हा थांबा.
A04|या श्वसनाच्या व्यायामाचा वापर कसा करावा?
A05|आधीपासूनची पद्धत निवडा किंवा प्रत्येक टप्प्याचा कालावधी ठरवा, सत्राचा एकूण वेळ निवडा आणि सुरू करा दाबा. कधीही थांबवा किंवा रीसेट करा. आवाज ऐच्छिक आहे आणि सत्र सुरू केल्यानंतरच वाजतो.
A06|माझे श्वसनाचे सत्र अपलोड केले जाते का?
A07|नाही. टाइमर याच पेजवर चालतो. खाते, अपलोड, API किंवा सत्राची माहिती जतन केली जात नाही.
A08|श्वसनाची पद्धत
A09|स्वतःची
A10|सहज गती — श्वास घेणे ४ / श्वास सोडणे ६
A11|बॉक्स ब्रीदिंग — ४ / ४ / ४ / ४
A12|4-7-8 — श्वास घेणे ४ / रोखून धरणे ७ / श्वास सोडणे ८
A13|श्वास घेणे (सेकंद)
A14|श्वास घेतल्यानंतर रोखून धरणे (सेकंद)
A15|श्वास सोडणे (सेकंद)
A16|श्वास सोडल्यानंतर रोखून धरणे (सेकंद)
A17|सत्राचा कालावधी (सेकंद)
A18|ध्वनी संकेत
A19|टप्पा बदलताना सौम्य आवाज वाजवा
A20|कमी हालचाल पर्याय सुरू असताना मार्गदर्शक अचानक हालचाली टाळते.
A21|हे सामान्य आरोग्यासाठीचे टाइमर आहे, वैद्यकीय उपचार नाही. आरामात श्वास घ्या आणि अस्वस्थ वाटल्यास थांबा.
A22|सध्याचा टप्पा
A23|चक्र
A24|उर्वरित वेळ
A25|श्वास घ्या
A26|हळुवारपणे रोखून धरा
A27|श्वास सोडा
A28|पूर्ण झाले
A29|सुरू करा
A30|थांबवा
A31|पुन्हा सुरू करा
A32|रीसेट करा
B00|श्वसनाचे सत्र सुरू झाले. B01|सत्र थांबवले. B02|सत्र पुन्हा सुरू झाले. B03|सत्र रीसेट झाले. B04|सत्र पूर्ण झाले. आरामात श्वास घ्या. B05|दर्शविलेल्या मर्यादेत पूर्ण सेकंद प्रविष्ट करा. B06|येथे आवाज उपलब्ध नाही; दृश्य मार्गदर्शक काम करेल. B07|श्वास आत घ्या. B08|हळुवारपणे रोखून धरा. B09|श्वास बाहेर सोडा.
C00|मी बॉक्स ब्रीदिंग किंवा 4-7-8 पद्धत वापरू शकतो का?
C01|हो. आधीची पद्धत निवडा किंवा टप्प्यांचा कालावधी बदला. हे श्वसनाच्या गतीचे नमुने आहेत, वैद्यकीय उपचार नाहीत.
C02|टॅब बंद केल्यावर टाइमर चालू राहील का?
C03|याची खात्री देता येत नाही. ब्राउझर बॅकग्राउंड टॅब थांबवू शकतात आणि डिव्हाइस स्लीप मोडमध्ये जाऊ शकते. अधिक अचूक वेळेसाठी पेज उघडे व डिव्हाइस सक्रिय ठेवा.
C04|मी आवाज बंद करू किंवा लवकर थांबवू शकतो का?
C05|हो. आवाज ऐच्छिक आहे आणि बंद करता येतो. थांबवा किंवा रीसेट करा दाबल्यास टाइमर लगेच थांबतो.`,
  ms: `A00|Senaman Pernafasan
A01|Senaman Pernafasan — Percuma Dalam Talian | UsefulVerse
A02|Pemasa pernafasan percuma: rentak box, 4-7-8 atau tersuai. Bunyi pilihan, jeda dan tetapan semula.
A03|Pilih rentak pernafasan yang lembut dan ikuti panduan visual. Pastikan sesi terasa selesa; anda boleh berhenti pada bila-bila masa.
A04|Bagaimanakah cara menggunakan senaman pernafasan ini?
A05|Pilih tetapan pratetap atau tetapkan setiap fasa, pilih tempoh sesi dan tekan Mula. Jeda atau tetapkan semula pada bila-bila masa. Audio adalah pilihan dan hanya bermula selepas anda memulakan sesi.
A06|Adakah sesi pernafasan saya dimuat naik?
A07|Tidak. Pemasa berjalan pada halaman ini sahaja. Tiada akaun, muat naik, API atau penyimpanan sesi digunakan.
A08|Corak pernafasan
A09|Tersuai
A10|Rentak santai — tarik nafas 4 / hembus nafas 6
A11|Pernafasan box — 4 / 4 / 4 / 4
A12|4-7-8 — tarik nafas 4 / tahan 7 / hembus nafas 8
A13|Tarik nafas (saat)
A14|Tahan selepas tarik nafas (saat)
A15|Hembus nafas (saat)
A16|Tahan selepas hembus nafas (saat)
A17|Tempoh sesi (saat)
A18|Isyarat bunyi
A19|Mainkan nada lembut apabila fasa bertukar
A20|Panduan ini mengelakkan pergerakan paksa apabila mod pergerakan dikurangkan diaktifkan.
A21|Ini ialah pemasa kesejahteraan umum, bukan rawatan perubatan. Bernafaslah dengan selesa dan berhenti jika anda berasa kurang sihat.
A22|Fasa semasa
A23|Kitaran
A24|Baki masa
A25|Tarik nafas
A26|Tahan dengan lembut
A27|Hembus nafas
A28|Selesai
A29|Mula
A30|Jeda
A31|Sambung semula
A32|Tetapkan semula
B00|Sesi pernafasan bermula. B01|Sesi dijeda. B02|Sesi disambung semula. B03|Sesi ditetapkan semula. B04|Sesi selesai. Tarik nafas dengan selesa. B05|Masukkan nilai saat penuh dalam had yang dipaparkan. B06|Bunyi tidak tersedia di sini; panduan visual masih berfungsi. B07|Tarik nafas. B08|Tahan dengan lembut. B09|Hembus nafas.
C00|Bolehkah saya menggunakan teknik pernafasan box atau 4-7-8?
C01|Boleh. Pilih tetapan pratetap atau laraskan tempoh setiap fasa. Ini ialah corak rentak pernafasan, bukan rawatan perubatan.
C02|Adakah pemasa terus berjalan apabila saya menutup tab?
C03|Tiada jaminan. Pelayar boleh menjeda tab latar belakang dan peranti boleh memasuki mod tidur. Pastikan halaman dibuka dan peranti aktif untuk pemasaan yang lebih tepat.
C04|Bolehkah saya mematikan bunyi atau berhenti lebih awal?
C05|Boleh. Bunyi ialah pilihan dan boleh dimatikan. Jeda atau Tetapkan semula akan menghentikan pemasa serta-merta.`,
  pl: `A00|Ćwiczenie oddechowe
A01|Ćwiczenie oddechowe — darmowe i online | UsefulVerse
A02|Darmowy minutnik oddechowy: oddech kwadratowy, 4-7-8 lub własne tempo. Opcjonalny dźwięk, pauza i reset.
A03|Wybierz spokojne tempo oddychania i podążaj za wskazówkami wizualnymi. Dbaj o komfort podczas sesji; przerwij w dowolnym momencie.
A04|Jak korzystać z tego ćwiczenia oddechowego?
A05|Wybierz gotowy schemat lub ustaw czas każdej fazy, określ długość sesji i naciśnij „Start”. W każdej chwili możesz wstrzymać lub zresetować ćwiczenie. Dźwięk jest opcjonalny i włącza się dopiero po rozpoczęciu sesji.
A06|Czy dane mojej sesji są przesyłane?
A07|Nie. Odliczanie odbywa się na tej stronie. Nie jest wymagane konto ani przesyłanie danych; nie korzystamy z API ani nie zapisujemy sesji.
A08|Schemat oddechu
A09|Własny
A10|Spokojne tempo — wdech 4 / wydech 6
A11|Oddech kwadratowy — 4 / 4 / 4 / 4
A12|4-7-8 — wdech 4 / zatrzymanie 7 / wydech 8
A13|Wdech (sekundy)
A14|Zatrzymanie po wdechu (sekundy)
A15|Wydech (sekundy)
A16|Zatrzymanie po wydechu (sekundy)
A17|Czas trwania sesji (sekundy)
A18|Sygnały dźwiękowe
A19|Odtwórz delikatny dźwięk przy zmianie fazy
A20|Wskazówki wizualne unikają gwałtownych ruchów po włączeniu trybu ograniczonej animacji.
A21|To narzędzie służy ogólnemu samopoczuciu i nie stanowi porady medycznej. Oddychaj swobodnie i przerwij, jeśli poczujesz się źle.
A22|Aktualna faza
A23|Cykl
A24|Pozostały czas
A25|Wdech
A26|Delikatne zatrzymanie
A27|Wydech
A28|Zakończono
A29|Start
A30|Pauza
A31|Wznów
A32|Reset
B00|Sesja oddechowa rozpoczęta. B01|Sesja wstrzymana. B02|Sesja wznowiona. B03|Sesja zresetowana. B04|Sesja zakończona. Weź swobodny oddech. B05|Wprowadź pełne sekundy w podanym zakresie. B06|Dźwięk jest tu niedostępny; wskazówki wizualne nadal działają. B07|Wdech. B08|Delikatne zatrzymanie. B09|Wydech.
C00|Czy mogę stosować oddychanie pudełkowe lub metodę 4-7-8?
C01|Tak. Wybierz gotowy schemat lub dostosuj czas poszczególnych faz. To techniki regulacji oddechu, a nie leczenie.
C02|Czy sesja będzie kontynuowana po zamknięciu karty?
C03|Nie ma takiej gwarancji. Przeglądarki mogą wstrzymywać karty w tle, a urządzenia przechodzić w tryb uśpienia. Pozostaw stronę otwartą i urządzenie aktywne, aby dokładniej mierzyć czas.
C04|Czy mogę wyłączyć dźwięk lub zakończyć wcześniej?
C05|Tak. Dźwięk jest opcjonalny i można go wyłączyć. Pauza lub Reset natychmiast przerywa odliczanie.`,
  sv: `A00|Andningsövning
A01|Andningsövning – Gratis online | UsefulVerse
A02|Gratis andningstimer: fyrkantsandning, 4-7-8 eller egen takt. Valfritt ljud, paus och återställning.
A03|Välj en behaglig andningstakt och följ den visuella guiden. Se till att övningen känns bekväm; avbryt när du vill.
A04|Hur använder jag den här andningsövningen?
A05|Välj ett förinställt alternativ eller ställ in varje fas, välj längd på passet och tryck på Start. Pausa eller återställ när som helst. Ljud är valfritt och startar först när du börjar.
A06|Laddas mitt andningspass upp?
A07|Nej. Tidtagningen sker direkt på sidan. Inget konto, ingen uppladdning, inget API och ingen lagring av passet används.
A08|Andningsmönster
A09|Egen inställning
A10|Lugn takt — inandning 4 / utandning 6
A11|Fyrkantsandning — 4 / 4 / 4 / 4
A12|4-7-8 — inandning 4 / håll andan 7 / utandning 8
A13|Inandning (sekunder)
A14|Håll andan efter inandning (sekunder)
A15|Utandning (sekunder)
A16|Håll andan efter utandning (sekunder)
A17|Passets längd (sekunder)
A18|Ljudsignaler
A19|Spela en mjuk ton vid fasbyte
A20|Guiden undviker kraftiga rörelser när läget för minskad rörelse är aktiverat.
A21|Detta är en timer för allmänt välbefinnande, inte medicinsk vård. Andas bekvämt och avbryt om du mår dåligt.
A22|Nuvarande fas
A23|Cykel
A24|Återstående tid
A25|Andas in
A26|Håll andan lätt
A27|Andas ut
A28|Klart
A29|Start
A30|Paus
A31|Fortsätt
A32|Återställ
B00|Andningspasset har startat. B01|Sessionen pausad. B02|Sessionen återupptagen. B03|Sessionen återställd. B04|Sessionen avslutad. Ta ett avslappnat andetag. B05|Ange hela sekunder inom de angivna gränserna. B06|Ljud är inte tillgängligt här; den visuella vägledningen fungerar fortfarande. B07|Andas in. B08|Håll andan lätt. B09|Andas ut.
C00|Kan jag använda fyrkantsandning eller 4-7-8-metoden?
C01|Ja. Välj ett förinställt alternativ eller justera fasernas längd. Detta är andningsövningar, inte medicinsk behandling.
C02|Fortsätter timern när jag stänger fliken?
C03|Det är inte garanterat. Webbläsare kan pausa bakgrundsflikar och enheter kan gå i viloläge. Håll sidan öppen och enheten aktiv för mer tillförlitlig tidtagning.
C04|Kan jag stänga av ljudet eller avsluta i förtid?
C05|Ja. Ljudet är valfritt och kan stängas av. Paus eller Återställ avslutar den aktiva tidtagningen direkt.`,
  th: `A00|แบบฝึกหัดการหายใจ
A01|แบบฝึกหัดการหายใจ — ออนไลน์ฟรี | UsefulVerse
A02|ตัวจับเวลาการหายใจฟรี: Box, 4-7-8 หรือกำหนดจังหวะเอง เลือกเปิดเสียง หยุดชั่วคราว หรือเริ่มใหม่ได้
A03|เลือกจังหวะการหายใจที่สบายและทำตามคำแนะนำบนหน้าจอ เน้นความรู้สึกผ่อนคลายและหยุดได้ทุกเมื่อที่ต้องการ
A04|จะใช้แบบฝึกหัดการหายใจนี้อย่างไร?
A05|เลือกรูปแบบที่มีให้หรือกำหนดแต่ละช่วงเอง เลือกความยาวเซสชันแล้วกดเริ่ม สามารถหยุดชั่วคราวหรือเริ่มใหม่ได้ตลอดเวลา เสียงเป็นตัวเลือกเสริมและเริ่มหลังจากกดเริ่มเท่านั้น
A06|เซสชันการหายใจของฉันถูกอัปโหลดหรือไม่?
A07|ไม่ ระบบจับเวลาทำงานอยู่บนหน้านี้เท่านั้น ไม่มีบัญชี การอัปโหลด API หรือการบันทึกข้อมูลเซสชัน
A08|รูปแบบการหายใจ
A09|กำหนดเอง
A10|จังหวะสบายๆ — หายใจเข้า 4 / หายใจออก 6
A11|Box breathing — 4 / 4 / 4 / 4
A12|4-7-8 — หายใจเข้า 4 / กลั้นหายใจ 7 / หายใจออก 8
A13|หายใจเข้า (วินาที)
A14|กลั้นหายใจหลังหายใจเข้า (วินาที)
A15|หายใจออก (วินาที)
A16|กลั้นหายใจหลังหายใจออก (วินาที)
A17|ความยาวเซสชัน (วินาที)
A18|สัญญาณเสียง
A19|เล่นเสียงเบาๆ เมื่อเปลี่ยนช่วง
A20|คำแนะนำจะหลีกเลี่ยงการเคลื่อนไหวฉับพลันเมื่อเปิดโหมดลดการเคลื่อนไหว
A21|นี่คือตัวจับเวลาเพื่อสุขภาวะทั่วไป ไม่ใช่การรักษาทางการแพทย์ หายใจอย่างสบายและหยุดหากรู้สึกไม่สบาย
A22|ช่วงปัจจุบัน
A23|รอบ
A24|เวลาที่เหลือ
A25|หายใจเข้า
A26|กลั้นหายใจเบาๆ
A27|หายใจออก
A28|เสร็จสิ้น
A29|เริ่ม
A30|หยุดชั่วคราว
A31|ทำต่อ
A32|เริ่มใหม่
B00|เริ่มเซสชันการหายใจแล้ว B01|หยุดเซสชันชั่วคราว B02|กลับมาทำเซสชันต่อ B03|รีเซ็ตเซสชัน B04|จบเซสชันแล้ว หายใจตามสบาย B05|ระบุจำนวนวินาทีเต็มภายในขอบเขตที่กำหนด B06|ไม่มีเสียงในส่วนนี้ แต่ระบบนำทางด้วยภาพยังคงทำงาน B07|หายใจเข้า B08|กลั้นหายใจเบาๆ B09|หายใจออก
C00|ใช้เทคนิค Box Breathing หรือ 4-7-8 ได้ไหม?
C01|ได้ เลือกรูปแบบที่ตั้งค่าไว้หรือปรับเวลาแต่ละช่วงได้ รูปแบบเหล่านี้เป็นแนวทางกำหนดจังหวะการหายใจ ไม่ใช่การรักษาทางการแพทย์
C02|ตัวจับเวลาจะยังทำงานเมื่อปิดแท็บหรือไม่?
C03|ไม่รับประกัน เบราว์เซอร์อาจหยุดแท็บที่ไม่ได้เปิดใช้งานและอุปกรณ์อาจเข้าสู่โหมดพัก ควรเปิดหน้านี้ไว้และให้อุปกรณ์ทำงานเพื่อให้จับเวลาได้แม่นยำขึ้น
C04|ปิดเสียงหรือหยุดก่อนกำหนดได้ไหม?
C05|ได้ เสียงเป็นตัวเลือกและปิดได้ กดหยุดชั่วคราวหรือเริ่มใหม่เพื่อหยุดการจับเวลาทันที.`,
  id: `A00|Latihan Pernapasan
A01|Latihan Pernapasan — Gratis & Online | UsefulVerse
A02|Timer napas gratis: ritme box, 4-7-8, atau khusus. Suara opsional, jeda, dan atur ulang.
A03|Pilih ritme pernapasan yang nyaman dan ikuti panduan visualnya. Pastikan sesi terasa nyaman; Anda bisa berhenti kapan saja.
A04|Bagaimana cara menggunakan latihan pernapasan ini?
A05|Pilih pengaturan awal atau atur setiap tahap, tentukan durasi sesi, lalu tekan Mulai. Anda bisa menjeda atau mengatur ulang kapan saja. Suara bersifat opsional dan baru berbunyi setelah Anda memulai.
A06|Apakah sesi pernapasan saya diunggah?
A07|Tidak. Penghitungan waktu berjalan di halaman ini saja. Tidak ada penggunaan akun, unggahan data, API, ataupun penyimpanan sesi.
A08|Pola pernapasan
A09|Khusus
A10|Ritme santai — tarik napas 4 / buang napas 6
A11|Pernapasan box — 4 / 4 / 4 / 4
A12|4-7-8 — tarik napas 4 / tahan 7 / buang napas 8
A13|Tarik napas (detik)
A14|Tahan setelah menarik napas (detik)
A15|Buang napas (detik)
A16|Tahan setelah membuang napas (detik)
A17|Durasi sesi (detik)
A18|Panduan suara
A19|Bunyikan nada lembut saat pergantian tahap
A20|Panduan menghindari gerakan paksa jika mode gerakan terbatas diaktifkan.
A21|Ini adalah pengatur waktu untuk kesehatan umum, bukan layanan medis. Bernapaslah dengan nyaman dan berhenti jika Anda merasa tidak enak badan.
A22|Tahap saat ini
A23|Siklus
A24|Sisa waktu
A25|Tarik napas
A26|Tahan perlahan
A27|Buang napas
A28|Selesai
A29|Mulai
A30|Jeda
A31|Lanjutkan
A32|Atur ulang
B00|Sesi pernapasan dimulai. B01|Sesi dijeda. B02|Sesi dilanjutkan. B03|Sesi diatur ulang. B04|Sesi selesai. Bernapaslah dengan nyaman. B05|Masukkan jumlah detik utuh sesuai batas yang ditampilkan. B06|Suara tidak tersedia di sini; panduan visual tetap berfungsi. B07|Tarik napas. B08|Tahan perlahan. B09|Buang napas.
C00|Bisakah saya menggunakan teknik box breathing atau 4-7-8?
C01|Bisa. Pilih pengaturan awal atau sesuaikan durasi setiap tahap. Ini adalah pola pengaturan ritme, bukan perawatan medis.
C02|Apakah timer tetap berjalan saat saya menutup tab?
C03|Tidak ada jaminan. Peramban dapat menjeda tab di latar belakang dan perangkat bisa masuk ke mode tidur. Biarkan halaman ini terbuka dan perangkat tetap aktif agar penghitungan waktu lebih akurat.
C04|Bisakah saya mematikan suara atau berhenti lebih awal?
C05|Bisa. Suara bersifat opsional dan dapat dimatikan. Tekan Jeda atau Atur ulang untuk segera menghentikan timer.`,
  hi: `A00|सांस लेने की कसरत
A01|सांस लेने की कसरत — मुफ़्त ऑनलाइन | UsefulVerse
A02|बॉक्स, 4-7-8 या अपनी गति वाला मुफ़्त ब्रीदिंग टाइमर। वैकल्पिक आवाज़, पॉज़ और रीसेट।
A03|सांस लेने की एक आरामदायक गति चुनें और विज़ुअल गाइड को फ़ॉलो करें। सेशन को आरामदायक रखें; जब चाहें रोक दें।
A04|मैं इस ब्रीदिंग एक्सरसाइज़ का इस्तेमाल कैसे करूँ?
A05|पहले से तय सेटिंग चुनें या हर चरण सेट करें, सेशन की अवधि चुनें और 'शुरू करें' दबाएँ। किसी भी समय पॉज़ या रीसेट करें। ऑडियो वैकल्पिक है और शुरू करने के बाद ही बजता है।
A06|क्या मेरा ब्रीदिंग सेशन अपलोड होता है?
A07|नहीं। टाइमिंग इसी पेज पर चलती है। किसी अकाउंट, अपलोड, API या सेव किए गए सेशन का इस्तेमाल नहीं होता है।
A08|सांस लेने का तरीका
A09|कस्टम
A10|आसान गति — सांस अंदर लें 4 / बाहर छोड़ें 6
A11|बॉक्स ब्रीदिंग — 4 / 4 / 4 / 4
A12|4-7-8 — सांस अंदर लें 4 / रोकें 7 / बाहर छोड़ें 8
A13|सांस अंदर लेना (सेकंड)
A14|सांस अंदर लेने के बाद रोकना (सेकंड)
A15|सांस बाहर छोड़ना (सेकंड)
A16|सांस बाहर छोड़ने के बाद रोकना (सेकंड)
A17|सेशन की अवधि (सेकंड)
A18|आवाज़ संकेत
A19|चरण बदलने पर हल्की आवाज़ बजाएँ
A20|कम गति चालू होने पर गाइड अचानक हलचल से बचती है।
A21|यह सामान्य वेलनेस टाइमर है, मेडिकल देखभाल नहीं। आराम से सांस लें और अगर ठीक न लगे तो रुक जाएँ।
A22|मौजूदा चरण
A23|साइकिल
A24|बचा हुआ समय
A25|सांस अंदर लें
A26|आराम से रोकें
A27|सांस बाहर छोड़ें
A28|पूरा हुआ
A29|शुरू करें
A30|रोकें
A31|फिर शुरू करें
A32|रीसेट करें
B00|ब्रीदिंग सेशन शुरू हो गया। B01|सेशन रोक दिया गया है। B02|सेशन फिर से शुरू हो गया है। B03|सेशन रीसेट हो गया है। B04|सेशन पूरा हो गया है। आराम से सांस लें। B05|दिखाई गई सीमा के अंदर पूरे सेकंड डालें। B06|यहां आवाज़ उपलब्ध नहीं है; विज़ुअल गाइड फिर भी काम करता है। B07|सांस अंदर लें। B08|धीरे से रोकें। B09|सांस बाहर छोड़ें।
C00|क्या मैं बॉक्स ब्रीदिंग या 4-7-8 का इस्तेमाल कर सकता हूँ?
C01|हाँ। प्रीसेट चुनें या चरणों की अवधि बदलें। ये सांस की गति के तरीके हैं, मेडिकल इलाज नहीं।
C02|क्या टैब बंद करने पर टाइमर चलता रहेगा?
C03|इसकी कोई गारंटी नहीं है। ब्राउज़र बैकग्राउंड टैब रोक सकते हैं और डिवाइस स्लीप मोड में जा सकता है। सही टाइमिंग के लिए पेज खुला रखें और डिवाइस चालू रखें।
C04|क्या मैं आवाज़ बंद कर सकता हूँ या जल्दी रोक सकता हूँ?
C05|हाँ। आवाज़ वैकल्पिक है और इसे बंद किया जा सकता है। पॉज़ या रीसेट दबाने पर टाइमर तुरंत रुक जाता है।`,
  tr: `A00|Nefes Egzersizi
A01|Nefes Egzersizi — Ücretsiz ve Çevrimiçi | UsefulVerse
A02|Ücretsiz nefes zamanlayıcısı: kutu nefesi, 4-7-8 veya özel tempo. İsteğe bağlı ses, duraklatma ve sıfırlama.
A03|Rahat bir nefes temposu seçin ve görsel rehberi takip edin. Seansı rahat tutun; dilediğiniz zaman durdurun.
A04|Bu nefes egzersizini nasıl kullanırım?
A05|Hazır bir ayar seçin veya her aşamayı belirleyin, seans süresini seçip Başlat'a basın. İstediğiniz zaman duraklatabilir veya sıfırlayabilirsiniz. Ses isteğe bağlıdır ve yalnızca başladıktan sonra çalar.
A06|Nefes seansım yükleniyor mu?
A07|Hayır. Zamanlama bu sayfada çalışır. Hesap, veri yükleme, API veya kayıtlı seans kullanılmaz.
A08|Nefes düzeni
A09|Özel
A10|Kolay tempo — nefes al 4 / nefes ver 6
A11|Kutu nefesi — 4 / 4 / 4 / 4
A12|4-7-8 — nefes al 4 / tut 7 / nefes ver 8
A13|Nefes alma (saniye)
A14|Nefes aldıktan sonra tutma (saniye)
A15|Nefes verme (saniye)
A16|Nefes verdikten sonra tutma (saniye)
A17|Seans süresi (saniye)
A18|Sesli uyarılar
A19|Aşama değişince yumuşak bir ses çal
A20|Azaltılmış hareket etkin olduğunda rehber ani hareketlerden kaçınır.
A21|Bu, genel sağlık için bir zamanlayıcıdır, tıbbi bakım değildir. Rahat nefes alın ve kendinizi kötü hissederseniz durun.
A22|Geçerli aşama
A23|Döngü
A24|Kalan süre
A25|Nefes al
A26|Nazikçe tut
A27|Nefes ver
A28|Tamamlandı
A29|Başlat
A30|Duraklat
A31|Sürdür
A32|Sıfırla
B00|Nefes seansı başladı. B01|Oturum duraklatıldı. B02|Oturum sürdürüldü. B03|Oturum sıfırlandı. B04|Oturum tamamlandı. Rahat bir nefes alın. B05|Belirtilen sınırlar içinde tam saniye değerleri girin. B06|Burada ses kullanılamıyor; görsel yönlendirme çalışmaya devam eder. B07|Nefes alın. B08|Nazikçe tutun. B09|Nefes verin.
C00|Kutu nefesi veya 4-7-8 tekniğini kullanabilir miyim?
C01|Evet. Hazır ayarlardan birini seçin veya aşama sürelerini düzenleyin. Bunlar nefes ritmi yöntemleridir, tıbbi tedavi değildir.
C02|Sekmeyi kapattığımda zamanlayıcı çalışmaya devam eder mi?
C03|Garanti yoktur. Tarayıcılar arka plan sekmelerini duraklatabilir, cihazlar uyku moduna geçebilir. Daha doğru zamanlama için sayfayı açık ve cihazı etkin tutun.
C04|Sesi kapatabilir veya erken durdurabilir miyim?
C05|Evet. Ses isteğe bağlıdır ve kapatılabilir. Duraklat veya Sıfırla, etkin zamanlamayı hemen durdurur.`,
  nl: `A00|Ademhalingsoefening
A01|Ademhalingsoefening — Gratis online | UsefulVerse
A02|Gratis ademhalingstimer: box breathing, 4-7-8 of een eigen ritme. Optioneel geluid, pauze en reset.
A03|Kies een rustig ademhalingstempo en volg de visuele aanwijzingen. Houd de sessie comfortabel; stop wanneer je maar wilt.
A04|Hoe gebruik ik deze ademhalingsoefening?
A05|Kies een vooraf ingesteld patroon of stel elke fase zelf in, kies de duur van de sessie en druk op Start. Pauzeer of reset op elk moment. Geluid is optioneel en start pas nadat je begint.
A06|Wordt mijn ademhalingssessie geüpload?
A07|Nee. De timing verloopt op deze pagina. Er worden geen accounts, uploads, API's of opgeslagen sessies gebruikt.
A08|Ademhalingspatroon
A09|Aangepast
A10|Rustig tempo — inademen 4 / uitademen 6
A11|Box breathing — 4 / 4 / 4 / 4
A12|4-7-8 — inademen 4 / vasthouden 7 / uitademen 8
A13|Inademen (seconden)
A14|Vasthouden na inademing (seconden)
A15|Uitademen (seconden)
A16|Vasthouden na uitademing (seconden)
A17|Duur van de sessie (seconden)
A18|Geluidssignalen
A19|Speel een zachte toon af bij elke faseovergang
A20|De visuele gids vermijdt plotselinge bewegingen wanneer minder beweging is ingeschakeld.
A21|Dit is een algemene welzijnstimer, geen medische behandeling. Adem comfortabel en stop als je je niet goed voelt.
A22|Huidige fase
A23|Cyclus
A24|Resterende tijd
A25|Inademen
A26|Rustig vasthouden
A27|Uitademen
A28|Voltooid
A29|Start
A30|Pauze
A31|Hervatten
A32|Reset
B00|Ademhalingssessie gestart. B01|Sessie gepauzeerd. B02|Sessie hervat. B03|Sessie gereset. B04|Sessie voltooid. Adem rustig. B05|Voer hele seconden in binnen de aangegeven grenzen. B06|Geluid is hier niet beschikbaar; de visuele begeleiding werkt wel. B07|Adem in. B08|Houd rustig vast. B09|Adem uit.
C00|Kan ik box breathing of de 4-7-8-methode gebruiken?
C01|Ja. Kies een vooraf ingesteld patroon of pas de duur van de fasen aan. Dit zijn ademritmes, geen medische behandeling.
C02|Blijft de timer lopen als ik het tabblad sluit?
C03|Dat is niet gegarandeerd. Browsers kunnen achtergrondtabbladen pauzeren en apparaten kunnen in slaapstand gaan. Houd de pagina open en het apparaat actief voor betrouwbare timing.
C04|Kan ik het geluid uitschakelen of eerder stoppen?
C05|Ja. Geluid is optioneel en kan uit. Pauzeren of resetten stopt de actieve timing meteen.`,
};

const taggedKeys = {
  A: ['name', 'title', 'description', 'intro', 'howQuestion', 'howAnswer', 'privacyQuestion', 'privacyAnswer'],
  field: ['pattern', 'custom', 'balanced', 'box', 'fourSevenEight', 'inhale', 'holdIn', 'exhale', 'holdOut', 'duration', 'sound', 'soundHint', 'motionNote', 'safetyNote', 'phase', 'cycle', 'remaining', 'inhaleCue', 'holdCue', 'exhaleCue', 'complete'],
  action: ['start', 'pause', 'resume', 'reset'],
  message: ['started', 'paused', 'resumed', 'reset', 'finished', 'checkInputs', 'soundUnavailable', 'inhaleCue', 'holdCue', 'exhaleCue'],
};
const localeExample = { pattern: 'box', inhaleSeconds: 4, holdAfterInhaleSeconds: 4, exhaleSeconds: 4, holdAfterExhaleSeconds: 4, durationSeconds: 60 };
const compactDescriptions = {
  am: 'ነፃ የአተነፋፈስ ጊዜ መቆጣጠሪያ፦ Box፣ 4-7-8 ወይም የራስዎ ፍጥነት። ድምፅ፣ ማቆምና ዳግም ማስጀመር።',
  bn: 'বক্স, ৪-৭-৮ বা কাস্টম শ্বাসের ফ্রি টাইমার। শব্দ, বিরতি, রিসেট; অ্যাকাউন্ট বা আপলোড লাগে না।',
  ru: 'Бесплатный таймер дыхания: квадратный ритм, 4-7-8 или свой темп. Звук, пауза и сброс.',
  ur: 'باکس، 4-7-8 یا حسبِ ضرورت سانس کے لیے مفت ٹائمر۔ آواز، وقفہ اور ری سیٹ؛ اکاؤنٹ یا اپ لوڈ نہیں۔',
  zh: '免费呼吸计时器，支持方框呼吸、4-7-8和自定义节奏。可选声音、暂停和重置。',
  vi: 'Bộ đếm thở miễn phí với nhịp Box, 4-7-8 hoặc tùy chỉnh. Có âm thanh, tạm dừng và đặt lại.',
  it: 'Timer gratuito per la respirazione: ritmo quadrato, 4-7-8 o personalizzato. Audio facoltativo, pausa e ripristino.',
  zh_tw: '免費呼吸計時器，支援方框呼吸、4-7-8 或自訂節奏。可選聲音、暫停和重設。',
  bg: 'Безплатен таймер за дишане: квадратно дишане, 4-7-8 или собствен ритъм. Звук, пауза и нулиране.',
  ca: 'Temporitzador gratuït de respiració: ritme quadrat, 4-7-8 o personalitzat. So opcional, pausa i reinici.',
  id: 'Timer napas gratis: ritme box, 4-7-8, atau khusus. Suara opsional, jeda, dan atur ulang.',
  hi: 'बॉक्स, 4-7-8 या अपनी गति वाला मुफ़्त ब्रीदिंग टाइमर। वैकल्पिक आवाज़, पॉज़ और रीसेट।',
  tr: 'Ücretsiz nefes zamanlayıcısı: kutu nefesi, 4-7-8 veya özel tempo. İsteğe bağlı ses, duraklatma ve sıfırlama.',
  nl: 'Gratis ademhalingstimer: box breathing, 4-7-8 of een eigen ritme. Optioneel geluid, pauze en reset.',
  ms: 'Pemasa pernafasan percuma: rentak box, 4-7-8 atau tersuai. Bunyi pilihan, jeda dan tetapan semula.',
  pl: 'Darmowy minutnik oddechowy: oddech kwadratowy, 4-7-8 lub własne tempo. Opcjonalny dźwięk, pauza i reset.',
  sv: 'Gratis andningstimer: fyrkantsandning, 4-7-8 eller egen takt. Valfritt ljud, paus och återställning.',
  th: 'ตัวจับเวลาการหายใจฟรี: Box, 4-7-8 หรือกำหนดจังหวะเอง เลือกเปิดเสียง หยุดชั่วคราว หรือเริ่มใหม่ได้',
  el: 'Δωρεάν χρονόμετρο αναπνοής: τεχνική κουτιού, 4-7-8 ή προσαρμοσμένος ρυθμός. Προαιρετικός ήχος και παύση.',
  uk: 'Безкоштовний таймер дихання: квадратне дихання, 4-7-8 або власний темп. Опційний звук, пауза та скидання.',
  sw: 'Kipima muda cha kupumua cha bure: mbinu ya box, 4-7-8 au kasi yako. Sauti ya hiari, kusitisha na kuanza upya.',
  mr: 'मोफत श्वसन टाइमर: बॉक्स, 4-7-8 किंवा स्वतःचा वेग. ऐच्छिक आवाज, थांबवणे आणि रीसेट.',
  te: 'ఉచిత శ్వాస టైమర్: బాక్స్, 4-7-8 లేదా మీకు నచ్చిన వేగం. ఐచ్ఛిక సౌండ్, పాజ్ మరియు రీసెట్.',
  tl: 'Libreng breathing timer: box, 4-7-8 o sarili mong pacing. Opsyonal na tunog, pause at reset.',
  ta: 'இலவச சுவாச டைமர்: Box, 4-7-8 அல்லது தனிப்பயன் வேகம். விருப்ப ஒலி, இடைநிறுத்தம் மற்றும் மீட்டமைப்பு.',
  ha: 'Agogon numfashi na kyauta: tsarin box, 4-7-8 ko naka. Sauti, dakatarwa da sake farawa zaɓi ne.',
  fa: 'تایمر رایگان تنفس: الگوی جعبه‌ای، ۴-۷-۸ یا سرعت دلخواه. صدای اختیاری، توقف و بازنشانی.',
  gu: 'મફત શ્વાસ ટાઈમર: બોક્સ, 4-7-8 અથવા તમારી ગતિ. વૈકલ્પિક અવાજ, થોભાવો અને રીસેટ.',
};
function parseCompactDraft(locale, source) {
  const rows = Object.fromEntries([...source.matchAll(/(?:^|\s)([ABC]\d{2})\|([\s\S]*?)(?=\s+[ABC]\d{2}\||$)/g)].map(([, id, text]) => [id, text.trim()]));
  const get = (id) => {
    if (!rows[id]) throw new Error(`Missing ${id} translation for ${locale}`);
    return rows[id];
  };
  const fields = Object.fromEntries(taggedKeys.field.map((key, index) => [key, get(`A${String(index + 8).padStart(2, '0')}`)]));
  const actions = Object.fromEntries(taggedKeys.action.map((key, index) => [key, get(`A${String(index + 29).padStart(2, '0')}`)]));
  const messages = Object.fromEntries(taggedKeys.message.map((key, index) => [key, get(`B${String(index).padStart(2, '0')}`)]));
  const faqs = Array.from({ length: 3 }, (_, index) => ({ question: get(`C${String(index * 2).padStart(2, '0')}`), answer: get(`C${String(index * 2 + 1).padStart(2, '0')}`) }));
  return makeCopy({ copyLanguage: locale, localizationStatus: 'machine-accepted', name: get('A00'), title: get('A01'), description: compactDescriptions[locale] ?? get('A02'), intro: get('A03'), howQuestion: get('A04'), howAnswer: get('A05'), privacyQuestion: get('A06'), privacyAnswer: get('A07'), fields, actions, messages, example: localeExample, additionalFaqs: faqs });
}

const completeTranslations = { ...translations, ...Object.fromEntries(Object.entries(compactLocaleDrafts).map(([locale, source]) => [locale, parseCompactDraft(locale, source)])) };
export default Object.freeze(Object.fromEntries(Object.entries(completeTranslations).map(([locale, copy]) => [locale, makeCopy(copy)])));
