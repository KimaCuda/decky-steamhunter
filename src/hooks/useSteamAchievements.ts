import { useEffect, useState } from 'react';
import {
    EMPTY_ACHIEVEMENT_PROGRESS,
    SteamAchievementProgress,
} from '../types/steamAchievements';

const progressCache = new Map<number, SteamAchievementProgress>();

function parseAchievements(
    response: { result: number; data?: { rgAchievements?: { bAchieved: boolean }[] } }
): SteamAchievementProgress {
    if (response.result !== 1 || !response.data?.rgAchievements) {
        return EMPTY_ACHIEVEMENT_PROGRESS;
    }

    const achievements = response.data.rgAchievements;
    const total = achievements.length;
    if (total === 0) {
        return EMPTY_ACHIEVEMENT_PROGRESS;
    }

    const unlocked = achievements.filter((a) => a.bAchieved).length;
    const percent = Math.round((unlocked / total) * 100);

    return { unlocked, total, percent, hasData: true };
}

export type UseSteamAchievementsResult = SteamAchievementProgress & {
    isLoading: boolean;
};

export default function useSteamAchievements(
    appId: number,
    enabled: boolean
): UseSteamAchievementsResult {
    const cached = enabled ? progressCache.get(appId) : undefined;
    const [progress, setProgress] = useState<SteamAchievementProgress>(
        cached ?? EMPTY_ACHIEVEMENT_PROGRESS
    );
    const [isLoading, setIsLoading] = useState(
        enabled && !cached?.hasData
    );

    useEffect(() => {
        if (!enabled) {
            setProgress(EMPTY_ACHIEVEMENT_PROGRESS);
            setIsLoading(false);
            return;
        }

        const memoryCached = progressCache.get(appId);
        if (memoryCached?.hasData) {
            setProgress(memoryCached);
            setIsLoading(false);
            return;
        }

        let cancelled = false;

        (async () => {
            setIsLoading(true);
            try {
                const response =
                    await SteamClient.Apps.GetMyAchievementsForApp(
                        String(appId)
                    );
                if (!cancelled) {
                    const parsed = parseAchievements(response);
                    if (parsed.hasData) {
                        progressCache.set(appId, parsed);
                    }
                    setProgress(parsed);
                    setIsLoading(false);
                }
            } catch (e) {
                console.error(
                    '[decky-steamhunter] Steam achievements fetch failed',
                    e
                );
                if (!cancelled) {
                    setProgress(EMPTY_ACHIEVEMENT_PROGRESS);
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [appId, enabled]);

    return { ...progress, isLoading };
}

export function progressIcon(percent: number): string {
    if (percent >= 100) return '★';
    return '🏅';
}
