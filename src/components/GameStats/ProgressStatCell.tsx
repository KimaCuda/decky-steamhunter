import { progressIcon } from '../../hooks/useSteamAchievements';
import { SteamAchievementProgress } from '../../types/steamAchievements';

type ProgressStatCellProps = {
    progress: SteamAchievementProgress;
    isLoading: boolean;
};

export function ProgressStatCell({ progress, isLoading }: ProgressStatCellProps) {
    if (isLoading && !progress.hasData) {
        return <div className="sh-cell sh-cell-pending" aria-hidden="true" />;
    }

    if (!progress.hasData) {
        return <div className="sh-cell sh-cell-empty" aria-hidden="true" />;
    }

    const perfect = progress.percent >= 100;
    const icon = progressIcon(progress.percent);

    return (
        <div
            className={`sh-cell${perfect ? ' sh-cell-perfect' : ''}`}
        >
            <p className="sh-value">{progress.percent}%</p>
            <div className="sh-meta">
                <span
                    className={`sh-icon${perfect ? ' sh-icon-perfect' : ''}`}
                    aria-hidden="true"
                >
                    {icon}
                </span>
                <p className="sh-label">
                    {progress.unlocked}/{progress.total}
                </p>
            </div>
        </div>
    );
}
