"use client";
import { ArrowRight, Swords } from "lucide-react";
import { useQuizStore } from "@/lib/quiz-store";
import { getMixedQuestions } from "@/lib/quiz-data";
import { ScreenHeading } from "./QuizUI";
export default function DuelScreen() {
  const s = useQuizStore();
  return (
    <div className="q-screen">
      <ScreenHeading title="Кто знает больше?" eyebrow="Дуэль с другом" />
      <div className="q-duel-art">
        <span>ТЫ</span>
        <Swords size={60} />
        <span>ДРУГ</span>
      </div>
      <h2 className="q-big-title">
        Один набор вопросов.
        <br />
        Два любопытных человека.
      </h2>
      <p className="q-intro">
        Сначала сыграй сам. Потом отправь другу ссылку — он ответит на те же
        вопросы и сравнит результаты.
      </p>
      <ol className="q-steps">
        <li>
          <span>01</span>
          <div>
            <strong>Пройди 10 вопросов</strong>
            <p>15 секунд на каждый ответ.</p>
          </div>
        </li>
        <li>
          <span>02</span>
          <div>
            <strong>Отправь вызов</strong>
            <p>Ссылка появится после раунда.</p>
          </div>
        </li>
        <li>
          <span>03</span>
          <div>
            <strong>Пусть друг попробует</strong>
            <p>Сравнение по числу правильных ответов.</p>
          </div>
        </li>
      </ol>
      <button
        className="q-primary"
        onClick={() => s.startDuel(getMixedQuestions(10, s.seenQuestions))}
      >
        Создать вызов <ArrowRight size={21} />
      </button>
      <p className="q-footnote">
        Можно играть в разное время. Ждать соперника не нужно.
      </p>
    </div>
  );
}
