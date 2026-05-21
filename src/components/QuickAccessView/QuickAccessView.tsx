import {
    ButtonItem,
    PanelSection,
    PanelSectionRow,
} from '@decky/ui';
import { clearCache } from '../../hooks/cache';

export function QuickAccessView() {
    return (
        <PanelSection title="steam-hunter-for-deck">
            <PanelSectionRow>
                <ButtonItem layout="below" onClick={() => clearCache()}>
                    Clear cached stats
                </ButtonItem>
            </PanelSectionRow>
            <PanelSectionRow>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                    Stats are fetched from steamhunters.com and cached for 12
                    hours. Use &quot;View on SteamHunter&quot; on a game page to
                    open the full achievements page.
                </div>
            </PanelSectionRow>
        </PanelSection>
    );
}
