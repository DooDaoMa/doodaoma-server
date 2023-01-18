import { Namespace } from 'socket.io'
import { Device } from '../models/device'
import { IDevice } from '../types/device.types'
import { debugEmit } from './handler'

export default {
  register: (namespace: Namespace) => {
    namespace.use((socket, next) => {
      const { deviceId, name, description, driverInfo, driverVersion } =
        socket.handshake.query
      if (
        deviceId === undefined ||
        name === undefined ||
        description === undefined ||
        driverInfo === undefined ||
        driverVersion === undefined
      ) {
        return next(new Error('Not enough device information'))
      }
      const deviceInfo = {
        deviceId,
        name,
        description,
        driverInfo,
        driverVersion,
      } as IDevice
      socket.data.deviceInfo = deviceInfo
      next()
    })
    namespace.use(async (socket, next) => {
      try {
        const { deviceId, name, description, driverInfo, driverVersion } =
          socket.data.deviceInfo
        const device = await Device.findOne({ deviceId })
        if (device !== null) {
          debugEmit(socket, 'Already created device')
          next()
        } else {
          debugEmit(socket, 'Create new device')
          const device = new Device({
            deviceId,
            name,
            description,
            driverInfo,
            driverVersion,
          })
          await device.save()
          next()
        }
      } catch (error) {
        if (error instanceof Error) {
          return next(
            new Error(error.message || error.name || 'undefined error message'),
          )
        }
        next(new Error('Unknown error'))
      }
    })
    namespace.on('connection', (socket) => {
      namespace.on('disconnecting', () => {
        console.log('disconnecting')
      })
    })
  },
}
