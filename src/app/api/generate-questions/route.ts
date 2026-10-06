import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

interface GeneratedQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: 1 | 2 | 3;
  funFact?: string;
}

const CATEGORY_NAMES: Record<string, string> = {
  general: "Общие знания",
  science: "Наука",
  history: "История",
  movies: "Кино и сериалы",
  tech: "Технологии",
  sport: "Спорт",
  geography: "География",
  music: "Музыка",
  food: "Еда и напитки",
  nature: "Природа",
};

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "лёгкая",
  2: "средняя",
  3: "сложная",
};

export async function POST(req: Request) {
  if (process.env.ENABLE_AI_QUESTIONS !== "true")
    return NextResponse.json({ error: "Генератор отключён" }, { status: 503 });
  try {
    const { category, difficulty, count = 5 } = await req.json();

    if (
      !Object.hasOwn(CATEGORY_NAMES, category) ||
      ![1, 2, 3].includes(difficulty) ||
      !Number.isInteger(count) ||
      count < 1 ||
      count > 10
    ) {
      return NextResponse.json(
        { error: "Некорректная категория, сложность или количество вопросов" },
        { status: 400 },
      );
    }

    const categoryName = CATEGORY_NAMES[category] || category;
    const difficultyLabel = DIFFICULTY_LABELS[difficulty] || "средняя";

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Ты — генератор вопросов для квиз-игры «КВИЗЛИК». Твоя задача — создавать интересные, нестандартные вопросы на русском языке.

ПРАВИЛА:
1. Все вопросы и варианты ответов должны быть на РУССКОМ языке.
2. Каждый вопрос должен иметь ровно 4 варианта ответа.
3. Только один вариант ответа правильный.
4. Правильный ответ указывается через correctIndex (0-3).
5. Добавляй интересный факт (funFact) к каждому вопросу, если возможно.
6. Избегай слишком простых и общеизвестных вопросов — будь креативным!
7. Вопросы должны быть точными и проверяемыми.

ФОРМАТ ОТВЕТА — только JSON-массив, без markdown, без пояснений:
[
  {
    "id": "ai_уникальный_идентификатор",
    "category": "идентификатор_категории",
    "question": "Текст вопроса?",
    "options": ["Вариант А", "Вариант Б", "Вариант В", "Вариант Г"],
    "correctIndex": 0,
    "difficulty": 1,
    "funFact": "Интересный факт о вопросе"
  }
]

difficulty: 1 = лёгкая, 2 = средняя, 3 = сложная`,
        },
        {
          role: "user",
          content: `Сгенерируй ${count} вопросов для квиза.
Категория: "${categoryName}" (id: ${category})
Сложность: ${difficultyLabel} (${difficulty})

Верни ТОЛЬКО JSON-массив, без markdown-обёрток и пояснений.`,
        },
      ],
      temperature: 0.8,
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "AI не вернул ответ" },
        { status: 500 },
      );
    }

    // Try to parse the response - handle potential markdown wrapping
    let jsonStr = content.trim();

    // Remove markdown code blocks if present
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr
        .replace(/^```(?:json)?\s*\n?/, "")
        .replace(/\n?```\s*$/, "");
    }

    let questions: GeneratedQuestion[];
    try {
      questions = JSON.parse(jsonStr);
    } catch {
      // Try to extract JSON array from the response
      const match = jsonStr.match(/\[[\s\S]*\]/);
      if (match) {
        questions = JSON.parse(match[0]);
      } else {
        return NextResponse.json(
          { error: "Не удалось разобрать ответ AI" },
          { status: 500 },
        );
      }
    }

    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { error: "Ответ AI не является массивом" },
        { status: 500 },
      );
    }

    // Validate and normalize questions
    const validatedQuestions = questions
      .filter(
        (q) =>
          q &&
          typeof q.question === "string" &&
          q.question.trim().length >= 8 &&
          q.question.length <= 400 &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          q.options.every(
            (o) =>
              typeof o === "string" && o.trim().length > 0 && o.length <= 150,
          ) &&
          new Set(q.options.map((o) => o.trim().toLowerCase())).size === 4 &&
          Number.isInteger(q.correctIndex) &&
          q.correctIndex >= 0 &&
          q.correctIndex < 4,
      )
      .slice(0, count)
      .map((q, i) => ({
        ...q,
        id: `ai_${Date.now()}_${i}`,
        category,
        difficulty,
        funFact:
          typeof q.funFact === "string" ? q.funFact.slice(0, 600) : undefined,
      }));
    if (validatedQuestions.length !== count)
      return NextResponse.json(
        { error: "Генератор вернул некорректные вопросы" },
        { status: 502 },
      );

    return NextResponse.json({ questions: validatedQuestions });
  } catch (error) {
    console.error("Generate questions error:", error);
    return NextResponse.json(
      { error: "Ошибка при генерации вопросов" },
      { status: 500 },
    );
  }
}
