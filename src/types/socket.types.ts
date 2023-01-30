import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { IDevice } from './device.types'
import { IUser } from './user.types'

export type ClientType = 'nina' | 'web' | 'unknown'

// export interface ServerToClientEvents {}

export interface ClientToServerEvents {
  'nina:connect': (deviceInfo: IDevice) => void
}

export interface SocketData {
  clientType: ClientType
  deviceInfo?: IDevice
  userInfo?: IUser
}

export type TypedServer = Server<
  ClientToServerEvents,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>

export type TypedSocket = Socket<
  ClientToServerEvents,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>
