export interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: 1 | 2 | 3;
  funFact?: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  questionCount: number;
}

export const CATEGORIES: Category[] = [
  { id: "general", name: "Общие знания", emoji: "🌍", color: "#3b82f6", description: "Всё понемногу — от столиц до рекордов", questionCount: 10 },
  { id: "science", name: "Наука", emoji: "🔬", color: "#8b5cf6", description: "Физика, химия, биология и космос", questionCount: 10 },
  { id: "history", name: "История", emoji: "📜", color: "#f59e0b", description: "Древний мир, войны, открытия", questionCount: 10 },
  { id: "movies", name: "Кино и сериалы", emoji: "🎬", color: "#ef4444", description: "Голливуд, оскары, цитаты из фильмов", questionCount: 10 },
  { id: "tech", name: "Технологии", emoji: "💻", color: "#06b6d4", description: "IT, гаджеты, языки программирования", questionCount: 10 },
  { id: "sport", name: "Спорт", emoji: "⚽", color: "#22c55e", description: "Футбол, Олимпиада, рекорды", questionCount: 10 },
  { id: "geography", name: "География", emoji: "🗺️", color: "#f97316", description: "Страны, столицы, реки и горы", questionCount: 10 },
  { id: "music", name: "Музыка", emoji: "🎵", color: "#ec4899", description: "Группы, хиты, инструменты", questionCount: 10 },
];

export const QUESTIONS: Question[] = [
  // General
  { id: "g1", category: "general", question: "Какая страна самая большая по площади?", options: ["Канада", "Китай", "Россия", "США"], correctIndex: 2, difficulty: 1, funFact: "Площадь России — 17.1 млн км², это больше Плутона!" },
  { id: "g2", category: "general", question: "Сколько зубов у взрослого человека?", options: ["28", "30", "32", "34"], correctIndex: 2, difficulty: 1, funFact: "У некоторых людей вырастают «зубы мудрости» — тогда 36" },
  { id: "g3", category: "general", question: "Какой элемент обозначается символом O?", options: ["Осмий", "Кислород", "Олово", "Озон"], correctIndex: 1, difficulty: 1, funFact: "Кислород составляет 21% атмосферы Земли" },
  { id: "g4", category: "general", question: "Какое животное самое быстрое на суше?", options: ["Лев", "Антилопа", "Гепард", "Страус"], correctIndex: 2, difficulty: 1, funFact: "Гепард разгоняется до 112 км/ч за 3 секунды" },
  { id: "g5", category: "general", question: "Сколько цветов в радуге?", options: ["5", "6", "7", "8"], correctIndex: 2, difficulty: 1, funFact: "Ньютон выделил 7 цветов, но границы между ними размыты" },
  { id: "g6", category: "general", question: "Какой океан самый глубокий?", options: ["Атлантический", "Индийский", "Тихий", "Северный Ледовитый"], correctIndex: 2, difficulty: 2, funFact: "Марианская впадина — 10 994 метра глубиной" },
  { id: "g7", category: "general", question: "Какой язык самый распространённый в мире по числу носителей?", options: ["Английский", "Испанский", "Мандаринский китайский", "Хинди"], correctIndex: 2, difficulty: 2 },
  { id: "g8", category: "general", question: "Какая планета ближайшая к Солнцу?", options: ["Венера", "Меркурий", "Марс", "Земля"], correctIndex: 1, difficulty: 1 },
  { id: "g9", category: "general", question: "Из чего делают стекло?", options: ["Песок", "Глина", "Мел", "Соль"], correctIndex: 0, difficulty: 2, funFact: "Основной компонент — кварцевый песок (SiO₂)" },
  { id: "g10", category: "general", question: "Какое насекомое может поднять в 50 раз больше своего веса?", options: ["Пчела", "Муравей", "Жук-носорог", "Таракан"], correctIndex: 1, difficulty: 2 },

  // Science
  { id: "s1", category: "science", question: "Какая сила удерживает нас на Земле?", options: ["Магнетизм", "Гравитация", "Центробежная", "Ядерная"], correctIndex: 1, difficulty: 1 },
  { id: "s2", category: "science", question: "Что измеряется в Герцах?", options: ["Частота", "Давление", "Мощность", "Температура"], correctIndex: 0, difficulty: 2 },
  { id: "s3", category: "science", question: "Из чего состоит молекула воды?", options: ["H₂O₂", "H₂O", "HO", "H₃O"], correctIndex: 1, difficulty: 1 },
  { id: "s4", category: "science", question: "Какой газ составляет основу атмосферы Земли?", options: ["Кислород", "Углекислый газ", "Азот", "Водород"], correctIndex: 2, difficulty: 2, funFact: "Азот — 78% атмосферы, кислород — только 21%" },
  { id: "s5", category: "science", question: "Сколько костей в теле взрослого человека?", options: ["186", "206", "226", "256"], correctIndex: 1, difficulty: 2, funFact: "У младенца около 270 костей, но часть срастается" },
  { id: "s6", category: "science", question: "Какая частица не имеет электрического заряда?", options: ["Протон", "Электрон", "Нейтрон", "Позитрон"], correctIndex: 2, difficulty: 2 },
  { id: "s7", category: "science", question: "Как называется единица измерения электрического тока?", options: ["Вольт", "Ватт", "Ампер", "Ом"], correctIndex: 2, difficulty: 1 },
  { id: "s8", category: "science", question: "Какой элемент самый распространённый во Вселенной?", options: ["Гелий", "Водород", "Углерод", "Кислород"], correctIndex: 1, difficulty: 2, funFact: "Водород составляет ~75% всей материи Вселенной" },
  { id: "s9", category: "science", question: "Что открыл Пенциас и Уилсон в 1965 году?", options: ["Рентген", "Реликтовое излучение", "Чёрные дыры", "Пульсары"], correctIndex: 1, difficulty: 3 },
  { id: "s10", category: "science", question: "Какой витамин вырабатывается в коже под солнцем?", options: ["Витамин A", "Витамин C", "Витамин D", "Витамин E"], correctIndex: 2, difficulty: 1 },

  // History
  { id: "h1", category: "history", question: "В каком году человек впервые полетел в космос?", options: ["1957", "1961", "1965", "1969"], correctIndex: 1, difficulty: 1, funFact: "Юрий Гагарин — 12 апреля 1961 года на корабле «Восток-1»" },
  { id: "h2", category: "history", question: "Кто построил первые пирамиды?", options: ["Римляне", "Египтяне", "Греки", "Персы"], correctIndex: 1, difficulty: 1 },
  { id: "h3", category: "history", question: "В каком году пала Берлинская стена?", options: ["1987", "1989", "1991", "1993"], correctIndex: 1, difficulty: 1 },
  { id: "h4", category: "history", question: "Кто написал «Войну и мир»?", options: ["Достоевский", "Чехов", "Толстой", "Тургенев"], correctIndex: 2, difficulty: 1 },
  { id: "h5", category: "history", question: "Какая цивилизация изобрела колесо?", options: ["Шумеры", "Египтяне", "Китайцы", "Инки"], correctIndex: 0, difficulty: 3, funFact: "Первые колёса появились ~3500 до н.э. в Месопотамии" },
  { id: "h6", category: "history", question: "В каком году началась Первая мировая война?", options: ["1912", "1914", "1916", "1918"], correctIndex: 1, difficulty: 2 },
  { id: "h7", category: "history", question: "Кто был первым президентом США?", options: ["Джефферсон", "Линкольн", "Вашингтон", "Адамс"], correctIndex: 2, difficulty: 1 },
  { id: "h8", category: "history", question: "Какой город был столицей Византийской империи?", options: ["Рим", "Афины", "Константинополь", "Александрия"], correctIndex: 2, difficulty: 2 },
  { id: "h9", category: "history", question: "В каком году открыли Америку?", options: ["1487", "1492", "1498", "1503"], correctIndex: 1, difficulty: 1 },
  { id: "h10", category: "history", question: "Кто изобрёл книгопечатание в Европе?", options: ["Да Винчи", "Гутенберг", "Коперник", "Галилей"], correctIndex: 1, difficulty: 2, funFact: "Библия Гутенберга (~1455) — первая печатная книга в Европе" },

  // Movies
  { id: "m1", category: "movies", question: "Кто режиссёр «Начала» (Inception)?", options: ["Скорсезе", "Нолан", "Финчер", "Вильнев"], correctIndex: 1, difficulty: 1 },
  { id: "m2", category: "movies", question: "Какой фильм получил «Оскар» за лучший фильм в 1994 году?", options: ["Побег из Шоушенка", "Криминальное чтиво", "Список Шиндлера", "Форрест Гамп"], correctIndex: 2, difficulty: 2, funFact: "Список Шиндлера обошёл Побег из Шоушенка, хотя IMDb ставит Шоушенка на #1" },
  { id: "m3", category: "movies", question: "Кто играет Железного человека в MCU?", options: ["Крис Эванс", "Роберт Дауни мл.", "Крис Хемсворт", "Марк Руффало"], correctIndex: 1, difficulty: 1 },
  { id: "m4", category: "movies", question: "В каком году вышел первый «Матрица»?", options: ["1997", "1999", "2001", "2003"], correctIndex: 1, difficulty: 2 },
  { id: "m5", category: "movies", question: "Какой анимационный фильм студии Pixar вышел первым?", options: ["В поисках Немо", "История игрушек", "Корпорация монстров", "Вверх"], correctIndex: 1, difficulty: 2 },
  { id: "m6", category: "movies", question: "Кто сыграл Джокера в «Тёмном рыцаре»?", options: ["Джек Николсон", "Хоакин Феникс", "Хит Леджер", "Джаред Лето"], correctIndex: 2, difficulty: 1, funFact: "Хит Леджер получил Оскар посмертно за эту роль" },
  { id: "m7", category: "movies", question: "Какая киновселенная самая кассовая в истории?", options: ["Star Wars", "MCU", "Harry Potter", "James Bond"], correctIndex: 1, difficulty: 2 },
  { id: "m8", category: "movies", question: "Кто режиссёр «Парка Юрского периода»?", options: ["Джеймс Кэмерон", "Стивен Спилберг", "Ридли Скотт", "Питер Джексон"], correctIndex: 1, difficulty: 1 },
  { id: "m9", category: "movies", question: "В каком фильме звучит фраза «I'll be back»?", options: ["Рокки", "Терминатор", "Крепкий орешек", "Коммандо"], correctIndex: 1, difficulty: 1 },
  { id: "m10", category: "movies", question: "Сколько фильмов в основной серии «Гарри Поттер»?", options: ["6", "7", "8", "9"], correctIndex: 2, difficulty: 1 },

  // Tech
  { id: "t1", category: "tech", question: "Кто основал компанию Apple?", options: ["Билл Гейтс", "Стив Джобс", "Марк Цукерберг", "Илон Маск"], correctIndex: 1, difficulty: 1 },
  { id: "t2", category: "tech", question: "Что означает аббревиатура HTML?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Logic", "Home Tool Markup Language"], correctIndex: 0, difficulty: 1 },
  { id: "t3", category: "tech", question: "Какой язык программирования создал Гвидо ван Россум?", options: ["Java", "C++", "Python", "Ruby"], correctIndex: 2, difficulty: 2, funFact: "Python назван в честь «Monty Python», а не змеи" },
  { id: "t4", category: "tech", question: "В каком году был запущен первый iPhone?", options: ["2005", "2007", "2009", "2010"], correctIndex: 1, difficulty: 1 },
  { id: "t5", category: "tech", question: "Что такое RAM?", options: ["Жёсткий диск", "Оперативная память", "Видеокарта", "Процессор"], correctIndex: 1, difficulty: 1 },
  { id: "t6", category: "tech", question: "Какая компания разработала Android?", options: ["Apple", "Microsoft", "Google", "Samsung"], correctIndex: 2, difficulty: 1 },
  { id: "t7", category: "tech", question: "Что делает команда «git push»?", options: ["Скачивает код", "Отправляет коммиты на сервер", "Удаляет ветку", "Создаёт репозиторий"], correctIndex: 1, difficulty: 2 },
  { id: "t8", category: "tech", question: "Какой протокол используется для отправки email?", options: ["HTTP", "FTP", "SMTP", "SSH"], correctIndex: 2, difficulty: 3 },
  { id: "t9", category: "tech", question: "Сколько бит в одном байте?", options: ["4", "6", "8", "16"], correctIndex: 2, difficulty: 1 },
  { id: "t10", category: "tech", question: "Кто создал Linux?", options: ["Деннис Ритчи", "Линус Торвальдс", "Ричард Столлман", "Тим Бернерс-Ли"], correctIndex: 1, difficulty: 2, funFact: "Линус написал ядро Linux в 1991 году, когда ему было 21" },

  // Sport
  { id: "sp1", category: "sport", question: "Сколько игроков в футбольной команде на поле?", options: ["9", "10", "11", "12"], correctIndex: 2, difficulty: 1 },
  { id: "sp2", category: "sport", question: "В каком городе прошли Олимпийские игры 1980 года?", options: ["Лос-Анджелес", "Москва", "Мюнхен", "Сеул"], correctIndex: 1, difficulty: 1 },
  { id: "sp3", category: "sport", question: "Сколько сетов нужно выиграть мужчине для победы в Большом шлеме?", options: ["2", "3", "4", "5"], correctIndex: 1, difficulty: 2 },
  { id: "sp4", category: "sport", question: "Какая страна выиграла больше всего ЧМ по футболу?", options: ["Германия", "Италия", "Бразилия", "Аргентина"], correctIndex: 2, difficulty: 2, funFact: "Бразилия — 5 титулов (1958, 1962, 1970, 1994, 2002)" },
  { id: "sp5", category: "sport", question: "Какой вид спорта называют «королём спорта»?", options: ["Бокс", "Лёгкая атлетика", "Футбол", "Теннис"], correctIndex: 1, difficulty: 3 },
  { id: "sp6", category: "sport", question: "Кто самый титулованный шахматист в истории?", options: ["Каспаров", "Карлсен", "Фишер", "Карпов"], correctIndex: 1, difficulty: 2, funFact: "Магнус Карлсен — 5-кратный чемпион мира и рекордсмен по рейтингу (2882)" },
  { id: "sp7", category: "sport", question: "Какая длина марафонской дистанции?", options: ["40 км", "42.195 км", "45 км", "50 км"], correctIndex: 1, difficulty: 2 },
  { id: "sp8", category: "sport", question: "В каком виде спорта используется шайба?", options: ["Кёрлинг", "Хоккей", "Поло", "Крикет"], correctIndex: 1, difficulty: 1 },
  { id: "sp9", category: "sport", question: "Сколько колец на олимпийском флаге?", options: ["4", "5", "6", "7"], correctIndex: 1, difficulty: 1, funFact: "5 колец = 5 континентов (Антарктиду не считают)" },
  { id: "sp10", category: "sport", question: "Кто прыгнул дальше всех в истории?", options: ["Карл Льюис", "Майк Пауэлл", "Боб Бимон", "Иван Педросо"], correctIndex: 1, difficulty: 3, funFact: "Майк Пауэлл — 8.95 м (1991), рекорд держится 35+ лет" },

  // Geography
  { id: "ge1", category: "geography", question: "Столица Австралии?", options: ["Сидней", "Мельбурн", "Канберра", "Брисбен"], correctIndex: 2, difficulty: 2, funFact: "Канберра — компромисс между Сиднеем и Мельбурном" },
  { id: "ge2", category: "geography", question: "Какая самая длинная река в мире?", options: ["Амазонка", "Нил", "Миссисипи", "Янцзы"], correctIndex: 1, difficulty: 2, funFact: "Нил — 6 650 км. Но если считать от истока Амазонки, она может быть длиннее" },
  { id: "ge3", category: "geography", question: "Сколько материков на Земле?", options: ["5", "6", "7", "8"], correctIndex: 2, difficulty: 1 },
  { id: "ge4", category: "geography", question: "В какой стране находится Тадж-Махал?", options: ["Пакистан", "Индия", "Непал", "Бангладеш"], correctIndex: 1, difficulty: 1 },
  { id: "ge5", category: "geography", question: "Какая самая маленькая страна в мире?", options: ["Монако", "Ватикан", "Сан-Марино", "Лихтенштейн"], correctIndex: 1, difficulty: 2, funFact: "Ватикан — 0.44 км², это меньше чем парк Горького в Москве" },
  { id: "ge6", category: "geography", question: "Столица Канады?", options: ["Торонто", "Ванкувер", "Оттава", "Монреаль"], correctIndex: 2, difficulty: 2 },
  { id: "ge7", category: "geography", question: "Какое самое глубокое озеро в мире?", options: ["Каспийское", "Байкал", "Танганьика", "Верхнее"], correctIndex: 1, difficulty: 2, funFact: "Байкал — 1 642 м глубиной, содержит 20% мировых запасов пресной воды" },
  { id: "ge8", category: "geography", question: "На каком континенте нет ни одного государства?", options: ["Южная Америка", "Антарктида", "Океания", "Арктика"], correctIndex: 1, difficulty: 1 },
  { id: "ge9", category: "geography", question: "Какая страна имеет форму сапога?", options: ["Испания", "Италия", "Греция", "Португалия"], correctIndex: 1, difficulty: 1 },
  { id: "ge10", category: "geography", question: "Столица Бразилии?", options: ["Рио-де-Жанейро", "Сан-Паулу", "Бразилиа", "Сальвадор"], correctIndex: 2, difficulty: 3, funFact: "Бразилиа — спланированный город, столица с 1960 года" },

  // Music
  { id: "mu1", category: "music", question: "Кто написал «Лунную сонату»?", options: ["Моцарт", "Бетховен", "Бах", "Шопен"], correctIndex: 1, difficulty: 1 },
  { id: "mu2", category: "music", question: "Сколько струн у стандартной гитары?", options: ["4", "5", "6", "8"], correctIndex: 2, difficulty: 1 },
  { id: "mu3", category: "music", question: "Какая группа исполнила «Bohemian Rhapsody»?", options: ["The Beatles", "Led Zeppelin", "Queen", "Pink Floyd"], correctIndex: 2, difficulty: 1 },
  { id: "mu4", category: "music", question: "Какой инструмент имеет 88 клавиш?", options: ["Орган", "Синтезатор", "Фортепиано", "Аккордеон"], correctIndex: 2, difficulty: 1 },
  { id: "mu5", category: "music", question: "Кто известен как «Король поп-музыки»?", options: ["Принс", "Майкл Джексон", "Элтон Джон", "Фредди Меркьюри"], correctIndex: 1, difficulty: 1 },
  { id: "mu6", category: "music", question: "Из скольких нот состоит музыкальная гамма?", options: ["5", "6", "7", "8"], correctIndex: 2, difficulty: 2 },
  { id: "mu7", category: "music", question: "Какой жанр музыки зародился в Новом Орлеане?", options: ["Блюз", "Джаз", "Рок-н-ролл", "Кантри"], correctIndex: 1, difficulty: 2, funFact: "Джаз возник в начале XX века из сплава африканских и европейских традиций" },
  { id: "mu8", category: "music", question: "Какой самый продаваемый альбом всех времён?", options: ["Back in Black (AC/DC)", "Thriller (MJ)", "Dark Side of the Moon", "The Bodyguard"], correctIndex: 1, difficulty: 2, funFact: "Thriller (1982) продан тиражом ~70 млн копий" },
  { id: "mu9", category: "music", question: "Кто спел «Smells Like Teen Spirit»?", options: ["Pearl Jam", "Nirvana", "Soundgarden", "Alice in Chains"], correctIndex: 1, difficulty: 1 },
  { id: "mu10", category: "music", question: "Какой итальянский музыкальный термин означает «громко»?", options: ["Пиано", "Форте", "Аллегро", "Адажио"], correctIndex: 1, difficulty: 2 },
];

export interface League {
  id: string;
  name: string;
  emoji: string;
  minScore: number;
  maxScore: number;
  color: string;
}

export const LEAGUES: League[] = [
  { id: "bronze", name: "Бронза", emoji: "🥉", minScore: 0, maxScore: 49, color: "#cd7f32" },
  { id: "silver", name: "Серебро", emoji: "🥈", minScore: 50, maxScore: 149, color: "#c0c0c0" },
  { id: "gold", name: "Золото", emoji: "🥇", minScore: 150, maxScore: 349, color: "#ffd700" },
  { id: "platinum", name: "Платина", emoji: "💎", minScore: 350, maxScore: 699, color: "#e5e4e2" },
  { id: "diamond", name: "Алмаз", emoji: "👑", minScore: 700, maxScore: Infinity, color: "#b9f2ff" },
];

export function getLeagueByScore(score: number): League {
  return LEAGUES.find(l => score >= l.minScore && score <= l.maxScore) || LEAGUES[0];
}

export function getQuestionsForCategory(categoryId: string, count: number = 10): Question[] {
  const pool = QUESTIONS.filter(q => q.category === categoryId);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getMixedQuestions(count: number = 10): Question[] {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
