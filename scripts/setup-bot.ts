#!/usr/bin/env bun
/**
 * КВИЗЛИК — Telegram Bot Setup Script
 * 
 * Этот скрипт создаёт Telegram бота и настраивает Mini App.
 * Запуск: bun run setup-bot
 */

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || "";

if (!BOT_TOKEN) {
  console.error("❌ Ошибка: Не указан BOT_TOKEN в .env файле");
  console.log("Добавьте строку BOT_TOKEN=ваш_токен в файл .env");
  process.exit(1);
}

if (!WEBAPP_URL) {
  console.error("❌ Ошибка: Не указан WEBAPP_URL в .env файле");
  console.log("Добавьте строку WEBAPP_URL=https://ваш-домен.vercel.app в файл .env");
  process.exit(1);
}

async function setupBot() {
  console.log("🤖 Настройка Telegram бота для КВИЗЛИК...\n");

  // 1. Set bot commands
  console.log("1️⃣ Устанавливаем команды бота...");
  const commandsRes = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commands: [
          { command: "start", description: "🎮 Начать игру" },
          { command: "play", description: "🧠 Играть в квиз" },
          { command: "stats", description: "📊 Моя статистика" },
        ],
      }),
    }
  );
  const commandsData = await commandsRes.json();
  if (commandsData.ok) {
    console.log("   ✅ Команды установлены\n");
  } else {
    console.log("   ❌ Ошибка:", commandsData.description, "\n");
  }

  // 2. Set bot description
  console.log("2️⃣ Устанавливаем описание бота...");
  const descRes = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setMyDescription`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description:
          "🧠 КВИЗЛИК — Проверь свои знания! 10 категорий, 200+ вопросов, лиги и рейтинги.",
      }),
    }
  );
  const descData = await descRes.json();
  if (descData.ok) {
    console.log("   ✅ Описание установлено\n");
  } else {
    console.log("   ❌ Ошибка:", descData.description, "\n");
  }

  // 3. Set bot short description
  console.log("3️⃣ Устанавливаем краткое описание...");
  const shortDescRes = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setMyShortDescription`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        short_description: "🧠 КВИЗЛИК — Квиз-игра с лигами и рейтингами!",
      }),
    }
  );
  const shortDescData = await shortDescRes.json();
  if (shortDescData.ok) {
    console.log("   ✅ Краткое описание установлено\n");
  } else {
    console.log("   ❌ Ошибка:", shortDescData.description, "\n");
  }

  // 4. Set menu button with web app
  console.log("4️⃣ Устанавливаем кнопку меню...");
  const menuRes = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menu_button: {
          type: "web_app",
          text: "🧠 Играть",
          web_app: { url: WEBAPP_URL },
        },
      }),
    }
  );
  const menuData = await menuRes.json();
  if (menuData.ok) {
    console.log("   ✅ Кнопка меню установлена\n");
  } else {
    console.log("   ❌ Ошибка:", menuData.description, "\n");
  }

  console.log("🎉 Настройка завершена!\n");
  console.log("Теперь откройте бота в Telegram и нажмите /start");
  console.log(`URL Mini App: ${WEBAPP_URL}`);
}

setupBot().catch(console.error);
