import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jdgpelwdudmvqfidgdyc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZ3BlbHdkdWRtdnFmaWRnZHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5ODk3NjMsImV4cCI6MjA5NTU2NTc2M30.hhfc3qK5nVeMCHzRMY3ngQsoa6dmV_k7ttrRqPxG0wI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface ProfileRow {
  telegram_id: number;
  player_name: string;
  avatar_id: string;
  total_score: number;
  total_xp: number;
  level: number;
  coins: number;
  games_played: number;
  total_correct: number;
  total_questions: number;
  best_streak: number;
  current_league: string;
  daily_streak: number;
  last_daily_at: string | null;
  unlocked_avatars: string[];
  unlocked_achievements: { id: string; unlockedAt: number }[];
  power_ups: { freeze: number; fiftyFifty: number; hint: number };
  seen_questions: string[];
  categories_played: string[];
  // New fields
  current_theme?: string;
  unlocked_themes?: string[];
  duels_won?: number;
  duels_played?: number;
  survival_record?: number;
  season_score?: number;
  daily_chain_day?: number;
  daily_chain_completed?: boolean[];
  daily_chain_date?: string | null;
  category_stats?: Record<string, { played: number; correct: number }>;
  games_by_day?: Record<string, number>;
  updated_at: string;
}

export interface LeaderboardRow {
  id: number;
  telegram_id: number;
  player_name: string;
  avatar_id: string;
  score: number;
  league: string;
  updated_at: string;
}

// Load profile from Supabase
export async function loadProfile(telegramId: number): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('telegram_id', telegramId)
    .single();

  if (error || !data) return null;
  return data as ProfileRow;
}

// Save profile to Supabase (upsert)
export async function saveProfile(telegramId: number, profile: Partial<ProfileRow>): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        telegram_id: telegramId,
        ...profile,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'telegram_id' }
    );

  if (error) {
    console.error('Failed to save profile:', error);
    return false;
  }
  return true;
}

// Update leaderboard entry
export async function updateLeaderboard(telegramId: number, playerName: string, avatarId: string, score: number, league: string): Promise<boolean> {
  const { error } = await supabase
    .from('leaderboard')
    .upsert(
      {
        telegram_id: telegramId,
        player_name: playerName,
        avatar_id: avatarId,
        score,
        league,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'telegram_id' }
    );

  if (error) {
    console.error('Failed to update leaderboard:', error);
    return false;
  }
  return true;
}

// Get top players from leaderboard
export async function getLeaderboard(limit: number = 50): Promise<LeaderboardRow[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as LeaderboardRow[];
}

// Update weekly leaderboard
export async function updateWeeklyLeaderboard(telegramId: number, playerName: string, avatarId: string, score: number, weekKey: string): Promise<boolean> {
  const { error } = await supabase
    .from('weekly_leaderboard')
    .upsert(
      {
        telegram_id: telegramId,
        player_name: playerName,
        avatar_id: avatarId,
        score,
        week_key: weekKey,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'telegram_id,week_key' }
    );

  if (error) {
    console.error('Failed to update weekly leaderboard:', error);
    return false;
  }
  return true;
}
