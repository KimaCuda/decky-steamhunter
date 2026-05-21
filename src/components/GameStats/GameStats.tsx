import { useEffect, useState } from 'react';
import { ButtonItem } from '@decky/ui';
import useSteamHunter from '../../hooks/useSteamHunter';
import { SteamHunterStats } from '../../types/steamHunter';
import { steamHunterAchievementsUrl } from '../../utils/format';
import style from './style';

type GameStatsProps = {
    appId: number;
    id: string;
};

type StatKey = keyof Pick<
    SteamHunterStats,
    | 'achievements'
    | 'points'
    | 'steamPoints'
    | 'fastestTime'
    | 'medianTime'
    | 'playersPerfected'
    | 'playersQualified'
    | 'playersAndOwners'
>;

type StatCellConfig = {
    valueKey: StatKey;
    icon: string;
    label: string;
};

/** 3×3 grid: cell 0 empty (future player progress), cells 1–8 are game stats */
const GRID_LAYOUT: (StatCellConfig | null)[] = [
    null,
    { valueKey: 'achievements', icon: '🏅', label: 'Achievements' },
    { valueKey: 'points', icon: '★', label: 'Points' },
    { valueKey: 'steamPoints', icon: 'S', label: 'Steam% Points' },
    { valueKey: 'fastestTime', icon: '⏱', label: 'Fastest Completion' },
    { valueKey: 'medianTime', icon: '⏱', label: 'Median Completion' },
    { valueKey: 'playersPerfected', icon: '★', label: 'Players Perfected' },
    { valueKey: 'playersQualified', icon: '👤', label: 'Players Qualified' },
    { valueKey: 'playersAndOwners', icon: '👥', label: 'Players & Owners' },
];

function StatCell({
    value,
    icon,
    label,
}: {
    value: string;
    icon: string;
    label: string;
}) {
    return (
        <div className="sh-cell">
            <p className="sh-value">{value}</p>
            <span className="sh-icon" aria-hidden="true">
                {icon}
            </span>
            <p className="sh-label">{label}</p>
        </div>
    );
}

function EmptyStatCell() {
    return <div className="sh-cell sh-cell-empty" aria-hidden="true" />;
}

export function GameStats({ appId, id }: GameStatsProps) {
    const [gameLaunching, setGameLaunching] = useState(false);
    const stats = useSteamHunter(appId);

    const handleGameActionStart = (
        _actionType: number,
        strAppId: string,
        actionName: string
    ) => {
        const gameActionAppId = parseInt(strAppId, 10);
        if (
            actionName === 'LaunchApp' &&
            appId === gameActionAppId &&
            !gameLaunching
        ) {
            setGameLaunching(true);
        } else {
            setGameLaunching(false);
        }
    };

    useEffect(() => {
        const handler = handleGameActionStart as (
            ...args: [number, string?, string?]
        ) => void;
        const onStart = SteamClient.Apps.RegisterForGameActionStart(handler);
        const onEnd = SteamClient.Apps.RegisterForGameActionEnd(handler);
        return () => {
            onStart.unregister();
            onEnd.unregister();
        };
    }, [appId, gameLaunching]);

    const hide = !stats.showStats || !stats.hasData || gameLaunching;

    return (
        <div id={id} style={{ display: hide ? 'none' : 'block' }}>
            {style}
            <div className="sh-info">
                <div className="sh-grid">
                    {GRID_LAYOUT.map((cell, index) =>
                        cell === null ? (
                            <EmptyStatCell key={index} />
                        ) : (
                            <StatCell
                                key={index}
                                value={stats[cell.valueKey]}
                                icon={cell.icon}
                                label={cell.label}
                            />
                        )
                    )}
                </div>
                <div className="sh-footer">
                    <ButtonItem
                        layout="below"
                        onClick={() =>
                            SteamClient.System.OpenInSystemBrowser(
                                steamHunterAchievementsUrl(appId)
                            )
                        }
                    >
                        View on SteamHunter
                    </ButtonItem>
                </div>
            </div>
        </div>
    );
}
