import { Server as HttpServer } from 'http'
import { Server } from 'ws'
import {
  NinaWebSocketClient,
  WebWebSocketClient,
} from '../types/websocket.types'
import upgradeHttpToWs from './upgrade/upgradeHttpToWs'
import webHandler from './handler/webHandler'
import ninaHandler from './handler/ninaHandler'

const webWsServer = new Server<WebWebSocketClient>({ noServer: true })
const ninaWsServer = new Server<NinaWebSocketClient>({ noServer: true })

export default function (httpServer: HttpServer) {
  webHandler(webWsServer, ninaWsServer)
  ninaHandler(webWsServer, ninaWsServer)
  upgradeHttpToWs(httpServer, webWsServer, ninaWsServer)
}
