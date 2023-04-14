import { Server } from 'ws'
import {
  IMessage,
  NinaWebSocketClient,
  WebWebSocketClient,
} from '../../types/websocket.types'
import { findConnectedWebClientByDeviceId } from '../../utils/findConnectedWebClientByDeviceId'

export default function (
  webWsServer: Server<WebWebSocketClient>,
  ninaWsServer: Server<NinaWebSocketClient>,
) {
  ninaWsServer.on('connection', async (ws) => {
    onMessage(ws, webWsServer)
    onClose(ws, webWsServer)

    console.log('Connected from NINA')
  })
}

function onMessage(
  ws: NinaWebSocketClient,
  webWsServer: Server<WebWebSocketClient>,
) {
  ws.on('message', (messageJson: string) => {
    const message = JSON.parse(messageJson) as IMessage
    console.log(`received ${messageJson} in NINA`)
    const matchedWebClient = findConnectedWebClientByDeviceId(
      webWsServer,
      ws.deviceId,
    )
    if (matchedWebClient) {
      matchedWebClient.send(JSON.stringify(message))
    }
  })
}

function onClose(
  ws: NinaWebSocketClient,
  webWsServer: Server<WebWebSocketClient>,
) {
  ws.on('close', () => {
    const matchedWebClient = findConnectedWebClientByDeviceId(
      webWsServer,
      ws.deviceId,
    )
    if (matchedWebClient) {
      matchedWebClient.send(
        JSON.stringify({
          type: 'ninaDisconnected',
          payload: { message: 'Disconnected from NINA' },
        }),
      )
      matchedWebClient.close(3000)
    }
    console.log('Disconnected from NINA')
  })
}
