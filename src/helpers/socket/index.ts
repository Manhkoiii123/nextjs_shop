import { io } from 'socket.io-client'

const connectSocketIO = () => {
  const socket = io(process.env.NEXT_PUBLIC_API_HOST as string)
  //   const socket = io(process.env.NEXT_PUBLIC_API_HOST)

  return socket
}
export default connectSocketIO
