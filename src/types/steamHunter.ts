export interface SteamHunterAppSummary {
    appId: number;
    name: string;
    achievementCount: number;
    points: number;
    fastestCompletionTime: number;
    medianCompletionTime: number;
    playersPerfectedCount: number;
    playersQualifiedCount: number;
    userCount: number;
    hasPaidDlc: boolean;
}

export interface SteamHunterAchievement {
    steamPoints: number;
}

export interface SteamHunterStats {
    achievements: string;
    points: string;
    steamPoints: string;
    fastestTime: string;
    medianTime: string;
    playersPerfected: string;
    playersQualified: string;
    playersAndOwners: string;
    hasPaidDlc: boolean;
    hasAchievements: boolean;
    lastUpdatedAt: Date;
    showStats: boolean;
    hasData: boolean;
}

export const EMPTY_STATS: SteamHunterStats = {
    achievements: '--',
    points: '--',
    steamPoints: '--',
    fastestTime: '--',
    medianTime: '--',
    playersPerfected: '--',
    playersQualified: '--',
    playersAndOwners: '--',
    hasPaidDlc: false,
    hasAchievements: false,
    lastUpdatedAt: new Date(0),
    showStats: true,
    hasData: false,
};
