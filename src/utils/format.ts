export function formatNumber(value: number): string {
    return value.toLocaleString('en-US');
}

export function formatMinutes(minutes: number): string {
    if (minutes <= 0) return '--';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
}

export function steamHunterAchievementsUrl(appId: number): string {
    return `https://steamhunters.com/apps/${appId}/achievements`;
}
