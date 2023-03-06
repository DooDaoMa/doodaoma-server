import { WebSocket } from 'ws'

export interface NinaWebSocketClient extends WebSocket {
  deviceId: string
}

export interface IMessage {
  type: string
  payload: {
    [any: string]: any
  }
}

export interface WebMessage extends IMessage {
  deviceId: string
}

export type NinaMessage = IMessage
