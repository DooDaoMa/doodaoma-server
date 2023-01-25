import { Socket } from 'socket.io'
import { IS_DEBUG } from '../config/constant.config'
import { TypedServer } from '../types/socket.types'
import ninaHandler from './ninaHandler'
import webHandler from './webHandler'

export default {
  registerSocketHandler: (io: TypedServer) => {
    ninaHandler.register(io.of('/nina'))
    webHandler.register(io.of('/web'))
  },
}

export function emitDebug(socket: Socket, ...args: any[]) {
  if (IS_DEBUG) {
    socket.emit('debug', args)
  }
}

export function emitMessage(socket: Socket, ...args: any[]) {
  socket.emit('message', args)
}

export function emitError(socket: Socket, ...args: any[]) {
  socket.emit('error', args)
}
