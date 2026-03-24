import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  path: '/',
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  pingInterval: 25000,
})

// Train chat rooms
interface TrainChatUser {
  id: string
  socketId: string
  displayName: string
  trainId: string
}

interface TrainChatMessage {
  id: string
  trainId: string
  userId: string
  displayName: string
  message: string
  timestamp: Date
  type: 'user' | 'system'
}

// Store users by socket id
const users = new Map<string, TrainChatUser>()

// Store users by train room
const trainRooms = new Map<string, Set<string>>()

const generateMessageId = () => Math.random().toString(36).substr(2, 9)

const createSystemMessage = (trainId: string, content: string): TrainChatMessage => ({
  id: generateMessageId(),
  trainId,
  userId: 'system',
  displayName: 'System',
  content,
  timestamp: new Date(),
  type: 'system'
})

const createUserMessage = (trainId: string, userId: string, displayName: string, content: string): TrainChatMessage => ({
  id: generateMessageId(),
  trainId,
  userId,
  displayName,
  message: content,
  timestamp: new Date(),
  type: 'user'
})

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  // Join a train chat room
  socket.on('join-train-chat', (data: { trainId: string; userId: string; displayName: string }) => {
    const { trainId, userId, displayName } = data

    // Leave any existing rooms
    const existingUser = users.get(socket.id)
    if (existingUser) {
      const existingRoom = trainRooms.get(existingUser.trainId)
      if (existingRoom) {
        existingRoom.delete(socket.id)
        socket.leave(existingUser.trainId)
        
        // Notify others in the previous room
        const leaveMessage = createSystemMessage(existingUser.trainId, `${existingUser.displayName} left the chat`)
        io.to(existingUser.trainId).emit('chat-message', leaveMessage)
        io.to(existingUser.trainId).emit('user-left', { 
          userId: existingUser.id, 
          displayName: existingUser.displayName 
        })
      }
    }

    // Create user object
    const user: TrainChatUser = {
      id: userId,
      socketId: socket.id,
      displayName: displayName || 'Anonymous',
      trainId
    }

    // Add to users map
    users.set(socket.id, user)

    // Add to train room
    if (!trainRooms.has(trainId)) {
      trainRooms.set(trainId, new Set())
    }
    trainRooms.get(trainId)!.add(socket.id)

    // Join the socket.io room
    socket.join(trainId)

    // Send join notification to all users in the room
    const joinMessage = createSystemMessage(trainId, `${user.displayName} joined the chat`)
    io.to(trainId).emit('chat-message', joinMessage)
    io.to(trainId).emit('user-joined', { 
      userId: user.id, 
      displayName: user.displayName 
    })

    // Send current online users to the new user
    const roomUsers = Array.from(trainRooms.get(trainId) || [])
      .map(socketId => users.get(socketId))
      .filter((u): u is TrainChatUser => u !== undefined)
    
    socket.emit('users-list', { 
      trainId, 
      users: roomUsers.map(u => ({ id: u.id, displayName: u.displayName })),
      count: roomUsers.length
    })

    console.log(`${user.displayName} joined train chat ${trainId}, online users: ${roomUsers.length}`)
  })

  // Handle chat messages
  socket.on('send-message', (data: { trainId: string; message: string }) => {
    const user = users.get(socket.id)
    
    if (user && user.trainId === data.trainId) {
      const chatMessage = createUserMessage(
        data.trainId, 
        user.id, 
        user.displayName, 
        data.message
      )
      
      // Broadcast to all users in the train room
      io.to(data.trainId).emit('chat-message', chatMessage)
      
      console.log(`[${data.trainId}] ${user.displayName}: ${data.message}`)
    }
  })

  // Handle location updates
  socket.on('location-update', (data: { trainId: string; lat: number; lng: number }) => {
    const user = users.get(socket.id)
    
    if (user && user.trainId === data.trainId) {
      // Broadcast location update to all users in the train room
      io.to(data.trainId).emit('train-location-update', {
        trainId: data.trainId,
        lat: data.lat,
        lng: data.lng,
        timestamp: new Date().toISOString()
      })
    }
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = users.get(socket.id)
    
    if (user) {
      // Remove from users map
      users.delete(socket.id)
      
      // Remove from train room
      const room = trainRooms.get(user.trainId)
      if (room) {
        room.delete(socket.id)
        
        // Clean up empty rooms
        if (room.size === 0) {
          trainRooms.delete(user.trainId)
        }
      }
      
      // Notify others in the room
      const leaveMessage = createSystemMessage(user.trainId, `${user.displayName} left the chat`)
      io.to(user.trainId).emit('chat-message', leaveMessage)
      io.to(user.trainId).emit('user-left', { 
        userId: user.id, 
        displayName: user.displayName 
      })
      
      console.log(`${user.displayName} left train chat ${user.trainId}`)
    } else {
      console.log(`User disconnected: ${socket.id}`)
    }
  })

  // Handle errors
  socket.on('error', (error) => {
    console.error(`Socket error (${socket.id}):`, error)
  })
})

const PORT = 3003
httpServer.listen(PORT, () => {
  console.log(`RailBondhu WebSocket server running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, shutting down server...')
  httpServer.close(() => {
    console.log('WebSocket server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('Received SIGINT signal, shutting down server...')
  httpServer.close(() => {
    console.log('WebSocket server closed')
    process.exit(0)
  })
})

export { io }
