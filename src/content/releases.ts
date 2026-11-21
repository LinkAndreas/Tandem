import type { Locale } from "@/lib/i18n";

// Tandem's releases (git tags), newest first, with user-facing notes in every language. Shown on
// the version history page (/versions/<lang>). Add a release at the top. Releases with only
// internal changes are left out: 1.0.1 and 1.0.2 changed the README, license and brand files only.

export type Release = { version: string; /** Year and month, YYYY-MM. */ date: string; notes: Record<Locale, string[]> };

export const releases: Release[] = [
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
