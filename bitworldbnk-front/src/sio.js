import SocketIO from 'socket.io-client'

const sio = SocketIO({
  path: '/api/v1/socket',
  transports: ['websocket'],
})

export default sio
