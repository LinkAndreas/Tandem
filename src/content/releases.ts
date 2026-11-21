import type { Locale } from "@/lib/i18n";

// Tandem's releases (git tags), newest first, with user-facing notes in every language. Shown on
// the version history page (/versions/<lang>). Add a release at the top. Releases with only
// internal changes are left out: 1.0.1 and 1.0.2 changed the README, license and brand files only.

export type Release = { version: string; /** Year and month, YYYY-MM. */ date: string; notes: Record<Locale, string[]> };

export const releases: Release[] = [
  {
    version: "1.1.0",
    date: "2026-11",
    notes: {
      de: [
        "Tandem spricht jetzt elf Sprachen: neu sind Italienisch, Portugiesisch (Brasilien), Niederländisch, Japanisch, Koreanisch, Chinesisch (vereinfacht) und Russisch. Beim ersten Öffnen startet Tandem in der Sprache deines Browsers.",
        "PDFs zeigen jetzt auch kyrillische, japanische, koreanische und chinesische Namen richtig an.",
        "Impressum, Datenschutzerklärung und Versionshistorie, verlinkt unten auf der Seite.",
      ],
      en: [
        "Tandem now speaks eleven languages: Italian, Portuguese (Brazil), Dutch, Japanese, Korean, Chinese (Simplified) and Russian are new. On first launch, Tandem opens in your browser's language.",
        "PDFs now show Cyrillic, Japanese, Korean and Chinese names correctly.",
        "A legal notice, privacy policy and version history, linked at the bottom of the page.",
      ],
      fr: [
        "Tandem parle désormais onze langues : l’italien, le portugais (Brésil), le néerlandais, le japonais, le coréen, le chinois (simplifié) et le russe sont nouveaux. À la première ouverture, Tandem s’affiche dans la langue de ton navigateur.",
        "Les PDF affichent désormais correctement les noms en cyrillique, en japonais, en coréen et en chinois.",
        "Mentions légales, politique de confidentialité et historique des versions, accessibles en bas de la page.",
      ],
      es: [
        "Tandem ahora habla once idiomas: se suman el italiano, el portugués (Brasil), el neerlandés, el japonés, el coreano, el chino (simplificado) y el ruso. La primera vez, Tandem se abre en el idioma de tu navegador.",
        "Los PDF ahora muestran correctamente los nombres en cirílico, japonés, coreano y chino.",
        "Aviso legal, política de privacidad e historial de versiones, enlazados al final de la página.",
      ],
      it: [
        "Tandem ora parla undici lingue: si aggiungono italiano, portoghese (Brasile), olandese, giapponese, coreano, cinese (semplificato) e russo. Al primo avvio, Tandem si apre nella lingua del tuo browser.",
        "I PDF ora mostrano correttamente i nomi in cirillico, giapponese, coreano e cinese.",
        "Note legali, informativa sulla privacy e cronologia versioni, con i link in fondo alla pagina.",
      ],
      "pt-BR": [
        "O Tandem agora fala onze idiomas: italiano, português (Brasil), holandês, japonês, coreano, chinês (simplificado) e russo são novos. Na primeira vez, o Tandem abre no idioma do seu navegador.",
        "Os PDFs agora mostram corretamente nomes em cirílico, japonês, coreano e chinês.",
        "Aviso legal, Política de Privacidade e histórico de versões, com links no fim da página.",
      ],
      nl: [
        "Tandem spreekt nu elf talen: Italiaans, Portugees (Brazilië), Nederlands, Japans, Koreaans, Chinees (vereenvoudigd) en Russisch zijn nieuw. Bij de eerste keer opent Tandem in de taal van je browser.",
        "Pdf’s tonen nu ook Cyrillische, Japanse, Koreaanse en Chinese namen correct.",
        "Juridische informatie, privacybeleid en versiegeschiedenis, gelinkt onderaan de pagina.",
      ],
      ja: [
        "Tandemが11の言語に対応しました。イタリア語、ポルトガル語（ブラジル）、オランダ語、日本語、韓国語、中国語（簡体字）、ロシア語が新たに加わりました。初めて開くときは、ブラウザの言語で表示されます。",
        "PDFでキリル文字、日本語、韓国語、中国語の名前も正しく表示されるようになりました。",
        "法的表示、プライバシーポリシー、バージョン履歴へのリンクをページ下部に追加しました。",
      ],
      ko: [
        "Tandem이 이제 11개 언어를 지원해요. 이탈리아어, 포르투갈어(브라질), 네덜란드어, 일본어, 한국어, 중국어(간체), 러시아어가 새로 추가됐어요. 처음 열면 브라우저 언어로 시작해요.",
        "PDF에서 키릴 문자, 일본어, 한국어, 중국어 이름도 올바르게 표시돼요.",
        "페이지 아래쪽에 법적 고지, 개인정보 처리방침, 버전 기록 링크가 생겼어요.",
      ],
      "zh-Hans": [
        "Tandem 现在支持 11 种语言：新增意大利语、葡萄牙语（巴西）、荷兰语、日语、韩语、简体中文和俄语。首次打开时，Tandem 会使用你的浏览器语言。",
        "PDF 现在也能正确显示西里尔文、日文、韩文和中文姓名。",
        "页面底部新增法律声明、隐私政策和版本历史的链接。",
      ],
      ru: [
        "Tandem теперь говорит на одиннадцати языках: добавлены итальянский, португальский (Бразилия), нидерландский, японский, корейский, китайский (упрощённый) и русский. При первом запуске Tandem открывается на языке твоего браузера.",
        "PDF теперь правильно показывают имена на кириллице, японском, корейском и китайском.",
        "Выходные данные, политика конфиденциальности и история версий — ссылки внизу страницы.",
      ],
    },
  },
  {
    version: "1.0.0",
    date: "2026-09",
    notes: {
      de: [
        "Die erste Version: Tandem teilt die Feedback-Partner ein – Runde für Runde, ohne dass sich ein Paar wiederholt.",
        "Gruppe anlegen: Namen einzeln eintragen oder eine ganze Liste auf einmal einfügen.",
        "Neue Runden auslosen; bei ungerader Gruppengröße setzen die Personen abwechselnd aus.",
        "Bisherige Runden nachtragen – per Antippen der Namen oder als Text.",
        "Alle Runden als PDF herunterladen, mit einer Übersicht, wer mit wem gesprochen hat.",
        "Sitzungen als Datei speichern und laden, ein Beispiel zum Ausprobieren und Rückgängig.",
        "Deutsch, Englisch, Französisch und Spanisch sowie ein helles und ein dunkles Design.",
      ],
      en: [
        "The first release: Tandem assigns feedback partners – round after round, without ever repeating a pair.",
        "Set up your group: add names one by one or paste a whole list at once.",
        "Draw new rounds; with an odd group size, people take turns sitting out.",
        "Add past rounds by tapping names or as text.",
        "Download all rounds as a PDF, with an overview of who was paired with whom.",
        "Save and load sessions as files, try an example, and undo.",
        "German, English, French and Spanish, plus a light and a dark theme.",
      ],
      fr: [
        "La première version : Tandem forme les binômes de feedback – tour après tour, sans jamais répéter un binôme.",
        "Crée ton groupe : ajoute les noms un par un ou colle toute une liste d’un coup.",
        "Tire de nouveaux tours ; si le groupe est impair, chacun fait une pause à son tour.",
        "Saisis les tours passés en touchant les noms ou sous forme de texte.",
        "Télécharge tous les tours en PDF, avec un récapitulatif de qui a été en binôme avec qui.",
        "Enregistre et charge des sessions sous forme de fichiers, essaie un exemple et annule.",
        "Allemand, anglais, français et espagnol, ainsi qu’un thème clair et un thème sombre.",
      ],
      es: [
        "La primera versión: Tandem asigna las parejas de feedback, ronda tras ronda, sin repetir nunca una pareja.",
        "Crea tu grupo: añade los nombres uno a uno o pega una lista entera de una vez.",
        "Sortea nuevas rondas; si el grupo es impar, las personas descansan por turnos.",
        "Añade rondas anteriores tocando los nombres o como texto.",
        "Descarga todas las rondas en PDF, con un resumen de quién ha hecho pareja con quién.",
        "Guarda y carga sesiones como archivos, prueba un ejemplo y deshaz cambios.",
        "Alemán, inglés, francés y español, además de un tema claro y uno oscuro.",
      ],
      it: [
        "La prima versione: Tandem assegna i partner di feedback – turno dopo turno, senza mai ripetere una coppia.",
        "Crea il tuo gruppo: aggiungi i nomi uno alla volta o incolla un intero elenco in una volta sola.",
        "Sorteggia nuovi turni; se il gruppo è dispari, le persone restano fuori a rotazione.",
        "Aggiungi i turni passati toccando i nomi o come testo.",
        "Scarica tutti i turni in PDF, con una panoramica di chi è stato in coppia con chi.",
        "Salva e carica sessioni come file, prova un esempio e annulla le modifiche.",
        "Tedesco, inglese, francese e spagnolo, oltre a un tema chiaro e uno scuro.",
      ],
      "pt-BR": [
        "A primeira versão: o Tandem forma as duplas de feedback – rodada após rodada, sem nunca repetir uma dupla.",
        "Monte o seu grupo: adicione os nomes um por um ou cole uma lista inteira de uma vez.",
        "Sorteie novas rodadas; se o grupo tiver um número ímpar de pessoas, elas se revezam para ficar de fora.",
        "Adicione rodadas anteriores tocando nos nomes ou como texto.",
        "Baixe todas as rodadas em PDF, com um resumo de quem fez dupla com quem.",
        "Salve e carregue sessões como arquivos, experimente um exemplo e desfaça alterações.",
        "Alemão, inglês, francês e espanhol, além de um tema claro e um escuro.",
      ],
      nl: [
        "De eerste versie: Tandem deelt de feedbackpartners in – ronde na ronde, zonder ooit een duo te herhalen.",
        "Stel je groep samen: voeg namen één voor één toe of plak in één keer een hele lijst.",
        "Loot nieuwe rondes; bij een oneven groepsgrootte rusten de personen om de beurt.",
        "Voeg eerdere rondes toe door op namen te tikken of als tekst.",
        "Download alle rondes als pdf, met een overzicht van wie met wie een duo vormde.",
        "Sla sessies op als bestand en laad ze weer, probeer een voorbeeld en maak acties ongedaan.",
        "Duits, Engels, Frans en Spaans, plus een licht en een donker thema.",
      ],
      ja: [
        "最初のリリース：Tandemがフィードバックのペアを決めます。ラウンドごとに、同じペアを繰り返すことなく。",
        "グループを作成：名前を1人ずつ追加するか、リストをまとめて貼り付けられます。",
        "新しいラウンドを抽選。人数が奇数のときは、順番にお休みします。",
        "過去のラウンドを、名前をタップするかテキストで追加できます。",
        "すべてのラウンドをPDFでダウンロード。誰が誰とペアだったかの一覧付き。",
        "セッションをファイルとして保存・読み込み、例のお試し、取り消し機能。",
        "ドイツ語、英語、フランス語、スペイン語に対応。ライトとダークのテーマも。",
      ],
      ko: [
        "첫 번째 버전: Tandem이 피드백 파트너를 정해 줘요. 라운드마다, 같은 짝은 한 번도 반복하지 않고요.",
        "그룹 만들기: 이름을 하나씩 추가하거나 목록 전체를 한 번에 붙여 넣을 수 있어요.",
        "새 라운드 뽑기: 인원이 홀수이면 돌아가며 한 명씩 쉬어요.",
        "지난 라운드 추가: 이름을 탭하거나 텍스트로 입력할 수 있어요.",
        "모든 라운드를 PDF로 다운로드: 누가 누구와 짝이었는지 한눈에 보는 개요도 함께 들어 있어요.",
        "세션을 파일로 저장하고 불러오기, 예시 체험, 실행 취소.",
        "독일어, 영어, 프랑스어, 스페인어 지원, 그리고 라이트 테마와 다크 테마.",
      ],
      "zh-Hans": [
        "首个版本：Tandem 为你们分配反馈搭档——一轮接一轮，绝不重复同一对。",
        "创建小组：逐个添加姓名，或一次粘贴整份列表。",
        "抽取新一轮；小组人数为奇数时，大家轮流轮空。",
        "补录过往轮次：轻点姓名，或以文本形式输入。",
        "将所有轮次下载为 PDF，并附有谁和谁搭档过的概览。",
        "将会话保存为文件并重新载入，试用示例，以及撤销操作。",
        "德语、英语、法语和西班牙语，以及浅色和深色两种主题。",
      ],
      ru: [
        "Первый выпуск: Tandem распределяет партнёров по фидбэку — раунд за раундом, ни разу не повторяя пару.",
        "Создай группу: добавляй имена по одному или вставь целый список сразу.",
        "Разыгрывай новые раунды; если в группе нечётное число людей, участники пропускают раунд по очереди.",
        "Добавляй прошлые раунды нажатием на имена или в виде текста.",
        "Скачивай все раунды в PDF с обзором того, кто с кем был в паре.",
        "Сохраняй и загружай сессии в виде файлов, попробуй пример и отменяй действия.",
        "Немецкий, английский, французский и испанский, а также светлая и тёмная темы.",
      ],
    },
  },
];
