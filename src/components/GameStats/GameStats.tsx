import { useEffect, useRef, useState } from 'react';
import { Spinner } from '@decky/ui';
import useSteamAchievements from '../../hooks/useSteamAchievements';
import useSteamHunter from '../../hooks/useSteamHunter';
import { ProgressStatCell } from './ProgressStatCell';
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
    valueKey: StatKey | 'hasPaidDlc';
    icon: string;
    label: string;
    highlight?: 'dlc';
};

type GridSlot = 'progress' | 'empty' | StatCellConfig;

const GRID_CORE: GridSlot[] = [
    'progress',
    { valueKey: 'achievements', icon: '🏅', label: 'Achievements' },
    { valueKey: 'points', icon: '★', label: 'Points' },
    { valueKey: 'steamPoints', icon: 'S', label: 'Steam% Points' },
    { valueKey: 'fastestTime', icon: '⏱', label: 'Fastest Completion' },
    { valueKey: 'medianTime', icon: '⏱', label: 'Median Completion' },
    { valueKey: 'playersPerfected', icon: '★', label: 'Players Perfected' },
    { valueKey: 'playersQualified', icon: '👤', label: 'Players Qualified' },
    { valueKey: 'playersAndOwners', icon: '👥', label: 'Players & Owners' },
];

const PAID_DLC_ROW: GridSlot[] = [
    'empty',
    { valueKey: 'hasPaidDlc', icon: 'DLC', label: 'Paid DLC', highlight: 'dlc' },
    'empty',
];

const PLAYERS_OWNERS_CELL = GRID_CORE[8] as StatCellConfig;

function StatCell({
    value,
    icon,
    label,
    highlight,
}: {
    value: string;
    icon: string;
    label: string;
    highlight?: 'dlc';
}) {
    const valueClass =
        highlight === 'dlc' ? 'sh-value sh-value-highlight' : 'sh-value';

    return (
        <div className="sh-cell">
            <p className={valueClass}>{value}</p>
            <div className="sh-meta">
                <span className="sh-icon" aria-hidden="true">
                    {icon}
                </span>
                <p className="sh-label">{label}</p>
            </div>
        </div>
    );
}

function EmptyStatCell({ index }: { index: number }) {
    return (
        <div
            key={`empty-${index}`}
            className="sh-cell sh-cell-empty"
            aria-hidden="true"
        />
    );
}

export function GameStats({ appId, id }: GameStatsProps) {
    const [gameLaunching, setGameLaunching] = useState(false);
    const { isLoading, ...stats } = useSteamHunter(appId);
    const steamProgress = useSteamAchievements(appId, true);

    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        if (!isLoading || stats.hasData) {
            setShowSpinner(false);
            return;
        }
        const timer = setTimeout(() => setShowSpinner(true), 280);
        return () => clearTimeout(timer);
    }, [isLoading, stats.hasData]);

    const gameLaunchingRef = useRef(gameLaunching);
    gameLaunchingRef.current = gameLaunching;

    useEffect(() => {
        const handler = (
            _actionType: number,
            strAppId: string,
            actionName: string
        ) => {
            const gameActionAppId = parseInt(strAppId, 10);
            if (actionName === 'LaunchApp' && appId === gameActionAppId) {
                setGameLaunching(true);
            } else if (gameLaunchingRef.current) {
                setGameLaunching(false);
            }
        };
        const onStart = SteamClient.Apps.RegisterForGameActionStart(
            handler as (...args: [number, string?, string?]) => void
        );
        const onEnd = SteamClient.Apps.RegisterForGameActionEnd(
            handler as (...args: [number, string?, string?]) => void
        );
        return () => {
            onStart.unregister();
            onEnd.unregister();
        };
    }, [appId]);

    const hide = !stats.showStats || gameLaunching;
    const showContent = stats.hasData || isLoading;
    const gridLayout = stats.hasPaidDlc
        ? [...GRID_CORE, ...PAID_DLC_ROW]
        : GRID_CORE;
    const bodyClass = stats.hasPaidDlc ? 'sh-body' : 'sh-body sh-body-compact';

    return (
        <div id={id} style={{ display: hide ? 'none' : 'block' }}>
            {style}
            <div className="sh-info">
                <div className={bodyClass}>
                    {showSpinner ? (
                        <div className="sh-loading">
                            <Spinner
                                className="sh-spinner"
                                style={{ width: '28px', height: '28px' }}
                            />
                        </div>
                    ) : showContent && stats.hasAchievements ? (
                        <div className="sh-grid">
                            {gridLayout.map((slot, index) => {
                                if (slot === 'progress') {
                                    return (
                                        <ProgressStatCell
                                            key="progress"
                                            progress={steamProgress}
                                            isLoading={steamProgress.isLoading}
                                        />
                                    );
                                }
                                if (slot === 'empty') {
                                    return <EmptyStatCell key={index} index={index} />;
                                }
                                if (slot.valueKey === 'hasPaidDlc') {
                                    return (
                                        <StatCell
                                            key="hasPaidDlc"
                                            value="Yes"
                                            icon={slot.icon}
                                            label={slot.label}
                                            highlight="dlc"
                                        />
                                    );
                                }
                                return (
                                    <StatCell
                                        key={slot.valueKey}
                                        value={stats[slot.valueKey]}
                                        icon={slot.icon}
                                        label={slot.label}
                                        highlight={slot.highlight}
                                    />
                                );
                            })}
                        </div>
                    ) : showContent ? (
                        <div className="sh-single-stat">
                            <StatCell
                                value={stats.playersAndOwners}
                                icon={PLAYERS_OWNERS_CELL.icon}
                                label={PLAYERS_OWNERS_CELL.label}
                            />
                        </div>
                    ) : null}
                </div>
                {stats.hasData && (
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
