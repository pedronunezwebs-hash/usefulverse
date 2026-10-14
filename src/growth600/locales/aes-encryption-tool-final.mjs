export default {
  "en": {
    "copyLanguage": "en",
    "name": "AES encryption tool",
    "title": "AES Encryption Tool | UsefulVerse",
    "description": "Encrypt or decrypt text and small files locally with AES-256-GCM. No upload, account or encryption API.",
    "intro": "Encrypt text or files in this browser, or decrypt a container made by this tool. Authenticated AES-GCM rejects a wrong passphrase or altered data instead of returning unverified plaintext.",
    "howQuestion": "How does this AES encryption tool work?",
    "howAnswer": "It derives a 256-bit key from your passphrase with PBKDF2-HMAC-SHA-256, then uses AES-256-GCM with a new random salt and nonce. The text envelope or binary file container stores only the algorithm parameters and ciphertext, never the passphrase.",
    "privacyQuestion": "Are my passphrase or files uploaded?",
    "privacyAnswer": "No. Web Crypto performs the work in this browser. The page does not send your passphrase, plaintext, encrypted data or selected file to a processing server. Browser extensions or a compromised device remain outside this tool’s control.",
    "fields": {
      "mode": "Action",
      "encryptMode": "Encrypt",
      "decryptMode": "Decrypt",
      "dataMode": "Content type",
      "textMode": "Text",
      "fileMode": "File",
      "password": "Passphrase",
      "passwordHint": "Use a long, unique passphrase (16 or more characters is better). It is not saved or recoverable.",
      "sourceText": "Text or encrypted JSON envelope",
      "sourceFile": "Choose a file or UsefulVerse .uvenc container",
      "iterations": "PBKDF2-HMAC-SHA-256 iterations",
      "iterationsValue": "600,000 (fixed)",
      "accuracyNote": "Local-browser tool, not a security audit or guarantee against malware, compromised devices or weak passphrases. Text is limited to 1 MiB and files to 16 MiB to bound browser memory. Losing the passphrase makes decryption impossible. Keep a separate backup and test decryption before relying on an encrypted file.",
      "resultHeading": "Result",
      "resultText": "Encrypted envelope or decrypted text",
      "fileResult": "Encrypted or decrypted file",
      "fileNameNote": "The original filename and content type are stored in the encrypted file header."
    },
    "actions": {
      "process": "Encrypt",
      "example": "Load text example",
      "copy": "Copy result",
      "download": "Download result",
      "result": "Encryption result"
    },
    "messages": {
      "encrypted": "Encryption complete. Save the result and keep your passphrase safe.",
      "decrypted": "Authentication passed. Decryption complete.",
      "working": "Processing locally in this browser. This may take a moment on some devices.",
      "checkInputs": "Check the action, content type, passphrase and input.",
      "wrongOrDamaged": "Decryption failed: the passphrase may be wrong or the encrypted data may have changed.",
      "unsupportedCrypto": "Secure Web Crypto is unavailable. Use a supported browser over HTTPS.",
      "fileTooLarge": "The selected content exceeds this tool’s local size limit.",
      "copied": "Result copied.",
      "copyUnavailable": "Copy is unavailable in this browser.",
      "downloaded": "Download ready."
    },
    "additionalFaqs": [
      {
        "question": "Can I recover a file if I forget the passphrase?",
        "answer": "No. There is no account, recovery key or reset service. Keep the passphrase separately and verify a test decryption before deleting or replacing the original."
      },
      {
        "question": "Why does a wrong passphrase show an error?",
        "answer": "AES-GCM authenticates the ciphertext. If the passphrase is wrong or the data was changed, authentication fails and the tool returns no plaintext."
      },
      {
        "question": "Is this an audited or guaranteed secure system?",
        "answer": "No. It uses the browser Web Crypto API, but this page is not an independent audit or a guarantee against malware, unsafe extensions, weak passphrases, compromised devices or lost backups."
      }
    ]
  },
  "es": {
    "copyLanguage": "es",
    "name": "herramienta de cifrado AES",
    "title": "Herramienta de cifrado AES | UsefulVerse",
    "description": "Cifre o descifre texto y archivos pequeños localmente con AES-256-GCM. Sin carga, cuenta o API de cifrado.",
    "intro": "Cifre texto o archivos en este navegador, o descifre un contenedor creado por esta herramienta. AES-GCM autenticado rechaza una frase de contraseña incorrecta o datos alterados en lugar de devolver texto sin formato no verificado.",
    "howQuestion": "¿Cómo funciona esta herramienta de cifrado AES?",
    "howAnswer": "Obtiene una clave de 256 bits de su frase de contraseña con PBKDF2-HMAC-SHA-256, luego usa AES-256-GCM con un nuevo salt aleatorio y nonce. El sobre de texto o el contenedor de archivos binarios almacena sólo los parámetros del algoritmo y el texto cifrado, nunca la frase de contraseña.",
    "privacyQuestion": "¿Se cargan mi contraseña o mis archivos?",
    "privacyAnswer": "No. Web Crypto realiza el trabajo en este navegador. La página no envía su frase de contraseña, texto sin formato, datos cifrados o archivo seleccionado a un servidor de procesamiento. Las extensiones del navegador o un dispositivo comprometido permanecen fuera del control de esta herramienta.",
    "fields": {
      "mode": "acción",
      "encryptMode": "cifrar",
      "decryptMode": "Descifrar",
      "dataMode": "tipo de contenido",
      "textMode": "Texto",
      "fileMode": "Archivo",
      "password": "frase de contraseña",
      "passwordHint": "Utilice una frase de contraseña larga y única (16 o más caracteres es mejor). No se guarda ni se recupera.",
      "sourceText": "Texto o sobre JSON cifrado",
      "sourceFile": "Elija un archivo o contenedor UsefulVerse .uvenc",
      "iterations": "Iteraciones PBKDF2-HMAC-SHA-256",
      "iterationsValue": "600.000 (fijo)",
      "accuracyNote": "Herramienta de navegador local, no una auditoría de seguridad ni garantía contra malware, dispositivos comprometidos o frases de contraseña débiles. El texto está limitado a 1 MiB y los archivos a 16 MiB en la memoria limitada del navegador. La pérdida de la frase de contraseña hace que el descifrado sea imposible. Mantenga una copia de seguridad por separado y pruebe el descifrado antes de confiar en un archivo cifrado.",
      "resultHeading": "Resultado",
      "resultText": "Sobre cifrado o texto descifrado",
      "fileResult": "Archivo cifrado o descifrado",
      "fileNameNote": "El nombre del archivo original y el tipo de contenido se almacenan en el encabezado del archivo cifrado."
    },
    "actions": {
      "process": "cifrar",
      "example": "Cargar ejemplo de texto",
      "copy": "Copiar resultado",
      "download": "Descargar resultado",
      "result": "Resultado del cifrado"
    },
    "messages": {
      "encrypted": "Cifrado completo. Guarde el resultado y mantenga segura su contraseña.",
      "decrypted": "La autenticación pasó. Descifrado completo.",
      "working": "Procesando localmente en este navegador. Esto puede tardar un momento en algunos dispositivos.",
      "checkInputs": "Verifique la acción, el tipo de contenido, la frase de contraseña y la entrada.",
      "wrongOrDamaged": "Error al descifrar: la frase de contraseña puede ser incorrecta o los datos cifrados pueden haber cambiado.",
      "unsupportedCrypto": "Secure Web Crypto no está disponible. Utilice un navegador compatible a través de HTTPS.",
      "fileTooLarge": "El contenido seleccionado excede el límite de tamaño local de esta herramienta.",
      "copied": "Resultado copiado.",
      "copyUnavailable": "La copia no está disponible en este navegador.",
      "downloaded": "Descarga lista."
    },
    "additionalFaqs": [
      {
        "question": "¿Puedo recuperar un archivo si olvido la frase de contraseña?",
        "answer": "No. No hay cuenta, clave de recuperación ni servicio de reinicio. Mantenga la frase de contraseña por separado y verifique una prueba de descifrado antes de eliminar o reemplazar el original."
      },
      {
        "question": "¿Por qué una frase de contraseña incorrecta muestra un error?",
        "answer": "AES-GCM autentica el texto cifrado. Si la frase de contraseña es incorrecta o se cambiaron los datos, la autenticación falla y la herramienta no devuelve texto sin formato."
      },
      {
        "question": "¿Es este un sistema seguro auditado o garantizado?",
        "answer": "No. Utiliza la API Web Crypto del navegador, pero esta página no es una auditoría independiente ni una garantía contra malware, extensiones inseguras, frases de contraseña débiles, dispositivos comprometidos o copias de seguridad perdidas."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "fr": {
    "copyLanguage": "fr",
    "name": "Outil de cryptage AES",
    "title": "Outil de cryptage AES | UsefulVerse",
    "description": "Cryptez ou déchiffrez du texte et des petits fichiers localement avec AES-256-GCM. Pas d'API de téléchargement, de compte ou de cryptage.",
    "intro": "Cryptez du texte ou des fichiers dans ce navigateur, ou décryptez un conteneur créé par cet outil. AES-GCM authentifié rejette une phrase secrète incorrecte ou des données modifiées au lieu de renvoyer un texte brut non vérifié.",
    "howQuestion": "Comment fonctionne cet outil de cryptage AES ?",
    "howAnswer": "Il dérive une clé de 256 bits de votre phrase secrète avec PBKDF2-HMAC-SHA-256, puis utilise AES-256-GCM avec un nouveau sel aléatoire et un nom occasionnel. L'enveloppe de texte ou le conteneur de fichier binaire stocke uniquement les paramètres de l'algorithme et le texte chiffré, jamais la phrase secrète.",
    "privacyQuestion": "Ma phrase secrète ou mes fichiers sont-ils téléchargés ?",
    "privacyAnswer": "Non. Web Crypto effectue le travail dans ce navigateur. La page n'envoie pas votre phrase secrète, votre texte en clair, vos données cryptées ou le fichier sélectionné à un serveur de traitement. Les extensions de navigateur ou un appareil compromis restent hors du contrôle de cet outil.",
    "fields": {
      "mode": "Action",
      "encryptMode": "Chiffrer",
      "decryptMode": "Décrypter",
      "dataMode": "Type de contenu",
      "textMode": "Texte",
      "fileMode": "Fichier",
      "password": "Phrase secrète",
      "passwordHint": "Utilisez une phrase secrète longue et unique (16 caractères ou plus, c'est mieux). Il n’est ni sauvegardé ni récupérable.",
      "sourceText": "Enveloppe texte ou JSON chiffrée",
      "sourceFile": "Choisissez un fichier ou un conteneur UsefulVerse .uvenc",
      "iterations": "Itérations PBKDF2-HMAC-SHA-256",
      "iterationsValue": "600 000 (fixe)",
      "accuracyNote": "Outil de navigateur local, et non un audit de sécurité ou une garantie contre les logiciels malveillants, les appareils compromis ou les phrases secrètes faibles. Le texte est limité à 1 Mio et les fichiers à 16 Mio pour limiter la mémoire du navigateur. La perte de la phrase secrète rend le décryptage impossible. Conservez une sauvegarde séparée et testez le décryptage avant de vous fier à un fichier crypté.",
      "resultHeading": "Résultat",
      "resultText": "Enveloppe cryptée ou texte décrypté",
      "fileResult": "Fichier crypté ou déchiffré",
      "fileNameNote": "Le nom de fichier d'origine et le type de contenu sont stockés dans l'en-tête du fichier crypté."
    },
    "actions": {
      "process": "Chiffrer",
      "example": "Charger un exemple de texte",
      "copy": "Copier le résultat",
      "download": "Télécharger le résultat",
      "result": "Résultat du chiffrement"
    },
    "messages": {
      "encrypted": "Chiffrement terminé. Enregistrez le résultat et conservez votre phrase secrète en sécurité.",
      "decrypted": "Authentification réussie. Décryptage terminé.",
      "working": "Traitement local dans ce navigateur. Cela peut prendre un moment sur certains appareils.",
      "checkInputs": "Vérifiez l'action, le type de contenu, la phrase secrète et la saisie.",
      "wrongOrDamaged": "Échec du décryptage : la phrase secrète est peut-être erronée ou les données chiffrées ont peut-être changé.",
      "unsupportedCrypto": "Secure Web Crypto n'est pas disponible. Utilisez un navigateur pris en charge via HTTPS.",
      "fileTooLarge": "Le contenu sélectionné dépasse la limite de taille locale de cet outil.",
      "copied": "Résultat copié.",
      "copyUnavailable": "La copie n'est pas disponible dans ce navigateur.",
      "downloaded": "Téléchargement prêt."
    },
    "additionalFaqs": [
      {
        "question": "Puis-je récupérer un fichier si j’oublie la phrase secrète ?",
        "answer": "Non. Il n’existe pas de compte, de clé de récupération ou de service de réinitialisation. Conservez la phrase secrète séparément et vérifiez un test de décryptage avant de supprimer ou de remplacer l'original."
      },
      {
        "question": "Pourquoi une mauvaise phrase secrète génère-t-elle une erreur ?",
        "answer": "AES-GCM authentifie le texte chiffré. Si la phrase secrète est erronée ou si les données ont été modifiées, l'authentification échoue et l'outil ne renvoie aucun texte en clair."
      },
      {
        "question": "S'agit-il d'un système sécurisé audité ou garanti ?",
        "answer": "Non. Il utilise l'API Web Crypto du navigateur, mais cette page ne constitue pas un audit indépendant ni une garantie contre les logiciels malveillants, les extensions dangereuses, les phrases secrètes faibles, les appareils compromis ou les sauvegardes perdues."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "pt": {
    "copyLanguage": "pt",
    "name": "Ferramenta de criptografia AES",
    "title": "Ferramenta de criptografia AES | UsefulVerse",
    "description": "Criptografe ou descriptografe texto e pequenos arquivos localmente com AES-256-GCM. Sem upload, conta ou API de criptografia.",
    "intro": "Criptografe texto ou arquivos neste navegador ou descriptografe um contêiner criado por esta ferramenta. O AES-GCM autenticado rejeita uma senha errada ou dados alterados em vez de retornar texto simples não verificado.",
    "howQuestion": "Como funciona esta ferramenta de criptografia AES?",
    "howAnswer": "Ele deriva uma chave de 256 bits de sua senha com PBKDF2-HMAC-SHA-256 e, em seguida, usa AES-256-GCM com um novo sal e nonce aleatórios. O envelope de texto ou contêiner de arquivo binário armazena apenas os parâmetros do algoritmo e o texto cifrado, nunca a senha.",
    "privacyQuestion": "Minha senha ou arquivos foram carregados?",
    "privacyAnswer": "Não. O Web Crypto realiza o trabalho neste navegador. A página não envia sua senha, texto simples, dados criptografados ou arquivo selecionado para um servidor de processamento. As extensões do navegador ou um dispositivo comprometido permanecem fora do controle desta ferramenta.",
    "fields": {
      "mode": "Ação",
      "encryptMode": "Criptografar",
      "decryptMode": "Descriptografar",
      "dataMode": "Tipo de conteúdo",
      "textMode": "Texto",
      "fileMode": "Arquivo",
      "password": "Senha",
      "passwordHint": "Use uma senha longa e exclusiva (16 ou mais caracteres é melhor). Não é salvo ou recuperável.",
      "sourceText": "Texto ou envelope JSON criptografado",
      "sourceFile": "Escolha um arquivo ou contêiner UsefulVerse .uvenc",
      "iterations": "Iterações PBKDF2-HMAC-SHA-256",
      "iterationsValue": "600.000 (fixo)",
      "accuracyNote": "Ferramenta de navegador local, não uma auditoria de segurança ou garantia contra malware, dispositivos comprometidos ou senhas fracas. O texto é limitado a 1 MiB e os arquivos a 16 MiB para vincular a memória do navegador. Perder a senha torna a descriptografia impossível. Mantenha um backup separado e teste a descriptografia antes de confiar em um arquivo criptografado.",
      "resultHeading": "Resultado",
      "resultText": "Envelope criptografado ou texto descriptografado",
      "fileResult": "Arquivo criptografado ou descriptografado",
      "fileNameNote": "O nome do arquivo original e o tipo de conteúdo são armazenados no cabeçalho do arquivo criptografado."
    },
    "actions": {
      "process": "Criptografar",
      "example": "Carregar exemplo de texto",
      "copy": "Copiar resultado",
      "download": "Baixar resultado",
      "result": "Resultado da criptografia"
    },
    "messages": {
      "encrypted": "Criptografia concluída. Salve o resultado e mantenha sua senha segura.",
      "decrypted": "Autenticação aprovada. Descriptografia concluída.",
      "working": "Processando localmente neste navegador. Isso pode demorar um pouco em alguns dispositivos.",
      "checkInputs": "Verifique a ação, tipo de conteúdo, senha e entrada.",
      "wrongOrDamaged": "Falha na descriptografia: a senha pode estar errada ou os dados criptografados podem ter sido alterados.",
      "unsupportedCrypto": "A criptografia segura da Web não está disponível. Use um navegador compatível por HTTPS.",
      "fileTooLarge": "O conteúdo selecionado excede o limite de tamanho local desta ferramenta.",
      "copied": "Resultado copiado.",
      "copyUnavailable": "A cópia não está disponível neste navegador.",
      "downloaded": "Baixe pronto."
    },
    "additionalFaqs": [
      {
        "question": "Posso recuperar um arquivo se esquecer a senha?",
        "answer": "Não. Não há conta, chave de recuperação ou serviço de redefinição. Mantenha a senha separadamente e verifique um teste de descriptografia antes de excluir ou substituir a original."
      },
      {
        "question": "Por que uma senha errada mostra um erro?",
        "answer": "AES-GCM autentica o texto cifrado. Se a senha estiver errada ou os dados foram alterados, a autenticação falhará e a ferramenta não retornará texto simples."
      },
      {
        "question": "Este é um sistema auditado ou seguro garantido?",
        "answer": "Não. Ele usa a API Web Crypto do navegador, mas esta página não é uma auditoria independente ou uma garantia contra malware, extensões inseguras, senhas fracas, dispositivos comprometidos ou backups perdidos."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "de": {
    "copyLanguage": "de",
    "name": "AES-Verschlüsselungstool",
    "title": "Kostenloses | UsefulVerse",
    "description": "Verschlüsseln oder entschlüsseln Sie Texte und kleine Dateien lokal mit AES-256-GCM. Kein Upload, kein Konto oder keine Verschlüsselungs-API.",
    "intro": "Verschlüsseln Sie Text oder Dateien in diesem Browser oder entschlüsseln Sie einen mit diesem Tool erstellten Container. Authentifizierter AES-GCM weist eine falsche Passphrase oder geänderte Daten zurück, anstatt unverifizierten Klartext zurückzugeben.",
    "howQuestion": "Wie funktioniert dieses AES-Verschlüsselungstool?",
    "howAnswer": "Es leitet mit PBKDF2-HMAC-SHA-256 einen 256-Bit-Schlüssel aus Ihrer Passphrase ab und verwendet dann AES-256-GCM mit einem neuen zufälligen Salt und Nonce. Der Textumschlag oder Binärdateicontainer speichert nur die Algorithmusparameter und den Chiffretext, niemals die Passphrase.",
    "privacyQuestion": "Werden mein Passwort oder meine Dateien hochgeladen?",
    "privacyAnswer": "Nein. Web Crypto führt die Arbeit in diesem Browser aus. Die Seite sendet Ihr Passwort, Ihren Klartext, Ihre verschlüsselten Daten oder Ihre ausgewählte Datei nicht an einen Verarbeitungsserver. Browsererweiterungen oder ein kompromittiertes Gerät bleiben außerhalb der Kontrolle dieses Tools.",
    "fields": {
      "mode": "Aktion",
      "encryptMode": "Verschlüsseln",
      "decryptMode": "Entschlüsseln",
      "dataMode": "Inhaltstyp",
      "textMode": "Text",
      "fileMode": "Datei",
      "password": "Passphrase",
      "passwordHint": "Verwenden Sie eine lange, eindeutige Passphrase (besser sind 16 oder mehr Zeichen). Es wird nicht gespeichert oder kann nicht wiederhergestellt werden.",
      "sourceText": "Text oder verschlüsselter JSON-Umschlag",
      "sourceFile": "Wählen Sie eine Datei oder einen UsefulVerse .uvenc-Container",
      "iterations": "PBKDF2-HMAC-SHA-256-Iterationen",
      "iterationsValue": "600.000 (fest)",
      "accuracyNote": "Lokales Browser-Tool, kein Sicherheitsaudit oder Garantie gegen Malware, kompromittierte Geräte oder schwache Passphrasen. Text ist auf 1 MiB und Dateien auf 16 MiB begrenzt, um den Browserspeicher zu begrenzen. Der Verlust der Passphrase macht eine Entschlüsselung unmöglich. Erstellen Sie ein separates Backup und testen Sie die Entschlüsselung, bevor Sie sich auf eine verschlüsselte Datei verlassen.",
      "resultHeading": "Ergebnis",
      "resultText": "Verschlüsselter Umschlag oder entschlüsselter Text",
      "fileResult": "Verschlüsselte oder entschlüsselte Datei",
      "fileNameNote": "Der ursprüngliche Dateiname und der Inhaltstyp werden im verschlüsselten Dateiheader gespeichert."
    },
    "actions": {
      "process": "Verschlüsseln",
      "example": "Textbeispiel laden",
      "copy": "Ergebnis kopieren",
      "download": "Ergebnis herunterladen",
      "result": "Verschlüsselungsergebnis"
    },
    "messages": {
      "encrypted": "Verschlüsselung abgeschlossen. Speichern Sie das Ergebnis und bewahren Sie Ihr Passwort sicher auf.",
      "decrypted": "Authentifizierung bestanden. Entschlüsselung abgeschlossen.",
      "working": "Verarbeitung lokal in diesem Browser. Dies kann auf einigen Geräten einen Moment dauern.",
      "checkInputs": "Überprüfen Sie die Aktion, den Inhaltstyp, die Passphrase und die Eingabe.",
      "wrongOrDamaged": "Entschlüsselung fehlgeschlagen: Möglicherweise ist die Passphrase falsch oder die verschlüsselten Daten haben sich geändert.",
      "unsupportedCrypto": "Secure Web Crypto ist nicht verfügbar. Verwenden Sie einen unterstützten Browser über HTTPS.",
      "fileTooLarge": "Der ausgewählte Inhalt überschreitet die lokale Größenbeschränkung dieses Tools.",
      "copied": "Ergebnis kopiert.",
      "copyUnavailable": "Das Kopieren ist in diesem Browser nicht verfügbar.",
      "downloaded": "Download bereit."
    },
    "additionalFaqs": [
      {
        "question": "Kann ich eine Datei wiederherstellen, wenn ich die Passphrase vergessen habe?",
        "answer": "Nein. Es gibt kein Konto, keinen Wiederherstellungsschlüssel und keinen Reset-Dienst. Bewahren Sie die Passphrase separat auf und führen Sie eine Testentschlüsselung durch, bevor Sie das Original löschen oder ersetzen."
      },
      {
        "question": "Warum zeigt eine falsche Passphrase einen Fehler an?",
        "answer": "AES-GCM authentifiziert den Chiffretext. Wenn die Passphrase falsch ist oder die Daten geändert wurden, schlägt die Authentifizierung fehl und das Tool gibt keinen Klartext zurück."
      },
      {
        "question": "Handelt es sich um ein geprüftes oder garantiert sicheres System?",
        "answer": "Nein. Es wird die Web-Crypto-API des Browsers verwendet, aber diese Seite stellt keine unabhängige Prüfung oder Garantie gegen Malware, unsichere Erweiterungen, schwache Passphrasen, kompromittierte Geräte oder verlorene Backups dar."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "ja": {
    "copyLanguage": "ja",
    "name": "AES暗号化ツール",
    "title": "AES暗号化ツール無料 | UsefulVerse",
    "description": "AES-256-GCM を使用して、テキストと小さなファイルをローカルで暗号化または復号化します。アップロード、アカウント、暗号化 API はありません。",
    "intro": "このブラウザ内のテキストやファイルを暗号化するか、このツールで作成されたコンテナを復号化します。認証された AES-GCM は、未検証のプレーンテキストを返す代わりに、間違ったパスフレーズや変更されたデータを拒否します。",
    "howQuestion": "この AES 暗号化ツールはどのように機能しますか?",
    "howAnswer": "PBKDF2-HMAC-SHA-256 を使用してパスフレーズから 256 ビット キーを取得し、新しいランダム ソルトとノンスを含む AES-256-GCM を使用します。テキスト エンベロープまたはバイナリ ファイル コンテナには、アルゴリズム パラメータと暗号文のみが保存され、パスフレーズは保存されません。",
    "privacyQuestion": "私のパスフレーズまたはファイルはアップロードされていますか?",
    "privacyAnswer": "いいえ。Web Crypto はこのブラウザで作業を実行します。このページは、パスフレーズ、平文、暗号化されたデータ、または選択したファイルを処理サーバーに送信しません。ブラウザ拡張機能や侵害されたデバイスは、このツールの制御外のままです。",
    "fields": {
      "mode": "アクション",
      "encryptMode": "暗号化する",
      "decryptMode": "復号化",
      "dataMode": "コンテンツタイプ",
      "textMode": "テキスト",
      "fileMode": "ファイル",
      "password": "パスフレーズ",
      "passwordHint": "長くて一意のパスフレーズを使用します (16 文字以上が望ましい)。保存も回復もできません。",
      "sourceText": "テキストまたは暗号化された JSON エンベロープ",
      "sourceFile": "ファイルまたは UsefulVerse .uvenc コンテナを選択してください",
      "iterations": "PBKDF2-HMAC-SHA-256 反復",
      "iterationsValue": "600,000（固定）",
      "accuracyNote": "ローカル ブラウザ ツールであり、マルウェア、侵害されたデバイス、または脆弱なパスフレーズに対するセキュリティ監査や保証を行うものではありません。ブラウザーのメモリに制限されるため、テキストは 1 MiB、ファイルは 16 MiB に制限されます。パスフレーズを失うと、復号化が不可能になります。暗号化されたファイルを使用する前に、別のバックアップを作成し、復号化をテストしてください。",
      "resultHeading": "結果",
      "resultText": "暗号化された封筒または復号化されたテキスト",
      "fileResult": "暗号化または復号化されたファイル",
      "fileNameNote": "元のファイル名とコンテンツ タイプは、暗号化されたファイル ヘッダーに保存されます。"
    },
    "actions": {
      "process": "暗号化する",
      "example": "テキストの読み込み例",
      "copy": "コピー結果",
      "download": "ダウンロード結果",
      "result": "暗号化結果"
    },
    "messages": {
      "encrypted": "暗号化が完了しました。結果を保存し、パスフレーズを安全に保管してください。",
      "decrypted": "認証が成功しました。復号化が完了しました。",
      "working": "このブラウザでローカルに処理します。一部のデバイスではこれに少し時間がかかる場合があります。",
      "checkInputs": "アクション、コンテンツ タイプ、パスフレーズ、入力を確認してください。",
      "wrongOrDamaged": "復号化に失敗しました。パスフレーズが間違っているか、暗号化されたデータが変更されている可能性があります。",
      "unsupportedCrypto": "セキュア Web 暗号化は利用できません。 HTTPS 経由でサポートされているブラウザを使用します。",
      "fileTooLarge": "選択したコンテンツは、このツールのローカル サイズ制限を超えています。",
      "copied": "結果がコピーされました。",
      "copyUnavailable": "このブラウザではコピーできません。",
      "downloaded": "ダウンロードの準備ができました。"
    },
    "additionalFaqs": [
      {
        "question": "パスフレーズを忘れた場合、ファイルを復元できますか?",
        "answer": "いいえ。アカウント、回復キー、リセット サービスはありません。パスフレーズは別に保管し、元のパスフレーズを削除または置き換える前に、テスト復号化を検証してください。"
      },
      {
        "question": "パスフレーズが間違っているとエラーが表示されるのはなぜですか?",
        "answer": "AES-GCM は暗号文を認証します。パスフレーズが間違っているか、データが変更されている場合、認証は失敗し、ツールは平文を返しません。"
      },
      {
        "question": "これは監査済みまたは安全性が保証されたシステムですか?",
        "answer": "いいえ。ブラウザの Web Crypto API を使用していますが、このページは独立した監査ではなく、マルウェア、安全でない拡張機能、弱いパスフレーズ、侵害されたデバイス、またはバックアップの紛失に対する保証でもありません。"
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "ko": {
    "copyLanguage": "ko",
    "name": "AES 암호화 도구",
    "title": "AES 암호화 도구 | UsefulVerse",
    "description": "AES-256-GCM을 사용하여 로컬에서 텍스트와 작은 파일을 암호화하거나 해독합니다. 업로드, 계정 또는 암호화 API가 없습니다.",
    "intro": "이 브라우저에서 텍스트나 파일을 암호화하거나 이 도구로 만든 컨테이너의 암호를 해독하세요. 인증된 AES-GCM은 확인되지 않은 일반 텍스트를 반환하는 대신 잘못된 암호나 변경된 데이터를 거부합니다.",
    "howQuestion": "이 AES 암호화 도구는 어떻게 작동합니까?",
    "howAnswer": "PBKDF2-HMAC-SHA-256을 사용하여 암호에서 256비트 키를 파생한 다음 새로운 임의 솔트 및 nonce와 함께 AES-256-GCM을 사용합니다. 텍스트 봉투 또는 바이너리 파일 컨테이너는 알고리즘 매개변수와 암호문만 저장하며 암호는 저장하지 않습니다.",
    "privacyQuestion": "내 암호나 파일이 업로드됩니까?",
    "privacyAnswer": "아니요. Web Crypto는 이 브라우저에서 작업을 수행합니다. 이 페이지는 귀하의 암호, 일반 텍스트, 암호화된 데이터 또는 선택한 파일을 처리 서버로 보내지 않습니다. 브라우저 확장 프로그램이나 손상된 장치는 이 도구의 제어 범위를 벗어납니다.",
    "fields": {
      "mode": "액션",
      "encryptMode": "암호화",
      "decryptMode": "암호 해독",
      "dataMode": "콘텐츠 유형",
      "textMode": "텍스트",
      "fileMode": "파일",
      "password": "암호",
      "passwordHint": "길고 고유한 암호를 사용하십시오(16자 이상이 좋습니다). 저장되거나 복구할 수 없습니다.",
      "sourceText": "텍스트 또는 암호화된 JSON 봉투",
      "sourceFile": "파일 또는 UsefulVerse .uvenc 컨테이너를 선택하세요.",
      "iterations": "PBKDF2-HMAC-SHA-256 반복",
      "iterationsValue": "600,000(고정)",
      "accuracyNote": "맬웨어, 손상된 장치 또는 약한 암호에 대한 보안 감사나 보증이 아닌 로컬 브라우저 도구입니다. 브라우저 메모리 바인딩을 위해 텍스트는 1MiB, 파일은 16MiB로 제한됩니다. 암호를 분실하면 암호 해독이 불가능해집니다. 암호화된 파일을 사용하기 전에 별도의 백업을 유지하고 암호 해독을 테스트하십시오.",
      "resultHeading": "결과",
      "resultText": "암호화된 봉투 또는 해독된 텍스트",
      "fileResult": "암호화되거나 해독된 파일",
      "fileNameNote": "원본 파일 이름과 콘텐츠 유형은 암호화된 파일 헤더에 저장됩니다."
    },
    "actions": {
      "process": "암호화",
      "example": "텍스트 예시 로드",
      "copy": "결과 복사",
      "download": "결과 다운로드",
      "result": "암호화 결과"
    },
    "messages": {
      "encrypted": "암호화가 완료되었습니다. 결과를 저장하고 암호를 안전하게 유지하세요.",
      "decrypted": "인증이 통과되었습니다. 암호 해독이 완료되었습니다.",
      "working": "이 브라우저에서 로컬로 처리됩니다. 일부 기기에서는 이 작업에 다소 시간이 걸릴 수 있습니다.",
      "checkInputs": "작업, 콘텐츠 유형, 암호 및 입력을 확인하세요.",
      "wrongOrDamaged": "암호 해독 실패: 암호가 잘못되었거나 암호화된 데이터가 변경되었을 수 있습니다.",
      "unsupportedCrypto": "보안 웹 암호화를 사용할 수 없습니다. HTTPS를 통해 지원되는 브라우저를 사용하십시오.",
      "fileTooLarge": "선택한 콘텐츠가 이 도구의 로컬 크기 제한을 초과합니다.",
      "copied": "결과가 복사되었습니다.",
      "copyUnavailable": "이 브라우저에서는 복사할 수 없습니다.",
      "downloaded": "다운로드가 준비되었습니다."
    },
    "additionalFaqs": [
      {
        "question": "암호를 잊어버린 경우 파일을 복구할 수 있나요?",
        "answer": "아니요. 계정, 복구 키 또는 재설정 서비스가 없습니다. 원본을 삭제하거나 교체하기 전에 암호를 별도로 보관하고 테스트 암호 해독을 확인하십시오."
      },
      {
        "question": "잘못된 암호로 인해 오류가 표시되는 이유는 무엇입니까?",
        "answer": "AES-GCM은 암호문을 인증합니다. 암호가 잘못되었거나 데이터가 변경된 경우 인증이 실패하고 도구에서 일반 텍스트를 반환하지 않습니다."
      },
      {
        "question": "이것은 감사를 받았거나 보장된 보안 시스템입니까?",
        "answer": "아니요. 브라우저 Web Crypto API를 사용하지만 이 페이지는 독립적인 감사나 맬웨어, 안전하지 않은 확장 프로그램, 취약한 암호, 손상된 장치 또는 백업 손실에 대한 보증이 아닙니다."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "id": {
    "copyLanguage": "id",
    "name": "Alat enkripsi AES",
    "title": "Alat Enkripsi AES | UsefulVerse",
    "description": "Enkripsi atau dekripsi teks dan file kecil secara lokal dengan AES-256-GCM. Tidak ada unggahan, akun, atau API enkripsi.",
    "intro": "Enkripsi teks atau file di browser ini, atau dekripsi wadah yang dibuat oleh alat ini. AES-GCM yang diautentikasi menolak frasa sandi yang salah atau data yang diubah alih-alih mengembalikan teks biasa yang belum diverifikasi.",
    "howQuestion": "Bagaimana cara kerja alat enkripsi AES ini?",
    "howAnswer": "Ini memperoleh kunci 256-bit dari frasa sandi Anda dengan PBKDF2-HMAC-SHA-256, lalu menggunakan AES-256-GCM dengan garam dan nonce acak baru. Amplop teks atau wadah file biner hanya menyimpan parameter algoritme dan teks sandi, tidak pernah menyimpan frasa sandi.",
    "privacyQuestion": "Apakah frasa sandi atau file saya diunggah?",
    "privacyAnswer": "Tidak. Web Crypto melakukan pekerjaan di browser ini. Halaman tersebut tidak mengirimkan frasa sandi, teks biasa, data terenkripsi, atau file yang dipilih ke server pemrosesan. Ekstensi browser atau perangkat yang disusupi tetap berada di luar kendali alat ini.",
    "fields": {
      "mode": "Tindakan",
      "encryptMode": "Enkripsi",
      "decryptMode": "Dekripsi",
      "dataMode": "Jenis konten",
      "textMode": "Teks",
      "fileMode": "Mengajukan",
      "password": "Frasa sandi",
      "passwordHint": "Gunakan frasa sandi yang panjang dan unik (lebih baik 16 karakter atau lebih). Itu tidak disimpan atau dipulihkan.",
      "sourceText": "Teks atau amplop JSON terenkripsi",
      "sourceFile": "Pilih file atau wadah .uvenc EffectiveVerse",
      "iterations": "Iterasi PBKDF2-HMAC-SHA-256",
      "iterationsValue": "600.000 (tetap)",
      "accuracyNote": "Alat browser lokal, bukan audit keamanan atau jaminan terhadap malware, perangkat yang disusupi, atau frasa sandi yang lemah. Teks dibatasi hingga 1 MiB dan file hingga 16 MiB untuk terikat pada memori browser. Kehilangan frasa sandi membuat dekripsi menjadi tidak mungkin. Simpan cadangan terpisah dan uji dekripsi sebelum mengandalkan file terenkripsi.",
      "resultHeading": "Hasil",
      "resultText": "Amplop terenkripsi atau teks yang didekripsi",
      "fileResult": "File terenkripsi atau didekripsi",
      "fileNameNote": "Nama file asli dan tipe konten disimpan di header file terenkripsi."
    },
    "actions": {
      "process": "Enkripsi",
      "example": "Contoh memuat teks",
      "copy": "Salin hasilnya",
      "download": "Hasil unduhan",
      "result": "Hasil enkripsi"
    },
    "messages": {
      "encrypted": "Enkripsi selesai. Simpan hasilnya dan simpan frasa sandi Anda dengan aman.",
      "decrypted": "Otentikasi berhasil. Dekripsi selesai.",
      "working": "Memproses secara lokal di browser ini. Ini mungkin memerlukan waktu beberapa saat pada beberapa perangkat.",
      "checkInputs": "Periksa tindakan, tipe konten, frasa sandi, dan masukan.",
      "wrongOrDamaged": "Dekripsi gagal: frasa sandi mungkin salah atau data terenkripsi mungkin telah berubah.",
      "unsupportedCrypto": "Kripto Web Aman tidak tersedia. Gunakan browser yang didukung melalui HTTPS.",
      "fileTooLarge": "Konten yang dipilih melebihi batas ukuran lokal alat ini.",
      "copied": "Hasil disalin.",
      "copyUnavailable": "Salinan tidak tersedia di browser ini.",
      "downloaded": "Unduhan siap."
    },
    "additionalFaqs": [
      {
        "question": "Bisakah saya memulihkan file jika saya lupa kata sandinya?",
        "answer": "Tidak. Tidak ada akun, kunci pemulihan, atau layanan reset. Simpan frasa sandi secara terpisah dan verifikasi dekripsi uji sebelum menghapus atau mengganti yang asli."
      },
      {
        "question": "Mengapa frasa sandi yang salah menunjukkan kesalahan?",
        "answer": "AES-GCM mengautentikasi ciphertext. Jika frasa sandi salah atau data diubah, autentikasi gagal dan alat tidak mengembalikan teks biasa."
      },
      {
        "question": "Apakah ini sistem aman yang diaudit atau terjamin?",
        "answer": "Tidak. Halaman ini menggunakan Web Crypto API browser, namun halaman ini bukan merupakan audit independen atau jaminan terhadap malware, ekstensi yang tidak aman, frasa sandi yang lemah, perangkat yang disusupi, atau cadangan yang hilang."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "hi": {
    "copyLanguage": "hi",
    "name": "एईएस एन्क्रिप्शन उपकरण",
    "title": "एईएस एन्क्रिप्शन टूल | UsefulVerse",
    "description": "AES-256-GCM के साथ स्थानीय रूप से टेक्स्ट और छोटी फ़ाइलों को एन्क्रिप्ट या डिक्रिप्ट करें। कोई अपलोड, खाता या एन्क्रिप्शन एपीआई नहीं।",
    "intro": "इस ब्राउज़र में टेक्स्ट या फ़ाइलों को एन्क्रिप्ट करें, या इस टूल द्वारा बनाए गए कंटेनर को डिक्रिप्ट करें। प्रमाणित एईएस-जीसीएम असत्यापित प्लेनटेक्स्ट को वापस करने के बजाय गलत पासफ़्रेज़ या परिवर्तित डेटा को अस्वीकार कर देता है।",
    "howQuestion": "यह एईएस एन्क्रिप्शन उपकरण कैसे काम करता है?",
    "howAnswer": "यह आपके पासफ़्रेज़ से PBKDF2-HMAC-SHA-256 के साथ 256-बिट कुंजी प्राप्त करता है, फिर एक नए यादृच्छिक नमक और नॉन के साथ AES-256-GCM का उपयोग करता है। टेक्स्ट लिफाफा या बाइनरी फ़ाइल कंटेनर केवल एल्गोरिदम पैरामीटर और सिफरटेक्स्ट को संग्रहीत करता है, कभी भी पासफ़्रेज़ को नहीं।",
    "privacyQuestion": "क्या मेरा पासफ़्रेज़ या फ़ाइलें अपलोड की गई हैं?",
    "privacyAnswer": "नहीं, वेब क्रिप्टो इस ब्राउज़र में कार्य करता है। पेज आपके पासफ़्रेज़, प्लेनटेक्स्ट, एन्क्रिप्टेड डेटा या चयनित फ़ाइल को प्रोसेसिंग सर्वर पर नहीं भेजता है। ब्राउज़र एक्सटेंशन या कोई समझौता किया गया डिवाइस इस टूल के नियंत्रण से बाहर रहता है।",
    "fields": {
      "mode": "कार्रवाई",
      "encryptMode": "एन्क्रिप्ट करें",
      "decryptMode": "डिक्रिप्ट",
      "dataMode": "सामग्री प्रकार",
      "textMode": "पाठ",
      "fileMode": "फ़ाइल",
      "password": "पासफ़्रेज़",
      "passwordHint": "एक लंबे, अद्वितीय पासफ़्रेज़ का उपयोग करें (16 या अधिक वर्ण बेहतर है)। यह सहेजा या पुनर्प्राप्त करने योग्य नहीं है.",
      "sourceText": "टेक्स्ट या एन्क्रिप्टेड JSON लिफ़ाफ़ा",
      "sourceFile": "एक फ़ाइल या यूज़फुलवर्स .uvenc कंटेनर चुनें",
      "iterations": "PBKDF2-HMAC-SHA-256 पुनरावृत्तियाँ",
      "iterationsValue": "600,000 (निश्चित)",
      "accuracyNote": "स्थानीय-ब्राउज़र उपकरण, सुरक्षा ऑडिट या मैलवेयर, समझौता किए गए उपकरणों या कमजोर पासफ़्रेज़ के विरुद्ध गारंटी नहीं। ब्राउज़र मेमोरी को बाध्य करने के लिए टेक्स्ट 1 MiB तक सीमित है और फ़ाइलें 16 MiB तक सीमित हैं। पासफ़्रेज़ खोने से डिक्रिप्शन असंभव हो जाता है। एन्क्रिप्टेड फ़ाइल पर भरोसा करने से पहले एक अलग बैकअप रखें और डिक्रिप्शन का परीक्षण करें।",
      "resultHeading": "नतीजा",
      "resultText": "एन्क्रिप्टेड लिफाफा या डिक्रिप्टेड पाठ",
      "fileResult": "एन्क्रिप्टेड या डिक्रिप्टेड फ़ाइल",
      "fileNameNote": "मूल फ़ाइल नाम और सामग्री प्रकार एन्क्रिप्टेड फ़ाइल हेडर में संग्रहीत हैं।"
    },
    "actions": {
      "process": "एन्क्रिप्ट करें",
      "example": "पाठ उदाहरण लोड करें",
      "copy": "परिणाम कॉपी करें",
      "download": "परिणाम डाउनलोड करें",
      "result": "एन्क्रिप्शन परिणाम"
    },
    "messages": {
      "encrypted": "एन्क्रिप्शन पूर्ण. परिणाम सहेजें और अपना पासफ़्रेज़ सुरक्षित रखें।",
      "decrypted": "प्रमाणीकरण पारित हुआ. डिक्रिप्शन पूर्ण.",
      "working": "इस ब्राउज़र में स्थानीय रूप से प्रसंस्करण हो रहा है। कुछ उपकरणों पर इसमें कुछ समय लग सकता है।",
      "checkInputs": "कार्रवाई, सामग्री प्रकार, पासफ़्रेज़ और इनपुट की जाँच करें।",
      "wrongOrDamaged": "डिक्रिप्शन विफल: पासफ़्रेज़ ग़लत हो सकता है या एन्क्रिप्टेड डेटा बदल गया होगा।",
      "unsupportedCrypto": "सुरक्षित वेब क्रिप्टो उपलब्ध नहीं है. HTTPS पर समर्थित ब्राउज़र का उपयोग करें।",
      "fileTooLarge": "चयनित सामग्री इस टूल की स्थानीय आकार सीमा से अधिक है।",
      "copied": "परिणाम कॉपी किया गया.",
      "copyUnavailable": "इस ब्राउज़र में प्रतिलिपि उपलब्ध नहीं है.",
      "downloaded": "डाउनलोड तैयार है."
    },
    "additionalFaqs": [
      {
        "question": "यदि मैं पासफ़्रेज़ भूल जाऊं तो क्या मैं फ़ाइल पुनर्प्राप्त कर सकता हूँ?",
        "answer": "नहीं, कोई खाता, पुनर्प्राप्ति कुंजी या रीसेट सेवा नहीं है। पासफ़्रेज़ को अलग रखें और मूल को हटाने या बदलने से पहले एक परीक्षण डिक्रिप्शन सत्यापित करें।"
      },
      {
        "question": "गलत पासफ़्रेज़ त्रुटि क्यों दिखाता है?",
        "answer": "एईएस-जीसीएम सिफरटेक्स्ट को प्रमाणित करता है। यदि पासफ़्रेज़ गलत है या डेटा बदल दिया गया है, तो प्रमाणीकरण विफल हो जाता है और उपकरण कोई सादा पाठ नहीं लौटाता है।"
      },
      {
        "question": "क्या यह एक ऑडिटेड या गारंटीशुदा सुरक्षित प्रणाली है?",
        "answer": "नहीं, यह ब्राउज़र वेब क्रिप्टो एपीआई का उपयोग करता है, लेकिन यह पेज एक स्वतंत्र ऑडिट या मैलवेयर, असुरक्षित एक्सटेंशन, कमजोर पासफ़्रेज़, समझौता किए गए डिवाइस या खोए हुए बैकअप के खिलाफ गारंटी नहीं है।"
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "ar": {
    "copyLanguage": "ar",
    "name": "أداة تشفير AES",
    "title": "أداة تشفير AES | UsefulVerse",
    "description": "قم بتشفير أو فك تشفير النصوص والملفات الصغيرة محليًا باستخدام AES-256-GCM. لا توجد واجهة برمجة تطبيقات للتحميل أو الحساب أو التشفير.",
    "intro": "قم بتشفير النص أو الملفات في هذا المتصفح، أو فك تشفير حاوية تم إنشاؤها بواسطة هذه الأداة. ترفض AES-GCM المصادق عليها عبارة مرور خاطئة أو بيانات معدلة بدلاً من إرجاع نص عادي لم يتم التحقق منه.",
    "howQuestion": "كيف تعمل أداة التشفير AES هذه؟",
    "howAnswer": "فهو يستمد مفتاح 256 بت من عبارة المرور الخاصة بك باستخدام PBKDF2-HMAC-SHA-256، ثم يستخدم AES-256-GCM مع ملح عشوائي جديد وnonce. يقوم مغلف النص أو حاوية الملف الثنائي بتخزين معلمات الخوارزمية والنص المشفر فقط، وليس عبارة المرور أبدًا.",
    "privacyQuestion": "هل تم تحميل عبارة المرور أو الملفات الخاصة بي؟",
    "privacyAnswer": "لا، يقوم Web Crypto بتنفيذ العمل في هذا المتصفح. لا ترسل الصفحة عبارة المرور أو النص العادي أو البيانات المشفرة أو الملف المحدد إلى خادم المعالجة. تظل ملحقات المتصفح أو الجهاز المخترق خارج سيطرة هذه الأداة.",
    "fields": {
      "mode": "العمل",
      "encryptMode": "تشفير",
      "decryptMode": "فك التشفير",
      "dataMode": "نوع المحتوى",
      "textMode": "نص",
      "fileMode": "ملف",
      "password": "عبارة المرور",
      "passwordHint": "استخدم عبارة مرور طويلة وفريدة من نوعها (يفضل أن تكون 16 حرفًا أو أكثر). لا يتم حفظه أو استرداده.",
      "sourceText": "نص أو مغلف JSON مشفر",
      "sourceFile": "اختر ملفًا أو حاوية UsefulVerse .uvenc",
      "iterations": "التكرارات PBKDF2-HMAC-SHA-256",
      "iterationsValue": "600,000 (ثابت)",
      "accuracyNote": "أداة متصفح محلي، وليست تدقيقًا أمنيًا أو ضمانًا ضد البرامج الضارة أو الأجهزة المخترقة أو عبارات المرور الضعيفة. يقتصر النص على 1 ميجا بايت والملفات تصل إلى 16 ميجا بايت لربط ذاكرة المتصفح. فقدان عبارة المرور يجعل فك التشفير مستحيلاً. احتفظ بنسخة احتياطية منفصلة واختبر فك التشفير قبل الاعتماد على ملف مشفر.",
      "resultHeading": "النتيجة",
      "resultText": "مظروف مشفر أو نص تم فك تشفيره",
      "fileResult": "ملف مشفر أو فك تشفيره",
      "fileNameNote": "يتم تخزين اسم الملف الأصلي ونوع المحتوى في رأس الملف المشفر."
    },
    "actions": {
      "process": "تشفير",
      "example": "تحميل مثال النص",
      "copy": "نسخ النتيجة",
      "download": "تنزيل النتيجة",
      "result": "نتيجة التشفير"
    },
    "messages": {
      "encrypted": "اكتمل التشفير. احفظ النتيجة وحافظ على عبارة المرور الخاصة بك آمنة.",
      "decrypted": "مرت المصادقة. اكتمال فك التشفير.",
      "working": "المعالجة محليًا في هذا المتصفح. قد يستغرق هذا بعض الوقت على بعض الأجهزة.",
      "checkInputs": "تحقق من الإجراء ونوع المحتوى وعبارة المرور والإدخال.",
      "wrongOrDamaged": "فشل فك التشفير: قد تكون عبارة المرور خاطئة أو ربما تكون البيانات المشفرة قد تغيرت.",
      "unsupportedCrypto": "تشفير الويب الآمن غير متوفر. استخدم متصفحًا مدعومًا عبر HTTPS.",
      "fileTooLarge": "يتجاوز المحتوى المحدد الحد الأقصى للحجم المحلي لهذه الأداة.",
      "copied": "تم نسخ النتيجة.",
      "copyUnavailable": "النسخة غير متوفرة في هذا المتصفح.",
      "downloaded": "تحميل جاهز."
    },
    "additionalFaqs": [
      {
        "question": "هل يمكنني استعادة ملف إذا نسيت عبارة المرور؟",
        "answer": "لا، لا يوجد حساب أو مفتاح استرداد أو خدمة إعادة تعيين. احتفظ بعبارة المرور بشكل منفصل وتحقق من فك التشفير الاختباري قبل حذف النسخة الأصلية أو استبدالها."
      },
      {
        "question": "لماذا تظهر عبارة المرور الخاطئة خطأ؟",
        "answer": "يقوم AES-GCM بتوثيق النص المشفر. إذا كانت عبارة المرور خاطئة أو تم تغيير البيانات، فستفشل المصادقة ولن تقوم الأداة بإرجاع أي نص عادي."
      },
      {
        "question": "هل هذا نظام آمن مدقق أم مضمون؟",
        "answer": "لا، إنها تستخدم واجهة برمجة تطبيقات Web Crypto للمتصفح، لكن هذه الصفحة ليست تدقيقًا مستقلاً أو ضمانًا ضد البرامج الضارة أو الامتدادات غير الآمنة أو عبارات المرور الضعيفة أو الأجهزة المخترقة أو النسخ الاحتياطية المفقودة."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "zh": {
    "copyLanguage": "zh",
    "name": "AES加密工具",
    "title": "AES | UsefulVerse",
    "description": "使用 AES-256-GCM 在本地加密或解密文本和小文件。没有上传、帐户或加密 API。",
    "intro": "加密此浏览器中的文本或文件，或解密此工具创建的容器。经过身份验证的 AES-GCM 会拒绝错误的密码或更改的数据，而不是返回未经验证的明文。",
    "howQuestion": "这个 AES 加密工具如何工作？",
    "howAnswer": "它使用 PBKDF2-HMAC-SHA-256 从您的密码中派生出 256 位密钥，然后使用 AES-256-GCM 以及新的随机盐和随机数。文本信封或二进制文件容器仅存储算法参数和密文，而不存储密码。",
    "privacyQuestion": "我的密码或文件是否已上传？",
    "privacyAnswer": "不会。Web Crypto 在此浏览器中执行工作。该页面不会将您的密码、纯文本、加密数据或所选文件发送到处理服务器。浏览器扩展或受感染的设备仍不受该工具的控制。",
    "fields": {
      "mode": "行动",
      "encryptMode": "加密",
      "decryptMode": "解密",
      "dataMode": "内容类型",
      "textMode": "文字",
      "fileMode": "文件",
      "password": "密码",
      "passwordHint": "使用长而独特的密码（16 个或更多字符更好）。它无法保存或恢复。",
      "sourceText": "文本或加密的 JSON 信封",
      "sourceFile": "选择文件或 UsefulVerse .uvenc 容器",
      "iterations": "PBKDF2-HMAC-SHA-256 迭代",
      "iterationsValue": "600,000（固定）",
      "accuracyNote": "本地浏览器工具，不是针对恶意软件、受损设备或弱密码的安全审核或保证。文本大小限制为 1 MiB，文件大小限制为 16 MiB，以限制浏览器内存。丢失密码将导致解密变得不可能。在依赖加密文件之前，请保留单独的备份并测试解密。",
      "resultHeading": "结果",
      "resultText": "加密信封或解密文本",
      "fileResult": "加密或解密的文件",
      "fileNameNote": "原始文件名和内容类型存储在加密的文件头中。"
    },
    "actions": {
      "process": "加密",
      "example": "加载文本示例",
      "copy": "复制结果",
      "download": "下载结果",
      "result": "加密结果"
    },
    "messages": {
      "encrypted": "加密完成。保存结果并确保您的密码安全。",
      "decrypted": "认证通过。解密完成。",
      "working": "在此浏览器中进行本地处理。在某些设备上，这可能需要一些时间。",
      "checkInputs": "检查操作、内容类型、密码和输入。",
      "wrongOrDamaged": "解密失败：密码可能错误或加密数据可能已更改。",
      "unsupportedCrypto": "安全网络加密不可用。通过 HTTPS 使用受支持的浏览器。",
      "fileTooLarge": "所选内容超出了该工具的本地大小限制。",
      "copied": "结果已复制。",
      "copyUnavailable": "在此浏览器中复制不可用。",
      "downloaded": "下载准备好了。"
    },
    "additionalFaqs": [
      {
        "question": "如果忘记密码可以恢复文件吗？",
        "answer": "不。没有帐户、恢复密钥或重置服务。单独保存密码并在删除或替换原始密码之前验证测试解密。"
      },
      {
        "question": "为什么错误的密码会显示错误？",
        "answer": "AES-GCM 对密文进行验证。如果密码错误或数据已更改，身份验证将失败并且该工具不会返回明文。"
      },
      {
        "question": "这是经过审核或有保证的安全系统吗？",
        "answer": "不。它使用浏览器 Web Crypto API，但此页面不是独立审核或针对恶意软件、不安全扩展、弱密码、受损设备或丢失备份的保证。"
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "bn": {
    "copyLanguage": "bn",
    "name": "AES এনক্রিপশন টুল",
    "title": "AES এনক্রিপশন টুল | UsefulVerse",
    "description": "AES-256-GCM দিয়ে স্থানীয়ভাবে টেক্সট এবং ছোট ফাইল এনক্রিপ্ট বা ডিক্রিপ্ট করুন। আপলোড, অ্যাকাউন্ট বা এনক্রিপশন API নেই।",
    "intro": "এই ব্রাউজারে পাঠ্য বা ফাইল এনক্রিপ্ট করুন, অথবা এই টুল দ্বারা তৈরি একটি ধারক ডিক্রিপ্ট করুন। প্রমাণীকৃত AES-GCM অসমাপ্ত প্লেইনটেক্সট ফেরত দেওয়ার পরিবর্তে একটি ভুল পাসফ্রেজ বা পরিবর্তিত ডেটা প্রত্যাখ্যান করে।",
    "howQuestion": "এই AES এনক্রিপশন টুল কিভাবে কাজ করে?",
    "howAnswer": "এটি PBKDF2-HMAC-SHA-256-এর সাথে আপনার পাসফ্রেজ থেকে একটি 256-বিট কী প্রাপ্ত করে, তারপর একটি নতুন এলোমেলো লবণ এবং ননস সহ AES-256-GCM ব্যবহার করে। টেক্সট এনভেলপ বা বাইনারি ফাইল কন্টেইনার শুধুমাত্র অ্যালগরিদম প্যারামিটার এবং সাইফারটেক্সট সঞ্চয় করে, পাসফ্রেজ নয়।",
    "privacyQuestion": "আমার পাসফ্রেজ বা ফাইল আপলোড করা হয়?",
    "privacyAnswer": "না। ওয়েব ক্রিপ্টো এই ব্রাউজারে কাজ করে। পৃষ্ঠাটি আপনার পাসফ্রেজ, প্লেইনটেক্সট, এনক্রিপ্ট করা ডেটা বা নির্বাচিত ফাইল একটি প্রসেসিং সার্ভারে পাঠায় না। ব্রাউজার এক্সটেনশন বা একটি আপস করা ডিভাইস এই টুলের নিয়ন্ত্রণের বাইরে থাকে।",
    "fields": {
      "mode": "অ্যাকশন",
      "encryptMode": "এনক্রিপ্ট করুন",
      "decryptMode": "ডিক্রিপ্ট করুন",
      "dataMode": "বিষয়বস্তুর প্রকার",
      "textMode": "পাঠ্য",
      "fileMode": "ফাইল",
      "password": "পাসফ্রেজ",
      "passwordHint": "একটি দীর্ঘ, অনন্য পাসফ্রেজ ব্যবহার করুন (16 বা তার বেশি অক্ষর ভাল)। এটি সংরক্ষিত বা পুনরুদ্ধারযোগ্য নয়।",
      "sourceText": "পাঠ্য বা এনক্রিপ্ট করা JSON খাম",
      "sourceFile": "একটি ফাইল বা UsefulVerse .uvenc কন্টেইনার বেছে নিন",
      "iterations": "PBKDF2-HMAC-SHA-256 পুনরাবৃত্তি",
      "iterationsValue": "600,000 (স্থির)",
      "accuracyNote": "স্থানীয়-ব্রাউজার টুল, নিরাপত্তা নিরীক্ষা বা ম্যালওয়্যার, আপস করা ডিভাইস বা দুর্বল পাসফ্রেজের বিরুদ্ধে গ্যারান্টি নয়। আবদ্ধ ব্রাউজার মেমরিতে পাঠ্য 1 MiB এবং ফাইলগুলি 16 MiB-তে সীমাবদ্ধ। পাসফ্রেজ হারানো ডিক্রিপশনকে অসম্ভব করে তোলে। একটি এনক্রিপ্ট করা ফাইলের উপর নির্ভর করার আগে একটি পৃথক ব্যাকআপ এবং পরীক্ষা ডিক্রিপশন রাখুন।",
      "resultHeading": "ফলাফল",
      "resultText": "এনক্রিপ্ট করা খাম বা ডিক্রিপ্ট করা পাঠ্য",
      "fileResult": "এনক্রিপ্ট করা বা ডিক্রিপ্ট করা ফাইল",
      "fileNameNote": "মূল ফাইলের নাম এবং বিষয়বস্তুর ধরন এনক্রিপ্ট করা ফাইল হেডারে সংরক্ষণ করা হয়।"
    },
    "actions": {
      "process": "এনক্রিপ্ট করুন",
      "example": "টেক্সট উদাহরণ লোড",
      "copy": "ফলাফল কপি করুন",
      "download": "ফলাফল ডাউনলোড করুন",
      "result": "এনক্রিপশন ফলাফল"
    },
    "messages": {
      "encrypted": "এনক্রিপশন সম্পূর্ণ। ফলাফল সংরক্ষণ করুন এবং আপনার পাসফ্রেজ নিরাপদ রাখুন।",
      "decrypted": "প্রমাণীকরণ পাস. ডিক্রিপশন সম্পূর্ণ।",
      "working": "এই ব্রাউজারে স্থানীয়ভাবে প্রক্রিয়া করা হচ্ছে। কিছু ডিভাইসে এটি কিছুটা সময় নিতে পারে।",
      "checkInputs": "কর্ম, বিষয়বস্তুর ধরন, পাসফ্রেজ এবং ইনপুট পরীক্ষা করুন।",
      "wrongOrDamaged": "ডিক্রিপশন ব্যর্থ হয়েছে: পাসফ্রেজ ভুল হতে পারে বা এনক্রিপ্ট করা ডেটা পরিবর্তিত হতে পারে।",
      "unsupportedCrypto": "নিরাপদ ওয়েব ক্রিপ্টো অনুপলব্ধ৷ HTTPS-এ একটি সমর্থিত ব্রাউজার ব্যবহার করুন।",
      "fileTooLarge": "নির্বাচিত বিষয়বস্তু এই টুলের স্থানীয় আকারের সীমা অতিক্রম করেছে।",
      "copied": "ফলাফল কপি করা হয়েছে।",
      "copyUnavailable": "অনুলিপি এই ব্রাউজারে অনুপলব্ধ.",
      "downloaded": "ডাউনলোড রেডি।"
    },
    "additionalFaqs": [
      {
        "question": "আমি পাসফ্রেজ ভুলে গেলে কি আমি একটি ফাইল পুনরুদ্ধার করতে পারি?",
        "answer": "না। কোনো অ্যাকাউন্ট, রিকভারি কী বা রিসেট পরিষেবা নেই। পাসফ্রেজটি আলাদাভাবে রাখুন এবং আসলটি মুছে ফেলা বা প্রতিস্থাপন করার আগে একটি পরীক্ষা ডিক্রিপশন যাচাই করুন।"
      },
      {
        "question": "কেন একটি ভুল পাসফ্রেজ একটি ত্রুটি দেখায়?",
        "answer": "AES-GCM সাইফারটেক্সটকে প্রমাণীকরণ করে। পাসফ্রেজ ভুল হলে বা ডেটা পরিবর্তন করা হলে, প্রমাণীকরণ ব্যর্থ হয় এবং টুলটি কোনো প্লেইনটেক্সট প্রদান করে না।"
      },
      {
        "question": "এটি কি একটি নিরীক্ষিত বা গ্যারান্টিযুক্ত সুরক্ষিত সিস্টেম?",
        "answer": "না। এটি ব্রাউজার ওয়েব ক্রিপ্টো API ব্যবহার করে, কিন্তু এই পৃষ্ঠাটি একটি স্বাধীন নিরীক্ষা বা ম্যালওয়্যার, অনিরাপদ এক্সটেনশন, দুর্বল পাসফ্রেজ, আপস করা ডিভাইস বা হারিয়ে যাওয়া ব্যাকআপগুলির বিরুদ্ধে গ্যারান্টি নয়।"
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "ru": {
    "copyLanguage": "ru",
    "name": "Инструмент шифрования AES",
    "title": "Бесплатный инструмент шифрования | UsefulVerse",
    "description": "Шифрование или дешифрование текста и небольших файлов локально с помощью AES-256-GCM. Нет загрузки, учетной записи или API шифрования.",
    "intro": "Зашифруйте текст или файлы в этом браузере или расшифруйте контейнер, созданный с помощью этого инструмента. Аутентифицированный AES-GCM отклоняет неверную парольную фразу или измененные данные вместо возврата непроверенного открытого текста.",
    "howQuestion": "Как работает этот инструмент шифрования AES?",
    "howAnswer": "Он получает 256-битный ключ из вашей парольной фразы с помощью PBKDF2-HMAC-SHA-256, затем использует AES-256-GCM с новой случайной солью и одноразовым номером. В текстовом конверте или контейнере двоичных файлов хранятся только параметры алгоритма и зашифрованный текст, но не парольная фраза.",
    "privacyQuestion": "Загружена ли моя парольная фраза или файлы?",
    "privacyAnswer": "Нет. Web Crypto выполняет всю работу в этом браузере. Страница не отправляет вашу парольную фразу, открытый текст, зашифрованные данные или выбранный файл на сервер обработки. Расширения браузера или взломанное устройство остаются вне контроля этого инструмента.",
    "fields": {
      "mode": "Действие",
      "encryptMode": "Шифровать",
      "decryptMode": "Расшифровать",
      "dataMode": "Тип контента",
      "textMode": "Текст",
      "fileMode": "Файл",
      "password": "Парольная фраза",
      "passwordHint": "Используйте длинную уникальную фразу-пароль (лучше 16 или более символов). Он не сохраняется и не подлежит восстановлению.",
      "sourceText": "Текстовый или зашифрованный конверт JSON.",
      "sourceFile": "Выберите файл или контейнер UsefulVerse .uvenc.",
      "iterations": "PBKDF2-HMAC-SHA-256 итераций",
      "iterationsValue": "600 000 (фиксировано)",
      "accuracyNote": "Инструмент локального браузера, а не аудит безопасности или гарантия от вредоносного ПО, взломанных устройств или слабых парольных фраз. Текст ограничен 1 МБ, а файлы — 16 МБ для использования в памяти браузера. Потеря парольной фразы делает расшифровку невозможной. Сохраните отдельную резервную копию и проверьте расшифровку, прежде чем полагаться на зашифрованный файл.",
      "resultHeading": "Результат",
      "resultText": "Зашифрованный конверт или расшифрованный текст",
      "fileResult": "Зашифрованный или расшифрованный файл",
      "fileNameNote": "Исходное имя файла и тип содержимого хранятся в зашифрованном заголовке файла."
    },
    "actions": {
      "process": "Шифровать",
      "example": "Загрузить пример текста",
      "copy": "Копировать результат",
      "download": "Скачать результат",
      "result": "Результат шифрования"
    },
    "messages": {
      "encrypted": "Шифрование завершено. Сохраните результат и сохраните парольную фразу.",
      "decrypted": "Аутентификация пройдена. Расшифровка завершена.",
      "working": "Обработка локально в этом браузере. На некоторых устройствах это может занять некоторое время.",
      "checkInputs": "Проверьте действие, тип контента, парольную фразу и ввод.",
      "wrongOrDamaged": "Расшифровка не удалась: возможно, парольная фраза неверна или зашифрованные данные изменились.",
      "unsupportedCrypto": "Безопасное веб-шифрование недоступно. Используйте поддерживаемый браузер через HTTPS.",
      "fileTooLarge": "Выбранный контент превышает локальный предел размера этого инструмента.",
      "copied": "Результат скопирован.",
      "copyUnavailable": "Копирование недоступно в этом браузере.",
      "downloaded": "Скачать готово."
    },
    "additionalFaqs": [
      {
        "question": "Могу ли я восстановить файл, если забуду парольную фразу?",
        "answer": "Нет. Нет учетной записи, ключа восстановления или службы сброса. Сохраните парольную фразу отдельно и проверьте тестовую расшифровку перед удалением или заменой оригинала."
      },
      {
        "question": "Почему неправильный пароль показывает ошибку?",
        "answer": "AES-GCM проверяет подлинность зашифрованного текста. Если парольная фраза неверна или данные были изменены, аутентификация завершается неудачно, и инструмент не возвращает открытый текст."
      },
      {
        "question": "Это проверенная или гарантированно безопасная система?",
        "answer": "Нет. Он использует API Web Crypto API браузера, но эта страница не является независимым аудитом или гарантией от вредоносного ПО, небезопасных расширений, слабых парольных фраз, взломанных устройств или потери резервных копий."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "ur": {
    "copyLanguage": "ur",
    "name": "AES انکرپشن ٹول",
    "title": "AES انکرپشن ٹول | UsefulVerse",
    "description": "AES-256-GCM کے ساتھ مقامی طور پر ٹیکسٹ اور چھوٹی فائلوں کو انکرپٹ یا ڈکرپٹ کریں۔ کوئی اپ لوڈ، اکاؤنٹ یا انکرپشن API نہیں ہے۔",
    "intro": "اس براؤزر میں متن یا فائلوں کو انکرپٹ کریں، یا اس ٹول کے ذریعے بنائے گئے کنٹینر کو ڈکرپٹ کریں۔ تصدیق شدہ AES-GCM غیر تصدیق شدہ سادہ متن واپس کرنے کے بجائے غلط پاسفریز یا تبدیل شدہ ڈیٹا کو مسترد کرتا ہے۔",
    "howQuestion": "یہ AES انکرپشن ٹول کیسے کام کرتا ہے؟",
    "howAnswer": "یہ PBKDF2-HMAC-SHA-256 کے ساتھ آپ کے پاس فریز سے ایک 256 بٹ کلید اخذ کرتا ہے، پھر AES-256-GCM کو نئے بے ترتیب نمک کے ساتھ استعمال کرتا ہے۔ ٹیکسٹ لفافہ یا بائنری فائل کنٹینر صرف الگورتھم کے پیرامیٹرز اور سائفر ٹیکسٹ کو اسٹور کرتا ہے، پاسفریز کبھی نہیں۔",
    "privacyQuestion": "کیا میرا پاسفریز یا فائلیں اپ لوڈ کی گئی ہیں؟",
    "privacyAnswer": "نمبر ویب کریپٹو اس براؤزر میں کام انجام دیتا ہے۔ صفحہ آپ کے پاس فریز، سادہ متن، خفیہ کردہ ڈیٹا یا منتخب فائل کو پروسیسنگ سرور کو نہیں بھیجتا ہے۔ براؤزر ایکسٹینشنز یا سمجھوتہ کرنے والا آلہ اس ٹول کے کنٹرول سے باہر رہتا ہے۔",
    "fields": {
      "mode": "ایکشن",
      "encryptMode": "خفیہ کاری",
      "decryptMode": "ڈکرپٹ",
      "dataMode": "مواد کی قسم",
      "textMode": "متن",
      "fileMode": "فائل",
      "password": "پاس فریز",
      "passwordHint": "ایک لمبا، منفرد پاسفریز استعمال کریں (16 یا اس سے زیادہ حروف بہتر ہے)۔ یہ محفوظ یا قابل بازیافت نہیں ہے۔",
      "sourceText": "متن یا خفیہ کردہ JSON لفافہ",
      "sourceFile": "ایک فائل یا UsefulVerse .uvenc کنٹینر کا انتخاب کریں۔",
      "iterations": "PBKDF2-HMAC-SHA-256 تکرار",
      "iterationsValue": "600,000 (مقررہ)",
      "accuracyNote": "مقامی براؤزر ٹول، سیکیورٹی آڈٹ یا مالویئر، سمجھوتہ شدہ آلات یا کمزور پاسفریز کے خلاف گارنٹی نہیں۔ متن 1 MiB تک محدود ہے اور براؤزر میموری کو پابند کرنے کے لیے فائلیں 16 MiB تک محدود ہیں۔ پاس فریز کو کھونا ڈکرپشن کو ناممکن بنا دیتا ہے۔ انکرپٹڈ فائل پر انحصار کرنے سے پہلے علیحدہ بیک اپ اور ٹیسٹ ڈکرپشن رکھیں۔",
      "resultHeading": "نتیجہ",
      "resultText": "خفیہ کردہ لفافہ یا خفیہ کردہ متن",
      "fileResult": "انکرپٹڈ یا ڈکرپٹڈ فائل",
      "fileNameNote": "اصل فائل کا نام اور مواد کی قسم کو انکرپٹڈ فائل ہیڈر میں محفوظ کیا جاتا ہے۔"
    },
    "actions": {
      "process": "خفیہ کاری",
      "example": "متن کی مثال لوڈ کریں۔",
      "copy": "نتیجہ کاپی کریں۔",
      "download": "نتیجہ ڈاؤن لوڈ کریں۔",
      "result": "خفیہ کاری کا نتیجہ"
    },
    "messages": {
      "encrypted": "خفیہ کاری مکمل۔ نتیجہ محفوظ کریں اور اپنے پاس فریز کو محفوظ رکھیں۔",
      "decrypted": "توثیق گزر گئی۔ ڈکرپشن مکمل۔",
      "working": "اس براؤزر میں مقامی طور پر کارروائی ہو رہی ہے۔ کچھ آلات پر اس میں کچھ وقت لگ سکتا ہے۔",
      "checkInputs": "عمل، مواد کی قسم، پاس فریز اور ان پٹ چیک کریں۔",
      "wrongOrDamaged": "خفیہ کاری ناکام ہو سکتی ہے: پاس فریز غلط ہو سکتا ہے یا خفیہ کردہ ڈیٹا تبدیل ہو سکتا ہے۔",
      "unsupportedCrypto": "سیکیور ویب کریپٹو دستیاب نہیں ہے۔ HTTPS پر تعاون یافتہ براؤزر استعمال کریں۔",
      "fileTooLarge": "منتخب کردہ مواد اس ٹول کی مقامی سائز کی حد سے زیادہ ہے۔",
      "copied": "نتیجہ کاپی ہو گیا۔",
      "copyUnavailable": "اس براؤزر میں کاپی دستیاب نہیں ہے۔",
      "downloaded": "ڈاؤن لوڈ تیار ہے۔"
    },
    "additionalFaqs": [
      {
        "question": "اگر میں پاس فریز بھول جاؤں تو کیا میں فائل بازیافت کر سکتا ہوں؟",
        "answer": "نہیں، کوئی اکاؤنٹ، ریکوری کلید یا ری سیٹ سروس نہیں ہے۔ پاس فریز کو الگ سے رکھیں اور اصل کو حذف کرنے یا تبدیل کرنے سے پہلے ایک ٹیسٹ ڈکرپشن کی تصدیق کریں۔"
      },
      {
        "question": "غلط پاسفریز غلطی کیوں ظاہر کرتا ہے؟",
        "answer": "AES-GCM سائفر ٹیکسٹ کی تصدیق کرتا ہے۔ اگر پاس فریز غلط ہے یا ڈیٹا تبدیل کر دیا گیا ہے، تو تصدیق ناکام ہو جاتی ہے اور ٹول کوئی سادہ متن نہیں دیتا۔"
      },
      {
        "question": "کیا یہ ایک آڈٹ شدہ یا ضمانت یافتہ محفوظ نظام ہے؟",
        "answer": "نہیں، یہ براؤزر ویب کریپٹو API کا استعمال کرتا ہے، لیکن یہ صفحہ ایک آزاد آڈٹ یا مالویئر، غیر محفوظ ایکسٹینشنز، کمزور پاسفریز، سمجھوتہ شدہ آلات یا کھوئے ہوئے بیک اپ کے خلاف ضمانت نہیں ہے۔"
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "tr": {
    "copyLanguage": "tr",
    "name": "AES şifreleme aracı",
    "title": "AES Şifreleme Aracı | UsefulVerse",
    "description": "AES-256-GCM ile metinleri ve küçük dosyaları yerel olarak şifreleyin veya şifresini çözün. Yükleme, hesap veya şifreleme API'si yok.",
    "intro": "Bu tarayıcıdaki metni veya dosyaları şifreleyin veya bu araç tarafından oluşturulan bir kapsayıcının şifresini çözün. Kimliği doğrulanmış AES-GCM, doğrulanmamış düz metin döndürmek yerine yanlış bir parolayı veya değiştirilmiş verileri reddeder.",
    "howQuestion": "Bu AES şifreleme aracı nasıl çalışır?",
    "howAnswer": "PBKDF2-HMAC-SHA-256 ile parolanızdan 256 bitlik bir anahtar türetir, ardından yeni bir rastgele tuz ve nonce ile AES-256-GCM'yi kullanır. Metin zarfı veya ikili dosya kabı yalnızca algoritma parametrelerini ve şifreli metni saklar, parolayı asla saklamaz.",
    "privacyQuestion": "Parolam veya dosyalarım yüklendi mi?",
    "privacyAnswer": "Hayır. Web Crypto işi bu tarayıcıda gerçekleştirir. Sayfa, parolanızı, düz metninizi, şifrelenmiş verilerinizi veya seçilen dosyanızı bir işlem sunucusuna göndermez. Tarayıcı uzantıları veya güvenliği ihlal edilmiş bir cihaz bu aracın kontrolü dışında kalır.",
    "fields": {
      "mode": "Eylem",
      "encryptMode": "Şifrele",
      "decryptMode": "Şifreyi çöz",
      "dataMode": "İçerik türü",
      "textMode": "Metin",
      "fileMode": "Dosya",
      "password": "Parola",
      "passwordHint": "Uzun, benzersiz bir parola kullanın (16 veya daha fazla karakter daha iyidir). Kaydedilemez veya kurtarılamaz.",
      "sourceText": "Metin veya şifrelenmiş JSON zarfı",
      "sourceFile": "Bir dosya veya UsefulVerse .uvenc kapsayıcısı seçin",
      "iterations": "PBKDF2-HMAC-SHA-256 yinelemeleri",
      "iterationsValue": "600.000 (sabit)",
      "accuracyNote": "Yerel tarayıcı aracı; kötü amaçlı yazılımlara, güvenliği ihlal edilmiş cihazlara veya zayıf parolalara karşı bir güvenlik denetimi veya garantisi değildir. Metin 1 MiB ile sınırlıdır ve tarayıcı belleğine bağlı dosyalar 16 MiB ile sınırlıdır. Parolayı kaybetmek şifre çözmeyi imkansız hale getirir. Şifrelenmiş bir dosyaya güvenmeden önce ayrı bir yedekleme tutun ve şifre çözmeyi test edin.",
      "resultHeading": "Sonuç",
      "resultText": "Şifrelenmiş zarf veya şifresi çözülmüş metin",
      "fileResult": "Şifrelenmiş veya şifresi çözülmüş dosya",
      "fileNameNote": "Orijinal dosya adı ve içerik türü şifrelenmiş dosya başlığında saklanır."
    },
    "actions": {
      "process": "Şifrele",
      "example": "Metin örneği yükle",
      "copy": "Sonucu kopyala",
      "download": "Sonucu indir",
      "result": "Şifreleme sonucu"
    },
    "messages": {
      "encrypted": "Şifreleme tamamlandı. Sonucu kaydedin ve parolanızı güvende tutun.",
      "decrypted": "Kimlik doğrulama başarılı oldu. Şifre çözme tamamlandı.",
      "working": "Bu tarayıcıda yerel olarak işleniyor. Bu işlem bazı cihazlarda biraz zaman alabilir.",
      "checkInputs": "Eylemi, içerik türünü, parolayı ve girişi kontrol edin.",
      "wrongOrDamaged": "Şifre çözme başarısız oldu: parola yanlış olabilir veya şifrelenmiş veriler değişmiş olabilir.",
      "unsupportedCrypto": "Güvenli Web Kriptolaması kullanılamıyor. HTTPS üzerinden desteklenen bir tarayıcı kullanın.",
      "fileTooLarge": "Seçilen içerik bu aracın yerel boyut sınırını aşıyor.",
      "copied": "Sonuç kopyalandı.",
      "copyUnavailable": "Kopyalama bu tarayıcıda kullanılamıyor.",
      "downloaded": "İndirin hazır."
    },
    "additionalFaqs": [
      {
        "question": "Parolayı unutursam bir dosyayı kurtarabilir miyim?",
        "answer": "Hayır. Hesap, kurtarma anahtarı veya sıfırlama hizmeti yoktur. Parolayı ayrı tutun ve orijinali silmeden veya değiştirmeden önce şifre çözme testini doğrulayın."
      },
      {
        "question": "Yanlış bir parola neden hata gösteriyor?",
        "answer": "AES-GCM şifreli metnin kimliğini doğrular. Parola yanlışsa veya veriler değiştirilmişse kimlik doğrulama başarısız olur ve araç düz metin döndürmez."
      },
      {
        "question": "Bu denetlenmiş veya garantili güvenli bir sistem mi?",
        "answer": "Hayır. Tarayıcının Web Crypto API'sini kullanır, ancak bu sayfa bağımsız bir denetim veya kötü amaçlı yazılımlara, güvenli olmayan uzantılara, zayıf parolalara, güvenliği ihlal edilmiş cihazlara veya kayıp yedeklemelere karşı bir garanti değildir."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "vi": {
    "copyLanguage": "vi",
    "name": "Công cụ mã hóa AES",
    "title": "Công cụ mã hóa AES miễn | UsefulVerse",
    "description": "Mã hóa hoặc giải mã cục bộ văn bản và các tệp nhỏ bằng AES-256-GCM. Không có API tải lên, tài khoản hoặc mã hóa.",
    "intro": "Mã hóa văn bản hoặc tệp trong trình duyệt này hoặc giải mã vùng chứa được tạo bởi công cụ này. AES-GCM được xác thực từ chối cụm mật khẩu sai hoặc dữ liệu bị thay đổi thay vì trả về văn bản gốc chưa được xác minh.",
    "howQuestion": "Công cụ mã hóa AES này hoạt động như thế nào?",
    "howAnswer": "Nó lấy khóa 256 bit từ cụm mật khẩu của bạn bằng PBKDF2-HMAC-SHA-256, sau đó sử dụng AES-256-GCM với muối và nonce ngẫu nhiên mới. Phong bì văn bản hoặc vùng chứa tệp nhị phân chỉ lưu trữ các tham số thuật toán và văn bản mã hóa, không bao giờ lưu trữ cụm mật khẩu.",
    "privacyQuestion": "Cụm mật khẩu hoặc tập tin của tôi có được tải lên không?",
    "privacyAnswer": "Không. Web Crypto thực hiện công việc trong trình duyệt này. Trang này không gửi cụm mật khẩu, văn bản gốc, dữ liệu được mã hóa hoặc tệp đã chọn của bạn đến máy chủ xử lý. Tiện ích mở rộng của trình duyệt hoặc thiết bị bị xâm nhập vẫn nằm ngoài tầm kiểm soát của công cụ này.",
    "fields": {
      "mode": "hành động",
      "encryptMode": "Mã hóa",
      "decryptMode": "Giải mã",
      "dataMode": "Loại nội dung",
      "textMode": "văn bản",
      "fileMode": "Tập tin",
      "password": "Cụm mật khẩu",
      "passwordHint": "Sử dụng cụm mật khẩu dài và duy nhất (16 ký tự trở lên thì tốt hơn). Nó không được lưu hoặc phục hồi.",
      "sourceText": "Phong bì văn bản hoặc JSON được mã hóa",
      "sourceFile": "Chọn một tệp hoặc vùng chứa UseVerse .uvenc",
      "iterations": "Lặp lại PBKDF2-HMAC-SHA-256",
      "iterationsValue": "600.000 (cố định)",
      "accuracyNote": "Công cụ trình duyệt cục bộ, không phải là kiểm tra bảo mật hay đảm bảo chống lại phần mềm độc hại, thiết bị bị xâm nhập hoặc cụm mật khẩu yếu. Văn bản được giới hạn ở 1 MiB và các tệp ở 16 MiB vào bộ nhớ trình duyệt bị ràng buộc. Mất cụm mật khẩu khiến việc giải mã không thể thực hiện được. Giữ một bản sao lưu riêng và kiểm tra giải mã trước khi dựa vào tệp được mã hóa.",
      "resultHeading": "kết quả",
      "resultText": "Phong bì được mã hóa hoặc văn bản được giải mã",
      "fileResult": "Tập tin được mã hóa hoặc giải mã",
      "fileNameNote": "Tên tệp gốc và loại nội dung được lưu trữ trong tiêu đề tệp được mã hóa."
    },
    "actions": {
      "process": "Mã hóa",
      "example": "Tải ví dụ văn bản",
      "copy": "Sao chép kết quả",
      "download": "Tải xuống kết quả",
      "result": "Kết quả mã hóa"
    },
    "messages": {
      "encrypted": "Mã hóa hoàn tất. Lưu kết quả và giữ cụm mật khẩu của bạn an toàn.",
      "decrypted": "Xác thực đã được thông qua. Giải mã hoàn tất.",
      "working": "Xử lý cục bộ trong trình duyệt này. Quá trình này có thể mất chút thời gian trên một số thiết bị.",
      "checkInputs": "Kiểm tra hành động, loại nội dung, cụm mật khẩu và đầu vào.",
      "wrongOrDamaged": "Giải mã không thành công: cụm mật khẩu có thể sai hoặc dữ liệu được mã hóa có thể đã thay đổi.",
      "unsupportedCrypto": "Web Crypto an toàn không khả dụng. Sử dụng trình duyệt được hỗ trợ qua HTTPS.",
      "fileTooLarge": "Nội dung đã chọn vượt quá giới hạn kích thước cục bộ của công cụ này.",
      "copied": "Đã sao chép kết quả.",
      "copyUnavailable": "Bản sao không có sẵn trong trình duyệt này.",
      "downloaded": "Tải xuống đã sẵn sàng."
    },
    "additionalFaqs": [
      {
        "question": "Tôi có thể khôi phục tập tin nếu tôi quên cụm mật khẩu không?",
        "answer": "Không. Không có tài khoản, khóa khôi phục hoặc dịch vụ đặt lại. Giữ cụm mật khẩu riêng biệt và xác minh việc giải mã thử nghiệm trước khi xóa hoặc thay thế bản gốc."
      },
      {
        "question": "Tại sao cụm mật khẩu sai lại hiển thị lỗi?",
        "answer": "AES-GCM xác thực văn bản mã hóa. Nếu cụm mật khẩu sai hoặc dữ liệu bị thay đổi, quá trình xác thực không thành công và công cụ không trả về bản rõ."
      },
      {
        "question": "Đây có phải là hệ thống an toàn đã được kiểm toán hoặc đảm bảo không?",
        "answer": "Không. Trang này sử dụng API Web Crypto của trình duyệt nhưng trang này không phải là trang kiểm tra độc lập hay đảm bảo chống lại phần mềm độc hại, tiện ích mở rộng không an toàn, cụm mật khẩu yếu, thiết bị bị xâm nhập hoặc bản sao lưu bị mất."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "it": {
    "copyLanguage": "it",
    "name": "Strumento di crittografia AES",
    "title": "Strumento di crittografia AES | UsefulVerse",
    "description": "Crittografa o decrittografa testo e piccoli file localmente con AES-256-GCM. Nessun caricamento, account o API di crittografia.",
    "intro": "Crittografa testo o file in questo browser o decrittografa un contenitore creato da questo strumento. AES-GCM autenticato rifiuta una passphrase errata o dati alterati invece di restituire testo in chiaro non verificato.",
    "howQuestion": "Come funziona questo strumento di crittografia AES?",
    "howAnswer": "Deriva una chiave a 256 bit dalla passphrase con PBKDF2-HMAC-SHA-256, quindi utilizza AES-256-GCM con un nuovo sale casuale e nonce. La busta di testo o il contenitore di file binario memorizza solo i parametri dell'algoritmo e il testo cifrato, mai la passphrase.",
    "privacyQuestion": "La mia passphrase o i miei file sono stati caricati?",
    "privacyAnswer": "No. Web Crypto esegue il lavoro in questo browser. La pagina non invia la tua passphrase, testo in chiaro, dati crittografati o file selezionato a un server di elaborazione. Le estensioni del browser o un dispositivo compromesso rimangono fuori dal controllo di questo strumento.",
    "fields": {
      "mode": "Azione",
      "encryptMode": "Crittografare",
      "decryptMode": "Decifrare",
      "dataMode": "Tipo di contenuto",
      "textMode": "Testo",
      "fileMode": "Archivio",
      "password": "Passphrase",
      "passwordHint": "Utilizza una passphrase lunga e univoca (16 o più caratteri sono migliori). Non è salvato o recuperabile.",
      "sourceText": "Busta JSON di testo o crittografata",
      "sourceFile": "Scegli un file o un contenitore UsefulVerse .uvenc",
      "iterations": "Iterazioni PBKDF2-HMAC-SHA-256",
      "iterationsValue": "600.000 (fisso)",
      "accuracyNote": "Strumento del browser locale, non un controllo di sicurezza o una garanzia contro malware, dispositivi compromessi o passphrase deboli. Il testo è limitato a 1 MiB e i file a 16 MiB per limitare la memoria del browser. La perdita della passphrase rende impossibile la decrittazione. Conserva un backup separato e verifica la decrittografia prima di fare affidamento su un file crittografato.",
      "resultHeading": "Risultato",
      "resultText": "Busta crittografata o testo decrittografato",
      "fileResult": "File crittografato o decrittografato",
      "fileNameNote": "Il nome file originale e il tipo di contenuto vengono archiviati nell'intestazione del file crittografato."
    },
    "actions": {
      "process": "Crittografare",
      "example": "Carica esempio di testo",
      "copy": "Copia risultato",
      "download": "Scarica risultato",
      "result": "Risultato della crittografia"
    },
    "messages": {
      "encrypted": "Crittografia completata. Salva il risultato e mantieni la tua passphrase al sicuro.",
      "decrypted": "Autenticazione passata. Decrittografia completata.",
      "working": "Elaborazione locale in questo browser. Questa operazione potrebbe richiedere qualche istante su alcuni dispositivi.",
      "checkInputs": "Controlla l'azione, il tipo di contenuto, la passphrase e l'input.",
      "wrongOrDamaged": "Decrittografia non riuscita: la passphrase potrebbe essere errata oppure i dati crittografati potrebbero essere cambiati.",
      "unsupportedCrypto": "La crittografia Web sicura non è disponibile. Utilizza un browser supportato su HTTPS.",
      "fileTooLarge": "Il contenuto selezionato supera il limite di dimensione locale di questo strumento.",
      "copied": "Risultato copiato.",
      "copyUnavailable": "La copia non è disponibile in questo browser.",
      "downloaded": "Scarica pronto."
    },
    "additionalFaqs": [
      {
        "question": "Posso recuperare un file se dimentico la passphrase?",
        "answer": "No. Non sono disponibili account, chiavi di ripristino o servizi di ripristino. Conserva la passphrase separatamente e verifica una decrittografia di prova prima di eliminare o sostituire l'originale."
      },
      {
        "question": "Perché una passphrase errata mostra un errore?",
        "answer": "AES-GCM autentica il testo cifrato. Se la passphrase è errata o i dati sono stati modificati, l'autenticazione fallisce e lo strumento non restituisce testo in chiaro."
      },
      {
        "question": "Si tratta di un sistema sicuro controllato o garantito?",
        "answer": "No. Utilizza l'API Web Crypto del browser, ma questa pagina non costituisce un controllo indipendente o una garanzia contro malware, estensioni non sicure, passphrase deboli, dispositivi compromessi o backup persi."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "zh_tw": {
    "copyLanguage": "zh_tw",
    "name": "AES加密工具",
    "title": "AES | UsefulVerse",
    "description": "使用 AES-256-GCM 在本地加密或解密文字和小檔案。沒有上傳、帳戶或加密 API。",
    "intro": "加密此瀏覽器中的文字或文件，或解密此工具所建立的容器。經過身份驗證的 AES-GCM 會拒絕錯誤的密碼或更改的數據，而不是傳回未經驗證的明文。",
    "howQuestion": "這個 AES 加密工具如何運作？",
    "howAnswer": "它使用 PBKDF2-HMAC-SHA-256 從您的密碼中派生出 256 位元金鑰，然後使用 AES-256-GCM 以及新的隨機鹽和隨機數。文字信封或二進位檔案容器僅儲存演算法參數和密文，而不儲存密碼。",
    "privacyQuestion": "我的密碼或檔案是否已上傳？",
    "privacyAnswer": "不會。 Web Crypto 在此瀏覽器中執行工作。該頁面不會將您的密碼、純文字、加密資料或所選檔案傳送到處理伺服器。瀏覽器擴充功能或受感染的裝置仍不受該工具的控制。",
    "fields": {
      "mode": "行動",
      "encryptMode": "加密",
      "decryptMode": "解密",
      "dataMode": "內容類型",
      "textMode": "文字",
      "fileMode": "文件",
      "password": "密碼",
      "passwordHint": "使用長而獨特的密碼（16 個或更多字元更好）。它無法保存或恢復。",
      "sourceText": "文字或加密的 JSON 信封",
      "sourceFile": "選擇檔案或 UsefulVerse .uvenc 容器",
      "iterations": "PBKDF2-HMAC-SHA-256 迭代",
      "iterationsValue": "600,000（固定）",
      "accuracyNote": "本機瀏覽器工具，不是針對惡意軟體、受損裝置或弱密碼的安全審核或保固。文字大小限制為 1 MiB，檔案大小限制為 16 MiB，以限制瀏覽器記憶體。遺失密碼將導致解密變得不可能。在依賴加密檔案之前，請保留單獨的備份並測試解密。",
      "resultHeading": "結果",
      "resultText": "加密信封或解密文字",
      "fileResult": "加密或解密的文件",
      "fileNameNote": "原始檔案名稱和內容類型儲存在加密的檔案頭中。"
    },
    "actions": {
      "process": "加密",
      "example": "載入文字範例",
      "copy": "複製結果",
      "download": "下載結果",
      "result": "加密結果"
    },
    "messages": {
      "encrypted": "加密完成。保存結果並確保您的密碼安全。",
      "decrypted": "認證通過。解密完成。",
      "working": "在此瀏覽器中進行本機處理。在某些設備上，這可能需要一些時間。",
      "checkInputs": "檢查操作、內容類型、密碼和輸入。",
      "wrongOrDamaged": "解密失敗：密碼可能錯誤或加密資料可能已變更。",
      "unsupportedCrypto": "安全網路加密不可用。透過 HTTPS 使用支援的瀏覽器。",
      "fileTooLarge": "所選內容超出了該工具的本地大小限制。",
      "copied": "結果已複製。",
      "copyUnavailable": "在此瀏覽器中複製不可用。",
      "downloaded": "下載準備好了。"
    },
    "additionalFaqs": [
      {
        "question": "如果忘記密碼可以恢復檔案嗎？",
        "answer": "不。沒有帳戶、恢復金鑰或重設服務。單獨保存密碼並在刪除或替換原始密碼之前驗證測試解密。"
      },
      {
        "question": "為什麼錯誤的密碼會顯示錯誤？",
        "answer": "AES-GCM 對密文進行驗證。如果密碼錯誤或資料已更改，身份驗證將失敗且該工具不會傳回明文。"
      },
      {
        "question": "這是經過審核或有保證的安全系統嗎？",
        "answer": "不。它使用瀏覽器 Web Crypto API，但此頁面不是獨立審核或針對惡意軟體、不安全擴充、弱密碼、受損裝置或遺失備份的保證。"
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "bg": {
    "copyLanguage": "bg",
    "name": "AES инструмент за криптиране",
    "title": "Безплатен инструмент за криптиране | UsefulVerse",
    "description": "Шифровайте или декриптирайте текст и малки файлове локално с AES-256-GCM. Няма API за качване, акаунт или криптиране.",
    "intro": "Шифровайте текст или файлове в този браузър или дешифрирайте контейнер, направен от този инструмент. Удостовереният AES-GCM отхвърля грешна парола или променени данни, вместо да върне непроверен обикновен текст.",
    "howQuestion": "Как работи този инструмент за AES криптиране?",
    "howAnswer": "Той извлича 256-битов ключ от вашата парола с PBKDF2-HMAC-SHA-256, след което използва AES-256-GCM с нова произволна сол и nonce. Текстовият плик или контейнерът за двоичен файл съхранява само параметрите на алгоритъма и шифрования текст, никога паролата.",
    "privacyQuestion": "Моята парола или файлове качени ли са?",
    "privacyAnswer": "Не. Web Crypto изпълнява работата в този браузър. Страницата не изпраща вашата парола, обикновен текст, криптирани данни или избран файл към обработващ сървър. Разширенията на браузъра или компрометирано устройство остават извън контрола на този инструмент.",
    "fields": {
      "mode": "Действие",
      "encryptMode": "Шифроване",
      "decryptMode": "Декриптиране",
      "dataMode": "Тип съдържание",
      "textMode": "Текст",
      "fileMode": "Файл",
      "password": "Парола",
      "passwordHint": "Използвайте дълга, уникална парола (16 или повече знака е по-добре). Не се запазва или възстановява.",
      "sourceText": "Текст или шифрован JSON плик",
      "sourceFile": "Изберете файл или UsefulVerse .uvenc контейнер",
      "iterations": "PBKDF2-HMAC-SHA-256 итерации",
      "iterationsValue": "600 000 (фиксирани)",
      "accuracyNote": "Инструмент за локален браузър, а не одит на сигурността или гаранция срещу злонамерен софтуер, компрометирани устройства или слаби пароли. Текстът е ограничен до 1 MiB, а файловете до 16 MiB, за да обвържат паметта на браузъра. Загубата на паролата прави дешифрирането невъзможно. Съхранявайте отделно архивиране и тествайте декриптиране, преди да разчитате на криптиран файл.",
      "resultHeading": "Резултат",
      "resultText": "Криптиран плик или декриптиран текст",
      "fileResult": "Криптиран или декриптиран файл",
      "fileNameNote": "Оригиналното име на файл и тип съдържание се съхраняват в заглавката на шифрования файл."
    },
    "actions": {
      "process": "Шифроване",
      "example": "Пример за зареждане на текст",
      "copy": "Копиране на резултата",
      "download": "Изтегляне на резултат",
      "result": "Резултат от криптиране"
    },
    "messages": {
      "encrypted": "Шифроването е завършено. Запазете резултата и запазете вашата парола в безопасност.",
      "decrypted": "Удостоверяването премина. Дешифрирането е завършено.",
      "working": "Обработва се локално в този браузър. Това може да отнеме известно време на някои устройства.",
      "checkInputs": "Проверете действието, типа съдържание, паролата и въвеждането.",
      "wrongOrDamaged": "Дешифрирането е неуспешно: паролата може да е грешна или шифрованите данни да са променени.",
      "unsupportedCrypto": "Secure Web Crypto не е наличен. Използвайте поддържан браузър през HTTPS.",
      "fileTooLarge": "Избраното съдържание надвишава ограничението за локален размер на този инструмент.",
      "copied": "Резултатът е копиран.",
      "copyUnavailable": "Копирането не е налично в този браузър.",
      "downloaded": "Готово за изтегляне."
    },
    "additionalFaqs": [
      {
        "question": "Мога ли да възстановя файл, ако забравя паролата?",
        "answer": "Не. Няма акаунт, ключ за възстановяване или услуга за нулиране. Съхранявайте паролата отделно и проверете тестово дешифриране, преди да изтриете или замените оригинала."
      },
      {
        "question": "Защо грешна парола показва грешка?",
        "answer": "AES-GCM удостоверява шифрования текст. Ако паролата е грешна или данните са променени, удостоверяването е неуспешно и инструментът не връща обикновен текст."
      },
      {
        "question": "Това одитирана или гарантирано сигурна система ли е?",
        "answer": "Не. Използва API на браузъра Web Crypto, но тази страница не е независим одит или гаранция срещу злонамерен софтуер, опасни разширения, слаби пароли, компрометирани устройства или загубени резервни копия."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "ca": {
    "copyLanguage": "ca",
    "name": "Eina de xifratge AES",
    "title": "Eina de xifratge AES | UsefulVerse",
    "description": "Xifra o desxifra el text i els fitxers petits localment amb AES-256-GCM. Sense API de càrrega, compte o xifratge.",
    "intro": "Xifra text o fitxers en aquest navegador o desxifra un contenidor fet per aquesta eina. L'AES-GCM autenticat rebutja una frase de contrasenya incorrecta o dades alterades en lloc de tornar text sense verificar.",
    "howQuestion": "Com funciona aquesta eina de xifratge AES?",
    "howAnswer": "Obté una clau de 256 bits de la vostra frase de contrasenya amb PBKDF2-HMAC-SHA-256 i, a continuació, utilitza AES-256-GCM amb una nova sal aleatòria i nonce. El sobre de text o el contenidor del fitxer binari només emmagatzema els paràmetres de l'algorisme i el text xifrat, mai la contrasenya.",
    "privacyQuestion": "S'han penjat la meva frase de contrasenya o els meus fitxers?",
    "privacyAnswer": "No. Web Crypto realitza el treball en aquest navegador. La pàgina no envia la vostra frase de contrasenya, text sense format, dades xifrades o fitxer seleccionat a un servidor de processament. Les extensions del navegador o un dispositiu compromès romanen fora del control d'aquesta eina.",
    "fields": {
      "mode": "Acció",
      "encryptMode": "Xifrar",
      "decryptMode": "Desxifrar",
      "dataMode": "Tipus de contingut",
      "textMode": "Text",
      "fileMode": "Fitxer",
      "password": "Frase de contrasenya",
      "passwordHint": "Utilitzeu una frase de contrasenya llarga i única (millor és 16 caràcters o més). No es guarda ni es pot recuperar.",
      "sourceText": "Text o sobre JSON encriptat",
      "sourceFile": "Trieu un fitxer o contenidor UsefulVerse .uvenc",
      "iterations": "PBKDF2-HMAC-SHA-256 iteracions",
      "iterationsValue": "600.000 (fixes)",
      "accuracyNote": "Eina de navegador local, no una auditoria de seguretat ni una garantia contra programari maliciós, dispositius compromesos o frases de contrasenya febles. El text està limitat a 1 MiB i els fitxers a 16 MiB a la memòria vinculada del navegador. La pèrdua de la contrasenya fa que el desxifrat sigui impossible. Mantingueu una còpia de seguretat per separat i proveu el desxifrat abans de confiar en un fitxer xifrat.",
      "resultHeading": "Resultat",
      "resultText": "Sobre xifrat o text desxifrat",
      "fileResult": "Fitxer xifrat o desxifrat",
      "fileNameNote": "El nom del fitxer original i el tipus de contingut s'emmagatzemen a la capçalera del fitxer xifrat."
    },
    "actions": {
      "process": "Xifrar",
      "example": "Exemple de càrrega de text",
      "copy": "Copia el resultat",
      "download": "Descarrega el resultat",
      "result": "Resultat del xifratge"
    },
    "messages": {
      "encrypted": "Xifratge completat. Deseu el resultat i manteniu la vostra frase de contrasenya segura.",
      "decrypted": "S'ha passat l'autenticació. Desxifrat completat.",
      "working": "S'està processant localment en aquest navegador. Això pot trigar un moment en alguns dispositius.",
      "checkInputs": "Comproveu l'acció, el tipus de contingut, la frase de contrasenya i l'entrada.",
      "wrongOrDamaged": "No s'ha pogut desxifrar: pot ser que la frase de contrasenya sigui incorrecta o que les dades xifrades hagin canviat.",
      "unsupportedCrypto": "Secure Web Crypto no està disponible. Utilitzeu un navegador compatible amb HTTPS.",
      "fileTooLarge": "El contingut seleccionat supera el límit de mida local d'aquesta eina.",
      "copied": "S'ha copiat el resultat.",
      "copyUnavailable": "La còpia no està disponible en aquest navegador.",
      "downloaded": "Baixa a punt."
    },
    "additionalFaqs": [
      {
        "question": "Puc recuperar un fitxer si oblido la contrasenya?",
        "answer": "No. No hi ha cap compte, clau de recuperació ni servei de restabliment. Mantingueu la contrasenya per separat i verifiqueu un desxifrat de prova abans de suprimir o substituir l'original."
      },
      {
        "question": "Per què una contrasenya incorrecta mostra un error?",
        "answer": "AES-GCM autentica el text xifrat. Si la frase de contrasenya és incorrecta o s'han canviat les dades, l'autenticació falla i l'eina no retorna cap text pla."
      },
      {
        "question": "És un sistema segur auditat o garantit?",
        "answer": "No. Utilitza l'API Web Crypto del navegador, però aquesta pàgina no és una auditoria independent ni una garantia contra programari maliciós, extensions insegures, frases de contrasenya febles, dispositius compromesos o còpies de seguretat perdudes."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "nl": {
    "copyLanguage": "nl",
    "name": "AES-coderingstool",
    "title": "AES-coderingstool | UsefulVerse",
    "description": "Versleutel of decodeer tekst en kleine bestanden lokaal met AES-256-GCM. Geen upload-, account- of coderings-API.",
    "intro": "Versleutel tekst of bestanden in deze browser, of decodeer een container die door deze tool is gemaakt. Geauthenticeerde AES-GCM wijst een verkeerde wachtwoordzin of gewijzigde gegevens af in plaats van niet-geverifieerde platte tekst terug te sturen.",
    "howQuestion": "Hoe werkt deze AES-encryptietool?",
    "howAnswer": "Het leidt een 256-bits sleutel af van uw wachtwoordzin met PBKDF2-HMAC-SHA-256 en gebruikt vervolgens AES-256-GCM met een nieuw willekeurig zout en nonce. De tekstenvelop of binaire bestandscontainer slaat alleen de algoritmeparameters en cijfertekst op, nooit de wachtwoordzin.",
    "privacyQuestion": "Zijn mijn wachtwoordzin of bestanden geüpload?",
    "privacyAnswer": "Nee. Web Crypto voert het werk uit in deze browser. De pagina verzendt uw wachtwoordzin, platte tekst, gecodeerde gegevens of geselecteerd bestand niet naar een verwerkingsserver. Browserextensies of een besmet apparaat blijven buiten de controle van deze tool.",
    "fields": {
      "mode": "Actie",
      "encryptMode": "Versleutelen",
      "decryptMode": "Ontsleutelen",
      "dataMode": "Inhoudstype",
      "textMode": "Tekst",
      "fileMode": "Bestand",
      "password": "Wachtwoordzin",
      "passwordHint": "Gebruik een lange, unieke wachtwoordzin (16 of meer tekens is beter). Het wordt niet opgeslagen of hersteld.",
      "sourceText": "Tekst of gecodeerde JSON-envelop",
      "sourceFile": "Kies een bestand of UsefulVerse .uvenc-container",
      "iterations": "PBKDF2-HMAC-SHA-256 iteraties",
      "iterationsValue": "600.000 (vast)",
      "accuracyNote": "Lokale browsertool, geen beveiligingsaudit of garantie tegen malware, gecompromitteerde apparaten of zwakke wachtwoordzinnen. Tekst is beperkt tot 1 MiB en bestanden tot 16 MiB voor het gebonden browsergeheugen. Het verliezen van de wachtwoordzin maakt decodering onmogelijk. Bewaar een aparte back-up en test de decodering voordat u vertrouwt op een gecodeerd bestand.",
      "resultHeading": "Resultaat",
      "resultText": "Gecodeerde envelop of gedecodeerde tekst",
      "fileResult": "Gecodeerd of gedecodeerd bestand",
      "fileNameNote": "De originele bestandsnaam en het inhoudstype worden opgeslagen in de gecodeerde bestandsheader."
    },
    "actions": {
      "process": "Versleutelen",
      "example": "Tekstvoorbeeld laden",
      "copy": "Kopieer resultaat",
      "download": "Resultaat downloaden",
      "result": "Versleutelingsresultaat"
    },
    "messages": {
      "encrypted": "Codering voltooid. Sla het resultaat op en bewaar uw wachtwoordzin veilig.",
      "decrypted": "Authenticatie geslaagd. Decodering voltooid.",
      "working": "Lokaal verwerken in deze browser. Op sommige apparaten kan dit even duren.",
      "checkInputs": "Controleer de actie, het inhoudstype, de wachtwoordzin en de invoer.",
      "wrongOrDamaged": "Decodering mislukt: de wachtwoordzin is mogelijk onjuist of de gecodeerde gegevens zijn mogelijk gewijzigd.",
      "unsupportedCrypto": "Secure Web Crypto is niet beschikbaar. Gebruik een ondersteunde browser via HTTPS.",
      "fileTooLarge": "De geselecteerde inhoud overschrijdt de lokale groottelimiet van deze tool.",
      "copied": "Resultaat gekopieerd.",
      "copyUnavailable": "Kopiëren is niet beschikbaar in deze browser.",
      "downloaded": "Klaar om te downloaden."
    },
    "additionalFaqs": [
      {
        "question": "Kan ik een bestand herstellen als ik de wachtwoordzin ben vergeten?",
        "answer": "Nee. Er is geen account-, herstelsleutel- of resetservice. Bewaar de wachtwoordzin afzonderlijk en verifieer een testdecodering voordat u het origineel verwijdert of vervangt."
      },
      {
        "question": "Waarom geeft een verkeerde wachtwoordzin een fout weer?",
        "answer": "AES-GCM verifieert de cijfertekst. Als de wachtwoordzin onjuist is of de gegevens zijn gewijzigd, mislukt de authenticatie en retourneert de tool geen platte tekst."
      },
      {
        "question": "Is dit een gecontroleerd of gegarandeerd veilig systeem?",
        "answer": "Nee. Er wordt gebruik gemaakt van de Web Crypto API van de browser, maar deze pagina is geen onafhankelijke audit of garantie tegen malware, onveilige extensies, zwakke wachtwoordzinnen, gecompromitteerde apparaten of verloren back-ups."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "el": {
    "copyLanguage": "el",
    "name": "Εργαλείο κρυπτογράφησης AES",
    "title": "Δωρεάν εργαλείο κρυπτογράφησης | UsefulVerse",
    "description": "Κρυπτογραφήστε ή αποκρυπτογραφήστε κείμενο και μικρά αρχεία τοπικά με το AES-256-GCM. Χωρίς API μεταφόρτωσης, λογαριασμού ή κρυπτογράφησης.",
    "intro": "Κρυπτογραφήστε κείμενο ή αρχεία σε αυτό το πρόγραμμα περιήγησης ή αποκρυπτογραφήστε ένα κοντέινερ που δημιουργήθηκε από αυτό το εργαλείο. Το πιστοποιημένο AES-GCM απορρίπτει μια λανθασμένη φράση πρόσβασης ή αλλαγμένα δεδομένα αντί να επιστρέψει μη επαληθευμένο απλό κείμενο.",
    "howQuestion": "Πώς λειτουργεί αυτό το εργαλείο κρυπτογράφησης AES;",
    "howAnswer": "Εξάγει ένα κλειδί 256-bit από τη φράση πρόσβασης με PBKDF2-HMAC-SHA-256 και, στη συνέχεια, χρησιμοποιεί το AES-256-GCM με ένα νέο τυχαίο salt και nonce. Ο φάκελος κειμένου ή το κοντέινερ δυαδικού αρχείου αποθηκεύει μόνο τις παραμέτρους του αλγορίθμου και το κρυπτογραφημένο κείμενο και ποτέ τη φράση πρόσβασης.",
    "privacyQuestion": "Έχουν μεταφορτωθεί η φράση πρόσβασης ή τα αρχεία μου;",
    "privacyAnswer": "Όχι. Το Web Crypto εκτελεί την εργασία σε αυτό το πρόγραμμα περιήγησης. Η σελίδα δεν στέλνει τη φράση πρόσβασης, το απλό κείμενο, τα κρυπτογραφημένα δεδομένα ή το επιλεγμένο αρχείο σας σε διακομιστή επεξεργασίας. Οι επεκτάσεις προγράμματος περιήγησης ή μια παραβιασμένη συσκευή παραμένουν εκτός ελέγχου αυτού του εργαλείου.",
    "fields": {
      "mode": "Δράση",
      "encryptMode": "Κρυπτογράφηση",
      "decryptMode": "Αποκρυπτογράφηση",
      "dataMode": "Τύπος περιεχομένου",
      "textMode": "Κείμενο",
      "fileMode": "Αρχείο",
      "password": "Φράση πρόσβασης",
      "passwordHint": "Χρησιμοποιήστε μια μεγάλη, μοναδική φράση πρόσβασης (16 ή περισσότεροι χαρακτήρες είναι καλύτερο). Δεν αποθηκεύεται ούτε ανακτάται.",
      "sourceText": "Κείμενο ή κρυπτογραφημένο φάκελο JSON",
      "sourceFile": "Επιλέξτε ένα αρχείο ή κοντέινερ UsefulVerse .uvenc",
      "iterations": "PBKDF2-HMAC-SHA-256 επαναλήψεις",
      "iterationsValue": "600.000 (σταθερό)",
      "accuracyNote": "Εργαλείο τοπικού προγράμματος περιήγησης, όχι έλεγχος ασφαλείας ή εγγύηση έναντι κακόβουλου λογισμικού, παραβιασμένων συσκευών ή αδύναμων φράσεων πρόσβασης. Το κείμενο περιορίζεται σε 1 MiB και τα αρχεία σε 16 MiB στη δεσμευμένη μνήμη του προγράμματος περιήγησης. Η απώλεια της φράσης πρόσβασης καθιστά αδύνατη την αποκρυπτογράφηση. Διατηρήστε ξεχωριστό αντίγραφο ασφαλείας και δοκιμάστε την αποκρυπτογράφηση πριν βασιστείτε σε ένα κρυπτογραφημένο αρχείο.",
      "resultHeading": "Αποτέλεσμα",
      "resultText": "Κρυπτογραφημένος φάκελος ή αποκρυπτογραφημένο κείμενο",
      "fileResult": "Κρυπτογραφημένο ή αποκρυπτογραφημένο αρχείο",
      "fileNameNote": "Το αρχικό όνομα αρχείου και ο τύπος περιεχομένου αποθηκεύονται στην κρυπτογραφημένη κεφαλίδα αρχείου."
    },
    "actions": {
      "process": "Κρυπτογράφηση",
      "example": "Φόρτωση παραδείγματος κειμένου",
      "copy": "Αντιγραφή αποτελέσματος",
      "download": "Λήψη αποτελέσματος",
      "result": "Αποτέλεσμα κρυπτογράφησης"
    },
    "messages": {
      "encrypted": "Η κρυπτογράφηση ολοκληρώθηκε. Αποθηκεύστε το αποτέλεσμα και διατηρήστε τη φράση πρόσβασής σας ασφαλή.",
      "decrypted": "Ο έλεγχος ταυτότητας πέρασε. Η αποκρυπτογράφηση ολοκληρώθηκε.",
      "working": "Επεξεργασία τοπικά σε αυτό το πρόγραμμα περιήγησης. Αυτό μπορεί να διαρκέσει λίγο σε ορισμένες συσκευές.",
      "checkInputs": "Ελέγξτε την ενέργεια, τον τύπο περιεχομένου, τη φράση πρόσβασης και την εισαγωγή.",
      "wrongOrDamaged": "Η αποκρυπτογράφηση απέτυχε: η φράση πρόσβασης μπορεί να είναι λάθος ή τα κρυπτογραφημένα δεδομένα μπορεί να έχουν αλλάξει.",
      "unsupportedCrypto": "Το Secure Web Crypto δεν είναι διαθέσιμο. Χρησιμοποιήστε ένα υποστηριζόμενο πρόγραμμα περιήγησης μέσω HTTPS.",
      "fileTooLarge": "Το επιλεγμένο περιεχόμενο υπερβαίνει το τοπικό όριο μεγέθους αυτού του εργαλείου.",
      "copied": "Το αποτέλεσμα αντιγράφηκε.",
      "copyUnavailable": "Το αντίγραφο δεν είναι διαθέσιμο σε αυτό το πρόγραμμα περιήγησης.",
      "downloaded": "Λήψη έτοιμη."
    },
    "additionalFaqs": [
      {
        "question": "Μπορώ να ανακτήσω ένα αρχείο εάν ξεχάσω τη φράση πρόσβασης;",
        "answer": "Όχι. Δεν υπάρχει λογαριασμός, κλειδί ανάκτησης ή υπηρεσία επαναφοράς. Κρατήστε τη φράση πρόσβασης ξεχωριστά και επαληθεύστε μια δοκιμαστική αποκρυπτογράφηση πριν διαγράψετε ή αντικαταστήσετε το πρωτότυπο."
      },
      {
        "question": "Γιατί μια λάθος φράση πρόσβασης εμφανίζει σφάλμα;",
        "answer": "Το AES-GCM ελέγχει την ταυτότητα του κρυπτογραφημένου κειμένου. Εάν η φράση πρόσβασης είναι λάθος ή τα δεδομένα έχουν αλλάξει, ο έλεγχος ταυτότητας αποτυγχάνει και το εργαλείο δεν επιστρέφει απλό κείμενο."
      },
      {
        "question": "Είναι αυτό ένα ελεγμένο ή εγγυημένο ασφαλές σύστημα;",
        "answer": "Όχι. Χρησιμοποιεί το πρόγραμμα περιήγησης Web Crypto API, αλλά αυτή η σελίδα δεν αποτελεί ανεξάρτητο έλεγχο ή εγγύηση για κακόβουλο λογισμικό, μη ασφαλείς επεκτάσεις, αδύναμες φράσεις πρόσβασης, παραβιασμένες συσκευές ή χαμένα αντίγραφα ασφαλείας."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "ms": {
    "copyLanguage": "ms",
    "name": "Alat penyulitan AES",
    "title": "Alat Penyulitan AES | UsefulVerse",
    "description": "Sulitkan atau nyahsulit teks dan fail kecil secara setempat dengan AES-256-GCM. Tiada muat naik, akaun atau API penyulitan.",
    "intro": "Sulitkan teks atau fail dalam penyemak imbas ini, atau nyahsulit bekas yang dibuat oleh alat ini. AES-GCM yang disahkan menolak frasa laluan yang salah atau data yang diubah dan bukannya mengembalikan teks biasa yang tidak disahkan.",
    "howQuestion": "Bagaimanakah alat penyulitan AES ini berfungsi?",
    "howAnswer": "Ia memperoleh kunci 256-bit daripada frasa laluan anda dengan PBKDF2-HMAC-SHA-256, kemudian menggunakan AES-256-GCM dengan garam rawak baharu dan bukan. Sampul teks atau bekas fail binari hanya menyimpan parameter algoritma dan teks sifir, bukan frasa laluan.",
    "privacyQuestion": "Adakah frasa laluan atau fail saya dimuat naik?",
    "privacyAnswer": "Tidak. Web Crypto melaksanakan kerja dalam penyemak imbas ini. Halaman tidak menghantar frasa laluan, teks biasa, data yang disulitkan atau fail yang dipilih ke pelayan pemprosesan. Sambungan penyemak imbas atau peranti yang terjejas kekal di luar kawalan alat ini.",
    "fields": {
      "mode": "Tindakan",
      "encryptMode": "Sulitkan",
      "decryptMode": "Nyahsulit",
      "dataMode": "Jenis kandungan",
      "textMode": "Teks",
      "fileMode": "Fail",
      "password": "Ungkapan laluan",
      "passwordHint": "Gunakan frasa laluan yang panjang dan unik (16 atau lebih aksara adalah lebih baik). Ia tidak disimpan atau boleh dipulihkan.",
      "sourceText": "Teks atau sampul surat JSON yang disulitkan",
      "sourceFile": "Pilih fail atau bekas UsefulVerse .uvenc",
      "iterations": "PBKDF2-HMAC-SHA-256 lelaran",
      "iterationsValue": "600,000 (tetap)",
      "accuracyNote": "Alat penyemak imbas setempat, bukan audit keselamatan atau jaminan terhadap perisian hasad, peranti yang terjejas atau frasa laluan yang lemah. Teks terhad kepada 1 MiB dan fail kepada 16 MiB untuk memori penyemak imbas terikat. Kehilangan frasa laluan menjadikan penyahsulitan mustahil. Simpan sandaran dan penyahsulitan ujian yang berasingan sebelum bergantung pada fail yang disulitkan.",
      "resultHeading": "Hasilnya",
      "resultText": "Sampul surat yang disulitkan atau teks yang disulitkan",
      "fileResult": "Fail yang disulitkan atau dinyahsulit",
      "fileNameNote": "Nama fail asal dan jenis kandungan disimpan dalam pengepala fail yang disulitkan."
    },
    "actions": {
      "process": "Sulitkan",
      "example": "Muatkan contoh teks",
      "copy": "Salin keputusan",
      "download": "Muat turun hasil",
      "result": "Hasil penyulitan"
    },
    "messages": {
      "encrypted": "Penyulitan selesai. Simpan keputusan dan pastikan frasa laluan anda selamat.",
      "decrypted": "Pengesahan lulus. Penyahsulitan selesai.",
      "working": "Memproses secara setempat dalam penyemak imbas ini. Ini mungkin mengambil sedikit masa pada sesetengah peranti.",
      "checkInputs": "Semak tindakan, jenis kandungan, frasa laluan dan input.",
      "wrongOrDamaged": "Penyahsulitan gagal: frasa laluan mungkin salah atau data yang disulitkan mungkin telah berubah.",
      "unsupportedCrypto": "Secure Web Crypto tidak tersedia. Gunakan penyemak imbas yang disokong melalui HTTPS.",
      "fileTooLarge": "Kandungan yang dipilih melebihi had saiz setempat alat ini.",
      "copied": "Keputusan disalin.",
      "copyUnavailable": "Salinan tidak tersedia dalam penyemak imbas ini.",
      "downloaded": "Muat turun sedia."
    },
    "additionalFaqs": [
      {
        "question": "Bolehkah saya memulihkan fail jika saya terlupa frasa laluan?",
        "answer": "Tidak. Tiada akaun, kunci pemulihan atau perkhidmatan set semula. Simpan frasa laluan secara berasingan dan sahkan penyahsulitan ujian sebelum memadam atau menggantikan yang asal."
      },
      {
        "question": "Mengapakah frasa laluan yang salah menunjukkan ralat?",
        "answer": "AES-GCM mengesahkan teks sifir. Jika frasa laluan salah atau data telah ditukar, pengesahan gagal dan alat tidak mengembalikan teks biasa."
      },
      {
        "question": "Adakah ini sistem selamat yang diaudit atau dijamin?",
        "answer": "Tidak. Ia menggunakan API Web Crypto penyemak imbas, tetapi halaman ini bukan audit bebas atau jaminan terhadap perisian hasad, sambungan tidak selamat, frasa laluan yang lemah, peranti yang terjejas atau sandaran yang hilang."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "pl": {
    "copyLanguage": "pl",
    "name": "Narzędzie do szyfrowania AES",
    "title": "Bezpłatne narzędzie szyfrujące | UsefulVerse",
    "description": "Szyfruj lub deszyfruj tekst i małe pliki lokalnie za pomocą AES-256-GCM. Bez przesyłania, konta i szyfrowania API.",
    "intro": "Zaszyfruj tekst lub pliki w tej przeglądarce lub odszyfruj kontener utworzony przez to narzędzie. Uwierzytelniony AES-GCM odrzuca błędne hasło lub zmienione dane zamiast zwracać niezweryfikowany zwykły tekst.",
    "howQuestion": "Jak działa to narzędzie do szyfrowania AES?",
    "howAnswer": "Wyprowadza 256-bitowy klucz z hasła PBKDF2-HMAC-SHA-256, a następnie używa AES-256-GCM z nową losową solą i wartością jednorazową. Koperta tekstowa lub kontener pliku binarnego przechowuje tylko parametry algorytmu i tekst zaszyfrowany, nigdy hasło.",
    "privacyQuestion": "Czy moje hasło lub pliki zostały przesłane?",
    "privacyAnswer": "Nie. Web Crypto wykonuje pracę w tej przeglądarce. Strona nie wysyła hasła, zwykłego tekstu, zaszyfrowanych danych ani wybranego pliku do serwera przetwarzającego. Rozszerzenia przeglądarki lub zainfekowane urządzenie pozostają poza kontrolą tego narzędzia.",
    "fields": {
      "mode": "Akcja",
      "encryptMode": "Szyfruj",
      "decryptMode": "Odszyfruj",
      "dataMode": "Typ treści",
      "textMode": "Tekst",
      "fileMode": "Plik",
      "password": "Hasło",
      "passwordHint": "Użyj długiego, unikalnego hasła (lepiej 16 lub więcej znaków). Nie można go zapisać ani odzyskać.",
      "sourceText": "Tekst lub zaszyfrowana koperta JSON",
      "sourceFile": "Wybierz plik lub kontener UsefulVerse .uvenc",
      "iterations": "Iteracje PBKDF2-HMAC-SHA-256",
      "iterationsValue": "600 000 (stałe)",
      "accuracyNote": "Narzędzie lokalnej przeglądarki, a nie audyt bezpieczeństwa ani gwarancja chroniąca przed złośliwym oprogramowaniem, zainfekowanymi urządzeniami lub słabymi hasłami. Tekst jest ograniczony do 1 MiB, a pliki do 16 MiB w ograniczonej pamięci przeglądarki. Utrata hasła uniemożliwia odszyfrowanie. Zanim skorzystasz z zaszyfrowanego pliku, wykonaj osobną kopię zapasową i przetestuj deszyfrowanie.",
      "resultHeading": "Wynik",
      "resultText": "Zaszyfrowana koperta lub odszyfrowany tekst",
      "fileResult": "Zaszyfrowany lub odszyfrowany plik",
      "fileNameNote": "Oryginalna nazwa pliku i typ zawartości są przechowywane w zaszyfrowanym nagłówku pliku."
    },
    "actions": {
      "process": "Szyfruj",
      "example": "Załaduj przykładowy tekst",
      "copy": "Skopiuj wynik",
      "download": "Pobierz wynik",
      "result": "Wynik szyfrowania"
    },
    "messages": {
      "encrypted": "Szyfrowanie zakończone. Zapisz wynik i chroń swoje hasło.",
      "decrypted": "Uwierzytelnienie przeszło. Deszyfrowanie zakończone.",
      "working": "Przetwarzanie lokalne w tej przeglądarce. Na niektórych urządzeniach może to chwilę potrwać.",
      "checkInputs": "Sprawdź akcję, typ zawartości, hasło i dane wejściowe.",
      "wrongOrDamaged": "Odszyfrowanie nie powiodło się: hasło mogło być nieprawidłowe lub zaszyfrowane dane mogły ulec zmianie.",
      "unsupportedCrypto": "Bezpieczne kryptowaluty internetowe są niedostępne. Użyj obsługiwanej przeglądarki przez HTTPS.",
      "fileTooLarge": "Wybrana treść przekracza lokalny limit rozmiaru tego narzędzia.",
      "copied": "Wynik skopiowany.",
      "copyUnavailable": "Kopia jest niedostępna w tej przeglądarce.",
      "downloaded": "Pobierz gotowy."
    },
    "additionalFaqs": [
      {
        "question": "Czy mogę odzyskać plik, jeśli zapomnę hasła?",
        "answer": "Nie. Nie ma konta, klucza odzyskiwania ani usługi resetowania. Zachowaj hasło oddzielnie i sprawdź odszyfrowanie testowe przed usunięciem lub zastąpieniem oryginału."
      },
      {
        "question": "Dlaczego nieprawidłowe hasło oznacza błąd?",
        "answer": "AES-GCM uwierzytelnia tekst zaszyfrowany. Jeśli hasło jest nieprawidłowe lub dane zostały zmienione, uwierzytelnianie nie powiedzie się, a narzędzie nie zwróci żadnego zwykłego tekstu."
      },
      {
        "question": "Czy jest to kontrolowany lub gwarantowany bezpieczny system?",
        "answer": "Nie. Korzysta z przeglądarki Web Crypto API, ale ta strona nie stanowi niezależnego audytu ani gwarancji chroniącej przed złośliwym oprogramowaniem, niebezpiecznymi rozszerzeniami, słabymi hasłami, przejętymi urządzeniami lub utraconymi kopiami zapasowymi."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "sv": {
    "copyLanguage": "sv",
    "name": "AES-krypteringsverktyg",
    "title": "AES-krypteringsverktyg | UsefulVerse",
    "description": "Kryptera eller dekryptera text och små filer lokalt med AES-256-GCM. Ingen uppladdning, konto eller krypterings-API.",
    "intro": "Kryptera text eller filer i den här webbläsaren, eller dekryptera en behållare gjord av det här verktyget. Autentiserad AES-GCM avvisar en felaktig lösenfras eller ändrad data istället för att returnera overifierad klartext.",
    "howQuestion": "Hur fungerar detta AES-krypteringsverktyg?",
    "howAnswer": "Den härleder en 256-bitars nyckel från din lösenfras med PBKDF2-HMAC-SHA-256, och använder sedan AES-256-GCM med ett nytt slumpmässigt salt och nonce. Textkuvertet eller binärfilbehållaren lagrar endast algoritmparametrarna och chiffertexten, aldrig lösenfrasen.",
    "privacyQuestion": "Är min lösenfras eller mina filer uppladdade?",
    "privacyAnswer": "Nej. Web Crypto utför arbetet i den här webbläsaren. Sidan skickar inte din lösenfras, klartext, krypterad data eller valda fil till en bearbetningsserver. Webbläsartillägg eller en komprometterad enhet förblir utanför verktygets kontroll.",
    "fields": {
      "mode": "Åtgärd",
      "encryptMode": "Kryptera",
      "decryptMode": "Dekryptera",
      "dataMode": "Innehållstyp",
      "textMode": "Text",
      "fileMode": "Arkiv",
      "password": "Lösenfras",
      "passwordHint": "Använd en lång, unik lösenfras (16 eller fler tecken är bättre). Det är inte sparat eller återställbart.",
      "sourceText": "Text eller krypterat JSON-kuvert",
      "sourceFile": "Välj en fil eller UsefulVerse .uvenc-behållare",
      "iterations": "PBKDF2-HMAC-SHA-256 iterationer",
      "iterationsValue": "600 000 (fast)",
      "accuracyNote": "Verktyg för lokal webbläsare, inte en säkerhetsgranskning eller garanti mot skadlig programvara, komprometterade enheter eller svaga lösenfraser. Text är begränsad till 1 MiB och filer till 16 MiB till bundet webbläsarminne. Att förlora lösenordsfrasen omöjliggör dekryptering. Håll en separat säkerhetskopia och testdekryptering innan du förlitar dig på en krypterad fil.",
      "resultHeading": "Resultat",
      "resultText": "Krypterat kuvert eller dekrypterad text",
      "fileResult": "Krypterad eller dekrypterad fil",
      "fileNameNote": "Det ursprungliga filnamnet och innehållstypen lagras i den krypterade filhuvudet."
    },
    "actions": {
      "process": "Kryptera",
      "example": "Ladda textexempel",
      "copy": "Kopiera resultatet",
      "download": "Ladda ner resultat",
      "result": "Krypteringsresultat"
    },
    "messages": {
      "encrypted": "Kryptering klar. Spara resultatet och förvara din lösenfras säker.",
      "decrypted": "Autentisering godkänd. Dekryptering klar.",
      "working": "Bearbetar lokalt i den här webbläsaren. Detta kan ta en stund på vissa enheter.",
      "checkInputs": "Kontrollera åtgärd, innehållstyp, lösenfras och inmatning.",
      "wrongOrDamaged": "Dekrypteringen misslyckades: lösenordsfrasen kan vara felaktig eller så kan de krypterade uppgifterna ha ändrats.",
      "unsupportedCrypto": "Secure Web Crypto är inte tillgängligt. Använd en webbläsare som stöds över HTTPS.",
      "fileTooLarge": "Det valda innehållet överskrider verktygets lokala storleksgräns.",
      "copied": "Resultatet har kopierats.",
      "copyUnavailable": "Copy är inte tillgänglig i den här webbläsaren.",
      "downloaded": "Nedladdningen är klar."
    },
    "additionalFaqs": [
      {
        "question": "Kan jag återställa en fil om jag glömmer lösenordsfrasen?",
        "answer": "Nej. Det finns inget konto, återställningsnyckel eller återställningstjänst. Behåll lösenfrasen separat och verifiera en testdekryptering innan du tar bort eller ersätter originalet."
      },
      {
        "question": "Varför visar en felaktig lösenfras ett fel?",
        "answer": "AES-GCM autentiserar chiffertexten. Om lösenfrasen är felaktig eller om data har ändrats, misslyckas autentiseringen och verktyget returnerar ingen klartext."
      },
      {
        "question": "Är detta ett kontrollerat eller garanterat säkert system?",
        "answer": "Nej. Den använder webbläsaren Web Crypto API, men den här sidan är inte en oberoende granskning eller en garanti mot skadlig programvara, osäkra tillägg, svaga lösenfraser, komprometterade enheter eller förlorade säkerhetskopior."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "th": {
    "copyLanguage": "th",
    "name": "เครื่องมือเข้ารหัส AES",
    "title": "เครื่องมือเข้ารหัส AES | UsefulVerse",
    "description": "เข้ารหัสหรือถอดรหัสข้อความและไฟล์ขนาดเล็กในเครื่องด้วย AES-256-GCM ไม่มีการอัปโหลด บัญชี หรือ API การเข้ารหัส",
    "intro": "เข้ารหัสข้อความหรือไฟล์ในเบราว์เซอร์นี้ หรือถอดรหัสคอนเทนเนอร์ที่สร้างโดยเครื่องมือนี้ AES-GCM ที่ได้รับการรับรองความถูกต้องจะปฏิเสธข้อความรหัสผ่านที่ไม่ถูกต้องหรือข้อมูลที่เปลี่ยนแปลง แทนที่จะส่งคืนข้อความธรรมดาที่ไม่ได้รับการยืนยัน",
    "howQuestion": "เครื่องมือเข้ารหัส AES นี้ทำงานอย่างไร",
    "howAnswer": "โดยได้คีย์ 256 บิตจากข้อความรหัสผ่านของคุณด้วย PBKDF2-HMAC-SHA-256 จากนั้นใช้ AES-256-GCM พร้อมด้วยเกลือแบบสุ่มและ nonce ใหม่ ซองข้อความหรือคอนเทนเนอร์ไฟล์ไบนารีจะจัดเก็บเฉพาะพารามิเตอร์อัลกอริธึมและข้อความไซเฟอร์เท่านั้น ไม่ใช่ข้อความรหัสผ่าน",
    "privacyQuestion": "ข้อความรหัสผ่านหรือไฟล์ของฉันถูกอัพโหลดหรือไม่?",
    "privacyAnswer": "ไม่ Web Crypto ทำงานในเบราว์เซอร์นี้ หน้านี้จะไม่ส่งข้อความรหัสผ่าน ข้อความธรรมดา ข้อมูลที่เข้ารหัส หรือไฟล์ที่เลือกไปยังเซิร์ฟเวอร์ประมวลผล ส่วนขยายเบราว์เซอร์หรืออุปกรณ์ที่ถูกบุกรุกยังคงอยู่นอกการควบคุมของเครื่องมือนี้",
    "fields": {
      "mode": "การกระทำ",
      "encryptMode": "เข้ารหัส",
      "decryptMode": "ถอดรหัส",
      "dataMode": "ประเภทเนื้อหา",
      "textMode": "ข้อความ",
      "fileMode": "ไฟล์",
      "password": "ข้อความรหัสผ่าน",
      "passwordHint": "ใช้ข้อความรหัสผ่านที่ยาวและไม่ซ้ำใคร (ดีกว่า 16 ตัวอักษรขึ้นไป) มันไม่ได้ถูกบันทึกหรือกู้คืนได้",
      "sourceText": "ข้อความหรือซองจดหมาย JSON ที่เข้ารหัส",
      "sourceFile": "เลือกไฟล์หรือคอนเทนเนอร์ UsefulVerse .uvenc",
      "iterations": "การวนซ้ำ PBKDF2-HMAC-SHA-256",
      "iterationsValue": "600,000 (คงที่)",
      "accuracyNote": "เครื่องมือเบราว์เซอร์ในเครื่อง ไม่ใช่การตรวจสอบความปลอดภัยหรือการรับประกันมัลแวร์ อุปกรณ์ที่ถูกบุกรุก หรือข้อความรหัสผ่านที่ไม่รัดกุม ข้อความถูกจำกัดไว้ที่ 1 MiB และไฟล์อยู่ที่ 16 MiB สำหรับหน่วยความจำเบราว์เซอร์ที่ผูกไว้ การสูญเสียข้อความรหัสผ่านทำให้ไม่สามารถถอดรหัสได้ เก็บข้อมูลสำรองแยกต่างหากและทดสอบการถอดรหัสก่อนที่จะใช้ไฟล์ที่เข้ารหัส",
      "resultHeading": "ผลลัพธ์",
      "resultText": "ซองจดหมายที่เข้ารหัสหรือข้อความที่ถอดรหัส",
      "fileResult": "ไฟล์ที่เข้ารหัสหรือถอดรหัส",
      "fileNameNote": "ชื่อไฟล์ต้นฉบับและประเภทเนื้อหาจะถูกจัดเก็บไว้ในส่วนหัวของไฟล์ที่เข้ารหัส"
    },
    "actions": {
      "process": "เข้ารหัส",
      "example": "ตัวอย่างข้อความโหลด",
      "copy": "คัดลอกผลลัพธ์",
      "download": "ดาวน์โหลดผลลัพธ์",
      "result": "ผลการเข้ารหัส"
    },
    "messages": {
      "encrypted": "การเข้ารหัสเสร็จสมบูรณ์ บันทึกผลลัพธ์และรักษาข้อความรหัสผ่านของคุณให้ปลอดภัย",
      "decrypted": "การตรวจสอบสิทธิ์ผ่านไปแล้ว การถอดรหัสเสร็จสมบูรณ์",
      "working": "กำลังประมวลผลภายในเบราว์เซอร์นี้ การดำเนินการนี้อาจใช้เวลาสักครู่ในอุปกรณ์บางอย่าง",
      "checkInputs": "ตรวจสอบการกระทำ ประเภทเนื้อหา ข้อความรหัสผ่าน และการป้อนข้อมูล",
      "wrongOrDamaged": "การถอดรหัสล้มเหลว: ข้อความรหัสผ่านอาจผิดหรือข้อมูลที่เข้ารหัสอาจมีการเปลี่ยนแปลง",
      "unsupportedCrypto": "Secure Web Crypto ไม่พร้อมใช้งาน ใช้เบราว์เซอร์ที่รองรับผ่าน HTTPS",
      "fileTooLarge": "เนื้อหาที่เลือกเกินขีดจำกัดขนาดท้องถิ่นของเครื่องมือนี้",
      "copied": "คัดลอกผลลัพธ์แล้ว",
      "copyUnavailable": "การคัดลอกไม่พร้อมใช้งานในเบราว์เซอร์นี้",
      "downloaded": "ดาวน์โหลดพร้อมแล้ว"
    },
    "additionalFaqs": [
      {
        "question": "ฉันสามารถกู้คืนไฟล์ได้หรือไม่หากฉันลืมข้อความรหัสผ่าน?",
        "answer": "ไม่ ไม่มีบัญชี รหัสกู้คืน หรือบริการรีเซ็ต เก็บข้อความรหัสผ่านแยกกันและตรวจสอบการถอดรหัสทดสอบก่อนที่จะลบหรือเปลี่ยนต้นฉบับ"
      },
      {
        "question": "เหตุใดรหัสผ่านที่ไม่ถูกต้องจึงแสดงข้อผิดพลาด",
        "answer": "AES-GCM ตรวจสอบสิทธิ์ไซเฟอร์เท็กซ์ หากข้อความรหัสผ่านไม่ถูกต้องหรือข้อมูลมีการเปลี่ยนแปลง การรับรองความถูกต้องจะล้มเหลว และเครื่องมือจะไม่ส่งคืนข้อความธรรมดา"
      },
      {
        "question": "นี่เป็นระบบที่ปลอดภัยที่ได้รับการตรวจสอบหรือรับประกันหรือไม่",
        "answer": "ไม่ มันใช้เบราว์เซอร์ Web Crypto API แต่หน้านี้ไม่ใช่การตรวจสอบอิสระหรือการรับประกันต่อมัลแวร์ ส่วนขยายที่ไม่ปลอดภัย ข้อความรหัสผ่านที่ไม่รัดกุม อุปกรณ์ที่ถูกบุกรุก หรือข้อมูลสำรองที่สูญหาย"
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "uk": {
    "copyLanguage": "uk",
    "name": "Інструмент шифрування AES",
    "title": "Безкоштовний інструмент шифрування | UsefulVerse",
    "description": "Шифруйте або дешифруйте текст і невеликі файли локально за допомогою AES-256-GCM. Немає API завантаження, облікового запису чи шифрування.",
    "intro": "Зашифруйте текст або файли в цьому браузері або розшифруйте контейнер, створений цим інструментом. Автентифікований AES-GCM відхиляє неправильну парольну фразу або змінені дані замість того, щоб повертати неперевірений відкритий текст.",
    "howQuestion": "Як працює цей інструмент шифрування AES?",
    "howAnswer": "Він отримує 256-бітний ключ із вашої парольної фрази за допомогою PBKDF2-HMAC-SHA-256, а потім використовує AES-256-GCM із новою випадковою сіллю та nonce. Текстовий конверт або контейнер бінарного файлу зберігає лише параметри алгоритму та зашифрований текст, а не парольну фразу.",
    "privacyQuestion": "Чи завантажено мою парольну фразу чи файли?",
    "privacyAnswer": "Ні. Web Crypto виконує роботу в цьому браузері. Сторінка не надсилає вашу парольну фразу, відкритий текст, зашифровані дані чи вибраний файл на сервер обробки. Розширення веб-переглядача або зламаний пристрій залишаються поза контролем цього інструменту.",
    "fields": {
      "mode": "Дія",
      "encryptMode": "Зашифрувати",
      "decryptMode": "Розшифрувати",
      "dataMode": "Тип вмісту",
      "textMode": "текст",
      "fileMode": "Файл",
      "password": "Парольна фраза",
      "passwordHint": "Використовуйте довгу унікальну парольну фразу (краще 16 або більше символів). Його неможливо зберегти або відновити.",
      "sourceText": "Текст або зашифрований конверт JSON",
      "sourceFile": "Виберіть файл або контейнер UsefulVerse .uvenc",
      "iterations": "Ітерації PBKDF2-HMAC-SHA-256",
      "iterationsValue": "600 000 (фіксовано)",
      "accuracyNote": "Інструмент локального браузера, а не перевірка безпеки чи гарантія від зловмисного програмного забезпечення, скомпрометованих пристроїв або слабких парольних фраз. Розмір тексту обмежений 1 МБ, а файлів – 16 МБ для обмеження пам’яті браузера. Втрата парольної фрази робить дешифрування неможливим. Зберігайте окрему резервну копію та перевірте розшифровку, перш ніж покладатися на зашифрований файл.",
      "resultHeading": "Результат",
      "resultText": "Зашифрований конверт або розшифрований текст",
      "fileResult": "Зашифрований або розшифрований файл",
      "fileNameNote": "Оригінальна назва файлу та тип вмісту зберігаються в зашифрованому заголовку файлу."
    },
    "actions": {
      "process": "Зашифрувати",
      "example": "Завантажити приклад тексту",
      "copy": "Копіювати результат",
      "download": "Завантажити результат",
      "result": "Результат шифрування"
    },
    "messages": {
      "encrypted": "Шифрування завершено. Збережіть результат і збережіть свою парольну фразу.",
      "decrypted": "Автентифікація пройшла. Розшифровку завершено.",
      "working": "Локальна обробка в цьому браузері. На деяких пристроях це може зайняти деякий час.",
      "checkInputs": "Перевірте дію, тип вмісту, парольну фразу та введення.",
      "wrongOrDamaged": "Не вдалося розшифрувати: парольна фраза може бути неправильною або зашифровані дані можуть бути змінені.",
      "unsupportedCrypto": "Secure Web Crypto недоступний. Використовуйте підтримуваний браузер через HTTPS.",
      "fileTooLarge": "Вибраний вміст перевищує локальне обмеження розміру цього інструмента.",
      "copied": "Результат скопійовано.",
      "copyUnavailable": "Копіювання недоступне в цьому браузері.",
      "downloaded": "Завантаження готове."
    },
    "additionalFaqs": [
      {
        "question": "Чи можу я відновити файл, якщо забув пароль?",
        "answer": "Ні. Немає облікового запису, ключа відновлення чи служби скидання. Зберігайте парольну фразу окремо та перевіряйте тестове розшифрування перед видаленням або заміною оригіналу."
      },
      {
        "question": "Чому неправильна парольна фраза відображає помилку?",
        "answer": "AES-GCM автентифікує зашифрований текст. Якщо парольна фраза неправильна або дані змінено, автентифікація не вдається, і інструмент не повертає відкритий текст."
      },
      {
        "question": "Це перевірена чи гарантовано безпечна система?",
        "answer": "Ні. Він використовує веб-криптографічний API браузера, але ця сторінка не є незалежною перевіркою чи гарантією від зловмисного програмного забезпечення, небезпечних розширень, слабких парольних фраз, скомпрометованих пристроїв або втрачених резервних копій."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "sw": {
    "copyLanguage": "sw",
    "name": "Zana ya usimbaji fiche ya AES",
    "title": "Zana ya Usimbaji Fiche ya AES Bila | UsefulVerse",
    "description": "Simbua au usimbue maandishi na faili ndogo ndani yako ukitumia AES-256-GCM. Hakuna API ya upakiaji, akaunti au usimbaji fiche.",
    "intro": "Simba maandishi au faili katika kivinjari hiki, au usimbue chombo kilichoundwa na zana hii. AES-GCM iliyothibitishwa inakataa kaulisiri isiyo sahihi au data iliyobadilishwa badala ya kurudisha maandishi wazi ambayo hayajathibitishwa.",
    "howQuestion": "Zana hii ya usimbaji fiche ya AES inafanyaje kazi?",
    "howAnswer": "Inatoa ufunguo wa 256-bit kutoka kwa kaulisiri yako na PBKDF2-HMAC-SHA-256, kisha hutumia AES-256-GCM na chumvi mpya nasibu. Bahasha ya maandishi au kontena la faili jozi huhifadhi tu vigezo vya algoriti na maandishi ya siri, kamwe kaulisiri.",
    "privacyQuestion": "Je, kaulisiri au faili zangu zimepakiwa?",
    "privacyAnswer": "Hapana. Web Crypto hufanya kazi katika kivinjari hiki. Ukurasa hautumi kauli yako ya siri, maandishi wazi, data iliyosimbwa kwa njia fiche au faili iliyochaguliwa kwa seva ya kuchakata. Viendelezi vya kivinjari au kifaa kilichoathiriwa husalia nje ya udhibiti wa zana hii.",
    "fields": {
      "mode": "Kitendo",
      "encryptMode": "Simba kwa njia fiche",
      "decryptMode": "Simbua",
      "dataMode": "Aina ya maudhui",
      "textMode": "Maandishi",
      "fileMode": "Faili",
      "password": "Nenosiri",
      "passwordHint": "Tumia kaulisiri ndefu na ya kipekee (herufi 16 au zaidi ni bora). Haijahifadhiwa au kurejeshwa.",
      "sourceText": "Maandishi au bahasha iliyosimbwa kwa njia fiche ya JSON",
      "sourceFile": "Chagua faili au chombo cha UsefulVerse .uvenc",
      "iterations": "Marudio ya PBKDF2-HMAC-SHA-256",
      "iterationsValue": "600,000 (isiyobadilika)",
      "accuracyNote": "Zana ya kivinjari cha ndani, si ukaguzi wa usalama au dhamana dhidi ya programu hasidi, vifaa vilivyoathiriwa au kaulisiri dhaifu. Maandishi yamezuiwa kwa MiB 1 na faili hadi MiB 16 ili kufunga kumbukumbu ya kivinjari. Kupoteza kaulisiri hufanya usimbuaji usiwezekane. Weka nakala tofauti na usimbuaji wa jaribio kabla ya kutegemea faili iliyosimbwa.",
      "resultHeading": "Matokeo",
      "resultText": "Bahasha iliyosimbwa kwa njia fiche au maandishi yaliyosimbwa",
      "fileResult": "Faili iliyosimbwa kwa njia fiche au iliyosimbwa",
      "fileNameNote": "Jina la faili asili na aina ya yaliyomo huhifadhiwa kwenye kichwa cha faili iliyosimbwa."
    },
    "actions": {
      "process": "Simba kwa njia fiche",
      "example": "Pakia mfano wa maandishi",
      "copy": "Nakili matokeo",
      "download": "Pakua matokeo",
      "result": "Matokeo ya usimbaji fiche"
    },
    "messages": {
      "encrypted": "Usimbaji fiche umekamilika. Hifadhi matokeo na uweke kaulisiri yako salama.",
      "decrypted": "Uthibitishaji umepitishwa. Usimbuaji umekamilika.",
      "working": "Inachakata kwenye kivinjari hiki. Hii inaweza kuchukua muda kwenye baadhi ya vifaa.",
      "checkInputs": "Angalia kitendo, aina ya maudhui, kaulisiri na ingizo.",
      "wrongOrDamaged": "Usimbuaji haukufaulu: kaulisiri inaweza kuwa si sahihi au data iliyosimbwa inaweza kuwa imebadilika.",
      "unsupportedCrypto": "Secure Web Crypto haipatikani. Tumia kivinjari kinachotumika kupitia HTTPS.",
      "fileTooLarge": "Maudhui yaliyochaguliwa yanazidi kikomo cha ukubwa wa kifaa hiki.",
      "copied": "Matokeo yamenakiliwa.",
      "copyUnavailable": "Nakala haipatikani katika kivinjari hiki.",
      "downloaded": "Pakua tayari."
    },
    "additionalFaqs": [
      {
        "question": "Je, ninaweza kurejesha faili nikisahau neno la siri?",
        "answer": "Hapana. Hakuna akaunti, ufunguo wa kurejesha akaunti au kuweka upya huduma. Weka kauli ya siri kando na uthibitishe usimbaji fiche wa jaribio kabla ya kufuta au kubadilisha ya awali."
      },
      {
        "question": "Kwa nini neno la siri lisilo sahihi linaonyesha hitilafu?",
        "answer": "AES-GCM inathibitisha maandishi ya siri. Ikiwa kaulisiri si sahihi au data ilibadilishwa, uthibitishaji hautafaulu na zana hairejeshi maandishi wazi."
      },
      {
        "question": "Je, huu ni mfumo salama uliokaguliwa au uliohakikishwa?",
        "answer": "Hapana. Inatumia kivinjari Web Crypto API, lakini ukurasa huu si ukaguzi huru au hakikisho dhidi ya programu hasidi, viendelezi visivyo salama, kaulisiri dhaifu, vifaa vilivyoathiriwa au nakala rudufu zilizopotea."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "mr": {
    "copyLanguage": "mr",
    "name": "AES एन्क्रिप्शन साधन",
    "title": "AES एन्क्रिप्शन टूल | UsefulVerse",
    "description": "AES-256-GCM सह स्थानिक पातळीवर मजकूर आणि लहान फाइल्स कूटबद्ध किंवा डिक्रिप्ट करा. कोणतेही अपलोड, खाते किंवा एन्क्रिप्शन API नाही.",
    "intro": "या ब्राउझरमध्ये मजकूर किंवा फाइल्स कूटबद्ध करा किंवा या साधनाद्वारे बनवलेले कंटेनर डिक्रिप्ट करा. प्रमाणीकृत AES-GCM असत्यापित प्लेन टेक्स्ट परत करण्याऐवजी चुकीचा सांकेतिक वाक्यांश किंवा बदललेला डेटा नाकारतो.",
    "howQuestion": "हे AES एन्क्रिप्शन टूल कसे कार्य करते?",
    "howAnswer": "हे PBKDF2-HMAC-SHA-256 सह तुमच्या सांकेतिक वाक्यांशातून 256-बिट की मिळवते, नंतर नवीन यादृच्छिक मीठ आणि नॉन्ससह AES-256-GCM वापरते. मजकूर लिफाफा किंवा बायनरी फाइल कंटेनरमध्ये फक्त अल्गोरिदम पॅरामीटर्स आणि सिफरटेक्स्ट साठवले जातात, सांकेतिक वाक्यांश कधीही नाही.",
    "privacyQuestion": "माझे सांकेतिक वाक्यांश किंवा फाइल अपलोड केल्या आहेत?",
    "privacyAnswer": "नाही. वेब क्रिप्टो या ब्राउझरमध्ये कार्य करते. पृष्ठ तुमचा सांकेतिक वाक्यांश, साधा मजकूर, एनक्रिप्टेड डेटा किंवा निवडलेली फाइल प्रोसेसिंग सर्व्हरला पाठवत नाही. ब्राउझर विस्तार किंवा तडजोड केलेले डिव्हाइस या साधनाच्या नियंत्रणाबाहेर राहतात.",
    "fields": {
      "mode": "कृती",
      "encryptMode": "एनक्रिप्ट करा",
      "decryptMode": "डिक्रिप्ट करा",
      "dataMode": "सामग्री प्रकार",
      "textMode": "मजकूर",
      "fileMode": "फाईल",
      "password": "सांकेतिक वाक्यांश",
      "passwordHint": "एक लांब, अद्वितीय सांकेतिक वाक्यांश वापरा (16 किंवा अधिक वर्ण चांगले). ते जतन किंवा पुनर्प्राप्त करण्यायोग्य नाही.",
      "sourceText": "मजकूर किंवा एन्क्रिप्ट केलेला JSON लिफाफा",
      "sourceFile": "फाइल किंवा UsefulVerse .uvenc कंटेनर निवडा",
      "iterations": "PBKDF2-HMAC-SHA-256 पुनरावृत्ती",
      "iterationsValue": "600,000 (निश्चित)",
      "accuracyNote": "स्थानिक-ब्राउझर साधन, सुरक्षा ऑडिट किंवा मालवेअर, तडजोड केलेली उपकरणे किंवा कमकुवत सांकेतिक वाक्यांश विरुद्ध हमी नाही. मजकूर 1 MiB पर्यंत मर्यादित आहे आणि फायली 16 MiB पर्यंत ब्राउझर मेमरीसाठी मर्यादित आहेत. सांकेतिक वाक्यांश गमावल्याने डिक्रिप्शन अशक्य होते. एनक्रिप्टेड फाईलवर अवलंबून राहण्यापूर्वी वेगळा बॅकअप आणि चाचणी डिक्रिप्शन ठेवा.",
      "resultHeading": "परिणाम",
      "resultText": "एन्क्रिप्टेड लिफाफा किंवा डिक्रिप्ट केलेला मजकूर",
      "fileResult": "एनक्रिप्टेड किंवा डिक्रिप्टेड फाइल",
      "fileNameNote": "मूळ फाइलनाव आणि सामग्री प्रकार एनक्रिप्टेड फाइल शीर्षलेख मध्ये संग्रहित आहेत."
    },
    "actions": {
      "process": "एनक्रिप्ट करा",
      "example": "मजकूर उदाहरण लोड करा",
      "copy": "निकाल कॉपी करा",
      "download": "निकाल डाउनलोड करा",
      "result": "कूटबद्धीकरण परिणाम"
    },
    "messages": {
      "encrypted": "कूटबद्धीकरण पूर्ण. निकाल जतन करा आणि तुमचा सांकेतिक वाक्यांश सुरक्षित ठेवा.",
      "decrypted": "प्रमाणीकरण पास झाले. डिक्रिप्शन पूर्ण.",
      "working": "या ब्राउझरमध्ये स्थानिक पातळीवर प्रक्रिया करत आहे. काही डिव्हाइसेसवर यास थोडा वेळ लागू शकतो.",
      "checkInputs": "क्रिया, सामग्री प्रकार, सांकेतिक वाक्यांश आणि इनपुट तपासा.",
      "wrongOrDamaged": "डिक्रिप्शन अयशस्वी: सांकेतिक वाक्यांश चुकीचा असू शकतो किंवा एनक्रिप्ट केलेला डेटा बदलला असू शकतो.",
      "unsupportedCrypto": "सुरक्षित वेब क्रिप्टो अनुपलब्ध आहे. HTTPS वर समर्थित ब्राउझर वापरा.",
      "fileTooLarge": "निवडलेली सामग्री या साधनाची स्थानिक आकार मर्यादा ओलांडते.",
      "copied": "निकाल कॉपी केला.",
      "copyUnavailable": "या ब्राउझरमध्ये कॉपी उपलब्ध नाही.",
      "downloaded": "डाउनलोड तयार."
    },
    "additionalFaqs": [
      {
        "question": "मी सांकेतिक वाक्यांश विसरल्यास मी फाइल पुनर्प्राप्त करू शकतो का?",
        "answer": "नाही. कोणतेही खाते, पुनर्प्राप्ती की किंवा रीसेट सेवा नाही. सांकेतिक वाक्यांश वेगळे ठेवा आणि मूळ हटवण्यापूर्वी किंवा पुनर्स्थित करण्यापूर्वी चाचणी डिक्रिप्शन सत्यापित करा."
      },
      {
        "question": "चुकीचा सांकेतिक वाक्यांश एरर का दाखवतो?",
        "answer": "AES-GCM सिफर टेक्स्ट ऑथेंटिकेट करते. सांकेतिक वाक्यांश चुकीचा असल्यास किंवा डेटा बदलला असल्यास, प्रमाणीकरण अयशस्वी होते आणि साधन कोणताही साधा मजकूर देत नाही."
      },
      {
        "question": "ही ऑडिट केलेली किंवा हमी दिलेली सुरक्षित प्रणाली आहे का?",
        "answer": "नाही. हे ब्राउझर वेब क्रिप्टो API वापरते, परंतु हे पृष्ठ स्वतंत्र ऑडिट किंवा मालवेअर, असुरक्षित विस्तार, कमकुवत सांकेतिक वाक्यांश, तडजोड केलेली उपकरणे किंवा गमावलेल्या बॅकअप विरुद्ध हमी नाही."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "te": {
    "copyLanguage": "te",
    "name": "AES గుప్తీకరణ సాధనం",
    "title": "AES ఎన్‌క్రిప్షన్ టూల్ | UsefulVerse",
    "description": "AES-256-GCMతో స్థానికంగా టెక్స్ట్ మరియు చిన్న ఫైల్‌లను ఎన్‌క్రిప్ట్ చేయండి లేదా డీక్రిప్ట్ చేయండి. అప్‌లోడ్, ఖాతా లేదా ఎన్‌క్రిప్షన్ API లేదు.",
    "intro": "ఈ బ్రౌజర్‌లో టెక్స్ట్ లేదా ఫైల్‌లను గుప్తీకరించండి లేదా ఈ సాధనం ద్వారా తయారు చేయబడిన కంటైనర్‌ను డీక్రిప్ట్ చేయండి. ప్రామాణీకరించబడిన AES-GCM ధృవీకరించని సాదా వచనాన్ని తిరిగి ఇచ్చే బదులు తప్పు పాస్‌ఫ్రేజ్ లేదా మార్చబడిన డేటాను తిరస్కరిస్తుంది.",
    "howQuestion": "ఈ AES ఎన్‌క్రిప్షన్ సాధనం ఎలా పని చేస్తుంది?",
    "howAnswer": "ఇది PBKDF2-HMAC-SHA-256తో మీ పాస్‌ఫ్రేజ్ నుండి 256-బిట్ కీని పొందుతుంది, ఆపై కొత్త యాదృచ్ఛిక ఉప్పు మరియు నాన్‌స్‌తో AES-256-GCMని ఉపయోగిస్తుంది. టెక్స్ట్ ఎన్వలప్ లేదా బైనరీ ఫైల్ కంటైనర్ అల్గోరిథం పారామితులు మరియు సాంకేతికలిపిని మాత్రమే నిల్వ చేస్తుంది, పాస్‌ఫ్రేజ్‌ని ఎప్పుడూ నిల్వ చేయదు.",
    "privacyQuestion": "నా పాస్‌ఫ్రేజ్ లేదా ఫైల్‌లు అప్‌లోడ్ చేయబడి ఉన్నాయా?",
    "privacyAnswer": "లేదు. వెబ్ క్రిప్టో ఈ బ్రౌజర్‌లో పనిని నిర్వహిస్తుంది. పేజీ మీ పాస్‌ఫ్రేజ్, సాదా వచనం, గుప్తీకరించిన డేటా లేదా ఎంచుకున్న ఫైల్‌ను ప్రాసెసింగ్ సర్వర్‌కు పంపదు. బ్రౌజర్ పొడిగింపులు లేదా రాజీపడిన పరికరం ఈ సాధనం నియంత్రణకు వెలుపల ఉంటాయి.",
    "fields": {
      "mode": "చర్య",
      "encryptMode": "ఎన్‌క్రిప్ట్ చేయండి",
      "decryptMode": "డీక్రిప్ట్ చేయండి",
      "dataMode": "కంటెంట్ రకం",
      "textMode": "వచనం",
      "fileMode": "ఫైల్",
      "password": "సంకేతపదం",
      "passwordHint": "పొడవైన, ప్రత్యేకమైన పాస్‌ఫ్రేజ్‌ని ఉపయోగించండి (16 లేదా అంతకంటే ఎక్కువ అక్షరాలు ఉత్తమం). ఇది సేవ్ చేయబడదు లేదా పునరుద్ధరించబడదు.",
      "sourceText": "టెక్స్ట్ లేదా ఎన్‌క్రిప్టెడ్ JSON ఎన్వలప్",
      "sourceFile": "ఫైల్ లేదా UsefulVerse .uvenc కంటైనర్‌ను ఎంచుకోండి",
      "iterations": "PBKDF2-HMAC-SHA-256 పునరావృత్తులు",
      "iterationsValue": "600,000 (స్థిరమైనది)",
      "accuracyNote": "స్థానిక-బ్రౌజర్ సాధనం, మాల్వేర్, రాజీపడిన పరికరాలు లేదా బలహీనమైన పాస్‌ఫ్రేజ్‌లకు వ్యతిరేకంగా భద్రతా ఆడిట్ లేదా హామీ కాదు. వచనం 1 MiBకి మరియు ఫైల్‌లు 16 MiBకి పరిమిత బ్రౌజర్ మెమరీకి పరిమితం చేయబడింది. పాస్‌ఫ్రేజ్‌ని కోల్పోవడం వలన డిక్రిప్షన్ అసాధ్యం అవుతుంది. గుప్తీకరించిన ఫైల్‌పై ఆధారపడే ముందు ప్రత్యేక బ్యాకప్ మరియు టెస్ట్ డీక్రిప్షన్‌ను ఉంచండి.",
      "resultHeading": "ఫలితం",
      "resultText": "ఎన్‌క్రిప్టెడ్ ఎన్వలప్ లేదా డీక్రిప్టెడ్ టెక్స్ట్",
      "fileResult": "ఎన్క్రిప్టెడ్ లేదా డీక్రిప్టెడ్ ఫైల్",
      "fileNameNote": "అసలు ఫైల్ పేరు మరియు కంటెంట్ రకం గుప్తీకరించిన ఫైల్ హెడర్‌లో నిల్వ చేయబడతాయి."
    },
    "actions": {
      "process": "ఎన్‌క్రిప్ట్ చేయండి",
      "example": "వచన ఉదాహరణను లోడ్ చేయండి",
      "copy": "ఫలితాన్ని కాపీ చేయండి",
      "download": "డౌన్‌లోడ్ ఫలితం",
      "result": "ఎన్క్రిప్షన్ ఫలితం"
    },
    "messages": {
      "encrypted": "ఎన్‌క్రిప్షన్ పూర్తయింది. ఫలితాన్ని సేవ్ చేయండి మరియు మీ పాస్‌ఫ్రేజ్‌ని సురక్షితంగా ఉంచండి.",
      "decrypted": "ప్రమాణీకరణ ఆమోదించబడింది. డిక్రిప్షన్ పూర్తయింది.",
      "working": "ఈ బ్రౌజర్‌లో స్థానికంగా ప్రాసెస్ చేస్తోంది. కొన్ని పరికరాలలో దీనికి కొంత సమయం పట్టవచ్చు.",
      "checkInputs": "చర్య, కంటెంట్ రకం, పాస్‌ఫ్రేజ్ మరియు ఇన్‌పుట్‌ను తనిఖీ చేయండి.",
      "wrongOrDamaged": "డిక్రిప్షన్ విఫలమైంది: పాస్‌ఫ్రేజ్ తప్పు కావచ్చు లేదా ఎన్‌క్రిప్ట్ చేసిన డేటా మారి ఉండవచ్చు.",
      "unsupportedCrypto": "సురక్షిత వెబ్ క్రిప్టో అందుబాటులో లేదు. HTTPS ద్వారా మద్దతు ఉన్న బ్రౌజర్‌ని ఉపయోగించండి.",
      "fileTooLarge": "ఎంచుకున్న కంటెంట్ ఈ సాధనం యొక్క స్థానిక పరిమాణ పరిమితిని మించిపోయింది.",
      "copied": "ఫలితం కాపీ చేయబడింది.",
      "copyUnavailable": "ఈ బ్రౌజర్‌లో కాపీ అందుబాటులో లేదు.",
      "downloaded": "డౌన్‌లోడ్ సిద్ధంగా ఉంది."
    },
    "additionalFaqs": [
      {
        "question": "నేను పాస్‌ఫ్రేజ్‌ను మరచిపోయినట్లయితే నేను ఫైల్‌ను పునరుద్ధరించవచ్చా?",
        "answer": "సంఖ్య. ఖాతా, పునరుద్ధరణ కీ లేదా రీసెట్ సేవ లేదు. పాస్‌ఫ్రేజ్‌ని విడిగా ఉంచండి మరియు అసలైనదాన్ని తొలగించడానికి లేదా భర్తీ చేయడానికి ముందు పరీక్ష డీక్రిప్షన్‌ను ధృవీకరించండి."
      },
      {
        "question": "తప్పు పాస్‌ఫ్రేజ్ ఎందుకు లోపాన్ని చూపుతుంది?",
        "answer": "AES-GCM సాంకేతికలిపిని ప్రమాణీకరిస్తుంది. పాస్‌ఫ్రేజ్ తప్పుగా ఉంటే లేదా డేటా మార్చబడితే, ప్రామాణీకరణ విఫలమవుతుంది మరియు సాధనం సాదా వచనాన్ని అందించదు."
      },
      {
        "question": "ఇది ఆడిట్ చేయబడిన లేదా హామీ ఇవ్వబడిన సురక్షిత వ్యవస్థనా?",
        "answer": "లేదు. ఇది బ్రౌజర్ వెబ్ క్రిప్టో APIని ఉపయోగిస్తుంది, అయితే ఈ పేజీ స్వతంత్ర ఆడిట్ లేదా మాల్వేర్, అసురక్షిత పొడిగింపులు, బలహీనమైన పాస్‌ఫ్రేజ్‌లు, రాజీపడిన పరికరాలు లేదా కోల్పోయిన బ్యాకప్‌లకు వ్యతిరేకంగా హామీ కాదు."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "ha": {
    "copyLanguage": "ha",
    "name": "Kayan aikin ɓoye AES",
    "title": "Kayan aikin ɓoye AES | UsefulVerse",
    "description": "Rufe ko ɓoye rubutu da ƙananan fayiloli a cikin gida tare da AES-256-GCM. Babu lodawa, lissafi ko ɓoyewa API.",
    "intro": "Rufe rubuto ko fayiloli a cikin wannan mazuruftar, ko kuma lalata wani akwati da wannan kayan aikin ya yi. Ingantacciyar AES-GCM tana ƙin kalmar wucewa mara kyau ko bayanan da aka canza maimakon dawo da bayanan da ba a tantance ba.",
    "howQuestion": "Ta yaya wannan kayan aikin ɓoye AES ke aiki?",
    "howAnswer": "Yana samun maɓallin 256-bit daga kalmar wucewar ku tare da PBKDF2-HMAC-SHA-256, sannan yana amfani da AES-256-GCM tare da sabon gishiri bazuwar ba. Ambulaf ɗin rubutu ko kwandon fayil ɗin binary yana adana sigogin algorithm da rubutu kawai, ba kalmar wucewa ba.",
    "privacyQuestion": "Ana loda kalmar wucewa ta ko fayiloli?",
    "privacyAnswer": "A'a. Yanar gizo Crypto yana yin aikin a cikin wannan mai binciken. Shafin baya aika kalmar wucewar ku, bayyananniyar rubutu, rufaffen bayanai ko fayil ɗin da aka zaɓa zuwa uwar garken sarrafawa. Ƙwararren mai bincike ko na'urar da ba ta dace ba sun kasance a wajen ikon wannan kayan aikin.",
    "fields": {
      "mode": "Aiki",
      "encryptMode": "Rufewa",
      "decryptMode": "Rushe",
      "dataMode": "Nau'in abun ciki",
      "textMode": "Rubutu",
      "fileMode": "Fayil",
      "password": "Kalmar wucewa",
      "passwordHint": "Yi amfani da dogon kalmar wucewa na musamman (haruffa 16 ko fiye sun fi kyau). Ba a ajiye shi ko maidowa ba.",
      "sourceText": "Rubutu ko rufaffen ambulan JSON",
      "sourceFile": "Zaɓi fayil ko Akwatin UsefulVerse .uvenc",
      "iterations": "Bayanan Bayani na PBKDF2-HMAC-SHA-256",
      "iterationsValue": "600,000 (kafaffen)",
      "accuracyNote": "Kayan aikin mai lilo na gida, ba bincike na tsaro ba ko garanti a kan malware, na'urorin da ba su dace ba ko ƙananan kalmomin wucewa. Rubutu yana iyakance ga 1 MiB da fayiloli zuwa 16 MiB zuwa ɗaure ƙwaƙwalwar ajiya. Rasa kalmar wucewa yana sa ɓarna ba zai yiwu ba. Ajiye keɓanta wariyar ajiya da gwada ɓarnawa kafin dogaro da ɓoyayyen fayil.",
      "resultHeading": "Sakamako",
      "resultText": "Rufaffen ambulan ko ruɓaɓɓen rubutu",
      "fileResult": "Fayil ɗin da aka ɓoye ko ɓoyayye",
      "fileNameNote": "Sunan fayil na asali da nau'in abun ciki ana adana su a cikin rufaffen rubutun fayil ɗin."
    },
    "actions": {
      "process": "Rufewa",
      "example": "Load misali rubutu",
      "copy": "Kwafi sakamakon",
      "download": "Zazzage sakamakon",
      "result": "Sakamakon boye-boye"
    },
    "messages": {
      "encrypted": "Rufewa ya cika. Ajiye sakamakon kuma kiyaye kalmar wucewar ku.",
      "decrypted": "Tabbatarwa ya wuce. An gama ɓarnawa.",
      "working": "Ana aiwatarwa a cikin gida a cikin wannan burauzar. Wannan na iya ɗaukar ɗan lokaci akan wasu na'urori.",
      "checkInputs": "Bincika aikin, nau'in abun ciki, kalmar wucewa da shigarwar.",
      "wrongOrDamaged": "Rufewa ya kasa: kalmar wucewar na iya zama kuskure ko kuma rufaffen bayanan sun canza.",
      "unsupportedCrypto": "Amintaccen Yanar Gizo Crypto babu samuwa. Yi amfani da mai bincike mai goyan baya akan HTTPS.",
      "fileTooLarge": "Abubuwan da aka zaɓa sun wuce iyakar girman gida na wannan kayan aiki.",
      "copied": "An kwafi sakamakon.",
      "copyUnavailable": "Babu kwafi a cikin wannan burauzar.",
      "downloaded": "Zazzage shirye."
    },
    "additionalFaqs": [
      {
        "question": "Zan iya dawo da fayil idan na manta kalmar wucewa?",
        "answer": "A'a. Babu asusu, maɓallin dawowa ko sabis na sake saiti. Kiyaye kalmar wucewa daban kuma tabbatar da ɓoye bayanan gwaji kafin sharewa ko musanya ainihin."
      },
      {
        "question": "Me yasa kalmar wucewa mara kyau ke nuna kuskure?",
        "answer": "AES-GCM yana tabbatar da rubutun. Idan kalmar wucewa ba daidai ba ne ko kuma an canza bayanan, tantancewar ta gaza kuma kayan aikin ba su dawo da bayyananniyar rubutu ba."
      },
      {
        "question": "Shin wannan tsarin tsaro ne da aka tantance ko kuma garanti?",
        "answer": "A'a. Yana amfani da mashigar yanar gizo Crypto API, amma wannan shafin ba bincike ba ne mai zaman kansa ko garanti game da malware, kari mara lafiya, raunin kalmomin wucewa, na'urorin da ba su dace ba ko madogarawa da suka ɓace."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "tl": {
    "copyLanguage": "tl",
    "name": "Tool sa pag-encrypt ng AES",
    "title": "AES Encryption Tool | UsefulVerse",
    "description": "I-encrypt o i-decrypt ang text at maliliit na file nang lokal gamit ang AES-256-GCM. Walang upload, account o encryption API.",
    "intro": "I-encrypt ang text o mga file sa browser na ito, o i-decrypt ang isang container na ginawa ng tool na ito. Tinatanggihan ng authenticated AES-GCM ang isang maling passphrase o binagong data sa halip na ibalik ang hindi na-verify na plaintext.",
    "howQuestion": "Paano gumagana ang tool sa pag-encrypt ng AES na ito?",
    "howAnswer": "Nakukuha nito ang 256-bit na key mula sa iyong passphrase na may PBKDF2-HMAC-SHA-256, pagkatapos ay gumagamit ng AES-256-GCM na may bagong random na asin at nonce. Ang text envelope o binary file container ay nag-iimbak lamang ng mga parameter ng algorithm at ciphertext, hindi ang passphrase.",
    "privacyQuestion": "Na-upload ba ang aking passphrase o mga file?",
    "privacyAnswer": "Hindi. Ginagawa ng Web Crypto ang gawain sa browser na ito. Hindi ipinapadala ng page ang iyong passphrase, plaintext, naka-encrypt na data o napiling file sa isang server sa pagpoproseso. Ang mga extension ng browser o isang nakompromisong device ay nananatili sa labas ng kontrol ng tool na ito.",
    "fields": {
      "mode": "Aksyon",
      "encryptMode": "I-encrypt",
      "decryptMode": "I-decrypt",
      "dataMode": "Uri ng nilalaman",
      "textMode": "Text",
      "fileMode": "file",
      "password": "Passphrase",
      "passwordHint": "Gumamit ng mahaba at natatanging passphrase (mas maganda ang 16 o higit pang character). Hindi ito nai-save o mababawi.",
      "sourceText": "Text o naka-encrypt na JSON na sobre",
      "sourceFile": "Pumili ng file o UsefulVerse .uvenc container",
      "iterations": "Mga pag-ulit ng PBKDF2-HMAC-SHA-256",
      "iterationsValue": "600,000 (naayos)",
      "accuracyNote": "Tool ng lokal na browser, hindi isang pag-audit ng seguridad o garantiya laban sa malware, mga nakompromisong device o mahihinang passphrase. Limitado ang text sa 1 MiB at mga file sa 16 MiB sa nakatali na memorya ng browser. Ang pagkawala ng passphrase ay ginagawang imposible ang pag-decryption. Panatilihin ang isang hiwalay na backup at pagsubok na decryption bago umasa sa isang naka-encrypt na file.",
      "resultHeading": "Resulta",
      "resultText": "Naka-encrypt na sobre o naka-decrypt na teksto",
      "fileResult": "Naka-encrypt o naka-decrypt na file",
      "fileNameNote": "Ang orihinal na filename at uri ng nilalaman ay naka-imbak sa naka-encrypt na header ng file."
    },
    "actions": {
      "process": "I-encrypt",
      "example": "Mag-load ng halimbawa ng teksto",
      "copy": "Kopyahin ang resulta",
      "download": "I-download ang resulta",
      "result": "Resulta ng pag-encrypt"
    },
    "messages": {
      "encrypted": "Kumpleto na ang pag-encrypt. I-save ang resulta at panatilihing ligtas ang iyong passphrase.",
      "decrypted": "Lumipas ang pagpapatunay. Kumpleto na ang pag-decryption.",
      "working": "Pinoproseso nang lokal sa browser na ito. Maaaring tumagal ito ng ilang sandali sa ilang device.",
      "checkInputs": "Suriin ang aksyon, uri ng nilalaman, passphrase at input.",
      "wrongOrDamaged": "Nabigo ang pag-decryption: maaaring mali ang passphrase o maaaring nagbago ang naka-encrypt na data.",
      "unsupportedCrypto": "Hindi available ang Secure Web Crypto. Gumamit ng suportadong browser sa HTTPS.",
      "fileTooLarge": "Ang napiling nilalaman ay lumampas sa limitasyon ng lokal na laki ng tool na ito.",
      "copied": "Nakopya ang resulta.",
      "copyUnavailable": "Hindi available ang kopya sa browser na ito.",
      "downloaded": "Handa na ang pag-download."
    },
    "additionalFaqs": [
      {
        "question": "Maaari ba akong mabawi ang isang file kung nakalimutan ko ang passphrase?",
        "answer": "Hindi. Walang account, recovery key o serbisyo sa pag-reset. Panatilihin nang hiwalay ang passphrase at i-verify ang isang pagsubok na decryption bago tanggalin o palitan ang orihinal."
      },
      {
        "question": "Bakit nagpapakita ng error ang isang maling passphrase?",
        "answer": "Ang AES-GCM ay nagpapatotoo sa ciphertext. Kung mali ang passphrase o binago ang data, mabibigo ang pagpapatotoo at walang ibabalik na plaintext ang tool."
      },
      {
        "question": "Ito ba ay isang na-audit o garantisadong secure na sistema?",
        "answer": "Hindi. Gumagamit ito ng browser na Web Crypto API, ngunit ang page na ito ay hindi isang independiyenteng pag-audit o isang garantiya laban sa malware, hindi ligtas na mga extension, mahihinang passphrase, nakompromiso na mga device o mga nawalang backup."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "ta": {
    "copyLanguage": "ta",
    "name": "AES குறியாக்க கருவி",
    "title": "AES குறியாக்கக் கருவி | UsefulVerse",
    "description": "AES-256-GCM மூலம் உள்நாட்டில் உரை மற்றும் சிறிய கோப்புகளை குறியாக்கம் செய்யவும் அல்லது மறைகுறியாக்கவும். பதிவேற்றம், கணக்கு அல்லது குறியாக்க API இல்லை.",
    "intro": "இந்த உலாவியில் உரை அல்லது கோப்புகளை என்க்ரிப்ட் செய்யவும் அல்லது இந்தக் கருவியால் உருவாக்கப்பட்ட கண்டெய்னரை மறைகுறியாக்கவும். அங்கீகரிக்கப்பட்ட AES-GCM ஆனது தவறான கடவுச்சொற்றொடரை அல்லது மாற்றப்பட்ட தரவை சரிபார்க்காத எளிய உரையை வழங்குவதற்குப் பதிலாக நிராகரிக்கிறது.",
    "howQuestion": "இந்த AES குறியாக்க கருவி எப்படி வேலை செய்கிறது?",
    "howAnswer": "இது PBKDF2-HMAC-SHA-256 உடன் உங்கள் கடவுச்சொற்றொடரிலிருந்து 256-பிட் விசையைப் பெறுகிறது, பின்னர் AES-256-GCM ஐப் புதிய ரேண்டம் உப்புடன் பயன்படுத்துகிறது. உரை உறை அல்லது பைனரி கோப்பு கொள்கலன் அல்காரிதம் அளவுருக்கள் மற்றும் மறைக்குறியீட்டை மட்டுமே சேமிக்கிறது, கடவுச்சொற்றொடர் அல்ல.",
    "privacyQuestion": "எனது கடவுச்சொற்றொடரோ கோப்புகளோ பதிவேற்றப்பட்டதா?",
    "privacyAnswer": "இல்லை. இந்த உலாவியில் Web Crypto வேலை செய்கிறது. பக்கம் உங்கள் கடவுச்சொற்றொடர், எளிய உரை, மறைகுறியாக்கப்பட்ட தரவு அல்லது தேர்ந்தெடுக்கப்பட்ட கோப்பை செயலாக்க சேவையகத்திற்கு அனுப்பாது. உலாவி நீட்டிப்புகள் அல்லது சமரசம் செய்யப்பட்ட சாதனம் இந்தக் கருவியின் கட்டுப்பாட்டிற்கு வெளியே இருக்கும்.",
    "fields": {
      "mode": "செயல்",
      "encryptMode": "குறியாக்கம்",
      "decryptMode": "மறைகுறியாக்கம்",
      "dataMode": "உள்ளடக்க வகை",
      "textMode": "உரை",
      "fileMode": "கோப்பு",
      "password": "கடவுச்சொற்றொடர்",
      "passwordHint": "நீளமான, தனித்துவமான கடவுச்சொற்றொடரைப் பயன்படுத்தவும் (16 அல்லது அதற்கு மேற்பட்ட எழுத்துகள் சிறந்தது). இது சேமிக்கப்படவில்லை அல்லது மீட்டெடுக்க முடியாது.",
      "sourceText": "உரை அல்லது மறைகுறியாக்கப்பட்ட JSON உறை",
      "sourceFile": "ஒரு கோப்பை அல்லது UsefulVerse .uvenc கொள்கலனைத் தேர்வு செய்யவும்",
      "iterations": "PBKDF2-HMAC-SHA-256 மறு செய்கைகள்",
      "iterationsValue": "600,000 (நிலையானது)",
      "accuracyNote": "உள்ளூர் உலாவி கருவி, மால்வேர், சமரசம் செய்யப்பட்ட சாதனங்கள் அல்லது பலவீனமான கடவுச்சொற்களுக்கு எதிரான பாதுகாப்பு தணிக்கை அல்லது உத்தரவாதம் அல்ல. உலாவி நினைவகத்தை இணைக்க உரை 1 MiB ஆகவும் கோப்புகள் 16 MiB ஆகவும் வரையறுக்கப்பட்டுள்ளது. கடவுச்சொற்றொடரை இழப்பது மறைகுறியாக்கத்தை சாத்தியமற்றதாக்குகிறது. மறைகுறியாக்கப்பட்ட கோப்பை நம்புவதற்கு முன், தனி காப்புப்பிரதி மற்றும் சோதனை மறைகுறியாக்கத்தை வைத்திருங்கள்.",
      "resultHeading": "முடிவு",
      "resultText": "மறைகுறியாக்கப்பட்ட உறை அல்லது மறைகுறியாக்கப்பட்ட உரை",
      "fileResult": "மறைகுறியாக்கப்பட்ட அல்லது மறைகுறியாக்கப்பட்ட கோப்பு",
      "fileNameNote": "அசல் கோப்பு பெயர் மற்றும் உள்ளடக்க வகை மறைகுறியாக்கப்பட்ட கோப்பு தலைப்பில் சேமிக்கப்படும்."
    },
    "actions": {
      "process": "குறியாக்கம்",
      "example": "உரை உதாரணத்தை ஏற்றவும்",
      "copy": "முடிவை நகலெடுக்கவும்",
      "download": "பதிவிறக்க முடிவு",
      "result": "குறியாக்க முடிவு"
    },
    "messages": {
      "encrypted": "குறியாக்கம் முடிந்தது. முடிவைச் சேமித்து, உங்கள் கடவுச்சொற்றொடரைப் பாதுகாப்பாக வைத்திருங்கள்.",
      "decrypted": "அங்கீகாரம் நிறைவேற்றப்பட்டது. மறைகுறியாக்கம் முடிந்தது.",
      "working": "இந்த உலாவியில் உள்நாட்டில் செயலாக்கப்படுகிறது. சில சாதனங்களில் இதற்கு சிறிது நேரம் ஆகலாம்.",
      "checkInputs": "செயல், உள்ளடக்க வகை, கடவுச்சொற்றொடர் மற்றும் உள்ளீடு ஆகியவற்றைச் சரிபார்க்கவும்.",
      "wrongOrDamaged": "மறைகுறியாக்கம் தோல்வியடைந்தது: கடவுச்சொற்றொடர் தவறாக இருக்கலாம் அல்லது மறைகுறியாக்கப்பட்ட தரவு மாறியிருக்கலாம்.",
      "unsupportedCrypto": "பாதுகாப்பான வலை கிரிப்டோ கிடைக்கவில்லை. HTTPS மூலம் ஆதரிக்கப்படும் உலாவியைப் பயன்படுத்தவும்.",
      "fileTooLarge": "தேர்ந்தெடுக்கப்பட்ட உள்ளடக்கம் இந்தக் கருவியின் உள்ளூர் அளவு வரம்பை மீறுகிறது.",
      "copied": "முடிவு நகலெடுக்கப்பட்டது.",
      "copyUnavailable": "இந்த உலாவியில் நகல் கிடைக்கவில்லை.",
      "downloaded": "பதிவிறக்கம் தயார்."
    },
    "additionalFaqs": [
      {
        "question": "கடவுச்சொற்றொடரை மறந்துவிட்டால், கோப்பை மீட்டெடுக்க முடியுமா?",
        "answer": "இல்லை. கணக்கு, மீட்பு விசை அல்லது மீட்டமைப்பு சேவை எதுவும் இல்லை. கடவுச்சொற்றொடரை தனித்தனியாக வைத்து, அசலை நீக்கும் அல்லது மாற்றும் முன் சோதனை மறைகுறியாக்கத்தைச் சரிபார்க்கவும்."
      },
      {
        "question": "தவறான கடவுச்சொற்றொடர் ஏன் பிழையைக் காட்டுகிறது?",
        "answer": "AES-GCM சைபர் உரையை அங்கீகரிக்கிறது. கடவுச்சொற்றொடர் தவறாக இருந்தால் அல்லது தரவு மாற்றப்பட்டால், அங்கீகாரம் தோல்வியடையும் மற்றும் கருவி எந்த எளிய உரையையும் தராது."
      },
      {
        "question": "இது தணிக்கை செய்யப்பட்ட அல்லது உத்தரவாதம் அளிக்கப்பட்ட பாதுகாப்பான அமைப்பா?",
        "answer": "இல்லை. இது உலாவி Web Crypto API ஐப் பயன்படுத்துகிறது, ஆனால் இந்தப் பக்கம் ஒரு சுயாதீன தணிக்கை அல்லது தீம்பொருள், பாதுகாப்பற்ற நீட்டிப்புகள், பலவீனமான கடவுச்சொற்கள், சமரசம் செய்யப்பட்ட சாதனங்கள் அல்லது இழந்த காப்புப்பிரதிகளுக்கு எதிரான உத்தரவாதம் அல்ல."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "fa": {
    "copyLanguage": "fa",
    "name": "ابزار رمزگذاری AES",
    "title": "ابزار رمزگذاری AES | UsefulVerse",
    "description": "متن و فایل های کوچک را به صورت محلی با AES-256-GCM رمزگذاری یا رمزگشایی کنید. بدون آپلود، حساب یا API رمزگذاری.",
    "intro": "متن یا فایل‌ها را در این مرورگر رمزگذاری کنید یا یک ظرف ساخته شده توسط این ابزار را رمزگشایی کنید. AES-GCM احراز هویت شده به جای بازگرداندن متن ساده تأیید نشده، عبارت عبور اشتباه یا داده های تغییر یافته را رد می کند.",
    "howQuestion": "این ابزار رمزگذاری AES چگونه کار می کند؟",
    "howAnswer": "این یک کلید 256 بیتی از عبارت عبور شما با PBKDF2-HMAC-SHA-256 استخراج می کند، سپس از AES-256-GCM با نمک تصادفی جدید و nonce استفاده می کند. پاکت متن یا محفظه فایل باینری فقط پارامترهای الگوریتم و متن رمز را ذخیره می کند و هرگز عبارت عبور را ذخیره نمی کند.",
    "privacyQuestion": "آیا عبارت عبور یا فایل های من آپلود شده است؟",
    "privacyAnswer": "خیر. Web Crypto کار را در این مرورگر انجام می دهد. این صفحه عبارت عبور، متن ساده، داده های رمزگذاری شده یا فایل انتخابی شما را به سرور پردازشگر ارسال نمی کند. برنامه‌های افزودنی مرورگر یا دستگاه آسیب‌دیده خارج از کنترل این ابزار باقی می‌مانند.",
    "fields": {
      "mode": "اقدام",
      "encryptMode": "رمزگذاری کنید",
      "decryptMode": "رمزگشایی",
      "dataMode": "نوع محتوا",
      "textMode": "متن",
      "fileMode": "فایل",
      "password": "عبارت عبور",
      "passwordHint": "از یک عبارت عبور طولانی و منحصر به فرد استفاده کنید (16 کاراکتر یا بیشتر بهتر است). ذخیره یا قابل بازیابی نیست.",
      "sourceText": "متن یا پاکت JSON رمزگذاری شده",
      "sourceFile": "یک فایل یا محفظه UsefulVerse .uvenc را انتخاب کنید",
      "iterations": "تکرارهای PBKDF2-HMAC-SHA-256",
      "iterationsValue": "600000 (ثابت)",
      "accuracyNote": "ابزار مرورگر محلی، نه یک ممیزی امنیتی یا تضمین در برابر بدافزار، دستگاه‌های در معرض خطر یا عبارات عبور ضعیف. متن به 1 مگابایت و فایل ها به 16 مگابایت به حافظه محدود مرورگر محدود شده است. از دست دادن عبارت عبور رمزگشایی را غیرممکن می کند. قبل از تکیه بر یک فایل رمزگذاری شده، یک نسخه پشتیبان جداگانه نگه دارید و رمزگشایی را آزمایش کنید.",
      "resultHeading": "نتیجه",
      "resultText": "پاکت رمزگذاری شده یا متن رمزگشایی شده",
      "fileResult": "فایل رمزگذاری شده یا رمزگشایی شده",
      "fileNameNote": "نام فایل اصلی و نوع محتوا در هدر فایل رمزگذاری شده ذخیره می شود."
    },
    "actions": {
      "process": "رمزگذاری کنید",
      "example": "بارگذاری نمونه متن",
      "copy": "نتیجه را کپی کنید",
      "download": "نتیجه را دانلود کنید",
      "result": "نتیجه رمزگذاری"
    },
    "messages": {
      "encrypted": "رمزگذاری کامل شد. نتیجه را ذخیره کنید و عبارت عبور خود را ایمن نگه دارید.",
      "decrypted": "احراز هویت گذشت. رمزگشایی کامل شد.",
      "working": "در حال پردازش محلی در این مرورگر. این ممکن است در برخی از دستگاه ها یک لحظه طول بکشد.",
      "checkInputs": "عملکرد، نوع محتوا، عبارت عبور و ورودی را بررسی کنید.",
      "wrongOrDamaged": "رمزگشایی انجام نشد: ممکن است عبارت عبور اشتباه باشد یا داده های رمزگذاری شده تغییر کرده باشند.",
      "unsupportedCrypto": "Secure Web Crypto در دسترس نیست. از مرورگر پشتیبانی شده از طریق HTTPS استفاده کنید.",
      "fileTooLarge": "محتوای انتخابی از محدودیت اندازه محلی این ابزار بیشتر است.",
      "copied": "نتیجه کپی شد",
      "copyUnavailable": "کپی در این مرورگر در دسترس نیست.",
      "downloaded": "دانلود آماده است."
    },
    "additionalFaqs": [
      {
        "question": "آیا اگر عبارت عبور را فراموش کنم می توانم یک فایل را بازیابی کنم؟",
        "answer": "خیر. هیچ حساب، کلید بازیابی یا سرویس بازنشانی وجود ندارد. عبارت عبور را جداگانه نگه دارید و قبل از حذف یا جایگزینی نسخه اصلی، رمزگشایی آزمایشی را تأیید کنید."
      },
      {
        "question": "چرا یک عبارت عبور اشتباه نشان دهنده خطا است؟",
        "answer": "AES-GCM متن رمز را احراز هویت می کند. اگر عبارت عبور اشتباه باشد یا داده ها تغییر کرده باشند، احراز هویت با شکست مواجه می شود و ابزار هیچ متن ساده ای را برمی گرداند."
      },
      {
        "question": "آیا این یک سیستم ایمن حسابرسی شده یا تضمین شده است؟",
        "answer": "خیر. از مرورگر Web Crypto API استفاده می‌کند، اما این صفحه یک ممیزی مستقل یا تضمینی در برابر بدافزار، برنامه‌های افزودنی ناایمن، عبارات عبور ضعیف، دستگاه‌های در معرض خطر یا نسخه‌های پشتیبان از دست رفته نیست."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "am": {
    "copyLanguage": "am",
    "name": "የ AES ምስጠራ መሣሪያ",
    "title": "AES ምስጠራ መሣሪያ | UsefulVerse",
    "description": "ጽሑፍን እና ትናንሽ ፋይሎችን በAES-256-GCM ያመስጥሩ ወይም መፍታት። ምንም ሰቀላ፣ መለያ ወይም ምስጠራ ኤፒአይ የለም።",
    "intro": "በዚህ አሳሽ ውስጥ ያሉ ጽሑፎችን ወይም ፋይሎችን ኢንክሪፕት ያድርጉ ወይም በዚህ መሣሪያ የተሰራውን መያዣ ዲክሪፕት ያድርጉ። የተረጋገጠ AES-GCM ያልተረጋገጠ ግልጽ ጽሑፍ ከመመለስ ይልቅ የተሳሳተ የይለፍ ሐረግ ወይም የተቀየረ ውሂብ ውድቅ ያደርጋል።",
    "howQuestion": "ይህ የAES ምስጠራ መሣሪያ እንዴት ነው የሚሰራው?",
    "howAnswer": "ከእርስዎ የይለፍ ሐረግ 256-ቢት ቁልፍ በPBKDF2-HMAC-SHA-256 ያገኛል፣ከዚያም AES-256-GCMን በአዲስ የዘፈቀደ ጨው ይጠቀማል። የጽሑፍ ፖስታ ወይም የሁለትዮሽ ፋይል መያዣ የአልጎሪዝም መለኪያዎችን እና ምስጢራዊ ጽሑፎችን ብቻ ያከማቻል እንጂ የይለፍ ሐረጉን በጭራሽ።",
    "privacyQuestion": "የእኔ የይለፍ ሐረግ ወይም ፋይሎች ተሰቅለዋል?",
    "privacyAnswer": "አይ Web Crypto በዚህ አሳሽ ውስጥ ስራውን ያከናውናል. ገጹ የእርስዎን የይለፍ ሐረግ፣ ግልጽ ጽሑፍ፣ የተመሰጠረ ውሂብ ወይም የተመረጠ ፋይል ወደ ማቀነባበሪያ አገልጋይ አይልክም። የአሳሽ ማራዘሚያዎች ወይም የተበላሸ መሳሪያ ከዚህ መሳሪያ ቁጥጥር ውጭ እንደሆኑ ይቆያሉ።",
    "fields": {
      "mode": "ድርጊት",
      "encryptMode": "ኢንክሪፕት ያድርጉ",
      "decryptMode": "ዲክሪፕት ያድርጉ",
      "dataMode": "የይዘት አይነት",
      "textMode": "ጽሑፍ",
      "fileMode": "ፋይል",
      "password": "የይለፍ ሐረግ",
      "passwordHint": "ረጅም፣ ልዩ የይለፍ ሐረግ ይጠቀሙ (16 ወይም ከዚያ በላይ ቁምፊዎች የተሻለ ነው)። አልተቀመጠም ወይም መልሶ ማግኘት አይቻልም.",
      "sourceText": "ጽሑፍ ወይም የተመሰጠረ JSON ፖስታ",
      "sourceFile": "ፋይል ወይም UsefulVerse .uvenc መያዣ ይምረጡ",
      "iterations": "PBKDF2-HMAC-SHA-256 ድግግሞሾች",
      "iterationsValue": "600,000 (ቋሚ)",
      "accuracyNote": "የአካባቢ አሳሽ መሳሪያ፣ የደህንነት ኦዲት ወይም ማልዌር፣ የተጠቁ መሳሪያዎች ወይም ደካማ የይለፍ ሐረጎች ዋስትና አይደለም። ጽሑፍ በ1 ኤምቢ እና ፋይሎች በ16 ሚቢ የተገደበ የአሳሽ ማህደረ ትውስታ ነው። የይለፍ ሐረጉን ማጣት ዲክሪፕት ማድረግ የማይቻል ያደርገዋል። በተመሰጠረ ፋይል ላይ ከመታመንዎ በፊት የተለየ ምትኬ ያስቀምጡ እና ዲክሪፕት ያድርጉ።",
      "resultHeading": "ውጤት",
      "resultText": "የተመሰጠረ ኤንቨሎፕ ወይም ዲክሪፕት የተደረገ ጽሑፍ",
      "fileResult": "የተመሰጠረ ወይም የተመሰጠረ ፋይል",
      "fileNameNote": "ዋናው የፋይል ስም እና የይዘት አይነት በተመሰጠረ የፋይል ራስጌ ውስጥ ተከማችተዋል።"
    },
    "actions": {
      "process": "ኢንክሪፕት ያድርጉ",
      "example": "የጽሑፍ ምሳሌ ጫን",
      "copy": "ውጤቱን ይቅዱ",
      "download": "የውርድ ውጤት",
      "result": "የምስጠራ ውጤት"
    },
    "messages": {
      "encrypted": "ምስጠራ ተጠናቋል። ውጤቱን ያስቀምጡ እና የይለፍ ሐረግዎን ደህንነት ይጠብቁ።",
      "decrypted": "ማረጋገጫ አልፏል። ዲክሪፕት ማድረግ ተጠናቅቋል።",
      "working": "በዚህ አሳሽ ውስጥ በአገር ውስጥ በመስራት ላይ። ይህ በአንዳንድ መሣሪያዎች ላይ ትንሽ ጊዜ ሊወስድ ይችላል።",
      "checkInputs": "እርምጃውን፣ የይዘቱን አይነት፣ የይለፍ ሐረጉን እና ግቤትን ያረጋግጡ።",
      "wrongOrDamaged": "ዲክሪፕት ማድረግ አልተሳካም፡ የይለፍ ሐረጉ የተሳሳተ ሊሆን ይችላል ወይም የተመሰጠረው ውሂብ ተቀይሮ ሊሆን ይችላል።",
      "unsupportedCrypto": "ደህንነቱ የተጠበቀ ድር Crypto አይገኝም። በ HTTPS ላይ የሚደገፍ አሳሽ ይጠቀሙ።",
      "fileTooLarge": "የተመረጠው ይዘት የዚህን መሳሪያ የአካባቢ መጠን ገደብ አልፏል።",
      "copied": "ውጤት ተቀድቷል።",
      "copyUnavailable": "ቅጂ በዚህ አሳሽ ውስጥ የለም።",
      "downloaded": "ማውረድ ዝግጁ ነው።"
    },
    "additionalFaqs": [
      {
        "question": "የይለፍ ሐረጉን ከረሳሁ ፋይልን መልሼ ማግኘት እችላለሁ?",
        "answer": "አይ ምንም መለያ፣ የመልሶ ማግኛ ቁልፍ ወይም የዳግም ማስጀመሪያ አገልግሎት የለም። የይለፍ ሐረጉን ለየብቻ ያስቀምጡ እና ዋናውን ከመሰረዝዎ ወይም ከመተካትዎ በፊት የሙከራ ዲክሪፕት ያረጋግጡ።"
      },
      {
        "question": "የተሳሳተ የይለፍ ሐረግ ስህተት ለምን ያሳያል?",
        "answer": "AES-GCM ምስጢራዊ ጽሑፉን ያረጋግጣል። የይለፍ ሐረጉ የተሳሳተ ከሆነ ወይም ውሂቡ ከተቀየረ ማረጋገጥ አይሳካም እና መሳሪያው ምንም ግልጽ ጽሑፍ አይመለስም።"
      },
      {
        "question": "ይህ ኦዲት የተደረገ ወይም የተረጋገጠ አስተማማኝ ሥርዓት ነው?",
        "answer": "አይ። አሳሹን ይጠቀማል Web Crypto API፣ ነገር ግን ይህ ገጽ ራሱን የቻለ ኦዲት ወይም ማልዌር፣ደህንነታቸው ያልተጠበቁ ቅጥያዎች፣ደካማ የይለፍ ሐረጎች፣የተጠቁ መሳሪያዎች ወይም የጠፉ መጠባበቂያዎች ዋስትና አይደለም።"
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  },
  "gu": {
    "copyLanguage": "gu",
    "name": "AES એન્ક્રિપ્શન ટૂલ",
    "title": "AES એન્ક્રિપ્શન ટૂલ | UsefulVerse",
    "description": "AES-256-GCM સાથે સ્થાનિક રીતે ટેક્સ્ટ અને નાની ફાઇલોને એન્ક્રિપ્ટ અથવા ડિક્રિપ્ટ કરો. કોઈ અપલોડ, એકાઉન્ટ અથવા એન્ક્રિપ્શન API નથી.",
    "intro": "આ બ્રાઉઝરમાં ટેક્સ્ટ અથવા ફાઇલોને એન્ક્રિપ્ટ કરો અથવા આ ટૂલ દ્વારા બનાવેલા કન્ટેનરને ડિક્રિપ્ટ કરો. પ્રમાણિત AES-GCM વણચકાસાયેલ સાદો લખાણ પરત કરવાને બદલે ખોટા પાસફ્રેઝ અથવા બદલાયેલ ડેટાને નકારે છે.",
    "howQuestion": "આ AES એન્ક્રિપ્શન ટૂલ કેવી રીતે કામ કરે છે?",
    "howAnswer": "તે PBKDF2-HMAC-SHA-256 સાથે તમારા પાસફ્રેઝમાંથી 256-બીટ કી મેળવે છે, પછી નવા રેન્ડમ સોલ્ટ અને નોન્સ સાથે AES-256-GCM નો ઉપયોગ કરે છે. ટેક્સ્ટ પરબિડીયું અથવા બાઈનરી ફાઇલ કન્ટેનર ફક્ત અલ્ગોરિધમ પરિમાણો અને સાઇફરટેક્સ્ટ સ્ટોર કરે છે, પાસફ્રેઝ ક્યારેય નહીં.",
    "privacyQuestion": "શું મારો પાસફ્રેઝ અથવા ફાઇલો અપલોડ કરવામાં આવી છે?",
    "privacyAnswer": "નં. વેબ ક્રિપ્ટો આ બ્રાઉઝરમાં કામ કરે છે. પૃષ્ઠ તમારો પાસફ્રેઝ, સાદો ટેક્સ્ટ, એન્ક્રિપ્ટેડ ડેટા અથવા પસંદ કરેલી ફાઇલને પ્રોસેસિંગ સર્વરને મોકલતું નથી. બ્રાઉઝર એક્સ્ટેંશન અથવા સમાધાન થયેલ ઉપકરણ આ સાધનના નિયંત્રણની બહાર રહે છે.",
    "fields": {
      "mode": "ક્રિયા",
      "encryptMode": "એન્ક્રિપ્ટ",
      "decryptMode": "ડિક્રિપ્ટ",
      "dataMode": "સામગ્રી પ્રકાર",
      "textMode": "ટેક્સ્ટ",
      "fileMode": "ફાઈલ",
      "password": "પાસફ્રેઝ",
      "passwordHint": "લાંબા, અનન્ય પાસફ્રેઝનો ઉપયોગ કરો (16 અથવા વધુ અક્ષરો વધુ સારા છે). તે સાચવવામાં અથવા પુનઃપ્રાપ્ત કરી શકાય તેવું નથી.",
      "sourceText": "ટેક્સ્ટ અથવા એન્ક્રિપ્ટેડ JSON એન્વેલપ",
      "sourceFile": "ફાઇલ અથવા UsefulVerse .uvenc કન્ટેનર પસંદ કરો",
      "iterations": "PBKDF2-HMAC-SHA-256 પુનરાવર્તનો",
      "iterationsValue": "600,000 (નિયત)",
      "accuracyNote": "સ્થાનિક-બ્રાઉઝર ટૂલ, સુરક્ષા ઓડિટ અથવા માલવેર, ચેડાં કરેલા ઉપકરણો અથવા નબળા પાસફ્રેઝ સામે બાંયધરી નથી. બ્રાઉઝર મેમરીને બાઉન્ડ કરવા માટે ટેક્સ્ટ 1 MiB અને ફાઇલો 16 MiB સુધી મર્યાદિત છે. પાસફ્રેઝ ગુમાવવાથી ડિક્રિપ્શન અશક્ય બને છે. એન્ક્રિપ્ટેડ ફાઇલ પર આધાર રાખતા પહેલા એક અલગ બેકઅપ અને ટેસ્ટ ડિક્રિપ્શન રાખો.",
      "resultHeading": "પરિણામ",
      "resultText": "એન્ક્રિપ્ટેડ એન્વલપ અથવા ડિક્રિપ્ટેડ ટેક્સ્ટ",
      "fileResult": "એન્ક્રિપ્ટેડ અથવા ડિક્રિપ્ટેડ ફાઇલ",
      "fileNameNote": "મૂળ ફાઇલનામ અને સામગ્રીનો પ્રકાર એનક્રિપ્ટેડ ફાઇલ હેડરમાં સંગ્રહિત છે."
    },
    "actions": {
      "process": "એન્ક્રિપ્ટ",
      "example": "ટેક્સ્ટનું ઉદાહરણ લોડ કરો",
      "copy": "પરિણામની નકલ કરો",
      "download": "પરિણામ ડાઉનલોડ કરો",
      "result": "એન્ક્રિપ્શન પરિણામ"
    },
    "messages": {
      "encrypted": "એન્ક્રિપ્શન પૂર્ણ. પરિણામ સાચવો અને તમારો પાસફ્રેઝ સુરક્ષિત રાખો.",
      "decrypted": "પ્રમાણીકરણ પસાર થયું. ડિક્રિપ્શન પૂર્ણ.",
      "working": "આ બ્રાઉઝરમાં સ્થાનિક રીતે પ્રક્રિયા કરી રહ્યું છે. કેટલાક ઉપકરણો પર આમાં થોડો સમય લાગી શકે છે.",
      "checkInputs": "ક્રિયા, સામગ્રી પ્રકાર, પાસફ્રેઝ અને ઇનપુટ તપાસો.",
      "wrongOrDamaged": "ડિક્રિપ્શન નિષ્ફળ થયું: પાસફ્રેઝ ખોટો હોઈ શકે છે અથવા એન્ક્રિપ્ટેડ ડેટા બદલાઈ ગયો હોઈ શકે છે.",
      "unsupportedCrypto": "સુરક્ષિત વેબ ક્રિપ્ટો અનુપલબ્ધ છે. HTTPS પર સમર્થિત બ્રાઉઝરનો ઉપયોગ કરો.",
      "fileTooLarge": "પસંદ કરેલ સામગ્રી આ સાધનની સ્થાનિક કદ મર્યાદાને ઓળંગે છે.",
      "copied": "પરિણામની નકલ કરી.",
      "copyUnavailable": "આ બ્રાઉઝરમાં નકલ ઉપલબ્ધ નથી.",
      "downloaded": "ડાઉનલોડ તૈયાર."
    },
    "additionalFaqs": [
      {
        "question": "જો હું પાસફ્રેઝ ભૂલી જાઉં તો શું હું ફાઇલ પુનઃપ્રાપ્ત કરી શકું?",
        "answer": "ના. ત્યાં કોઈ એકાઉન્ટ, પુનઃપ્રાપ્તિ કી અથવા રીસેટ સેવા નથી. પાસફ્રેઝને અલગથી રાખો અને મૂળને કાઢી નાખતા અથવા બદલતા પહેલા ટેસ્ટ ડિક્રિપ્શન ચકાસો."
      },
      {
        "question": "શા માટે ખોટો પાસફ્રેઝ ભૂલ બતાવે છે?",
        "answer": "AES-GCM સાઇફરટેક્સ્ટને પ્રમાણિત કરે છે. જો પાસફ્રેઝ ખોટો હોય અથવા ડેટા બદલાયો હોય, તો પ્રમાણીકરણ નિષ્ફળ જાય છે અને સાધન કોઈ સાદો લખાણ પરત કરતું નથી."
      },
      {
        "question": "શું આ એક ઓડિટેડ અથવા બાંયધરીકૃત સુરક્ષિત સિસ્ટમ છે?",
        "answer": "ના. તે બ્રાઉઝર વેબ ક્રિપ્ટો API નો ઉપયોગ કરે છે, પરંતુ આ પૃષ્ઠ કોઈ સ્વતંત્ર ઓડિટ અથવા માલવેર, અસુરક્ષિત એક્સ્ટેન્શન્સ, નબળા પાસફ્રેઝ, ચેડાં થયેલ ઉપકરણો અથવા ખોવાયેલા બેકઅપ્સ સામે ગેરંટી નથી."
      }
    ],
    "localizationStatus": "machine-accepted",
    "localizationAcceptedBy": "site-owner",
    "localizationAcceptedAt": "2026-10-15"
  }
};
