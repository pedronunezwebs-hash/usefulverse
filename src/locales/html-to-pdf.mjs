const uiKeys = [
  'Document title',
  'HTML content',
  'Type or paste HTML here…',
  'Preview document',
  'Print / Save as PDF',
  'HTML preview',
  'Enter content, then preview it or open your browser’s print dialog.',
  'Preview ready. Check the page before printing.',
  'Print dialog opened. Choose Save as PDF to create the file.',
  'The browser creates the PDF. Paper size, margins and headers are set in the print dialog.',
  'For safety, scripts, styles, images, links, forms and external content are removed. This tool prints simple text and tables; it does not convert a website URL.',
];

const rows = {
  en: [
    'HTML to PDF Converter', 'HTML to PDF',
    'Turn simple HTML text and tables into a PDF using your browser’s print dialog. No upload or server conversion.',
    'HTML to PDF, convert HTML to PDF, print HTML to PDF, HTML document to PDF, save HTML as PDF',
    'Paste a simple HTML document, preview the cleaned result and choose Save as PDF in your browser’s print dialog.',
    'This tool accepts HTML you provide; it does not fetch or convert website URLs. Processing stays in your browser. To prevent scripts and remote content from running, it removes scripts, styles, images, links, forms and embedded content. The browser’s print dialog creates the PDF, so page size, margins, headers and final output depend on your browser settings. Complex layouts may change. Keep a copy of your source.',
  ],
  es: [
    'Convertidor de HTML a PDF', 'HTML a PDF',
    'Convierte texto y tablas HTML sencillas a PDF con el diálogo de impresión del navegador. Sin subidas ni conversión en servidor.',
    'HTML a PDF, convertir HTML a PDF, imprimir HTML como PDF, guardar HTML en PDF',
    'Pega un documento HTML sencillo, revisa la versión depurada y elige Guardar como PDF en el diálogo de impresión.',
    'Acepta el HTML que proporciones; no abre ni convierte direcciones web. El contenido se procesa en tu navegador. Para impedir la ejecución de scripts y contenido remoto, elimina scripts, estilos, imágenes, enlaces, formularios y contenido incrustado. El diálogo de impresión del navegador crea el PDF; el tamaño de página, los márgenes, los encabezados y el resultado dependen de sus ajustes. Los diseños complejos pueden cambiar. Guarda una copia del código original.',
  ],
  fr: [
    'Convertisseur HTML en PDF', 'HTML en PDF',
    'Transformez du texte et des tableaux HTML simples en PDF avec la boîte d’impression du navigateur. Sans envoi ni conversion serveur.',
    'HTML en PDF, convertir HTML en PDF, imprimer HTML en PDF, enregistrer HTML en PDF',
    'Collez un document HTML simple, vérifiez son aperçu nettoyé et choisissez Enregistrer au format PDF dans la boîte d’impression.',
    'L’outil accepte le HTML fourni ; il ne récupère ni ne convertit les URL de sites web. Le traitement reste dans le navigateur. Pour empêcher l’exécution de scripts et de contenu distant, il supprime scripts, styles, images, liens, formulaires et contenus intégrés. Le navigateur crée le PDF via sa boîte d’impression ; format de page, marges, en-têtes et résultat dépendent de ses réglages. Les mises en page complexes peuvent changer. Conservez une copie du code source.',
  ],
  pt: [
    'Conversor de HTML para PDF', 'HTML para PDF',
    'Transforme textos e tabelas HTML simples em PDF usando a janela de impressão do navegador. Sem envio ou conversão no servidor.',
    'HTML para PDF, converter HTML para PDF, imprimir HTML em PDF, salvar HTML como PDF',
    'Cole um documento HTML simples, confira a prévia limpa e escolha Salvar como PDF na janela de impressão do navegador.',
    'A ferramenta aceita o HTML que você fornecer; não busca nem converte URLs de sites. O processamento fica no navegador. Para impedir scripts e conteúdo remoto, remove scripts, estilos, imagens, links, formulários e conteúdo incorporado. O navegador cria o PDF pela janela de impressão; tamanho, margens, cabeçalhos e resultado dependem das configurações do navegador. Layouts complexos podem mudar. Guarde uma cópia do código original.',
  ],
  de: [
    'HTML-zu-PDF-Konverter', 'HTML zu PDF',
    'Wandle einfachen HTML-Text und Tabellen über den Druckdialog deines Browsers in PDF um. Kein Upload und keine Serverkonvertierung.',
    'HTML zu PDF, HTML in PDF umwandeln, HTML als PDF drucken, HTML als PDF speichern',
    'Füge ein einfaches HTML-Dokument ein, prüfe die bereinigte Vorschau und wähle im Druckdialog deines Browsers „Als PDF speichern“.',
    'Dieses Tool verarbeitet bereitgestellten HTML-Code; es ruft keine Website-URLs ab. Die Verarbeitung bleibt im Browser. Um Skripte und externe Inhalte zu blockieren, werden Skripte, Styles, Bilder, Links, Formulare und eingebettete Inhalte entfernt. Der Browser erstellt die PDF-Datei über seinen Druckdialog; Seitengröße, Ränder, Kopfzeilen und Ergebnis hängen von den Druckeinstellungen ab. Komplexe Layouts können sich ändern. Bewahre eine Kopie des Quelltexts auf.',
  ],
  ja: [
    'HTMLからPDFへの変換', 'HTMLからPDF',
    '簡単なHTMLのテキストや表を、ブラウザーの印刷画面からPDFにします。アップロードやサーバー変換は不要です。',
    'HTML PDF変換, HTMLをPDFに変換, HTMLをPDFで印刷, HTMLをPDFで保存',
    'シンプルなHTML文書を貼り付け、整理後のプレビューを確認して、印刷画面でPDFとして保存を選びます。',
    '入力されたHTMLのみを処理し、WebサイトのURLは取得・変換しません。処理はブラウザー内で行います。スクリプトや外部コンテンツを実行しないよう、スクリプト、スタイル、画像、リンク、フォーム、埋め込み要素を削除します。PDFはブラウザーの印刷画面で作成されるため、用紙サイズ、余白、ヘッダー、出力結果は設定に依存します。複雑なレイアウトは変わることがあります。元のコードも保存してください。',
  ],
  ko: [
    'HTML을 PDF로 변환', 'HTML → PDF',
    '간단한 HTML 텍스트와 표를 브라우저 인쇄 창으로 PDF로 저장합니다. 업로드나 서버 변환이 없습니다.',
    'HTML PDF 변환, HTML을 PDF로 변환, HTML PDF로 인쇄, HTML PDF 저장',
    '간단한 HTML 문서를 붙여 넣고 정리된 미리보기를 확인한 다음 브라우저 인쇄 창에서 PDF로 저장을 선택하세요.',
    '입력한 HTML만 처리하며 웹사이트 URL을 가져오거나 변환하지 않습니다. 처리는 브라우저에서 이루어집니다. 스크립트와 외부 콘텐츠 실행을 막기 위해 스크립트, 스타일, 이미지, 링크, 양식 및 삽입 콘텐츠를 제거합니다. PDF는 브라우저 인쇄 창에서 만들어지므로 용지 크기, 여백, 머리글 및 결과는 브라우저 설정에 따라 달라집니다. 복잡한 레이아웃은 달라질 수 있습니다. 원본 코드도 보관하세요.',
  ],
  id: [
    'Konverter HTML ke PDF', 'HTML ke PDF',
    'Ubah teks dan tabel HTML sederhana menjadi PDF melalui dialog cetak browser. Tanpa unggah atau konversi server.',
    'HTML ke PDF, konversi HTML ke PDF, cetak HTML ke PDF, simpan HTML sebagai PDF',
    'Tempel dokumen HTML sederhana, periksa pratinjau yang sudah dibersihkan, lalu pilih Simpan sebagai PDF di dialog cetak browser.',
    'Alat ini menerima HTML yang Anda berikan; alat ini tidak mengambil atau mengonversi URL situs web. Pemrosesan berlangsung di browser. Untuk mencegah skrip dan konten jarak jauh berjalan, skrip, gaya, gambar, tautan, formulir, dan konten tersemat dihapus. Browser membuat PDF melalui dialog cetak; ukuran kertas, margin, header, dan hasil bergantung pada pengaturan browser. Tata letak rumit dapat berubah. Simpan salinan kode sumber.',
  ],
  hi: [
    'HTML से PDF कन्वर्टर', 'HTML से PDF',
    'ब्राउज़र के प्रिंट डायलॉग से साधारण HTML टेक्स्ट और टेबल को PDF में बदलें। न अपलोड, न सर्वर कन्वर्ज़न।',
    'HTML से PDF, HTML को PDF में बदलें, HTML को PDF प्रिंट करें, HTML को PDF के रूप में सेव करें',
    'सरल HTML दस्तावेज़ पेस्ट करें, साफ़ किए गए पूर्वावलोकन को जाँचें और ब्राउज़र के प्रिंट डायलॉग में PDF के रूप में सेव करें चुनें।',
    'यह टूल आपके दिए HTML को स्वीकार करता है; यह वेबसाइट URL नहीं खोलता या बदलता। प्रोसेसिंग ब्राउज़र में होती है। स्क्रिप्ट और दूरस्थ सामग्री को चलने से रोकने के लिए स्क्रिप्ट, स्टाइल, चित्र, लिंक, फ़ॉर्म और एम्बेडेड सामग्री हटा दी जाती है। PDF ब्राउज़र के प्रिंट डायलॉग से बनती है, इसलिए पेज आकार, मार्जिन, हेडर और नतीजा ब्राउज़र सेटिंग पर निर्भर हैं। जटिल लेआउट बदल सकते हैं। मूल कोड की कॉपी रखें।',
  ],
  ar: [
    'تحويل HTML إلى PDF', 'HTML إلى PDF',
    'حوّل نصوص وجداول HTML البسيطة إلى PDF عبر نافذة الطباعة في المتصفح. دون رفع أو تحويل على الخادم.',
    'تحويل HTML إلى PDF، تحويل ملف HTML إلى PDF، طباعة HTML إلى PDF، حفظ HTML كملف PDF',
    'الصق مستند HTML بسيطًا، وراجع المعاينة المنقحة، ثم اختر الحفظ كملف PDF من نافذة الطباعة في المتصفح.',
    'تعالج الأداة HTML الذي تقدمه فقط؛ ولا تجلب عناوين مواقع الويب أو تحولها. تتم المعالجة في المتصفح. لمنع تشغيل البرامج النصية والمحتوى البعيد، تُحذف البرامج النصية والأنماط والصور والروابط والنماذج والمحتويات المضمنة. ينشئ المتصفح ملف PDF عبر نافذة الطباعة؛ لذلك يعتمد حجم الصفحة والهوامش والرؤوس والنتيجة على إعداداته. قد يتغير التنسيق المعقد. احتفظ بنسخة من المصدر.',
  ],
  zh: [
    'HTML 转 PDF 转换器', 'HTML 转 PDF',
    '通过浏览器打印对话框将简单 HTML 文本和表格保存为 PDF。无需上传或服务器转换。',
    'HTML 转 PDF, HTML 转换为 PDF, 打印 HTML 为 PDF, 保存 HTML 为 PDF',
    '粘贴简单的 HTML 文档，检查清理后的预览，然后在浏览器打印对话框中选择“另存为 PDF”。',
    '本工具只处理你提供的 HTML，不会抓取或转换网站 URL。内容在浏览器中处理。为阻止脚本和远程内容运行，会移除脚本、样式、图片、链接、表单和嵌入内容。PDF 由浏览器打印对话框生成，因此纸张大小、页边距、页眉和输出取决于浏览器设置。复杂布局可能会变化。请保留源代码副本。',
  ],
  bn: [
    'HTML থেকে PDF কনভার্টার', 'HTML থেকে PDF',
    'ব্রাউজারের প্রিন্ট ডায়ালগ ব্যবহার করে সাধারণ HTML লেখা ও টেবিল PDF করুন। আপলোড বা সার্ভার কনভার্সন নেই।',
    'HTML থেকে PDF, HTML PDF-এ রূপান্তর, HTML PDF হিসেবে প্রিন্ট, HTML PDF হিসেবে সংরক্ষণ',
    'সাধারণ HTML নথি পেস্ট করুন, পরিষ্কার প্রিভিউ দেখুন, তারপর ব্রাউজারের প্রিন্ট ডায়ালগে PDF হিসেবে সংরক্ষণ বেছে নিন।',
    'এই টুল আপনার দেওয়া HTML নেয়; ওয়েবসাইটের URL আনে বা রূপান্তর করে না। প্রক্রিয়াকরণ ব্রাউজারেই হয়। স্ক্রিপ্ট ও দূরবর্তী কনটেন্ট চালু হওয়া ঠেকাতে স্ক্রিপ্ট, স্টাইল, ছবি, লিংক, ফর্ম ও এমবেড করা কনটেন্ট সরানো হয়। ব্রাউজারের প্রিন্ট ডায়ালগ PDF তৈরি করে; তাই পৃষ্ঠার মাপ, মার্জিন, হেডার ও ফলাফল ব্রাউজার সেটিংসের ওপর নির্ভর করে। জটিল লেআউট বদলে যেতে পারে। মূল কোডের কপি রাখুন।',
  ],
  ru: [
    'Конвертер HTML в PDF', 'HTML в PDF',
    'Преобразуйте простой HTML-текст и таблицы в PDF через окно печати браузера. Без загрузки на сервер и серверной конвертации.',
    'HTML в PDF, конвертировать HTML в PDF, печать HTML в PDF, сохранить HTML как PDF',
    'Вставьте простой HTML-документ, проверьте очищенный предварительный просмотр и выберите «Сохранить как PDF» в окне печати браузера.',
    'Инструмент обрабатывает предоставленный HTML; он не загружает и не преобразует URL веб-сайтов. Обработка выполняется в браузере. Чтобы не запускать скрипты и внешний контент, удаляются скрипты, стили, изображения, ссылки, формы и встроенные элементы. PDF создаёт окно печати браузера, поэтому размер страницы, поля, колонтитулы и результат зависят от его настроек. Сложная вёрстка может измениться. Сохраните копию исходного кода.',
  ],
  ur: [
    'HTML سے PDF کنورٹر', 'HTML سے PDF',
    'براؤزر کے پرنٹ ڈائیلاگ سے سادہ HTML متن اور جدول کو PDF میں بنائیں۔ اپ لوڈ یا سرور پر تبدیلی نہیں۔',
    'HTML سے PDF، HTML کو PDF میں تبدیل کریں، HTML کو PDF پرنٹ کریں، HTML کو PDF کے طور پر محفوظ کریں',
    'سادہ HTML دستاویز چسپاں کریں، صاف پیش منظر دیکھیں، پھر براؤزر کے پرنٹ ڈائیلاگ میں PDF کے طور پر محفوظ کریں منتخب کریں۔',
    'یہ ٹول آپ کا دیا ہوا HTML لیتا ہے؛ ویب سائٹ کے URL کو حاصل یا تبدیل نہیں کرتا۔ کارروائی براؤزر میں ہوتی ہے۔ اسکرپٹس اور دور کے مواد کو چلنے سے روکنے کے لیے اسکرپٹس، اسٹائل، تصاویر، لنکس، فارم اور شامل مواد ہٹا دیا جاتا ہے۔ PDF براؤزر کا پرنٹ ڈائیلاگ بناتا ہے، اس لیے صفحے کا سائز، حاشیے، ہیڈر اور نتیجہ براؤزر کی ترتیبات پر منحصر ہیں۔ پیچیدہ لے آؤٹ بدل سکتے ہیں۔ اصل کوڈ کی نقل رکھیں۔',
  ],
  tr: [
    'HTML’den PDF’ye dönüştürücü', 'HTML’den PDF’ye',
    'Basit HTML metin ve tablolarını tarayıcınızın yazdırma penceresiyle PDF’ye dönüştürün. Yükleme ve sunucu dönüşümü yoktur.',
    'HTML’den PDF’ye, HTML PDF dönüştürme, HTML’yi PDF olarak yazdırma, HTML’yi PDF olarak kaydetme',
    'Basit bir HTML belgesi yapıştırın, temizlenmiş önizlemeyi kontrol edin ve tarayıcının yazdırma penceresinde PDF olarak kaydet’i seçin.',
    'Bu araç verdiğiniz HTML’yi işler; web sitesi URL’lerini almaz veya dönüştürmez. İşlem tarayıcıda yapılır. Komut dosyalarının ve uzak içeriğin çalışmasını önlemek için komut dosyaları, stiller, görseller, bağlantılar, formlar ve gömülü içerikler kaldırılır. PDF’yi tarayıcının yazdırma penceresi oluşturur; sayfa boyutu, kenar boşlukları, üstbilgiler ve çıktı tarayıcı ayarlarına bağlıdır. Karmaşık düzenler değişebilir. Kaynak kodun bir kopyasını saklayın.',
  ],
  vi: [
    'Trình chuyển HTML sang PDF', 'HTML sang PDF',
    'Chuyển văn bản và bảng HTML đơn giản thành PDF bằng hộp thoại in của trình duyệt. Không tải lên hay xử lý trên máy chủ.',
    'HTML sang PDF, chuyển HTML thành PDF, in HTML thành PDF, lưu HTML dưới dạng PDF',
    'Dán tài liệu HTML đơn giản, xem trước nội dung đã làm sạch rồi chọn Lưu dưới dạng PDF trong hộp thoại in của trình duyệt.',
    'Công cụ nhận HTML bạn cung cấp; không tải hoặc chuyển đổi URL trang web. Việc xử lý diễn ra trong trình duyệt. Để ngăn mã lệnh và nội dung từ xa chạy, công cụ xóa mã lệnh, kiểu, ảnh, liên kết, biểu mẫu và nội dung nhúng. Trình duyệt tạo PDF trong hộp thoại in, nên khổ giấy, lề, đầu trang và kết quả phụ thuộc vào cài đặt trình duyệt. Bố cục phức tạp có thể thay đổi. Hãy giữ bản sao mã nguồn.',
  ],
};

const uiTranslations = {
  es: ['Título del documento', 'Contenido HTML', 'Escribe o pega HTML aquí…', 'Vista previa', 'Imprimir / Guardar como PDF', 'Vista previa del HTML', 'Añade contenido y luego previsualízalo o abre el diálogo de impresión del navegador.', 'Vista previa lista. Revisa la página antes de imprimir.', 'Se abrió el diálogo de impresión. Elige Guardar como PDF para crear el archivo.', 'El navegador crea el PDF. El tamaño de papel, los márgenes y los encabezados se eligen en el diálogo de impresión.', 'Por seguridad, se eliminan scripts, estilos, imágenes, enlaces, formularios y contenido externo. Esta herramienta imprime texto y tablas sencillos; no convierte la URL de un sitio web.'],
  fr: ['Titre du document', 'Contenu HTML', 'Saisissez ou collez le HTML ici…', 'Aperçu du document', 'Imprimer / Enregistrer en PDF', 'Aperçu HTML', 'Ajoutez du contenu, puis affichez l’aperçu ou ouvrez la boîte d’impression du navigateur.', 'Aperçu prêt. Vérifiez la page avant l’impression.', 'La boîte d’impression est ouverte. Choisissez Enregistrer au format PDF pour créer le fichier.', 'Le navigateur crée le PDF. Le format papier, les marges et les en-têtes se règlent dans la boîte d’impression.', 'Par sécurité, les scripts, styles, images, liens, formulaires et contenus externes sont supprimés. Cet outil imprime du texte et des tableaux simples ; il ne convertit pas l’URL d’un site web.'],
  pt: ['Título do documento', 'Conteúdo HTML', 'Digite ou cole o HTML aqui…', 'Pré-visualizar documento', 'Imprimir / Salvar como PDF', 'Prévia do HTML', 'Adicione o conteúdo e confira a prévia ou abra a janela de impressão do navegador.', 'Prévia pronta. Confira a página antes de imprimir.', 'A janela de impressão foi aberta. Escolha Salvar como PDF para criar o arquivo.', 'O navegador cria o PDF. O tamanho do papel, as margens e os cabeçalhos são definidos na janela de impressão.', 'Por segurança, scripts, estilos, imagens, links, formulários e conteúdo externo são removidos. Esta ferramenta imprime texto e tabelas simples; não converte URLs de sites.'],
  de: ['Dokumenttitel', 'HTML-Inhalt', 'HTML hier eingeben oder einfügen…', 'Dokumentvorschau', 'Drucken / Als PDF speichern', 'HTML-Vorschau', 'Füge Inhalt hinzu und prüfe die Vorschau oder öffne den Druckdialog deines Browsers.', 'Vorschau bereit. Prüfe die Seite vor dem Drucken.', 'Der Druckdialog wurde geöffnet. Wähle „Als PDF speichern“, um die Datei zu erstellen.', 'Der Browser erstellt das PDF. Papierformat, Ränder und Kopfzeilen stellst du im Druckdialog ein.', 'Aus Sicherheitsgründen werden Skripte, Styles, Bilder, Links, Formulare und externe Inhalte entfernt. Das Tool druckt einfachen Text und Tabellen; es wandelt keine Website-URL um.'],
  ja: ['文書のタイトル', 'HTMLの内容', 'ここにHTMLを入力または貼り付け…', '文書をプレビュー', '印刷 / PDFとして保存', 'HTMLプレビュー', '内容を追加してプレビューするか、ブラウザーの印刷画面を開いてください。', 'プレビューの準備ができました。印刷前にページを確認してください。', '印刷画面を開きました。PDFを作成するには「PDFとして保存」を選択してください。', 'PDFはブラウザーで作成されます。用紙サイズ、余白、ヘッダーは印刷画面で設定します。', '安全のため、スクリプト、スタイル、画像、リンク、フォーム、外部コンテンツを削除します。簡単なテキストと表を印刷するツールであり、WebサイトのURLは変換しません。'],
  ko: ['문서 제목', 'HTML 내용', '여기에 HTML을 입력하거나 붙여 넣으세요…', '문서 미리보기', '인쇄 / PDF로 저장', 'HTML 미리보기', '내용을 추가한 뒤 미리 보거나 브라우저 인쇄 창을 여세요.', '미리보기가 준비되었습니다. 인쇄 전에 페이지를 확인하세요.', '인쇄 창이 열렸습니다. 파일을 만들려면 PDF로 저장을 선택하세요.', 'PDF는 브라우저에서 만들어집니다. 용지 크기, 여백 및 머리글은 인쇄 창에서 설정합니다.', '보안을 위해 스크립트, 스타일, 이미지, 링크, 양식 및 외부 콘텐츠를 제거합니다. 간단한 텍스트와 표를 인쇄하며 웹사이트 URL은 변환하지 않습니다.'],
  id: ['Judul dokumen', 'Konten HTML', 'Ketik atau tempel HTML di sini…', 'Pratinjau dokumen', 'Cetak / Simpan sebagai PDF', 'Pratinjau HTML', 'Tambahkan konten lalu lihat pratinjau atau buka dialog cetak browser.', 'Pratinjau siap. Periksa halaman sebelum mencetak.', 'Dialog cetak dibuka. Pilih Simpan sebagai PDF untuk membuat file.', 'Browser membuat PDF. Ukuran kertas, margin, dan header diatur dalam dialog cetak.', 'Demi keamanan, skrip, gaya, gambar, tautan, formulir, dan konten eksternal dihapus. Alat ini mencetak teks dan tabel sederhana; tidak mengonversi URL situs web.'],
  hi: ['दस्तावेज़ का शीर्षक', 'HTML सामग्री', 'यहाँ HTML लिखें या पेस्ट करें…', 'दस्तावेज़ का पूर्वावलोकन', 'प्रिंट करें / PDF के रूप में सेव करें', 'HTML पूर्वावलोकन', 'सामग्री जोड़ें, फिर पूर्वावलोकन देखें या ब्राउज़र का प्रिंट डायलॉग खोलें।', 'पूर्वावलोकन तैयार है। प्रिंट करने से पहले पेज जाँचें।', 'प्रिंट डायलॉग खुल गया। फ़ाइल बनाने के लिए PDF के रूप में सेव करें चुनें।', 'PDF ब्राउज़र बनाता है। कागज़ का आकार, मार्जिन और हेडर प्रिंट डायलॉग में तय होते हैं।', 'सुरक्षा के लिए स्क्रिप्ट, स्टाइल, चित्र, लिंक, फ़ॉर्म और बाहरी सामग्री हटा दी जाती है। यह साधारण टेक्स्ट और टेबल प्रिंट करता है; वेबसाइट URL को कन्वर्ट नहीं करता।'],
  ar: ['عنوان المستند', 'محتوى HTML', 'اكتب HTML أو الصقه هنا…', 'معاينة المستند', 'طباعة / حفظ كملف PDF', 'معاينة HTML', 'أضف المحتوى ثم راجع المعاينة أو افتح نافذة الطباعة في المتصفح.', 'المعاينة جاهزة. راجع الصفحة قبل الطباعة.', 'فُتحت نافذة الطباعة. اختر الحفظ كملف PDF لإنشاء الملف.', 'ينشئ المتصفح ملف PDF. يتم ضبط حجم الورق والهوامش والرؤوس في نافذة الطباعة.', 'لأسباب أمنية، تُحذف البرامج النصية والأنماط والصور والروابط والنماذج والمحتويات الخارجية. تطبع الأداة نصوصًا وجداول بسيطة ولا تحول عناوين المواقع.'],
  zh: ['文档标题', 'HTML 内容', '在此输入或粘贴 HTML…', '预览文档', '打印 / 另存为 PDF', 'HTML 预览', '添加内容后查看预览，或打开浏览器打印对话框。', '预览已就绪。打印前请检查页面。', '已打开打印对话框。选择“另存为 PDF”以创建文件。', 'PDF 由浏览器创建。纸张大小、页边距和页眉在打印对话框中设置。', '为安全起见，会移除脚本、样式、图片、链接、表单和外部内容。本工具打印简单文本和表格，不转换网站 URL。'],
  bn: ['নথির শিরোনাম', 'HTML বিষয়বস্তু', 'এখানে HTML লিখুন বা পেস্ট করুন…', 'নথির প্রিভিউ', 'প্রিন্ট / PDF হিসেবে সংরক্ষণ', 'HTML প্রিভিউ', 'বিষয়বস্তু যোগ করে প্রিভিউ দেখুন অথবা ব্রাউজারের প্রিন্ট ডায়ালগ খুলুন।', 'প্রিভিউ প্রস্তুত। প্রিন্টের আগে পৃষ্ঠা দেখে নিন।', 'প্রিন্ট ডায়ালগ খোলা হয়েছে। ফাইল তৈরি করতে PDF হিসেবে সংরক্ষণ বেছে নিন।', 'PDF ব্রাউজার তৈরি করে। কাগজের মাপ, মার্জিন ও হেডার প্রিন্ট ডায়ালগে নির্ধারিত হয়।', 'নিরাপত্তার জন্য স্ক্রিপ্ট, স্টাইল, ছবি, লিংক, ফর্ম ও বাইরের কনটেন্ট সরানো হয়। টুলটি সাধারণ লেখা ও টেবিল প্রিন্ট করে; ওয়েবসাইট URL রূপান্তর করে না।'],
  ru: ['Название документа', 'HTML-содержимое', 'Введите или вставьте HTML…', 'Предварительный просмотр документа', 'Печать / Сохранить как PDF', 'Предпросмотр HTML', 'Добавьте содержимое и проверьте предпросмотр или откройте окно печати браузера.', 'Предпросмотр готов. Проверьте страницу перед печатью.', 'Окно печати открыто. Выберите «Сохранить как PDF», чтобы создать файл.', 'PDF создаёт браузер. Размер бумаги, поля и колонтитулы задаются в окне печати.', 'В целях безопасности удаляются скрипты, стили, изображения, ссылки, формы и внешний контент. Инструмент печатает простой текст и таблицы, но не преобразует URL сайта.'],
  ur: ['دستاویز کا عنوان', 'HTML مواد', 'HTML یہاں لکھیں یا چسپاں کریں…', 'دستاویز کا پیش منظر', 'پرنٹ / PDF کے طور پر محفوظ کریں', 'HTML پیش منظر', 'مواد شامل کریں، پھر پیش منظر دیکھیں یا براؤزر کا پرنٹ ڈائیلاگ کھولیں۔', 'پیش منظر تیار ہے۔ پرنٹ سے پہلے صفحہ دیکھ لیں۔', 'پرنٹ ڈائیلاگ کھل گیا۔ فائل بنانے کے لیے PDF کے طور پر محفوظ کریں منتخب کریں۔', 'PDF براؤزر بناتا ہے۔ کاغذ کا سائز، حاشیے اور ہیڈر پرنٹ ڈائیلاگ میں منتخب ہوتے ہیں۔', 'حفاظت کے لیے اسکرپٹس، اسٹائل، تصاویر، لنکس، فارم اور بیرونی مواد ہٹا دیا جاتا ہے۔ یہ سادہ متن اور جدول پرنٹ کرتا ہے؛ ویب سائٹ URL تبدیل نہیں کرتا۔'],
  tr: ['Belge başlığı', 'HTML içeriği', 'HTML’yi buraya yazın veya yapıştırın…', 'Belge önizlemesi', 'Yazdır / PDF olarak kaydet', 'HTML önizlemesi', 'İçeriği ekleyip önizleyin veya tarayıcının yazdırma penceresini açın.', 'Önizleme hazır. Yazdırmadan önce sayfayı kontrol edin.', 'Yazdırma penceresi açıldı. Dosyayı oluşturmak için PDF olarak kaydet’i seçin.', 'PDF’yi tarayıcı oluşturur. Kâğıt boyutu, kenar boşlukları ve üstbilgiler yazdırma penceresinde ayarlanır.', 'Güvenlik için komut dosyaları, stiller, görseller, bağlantılar, formlar ve harici içerik kaldırılır. Araç basit metin ve tabloları yazdırır; web sitesi URL’sini dönüştürmez.'],
  vi: ['Tiêu đề tài liệu', 'Nội dung HTML', 'Nhập hoặc dán HTML tại đây…', 'Xem trước tài liệu', 'In / Lưu dưới dạng PDF', 'Bản xem trước HTML', 'Thêm nội dung rồi xem trước hoặc mở hộp thoại in của trình duyệt.', 'Đã sẵn sàng xem trước. Hãy kiểm tra trang trước khi in.', 'Đã mở hộp thoại in. Chọn Lưu dưới dạng PDF để tạo tệp.', 'Trình duyệt tạo PDF. Khổ giấy, lề và đầu trang được đặt trong hộp thoại in.', 'Để an toàn, mã lệnh, kiểu, ảnh, liên kết, biểu mẫu và nội dung bên ngoài sẽ bị xóa. Công cụ in văn bản và bảng đơn giản; không chuyển đổi URL trang web.'],
};

const limitTranslations = {
  en: 'HTML content is limited to 250,000 characters. Website URLs are not fetched.',
  es: 'El contenido HTML está limitado a 250.000 caracteres. No se abren direcciones web.',
  fr: 'Le contenu HTML est limité à 250 000 caractères. Les URL de sites web ne sont pas récupérées.',
  pt: 'O conteúdo HTML tem limite de 250.000 caracteres. URLs de sites não são acessadas.',
  de: 'HTML-Inhalt ist auf 250.000 Zeichen begrenzt. Website-URLs werden nicht abgerufen.',
  ja: 'HTMLの上限は250,000文字です。WebサイトのURLは取得しません。',
  ko: 'HTML은 최대 250,000자까지 입력할 수 있습니다. 웹사이트 URL은 가져오지 않습니다.',
  id: 'Konten HTML dibatasi 250.000 karakter. URL situs web tidak diambil.',
  hi: 'HTML सामग्री की सीमा 250,000 अक्षर है। वेबसाइट URL नहीं खोले जाते।',
  ar: 'يقتصر محتوى HTML على 250,000 حرف. لا يتم جلب عناوين مواقع الويب.',
  zh: 'HTML 内容最多 250,000 个字符。不会抓取网站 URL。',
  bn: 'HTML বিষয়বস্তুর সীমা ২৫০,০০০ অক্ষর। ওয়েবসাইট URL আনা হয় না।',
  ru: 'Объём HTML ограничен 250 000 символами. URL веб-сайтов не загружаются.',
  ur: 'HTML مواد کی حد 250,000 حروف ہے۔ ویب سائٹ کے URL حاصل نہیں کیے جاتے۔',
  tr: 'HTML içeriği 250.000 karakterle sınırlıdır. Web sitesi URL’leri alınmaz.',
  vi: 'Nội dung HTML giới hạn 250.000 ký tự. Công cụ không tải URL trang web.',
};

const keys = uiKeys.slice();
export const htmlToPdfLocales = Object.fromEntries(Object.entries(rows).map(([language, copy]) => {
  const uiValues = language === 'en'
    ? ['Document title', 'HTML content', 'Type or paste HTML here…', 'Preview document', 'Print / Save as PDF', 'HTML preview', 'Enter content, then preview it or open your browser’s print dialog.', 'Preview ready. Check the page before printing.', 'Print dialog opened. Choose Save as PDF to create the file.', 'The browser creates the PDF. Paper size, margins and headers are set in the print dialog.', 'For safety, scripts, styles, images, links, forms and external content are removed. This tool prints simple text and tables; it does not convert a website URL.']
    : uiTranslations[language];
  const ui = Object.fromEntries(keys.map((key, index) => [key, uiValues[index]]));
  ui['HTML content is limited to 250,000 characters. Website URLs are not fetched.'] = limitTranslations[language];
  return [language, { copy: { 'html-to-pdf': copy }, ui }];
}));
