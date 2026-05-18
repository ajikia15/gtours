import { locales } from "@/config";

type Locale = (typeof locales)[number];

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type LegalDocument = {
  title: string;
  updated: string;
  blocks: LegalBlock[];
};

const privacy: Record<Locale, LegalDocument> = {
  en: {
    title: "Privacy Policy",
    updated: "Last updated: May 2026",
    blocks: [
      {
        type: "p",
        text: "This Privacy Policy defines the principles for processing and storing the personal data of users of the website Georgiatraveltours.ge (hereinafter — the “Website”) operated by the tourism company LLC “Dolaswif” (hereinafter — the “Company”), for the purpose of protecting users’ privacy and confidentiality. Based on the Law of Georgia on Personal Data Protection, this document (Privacy Policy) constitutes an integral part of the Website’s Terms and Conditions and is a mutually binding document.",
      },
      {
        type: "p",
        text: "While using our service, we may ask you to provide certain personally identifiable information that may be used to contact or identify you. Personally identifiable information may include, but is not limited to:",
      },
      {
        type: "ul",
        items: ["Email address", "First and last name", "Phone number"],
      },
      {
        type: "p",
        text: "The collected data may also include information such as your device’s Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our service that you visit, the time and date of your visit, the time spent on those pages, and unique device identifiers.",
      },
      {
        type: "p",
        text: "When you access the service through a mobile device, we may automatically collect certain information, including but not limited to the type of mobile device you use, your device’s unique ID, IP address, mobile operating system, mobile internet browser type, and other related information.",
      },
      {
        type: "p",
        text: "To improve the functionality and efficiency of the Website, short text files may be stored in the user’s browser. For this purpose, we use Cookies to monitor activity on our service and store certain information. A cookie is a small file placed on your device. You may instruct your browser to refuse all cookies or indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use certain parts of our service.",
      },
      { type: "h2", text: "Purposes of Processing" },
      { type: "p", text: "The Company may use personal data for the following purposes:" },
      {
        type: "ul",
        items: [
          "To provide, maintain, and improve our service",
          "To contact you",
          "To manage your requests",
        ],
      },
      {
        type: "p",
        text: "While using our Website, Georgiatraveltours.ge, we may collect users’ personal information. For example, our company offers a simplified communication method through the Website — users can contact the Company by entering their personal information (such as name, phone number, and email address) and a message, or by sending a message directly to the Company’s email address.",
      },
      {
        type: "p",
        text: "The Company is authorized to collect, process, store, and, where necessary, request access to users’ personal data (the full definition of personal data is provided in the Law of Georgia on Personal Data Protection). Your personal data is processed using automated and non-automated means.",
      },
      { type: "h2", text: "Data Retention" },
      {
        type: "p",
        text: "The Company will retain your personal data only for as long as necessary for the purposes set out in this Privacy Policy. We will retain and use your personal data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.",
      },
      {
        type: "p",
        text: "The Company may also retain data for internal analysis purposes. Such data is generally retained for a shorter period unless it is used to strengthen security or improve the functionality of our service, or where we are legally obligated to retain it for a longer period.",
      },
      { type: "h2", text: "Security and Your Rights" },
      {
        type: "p",
        text: "The Company ensures the implementation of specific security measures to prevent unauthorized access, misuse, loss, or unlawful processing of data. The Company protects your personal data and safeguards it from third parties. Disclosure of personal data to third parties is permitted only when necessary for providing the requested legal services or in cases prescribed by law.",
      },
      {
        type: "p",
        text: "Users have the right, at any time, to request the correction, updating, completion, deletion, or destruction of their data if it is incomplete, inaccurate, outdated, or if its collection and processing were carried out unlawfully. Users also have the right to request information regarding the correction, updating, completion, deletion, or destruction of their personal data.",
      },
      {
        type: "p",
        text: "The Company is obligated to correct, update, complete, delete, or destroy the data, or inform the user about the refusal and the grounds for such refusal.",
      },
      {
        type: "p",
        text: "In addition, if the Company determines that the data it holds is incomplete, inaccurate, or requires updating, it is authorized to correct or update the data without the user’s request and shall immediately notify the user accordingly.",
      },
      { type: "h2", text: "Contact" },
      {
        type: "p",
        text: "For issues related to personal data protection, including complaints or claims, you may contact the Company’s authorized representative via email at: Georgiatraveltours.info@gmail.com",
      },
    ],
  },
  ge: {
    title: "კონფიდენციალურობის პოლიტიკა",
    updated: "ბოლო განახლება: 2026 წლის მაისი",
    blocks: [
      {
        type: "p",
        text: "კონფიდენციალურობის პოლიტიკა განსაზღვრავს ტურისტული კომპანიის შპს „დოლასვიფ“ (შემდგომში — კომპანია) ვებგვერდის Georgiatraveltours.ge-ის (შემდგომში — ვებგვერდი) მომხმარებელთა კონფიდენციალურობისა და ხელშეუხებლობის პრინციპის დაცვის მიზნით მომხმარებელთა პერსონალური მონაცემების დამუშავების პრინციპებსა და მათი შენახვის წესს. „პერსონალურ მონაცემთა დაცვის შესახებ“ საქართველოს კანონის საფუძველზე, წინამდებარე დოკუმენტი (კონფიდენციალურობის პოლიტიკა) წარმოადგენს კომპანიის ვებგვერდით სარგებლობის წესებისა და პირობების განუყოფელ ნაწილს, რომელიც არის ორმხრივი მავალდებულებელი დოკუმენტი.",
      },
      {
        type: "p",
        text: "ჩვენი სერვისით სარგებლობისას შეიძლება მოგთხოვოთ მოგვაწოდოთ გარკვეული პერსონალური იდენტიფიცირებადი ინფორმაცია, რომელიც შეიძლება გამოყენებულ იქნას თქვენთან დასაკავშირებლად ან იდენტიფიცირებისთვის. პერსონალური იდენტიფიცირებადი ინფორმაცია შეიძლება შეიცავდეს, მაგრამ არ შემოიფარგლება მხოლოდ:",
      },
      {
        type: "ul",
        items: ["ელ. ფოსტა", "სახელი და გვარი", "ტელეფონის ნომერი"],
      },
      {
        type: "p",
        text: "მონაცემები შეიძლება შეიცავდეს ისეთ ინფორმაციას, როგორიცაა თქვენი მოწყობილობის ინტერნეტ პროტოკოლის მისამართი (მაგ. IP მისამართი), ბრაუზერის ტიპი, ბრაუზერის ვერსია, ჩვენი სერვისის გვერდები, რომლებსაც თქვენ ეწვიეთ, თქვენი ვიზიტის დრო და თარიღი, ამ გვერდებზე გატარებული დრო, უნიკალური მოწყობილობა.",
      },
      {
        type: "p",
        text: "როდესაც თქვენ შედიხართ სერვისზე მობილური მოწყობილობით ან მისი მეშვეობით, ჩვენ შეიძლება ავტომატურად შევაგროვოთ გარკვეული ინფორმაცია, მათ შორის, მაგრამ არ შემოიფარგლება, თქვენს მიერ გამოყენებული მობილური მოწყობილობის ტიპის, თქვენი მობილური მოწყობილობის უნიკალური ID, თქვენი მობილური მოწყობილობის IP მისამართი, თქვენი მობილურის ოპერაციული სისტემა, მობილური ინტერნეტ ბრაუზერის ტიპი და სხვა.",
      },
      {
        type: "p",
        text: "ვებგვერდით სარგებლობის გასაუმჯობესებლად და მისი ეფექტიანი ფუნქციონირების უზრუნველყოფისთვის, შესაძლებელია გამოყენებული იქნას მომხმარებელთა მოკლე ტექსტური ფაილები, რომლებიც მომხმარებლის ბრაუზერში ინახება. ამისთვის ჩვენ ვიყენებთ Cookies ჩვენს სერვისზე აქტივობის თვალყურის დევნებისთვის და გარკვეული ინფორმაციის შესანახად. ქუქი არის პატარა ფაილი, რომელიც განთავსებულია თქვენს მოწყობილობაზე. თქვენ შეგიძლიათ დაავალოთ თქვენს ბრაუზერს უარი თქვას ყველა ქუქი-ფაილზე ან მიუთითოს როდის იგზავნება ქუქი. თუმცა, თუ თქვენ არ მიიღებთ ქუქი-ფაილებს, შესაძლოა ვერ შეძლოთ ჩვენი სერვისის ზოგიერთი ნაწილის გამოყენება.",
      },
      { type: "h2", text: "მონაცემთა დამუშავების მიზნები" },
      { type: "p", text: "კომპანიას შეუძლია გამოიყენოს პერსონალური მონაცემები შემდეგი მიზნებისთვის:" },
      {
        type: "ul",
        items: [
          "ჩვენი სერვისის უზრუნველსაყოფად, შესანარჩუნებლად და გასაუმჯობესებლად",
          "თქვენთან დასაკავშირებლად",
          "თქვენი მოთხოვნების სამართავად",
        ],
      },
      {
        type: "p",
        text: "ჩვენი ვებგვერდის, Georgiatraveltours.ge-ის გამოყენებისას, შესაძლოა შევაგროვოთ მომხმარებელთა პერსონალური ინფორმაცია, მაგალითად: ჩვენი კომპანია ვებგვერდის საშუალებით გთავაზობთ ურთიერთობის გამარტივებულ ფორმას — კომპანიასთან კომუნიკაცია შესაძლებელია თქვენი მონაცემებისა (მაგალითად, სახელის, ტელეფონის ნომრის, ელ.ფოსტის გამოყენებით) და შეტყობინების ტექსტის შეყვანის, ასევე, კომპანიის ელ.ფოსტაზე შეტყობინების გაგზავნის გზით. კომპანია უფლებამოსილია, რომ შეაგროვოს, დაამუშავოს, შეინახოს და საჭიროების შემთხვევაში, მოითხოვოს მომხმარებლის პერსონალური მონაცემების გაცნობა (პერსონალური მონაცემის სრული განმარტება მოცემულია საქართველოს კანონში „პერსონალურ მონაცემთა დაცვის შესახებ“). კომპანიის მიერ თქვენი პირადი მონაცემები მუშავდება ავტომატიზებული და არაავტომატიზებული აღჭურვილობით.",
      },
      { type: "h2", text: "მონაცემთა შენახვა" },
      {
        type: "p",
        text: "კომპანია შეინახავს თქვენს პერსონალურ მონაცემებს მხოლოდ მანამ, სანამ ეს აუცილებელია ამ კონფიდენციალურობის პოლიტიკაში მითითებული მიზნებისთვის. ჩვენ შევინახავთ და გამოვიყენებთ თქვენს პერსონალურ მონაცემებს იმდენად, რამდენადაც ეს აუცილებელია ჩვენი სამართლებრივი ვალდებულებების შესასრულებლად (მაგალითად, თუ ჩვენ გვჭირდება თქვენი მონაცემების შენახვა მოქმედი კანონების შესასრულებლად), დავა მოვაგვაროთ და დავიცვათ ჩვენი სამართლებრივი შეთანხმებები და პოლიტიკა.",
      },
      {
        type: "p",
        text: "კომპანია ასევე შეინახავს მონაცემებს შიდა ანალიზის მიზნებისთვის. მონაცემები ჩვეულებრივ ინახება უფრო მოკლე დროით, გარდა იმ შემთხვევისა, როდესაც ეს მონაცემები გამოიყენება უსაფრთხოების გასაძლიერებლად ან ჩვენი სერვისის ფუნქციონირების გასაუმჯობესებლად, ან ჩვენ იურიდიულად ვალდებულნი ვართ შევინარჩუნოთ ეს მონაცემები უფრო ხანგრძლივი დროის განმავლობაში.",
      },
      { type: "h2", text: "უსაფრთხოება და თქვენი უფლებები" },
      {
        type: "p",
        text: "კომპანიის მიერ უზრუნველყოფილია კონკრეტული უსაფრთხოების ზომების დაცვა, რათა თავიდან იქნას აცილებული მონაცემთა არამიზნობრივი და არაუფლებამოსილ პირთა მიერ მათი გამოყენება, დაკარგვა და სხვ. კომპანია უზრუნველყოფს თქვენი პერსონალური მონაცემების დაცვას და მათ იცავს მესამე პირებისგან. მესამე პირებისათვის პერსონალური მონაცემების გამჟღავნება დაიშვება იმ შემთხვევაში, როცა ეს აუცილებელია თქვენ მიერ მოთხოვნილი იურიდიული მომსახურების გაწევისათვის ან კანონით გათვალისწინებულ შემთხვევებში.",
      },
      {
        type: "p",
        text: "მომხმარებელს აქვს უფლება, რომ ნებისმიერ დროს მოითხოვოს მონაცემების გასწორება, განახლება, დამატება, წაშლა ან განადგურება, თუ ისინი არასრულია, არაზუსტია, არ არის განახლებული ან თუ მათი შეგროვება და დამუშავება განხორციელდა კანონის საწინააღმდეგოდ. ასევე, მას უფლება აქვს მოითხოვოს ინფორმაცია საკუთარი პერსონალური მონაცემების გასწორების, განახლების, დამატების, წაშლის ან განადგურების შესახებ. კომპანია ვალდებულია, რომ გაასწოროს, განაახლოს, დაამატოს, წაშალოს ან გაანადგუროს მონაცემები ან მომხმარებელს აცნობოს უარისა და უარის თქმის საფუძვლის შესახებ.",
      },
      {
        type: "p",
        text: "გარდა ამისა, თუ კომპანია ჩათვლის, რომ მასთან არსებული მონაცემები არასრული, არაზუსტი ან გასაახლებელია, მომხმარებლის მოთხოვნის გარეშე, კომპანია უფლებამოსილია გაასწოროს ან განაახლოს მონაცემები და ამის შესახებ დაუყოვნებლივ აცნობოს მომხმარებელს.",
      },
      { type: "h2", text: "კონტაქტი" },
      {
        type: "p",
        text: "პერსონალურ მონაცემთა დაცვის საკითხებზე, მათ შორის, საჩივრის/პრეტენზიის შემთხვევაში, შეგიძლიათ დაუკავშირდეთ კომპანიის უფლებამოსილ პირს ელ. ფოსტაზე Georgiatraveltours.info@gmail.com",
      },
    ],
  },
  ru: {
    title: "Политика конфиденциальности",
    updated: "Последнее обновление: май 2026",
    blocks: [
      {
        type: "p",
        text: "Политика конфиденциальности определяет принципы обработки и порядок хранения персональных данных пользователей в целях соблюдения принципа конфиденциальности и неприкосновенности пользователей веб-сайта Georgiatraveltours.ge (далее — Веб-сайт) туристической компании ООО «Доласвиф» (далее — Компания). На основании Закона Грузии «О защите персональных данных» настоящий документ (Политика конфиденциальности) представляет собой неотъемлемую часть Правил и условий пользования веб-сайтом Компании, который является двусторонне обязывающим документом.",
      },
      {
        type: "p",
        text: "При использовании нашего сервиса мы можем попросить вас предоставить определенную персональную идентифицирующую информацию, которая может быть использована для связи с вами или вашей идентификации. Персональная идентифицирующая информация может включать в себя, но не ограничивается следующим:",
      },
      {
        type: "ul",
        items: ["Электронная почта", "Имя и фамилия", "Номер телефона"],
      },
      {
        type: "p",
        text: "Данные могут включать в себя такую информацию, как адрес интернет-протокола вашего устройства (например, IP-адрес), тип браузера, версия браузера, страницы нашего сервиса, которые вы посетили, время и дата вашего визита, время, проведенное на этих страницах, уникальный идентификатор устройства.",
      },
      {
        type: "p",
        text: "Когда вы заходите на сервер с мобильного устройства или через него, мы можем автоматически собирать определенную информацию, включая, помимо прочего, тип используемого вами мобильного устройства, уникальный ID вашего мобильного устройства, IP-адрес вашего мобильного устройства, операционную систему вашего мобильного телефона, тип мобильного интернет-браузера и другое.",
      },
      {
        type: "p",
        text: "Для улучшения использования веб-сайта и обеспечения его эффективного функционирования могут быть использованы краткие текстовые файлы пользователей, которые сохраняются в браузере пользователя. Для этого мы используем файлы Cookie для отслеживания активности в нашем сервисе и хранения определенной информации. Cookie — это небольшой файл, размещаемый на вашем устройстве. Вы можете настроить свой браузер так, чтобы он отказывался от всех файлов cookie или указывал, когда они отправляются. Однако, если вы не принимаете файлы cookie, вы, возможно, не сможете использовать некоторые части нашего сервиса.",
      },
      { type: "h2", text: "Цели обработки" },
      { type: "p", text: "Компания может использовать персональные данные в следующих целях:" },
      {
        type: "ul",
        items: [
          "Для обеспечения, поддержки и улучшения нашего сервиса",
          "Для связи с вами",
          "Для управления вашими запросами",
        ],
      },
      {
        type: "p",
        text: "При использовании нашего веб-сайта Georgiatraveltours.ge мы можем собирать персональную информацию пользователей, например: посредством веб-сайта наша компания предлагает вам упрощенную форму взаимодействия — связь с компанией возможна путем ввода ваших данных (например, имени, номера телефона, эл. почты) и текста сообщения, а также путем отправки сообщения на электронную почту компании. Компания вправе собирать, обрабатывать, хранить и в случае необходимости запрашивать ознакомление с персональными данными пользователя (полное определение персональных данных приведено в Законе Грузии «О защите персональных данных»). Ваши персональные данные обрабатываются Компанией с использованием автоматизированных и неавтоматизированных средств.",
      },
      { type: "h2", text: "Хранение данных" },
      {
        type: "p",
        text: "Компания будет хранить ваши персональные данные только до тех пор, пока это необходимо для целей, указанных в настоящей Политике конфиденциальности. Мы будем хранить и использовать ваши персональные данные в той мере, в какой это необходимо для выполнения наших юридических обязательств (например, если нам требуется сохранить ваши данные для соблюдения применимого законодательства), разрешения споров и защиты наших правовых соглашений и политик.",
      },
      {
        type: "p",
        text: "Компания также будет хранить данные для целей внутреннего анализа. Обычно такие данные хранятся в течение более короткого периода времени, за исключением случаев, когда эти данные используются для повышения безопасности или улучшения функционирования нашего сервиса, либо когда мы юридически обязаны сохранять эти данные в течение более длительного периода времени.",
      },
      { type: "h2", text: "Безопасность и ваши права" },
      {
        type: "p",
        text: "Компания обеспечивает соблюдение конкретных мер безопасности во избежание нецелевого использования данных, их утери, использования неуполномоченными лицами и т. д. Компания обеспечивает защиту ваших персональных данных и защищает их от третьих лиц. Раскрытие персональных данных третьим лицам допускается в тех случаях, когда это необходимо для оказания запрошенных вами юридических услуг или в случаях, предусмотренных законом.",
      },
      {
        type: "p",
        text: "Пользователь имеет право в любое время потребовать исправления, обновления, дополнения, удаления или уничтожения данных, если они являются неполными, неточными, устаревшими или если их сбор и обработка были осуществлены вопреки закону. Также он имеет право запросить информацию об исправлении, обновлении, дополнении, удалении или уничтожении своих персональных данных. Компания обязана исправить, обновить, дополнить, удалить или уничтожить данные либо сообщить пользователю об отказе и основаниях для такого отказа.",
      },
      {
        type: "p",
        text: "Кроме того, если Компания посчитает, что имеющиеся у нее данные являются неполными, неточными или требующими обновления, Компания вправе без запроса пользователя исправить или обновить данные и незамедлительно уведомить об этом пользователя.",
      },
      { type: "h2", text: "Контакт" },
      {
        type: "p",
        text: "По вопросам защиты персональных данных, в том числе в случае подачи жалобы/претензии, вы можете связаться с уполномоченным лицом Компании по электронной почте Georgiatraveltours.info@gmail.com",
      },
    ],
  },
};

const terms: Record<Locale, LegalDocument> = {
  en: {
    title: "Terms and Conditions",
    updated: "Last updated: May 2026",
    blocks: [
      {
        type: "p",
        text: "The Website provides essential information for traveling in Georgia, including but not limited to information about visa policies, communication, accommodation facilities, tourist destinations, attractions, and activities. Use of the Website is permitted in accordance with these Terms and Conditions.",
      },
      {
        type: "p",
        text: "The Website, the information published on it, embedded content, blog materials, photo/video materials, and related software are the intellectual property of LLC “Dolaswif” or materials obtained under a lawful right of use.",
      },
      {
        type: "p",
        text: "By accessing and using the Website, you confirm that you have read and agree to the Website’s Terms and Conditions, including the Privacy Policy and Cookies Policy.",
      },
      {
        type: "p",
        text: "These Terms and Conditions govern the contractual relationship between LLC “Dolaswif” and you and apply to any tour booked through LLC “Dolaswif”. Please read them carefully, as by booking any tour on Georgiatraveltours.ge, you confirm that you have read, understood, and agreed to these Terms and Conditions.",
      },
      {
        type: "p",
        text: "If you confirm a booking for a tour involving more than one client, it shall be deemed that you have agreed to these Terms and Conditions on behalf of all clients named in the booking (including minors and persons with disabilities). Accordingly, all clients in the group confirm that they have read and accepted these Terms and Conditions. The client who confirms the booking shall be considered the designated contact person for all other clients named in the booking.",
      },
      { type: "h2", text: "Booking Conditions" },
      {
        type: "p",
        text: "When booking a tour with the Company, a portion of the tour fee must be paid in advance. Full payment is mandatory no later than 48 hours before the start of the tour.",
      },
      {
        type: "p",
        text: "If the Company cancels the tour for reasons attributable to the Company, the client will receive a full refund.",
      },
      { type: "h2", text: "Booking Agreement" },
      {
        type: "p",
        text: "A tour booking shall be considered confirmed, and these Terms and Conditions shall enter into force from the moment the Company receives a notification from the client expressing the intention to purchase a booking and confirms it to the client in writing.",
      },
      {
        type: "p",
        text: "The client must be at least 18 years old and must provide the Company with complete and accurate information necessary to confirm the requested booking.",
      },
      {
        type: "p",
        text: "Any client confirming a booking for a tour involving more than one client represents and warrants to the Company that:",
      },
      {
        type: "ul",
        items: [
          "They have obtained all necessary consents and authority to make such booking on behalf of all other clients named in the booking and have provided all required information to the other clients so they can give their free and fully informed authorization.",
          "All information provided regarding all clients is complete and accurate, and they have obtained all necessary consents and permissions to share such information with the Company for the purpose of completing the booking.",
        ],
      },
      { type: "h2", text: "Booking Cancellation" },
      {
        type: "p",
        text: "The client may cancel the tour and withdraw from the booking by notifying the Company no later than 5 days before the start of the tour.",
      },
      {
        type: "ul",
        items: [
          "If the booking is canceled 4 days before the start of the tour, the client shall pay a cancellation fee equal to 30% of the tour price.",
          "If the booking is canceled 3 days before the start of the tour, the client shall pay 50% of the tour price.",
          "If the booking is canceled within 48 hours before the start of the tour, the client shall pay the full cost of the tour.",
        ],
      },
      { type: "h2", text: "Travel Insurance" },
      {
        type: "p",
        text: "The Company does not provide travel insurance. Therefore, the client must obtain travel insurance in their home country with at least the minimum recommended coverage for medical expenses, evacuation, and repatriation, covering the entire duration of the tour organized by the Company.",
      },
      {
        type: "p",
        text: "Clients are also advised to extend their insurance coverage to include booking or tour cancellation, as well as any additional expenses that may arise during the tour due to loss, damage, injury, delay, or other unforeseen circumstances.",
      },
      { type: "h2", text: "Use of Materials" },
      {
        type: "p",
        text: "During participation in any Company tour, other clients, Company representatives, or guides may take photographs or videos in which the client may appear partially or fully.",
      },
      {
        type: "p",
        text: "The client acknowledges that such materials are lawfully obtained and agrees to the taking of such photographs and videos. Without claiming any compensation, the client grants the Company and its authorized persons a perpetual right to use such materials for any lawful purpose (including marketing) through any lawful means.",
      },
      { type: "h2", text: "Amendments" },
      {
        type: "p",
        text: "The Company reserves the right to update and/or modify these Terms and Conditions at any time and to publish the revised Terms and Conditions on the Company’s Website.",
      },
    ],
  },
  ge: {
    title: "წესები და პირობები",
    updated: "ბოლო განახლება: 2026 წლის მაისი",
    blocks: [
      {
        type: "p",
        text: "ვებგვერდი გთავაზობთ საქართველოში მოგზაურობისთვის აუცილებელ ინფორმაციას, მათ შორის და არა მხოლოდ, ინფორმაციას სავიზო პოლიტიკის, კომუნიკაციის, განსათავსებელი ობიექტების, ტურისტული ადგილების, სანახაობებისა და აქტივობების შესახებ. ვებგვერდის გამოყენება ნებადართულია წინამდებარე პირობების შესაბამისად.",
      },
      {
        type: "p",
        text: "ვებგვერდი, ვებგვერდზე განთავსებული ინფორმაცია, ჩაშენებული კონტენტი, ბლოგი, ფოტო-ვიდეო მასალა და მასთან დაკავშირებული პროგრამული უზრუნველყოფა არის შპს „დოლასვიფ“-ის ინტელექტუალური საკუთრება ან გამოყენების უფლებით მოპოვებული მასალა.",
      },
      {
        type: "p",
        text: "ვებგვერდზე წვდომითა და მისი გამოყენებით, თქვენ ადასტურებთ, რომ გაეცანით და ეთანხმებით ვებგვერდის გამოყენების პირობებს, მათ შორის, კონფიდენციალურობისა და Cookies პოლიტიკას.",
      },
      {
        type: "p",
        text: "წინამდებარე წესები და პირობები არეგულირებს შპს „დოლასვიფ“-სა და თქვენს შორის სახელშეკრულებო ურთიერთობას და ვრცელდება ნებისმიერ ტურზე, რომელიც დაჯავშნილია კომპანია შპს „დოლასვიფ“-ით. გთხოვთ, ყურადღებით წაიკითხოთ ისინი, რადგან Georgiatraveltours.ge-ზე ნებისმიერი ტურის დაჯავშნით თქვენ ადასტურებთ, რომ გაეცანით და ეთანხმებით ამ წესებსა და პირობებს.",
      },
      {
        type: "p",
        text: "იმ შემთხვევაში, თუ თქვენ დაადასტურებთ რომელიმე ტურზე ჯავშანს ერთზე მეტი კლიენტით, ჩაითვლება, რომ დაეთანხმეთ ამ წესებსა და პირობებს ჯავშანში დასახელებული ყველა კლიენტის სახელით (მათ შორის არასრულწლოვნებისა და შეზღუდული შესაძლებლობის მქონე პირების) და შესაბამისად, ამ ჯგუფის ყველა კლიენტი ადასტურებს ამ წესებისა და პირობების გაცნობას და თანხმობას მათზე. კლიენტი, რომელმაც დაადასტურა ჯავშანი, ითვლება შერჩეულ საკონტაქტო პირად ამ ჯავშანში დასახელებული ყველა სხვა კლიენტისთვის.",
      },
      { type: "h2", text: "დაჯავშნის პირობები" },
      {
        type: "p",
        text: "კომპანიაში ტურის დაჯავშნისას გადაიხდება საფასურის ნაწილი. ტურის უზრუნველსაყოფად სრული თანხის გადახდა სავალდებულოა ტურის დაწყებამდე 48 საათით ადრე. კომპანიის მიზეზით ტურის გაუქმების შემთხვევაში, კლიენტს თანხა უბრუნდება სრულად.",
      },
      { type: "h2", text: "შეთანხმება ჯავშანზე" },
      {
        type: "p",
        text: "ტურის დაჯავშნა დადასტურებულად ჩაითვლება და ეს წესები და პირობები ძალაში შევა იმ მომენტიდან, რაც კომპანია მიიღებს შეტყობინებას კლიენტისგან ჯავშანის შეძენის განზრახვის თაობაზე და ამის შესახებ კლიენტს წერილობით დაუდასტურებს.",
      },
      {
        type: "p",
        text: "კლიენტი უნდა იყოს 18 წლის და მეტი ასაკის და კომპანიას უნდა მიაწოდოს სრული და ზუსტი ინფორმაცია, რაც აუცილებელია მოთხოვნილი დაჯავშნის დასადასტურებლად.",
      },
      {
        type: "p",
        text: "ნებისმიერი კლიენტი, რომელიც ადასტურებს დაჯავშნას ნებისმიერ ტურზე, სადაც ერთზე მეტი კლიენტია დასახელებული და დაჯავშნილია ასეთ დაჯავშნაში, აცხადებს და იძლევა გარანტიას კომპანიის წინაშე, რომ:",
      },
      {
        type: "ul",
        items: [
          "მათ აქვთ ყველა საჭირო თანხმობა და უფლებამოსილება, განახორციელონ ასეთი დაჯავშნა ჯავშანში დასახელებული ყველა სხვა კლიენტის სახელით და მიაწოდეს ყველა საჭირო ინფორმაცია სხვა კლიენტებს, რათა მათ მისცენ ამის თავისუფალი და სრულად ინფორმირებული უფლებამოსილება.",
          "ყველა კლიენტის შესახებ მათ მიერ მოწოდებული ინფორმაცია სრული და ზუსტია და მათ მიიღეს ყველა საჭირო თანხმობა და ნებართვა, რათა გაუზიარონ ასეთი ინფორმაცია კომპანიას დაჯავშნის დასრულების მიზნით.",
        ],
      },
      { type: "h2", text: "ჯავშანის გაუქმება" },
      {
        type: "p",
        text: "კლიენტს შეუძლია უარი თქვას ტურზე და გააუქმოს ჯავშანი კომპანიისათვის არანაკლებ 5 დღით ადრე შეტყობინებით.",
      },
      {
        type: "ul",
        items: [
          "ტურის დაწყებამდე 4 დღით ადრე გაუქმების შემთხვევაში, კლიენტი იხდის საკომისიოს, ტურის ღირებულების 30%-ის ოდენობით.",
          "ტურის დაწყებამდე 3 დღით ადრე გაუქმების შემთხვევაში — 50%-ის ოდენობით.",
          "ტურის დაწყებამდე 48 საათით ადრე გაუქმების შემთხვევაში — ტურის სრული ღირებულების ოდენობით.",
        ],
      },
      { type: "h2", text: "მოგზაურობის დაზღვევა" },
      {
        type: "p",
        text: "კომპანია არ გთავაზობთ მოგზაურობის დაზღვევას, ამიტომ კლიენტმა იგი უნდა მიიღოს მშობლიური ქვეყნიდან მინიმალური რეკომენდებული სამედიცინო, ევაკუაციის და რეპატრიაციის დაფარვით, რომელიც მოიცავს კომპანიის მიერ დაგეგმილი ტურის ფარგლებში მოგზაურობის პერიოდს.",
      },
      {
        type: "p",
        text: "რეკომენდებულია, რომ კლიენტებმა ასევე გააფართოვონ დაზღვევის დაფარვა ჯავშანის ან ტურის გაუქმების და ასევე ყველა სხვა ხარჯის ჩათვლით, რომელიც შეიძლება წარმოიშვას ტურის განმავლობაში დანაკარგის, დაზიანების, ტრავმის, დაგვიანების ან სხვა გაუთვალისწინებელი შემთხვევის შედეგად.",
      },
      { type: "h2", text: "მასალის გამოყენება" },
      {
        type: "p",
        text: "კომპანიის ნებისმიერ ტურში მონაწილეობისას, სხვა კლიენტებმა და/ან კომპანიის წარმომადგენლებმა ან გიდებმა შეიძლება გადაიღონ ფოტოები ან ვიდეოები, რომლებზეც (შიც) ნაწილობრივ ან მთლიანად შესაძლოა ფიგურირებდეს კლიენტი.",
      },
      {
        type: "p",
        text: "კლიენტი ადასტურებს, რომ აღნიშნული არის გამოყენების უფლებით მოპოვებული მასალა. იგი ეთანხმება ასეთი ფოტოების და ვიდეოების გადაღებას და ყოველგვარი კომპენსაციის მოთხოვნის გარეშე, ანიჭებს კომპანიასა და უფლებამოსილ პირებს უვადო უფლებას ამ მასალის გამოყენება მოახდინონ ნებისმიერი კანონიერი მიზნით (მათ შორის მარკეტინგული), ნებისმიერი კანონიერი გზებით.",
      },
      { type: "h2", text: "შესწორებები" },
      {
        type: "p",
        text: "კომპანია იტოვებს უფლებას ნებისმიერ დროს განაახლოს და/ან შეცვალოს ეს წესები და პირობები და განათავსოს შესწორებული წესები და პირობები კომპანიის ვებგვერდზე.",
      },
    ],
  },
  ru: {
    title: "Правила и условия",
    updated: "Последнее обновление: май 2026",
    blocks: [
      {
        type: "p",
        text: "Веб-сайт предлагает информацию, необходимую для путешествия по Грузии, включая, помимо прочего, информацию о визовой политике, связи, объектах размещения, туристических местах, достопримечательностях и мероприятиях. Использование веб-сайта разрешено в соответствии с настоящими условиями.",
      },
      {
        type: "p",
        text: "Веб-сайт, размещенная на веб-сайте информация, встроенный контент, блог, фото- и видеоматериалы, а также связанное с ними программное обеспечение являются интеллектуальной собственностью ООО «Доласвиф» или материалом, полученным на правах использования.",
      },
      {
        type: "p",
        text: "Получая доступ к веб-сайту и используя его, вы подтверждаете, что ознакомились и согласны с правилами использования веб-сайта, включая Политику конфиденциальности и использования файлов Cookie.",
      },
      {
        type: "p",
        text: "Настоящие Правила и условия регулируют договорные отношения между ООО «Доласвиф» и вами и распространяются на любой тур, забронированный через компанию ООО «Доласвиф». Пожалуйста, внимательно прочитайте их, так как бронированием любого тура на Georgiatraveltours.ge вы подтверждаете, что ознакомились и согласны с настоящими Правилами и условиями.",
      },
      {
        type: "p",
        text: "В случае, если вы подтверждаете бронирование какого-либо тура более чем на одного клиента, считается, что вы согласились с настоящими Правилами и условиями от имени всех указанных в бронировании клиентов (включая несовершеннолетних и лиц с ограниченными возможностями), и, соответственно, все клиенты этой группы подтверждают ознакомление с настоящими Правилами и условиями и свое согласие с ними. Клиент, подтвердивший бронирование, считается назначенным контактным лицом для всех остальных клиентов, указанных в данном бронировании.",
      },
      { type: "h2", text: "Условия бронирования" },
      {
        type: "p",
        text: "При бронировании тура в Компании оплачивается часть стоимости. Для обеспечения тура полная оплата обязательна за 48 часов до его начала. В случае отмены тура по вине Компании клиенту возвращается полная стоимость.",
      },
      { type: "h2", text: "Соглашение о бронировании" },
      {
        type: "p",
        text: "Бронирование тура считается подтвержденным, и настоящие Правила и условия вступают в силу с момента, когда Компания получит от клиента уведомление о намерении приобрести бронирование и письменно подтвердит это клиенту.",
      },
      {
        type: "p",
        text: "Клиент должен быть в возрасте 18 лет и старше и обязан предоставить Компании полную и точную информацию, необходимую для подтверждения запрошенного бронирования.",
      },
      {
        type: "p",
        text: "Любой клиент, подтверждающий бронирование любого тура, в котором указано и забронировано более одного клиента, заявляет и гарантирует Компании, что:",
      },
      {
        type: "ul",
        items: [
          "они обладают всеми необходимыми согласиями и полномочиями для осуществления такого бронирования от имени всех остальных клиентов, указанных в бронировании, и предоставили всю необходимую информацию другим клиентам для получения от них свободного и полностью информированного согласия.",
          "предоставленная ими информация обо всех клиентах является полной и точной, и они получили все необходимые согласия и разрешения на передачу такой информации Компании в целях завершения бронирования.",
        ],
      },
      { type: "h2", text: "Отмена бронирования" },
      {
        type: "p",
        text: "Клиент может отказаться от тура и отменить бронирование, уведомив об этом Компанию не менее чем за 5 дней.",
      },
      {
        type: "ul",
        items: [
          "В случае отмены за 4 дня до начала тура клиент оплачивает комиссию в размере 30% от стоимости тура.",
          "В случае отмены за 3 дня до начала тура — в размере 50% от стоимости тура.",
          "В случае отмены менее чем за 48 часов до начала тура — в размере полной стоимости тура.",
        ],
      },
      { type: "h2", text: "Страхование путешествия" },
      {
        type: "p",
        text: "Компания не предоставляет страхование путешествий, поэтому клиент должен оформить его в своей стране с минимальным рекомендуемым покрытием медицинских расходов, эвакуации и репатриации, которое охватывает весь период путешествия в рамках запланированного Компанией тура.",
      },
      {
        type: "p",
        text: "Клиентам также рекомендуется расширить страховое покрытие, включив в него отмену бронирования или тура, а также все другие расходы, которые могут возникнуть во время тура в результате потери, повреждения, травмы, задержки или иных непредвиденных обстоятельств.",
      },
      { type: "h2", text: "Использование материалов" },
      {
        type: "p",
        text: "При участии в любом туре Компании другие клиенты и/или представители либо гиды Компании могут делать фотографии или видеозаписи, на которых частично или полностью может фигурировать клиент.",
      },
      {
        type: "p",
        text: "Клиент подтверждает, что данные материалы являются полученными на правах использования. Он соглашается на съемку таких фотографий и видеозаписей и без требования какой-либо компенсации предоставляет Компании и уполномоченным лицам бессрочное право использовать эти материалы в любых законных целях (включая маркетинговые) любыми законными способами.",
      },
      { type: "h2", text: "Поправки" },
      {
        type: "p",
        text: "Компания оставляет за собой право в любое время обновлять и/или изменять настоящие Правила и условия и размещать измененные Правила и условия на веб-сайте Компании.",
      },
    ],
  },
};

export const legalContent = { privacy, terms } as const;

export function getLegalDocument(
  kind: "privacy" | "terms",
  locale: string
): LegalDocument {
  const lookup = legalContent[kind] as Record<string, LegalDocument>;
  return lookup[locale] ?? lookup.en;
}
