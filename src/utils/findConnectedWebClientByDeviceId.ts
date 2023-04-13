import WebSocket, { Server } from 'ws'
import { WebWebSocketClient } from '../types/websocket.types'

export function findConnectedWebClientByDeviceId(
  webWsServer: Server<WebWebSocketClient>,
  deviceId: string,
) {
  return Array.from(webWsServer.clients).find(
    (client) =>
      client.deviceId === deviceId && client.readyState === WebSocket.OPEN,
  )
}
