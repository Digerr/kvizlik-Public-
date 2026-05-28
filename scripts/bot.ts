#!/usr/bin/env bun
/**
 * КВИЗЛИК — Telegram Bot Webhook Handler
 * 
 * Обрабатывает команды /start и отправляет кнопку Mini App.
 * Запуск: bun run bot
 */

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || "";

if (!BOT_TOKEN || !WEBAPP_URL) {
  console.error("❌ Укажите BOT_TOKEN и WEBAPP_URL в .env");
  process.exit(1);
}

const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

interface TelegramMessage {
  message_id: number;
  chat: { id: number };
  text?: string;
  from?: { id: number; first_name: string; username?: string };
}

async function sendMessage(chatId: number, text: string, replyMarkup?: any) {
  const body: any = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  };
  if (replyMarkup) body.reply_markup = replyMarkup;

  await fetch(`${API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function handleUpdate(update: any) {
  const message: TelegramMessage | undefined = update.message;
  if (!message) return;

  const chatId = message.chat.id;
  const text = message.text || "";
  const firstName = message.from?.first_name || "Игрок";

  if (text.startsWith("/start") || text.startsWith("/play")) {
    await sendMessage(
      chatId,
      `🧠 <b>Привет, ${firstName}!</b>\n\nДобро пожаловать в <b>КВИЗЛИК</b> — квиз-игру с лигами и рейтингами!\n\n🌍 10 категорий\n📝 200+ вопросов\n🏆 5 лиг\n⚡ Бонусы и достижения\n\nНажми кнопку ниже, чтобы начать:`,
      {
        inline_keyboard: [
          [
            {
              text: "🧠 Играть в КВИЗЛИК",
              web_app: { url: WEBAPP_URL },
            },
          ],
        ],
      }
    );
  } else if (text.startsWith("/stats")) {
    await sendMessage(
      chatId,
      `📊 Твоя статистика будет доступна после первой игры!\n\nНажми кнопку "Играть", чтобы начать:`,
      {
        inline_keyboard: [
          [
            {
              text: "🧠 Играть",
              web_app: { url: WEBAPP_URL },
            },
          ],
        ],
      }
    );
  }
}

// Long polling mode (simpler for mobile deployment)
async function startPolling() {
  console.log("🤖 КВИЗЛИК бот запущен (long polling)...\n");
  
  // Setup bot first
  await fetch(`${API}/setMyCommands`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      commands: [
        { command: "start", description: "🎮 Начать игру" },
        { command: "play", description: "🧠 Играть в квиз" },
        { command: "stats", description: "📊 Моя статистика" },
      ],
    }),
  });

  let offset = 0;

  while (true) {
    try {
      const res = await fetch(
        `${API}/getUpdates?offset=${offset}&timeout=30`
      );
      const data = await res.json();

      if (data.ok && data.result) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          await handleUpdate(update);
        }
      }
    } catch (err) {
      console.error("Polling error:", err);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

startPolling();
