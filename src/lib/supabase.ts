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
  // Theme & visual
  current_theme?: string;
  unlocked_themes?: string[];
  // Duels
  duels_won?: number;
  duels_played?: number;
  // Survival
  survival_record?: number;
  // Season
  season_score?: number;
  season_start?: string | null;
  // Daily chain
  daily_chain_day?: number;
  daily_chain_completed?: boolean[];
  daily_chain_date?: string | null;
  // Stats
  category_stats?: Record<string, { played: number; correct: number }>;
  games_by_day?: Record<string, number>;
  // ===== V4.0 new fields =====
  profile_frame?: string;
  referral_count?: number;
  season_pass_tier?: number;
  season_pass_claimed?: number[];
  question_ratings?: Record<string, boolean>;
  friend_list?: { telegramId: number; name: string; avatarId: string }[];
  clan_id?: string | null;
  clan_name?: string | null;
  notifications_enabled?: boolean;
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

// Save profile to Supabase (upsert) — resilient to missing columns
export async function saveProfile(telegramId: number, profile: Partial<ProfileRow>): Promise<boolean> {
  const row = {
    telegram_id: telegramId,
    ...profile,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('profiles')
    .upsert(row, { onConflict: 'telegram_id' });

  if (error) {
    // If upsert fails (possibly due to missing new columns), try without V4 fields
    console.warn('Full profile upsert failed, trying without V4 fields:', error.message);
    const { profile_frame, referral_count, season_pass_tier, season_pass_claimed, question_ratings, friend_list, clan_id, clan_name, notifications_enabled, season_start, ...withoutV4 } = row;
    
    const { error: err2 } = await supabase
      .from('profiles')
      .upsert(withoutV4, { onConflict: 'telegram_id' });
    
    if (err2) {
      // Try with core fields only
      console.warn('Without-V4 upsert also failed, trying core fields:', err2.message);
      const coreRow = {
        telegram_id: telegramId,
        player_name: profile.player_name,
        avatar_id: profile.avatar_id,
        total_score: profile.total_score,
        total_xp: profile.total_xp,
        level: profile.level,
        coins: profile.coins,
        games_played: profile.games_played,
        total_correct: profile.total_correct,
        total_questions: profile.total_questions,
        best_streak: profile.best_streak,
        current_league: profile.current_league,
        daily_streak: profile.daily_streak,
        last_daily_at: profile.last_daily_at,
        unlocked_avatars: profile.unlocked_avatars,
        unlocked_achievements: profile.unlocked_achievements,
        power_ups: profile.power_ups,
        seen_questions: profile.seen_questions,
        categories_played: profile.categories_played,
        updated_at: new Date().toISOString(),
      };
      const { error: err3 } = await supabase
        .from('profiles')
        .upsert(coreRow, { onConflict: 'telegram_id' });
      if (err3) {
        console.error('Core profile upsert also failed:', err3);
        return false;
      }
    }
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
