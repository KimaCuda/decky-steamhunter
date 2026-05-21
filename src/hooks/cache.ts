import localforage from 'localforage';
import { SteamHunterStats } from '../types/steamHunter';

localforage.config({ name: 'decky-steamhunter' });

export async function getCache(appId: number): Promise<SteamHunterStats | null> {
    return localforage.getItem<SteamHunterStats>(String(appId));
}

export async function updateCache(appId: number, stats: SteamHunterStats) {
    await localforage.setItem(String(appId), stats);
}

export async function setShowHide(appId: number) {
    const stats = await getCache(appId);
    if (stats) {
        stats.showStats = !stats.showStats;
        await updateCache(appId, stats);
    }
}

export async function clearCache() {
    await localforage.clear();
}
