import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/supabase";
import { validateTelegramInitData } from "@/lib/telegram-auth";
export async function POST(req: Request) {
  try {
    const { action, data } = await req.json();
    if (action === "validate-init-data")
      return NextResponse.json({
        valid: validateTelegramInitData(
          data?.initData,
          process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN,
        ),
      });
    if (action === "get-leaderboard") {
      try {
        return NextResponse.json({ leaderboard: await getLeaderboard(50) });
      } catch {
        return NextResponse.json(
          { error: "Рейтинг недоступен" },
          { status: 503 },
        );
      }
    }
    if (action === "save-session")
      return NextResponse.json(
        { error: "Этот устаревший метод сохранения отключён" },
        { status: 410 },
      );
    return NextResponse.json(
      { error: "Неизвестное действие" },
      { status: 400 },
    );
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }
}
