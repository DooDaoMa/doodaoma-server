import { WebSocket } from 'ws'

export interface NinaWebSocketClient extends WebSocket {
  deviceId: string
}

export interface WebWebSocketClient extends WebSocket {
  deviceId: string
  userId: string
}

export interface IMessage {
  type: string
  payload?: {
    [key: string]: any
  }
}
