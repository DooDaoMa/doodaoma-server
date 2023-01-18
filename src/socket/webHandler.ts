import { JwtPayload, verify } from 'jsonwebtoken'
import { Namespace } from 'socket.io'
import { SECRET_KEY } from '../config/constant.config'
import { IUser } from '../types/user.types'

export default {
  register: (namespace: Namespace) => {
    namespace.use((socket, next) => {
      const token = socket.handshake.auth.token as string | undefined
      console.log(socket.handshake)
      if (token === undefined) {
        return next(new Error('Invalid access token'))
      }
      verify(token, SECRET_KEY, (error, payload) => {
        if (error !== null) {
          return next(new Error('Cannot verify access token'))
        }
        if (payload === undefined) {
          return next(new Error('undefined payload'))
        }
        socket.data.user = (payload as JwtPayload).data as IUser
        next()
      })
    })
    namespace.on('connection', (socket) => {
      namespace.on('disconnecting', () => {
        console.log('disconnecting')
      })
    })
  },
}
