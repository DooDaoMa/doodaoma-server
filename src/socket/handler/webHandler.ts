import { Server } from 'ws'
import {
  IMessage,
  NinaWebSocketClient,
  WebWebSocketClient,
} from '../../types/websocket.types'
import { findConnectedNinaClientByDeviceId } from '../../utils/findConnectedNinaClientByDeviceId'

export default function (
  webWsServer: Server<WebWebSocketClient>,
  ninaWsServer: Server<NinaWebSocketClient>,
) {
  webWsServer.on('connection', (ws) => {
    onMessage(ws, ninaWsServer)
    onClose(ws, ninaWsServer)

    const matchedNinaClient = findConnectedNinaClientByDeviceId(
      ninaWsServer,
      ws.deviceId,
    )
    if (matchedNinaClient) {
      matchedNinaClient.send(
        JSON.stringify({
          type: 'setUserId',
          payload: { userId: ws.userId },
        }),
      )
    }
    console.log('Connected from web')
  })
}

function onMessage(
  ws: WebWebSocketClient,
  ninaWsServer: Server<NinaWebSocketClient>,
) {
  ws.on('message', (messageJson: string) => {
    const message = JSON.parse(messageJson) as IMessage
    console.log(`received ${messageJson} in web`)
    const matchedNinaClient = findConnectedNinaClientByDeviceId(
      ninaWsServer,
      ws.deviceId,
    )
    if (matchedNinaClient) {
      matchedNinaClient.send(JSON.stringify(message))
    }
  })
}

function onClose(
  ws: WebWebSocketClient,
  ninaWsServer: Server<NinaWebSocketClient>,
) {
  ws.on('close', () => {
    const matchedNinaClient = findConnectedNinaClientByDeviceId(
      ninaWsServer,
      ws.deviceId,
    )
    if (matchedNinaClient) {
      matchedNinaClient.send(JSON.stringify({ type: 'resetUserId' }))
    }
    console.log('Disconnected from web')
  })
}
