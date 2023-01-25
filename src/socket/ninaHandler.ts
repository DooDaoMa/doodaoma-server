import { Namespace } from 'socket.io'
import { Device } from '../models/device'
import { IDevice } from '../types/device.types'
import { emitDebug, emitError, emitMessage } from './handler'

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
    namespace.on('connection', async (socket) => {
      const { deviceId, name, description, driverInfo, driverVersion } =
        socket.data.deviceInfo
      const device = await Device.findOne({ deviceId })
      if (device !== null) {
        device.name = name
        device.description = description
        device.driverInfo = driverInfo
        device.driverVersion = driverVersion
        device.isConnected = socket.connected
        await device.save()
        emitDebug(socket, 'Device already exists')
      } else {
        const newDevice = new Device({
          deviceId,
          name,
          description,
          driverInfo,
          driverVersion,
          isConnected: socket.connected,
        })
        await newDevice.save()
        emitDebug(socket, 'Create new device')
      }

      socket.on('disconnecting', async () => {
        try {
          const device = await Device.findOne({ deviceId })
          if (device !== null) {
            device.isConnected = socket.connected
            await device.save()
            return emitMessage(socket, 'Disconnect device successfully')
          }
          emitMessage(socket, 'Device not found')
        } catch (error) {
          emitError(socket, error)
        }
      })
    })
  },
}
