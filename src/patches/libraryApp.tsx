import { afterPatch, wrapReactType } from '@decky/ui';
import { routerHook } from '@decky/api';
import { ReactElement } from 'react';
import { GameStats } from '../components/GameStats/GameStats';

export function patchLibraryApp() {
    return routerHook.addPatch(
        '/library/app/:appid',
        (props: { path: string; children: ReactElement }) => {
            afterPatch(
                props.children.props,
                'renderFunc',
                (_: Record<string, unknown>[], ret1: ReactElement) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const ret1Props = ret1.props as any;
                    const appId: number = ret1Props.children.props.overview.appid;
                    wrapReactType(ret1Props.children);
                    afterPatch(
                        ret1Props.children.type,
                        'type',
                        (_1: Record<string, unknown>[], ret2: ReactElement) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const ret2Props = ret2.props as any;
                            const componentToSplice =
                                ret2Props.children?.[1]?.props.children.props
                                    .children;

                            const existingIndex = componentToSplice?.findIndex(
                                (child: ReactElement) =>
                                    (child?.props as { id?: string })?.id ===
                                    'decky-steamhunter'
                            );

                            const spliceIndex = componentToSplice?.findIndex(
                                (child: ReactElement) => {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const p = child?.props as any;
                                    return (
                                        p?.childFocusDisabled !== undefined &&
                                        p?.navRef !== undefined &&
                                        p?.children?.props?.details !==
                                            undefined &&
                                        p?.children?.props?.overview !==
                                            undefined &&
                                        p?.children?.props?.bFastRender !==
                                            undefined
                                    );
                                }
                            );

                            const gameStats = (
                                <GameStats
                                    id="decky-steamhunter"
                                    appId={appId}
                                />
                            );

                            if (existingIndex < 0) {
                                if (spliceIndex > -1) {
                                    componentToSplice?.splice(
                                        spliceIndex,
                                        0,
                                        gameStats
                                    );
                                } else {
                                    console.error(
                                        '[decky-steamhunter] could not find splice point'
                                    );
                                }
                            } else {
                                const existingAppId = (
                                    componentToSplice?.[existingIndex]
                                        ?.props as { appId?: number }
                                )?.appId;
                                if (existingAppId !== appId) {
                                    componentToSplice?.splice(
                                        existingIndex,
                                        1,
                                        gameStats
                                    );
                                }
                            }
                            return ret2;
                        }
                    );
                    return ret1;
                }
            );
            return props;
        }
    );
}
