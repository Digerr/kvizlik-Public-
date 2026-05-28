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
  { id: "russia", name: "Россия и СНГ", emoji: "🇷🇺", color: "#dc2626", description: "История, культура, география России и СНГ" },
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
  // Survival achievements
  { id: "survival_10", name: "Выживший", description: "Ответь правильно на 10 вопросов подряд в Выживании", emoji: "💀", condition: "survivalRecord >= 10", reward: 50 },
  { id: "survival_20", name: "Неуязвимый", description: "Ответь правильно на 20 вопросов подряд в Выживании", emoji: "🛡️", condition: "survivalRecord >= 20", reward: 150 },
  { id: "survival_50", name: "Бессмертный", description: "Ответь правильно на 50 вопросов подряд в Выживании", emoji: "⚡", condition: "survivalRecord >= 50", reward: 500 },
  { id: "duel_winner_10", name: "Дуэлянт", description: "Выиграй 10 дуэлей", emoji: "⚔️", condition: "duelsWon >= 10", reward: 100 },
  // More game count achievements
  { id: "hundred_games", name: "Легенда", description: "Сыграй 100 игр", emoji: "👑", condition: "gamesPlayed >= 100", reward: 500 },
  // More streak achievements
  { id: "streak_15", name: "Неудержимый!", description: "Ответь правильно 15 раз подряд", emoji: "💫", condition: "bestStreak >= 15", reward: 200 },
  { id: "streak_20", name: "Бог знаний!", description: "Ответь правильно 20 раз подряд", emoji: "🧿", condition: "bestStreak >= 20", reward: 300 },
  // More coin achievements
  { id: "coins_500", name: "Богач", description: "Накопи 500 монет", emoji: "💰", condition: "coins >= 500", reward: 75 },
  { id: "coins_1000", name: "Магнат", description: "Накопи 1000 монет", emoji: "🏦", condition: "coins >= 1000", reward: 150 },
  // More level achievements
  { id: "level_15", name: "Мастер", description: "Достигни 15 уровня", emoji: "🎖️", condition: "level >= 15", reward: 200 },
  { id: "level_25", name: "Грандмастер", description: "Достигни 25 уровня", emoji: "🏅", condition: "level >= 25", reward: 400 },
  // More correct answer achievements
  { id: "five_hundred_correct", name: "Полтысячи!", description: "Ответь правильно на 500 вопросов", emoji: "🌟", condition: "totalCorrect >= 500", reward: 300 },
  { id: "thousand_correct", name: "Тысяча!", description: "Ответь правильно на 1000 вопросов", emoji: "💫", condition: "totalCorrect >= 1000", reward: 500 },
  // Duel achievements
  { id: "duel_first", name: "Первая дуэль", description: "Сыграй свою первую дуэль", emoji: "⚔️", condition: "duelsPlayed >= 1", reward: 25 },
  { id: "duel_master", name: "Мастер дуэлей", description: "Выиграй 25 дуэлей", emoji: "🗡️", condition: "duelsWon >= 25", reward: 300 },
  // Theme achievement
  { id: "theme_collector", name: "Коллекционер", description: "Разблокируй 4 темы оформления", emoji: "🎨", condition: "unlockedThemes >= 4", reward: 150 },
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
  // New common avatars (cheaper, entry-level)
  { id: "penguin", name: "Пингвин", emoji: "🐧", price: 15, rarity: "common" },
  { id: "monkey", name: "Обезьяна", emoji: "🐵", price: 25, rarity: "common" },
  { id: "robot", name: "Робот", emoji: "🤖", price: 40, rarity: "common" },
  // New rare avatars
  { id: "ninja", name: "Ниндзя", emoji: "🥷", price: 100, rarity: "rare" },
  { id: "ghost", name: "Призрак", emoji: "👻", price: 150, rarity: "rare" },
  { id: "pirate", name: "Пират", emoji: "🏴‍☠️", price: 180, rarity: "rare" },
  // New epic avatars
  { id: "astronaut", name: "Космонавт", emoji: "🧑‍🚀", price: 350, rarity: "epic" },
  { id: "vampire", name: "Вампир", emoji: "🧛", price: 400, rarity: "epic" },
  { id: "superhero", name: "Супергерой", emoji: "🦸", price: 450, rarity: "epic" },
  // New legendary avatars
  { id: "phoenix", name: "Феникс", emoji: "🔥", price: 600, rarity: "legendary" },
  { id: "galaxy", name: "Галактика", emoji: "🌌", price: 1000, rarity: "legendary" },
  { id: "infinity", name: "Бесконечность", emoji: "♾️", price: 1500, rarity: "legendary" },
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
  type: "games" | "correct" | "streak" | "category" | "duel";
}

export const DAILY_TASKS_TEMPLATE: Omit<DailyTask, "id">[] = [
  { name: "Разминка", description: "Сыграй 1 игру", emoji: "🎯", target: 1, reward: 5, type: "games" },
  { name: "Три попытки", description: "Сыграй 3 игры", emoji: "🎲", target: 3, reward: 15, type: "games" },
  { name: "Марафон", description: "Сыграй 5 игр", emoji: "🏃", target: 5, reward: 30, type: "games" },
  { name: "Меткость", description: "Ответь правильно на 5 вопросов", emoji: "🎯", target: 5, reward: 10, type: "correct" },
  { name: "Снайпер", description: "Ответь правильно на 10 вопросов", emoji: "🔫", target: 10, reward: 25, type: "correct" },
  { name: "Пулемётчик", description: "Ответь правильно на 20 вопросов", emoji: "🔫", target: 20, reward: 40, type: "correct" },
  { name: "Серия!", description: "Набей серию из 3 правильных ответов", emoji: "⚡", target: 3, reward: 15, type: "streak" },
  { name: "Огненная серия!", description: "Набей серию из 5 правильных ответов", emoji: "🔥", target: 5, reward: 30, type: "streak" },
  { name: "Разнообразие", description: "Сыграй в 2 разных категории", emoji: "🌈", target: 2, reward: 10, type: "category" },
  { name: "Исследователь", description: "Сыграй в 3 разных категории", emoji: "🗺️", target: 3, reward: 25, type: "category" },
  { name: "Дуэлянт", description: "Сыграй 1 дуэль", emoji: "⚔️", target: 1, reward: 20, type: "duel" },
  { name: "Воин", description: "Выиграй 1 дуэль", emoji: "🛡️", target: 1, reward: 30, type: "duel" },
];

// ==================== THEMES ====================

export interface ThemeDef {
  id: string;
  name: string;
  emoji: string;
  unlockCondition: "default" | "level" | "coins" | "duels" | "streak";
  unlockValue: number;
  colors: {
    bg: string;
    card: string;
    cardHover: string;
    accentFrom: string;
    accentTo: string;
    textAccent?: string;
  };
}

export const THEMES: ThemeDef[] = [
  {
    id: "neon",
    name: "Неон",
    emoji: "🌙",
    unlockCondition: "default",
    unlockValue: 0,
    colors: {
      bg: "#0f0a1e",
      card: "#1a1235",
      cardHover: "#221a45",
      accentFrom: "#9333ea",
      accentTo: "#2563eb",
    },
  },
  {
    id: "retro",
    name: "Ретро",
    emoji: "🕹️",
    unlockCondition: "level",
    unlockValue: 5,
    colors: {
      bg: "#0a0f0a",
      card: "#0f1a0f",
      cardHover: "#1a2e1a",
      accentFrom: "#22c55e",
      accentTo: "#16a34a",
      textAccent: "#4ade80",
    },
  },
  {
    id: "cosmos",
    name: "Космос",
    emoji: "🌌",
    unlockCondition: "level",
    unlockValue: 10,
    colors: {
      bg: "#05051a",
      card: "#0f0f2e",
      cardHover: "#1a1a4e",
      accentFrom: "#6366f1",
      accentTo: "#06b6d4",
    },
  },
  {
    id: "candy",
    name: "Кэнди",
    emoji: "🍬",
    unlockCondition: "level",
    unlockValue: 15,
    colors: {
      bg: "#1a0a1e",
      card: "#2e0f2e",
      cardHover: "#4e1a4e",
      accentFrom: "#ec4899",
      accentTo: "#f43f5e",
    },
  },
  {
    id: "pirate",
    name: "Пират",
    emoji: "🏴‍☠️",
    unlockCondition: "coins",
    unlockValue: 500,
    colors: {
      bg: "#0f0a0a",
      card: "#1a120f",
      cardHover: "#2e2015",
      accentFrom: "#d97706",
      accentTo: "#ca8a04",
    },
  },
  {
    id: "fire",
    name: "Огонь",
    emoji: "🔥",
    unlockCondition: "duels",
    unlockValue: 10,
    colors: {
      bg: "#1a0a05",
      card: "#2e120a",
      cardHover: "#4e1f10",
      accentFrom: "#dc2626",
      accentTo: "#ea580c",
    },
  },
  {
    id: "ice",
    name: "Лёд",
    emoji: "❄️",
    unlockCondition: "streak",
    unlockValue: 7,
    colors: {
      bg: "#050a1a",
      card: "#0a122e",
      cardHover: "#10204e",
      accentFrom: "#3b82f6",
      accentTo: "#22d3ee",
    },
  },
];

// ==================== DAILY CHAIN (7 дней) ====================

export interface DailyChainDay {
  day: number;
  task: string;
  reward: number;
  rewardType: "coins" | "silver_chest";
}

export const DAILY_CHAIN: DailyChainDay[] = [
  { day: 1, task: "Сыграй 1 игру", reward: 30, rewardType: "coins" },
  { day: 2, task: "Ответь правильно на 5 вопросов", reward: 50, rewardType: "coins" },
  { day: 3, task: "Сыграй 2 игры", reward: 75, rewardType: "coins" },
  { day: 4, task: "Выиграй дуэль ИЛИ 10 правильных ответов", reward: 100, rewardType: "coins" },
  { day: 5, task: "Набей серию из 5 правильных ответов", reward: 150, rewardType: "coins" },
  { day: 6, task: "Сыграй 3 игры", reward: 200, rewardType: "coins" },
  { day: 7, task: "Выполни все задания выше", reward: 0, rewardType: "silver_chest" },
];

// ==================== CHEST TYPES ====================

export interface ChestType {
  id: "common" | "silver" | "gold";
  emoji: string;
  name: string;
  description: string;
  coinRange: [number, number];
  avatarChance: number;
  avatarRarity: "common" | "rare" | "epic";
}

export const CHEST_TYPES: ChestType[] = [
  {
    id: "common",
    emoji: "🪙",
    name: "Обычный сундук",
    description: "После каждой игры",
    coinRange: [5, 20],
    avatarChance: 0.1,
    avatarRarity: "common",
  },
  {
    id: "silver",
    emoji: "🥈",
    name: "Серебряный сундук",
    description: "5 игр за день",
    coinRange: [15, 40],
    avatarChance: 0.2,
    avatarRarity: "rare",
  },
  {
    id: "gold",
    emoji: "🥇",
    name: "Золотой сундук",
    description: "Победа в дуэли",
    coinRange: [30, 80],
    avatarChance: 0.15,
    avatarRarity: "epic",
  },
];

// ==================== DUEL REACTIONS ====================

export const DUEL_REACTIONS = ["😱", "😰", "🔥", "💀", "🤯", "😎", "👍", "😂"] as const;

// ==================== SURVIVAL MILESTONES ====================

export const SURVIVAL_MILESTONES = [
  { correct: 10, coins: 50 },
  { correct: 20, coins: 100 },
  { correct: 50, coins: 500 },
] as const;

export function getQuestionsForCategory(categoryId: string, count: number = 10, seenIds: string[] = []): Question[] {
  let pool = QUESTIONS.filter(q => q.category === categoryId && !seenIds.includes(q.id));
  if (pool.length < count) {
    // Include seen questions but deprioritize them — put unseen first
    const seen = QUESTIONS.filter(q => q.category === categoryId && seenIds.includes(q.id));
    pool = [...pool, ...seen.sort(() => Math.random() - 0.5)];
  }
  if (pool.length < count) {
    pool = QUESTIONS.filter(q => q.category === categoryId);
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getMixedQuestions(count: number = 10, seenIds: string[] = []): Question[] {
  let unseen = QUESTIONS.filter(q => !seenIds.includes(q.id));
  let seen = QUESTIONS.filter(q => seenIds.includes(q.id));
  // Prioritize unseen, shuffle both pools
  unseen = unseen.sort(() => Math.random() - 0.5);
  seen = seen.sort(() => Math.random() - 0.5);
  const pool = [...unseen, ...seen];
  return pool.slice(0, count);
}

export function getQuestionsByDifficulty(categoryId: string | null, difficulty: number, count: number = 10, seenIds: string[] = []): Question[] {
  const allForCategory = categoryId
    ? QUESTIONS.filter(q => q.category === categoryId && q.difficulty <= difficulty)
    : QUESTIONS.filter(q => q.difficulty <= difficulty);

  let unseen = allForCategory.filter(q => !seenIds.includes(q.id));
  let seen = allForCategory.filter(q => seenIds.includes(q.id));

  unseen = unseen.sort(() => Math.random() - 0.5);
  seen = seen.sort(() => Math.random() - 0.5);

  let pool = [...unseen, ...seen];
  if (pool.length < count) {
    pool = [...allForCategory].sort(() => Math.random() - 0.5);
  }
  return pool.slice(0, count);
}

export function getQuestionsByIds(ids: string[]): Question[] {
  const questionMap = new Map(QUESTIONS.map(q => [q.id, q]));
  return ids.map(id => questionMap.get(id)).filter((q): q is Question => q !== undefined);
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

  // ===== RUSSIA / CIS =====
  { id: "ru1", category: "russia", question: "Кто был первым президентом Российской Федерации?", options: ["Горбачёв", "Ельцин", "Путин", "Черномырдин"], correctIndex: 1, difficulty: 1 },
  { id: "ru2", category: "russia", question: "Какой город основал Пётр I в 1703 году?", options: ["Москва", "Казань", "Санкт-Петербург", "Новгород"], correctIndex: 2, difficulty: 1 },
  { id: "ru3", category: "russia", question: "В каком году был запущен первый искусственный спутник Земли?", options: ["1955", "1957", "1959", "1961"], correctIndex: 1, difficulty: 1, funFact: "Спутник-1 был запущен 4 октября 1957 года" },
  { id: "ru4", category: "russia", question: "Кто написал роман в стихах «Евгений Онегин»?", options: ["Лермонтов", "Пушкин", "Гоголь", "Тургенев"], correctIndex: 1, difficulty: 1 },
  { id: "ru5", category: "russia", question: "Какой космонавт первым вышел в открытый космос?", options: ["Гагарин", "Леонов", "Титов", "Комаров"], correctIndex: 1, difficulty: 2, funFact: "Алексей Леонов вышел в открытый космос 18 марта 1965 года на 12 минут" },
  { id: "ru6", category: "russia", question: "В каком году распался СССР?", options: ["1989", "1990", "1991", "1992"], correctIndex: 2, difficulty: 1 },
  { id: "ru7", category: "russia", question: "Какая река самая длинная полностью на территории России?", options: ["Обь", "Енисей", "Лена", "Волга"], correctIndex: 2, difficulty: 2, funFact: "Лена — 4 400 км, протекает полностью по территории России" },
  { id: "ru8", category: "russia", question: "Сколько республик входило в состав СССР?", options: ["12", "13", "15", "17"], correctIndex: 2, difficulty: 1 },
  { id: "ru9", category: "russia", question: "Какой город называют «Северной столицей» России?", options: ["Мурманск", "Архангельск", "Санкт-Петербург", "Петрозаводск"], correctIndex: 2, difficulty: 1 },
  { id: "ru10", category: "russia", question: "Какой космодром является первым и старейшим в мире?", options: ["Плесецк", "Куру", "Байконур", "Восточный"], correctIndex: 2, difficulty: 2, funFact: "Байконур был основан в 1955 году в Казахстане и до сих пор используется Россией" },
  { id: "ru11", category: "russia", question: "Кто была первой в мире женщиной-космонавтом?", options: ["Савицкая", "Терешкова", "Кондакова", "Кузнецова"], correctIndex: 1, difficulty: 1, funFact: "Валентина Терешкова совершила полёт 16 июня 1963 года" },
  { id: "ru12", category: "russia", question: "Как называется самая длинная железная дорога в мире?", options: ["Транссибирская магистраль", "БАМ", "Северный ход", "Южный ход"], correctIndex: 0, difficulty: 1, funFact: "Транссиб — 9 288 км, соединяет Москву и Владивосток" },
  { id: "ru13", category: "russia", question: "Какой русский учёный создал периодическую таблицу элементов?", options: ["Ломоносов", "Менделеев", "Бутлеров", "Марковников"], correctIndex: 1, difficulty: 1 },
  { id: "ru14", category: "russia", question: "В каком году состоялась Куликовская битва?", options: ["1242", "1380", "1480", "1612"], correctIndex: 1, difficulty: 2 },
  { id: "ru15", category: "russia", question: "Какой советский танк стал символом Победы в Великой Отечественной войне?", options: ["КВ-1", "ИС-2", "Т-34", "Т-54"], correctIndex: 2, difficulty: 1 },
  { id: "ru16", category: "russia", question: "Столица Беларуси?", options: ["Гомель", "Минск", "Витебск", "Брест"], correctIndex: 1, difficulty: 1 },
  { id: "ru17", category: "russia", question: "Какая гора является самой высокой точкой России?", options: ["Казбек", "Эльбрус", "Белуха", "Дыхтау"], correctIndex: 1, difficulty: 2, funFact: "Эльбрус — 5 642 м, это самая высокая гора Европы" },
  { id: "ru18", category: "russia", question: "Кто руководил СССР в годы Великой Отечественной войны?", options: ["Ленин", "Сталин", "Хрущёв", "Брежнев"], correctIndex: 1, difficulty: 1 },
  { id: "ru19", category: "russia", question: "Какой русский полководец не проиграл ни одного сражения?", options: ["Кутузов", "Суворов", "Ушаков", "Жуков"], correctIndex: 1, difficulty: 2, funFact: "Суворов провёл более 60 сражений и ни одного не проиграл" },
  { id: "ru20", category: "russia", question: "Какой русский народный праздник отмечается перед Великим постом с блинами?", options: ["Масленица", "Колядки", "Иван Купала", "Троица"], correctIndex: 0, difficulty: 1 },
  { id: "ru21", category: "russia", question: "Какой русский писатель создал поэму «Мёртвые души»?", options: ["Толстой", "Достоевский", "Гоголь", "Тургенев"], correctIndex: 2, difficulty: 1 },
  { id: "ru22", category: "russia", question: "Столица Казахстана?", options: ["Алматы", "Астана", "Шымкент", "Караганда"], correctIndex: 1, difficulty: 1 },
  { id: "ru23", category: "russia", question: "В каком году произошла Октябрьская революция?", options: ["1905", "1914", "1917", "1922"], correctIndex: 2, difficulty: 1 },
  { id: "ru24", category: "russia", question: "Какой русский поэт погиб на дуэли в 37 лет?", options: ["Лермонтов", "Пушкин", "Есенин", "Маяковский"], correctIndex: 1, difficulty: 1, funFact: "Дуэль Пушкина с Дантесом состоялась 8 февраля 1837 года" },
  { id: "ru25", category: "russia", question: "Какой русский художник написал картину «Богатыри»?", options: ["Репин", "Васнецов", "Суриков", "Врубель"], correctIndex: 1, difficulty: 2 },
  { id: "ru26", category: "russia", question: "Какой город был переименован в Свердловск в советское время?", options: ["Нижний Новгород", "Екатеринбург", "Самара", "Челябинск"], correctIndex: 1, difficulty: 2 },
  { id: "ru27", category: "russia", question: "Кто стал Первым секретарём ЦК КПСС после смерти Сталина?", options: ["Маленков", "Хрущёв", "Брежнев", "Андропов"], correctIndex: 1, difficulty: 2, funFact: "Хрущёв выступил с докладом о «разоблачении культа личности» на XX съезде КПСС" },
  { id: "ru28", category: "russia", question: "Какая советская станция стала первой обитаемой орбитальной станцией?", options: ["Мир", "Салют-1", "Скайлэб", "Заря"], correctIndex: 1, difficulty: 3, funFact: "Станция «Салют-1» была выведена на орбиту 19 апреля 1971 года" },
  { id: "ru29", category: "russia", question: "Как называется знаменитый музей в Санкт-Петербурге, расположенный в Зимнем дворце?", options: ["Русский музей", "Эрмитаж", "Третьяковская галерея", "Кунсткамера"], correctIndex: 1, difficulty: 1 },
  { id: "ru30", category: "russia", question: "В каком году Россия перешла на григорианский календарь?", options: ["1700", "1918", "1924", "1945"], correctIndex: 1, difficulty: 3, funFact: "После 31 января 1918 года сразу наступило 14 февраля" },
  { id: "ru31", category: "russia", question: "Какой русский композитор написал оперу «Князь Игорь»?", options: ["Мусоргский", "Бородин", "Римский-Корсаков", "Глинка"], correctIndex: 1, difficulty: 2 },
  { id: "ru32", category: "russia", question: "Какой город называют «Городом невест»?", options: ["Тверь", "Иваново", "Кострома", "Владимир"], correctIndex: 1, difficulty: 2, funFact: "Прозвище появилось из-за большого количества текстильных фабрик, где работали в основном женщины" },
  { id: "ru33", category: "russia", question: "Какая страна СНГ самая большая по территории после России?", options: ["Украина", "Узбекистан", "Казахстан", "Беларусь"], correctIndex: 2, difficulty: 1 },
  { id: "ru34", category: "russia", question: "Какой русский писатель отказался от Нобелевской премии по литературе?", options: ["Солженицын", "Пастернак", "Шолохов", "Бунин"], correctIndex: 1, difficulty: 2, funFact: "Пастернак был вынужден отказаться от премии в 1958 году из-за давления советских властей" },
  { id: "ru35", category: "russia", question: "В каком году отменили крепостное право в России?", options: ["1848", "1855", "1861", "1870"], correctIndex: 2, difficulty: 2, funFact: "Реформа Александра II освободила более 23 млн крепостных крестьян" },
  { id: "ru36", category: "russia", question: "Какой русский драматург написал пьесу «Чайка»?", options: ["Островский", "Гоголь", "Чехов", "Булгаков"], correctIndex: 2, difficulty: 1 },
  { id: "ru37", category: "russia", question: "Кто написал слова современного гимна России?", options: ["Михалков", "Исаковский", "Матусовский", "Энтин"], correctIndex: 0, difficulty: 3, funFact: "Сергей Михалков — автор текстов гимна СССР и гимна Российской Федерации" },
  { id: "ru38", category: "russia", question: "Какой город является столицей Украины?", options: ["Харьков", "Киев", "Одесса", "Львов"], correctIndex: 1, difficulty: 1 },
  { id: "ru39", category: "russia", question: "Какой советский учёный считается основоположником космонавтики?", options: ["Королёв", "Циолковский", "Гагарин", "Келдыш"], correctIndex: 1, difficulty: 2, funFact: "Циолковский ещё в 1903 году разработал теорию ракетного двигателя" },
  { id: "ru40", category: "russia", question: "Какой русский математик отказался от Филдсовской премии и премии в $1 млн?", options: ["Перельман", "Арнольд", "Новиков", "Гельфанд"], correctIndex: 0, difficulty: 2, funFact: "Григорий Перельман доказал гипотезу Пуанкаре, но отказался от всех наград" },
  { id: "ru41", category: "russia", question: "Какой город называют «Третьей столицей» России?", options: ["Новосибирск", "Казань", "Екатеринбург", "Нижний Новгород"], correctIndex: 1, difficulty: 2 },
  { id: "ru42", category: "russia", question: "В каком городе находится Останкинская телебашня?", options: ["Санкт-Петербург", "Москва", "Казань", "Екатеринбург"], correctIndex: 1, difficulty: 1 },
  { id: "ru43", category: "russia", question: "Какой русский композитор написал фортепианный цикл «Времена года»?", options: ["Рахманинов", "Чайковский", "Мусоргский", "Скрябин"], correctIndex: 1, difficulty: 2 },
  { id: "ru44", category: "russia", question: "Какая станция киевского метро является самой глубокой в мире?", options: ["«Золотые ворота»", "«Арсенальная»", "«Крещатик»", "«Днепр»"], correctIndex: 1, difficulty: 3, funFact: "Станция «Арсенальная» находится на глубине 105,5 метров" },
  { id: "ru45", category: "russia", question: "Какой русский царь провёл масштабные реформы и стал первым императором России?", options: ["Иван Грозный", "Александр I", "Пётр I", "Екатерина II"], correctIndex: 2, difficulty: 1 },

  // ===== MORE GENERAL =====
  { id: "g21", category: "general", question: "Какое животное является символом Всемирного фонда дикой природы (WWF)?", options: ["Тигр", "Слон", "Большая панда", "Горилла"], correctIndex: 2, difficulty: 1 },
  { id: "g22", category: "general", question: "Какой знак зодиака идёт первым?", options: ["Телец", "Овен", "Рыбы", "Скорпион"], correctIndex: 1, difficulty: 2 },
  { id: "g23", category: "general", question: "Какой цвет получается при смешивании красного и жёлтого?", options: ["Зелёный", "Фиолетовый", "Оранжевый", "Коричневый"], correctIndex: 2, difficulty: 1 },
  { id: "g24", category: "general", question: "Какая столица мира находится на наибольшей высоте над уровнем моря?", options: ["Кито", "Ла-Пас", "Богота", "Аддис-Абеба"], correctIndex: 1, difficulty: 3, funFact: "Ла-Пас — фактическая столица Боливии, находится на высоте 3 640 м" },
  { id: "g25", category: "general", question: "Какой газ используется в воздушных шарах для полёта?", options: ["Азот", "Кислород", "Гелий", "Водород"], correctIndex: 2, difficulty: 1 },
  { id: "g26", category: "general", question: "В какой стране находятся руины Мачу-Пикчу?", options: ["Мексика", "Перу", "Боливия", "Эквадор"], correctIndex: 1, difficulty: 2 },
  { id: "g27", category: "general", question: "Сколько сторон у додекаэдра?", options: ["8", "10", "12", "20"], correctIndex: 2, difficulty: 3 },
  { id: "g28", category: "general", question: "Какая валюта используется в Великобритании?", options: ["Евро", "Доллар", "Фунт стерлингов", "Крона"], correctIndex: 2, difficulty: 1 },
  { id: "g29", category: "general", question: "Какой океан самый маленький по площади?", options: ["Индийский", "Атлантический", "Северный Ледовитый", "Тихий"], correctIndex: 2, difficulty: 2 },
  { id: "g30", category: "general", question: "Как называется число с единицей и 100 нулями?", options: ["Миллион", "Миллиард", "Гугол", "Центиллион"], correctIndex: 2, difficulty: 2, funFact: "Название «гугол» придумал 9-летний племянник математика Эдварда Каснера" },
  { id: "g31", category: "general", question: "Какая птица является символом мира?", options: ["Орёл", "Ласточка", "Голубь", "Журавль"], correctIndex: 2, difficulty: 1 },
  { id: "g32", category: "general", question: "Какой цветок является символом Нидерландов?", options: ["Роза", "Тюльпан", "Нарцисс", "Гиацинт"], correctIndex: 1, difficulty: 1 },
  { id: "g33", category: "general", question: "Какой металл самый лёгкий?", options: ["Алюминий", "Литий", "Натрий", "Магний"], correctIndex: 1, difficulty: 3 },
  { id: "g34", category: "general", question: "В какой стране зародились Олимпийские игры?", options: ["Италия", "Египет", "Греция", "Персия"], correctIndex: 2, difficulty: 1 },
  { id: "g35", category: "general", question: "Какое животное считается самым умным среди беспозвоночных?", options: ["Медуза", "Пчела", "Осьминог", "Краб"], correctIndex: 2, difficulty: 2, funFact: "Осьминоги умеют открывать банки и решать головоломки" },
  { id: "g36", category: "general", question: "Сколько минут в одних сутках?", options: ["1 000", "1 240", "1 440", "1 500"], correctIndex: 2, difficulty: 2 },
  { id: "g37", category: "general", question: "Какой камень самый твёрдый в мире?", options: ["Рубин", "Алмаз", "Сапфир", "Топаз"], correctIndex: 1, difficulty: 1, funFact: "Алмаз — 10 по шкале Мооса, его можно поцарапать только другим алмазом" },
  { id: "g38", category: "general", question: "Какая страна подарила миру панду?", options: ["Япония", "Вьетнам", "Китай", "Корея"], correctIndex: 2, difficulty: 1 },
  { id: "g39", category: "general", question: "Как называется линия, разделяющая Землю на Северное и Южное полушария?", options: ["Меридиан", "Экватор", "Параллель", "Тропик"], correctIndex: 1, difficulty: 1 },
  { id: "g40", category: "general", question: "Сколько костей в теле кошки?", options: ["180", "206", "230", "256"], correctIndex: 2, difficulty: 3, funFact: "У кошки на 24 кости больше, чем у человека" },

  // ===== MORE SCIENCE =====
  { id: "s21", category: "science", question: "Какая планета имеет больше всего спутников в Солнечной системе?", options: ["Юпитер", "Сатурн", "Уран", "Нептун"], correctIndex: 1, difficulty: 2, funFact: "По данным на 2024 год у Сатурна более 140 подтверждённых спутников" },
  { id: "s22", category: "science", question: "Какой учёный открыл пенициллин?", options: ["Пастер", "Флеминг", "Кох", "Дженнер"], correctIndex: 1, difficulty: 2, funFact: "Александр Флеминг открыл пенициллин случайно в 1928 году" },
  { id: "s23", category: "science", question: "Что измеряется в децибелах?", options: ["Частота", "Давление", "Громкость звука", "Освещённость"], correctIndex: 2, difficulty: 2 },
  { id: "s24", category: "science", question: "Какой элемент имеет атомный номер 1?", options: ["Гелий", "Водород", "Литий", "Углерод"], correctIndex: 1, difficulty: 1 },
  { id: "s25", category: "science", question: "Как называется ближайшая к Земле звезда?", options: ["Сириус", "Проксима Центавра", "Солнце", "Альфа Центавра"], correctIndex: 2, difficulty: 1, funFact: "Солнце — ближайшая к Земле звезда, а Проксима Центавра — ближайшая после Солнца" },
  { id: "s26", category: "science", question: "Какая кислота содержится в лимонах?", options: ["Яблочная", "Лимонная", "Уксусная", "Аскорбиновая"], correctIndex: 1, difficulty: 1 },
  { id: "s27", category: "science", question: "Какой витамин необходим для свёртываемости крови?", options: ["Витамин A", "Витамин C", "Витамин D", "Витамин K"], correctIndex: 3, difficulty: 3, funFact: "Буква K — от слова «коагуляция» (свертывание)" },
  { id: "s28", category: "science", question: "Как называется наука о грибах?", options: ["Ботаника", "Микология", "Зоология", "Альгология"], correctIndex: 1, difficulty: 2 },
  { id: "s29", category: "science", question: "Какой элемент обозначается символом Fe?", options: ["Фтор", "Фосфор", "Железо", "Франций"], correctIndex: 2, difficulty: 2, funFact: "Fe — от латинского «ferrum» (железо)" },
  { id: "s30", category: "science", question: "Что измеряется в Омах?", options: ["Напряжение", "Сила тока", "Мощность", "Электрическое сопротивление"], correctIndex: 3, difficulty: 2 },
  { id: "s31", category: "science", question: "Как называется процесс превращения жидкости в пар?", options: ["Конденсация", "Испарение", "Кристаллизация", "Сублимация"], correctIndex: 1, difficulty: 1 },
  { id: "s32", category: "science", question: "Какая луна Юпитера может скрывать подлёдный океан?", options: ["Ио", "Европа", "Ганимед", "Каллисто"], correctIndex: 1, difficulty: 3, funFact: "Океан Европы может содержать в 2-3 раза больше воды, чем вся Земля" },
  { id: "s33", category: "science", question: "Как называется наука о наследственности?", options: ["Биология", "Генетика", "Эволюция", "Цитология"], correctIndex: 1, difficulty: 1 },
  { id: "s34", category: "science", question: "Сколько планет в Солнечной системе?", options: ["7", "8", "9", "10"], correctIndex: 1, difficulty: 1, funFact: "Плутон был исключён из списка планет в 2006 году" },
  { id: "s35", category: "science", question: "Как называется единица измерения мощности?", options: ["Вольт", "Ампер", "Ватт", "Джоуль"], correctIndex: 2, difficulty: 1 },
  { id: "s36", category: "science", question: "Какой учёный открыл радиоактивность?", options: ["Кюри", "Резерфорд", "Беккерель", "Бор"], correctIndex: 2, difficulty: 3, funFact: "Анри Беккерель открыл радиоактивность случайно в 1896 году" },
  { id: "s37", category: "science", question: "Как называется самая длинная кость в теле человека?", options: ["Плечевая", "Бедренная", "Берцовая", "Ключица"], correctIndex: 1, difficulty: 2 },
  { id: "s38", category: "science", question: "Какая частица имеет положительный заряд?", options: ["Электрон", "Нейтрон", "Протон", "Фотон"], correctIndex: 2, difficulty: 2 },
  { id: "s39", category: "science", question: "Как называется температурная шкала, где 0° — точка замерзания воды?", options: ["Кельвина", "Фаренгейта", "Цельсия", "Реомюра"], correctIndex: 2, difficulty: 1 },
  { id: "s40", category: "science", question: "Что является основным источником энергии для Земли?", options: ["Ветер", "Луна", "Солнце", "Ядро Земли"], correctIndex: 2, difficulty: 1 },

  // ===== MORE HISTORY =====
  { id: "h21", category: "history", question: "В каком году состоялась Бородинская битва?", options: ["1805", "1812", "1815", "1825"], correctIndex: 1, difficulty: 2 },
  { id: "h22", category: "history", question: "Кто был первым русским царём из династии Романовых?", options: ["Пётр I", "Алексей Михайлович", "Михаил Фёдорович", "Фёдор Иванович"], correctIndex: 2, difficulty: 3 },
  { id: "h23", category: "history", question: "В каком году началась Великая Отечественная война?", options: ["1939", "1941", "1942", "1943"], correctIndex: 1, difficulty: 1 },
  { id: "h24", category: "history", question: "Какой древнерусский князь получил прозвище «Невский»?", options: ["Дмитрий Донской", "Александр Невский", "Владимир Мономах", "Ярослав Мудрый"], correctIndex: 1, difficulty: 1 },
  { id: "h25", category: "history", question: "В каком году была принята Декларация независимости США?", options: ["1774", "1776", "1783", "1789"], correctIndex: 1, difficulty: 2 },
  { id: "h26", category: "history", question: "Кто был императором Франции во время нашествия на Россию в 1812 году?", options: ["Людовик XVI", "Карл X", "Наполеон Бонапарт", "Людовик Наполеон"], correctIndex: 2, difficulty: 1 },
  { id: "h27", category: "history", question: "Какой советский маршал принимал Парад Победы в 1945 году?", options: ["Рокоссовский", "Жуков", "Конев", "Василевский"], correctIndex: 1, difficulty: 2, funFact: "Георгий Жуков принимал Парад Победы на белом коне 24 июня 1945 года" },
  { id: "h28", category: "history", question: "В каком году пал Константинополь?", options: ["1204", "1389", "1453", "1492"], correctIndex: 2, difficulty: 3 },
  { id: "h29", category: "history", question: "Какой русский царь известен как «Грозный»?", options: ["Пётр I", "Иван III", "Иван IV", "Алексей Михайлович"], correctIndex: 2, difficulty: 1 },
  { id: "h30", category: "history", question: "Какая битва считается переломной в Великой Отечественной войне?", options: ["Московская", "Сталинградская", "Курская", "Берлинская"], correctIndex: 1, difficulty: 2 },
  { id: "h31", category: "history", question: "В каком году впервые упоминается Москва в летописях?", options: ["1047", "1147", "1247", "1347"], correctIndex: 1, difficulty: 2, funFact: "Москва впервые упомянута в Ипатьевской летописи в 1147 году" },
  { id: "h32", category: "history", question: "Кто написал «Слово о полку Игореве»?", options: ["Нестор", "Неизвестный автор", "Даниил Заточник", "Кирилл Туровский"], correctIndex: 1, difficulty: 3, funFact: "Автор «Слова о полку Игореве» до сих пор не установлен" },
  { id: "h33", category: "history", question: "В каком году была подписана Великая хартия вольностей?", options: ["1066", "1215", "1337", "1492"], correctIndex: 1, difficulty: 3 },
  { id: "h34", category: "history", question: "Какой договор завершил Первую мировую войну для России?", options: ["Версальский мир", "Брестский мир", "Парижский мир", "Лозаннский мир"], correctIndex: 1, difficulty: 2, funFact: "Брестский мир был подписан 3 марта 1918 года, Россия потеряла значительные территории" },
  { id: "h35", category: "history", question: "Какой русский адмирал погиб при обороне Севастополя в Крымскую войну?", options: ["Ушаков", "Нахимов", "Корнилов", "Макаров"], correctIndex: 1, difficulty: 2 },
  { id: "h36", category: "history", question: "В каком веке жил Александр Македонский?", options: ["V до н.э.", "IV до н.э.", "III до н.э.", "I до н.э."], correctIndex: 1, difficulty: 2 },
  { id: "h37", category: "history", question: "Какой корабль стал символом русской революции 1905 года?", options: ["Аврора", "Броненосец «Потёмкин»", "Варяг", "Севастополь"], correctIndex: 1, difficulty: 2, funFact: "Восстание на броненосце «Потёмкин» произошло в июне 1905 года" },
  { id: "h38", category: "history", question: "Какой город был столицей Золотой Орды?", options: ["Булгар", "Сарай", "Казань", "Астрахань"], correctIndex: 1, difficulty: 3 },
  { id: "h39", category: "history", question: "Кто стал первым президентом СССР?", options: ["Ельцин", "Горбачёв", "Лигачёв", "Яковлев"], correctIndex: 1, difficulty: 2, funFact: "Горбачёв был единственным президентом СССР — с 1990 по 1991 год" },
  { id: "h40", category: "history", question: "В каком году была основана Киевская Русь?", options: ["862", "882", "988", "1054"], correctIndex: 1, difficulty: 3, funFact: "Объединение Новгорода и Киева Олегом произошло в 882 году" },

  // ===== MORE MOVIES (incl. Soviet/Russian) =====
  { id: "m21", category: "movies", question: "Какой советский фильм режиссёра Тарковского рассказывает о посещении инопланетной зоны?", options: ["Солярис", "Сталкер", "Зеркало", "Иваново детство"], correctIndex: 1, difficulty: 2 },
  { id: "m22", category: "movies", question: "Кто сыграл главную роль в сериале «17 мгновений весны»?", options: ["Тихонов", "Лановой", "Броневой", "Леонов"], correctIndex: 0, difficulty: 2 },
  { id: "m23", category: "movies", question: "Какой советский комедийный фильм рассказывает о приключениях Шурика?", options: ["Бриллиантовая рука", "Операция «Ы»", "Иван Васильевич", "Кавказская пленница"], correctIndex: 1, difficulty: 1 },
  { id: "m24", category: "movies", question: "Кто режиссёр фильма «Брат»?", options: ["Балабанов", "Бодров", "Лунгин", "Прошкин"], correctIndex: 0, difficulty: 2 },
  { id: "m25", category: "movies", question: "Какой советский анимационный фильм Юрия Норштейна считается шедевром?", options: ["Винни-Пух", "Ёжик в тумане", "Сказка сказок", "Цапля и журавль"], correctIndex: 1, difficulty: 2, funFact: "В Японии «Ёжик в тумане» признан одним из лучших анимационных фильмов всех времён" },
  { id: "m26", category: "movies", question: "В каком году вышел фильм «Ирония судьбы, или С лёгким паром!»?", options: ["1973", "1975", "1977", "1979"], correctIndex: 1, difficulty: 2 },
  { id: "m27", category: "movies", question: "Кто сыграл Данилу Багрова в фильме «Брат»?", options: ["Машков", "Бодров", "Безруков", "Хабенский"], correctIndex: 1, difficulty: 1 },
  { id: "m28", category: "movies", question: "Какой советский фильм получил «Золотую пальмовую ветвь» в Каннах?", options: ["Летят журавли", "Москва слезам не верит", "Баллада о солдате", "Восхождение"], correctIndex: 0, difficulty: 3, funFact: "Фильм Михаила Калатозова получил «Золотую пальмовую ветвь» в 1958 году" },
  { id: "m29", category: "movies", question: "Кто режиссёр фильма «Солярис» (1972)?", options: ["Тарковский", "Калатозов", "Кончаловский", "Шепитько"], correctIndex: 0, difficulty: 2 },
  { id: "m30", category: "movies", question: "Какой актёр играл Жеглова в сериале «Место встречи изменить нельзя»?", options: ["Высоцкий", "Конкин", "Депардье", "Гафтулов"], correctIndex: 0, difficulty: 1, funFact: "Сериал снят по роману братьев Вайнеров «Эра милосердия»" },
  { id: "m31", category: "movies", question: "В каком году вышел первый выпуск «Ну, погоди!»?", options: ["1967", "1969", "1971", "1973"], correctIndex: 1, difficulty: 2 },
  { id: "m32", category: "movies", question: "Какой советский режиссёр снял фильмы «Сталкер» и «Зеркало»?", options: ["Кончаловский", "Тарковский", "Данелия", "Рязанов"], correctIndex: 1, difficulty: 1 },
  { id: "m33", category: "movies", question: "Какой советский фильм рассказывает о новогодней поездке в Ленинград?", options: ["Карнавальная ночь", "Ирония судьбы", "Служебный роман", "Операция «Ы»"], correctIndex: 1, difficulty: 1 },
  { id: "m34", category: "movies", question: "Кто озвучивал Волка в мультфильме «Ну, погоди!»?", options: ["Папанов", "Леонов", "Вицин", "Никулин"], correctIndex: 0, difficulty: 2 },
  { id: "m35", category: "movies", question: "Кто режиссёр фильма «Бриллиантовая рука»?", options: ["Рязанов", "Гайдай", "Данелия", "Тодоровский"], correctIndex: 1, difficulty: 2 },

  // ===== MORE TECH =====
  { id: "t21", category: "tech", question: "Какой язык программирования используется для создания приложений на iOS?", options: ["Kotlin", "Swift", "Dart", "Java"], correctIndex: 1, difficulty: 2 },
  { id: "t22", category: "tech", question: "Что означает аббревиатура URL?", options: ["Uniform Resource Locator", "Universal Reference Link", "Unique Resource Locator", "Unified Resource Link"], correctIndex: 0, difficulty: 2 },
  { id: "t23", category: "tech", question: "Какая российская компания создала поисковик «Яндекс»?", options: ["Рамблер", "Яндекс", "Mail.ru", "Rambler"], correctIndex: 1, difficulty: 1 },
  { id: "t24", category: "tech", question: "Что такое SQL?", options: ["Язык разметки", "Язык структурированных запросов", "Операционная система", "Протокол связи"], correctIndex: 1, difficulty: 2 },
  { id: "t25", category: "tech", question: "В каком году был запущен первый веб-сайт?", options: ["1989", "1991", "1993", "1995"], correctIndex: 1, difficulty: 3, funFact: "Первый сайт создал Тим Бернерс-Ли на сервере CERN в 1991 году" },
  { id: "t26", category: "tech", question: "Кто основал мессенджер Telegram?", options: ["Илон Маск", "Марк Цукерберг", "Павел Дуров", "Джек Дорси"], correctIndex: 2, difficulty: 1, funFact: "Павел Дуров создал Telegram после того, как покинул ВКонтакте" },
  { id: "t27", category: "tech", question: "Что такое NFT?", options: ["Новая файловая технология", "Невзаимозаменяемый токен", "Сетевой протокол", "Формат изображения"], correctIndex: 1, difficulty: 2 },
  { id: "t28", category: "tech", question: "Что означает HTTP?", options: ["HyperText Transfer Protocol", "High Tech Transfer Protocol", "HyperText Transmission Program", "Home Tool Transfer Protocol"], correctIndex: 0, difficulty: 2 },
  { id: "t29", category: "tech", question: "Кто основал социальную сеть ВКонтакте?", options: ["Илон Маск", "Марк Цукерберг", "Павел Дуров", "Алексей Навальный"], correctIndex: 2, difficulty: 1 },
  { id: "t30", category: "tech", question: "Какая российская компания разработала антивирус Касперского?", options: ["Доктор Веб", "Лаборатория Касперского", "Яндекс", "Positive Technologies"], correctIndex: 1, difficulty: 1 },
  { id: "t31", category: "tech", question: "Что такое IP-адрес?", options: ["Название программы", "Уникальный идентификатор устройства в сети", "Тип файла", "Язык программирования"], correctIndex: 1, difficulty: 2 },
  { id: "t32", category: "tech", question: "Какой язык программирования создал Джеймс Гослинг?", options: ["Python", "C++", "Java", "C#"], correctIndex: 2, difficulty: 2 },
  { id: "t33", category: "tech", question: "Что делает команда «git clone»?", options: ["Удаляет репозиторий", "Клонирует репозиторий", "Создаёт ветку", "Отправляет изменения"], correctIndex: 1, difficulty: 2 },
  { id: "t34", category: "tech", question: "Какой язык программирования используется для Android-приложений?", options: ["Swift", "Kotlin", "Objective-C", "Ruby"], correctIndex: 1, difficulty: 2 },
  { id: "t35", category: "tech", question: "Что такое кэш?", options: ["Вид процессора", "Временное хранилище данных", "База данных", "Операционная система"], correctIndex: 1, difficulty: 1 },

  // ===== MORE SPORT (incl. Russian/USSR athletes) =====
  { id: "sp16", category: "sport", question: "Какой советский хоккеист считается одним из лучших всех времён?", options: ["Харламов", "Третьяк", "Михайлов", "Петров"], correctIndex: 0, difficulty: 1, funFact: "Валерий Харламов — легенда советского хоккея, двукратный олимпийский чемпион" },
  { id: "sp17", category: "sport", question: "В каком году сборная СССР по футболу выиграла чемпионат Европы?", options: ["1956", "1960", "1964", "1972"], correctIndex: 1, difficulty: 3 },
  { id: "sp18", category: "sport", question: "Какая советская гимнастка имеет 18 олимпийских медалей?", options: ["Корбут", "Латынина", "Турищева", "Шапошникова"], correctIndex: 1, difficulty: 2, funFact: "Рекорд Ларисы Латыниной — 18 олимпийских медалей — держался 48 лет, пока его не побил Майкл Фелпс" },
  { id: "sp19", category: "sport", question: "Сколько золотых медалей выиграла сборная СССР на Олимпиаде 1980 года?", options: ["50", "65", "80", "95"], correctIndex: 2, difficulty: 3 },
  { id: "sp20", category: "sport", question: "Какой советский шахматист стал чемпионом мира в 1948 году?", options: ["Алехин", "Ботвинник", "Смыслов", "Таль"], correctIndex: 1, difficulty: 2 },
  { id: "sp21", category: "sport", question: "Кто из российских борцов не проиграл ни одного боя за 13 лет?", options: ["Медведь", "Карелин", "Майгуров", "Хадарцев"], correctIndex: 1, difficulty: 1, funFact: "Александр Карелин — трёхкратный олимпийский чемпион по греко-римской борьбе" },
  { id: "sp22", category: "sport", question: "Какой российский теннисист выиграл Открытый чемпионат США 2000 года?", options: ["Кафельников", "Сафин", "Давыденко", "Медведев"], correctIndex: 1, difficulty: 2 },
  { id: "sp23", category: "sport", question: "Какая страна принимала Зимние Олимпийские игры 2014 года?", options: ["Канада", "Россия", "Южная Корея", "Норвегия"], correctIndex: 1, difficulty: 1 },
  { id: "sp24", category: "sport", question: "Какая российская фигуристка выиграла Олимпиаду 2014 года в женском одиночном катании?", options: ["Липницкая", "Сотникова", "Туктамышева", "Медведева"], correctIndex: 1, difficulty: 2 },
  { id: "sp25", category: "sport", question: "Кто тренировал сборную России по футболу на ЧМ-2018?", options: ["Капелло", "Черчесов", "Адвокат", "Хиддинк"], correctIndex: 1, difficulty: 2 },
  { id: "sp26", category: "sport", question: "Какой советский спортсмен считается лучшим вратарём в истории хоккея?", options: ["Третьяк", "Фетисов", "Каспаров", "Харламов"], correctIndex: 0, difficulty: 1 },
  { id: "sp27", category: "sport", question: "В каком городе прошла летняя Универсиада 2013 года?", options: ["Москва", "Казань", "Сочи", "Екатеринбург"], correctIndex: 1, difficulty: 2 },
  { id: "sp28", category: "sport", question: "Кто из советских спортсменов выиграл первое олимпийское золото для СССР?", options: ["Владимир Куц", "Нина Пономарёва", "Юрий Власов", "Лариса Латынина"], correctIndex: 1, difficulty: 3, funFact: "Нина Пономарёва выиграла первую золотую медаль СССР на Олимпиаде 1952 года в метании диска" },
  { id: "sp29", category: "sport", question: "Какой советский легкоатлет установил мировой рекорд в прыжках в высоту, державшийся 12 лет?", options: ["Брумель", "Заславский", "Санеев", "Ященко"], correctIndex: 0, difficulty: 2, funFact: "Валерий Брумель установил 6 мировых рекордов и стал олимпийским чемпионом 1964 года" },
  { id: "sp30", category: "sport", question: "В каком виде спорта сборная России завоевала больше всего золотых медалей на Олимпиаде в Сочи?", options: ["Биатлон", "Фигурное катание", "Лыжные гонки", "Шорт-трек"], correctIndex: 1, difficulty: 2 },

  // ===== MORE GEOGRAPHY (incl. CIS countries) =====
  { id: "ge16", category: "geography", question: "Какой город является столицей Узбекистана?", options: ["Самарканд", "Бухара", "Ташкент", "Хива"], correctIndex: 2, difficulty: 1 },
  { id: "ge17", category: "geography", question: "Какая река протекает через Москву?", options: ["Нева", "Волга", "Москва", "Ока"], correctIndex: 2, difficulty: 1 },
  { id: "ge18", category: "geography", question: "Какой город является крупнейшим в Сибири?", options: ["Омск", "Новосибирск", "Красноярск", "Иркутск"], correctIndex: 1, difficulty: 2 },
  { id: "ge19", category: "geography", question: "Столица Грузии?", options: ["Батуми", "Кутаиси", "Тбилиси", "Сухуми"], correctIndex: 2, difficulty: 1 },
  { id: "ge20", category: "geography", question: "Какой пролив разделяет Азию и Северную Америку?", options: ["Босфор", "Гибралтарский", "Берингов", "Ла-Манш"], correctIndex: 2, difficulty: 2 },
  { id: "ge21", category: "geography", question: "Какое озеро на территории Казахстана и Узбекистана почти полностью высохло?", options: ["Балхаш", "Аральское море", "Иссык-Куль", "Каспийское море"], correctIndex: 1, difficulty: 2, funFact: "Аральское море сократилось на 90% из-за орошения хлопковых полей" },
  { id: "ge22", category: "geography", question: "Какой горный хребет считается границей между Европой и Азией?", options: ["Кавказ", "Уральские горы", "Алтай", "Саяны"], correctIndex: 1, difficulty: 2 },
  { id: "ge23", category: "geography", question: "Столица Армении?", options: ["Гюмри", "Ереван", "Ванадзор", "Степанакерт"], correctIndex: 1, difficulty: 1 },
  { id: "ge24", category: "geography", question: "Какой город является самым холодным крупным городом в мире?", options: ["Норильск", "Якутск", "Воркута", "Мурманск"], correctIndex: 1, difficulty: 2, funFact: "В Якутске температура опускается до -60°C, а летом доходит до +40°C" },
  { id: "ge25", category: "geography", question: "Какая река является самой длинной в Европе?", options: ["Дунай", "Днепр", "Волга", "Дон"], correctIndex: 2, difficulty: 1, funFact: "Волга — 3 530 км, крупнейшая река Европы" },
  { id: "ge26", category: "geography", question: "Столица Азербайджана?", options: ["Гянджа", "Баку", "Сумгаит", "Шеки"], correctIndex: 1, difficulty: 1 },
  { id: "ge27", category: "geography", question: "Какой город на Урале называют «столицей Урала»?", options: ["Челябинск", "Екатеринбург", "Пермь", "Уфа"], correctIndex: 1, difficulty: 2 },
  { id: "ge28", category: "geography", question: "Какое море находится между Россией и Японией?", options: ["Охотское", "Японское", "Берингово", "Восточно-Китайское"], correctIndex: 1, difficulty: 2 },
  { id: "ge29", category: "geography", question: "Столица Кыргызстана?", options: ["Ош", "Бишкек", "Джалал-Абад", "Каракол"], correctIndex: 1, difficulty: 2 },
  { id: "ge30", category: "geography", question: "Какой город является крупнейшим портом на Дальнем Востоке России?", options: ["Хабаровск", "Владивосток", "Находка", "Петропавловск-Камчатский"], correctIndex: 1, difficulty: 1 },

  // ===== MORE MUSIC (incl. Russian/Soviet) =====
  { id: "mu16", category: "music", question: "Какая советская рок-группа исполнила песню «Группа крови»?", options: ["Аквариум", "Кино", "Наутилус Помпилиус", "ДДТ"], correctIndex: 1, difficulty: 1 },
  { id: "mu17", category: "music", question: "Кто является солистом группы «Кино»?", options: ["Шевчук", "Цой", "Гребенщиков", "Бутусов"], correctIndex: 1, difficulty: 1 },
  { id: "mu18", category: "music", question: "Какой русский композитор написал оперу «Евгений Онегин»?", options: ["Мусоргский", "Глинка", "Чайковский", "Римский-Корсаков"], correctIndex: 2, difficulty: 1 },
  { id: "mu19", category: "music", question: "Какая советская песня стала неофициальным гимном космонавтов?", options: ["Трава у дома", "Песня о друге", "Прощание славянки", "День Победы"], correctIndex: 0, difficulty: 3, funFact: "Песню «Трава у дома» группы «Земляне» космонавты традиционно просыпаются на МКС" },
  { id: "mu20", category: "music", question: "Кто написал «Вальс-фантазию»?", options: ["Чайковский", "Глинка", "Римский-Корсаков", "Бородин"], correctIndex: 1, difficulty: 2 },
  { id: "mu21", category: "music", question: "Кто исполнил песню «Миллион алых роз»?", options: ["Пугачёва", "Ротару", "Зыкина", "Гурченко"], correctIndex: 0, difficulty: 1 },
  { id: "mu22", category: "music", question: "Какой советский бард написал песню «Охота на волков»?", options: ["Окуджава", "Высоцкий", "Визбор", "Галич"], correctIndex: 1, difficulty: 2 },
  { id: "mu23", category: "music", question: "Какой русский композитор написал «Картинки с выставки»?", options: ["Мусоргский", "Чайковский", "Римский-Корсаков", "Скрябин"], correctIndex: 0, difficulty: 2 },
  { id: "mu24", category: "music", question: "Какой российский исполнитель победил на «Евровидении» 2008 года?", options: ["Билан", "Лазарев", "Гагарина", "Меладзе"], correctIndex: 0, difficulty: 2, funFact: "Дима Билан принёс России первую и пока единственную победу на «Евровидении»" },
  { id: "mu25", category: "music", question: "Какой инструмент является символом русского народного оркестра?", options: ["Гармонь", "Балалайка", "Домра", "Гусли"], correctIndex: 1, difficulty: 1 },
  { id: "mu26", category: "music", question: "Кто написал оперу «Борис Годунов»?", options: ["Чайковский", "Мусоргский", "Бородин", "Глинка"], correctIndex: 1, difficulty: 2 },
  { id: "mu27", category: "music", question: "Какой советский музыкант был лидером группы «Аквариум»?", options: ["Макаревич", "Гребенщиков", "Шевчук", "Кинчев"], correctIndex: 1, difficulty: 2 },
  { id: "mu28", category: "music", question: "Кто написал балет «Спящая красавица»?", options: ["Прокофьев", "Чайковский", "Глазунов", "Стравинский"], correctIndex: 1, difficulty: 1 },
  { id: "mu29", category: "music", question: "Какой советский композитор написал музыку к песне «Нежность»?", options: ["Пахмутова", "Бабаджанян", "Френкель", "Петров"], correctIndex: 0, difficulty: 3 },
  { id: "mu30", category: "music", question: "Какой русский композитор написал «Рапсодию на тему Паганини»?", options: ["Рахманинов", "Чайковский", "Скрябин", "Прокофьев"], correctIndex: 0, difficulty: 2 },

  // ===== MORE FOOD (incl. Russian/CIS cuisine) =====
  { id: "f16", category: "food", question: "Какой русский суп готовится на квасе?", options: ["Щи", "Окрошка", "Уха", "Солянка"], correctIndex: 1, difficulty: 1 },
  { id: "f17", category: "food", question: "Какой традиционный русский напиток делается из мёда?", options: ["Квас", "Медовуха", "Кисель", "Сбитень"], correctIndex: 1, difficulty: 1 },
  { id: "f18", category: "food", question: "Какой грузинский блюдо представляет собой сырный хлеб?", options: ["Лаваш", "Хачапури", "Чебурек", "Хинкали"], correctIndex: 1, difficulty: 1 },
  { id: "f19", category: "food", question: "Какое русское лакомство делается из взбитого варенья с белками?", options: ["Зефир", "Пастила", "Мармелад", "Халва"], correctIndex: 1, difficulty: 2, funFact: "Коломенская пастила — традиционный русский десерт, известный с XIV века" },
  { id: "f20", category: "food", question: "В какой стране плов является национальным блюдом?", options: ["Казахстан", "Узбекистан", "Туркменистан", "Кыргызстан"], correctIndex: 1, difficulty: 1 },
  { id: "f21", category: "food", question: "Какой русский напиток делается из ферментированного хлеба?", options: ["Компот", "Квас", "Кисель", "Морс"], correctIndex: 1, difficulty: 1, funFact: "Квас известен на Руси более 1000 лет" },
  { id: "f22", category: "food", question: "Какое блюдо русской кухни представляет собой запечённые пирожки с мясом или капустой?", options: ["Расстегаи", "Кулебяки", "Ватрушки", "Пирожки"], correctIndex: 3, difficulty: 1 },
  { id: "f23", category: "food", question: "Какой казахский деликатес готовится из конины?", options: ["Бешбармак", "Казы", "Лагман", "Плов"], correctIndex: 1, difficulty: 2 },
  { id: "f24", category: "food", question: "Какое украинское блюдо представляет собой вареники с вишней?", options: ["Галушки", "Вареники", "Пампушки", "Деруны"], correctIndex: 1, difficulty: 1 },
  { id: "f25", category: "food", question: "Какой кавказский суп готовится с ткемали и грецкими орехами?", options: ["Харчо", "Шурпа", "Чихиртма", "Бозбаш"], correctIndex: 0, difficulty: 2 },

  // ===== MORE NATURE =====
  { id: "n16", category: "nature", question: "Какое животное является символом России?", options: ["Волк", "Медведь", "Лиса", "Орёл"], correctIndex: 1, difficulty: 1 },
  { id: "n17", category: "nature", question: "Какое дерево является символом России?", options: ["Дуб", "Сосна", "Берёза", "Ель"], correctIndex: 2, difficulty: 1 },
  { id: "n18", category: "nature", question: "Какой вид тигра обитает только в России?", options: ["Бенгальский", "Сибирский (амурский)", "Южнокитайский", "Суматранский"], correctIndex: 1, difficulty: 2, funFact: "В дикой природе осталось около 500-600 амурских тигров" },
  { id: "n19", category: "nature", question: "Какое озеро в России называют «жемчужиной Сибири»?", options: ["Ладожское", "Онежское", "Байкал", "Таймыр"], correctIndex: 2, difficulty: 1 },
  { id: "n20", category: "nature", question: "Какой вулкан на Камчатке является самым высоким действующим вулканом Евразии?", options: ["Мутновская сопка", "Ключевская сопка", "Авачинская сопка", "Карымская сопка"], correctIndex: 1, difficulty: 3, funFact: "Ключевская сопка — 4 750 м, самый высокий действующий вулкан Евразии" },
  { id: "n21", category: "nature", question: "Какое животное является самым крупным наземным хищником?", options: ["Гризли", "Белый медведь", "Лев", "Тигр"], correctIndex: 1, difficulty: 1 },
  { id: "n22", category: "nature", question: "Какая рыба является эндемиком Байкала?", options: ["Осётр", "Омуль", "Сёмга", "Стерлядь"], correctIndex: 1, difficulty: 2 },
  { id: "n23", category: "nature", question: "Какое растение-хищник обитает на болотах России?", options: ["Кувшинка", "Росянка", "Тростник", "Мох"], correctIndex: 1, difficulty: 2, funFact: "Росянка ловит насекомых липкими капельками на листьях" },
  { id: "n24", category: "nature", question: "Какая кошка является самой редкой в России?", options: ["Рысь", "Манул", "Дальневосточный леопард", "Снежный барс"], correctIndex: 2, difficulty: 2, funFact: "В дикой природе осталось около 100 дальневосточных леопардов" },
  { id: "n25", category: "nature", question: "Какой кит является единственным полностью пресноводным?", options: ["Кашалот", "Речной дельфин", "Белуха", "Нарвал"], correctIndex: 1, difficulty: 3, funFact: "В Амазонке и Ганге обитают пресноводные дельфины — единственные китообразные, живущие только в реках" },
];
