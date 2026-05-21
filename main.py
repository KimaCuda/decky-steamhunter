import decky


class Plugin:
    async def _main(self):
        decky.logger.info("SteamHunter for Deck loaded")

    async def _unload(self):
        decky.logger.info("SteamHunter for Deck unloaded")

    async def _uninstall(self):
        decky.logger.info("SteamHunter for Deck uninstalled")
