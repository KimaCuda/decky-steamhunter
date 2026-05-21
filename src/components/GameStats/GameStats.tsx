import { useEffect, useState } from 'react';
import { Spinner } from '@decky/ui';
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

const PLAYERS_OWNERS_CELL = GRID_LAYOUT[8]!;

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
            <div className="sh-meta">
                <span className="sh-icon" aria-hidden="true">
                    {icon}
                </span>
                <p className="sh-label">{label}</p>
            </div>
        </div>
    );
}

function EmptyStatCell() {
    return <div className="sh-cell sh-cell-empty" aria-hidden="true" />;
}

export function GameStats({ appId, id }: GameStatsProps) {
    const [gameLaunching, setGameLaunching] = useState(false);
    const { isLoading, ...stats } = useSteamHunter(appId);

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

    const hide =
        !stats.showStats || (!stats.hasData && !isLoading) || gameLaunching;

    return (
        <div id={id} style={{ display: hide ? 'none' : 'block' }}>
            {style}
            <div className="sh-info">
                <div className="sh-body">
                {isLoading ? (
                    <div className="sh-loading">
                        <Spinner
                            className="sh-spinner"
                            style={{ width: '28px', height: '28px' }}
                        />
                    </div>
                ) : stats.hasAchievements ? (
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
                ) : (
                    <div className="sh-single-stat">
                        <StatCell
                            value={stats.playersAndOwners}
                            icon={PLAYERS_OWNERS_CELL.icon}
                            label={PLAYERS_OWNERS_CELL.label}
                        />
                    </div>
                )}
                </div>
                {!isLoading && (
                    <div className="sh-footer">
                        <button
                            type="button"
                            className="sh-link-btn"
                            onClick={() =>
                                SteamClient.System.OpenInSystemBrowser(
                                    steamHunterAchievementsUrl(appId)
                                )
                            }
                        >
                            View on SteamHunter
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
