import WebSocket, { Server } from 'ws'
import { NinaWebSocketClient } from '../types/websocket.types'

export function findConnectedNinaClientByDeviceId(
  ninaWsServer: Server<NinaWebSocketClient>,
  deviceId: string,
) {
  return Array.from(ninaWsServer.clients).find(
    (client) =>
      client.deviceId === deviceId && client.readyState === WebSocket.OPEN,
  )
}
