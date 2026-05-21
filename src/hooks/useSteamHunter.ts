import { useEffect, useState } from 'react';
import { fetchNoCors } from '@decky/api';
import {
    EMPTY_STATS,
    SteamHunterAchievement,
    SteamHunterAppSummary,
    SteamHunterStats,
} from '../types/steamHunter';
import { formatMinutes, formatNumber } from '../utils/format';
import { getCache, updateCache } from './cache';

const CACHE_HOURS = 12;
const statsMemoryCache = new Map<number, SteamHunterStats>();

function needCacheUpdate(lastUpdatedAt: Date) {
    const hours =
        Math.abs(Date.now() - lastUpdatedAt.getTime()) / (60 * 60 * 1000);
    return hours > CACHE_HOURS;
}

function mapSummary(
    summary: SteamHunterAppSummary,
    steamPointsSum: number | null
): SteamHunterStats {
    const hasAchievements = summary.achievementCount > 0;

    return {
        achievements: formatNumber(summary.achievementCount),
        points: formatNumber(summary.points),
        steamPoints:
            steamPointsSum !== null ? formatNumber(steamPointsSum) : '--',
        fastestTime: formatMinutes(summary.fastestCompletionTime),
        medianTime: formatMinutes(summary.medianCompletionTime),
        playersPerfected: formatNumber(summary.playersPerfectedCount),
        playersQualified: formatNumber(summary.playersQualifiedCount),
        playersAndOwners: formatNumber(summary.userCount),
        hasPaidDlc: summary.hasPaidDlc,
        hasAchievements,
        lastUpdatedAt: new Date(),
        showStats: true,
        hasData: true,
    };
}

async function fetchAppSummary(
    appId: number
): Promise<SteamHunterAppSummary | null> {
    const response = await fetchNoCors(
        `https://steamhunters.com/api/apps/${appId}`,
        {
            method: 'GET',
            headers: { Accept: 'application/json' },
        }
    );

    if (!response.ok) return null;

    return (await response.json()) as SteamHunterAppSummary;
}

async function fetchSteamPointsSum(appId: number): Promise<number | null> {
    try {
        const response = await fetchNoCors(
            `https://steamhunters.com/api/apps/${appId}/achievements`,
            {
                method: 'GET',
                headers: { Accept: 'application/json' },
            }
        );

        if (!response.ok) return null;

        const achievements = (await response.json()) as SteamHunterAchievement[];
        return achievements.reduce((sum, a) => sum + a.steamPoints, 0);
    } catch {
        return null;
    }
}

export type UseSteamHunterResult = SteamHunterStats & { isLoading: boolean };

export default function useSteamHunter(appId: number): UseSteamHunterResult {
    const [stats, setStats] = useState<SteamHunterStats>(() => {
        return statsMemoryCache.get(appId) ?? EMPTY_STATS;
    });
    const [isLoading, setIsLoading] = useState(
        () => !statsMemoryCache.get(appId)?.hasData
    );

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const cached = await getCache(appId);
            if (cached && !needCacheUpdate(cached.lastUpdatedAt)) {
                if (!cancelled) {
                    statsMemoryCache.set(appId, cached);
                    setStats(cached);
                    setIsLoading(false);
                }
                return;
            }

            if (cached?.hasData && !cancelled) {
                statsMemoryCache.set(appId, cached);
                setStats(cached);
            }

            if (!cached?.hasData && !cancelled) {
                setIsLoading(true);
            }

            try {
                const summary = await fetchAppSummary(appId);
                if (!summary || cancelled) {
                    if (!cancelled) setIsLoading(false);
                    return;
                }

                const steamPointsSum = summary.achievementCount
                    ? await fetchSteamPointsSum(appId)
                    : null;
                if (cancelled) return;

                const mapped = mapSummary(summary, steamPointsSum);
                const merged: SteamHunterStats = {
                    ...mapped,
                    showStats: cached?.showStats ?? true,
                };

                await updateCache(appId, merged);
                if (!cancelled) {
                    statsMemoryCache.set(appId, merged);
                    setStats(merged);
                    setIsLoading(false);
                }
            } catch (e) {
                console.error('[decky-steamhunter] fetch failed', e);
                if (!cancelled) setIsLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [appId]);

    return { ...stats, isLoading };
}
