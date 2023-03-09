import { IncomingMessage, Server as HttpServer } from 'http'
import { parse } from 'url'
import { Server, WebSocket } from 'ws'
import { Device } from '../models/device'
import {
  IMessage,
  NinaWebSocketClient,
  WebWebSocketClient,
} from '../types/websocket.types'

export const setUpSocketHandler = (httpServer: HttpServer) => {
  const webWsServer = new Server({ noServer: true })
  const ninaWsServer = new Server({ noServer: true })

  webWsServer.on(
    'connection',
    (ws: WebWebSocketClient, req: IncomingMessage) => {
      ws.on('message', (messageJson: string) => {
        const message = JSON.parse(messageJson) as IMessage
        console.log(`received ${messageJson} in web`)
        broadcastToNinaByDeviceId(ws, ninaWsServer, message)
      })
      ws.on('close', () => {
        broadcastToNinaByDeviceId(ws, ninaWsServer, { type: 'resetUserId' })
        console.log('Disconnected from web')
      })
      setUpWebWebSocketClient(ws, req)
      broadcastToNinaByDeviceId(ws, ninaWsServer, {
        type: 'setUserId',
        payload: { userId: ws.userId },
      })
      console.log('Connected from web')
    },
  )

  ninaWsServer.on(
    'connection',
    async (ws: NinaWebSocketClient, req: IncomingMessage) => {
      ws.on('message', (messageJson: string) => {
        const message = JSON.parse(messageJson) as IMessage
        console.log(`received ${messageJson} in nina`)
      })
      ws.on('close', () => {
        console.log('Disconnected from nina')
      })
      await setUpNinaWebSocketClient(ws, req)
      console.log('Connected from nina')
    },
  )

  httpServer.on('upgrade', (req, socket, head) => {
    const { pathname } = parse(req.url || '/')
    if (pathname === '/web') {
      webWsServer.handleUpgrade(req, socket, head, (ws) => {
        webWsServer.emit('connection', ws, req)
      })
    } else if (pathname === '/nina') {
      ninaWsServer.handleUpgrade(req, socket, head, (ws) => {
        ninaWsServer.emit('connection', ws, req)
      })
    } else {
      socket.destroy()
    }
  })
}

function setUpWebWebSocketClient(ws: WebWebSocketClient, req: IncomingMessage) {
  try {
    const searchParams = new URLSearchParams(req.url?.split('?')[1])
    const userId = searchParams.get('userId') || ''
    const deviceId = searchParams.get('deviceId') || ''
    if (!userId || !deviceId) {
      console.log('Invalid userId or deviceId')
      return ws.close()
    }
    ws.userId = userId
    ws.deviceId = deviceId
  } catch (error) {
    console.log(error)
    ws.close()
  }
}

async function setUpNinaWebSocketClient(
  ws: NinaWebSocketClient,
  req: IncomingMessage,
) {
  try {
    const searchParams = new URLSearchParams(req.url?.split('?')[1])
    const deviceId = searchParams.get('deviceId') || ''
    const name = searchParams.get('name') || ''
    const description = searchParams.get('description') || ''
    const driverInfo = searchParams.get('driverInfo') || ''
    const driverVersion = searchParams.get('driverVersion') || ''

    if (!deviceId) {
      console.log('Invalid deviceId')
      return ws.close()
    }
    await Device.findOneAndUpdate(
      { deviceId },
      { name, description, driverInfo, driverVersion },
      { upsert: true },
    )
    ws.deviceId = deviceId
  } catch (error) {
    console.log(error)
    ws.close()
  }
}

function broadcastToNinaByDeviceId(
  ws: WebWebSocketClient,
  ninaWsServer: Server,
  webMessage: IMessage,
) {
  ninaWsServer.clients.forEach((client) => {
    const ninaClient = client as NinaWebSocketClient
    if (
      ninaClient.deviceId === ws.deviceId &&
      ninaClient.readyState === WebSocket.OPEN
    ) {
      ninaClient.send(JSON.stringify(webMessage))
    }
  })
}
