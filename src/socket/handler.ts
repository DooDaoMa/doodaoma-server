import { Server, Socket } from 'socket.io'
import { IS_DEBUG } from '../config/constant.config'
import ninaHandler from './ninaHandler'
import webHandler from './webHandler'

export default {
  registerSocketHandler: (io: Server) => {
    // ninaHandler.register(io.of('/nina'))
    // webHandler.register(io.of('/web'))
    io.on('connection', (socket) => {
      console.log('Connected', socket.handshake)
    })
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
