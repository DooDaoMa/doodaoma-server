import { IncomingMessage } from 'http'
import internal from 'stream'
import { Server } from 'ws'
import {
  NinaWebSocketClient,
  WebWebSocketClient,
} from '../../types/websocket.types'
import { findConnectedNinaClientByDeviceId } from '../../utils/findConnectedNinaClientByDeviceId'
import { Reservation } from '../../models/reservation'

const TEST_ACCOUNT_USER_ID = '643ed4833bc953022ae2a87a'

export async function upgradeWebPath(
  req: IncomingMessage,
  socket: internal.Duplex,
  head: Buffer,
  webWsServer: Server<WebWebSocketClient>,
  ninaWsServer: Server<NinaWebSocketClient>,
) {
  let deviceId: string
  let userId: string
  try {
    const searchParams = new URLSearchParams(req.url?.split('?')[1])
    userId = searchParams.get('userId') || ''
    deviceId = searchParams.get('deviceId') || ''
    if (!userId || !deviceId) {
      console.error('Invalid userId or deviceId')
      return socket.destroy()
    }

    const matchedNinaClient = findConnectedNinaClientByDeviceId(
      ninaWsServer,
      deviceId,
    )
    if (matchedNinaClient === undefined) {
      console.error('Not found matched nina socket connection of this deviceId')
      return socket.destroy()
    }

    if (userId !== TEST_ACCOUNT_USER_ID) {
      const now = new Date()
      const currentReservation = await Reservation.findOne({
        startTime: {
          $gte: now.getTime(),
        },
        endTime: {
          $lte: now.getTime(),
        },
      })
      if (currentReservation === null) {
        console.error('Not on reservation time')
        return socket.destroy()
      }
    }
  } catch (error) {
    console.error('Other error ' + error)
    return socket.destroy()
  }
  webWsServer.handleUpgrade(req, socket, head, (ws) => {
    ws.deviceId = deviceId
    ws.userId = userId
    webWsServer.emit('connection', ws, req)
  })
}
