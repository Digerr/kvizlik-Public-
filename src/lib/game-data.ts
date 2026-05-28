export interface Location {
  id: string;
  name: string;
  emoji: string;
  category: string;
  hint: string;
}

export const LOCATIONS: Location[] = [
  // Город
  { id: "restaurant", name: "Ресторан", emoji: "🍽️", category: "city", hint: "Здесь подают еду" },
  { id: "hospital", name: "Больница", emoji: "🏥", category: "city", hint: "Здесь лечат людей" },
  { id: "school", name: "Школа", emoji: "🏫", category: "city", hint: "Здесь учатся дети" },
  { id: "police", name: "Полицейский участок", emoji: "🚔", category: "city", hint: "Здесь работают стражи порядка" },
  { id: "theater", name: "Театр", emoji: "🎭", category: "city", hint: "Здесь смотрят спектакли" },
  { id: "hotel", name: "Отель", emoji: "🏨", category: "city", hint: "Здесь останавливаются путешественники" },
  { id: "supermarket", name: "Супермаркет", emoji: "🛒", category: "city", hint: "Здесь покупают продукты" },
  { id: "airport", name: "Аэропорт", emoji: "✈️", category: "city", hint: "Здесь садятся на самолёты" },
  { id: "bank", name: "Банк", emoji: "🏦", category: "city", hint: "Здесь хранят деньги" },
  { id: "stadium", name: "Стадион", emoji: "🏟️", category: "city", hint: "Здесь смотрят спортивные матчи" },
  { id: "cinema", name: "Кинотеатр", emoji: "🎬", category: "city", hint: "Здесь смотрят фильмы" },
  { id: "library", name: "Библиотека", emoji: "📚", category: "city", hint: "Здесь читают книги" },
  { id: "gym", name: "Фитнес-клуб", emoji: "🏋️", category: "city", hint: "Здесь тренируются" },
  { id: "nightclub", name: "Ночной клуб", emoji: "🪩", category: "city", hint: "Здесь танцуют ночью" },
  { id: "embassy", name: "Посольство", emoji: "🏛️", category: "city", hint: "Здесь выдают визы" },
  // Природа
  { id: "beach", name: "Пляж", emoji: "🏖️", category: "nature", hint: "Здесь загорают и купаются" },
  { id: "forest", name: "Лес", emoji: "🌲", category: "nature", hint: "Здесь растут деревья" },
  { id: "mountains", name: "Горы", emoji: "⛰️", category: "nature", hint: "Здесь высоко над уровнем моря" },
  { id: "island", name: "Необитаемый остров", emoji: "🏝️", category: "nature", hint: "Здесь нет цивилизации" },
  { id: "zoo", name: "Зоопарк", emoji: "🦁", category: "nature", hint: "Здесь живут животные" },
  // Экзотика
  { id: "space", name: "Космическая станция", emoji: "🚀", category: "exotic", hint: "Здесь нет гравитации" },
  { id: "pirate", name: "Пиратский корабль", emoji: "🏴‍☠️", category: "exotic", hint: "Здесь ищут сокровища" },
  { id: "castle", name: "Замок", emoji: "🏰", category: "exotic", hint: "Здесь жил король" },
  { id: "circus", name: "Цирк", emoji: "🎪", category: "exotic", hint: "Здесь выступают акробаты" },
  { id: "casino", name: "Казино", emoji: "🎰", category: "exotic", hint: "Здесь играют на деньги" },
  // Транспорт
  { id: "train", name: "Поезд", emoji: "🚂", category: "transport", hint: "Здесь едут по рельсам" },
  { id: "plane", name: "Самолёт", emoji: "✈️", category: "transport", hint: "Здесь летают высоко" },
  { id: "taxi", name: "Такси", emoji: "🚕", category: "transport", hint: "Здесь платят за поездку" },
  { id: "submarine", name: "Подводная лодка", emoji: "🚢", category: "transport", hint: "Здесь глубоко под водой" },
  { id: "subway", name: "Метро", emoji: "🚇", category: "transport", hint: "Здесь ездят под землёй" },
];

export const CATEGORY_INFO: Record<string, { name: string; color: string }> = {
  city: { name: "Город", color: "#3b82f6" },
  nature: { name: "Природа", color: "#22c55e" },
  exotic: { name: "Экзотика", color: "#a855f7" },
  transport: { name: "Транспорт", color: "#f59e0b" },
};

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isSpy: boolean;
  score: number;
}

export const AVATARS = ["🕵️", "🦊", "🐱", "🐶", "🦁", "🐼", "🐸", "🦉", "🐺", "🦄"];

export const TIMER_OPTIONS = [
  { value: 300, label: "5 мин" },
  { value: 420, label: "7 мин" },
  { value: 600, label: "10 мин" },
];

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getRandomLocation(): Location {
  return LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
}

export function getRandomSpyIndex(playerCount: number): number {
  return Math.floor(Math.random() * playerCount);
}

export function getShuffledLocations(exclude?: Location, count: number = 5): Location[] {
  const filtered = exclude ? LOCATIONS.filter(l => l.id !== exclude.id) : [...LOCATIONS];
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
