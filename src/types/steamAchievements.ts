export interface SteamAchievementProgress {
    unlocked: number;
    total: number;
    percent: number;
    hasData: boolean;
}

export const EMPTY_ACHIEVEMENT_PROGRESS: SteamAchievementProgress = {
    unlocked: 0,
    total: 0,
    percent: 0,
    hasData: false,
};
