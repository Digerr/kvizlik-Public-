'use client';

import { motion } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { usePlatform } from '@/hooks/use-platform';
import { ArrowLeft, Shield, FileText } from 'lucide-react';
import { useState } from 'react';

const PRIVACY_POLICY = `
Настоящая Политика конфиденциальности описывает, как приложение «КВИЗЛИК» (далее — Приложение) обрабатывает данные пользователей.

1. Какие данные мы собираем
Приложение получает следующие данные из платформы (Telegram или VK):
• Имя пользователя (first_name) — для отображения в приложении и таблице лидеров;
• Фотография профиля (для VK) — для отображения аватара;
• Идентификатор пользователя (telegram_id или vk_user_id) — для сохранения игрового прогресса.

2. Как мы используем данные
Собранные данные используются исключительно для:
• Отображения имени и аватара игрока внутри приложения;
• Сохранения игрового прогресса (очки, монеты, достижения);
• Формирования таблицы лидеров;
• Функции «Дуэль» (отправка ссылки другу).

3. Хранение данных
Данные хранятся в облачной базе данных Supabase (supabase.com, серверы ЕС). Мы храним:
• Идентификатор пользователя;
• Имя (никнейм);
• Игровую статистику (очки, монеты, уровень, достижения).

Мы НЕ храним: пароли, email, номера телефонов, контакты, геолокацию или другие личные данные.

4. Передача данных третьим лицам
Мы НЕ передаём персональные данные пользователей третьим лицам, за исключением случаев, предусмотренных законодательством РФ.

5. Удаление данных
Вы можете запросить удаление своих данных, написав разработчику: @Digerr в Telegram или в сообщениях группы VK.

6. Cookie и трекинг
Приложение НЕ использует cookie, трекинг-пиксели или аналитические сервисы, собирающие персональные данные.

7. Изменения политики
Мы можем обновлять данную политику. Актуальная версия всегда доступна в разделе FAQ → Политика конфиденциальности.

Дата последнего обновления: 30.05.2026
`;

const TERMS_OF_SERVICE = `
Условия использования приложения «КВИЗЛИК»

1. Общие положения
Используя приложение «КВИЗЛИК», вы соглашаетесь с настоящими условиями. Если вы не согласны — пожалуйста, не используйте приложение.

2. Описание сервиса
КВИЗЛИК — бесплатная игровая викторина, доступная как мини-приложение в Telegram и VK. Приложение предлагает вопросы различных категорий, систему достижений, лиг и социальных функций.

3. Виртуальная валюта
Монеты и другие виртуальные ценности в приложении не имеют реальной стоимости и не могут быть обменены на реальные деньги или товары.

4. Поведение пользователей
Запрещается:
• Использовать автоматизированные средства (боты, скрипты) для получения преимущества;
• Оскорблять других игроков;
• Попытки взлома или эксплуатации уязвимостей приложения.

5. Возрастные ограничения
Приложение предназначено для пользователей старше 6 лет.

6. Отказ от ответственности
Приложение предоставляется «как есть». Разработчик не гарантирует бесперебойную работу и не несёт ответственности за потери виртуальных ценностей.

7. Изменения условий
Разработчик оставляет за собой право изменять данные условия. Продолжение использования приложения после изменений означает согласие с ними.

8. Обратная связь
По всем вопросам пишите: @Digerr в Telegram или в сообщениях группы VK.
`;

type Tab = 'privacy' | 'terms';

export default function PrivacyPolicyScreen() {
  const { setPhase } = useQuizStore();
  const { haptic } = usePlatform();
  const [activeTab, setActiveTab] = useState<Tab>('privacy');

  return (
    <div className="min-h-[100dvh] bg-[var(--theme-bg)] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--theme-bg)]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <button
            onClick={() => { haptic('light'); setPhase('faq'); }}
            className="w-9 h-9 rounded-xl bg-[var(--theme-card)] border border-white/10 flex items-center justify-center hover:bg-[var(--theme-card-hover)] active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-white/70" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <h2 className="text-white font-bold text-lg">Правовая информация</h2>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex px-4 pb-2 gap-2">
          <button
            onClick={() => { haptic('light'); setActiveTab('privacy'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'privacy'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30'
                : 'bg-[var(--theme-card)] text-white/40 border border-white/5'
            }`}
          >
            <Shield className="w-3 h-3" />
            Конфиденциальность
          </button>
          <button
            onClick={() => { haptic('light'); setActiveTab('terms'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'terms'
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30'
                : 'bg-[var(--theme-card)] text-white/40 border border-white/5'
            }`}
          >
            <FileText className="w-3 h-3" />
            Условия
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-3 overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 140px)' }}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-[var(--theme-card)] border border-white/5 rounded-2xl p-4"
        >
          <h3 className="text-white font-bold text-base mb-3">
            {activeTab === 'privacy' ? '🛡️ Политика конфиденциальности' : '📋 Условия использования'}
          </h3>
          <div className="text-white/60 text-[13px] leading-relaxed whitespace-pre-line">
            {activeTab === 'privacy' ? PRIVACY_POLICY.trim() : TERMS_OF_SERVICE.trim()}
          </div>
        </motion.div>

        <div className="mt-4 pb-4 text-center">
          <p className="text-white/15 text-[10px]">КВИЗЛИК v4.2 • made by @Digerr</p>
        </div>
      </div>
    </div>
  );
}
