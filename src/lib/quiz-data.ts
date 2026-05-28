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
}

export const CATEGORIES: Category[] = [
  { id: "general", name: "Общие знания", emoji: "🌍", color: "#3b82f6", description: "Всё понемногу — от столиц до рекордов" },
  { id: "science", name: "Наука", emoji: "🔬", color: "#8b5cf6", description: "Физика, химия, биология и космос" },
  { id: "history", name: "История", emoji: "📜", color: "#f59e0b", description: "Древний мир, войны, открытия" },
  { id: "movies", name: "Кино и сериалы", emoji: "🎬", color: "#ef4444", description: "Голливуд, оскары, цитаты из фильмов" },
  { id: "tech", name: "Технологии", emoji: "💻", color: "#06b6d4", description: "IT, гаджеты, языки программирования" },
  { id: "sport", name: "Спорт", emoji: "⚽", color: "#22c55e", description: "Футбол, Олимпиада, рекорды" },
  { id: "geography", name: "География", emoji: "🗺️", color: "#f97316", description: "Страны, столицы, реки и горы" },
  { id: "music", name: "Музыка", emoji: "🎵", color: "#ec4899", description: "Группы, хиты, инструменты" },
  { id: "food", name: "Еда и напитки", emoji: "🍕", color: "#84cc16", description: "Кухни мира, рецепты, факты о еде" },
  { id: "nature", name: "Природа", emoji: "🌿", color: "#14b8a6", description: "Животные, растения, экология" },
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

export function getLeagueProgress(score: number): number {
  const league = getLeagueByScore(score);
  if (league.maxScore === Infinity) return 100;
  const range = league.maxScore - league.minScore;
  return Math.min(100, Math.round(((score - league.minScore) / range) * 100));
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: string;
  reward: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_game", name: "Первый шаг", description: "Сыграй свою первую игру", emoji: "🎮", condition: "gamesPlayed >= 1", reward: 10 },
  { id: "ten_games", name: "Завсегдатай", description: "Сыграй 10 игр", emoji: "🏆", condition: "gamesPlayed >= 10", reward: 50 },
  { id: "fifty_games", name: "Маньяк квизов", description: "Сыграй 50 игр", emoji: "🔥", condition: "gamesPlayed >= 50", reward: 200 },
  { id: "streak_3", name: "Три подряд!", description: "Ответь правильно 3 раза подряд", emoji: "⚡", condition: "bestStreak >= 3", reward: 15 },
  { id: "streak_5", name: "Пятёрка!", description: "Ответь правильно 5 раз подряд", emoji: "🌟", condition: "bestStreak >= 5", reward: 30 },
  { id: "streak_10", name: "Машина!", description: "Ответь правильно 10 раз подряд", emoji: "🤖", condition: "bestStreak >= 10", reward: 100 },
  { id: "perfect", name: "Перфекционист", description: "Ответь на все вопросы правильно в одной игре", emoji: "💯", condition: "perfect_game", reward: 75 },
  { id: "speed_demon", name: "Молниеносный", description: "Ответь за 3 секунды или быстрее", emoji: "⚡", condition: "fast_answer", reward: 20 },
  { id: "league_silver", name: "Серебро!", description: "Достигни Серебряной лиги", emoji: "🥈", condition: "totalScore >= 50", reward: 50 },
  { id: "league_gold", name: "Золотой!", description: "Достигни Золотой лиги", emoji: "🥇", condition: "totalScore >= 150", reward: 100 },
  { id: "league_platinum", name: "Платиновый!", description: "Достигни Платиновой лиги", emoji: "💎", condition: "totalScore >= 350", reward: 200 },
  { id: "league_diamond", name: "Алмазный!", description: "Достигни Алмазной лиги", emoji: "👑", condition: "totalScore >= 700", reward: 500 },
  { id: "daily_3", name: "Привычка", description: "Играй 3 дня подряд", emoji: "📅", condition: "dailyStreak >= 3", reward: 30 },
  { id: "daily_7", name: "Неделя!", description: "Играй 7 дней подряд", emoji: "🗓️", condition: "dailyStreak >= 7", reward: 100 },
  { id: "daily_30", name: "Месяц!", description: "Играй 30 дней подряд", emoji: "🗓️", condition: "dailyStreak >= 30", reward: 500 },
  { id: "category_all", name: "Эрудит", description: "Сыграй во всех категориях", emoji: "📚", condition: "all_categories", reward: 100 },
  { id: "coins_100", name: "Монетный двор", description: "Накопи 100 монет", emoji: "🪙", condition: "coins >= 100", reward: 25 },
  { id: "level_5", name: "Опытный", description: "Достигни 5 уровня", emoji: "⭐", condition: "level >= 5", reward: 50 },
  { id: "level_10", name: "Ветеран", description: "Достигнь 10 уровня", emoji: "🌟", condition: "level >= 10", reward: 150 },
  { id: "hundred_correct", name: "Сотня!", description: "Ответь правильно на 100 вопросов", emoji: "💯", condition: "totalCorrect >= 100", reward: 100 },
];

export interface PowerUp {
  id: string;
  name: string;
  emoji: string;
  description: string;
  price: number;
}

export const POWER_UPS: PowerUp[] = [
  { id: "freeze", name: "Заморозка", emoji: "❄️", description: "Останавливает таймер на 10 секунд", price: 5 },
  { id: "fiftyFifty", name: "50/50", emoji: "✂️", description: "Убирает 2 неверных варианта", price: 8 },
  { id: "hint", name: "Подсказка", emoji: "💡", description: "Подсвечивает правильный ответ", price: 10 },
];

export interface Avatar {
  id: string;
  name: string;
  emoji: string;
  price: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const AVATARS: Avatar[] = [
  { id: "default", name: "Мозг", emoji: "🧠", price: 0, rarity: "common" },
  { id: "owl", name: "Сова", emoji: "🦉", price: 20, rarity: "common" },
  { id: "fox", name: "Лиса", emoji: "🦊", price: 30, rarity: "common" },
  { id: "cat", name: "Кот учёный", emoji: "🐱", price: 50, rarity: "rare" },
  { id: "dragon", name: "Дракон", emoji: "🐉", price: 80, rarity: "rare" },
  { id: "unicorn", name: "Единорог", emoji: "🦄", price: 120, rarity: "rare" },
  { id: "wizard", name: "Маг", emoji: "🧙", price: 200, rarity: "epic" },
  { id: "alien", name: "Инопланетянин", emoji: "👽", price: 300, rarity: "epic" },
  { id: "crown", name: "Корона", emoji: "👑", price: 500, rarity: "legendary" },
  { id: "diamond", name: "Алмаз", emoji: "💠", price: 800, rarity: "legendary" },
];

export const RARITY_COLORS: Record<string, string> = {
  common: "#9ca3af",
  rare: "#3b82f6",
  epic: "#8b5cf6",
  legendary: "#f59e0b",
};

export const RARITY_NAMES: Record<string, string> = {
  common: "Обычный",
  rare: "Редкий",
  epic: "Эпический",
  legendary: "Легендарный",
};

export interface DailyTask {
  id: string;
  name: string;
  description: string;
  emoji: string;
  target: number;
  reward: number;
  type: "games" | "correct" | "streak" | "category";
}

export const DAILY_TASKS_TEMPLATE: Omit<DailyTask, "id">[] = [
  { name: "Разминка", description: "Сыграй 1 игру", emoji: "🎯", target: 1, reward: 5, type: "games" },
  { name: "Три попытки", description: "Сыграй 3 игры", emoji: "🎲", target: 3, reward: 15, type: "games" },
  { name: "Меткость", description: "Ответь правильно на 5 вопросов", emoji: "🎯", target: 5, reward: 10, type: "correct" },
  { name: "Снайпер", description: "Ответь правильно на 10 вопросов", emoji: "🔫", target: 10, reward: 25, type: "correct" },
  { name: "Серия!", description: "Набей серию из 3 правильных ответов", emoji: "⚡", target: 3, reward: 15, type: "streak" },
  { name: "Разнообразие", description: "Сыграй в 2 разных категории", emoji: "🌈", target: 2, reward: 10, type: "category" },
];

export function getQuestionsForCategory(categoryId: string, count: number = 10, seenIds: string[] = []): Question[] {
  let pool = QUESTIONS.filter(q => q.category === categoryId && !seenIds.includes(q.id));
  if (pool.length < count) {
    pool = QUESTIONS.filter(q => q.category === categoryId);
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getMixedQuestions(count: number = 10, seenIds: string[] = []): Question[] {
  let pool = QUESTIONS.filter(q => !seenIds.includes(q.id));
  if (pool.length < count) {
    pool = [...QUESTIONS];
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getQuestionsByDifficulty(categoryId: string | null, difficulty: number, count: number = 10, seenIds: string[] = []): Question[] {
  let pool = categoryId
    ? QUESTIONS.filter(q => q.category === categoryId && q.difficulty <= difficulty)
    : QUESTIONS.filter(q => q.difficulty <= difficulty);
  pool = pool.filter(q => !seenIds.includes(q.id));
  if (pool.length < count) {
    pool = categoryId
      ? QUESTIONS.filter(q => q.category === categoryId && q.difficulty <= difficulty)
      : QUESTIONS.filter(q => q.difficulty <= difficulty);
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ==================== QUESTIONS DATABASE ====================

export const QUESTIONS: Question[] = [
  // ===== GENERAL =====
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
  { id: "g11", category: "general", question: "Сколько костей в теле акулы?", options: ["0", "50", "200", "400"], correctIndex: 0, difficulty: 2, funFact: "У акул нет костей — их скелет состоит из хрящей!" },
  { id: "g12", category: "general", question: "Какая валюта используется в Японии?", options: ["Юань", "Вона", "Иена", "Бат"], correctIndex: 2, difficulty: 1 },
  { id: "g13", category: "general", question: "Сколько дней в високосном году?", options: ["364", "365", "366", "367"], correctIndex: 2, difficulty: 1 },
  { id: "g14", category: "general", question: "Какой металл жидкий при комнатной температуре?", options: ["Свинец", "Олово", "Ртуть", "Цинк"], correctIndex: 2, difficulty: 2, funFact: "Ртуть плавится при -38.8°C" },
  { id: "g15", category: "general", question: "Какое млекопитающее самое большое?", options: ["Слон", "Синий кит", "Жираф", "Бегемот"], correctIndex: 1, difficulty: 1, funFact: "Синий кит весит до 200 тонн — это как 33 слона!" },
  { id: "g16", category: "general", question: "Как называется страх перед пауками?", options: ["Клаустрофобия", "Арахнофобия", "Акрофобия", "Агорафобия"], correctIndex: 1, difficulty: 2 },
  { id: "g17", category: "general", question: "Сколько ног у паука?", options: ["6", "8", "10", "12"], correctIndex: 1, difficulty: 1 },
  { id: "g18", category: "general", question: "Какая страна подарила Статую Свободы США?", options: ["Англия", "Испания", "Франция", "Италия"], correctIndex: 2, difficulty: 2 },
  { id: "g19", category: "general", question: "Какой орган человеческого тела самый большой?", options: ["Печень", "Мозг", "Кожа", "Лёгкие"], correctIndex: 2, difficulty: 2, funFact: "Кожа взрослого человека весит около 3.6 кг" },
  { id: "g20", category: "general", question: "Сколько сердцебиений делает сердце за день?", options: ["10 000", "50 000", "100 000", "200 000"], correctIndex: 2, difficulty: 3, funFact: "Около 100 000 ударов в день, перекачивая 7 500 литров крови" },

  // ===== SCIENCE =====
  { id: "s1", category: "science", question: "Какая сила удерживает нас на Земле?", options: ["Магнетизм", "Гравитация", "Центробежная", "Ядерная"], correctIndex: 1, difficulty: 1 },
  { id: "s2", category: "science", question: "Что измеряется в Герцах?", options: ["Частота", "Давление", "Мощность", "Температура"], correctIndex: 0, difficulty: 2 },
  { id: "s3", category: "science", question: "Из чего состоит молекула воды?", options: ["H₂O₂", "H₂O", "HO", "H₃O"], correctIndex: 1, difficulty: 1 },
  { id: "s4", category: "science", question: "Какой газ составляет основу атмосферы Земли?", options: ["Кислород", "Углекислый газ", "Азот", "Водород"], correctIndex: 2, difficulty: 2, funFact: "Азот — 78% атмосферы, кислород — только 21%" },
  { id: "s5", category: "science", question: "Сколько костей в теле взрослого человека?", options: ["186", "206", "226", "256"], correctIndex: 1, difficulty: 2, funFact: "У младенца около 270 костей, но часть срастается" },
  { id: "s6", category: "science", question: "Какая частица не имеет электрического заряда?", options: ["Протон", "Электрон", "Нейтрон", "Позитрон"], correctIndex: 2, difficulty: 2 },
  { id: "s7", category: "science", question: "Как называется единица измерения электрического тока?", options: ["Вольт", "Ватт", "Ампер", "Ом"], correctIndex: 2, difficulty: 1 },
  { id: "s8", category: "science", question: "Какой элемент самый распространённый во Вселенной?", options: ["Гелий", "Водород", "Углерод", "Кислород"], correctIndex: 1, difficulty: 2, funFact: "Водород составляет ~75% всей материи Вселенной" },
  { id: "s9", category: "science", question: "Что открыли Пенциас и Уилсон в 1965 году?", options: ["Рентген", "Реликтовое излучение", "Чёрные дыры", "Пульсары"], correctIndex: 1, difficulty: 3 },
  { id: "s10", category: "science", question: "Какой витамин вырабатывается в коже под солнцем?", options: ["Витамин A", "Витамин C", "Витамин D", "Витамин E"], correctIndex: 2, difficulty: 1 },
  { id: "s11", category: "science", question: "Какая планета самая горячая в Солнечной системе?", options: ["Меркурий", "Венера", "Марс", "Юпитер"], correctIndex: 1, difficulty: 2, funFact: "Венера — 462°C из-за парникового эффекта, хотя Меркурий ближе к Солнцу" },
  { id: "s12", category: "science", question: "Что такое ДНК?", options: ["Динамическая нейронная архитектура", "Дезоксирибонуклеиновая кислота", "Диаметрическая нуклеиновая кислота", "Дифференциальная нить"], correctIndex: 1, difficulty: 2 },
  { id: "s13", category: "science", question: "Скорость света приблизительно равна?", options: ["100 000 км/с", "200 000 км/с", "300 000 км/с", "400 000 км/с"], correctIndex: 2, difficulty: 2, funFact: "Точнее — 299 792 458 м/с" },
  { id: "s14", category: "science", question: "Какой учёный сформулировал теорию относительности?", options: ["Ньютон", "Эйнштейн", "Хокинг", "Бор"], correctIndex: 1, difficulty: 1 },
  { id: "s15", category: "science", question: "Как называется процесс деления клетки?", options: ["Мейоз", "Митоз", "Фотосинтез", "Осмос"], correctIndex: 1, difficulty: 2 },
  { id: "s16", category: "science", question: "Какая кислота содержится в желудке человека?", options: ["Серная", "Соляная", "Азотная", "Уксусная"], correctIndex: 1, difficulty: 2 },
  { id: "s17", category: "science", question: "Что измеряет сейсмограф?", options: ["Температуру", "Давление", "Землетрясения", "Влажность"], correctIndex: 2, difficulty: 1 },
  { id: "s18", category: "science", question: "Какой закон описывает F = ma?", options: ["Первый закон Ньютона", "Второй закон Ньютона", "Закон Гука", "Закон Ома"], correctIndex: 1, difficulty: 2 },
  { id: "s19", category: "science", question: "Какой металл является лучшим проводником электричества?", options: ["Медь", "Золото", "Серебро", "Алюминий"], correctIndex: 2, difficulty: 3, funFact: "Серебро — лучший проводник, но медь дешевле и используется чаще" },
  { id: "s20", category: "science", question: "Сколько хромосом у человека?", options: ["23", "44", "46", "48"], correctIndex: 2, difficulty: 2, funFact: "23 пары = 46 хромосом. У шимпанзе — 48" },

  // ===== HISTORY =====
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
  { id: "h11", category: "history", question: "В каком году затонул «Титаник»?", options: ["1910", "1912", "1914", "1916"], correctIndex: 1, difficulty: 1 },
  { id: "h12", category: "history", question: "Кто был последним императором России?", options: ["Александр III", "Николай II", "Александр II", "Пётр III"], correctIndex: 1, difficulty: 1 },
  { id: "h13", category: "history", question: "Какая древняя цивилизация построила Мачу-Пикчу?", options: ["Ацтеки", "Майя", "Инки", "Ольмеки"], correctIndex: 2, difficulty: 2 },
  { id: "h14", category: "history", question: "В каком году завершилась Вторая мировая война?", options: ["1943", "1944", "1945", "1946"], correctIndex: 2, difficulty: 1 },
  { id: "h15", category: "history", question: "Кто написал «Преступление и наказание»?", options: ["Толстой", "Достоевский", "Чехов", "Гоголь"], correctIndex: 1, difficulty: 1 },
  { id: "h16", category: "history", question: "Какой фараон был самым молодым при восшествии на престол?", options: ["Рамзес II", "Тутанхамон", "Клеопатра", "Хеопс"], correctIndex: 1, difficulty: 2, funFact: "Тутанхамон стал фараоном в ~9 лет" },
  { id: "h17", category: "history", question: "Кто основал Рим, по легенде?", options: ["Цезарь", "Ромул", "Нума", "Август"], correctIndex: 1, difficulty: 2 },
  { id: "h18", category: "history", question: "В каком веке жил Чингисхан?", options: ["X", "XI", "XII-XIII", "XIV"], correctIndex: 2, difficulty: 3 },
  { id: "h19", category: "history", question: "Какой город был осаждён 900 дней в WWII?", options: ["Москва", "Сталинград", "Ленинград", "Киев"], correctIndex: 2, difficulty: 2 },
  { id: "h20", category: "history", question: "Кто изобрёл телефон?", options: ["Эдисон", "Белл", "Тесла", "Маркони"], correctIndex: 1, difficulty: 2 },

  // ===== MOVIES =====
  { id: "m1", category: "movies", question: "Кто режиссёр «Начала» (Inception)?", options: ["Скорсезе", "Нолан", "Финчер", "Вильнёв"], correctIndex: 1, difficulty: 1 },
  { id: "m2", category: "movies", question: "Какой фильм получил «Оскар» за лучший фильм в 1994 году?", options: ["Побег из Шоушенка", "Криминальное чтиво", "Список Шиндлера", "Форрест Гамп"], correctIndex: 2, difficulty: 2, funFact: "Список Шиндлера обошёл Побег из Шоушенка" },
  { id: "m3", category: "movies", question: "Кто играет Железного человека в MCU?", options: ["Крис Эванс", "Роберт Дауни мл.", "Крис Хемсворт", "Марк Руффало"], correctIndex: 1, difficulty: 1 },
  { id: "m4", category: "movies", question: "В каком году вышел первый «Матрица»?", options: ["1997", "1999", "2001", "2003"], correctIndex: 1, difficulty: 2 },
  { id: "m5", category: "movies", question: "Какой анимационный фильм студии Pixar вышел первым?", options: ["В поисках Немо", "История игрушек", "Корпорация монстров", "Вверх"], correctIndex: 1, difficulty: 2 },
  { id: "m6", category: "movies", question: "Кто сыграл Джокера в «Тёмном рыцаре»?", options: ["Джек Николсон", "Хоакин Феникс", "Хит Леджер", "Джаред Лето"], correctIndex: 2, difficulty: 1, funFact: "Хит Леджер получил Оскар посмертно" },
  { id: "m7", category: "movies", question: "Какая киновселенная самая кассовая в истории?", options: ["Star Wars", "MCU", "Harry Potter", "James Bond"], correctIndex: 1, difficulty: 2 },
  { id: "m8", category: "movies", question: "Кто режиссёр «Парка Юрского периода»?", options: ["Джеймс Кэмерон", "Стивен Спилберг", "Ридли Скотт", "Питер Джексон"], correctIndex: 1, difficulty: 1 },
  { id: "m9", category: "movies", question: "В каком фильме звучит фраза «I'll be back»?", options: ["Рокки", "Терминатор", "Крепкий орешек", "Коммандо"], correctIndex: 1, difficulty: 1 },
  { id: "m10", category: "movies", question: "Сколько фильмов в основной серии «Гарри Поттер»?", options: ["6", "7", "8", "9"], correctIndex: 2, difficulty: 1 },
  { id: "m11", category: "movies", question: "Какой фильм стал первым цветным?", options: ["Унесённые ветром", "Мост Ватерлоо", "Мир чудес", "Бен-Гур"], correctIndex: 0, difficulty: 3, funFact: "Технически первый цветной — «Мир чудес» (1929)" },
  { id: "m12", category: "movies", question: "Кто сыграл Джека в «Титанике»?", options: ["Брэд Питт", "Леонардо ДиКаприо", "Джонни Депп", "Мэтт Деймон"], correctIndex: 1, difficulty: 1 },
  { id: "m13", category: "movies", question: "Какой мультфильм Disney начинается с смерти родителей?", options: ["Русалочка", "Король Лев", "Красавица и чудовище", "Аладдин"], correctIndex: 1, difficulty: 1 },
  { id: "m14", category: "movies", question: "Кто режиссёр «Побега из Шоушенка»?", options: ["Скорсезе", "Дарабонт", "Нолан", "Финчер"], correctIndex: 1, difficulty: 2 },
  { id: "m15", category: "movies", question: "В каком году вышел первый «Мстители»?", options: ["2010", "2011", "2012", "2013"], correctIndex: 2, difficulty: 2 },
  { id: "m16", category: "movies", question: "Какой актёр играл Джеймса Бонда чаще всех?", options: ["Шон Коннери", "Роджер Мур", "Пирс Броснан", "Дэниел Крейг"], correctIndex: 1, difficulty: 3, funFact: "Роджер Мур — 7 фильмов (1973-1985)" },
  { id: "m17", category: "movies", question: "Кто озвучивает Шрека?", options: ["Адам Сэндлер", "Майк Майерс", "Эдди Мёрфи", "Крис Рок"], correctIndex: 1, difficulty: 1 },
  { id: "m18", category: "movies", question: "В каком фильме Киану Ривз убивает всех из-за собаки?", options: ["Матрица", "Джон Уик", "Скорость", "Константин"], correctIndex: 1, difficulty: 1 },
  { id: "m19", category: "movies", question: "Какой российский фильм получил Оскар?", options: ["Брат", "Война и мир", "Москва слезам не верит", "Летят журавли"], correctIndex: 2, difficulty: 3 },
  { id: "m20", category: "movies", question: "Кто режиссёр «Интерстеллара»?", options: ["Ридли Скотт", "Кристофер Нолан", "Дени Вильнёв", "Джеймс Кэмерон"], correctIndex: 1, difficulty: 1 },

  // ===== TECH =====
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
  { id: "t11", category: "tech", question: "Что означает AI?", options: ["Auto Integration", "Artificial Intelligence", "Advanced Internet", "Algorithm Index"], correctIndex: 1, difficulty: 1 },
  { id: "t12", category: "tech", question: "Какой язык используется для стилизации веб-страниц?", options: ["HTML", "JavaScript", "CSS", "Python"], correctIndex: 2, difficulty: 1 },
  { id: "t13", category: "tech", question: "Что такое VPN?", options: ["Виртуальная частная сеть", "Видеоплеер", "Антивирус", "Браузер"], correctIndex: 0, difficulty: 2 },
  { id: "t14", category: "tech", question: "Кто основал SpaceX?", options: ["Джефф Безос", "Илон Маск", "Ричард Брэнсон", "Билл Гейтс"], correctIndex: 1, difficulty: 1 },
  { id: "t15", category: "tech", question: "Что делает процессор (CPU)?", options: ["Хранит файлы", "Выполняет вычисления", "Выводит изображение", "Подключает к интернету"], correctIndex: 1, difficulty: 1 },
  { id: "t16", category: "tech", question: "Какая социальная сеть была первой крупной?", options: ["Facebook", "MySpace", "Twitter", "ВКонтакте"], correctIndex: 1, difficulty: 2 },
  { id: "t17", category: "tech", question: "Что такое блокчейн?", options: ["Вид процессора", "Распределённый реестр", "Антивирус", "Браузер"], correctIndex: 1, difficulty: 2 },
  { id: "t18", category: "tech", question: "В каком году основана компания Google?", options: ["1996", "1998", "2000", "2002"], correctIndex: 1, difficulty: 2 },
  { id: "t19", category: "tech", question: "Что такое API?", options: ["Язык программирования", "Интерфейс программирования приложений", "База данных", "Операционная система"], correctIndex: 1, difficulty: 3 },
  { id: "t20", category: "tech", question: "Какой самый популярный язык программирования в 2024?", options: ["Java", "C++", "Python", "Rust"], correctIndex: 2, difficulty: 2 },

  // ===== SPORT =====
  { id: "sp1", category: "sport", question: "Сколько игроков в футбольной команде на поле?", options: ["9", "10", "11", "12"], correctIndex: 2, difficulty: 1 },
  { id: "sp2", category: "sport", question: "В каком городе прошли Олимпийские игры 1980 года?", options: ["Лос-Анджелес", "Москва", "Мюнхен", "Сеул"], correctIndex: 1, difficulty: 1 },
  { id: "sp3", category: "sport", question: "Сколько сетов нужно выиграть мужчине для победы в Большом шлеме?", options: ["2", "3", "4", "5"], correctIndex: 1, difficulty: 2 },
  { id: "sp4", category: "sport", question: "Какая страна выиграла больше всего ЧМ по футболу?", options: ["Германия", "Италия", "Бразилия", "Аргентина"], correctIndex: 2, difficulty: 2, funFact: "Бразилия — 5 титулов (1958, 1962, 1970, 1994, 2002)" },
  { id: "sp5", category: "sport", question: "Какой вид спорта называют «королём спорта»?", options: ["Бокс", "Лёгкая атлетика", "Футбол", "Теннис"], correctIndex: 1, difficulty: 3 },
  { id: "sp6", category: "sport", question: "Кто самый титулованный шахматист в истории?", options: ["Каспаров", "Карлсен", "Фишер", "Карпов"], correctIndex: 1, difficulty: 2, funFact: "Магнус Карлсен — рекордсмен по рейтингу (2882)" },
  { id: "sp7", category: "sport", question: "Какая длина марафонской дистанции?", options: ["40 км", "42.195 км", "45 км", "50 км"], correctIndex: 1, difficulty: 2 },
  { id: "sp8", category: "sport", question: "В каком виде спорта используется шайба?", options: ["Кёрлинг", "Хоккей", "Поло", "Крикет"], correctIndex: 1, difficulty: 1 },
  { id: "sp9", category: "sport", question: "Сколько колец на олимпийском флаге?", options: ["4", "5", "6", "7"], correctIndex: 1, difficulty: 1, funFact: "5 колец = 5 континентов" },
  { id: "sp10", category: "sport", question: "Кто прыгнул дальше всех в истории?", options: ["Карл Льюис", "Майк Пауэлл", "Боб Бимон", "Иван Педросо"], correctIndex: 1, difficulty: 3 },
  { id: "sp11", category: "sport", question: "В каком виде спорта есть приём «подкрутка»?", options: ["Бокс", "Фигурное катание", "Теннис", "Плавание"], correctIndex: 1, difficulty: 1 },
  { id: "sp12", category: "sport", question: "Сколько таймов в футбольном матче?", options: ["1", "2", "3", "4"], correctIndex: 1, difficulty: 1 },
  { id: "sp13", category: "sport", question: "Кто выиграл больше всего «Золотых мячей»?", options: ["Криштиану Роналду", "Лионель Месси", "Зинедин Зидан", "Роналдиньо"], correctIndex: 1, difficulty: 2, funFact: "Месси — 8 «Золотых мячей»" },
  { id: "sp14", category: "sport", question: "Какой вид спорта придумал Джеймс Нейсмит?", options: ["Волейбол", "Баскетбол", "Гандбол", "Хоккей"], correctIndex: 1, difficulty: 2 },
  { id: "sp15", category: "sport", question: "Сколько очков приносит тачдаун в американском футболе?", options: ["3", "5", "6", "7"], correctIndex: 2, difficulty: 2 },

  // ===== GEOGRAPHY =====
  { id: "ge1", category: "geography", question: "Столица Австралии?", options: ["Сидней", "Мельбурн", "Канберра", "Брисбен"], correctIndex: 2, difficulty: 2, funFact: "Канберра — компромисс между Сиднеем и Мельбурном" },
  { id: "ge2", category: "geography", question: "Какая самая длинная река в мире?", options: ["Амазонка", "Нил", "Миссисипи", "Янцзы"], correctIndex: 1, difficulty: 2, funFact: "Нил — 6 650 км" },
  { id: "ge3", category: "geography", question: "Сколько материков на Земле?", options: ["5", "6", "7", "8"], correctIndex: 2, difficulty: 1 },
  { id: "ge4", category: "geography", question: "В какой стране находится Тадж-Махал?", options: ["Пакистан", "Индия", "Непал", "Бангладеш"], correctIndex: 1, difficulty: 1 },
  { id: "ge5", category: "geography", question: "Какая самая маленькая страна в мире?", options: ["Монако", "Ватикан", "Сан-Марино", "Лихтенштейн"], correctIndex: 1, difficulty: 2, funFact: "Ватикан — 0.44 км²" },
  { id: "ge6", category: "geography", question: "Столица Канады?", options: ["Торонто", "Ванкувер", "Оттава", "Монреаль"], correctIndex: 2, difficulty: 2 },
  { id: "ge7", category: "geography", question: "Какое самое глубокое озеро в мире?", options: ["Каспийское", "Байкал", "Танганьика", "Верхнее"], correctIndex: 1, difficulty: 2, funFact: "Байкал — 1 642 м, содержит 20% пресной воды" },
  { id: "ge8", category: "geography", question: "На каком континенте нет ни одного государства?", options: ["Южная Америка", "Антарктида", "Океания", "Арктика"], correctIndex: 1, difficulty: 1 },
  { id: "ge9", category: "geography", question: "Какая страна имеет форму сапога?", options: ["Испания", "Италия", "Греция", "Португалия"], correctIndex: 1, difficulty: 1 },
  { id: "ge10", category: "geography", question: "Столица Бразилии?", options: ["Рио-де-Жанейро", "Сан-Паулу", "Бразилиа", "Сальвадор"], correctIndex: 2, difficulty: 3, funFact: "Бразилиа — спланированный город, столица с 1960" },
  { id: "ge11", category: "geography", question: "Какая самая высокая гора в мире?", options: ["К2", "Эверест", "Канченджанга", "Макалу"], correctIndex: 1, difficulty: 1 },
  { id: "ge12", category: "geography", question: "Столица Японии?", options: ["Осака", "Киото", "Токио", "Иокогама"], correctIndex: 2, difficulty: 1 },
  { id: "ge13", category: "geography", question: "Какая страна самая населённая в мире?", options: ["США", "Индия", "Китай", "Индонезия"], correctIndex: 1, difficulty: 2, funFact: "Индия обогнала Китай по населению в 2023 году" },
  { id: "ge14", category: "geography", question: "Какой пролив разделяет Европу и Азию?", options: ["Гибралтарский", "Босфор", "Ла-Манш", "Берингов"], correctIndex: 1, difficulty: 2 },
  { id: "ge15", category: "geography", question: "В какой стране больше всего островов?", options: ["Индонезия", "Филиппины", "Швеция", "Канада"], correctIndex: 2, difficulty: 3, funFact: "У Швеции ~267 570 островов!" },

  // ===== MUSIC =====
  { id: "mu1", category: "music", question: "Кто написал «Лунную сонату»?", options: ["Моцарт", "Бетховен", "Бах", "Шопен"], correctIndex: 1, difficulty: 1 },
  { id: "mu2", category: "music", question: "Сколько струн у стандартной гитары?", options: ["4", "5", "6", "8"], correctIndex: 2, difficulty: 1 },
  { id: "mu3", category: "music", question: "Какая группа исполнила «Bohemian Rhapsody»?", options: ["The Beatles", "Led Zeppelin", "Queen", "Pink Floyd"], correctIndex: 2, difficulty: 1 },
  { id: "mu4", category: "music", question: "Какой инструмент имеет 88 клавиш?", options: ["Орган", "Синтезатор", "Фортепиано", "Аккордеон"], correctIndex: 2, difficulty: 1 },
  { id: "mu5", category: "music", question: "Кто известен как «Король поп-музыки»?", options: ["Принс", "Майкл Джексон", "Элтон Джон", "Фредди Меркьюри"], correctIndex: 1, difficulty: 1 },
  { id: "mu6", category: "music", question: "Из скольких нот состоит музыкальная гамма?", options: ["5", "6", "7", "8"], correctIndex: 2, difficulty: 2 },
  { id: "mu7", category: "music", question: "Какой жанр музыки зародился в Новом Орлеане?", options: ["Блюз", "Джаз", "Рок-н-ролл", "Кантри"], correctIndex: 1, difficulty: 2 },
  { id: "mu8", category: "music", question: "Какой самый продаваемый альбом всех времён?", options: ["Back in Black", "Thriller (MJ)", "Dark Side of the Moon", "The Bodyguard"], correctIndex: 1, difficulty: 2, funFact: "Thriller (1982) продан ~70 млн копий" },
  { id: "mu9", category: "music", question: "Кто спел «Smells Like Teen Spirit»?", options: ["Pearl Jam", "Nirvana", "Soundgarden", "Alice in Chains"], correctIndex: 1, difficulty: 1 },
  { id: "mu10", category: "music", question: "Какой итальянский термин означает «громко»?", options: ["Пиано", "Форте", "Аллегро", "Адажио"], correctIndex: 1, difficulty: 2 },
  { id: "mu11", category: "music", question: "Кто написал «Щелкунчик»?", options: ["Моцарт", "Чайковский", "Римский-Корсаков", "Прокофьев"], correctIndex: 1, difficulty: 2 },
  { id: "mu12", category: "music", question: "Какая группа выпустила альбом «The Dark Side of the Moon»?", options: ["Led Zeppelin", "Pink Floyd", "The Rolling Stones", "The Who"], correctIndex: 1, difficulty: 2 },
  { id: "mu13", category: "music", question: "Какой музыкальный стиль характерен для Боба Марли?", options: ["Блюз", "Регги", "Джаз", "Рок"], correctIndex: 1, difficulty: 1 },
  { id: "mu14", category: "music", question: "Сколько музыкантов в квартете?", options: ["2", "3", "4", "5"], correctIndex: 2, difficulty: 1 },
  { id: "mu15", category: "music", question: "Какой инструмент является самым большим в оркестре?", options: ["Фортепиано", "Контрабас", "Туба", "Арфа"], correctIndex: 0, difficulty: 3 },

  // ===== FOOD =====
  { id: "f1", category: "food", question: "Из какой страны родом пицца?", options: ["Франция", "Италия", "Греция", "Испания"], correctIndex: 1, difficulty: 1 },
  { id: "f2", category: "food", question: "Какой фрукт самый потребляемый в мире?", options: ["Яблоко", "Банан", "Апельсин", "Манго"], correctIndex: 1, difficulty: 2 },
  { id: "f3", category: "food", question: "Из чего делают тофу?", options: ["Пшеница", "Соя", "Рис", "Кукуруза"], correctIndex: 1, difficulty: 2 },
  { id: "f4", category: "food", question: "Какая страна является родиной суши?", options: ["Китай", "Корея", "Япония", "Таиланд"], correctIndex: 2, difficulty: 1 },
  { id: "f5", category: "food", question: "Какой напиток самый потребляемый в мире после воды?", options: ["Кофе", "Чай", "Молоко", "Сок"], correctIndex: 1, difficulty: 2, funFact: "Чай пьют в 2 раза больше чем кофе" },
  { id: "f6", category: "food", question: "Какой сыр традиционно используется в пицце Маргарита?", options: ["Пармезан", "Моцарелла", "Чеддер", "Гауда"], correctIndex: 1, difficulty: 1 },
  { id: "f7", category: "food", question: "Из чего делают шоколад?", options: ["Кофейные бобы", "Какао-бобы", "Орехи", "Кокос"], correctIndex: 1, difficulty: 1 },
  { id: "f8", category: "food", question: "Какая приправа самая дорогая в мире?", options: ["Ваниль", "Шафран", "Кардамон", "Корица"], correctIndex: 1, difficulty: 2, funFact: "Шафран стоит ~$5 000 за кг — нужно 150 000 цветов для 1 кг" },
  { id: "f9", category: "food", question: "Какое мясо используется в традиционном бургере?", options: ["Свинина", "Говядина", "Курица", "Баранина"], correctIndex: 1, difficulty: 1 },
  { id: "f10", category: "food", question: "В какой стране придумали картофель фри?", options: ["США", "Бельгия", "Франция", "Англия"], correctIndex: 1, difficulty: 3, funFact: "Бельгийцы жарили картошку ещё в 1600-х, а «французским» её назвали американцы" },
  { id: "f11", category: "food", question: "Сколько чашек кофе получается из 1 кг зёрен?", options: ["50", "80", "120", "200"], correctIndex: 2, difficulty: 3 },
  { id: "f12", category: "food", question: "Какой овощ самый калорийный?", options: ["Картофель", "Авокадо", "Кукуруза", "Горох"], correctIndex: 1, difficulty: 2, funFact: "Авокадо — 160 ккал/100г, но содержит полезные жиры" },
  { id: "f13", category: "food", question: "Из чего делают водку в классическом варианте?", options: ["Пшеница", "Картофель", "Свёкла", "Виноград"], correctIndex: 0, difficulty: 2 },
  { id: "f14", category: "food", question: "Какое блюдо является национальным в Японии?", options: ["Рамен", "Суши", "Темпура", "Онигири"], correctIndex: 1, difficulty: 1 },
  { id: "f15", category: "food", question: "Сколько вкусов различает язык человека?", options: ["3", "4", "5", "6"], correctIndex: 2, difficulty: 2, funFact: "Сладкий, солёный, кислый, горький, умами" },

  // ===== NATURE =====
  { id: "n1", category: "nature", question: "Какое животное самое большое в мире?", options: ["Слон", "Синий кит", "Жираф", "Кашалот"], correctIndex: 1, difficulty: 1 },
  { id: "n2", category: "nature", question: "Сколько лет может жить дерево баобаб?", options: ["100", "500", "1000", "5000"], correctIndex: 2, difficulty: 2, funFact: "Некоторые баобабы живут более 2000 лет" },
  { id: "n3", category: "nature", question: "Какое животное спит до 22 часов в сутки?", options: ["Ленивец", "Коала", "Кот", "Летучая мышь"], correctIndex: 1, difficulty: 2, funFact: "Коала спит так много из-за низкой питательности эвкалипта" },
  { id: "n4", category: "nature", question: "Какая птица может летать задом наперёд?", options: ["Орёл", "Колибри", "Стриж", "Ласточка"], correctIndex: 1, difficulty: 2, funFact: "Колибри машет крыльями до 80 раз в секунду" },
  { id: "n5", category: "nature", question: "Сколько глаз у пчелы?", options: ["2", "3", "5", "7"], correctIndex: 2, difficulty: 3, funFact: "2 сложных глаза + 3 простых глазка" },
  { id: "n6", category: "nature", question: "Какое животное имеет 3 сердца?", options: ["Осьминог", "Медуза", "Кальмар", "Звезда"], correctIndex: 0, difficulty: 2, funFact: "У осьминога 3 сердца: 1 системное + 2 жаберных" },
  { id: "n7", category: "nature", question: "Какое растение самое быстрорастущее?", options: ["Бамбук", "Подсолнух", "Кипарис", "Эвкалипт"], correctIndex: 0, difficulty: 2, funFact: "Бамбук растёт до 91 см в день!" },
  { id: "n8", category: "nature", question: "Сколько ног у осьминога?", options: ["6", "8", "10", "12"], correctIndex: 1, difficulty: 1 },
  { id: "n9", category: "nature", question: "Какая рыба может менять пол?", options: ["Клоун", "Тунец", "Групер", "Камбала"], correctIndex: 0, difficulty: 3, funFact: "Все рыбы-клоуны рождаются самцами, доминантная особь становится самкой" },
  { id: "n10", category: "nature", question: "Какой процент воды на Земле — пресная?", options: ["3%", "10%", "25%", "50%"], correctIndex: 0, difficulty: 3, funFact: "Только ~3% воды пресная, и 2/3 из неё — в ледниках" },
  { id: "n11", category: "nature", question: "Какое млекопитающее единственное умеет летать?", options: ["Белка-летяга", "Летучая мышь", "Шипохвост", "Кабарга"], correctIndex: 1, difficulty: 2, funFact: "Белка-летяга не летает, а планирует" },
  { id: "n12", category: "nature", question: "Сколько видов акул существует?", options: ["50", "150", "500", "1000"], correctIndex: 2, difficulty: 2 },
  { id: "n13", category: "nature", question: "Какое животное самое медленное в мире?", options: ["Черепаха", "Улитка", "Ленивец", "Слизень"], correctIndex: 1, difficulty: 1, funFact: "Скорость улитки — 0.048 км/ч" },
  { id: "n14", category: "nature", question: "Какая птица самая большая в мире?", options: ["Орёл", "Страус", "Пеликан", "Альбатрос"], correctIndex: 1, difficulty: 1 },
  { id: "n15", category: "nature", question: "Какой цветок самый большой в мире?", options: ["Подсолнух", "Раффлезия", "Пион", "Лотос"], correctIndex: 1, difficulty: 3, funFact: "Раффлезия достигает 1 метра в диаметре и пахнет гнилью" },
];
