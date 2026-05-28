import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

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
  general: 'Общие знания',
  science: 'Наука',
  history: 'История',
  movies: 'Кино и сериалы',
  tech: 'Технологии',
  sport: 'Спорт',
  geography: 'География',
  music: 'Музыка',
  food: 'Еда и напитки',
  nature: 'Природа',
};

const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'лёгкая',
  2: 'средняя',
  3: 'сложная',
};

export async function POST(req: Request) {
  try {
    const { category, difficulty, count = 5 } = await req.json();

    if (!category || !difficulty) {
      return NextResponse.json(
        { error: 'Не указана категория или сложность' },
        { status: 400 }
      );
    }

    const categoryName = CATEGORY_NAMES[category] || category;
    const difficultyLabel = DIFFICULTY_LABELS[difficulty] || 'средняя';

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
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
          role: 'user',
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
        { error: 'AI не вернул ответ' },
        { status: 500 }
      );
    }

    // Try to parse the response - handle potential markdown wrapping
    let jsonStr = content.trim();
    
    // Remove markdown code blocks if present
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
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
          { error: 'Не удалось разобрать ответ AI', raw: content },
          { status: 500 }
        );
      }
    }

    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Ответ AI не является массивом' },
        { status: 500 }
      );
    }

    // Validate and normalize questions
    const validatedQuestions: GeneratedQuestion[] = questions.map((q: GeneratedQuestion, i: number) => ({
      id: q.id || `ai_${category}_${Date.now()}_${i}`,
      category: q.category || category,
      question: q.question || 'Вопрос не сгенерирован',
      options: Array.isArray(q.options) && q.options.length === 4
        ? q.options
        : ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'],
      correctIndex: typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex <= 3
        ? q.correctIndex
        : 0,
      difficulty: [1, 2, 3].includes(q.difficulty) ? q.difficulty : (difficulty as 1 | 2 | 3),
      funFact: q.funFact || undefined,
    }));

    return NextResponse.json({ questions: validatedQuestions });
  } catch (error) {
    console.error('Generate questions error:', error);
    return NextResponse.json(
      { error: 'Ошибка при генерации вопросов' },
      { status: 500 }
    );
  }
}
