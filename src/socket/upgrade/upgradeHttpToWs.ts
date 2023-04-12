import { Server as HttpServer } from 'http'
import { parse } from 'url'
import { Server } from 'ws'
import {
  NinaWebSocketClient,
  WebWebSocketClient,
} from '../../types/websocket.types'
import { upgradeWebPath } from './upgradeWebPath'
import { upgradeNinaPath } from './upgradeNinaPath'

export default function (
  httpServer: HttpServer,
  webWsServer: Server<WebWebSocketClient>,
  ninaWsServer: Server<NinaWebSocketClient>,
) {
  httpServer.on('upgrade', async (req, socket, head) => {
    const { pathname } = parse(req.url || '/')
    if (pathname === '/web') {
      upgradeWebPath(req, socket, head, webWsServer, ninaWsServer)
    } else if (pathname === '/nina') {
      upgradeNinaPath(req, socket, head, ninaWsServer)
    } else {
      socket.destroy()
    }
  })
}
