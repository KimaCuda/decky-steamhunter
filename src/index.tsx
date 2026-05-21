import { staticClasses } from '@decky/ui';
import { definePlugin, routerHook } from '@decky/api';
import { FaTrophy } from 'react-icons/fa';
import { QuickAccessView } from './components/QuickAccessView/QuickAccessView';
import { patchLibraryApp } from './patches/libraryApp';

export default definePlugin(() => {
    const libraryAppPatch = patchLibraryApp();

    return {
        name: 'steam-hunter-for-deck',
        titleView: (
            <div className={staticClasses.Title}>steam-hunter-for-deck</div>
        ),
        icon: <FaTrophy />,
        content: <QuickAccessView />,
        onDismount() {
            routerHook.removePatch('/library/app/:appid', libraryAppPatch);
        },
    };
});
