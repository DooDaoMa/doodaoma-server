import { IncomingMessage, Server as HttpServer } from 'http'
import { parse } from 'url'
import { Server, WebSocket } from 'ws'
import { Device } from '../models/device'
import {
  NinaMessage,
  NinaWebSocketClient,
  WebMessage,
} from '../types/websocket.types'

export const setUpSocketHandler = (httpServer: HttpServer) => {
  const webWs = new Server({ noServer: true })
  const ninaWs = new Server({ noServer: true })

  webWs.on('connection', (ws) => {
    ws.on('message', (message: string, isBinary: boolean) => {
      const webMessage = JSON.parse(message) as WebMessage
      console.log(`received ${message} in web`)

      ninaWs.clients.forEach((client) => {
        const ninaClient = client as NinaWebSocketClient
        if (
          ninaClient.deviceId === webMessage.deviceId &&
          ninaClient.readyState === WebSocket.OPEN
        ) {
          ninaClient.send(message, { binary: isBinary })
        }
      })
    })
    console.log('Connected from web')
  })

  ninaWs.on(
    'connection',
    async (ws: NinaWebSocketClient, req: IncomingMessage) => {
      ws.on('message', (message: string) => {
        const ninaMessage = JSON.parse(message) as NinaMessage
        console.log(`received ${message} in nina`)
      })
      ws.on('close', () => {
        console.log('Disconnected from nina')
      })

      await upsertDevice(
        req,
        (deviceId) => {
          ws.deviceId = deviceId
          console.log('Connected from nina')
        },
        (error) => {
          console.log(error)
          ws.close()
        },
      )
    },
  )

  httpServer.on('upgrade', (req, socket, head) => {
    const { pathname } = parse(req.url || '/')
    if (pathname === '/web') {
      webWs.handleUpgrade(req, socket, head, (ws) => {
        webWs.emit('connection', ws, req)
      })
    } else if (pathname === '/nina') {
      ninaWs.handleUpgrade(req, socket, head, (ws) => {
        ninaWs.emit('connection', ws, req)
      })
    } else {
      socket.destroy()
    }
  })
}

async function upsertDevice(
  req: IncomingMessage,
  onSuccess: (deviceId: string) => void,
  onError: (error: Error) => void,
) {
  try {
    const searchParams = new URLSearchParams(req.url?.split('?')[1])
    const deviceId = searchParams.get('deviceId') || ''
    const name = searchParams.get('name') || ''
    const description = searchParams.get('description') || ''
    const driverInfo = searchParams.get('driverInfo') || ''
    const driverVersion = searchParams.get('driverVersion') || ''
    if (!deviceId) {
      return onError(new Error('Invalid deviceId'))
    }
    await Device.findOneAndUpdate(
      { deviceId },
      { name, description, driverInfo, driverVersion },
      { upsert: true },
    )
    onSuccess(deviceId)
  } catch (error) {
    onError(error as Error)
  }
}
