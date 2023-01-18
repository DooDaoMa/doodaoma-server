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

export function debugEmit(socket: Socket, ...args: any[]) {
  if (IS_DEBUG) {
    socket.emit('debug', args)
  }
}
