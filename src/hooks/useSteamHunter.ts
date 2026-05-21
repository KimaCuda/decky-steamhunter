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

function needCacheUpdate(lastUpdatedAt: Date) {
    const hours =
        Math.abs(Date.now() - lastUpdatedAt.getTime()) / (60 * 60 * 1000);
    return hours > CACHE_HOURS;
}

function mapSummary(
    summary: SteamHunterAppSummary,
    steamPointsSum: number | null
): SteamHunterStats {
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

export default function useSteamHunter(appId: number) {
    const [stats, setStats] = useState<SteamHunterStats>(EMPTY_STATS);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const cached = await getCache(appId);
            if (cached && !needCacheUpdate(cached.lastUpdatedAt)) {
                if (!cancelled) setStats(cached);
                return;
            }

            if (cached) {
                if (!cancelled) setStats(cached);
            }

            try {
                const summary = await fetchAppSummary(appId);
                if (!summary || cancelled) return;

                const steamPointsSum = await fetchSteamPointsSum(appId);
                if (cancelled) return;

                const mapped = mapSummary(summary, steamPointsSum);
                const merged: SteamHunterStats = {
                    ...mapped,
                    showStats: cached?.showStats ?? true,
                };

                await updateCache(appId, merged);
                if (!cancelled) setStats(merged);
            } catch (e) {
                console.error('[decky-steamhunter] fetch failed', e);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [appId]);

    return stats;
}
