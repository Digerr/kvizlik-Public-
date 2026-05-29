'use client';

import { motion } from 'framer-motion';

export default function UnsupportedScreen() {
  return (
    <div className="min-h-[100dvh] bg-[#0f0a1e] flex flex-col items-center justify-center px-6 py-8 text-center">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none bg-purple-600" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-sm w-full"
      >
        <div className="text-6xl mb-6">😔</div>
        <h1 className="text-white font-bold text-xl mb-3">Устройство не поддерживается</h1>
        <p className="text-white/50 text-sm leading-relaxed mb-6">
          К сожалению, ваше устройство или браузер не поддерживает все функции приложения. Пожалуйста, откройте КВИЗЛИК через официальное приложение Telegram или VK на мобильном устройстве.
        </p>
        <div className="bg-[var(--theme-card,#1a1235)] border border-white/10 rounded-2xl p-4 text-left">
          <p className="text-white/70 text-xs font-medium mb-2">Как запустить:</p>
          <ul className="text-white/50 text-xs space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">1.</span>
              <span>Откройте Telegram или VK на телефоне</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">2.</span>
              <span>Найдите КВИЗЛИК в поиске мини-приложений</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">3.</span>
              <span>Запустите приложение изнутри мессенджера</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
