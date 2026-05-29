'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/lib/quiz-store';
import { useTelegram } from '@/hooks/use-telegram';
import { ArrowLeft, ChevronDown, HelpCircle, Gamepad2, Shield, FileText, Trophy, Coins, Swords, Flame, Gift, Ticket, Dice5, Users, Castle, Frame, Link2, Calendar, ThumbsUp, Palette, ShieldCheck, Cloud, MessageCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  emoji: string;
  icon: any;
  gradient: string;
  isLegal?: boolean;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Как играть?',
    answer: 'Выбери категорию или режим, отвечай на вопросы за отведённое время. Чем быстрее и точнее отвечаешь — тем больше очков и монет получаешь. Используй паверапы (заморозка, 50/50, подсказка) чтобы помочь себе в сложных ситуациях.',
    emoji: '🎮',
    icon: Gamepad2,
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    question: 'Что такое лиги?',
    answer: 'Лиги отражают твой уровень игры. Начинаешь с Бронзы и продвигаешься к Серебру, Золоту, Платине и Алмазу. Переход происходит автоматически при наборе определённого количества очков. Каждые 2 недели начинается новый сезон — соревнуйся за повышение в лиге!',
    emoji: '🏅',
    icon: Trophy,
    gradient: 'from-amber-500 to-yellow-400',
  },
  {
    question: 'Зачем нужны монеты?',
    answer: 'Монеты — внутриигровая валюта. За них можно купить паверапы (заморозка, 50/50, подсказка), аватары в магазине и продолжить игру в режиме Выживания при ошибке (100 монет). Монеты зарабатываются за каждую игру, выполнения заданий и достижений, а также за привлечение друзей по реферальной ссылке.',
    emoji: '🪙',
    icon: Coins,
    gradient: 'from-yellow-500 to-amber-400',
  },
  {
    question: 'Как работают дуэли?',
    answer: 'Создай дуэль — пройди 10 вопросов, и поделись ссылкой с другом в Telegram или VK. Он пройдёт те же вопросы, и его результат сравнится с твоим. Победитель получает бонусные 20 монет!',
    emoji: '⚔️',
    icon: Swords,
    gradient: 'from-red-500 to-orange-400',
  },
  {
    question: 'Что такое режим «Выживание»?',
    answer: 'В режиме Выживание ты играешь пока не ошибёшься. Одна ошибка — и игра окончена! Но теперь можно продолжить за 100 монет (не более 3 раз за игру). За каждые 5 правильных ответов множитель очков увеличивается (x1 -> x1.5 -> x2 -> x2.5 -> x3). Доберись до 10, 20 или 50 правильных ответов за особые награды!',
    emoji: '💀',
    icon: Shield,
    gradient: 'from-red-600 to-rose-400',
  },
  {
    question: 'Что такое комбо-система?',
    answer: 'Комбо — это множитель бонусных очков за серию правильных ответов подряд. 3 правильных подряд = x1.5, 5 = x2, 10 = x3. Комбо сбрасывается при ошибке. Чем длиннее серия — тем больше бонусных очков ты получаешь!',
    emoji: '🔥',
    icon: Flame,
    gradient: 'from-orange-500 to-red-400',
  },
  {
    question: 'Что такое сундуки?',
    answer: 'После каждой игры выпадает сундук с наградой. Обычный — после каждой игры, Серебряный — за 5 игр в день, Золотой — за победу в дуэли. В сундуках можно найти монеты и даже редкие аватары!',
    emoji: '🎁',
    icon: Gift,
    gradient: 'from-amber-600 to-yellow-400',
  },
  {
    question: 'Что такое сезонный пропуск?',
    answer: 'Сезонный пропуск — это система наград за активную игру. Зарабатывая очки сезона, ты продвигаешься по уровням пропуска и получаешь монеты, аватары, паверапы и рамки профиля. Чем больше играешь — тем больше наград!',
    emoji: '🎖️',
    icon: Ticket,
    gradient: 'from-emerald-500 to-green-400',
  },
  {
    question: 'Как работают мини-игры?',
    answer: 'Мини-игра «Правда или Ложь» — быстрый режим, где нужно определить, верное утверждение или нет. У тебя 5 секунд на каждый ответ. За правильный ответ получаешь 5 монет, за серию правильных — бонус. Отличная тренировка интуиции!',
    emoji: '🎯',
    icon: Dice5,
    gradient: 'from-violet-500 to-purple-400',
  },
  {
    question: 'Что такое друзья?',
    answer: 'Добавляй друзей, чтобы видеть их прогресс и сравнивать результаты. Поделись реферальной ссылкой — когда друг перейдёт по ней, вы оба получите бонус. Скоро появится возможность отправлять вызовы на дуэль прямо из списка друзей!',
    emoji: '👥',
    icon: Users,
    gradient: 'from-teal-500 to-cyan-400',
  },
  {
    question: 'Что такое кланы?',
    answer: 'Кланы — это объединения игроков. Создай свой клан или вступи в существующий, чтобы вместе зарабатывать очки и соревноваться с другими кланами. Участие в клане даёт бонус к очкам сезона. Функция скоро станет доступна!',
    emoji: '🏰',
    icon: Castle,
    gradient: 'from-indigo-500 to-blue-400',
  },
  {
    question: 'Что такое рамки профиля?',
    answer: 'Рамки профиля — это визуальное оформление твоей аватарки. Рамки разблокируются за достижения: уровень, победы в дуэлях, рекорды выживания и сезонные награды. Выбери рамку, которая отражает твой стиль!',
    emoji: '🖼️',
    icon: Frame,
    gradient: 'from-pink-500 to-rose-400',
  },
  {
    question: 'Как работает реферальная система?',
    answer: 'Поделись ссылкой на КВИЗЛИК с другом — когда он зайдёт по твоей ссылке, вы оба получите по 50 монет! Ссылку можно найти в профиле. В Telegram ссылка ведёт к боту, в VK — прямо в приложение. Чем больше друзей приглашаешь — тем больше монет.',
    emoji: '🔗',
    icon: Link2,
    gradient: 'from-sky-500 to-blue-400',
  },
  {
    question: 'Что такое ивенты?',
    answer: 'Ивенты — это временные игровые события с особыми наградами. Ивент может длиться несколько дней и предлагает уникальные задания или бонусы. Следи за иконкой ивента на главном экране, чтобы не пропустить!',
    emoji: '🎪',
    icon: Calendar,
    gradient: 'from-rose-500 to-pink-400',
  },
  {
    question: 'Как оценить вопрос?',
    answer: 'Во время игры можно поставить вопросу лайк или дизлайк. Это помогает нам улучшать базу вопросов — плохие вопросы заменяются, а хорошие появляются чаще. Твои оценки сохраняются и помогают делать КВИЗЛИК лучше!',
    emoji: '👍',
    icon: ThumbsUp,
    gradient: 'from-lime-500 to-green-400',
  },
  {
    question: 'Как разблокировать темы?',
    answer: 'Темы оформления разблокируются по мере прогресса: Ретро — на 5 уровне, Космос — на 10, Кэнди — на 15. Пиратская тема покупается за 500 монет, Огненная — за 10 побед в дуэлях, Ледяная — за 7-дневную серию. Каждая тема полностью меняет визуальное оформление приложения!',
    emoji: '🎨',
    icon: Palette,
    gradient: 'from-fuchsia-500 to-pink-400',
  },
  {
    question: 'Безопасно ли приложение?',
    answer: 'Да! КВИЗЛИК не собирает и не передаёт личные данные третьим лицам. Мы храним только твой никнейм из Telegram/VK и игровой прогресс (очки, монеты, достижения) для работы таблицы лидеров и облачного сохранения. Никаких паролей, email или контактов мы не сохраняем.',
    emoji: '🛡️',
    icon: ShieldCheck,
    gradient: 'from-green-500 to-emerald-400',
  },
  {
    question: 'Пропадёт ли мой прогресс?',
    answer: 'Твой прогресс полностью сохраняется в облаке и привязан к твоему аккаунту. Все данные — монеты, уровень, достижения, друзья, клан, сезонный пропуск, рамки профиля и всё остальное — синхронизируются автоматически. Даже если удалишь приложение и установишь заново — прогресс восстановится при входе.',
    emoji: '☁️',
    icon: Cloud,
    gradient: 'from-blue-400 to-sky-300',
  },
  {
    question: 'Политика конфиденциальности',
    answer: 'Нажмите на этот вопрос, чтобы перейти к полной политике конфиденциальности и условиям использования приложения.',
    emoji: '🛡️',
    icon: Shield,
    gradient: 'from-purple-500 to-indigo-400',
    isLegal: true,
  },
  {
    question: 'Как связаться с разработчиком?',
    answer: 'Нашли баг или есть предложение? Пишите @Digerr в Telegram или в сообщениях группы VK. Мы всегда рады обратной связи!',
    emoji: '💬',
    icon: MessageCircle,
    gradient: 'from-cyan-500 to-blue-400',
  },
];

export default function FaqScreen() {
  const { setPhase } = useQuizStore();
  const { haptic } = useTelegram();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-[100dvh] bg-[var(--theme-bg)] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--theme-bg)]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <button
            onClick={() => { haptic('light'); setPhase('home'); }}
            className="w-9 h-9 rounded-xl bg-[var(--theme-card)] border border-white/10 flex items-center justify-center hover:bg-[var(--theme-card-hover)] active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-white/70" />
          </button>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <h2 className="text-white font-bold text-lg">FAQ</h2>
          </div>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="flex-1 px-4 py-3 overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 120px)' }}>
        <div className="flex flex-col gap-2">
          {FAQ_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`bg-[var(--theme-card)] border rounded-2xl overflow-hidden transition-colors duration-200 ${
                  isOpen ? 'border-white/20 shadow-lg shadow-white/5' : 'border-white/5'
                }`}
              >
                <button
                  onClick={() => { haptic('light'); if (item.isLegal) { useQuizStore.getState().setPhase('privacy_policy'); } else { setOpenIndex(isOpen ? null : i); } }}
                  className="w-full p-3.5 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
                >
                  {/* Icon circle */}
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  {/* Question text */}
                  <span className="text-white font-semibold text-[13px] flex-1 leading-tight">{item.question}</span>
                  {/* Chevron */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="w-4 h-4 text-white/30" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-3.5 pb-4 pt-0">
                        <div className="pl-12">
                          <div className="w-full h-px bg-white/5 mb-3" />
                          <p className="text-white/60 text-[13px] leading-relaxed">{item.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pb-4 text-center">
          <p className="text-white/15 text-[10px]">КВИЗЛИК v4.2 • made by @Digerr</p>
        </div>
      </div>
    </div>
  );
}
