import { IncomingMessage } from 'http'
import internal from 'stream'
import { Server } from 'ws'
import { NinaWebSocketClient } from '../../types/websocket.types'
import { Device } from '../../models/device'

export async function upgradeNinaPath(
  req: IncomingMessage,
  socket: internal.Duplex,
  head: Buffer,
  ninaWsServer: Server<NinaWebSocketClient>,
) {
  let deviceId: string
  try {
    const searchParams = new URLSearchParams(req.url?.split('?')[1])
    deviceId = searchParams.get('deviceId') || ''
    const name = searchParams.get('name') || ''
    const description = searchParams.get('description') || ''
    const driverInfo = searchParams.get('driverInfo') || ''
    const driverVersion = searchParams.get('driverVersion') || ''
    if (!deviceId) {
      console.log('Not found deviceId')
      return socket.destroy()
    }

    await Device.findOneAndUpdate(
      { deviceId },
      { name, description, driverInfo, driverVersion },
      { upsert: true },
    )
  } catch (error) {
    console.error('Upgrade nina failed: ' + error)
    socket.destroy()
  }
  ninaWsServer.handleUpgrade(req, socket, head, (ws) => {
    ws.deviceId = deviceId
    ninaWsServer.emit('connection', ws, req)
  })
}
