"use client";
export default function ErrorScreen({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="q-shell">
      <div className="q-screen q-empty">
        <h1>Что-то пошло не так</h1>
        <p className="q-intro">
          Попробуем открыть Квизлик ещё раз. Сохранённый прогресс останется.
        </p>
        <button className="q-primary" onClick={reset}>
          Попробовать снова
        </button>
      </div>
    </main>
  );
}
