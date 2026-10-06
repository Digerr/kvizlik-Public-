"use client";
import { useState } from "react";
import { Check, Snowflake, Lightbulb } from "lucide-react";
import { useQuizStore } from "@/lib/quiz-store";
import { AVATARS, POWER_UPS } from "@/lib/quiz-data";
import { ScreenHeading } from "./QuizUI";
export default function ShopScreen() {
  const s = useQuizStore();
  const [tab, setTab] = useState("bonuses");
  const [notice, setNotice] = useState("");
  const buy = (id: string, avatar = false) => {
    const ok = avatar ? s.buyAvatar(id) : s.buyPowerUp(id);
    setNotice(
      ok
        ? "Готово! Покупка в твоём профиле."
        : "Не хватает монет. Их можно получить в игре.",
    );
  };
  return (
    <div className="q-screen">
      <ScreenHeading
        title="Немного преимущества"
        eyebrow="Магазин за игровые монеты"
        action={<span className="q-pill">{s.coins} монет</span>}
      />
      <div className="q-segments">
        <button
          className={tab === "bonuses" ? "active" : ""}
          onClick={() => setTab("bonuses")}
        >
          Подсказки
        </button>
        <button
          className={tab === "avatars" ? "active" : ""}
          onClick={() => setTab("avatars")}
        >
          Аватары
        </button>
      </div>
      {notice && (
        <p className="q-intro" role="status">
          {notice}
        </p>
      )}
      {tab === "bonuses" ? (
        <div className="q-collection">
          {POWER_UPS.map((p) => (
            <article key={p.id}>
              <span className="q-shortcut-icon">
                {p.id === "freeze" ? (
                  <Snowflake />
                ) : p.id === "hint" ? (
                  <Lightbulb />
                ) : (
                  "50:50"
                )}
              </span>
              <div>
                <h2>{p.name}</h2>
                <p>{p.description}</p>
                <small>
                  У тебя: {s.powerUps[p.id as keyof typeof s.powerUps]}
                </small>
              </div>
              <button
                className="q-buy"
                disabled={s.coins < p.price}
                onClick={() => buy(p.id)}
              >
                {p.price} 🪙
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="q-avatar-grid">
          {AVATARS.map((a) => {
            const owned = s.unlockedAvatars.includes(a.id);
            return (
              <button
                key={a.id}
                disabled={!owned && s.coins < a.price}
                className={s.avatarId === a.id ? "selected" : ""}
                onClick={() => {
                  if (owned) {
                    s.setAvatar(a.id);
                    void s.syncToCloud();
                  } else buy(a.id, true);
                }}
              >
                <span>{a.emoji}</span>
                <strong>{a.name}</strong>
                <small>
                  {s.avatarId === a.id ? (
                    <Check size={16} />
                  ) : owned ? (
                    "Выбрать"
                  ) : (
                    `${a.price} монет`
                  )}
                </small>
              </button>
            );
          })}
        </div>
      )}
      <p className="q-footnote">
        Здесь используются только игровые монеты.
        <br />
        Оплата реальными деньгами не требуется.
      </p>
    </div>
  );
}
