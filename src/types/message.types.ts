interface IMessage {
  type: string
  payload: {
    [any: string]: any
  }
}
