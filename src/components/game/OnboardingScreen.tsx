"use client";
import { ArrowRight } from "lucide-react";
import { useQuizStore } from "@/lib/quiz-store";
import { OrbitArt, QuizMark } from "./QuizUI";
export default function OnboardingScreen() {
  const s = useQuizStore();
  return (
    <div className="q-screen q-onboarding">
      <div className="q-brand">
        <QuizMark small />
        <strong>квизлик</strong>
      </div>
      <div className="q-onboarding-art">
        <OrbitArt />
      </div>
      <span className="q-eyebrow">ПРИВЕТ, ЛЮБОПЫТСТВО</span>
      <h1>
        Знать всё нельзя.
        <br />
        Удивляться — можно.
      </h1>
      <p className="q-intro">
        Короткие раунды, неожиданные факты и дуэли с друзьями. В каждом вопросе
        — что-то новое.
      </p>
      <button className="q-primary" onClick={() => s.setHasSeenTutorial(true)}>
        Начнём <ArrowRight size={22} />
      </button>
      <p className="q-footnote">Бесплатно. Без регистрации в браузере.</p>
    </div>
  );
}
