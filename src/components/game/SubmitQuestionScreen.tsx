"use client";
import { useQuizStore } from "@/lib/quiz-store";
import { CATEGORIES } from "@/lib/quiz-data";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SubmitQuestionScreen() {
  const { setPhase } = useQuizStore();
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!category || !question || options.some(o => !o.trim())) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-4 min-h-[100dvh] bg-[var(--theme-bg)] flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">✅</div>
        <div className="text-white text-xl font-bold mb-2">Спасибо!</div>
        <div className="text-white/60 text-center mb-6">
          Ваш вопрос отправлен на модерацию.<br/>Если его одобрят — вы получите 50 монет!
        </div>
        <button onClick={() => setPhase("home")} className="px-6 py-3 bg-blue-500 rounded-xl text-white font-bold">
          На главную
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-[100dvh] bg-[var(--theme-bg)]">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setPhase("home")} className="text-white/60 text-sm">← Назад</button>
        <h2 className="text-xl font-bold text-white">✍️ Предложить вопрос</h2>
        <div />
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-white/60 text-sm mb-1 block">Категория</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded-xl bg-[var(--theme-card)] text-white border border-white/10 outline-none"
          >
            <option value="">Выберите категорию</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-white/60 text-sm mb-1 block">Вопрос</label>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Введите вопрос..."
            className="w-full p-3 rounded-xl bg-[var(--theme-card)] text-white border border-white/10 outline-none"
          />
        </div>

        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => setCorrectIndex(i)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                correctIndex === i ? "bg-green-500 text-white" : "bg-white/10 text-white/40"
              }`}
            >
              {correctIndex === i ? "✓" : String.fromCharCode(65 + i)}
            </button>
            <input
              value={opt}
              onChange={(e) => {
                const newOpts = [...options];
                newOpts[i] = e.target.value;
                setOptions(newOpts);
              }}
              placeholder={`Вариант ${String.fromCharCode(65 + i)}`}
              className="flex-1 p-3 rounded-xl bg-[var(--theme-card)] text-white border border-white/10 outline-none"
            />
          </div>
        ))}

        <motion.button
          onClick={handleSubmit}
          className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold"
          whileTap={{ scale: 0.97 }}
        >
          📤 Отправить вопрос
        </motion.button>
      </div>
    </div>
  );
}
